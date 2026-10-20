import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Languages, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle,
  RotateCcw,
  LogOut, 
  Edit3, 
  Save, 
  X, 
  Compass, 
  BookmarkCheck, 
  Map,
  ShieldCheck,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/LanguageContext';
import { UserProfile } from '../services/userTravelService';
import { validateIndianMobile } from './AuthModal';

interface ProfileViewProps {
  onNavigateToTrips: () => void;
  onNavigateToExplore: () => void;
  savedTripsCount: number;
  favoritesCount: number;
}

const INTEREST_LABELS: Record<string, { en: string; kn: string }> = {
  heritage: { en: 'Heritage & Forts', kn: 'ಪರಂಪರೆ ಮತ್ತು ಕೋಟೆಗಳು' },
  waterfalls: { en: 'Waterfalls', kn: 'ಜಲಪಾತಗಳು' },
  beaches: { en: 'Coastal & Beaches', kn: 'ಕಡಲತೀರಗಳು' },
  hills: { en: 'Hill Stations & Trekking', kn: 'ಗಿರಿಧಾಮಗಳು & ಚಾರಣ' },
  wildlife: { en: 'Wildlife & Safaris', kn: 'ವನ್ಯಜೀವಿ & ಸಫಾರಿ' },
  temples: { en: 'Temples & Pilgrimage', kn: 'ದೇವಾಲಯಗಳು & ಯಾತ್ರೆ' },
  culture: { en: 'Culture & Food', kn: 'ಸಂಸ್ಕೃತಿ & ತಿನಿಸು' },
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  onNavigateToTrips,
  onNavigateToExplore,
  savedTripsCount,
  favoritesCount,
}) => {
  const { user, profile, logout, updateProfileData, resendVerificationEmail, refreshUserData } = useAuth();
  const { language } = useTranslation();
  const isKn = language === 'kn';

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Auto-refresh Firebase user state on mount to ensure latest emailVerified status
  useEffect(() => {
    refreshUserData().catch(err => {
      console.warn('[ProfileView] Auto-refresh user verification status error:', err);
    });
  }, []);

  // Edit form state
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth || '');
  const [homeCity, setHomeCity] = useState(profile?.homeCity || '');
  const [prefLang, setPrefLang] = useState<'en' | 'kn'>(profile?.preferredLanguage || 'en');
  const [interests, setInterests] = useState<string[]>(profile?.travelInterests || []);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhoneNumber(profile.phoneNumber || '');
      setDateOfBirth(profile.dateOfBirth || '');
      setHomeCity(profile.homeCity || '');
      setPrefLang(profile.preferredLanguage || 'en');
      setInterests(profile.travelInterests || []);
    }
  }, [profile]);

  if (!user) {
    return null;
  }

  const toggleInterest = (id: string) => {
    if (interests.includes(id)) {
      setInterests(interests.filter(i => i !== id));
    } else {
      if (interests.length < 5) {
        setInterests([...interests, id]);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    try {
      let cleanedPhone = phoneNumber.trim();
      if (cleanedPhone) {
        const pVal = validateIndianMobile(cleanedPhone, isKn);
        if (!pVal.isValid) {
          throw new Error(pVal.error || (isKn ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.' : 'Please enter a valid Indian mobile number.'));
        }
        cleanedPhone = pVal.formatted;
      }

      await updateProfileData({
        fullName: fullName.trim(),
        phoneNumber: cleanedPhone,
        dateOfBirth: dateOfBirth.trim(),
        homeCity: homeCity.trim(),
        preferredLanguage: prefLang,
        travelInterests: interests,
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setSaveError(err?.message || (isKn ? 'ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ.' : 'Failed to update profile.'));
    } finally {
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      setResendStatus(isKn ? 'ಪರಿಶೀಲನಾ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ! ನಿಮ್ಮ ಇಮೇಲ್ ಇನ್‌ಬಾಕ್ಸ್ ಪರಿಶೀಲಿಸಿ.' : 'Verification email sent! Please check your inbox.');
      setTimeout(() => setResendStatus(null), 5000);
    } catch (err: any) {
      setResendStatus(isKn ? 'ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.' : (err?.message || 'Could not send verification email right now.'));
      setTimeout(() => setResendStatus(null), 4000);
    }
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    try {
      await refreshUserData();
      setResendStatus(isKn ? 'ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!' : 'Verification status refreshed!');
      setTimeout(() => setResendStatus(null), 3500);
    } catch (err: any) {
      console.error('Failed to refresh user status:', err);
      setResendStatus(isKn ? 'ನವೀಕರಣ ವಿಫಲವಾಗಿದೆ.' : 'Could not refresh status right now.');
      setTimeout(() => setResendStatus(null), 3500);
    } finally {
      setRefreshing(false);
    }
  };

  const initials = (profile?.fullName || user.displayName || user.email || 'U')
    .slice(0, 2)
    .toUpperCase();

  const formattedJoinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(isKn ? 'kn-IN' : 'en-US', {
        month: 'short',
        year: 'numeric'
      })
    : 'Member';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f4c5c] via-teal-800 to-[#047857] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-stone-900 font-black text-xl sm:text-2xl flex items-center justify-center shadow-lg shrink-0 border-2 border-white/20">
              {profile?.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt={profile.fullName} 
                  className="w-full h-full object-cover rounded-2xl" 
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* User Meta */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {profile?.fullName || user.displayName || 'Karnataka Traveler'}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  {isKn ? 'ಸದಸ್ಯರು' : 'Namma Prayana Explorer'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-teal-100 flex items-center gap-1.5 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{user.email}</span>
              </p>
              <p className="text-[11px] text-teal-200/80">
                {isKn ? `${formattedJoinDate} ರಂದು ಸೇರಿದ್ದಾರೆ` : `Member since ${formattedJoinDate}`}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer backdrop-blur-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isKn ? 'ಪ್ರೊಫೈಲ್ ತಿದ್ದಿ' : 'Edit Profile'}</span>
              </button>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-stone-900/60 hover:bg-stone-900 text-rose-200 hover:text-rose-100 font-bold text-xs border border-rose-300/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isKn ? 'ಲಾಗ್‌ಔಟ್' : 'Log Out'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isKn ? 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ!' : 'Your profile has been updated successfully in Firestore!'}</span>
        </div>
      )}

      {/* Account Security & Verification Status Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-700" />
            <h4 className="font-extrabold text-stone-900 text-sm">
              {isKn ? 'ಖಾತೆ ಭದ್ರತೆ ಮತ್ತು ಪರಿಶೀಲನೆ ಸ್ಥಿತಿ' : 'Account Security & Verification Status'}
            </h4>
          </div>
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
            user?.emailVerified
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}>
            {user?.emailVerified
              ? (isKn ? '✓ ಖಾತೆ ಪರಿಶೀಲಿತವಾಗಿದೆ' : '✓ Account Verified')
              : (isKn ? '⚠️ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ' : '⚠️ Verification Required')}
          </span>
        </div>

        {/* Verification Status Feedback Notification */}
        {resendStatus && (
          <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{resendStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 text-xs">
          {/* Email Verification Status */}
          <div className="p-4 rounded-2xl border bg-stone-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-stone-800 text-sm">{isKn ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'}</p>
                <p className="text-xs text-stone-500 break-all">{user?.email || profile?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                user?.emailVerified
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {user?.emailVerified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isKn ? 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' : 'Verified'}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isKn ? 'ಪರಿಶೀಲನೆ ಅಗತ್ಯವಿದೆ' : 'Verification Required'}</span>
                  </>
                )}
              </span>

              {!user?.emailVerified && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0f4c5c] hover:bg-[#093540] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isKn ? 'ಪರಿಶೀಲನಾ ಲಿಂಕ್ ಕಳುಹಿಸಿ' : 'Send Verification Link'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleRefreshStatus}
                disabled={refreshing}
                title={isKn ? 'ಪರಿಶೀಲನಾ ಸ್ಥಿತಿ ನವೀಕರಿಸಿ' : 'Refresh Verification Status'}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isKn ? 'ನವೀಕರಿಸಿ' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {!user?.emailVerified && (
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">
                  {isKn 
                    ? 'ಫೈರ್‌ಬೇಸ್ ಅಧಿಕೃತ ಇಮೇಲ್ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ.' 
                    : 'Firebase Authentication email verification is pending.'}
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {isKn
                    ? 'ನಿಮ್ಮ ಇನ್‌ಬಾಕ್ಸ್‌ನಲ್ಲಿರುವ ಫೈರ್‌ಬೇಸ್ ಲಿಂಕ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ, ನಂತರ ಇಲ್ಲಿ "ನವೀಕರಿಸಿ" ಒತ್ತಿ.'
                    : 'Click the link in the verification email sent to your address, then click "Refresh" above.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onNavigateToTrips}
          className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#0f4c5c] flex items-center justify-center group-hover:bg-[#0f4c5c] group-hover:text-white transition-colors">
              <Map className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-semibold block">
                {isKn ? 'ಉಳಿಸಿದ ಪ್ರವಾಸಗಳು' : 'Saved Itineraries'}
              </span>
              <span className="text-2xl font-black text-stone-900">
                {savedTripsCount}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-800 group-hover:translate-x-1 transition-transform">
            {isKn ? 'ವೀಕ್ಷಿಸಿ →' : 'View Trips →'}
          </span>
        </button>

        <button
          onClick={onNavigateToExplore}
          className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-semibold block">
                {isKn ? 'ನೆಚ್ಚಿನ ತಾಣಗಳು' : 'Favorite Destinations'}
              </span>
              <span className="text-2xl font-black text-stone-900">
                {favoritesCount}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-800 group-hover:translate-x-1 transition-transform">
            {isKn ? 'ಅನ್ವೇಷಿಸಿ →' : 'Explore More →'}
          </span>
        </button>
      </div>

      {/* Main Profile Details Form / Display */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="font-extrabold text-stone-900 text-lg">
              {isKn ? 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು & ಆದ್ಯತೆಗಳು' : 'Personal Details & Travel Preferences'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {isKn 
                ? 'ಕ್ಲೌಡ್ ಫೈರ್‌ಸ್ಟೋರ್‌ನಲ್ಲಿ ಖಾಸಗಿಯಾಗಿ ಉಳಿಸಲಾದ ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ' 
                : 'Encrypted and strictly isolated to your authenticated account'}
            </p>
          </div>

          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {saveError && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isKn ? 'ಪೂರ್ಣ ಹೆಸರು *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isKn ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)' : 'Phone Number (Optional)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    placeholder="+91 98765 43210"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isKn ? 'ಹುಟ್ಟಿದ ದಿನಾಂಕ' : 'Date of Birth'}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {isKn ? 'ನಗರ / ರಾಜ್ಯ' : 'Home City / State'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={homeCity}
                    placeholder="e.g. Mysuru, Karnataka"
                    onChange={(e) => setHomeCity(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {isKn ? 'ಆದ್ಯತೆಯ ಭಾಷೆ' : 'Preferred Language'}
              </label>
              <div className="flex gap-3 max-w-xs">
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
                  ಕನ್ನಡ (Kannada)
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                {isKn ? 'ಪ್ರವಾಸದ ಆಸಕ್ತಿಗಳು' : 'Travel Interests (Pick up to 5)'}
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(INTEREST_LABELS).map(([k, labelObj]) => {
                  const isSelected = interests.includes(k);
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => toggleInterest(k)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0f4c5c] text-white shadow-2xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isKn ? labelObj.kn : labelObj.en}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0f4c5c] hover:bg-[#093540] shadow-sm cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? (isKn ? 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...' : 'Saving...') : (isKn ? 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ' : 'Save Changes')}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                {isKn ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                {isKn ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'}
              </span>
              <p className="font-extrabold text-stone-900 text-sm">
                {profile?.fullName || user.displayName || '—'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                {isKn ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'}
              </span>
              <p className="font-extrabold text-stone-900 text-sm">
                {user.email || '—'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                {isKn ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)' : 'Phone Number (Optional)'}
              </span>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-stone-800">
                  {profile?.phoneNumber || (isKn ? 'ನಮೂದಿಸಿಲ್ಲ' : 'Not provided')}
                </p>
                {profile?.phoneVerified && profile?.phoneNumber && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {isKn ? '✓ ಪರಿಶೀಲಿಸಲಾಗಿದೆ' : '✓ Verified'}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                {isKn ? 'ಹುಟ್ಟಿದ ದಿನಾಂಕ' : 'Date of Birth'}
              </span>
              <p className="font-semibold text-stone-800">
                {profile?.dateOfBirth || (isKn ? 'ನಮೂದಿಸಿಲ್ಲ' : 'Not provided')}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                {isKn ? 'ನಗರ / ರಾಜ್ಯ' : 'Home City / State'}
              </span>
              <p className="font-semibold text-stone-800">
                {profile?.homeCity || (isKn ? 'ನಮೂದಿಸಿಲ್ಲ' : 'Not provided')}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                {isKn ? 'ಆದ್ಯತೆಯ ಭಾಷೆ' : 'Preferred Language'}
              </span>
              <p className="font-semibold text-stone-800">
                {profile?.preferredLanguage === 'kn' ? 'ಕನ್ನಡ (Kannada)' : 'English'}
              </p>
            </div>

            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-stone-100">
              <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                {isKn ? 'ಪ್ರವಾಸದ ಆಸಕ್ತಿಗಳು' : 'Travel Interests'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {profile?.travelInterests && profile.travelInterests.length > 0 ? (
                  profile.travelInterests.map(item => (
                    <span
                      key={item}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 font-semibold text-[11px] border border-teal-200/60"
                    >
                      {INTEREST_LABELS[item]
                        ? (isKn ? INTEREST_LABELS[item].kn : INTEREST_LABELS[item].en)
                        : item}
                    </span>
                  ))
                ) : (
                  <span className="text-stone-400 italic">
                    {isKn ? 'ಯಾವುದೇ ಆಸಕ್ತಿಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ' : 'No specific interests selected yet'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
