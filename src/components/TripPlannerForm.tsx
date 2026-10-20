import React, { useState } from 'react';
import { TripPlannerInput, BudgetTier, TransportMode, StayType } from '../types/travel';
import { KARNATAKA_DESTINATIONS } from '../data/destinations';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Check, 
  AlertCircle, 
  Car, 
  Bus, 
  Train, 
  CarFront, 
  Hotel, 
  Home, 
  Crown, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

interface TripPlannerFormProps {
  onSubmit: (input: TripPlannerInput) => void;
  isLoading?: boolean;
  initialValues?: Partial<TripPlannerInput>;
  error?: string | null;
  onRetry?: () => void;
}

export const TripPlannerForm: React.FC<TripPlannerFormProps> = ({
  onSubmit,
  isLoading = false,
  initialValues = {},
  error = null,
  onRetry,
}) => {
  const { language, t } = useTranslation();
  const isKn = language === 'kn';

  const [originCity, setOriginCity] = useState(initialValues.originCity || (language === 'kn' ? 'ಬೆಂಗಳೂರು' : 'Bengaluru'));
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    initialValues.destinationPreferences || ['Hampi', 'Badami', 'Pattadakal & Aihole']
  );

  // Sync selectedDestinations when initialValues.destinationPreferences changes from outside (e.g. Explore Karnataka + button)
  React.useEffect(() => {
    if (initialValues.destinationPreferences && initialValues.destinationPreferences.length > 0) {
      setSelectedDestinations(initialValues.destinationPreferences);
      setExploreAllKarnataka(false);
    }
  }, [initialValues.destinationPreferences]);

  // Loading elapsed timer for reassuring messages
  const [loadingElapsedSec, setLoadingElapsedSec] = useState(0);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingElapsedSec(0);
      interval = setInterval(() => {
        setLoadingElapsedSec((prev) => prev + 1);
      }, 1000);
    } else {
      setLoadingElapsedSec(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);
  const [exploreAllKarnataka, setExploreAllKarnataka] = useState(false);
  const [startDate, setStartDate] = useState(
    initialValues.startDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [durationDays, setDurationDays] = useState(initialValues.durationDays || 4);
  const [travellersCount, setTravellersCount] = useState(initialValues.travellersCount || 2);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(initialValues.budgetTier || 'comfort');
  const [budgetInr, setBudgetInr] = useState(initialValues.budgetInr || 24000);
  const [interests, setInterests] = useState<string[]>(
    initialValues.interests || ['Heritage', 'Temples', 'Culture', 'Food']
  );
  const [travelStyle, setTravelStyle] = useState(initialValues.travelStyle || 'Balanced Sightseeing & Relaxation');
  const [accommodationPreference, setAccommodationPreference] = useState<StayType>(
    initialValues.accommodationPreference || 'homestay'
  );
  const [transportMode, setTransportMode] = useState<TransportMode>(
    initialValues.transportMode || 'car'
  );

  const [formError, setFormError] = useState<string | null>(null);

  // Interest categories with bilingual labels
  const allInterests = [
    { id: 'Heritage', en: 'Heritage', kn: 'ಪರಂಪರೆ' },
    { id: 'History', en: 'History', kn: 'ಇತಿಹಾಸ' },
    { id: 'Temples', en: 'Temples', kn: 'ದೇವಾಲಯಗಳು' },
    { id: 'Beaches', en: 'Beaches', kn: 'ಕಡಲತೀರಗಳು' },
    { id: 'Hill Stations', en: 'Hill Stations', kn: 'ಗಿರಿಧಾಮಗಳು' },
    { id: 'Nature', en: 'Nature', kn: 'ಪ್ರಕೃತಿ' },
    { id: 'Waterfalls', en: 'Waterfalls', kn: 'ಜಲಪಾತಗಳು' },
    { id: 'Wildlife', en: 'Wildlife', kn: 'ವನ್ಯಜೀವಿಗಳು' },
    { id: 'Adventure', en: 'Adventure', kn: 'ಸಾಹಸ' },
    { id: 'Food', en: 'Food', kn: 'ಆಹಾರ & ಊಟ' },
    { id: 'Culture', en: 'Culture', kn: 'ಸಂಸ್ಕೃತಿ' },
    { id: 'Family Trips', en: 'Family Trips', kn: 'ಕುಟುಂಬ ಪ್ರವಾಸ' },
  ];

  const popularOrigins = [
    { en: 'Bengaluru', kn: 'ಬೆಂಗಳೂರು' },
    { en: 'Mysuru', kn: 'ಮೈಸೂರು' },
    { en: 'Mangaluru', kn: 'ಮಂಗಳೂರು' },
    { en: 'Hubballi', kn: 'ಹುಬ್ಬಳ್ಳಿ' },
    { en: 'Belagavi', kn: 'ಬೆಳಗಾವಿ' },
    { en: 'Shivamogga', kn: 'ಶಿವಮೊಗ್ಗ' },
    { en: 'Udupi', kn: 'ಉಡುಪಿ' },
  ];

  const handleToggleDestination = (destName: string) => {
    if (exploreAllKarnataka) {
      setExploreAllKarnataka(false);
      setSelectedDestinations([destName]);
      return;
    }

    if (selectedDestinations.includes(destName)) {
      if (selectedDestinations.length === 1) {
        setFormError(
          language === 'kn'
            ? 'ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಒಂದು ತಾಣವನ್ನು ಆರಿಸಿ ಅಥವಾ "ಕರ್ನಾಟಕ ಪೂರ್ತಿ ಅನ್ವೇಷಿಸಿ" ಆಯ್ಕೆ ಮಾಡಿ.'
            : 'Please keep at least one destination or choose "Explore all Karnataka".'
        );
        return;
      }
      setSelectedDestinations(selectedDestinations.filter(d => d !== destName));
    } else {
      setFormError(null);
      setSelectedDestinations([...selectedDestinations, destName]);
    }
  };

  const handleToggleInterest = (interestId: string) => {
    if (interests.includes(interestId)) {
      if (interests.length === 1) return;
      setInterests(interests.filter(i => i !== interestId));
    } else {
      setInterests([...interests, interestId]);
    }
  };

  const handleTierChange = (tier: BudgetTier) => {
    setBudgetTier(tier);
    const basePerPersonDay = tier === 'budget' ? 1800 : tier === 'comfort' ? 3800 : 8000;
    const suggested = basePerPersonDay * travellersCount * durationDays;
    setBudgetInr(suggested);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!originCity.trim()) {
      setFormError(
        language === 'kn'
          ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಾರಂಭಿಕ ನಗರವನ್ನು ನಮೂದಿಸಿ.'
          : 'Please enter your starting city in Karnataka.'
      );
      return;
    }

    if (!exploreAllKarnataka && selectedDestinations.length === 0) {
      setFormError(
        language === 'kn'
          ? 'ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಒಂದು ತಾಣವನ್ನು ಆರಿಸಿ ಅಥವಾ "ಕರ್ನಾಟಕ ಪೂರ್ತಿ ಅನ್ವೇಷಿಸಿ" ಆಯ್ಕೆ ಮಾಡಿ.'
          : 'Please select at least one destination preference or choose "Explore All Karnataka".'
      );
      return;
    }

    if (durationDays < 1 || durationDays > 14) {
      setFormError(
        language === 'kn'
          ? 'ಪ್ರವಾಸದ ಅವಧಿ 1 ರಿಂದ 14 ದಿನಗಳ ನಡುವೆ ಇರಬೇಕು.'
          : 'Trip duration must be between 1 and 14 days.'
      );
      return;
    }

    if (budgetInr < 3000 * durationDays) {
      setFormError(
        language === 'kn'
          ? `${durationDays}-ದಿನಗಳ ಪ್ರವಾಸಕ್ಕೆ ಕನಿಷ್ಠ ಸೂಚಿಸಿದ ಬಜೆಟ್ ₹${3000 * durationDays} ರೂ.`
          : `Minimum suggested budget for a ${durationDays}-day trip is ₹${3000 * durationDays} INR.`
      );
      return;
    }

    const calculatedEndDate = new Date(new Date(startDate).getTime() + (durationDays - 1) * 86400000)
      .toISOString()
      .split('T')[0];

    onSubmit({
      originCity,
      destinationPreferences: exploreAllKarnataka ? ['Explore All Karnataka'] : selectedDestinations,
      startDate,
      endDate: calculatedEndDate,
      durationDays,
      travellersCount,
      budgetTier,
      budgetInr,
      interests,
      travelStyle,
      accommodationPreference,
      transportMode,
      language,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 lg:p-10 space-y-8">
      {/* Form Title & Subtitle */}
      <div className="border-b border-stone-100 pb-6">
        <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{t('plannerFormBadge')}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
          {t('plannerFormTitle')}
        </h2>
        <p className="text-stone-600 text-sm mt-1">
          {t('plannerFormSubtitle')}
        </p>
      </div>

      {formError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{language === 'kn' ? 'ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ' : 'Please check the details'}</p>
            <p className="text-xs text-amber-800 mt-0.5">{formError}</p>
          </div>
        </div>
      )}

      {/* Row 1: Starting City & Travel Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Origin City */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            {t('fieldStartingCity')}
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={originCity}
              onChange={(e) => setOriginCity(e.target.value)}
              placeholder={t('fieldStartingCityPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>
          {/* Quick origin buttons */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {popularOrigins.slice(0, 5).map((city) => {
              const label = language === 'kn' ? city.kn : city.en;
              const val = city.en;
              const isSelected = originCity.toLowerCase() === val.toLowerCase() || originCity === city.kn;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => setOriginCity(label)}
                  className={`text-[11px] px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-900 font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            {t('fieldTravelDates')}
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
              required
            />
          </div>
          <p className="text-[11px] text-stone-500">
            {language === 'kn' 
              ? 'ಅತ್ಯುತ್ತಮ ಪ್ರವಾಸ ಕಾಲ: ಅಕ್ಟೋಬರ್‌ನಿಂದ ಮಾರ್ಚ್ ವರೆಗೆ.'
              : 'Optimal season: October to March across most Karnataka districts.'}
          </p>
        </div>

        {/* Duration & Travellers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              {t('fieldDurationDays')}
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="14"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value, 10) || 1)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              {t('fieldTravellersCount')}
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input
                type="number"
                min="1"
                max="20"
                value={travellersCount}
                onChange={(e) => setTravellersCount(parseInt(e.target.value, 10) || 1)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Destination Preferences */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            {t('fieldDestinationPreferences')}
          </label>
          <button
            type="button"
            onClick={() => {
              setExploreAllKarnataka(!exploreAllKarnataka);
              if (!exploreAllKarnataka) {
                setSelectedDestinations(['Explore All Karnataka']);
              } else {
                setSelectedDestinations(['Hampi', 'Badami']);
              }
            }}
            className={`text-xs font-semibold px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
              exploreAllKarnataka
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            {exploreAllKarnataka ? t('exploringAllKarnatakaActive') : t('exploreAllKarnatakaBtn')}
          </button>
        </div>

        {!exploreAllKarnataka && (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
            {KARNATAKA_DESTINATIONS.map((dest) => {
              const isSelected = selectedDestinations.includes(dest.name) || (language === 'kn' && selectedDestinations.includes(dest.kannadaName));
              const displayName = language === 'kn' ? dest.kannadaName : dest.name;
              return (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => handleToggleDestination(dest.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0f4c5c] text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{displayName}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-teal-200' : 'text-stone-400'}`}>
                    ({language === 'kn' ? `${dest.district} ಜಿಲ್ಲೆ` : dest.district})
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Row 3: Interests & Experiences */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
          {t('fieldInterestsThemes')}
        </label>
        <div className="flex flex-wrap gap-2">
          {allInterests.map((interest) => {
            const isSelected = interests.includes(interest.id);
            const label = language === 'kn' ? interest.kn : interest.en;
            return (
              <button
                key={interest.id}
                type="button"
                onClick={() => handleToggleInterest(interest.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-500/30'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 4: Budget Category & Total INR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
        {/* Budget Category Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            {t('fieldBudgetTier')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'budget', label: t('tierBudget'), desc: t('tierBudgetDesc') },
              { id: 'comfort', label: t('tierComfort'), desc: t('tierComfortDesc') },
              { id: 'premium', label: t('tierPremium'), desc: t('tierPremiumDesc') },
            ].map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => handleTierChange(tier.id as BudgetTier)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  budgetTier === tier.id
                    ? 'bg-white border-[#0f4c5c] ring-2 ring-[#0f4c5c]/20'
                    : 'bg-white/60 border-stone-200 hover:bg-white'
                }`}
              >
                <div className="font-bold text-xs text-stone-900 leading-snug break-words">{tier.label}</div>
                <div className="text-[10px] text-stone-500 mt-0.5 leading-snug break-words">{tier.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Total Budget in INR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              {t('fieldTotalBudgetInr')}
            </label>
            <span className="text-xs font-extrabold text-emerald-800">
              ₹{budgetInr.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="relative">
            <IndianRupee className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="number"
              step="1000"
              min="5000"
              max="500000"
              value={budgetInr}
              onChange={(e) => setBudgetInr(parseInt(e.target.value, 10) || 5000)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span>
              {language === 'kn' ? 'ತಲಾ ಅಂದಾಜು:' : 'Per person:'} ~₹{Math.round(budgetInr / travellersCount).toLocaleString('en-IN')}
            </span>
            <span>
              {language === 'kn' ? 'ಪ್ರತಿ ದಿನಕ್ಕೆ:' : 'Per day:'} ~₹{Math.round(budgetInr / durationDays).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Row 5: Transport & Stay Preference */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preferred Transport Mode */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            {t('fieldTransportMode')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'car', label: t('modeCar'), icon: Car },
              { id: 'cab', label: t('modeCab'), icon: CarFront },
              { id: 'bus', label: t('modeBus'), icon: Bus },
              { id: 'train', label: t('modeTrain'), icon: Train },
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setTransportMode(mode.id as TransportMode)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer min-w-0 ${
                    transportMode === mode.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="leading-snug break-words text-left min-w-0">{mode.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stay Type */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            {t('fieldAccommodationStyle')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'homestay', label: t('stayHomestay'), icon: Home },
              { id: 'resort', label: t('stayResort'), icon: Hotel },
              { id: 'budget_hotel', label: t('stayBudgetHotel'), icon: Hotel },
              { id: 'luxury_hotel', label: t('stayLuxuryHotel'), icon: Crown },
            ].map((stay) => {
              const Icon = stay.icon;
              return (
                <button
                  key={stay.id}
                  type="button"
                  onClick={() => setAccommodationPreference(stay.id as StayType)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer min-w-0 ${
                    accommodationPreference === stay.id
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="leading-snug break-words text-left min-w-0">{stay.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2 space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#0f4c5c] via-[#059669] to-[#d97706] hover:opacity-95 shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 sm:gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed leading-snug break-words text-center"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0"></div>
              <span>{t('generatingItineraryBtn')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{t('generateItineraryBtn')}</span>
            </>
          )}
        </button>

        {/* 1. Dedicated Professional Waiting Message (Displayed directly below when crafting itinerary) */}
        {isLoading && (
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-amber-50/90 via-emerald-50/80 to-teal-50/90 border border-emerald-300/80 shadow-md text-stone-800 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3.5">
              {/* Subtle animated indicator */}
              <div className="relative w-8 h-8 shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-300 border-t-emerald-700 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-relaxed">
                  {isKn
                    ? '✨ ನಿಮ್ಮ ಸುಂದರ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಸಿದ್ಧವಾಗುತ್ತಿದೆ… ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪ್ರವಾಸ ಯೋಜನೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಲು ದಯವಿಟ್ಟು 1–2 ನಿಮಿಷ ಕಾಯಿರಿ. ನಿಮ್ಮ ಪ್ರವಾಸವನ್ನು ಸ್ಮರಣೀಯವಾಗಿಸಲು ನಾವು ತಾಣಗಳು, ಮಾರ್ಗಗಳು, ಅಂದಾಜು ವೆಚ್ಚಗಳು ಮತ್ತು ಚಟುವಟಿಕೆಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಜೋಡಿಸುತ್ತಿದ್ದೇವೆ.'
                    : '✨ Crafting your perfect Karnataka journey… Please wait 1–2 minutes while we prepare your personalized itinerary. We’re carefully arranging destinations, travel routes, estimated costs, and activities to make your journey memorable.'}
                </p>

                {/* Dynamic reassuring progress step if generation takes longer */}
                <div className="pt-1.5 flex items-center gap-2 text-[11px] font-medium text-emerald-900">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></div>
                  <span>
                    {loadingElapsedSec < 12
                      ? (isKn ? 'ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಪ್ರವಾಸಿ ತಾಣಗಳು ಮತ್ತು ರಸ್ತೆ ಮಾರ್ಗಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Verifying Karnataka heritage sites, scenic ghat routes, and expressways...')
                      : loadingElapsedSec < 25
                      ? (isKn ? 'ದಿನವಾರು ಪ್ರಯಾಣದ ದೂರ ಮತ್ತು ಎನ್‌ಹೆಚ್ 275/48 ಹೆದ್ದಾರಿ ಚಾಲನಾ ಸಮಯವನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...' : 'Calculating realistic driving times and daily transit stops across Karnataka...')
                      : (isKn ? 'ಸ್ಥಳೀಯ ಕಾಫಿ ಎಸ್ಟೇಟ್ ಹೋಮ್‌ಸ್ಟೇಗಳು ಮತ್ತು ನೈಜ ಬಜೆಟ್ ಅಂದಾಜುಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...' : 'Finalizing accommodation estimates, ASI monument tickets, and contingency buffer...')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error and Retry State */}
        {error && !isLoading && (
          <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">
                  {isKn ? 'ಪ್ರವಾಸ ಯೋಜನೆ ರಚನೆ ವಿಫಲವಾಗಿದೆ' : 'Generation Encountered an Issue'}
                </span>
                <p className="text-rose-900 text-xs mt-0.5 leading-relaxed">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onRetry || handleSubmit}
              className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isKn ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 'Retry'}</span>
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] text-stone-500 mt-3 text-center">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="leading-snug">{t('trustVerifiedDestinations')}</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="leading-snug">{t('trustFeasibleDriveTimes')}</span>
          <span className="hidden sm:inline">·</span>
          <span className="leading-snug">{t('trustNoFabricatedBookings')}</span>
        </div>
      </div>
    </form>
  );
};
