# Business Directory Application

## Overview

This is a full-stack business directory application built with React, Express, and PostgreSQL. The application allows users to browse, search, and view local businesses with an interactive map interface. It features a modern UI built with shadcn/ui components and uses Drizzle ORM for database operations.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Maps**: React Leaflet for interactive map functionality

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with JSON responses
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reload with Vite integration

## Key Components

### Database Schema
- **Businesses Table**: Stores business information including name, category, description, contact details, location coordinates, hours, and ratings
- **Reviews Table**: Stores user reviews linked to businesses
- **Users Table**: Basic user authentication structure

### API Endpoints
- `GET /api/businesses` - Fetch all businesses
- `GET /api/businesses/search?q=query` - Search businesses by name/description
- `GET /api/businesses/category/:category` - Filter businesses by category
- `GET /api/businesses/:id` - Get specific business details
- `GET /api/businesses/:id/reviews` - Get reviews for a business

### Frontend Components
- **BusinessCard**: Displays business information with ratings and actions
- **InteractiveMap**: Leaflet-based map showing business locations with custom markers
- **SearchBar**: Real-time search with debouncing
- **CategoryFilter**: Filter businesses by category and open status
- **StarRating**: Visual rating display component

## Data Flow

1. **Initial Load**: Application fetches all businesses and categories from the API
2. **Search**: User input triggers debounced search queries to the backend
3. **Filtering**: Category selection fetches filtered results from specific endpoints
4. **Map Interaction**: Business selection updates both map markers and business list
5. **Business Details**: Clicking on businesses loads additional details and reviews

## External Dependencies

### Core Dependencies
- **Database**: Neon PostgreSQL serverless database
- **UI Library**: Radix UI primitives for accessible components
- **Maps**: Leaflet for map functionality with CDN-hosted tile layers
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom CSS variables

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production
- **Drizzle Kit**: Database migration and schema management
- **TSX**: TypeScript execution for development server

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle manages PostgreSQL schema migrations

### Environment Configuration
- **Development**: Uses tsx for hot reloading with Vite middleware
- **Production**: Serves static files from Express with built React app
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### File Structure
```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Route components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and configurations
├── server/          # Express backend
│   ├── routes.ts    # API route definitions
│   ├── storage.ts   # Database abstraction layer
│   └── services/    # External service integrations
├── shared/          # Shared TypeScript definitions
│   └── schema.ts    # Database schema and types
└── migrations/      # Database migration files
```

## Changelog
- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.