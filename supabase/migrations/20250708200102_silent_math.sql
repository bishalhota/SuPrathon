/*
  # Add Low Carbon Rating Products

  1. New Products
    - Add products with carbon ratings below 4.0 across different categories
    - Include variety of price points and categories
    - Ensure realistic product descriptions and pricing

  2. Categories Covered
    - Electronics with lower efficiency
    - Beauty products with conventional ingredients  
    - Kitchen items with less sustainable materials
    - Clothing with conventional production
    - Office supplies with standard materials
*/

-- Insert low carbon rating products
INSERT INTO products (name, description, price, image_url, category, carbon_rating, stock_quantity) VALUES

-- Electronics (Lower efficiency)
('Standard LED Bulb', 'Basic LED bulb with standard energy efficiency', 12.99, 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=500', 'Electronics', 3.2, 60),
('Wireless Mouse', 'Standard wireless mouse with basic battery life', 25.99, 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=500', 'Electronics', 3.5, 45),
('Bluetooth Speaker', 'Portable speaker with standard materials and packaging', 79.99, 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500', 'Electronics', 3.7, 25),
('Phone Charger', 'Standard phone charger with conventional efficiency', 19.99, 'https://images.pexels.com/photos/4526414/pexels-photo-4526414.jpeg?auto=compress&cs=tinysrgb&w=500', 'Electronics', 3.4, 80),
('Desk Lamp', 'Basic desk lamp with standard bulb and materials', 34.99, 'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg?auto=compress&cs=tinysrgb&w=500', 'Electronics', 3.6, 35),

-- Beauty (Conventional ingredients)
('Standard Face Cream', 'Moisturizing face cream with conventional ingredients', 24.99, 'https://images.pexels.com/photos/6621447/pexels-photo-6621447.jpeg?auto=compress&cs=tinysrgb&w=500', 'Beauty', 3.1, 50),
('Regular Shampoo', 'Daily use shampoo with standard formula', 15.99, 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=500', 'Beauty', 3.3, 65),
('Makeup Foundation', 'Long-lasting foundation with conventional packaging', 32.99, 'https://images.pexels.com/photos/6621337/pexels-photo-6621337.jpeg?auto=compress&cs=tinysrgb&w=500', 'Beauty', 3.4, 40),
('Body Lotion', 'Moisturizing body lotion with standard ingredients', 18.99, 'https://images.pexels.com/photos/6621447/pexels-photo-6621447.jpeg?auto=compress&cs=tinysrgb&w=500', 'Beauty', 3.2, 55),
('Hair Conditioner', 'Smoothing conditioner with conventional formula', 16.99, 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=500', 'Beauty', 3.5, 45),

-- Kitchen (Less sustainable materials)
('Plastic Food Storage', 'Set of plastic food containers with standard lids', 19.99, 'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg?auto=compress&cs=tinysrgb&w=500', 'Kitchen', 3.0, 70),
('Standard Coffee Mug', 'Ceramic coffee mug with conventional production', 8.99, 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=500', 'Kitchen', 3.3, 90),
('Plastic Water Bottle', 'Reusable plastic water bottle with standard materials', 12.99, 'https://images.pexels.com/photos/4210614/pexels-photo-4210614.jpeg?auto=compress&cs=tinysrgb&w=500', 'Kitchen', 2.8, 85),
('Non-stick Pan', 'Standard non-stick frying pan with conventional coating', 45.99, 'https://images.pexels.com/photos/4113892/pexels-photo-4113892.jpeg?auto=compress&cs=tinysrgb&w=500', 'Kitchen', 3.4, 30),
('Plastic Cutting Board', 'Durable plastic cutting board with standard materials', 14.99, 'https://images.pexels.com/photos/4113885/pexels-photo-4113885.jpeg?auto=compress&cs=tinysrgb&w=500', 'Kitchen', 3.1, 60),

-- Clothing (Conventional production)
('Standard Cotton Shirt', 'Basic cotton t-shirt with conventional production', 19.99, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500', 'Clothing', 3.2, 75),
('Polyester Jacket', 'Lightweight jacket made from standard polyester', 59.99, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500', 'Clothing', 2.9, 40),
('Regular Jeans', 'Classic denim jeans with conventional production', 49.99, 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=500', 'Clothing', 3.3, 55),
('Cotton Socks', 'Pack of 3 cotton socks with standard manufacturing', 12.99, 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=500', 'Clothing', 3.4, 80),
('Basic Hoodie', 'Comfortable hoodie with conventional cotton blend', 39.99, 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=500', 'Clothing', 3.1, 45),

-- Office (Standard materials)
('Standard Notebook', 'Regular notebook with conventional paper', 6.99, 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=500', 'Office', 3.5, 100),
('Plastic Pen Set', 'Set of 5 ballpoint pens with plastic construction', 9.99, 'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=500', 'Office', 3.2, 120),
('Standard Stapler', 'Metal stapler with conventional manufacturing', 15.99, 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=500', 'Office', 3.4, 65),
('Plastic Desk Organizer', 'Desktop organizer made from standard plastic', 18.99, 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=500', 'Office', 3.0, 50),
('Regular Calculator', 'Basic calculator with standard battery and materials', 12.99, 'https://images.pexels.com/photos/6238297/pexels-photo-6238297.jpeg?auto=compress&cs=tinysrgb&w=500', 'Office', 3.3, 75),

-- Home & Garden (Lower sustainability)
('Plastic Plant Pot', 'Standard plastic plant pot with drainage holes', 8.99, 'https://images.pexels.com/photos/4503270/pexels-photo-4503270.jpeg?auto=compress&cs=tinysrgb&w=500', 'Home & Garden', 2.9, 90),
('Standard Garden Hose', 'Rubber garden hose with conventional materials', 29.99, 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=500', 'Home & Garden', 3.2, 35),
('Plastic Watering Can', 'Lightweight watering can made from standard plastic', 16.99, 'https://images.pexels.com/photos/4503273/pexels-photo-4503273.jpeg?auto=compress&cs=tinysrgb&w=500', 'Home & Garden', 3.1, 55),
('Standard Fertilizer', 'Chemical fertilizer with conventional ingredients', 22.99, 'https://images.pexels.com/photos/4503270/pexels-photo-4503270.jpeg?auto=compress&cs=tinysrgb&w=500', 'Home & Garden', 3.4, 40),
('Plastic Storage Box', 'Clear storage container with standard plastic construction', 24.99, 'https://images.pexels.com/photos/4210614/pexels-photo-4210614.jpeg?auto=compress&cs=tinysrgb&w=500', 'Home & Garden', 3.0, 65),

-- Transportation (Lower efficiency)
('Standard Bike Lock', 'Basic bike lock with conventional materials', 22.99, 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=500', 'Transportation', 3.3, 45),
('Car Phone Mount', 'Standard phone mount for vehicles', 18.99, 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=500', 'Transportation', 3.1, 60),
('Basic Bike Helmet', 'Standard safety helmet with conventional materials', 34.99, 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=500', 'Transportation', 3.4, 30),

-- Sports & Outdoors (Standard materials)
('Standard Yoga Mat', 'Basic yoga mat with conventional foam', 24.99, 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=500', 'Sports & Outdoors', 3.2, 50),
('Plastic Water Bottle', 'Sports water bottle with standard plastic', 14.99, 'https://images.pexels.com/photos/4210614/pexels-photo-4210614.jpeg?auto=compress&cs=tinysrgb&w=500', 'Sports & Outdoors', 2.8, 70),
('Standard Gym Towel', 'Cotton gym towel with conventional production', 12.99, 'https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=500', 'Sports & Outdoors', 3.3, 65),
('Basic Camping Chair', 'Folding camping chair with standard materials', 39.99, 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=500', 'Sports & Outdoors', 3.1, 25);