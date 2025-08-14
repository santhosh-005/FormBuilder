const { initializeApp, getApps, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

// Initialize Firebase Admin SDK
let firebaseApp;

try {
  if (getApps().length === 0) {
    // Validate required environment variable
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required but not found');
    }

    // Parse the service account key from environment variable
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (parseError) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY must be a valid JSON string');
    }

    // Fix escaped newlines in private_key
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }

    // Validate required fields in service account
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Invalid service account JSON: missing required fields (project_id, private_key, client_email)');
    }

    // Initialize Firebase Admin
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    console.log('✅ Firebase Admin SDK initialized successfully');
  } else {
    firebaseApp = getApps()[0];
  }
} catch (error) {
  console.error('❌ Firebase Admin SDK initialization failed:', error.message);
  throw error;
}

// Export authenticated Firebase Admin Auth instance
const auth = getAuth(firebaseApp);

module.exports = { auth, default: firebaseApp };
