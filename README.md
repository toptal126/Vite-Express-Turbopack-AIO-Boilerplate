# MERN-Turbopack-AIO-Boilerplate

## Project Structure

This project follows the recommended monorepo structure using Turborepo:

```
mern-turbopack-aio-boilerplate/
├── apps/
│   ├── client/        # React + TypeScript + Vite frontend
│   └── server/        # Express + TypeScript + MongoDB backend
├── packages/
│   ├── types/         # Shared TypeScript type definitions
│   ├── utils/         # Shared utility functions
│   └── ui/            # Shared UI components (future)
├── turbo.json         # Turborepo configuration
├── package.json       # Root package.json with workspace configuration
└── pnpm-workspace.yaml # pnpm workspace configuration
```

## Monorepo Advantages

This Turborepo structure provides several key benefits:

- **Code Sharing**: Easily share TypeScript types, utility functions, and UI components between client and server
- **Atomic Commits**: Changes to frontend and backend can be committed in a single transaction
- **Simplified Deployment**: Build and deploy both applications together with a single command
- **Centralized Configuration**: ESLint, TypeScript, and other tools configured for the entire repository
- **Optimized Builds**: Turborepo's intelligent caching and parallel execution for faster builds
- **Dependency Management**: Shared dependencies managed efficiently across all packages

## Technologies Used

### Frontend

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Zustand** - State management
- **React Query** - API data fetching
- **Axios** - HTTP client

### Backend

- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Quick Start

### Prerequisites

- Node.js 18+ - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- pnpm 8+ - `npm install -g pnpm`
- MongoDB
- Turborepo (installed automatically via pnpm)

### Local Development

1. **Clone the repository**

   ```sh
   git clone <YOUR_GIT_URL>
   cd mern-turbopack-aio-boilerplate
   ```

2. **Install dependencies**

   ```sh
   pnpm install
   ```

3. **Set up environment variables**

   ```sh
   # Copy server environment template
   cp apps/server/env.example apps/server/.env

   # Edit apps/server/.env with your configuration
   ```

4. **Start MongoDB**

   ```sh
   # Install and start MongoDB locally
   # Then update apps/server/.env with: MONGODB_URI=mongodb://localhost:27017/mern_turbopack_aio
   ```

5. **Start development servers**

   ```sh
   # Start all apps and packages in development mode
   pnpm dev

   # Or start individual apps:
   pnpm --filter @mern-turbopack-aio/client dev  # Client on http://localhost:4444
   pnpm --filter @mern-turbopack-aio/server dev  # Server on http://localhost:4443
   ```

## Available Scripts

### Root Level (Turborepo)

- `pnpm dev` - Start all apps and packages in development mode
- `pnpm build` - Build all apps and packages for production
- `pnpm lint` - Lint all apps and packages
- `pnpm test` - Run tests for all apps and packages
- `pnpm clean` - Clean all build artifacts
- `pnpm format` - Format all code with Prettier
- `pnpm type-check` - Run TypeScript type checking

### Individual Apps

- `pnpm --filter @mern-turbopack-aio/client dev` - Start client development server
- `pnpm --filter @mern-turbopack-aio/client build` - Build client for production
- `pnpm --filter @mern-turbopack-aio/client preview` - Start client production server
- `pnpm --filter @mern-turbopack-aio/server dev` - Start server development server
- `pnpm --filter @mern-turbopack-aio/server build` - Build server for production
- `pnpm --filter @mern-turbopack-aio/server start` - Start server production server

### Shared Packages

- `pnpm --filter @mern-turbopack-aio/types build` - Build shared types package
- `pnpm --filter @mern-turbopack-aio/utils build` - Build shared utils package
- `pnpm --filter @mern-turbopack-aio/ui build` - Build shared UI package

## API Endpoints

### Health Check

- `GET /api/health` - Server health status

<!-- External integration endpoints intentionally omitted in boilerplate -->

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=4443
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mern_turbopack_aio

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:4444

# External API configuration
# Add external API base URLs here as needed


# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client

The client uses Vite environment variables:

- `VITE_API_URL` - Server API URL (default: http://localhost:4443/api)

## Features

### Dashboard Overview

- **High-density interface**: Compact, information-rich dashboard for monitoring data and insights
- **Real-time data**: Live updates on key metrics and trends
- **Signal tracking**: Monitor and track signals and alerts
- **Active items**: View and manage active positions

### Discovery & Analysis

- **Search**: Find items using keywords
- **Sort**: Sort results by relevant metrics (e.g., volume, date)
- **Item Cards**: Display key information including:
  - Title and image
  - Current value and 24h change
  - Volume/activity
  - Creation and closing dates
  - Trend indicators
- **Details View**: Explore detailed information with:
  - Interactive charts (e.g., 30-day history)
  - Statistics (e.g., liquidity, fees)
  - Additional metadata
  - Direct links to external sources

### Navigation & User Experience

- **Splash screen**: Professional loading experience with progress indicators
- **Responsive design**: Optimized for desktop and mobile viewing
- **Fast loading**: Efficient data fetching and caching
- **External integration**: Direct links to external platforms for trading

<!-- API Integration details for specific external providers intentionally omitted in boilerplate -->

## Deployment

1. Build all apps and packages: `pnpm build`
2. Start server: `pnpm --filter @mern-turbopack-aio/server start`
3. Serve client build files with a web server (nginx, Apache, etc.)

## Development Workflow

1. **Make changes** to client, server, or shared packages
2. **Run linting** to check code quality: `pnpm lint`
3. **Test changes** locally: `pnpm dev`
4. **Build for production**: `pnpm build`
5. **Deploy** using your preferred deployment method

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `pnpm lint && pnpm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

This project is licensed under the MIT License.
