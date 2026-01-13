# Firebase Setup Guide - Complete Step-by-Step

## Step 1: Create Firebase Project

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Add project" or "Create a project"
   - Enter project name: `purity-home-care` (or your preferred name)
   - Click "Continue"

3. **Configure Google Analytics** (Optional)
   - You can disable Google Analytics for now (toggle it off)
   - Click "Create project"
   - Wait for project creation (30-60 seconds)
   - Click "Continue"

## Step 2: Enable Authentication

1. **Navigate to Authentication**
   - In the left sidebar, click "Authentication"
   - Click "Get started"

2. **Enable Email/Password Provider**
   - Click on "Sign-in method" tab
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

3. **Create Admin User**
   - Go to "Users" tab
   - Click "Add user"
   - Enter email: `admin@purity.com` (or your admin email)
   - Enter password: (create a strong password - save this!)
   - Click "Add user"
   - **IMPORTANT**: Save this email and password - you'll use it to log into the admin dashboard

## Step 3: Get Frontend Configuration (Web App Config)

1. **Go to Project Settings**
   - Click the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"

2. **Add Web App**
   - Scroll down to "Your apps" section
   - Click the web icon (`</>`)
   - Register app:
     - App nickname: `Purity Web App`
     - Firebase Hosting: (leave unchecked for now)
     - Click "Register app"

3. **Copy Configuration**
   - You'll see a config object like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "purity-home-care.firebaseapp.com",
     projectId: "purity-home-care",
     storageBucket: "purity-home-care.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdefghijklmnop"
   };
   ```

4. **Save These Values** - You'll need them for `frontend/.env.local`:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

## Step 4: Generate Service Account Key (For Backend)

1. **Go to Project Settings**
   - Still in Project Settings (gear icon)
   - Click on "Service accounts" tab

2. **Generate Private Key**
   - Click "Generate new private key"
   - A warning dialog will appear - click "Generate key"
   - A JSON file will download automatically
   - **IMPORTANT**: Save this file securely - it contains sensitive credentials

3. **Open the Downloaded JSON File**
   - The file will be named something like: `purity-home-care-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`
   - Open it in a text editor
   - You'll see content like:
   ```json
   {
     "type": "service_account",
     "project_id": "purity-home-care",
     "private_key_id": "xxxxx",
     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
     "client_email": "firebase-adminsdk-xxxxx@purity-home-care.iam.gserviceaccount.com",
     "client_id": "123456789012345678901",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     ...
   }
   ```

4. **Extract Values for Backend**
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the `\n` characters!)
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

## Step 5: Configure Frontend Environment Variables

1. **Create `frontend/.env.local` file**
   ```bash
   cd frontend
   # Create the file (or open in your editor)
   ```

2. **Add the following content** (replace with YOUR values from Step 3):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=purity-home-care.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=purity-home-care
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=purity-home-care.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
   ```

3. **Important Notes**:
   - Replace all values with YOUR actual values from Firebase
   - Do NOT add quotes around the values
   - Keep `NEXT_PUBLIC_API_URL=http://localhost:3001` for local development
   - For production, change to your backend URL

## Step 6: Configure Backend Environment Variables

1. **Create `backend/.env` file**
   ```bash
   cd backend
   # Create the file (or open in your editor)
   ```

2. **Add the following content** (replace with YOUR values from Step 4):
   ```env
   PORT=3001
   NODE_ENV=development
   
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/purity-home-care?retryWrites=true&w=majority
   
   FIREBASE_PROJECT_ID=purity-home-care
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@purity-home-care.iam.gserviceaccount.com
   
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Important Notes for FIREBASE_PRIVATE_KEY**:
   - The private key MUST be wrapped in double quotes `"`
   - Keep ALL the `\n` characters (they represent newlines)
   - Copy the ENTIRE private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
   - Example format:
     ```env
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
     ```

## Step 7: Verify Setup

1. **Test Frontend Connection**:
   ```bash
   cd frontend
   pnpm dev
   ```
   - Navigate to http://localhost:3000/admin/login
   - Try logging in with your admin credentials
   - If it works, Firebase frontend is configured correctly!

2. **Test Backend Connection**:
   ```bash
   cd backend
   pnpm dev
   ```
   - Check console for: `✅ Firebase Admin initialized`
   - If you see this message, Firebase backend is configured correctly!

## Troubleshooting

### Frontend Issues

**Error: "Firebase: Error (auth/invalid-api-key)"**
- Check that all `NEXT_PUBLIC_` variables are correct
- Make sure there are no extra spaces or quotes
- Restart the dev server after changing `.env.local`

**Error: "Firebase: Error (auth/network-request-failed)"**
- Check your internet connection
- Verify `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is correct

### Backend Issues

**Error: "Firebase initialization error"**
- Check `FIREBASE_PRIVATE_KEY` is wrapped in quotes
- Verify `\n` characters are present in the private key
- Make sure `FIREBASE_CLIENT_EMAIL` matches the service account email
- Verify `FIREBASE_PROJECT_ID` matches your project ID

**Error: "Unauthorized: Invalid token"**
- Make sure Firebase Admin SDK is initialized correctly
- Check that the service account key is valid
- Verify the private key format is correct

## Security Best Practices

1. **Never commit `.env` files to Git**
   - They're already in `.gitignore`
   - Never share these files publicly

2. **Use different Firebase projects for development and production**
   - Create separate projects
   - Use different environment variables

3. **Rotate service account keys regularly**
   - Generate new keys periodically
   - Delete old unused keys

4. **Restrict Firebase Authentication**
   - Only allow specific email domains if possible
   - Use strong passwords for admin accounts

## Next Steps

After completing Firebase setup:
1. Complete MongoDB Atlas setup (see `MONGODB_SETUP.md`)
2. Test the admin login functionality
3. Verify real-time features work

---

**Need Help?** Check the main `SETUP_GUIDE.md` for additional troubleshooting tips.

