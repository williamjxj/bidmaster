-- BidMaster Database Schema
-- This file contains the SQL commands to create the database tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    budget DECIMAL(10,2),
    budget_type VARCHAR(10) CHECK (budget_type IN ('fixed', 'hourly')),
    source_platform VARCHAR(50) NOT NULL,
    source_url TEXT NOT NULL UNIQUE,
    technologies TEXT[],
    category VARCHAR(100),
    location VARCHAR(100),
    posted_date TIMESTAMP NOT NULL,
    deadline TIMESTAMP,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'bookmarked', 'applied', 'in_progress', 'won', 'lost', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- This will reference auth.users when Supabase auth is set up
    bid_amount DECIMAL(10,2),
    proposal TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'accepted', 'rejected')),
    submitted_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sources table
CREATE TABLE IF NOT EXISTS sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_scraped TIMESTAMP,
    scraping_config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE, -- This will reference auth.users when Supabase auth is set up
    target_technologies TEXT[],
    target_categories TEXT[],
    min_budget DECIMAL(10,2),
    max_budget DECIMAL(10,2),
    preferred_platforms TEXT[],
    notification_settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_source_platform ON projects(source_platform);
CREATE INDEX IF NOT EXISTS idx_projects_posted_date ON projects(posted_date);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_technologies ON projects USING GIN(technologies);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

CREATE INDEX IF NOT EXISTS idx_bids_project_id ON bids(project_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);

CREATE INDEX IF NOT EXISTS idx_sources_is_active ON sources(is_active);
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Create triggers to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for sources
INSERT INTO sources (name, url, is_active, scraping_config) VALUES
('Upwork', 'https://www.upwork.com', true, '{"search_url": "https://www.upwork.com/nx/search/jobs", "selectors": {"title": "[data-test=\"job-title\"]", "description": "[data-test=\"job-description\"]"}}'),
('Freelancer', 'https://www.freelancer.com', true, '{"search_url": "https://www.freelancer.com/search/projects", "selectors": {"title": ".JobSearchCard-primary-heading", "description": ".JobSearchCard-primary-description"}}'),
('Toptal', 'https://www.toptal.com', false, '{"search_url": "https://www.toptal.com/freelance-jobs", "selectors": {"title": ".job-title", "description": ".job-description"}}')
ON CONFLICT DO NOTHING;

-- Insert sample projects (for development)
INSERT INTO projects (title, description, budget, budget_type, source_platform, source_url, technologies, category, location, posted_date, deadline, status) VALUES
('React E-commerce Website Development', 'Looking for an experienced React developer to build a modern e-commerce platform with Next.js, TypeScript, and Tailwind CSS. The project includes user authentication, payment integration, and admin dashboard.', 2500.00, 'fixed', 'Upwork', 'https://upwork.com/job/sample-1', ARRAY['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'], 'Web Development', 'Remote', '2024-01-15 10:00:00', '2024-02-15 10:00:00', 'new'),
('AI Image Generation Tool', 'Need a skilled developer to create an AI-powered image generation tool using OpenAI API. Must have experience with Python, Flask, and machine learning.', 75.00, 'hourly', 'Freelancer', 'https://freelancer.com/job/sample-2', ARRAY['Python', 'Flask', 'OpenAI API', 'Machine Learning'], 'AI Development', 'Remote', '2024-01-14 14:30:00', NULL, 'bookmarked'),
('Node.js API Development', 'Building a RESTful API with Node.js, Express, and MongoDB. Need someone with experience in authentication, database design, and API documentation.', 1800.00, 'fixed', 'Toptal', 'https://toptal.com/job/sample-3', ARRAY['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger'], 'Backend Development', 'US Only', '2024-01-13 09:15:00', '2024-02-10 09:15:00', 'applied')
ON CONFLICT (source_url) DO NOTHING;
