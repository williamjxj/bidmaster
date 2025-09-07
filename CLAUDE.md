# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
# Development
npm run dev                      # Start development server on port 3000
npm run dev:turbopack           # Start with Turbopack for faster builds

# Building & Production
npm run build                   # Build for production
npm run start                   # Start production server
npm run lint                    # ESLint code validation
npm run type-check              # TypeScript type validation

# Testing & Quality Assurance
npm run scrape:validate         # Run complete validation suite
npm run test:crawlers           # Basic crawler infrastructure tests
npm run test:crawlers:full      # Full crawler test suite (alternative)
npm run test:crawlers:advanced  # Comprehensive crawler test suite
npm run benchmark:crawlers      # Performance benchmarking
```

### Scraping & API Testing
```bash
# API Testing
npm run scrape:test             # Test scraping with sample data
npm run scrape:stats            # Get scraping statistics
npm run scrape:cleanup          # Cleanup old scraped data (dry run)

# Database & Demo
npm run db:reset                # Reset database (run SQL from database/schema.sql in Supabase)
npm run create-demo             # Create demo account for testing
```

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript with strict type checking
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with middleware-based protection
- **Styling**: TailwindCSS 4 with shadcn/ui components
- **State Management**: TanStack React Query for server state
- **UI Components**: Radix UI primitives with custom shadcn/ui styling

### Key Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── scrape/        # Web scraping endpoints
│   │   ├── projects/      # Project management
│   │   └── bids/          # Bid tracking
│   ├── auth/              # Authentication pages
│   └── (protected)/       # Protected dashboard pages
├── components/            # React components
│   ├── ui/                # shadcn/ui base components
│   └── (feature-specific)  # Dashboard, scraping, tables
├── lib/                   # Core utilities and services
│   ├── scraper.ts         # Multi-platform web scraping
│   ├── supabase.ts        # Database client utilities
│   └── enhanced-scraper.ts # Advanced scraping features
├── utils/supabase/        # Supabase client configurations
└── hooks/                 # Custom React hooks
```

### Web Scraping System
The application features a sophisticated web scraping system for freelance platforms:

**Core Scraping Architecture**:
- `src/lib/scraper.ts` - Base scraping functionality with platform configurations
- `src/lib/enhanced-scraper.ts` - Advanced features with error handling and mock data
- `src/lib/crawler-*.ts` - Specialized crawler components (queue, workers, error handling)

**Platform Support**:
- Upwork and Freelancer configurations with CSS selectors
- Extensible config system for adding new platforms
- Rate limiting and respectful scraping practices
- Mock data fallbacks for development

**API Endpoints**:
- `/api/scrape` - Main scraping endpoint
- `/api/scrape/stats` - Performance metrics
- `/api/scrape/cleanup` - Data maintenance
- `/api/scrape/multi-platform` - Concurrent platform scraping

### Authentication & Routing
- **Middleware**: `middleware.ts` handles auth protection and redirects
- **Protected Routes**: `/dashboard`, `/projects`, `/bids`, `/analytics`, `/calendar`, `/settings`, `/profile`
- **Auth Pages**: `/auth/login`, `/auth/signup`, `/auth/forgot-password`
- **Supabase Integration**: Server-side and client-side auth with proper SSR support

### Database Integration
- **Client Types**: Separate server (`@/utils/supabase/server`) and client (`@/utils/supabase/client`) instances
- **Legacy Support**: `src/lib/supabase.ts` provides backward compatibility
- **Type Safety**: TypeScript interfaces for database schemas

### UI System
- **Component Library**: shadcn/ui with Radix UI primitives
- **Styling**: TailwindCSS with custom design tokens and animations
- **Layout**: Unified sidebar layout with responsive design
- **Theme**: Support for light/dark modes via CSS variables

## Development Guidelines

### Code Patterns
- Use server components by default, client components only when needed
- Import Supabase clients appropriately: server client in server components, client in browser contexts
- Follow the established component structure in `src/components/ui/`
- Use TanStack Query for server state management
- Implement proper error boundaries and loading states

### Database Patterns
- Always use Row Level Security policies
- Prefer server-side database operations
- Use TypeScript interfaces for type safety
- Handle authentication state properly in middleware

### Scraping Development
- Test scrapers with `npm run test:crawlers:advanced` before deploying
- Use mock data during development to avoid hitting external APIs
- Implement proper rate limiting and error recovery
- Follow existing platform configuration patterns

### Testing Requirements
- Run `npm run scrape:validate` for complete validation
- Use `npm run type-check` to validate TypeScript
- Test API endpoints with provided curl commands
- Validate crawler performance with benchmarking tools