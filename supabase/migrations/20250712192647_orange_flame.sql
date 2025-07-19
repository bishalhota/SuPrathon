/*
  # Remove EcoCoins and Implement Carbon Credits Only System

  1. Changes
    - Remove eco_coins column from users table
    - Update carbon credits system to be the primary reward
    - Carbon credits earned based on carbon offsetting contributions only
    - 10 credits per 100 Rs spent on offsetting

  2. Carbon Rating Color System
    - Red: < 3.0 (Heavy emphasis on offsetting)
    - Yellow: 3.0 - 3.9 (Moderate emphasis)
    - Green: 4.0+ (Light suggestion)
*/

-- Remove eco_coins column from users table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'eco_coins'
  ) THEN
    ALTER TABLE users DROP COLUMN eco_coins;
  END IF;
END $$;

-- Remove eco_coins_earned column from orders table if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'eco_coins_earned'
  ) THEN
    ALTER TABLE orders DROP COLUMN eco_coins_earned;
  END IF;
END $$;