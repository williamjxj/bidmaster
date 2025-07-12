-- Enhanced database schema for web scraping functionality
-- Run this after the main schema.sql

-- Add scraping-specific columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS scraping_source VARCHAR(50),
ADD COLUMN IF NOT EXISTS external_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Create scraping_logs table to track scraping activities
CREATE TABLE IF NOT EXISTS scraping_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL,
    search_term VARCHAR(255),
    projects_found INTEGER DEFAULT 0,
    projects_saved INTEGER DEFAULT 0,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    execution_time_ms INTEGER,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Create scraping_queue table for managing scraping tasks
CREATE TABLE IF NOT EXISTS scraping_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50) NOT NULL,
    search_term VARCHAR(255) NOT NULL,
    max_results INTEGER DEFAULT 10,
    priority INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    scheduled_for TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_scraped_at ON projects(scraped_at);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_external_id ON projects(external_id);
CREATE INDEX IF NOT EXISTS idx_projects_scraping_source ON projects(scraping_source);

CREATE INDEX IF NOT EXISTS idx_scraping_logs_platform ON scraping_logs(platform);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_started_at ON scraping_logs(started_at);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_success ON scraping_logs(success);

CREATE INDEX IF NOT EXISTS idx_scraping_queue_status ON scraping_queue(status);
CREATE INDEX IF NOT EXISTS idx_scraping_queue_scheduled_for ON scraping_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scraping_queue_priority ON scraping_queue(priority);

-- Create function to log scraping activities
CREATE OR REPLACE FUNCTION log_scraping_activity(
    p_platform VARCHAR(50),
    p_search_term VARCHAR(255),
    p_projects_found INTEGER,
    p_projects_saved INTEGER,
    p_success BOOLEAN,
    p_error_message TEXT DEFAULT NULL,
    p_execution_time_ms INTEGER DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO scraping_logs (
        platform, search_term, projects_found, projects_saved, 
        success, error_message, execution_time_ms, completed_at
    ) VALUES (
        p_platform, p_search_term, p_projects_found, p_projects_saved,
        p_success, p_error_message, p_execution_time_ms, CURRENT_TIMESTAMP
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to clean up old projects
CREATE OR REPLACE FUNCTION cleanup_old_projects(days_old INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Mark old projects as inactive instead of deleting them
    UPDATE projects 
    SET is_active = false 
    WHERE scraped_at < CURRENT_TIMESTAMP - INTERVAL '1 day' * days_old
    AND is_active = true
    AND status = 'new';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to get scraping statistics
CREATE OR REPLACE FUNCTION get_scraping_stats(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    platform VARCHAR(50),
    total_runs INTEGER,
    successful_runs INTEGER,
    total_projects_found INTEGER,
    total_projects_saved INTEGER,
    avg_execution_time_ms NUMERIC,
    last_run TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sl.platform,
        COUNT(*)::INTEGER as total_runs,
        COUNT(CASE WHEN sl.success THEN 1 END)::INTEGER as successful_runs,
        COALESCE(SUM(sl.projects_found), 0)::INTEGER as total_projects_found,
        COALESCE(SUM(sl.projects_saved), 0)::INTEGER as total_projects_saved,
        ROUND(AVG(sl.execution_time_ms), 2) as avg_execution_time_ms,
        MAX(sl.started_at) as last_run
    FROM scraping_logs sl
    WHERE sl.started_at >= CURRENT_TIMESTAMP - INTERVAL '1 day' * days_back
    GROUP BY sl.platform
    ORDER BY sl.platform;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample scraping queue items for testing
INSERT INTO scraping_queue (platform, search_term, max_results, priority) VALUES
('upwork', 'react developer', 10, 1),
('freelancer', 'node.js', 10, 1),
('upwork', 'python developer', 10, 2),
('freelancer', 'full stack', 10, 2)
ON CONFLICT DO NOTHING;
