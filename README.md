# 🎯 BidMaster

A modern, comprehensive project bidding management platform designed for freelancers to efficiently discover, track, and manage project opportunities across multiple platforms.

## ✨ Features

### Dual-View Architecture

**Simple View**: Clean, minimal interface for quick project browsing and basic management

- Essential project information at a glance
- Quick bid submission
- Basic filtering and search

**Enhanced View**: Advanced interface with comprehensive analytics and detailed management

- Interactive charts and visualizations
- Advanced filtering with multiple criteria
- Detailed project analytics and trend data
- Comprehensive bid tracking with status management

### Core Functionality

- 📋 **Project Management**: Track projects from discovery to completion
- 💰 **Bid Tracking**: Monitor all bid submissions with status updates
- 📊 **Analytics Dashboard**: Visual insights into bidding performance
- 🔍 **Smart Filtering**: Find relevant projects with advanced search
- 🌐 **Multi-Platform**: Support for multiple freelancing platforms
- 🎨 **Modern UI**: Clean, responsive design with dark/light themes

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel
- **Charts**: Recharts for data visualization

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/bidmaster.git
   cd bidmaster
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Set up the database**

   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Run the SQL commands from `database/schema.sql`

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```text
bidmaster/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── page.tsx           # Dashboard (tabbed interface)
│   │   ├── projects/          # Projects management
│   │   ├── bids/              # Bid tracking
│   │   ├── settings/          # User preferences
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── dashboard-metrics.tsx
│   │   ├── project-charts.tsx
│   │   ├── projects-table.tsx
│   │   └── ...
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── database/                  # Database schema and migrations
├── docs/                      # Documentation
├── public/                    # Static assets
└── tasks/                     # Task management (if applicable)
```

## 🎨 UI/UX Design Philosophy

### Dual-View Approach

- **Progressive Enhancement**: Start simple, enhance as needed
- **User Choice**: Let users pick their preferred complexity level
- **Consistent Navigation**: Unified tabbed interface across all pages
- **Performance**: Simple views load faster for quick tasks

### Design Principles

- **Clean & Modern**: Minimalist design with focus on functionality
- **Responsive**: Mobile-first approach with desktop enhancements
- **Accessible**: ARIA labels, keyboard navigation, and screen reader support
- **Consistent**: Unified color scheme and component patterns

## 🔧 Core Components

### Dashboard Components

- `DashboardStats`: Original simple stats cards
- `DashboardMetrics`: Enhanced metrics with trend indicators
- `ProjectCharts`: Interactive project data visualization

### Project Components

- `ProjectCard`: Individual project display card
- `ProjectsTable`: Advanced data table with sorting/filtering
- `ProjectCharts`: Platform distribution and trend charts

### UI Components

- All shadcn/ui components (Button, Card, Table, Tabs, etc.)
- Custom chart components for data visualization
- Responsive layout components

## 📊 Data Management

### API Integration

- RESTful API design with Next.js API routes
- Supabase integration for real-time data
- Type-safe API calls with custom hooks

### Database Schema

- **Projects**: Project listings from various platforms
- **Bids**: User bid submissions and tracking
- **User Preferences**: Customizable settings and filters
- **Sources**: Platform configurations and scraping settings

## 🚦 Development Workflow

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Key Development Notes

- **Type Safety**: Full TypeScript implementation with strict mode
- **Component Library**: Built on shadcn/ui for consistency
- **Performance**: Optimized with Next.js 15 and React 19
- **Clean Code**: ESLint and Prettier configuration

## 🎯 Feature Roadmap

### Completed ✅

- [x] Dual-view tabbed interface for all major pages
- [x] Advanced project filtering and search
- [x] Interactive dashboard with charts and metrics
- [x] Comprehensive bid tracking and management
- [x] Responsive design and mobile optimization
- [x] Type-safe API integration
- [x] Modern UI with shadcn/ui components

### In Progress 🔄

- [ ] User authentication and profiles
- [ ] Real-time notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-platform scraping automation

### Planned 📋

- [ ] Team collaboration features
- [ ] Advanced bid proposal templates
- [ ] Calendar integration for deadlines
- [ ] Export functionality for reports
- [ ] Dark mode theme support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons

---

Built with ❤️ for the freelance developer community
