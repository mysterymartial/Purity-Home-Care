# Architecture Documentation - Purity Home Care Platform

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Layer Architecture](#layer-architecture)
4. [Class Diagram](#class-diagram)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Design Patterns](#design-patterns)

## Overview

The Purity Home Care platform follows a **layered architecture** pattern, separating concerns into distinct layers for maintainability, testability, and scalability.

## System Architecture

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
│  │           SERVICE LAYER                           │     │
│  │  ┌──────────────┐  ┌──────────────┐              │     │
│  │  │ Chat Service │  │Review Service│              │     │
│  │  └──────┬───────┘  └──────┬───────┘              │     │
│  └─────────┼─────────────────┼───────────────────────┘     │
│            │                 │                              │
│  ┌─────────▼─────────────────▼───────────────────────┐     │
│  │         REPOSITORY LAYER                           │     │
│  │  ┌──────────────┐  ┌──────────────┐              │     │
│  │  │ChatSession   │  │   Review     │              │     │
│  │  │Repository    │  │  Repository  │              │     │
│  │  └──────┬───────┘  └──────┬───────┘              │     │
│  └─────────┼─────────────────┼───────────────────────┘     │
│            │                 │                              │
│  ┌─────────▼─────────────────▼───────────────────────┐     │
│  │         PERSISTENT LAYER                           │     │
│  │  ┌──────────────┐  ┌──────────────┐              │     │
│  │  │   MongoDB    │  │   Mongoose   │              │     │
│  │  │    Atlas     │  │    Models    │              │     │
│  │  └──────────────┘  └──────────────┘              │     │
│  └───────────────────────────────────────────────────┘     │
│                                                             │
│  ┌───────────────────────────────────────────────────┐     │
│  │         EXTERNAL SERVICES                         │     │
│  │  ┌──────────────┐  ┌──────────────┐             │     │
│  │  │   Firebase   │  │   WhatsApp   │             │     │
│  │  │   Admin SDK  │  │   Deep Link  │             │     │
│  │  └──────────────┘  └──────────────┘             │     │
│  └───────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Layer Architecture

### 1. Presentation Layer

**Location**: `backend/src/presentation/`

**Responsibilities**:
- Handle HTTP requests and responses
- Route management
- Request validation
- Authentication/Authorization middleware
- WebSocket event handling

**Components**:
- **Routes** (`routes/`): Define API endpoints
- **Controllers** (`controllers/`): Handle request/response logic
- **Middleware** (`middleware/`): Authentication, validation, error handling
- **Socket Handlers** (`socket/`): Real-time communication

**Example Flow**:
```
Request → Route → Middleware → Controller → Service
```

### 2. Service Layer

**Location**: `backend/src/services/`

**Responsibilities**:
- Business logic implementation
- Data transformation
- Orchestration of multiple repositories
- Validation rules
- Error handling

**Components**:
- `ChatSessionService`: Manages chat sessions and messages
- `ReviewService`: Handles review creation and moderation

**Key Principles**:
- Services are stateless
- Services coordinate between repositories
- Business rules live here

### 3. Repository Layer

**Location**: `backend/src/repositories/`

**Responsibilities**:
- Abstract database operations
- Provide clean interface for data access
- Handle database-specific logic
- Query optimization

**Components**:
- `ChatSessionRepository`: CRUD operations for chat sessions
- `MessageRepository`: Message data access
- `ReviewRepository`: Review data access

**Key Principles**:
- One repository per entity
- Methods return domain models
- No business logic in repositories

### 4. Persistent Layer

**Location**: `backend/src/persistent/models/`

**Responsibilities**:
- Define data schemas
- Database model definitions
- Data validation at model level

**Components**:
- `ChatSession.model.ts`: Chat session schema
- `Message.model.ts`: Message schema
- `Review.model.ts`: Review schema

### 5. DTO Layer

**Location**: `backend/src/dto/`

**Responsibilities**:
- Define data transfer objects
- Type safety for API contracts
- Request/Response shape definitions

**Components**:
- `ChatSession.dto.ts`: Chat session DTOs
- `Message.dto.ts`: Message DTOs
- `Review.dto.ts`: Review DTOs

## Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐
│ ChatSessionCtrl  │      │  ReviewController│
├──────────────────┤      ├──────────────────┤
│ +createSession() │      │ +createReview()  │
│ +getSession()    │      │ +getApproved()   │
│ +createMessage() │      │ +approveReview() │
│ +getMessages()   │      │ +rejectReview()  │
└────────┬─────────┘      └────────┬─────────┘
         │                        │
         │ uses                  │ uses
         ▼                        ▼
┌──────────────────┐      ┌──────────────────┐
│ ChatSessionSvc   │      │   ReviewService  │
├──────────────────┤      ├──────────────────┤
│ +createSession() │      │ +createReview()  │
│ +getSession()    │      │ +getApproved()   │
│ +createMessage() │      │ +approveReview() │
│ +getMessages()   │      │ +rejectReview()  │
└────────┬─────────┘      └────────┬─────────┘
         │                        │
         │ uses                  │ uses
         ▼                        ▼
┌──────────────────┐      ┌──────────────────┐
│ChatSessionRepo   │      │  ReviewRepository│
├──────────────────┤      ├──────────────────┤
│ +create()        │      │ +create()        │
│ +findById()      │      │ +findApproved()  │
│ +findAll()       │      │ +approve()       │
│ +updateStatus()  │      │ +reject()        │
└────────┬─────────┘      └────────┬─────────┘
         │                        │
         │ uses                  │ uses
         ▼                        ▼
┌──────────────────┐      ┌──────────────────┐
│ ChatSessionModel │      │   ReviewModel    │
│  (Mongoose)      │      │   (Mongoose)     │
└──────────────────┘      └──────────────────┘

┌──────────────────┐
│  MessageRepository│
├──────────────────┤
│ +create()        │
│ +findBySessionId()│
└────────┬─────────┘
         │
         │ uses
         ▼
┌──────────────────┐
│  MessageModel    │
│  (Mongoose)      │
└──────────────────┘
```

## Data Flow

### Request Flow (Create Chat Session)

```
1. Client → POST /api/chat/sessions
   ↓
2. Route Handler (chat.routes.ts)
   ↓
3. Controller (ChatSessionController.createSession)
   ↓
4. Service (ChatSessionService.createSession)
   ↓
5. Repository (ChatSessionRepository.create)
   ↓
6. Model (ChatSessionModel.save)
   ↓
7. MongoDB Atlas
   ↓
8. Response flows back up the layers
```

### Real-time Message Flow

```
1. Client → Socket.IO emit('message')
   ↓
2. Socket Handler (socket.handler.ts)
   ↓
3. Service (ChatSessionService.createMessage)
   ↓
4. Repository (MessageRepository.create)
   ↓
5. Model (MessageModel.save)
   ↓
6. MongoDB Atlas
   ↓
7. Socket.IO broadcast to all clients in room
```

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **Firebase Auth**: Client-side authentication
- **Socket.IO Client**: Real-time communication

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **TypeScript**: Type safety
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **Socket.IO**: WebSocket library
- **Firebase Admin SDK**: Server-side authentication

## Design Patterns

### 1. Repository Pattern

**Purpose**: Abstract data access logic

**Implementation**:
```typescript
class ChatSessionRepository {
  async create(data: CreateChatSessionDTO): Promise<IChatSession>
  async findById(id: string): Promise<IChatSession | null>
  async findAll(): Promise<IChatSession[]>
}
```

**Benefits**:
- Easy to swap data sources
- Testable with mock repositories
- Centralized data access logic

### 2. Service Layer Pattern

**Purpose**: Encapsulate business logic

**Implementation**:
```typescript
class ChatSessionService {
  private repository: ChatSessionRepository;
  
  async createSession(): Promise<ChatSessionResponseDTO> {
    // Business logic here
    const customerId = uuidv4();
    return await this.repository.create({ customerId });
  }
}
```

**Benefits**:
- Separation of concerns
- Reusable business logic
- Easy to test

### 3. DTO Pattern

**Purpose**: Define data contracts

**Implementation**:
```typescript
interface CreateChatSessionDTO {
  customerId: string;
}

interface ChatSessionResponseDTO {
  _id: string;
  customerId: string;
  status: string;
  createdAt: string;
}
```

**Benefits**:
- Type safety
- Clear API contracts
- Version control for APIs

### 4. Middleware Pattern

**Purpose**: Cross-cutting concerns

**Implementation**:
```typescript
export const authenticateAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Authentication logic
  next();
};
```

**Benefits**:
- Reusable authentication
- Clean route definitions
- Easy to add new middleware

## Database Schema

### ChatSession Collection

```typescript
{
  _id: ObjectId,
  customerId: String (UUID, unique, indexed),
  status: Enum ['Pending', 'Confirmed', 'Completed'],
  createdAt: Date,
  updatedAt: Date
}
```

### Message Collection

```typescript
{
  _id: ObjectId,
  chatSessionId: ObjectId (ref: ChatSession, indexed),
  sender: Enum ['customer', 'admin'],
  content: String,
  timestamp: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Review Collection

```typescript
{
  _id: ObjectId,
  rating: Number (1-5),
  text: String (optional, max 1000),
  approved: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Considerations

1. **Authentication**: Firebase Admin SDK for admin routes
2. **Authorization**: Middleware checks user roles
3. **Input Validation**: Express-validator for request validation
4. **CORS**: Configured for specific origins
5. **Environment Variables**: Secrets stored in `.env` files
6. **MongoDB**: Connection string with authentication

## Scalability Considerations

1. **Horizontal Scaling**: Stateless services allow multiple instances
2. **Database**: MongoDB Atlas supports sharding
3. **Caching**: Can add Redis for session caching
4. **Load Balancing**: Express apps can be load balanced
5. **WebSocket**: Socket.IO supports Redis adapter for multi-server

## Future Enhancements

1. **Caching Layer**: Redis for frequently accessed data
2. **Message Queue**: RabbitMQ/Kafka for async processing
3. **File Storage**: AWS S3 for file uploads
4. **Monitoring**: Application performance monitoring
5. **Logging**: Centralized logging system
6. **Testing**: Unit and integration tests
7. **API Documentation**: Swagger/OpenAPI

## Conclusion

This layered architecture provides:

- **Maintainability**: Clear separation of concerns
- **Testability**: Each layer can be tested independently
- **Scalability**: Easy to scale individual layers
- **Flexibility**: Easy to modify or extend functionality

The architecture follows industry best practices and can evolve as the application grows.

