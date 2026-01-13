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

MONGODB_URI=mongodb+srv://bolasax16_db_user:3LKI3pKnwiR2wQkE@cluster0.uepkcfr.mongodb.net/purity-home-care?retryWrites=true&w=majority&appName=Cluster0s

FIREBASE_PROJECT_ID=purity-home-care
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDABhbFOYh0TSg/\nAT0wguVI3hfVa86YzLOpzRM2gTVIxvph2Mo+eVJb2fuHGRbonI2WiXsj/EoV+/s+\nMx2Nqv3effk8l1xwakx7CbPjvAKxigLEj/xKPLBPeqqg1UwHXxEI0qS48D+euAsn\nFXDbBuPuivlZiWbilwIyfCIo+R2nu8LKemWa25I+lwElz+xFej/gjm/bui+umxSl\nIJI9sg67oKEJfaR8pmEQtHHPsb1dZMd06HU+8Me2ryJ52cBGqV+EyEop1s2adkHW\nSor++ywpja2EjbcUkmmQGu5lpuY+GYiowcVCzKjPSBZHkKW84rFsROpsx13T4i7z\n7o1e2bZrAgMBAAECggEAEp3kgkLgMF+0pFsd5WtOCHZZJYdktHAQMR5hRk+uQfvh\n6tpGTVqcz1aUahYsID7hWUlt8gtehsAd19DD2j124dB2eVc2uUK3tIFjJT6lR4ou\nV4PwJ/sMoEAFH+peCyQ+i2DvYxYOd6MMmGxIkJZGmJTKX6cQcwJvTkQLryDr15w+\nCpm6vYuIGjHt6Map6WhxzvzHxW6IR2UlaXzrgyDL8jTf8xqkQKKt7sU6Gr43bntt\nU/TD7pT56JPZAgyXBZjPmezBI7ymEzbv7FA/+zodbT0DoLNUSmYUx1g8kJUEAGEP\nscedWi39vqHxfXwNoFwE/p0RhzClUgLrVDiySeTY5QKBgQD79st6HzZk871cBicZ\ng//o7MfoR4HYmX27dTjVahzXWHtkPUYNvgHZTp0p0Rhn0KfKjqGOUVJDRDWVsEK5\nVDEKilC3rljQJbdhpzjldlb37K3LDXff8ruILbJFt8mC8LYyaxNF1rw8OVU9Prau\n2JY39KF8TstyAVMTOjx+TcrtVwKBgQDDGYC0yLr7TX6hh48yk9PiMw4aKv0lDRfW\nGlRjVRP2A/4uz543Ans/8udAzBF7BM2mJSIgwFzzksOe75LHw47vCJhCPLpVNu0E\nMY9a3pIdNESmc0lKt4LF9Mi6lsSvtgUx4NpcugvY9mq/bsqtJmcvtAgSCS/lS7k0\nfCn7yK7/DQKBgQCEwRmgdIWSVyH0NIGxXe0d6nPBnLt7RhQLCs4xE8GybLpGrEoW\nv3/14QfJmpPDTxq5DMFuXMZ9Dpk1DzN4tjVImmvA+6lrshOW7iZ6MAnOgvNmwufg\nJOJN89W0CguwY+d7VRNIfsWa7ZJNvJdANHmhbdEPz+w9WxlMTijFW3OJ7QKBgDdG\nmnieBpv8sMwDJEcoKvgDjxNK6r38n6xBeXdLO4SQTQvmNuVPBqxvnaV2K9221q0k\nCC9PUQaRpmr5ZZTDi1OeE8Vwfzp1fWGayQrt1GgBzxF5yGIq7Bo56EU1QjSmVYJ0\nOmnbLFAkQMpMEZBNOR8C2uaBQ9irQ6XjJ+H2Ud5hAoGAGhNPi0TXSJMQk2cp0xdB\nStWhJFgKVZpey8h0dL7gVLJaQBeeQ9dNIULlHkG77WZB9jkog2b/PFHJKdDzmF8+\nK0RtKhFzwCTz8ha44icHrv5Y9KiOJs3zJp9MFOmKZNCh4JLaN4SmhgTwbID1orb0\nefSCHhvKs/VnS0bDei3T008=\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@purity-home-care.iam.gserviceaccount.com

CORS_ORIGIN=http://localhost:3000
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
- [Setup Guide](../docs/SETUP_GUIDE.md) - Detailed setup instructions
- [Architecture Documentation](../docs/ARCHITECTURE.md) - System architecture

