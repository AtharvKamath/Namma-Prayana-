import React, { useState } from 'react';
import { BOOKING_PROVIDERS } from '../data/bookingProviders';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Hotel, 
  ExternalLink, 
  Sparkles, 
  TreePine, 
  Landmark, 
  Waves, 
  Coffee, 
  ShieldCheck
} from 'lucide-react';

interface HotelsViewProps {
  onNavigateToPlanner?: () => void;
}

export const HotelsView: React.FC<HotelsViewProps> = ({ onNavigateToPlanner }) => {
  const { language, t } = useTranslation();
  const isKn = language === 'kn';

  const [activeFilter, setActiveFilter] = useState<'all' | 'govt' | 'homestays' | 'budget'>('all');

  // Filter hotel providers from BOOKING_PROVIDERS
  const hotelProviders = BOOKING_PROVIDERS.filter((p) => p.category === 'hotel');

  const filteredProviders = hotelProviders.filter((provider) => {
    if (activeFilter === 'govt') return provider.isOfficialGovt;
    if (activeFilter === 'homestays') return provider.id === 'makemytrip-hotels';
    if (activeFilter === 'budget') return provider.id === 'goibibo-hotels';
    return true;
  });

  // Distinct Karnataka stay experiences
  const stayExperiences = [
    {
      title: isKn ? 'ಕಾಫಿ ತೋಟದ ಹೋಮ್‌ಸ್ಟೇಗಳು' : 'Coffee Plantation Homestays',
      region: isKn ? 'ಕೊಡಗು, ಚಿಕ್ಕಮಗಳೂರು, ಸಕಲೇಶಪುರ' : 'Kodagu (Coorg), Chikkamagaluru, Sakleshpur',
      description: isKn 
        ? 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಹಸಿರು ಕಾಫಿ ಮತ್ತು ಏಲಕ್ಕಿ ತೋಟಗಳ ನಡುವೆ ನೈಜ ಮಲೆನಾಡು ಆತಿಥ್ಯ, ಸಾಂಪ್ರದಾಯಿಕ ಆಹಾರ ಮತ್ತು ಪ್ರಶಾಂತ ಪರಿಸರ.'
        : 'Wake up to the aroma of freshly roasted Arabica and birdsong. Experience legendary Malnad hospitality with authentic home-cooked delicacies.',
      icon: Coffee,
      badge: isKn ? 'ಮಲೆನಾಡು ಆತಿಥ್ಯ' : 'Malnad Hospitality',
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      destQuery: 'Coorg',
    },
    {
      title: isKn ? 'ಅಧಿಕೃತ ಜಂಗಲ್ ಲಾಡ್ಜ್ & ಸಫಾರಿ' : 'Jungle Lodges & Wildlife Eco-Resorts',
      region: isKn ? 'ಕಬಿನಿ, ಬಂಡೀಪುರ, ದಾಂಡೇಲಿ, ಭದ್ರಾ' : 'Kabini, Bandipur, Dandeli, Bhadra',
      description: isKn
        ? 'ಸರ್ಕಾರಿ ಒಡೆತನದ JLR ಜಂಗಲ್ ಲಾಡ್ಜ್‌ಗಳು ಪರಿಸರ ಸಂರಕ್ಷಣೆಗೆ ಹೆಸರುವಾಸಿಯಾಗಿದ್ದು, ಅನುಭವಿ ನ್ಯಾಚುರಲಿಸ್ಟ್‌ಗಳೊಂದಿಗೆ ಸಫಾರಿ ಮತ್ತು ಕಾಡಿನ ತಂಗುದಾಣ ನೀಡುತ್ತವೆ.'
        : 'Pioneered by Karnataka Govt (JLR), offering ethical wildlife safaris, expert naturalists, riverside tented cottages, and untamed jungle immersion.',
      icon: TreePine,
      badge: isKn ? 'ಸರ್ಕಾರಿ ಇಕೋ-ರೆಸಾರ್ಟ್' : 'JLR Pioneers',
      color: 'bg-teal-50 text-teal-800 border-teal-200',
      destQuery: 'Kabini',
    },
    {
      title: isKn ? 'ರಾಜ ಪಾರಂಪರಿಕ ಅರಮನೆ & ಹೋಟೆಲ್' : 'Royal Heritage & Monument Stays',
      region: isKn ? 'ಮೈಸೂರು, ಹಂಪಿ, ಬಾದಾಮಿ, ಬೇಲೂರು' : 'Mysuru, Hampi, Badami, Belur',
      description: isKn
        ? 'ವಿಜಯನಗರ ಸಾಮ್ರಾಜ್ಯ ಮತ್ತು ಒಡೆಯರ್ ರಾಜಮನೆತನದ ಭವ್ಯ ಇತಿಹಾಸವನ್ನು ನೆನಪಿಸುವ ಮಯೂರ KSTDC ಹೋಟೆಲ್‌ಗಳು ಮತ್ತು ಅರಮನೆ ಮಾದರಿಯ ತಂಗುದಾಣಗಳು.'
        : 'Stay near UNESCO world heritage ruins and Wodeyar architectural wonders. KSTDC Mayura hotels offer prime heritage locations next to monuments.',
      icon: Landmark,
      badge: isKn ? 'ಪಾರಂಪರಿಕ ತಂಗುದಾಣ' : 'Heritage & Palace',
      color: 'bg-amber-50 text-amber-900 border-amber-200',
      destQuery: 'Mysuru',
    },
    {
      title: isKn ? 'ಕರಾವಳಿ ಬೀಚ್ ರೆಸಾರ್ಟ್‌ಗಳು' : 'Coastal Beachfront & Cliffside Stays',
      region: isKn ? 'ಗೋಕರ್ಣ, ಉಡುಪಿ, ಕಾರವಾರ, ಮಂಗಳೂರು' : 'Gokarna, Udupi, Karwar, Mangaluru',
      description: isKn
        ? 'ಅರಬ್ಬೀ ಸಮುದ್ರದ ಅಲೆಗಳ ಸದ್ದು, ಓಂ ಬೀಚ್ ಮತ್ತು ಮಲ್ಪೆ ತೀರಗಳ ಬಳಿ ನೈಸರ್ಗಿಕ ರೆಸಾರ್ಟ್‌ಗಳು ಮತ್ತು ತಾಜಾ ಕರಾವಳಿ ಊಟೋಪಚಾರ.'
        : 'Unwind along Karnataka\'s 320-km coastline with Arabian Sea sunsets, tranquil cliffside chalets, and authentic coastal cuisine.',
      icon: Waves,
      badge: isKn ? 'ಕರಾವಳಿ ತೀರ' : 'Arabian Sea Coast',
      color: 'bg-sky-50 text-sky-800 border-sky-200',
      destQuery: 'Gokarna',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Section */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Hotel className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>{t('hotelsBadge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 leading-snug sm:leading-tight break-words">
          {t('hotelsPageTitle')}
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm max-w-3xl leading-relaxed break-words">
          {t('hotelsPageSubtitle')}
        </p>
      </div>

      {/* 2. Direct Provider Booking Policy Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs flex items-start gap-3.5 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 min-w-0">
          <span className="font-extrabold block text-sm leading-snug">
            {t('hotelsTransparencyTitle')}
          </span>
          <p className="text-xs text-amber-900 leading-relaxed break-words">
            {t('hotelsTransparencyDesc')}
          </p>
        </div>
      </div>

      {/* 3. Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeFilter === 'all'
              ? 'bg-[#0f4c5c] text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          {t('hotelsFilterAll')}
        </button>
        <button
          onClick={() => setActiveFilter('govt')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeFilter === 'govt'
              ? 'bg-[#0f4c5c] text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          {t('hotelsFilterGovt')}
        </button>
        <button
          onClick={() => setActiveFilter('homestays')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeFilter === 'homestays'
              ? 'bg-[#0f4c5c] text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          {t('hotelsFilterHomestays')}
        </button>
        <button
          onClick={() => setActiveFilter('budget')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeFilter === 'budget'
              ? 'bg-[#0f4c5c] text-white shadow-xs'
              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          }`}
        >
          {t('hotelsFilterBudget')}
        </button>
      </div>

      {/* 4. Hotel Provider Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => {
          const directUrl = provider.searchUrlGenerator();
          const badgeText = isKn && provider.badgeKn ? provider.badgeKn : provider.badge;
          const descText = isKn && provider.descriptionKn ? provider.descriptionKn : provider.description;

          return (
            <div
              key={provider.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-4">
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
                    <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 whitespace-nowrap shrink-0">
                      {isKn ? 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ' : 'Official Govt'}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {descText}
                </p>
              </div>

              {/* Action Buttons */}
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
                      : `${t('hotelsBookDirectBtn')} ${provider.name.split(' ')[0]}`}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>

                <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                  <span className="text-[10px] text-stone-400">
                    {isKn ? 'ಬಾಹ್ಯ ವೆಬ್‌ಸೈಟ್‌ಗೆ ತೆರೆಯುತ್ತದೆ' : 'Opens external booking site'}
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

      {/* 5. Curated Karnataka Stay Styles */}
      <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/90 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isKn ? 'ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಅನುಭವಗಳು' : 'Signature Accommodations'}</span>
          </span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
            {t('hotelsStayTypesTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {t('hotelsStayTypesSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {stayExperiences.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80 flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 shadow-2xs flex items-center justify-center text-emerald-800 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
                        {exp.title}
                      </h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${exp.color} shrink-0`}>
                      {exp.badge}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="text-[11px] text-stone-500 pt-1">
                    <strong className="text-stone-700">{isKn ? 'ಪ್ರಮುಖ ತಾಣಗಳು:' : 'Top Hubs:'}</strong> {exp.region}
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                  <a
                    href={`https://www.makemytrip.com/hotels/hotel-listing/?searchText=${encodeURIComponent(exp.destQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0f4c5c] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isKn ? `${exp.destQuery} ತಂಗುದಾಣಗಳನ್ನು ಹುಡುಕಿ` : `Search Stays in ${exp.destQuery}`}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {onNavigateToPlanner && (
                    <button
                      onClick={onNavigateToPlanner}
                      className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 cursor-pointer"
                    >
                      {isKn ? 'ಪ್ರವಾಸ ಯೋಜಿಸಿ' : 'Plan Trip'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
