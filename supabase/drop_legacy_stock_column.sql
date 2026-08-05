-- Sync legacy stock into stock_count, then remove unused stock column
UPDATE products
SET stock_count = stock
WHERE stock_count IS NULL AND stock IS NOT NULL;

ALTER TABLE products DROP COLUMN IF EXISTS stock;
