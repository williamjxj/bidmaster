# 🎯 BidMaster: Your Ultimate Project Bidding Hub

production URL: https://bidmaster-hub.vercel.app/

Tired of juggling multiple freelance platforms, missing out on opportunities, and struggling to track your bids? **BidMaster** is here to change that. We provide a centralized platform to discover, manage, and win more projects, effortlessly.

## ✨ Key Features

*   **Discover Opportunities:** We aggregate freelance projects from top platforms like Upwork, Freelancer, and more, so you can find the best projects in one place.
*   **Intelligent Filtering:** Zero in on the perfect projects with powerful, easy-to-use filters for technology, budget, and more.
*   **Effortless Bid Management:** Track your bids from start to finish. Know the status of every application, from "To Bid" to "Won."
*   **Powerful Analytics:** Gain insights into your bidding strategy. Understand your win/loss rate, identify your most successful platforms, and optimize your approach for better results.
*   **Modern, User-Friendly Interface:** A clean, intuitive, and responsive design that works beautifully on any device.

## 👤 Who is BidMaster For?

*   **Freelance Developers & Agencies:** Spend less time searching and more time bidding on high-quality projects.
*   **Project Managers:** Keep all your bids organized and your team on the same page.
*   **Business Development Professionals:** Supercharge your lead generation and close more deals.

## 🚀 Get Started in Minutes

1.  **Sign Up:** Create your free BidMaster account.
2.  **Set Your Preferences:** Tell us what kinds of projects you're looking for.
3.  **Discover & Bid:** Start exploring opportunities and winning new business!

Ready to take your freelancing career to the next level?

[**Visit BidMaster Today!**](https://bidmaster-hub.vercel.app/)

---

## 🛠️ Developer Documentation

### Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd bidmaster

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

### Project Analysis & Cleanup

The project includes analysis scripts to audit codebase structure, dependencies, and unused files:

```bash
# Run full project analysis (structure, dependencies, unused files, recommendations)
npm run analyze:project

# Review generated reports in docs/analysis/
# - structure-summary.md
# - dependency-report.md
# - unused-files-report.md
# - improvement-recommendations.md

# Preview cleanup operations (dry-run, safe)
npm run cleanup:dry-run

# Execute cleanup (after reviewing dry-run results)
npm run cleanup:execute
```

**Analysis Features:**
- Project structure analysis (directory hierarchy, architectural patterns)
- Dependency audit (outdated packages, security issues, deprecated packages)
- Unused file detection (backup files, empty directories, unreferenced code)
- Improvement recommendations (performance, security, code quality, architecture)

**Expected Duration:** <5 minutes for full analysis

For detailed usage, see `specs/001-project-analysis/quickstart.md`

# Open http://localhost:3000
```

### 🧪 Testing & Quality Assurance

#### Crawler Testing Suite

**Basic Validation:**
```bash
npm run test:crawlers          # Quick infrastructure checks
```

**Advanced Testing:**
```bash
npm run test:crawlers:advanced # Comprehensive test suite
```

**Performance Benchmarking:**
```bash
npm run benchmark:crawlers     # Performance analysis
```

**Full Validation:**
```bash
npm run scrape:validate        # Run all tests
```

#### Test Results Overview
- ✅ **Infrastructure**: File existence, module exports, API routes
- ✅ **Configuration**: Platform configs, selectors, rate limiting  
- ✅ **Data Validation**: Interface completeness, mock data, saving logic
- ✅ **API Endpoints**: Route accessibility, request handling
- ✅ **Performance**: Optimization features, concurrent operations
- ✅ **Security**: Environment setup, anti-bot measures, input validation
- ✅ **Integration**: Database connectivity, frontend integration

### 🚀 Production Scripts

```bash
npm run build                  # Build for production
npm run start                  # Start production server
npm run lint                   # Code linting
npm run type-check            # TypeScript validation
```

### 📊 Web Scraping Features

#### Platform Support
- **Upwork**: Job discovery and project scraping
- **Freelancer**: Project listings and bid tracking
- **Extensible**: Easy to add new platforms

#### Scraping Capabilities
- **Real-time Project Discovery**: Automated job searching
- **Mock Data Fallback**: Reliable development experience
- **Rate Limiting**: Respectful scraping practices
- **Error Handling**: Robust error recovery
- **Performance Monitoring**: Built-in benchmarking

#### API Endpoints
```bash
# Test scraping functionality
curl -X POST http://localhost:3000/api/scrape \
  -H 'Content-Type: application/json' \
  -d '{"searchTerm":"react developer","maxResults":3}'

# Get scraping statistics
curl http://localhost:3000/api/scrape/stats

# Cleanup old data
curl -X POST http://localhost:3000/api/scrape/cleanup \
  -H 'Content-Type: application/json' \
  -d '{"dryRun":true}'
```

### 🏗️ Architecture & Technology Stack

#### Frontend
- **Next.js 15.3.5**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **React Query**: State management and data fetching

#### Backend & Database
- **Supabase**: PostgreSQL database and authentication
- **Prisma**: Database ORM (optional integration)
- **Row Level Security**: Data protection

#### Web Scraping
- **Puppeteer**: Headless browser automation
- **Rate Limiting**: Respectful scraping practices
- **Mock Data**: Development-friendly fallbacks
- **Performance Monitoring**: Built-in analytics

#### Testing & Quality
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Custom Test Suite**: Crawler validation framework
- **Performance Benchmarking**: Automated performance analysis

### 📁 Project Structure

```
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── api/             # API routes
│   │   │   ├── scrape/      # Scraping endpoints
│   │   │   ├── projects/    # Project management
│   │   │   └── bids/        # Bid tracking
│   │   ├── auth/            # Authentication pages
│   │   ├── projects/        # Project discovery
│   │   ├── bids/            # Bid management
│   │   ├── analytics/       # Performance analytics
│   │   └── settings/        # User preferences
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility libraries
│   │   ├── scraper.ts       # Web scraping logic
│   │   ├── supabase.ts      # Database client
│   │   └── api.ts           # API utilities
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript definitions
├── database/                # Database schemas
├── scripts/                 # Development and test scripts
├── docs/                    # Documentation
└── tasks/                   # Project task tracking
```

### 🔧 Configuration

#### Environment Variables
```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional for development
DATABASE_URL=your_database_url
```

#### Scraping Configuration
- Platform-specific selectors in `src/lib/scraper.ts`
- Rate limiting settings
- Mock data toggle for development
- Performance monitoring settings

### 📚 Documentation

- 📖 **[User Guide](USER_GUIDE.md)**: Step-by-step user documentation
- 🧪 **[Crawler Enhancement Summary](CRAWLER_ENHANCEMENT_SUMMARY.md)**: Technical implementation details
- 📋 **[Task Tracking](tasks/tasks.json)**: Development progress and roadmap

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Run tests: `npm run scrape:validate`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### 🆘 Support

- 📧 **Email**: support@bidmaster.com
- 🐛 **Issues**: GitHub Issues
- 💬 **Discussions**: GitHub Discussions

---

**Built with ❤️ for the freelance community**