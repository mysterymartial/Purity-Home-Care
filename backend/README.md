# Purity Home Care - Backend

Express.js backend API for the Purity Home Care service booking platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm package manager
- MongoDB Atlas account
- Firebase project with Admin SDK

### Installation

```bash
pnpm install
```

### Environment Variables

Create `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=development

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority

FIREBASE_PROJECT_ID=purity-home-care
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

CORS_ORIGIN=https://giving-love-production-f201.up.railway.app
```

### Development

```bash
pnpm dev
```

Runs the server in development mode with hot reload at `http://localhost:3001`

### Build

```bash
pnpm build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Start Production Server

```bash
pnpm start
```

Starts the production server (requires `pnpm build` first).

### Testing

```bash
pnpm test
```

Runs all tests.

```bash
pnpm test:watch
```

Runs tests in watch mode.

```bash
pnpm test:coverage
```

Runs tests with coverage report.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts     # MongoDB connection
│   │   └── firebase.ts     # Firebase Admin setup
│   ├── dto/                 # Data Transfer Objects
│   │   ├── ChatSession.dto.ts
│   │   ├── Message.dto.ts
│   │   └── Review.dto.ts
│   ├── persistent/          # Database models
│   │   └── models/
│   │       ├── ChatSession.model.ts
│   │       ├── Message.model.ts
│   │       └── Review.model.ts
│   ├── repositories/        # Data access layer
│   │   ├── ChatSession.repository.ts
│   │   ├── Message.repository.ts
│   │   └── Review.repository.ts
│   ├── services/            # Business logic layer
│   │   ├── ChatSession.service.ts
│   │   └── Review.service.ts
│   ├── presentation/        # Controllers, routes, middleware
│   │   ├── controllers/
│   │   │   ├── ChatSession.controller.ts
│   │   │   └── Review.controller.ts
│   │   ├── routes/
│   │   │   ├── chat.routes.ts
│   │   │   ├── review.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   └── socket/
│   │       └── socket.handler.ts
│   ├── __tests__/           # Test files
│   │   ├── services/
│   │   ├── controllers/
│   │   └── middleware/
│   └── index.ts             # Entry point
├── dist/                    # Compiled JavaScript (generated)
├── jest.config.js           # Jest configuration
└── package.json             # Dependencies
```

## 🏗️ Architecture

The backend follows a **layered architecture**:

1. **Presentation Layer** (`presentation/`)
   - Routes: Define API endpoints
   - Controllers: Handle HTTP requests/responses
   - Middleware: Authentication, validation
   - Socket Handlers: Real-time communication

2. **Service Layer** (`services/`)
   - Business logic
   - Data transformation
   - Orchestration

3. **Repository Layer** (`repositories/`)
   - Data access abstraction
   - Database operations

4. **Persistent Layer** (`persistent/models/`)
   - MongoDB schemas
   - Data validation

5. **DTO Layer** (`dto/`)
   - Type-safe data contracts
   - Request/Response shapes

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database (via Mongoose)
- **Socket.IO** - Real-time messaging
- **Firebase Admin SDK** - Server-side authentication
- **Jest** - Testing framework
- **ts-jest** - TypeScript Jest preset

## 📝 API Endpoints

### Chat Endpoints
- `POST /api/chat/sessions` - Create new chat session
- `GET /api/chat/sessions/:sessionId` - Get chat session
- `GET /api/chat/sessions/:sessionId/messages` - Get messages
- `POST /api/chat/sessions/:sessionId/messages` - Send message

### Review Endpoints
- `POST /api/reviews` - Submit review
- `GET /api/reviews/approved` - Get approved reviews

### Admin Endpoints (Protected)
- `GET /api/admin/chat/sessions` - Get all chat sessions
- `GET /api/admin/chat/sessions/:sessionId/messages` - Get messages
- `POST /api/admin/chat/sessions/:sessionId/messages` - Send admin message
- `PATCH /api/admin/chat/sessions/:sessionId/status` - Update booking status
- `GET /api/admin/reviews` - Get all reviews
- `PATCH /api/admin/reviews/:reviewId/approve` - Approve review
- `DELETE /api/admin/reviews/:reviewId/reject` - Reject review
- `GET /api/admin/settings/notifications` - Get notification preferences
- `PATCH /api/admin/settings/notifications` - Update notification preferences

### Health Check
- `GET /health` - Server health status

## 🔐 Authentication

Admin endpoints require Firebase authentication:
- Token must be sent in `Authorization: Bearer <token>` header
- Token is verified using Firebase Admin SDK
- Middleware: `authenticateAdmin` in `presentation/middleware/auth.middleware.ts`

## 🔌 Real-time Communication

Socket.IO is used for real-time messaging:
- Server setup in `src/index.ts`
- Handler in `presentation/socket/socket.handler.ts`
- Events:
  - `message` - New message received
  - `typing` - Typing indicator

## 🧪 Testing

Tests are located in `src/__tests__/`:
- Service layer tests with boundary analysis
- Controller tests
- Middleware tests
- Edge case coverage

Run tests:
```bash
pnpm test
```

## 📊 Database Models

### ChatSession
- `customerId` (UUID, unique)
- `status` (Pending | Confirmed | Completed)
- `createdAt`, `updatedAt`

### Message
- `chatSessionId` (ObjectId reference)
- `sender` (customer | admin)
- `content` (string)
- `timestamp` (Date)

### Review
- `rating` (1-5)
- `text` (optional string)
- `approved` (boolean, default: false)
- `createdAt`, `updatedAt`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` is correct
- Check network access in MongoDB Atlas
- Ensure database user has proper permissions

### Firebase Admin Issues
- Verify `FIREBASE_PRIVATE_KEY` includes `\n` characters
- Check `FIREBASE_CLIENT_EMAIL` matches service account
- Ensure private key is wrapped in quotes

### Port Already in Use
```bash
# Find process using port 3001
lsof -ti:3001 | xargs kill -9
```

## 📚 Related Documentation

- [Main README](../README.md) - Project overview
- [User Manual](../docs/USER_MANUAL.md) - Complete user guide for customers and admins
- [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md) - Domain setup and Railway deployment
- [Setup Guide](../docs/SETUP_GUIDE.md) - Detailed setup instructions
- [Architecture Documentation](../docs/ARCHITECTURE.md) - System architecture




