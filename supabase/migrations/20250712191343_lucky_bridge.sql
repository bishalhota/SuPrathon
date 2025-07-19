
-- Add weight and co2_emission columns to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'weight_grams'
  ) THEN
    ALTER TABLE products ADD COLUMN weight_grams integer DEFAULT 100;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'co2_emission_grams'
  ) THEN
    ALTER TABLE products ADD COLUMN co2_emission_grams decimal(8,2) DEFAULT 100.00;
  END IF;
END $$;

-- Add carbon_credits to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'carbon_credits'
  ) THEN
    ALTER TABLE users ADD COLUMN carbon_credits integer DEFAULT 0;
  END IF;
END $$;

-- Create carbon_credits table for tracking credit transactions
CREATE TABLE IF NOT EXISTS carbon_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id),
  credits_earned integer NOT NULL,
  offset_amount decimal(10,2) NOT NULL,
  transaction_type text DEFAULT 'earned' CHECK (transaction_type IN ('earned', 'spent', 'redeemed')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on carbon_credits
ALTER TABLE carbon_credits ENABLE ROW LEVEL SECURITY;

-- Policies for carbon_credits
CREATE POLICY "Users can read own carbon credits"
  ON carbon_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own carbon credits"
  ON carbon_credits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Update existing products with realistic weights and calculated CO2 emissions
-- Formula: (weight_in_grams / 100) * (500km / 1000) * 20 = (weight_in_grams / 100) * 0.5 * 20 = weight_in_grams * 0.1

-- Electronics (heavier items)
UPDATE products SET 
  weight_grams = 250,
  co2_emission_grams = 25.0
WHERE category = 'Electronics' AND name LIKE '%Power Bank%';

UPDATE products SET 
  weight_grams = 80,
  co2_emission_grams = 8.0
WHERE category = 'Electronics' AND name LIKE '%LED%Bulb%';

UPDATE products SET 
  weight_grams = 150,
  co2_emission_grams = 15.0
WHERE category = 'Electronics' AND name LIKE '%Wireless%';

UPDATE products SET 
  weight_grams = 300,
  co2_emission_grams = 30.0
WHERE category = 'Electronics' AND name LIKE '%Speaker%';

UPDATE products SET 
  weight_grams = 120,
  co2_emission_grams = 12.0
WHERE category = 'Electronics' AND name LIKE '%Charger%';

-- Clothing (light to medium weight)
UPDATE products SET 
  weight_grams = 180,
  co2_emission_grams = 18.0
WHERE category = 'Clothing' AND name LIKE '%T-Shirt%';

UPDATE products SET 
  weight_grams = 600,
  co2_emission_grams = 60.0
WHERE category = 'Clothing' AND name LIKE '%Jacket%';

UPDATE products SET 
  weight_grams = 500,
  co2_emission_grams = 50.0
WHERE category = 'Clothing' AND name LIKE '%Jeans%';

UPDATE products SET 
  weight_grams = 50,
  co2_emission_grams = 5.0
WHERE category = 'Clothing' AND name LIKE '%Socks%';

-- Beauty (light items)
UPDATE products SET 
  weight_grams = 200,
  co2_emission_grams = 20.0
WHERE category = 'Beauty' AND name LIKE '%Skincare%';

UPDATE products SET 
  weight_grams = 25,
  co2_emission_grams = 2.5
WHERE category = 'Beauty' AND name LIKE '%Toothbrush%';

UPDATE products SET 
  weight_grams = 100,
  co2_emission_grams = 10.0
WHERE category = 'Beauty' AND name LIKE '%Shampoo%';

-- Kitchen (medium to heavy)
UPDATE products SET 
  weight_grams = 400,
  co2_emission_grams = 40.0
WHERE category = 'Kitchen' AND name LIKE '%Container%';

UPDATE products SET 
  weight_grams = 150,
  co2_emission_grams = 15.0
WHERE category = 'Kitchen' AND name LIKE '%Water Bottle%';

UPDATE products SET 
  weight_grams = 80,
  co2_emission_grams = 8.0
WHERE category = 'Kitchen' AND name LIKE '%Straw%';

-- Office (light to medium)
UPDATE products SET 
  weight_grams = 200,
  co2_emission_grams = 20.0
WHERE category = 'Office' AND name LIKE '%Notebook%';

UPDATE products SET 
  weight_grams = 300,
  co2_emission_grams = 30.0
WHERE category = 'Office' AND name LIKE '%Organizer%';

-- Home & Garden (varies widely)
UPDATE products SET 
  weight_grams = 150,
  co2_emission_grams = 15.0
WHERE category = 'Home & Garden' AND name LIKE '%Water Bottle%';

UPDATE products SET 
  weight_grams = 2000,
  co2_emission_grams = 200.0
WHERE category = 'Home & Garden' AND name LIKE '%Compost%';

-- Transportation (very heavy)
UPDATE products SET 
  weight_grams = 25000,
  co2_emission_grams = 2500.0
WHERE category = 'Transportation' AND name LIKE '%Electric Bike%';

UPDATE products SET 
  weight_grams = 12000,
  co2_emission_grams = 1200.0
WHERE category = 'Transportation' AND name LIKE '%Electric Scooter%';

-- Sports & Outdoors (medium weight)
UPDATE products SET 
  weight_grams = 800,
  co2_emission_grams = 80.0
WHERE category = 'Sports & Outdoors' AND name LIKE '%Yoga Mat%';

UPDATE products SET 
  weight_grams = 200,
  co2_emission_grams = 20.0
WHERE category = 'Sports & Outdoors' AND name LIKE '%Towel%';

-- Set default values for any products that don't have specific weights
UPDATE products SET 
  weight_grams = 150,
  co2_emission_grams = 15.0
WHERE weight_grams IS NULL OR weight_grams = 100;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_carbon_credits_user_id ON carbon_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_carbon_credits_order_id ON carbon_credits(order_id);