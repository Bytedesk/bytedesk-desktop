# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a desktop application built with Electron, React, and TypeScript. The application is a customer service platform called "ByteDesk" that provides AI-powered omnichannel customer service with team cooperation features.

## Common Development Commands

### Development
- `pnpm dev` - Start development server in dev mode
- `pnpm dev:electron` - Start development server in electron mode
- `pnpm start` - Start development server (alias for dev)

### Building
- `pnpm build` - Build for production (web and electron)
- `pnpm build:web` - Build for web deployment
- `pnpm build:open` - Build for open source version
- `pnpm build:quanjing` - Build for quanjing version
- `pnpm build:mac:dmg` - Build macOS DMG package
- `pnpm build:mac:mas` - Build macOS App Store package
- `pnpm build:win` - Build Windows package
- `pnpm build:linux` - Build Linux package

### Release
- `pnpm release:web` - Build and upload web version
- `pnpm release:mac` - Build and upload macOS version
- `pnpm release:win` - Build and upload Windows version
- `pnpm release:linux` - Build and upload Linux version

### Testing
- `pnpm e2e` - Run end-to-end tests with Playwright

## Code Architecture and Structure

### Tech Stack
- React 18 with TypeScript
- Electron for desktop application
- Vite as build tool
- Ant Design for UI components
- React Router for routing
- TanStack Query for data fetching and state management
- Zustand for global state management

### Project Structure
- `src/` - Main source code directory
  - `@types/` - TypeScript type definitions
  - `apis/` - API service definitions
  - `components/` - Reusable React components
  - `context/` - React context providers
  - `db/` - Database related code (Dexie.js)
  - `hooks/` - Custom React hooks
  - `locales/` - Internationalization files
  - `network/` - Network related utilities
  - `pages/` - Page components organized by feature
  - `routes/` - Routing configuration
  - `services/` - Business logic services
  - `stores/` - Zustand stores for global state
  - `styles/` - Global styles
  - `utils/` - Utility functions
- `electron/` - Electron main and preload processes
- `public/` - Static assets
- `build/` - Build configurations
- `cicd/` - CI/CD scripts

### Key Architectural Patterns
1. **Component-based architecture** - UI organized into reusable components
2. **Context API** - Used for global state management (AppContext)
3. **Zustand stores** - For complex global state management
4. **Service layer** - API calls and business logic separated in service files
5. **Hook patterns** - Custom hooks for reusable logic
6. **Route-based code splitting** - Lazy loading of page components

### Routing
The application uses React Router with a hierarchical route structure:
- Main dashboard routes under `/` with protected authentication
- Authentication routes under `/auth`
- Anonymous access routes under `/anonymous`
- Special routes like invite pages and enlarged views

### State Management
- Local component state with React useState/useReducer
- Global state with React Context API (AppContext)
- Complex global state with Zustand stores
- Server state with TanStack Query

### Internationalization
- Uses react-intl for internationalization
- Locale files in `src/locales/` directory
- Support for Chinese (Simplified/Traditional) and English

## Environment and Configuration

### Environment Files
- `.env.dev` - Development environment
- `.env.electron` - Electron environment
- `.env.example` - Example environment file
- `.env.open` - Open source version environment
- `.env.quanjing` - Quanjing version environment
- `.env.web` - Web version environment

### Build Configuration
- Vite configuration in `vite.config.ts`
- TypeScript configuration in `tsconfig.json`
- ESLint configuration in `.eslintrc.js`
- Prettier configuration in `.prettierrc`

## Testing
- Uses Playwright for end-to-end testing
- Configuration in `playwright.config.ts`
- Test files in `e2e/` directory

## Electron Specifics
- Main process code in `electron/main/`
- Preload scripts in `electron/preload/`
- Electron builder configurations for different platforms