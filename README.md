# MERN-Turbopack-AIO-Boilerplate

## Project Structure

This project follows the recommended monorepo structure using Turborepo:

```
polypulse/
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
   cd polypulse
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
   # Then update apps/server/.env with: MONGODB_URI=mongodb://localhost:27017/polypulse
   ```

5. **Start development servers**

   ```sh
   # Start all apps and packages in development mode
   pnpm dev

   # Or start individual apps:
   pnpm --filter @polypulse/client dev  # Client on http://localhost:8818
   pnpm --filter @polypulse/server dev  # Server on http://localhost:3001
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

- `pnpm --filter @polypulse/client dev` - Start client development server
- `pnpm --filter @polypulse/client build` - Build client for production
- `pnpm --filter @polypulse/client preview` - Start client production server
- `pnpm --filter @polypulse/server dev` - Start server development server
- `pnpm --filter @polypulse/server build` - Build server for production
- `pnpm --filter @polypulse/server start` - Start server production server

### Shared Packages

- `pnpm --filter @polypulse/types build` - Build shared types package
- `pnpm --filter @polypulse/utils build` - Build shared utils package
- `pnpm --filter @polypulse/ui build` - Build shared UI package

## API Endpoints

### Health Check

- `GET /api/health` - Server health status

### Polymarket Integration

- `GET /api/polymarket/search?query={query}&limit={limit}&offset={offset}&sortBy={sortBy}` - Search markets
- `GET /api/polymarket/market/{marketId}` - Get market details
- `GET /api/polymarket/market/{marketId}/history?days={days}` - Get market price history

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/polypulse

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:8818

# Polymarket API
POLYMARKET_API_BASE=https://gamma-api.polymarket.com


# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client

The client uses Vite environment variables:

- `VITE_API_URL` - Server API URL (default: http://localhost:3001/api)

## Features

### Dashboard Overview

- **High-density interface**: Compact, information-rich dashboard for efficient market monitoring
- **Real-time data**: Live updates on market prices, volumes, and trends
- **Signal tracking**: Monitor and track market signals and alerts
- **Active tickets**: View and manage active trading positions

### Market Search & Analysis

- **Search Markets**: Search for prediction markets on Polymarket using keywords
- **Sort by Volume**: Sort results by trading volume, creation date, or closing date
- **Market Cards**: Display market information including:
  - Market image and question
  - Current price and 24h change
  - Trading volume
  - Creation and closing dates
  - Trend indicators
- **Market Details**: View detailed market information with:
  - Interactive price charts (30-day history)
  - Market statistics (liquidity, fees, etc.)
  - Outcome token information
  - Direct links to Polymarket

### Navigation & User Experience

- **Splash screen**: Professional loading experience with progress indicators
- **Responsive design**: Optimized for desktop and mobile viewing
- **Fast loading**: Efficient data fetching and caching
- **External integration**: Direct links to Polymarket for trading

## API Integration

This project integrates with the Polymarket Gamma API to fetch:

- Market search results
- Market details and statistics
- Historical price data for charts
- Market metadata and outcome tokens

The backend API service handles error cases gracefully and provides fallback data when needed.

## Deployment

1. Build all apps and packages: `pnpm build`
2. Start server: `pnpm --filter @polypulse/server start`
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
