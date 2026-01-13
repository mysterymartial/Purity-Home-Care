import admin from 'firebase-admin';

export const initializeFirebase = (): void => {
  if (admin.apps.length === 0) {
    try {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || 'purity-home-care',
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@purity-home-care.iam.gserviceaccount.com',
      };

      // Validate required fields
      if (!serviceAccount.privateKey || !serviceAccount.clientEmail) {
        throw new Error('Firebase Admin credentials are missing. Please check your .env file.');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });

      console.log('✅ Firebase Admin initialized');
    } catch (error) {
      console.error('❌ Firebase initialization error:', error);
      throw error;
    }
  }
};

