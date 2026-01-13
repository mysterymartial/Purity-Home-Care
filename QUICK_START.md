# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

- [ ] Node.js 18+ installed (`node --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] MongoDB Atlas account created
- [ ] Firebase project created

## Step 1: Install Dependencies

```bash
# Frontend
cd frontend
pnpm install

# Backend
cd ../backend
pnpm install
```

## Step 2: Configure Environment Variables

### Frontend (.env.local)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)

Create `backend/.env`:

```env
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/purity-home-care?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
CORS_ORIGIN=http://localhost:3000
```

## Step 3: Add Logo

Place your logo at `frontend/public/logo.png`

## Step 4: Run the Application

### Terminal 1 - Backend
```bash
cd backend
pnpm dev
```

### Terminal 2 - Frontend
```bash
cd frontend
pnpm dev
```

## Step 5: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Admin Login**: http://localhost:3000/admin/login

## Need Help?

See [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) for detailed instructions.

