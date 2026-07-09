-- Add image support to reviews table
-- Run this in Supabase SQL Editor after creating the reviews table

-- Add column for review images (JSON array of image URLs)
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]';

-- Create storage bucket for review images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-images', 'review-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to review images
CREATE POLICY "Public Access to Review Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'review-images');

-- Allow authenticated users to upload review images
CREATE POLICY "Authenticated Users Can Upload Review Images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'review-images' AND 
        auth.role() = 'authenticated'
    );

-- Allow users to delete their own review images
CREATE POLICY "Users Can Delete Own Review Images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'review-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );
