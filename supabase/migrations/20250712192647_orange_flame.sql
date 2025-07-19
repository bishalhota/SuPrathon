
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