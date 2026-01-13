# Setup Guide - Purity Home Care Platform

This guide will walk you through setting up the Purity Home Care service booking platform from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Firebase Setup](#firebase-setup)
4. [Frontend Setup](#frontend-setup)
5. [Backend Setup](#backend-setup)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0 or higher installed
- **pnpm** package manager installed (`npm install -g pnpm`)
- A **MongoDB Atlas** account (free tier is sufficient)
- A **Firebase** project (free tier is sufficient)
- A code editor (VS Code recommended)

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization (or use default)
4. Create a new project (e.g., "Purity Home Care")

### Step 2: Create a Cluster

1. Click "Build a Database"
2. Choose the **FREE** (M0) tier
3. Select a cloud provider and region (choose closest to you)
4. Give your cluster a name (e.g., "purity-cluster")
5. Click "Create"

### Step 3: Configure Database Access

1. Go to **Database Access** in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password (save these!)
5. Set user privileges to "Atlas admin" (for development)
6. Click "Add User"

### Step 4: Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict to specific IPs
4. Click "Confirm"

### Step 5: Get Connection String

1. Go to **Database** in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `purity-home-care`

**Example connection string:**
```
mongodb+srv://username:password@purity-cluster.xxxxx.mongodb.net/purity-home-care?retryWrites=true&w=majority
```

## Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "purity-home-care")
4. Disable Google Analytics (optional for development)
5. Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click "Save"

### Step 3: Create Admin User

1. Go to **Authentication** > **Users**
2. Click "Add user"
3. Enter admin email (e.g., `admin@purity.com`)
4. Set a strong password
5. Click "Add user"
6. **Note**: You'll use this to log into the admin dashboard

### Step 4: Get Frontend Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (`</>`)
4. Register app with a nickname (e.g., "Purity Web App")
5. Copy the Firebase configuration object

**You'll need these values:**
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

### Step 5: Generate Service Account Key (for Backend)

1. Go to **Project Settings** > **Service accounts**
2. Click "Generate new private key"
3. Click "Generate key" (JSON file will download)
4. **Save this file securely** - you'll need it for backend configuration

**From the JSON file, you'll need:**
- `project_id`
- `private_key`
- `client_email`

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd frontend
pnpm install
```

### Step 2: Configure Environment Variables

1. Create `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

2. Replace all values with your Firebase configuration from Step 4 above.

### Step 3: Add Logo

1. Place your logo file as `frontend/public/logo.png`
2. The logo should be a square image (recommended: 200x200px or larger)
3. Supported formats: PNG, JPG, SVG

### Step 4: Start Development Server

```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## Backend Setup

### Step 1: Install Dependencies

```bash
cd backend
pnpm install
```

### Step 2: Configure Environment Variables

1. Create `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/purity-home-care?retryWrites=true&w=majority

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# CORS
CORS_ORIGIN=http://localhost:3000
```

2. **Important**: 
   - Replace `MONGODB_URI` with your MongoDB Atlas connection string
   - Replace `FIREBASE_PROJECT_ID` with your Firebase project ID
   - Replace `FIREBASE_PRIVATE_KEY` with the private key from the service account JSON (keep the quotes and `\n` characters)
   - Replace `FIREBASE_CLIENT_EMAIL` with the client_email from the service account JSON

### Step 3: Build the Project

```bash
pnpm build
```

### Step 4: Start Development Server

```bash
pnpm dev
```

The backend API will be available at `http://localhost:3001`

## Running the Application

### Development Mode

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   pnpm dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   pnpm dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

### Production Build

1. **Build Backend:**
   ```bash
   cd backend
   pnpm build
   pnpm start
   ```

2. **Build Frontend:**
   ```bash
   cd frontend
   pnpm build
   pnpm start
   ```

## Testing the Setup

### 1. Test Backend Health

```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

### 2. Test Frontend

1. Navigate to `http://localhost:3000`
2. You should see the landing page
3. Click "Schedule Consultation" to test booking flow
4. Try the chat functionality

### 3. Test Admin Dashboard

1. Navigate to `http://localhost:3000/admin/login`
2. Log in with the admin credentials you created in Firebase
3. You should see the admin dashboard

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoServerError: Authentication failed`

**Solution**: 
- Verify your MongoDB username and password are correct
- Ensure the database user has proper permissions
- Check that your IP address is whitelisted in Network Access

**Error**: `MongooseServerSelectionError`

**Solution**:
- Verify your connection string is correct
- Check that your cluster is running
- Ensure your IP is whitelisted

### Firebase Authentication Issues

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solution**:
- Verify all Firebase environment variables in `.env.local` are correct
- Ensure you're using the web app configuration, not iOS/Android

**Error**: `Firebase Admin: Error initializing`

**Solution**:
- Verify the private key in `.env` is correctly formatted (with `\n` characters)
- Ensure the private key is wrapped in quotes
- Check that `FIREBASE_CLIENT_EMAIL` matches the service account email

### Socket.IO Connection Issues

**Error**: `Socket connection failed`

**Solution**:
- Ensure backend is running on port 3001
- Check CORS_ORIGIN in backend `.env` matches frontend URL
- Verify Socket.IO server is initialized in backend

### Port Already in Use

**Error**: `Port 3000/3001 is already in use`

**Solution**:
```bash
# Find and kill the process
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Environment Variables Not Loading

**Solution**:
- Ensure `.env` files are in the correct directories
- Restart the development servers after changing `.env` files
- For Next.js, ensure variables start with `NEXT_PUBLIC_` for client-side access

## Next Steps

After successful setup:

1. **Customize the Logo**: Replace `frontend/public/logo.png` with your logo
2. **Update Content**: Modify landing page content in `frontend/app/page.tsx`
3. **Configure WhatsApp**: Update WhatsApp number in booking page
4. **Set Up Production**: Configure production environment variables
5. **Deploy**: Deploy to Vercel (frontend) and Railway/Render (backend)

## Support

If you encounter issues not covered here:

1. Check the [Architecture Documentation](./ARCHITECTURE.md)
2. Review error logs in terminal
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed

For additional help, contact: care@purity.com

