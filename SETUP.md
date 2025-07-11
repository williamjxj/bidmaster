# 🚀 BidMaster Quick Setup Guide

## Step 1: Environment Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd bidmaster
   npm install
   ```

2. **Set up Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Copy your project URL and anon key

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

## Step 2: Database Setup

1. **Go to your Supabase dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the contents of `database/schema.sql`**
4. **Run the SQL commands**

This will create all the necessary tables:
- `projects` - Store project information
- `bids` - Track your applications
- `sources` - Manage platform configurations
- `user_preferences` - Store user settings

## Step 3: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 4: Explore the Features

### Dashboard (/)
- View statistics about your bidding activities
- See recent projects and activity
- Quick actions for common tasks

### Projects (/projects)
- Browse all available projects
- Filter by technology, budget, category
- Bookmark interesting projects
- Apply to projects directly

### Bids (/bids)
- Track all your applications
- Monitor bid status changes
- Edit proposals and notes
- View performance analytics

### Settings (/settings)
- Configure your technology preferences
- Set budget ranges
- Manage platform sources
- Control notification settings

## 🎯 Next Steps

1. **Set up your preferences** in the Settings page
2. **Browse projects** that match your skills
3. **Start tracking your bids** and applications
4. **Customize the platform sources** for your needs

## 🔧 Development Notes

- The app currently uses mock data for demonstration
- Real web scraping would require additional setup and compliance with platform terms
- User authentication can be added using Supabase Auth
- The database schema is designed to scale with additional features

## 🆘 Troubleshooting

### Common Issues:

1. **"Missing environment variables" error**
   - Check that your `.env.local` file exists
   - Verify all required environment variables are set

2. **Database connection issues**
   - Ensure your Supabase project is active
   - Check that the database schema has been created
   - Verify your database credentials

3. **Build/TypeScript errors**
   - Run `npm run type-check` to identify issues
   - Check for missing dependencies: `npm install`

### Getting Help:

- Check the main README.md for detailed information
- Review the project documentation in `/docs`
- Check the database schema in `/database/schema.sql`

---

**Happy bidding!** 🎯
