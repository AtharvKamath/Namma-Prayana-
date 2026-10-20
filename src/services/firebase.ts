import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Reuse existing initialization to prevent duplicate Firebase instances
export const app: FirebaseApp = getApps().length > 0 
  ? getApp() 
  : initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth: Auth = getAuth(app);

// Initialize Cloud Firestore with direct forced long-polling to prevent 10s backend connection timeouts in cloud sandbox / preview environments
const dbId = (firebaseConfig as any).firestoreDatabaseId;
const firestoreSettings = {
  experimentalForceLongPolling: true,
};

export const db: Firestore = (dbId && dbId !== '(default)') 
  ? initializeFirestore(app, firestoreSettings, dbId) 
  : initializeFirestore(app, firestoreSettings);

/**
 * Validates Firestore database connectivity per skill guidelines.
 * Returns true if connection succeeds or catches offline/network issues gracefully.
 */
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const fetchPromise = getDocFromServer(doc(db, 'test', 'connection'));
    const timeoutPromise = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('connection timeout')), 4000)
    );
    await Promise.race([fetchPromise, timeoutPromise]);
    return true;
  } catch (error) {
    if (error instanceof Error && (
      error.message.includes('the client is offline') || 
      error.message.includes('Could not reach Cloud Firestore backend') ||
      error.message.includes('connection timeout')
    )) {
      console.warn('[Firebase] Firestore client is operating in offline mode:', error.message);
    } else {
      // Permission-denied or doc not found is still a valid connection to server
    }
    return false;
  }
}
