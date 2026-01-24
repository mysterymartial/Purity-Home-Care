# Purity Home Care - Service Booking Platform

A comprehensive service-booking web application for home care services, featuring real-time chat, review management, and an admin dashboard.

## 🚀 Features

### Customer Features
- **Landing Page**: Marketing-focused homepage with services overview, testimonials, and CTAs
- **Service Booking**: Two booking options - in-app chat or WhatsApp
- **Real-time Chat**: WebSocket-based chat system for customer support with duplicate message prevention
- **Review System**: Public review submission with admin moderation
- **Mobile Responsive**: Fully responsive design for all devices
- **Global Theme**: Theme automatically matches admin's global setting (light/dark/auto)

### Admin Features
- **Admin Dashboard**: Firebase-authenticated admin panel for managing chats and reviews
- **Chat Management**: View all sessions, send messages, update status, delete sessions
- **Review Moderation**: Approve or reject customer reviews
- **Settings Management**:
  - Notification preferences (email, chat alerts, review alerts)
  - Profile settings (display name)
  - System configuration (auto-refresh, refresh interval, global theme)
- **Google Meet Integration**: Quick access to create video consultations
- **Soft Delete**: Delete chat sessions with data recovery capability
- **Audit Logging**: All deletions are logged with admin details and timestamps
- **Mobile Responsive**: Fully functional admin dashboard on mobile devices
- **Real-time Updates**: Socket.IO integration for instant message delivery

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Socket.IO Client
- Lucide React Icons

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- Socket.IO
- Firebase Admin SDK

## 📁 Project Structure

```
purity-home-care/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js app router pages
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utilities and API clients
│   └── public/              # Static assets
│
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── persistent/     # Database models
│   │   ├── repositories/   # Data access layer
│   │   ├── services/       # Business logic layer
│   │   └── presentation/   # Controllers, routes, middleware
│   └── dist/               # Compiled JavaScript
│
└── docs/                   # Documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB Atlas account
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd purity-home-care
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   pnpm install
   ```

### Configuration

See [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) for detailed setup instructions including:
- MongoDB Atlas configuration
- Firebase setup
- Environment variables

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   pnpm dev
   ```
   Server runs on `http://localhost:3001`

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   pnpm dev
   ```
   Application runs on `http://localhost:3000`

## 📚 Documentation

- [Setup Guide](./docs/SETUP_GUIDE.md) - Complete setup instructions
- [Architecture Documentation](./docs/ARCHITECTURE.md) - System architecture and design patterns

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_WHATSAPP_NUMBER=+1 (XXX) XXX-XXXX
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=development

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=your-admin@email.com

CORS_ORIGIN=https://giving-love-production-f201.up.railway.app
```

**⚠️ IMPORTANT**: Replace all placeholder values with your actual credentials. Never commit `.env` or `.env.local` files to Git!

## 🏗️ Architecture

The application follows a layered architecture:

1. **Presentation Layer**: Routes, Controllers, Middleware
2. **Service Layer**: Business logic
3. **Repository Layer**: Data access
4. **Persistent Layer**: Database models

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │   Mobile     │  │   Admin      │      │
│  │   (Next.js)  │  │   Browser    │  │   Dashboard  │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │
          │  HTTP/REST      │  WebSocket      │  Firebase Auth
          │                 │                 │
┌─────────┼─────────────────┼─────────────────┼──────────────┐
│         │                 │                 │               │
│  ┌──────▼─────────────────▼─────────────────▼──────┐       │
│  │           PRESENTATION LAYER                      │       │
│  │  ┌──────────────┐  ┌──────────────┐             │       │
│  │  │   Routes     │  │  Controllers │             │       │
│  │  │   Middleware │  │   Socket.IO  │             │       │
│  │  └──────┬───────┘  └──────┬───────┘             │       │
│  └─────────┼─────────────────┼──────────────────────┘       │
│            │                 │                              │
│  ┌─────────▼─────────────────▼──────────────────────┐     │
│  │           SERVICE LAYER                             │     │
│  │  ┌──────────────┐  ┌──────────────┐              │     │
│  │  │ Chat Service │  │Review Service│              │     │
│  │  └──────┬───────┘  └──────┬───────┘              │     │
│  └─────────┼─────────────────┼───────────────────────┘     │
│            │                 │                              │
│  ┌─────────▼─────────────────▼───────────────────────┐     │
│  │         REPOSITORY LAYER                            │     │
│  │  ┌──────────────┐  ┌──────────────┐              │     │
│  │  │ChatSession   │  │   Review    │              │     │
│  │  │Repository    │  │  Repository │              │     │
│  │  └──────┬───────┘  └──────┬───────┘              │     │
│  └─────────┼─────────────────┼───────────────────────┘     │
│            │                 │                              │
│  ┌─────────▼─────────────────▼───────────────────────┐     │
│  │         PERSISTENT LAYER                            │     │
│  │  ┌──────────────┐  ┌──────────────┐              │     │
│  │  │   MongoDB     │  │   Mongoose  │              │     │
│  │  │    Atlas      │  │    Models   │              │     │
│  │  └──────────────┘  └──────────────┘              │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │         EXTERNAL SERVICES                         │     │
│  │  ┌──────────────┐  ┌──────────────┐             │     │
│  │  │   Firebase    │  │   WhatsApp   │             │     │
│  │  │   Admin SDK   │  │   Deep Link  │             │     │
│  │  └──────────────┘  └──────────────┘             │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Use Case Diagram

```
                    ┌─────────────────────┐
                    │   Customer/User     │
                    └──────────┬─────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ View Services│      │ Book Service │      │ Submit Review │
│              │      │              │      │              │
│ - Landing    │      │ - In-App Chat│      │ - Rate (1-5) │
│   Page       │      │ - WhatsApp   │      │ - Write Text │
│ - Services   │      │              │      │              │
│   Overview   │      │              │      │              │
└──────────────┘      └──────┬───────┘      └──────┬───────┘
                             │                     │
                             ▼                     │
                    ┌──────────────┐               │
                    │ Chat with    │               │
                    │ Support Team │               │
                    │              │               │
                    │ - Real-time  │               │
                    │   Messaging  │               │
                    │ - Send/Receive│              │
                    │   Messages   │               │
                    └──────────────┘               │
                                                    │
                    ┌───────────────────────────────┘
                    │
                    ▼
            ┌──────────────┐
            │ View Reviews │
            │              │
            │ - Approved   │
            │   Reviews    │
            │ - Star       │
            │   Ratings    │
            └──────────────┘


                    ┌─────────────────────┐
                    │   Admin User        │
                    └──────────┬───────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Manage Chats │     │ Manage       │     │ Update        │
│              │     │ Reviews      │     │ Booking       │
│ - View All   │     │              │     │ Status       │
│   Sessions   │     │ - Approve    │     │              │
│ - Send       │     │ - Reject     │     │ - Pending    │
│   Messages   │     │ - View All   │     │ - Confirmed  │
│ - View       │     │              │     │ - Completed  │
│   Messages   │     │              │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
```

See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## 📝 API Endpoints

### Chat
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/sessions/:sessionId` - Get session
- `GET /api/chat/sessions/:sessionId/messages` - Get messages
- `POST /api/chat/sessions/:sessionId/messages` - Send message

### Reviews
- `POST /api/reviews` - Submit review
- `GET /api/reviews/approved` - Get approved reviews

### Admin (Protected)
- `GET /api/admin/chat/sessions` - Get all sessions (excluding soft-deleted)
- `GET /api/admin/chat/sessions/:sessionId/messages` - Get messages for a session
- `POST /api/admin/chat/sessions/:sessionId/messages` - Send admin message
- `PATCH /api/admin/chat/sessions/:sessionId/status` - Update status
- `DELETE /api/admin/chat/sessions/:sessionId` - Soft delete chat session
- `GET /api/admin/reviews` - Get all reviews
- `PATCH /api/admin/reviews/:reviewId/approve` - Approve review
- `DELETE /api/admin/reviews/:reviewId/reject` - Reject review
- `GET /api/admin/settings/notifications` - Get notification preferences
- `PATCH /api/admin/settings/notifications` - Update notification preferences
- `PATCH /api/admin/settings/theme` - Update global theme

### Public Settings
- `GET /api/settings/theme` - Get global theme (no auth required)

## 🧪 Testing

```bash
# Frontend
cd frontend
pnpm test
pnpm test:watch  # Watch mode

# Backend
cd backend
pnpm test
pnpm test:watch  # Watch mode
pnpm test:coverage  # With coverage report
```

**Test Coverage:**
- ✅ Chat Session Service (create, get, update, delete, soft delete)
- ✅ Chat Session Controller (all endpoints, Socket.IO broadcast)
- ✅ Message Repository (soft delete, filtering)
- ✅ Review Service and Controller
- ✅ Settings Controller (global theme, notifications)
- ✅ Global Settings Service
- ✅ Auth Middleware
- ✅ Email Service
- ✅ Notification Preferences Service

**Total:** 131 tests passing across 8 test suites

## 📚 Additional Documentation

- [Product Requirements Document (PRD)](./docs/PRD.md) - Complete feature specifications and requirements
- [User Manual](./docs/USER_MANUAL.md) - Complete user guide for customers and admins
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Domain setup and Railway deployment instructions
- [Frontend README](./frontend/README.md) - Frontend-specific documentation
- [Backend README](./backend/README.md) - Backend-specific documentation
- [Setup Guide](./docs/SETUP_GUIDE.md) - Complete setup instructions
- [Architecture Documentation](./docs/ARCHITECTURE.md) - System architecture and design patterns
- [Installation Guide](./docs/INSTALLATION_GUIDE.md) - Quick installation steps
- [Firebase Setup](./docs/FIREBASE_SETUP.md) - Firebase configuration guide
- [WhatsApp Setup](./docs/WHATSAPP_SETUP.md) - WhatsApp integration guide

## ✨ Recent Updates (v3.0)

### New Features
- ✅ **Global Theme Management**: Admin-controlled theme that applies to all users (light/dark/auto)
- ✅ **Chat Session Deletion**: Soft delete with confirmation and audit logging
- ✅ **Mobile Responsive Admin Dashboard**: Full functionality on mobile devices with hamburger menu
- ✅ **Duplicate Message Prevention**: Fixed issue where messages appeared twice
- ✅ **Soft Deletes**: Chat sessions and messages can be recovered from database
- ✅ **Audit Logging**: All deletions logged with admin details and timestamps
- ✅ **Enhanced Settings**: Notification preferences, profile settings, system configuration

### Technical Improvements
- ✅ Socket.IO broadcast from API endpoints (prevents duplicates)
- ✅ Duplicate message detection in frontend Socket.IO listeners
- ✅ Mobile-first responsive design
- ✅ Comprehensive unit test coverage (131 tests)
- ✅ Production-ready codebase

## 📄 License

Copyright © 2026 Purity Care Services. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

- **Email**: purityfamilyservicextonpa@yahoo.com
- **Phone**: +1 (215) 617-8614
- **WhatsApp**: Available 24/7 via in-app chat or WhatsApp deep link

For detailed usage instructions, see the [User Manual](./docs/USER_MANUAL.md).

