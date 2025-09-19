# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Gov-X India** is an AI-powered civic engagement platform that allows citizens to scan, report, and resolve civic issues across India. The platform uses Next.js 15 with React 19, Firebase authentication, and a modern UI built with shadcn/ui components.

## Development Commands

### Primary Development Workflow
```bash
# Install dependencies
npm install

# Start development server (main command)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Frontend Sub-project (Vite-based)
```bash
# Navigate to frontend directory
cd frontend

# Start Vite dev server
npm run dev

# Build frontend
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
# Navigate to backend directory
cd backend

# Run FastAPI server (assuming you have uvicorn installed)
uvicorn main:app --reload --port 8000
```

### Testing & Development
```bash
# Run development server on specific port
npm run dev -- --port 3001

# Clear Next.js cache (if build issues occur)
rm -rf .next && npm run dev

# Install new dependency and add to package.json
npm install <package-name>
```

## Architecture Overview

### Project Structure
This is a **hybrid monorepo** with multiple frontend approaches:
- **Main Next.js App** (`/app` directory) - Primary production application
- **Vite Frontend** (`/frontend`) - Alternative/experimental frontend
- **FastAPI Backend** (`/backend`) - Python API server
- **Shared Components** (`/components`) - Reusable UI components
- **Custom Hooks** (`/hooks`) - React hooks for state management
- **Utilities** (`/lib`) - Shared utilities and Firebase config

### Key Architectural Patterns

#### 1. Authentication-Based Layout System
The app uses a sophisticated routing system that renders different layouts based on authentication state:

- **Public routes** (`/`, `/auth`, `/auth/forgot-password`) show landing page without navbar
- **Protected routes** require authentication and show the full app layout with navbar
- **AppLayout component** (`components/layouts/app-layout.jsx`) handles all routing logic
- **AuthProvider** (`hooks/use-auth.jsx`) manages Firebase authentication state

#### 2. Component Architecture
- **shadcn/ui integration** - Modern UI components with `components.json` configuration
- **Path aliases** configured in `tsconfig.json`: `@/components`, `@/lib`, `@/hooks`
- **Compound component patterns** for complex UI (modals, navbars, forms)
- **Theme system** with light/dark mode support

#### 3. State Management
- **Firebase Authentication** - Centralized auth state via React Context
- **React Hook Form** with Zod validation for form management
- **React Hot Toast** for notifications
- **Local state** with hooks for UI interactions

#### 4. Styling Architecture
- **Tailwind CSS** with custom configuration and postcss
- **CSS variables** for theme customization in `app/globals.css`
- **Framer Motion** for animations and transitions
- **Glass morphism effects** and gradient-based design system
- **Mobile-first responsive design**

## Key Features & Pages

### Authentication Flow
- **Landing page** (`/`) - Marketing page for unauthenticated users
- **Auth page** (`/auth`) - Login/signup with Firebase
- **Forgot password** (`/auth/forgot-password`) - Password reset

### Core Application Pages
- **Dashboard** (`/dashboard`) - User welcome screen with quick actions
- **Feed** (`/feed`) - Twitter-like interface for browsing/reporting civic issues
- **Track Issues** (`/track`) - Personal problem tracking dashboard  
- **Notifications** (`/notifications`) - Real-time notification center
- **Problem Details** (`/problems/[id]`) - Individual problem view with timeline

### Key Components
- **ModernNavbar** - Animated navigation with theme toggle
- **NewPostModal** - Camera/file upload with AI analysis simulation
- **ProblemCard** - Issue display with voting and status tracking
- **Timeline** - Progress tracking for issue resolution

## Development Guidelines

### Working with Routes
- All app pages use **Next.js App Router** (React Server Components where possible)
- Dynamic routes use `[param]` syntax (`/problems/[id]/page.jsx`)
- Route protection is handled automatically by `AppLayout`

### Adding New Pages
1. Create page in `/app/[route]/page.jsx`
2. If protected route, no additional setup needed (AppLayout handles it)
3. If public route, add to `publicPaths` array in `app-layout.jsx`

### Component Development
- Use existing shadcn/ui components from `/components/ui/`
- Follow the compound component pattern for complex UI
- Use path aliases (`@/components`, `@/lib`) consistently
- Implement proper TypeScript types (`.tsx` for new components)

### Styling Guidelines
- Use Tailwind utility classes
- Leverage CSS variables for theme values
- Follow mobile-first responsive design
- Use Framer Motion for animations
- Apply glass morphism effects with `backdrop-blur` utilities

### Firebase Integration
- All Firebase operations go through `lib/firebase.js`
- Authentication handled by `hooks/use-auth.jsx`
- Use dynamic imports for Firebase to support SSR
- Firebase config is already set up (avoid exposing secrets)

### Form Handling
- Use React Hook Form with Zod validation
- Follow existing patterns in auth pages
- Implement proper error handling and toast notifications

## Important Notes

### Build & Deployment Considerations
- **Image optimization disabled** (`unoptimized: true` in next.config.mjs)
- **TypeScript/ESLint errors ignored** during builds for rapid development
- **Environment variables** should be prefixed with `NEXT_PUBLIC_` for client-side access

### Mobile Development
- App is **mobile-first responsive** 
- Camera integration uses `capture="environment"` for mobile camera access
- Touch-friendly interfaces throughout
- Floating action buttons for key mobile interactions

### Performance
- Components use lazy loading where appropriate
- Framer Motion animations are optimized for performance
- Firebase SDK is loaded dynamically to support SSR

### Current Status
The application is **fully functional** with:
- ✅ Complete authentication flow
- ✅ All pages responsive and working
- ✅ Theme toggle system
- ✅ Modern UI components
- ✅ Mobile-optimized interface
- ✅ Firebase integration preserved

### Development Context
This is a **civic engagement platform** focused on the Indian market. The app helps citizens report civic issues (potholes, garbage, infrastructure problems) to appropriate authorities using AI-powered categorization and routing.

## Package Management

- **Primary**: npm (lockfile: `package-lock.json`)
- **Alternative**: pnpm (lockfile: `pnpm-lock.yaml` also present)
- Use npm for consistency with existing development workflow

## Tech Stack Summary
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, shadcn/ui
- **Authentication**: Firebase Auth
- **Forms**: React Hook Form + Zod
- **State**: React Context, Local State
- **Backend**: FastAPI (Python)
- **Development**: Vite (alternative frontend), ESLint