-- Create reviews table for product reviews
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL, -- Store name for display even if user deleted
    user_email TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one review per user per product
    UNIQUE(product_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews(product_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_is_approved_idx ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON reviews(created_at DESC);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies:
-- 1. Anyone can read approved reviews
CREATE POLICY "Anyone can view approved reviews"
    ON reviews FOR SELECT
    USING (is_approved = true);

-- 2. Authenticated users can insert their own reviews
CREATE POLICY "Authenticated users can insert reviews"
    ON reviews FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        NOT EXISTS (
            SELECT 1 FROM reviews 
            WHERE product_id = reviews.product_id 
            AND user_id = auth.uid()
        )
    );

-- 3. Users can update their own reviews (before approval)
CREATE POLICY "Users can update own reviews"
    ON reviews FOR UPDATE
    USING (
        auth.uid() = user_id AND 
        is_approved = false
    );

-- 4. Service role can do everything (for admin operations)
CREATE POLICY "Service role can manage reviews"
    ON reviews FOR ALL
    USING (auth.role() = 'service_role');

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
DROP TRIGGER IF EXISTS reviews_updated_at ON reviews;
CREATE TRIGGER reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_reviews_updated_at();

-- Function to calculate average rating for a product
CREATE OR REPLACE FUNCTION get_product_avg_rating(product_uuid UUID)
RETURNS TABLE (
    avg_rating DECIMAL(3,2),
    total_reviews BIGINT,
    rating_1_count BIGINT,
    rating_2_count BIGINT,
    rating_3_count BIGINT,
    rating_4_count BIGINT,
    rating_5_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(AVG(rating), 0) as avg_rating,
        COUNT(*) as total_reviews,
        COUNT(*) FILTER (WHERE rating = 1) as rating_1_count,
        COUNT(*) FILTER (WHERE rating = 2) as rating_2_count,
        COUNT(*) FILTER (WHERE rating = 3) as rating_3_count,
        COUNT(*) FILTER (WHERE rating = 4) as rating_4_count,
        COUNT(*) FILTER (WHERE rating = 5) as rating_5_count
    FROM reviews
    WHERE product_id = product_uuid AND is_approved = true;
END;
$$ LANGUAGE plpgsql;
