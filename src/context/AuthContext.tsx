import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  applyActionCode
} from 'firebase/auth';
import { auth, testFirebaseConnection } from '../services/firebase';
import { 
  UserProfile, 
  fetchUserProfile, 
  saveUserProfile, 
  updateUserProfileDoc 
} from '../services/userTravelService';

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  homeCity?: string;
  preferredLanguage?: 'en' | 'kn';
  travelInterests?: string[];
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<{ user: User; profile: UserProfile | null }>;
  loginWithGithub: () => Promise<{ user: User; profile: UserProfile | null }>;
  registerWithVerification: (data: RegisterData) => Promise<UserProfile>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  sendEmailOtpApi: (email: string, fullName?: string) => Promise<any>;
  verifyEmailOtpApi: (email: string, code: string) => Promise<any>;
  firebaseProjectId: string;
  firebaseAuthDomain: string;
  setupPhoneRecaptcha: (containerId: string) => RecaptchaVerifier;
  cleanupRecaptcha: () => void;
  sendPhoneSmsOtp: (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initial connection verification
  useEffect(() => {
    testFirebaseConnection();
  }, []);

  // Handle Firebase Email Verification action link if present in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const actionParam = params.get('mode');
      const oobCode = params.get('oobCode');

      if (actionParam === 'verifyEmail' && oobCode) {
        applyActionCode(auth, oobCode)
          .then(async () => {
            if (auth.currentUser) {
              await auth.currentUser.reload();
              setUser(auth.currentUser);
              await updateUserProfileDoc(auth.currentUser.uid, {
                emailOtpVerified: true,
                isFullyVerified: true,
                updatedAt: new Date().toISOString(),
              });
              const p = await fetchUserProfile(auth.currentUser.uid);
              if (p) setProfile(p);
            }
            // Remove oobCode from URL without reloading
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
          })
          .catch(err => {
            console.warn('[AuthContext] Error applying verification action code:', err);
          });
      }
    } catch (e) {
      console.warn('[AuthContext] URL search params error:', e);
    }
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Reload Firebase user instance to fetch latest emailVerified status
        try {
          await firebaseUser.reload();
        } catch (e) {
          // Ignore transient network errors on reload
        }
        const currentUser = auth.currentUser || firebaseUser;
        setUser(currentUser);

        try {
          let userDoc = await fetchUserProfile(currentUser.uid);
          if (userDoc) {
            // Keep Firestore profile in sync with actual Firebase Auth verification
            if (currentUser.emailVerified && (!userDoc.emailOtpVerified || !userDoc.isFullyVerified)) {
              await updateUserProfileDoc(currentUser.uid, {
                emailOtpVerified: true,
                isFullyVerified: true,
                updatedAt: new Date().toISOString()
              });
              userDoc = { ...userDoc, emailOtpVerified: true, isFullyVerified: true };
            }
            setProfile(userDoc);
          } else {
            // Document might not exist yet if registered recently, via Google, or via GitHub
            const isGoogleUser = currentUser.providerData.some(p => p.providerId === 'google.com');
            const isGithubUser = currentUser.providerData.some(p => p.providerId === 'github.com');
            const isSocialUser = isGoogleUser || isGithubUser;
            const initialProfile: UserProfile = {
              uid: currentUser.uid,
              fullName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Traveler',
              email: currentUser.email || '',
              phoneNumber: currentUser.phoneNumber || '',
              photoURL: currentUser.photoURL || '',
              preferredLanguage: 'en',
              travelInterests: ['heritage', 'waterfalls', 'hills'],
              emailOtpVerified: currentUser.emailVerified || isSocialUser,
              mobileOtpVerified: false,
              phoneVerified: false,
              isFullyVerified: (currentUser.emailVerified || isSocialUser),
              authProvider: isGithubUser ? 'github' : (isGoogleUser ? 'google' : 'password'),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await saveUserProfile(initialProfile);
            setProfile(initialProfile);
          }
        } catch (err) {
          console.warn('[AuthContext] Error loading profile for authenticated user:', err);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    try {
      await cred.user.reload();
    } catch (e) {}
    const freshUser = auth.currentUser || cred.user;
    setUser(freshUser);
    let p = await fetchUserProfile(freshUser.uid);
    if (p) {
      if (freshUser.emailVerified && (!p.emailOtpVerified || !p.isFullyVerified)) {
        await updateUserProfileDoc(freshUser.uid, {
          emailOtpVerified: true,
          isFullyVerified: true,
          updatedAt: new Date().toISOString()
        });
        p = { ...p, emailOtpVerified: true, isFullyVerified: true };
      }
      setProfile(p);
    }
  };

  const loginWithGoogle = async (): Promise<{ user: User; profile: UserProfile | null }> => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    const cred = await signInWithPopup(auth, provider);
    let p = await fetchUserProfile(cred.user.uid);
    
    if (!p) {
      const isGoogleEmailVerified = cred.user.emailVerified;
      p = {
        uid: cred.user.uid,
        fullName: cred.user.displayName || cred.user.email?.split('@')[0] || 'Traveler',
        email: cred.user.email || '',
        phoneNumber: cred.user.phoneNumber || '',
        photoURL: cred.user.photoURL || '',
        preferredLanguage: 'en',
        travelInterests: ['heritage', 'waterfalls', 'hills'],
        emailOtpVerified: isGoogleEmailVerified,
        mobileOtpVerified: false,
        phoneVerified: false,
        isFullyVerified: true,
        authProvider: 'google',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveUserProfile(p);
    } else {
      // Safe merge without overwriting populated fields with empty ones
      const updates: Partial<UserProfile> = {};
      if (!p.photoURL && cred.user.photoURL) updates.photoURL = cred.user.photoURL;
      if (!p.fullName && cred.user.displayName) updates.fullName = cred.user.displayName;
      if (!p.email && cred.user.email) updates.email = cred.user.email;
      if (Object.keys(updates).length > 0) {
        await updateUserProfileDoc(cred.user.uid, updates);
        p = { ...p, ...updates };
      }
    }
    setProfile(p);
    return { user: cred.user, profile: p };
  };

  const loginWithGithub = async (): Promise<{ user: User; profile: UserProfile | null }> => {
    const provider = new GithubAuthProvider();
    provider.addScope('user:email');
    const cred = await signInWithPopup(auth, provider);
    let p = await fetchUserProfile(cred.user.uid);
    
    if (!p) {
      const isGithubEmailVerified = cred.user.emailVerified || Boolean(cred.user.email);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        fullName: cred.user.displayName || cred.user.email?.split('@')[0] || 'Traveler',
        email: cred.user.email || '',
        phoneNumber: cred.user.phoneNumber || '',
        photoURL: cred.user.photoURL || '',
        preferredLanguage: 'en',
        travelInterests: ['heritage', 'waterfalls', 'hills'],
        emailOtpVerified: isGithubEmailVerified,
        mobileOtpVerified: false,
        phoneVerified: false,
        isFullyVerified: true,
        authProvider: 'github',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await saveUserProfile(newProfile);
      p = newProfile;
    } else {
      // Safe merge without overwriting existing populated fields with empty GitHub profile fields
      const updates: Partial<UserProfile> = {};
      if (!p.photoURL && cred.user.photoURL) updates.photoURL = cred.user.photoURL;
      if (!p.fullName && cred.user.displayName) updates.fullName = cred.user.displayName;
      if (!p.email && cred.user.email) updates.email = cred.user.email;
      if (Object.keys(updates).length > 0) {
        await updateUserProfileDoc(cred.user.uid, updates);
        p = { ...p, ...updates };
      }
    }
    setProfile(p);
    return { user: cred.user, profile: p };
  };

  const sendEmailOtpApi = async (email: string, fullName?: string) => {
    const res = await fetch('/api/auth/send-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), fullName: fullName?.trim() }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to send email verification code.');
    }
    return data;
  };

  const verifyEmailOtpApi = async (email: string, code: string) => {
    const res = await fetch('/api/auth/verify-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), code: code.trim() }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Invalid or expired verification code.');
    }
    return data;
  };

  const cleanupRecaptcha = () => {
    if ((window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier.clear();
      } catch (e) {
        console.warn('[PhoneAuth] Error clearing recaptchaVerifier:', e);
      }
      (window as any).recaptchaVerifier = null;
    }
    const container = document.getElementById('recaptcha-container');
    if (container && container.parentNode) {
      const freshContainer = document.createElement('div');
      freshContainer.id = 'recaptcha-container';
      container.parentNode.replaceChild(freshContainer, container);
    }
  };

  const setupPhoneRecaptcha = (containerId: string): RecaptchaVerifier => {
    // If a valid active verifier already exists on window, reuse it
    if ((window as any).recaptchaVerifier) {
      return (window as any).recaptchaVerifier;
    }

    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }

    // Replace existing DOM container element with a fresh clone node to clear grecaptcha internal render registry
    if (container.parentNode) {
      const freshContainer = document.createElement('div');
      freshContainer.id = containerId;
      container.parentNode.replaceChild(freshContainer, container);
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('[PhoneAuth] reCAPTCHA solved successfully');
      },
      'expired-callback': () => {
        console.warn('[PhoneAuth] reCAPTCHA expired');
        cleanupRecaptcha();
      },
    });

    (window as any).recaptchaVerifier = verifier;
    return verifier;
  };

  const sendPhoneSmsOtp = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier): Promise<ConfirmationResult> => {
    let digits = phoneNumber.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0') && digits.length === 11) {
      digits = digits.slice(1);
    }
    const formatted = `+91${digits}`;
    console.log('[PhoneAuth Diagnostic] Firebase Project ID:', auth.app.options.projectId);
    console.log('[PhoneAuth Diagnostic] Firebase Auth Domain:', auth.app.options.authDomain);
    console.log('[PhoneAuth Diagnostic] Requesting SMS OTP for E.164 number:', formatted);
    const confirmationResult = await signInWithPhoneNumber(auth, formatted, recaptchaVerifier);
    return confirmationResult;
  };

  const registerWithVerification = async (data: RegisterData): Promise<UserProfile> => {
    // 1. Create Firebase Auth user
    const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
    
    // 2. Update Firebase Auth profile
    try {
      await updateFirebaseProfile(cred.user, {
        displayName: data.fullName.trim(),
        photoURL: data.photoURL || '',
      });
    } catch (e) {}

    // 3. Dispatch official Firebase Email Verification so Firebase Auth emailVerified can become true
    try {
      await sendEmailVerification(cred.user);
    } catch (e) {
      console.warn('[AuthContext] sendEmailVerification error:', e);
    }

    // 4. Save profile to Firestore
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phoneNumber: data.phoneNumber?.trim() || '',
      dateOfBirth: data.dateOfBirth?.trim() || '',
      homeCity: data.homeCity?.trim() || '',
      preferredLanguage: data.preferredLanguage || 'en',
      travelInterests: data.travelInterests || [],
      photoURL: data.photoURL || '',
      emailOtpVerified: cred.user.emailVerified,
      mobileOtpVerified: false,
      phoneVerified: false,
      isFullyVerified: cred.user.emailVerified,
      authProvider: 'password',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveUserProfile(newProfile);
    setProfile(newProfile);
    return newProfile;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('User is not authenticated');
    await updateUserProfileDoc(user.uid, updates);
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  const resendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  };

  const refreshUserData = async () => {
    if (auth.currentUser) {
      try {
        await auth.currentUser.reload();
      } catch (e) {
        console.warn('[AuthContext] Error reloading currentUser:', e);
      }
      const freshUser = auth.currentUser;
      setUser(freshUser);
      let p = await fetchUserProfile(freshUser.uid);
      if (p) {
        if (freshUser.emailVerified && (!p.emailOtpVerified || !p.isFullyVerified)) {
          await updateUserProfileDoc(freshUser.uid, {
            emailOtpVerified: true,
            isFullyVerified: true,
            updatedAt: new Date().toISOString()
          });
          p = { ...p, emailOtpVerified: true, isFullyVerified: true };
        }
        setProfile(p);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        loginWithGoogle,
        loginWithGithub,
        registerWithVerification,
        logout,
        resetPassword,
        updateProfileData,
        resendVerificationEmail,
        refreshUserData,
        sendEmailOtpApi,
        verifyEmailOtpApi,
        firebaseProjectId: auth.app.options.projectId || '',
        firebaseAuthDomain: auth.app.options.authDomain || '',
        setupPhoneRecaptcha,
        cleanupRecaptcha,
        sendPhoneSmsOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
