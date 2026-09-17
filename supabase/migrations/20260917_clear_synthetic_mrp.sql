-- One-shot: clear synthetic compare-at (MRP) prices from autofill (~33–40% OFF).
-- Keeps modest real sales (e.g. ~10–15% off).
-- Run in Supabase SQL editor if you prefer not to use Admin → Clear fake MRPs.

UPDATE products
SET original_price = NULL
WHERE original_price IS NOT NULL
  AND price IS NOT NULL
  AND original_price > price
  AND ROUND(((original_price - price) / original_price) * 100) BETWEEN 28 AND 42;
