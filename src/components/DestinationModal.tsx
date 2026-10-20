import React from 'react';
import { Destination } from '../types/travel';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  X, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Compass, 
  ExternalLink, 
  Plus, 
  Calendar, 
  Train, 
  Plane, 
  ShieldCheck, 
  Info 
} from 'lucide-react';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  onAddToTrip: (destination: Destination) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onAddToTrip,
}) => {
  const { language, t } = useTranslation();
  if (!destination) return null;

  const isKn = language === 'kn';
  const displayName = isKn ? destination.kannadaName : destination.name;
  const secondaryName = isKn ? destination.name : destination.kannadaName;
  const displayTagline = (isKn && destination.taglineKn) ? destination.taglineKn : destination.tagline;
  const displayDescription = (isKn && destination.descriptionKn) ? destination.descriptionKn : destination.description;
  const displayHistorical = (isKn && destination.historicalBackgroundKn) ? destination.historicalBackgroundKn : destination.historicalBackground;
  const displayAttractions = (isKn && destination.mainAttractionsKn) ? destination.mainAttractionsKn : destination.mainAttractions;
  const displayActivities = (isKn && destination.recommendedActivitiesKn) ? destination.recommendedActivitiesKn : destination.recommendedActivities;
  const displayBestTime = (isKn && destination.bestTimeToVisitKn) ? destination.bestTimeToVisitKn : destination.bestTimeToVisit;
  const displayOpeningHours = (isKn && destination.openingHoursKn) ? destination.openingHoursKn : destination.openingHours;
  const displayEntryFee = (isKn && destination.entryFeeKn) ? destination.entryFeeKn : destination.entryFee;
  const displayAddress = (isKn && destination.addressKn) ? destination.addressKn : destination.address;
  const displayAccessibility = (isKn && destination.accessibilityNotesKn) ? destination.accessibilityNotesKn : destination.accessibilityNotes;
  const displayRail = (isKn && destination.nearestRailwayStationKn) ? destination.nearestRailwayStationKn : destination.nearestRailwayStation;
  const displayAir = (isKn && destination.nearestAirportKn) ? destination.nearestAirportKn : destination.nearestAirport;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Hero Image */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden rounded-t-3xl bg-stone-900">
          <img
            src={destination.imageUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (destination.gallery?.[0] && target.src !== destination.gallery[0]) {
                target.src = destination.gallery[0];
              } else {
                target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300"><rect width="600" height="300" fill="%230f4c5c"/><text x="300" y="150" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">ನಮ್ಮ ಪ್ರಯಾಣ · Namma Prayana</text></svg>';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30"></div>
          {destination.imageAttribution && (
            <div className="absolute top-4 left-4 max-w-[70%]">
              <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-white/90 font-medium truncate block">
                📷 {destination.imageAttribution}
              </span>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Bottom Title Overlay */}
          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                {isKn ? `${destination.district} ಜಿಲ್ಲೆ` : destination.district} · {destination.region}
              </span>
              <span className="text-white/60">·</span>
              <span className="text-xs text-white/80 font-kannada font-semibold">
                {secondaryName}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-snug break-words">
              {displayName}
            </h2>
            <p className="text-xs sm:text-sm text-stone-200 font-medium">
              {displayTagline}
            </p>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('modalBestTime')}</span>
              <span className="font-bold text-stone-800">{displayBestTime.split('(')[0]}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('modalEntryTariff')}</span>
              <span className="font-bold text-emerald-800">
                {destination.entryFeeInr === 0 ? t('cardFreeEntry') : `₹${destination.entryFeeInr} / person`}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">{t('modalDuration')}</span>
              <span className="font-bold text-stone-800">~{destination.suggestedDurationHours} {isKn ? 'ಗಂಟೆಗಳು' : 'Hours'}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold">{isKn ? 'ಬೆಂಗಳೂರಿನಿಂದ' : 'From BLR'}</span>
              <span className="font-bold text-stone-800">~{destination.approxDistanceKmFromBengaluru} km</span>
            </div>
          </div>

          {/* About / Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">
              {t('modalAboutTitle')}
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {displayDescription}
            </p>
          </div>

          {/* History & Heritage */}
          {displayHistorical && (
            <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                {t('modalHeritageTitle')}
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                {displayHistorical}
              </p>
            </div>
          )}

          {/* Key Attractions & Experiences */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                {t('modalKeyAttractions')}
              </h4>
              <ul className="space-y-1 text-xs text-stone-600">
                {displayAttractions.map((att, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{att}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                {t('modalRecommendedExperiences')}
              </h4>
              <ul className="space-y-1 text-xs text-stone-600">
                {displayActivities.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Practical Info Grid */}
          <div className="pt-4 border-t border-stone-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="font-bold text-stone-900 block">{t('modalTimings')}</span>
                <span className="text-stone-600">{displayOpeningHours}</span>
              </div>
              <div>
                <span className="font-bold text-stone-900 block">{t('modalOfficialTariffs')}</span>
                <span className="text-stone-600">{displayEntryFee}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-stone-900 block">{t('modalLocation')}</span>
              <span className="text-stone-600">{displayAddress}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="font-bold text-stone-900 block">{t('modalTransitLinks')}</span>
                <span className="text-stone-600">{isKn ? `ರೈಲು: ${displayRail} | ವಿಮಾನ: ${displayAir}` : `Rail: ${displayRail} | Air: ${displayAir}`}</span>
              </div>
              {displayAccessibility && (
                <div>
                  <span className="font-bold text-stone-900 block">{t('modalAccessibilityNotes')}</span>
                  <span className="text-stone-600">{displayAccessibility}</span>
                </div>
              )}
            </div>

            {/* Official Source Attestation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <span className="flex items-center gap-1">
                {t('modalOfficialSource')}{' '}
                {destination.officialSourceUrl ? (
                  <a
                    href={destination.officialSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    {destination.officialSource}
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span className="font-medium text-stone-700">{destination.officialSource}</span>
                )}
              </span>
              <span className="text-stone-400">
                {t('modalLastVerified')} {destination.lastVerifiedDate}
              </span>
            </div>
            <p className="text-[10px] text-stone-400 italic">
              {isKn 
                ? '* ಸಮಯ, ಪ್ರವೇಶ ಶುಲ್ಕಗಳು ಮತ್ತು ಮಾರ್ಗಸೂಚಿಗಳು ಕಾಲೋಚಿತವಾಗಿ ಬದಲಾಗಬಹುದು. ಪ್ರವಾಸಕ್ಕೂ ಮುನ್ನ ಅಧಿಕೃತ ಮೂಲಗಳಲ್ಲಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.'
                : '* Hours, tariffs, and guidelines may vary on festival days. Always verify with official portals.'}
            </p>
          </div>

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#0f4c5c] hover:underline flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>{t('modalGetDirections')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors cursor-pointer"
              >
                {language === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
              </button>

              <button
                onClick={() => {
                  onAddToTrip(destination);
                  onClose();
                }}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0f4c5c] to-[#047857] text-white font-bold text-xs hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{t('modalAddToMyTrip')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
