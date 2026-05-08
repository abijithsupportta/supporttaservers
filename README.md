# Subscription Management Platform

A full-stack subscription management platform built with Next.js, Supabase, and Razorpay.

## 🏗️ Project Structure

This is a monorepo managed with Turborepo containing:

```
.
├── apps/
│   ├── user/          # Customer-facing application (Port 3000)
│   └── admin/         # Admin dashboard (Port 3001)
├── packages/
│   ├── database/      # Supabase types and schemas
│   ├── supabase/      # Supabase client utilities
│   ├── razorpay/      # Razorpay integration
│   ├── ui/            # Shared UI components
│   ├── validations/   # Zod schemas
│   └── utils/         # Shared utilities
└── turbo.json         # Turborepo configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 11+
- Supabase account
- Razorpay account

### Installation

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd <project-name>
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    Copy `.env.local.example` to both apps:

    ```bash
    cp .env.local.example apps/user/.env.local
    cp .env.local.example apps/admin/.env.local
    ```

    Then edit each file with your credentials:
    - `apps/user/.env.local` - Set `NEXT_PUBLIC_APP_URL=http://localhost:3000`
    - `apps/admin/.env.local` - Set `NEXT_PUBLIC_APP_URL=http://localhost:3001`

4. **Run development servers**

    ```bash
    npm run dev
    ```

    This starts both apps:
    - User app: http://localhost:3000
    - Admin app: http://localhost:3001

## 📦 Available Scripts

```bash
npm run dev          # Start all apps in development mode
npm run build        # Build all apps for production
npm run lint         # Lint all apps
npm run format       # Format code with Prettier
npm run check-types  # Type check all apps
```

## 🌐 Deployment

### Vercel (Recommended)

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

**Quick Summary:**

1. Create two separate Vercel projects (one for user app, one for admin app)
2. Set root directory to `apps/user` or `apps/admin`
3. Configure build commands and environment variables
4. Deploy!

### Other Platforms

The apps can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Run database migrations (if you have them)
3. Get your API keys from Settings → API
4. Add redirect URLs in Authentication → URL Configuration

### Razorpay Setup

1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from Settings → API Keys
3. Set up webhooks pointing to `/api/razorpay/webhook`
4. Configure webhook events (subscription._, payment._, order.\*)

## 📱 Apps Overview

### User App (`apps/user`)

Customer-facing application with:

- User authentication (Supabase Auth)
- Subscription management
- Payment processing (Razorpay)
- Order history
- Profile management

**Routes:**

- `/` - Home page
- `/login` - User login
- `/dashboard` - User dashboard
- `/orders` - Order history
- `/payments` - Payment history
- `/plans` - Available subscription plans
- `/profile` - User profile

### Admin App (`apps/admin`)

Admin dashboard with:

- User management
- Order tracking
- Payment monitoring
- Subscription management
- Plan configuration

**Routes:**

- `/dashboard` - Overview with stats
- `/dashboard/users` - User directory
- `/dashboard/orders` - All orders
- `/dashboard/payments` - All payments
- `/dashboard/subscriptions` - All subscriptions
- `/dashboard/plans` - Manage subscription plans

## 🎨 Tech Stack

### Frontend

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **UI Components:** Custom components with Radix UI primitives

### Backend

- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Razorpay
- **API:** Next.js API Routes

### DevOps

- **Monorepo:** Turborepo
- **Package Manager:** npm workspaces
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions (optional)

## 🔐 Environment Variables

Required environment variables for both apps:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
NEXT_PUBLIC_NEXT_PUBLIC_RAZORPAY_KEY_ID

# App Configuration
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SITE_URL

# Optional
RESEND_API_KEY
DATABASE_URL
DIRECT_URL
```

## 🧪 Testing

```bash
# Run tests (if configured)
npm run test

# Type checking
npm run check-types

# Linting
npm run lint
```

## 📚 Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Razorpay Documentation](https://razorpay.com/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

[Your License Here]

## 🆘 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Contact the development team

## 🎉 Acknowledgments

Built with:

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Razorpay](https://razorpay.com)
- [Turborepo](https://turbo.build)
- [Tailwind CSS](https://tailwindcss.com)
