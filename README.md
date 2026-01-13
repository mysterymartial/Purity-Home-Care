# Purity Home Care - Service Booking Platform

A comprehensive service-booking web application for home care services, featuring real-time chat, review management, and an admin dashboard.

## 🚀 Features

- **Landing Page**: Marketing-focused homepage with services overview, testimonials, and CTAs
- **Service Booking**: Two booking options - in-app chat or WhatsApp
- **Real-time Chat**: WebSocket-based chat system for customer support
- **Review System**: Public review submission with admin moderation
- **Admin Dashboard**: Firebase-authenticated admin panel for managing chats and reviews
- **Mobile Responsive**: Fully responsive design for all devices

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
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAEcnXpBSA4MVlOnwsQroky64lgeU7ewxU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=purity-home-care.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=purity-home-care
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=purity-home-care.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=333284266562
NEXT_PUBLIC_FIREBASE_APP_ID=1:333284266562:web:5807e520cb406d4fdb13db
NEXT_PUBLIC_WHATSAPP_NUMBER=+1 (215) 617-8614
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=development

MONGODB_URI=mongodb+srv://bolasax16_db_user:3LKI3pKnwiR2wQkE@cluster0.uepkcfr.mongodb.net/purity-home-care?retryWrites=true&w=majority&appName=Cluster0s

FIREBASE_PROJECT_ID=purity-home-care
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDABhbFOYh0TSg/\nAT0wguVI3hfVa86YzLOpzRM2gTVIxvph2Mo+eVJb2fuHGRbonI2WiXsj/EoV+/s+\nMx2Nqv3effk8l1xwakx7CbPjvAKxigLEj/xKPLBPeqqg1UwHXxEI0qS48D+euAsn\nFXDbBuPuivlZiWbilwIyfCIo+R2nu8LKemWa25I+lwElz+xFej/gjm/bui+umxSl\nIJI9sg67oKEJfaR8pmEQtHHPsb1dZMd06HU+8Me2ryJ52cBGqV+EyEop1s2adkHW\nSor++ywpja2EjbcUkmmQGu5lpuY+GYiowcVCzKjPSBZHkKW84rFsROpsx13T4i7z\n7o1e2bZrAgMBAAECggEAEp3kgkLgMF+0pFsd5WtOCHZZJYdktHAQMR5hRk+uQfvh\n6tpGTVqcz1aUahYsID7hWUlt8gtehsAd19DD2j124dB2eVc2uUK3tIFjJT6lR4ou\nV4PwJ/sMoEAFH+peCyQ+i2DvYxYOd6MMmGxIkJZGmJTKX6cQcwJvTkQLryDr15w+\nCpm6vYuIGjHt6Map6WhxzvzHxW6IR2UlaXzrgyDL8jTf8xqkQKKt7sU6Gr43bntt\nU/TD7pT56JPZAgyXBZjPmezBI7ymEzbv7FA/+zodbT0DoLNUSmYUx1g8kJUEAGEP\nscedWi39vqHxfXwNoFwE/p0RhzClUgLrVDiySeTY5QKBgQD79st6HzZk871cBicZ\ng//o7MfoR4HYmX27dTjVahzXWHtkPUYNvgHZTp0p0Rhn0KfKjqGOUVJDRDWVsEK5\nVDEKilC3rljQJbdhpzjldlb37K3LDXff8ruILbJFt8mC8LYyaxNF1rw8OVU9Prau\n2JY39KF8TstyAVMTOjx+TcrtVwKBgQDDGYC0yLr7TX6hh48yk9PiMw4aKv0lDRfW\nGlRjVRP2A/4uz543Ans/8udAzBF7BM2mJSIgwFzzksOe75LHw47vCJhCPLpVNu0E\nMY9a3pIdNESmc0lKt4LF9Mi6lsSvtgUx4NpcugvY9mq/bsqtJmcvtAgSCS/lS7k0\nfCn7yK7/DQKBgQCEwRmgdIWSVyH0NIGxXe0d6nPBnLt7RhQLCs4xE8GybLpGrEoW\nv3/14QfJmpPDTxq5DMFuXMZ9Dpk1DzN4tjVImmvA+6lrshOW7iZ6MAnOgvNmwufg\nJOJN89W0CguwY+d7VRNIfsWa7ZJNvJdANHmhbdEPz+w9WxlMTijFW3OJ7QKBgDdG\nmnieBpv8sMwDJEcoKvgDjxNK6r38n6xBeXdLO4SQTQvmNuVPBqxvnaV2K9221q0k\nCC9PUQaRpmr5ZZTDi1OeE8Vwfzp1fWGayQrt1GgBzxF5yGIq7Bo56EU1QjSmVYJ0\nOmnbLFAkQMpMEZBNOR8C2uaBQ9irQ6XjJ+H2Ud5hAoGAGhNPi0TXSJMQk2cp0xdB\nStWhJFgKVZpey8h0dL7gVLJaQBeeQ9dNIULlHkG77WZB9jkog2b/PFHJKdDzmF8+\nK0RtKhFzwCTz8ha44icHrv5Y9KiOJs3zJp9MFOmKZNCh4JLaN4SmhgTwbID1orb0\nefSCHhvKs/VnS0bDei3T008=\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@purity-home-care.iam.gserviceaccount.com

CORS_ORIGIN=http://localhost:3000
```

**Note**: The actual credentials are configured. For production, use environment-specific values.

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
- `GET /api/admin/chat/sessions` - Get all sessions
- `GET /api/admin/chat/sessions/:sessionId/messages` - Get messages for a session
- `POST /api/admin/chat/sessions/:sessionId/messages` - Send admin message
- `PATCH /api/admin/chat/sessions/:sessionId/status` - Update status
- `GET /api/admin/reviews` - Get all reviews
- `PATCH /api/admin/reviews/:reviewId/approve` - Approve review
- `DELETE /api/admin/reviews/:reviewId/reject` - Reject review

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

## 📚 Additional Documentation

- [Frontend README](./frontend/README.md) - Frontend-specific documentation
- [Backend README](./backend/README.md) - Backend-specific documentation
- [Setup Guide](./docs/SETUP_GUIDE.md) - Complete setup instructions
- [Architecture Documentation](./docs/ARCHITECTURE.md) - System architecture and design patterns
- [Installation Guide](./INSTALLATION_GUIDE.md) - Quick installation steps

## 📄 License

Copyright © 2026 Purity Care Services. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support, email care@purity.com or call 1-800-CARE-NOW

