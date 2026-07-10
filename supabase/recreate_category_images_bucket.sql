-- Recreate category-images bucket with proper configuration
-- Run this in Supabase SQL Editor

-- Delete existing bucket (if exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Remove any existing policies
DROP POLICY IF EXISTS "Public Access to Category Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload category images" ON storage.objects;

-- Create policy for public read access
CREATE POLICY "Public Access to Category Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category-images');

-- Create policy for public upload
CREATE POLICY "Allow public upload category images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'category-images'
);

-- Create policy for public update (if needed)
CREATE POLICY "Allow public update category images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'category-images')
WITH CHECK (bucket_id = 'category-images');

-- Create policy for public delete (if needed)
CREATE POLICY "Allow public delete category images"
ON storage.objects FOR DELETE
USING (bucket_id = 'category-images');
