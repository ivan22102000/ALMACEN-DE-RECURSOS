# Overview

KIVO Store is a comprehensive e-commerce platform designed for the Bolivian market, featuring a unique loyalty system based on token-like "fichas" (chips) that function similarly to Bitcoin. The system generates dynamic QR codes printed on labels (18mm format) that customers can redeem for discounts. The application is built as a full-stack web solution with a React frontend and Express backend, utilizing PostgreSQL for data persistence and Cloudinary for image storage.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library in "new-york" style
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **UI Theme**: Custom violet (#6C63FF) and white (#FFFFFF) color scheme with Arial font
- **Responsive Design**: Mobile-first approach with collapsible tables and adaptive layouts

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Authentication**: JWT-based authentication for admin panel access
- **Security**: bcrypt for password hashing, SHA-256 for token encryption
- **File Handling**: Server-side image upload processing with Cloudinary integration
- **API Design**: RESTful endpoints with proper error handling and validation using Zod

## Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon serverless (500MB limit on free tier)
- **Image Storage**: Cloudinary for product images (25GB free tier, organized in `kivo/productos` folder)
- **Session Management**: Browser localStorage for cart sessions and temporary data
- **Database Schema**: Comprehensive schema including users, products, categories, promotions, loyalty tokens (fichas), cart items, and audit logs

## Authentication and Authorization
- **Admin Authentication**: JWT tokens with role-based access control
- **Default Admin**: Email `admin@kivo.com` with bcrypt-hashed password
- **Protected Routes**: Admin panel restricted to users with `es_administrador = true`
- **Token Management**: Secure token storage and validation middleware
- **Audit Logging**: All sensitive actions logged for security tracking

## Key Features
- **Loyalty System**: QR code-based "fichas" system for customer rewards
- **Product Management**: Full CRUD operations for products with image uploads
- **Shopping Cart**: Session-based cart functionality with persistent storage
- **Promotions**: Time-limited discount system with countdown timers
- **Multi-language**: Spanish-first interface designed for Bolivian users
- **Cost Optimization**: Automatic database cleanup to stay within free tier limits

## Performance Optimizations
- **Pagination**: 10-20 records per query to optimize load times
- **Caching**: TanStack Query for intelligent client-side caching
- **Image Optimization**: Cloudinary transforms for responsive images
- **Database Maintenance**: Automated cleanup of expired tokens and archived orders
- **Connection Management**: Keep-alive pings to prevent database hibernation

# External Dependencies

## Third-party Services
- **Neon Database**: PostgreSQL hosting (500MB, 1GB bandwidth/month free tier)
- **Cloudinary**: Image storage and processing (25GB storage, transformation APIs)
- **Vercel**: Frontend deployment and hosting
- **Render**: Backend API hosting with cron job support (750 hours/month free)

## Key Libraries
- **Database**: Drizzle ORM, postgres driver, @neondatabase/serverless
- **Authentication**: bcrypt, jsonwebtoken
- **Frontend UI**: @radix-ui components, @tanstack/react-query, wouter
- **Validation**: Zod for form and API validation
- **QR Code Generation**: qrcode library for loyalty token generation
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Development**: TypeScript, Vite, tsx for development server

## API Integrations
- **Cloudinary API**: Unsigned upload preset for direct image uploads
- **Database API**: Direct PostgreSQL connections via connection string
- **Payment Processing**: Designed to integrate with local Bolivian payment providers
- **QR Code Scanning**: Browser-based camera access for token redemption