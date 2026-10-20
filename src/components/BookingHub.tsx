import React, { useState } from 'react';
import { 
  BOOKING_PROVIDERS, 
  POPULAR_KARNATAKA_ROUTES 
} from '../data/bookingProviders';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Bus, 
  Train, 
  Plane, 
  Car, 
  ExternalLink, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface BookingHubProps {
  initialCategory?: 'bus' | 'train' | 'flight' | 'cab' | 'hotel';
}

export const BookingHub: React.FC<BookingHubProps> = ({
  initialCategory = 'bus',
}) => {
  const { language, t } = useTranslation();
  const isKn = language === 'kn';

  const defaultCategory = initialCategory === 'hotel' ? 'bus' : initialCategory;
  const [activeTab, setActiveTab] = useState<'bus' | 'train' | 'flight' | 'cab'>(defaultCategory);

  React.useEffect(() => {
    if (initialCategory && initialCategory !== 'hotel') {
      setActiveTab(initialCategory);
    }
  }, [initialCategory]);

  const filteredProviders = BOOKING_PROVIDERS.filter((p) => p.category === activeTab);

  const tabs = [
    { id: 'bus', label: t('bookingTabBus'), icon: Bus },
    { id: 'train', label: t('bookingTabTrain'), icon: Train },
    { id: 'flight', label: t('bookingTabFlight'), icon: Plane },
    { id: 'cab', label: t('bookingTabCab'), icon: Car },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>{t('bookingBadge')}</span>
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mt-1 leading-snug sm:leading-tight break-words">
          {t('bookingTitle')}
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed break-words">
          {t('bookingSubtitle')}
        </p>
      </div>

      {/* 2. Direct Provider Booking Policy Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs flex items-start gap-3.5 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 min-w-0">
          <span className="font-extrabold block text-sm leading-snug">
            {t('bookingTransparencyNoticeTitle')}
          </span>
          <p className="text-xs text-amber-900 leading-relaxed break-words">
            {t('bookingTransparencyNoticeDesc')}
          </p>
        </div>
      </div>

      {/* 3. Transport Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#0f4c5c] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="leading-snug">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => {
          const directUrl = provider.searchUrlGenerator();
          const badgeText = isKn && provider.badgeKn ? provider.badgeKn : provider.badge;
          const descText = isKn && provider.descriptionKn ? provider.descriptionKn : provider.description;

          return (
            <div
              key={provider.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-12 rounded-2xl bg-white border border-stone-200/80 shadow-xs flex items-center justify-center p-1.5 shrink-0 overflow-hidden group-hover:border-emerald-300 transition-colors">
                      {provider.logoUrl ? (
                        <img
                          src={provider.logoUrl}
                          alt={`${provider.name} logo`}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.logo-fallback')) {
                              const fallback = document.createElement('span');
                              fallback.className = 'logo-fallback font-black text-xs text-stone-800 tracking-wider';
                              fallback.innerText = provider.logoText;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <span className="font-black text-xs text-stone-800 tracking-wider">
                          {provider.logoText}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-900 text-base leading-tight">
                        {provider.name}
                      </h4>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {badgeText}
                      </span>
                    </div>
                  </div>

                  {provider.isOfficialGovt && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 whitespace-nowrap">
                      {isKn ? 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ' : 'Official Govt'}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {descText}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-[#0f4c5c] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
                >
                  <span className="leading-snug break-words">
                    {provider.buttonLabel
                      ? (isKn && provider.buttonLabelKn ? provider.buttonLabelKn : provider.buttonLabel)
                      : `${t('bookingSearchOn')} ${provider.name.split(' ')[0]}`}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>

                <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                  <span className="text-[10px] text-stone-400">
                    {isKn ? 'ಬಾಹ್ಯ ಪೋರ್ಟಲ್‌ಗೆ ತೆರೆಯುತ್ತದೆ' : 'Opens external booking site'}
                  </span>
                  <a
                    href={provider.officialWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0f4c5c] hover:underline font-semibold flex items-center gap-0.5 text-[11px]"
                  >
                    <span>{isKn ? 'ಮುಖಪುಟ' : 'Homepage'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Realistic Route Fare Benchmarks */}
      <div className="space-y-4 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <h3 className="font-extrabold text-stone-900 text-base leading-snug break-words">
            {t('bookingRouteBenchmarksTitle')}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed break-words">
            {t('bookingRouteBenchmarksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_KARNATAKA_ROUTES.map((route, i) => {
            const routeTitle = isKn && route.routeKn ? route.routeKn : route.route;
            const routeTime = isKn && route.travelTimeKn ? route.travelTimeKn : route.travelTime;
            return (
              <div
                key={i}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2 text-xs"
              >
                <div className="font-bold text-stone-900 flex items-center justify-between">
                  <span>{routeTitle}</span>
                  <span className="text-[10px] text-stone-500">~{route.distanceKm} km ({routeTime})</span>
                </div>
                <div className="space-y-1.5 text-stone-600 pt-1 border-t border-stone-200/60">
                  {route.transportModes.map((tm, tmIdx) => {
                    const modeTitle = isKn && tm.modeKn ? tm.modeKn : tm.mode;
                    return (
                      <div key={tmIdx} className="flex justify-between items-baseline">
                        <span className="text-[11px] text-stone-600">{modeTitle}:</span>
                        <span className="font-bold text-stone-900 text-[11px]">{tm.priceRangeInr}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
