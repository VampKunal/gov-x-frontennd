# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Gov-X India is a civic engagement platform built with Next.js 15, designed to help Indian citizens report and track civic issues like potholes, garbage problems, street lights, and drainage issues. The app uses AI-powered scanning and connects citizens with municipal authorities.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Testing and Development
- No test scripts are currently configured in package.json
- Linting is handled by `next lint` with ESLint
- The app runs on Next.js development server at http://localhost:3000

## Architecture Overview

### Core Technology Stack
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS v4.1.9 with custom design system
- **UI Components**: Shadcn/ui with Radix UI primitives
- **Authentication**: Firebase Auth with custom useAuth hook
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React hooks and context
- **Type Safety**: TypeScript 5

### Project Structure

```
app/                    # Next.js App Router pages
├── auth/              # Authentication pages
├── dashboard/         # User dashboard
├── feed/             # Community feed for issues
├── problems/[id]/    # Individual problem detail pages
├── track/            # User's problem tracking page
├── notifications/    # User notifications
└── api-demo/         # API demonstration

components/
├── ui/               # Shadcn/ui components (Button, Card, etc.)
├── hover/            # Custom animated components
├── layouts/          # Layout components
└── examples/         # Example components

hooks/                # Custom React hooks
├── use-auth.jsx      # Firebase authentication hook

lib/                  # Utility functions
└── utils.ts          # Utility functions (cn, etc.)
```

### Key Features & Pages

1. **Landing Page** (`app/page.jsx`): Marketing site with animated hero section
2. **Authentication** (`app/auth/page.jsx`): Email/Google sign-in with Firebase
3. **Dashboard** (`app/dashboard/page.jsx`): User overview with statistics
4. **Feed** (`app/feed/page.jsx`): Community issues feed with filters
5. **Problem Tracking** (`app/track/page.jsx`): User's submitted issues
6. **Problem Details** (`app/problems/[id]/page.jsx`): Individual issue pages with timeline

### Component Architecture

**UI Component System**:
- Built on Shadcn/ui with Radix UI primitives
- Components use `cn()` utility for className merging
- Consistent design tokens via Tailwind CSS
- Dark mode support built-in

**Key Custom Components**:
- `StatusBadge`: For issue status display
- `Timeline`: For problem progress tracking
- `ProblemCard`: For displaying issues in feeds
- Authentication components with animated states

### Firebase Integration
- Authentication handled via `useAuth` hook in `hooks/use-auth.jsx`
- Supports email/password and Google OAuth
- User state management with React Context

### Styling System
- Tailwind CSS v4.1.9 with CSS variables for theming
- Custom utility classes for glass effects and gradients
- Color scheme: Orange and green gradients representing Indian flag
- Responsive design with mobile-first approach

## Development Guidelines

### File Conventions
- Use `.jsx` for React components (existing pattern)
- Use `.tsx` for TypeScript files when type definitions needed
- Pages in `app/` directory follow Next.js App Router conventions
- Components organized by feature/type in `components/`

### Code Patterns
- Client components marked with `"use client"` directive
- Heavy use of Framer Motion for animations
- Consistent error handling with toast notifications
- Mock data used throughout for development (no backend yet)

### Authentication Flow
- Firebase authentication with email/password and Google OAuth
- Protected routes redirect to `/auth` if not authenticated
- User state persisted across sessions
- Dashboard shows user-specific data and statistics

### Routing Structure
- `/` - Landing page
- `/auth` - Authentication
- `/dashboard` - User dashboard
- `/feed` - Community issues feed
- `/track` - User's issues tracking
- `/problems/[id]` - Individual problem details
- `/notifications` - User notifications

## Configuration Files

### Next.js Configuration
- `next.config.mjs`: ESLint/TypeScript errors ignored for builds, images unoptimized
- `tsconfig.json`: Standard TypeScript config with path aliases (`@/*`)
- `components.json`: Shadcn/ui configuration with New York style

### Styling Configuration
- `postcss.config.mjs`: PostCSS configuration for Tailwind
- `app/globals.css`: Global styles and CSS variables
- Tailwind config embedded in CSS using v4 syntax

### Package Management
- Uses npm with `package-lock.json`
- Also has `pnpm-lock.yaml` indicating possible pnpm usage
- No workspace configuration

## Common Development Tasks

### Adding New Pages
1. Create file in `app/` directory following App Router conventions
2. Export default React component
3. Add client directive if using client-side features
4. Import required UI components from `@/components/ui`

### Adding New Components
1. Create in appropriate `components/` subdirectory
2. Follow existing patterns for props and styling
3. Use `cn()` for className merging
4. Export from index files if creating component collections

### Working with Authentication
- Use `useAuth()` hook to access user state and auth methods
- Redirect unauthenticated users with `useRouter()`
- Check loading states before rendering protected content

### Styling Guidelines
- Use Tailwind classes extensively
- Leverage CSS variables for consistent theming
- Use `glass` utility class for frosted glass effects
- Follow mobile-first responsive design patterns

## Mock Data & API Integration

Currently uses extensive mock data in components:
- Issue data with categories (Pothole, Garbage, Street Light, etc.)
- User profiles and community interactions
- Status tracking and timelines
- Municipal department assignments

Ready for API integration with consistent data structures already established.