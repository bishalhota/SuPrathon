/*
  # Complete E-commerce Database Schema

  1. New Tables
    - `products` - Product catalog with carbon ratings
    - `users` - User accounts with EcoCoins
    - `cart_items` - Shopping cart functionality
    - `orders` - Order management
    - `order_items` - Individual items in orders
    - `carbon_offsets` - Track carbon offset contributions
    - `categories` - Product categories

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public read access for products and categories
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  image_url text,
  category_id uuid REFERENCES categories(id),
  category text NOT NULL,
  carbon_rating decimal(2,1) NOT NULL CHECK (carbon_rating >= 0 AND carbon_rating <= 5),
  stock_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  full_name text,
  eco_coins integer DEFAULT 0,
  total_spent decimal(10,2) DEFAULT 0,
  total_carbon_offset decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  total_amount decimal(10,2) NOT NULL,
  eco_coins_earned integer DEFAULT 0,
  carbon_offset_tip decimal(10,2) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity integer NOT NULL,
  price_at_time decimal(10,2) NOT NULL,
  carbon_rating_at_time decimal(2,1) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Carbon offsets table
CREATE TABLE IF NOT EXISTS carbon_offsets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  order_id uuid REFERENCES orders(id),
  amount decimal(10,2) NOT NULL,
  offset_type text DEFAULT 'tip',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_offsets ENABLE ROW LEVEL SECURITY;

-- Policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Policies for products (public read)
CREATE POLICY "Products are viewable by everyone"
  ON products
  FOR SELECT
  TO public
  USING (is_active = true);

-- Policies for users
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for cart_items
CREATE POLICY "Users can manage own cart"
  ON cart_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for orders
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for order_items
CREATE POLICY "Users can read own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Policies for carbon_offsets
CREATE POLICY "Users can read own carbon offsets"
  ON carbon_offsets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own carbon offsets"
  ON carbon_offsets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample categories
INSERT INTO categories (name, description, image_url) VALUES
('Clothing', 'Sustainable and eco-friendly clothing', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'),
('Electronics', 'Energy-efficient electronic devices', 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg'),
('Home & Garden', 'Eco-friendly home and garden products', 'https://images.pexels.com/photos/4210614/pexels-photo-4210614.jpeg'),
('Beauty', 'Natural and organic beauty products', 'https://images.pexels.com/photos/6621447/pexels-photo-6621447.jpeg'),
('Kitchen', 'Sustainable kitchen and dining products', 'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg'),
('Office', 'Eco-friendly office supplies', 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg'),
('Transportation', 'Sustainable transportation solutions', 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg'),
('Sports & Outdoors', 'Eco-friendly sports and outdoor gear', 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg');

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, carbon_rating, stock_quantity) VALUES
-- Clothing
('Organic Cotton T-Shirt', 'Soft, comfortable organic cotton t-shirt made from sustainable materials', 29.99, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', 'Clothing', 4.5, 25),
('Recycled Polyester Jacket', 'Warm jacket made from 100% recycled plastic bottles', 89.99, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', 'Clothing', 4.2, 15),
('Hemp Jeans', 'Durable jeans made from sustainable hemp fiber', 79.99, 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg', 'Clothing', 4.7, 20),
('Bamboo Socks Set', 'Ultra-soft bamboo fiber socks, pack of 5', 24.99, 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg', 'Clothing', 4.8, 50),

-- Electronics
('Solar Power Bank', 'Portable solar power bank for sustainable energy on the go', 49.99, 'https://images.pexels.com/photos/4164772/pexels-photo-4164772.jpeg', 'Electronics', 4.2, 15),
('LED Smart Bulb', 'Energy-efficient LED smart bulb with app control', 24.99, 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg', 'Electronics', 3.9, 40),
('Energy Monitor', 'Smart home energy monitoring system', 129.99, 'https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg', 'Electronics', 4.1, 12),
('Wireless Charging Pad', 'Eco-friendly bamboo wireless charging station', 39.99, 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg', 'Electronics', 3.8, 30),

-- Home & Garden
('Bamboo Water Bottle', 'Eco-friendly bamboo water bottle with leak-proof design', 19.99, 'https://images.pexels.com/photos/4210614/pexels-photo-4210614.jpeg', 'Home & Garden', 5.0, 50),
('Compost Bin', 'Indoor compost bin for kitchen scraps', 45.99, 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg', 'Home & Garden', 4.9, 25),
('Solar Garden Lights', 'Set of 6 solar-powered garden lights', 34.99, 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg', 'Home & Garden', 4.6, 35),
('Organic Plant Fertilizer', 'Natural plant fertilizer made from organic materials', 16.99, 'https://images.pexels.com/photos/4503270/pexels-photo-4503270.jpeg', 'Home & Garden', 4.8, 60),

-- Beauty
('Organic Skincare Set', 'Natural skincare products with organic ingredients', 89.99, 'https://images.pexels.com/photos/6621447/pexels-photo-6621447.jpeg', 'Beauty', 4.7, 30),
('Bamboo Toothbrush Set', 'Biodegradable bamboo toothbrushes, pack of 4', 12.99, 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg', 'Beauty', 4.9, 75),
('Natural Shampoo Bar', 'Zero-waste shampoo bar with organic ingredients', 18.99, 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg', 'Beauty', 4.6, 45),
('Reusable Makeup Remover Pads', 'Washable bamboo makeup remover pads, set of 10', 15.99, 'https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg', 'Beauty', 4.8, 55),

-- Kitchen
('Reusable Food Containers', 'Set of glass food containers with airtight lids', 34.99, 'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg', 'Kitchen', 4.3, 60),
('Stainless Steel Straws', 'Reusable stainless steel straws with cleaning brush', 14.99, 'https://images.pexels.com/photos/6621451/pexels-photo-6621451.jpeg', 'Kitchen', 4.5, 80),
('Beeswax Food Wraps', 'Natural beeswax wraps for food storage, set of 3', 22.99, 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg', 'Kitchen', 4.7, 40),
('Compostable Plates Set', 'Biodegradable plates made from palm leaves', 19.99, 'https://images.pexels.com/photos/4113885/pexels-photo-4113885.jpeg', 'Kitchen', 4.4, 35),

-- Office
('Recycled Notebook', 'High-quality notebook made from 100% recycled paper', 12.99, 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg', 'Office', 4.8, 75),
('Bamboo Desk Organizer', 'Sustainable bamboo desk organizer with multiple compartments', 28.99, 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg', 'Office', 4.6, 25),
('Refillable Pens Set', 'Eco-friendly refillable pens made from recycled materials', 16.99, 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg', 'Office', 4.2, 50),
('Solar Calculator', 'Solar-powered calculator with recycled plastic casing', 21.99, 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg', 'Office', 4.0, 30),

-- Transportation
('Electric Bike', 'Eco-friendly electric bike for sustainable transportation', 1299.99, 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg', 'Transportation', 4.6, 8),
('Electric Scooter', 'Portable electric scooter for urban commuting', 399.99, 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg', 'Transportation', 4.3, 12),
('Bike Repair Kit', 'Complete bike maintenance kit with eco-friendly tools', 45.99, 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg', 'Transportation', 4.1, 20),
('Solar Bike Light', 'Solar-powered LED bike light for safe night riding', 29.99, 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg', 'Transportation', 4.4, 35),

-- Sports & Outdoors
('Recycled Yoga Mat', 'Yoga mat made from recycled rubber and cork', 59.99, 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg', 'Sports & Outdoors', 4.5, 25),
('Bamboo Water Bottle', 'Insulated bamboo water bottle for outdoor activities', 32.99, 'https://images.pexels.com/photos/4210614/pexels-photo-4210614.jpeg', 'Sports & Outdoors', 4.7, 40),
('Solar Camping Lantern', 'Portable solar camping lantern with USB charging', 38.99, 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg', 'Sports & Outdoors', 4.3, 30),
('Organic Cotton Gym Towel', 'Quick-dry gym towel made from organic cotton', 18.99, 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg', 'Sports & Outdoors', 4.6, 45);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_carbon_rating ON products(carbon_rating);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);