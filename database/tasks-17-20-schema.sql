-- Database schema for Tasks 17-20: Advanced Crawler Features
-- Supports error handling, scaling infrastructure, and testing validation

-- Test baselines table for regression testing
CREATE TABLE IF NOT EXISTS test_baselines (
    id SERIAL PRIMARY KEY,
    results JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scraping errors table (enhanced for error handling)
CREATE TABLE IF NOT EXISTS scraping_errors (
    id SERIAL PRIMARY KEY,
    error_id VARCHAR(255) UNIQUE NOT NULL,
    platform VARCHAR(100) NOT NULL,
    error_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'medium',
    message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB DEFAULT '{}',
    retry_count INTEGER DEFAULT 0,
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scraping_errors_platform ON scraping_errors(platform);
CREATE INDEX IF NOT EXISTS idx_scraping_errors_type ON scraping_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_scraping_errors_created_at ON scraping_errors(created_at);
CREATE INDEX IF NOT EXISTS idx_scraping_errors_resolved ON scraping_errors(resolved);

-- Scraping logs table for detailed monitoring
CREATE TABLE IF NOT EXISTS scraping_logs (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255),
    platform VARCHAR(100) NOT NULL,
    log_level VARCHAR(50) NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for scraping logs
CREATE INDEX IF NOT EXISTS idx_scraping_logs_platform ON scraping_logs(platform);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_level ON scraping_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_created_at ON scraping_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_session ON scraping_logs(session_id);

-- Queue jobs table for distributed processing
CREATE TABLE IF NOT EXISTS queue_jobs (
    id SERIAL PRIMARY KEY,
    job_id VARCHAR(255) UNIQUE NOT NULL,
    job_type VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    platform VARCHAR(100),
    search_term TEXT,
    max_results INTEGER,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    worker_id VARCHAR(255),
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for queue jobs
CREATE INDEX IF NOT EXISTS idx_queue_jobs_status ON queue_jobs(status);
CREATE INDEX IF NOT EXISTS idx_queue_jobs_priority ON queue_jobs(priority);
CREATE INDEX IF NOT EXISTS idx_queue_jobs_platform ON queue_jobs(platform);
CREATE INDEX IF NOT EXISTS idx_queue_jobs_worker ON queue_jobs(worker_id);
CREATE INDEX IF NOT EXISTS idx_queue_jobs_scheduled ON queue_jobs(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_queue_jobs_created_at ON queue_jobs(created_at);

-- Worker registry table for auto-scaling
CREATE TABLE IF NOT EXISTS worker_registry (
    id SERIAL PRIMARY KEY,
    worker_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    max_concurrent_jobs INTEGER DEFAULT 5,
    supported_platforms TEXT[] DEFAULT ARRAY['upwork', 'freelancer', 'indeed', 'linkedin'],
    capabilities TEXT[] DEFAULT ARRAY['scrape', 'health_check', 'recovery', 'cleanup'],
    last_heartbeat TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    stopped_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for worker registry
CREATE INDEX IF NOT EXISTS idx_worker_registry_status ON worker_registry(status);
CREATE INDEX IF NOT EXISTS idx_worker_registry_heartbeat ON worker_registry(last_heartbeat);

-- Performance metrics table for monitoring
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(100) NOT NULL,
    platform VARCHAR(100),
    worker_id VARCHAR(255),
    value NUMERIC NOT NULL,
    unit VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_platform ON performance_metrics(platform);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_recorded ON performance_metrics(recorded_at);

-- Data quality reports table
CREATE TABLE IF NOT EXISTS data_quality_reports (
    id SERIAL PRIMARY KEY,
    report_id VARCHAR(255) UNIQUE NOT NULL,
    overall_score NUMERIC(5,2) NOT NULL,
    validation_results JSONB NOT NULL,
    recommendations TEXT[],
    data_count INTEGER NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for data quality reports
CREATE INDEX IF NOT EXISTS idx_data_quality_reports_score ON data_quality_reports(overall_score);
CREATE INDEX IF NOT EXISTS idx_data_quality_reports_created_at ON data_quality_reports(created_at);

-- Health check results table
CREATE TABLE IF NOT EXISTS health_check_results (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    response_time INTEGER, -- in milliseconds
    error_count INTEGER DEFAULT 0,
    success_rate NUMERIC(5,2),
    details JSONB DEFAULT '{}',
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for health check results
CREATE INDEX IF NOT EXISTS idx_health_check_platform ON health_check_results(platform);
CREATE INDEX IF NOT EXISTS idx_health_check_status ON health_check_results(status);
CREATE INDEX IF NOT EXISTS idx_health_check_checked_at ON health_check_results(checked_at);

-- Rate limiting table for platform management
CREATE TABLE IF NOT EXISTS rate_limiting (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(100) NOT NULL,
    current_count INTEGER DEFAULT 0,
    limit_count INTEGER NOT NULL,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    window_duration_seconds INTEGER DEFAULT 3600, -- 1 hour default
    last_request TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(platform)
);

-- Create indexes for rate limiting
CREATE INDEX IF NOT EXISTS idx_rate_limiting_platform ON rate_limiting(platform);
CREATE INDEX IF NOT EXISTS idx_rate_limiting_window ON rate_limiting(window_start);

-- Create views for easier querying

-- Active queue summary view
CREATE OR REPLACE VIEW queue_summary AS
SELECT 
    status,
    priority,
    platform,
    COUNT(*) as job_count,
    AVG(EXTRACT(EPOCH FROM (COALESCE(completed_at, NOW()) - created_at))) as avg_duration_seconds
FROM queue_jobs
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY status, priority, platform;

-- Error summary view
CREATE OR REPLACE VIEW error_summary AS
SELECT 
    platform,
    error_type,
    severity,
    COUNT(*) as error_count,
    COUNT(*) FILTER (WHERE resolved = true) as resolved_count,
    MAX(created_at) as last_occurrence
FROM scraping_errors
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY platform, error_type, severity;

-- Worker performance view
CREATE OR REPLACE VIEW worker_performance AS
SELECT 
    worker_id,
    COUNT(*) as jobs_completed,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_job_time_seconds,
    COUNT(*) FILTER (WHERE status = 'completed') as successful_jobs,
    COUNT(*) FILTER (WHERE status = 'failed') as failed_jobs
FROM queue_jobs
WHERE completed_at IS NOT NULL 
    AND completed_at > NOW() - INTERVAL '24 hours'
GROUP BY worker_id;

-- Platform health summary view
CREATE OR REPLACE VIEW platform_health_summary AS
SELECT 
    platform,
    COUNT(*) as check_count,
    AVG(response_time) as avg_response_time,
    AVG(success_rate) as avg_success_rate,
    MAX(checked_at) as last_check,
    COUNT(*) FILTER (WHERE status = 'healthy') as healthy_checks
FROM health_check_results
WHERE checked_at > NOW() - INTERVAL '24 hours'
GROUP BY platform;

-- Ensure the enhanced scraped_projects table exists with new fields
DO $$
BEGIN
    -- Add new fields if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_projects' AND column_name = 'quality_score') THEN
        ALTER TABLE scraped_projects ADD COLUMN quality_score NUMERIC(3,2) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_projects' AND column_name = 'validation_status') THEN
        ALTER TABLE scraped_projects ADD COLUMN validation_status VARCHAR(50) DEFAULT 'pending';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_projects' AND column_name = 'deduplication_hash') THEN
        ALTER TABLE scraped_projects ADD COLUMN deduplication_hash VARCHAR(255) DEFAULT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scraped_projects' AND column_name = 'scraping_session_id') THEN
        ALTER TABLE scraped_projects ADD COLUMN scraping_session_id VARCHAR(255) DEFAULT NULL;
    END IF;
END
$$;

-- Create additional indexes for enhanced scraped_projects
CREATE INDEX IF NOT EXISTS idx_scraped_projects_quality_score ON scraped_projects(quality_score);
CREATE INDEX IF NOT EXISTS idx_scraped_projects_validation_status ON scraped_projects(validation_status);
CREATE INDEX IF NOT EXISTS idx_scraped_projects_deduplication_hash ON scraped_projects(deduplication_hash);
CREATE INDEX IF NOT EXISTS idx_scraped_projects_session_id ON scraped_projects(scraping_session_id);

-- Insert sample configuration data
INSERT INTO rate_limiting (platform, current_count, limit_count, window_duration_seconds) 
VALUES 
    ('upwork', 0, 100, 3600),
    ('freelancer', 0, 150, 3600),
    ('indeed', 0, 200, 3600),
    ('linkedin', 0, 50, 3600)
ON CONFLICT (platform) DO NOTHING;

-- Create functions for cleanup and maintenance

-- Function to clean old queue jobs
CREATE OR REPLACE FUNCTION cleanup_old_queue_jobs(retention_hours INTEGER DEFAULT 168) -- 7 days default
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM queue_jobs 
    WHERE (status IN ('completed', 'failed')) 
        AND completed_at < NOW() - (retention_hours || ' hours')::INTERVAL;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    INSERT INTO scraping_logs (platform, log_level, message, metadata)
    VALUES ('system', 'info', 'Cleaned up old queue jobs', 
            jsonb_build_object('deleted_count', deleted_count, 'retention_hours', retention_hours));
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to update platform health
CREATE OR REPLACE FUNCTION update_platform_health(
    p_platform VARCHAR(100),
    p_status VARCHAR(50),
    p_response_time INTEGER DEFAULT NULL,
    p_error_count INTEGER DEFAULT 0,
    p_success_rate NUMERIC(5,2) DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO health_check_results (platform, status, response_time, error_count, success_rate)
    VALUES (p_platform, p_status, p_response_time, p_error_count, p_success_rate);
    
    -- Log the health check
    INSERT INTO scraping_logs (platform, log_level, message, metadata)
    VALUES (p_platform, 'info', 'Health check completed',
            jsonb_build_object(
                'status', p_status,
                'response_time', p_response_time,
                'error_count', p_error_count,
                'success_rate', p_success_rate
            ));
END;
$$ LANGUAGE plpgsql;

-- Function to calculate data quality score
CREATE OR REPLACE FUNCTION calculate_quality_score(
    p_title TEXT,
    p_description TEXT,
    p_url TEXT,
    p_posted_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
) RETURNS NUMERIC(3,2) AS $$
DECLARE
    score NUMERIC(3,2) := 0;
BEGIN
    -- Title quality (25 points)
    IF p_title IS NOT NULL AND LENGTH(p_title) BETWEEN 10 AND 200 THEN
        score := score + 25;
    ELSIF p_title IS NOT NULL AND LENGTH(p_title) > 5 THEN
        score := score + 15;
    END IF;
    
    -- Description quality (35 points)
    IF p_description IS NOT NULL AND LENGTH(p_description) BETWEEN 50 AND 2000 THEN
        score := score + 35;
    ELSIF p_description IS NOT NULL AND LENGTH(p_description) > 20 THEN
        score := score + 20;
    END IF;
    
    -- URL validity (20 points)
    IF p_url IS NOT NULL AND (p_url LIKE 'http://%' OR p_url LIKE 'https://%') THEN
        score := score + 20;
    END IF;
    
    -- Date recency (20 points)
    IF p_posted_date IS NOT NULL THEN
        IF p_posted_date > NOW() - INTERVAL '7 days' THEN
            score := score + 20;
        ELSIF p_posted_date > NOW() - INTERVAL '30 days' THEN
            score := score + 15;
        ELSIF p_posted_date > NOW() - INTERVAL '90 days' THEN
            score := score + 10;
        END IF;
    END IF;
    
    RETURN LEAST(score / 100.0, 1.0);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate quality scores
CREATE OR REPLACE FUNCTION update_quality_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.quality_score := calculate_quality_score(NEW.title, NEW.description, NEW.url, NEW.posted_date);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_quality_score
    BEFORE INSERT OR UPDATE ON scraped_projects
    FOR EACH ROW
    EXECUTE FUNCTION update_quality_score();

COMMENT ON TABLE test_baselines IS 'Stores test result baselines for regression testing';
COMMENT ON TABLE scraping_errors IS 'Enhanced error tracking with classification and recovery status';
COMMENT ON TABLE scraping_logs IS 'Detailed logging for monitoring and debugging';
COMMENT ON TABLE queue_jobs IS 'Distributed job queue for scalable processing';
COMMENT ON TABLE worker_registry IS 'Registry of active workers for auto-scaling';
COMMENT ON TABLE performance_metrics IS 'Performance monitoring and analytics';
COMMENT ON TABLE data_quality_reports IS 'Data quality validation reports';
COMMENT ON TABLE health_check_results IS 'Platform health monitoring results';
COMMENT ON TABLE rate_limiting IS 'Rate limiting configuration per platform';
