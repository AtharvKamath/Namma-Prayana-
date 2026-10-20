import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Calendar, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';

export type AuthMode = 'login' | 'register' | 'forgot_password' | 'email_otp';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  onSuccess?: () => void;
}

const TRAVEL_INTEREST_OPTIONS = [
  { id: 'heritage', label: 'Heritage & Forts', labelKn: 'ಪರಂಪರೆ ಮತ್ತು ಕೋಟೆಗಳು' },
  { id: 'waterfalls', label: 'Waterfalls', labelKn: 'ಜಲಪಾತಗಳು' },
  { id: 'beaches', label: 'Coastal & Beaches', labelKn: 'ಕಡಲತೀರಗಳು' },
  { id: 'hills', label: 'Hill Stations & Trekking', labelKn: 'ಗಿರಿಧಾಮಗಳು & ಚಾರಣ' },
  { id: 'wildlife', label: 'Wildlife & Safaris', labelKn: 'ವನ್ಯಜೀವಿ & ಸಫಾರಿ' },
  { id: 'temples', label: 'Temples & Pilgrimage', labelKn: 'ದೇವಾಲಯಗಳು & ಯಾತ್ರೆ' },
  { id: 'culture', label: 'Culture & Food', labelKn: 'ಸಂಸ್ಕೃತಿ & ತಿನಿಸು' },
];

export function validateIndianMobile(raw: string, isKn: boolean): { isValid: boolean; formatted: string; digits: string; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      isValid: true,
      formatted: '',
      digits: '',
    };
  }

  const cleaned = trimmed.replace(/[\s\-\(\)]/g, '');

  let digits = cleaned;
  if (digits.startsWith('+91')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('91') && digits.length === 12) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = digits.slice(1);
  } else if (digits.startsWith('+')) {
    return {
      isValid: false,
      formatted: '',
      digits,
      error: isKn
        ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (+91) ನಮೂದಿಸಿ.'
        : 'Please enter a valid Indian mobile number with country code (+91).',
    };
  }

  if (!/^\d+$/.test(digits)) {
    return {
      isValid: false,
      formatted: '',
      digits,
      error: isKn
        ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯಲ್ಲಿ ಕೇವಲ ಅಂಕಿಗಳು ಮಾತ್ರ ಇರಬೇಕು.'
        : 'Mobile number must contain digits only.',
    };
  }

  if (digits.length !== 10) {
    return {
      isValid: false,
      formatted: '',
      digits,
      error: isKn
        ? `ದೇಶದ ಕೋಡ್ (+91) ನಂತರ ನಿಖರವಾಗಿ 10 ಅಂಕಿಗಳಿರಬೇಕು (ಪ್ರಸ್ತುತ ${digits.length} ಅಂಕಿಗಳಿವೆ).`
        : `Mobile number must contain exactly 10 digits after country code (+91) (currently ${digits.length} digits).`,
    };
  }

  if (!/^[6-9]/.test(digits)) {
    return {
      isValid: false,
      formatted: '',
      digits,
      error: isKn
        ? 'ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 6, 7, 8 ಅಥವಾ 9 ರಿಂದ ಪ್ರಾರಂಭವಾಗಬೇಕು.'
        : 'Indian mobile numbers must start with 6, 7, 8, or 9.',
    };
  }

  return {
    isValid: true,
    formatted: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`,
    digits,
  };
}

export function validateHomeCity(raw: string, isKn: boolean): { isValid: boolean; trimmed: string; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      isValid: true,
      trimmed: '',
    };
  }
  if (trimmed.length < 2) {
    return {
      isValid: false,
      trimmed,
      error: isKn
        ? 'ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳನ್ನು ನಮೂದಿಸಿ (ಉದಾ. ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ).'
        : 'Please enter a valid city or state (at least 2 characters).',
    };
  }
  return {
    isValid: true,
    trimmed,
  };
}

export function validateEmailAddress(raw: string, isKn: boolean): { isValid: boolean; trimmed: string; error?: string } {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      isValid: false,
      trimmed: '',
      error: isKn ? 'ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸುವುದು ಕಡ್ಡಾಯ.' : 'Email address is required.',
    };
  }

  // Strict email format check rejecting malformed addresses like atharv@, atharv.com, @gmail.com, atharv@@gmail.com
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      trimmed,
      error: isKn
        ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ (ಉದಾ. name@domain.com).'
        : 'Please enter a valid email address (e.g. name@domain.com).',
    };
  }

  return {
    isValid: true,
    trimmed,
  };
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const { language } = useTranslation();
  const isKn = language === 'kn';
  const { 
    login, 
    loginWithGoogle, 
    loginWithGithub,
    registerWithVerification, 
    logout,
    resetPassword, 
    sendEmailOtpApi, 
    verifyEmailOtpApi,
  } = useAuth();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [touched, setTouched] = useState<{ [field: string]: boolean }>({});

  // Registration Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [homeCity, setHomeCity] = useState('');
  const [prefLang, setPrefLang] = useState<'en' | 'kn'>(language === 'kn' ? 'kn' : 'en');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['heritage', 'waterfalls']);

  // OTP Verification States
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);

  // Ethereal email preview URL for dev testing
  const [emailPreviewUrl, setEmailPreviewUrl] = useState<string | null>(null);

  // Email Cooldown Timer
  useEffect(() => {
    if (emailCooldown > 0) {
      const timer = setInterval(() => setEmailCooldown(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [emailCooldown]);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg(null);
      setSuccessMsg(null);
      setTouched({});
      setEmailOtpCode('');
      setEmailOtpVerified(false);
      setEmailPreviewUrl(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      if (selectedInterests.length < 5) {
        setSelectedInterests([...selectedInterests, id]);
      }
    }
  };

  const emailVal = validateEmailAddress(email, isKn);
  const phoneVal = validateIndianMobile(phoneNumber, isKn);
  const cityVal = validateHomeCity(homeCity, isKn);

  // Google OAuth Handler
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
      setSuccessMsg(
        isKn ? 'ಗೂಗಲ್ ಮೂಲಕ ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!' : 'Signed in with Google successfully!'
      );
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      let friendly = err?.message || 'Google sign-in failed';
      if (err?.code === 'auth/popup-closed-by-user') {
        console.info('[AuthModal] Google Sign-In popup closed by user');
        friendly = isKn ? 'ಗೂಗಲ್ ಲಾಗಿನ್ ಪ್ರಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ.' : 'Google sign-in was cancelled.';
      } else if (err?.code === 'auth/popup-blocked') {
        console.warn('[AuthModal] Google Sign-In popup blocked');
        friendly = isKn ? 'ಪಾಪ್‌ಅಪ್ ಬ್ಲಾಕ್ ಆಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಪಾಪ್‌ಅಪ್ ಅನುಮತಿಸಿ.' : 'Popup was blocked by your browser. Please allow popups for sign-in.';
      } else {
        console.error('[AuthModal] Google Sign-In Error:', err);
      }
      setErrorMsg(friendly);
    } finally {
      setGoogleLoading(false);
    }
  };

  // GitHub OAuth Handler
  const handleGithubSignIn = async () => {
    if (githubLoading || googleLoading || loading) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setGithubLoading(true);

    try {
      await loginWithGithub();
      setSuccessMsg(
        isKn ? 'ಗಿಟ್‌ಹಬ್ ಮೂಲಕ ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ!' : 'Signed in with GitHub successfully!'
      );
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      let friendly = err?.message || 'GitHub sign-in failed';
      if (err?.code === 'auth/popup-closed-by-user') {
        console.info('[AuthModal] GitHub Sign-In popup closed by user');
        friendly = isKn ? 'ಗಿಟ್‌ಹಬ್ ಲಾಗಿನ್ ಪ್ರಕ್ರಿಯೆಯನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ.' : 'GitHub sign-in was cancelled.';
      } else if (err?.code === 'auth/popup-blocked') {
        console.warn('[AuthModal] GitHub Sign-In popup blocked');
        friendly = isKn ? 'ಪಾಪ್‌ಅಪ್ ಬ್ಲಾಕ್ ಆಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಪಾಪ್‌ಅಪ್ ಅನುಮತಿಸಿ.' : 'Popup was blocked by your browser. Please allow popups for sign-in.';
      } else if (err?.code === 'auth/operation-not-allowed') {
        console.warn('[AuthModal] GitHub provider not enabled in Firebase Console');
        friendly = isKn
          ? 'ಫೈರ್‌ಬೇಸ್ ಕನ್ಸೋಲ್‌ನಲ್ಲಿ GitHub sign-in ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿಲ್ಲ. Authentication -> Sign-in method ಪರಿಶೀಲಿಸಿ.'
          : 'GitHub Sign-In is disabled in Firebase Console -> Authentication -> Sign-in method.';
      } else if (err?.code === 'auth/account-exists-with-different-credential') {
        console.warn('[AuthModal] Account exists with different credential');
        friendly = isKn
          ? 'ಈ ಇಮೇಲ್‌ನೊಂದಿಗೆ ಈಗಾಗಲೇ ಬೇರೆ ಲಾಗಿನ್ ವಿಧಾನ ಬಳಕೆಯಲ್ಲಿದೆ.'
          : 'An account already exists with the same email address using a different sign-in method.';
      } else if (err?.code === 'auth/unauthorized-domain') {
        console.warn('[AuthModal] Unauthorized domain');
        friendly = isKn
          ? 'ಈ ಡೊಮೇನ್ ಫೈರ್‌ಬೇಸ್ ಕನ್ಸೋಲ್‌ನ Authorized Domains ಪಟ್ಟಿಯಲ್ಲಿಲ್ಲ.'
          : 'This domain is not authorized in Firebase Console -> Authentication -> Settings -> Authorized Domains.';
      } else {
        console.error('[AuthModal] GitHub Sign-In Error:', err);
      }
      setErrorMsg(friendly);
    } finally {
      setGithubLoading(false);
    }
  };

  // Step 1 -> Send Email OTP
  const handleStartRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const trimmedName = fullName.trim();
    const currentEmailVal = validateEmailAddress(email, isKn);
    const trimmedEmail = currentEmailVal.trimmed;
    const currentPhoneVal = validateIndianMobile(phoneNumber, isKn);
    const currentCityVal = validateHomeCity(homeCity, isKn);

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      homeCity: true,
    });

    if (!trimmedName) {
      setErrorMsg(isKn ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter your full name.');
      return;
    }
    if (!currentEmailVal.isValid) {
      setErrorMsg(currentEmailVal.error || (isKn ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸ ನಮೂದಿಸಿ (ಉದಾ. name@domain.com).' : 'Please enter a valid email address (e.g. name@domain.com).'));
      return;
    }
    if (password.length < 6) {
      setErrorMsg(isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg(isKn ? 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ.' : 'Passwords do not match.');
      return;
    }
    if (phoneNumber.trim() && !currentPhoneVal.isValid) {
      setErrorMsg(currentPhoneVal.error || (isKn ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.' : 'Please enter a valid Indian mobile number.'));
      return;
    }
    if (homeCity.trim() && !currentCityVal.isValid) {
      setErrorMsg(currentCityVal.error || (isKn ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ವಂತ ಊರು / ರಾಜ್ಯವನ್ನು ನಮೂದಿಸಿ.' : 'Please enter your Home City or State.'));
      return;
    }

    setLoading(true);
    try {
      const res = await sendEmailOtpApi(trimmedEmail, trimmedName);
      setEmailCooldown(60);
      setEmailPreviewUrl(res.previewUrl || null);
      setMode('email_otp');
      setSuccessMsg(
        isKn
          ? `6-ಅಂಕಿಗಳ ಇಮೇಲ್ ಪರಿಶೀಲನಾ ಕೋಡ್ ಅನ್ನು ${trimmedEmail} ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.`
          : `A 6-digit email verification code has been sent to ${trimmedEmail}.`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send verification code to your email.');
    } finally {
      setLoading(false);
    }
  };

  // Resend Email OTP
  const handleResendEmailOtp = async () => {
    if (emailCooldown > 0 || loading) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const res = await sendEmailOtpApi(email.trim(), fullName.trim());
      setEmailCooldown(60);
      setEmailPreviewUrl(res.previewUrl || null);
      setSuccessMsg(
        isKn
          ? `ಹೊಸ ಇಮೇಲ್ OTP ಕೋಡ್ ಅನ್ನು ${email.trim()} ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.`
          : `A fresh email OTP has been sent to ${email.trim()}.`
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to resend email verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Verify Email OTP -> Complete Registration & Require Manual Login
  const handleVerifyEmailOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOtpCode.trim() || emailOtpCode.trim().length !== 6) {
      setErrorMsg(isKn ? 'ದಯವಿಟ್ಟು 6-ಅಂಕಿಗಳ ಇಮೇಲ್ OTP ನಮೂದಿಸಿ.' : 'Please enter the 6-digit email OTP.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      await verifyEmailOtpApi(email.trim(), emailOtpCode.trim());
      setEmailOtpVerified(true);

      // Complete registration directly after Email OTP verification
      await registerWithVerification({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim() ? (phoneVal.formatted || phoneNumber.trim()) : '',
        dateOfBirth: dateOfBirth.trim(),
        homeCity: homeCity.trim(),
        preferredLanguage: prefLang,
        travelInterests: selectedInterests,
      });

      const registeredEmail = email.trim();
      await logout();

      setMode('login');
      setEmail(registeredEmail);
      setPassword('');
      setConfirmPassword('');
      setEmailOtpCode('');

      setSuccessMsg(
        isKn
          ? '🎉 ನೋಂದಣಿ ಮತ್ತು ಇಮೇಲ್ ಪರಿಶೀಲನೆ ಯಶಸ್ವಿಯಾಗಿದೆ! ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ಬಳಸಿ ಲಾಗಿನ್ ಆಗಿ.'
          : '🎉 Registration & email verification successful! Please log in with your credentials.'
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid or expired email verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Standard Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        throw new Error(isKn ? 'ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.' : 'Please enter your email and password.');
      }
      await login(email, password);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      let friendly = err?.message || 'Authentication error';
      if (err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        friendly = isKn ? 'ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.' : 'Invalid email or password.';
      }
      setErrorMsg(friendly);
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Submit
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg(isKn ? 'ದಯವಿಟ್ಟು ಇಮೇಲ್ ನಮೂದಿಸಿ.' : 'Please enter your registered email address.');
      return;
    }
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg(
        isKn
          ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಅನ್ನು ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.'
          : 'Password reset link has been sent to your email address.'
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  const renderSocialSignInButtons = () => (
    <div className="w-full pt-1 space-y-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 my-1 w-full">
        <div className="h-px bg-stone-200 w-full"></div>
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider justify-self-center px-1">
          {isKn ? 'ಅಥವಾ' : 'OR'}
        </span>
        <div className="h-px bg-stone-200 w-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || githubLoading || loading}
          className="h-[42px] px-3 rounded-xl font-bold text-xs text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-teal-700" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          )}
          <span>{isKn ? 'ಗೂಗಲ್' : 'Google'}</span>
        </button>

        <button
          type="button"
          onClick={handleGithubSignIn}
          disabled={googleLoading || githubLoading || loading}
          className="h-[42px] px-3 rounded-xl font-bold text-xs text-white bg-stone-900 border border-stone-800 hover:bg-stone-800 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-2xs disabled:opacity-50"
        >
          {githubLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-stone-300" />
          ) : (
            <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          )}
          <span>{isKn ? 'ಗಿಟ್‌ಹಬ್' : 'GitHub'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0f4c5c] to-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg leading-tight">
                {mode === 'login' && (isKn ? 'ಲಾಗಿನ್ ಆಗಿ' : 'Welcome Back to Namma Prayana')}
                {mode === 'register' && (isKn ? 'ನಮ್ಮ ಪ್ರಯಾಣ ಸೇರಿ' : 'Join Namma Prayana')}
                {mode === 'email_otp' && (isKn ? 'ಇಮೇಲ್ OTP ಪರಿಶೀಲನೆ' : 'Email OTP Verification')}
                {mode === 'forgot_password' && (isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ' : 'Reset Your Password')}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                {mode === 'login' && (isKn ? 'ಉಳಿಸಿದ ಪ್ರವಾಸಗಳು ಮತ್ತು ತಾಣಗಳನ್ನು ಪ್ರವೇಶಿಸಿ' : 'Access saved itineraries, favorites & preferences')}
                {mode === 'register' && (isKn ? 'ಇಮೇಲ್ ಪರಿಶೀಲನೆಯೊಂದಿಗೆ ಉಚಿತ ಖಾತೆ ಸೃಷ್ಟಿಸಿ' : 'Create a free account with email verification')}
                {mode === 'email_otp' && (isKn ? 'ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಲಾದ 6-ಅಂಕಿಗಳ ಕೋಡ್ ನಮೂದಿಸಿ' : 'Enter the 6-digit verification code sent to your email')}
                {mode === 'forgot_password' && (isKn ? 'ರಿಕವರಿ ಲಿಂಕ್ ಪಡೆಯಲು ಇಮೇಲ್ ನಮೂದಿಸಿ' : 'Enter email to receive secure recovery link')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Segmented Option Switcher (Only in Login / Register views) */}
        {(mode === 'login' || mode === 'register') && (
          <div className="flex rounded-2xl bg-stone-100 p-1 border border-stone-200/80">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-white text-[#0f4c5c] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isKn ? 'ಲಾಗಿನ್' : 'Login'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-white text-[#0f4c5c] shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {isKn ? 'ಖಾತೆ ರಚಿಸಿ' : 'Create Account'}
            </button>
          </div>
        )}

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Ethereal Dev Preview Banner (if test transporter used) */}
        {emailPreviewUrl && (
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-[11px] space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-teal-800">
              <Mail className="w-3.5 h-3.5 text-teal-600" />
              <span>{isKn ? 'ಇಮೇಲ್ OTP ಪರೀಕ್ಷಾ ಇನ್‌ಬಾಕ್ಸ್:' : 'Development Email OTP Inbox:'}</span>
            </div>
            <p className="text-stone-600">
              {isKn ? 'ಪರೀಕ್ಷಾ ಸರ್ವರ್ ಇಮೇಲ್ ವೀಕ್ಷಿಸಲು ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿ:' : 'View sent test email code directly in preview:'}
            </p>
            <a 
              href={emailPreviewUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-[#0f4c5c] hover:underline block truncate"
            >
              {emailPreviewUrl} ↗
            </a>
          </div>
        )}



        {/* --- 2. LOGIN FORM --- */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {isKn ? 'ಇಮೇಲ್ ವಿಳಾಸ *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  disabled={loading}
                  maxLength={150}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-stone-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700">
                  {isKn ? 'ಪಾಸ್‌ವರ್ಡ್ *' : 'Password *'}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot_password');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
                >
                  {isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?' : 'Forgot Password?'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={isKn ? 'ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್' : 'Your password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  disabled={loading}
                  maxLength={100}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-stone-900 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0f4c5c] via-teal-700 to-[#047857] hover:from-[#082f38] hover:to-[#065f46] shadow-md shadow-teal-950/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isKn ? 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...' : 'Signing In...'}</span>
                </>
              ) : (
                <>
                  <span>{isKn ? 'ಲಾಗಿನ್' : 'Log In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {renderSocialSignInButtons()}
          </form>
        )}

        {/* --- 3. STEP 1 REGISTRATION FORM --- */}
        {mode === 'register' && (
          <form onSubmit={handleStartRegistration} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {isKn ? 'ಪೂರ್ಣ ಹೆಸರು *' : 'Full Name *'}
              </label>
              <div className="relative">
                <UserIcon className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  touched.fullName && !fullName.trim() ? 'text-rose-500' : 'text-stone-400'
                }`} />
                <input
                  type="text"
                  required
                  placeholder={isKn ? 'ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು' : 'e.g. Atharv K.'}
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, fullName: true }))}
                  disabled={loading}
                  maxLength={100}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-stone-900 transition-colors ${
                    touched.fullName && !fullName.trim()
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                  } focus:outline-hidden`}
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {isKn ? 'ಇಮೇಲ್ ವಿಳಾಸ *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                  touched.email && !emailVal.isValid ? 'text-rose-500' : 'text-stone-400'
                }`} />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
                  disabled={loading}
                  maxLength={150}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-stone-900 transition-colors ${
                    touched.email && !emailVal.isValid
                      ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                      : 'border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                  } focus:outline-hidden`}
                />
              </div>
              {touched.email && !emailVal.isValid && email.length > 0 && (
                <p className="text-rose-600 text-[11px] mt-1 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                  <span>{emailVal.error}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isKn ? 'ಪಾಸ್‌ವರ್ಡ್ *' : 'Password *'}
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    touched.password && password.length < 6 ? 'text-rose-500' : 'text-stone-400'
                  }`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={isKn ? 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು' : 'At least 6 characters'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
                    disabled={loading}
                    minLength={6}
                    maxLength={100}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-stone-900 transition-colors ${
                      touched.password && password.length < 6
                        ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                    } focus:outline-hidden`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ *' : 'Confirm Password *'}
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    touched.confirmPassword && confirmPassword !== password ? 'text-rose-500' : 'text-stone-400'
                  }`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder={isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ಪುನರಾವರ್ತಿಸಿ' : 'Re-enter password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
                    disabled={loading}
                    minLength={6}
                    maxLength={100}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-stone-900 transition-colors ${
                      touched.confirmPassword && confirmPassword !== password
                        ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                    } focus:outline-hidden`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Indian Mobile Number and Home City/State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {isKn ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (+91) (ಐಚ್ಛಿಕ)' : 'Mobile Number (+91) (Optional)'}
                </label>
                <div className="relative">
                  <Phone className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    touched.phone && phoneNumber.trim() && !phoneVal.isValid ? 'text-rose-500' : 'text-stone-400'
                  }`} />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, phone: true }))}
                    disabled={loading}
                    maxLength={20}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-stone-900 transition-colors ${
                      touched.phone && phoneNumber.trim() && !phoneVal.isValid
                        ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                    } focus:outline-hidden`}
                  />
                </div>
                {phoneVal.isValid && phoneNumber.trim().length > 0 && (
                  <p className="text-emerald-700 text-[10.5px] mt-1 font-medium">
                    {isKn ? `ಮಾನಕ ರೂಪ: ${phoneVal.formatted}` : `Format: ${phoneVal.formatted}`}
                  </p>
                )}
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  {isKn ? 'ಸ್ವಂತ ಊರು / ರಾಜ್ಯ (ಐಚ್ಛಿಕ)' : 'Home City / State (Optional)'}
                </label>
                <div className="relative">
                  <MapPin className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    touched.homeCity && homeCity.trim() && !cityVal.isValid ? 'text-rose-500' : 'text-stone-400'
                  }`} />
                  <input
                    type="text"
                    placeholder={isKn ? 'ಉದಾ. ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ' : 'e.g. Bengaluru, Karnataka'}
                    value={homeCity}
                    onChange={(e) => {
                      setHomeCity(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, homeCity: true }))}
                    disabled={loading}
                    maxLength={80}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-stone-900 transition-colors ${
                      touched.homeCity && !cityVal.isValid
                        ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
                    } focus:outline-hidden`}
                  />
                </div>
              </div>
            </div>

            {/* Date of Birth & Preferred Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-semibold text-stone-600 block mb-1">
                  {isKn ? 'ಹುಟ್ಟಿದ ದಿನಾಂಕ (ಐಚ್ಛಿಕ)' : 'Date of Birth (Optional)'}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-600 block mb-1">
                  {isKn ? 'ಆದ್ಯತೆಯ ಭಾಷೆ' : 'Preferred Language'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPrefLang('en')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      prefLang === 'en'
                        ? 'bg-teal-50 border-teal-600 text-teal-800'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefLang('kn')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      prefLang === 'kn'
                        ? 'bg-teal-50 border-teal-600 text-teal-800'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    ಕನ್ನಡ
                  </button>
                </div>
              </div>
            </div>

            {/* Travel Interests */}
            <div className="pt-1">
              <label className="font-semibold text-stone-600 block mb-1">
                {isKn ? 'ಪ್ರವಾಸದ ಆಸಕ್ತಿಗಳು (ಗರಿಷ್ಠ 5)' : 'Travel Interests (Pick up to 5)'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TRAVEL_INTEREST_OPTIONS.map(opt => {
                  const isSelected = selectedInterests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0f4c5c] text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isKn ? opt.labelKn : opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0f4c5c] via-teal-700 to-[#047857] hover:from-[#082f38] hover:to-[#065f46] shadow-md shadow-teal-950/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isKn ? 'ಇಮೇಲ್ OTP ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : 'Sending Email Verification OTP...'}</span>
                </>
              ) : (
                <>
                  <span>{isKn ? 'ಇಮೇಲ್ OTP ಪರಿಶೀಲನೆಗೆ ಮುಂದುವರಿಯಿರಿ' : 'Continue to Email Verification'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {renderSocialSignInButtons()}
          </form>
        )}

        {/* --- 4. STEP 2 EMAIL OTP VERIFICATION SCREEN --- */}
        {mode === 'email_otp' && (
          <form onSubmit={handleVerifyEmailOtpSubmit} className="space-y-5 text-xs">
            <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/90 text-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span>{isKn ? 'ಇಮೇಲ್ OTP ಪರಿಶೀಲನೆ' : 'Email OTP Verification'}</span>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {isKn ? 'ನಾವು ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ 6-ಅಂಕಿಗಳ ರಹಸ್ಯ ಪರಿಶೀಲನಾ ಕೋಡ್ ಕಳುಹಿಸಿದ್ದೇವೆ:' : 'We sent a 6-digit verification code to your email:'}
              </p>
              <p className="font-extrabold text-[#0f4c5c] text-sm tracking-wide">
                {email}
              </p>
            </div>

            <div>
              <label className="font-extrabold text-stone-800 block mb-1 text-sm">
                {isKn ? 'ಇಮೇಲ್ OTP ಕೋಡ್ ನಮೂದಿಸಿ *' : 'Enter 6-Digit Email OTP *'}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={emailOtpCode}
                  onChange={(e) => {
                    setEmailOtpCode(e.target.value.replace(/\D/g, ''));
                    if (errorMsg) setErrorMsg(null);
                  }}
                  disabled={loading}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-600 text-stone-900 font-mono font-bold text-lg tracking-widest text-center focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={handleResendEmailOtp}
                disabled={emailCooldown > 0 || loading}
                className="font-bold text-[#0f4c5c] hover:underline disabled:text-stone-400 disabled:no-underline cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>
                  {emailCooldown > 0
                    ? (isKn ? `ಪುನಃ ಕಳುಹಿಸಿ (${emailCooldown}s)` : `Resend OTP in ${emailCooldown}s`)
                    : (isKn ? 'ಇಮೇಲ್ OTP ಪುನಃ ಕಳುಹಿಸಿ' : 'Resend Email OTP')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-stone-500 hover:text-stone-800 hover:underline cursor-pointer"
              >
                {isKn ? '← ಸಂಪಾದಿಸಿ' : '← Edit Details'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || emailOtpCode.length !== 6}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#0f4c5c] via-teal-700 to-[#047857] hover:from-[#082f38] hover:to-[#065f46] shadow-md active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isKn ? 'ಖಾತೆ ರಚಿಸಲಾಗುತ್ತಿದೆ...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{isKn ? 'ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ ಖಾತೆ ರಚಿಸಿ' : 'Verify Email & Create Account'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* --- 6. FORGOT PASSWORD FORM --- */}
        {mode === 'forgot_password' && (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {isKn ? 'ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್ *' : 'Registered Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  disabled={loading}
                  maxLength={150}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-stone-900 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0f4c5c] via-teal-700 to-[#047857] hover:from-[#082f38] hover:to-[#065f46] shadow-md shadow-teal-950/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isKn ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : 'Sending Reset Link...'}</span>
                </>
              ) : (
                <>
                  <span>{isKn ? 'ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿ' : 'Send Recovery Link'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer Mode Switcher */}
        <div className="pt-3 border-t border-stone-100 text-center text-xs text-stone-600 space-y-2">
          {mode === 'login' && (
            <div>
              <span>{isKn ? 'ನಮ್ಮ ಪ್ರಯಾಣಕ್ಕೆ ಹೊಸಬರೇ? ' : 'New to Namma Prayana? '}</span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="font-bold text-[#0f4c5c] hover:underline cursor-pointer"
              >
                {isKn ? 'ಖಾತೆ ರಚಿಸಿ' : 'Create an account'}
              </button>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <span>{isKn ? 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ? ' : 'Already have an account? '}</span>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="font-bold text-[#0f4c5c] hover:underline cursor-pointer"
              >
                {isKn ? 'ಲಾಗಿನ್' : 'Login'}
              </button>
            </div>
          )}

          {(mode === 'forgot_password' || mode === 'email_otp') && (
            <div>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="font-bold text-[#0f4c5c] hover:underline cursor-pointer"
              >
                {isKn ? '← ಲಾಗಿನ್‌ಗೆ ಹಿಂತಿರುಗಿ' : '← Return to Login'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
