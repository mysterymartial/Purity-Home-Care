# Product Requirements Document (PRD)
## Purity Home Care - Service Booking Platform

**Version:** 1.0  
**Date:** January 2026  
**Status:** Production Ready  
**Document Owner:** Product Team

---

## 1. Executive Summary

### 1.1 Product Overview
Purity Home Care is a comprehensive service-booking web application that enables families to book professional home care services through multiple channels. The platform provides real-time chat support, review management, and an administrative dashboard for service coordination.

### 1.2 Business Objectives
- Streamline service booking process
- Provide 24/7 customer support via chat
- Enable transparent review system
- Facilitate efficient admin management
- Increase customer satisfaction and trust

### 1.3 Success Metrics
- Booking conversion rate
- Average response time in chat
- Customer satisfaction score (from reviews)
- Admin efficiency metrics
- System uptime and reliability

---

## 2. Product Scope

### 2.1 In Scope
- Landing page with service information
- Service booking via in-app chat or WhatsApp
- Real-time chat system
- Review submission and moderation
- Admin dashboard for chat and review management
- Firebase authentication for admin access
- MongoDB database for data persistence

### 2.2 Out of Scope (Future Enhancements)
- Payment processing
- Caregiver scheduling system
- Mobile native applications
- Email notifications
- SMS notifications
- Multi-language support
- Advanced analytics dashboard

---

## 3. User Personas

### 3.1 Primary User: Family Member/Customer
- **Demographics:** Adults aged 30-70, caring for elderly family members
- **Goals:** Find reliable home care services quickly
- **Pain Points:** Limited time, need for trustworthy service
- **Tech Savviness:** Moderate to high

### 3.2 Secondary User: Admin/Support Staff
- **Demographics:** Healthcare coordinators, customer service representatives
- **Goals:** Manage bookings efficiently, respond to customer inquiries
- **Pain Points:** Multiple communication channels, need for quick responses
- **Tech Savviness:** High

---

## 4. User Stories

### 4.1 Customer Stories

**US-001: View Services**
- **As a** potential customer
- **I want to** view available home care services
- **So that** I can understand what services are offered

**US-002: Book Service via Chat**
- **As a** customer
- **I want to** book a service through in-app chat
- **So that** I can get immediate assistance without leaving the website

**US-003: Book Service via WhatsApp**
- **As a** customer
- **I want to** book a service via WhatsApp
- **So that** I can use my preferred messaging app

**US-004: Submit Review**
- **As a** customer
- **I want to** submit a review with rating and feedback
- **So that** I can share my experience and help others

**US-005: View Approved Reviews**
- **As a** potential customer
- **I want to** view approved reviews from other families
- **So that** I can make informed decisions

### 4.2 Admin Stories

**US-006: Admin Login**
- **As an** admin
- **I want to** log in securely using Firebase authentication
- **So that** I can access the admin dashboard

**US-007: View Chat Sessions**
- **As an** admin
- **I want to** view all active chat sessions
- **So that** I can manage customer inquiries

**US-008: Respond to Customers**
- **As an** admin
- **I want to** send messages to customers in real-time
- **So that** I can provide immediate support

**US-009: Update Booking Status**
- **As an** admin
- **I want to** update booking status (Pending/Confirmed/Completed)
- **So that** I can track service progress

**US-010: Moderate Reviews**
- **As an** admin
- **I want to** approve or reject customer reviews
- **So that** I can maintain quality and authenticity

**US-011: Create Google Meet**
- **As an** admin
- **I want to** create Google Meet links for consultations
- **So that** I can conduct video consultations with customers

---

## 5. Functional Requirements

### 5.1 Landing Page (FR-001)
**Priority:** High  
**Description:** Marketing-focused homepage showcasing services and company information

**Requirements:**
- Display hero section with CTA buttons
- Show service cards (Companion Care, Personal Care, Medication Management, Specialized Care)
- Display "Our Process" section (4-step process)
- Show "Why Choose Us" section with key features
- Display approved customer reviews with star ratings
- Include footer with contact information and WhatsApp link
- Mobile responsive design

**Acceptance Criteria:**
- All sections load correctly
- Navigation links work
- CTA buttons redirect to booking page
- Reviews display from database
- Page is fully responsive

### 5.2 Booking Page (FR-002)
**Priority:** High  
**Description:** Page allowing customers to choose booking method

**Requirements:**
- Two booking options:
  - "Book on App" → Navigate to `/chat`
  - "Book on WhatsApp" → Open WhatsApp with pre-filled message
- Service assurance badges
- Clear instructions

**Acceptance Criteria:**
- Both booking options work correctly
- WhatsApp link opens with correct phone number and message
- Page is mobile responsive

### 5.3 Chat System (FR-003)
**Priority:** High  
**Description:** Real-time chat interface for customer support

**Requirements:**
- Create chat session automatically (no authentication required)
- Display message history
- Send and receive messages in real-time
- Typing indicator
- Auto-scroll to latest message
- "Continue on WhatsApp" button
- Session persistence via localStorage

**Acceptance Criteria:**
- Messages send and receive in real-time
- Socket.IO connection works
- Message history loads correctly
- Session persists across page refreshes

### 5.4 Review Submission (FR-004)
**Priority:** Medium  
**Description:** Allow customers to submit reviews

**Requirements:**
- Star rating input (1-5 stars)
- Optional text review
- Service selection dropdown
- Date picker
- Submit to backend
- Show success message

**Acceptance Criteria:**
- Rating validation (1-5)
- Form submission works
- Success message displays
- Review saved to database

### 5.5 Admin Dashboard (FR-005)
**Priority:** High  
**Description:** Admin interface for managing chats and reviews

**Requirements:**
- Firebase authentication required
- Chat inbox showing all sessions
- Chat conversation view
- Send messages as admin
- Update booking status dropdown
- Reviews moderation panel
- Approve/Reject review buttons
- Google Meet link button
- Search functionality

**Acceptance Criteria:**
- Only authenticated admins can access
- All chat sessions display
- Admin can send messages
- Status updates work
- Review moderation works

### 5.6 Admin Authentication (FR-006)
**Priority:** High  
**Description:** Secure admin login system

**Requirements:**
- Firebase email/password authentication
- Login page at `/admin/login`
- Redirect to dashboard on success
- Error handling for invalid credentials
- Token-based session management

**Acceptance Criteria:**
- Valid credentials allow access
- Invalid credentials show error
- Redirects work correctly
- Token stored securely

---

## 6. Technical Requirements

### 6.1 Frontend Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase SDK
- **Real-time:** Socket.IO Client
- **Icons:** Lucide React
- **Date Handling:** date-fns
- **Testing:** Jest, React Testing Library

### 6.2 Backend Technology Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Real-time:** Socket.IO
- **Authentication:** Firebase Admin SDK
- **Testing:** Jest, ts-jest, Supertest

### 6.3 Architecture Requirements
- **Pattern:** Layered Architecture
  - Presentation Layer (Routes, Controllers, Middleware)
  - Service Layer (Business Logic)
  - Repository Layer (Data Access)
  - Persistent Layer (Database Models)
  - DTO Layer (Data Transfer Objects)

### 6.4 Database Schema

**ChatSession Collection:**
```typescript
{
  _id: ObjectId,
  customerId: String (UUID, unique, indexed),
  status: Enum ['Pending', 'Confirmed', 'Completed'],
  createdAt: Date,
  updatedAt: Date
}
```

**Message Collection:**
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

**Review Collection:**
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

### 6.5 API Requirements

**RESTful API Endpoints:**
- All endpoints return JSON
- Error responses include error messages
- Admin endpoints require Bearer token authentication
- CORS enabled for frontend origin

**WebSocket Requirements:**
- Socket.IO for real-time messaging
- Room-based messaging (by session ID)
- Typing indicators
- Connection management

### 6.6 Security Requirements
- Firebase authentication for admin access
- JWT token verification for protected routes
- Input validation on all endpoints
- CORS configuration
- Environment variables for secrets
- No sensitive data in client-side code

### 6.7 Performance Requirements
- Page load time < 3 seconds
- API response time < 500ms
- Real-time message delivery < 100ms
- Support 100+ concurrent chat sessions
- Database queries optimized with indexes

### 6.8 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 7. Non-Functional Requirements

### 7.1 Usability
- Intuitive navigation
- Clear call-to-action buttons
- Responsive design for all devices
- Accessible color contrast
- Loading states for async operations
- Error messages are user-friendly

### 7.2 Reliability
- 99.9% uptime target
- Graceful error handling
- Database connection retry logic
- Socket.IO reconnection handling

### 7.3 Scalability
- Stateless services for horizontal scaling
- Database connection pooling
- Efficient database queries
- Caching strategy (future)

### 7.4 Maintainability
- Clean code architecture
- Comprehensive documentation
- Unit tests with good coverage
- TypeScript for type safety
- Consistent coding standards

### 7.5 Security
- HTTPS in production
- Secure authentication
- Input sanitization
- SQL injection prevention (N/A - using MongoDB)
- XSS prevention
- CSRF protection (via SameSite cookies)

---

## 8. User Flows

### 8.1 Customer Booking Flow
1. Customer visits landing page
2. Clicks "Schedule Consultation" or "Book a Service"
3. Redirected to booking page
4. Chooses booking method:
   - **Option A:** In-App Chat
     - Redirected to chat page
     - Chat session created automatically
     - Customer sends message
     - Admin responds in real-time
   - **Option B:** WhatsApp
     - WhatsApp opens with pre-filled message
     - Customer continues conversation on WhatsApp

### 8.2 Review Submission Flow
1. Customer visits review page
2. Selects star rating (1-5)
3. Optionally selects service and date
4. Optionally writes text review
5. Submits review
6. Review saved to database (pending approval)
7. Success message displayed
8. Redirected to landing page

### 8.3 Admin Management Flow
1. Admin visits `/admin/login`
2. Enters email and password
3. Authenticated via Firebase
4. Redirected to dashboard
5. Views chat sessions or reviews
6. Takes action (respond, update status, approve/reject)
7. Changes saved to database

---

## 9. API Specifications

### 9.1 Chat Endpoints

**POST /api/chat/sessions**
- **Description:** Create new chat session
- **Auth:** None required
- **Request Body:** None
- **Response:** `ChatSessionResponseDTO`
- **Status Codes:** 201 Created, 500 Internal Server Error

**GET /api/chat/sessions/:sessionId**
- **Description:** Get chat session details
- **Auth:** None required
- **Response:** `ChatSessionResponseDTO`
- **Status Codes:** 200 OK, 404 Not Found

**GET /api/chat/sessions/:sessionId/messages**
- **Description:** Get all messages for a session
- **Auth:** None required
- **Response:** `MessageResponseDTO[]`
- **Status Codes:** 200 OK

**POST /api/chat/sessions/:sessionId/messages**
- **Description:** Send message (customer)
- **Auth:** None required
- **Request Body:** `{ content: string }`
- **Response:** `MessageResponseDTO`
- **Status Codes:** 201 Created, 400 Bad Request, 500 Internal Server Error

### 9.2 Review Endpoints

**POST /api/reviews**
- **Description:** Submit review
- **Auth:** None required
- **Request Body:** `{ rating: number, text?: string }`
- **Response:** `ReviewResponseDTO`
- **Status Codes:** 201 Created, 400 Bad Request

**GET /api/reviews/approved**
- **Description:** Get approved reviews
- **Auth:** None required
- **Response:** `ReviewResponseDTO[]`
- **Status Codes:** 200 OK

### 9.3 Admin Endpoints

**GET /api/admin/chat/sessions**
- **Description:** Get all chat sessions
- **Auth:** Bearer token required
- **Response:** `ChatSessionResponseDTO[]`
- **Status Codes:** 200 OK, 401 Unauthorized

**GET /api/admin/chat/sessions/:sessionId/messages**
- **Description:** Get messages for a session
- **Auth:** Bearer token required
- **Response:** `MessageResponseDTO[]`
- **Status Codes:** 200 OK, 401 Unauthorized

**POST /api/admin/chat/sessions/:sessionId/messages**
- **Description:** Send admin message
- **Auth:** Bearer token required
- **Request Body:** `{ content: string }`
- **Response:** `MessageResponseDTO`
- **Status Codes:** 201 Created, 401 Unauthorized, 400 Bad Request

**PATCH /api/admin/chat/sessions/:sessionId/status**
- **Description:** Update booking status
- **Auth:** Bearer token required
- **Request Body:** `{ status: 'Pending' | 'Confirmed' | 'Completed' }`
- **Response:** `ChatSessionResponseDTO`
- **Status Codes:** 200 OK, 400 Bad Request, 401 Unauthorized, 404 Not Found

**GET /api/admin/reviews**
- **Description:** Get all reviews (approved and pending)
- **Auth:** Bearer token required
- **Response:** `ReviewResponseDTO[]`
- **Status Codes:** 200 OK, 401 Unauthorized

**PATCH /api/admin/reviews/:reviewId/approve**
- **Description:** Approve review
- **Auth:** Bearer token required
- **Response:** `ReviewResponseDTO`
- **Status Codes:** 200 OK, 401 Unauthorized, 404 Not Found

**DELETE /api/admin/reviews/:reviewId/reject**
- **Description:** Reject/delete review
- **Auth:** Bearer token required
- **Response:** 204 No Content
- **Status Codes:** 204 No Content, 401 Unauthorized, 404 Not Found

---

## 10. Data Models

### 10.1 ChatSession
```typescript
interface ChatSession {
  _id: string;
  customerId: string; // UUID
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```

### 10.2 Message
```typescript
interface Message {
  _id: string;
  chatSessionId: string;
  sender: 'customer' | 'admin';
  content: string;
  timestamp: string; // ISO date
}
```

### 10.3 Review
```typescript
interface Review {
  _id: string;
  rating: number; // 1-5
  text?: string; // Optional, max 1000 chars
  approved: boolean;
  createdAt: string; // ISO date
}
```

---

## 11. Integration Requirements

### 11.1 Firebase Integration
- **Purpose:** Admin authentication
- **Frontend:** Firebase SDK for login
- **Backend:** Firebase Admin SDK for token verification
- **Configuration:** Environment variables

### 11.2 MongoDB Atlas Integration
- **Purpose:** Data persistence
- **Connection:** MongoDB connection string
- **ODM:** Mongoose
- **Collections:** ChatSession, Message, Review

### 11.3 Socket.IO Integration
- **Purpose:** Real-time messaging
- **Frontend:** Socket.IO Client
- **Backend:** Socket.IO Server
- **Events:** message, typing

### 11.4 WhatsApp Integration
- **Purpose:** Alternative booking channel
- **Implementation:** Deep link with pre-filled message
- **Format:** `https://wa.me/{phoneNumber}?text={message}`
- **Phone Number:** +1 (215) 617-8614

### 11.5 Google Meet Integration
- **Purpose:** Video consultations
- **Implementation:** Direct link to `https://meet.google.com/new`
- **Access:** Admin dashboard only

---

## 12. Testing Requirements

### 12.1 Unit Testing
- **Coverage Target:** 80%+
- **Scope:** Services, Controllers, Utilities
- **Framework:** Jest
- **Focus Areas:**
  - Boundary value analysis
  - Edge cases
  - Error handling
  - Business logic validation

### 12.2 Integration Testing
- **Scope:** API endpoints
- **Framework:** Jest + Supertest
- **Focus Areas:**
  - Endpoint functionality
  - Authentication
  - Data persistence
  - Error responses

### 12.3 E2E Testing (Future)
- **Scope:** Critical user flows
- **Framework:** Playwright/Cypress (future)

---

## 13. Deployment Requirements

### 13.1 Environment Setup
- **Frontend:** Vercel, Netlify, or similar
- **Backend:** Railway, Render, AWS, or similar
- **Database:** MongoDB Atlas (cloud)
- **Environment Variables:** Configured per environment

### 13.2 Build Process
- **Frontend:** `pnpm build` → Static export
- **Backend:** `pnpm build` → TypeScript compilation
- **CI/CD:** Automated deployment (future)

### 13.3 Monitoring (Future)
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring
- Analytics

---

## 14. Success Criteria

### 14.1 Functional Success
- ✅ All user stories implemented
- ✅ All API endpoints working
- ✅ Real-time chat functional
- ✅ Admin dashboard operational
- ✅ Review system working

### 14.2 Technical Success
- ✅ Code follows architecture patterns
- ✅ Unit tests passing
- ✅ No critical bugs
- ✅ Performance targets met
- ✅ Security requirements met

### 14.3 Business Success
- ✅ Booking conversion rate > 5%
- ✅ Average chat response time < 2 minutes
- ✅ Customer satisfaction > 4.5/5
- ✅ System uptime > 99.5%

---

## 15. Risk Assessment

### 15.1 Technical Risks
- **Risk:** MongoDB connection failures
  - **Mitigation:** Connection retry logic, error handling
- **Risk:** Socket.IO connection issues
  - **Mitigation:** Reconnection handling, fallback to polling
- **Risk:** Firebase authentication failures
  - **Mitigation:** Error handling, fallback mechanisms

### 15.2 Business Risks
- **Risk:** Low adoption rate
  - **Mitigation:** Marketing, user education
- **Risk:** High support volume
  - **Mitigation:** Admin training, documentation

---

## 16. Future Enhancements

### 16.1 Phase 2 Features
- Payment processing integration
- Email notifications
- SMS notifications
- Caregiver scheduling system
- Advanced analytics dashboard

### 16.2 Phase 3 Features
- Mobile native applications
- Multi-language support
- AI-powered chat assistance
- Automated booking confirmations
- Customer portal

---

## 17. Appendices

### 17.1 Glossary
- **Chat Session:** A conversation between customer and admin
- **Booking Status:** Current state of service booking (Pending/Confirmed/Completed)
- **Review Moderation:** Process of approving or rejecting customer reviews

### 17.2 References
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Socket.IO Documentation](https://socket.io/docs/)

### 17.3 Change Log
- **v1.0** (January 2026): Initial production release

---

## 18. Approval

**Product Manager:** _________________  
**Engineering Lead:** _________________  
**Design Lead:** _________________  
**Date:** _________________

---

**Document Status:** ✅ Approved for Production  
**Last Updated:** January 2026

