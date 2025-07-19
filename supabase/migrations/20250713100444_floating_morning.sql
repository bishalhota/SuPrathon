/*
  # Carbon Savings Tracker System

  1. New Tables
    - `carbon_savings` - Track carbon savings from eco-friendly purchases
    - `global_impact_stats` - Store aggregated carbon savings data

  2. Features
    - Track individual customer carbon savings
    - Calculate global impact statistics
    - Store carbon savings per purchase
    - Track eco-friendly product purchases

  3. Carbon Savings Calculation
    - Based on carbon rating vs baseline (3.0 rating)
    - Higher rating = more carbon saved
    - Formula: (carbon_rating - 3.0) * product_weight * 0.1 * quantity
*/

-- Carbon savings tracking table
CREATE TABLE IF NOT EXISTS carbon_savings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  carbon_saved_grams decimal(10,2) NOT NULL DEFAULT 0,
  product_carbon_rating decimal(2,1) NOT NULL,
  baseline_rating decimal(2,1) DEFAULT 3.0,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Global impact statistics table
CREATE TABLE IF NOT EXISTS global_impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_carbon_saved_kg decimal(15,2) DEFAULT 0,
  total_eco_purchases integer DEFAULT 0,
  total_customers_helped integer DEFAULT 0,
  trees_equivalent integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

-- Add carbon_saved_grams to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'total_carbon_saved_grams'
  ) THEN
    ALTER TABLE users ADD COLUMN total_carbon_saved_grams decimal(15,2) DEFAULT 0;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE carbon_savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_impact_stats ENABLE ROW LEVEL SECURITY;

-- Policies for carbon_savings
CREATE POLICY "Users can read own carbon savings"
  ON carbon_savings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own carbon savings"
  ON carbon_savings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for global_impact_stats (public read)
CREATE POLICY "Global impact stats are viewable by everyone"
  ON global_impact_stats
  FOR SELECT
  TO public
  USING (true);

-- Insert initial global stats record
INSERT INTO global_impact_stats (
  total_carbon_saved_kg,
  total_eco_purchases,
  total_customers_helped,
  trees_equivalent
) VALUES (
  1247.5,  -- Starting with some demo data
  3420,
  892,
  62
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_carbon_savings_user_id ON carbon_savings(user_id);
CREATE INDEX IF NOT EXISTS idx_carbon_savings_order_id ON carbon_savings(order_id);
CREATE INDEX IF NOT EXISTS idx_carbon_savings_created_at ON carbon_savings(created_at);

-- Function to calculate carbon savings
CREATE OR REPLACE FUNCTION calculate_carbon_savings(
  p_carbon_rating decimal,
  p_weight_grams integer,
  p_quantity integer,
  p_baseline_rating decimal DEFAULT 3.0
) RETURNS decimal AS $$
BEGIN
  -- Only calculate savings if product is above baseline (eco-friendly)
  IF p_carbon_rating > p_baseline_rating THEN
    -- Formula: (rating_difference) * weight * 0.1 * quantity
    RETURN (p_carbon_rating - p_baseline_rating) * p_weight_grams * 0.1 * p_quantity;
  ELSE
    RETURN 0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to update global impact stats
CREATE OR REPLACE FUNCTION update_global_impact_stats() RETURNS void AS $$
DECLARE
  total_saved decimal;
  total_purchases integer;
  total_customers integer;
  trees_equiv integer;
BEGIN
  -- Calculate totals from carbon_savings table
  SELECT 
    COALESCE(SUM(carbon_saved_grams), 0) / 1000, -- Convert to kg
    COUNT(*),
    COUNT(DISTINCT user_id)
  INTO total_saved, total_purchases, total_customers
  FROM carbon_savings;
  
  -- Calculate trees equivalent (1 tree = ~20kg CO2 per year)
  trees_equiv := FLOOR(total_saved / 20);
  
  -- Update global stats
  UPDATE global_impact_stats 
  SET 
    total_carbon_saved_kg = total_saved,
    total_eco_purchases = total_purchases,
    total_customers_helped = total_customers,
    trees_equivalent = trees_equiv,
    last_updated = now()
  WHERE id = (SELECT id FROM global_impact_stats LIMIT 1);
END;
$$ LANGUAGE plpgsql;