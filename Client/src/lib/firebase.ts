import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuknaD8IrHWkCtveorwe0n-P0nFE90TtI",
  authDomain: "formbuilder-aed0f.firebaseapp.com",
  projectId: "formbuilder-aed0f",
  storageBucket: "formbuilder-aed0f.firebasestorage.app",
  messagingSenderId: "785765025313",
  appId: "1:785765025313:web:6b9993904a0860295dc560",
  measurementId: "G-T7FGC6NGRC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Helper functions for authentication
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getIdTokenCurrentUser = async (): Promise<string | null> => {
  try {
    // Wait a bit for auth state to settle if needed
    let currentUser = auth.currentUser;
    if (!currentUser) {
      // Wait up to 2 seconds for auth state to be ready
      await new Promise(resolve => setTimeout(resolve, 500));
      currentUser = auth.currentUser;
    }
    
    if (!currentUser) {
      return null;
    }
    
    const token = await currentUser.getIdToken(true);
    return token;
  } catch (error) {
    console.error('❌ Error getting ID token:', error);
    return null;
  }
};

export default app;
