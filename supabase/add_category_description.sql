-- Add description field to categories table (used on collection pages & SEO intro)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS description TEXT;
