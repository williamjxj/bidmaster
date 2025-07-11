# 🎯 BidMaster - Freelance Project Management Platform

BidMaster is a comprehensive web platform that enables developers, agencies, and freelancers to **discover**, **manage**, and **track** software outsourcing opportunities across multiple platforms.

## ✨ Features

- **🔍 Project Discovery**: Centralized dashboard to browse projects from multiple platforms
- **📊 Analytics Dashboard**: Track your bidding performance and win rates
- **🎯 Smart Filtering**: Filter projects by technology, budget, category, and more
- **📝 Bid Management**: Track all your applications and their status
- **⚙️ Customizable Preferences**: Set your target technologies and project types
- **🔄 Real-time Updates**: Stay updated with the latest project opportunities
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL (via Supabase)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

```
bidmaster/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── bids/           # Bid management page
│   │   ├── projects/       # Project discovery page
│   │   ├── settings/       # User preferences page
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Dashboard page
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── dashboard.tsx   # Dashboard components
│   │   ├── navigation.tsx  # Navigation bar
│   │   └── project-card.tsx # Project card component
│   ├── lib/               # Utility functions
│   │   ├── scraper.ts     # Web scraping utilities
│   │   ├── supabase.ts    # Supabase client
│   │   └── utils.ts       # General utilities
│   └── types/             # TypeScript type definitions
│       └── database.ts    # Database types
├── database/              # Database schema and migrations
│   └── schema.sql        # Database schema
├── docs/                 # Project documentation
│   └── bidding_platform_plan.md # Original project plan
└── public/               # Static assets
```

## 🎨 Key Components

### Dashboard
- **Statistics Cards**: Overview of your bidding activities
- **Recent Projects**: Latest opportunities matching your preferences
- **Recent Activity**: Timeline of your actions
- **Quick Actions**: Common tasks and shortcuts

### Project Discovery
- **Advanced Search**: Filter by technology, budget, category, and status
- **Project Cards**: Detailed view of each opportunity
- **Bulk Actions**: Bookmark or apply to multiple projects
- **Real-time Updates**: New projects appear automatically

### Bid Management
- **Application Tracking**: Monitor all your bids and their status
- **Proposal Management**: Store and reuse proposal templates
- **Performance Analytics**: Track win rates and success metrics
- **Notes & Reminders**: Keep track of important details

### Settings
- **Technology Preferences**: Set your target tech stack
- **Budget Filters**: Define your preferred project budget range
- **Platform Integration**: Configure which platforms to monitor
- **Notification Settings**: Control how you receive updates

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_KEY` | Your Supabase service role key | Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL | Yes |

### Database Setup

The application uses Supabase PostgreSQL with the following main tables:

- **projects**: Stores project information from various platforms
- **bids**: Tracks your applications and their status
- **sources**: Manages platform configurations
- **user_preferences**: Stores user settings and preferences

## 🚀 Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect to Vercel**
3. **Set environment variables in Vercel dashboard**
4. **Deploy automatically**

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- [x] Basic project discovery and filtering
- [x] Bid tracking and management
- [x] User preferences and settings
- [x] Dashboard with analytics
- [x] Responsive design

### Phase 2: Enhanced Features
- [ ] Real web scraping implementation
- [ ] User authentication with Supabase Auth
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Proposal templates and auto-fill

### Phase 3: Advanced Capabilities
- [ ] AI-powered project matching
- [ ] Automated bidding workflows
- [ ] Team collaboration features
- [ ] API for third-party integrations
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for icons
- [Radix UI](https://www.radix-ui.com/) for accessible components

---

**Happy bidding!** 🎯
