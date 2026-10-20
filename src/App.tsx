import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { TripPlannerForm } from './components/TripPlannerForm';
import { ItineraryView } from './components/ItineraryView';
import { DestinationExplorer } from './components/DestinationExplorer';
import { BookingHub } from './components/BookingHub';
import { HotelsView } from './components/HotelsView';
import { BudgetCalculator } from './components/BudgetCalculator';
import { KannadaHelper } from './components/KannadaHelper';
import { SavedTripsView } from './components/SavedTripsView';
import { AboutKarnataka } from './components/AboutKarnataka';
import { DiscoverKarnatakaIntro } from './components/DiscoverKarnatakaIntro';
import { HelpSupportModal } from './components/HelpSupportModal';
import { ContactSupportModal } from './components/ContactSupportModal';
import { InteractiveMap } from './components/InteractiveMap';
import { DestinationModal } from './components/DestinationModal';
import { FloatingGuideAssistant } from './components/FloatingGuideAssistant';
import { AuthModal, AuthMode } from './components/AuthModal';
import { GuestSaveModal } from './components/GuestSaveModal';
import { ProfileView } from './components/ProfileView';
import { useAuth } from './context/AuthContext';
import { 
  fetchUserTrips, 
  saveUserTripToFirestore, 
  deleteUserTripFromFirestore, 
  fetchUserFavorites, 
  addFavoriteToFirestore, 
  removeFavoriteFromFirestore 
} from './services/userTravelService';
import { KARNATAKA_DESTINATIONS } from './data/destinations';
import { TripPlannerInput, TripItinerary, Destination } from './types/travel';
import { requestTripItinerary } from './services/geminiService';
import { generateCuratedFallbackItinerary } from './data/fallbackItineraries';
import { useTranslation } from './i18n/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Hotel, 
  Bus, 
  Train,
  CheckCircle2, 
  Languages,
  Phone
} from 'lucide-react';

export default function App() {
  const { language, toggleLanguage, t } = useTranslation();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [guestSaveModalOpen, setGuestSaveModalOpen] = useState(false);
  const [guestSaveModalDesc, setGuestSaveModalDesc] = useState('');
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [activeItinerary, setActiveItinerary] = useState<TripItinerary | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripItinerary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modalDestination, setModalDestination] = useState<Destination | null>(null);

  // Initial values to pass to planner form (when navigating from cards or circuits)
  const [plannerPrefills, setPlannerPrefills] = useState<Partial<TripPlannerInput>>({});

  // Sync saved trips and favorites with Firestore & localStorage
  useEffect(() => {
    let isCancelled = false;

    async function syncUserData() {
      if (user) {
        try {
          const cloudTrips = await fetchUserTrips(user.uid);
          
          const localStored = localStorage.getItem('namma_prayana_saved_trips');
          let localTrips: TripItinerary[] = [];
          if (localStored) {
            try {
              localTrips = JSON.parse(localStored);
            } catch (e) {}
          }

          // Merge: any local trip not in cloud is pushed to cloud
          const missingInCloud = localTrips.filter(lt => !cloudTrips.some(ct => ct.id === lt.id));
          for (const missing of missingInCloud) {
            await saveUserTripToFirestore(user.uid, missing);
          }

          const combined = [...missingInCloud, ...cloudTrips];
          if (!isCancelled) {
            setSavedTrips(combined);
            localStorage.setItem('namma_prayana_saved_trips', JSON.stringify(combined));
          }

          // Load cloud favorites
          const favs = await fetchUserFavorites(user.uid);
          if (!isCancelled) {
            setUserFavorites(favs.map(f => f.destinationId));
          }
        } catch (err) {
          console.warn('Error syncing user cloud data:', err);
        }
      } else {
        // Fall back to localStorage for guests
        try {
          const stored = localStorage.getItem('namma_prayana_saved_trips');
          if (stored) {
            setSavedTrips(JSON.parse(stored));
          } else {
            setSavedTrips([]);
          }
        } catch (e) {
          setSavedTrips([]);
        }
        setUserFavorites([]);
      }
    }

    syncUserData();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save trip to localStorage and Firestore
  const handleSaveTrip = async (itineraryToSave: TripItinerary) => {
    try {
      const exists = savedTrips.some((t) => t.id === itineraryToSave.id);
      let updated: TripItinerary[];
      if (exists) {
        updated = savedTrips.map((t) => (t.id === itineraryToSave.id ? itineraryToSave : t));
        showToast(language === 'kn' ? 'ಪ್ರವಾಸ ಯೋಜನೆ ನವೀಕರಿಸಲಾಗಿದೆ!' : 'Trip itinerary updated!');
      } else {
        updated = [itineraryToSave, ...savedTrips];
        showToast(
          user 
            ? (language === 'kn' ? 'ನಿಮ್ಮ ಖಾತೆಗೆ ಶಾಶ್ವತವಾಗಿ ಉಳಿಸಲಾಗಿದೆ!' : 'Saved to your cloud profile & offline!')
            : (language === 'kn' ? 'ನನ್ನ ಪ್ರವಾಸಗಳಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ! ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಲಭ್ಯ.' : 'Saved to My Trips! Accessible anytime offline.')
        );
      }
      setSavedTrips(updated);
      localStorage.setItem('namma_prayana_saved_trips', JSON.stringify(updated));

      if (user) {
        await saveUserTripToFirestore(user.uid, itineraryToSave);
      } else {
        // Prompt guest to register or login so it's backed up across devices
        setGuestSaveModalDesc(itineraryToSave.tripTitle || itineraryToSave.title || 'Karnataka Itinerary');
        setGuestSaveModalOpen(true);
      }
    } catch (e) {
      console.error('Failed to save trip:', e);
    }
  };

  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lastPlannerInput, setLastPlannerInput] = useState<TripPlannerInput | null>(null);

  const handleDeleteTrip = async (tripId: string) => {
    const updated = savedTrips.filter((t) => t.id !== tripId);
    setSavedTrips(updated);
    localStorage.setItem('namma_prayana_saved_trips', JSON.stringify(updated));
    if (user) {
      try {
        await deleteUserTripFromFirestore(user.uid, tripId);
      } catch (e) {
        console.warn('Failed to delete from Firestore:', e);
      }
    }
    showToast(language === 'kn' ? 'ಪ್ರವಾಸ ಯೋಜನೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಅಳಿಸಲಾಗಿದೆ.' : 'Trip removed from saved journeys.');
  };

  const handleToggleFavorite = async (dest: Destination) => {
    if (!user) {
      setGuestSaveModalDesc(language === 'kn' ? dest.kannadaName : dest.name);
      setGuestSaveModalOpen(true);
      return;
    }

    const isFav = userFavorites.includes(dest.id);
    if (isFav) {
      setUserFavorites(prev => prev.filter(id => id !== dest.id));
      try {
        await removeFavoriteFromFirestore(user.uid, dest.id);
        showToast(language === 'kn' ? `${dest.kannadaName} ನೆಚ್ಚಿನ ತಾಣಗಳಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ` : `Removed ${dest.name} from favorites`);
      } catch (e) {
        console.warn('Error removing favorite:', e);
      }
    } else {
      setUserFavorites(prev => [...prev, dest.id]);
      try {
        await addFavoriteToFirestore(user.uid, dest);
        showToast(language === 'kn' ? `${dest.kannadaName} ನೆಚ್ಚಿನ ತಾಣಗಳಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!` : `Added ${dest.name} to favorites!`);
      } catch (e) {
        console.warn('Error adding favorite:', e);
      }
    }
  };

  const handleImportTrips = async (imported: TripItinerary[]) => {
    const merged = [...imported, ...savedTrips.filter(s => !imported.some(i => i.id === s.id))];
    setSavedTrips(merged);
    localStorage.setItem('namma_prayana_saved_trips', JSON.stringify(merged));
    if (user) {
      for (const trip of imported) {
        await saveUserTripToFirestore(user.uid, trip);
      }
    }
    showToast(language === 'kn' ? `${imported.length} ಪ್ರವಾಸ(ಗಳು) ಯಶಸ್ವಿಯಾಗಿ ಆಮದು ಮಾಡಿಕೊಳ್ಳಲಾಗಿದೆ!` : `Successfully imported ${imported.length} trip(s)!`);
  };

  // Generate itinerary
  const handleGenerateItinerary = async (input: TripPlannerInput) => {
    setIsGenerating(true);
    setGenerationError(null);
    setLastPlannerInput(input);
    const enrichedInput: TripPlannerInput = {
      ...input,
      language,
    };
    try {
      const itinerary = await requestTripItinerary(enrichedInput);
      setActiveItinerary(itinerary);
      setCurrentView('itinerary');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error generating itinerary:', err);
      setGenerationError(
        language === 'kn'
          ? 'ಪ್ರವಾಸ ಯೋಜನೆ ರಚಿಸುವಾಗ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.'
          : 'Encountered an issue crafting itinerary. Please click Retry below to regenerate.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlanTripToDestination = (dest: Destination) => {
    setPlannerPrefills({
      destinationPreferences: [dest.name],
      interests: [dest.category === 'beach' ? 'Beaches' : dest.category === 'hills' ? 'Hill Stations' : dest.category === 'wildlife' ? 'Wildlife' : 'Heritage'],
    });
    setCurrentView('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleDestinationPreference = (dest: Destination) => {
    const currentList = plannerPrefills.destinationPreferences || [];
    const destName = dest.name.trim();
    const destId = dest.id.trim();
    const destKn = (dest.kannadaName || '').trim();

    const isAlreadySelected = currentList.some((n) => {
      const lower = n.toLowerCase().trim();
      return (
        lower === destName.toLowerCase() ||
        lower === destId.toLowerCase() ||
        (destKn && lower.includes(destKn.toLowerCase())) ||
        (destKn && destKn.toLowerCase().includes(lower)) ||
        lower.includes(destName.toLowerCase()) ||
        destName.toLowerCase().includes(lower)
      );
    });

    if (isAlreadySelected) {
      const updated = currentList.filter((n) => {
        const lower = n.toLowerCase().trim();
        return (
          lower !== destName.toLowerCase() &&
          lower !== destId.toLowerCase() &&
          !(destKn && lower.includes(destKn.toLowerCase())) &&
          !(destKn && destKn.toLowerCase().includes(lower)) &&
          !lower.includes(destName.toLowerCase()) &&
          !destName.toLowerCase().includes(lower)
        );
      });
      setPlannerPrefills((prev) => ({
        ...prev,
        destinationPreferences: updated,
      }));
      showToast(language === 'kn' ? `${dest.kannadaName} ಪ್ರವಾಸ ಆದ್ಯತೆಗಳಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ` : `Removed ${dest.name} from trip planner preferences`);
    } else {
      const updated = Array.from(new Set([...currentList, destName]));
      setPlannerPrefills((prev) => ({
        ...prev,
        destinationPreferences: updated,
      }));
      showToast(language === 'kn' ? `${dest.kannadaName} ಪ್ರವಾಸ ಆದ್ಯತೆಗಳಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!` : `Added ${dest.name} to trip planner preferences!`);
    }
  };

  const handleSelectQuickCircuit = (circuitTitle: string) => {
    let dests = ['Hampi', 'Badami'];
    if (circuitTitle.includes('Mysore') || circuitTitle.includes('ಮೈಸೂರು')) dests = ['Mysuru Palace', 'Coorg'];
    if (circuitTitle.includes('Gokarna') || circuitTitle.includes('ಗೋಕರ್ಣ')) dests = ['Gokarna & Om Beach', 'Udupi & Malpe Beach'];
    if (circuitTitle.includes('Chikkamagaluru') || circuitTitle.includes('ಚಿಕ್ಕಮಗಳೂರು')) dests = ['Chikkamagaluru', 'Belur & Halebidu'];

    setPlannerPrefills({
      destinationPreferences: dests,
    });
    setCurrentView('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 w-full max-w-full overflow-x-clip">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-stone-900 text-white text-xs font-semibold shadow-2xl border border-stone-700 flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'help' || view === 'emergency') {
            setHelpModalOpen(true);
            return;
          }
          if (view === 'contact' || view === 'support') {
            setContactModalOpen(true);
            return;
          }
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedTripsCount={savedTrips.length}
        language={language}
        onToggleLanguage={toggleLanguage}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenAuth={(mode = 'login') => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        onOpenLogin={() => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setAuthMode('register');
          setAuthModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 sm:pb-12 space-y-12">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <div className={`${language === 'kn' ? 'space-y-16 sm:space-y-20' : 'space-y-16'} animate-in fade-in duration-300`}>
            {/* Hero Section */}
            <HeroSection
              onStartPlanning={() => {
                setCurrentView('planner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreDestinations={() => {
                setCurrentView('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSelectQuickCircuit={handleSelectQuickCircuit}
            />

            {/* Discover Karnataka Concise Introduction with 4 Regions Overview */}
            <DiscoverKarnatakaIntro
              onExploreRegions={() => {
                setCurrentView('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Quick Trip Planner Component on Homepage */}
            <div className="space-y-4">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {t('quickPlannerBadge')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 leading-snug sm:leading-tight break-words">
                  {t('quickPlannerTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl mx-auto break-words">
                  {t('quickPlannerSubtitle')}
                </p>
              </div>

              <TripPlannerForm
                onSubmit={handleGenerateItinerary}
                isLoading={isGenerating}
                initialValues={plannerPrefills}
                error={generationError}
                onRetry={() => lastPlannerInput && handleGenerateItinerary(lastPlannerInput)}
              />
            </div>

            {/* Featured Karnataka Destinations Showcase */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    {t('featuredHighlightsBadge')}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5 leading-snug sm:leading-tight break-words">
                    {t('featuredHighlightsTitle')}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed break-words">
                    {t('featuredHighlightsSubtitle')}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentView('explore');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#0f4c5c] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                >
                  <span>{t('viewAllDestinationsBtn')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Destination Grid Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {KARNATAKA_DESTINATIONS.slice(0, 4).map((dest) => {
                  const displayName = language === 'kn' ? dest.kannadaName : dest.name;
                  return (
                    <div
                      key={dest.id}
                      className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                    >
                      <div 
                        className="relative h-44 w-full overflow-hidden bg-stone-900 cursor-pointer"
                        onClick={() => setModalDestination(dest)}
                      >
                        <img
                          src={dest.imageUrl}
                          alt={displayName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (dest.gallery?.[0] && target.src !== dest.gallery[0]) {
                              target.src = dest.gallery[0];
                            } else {
                              target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="300" height="150" fill="%230f4c5c"/><text x="150" y="75" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">ನಮ್ಮ ಪ್ರಯಾಣ · Namma Prayana</text></svg>';
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-3 left-4 text-white">
                          <span className="text-[10px] font-bold text-amber-300 block">
                            {language === 'kn' ? `${dest.district} ಜಿಲ್ಲೆ` : `${dest.district} District`}
                          </span>
                          <h4 className="font-extrabold text-base leading-tight">
                            {displayName}
                          </h4>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <p className="text-xs text-stone-600 line-clamp-2">
                          {language === 'kn' && dest.descriptionKn ? dest.descriptionKn : dest.description}
                        </p>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                          <button
                            onClick={() => setModalDestination(dest)}
                            className="text-[11px] font-semibold text-[#0f4c5c] hover:underline cursor-pointer"
                          >
                            {t('cardViewDetails')}
                          </button>
                          <button
                            onClick={() => handlePlanTripToDestination(dest)}
                            className="px-3 py-1.5 rounded-lg bg-[#0f4c5c] text-white font-bold text-[11px] hover:bg-[#082f38] transition-colors cursor-pointer"
                          >
                            {t('cardPlanTripHere')}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Map Section Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                    {t('interactiveMapTitle')}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {t('interactiveMapSubtitle')}
                  </p>
                </div>
              </div>

              <InteractiveMap
                destinations={KARNATAKA_DESTINATIONS}
                onSelectDestination={(dest) => setModalDestination(dest)}
                className="h-[460px] w-full"
              />
            </div>

            {/* Travel Services Trust Grid (Hotels, Buses, Trains, Kannada Helper) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div
                onClick={() => {
                  setCurrentView('hotels');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <Hotel className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-lg group-hover:text-emerald-800 transition-colors">
                  {t('serviceHotelsTitle')}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('serviceHotelsDesc')}
                </p>
                <div className="text-xs font-bold text-[#0f4c5c] flex items-center gap-1">
                  <span>{t('serviceHotelsCta')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => {
                  setCurrentView('buses');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center">
                  <Bus className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-lg group-hover:text-teal-800 transition-colors">
                  {t('serviceBusesTitle')}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('serviceBusesDesc')}
                </p>
                <div className="text-xs font-bold text-[#0f4c5c] flex items-center gap-1">
                  <span>{t('serviceBusesCta')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => {
                  setCurrentView('trains');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center">
                  <Train className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-lg group-hover:text-sky-800 transition-colors">
                  {t('serviceTrainsTitle')}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('serviceTrainsDesc')}
                </p>
                <div className="text-xs font-bold text-[#0f4c5c] flex items-center gap-1">
                  <span>{t('serviceTrainsCta')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div
                onClick={() => {
                  setCurrentView('kannada-helper');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:border-emerald-300 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Languages className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-lg group-hover:text-amber-800 transition-colors">
                  {t('serviceHelperTitle')}
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t('serviceHelperDesc')}
                </p>
                <div className="text-xs font-bold text-[#0f4c5c] flex items-center gap-1">
                  <span>{t('serviceHelperCta')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: EXPLORE KARNATAKA */}
        {currentView === 'explore' && (
          <DestinationExplorer
            onPlanTripToDestination={handlePlanTripToDestination}
            onAddDestinationToTripPlan={handleToggleDestinationPreference}
            onToggleDestinationPreference={handleToggleDestinationPreference}
            selectedDestinationNames={plannerPrefills.destinationPreferences || []}
            favoriteDestinationIds={userFavorites}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {/* VIEW 3: TRIP PLANNER */}
        {currentView === 'planner' && (
          <div className="space-y-6">
            <TripPlannerForm
              onSubmit={handleGenerateItinerary}
              isLoading={isGenerating}
              initialValues={plannerPrefills}
              error={generationError}
              onRetry={() => lastPlannerInput && handleGenerateItinerary(lastPlannerInput)}
            />
          </div>
        )}

        {/* VIEW 4: GENERATED ITINERARY */}
        {currentView === 'itinerary' && activeItinerary && (
          <ItineraryView
            itinerary={activeItinerary}
            onSaveTrip={handleSaveTrip}
            isSaved={savedTrips.some((t) => t.id === activeItinerary.id)}
            onModifyPreferences={() => {
              setPlannerPrefills({
                originCity: activeItinerary.originCity,
                destinationPreferences: activeItinerary.destinationPreferences,
                durationDays: activeItinerary.durationDays,
                travellersCount: activeItinerary.travellersCount,
                budgetTier: activeItinerary.budgetTier,
                budgetInr: activeItinerary.budgetInr,
                interests: activeItinerary.interests,
                transportMode: activeItinerary.transportMode,
                accommodationPreference: activeItinerary.accommodationType,
              });
              setCurrentView('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToBooking={(cat) => {
              setCurrentView(cat);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectDestinationForDetail={(destName) => {
              const found = KARNATAKA_DESTINATIONS.find(d => 
                d.name.toLowerCase().includes(destName.toLowerCase()) || 
                d.kannadaName.includes(destName)
              );
              if (found) setModalDestination(found);
            }}
          />
        )}

        {/* VIEW 5: DEDICATED HOTELS & HOMESTAYS PAGE */}
        {currentView === 'hotels' && (
          <HotelsView
            onNavigateToPlanner={() => {
              setCurrentView('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 6: BUSES */}
        {currentView === 'buses' && (
          <BookingHub initialCategory="bus" />
        )}

        {/* VIEW 6B: TRAINS */}
        {currentView === 'trains' && (
          <BookingHub initialCategory="train" />
        )}

        {/* VIEW 7: FLIGHTS */}
        {currentView === 'flights' && (
          <BookingHub initialCategory="flight" />
        )}

        {/* VIEW 7B: CABS & SELF-DRIVE */}
        {(currentView === 'cabs' || currentView === 'cab' || currentView === 'self-drive') && (
          <BookingHub initialCategory="cab" />
        )}

        {/* VIEW 7C: ALL TRANSPORT HUB */}
        {currentView === 'transport' && (
          <BookingHub initialCategory="bus" />
        )}

        {/* VIEW 8: BOOKING HUB */}
        {currentView === 'booking' && (
          <BookingHub initialCategory="bus" />
        )}

        {/* VIEW 9: BUDGET CALCULATOR */}
        {currentView === 'calculator' && (
          <BudgetCalculator />
        )}

        {/* VIEW 10: KANNADA TRAVEL HELPER */}
        {currentView === 'kannada-helper' && (
          <KannadaHelper />
        )}

        {/* VIEW 11: MY TRIPS / SAVED TRIPS */}
        {currentView === 'my-trips' && (
          <SavedTripsView
            savedTrips={savedTrips}
            onSelectTrip={(trip) => {
              setActiveItinerary(trip);
              setCurrentView('itinerary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDeleteTrip={handleDeleteTrip}
            onImportTrips={handleImportTrips}
            onNavigateToPlanner={() => {
              setCurrentView('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 11B: USER PROFILE */}
        {currentView === 'profile' && (
          <ProfileView
            onNavigateToTrips={() => {
              setCurrentView('my-trips');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToExplore={() => {
              setCurrentView('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            savedTripsCount={savedTrips.length}
            favoritesCount={userFavorites.length}
          />
        )}

        {/* VIEW 12: ABOUT KARNATAKA */}
        {currentView === 'about' && (
          <AboutKarnataka />
        )}

        {/* VIEW 13: DEDICATED EMERGENCY HELPLINES & SAFETY VIEW */}
        {(currentView === 'help' || currentView === 'emergency') && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0f4c5c] to-emerald-900 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black">
                    {t('helplinesTitle')}
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-200">
                    {t('helplinesSubtitle')}
                  </p>
                </div>
              </div>
              <p className="text-xs text-emerald-100 max-w-2xl leading-relaxed">
                {language === 'kn'
                  ? 'ಕರ್ನಾಟಕದಾದ್ಯಂತ 24/7 ತುರ್ತು ನೆರವು, ಪ್ರವಾಸೋದ್ಯಮ ಮಾಹಿತಿ ಹಾಗೂ ಪೊಲೀಸ್ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು. ವಿವರವಾದ ಮಾರ್ಗದರ್ಶನಕ್ಕಾಗಿ ಕೆಳಗಿನ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.'
                  : 'Official 24/7 emergency dispatch, state tourism helplines, tourist police, and travel safety guidelines across Karnataka.'}
              </p>
              <button
                onClick={() => setHelpModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow-md cursor-pointer transition-colors"
              >
                {t('emergencyHelplinesBtn')}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Destination Modal */}
      {modalDestination && (
        <ErrorBoundary fallbackTitle="Destination Details" onReset={() => setModalDestination(null)}>
          <DestinationModal
            destination={modalDestination}
            onClose={() => setModalDestination(null)}
            onAddToTrip={handlePlanTripToDestination}
          />
        </ErrorBoundary>
      )}

      {/* Emergency & Helplines Modal */}
      <ErrorBoundary fallbackTitle="Emergency Helplines & Travel Guide" onReset={() => setHelpModalOpen(false)}>
        <HelpSupportModal
          isOpen={helpModalOpen}
          onClose={() => setHelpModalOpen(false)}
        />
      </ErrorBoundary>

      {/* Floating Contact Support Modal (Contact Namma Prayana Support) */}
      <ErrorBoundary fallbackTitle="Contact Support" onReset={() => setContactModalOpen(false)}>
        <ContactSupportModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />
      </ErrorBoundary>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          if (view === 'help' || view === 'emergency') {
            setHelpModalOpen(true);
            return;
          }
          if (view === 'contact' || view === 'support') {
            setContactModalOpen(true);
            return;
          }
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHelp={() => setHelpModalOpen(true)}
        onOpenContact={() => setContactModalOpen(true)}
      />

      {/* Floating Website Guidance Assistant (Inspired by reference video) */}
      <FloatingGuideAssistant
        onNavigate={(view) => {
          if (view === 'contact' || view === 'support') {
            setContactModalOpen(true);
          } else if (view === 'help' || view === 'emergency') {
            setHelpModalOpen(true);
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenContact={() => setContactModalOpen(true)}
        onOpenHelp={() => setHelpModalOpen(true)}
        currentView={currentView}
      />

      {/* Firebase Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          showToast(language === 'kn' ? 'ಸ್ವಾಗತ! ಯಶಸ್ವಿಯಾಗಿ ಲಾಗಿನ್ ಆಗಿದ್ದೀರಿ.' : 'Welcome! Logged in successfully.');
        }}
      />

      {/* Guest Save / Cloud Sync Prompt Modal */}
      <GuestSaveModal
        isOpen={guestSaveModalOpen}
        itemDescription={guestSaveModalDesc}
        onClose={() => setGuestSaveModalOpen(false)}
        onOpenLogin={() => {
          setGuestSaveModalOpen(false);
          setAuthMode('login');
          setAuthModalOpen(true);
        }}
        onOpenRegister={() => {
          setGuestSaveModalOpen(false);
          setAuthMode('register');
          setAuthModalOpen(true);
        }}
      />
    </div>
  );
}
