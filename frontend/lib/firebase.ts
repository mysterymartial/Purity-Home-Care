import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration (non-blocking, logs warning only)
const validateFirebaseConfig = () => {
  const requiredFields = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingFields = requiredFields.filter(
    (field) => !process.env[field]
  );

  if (missingFields.length > 0) {
    console.warn('Firebase configuration warning: Missing environment variables:', missingFields);
    // Don't throw - allow app to load, Firebase will fail gracefully when used
  }
};

// Initialize Firebase
let app: FirebaseApp | null = null;
if (!getApps().length) {
  try {
    validateFirebaseConfig();
    // Only initialize if we have the minimum required config
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      app = initializeApp(firebaseConfig);
    } else {
      console.warn('Firebase not initialized: Missing required configuration');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Don't throw - allow app to continue without Firebase
    app = null;
  }
} else {
  app = getApps()[0];
}

// Create auth instance only if app is initialized
let authInstance: Auth | null = null;
try {
  if (app) {
    authInstance = getAuth(app);
  }
} catch (error) {
  console.error('Failed to initialize Firebase Auth:', error);
  authInstance = null;
}

export const auth = authInstance;

/**
 * Safely get Firebase ID token with error handling
 * @param forceRefresh - Whether to force token refresh
 * @returns Promise<string | null> - Token string or null if error
 */
export const getAuthToken = async (forceRefresh: boolean = false): Promise<string | null> => {
  try {
    if (!auth || !auth.currentUser) {
      return null;
    }
    const token = await auth.currentUser.getIdToken(forceRefresh);
    return token;
  } catch (error: any) {
    console.error('Error getting auth token:', error);
    // Handle specific Firebase token errors
    if (error?.code === 'auth/user-token-expired' || 
        error?.code === 'auth/invalid-user-token' ||
        error?.code === 'auth/user-disabled') {
      // Token expired or user disabled - sign out
      if (auth) {
        await auth.signOut();
      }
    }
    return null;
  }
};

export default app;

