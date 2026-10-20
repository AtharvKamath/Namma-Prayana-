import React, { useRef, useState } from 'react';
import { TripItinerary } from '../types/travel';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Bookmark, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Trash2, 
  ExternalLink, 
  Download, 
  Upload, 
  Sparkles, 
  Clock,
  AlertCircle,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';

interface SavedTripsViewProps {
  savedTrips: TripItinerary[];
  onSelectTrip: (trip: TripItinerary) => void;
  onDeleteTrip: (tripId: string) => void;
  onImportTrips: (trips: TripItinerary[]) => void;
  onNavigateToPlanner: () => void;
}

// Translations for proper nouns & circuits when in Kannada
const CITY_KANNADA_MAP: Record<string, string> = {
  'Bengaluru': 'ಬೆಂಗಳೂರು',
  'Bangalore': 'ಬೆಂಗಳೂರು',
  'Mysuru': 'ಮೈಸೂರು',
  'Mysore': 'ಮೈಸೂರು',
  'Mangaluru': 'ಮಂಗಳೂರು',
  'Mangalore': 'ಮಂಗಳೂರು',
  'Hubballi': 'ಹುಬ್ಬಳ್ಳಿ',
  'Hubli': 'ಹುಬ್ಬಳ್ಳಿ',
  'Belagavi': 'ಬೆಳಗಾವಿ',
  'Belgaum': 'ಬೆಳಗಾವಿ',
  'Shivamogga': 'ಶಿವಮೊಗ್ಗ',
  'Shimoga': 'ಶಿವಮೊಗ್ಗ',
  'Udupi': 'ಉಡುಪಿ',
  'Coorg': 'ಕೊಡಗು (ಕೂರ್ಗ್)',
  'Kodagu': 'ಕೊಡಗು',
  'Chikkamagaluru': 'ಚಿಕ್ಕಮಗಳೂರು',
  'Hampi': 'ಹಂಪಿ',
  'Badami': 'ಬಾದಾಮಿ',
  'Gokarna': 'ಗೋಕರ್ಣ',
  'Kabini': 'ಕಬಿನಿ',
  'Bandipur': 'ಬಂಡೀಪುರ',
  'Belur': 'ಬೇಲೂರು',
  'Halebidu': 'ಹಳೇಬೀಡು',
  'Pattadakal': 'ಪಟ್ಟದಕಲ್ಲು',
  'Aihole': 'ಐಹೊಳೆ',
  'Jog Falls': 'ಜೋಗ ಜಲಪಾತ',
  'Dandeli': 'ದಾಂಡೇಲಿ',
  'Murudeshwar': 'ಮುರುಡೇಶ್ವರ'
};

const CITY_ENGLISH_MAP: Record<string, string> = Object.entries(CITY_KANNADA_MAP).reduce(
  (acc, [en, kn]) => {
    acc[kn] = en;
    return acc;
  },
  {} as Record<string, string>
);

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  savedTrips,
  onSelectTrip,
  onDeleteTrip,
  onImportTrips,
  onNavigateToPlanner,
}) => {
  const { language, t } = useTranslation();
  const isKn = language === 'kn';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);

  const translateLocation = (loc?: string): string => {
    if (!loc) return isKn ? 'ಕರ್ನಾಟಕ' : 'Karnataka';
    const trimmed = loc.trim();
    if (isKn) {
      return CITY_KANNADA_MAP[trimmed] || trimmed;
    } else {
      return CITY_ENGLISH_MAP[trimmed] || trimmed;
    }
  };

  const translateTripTitle = (title?: string, duration?: number): string => {
    if (!title) return isKn ? 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ' : 'Karnataka Journey';
    if (isKn) {
      if (title.includes('Discovery Journey') || title.includes('Discovery')) {
        return 'ಕರ್ನಾಟಕ ಅನ್ವೇಷಣಾ ಪ್ರವಾಸ';
      }
      if (title.includes('Curated Karnataka') || title.includes('Curated')) {
        return 'ಆಯ್ದ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜನೆ';
      }
      if (title.includes('Heritage')) {
        return 'ಕರ್ನಾಟಕ ಪಾರಂಪರಿಕ ಪ್ರವಾಸ';
      }
      if (title.includes('Coastal')) {
        return 'ಕರಾವಳಿ ಕರ್ನಾಟಕ ಕಡಲತೀರ ಪ್ರವಾಸ';
      }
      if (title.includes('Western Ghats') || title.includes('Malnad')) {
        return 'ಮಲೆನಾಡು & ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಪ್ರವಾಸ';
      }
      if (title.match(/\d+[- ]Day/i)) {
        return `${duration || 3}-ದಿನಗಳ ಕರ್ನಾಟಕ ಪ್ರವಾಸ`;
      }
      return title;
    } else {
      if (title.includes('ಅನ್ವೇಷಣಾ') || title.includes('ಅನ್ವೇಷಣೆ')) {
        return 'Karnataka Discovery Journey';
      }
      if (title.includes('ಆಯ್ದ')) {
        return 'Curated Karnataka Itinerary';
      }
      if (title.includes('ಪಾರಂಪರಿಕ') || title.includes('ಪರಂಪರೆ')) {
        return 'Karnataka Heritage Circuit';
      }
      if (title.includes('ಕರಾವಳಿ')) {
        return 'Coastal Karnataka Journey';
      }
      if (title.includes('ಮಲೆನಾಡು')) {
        return 'Malnad & Western Ghats Journey';
      }
      return title;
    }
  };

  const formatBudgetTier = (tier?: string): string => {
    const raw = (tier || 'comfort').toLowerCase();
    if (isKn) {
      if (raw === 'budget') return 'ಮಿತವ್ಯಯ (ಬಜೆಟ್)';
      if (raw === 'luxury' || raw === 'premium') return 'ಐಷಾರಾಮಿ';
      return 'ಆರಾಮದಾಯಕ';
    }
    if (raw === 'budget') return 'Budget';
    if (raw === 'luxury' || raw === 'premium') return 'Luxury';
    return 'Comfort';
  };

  const handleExportJSON = () => {
    if (savedTrips.length === 0) return;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(savedTrips, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `namma-prayana-saved-trips-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportTrips(parsed);
        } else if (parsed && parsed.id) {
          onImportTrips([parsed]);
        }
      } catch {
        setErrorMessage(
          isKn
            ? 'ಅಮಾನ್ಯ JSON ಫೈಲ್. ದಯವಿಟ್ಟು ನಮ್ಮ ಪ್ರಯಾಣದ ಅಧಿಕೃತ ಪ್ರವಾಸ ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.'
            : 'Invalid JSON file format. Please upload an authentic Namma Prayana trip export.'
        );
        setTimeout(() => setErrorMessage(null), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            {isKn ? 'ಬ್ರೌಸರ್ ಸುರಕ್ಷಿತ ಸಂಗ್ರಹಣೆ' : 'Browser Persistent Storage'}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mt-1 leading-snug sm:leading-tight break-words">
            {isKn ? 'ನನ್ನ ಉಳಿಸಿದ ಪ್ರವಾಸಗಳು' : 'My Saved Trips'} ({savedTrips.length})
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed break-words">
            {isKn 
              ? 'ನಿಮ್ಮ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜನೆಗಳನ್ನು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿಯೂ ಸುಲಭವಾಗಿ ವೀಕ್ಷಿಸಿ, ಎಡಿಟ್ ಮಾಡಿ ಮತ್ತು JSON ರೂಪದಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಿ.' 
              : 'Access, view, export, and manage your personalized Karnataka itineraries. Stored locally in your browser so you can access them offline during your journeys.'}
          </p>
        </div>

        {/* Import / Export Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title={isKn ? 'JSON ಫೈಲ್‌ನಿಂದ ಪ್ರವಾಸಗಳನ್ನು ಆಮದು ಮಾಡಿ' : 'Import trips from JSON backup'}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isKn ? 'ಪ್ರವಾಸ ಆಮದು' : 'Import Trips'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={savedTrips.length === 0}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
            title={isKn ? 'ಎಲ್ಲಾ ಪ್ರವಾಸಗಳನ್ನು JSON ರೂಪದಲ್ಲಿ ರಫ್ತು ಮಾಡಿ' : 'Export all trips as JSON'}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isKn ? 'ಎಲ್ಲವನ್ನೂ ರಫ್ತು ಮಾಡಿ (JSON)' : 'Export All (JSON)'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Saved Trips List */}
      {savedTrips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">
            {isKn ? 'ಇನ್ನೂ ಯಾವುದೇ ಪ್ರವಾಸಗಳನ್ನು ಉಳಿಸಿಲ್ಲ' : 'No saved trips yet'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            {isKn 
              ? 'ಪ್ರವಾಸ ಯೋಜಕದಲ್ಲಿ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪ್ರವಾಸ ಯೋಜನೆಯನ್ನು ಸಿದ್ಧಪಡಿಸಿ "ನನ್ನ ಪ್ರವಾಸಗಳಲ್ಲಿ ಉಳಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.' 
              : 'Generate an itinerary using our AI Trip Planner and click "Save to My Trips" to store it for your upcoming travels.'}
          </p>
          <button
            onClick={onNavigateToPlanner}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0f4c5c] to-[#047857] text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
          >
            {isKn ? 'ಹೊಸ ಪ್ರವಾಸ ಯೋಜಿಸಿ' : 'Plan a New Journey'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrips.map((trip) => {
            const isConfirmingDelete = deletingTripId === trip.id;
            const displayTitle = translateTripTitle(trip.tripTitle || trip.title, trip.durationDays);
            const displayOrigin = translateLocation(trip.originCity);
            const displayTier = formatBudgetTier(trip.budgetTier);

            return (
              <div
                key={trip.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                        {trip.durationDays} {isKn ? 'ದಿನಗಳು' : 'Days'} · {displayTier} {isKn ? 'ಶ್ರೇಣಿ' : 'Tier'}
                      </span>
                      <h3 className="font-extrabold text-stone-900 text-lg leading-tight group-hover:text-[#0f4c5c] transition-colors">
                        {displayTitle}
                      </h3>
                    </div>

                    {!isConfirmingDelete ? (
                      <button
                        onClick={() => setDeletingTripId(trip.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        title={isKn ? 'ಪ್ರವಾಸ ಅಳಿಸಿ' : 'Delete saved trip'}
                        aria-label={isKn ? 'ಪ್ರವಾಸ ಅಳಿಸಿ' : 'Delete saved trip'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>

                  {/* Inline Delete Confirmation Alert */}
                  {isConfirmingDelete && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-start gap-1.5 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                        <span>{isKn ? 'ಈ ಪ್ರವಾಸ ಯೋಜನೆಯನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿದ್ದೀರಾ?' : 'Are you sure you want to delete this trip?'}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1 justify-end">
                        <button
                          type="button"
                          onClick={() => setDeletingTripId(null)}
                          className="px-2.5 py-1 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 text-[11px] font-semibold cursor-pointer"
                        >
                          {isKn ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeletingTripId(null);
                            onDeleteTrip(trip.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold cursor-pointer shadow-2xs"
                        >
                          {isKn ? 'ಅಳಿಸಿ' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{isKn ? 'ಆರಂಭಿಕ ನಗರ:' : 'Starting City:'} <strong className="text-stone-700 font-semibold">{displayOrigin}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{trip.startDate} - {trip.endDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>
                        {isKn ? 'ಅಂದಾಜು ವೆಚ್ಚ:' : 'Estimated Cost:'}{' '}
                        <span className="font-bold text-stone-900">
                          ₹{trip.budgetBreakdown.totalEstimatedInr.toLocaleString('en-IN')}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Circuit Hubs preview */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-[11px] text-stone-600">
                    <span className="font-semibold text-stone-800">{isKn ? 'ಪ್ರಮುಖ ತಾಣಗಳು:' : 'Circuit Hubs:'} </span>
                    {trip.routeSummary.recommendedHubs.slice(0, 3).map(h => translateLocation(h)).join(' ➔ ')}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    {new Date(trip.createdAt).toLocaleDateString(isKn ? 'kn-IN' : 'en-IN')}
                  </span>

                  <button
                    onClick={() => onSelectTrip(trip)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#0f4c5c] hover:bg-[#082f38] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>{isKn ? 'ಯೋಜನೆ ತೆರೆಯಿರಿ' : 'Open Itinerary'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
