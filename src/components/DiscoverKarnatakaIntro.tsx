import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Waves, 
  TreePine, 
  Castle, 
  Compass, 
  ArrowRight, 
  MapPin, 
  Sparkles 
} from 'lucide-react';

interface DiscoverKarnatakaIntroProps {
  onExploreRegions: () => void;
}

export const DiscoverKarnatakaIntro: React.FC<DiscoverKarnatakaIntroProps> = ({
  onExploreRegions,
}) => {
  const { language, t } = useTranslation();

  const regionsSummary = [
    {
      id: 'karavali',
      title: t('homeIntroKaravaliTitle'),
      kannadaTitle: 'ಕರಾವಳಿ',
      icon: Waves,
      iconBg: 'bg-teal-50 text-teal-700',
      badgeColor: 'border-teal-200 text-teal-800 bg-teal-50/50',
      districts: language === 'kn' ? 'ಉತ್ತರ ಕನ್ನಡ · ಉಡುಪಿ · ದಕ್ಷಿಣ ಕನ್ನಡ' : 'Uttara Kannada · Udupi · Dakshina Kannada',
      desc: t('homeIntroKaravaliDesc'),
      highlights: language === 'kn' ? 'ಗೋಕರ್ಣ · ಮಲ್ಪೆ · ಮುರುಡೇಶ್ವರ' : 'Gokarna · Malpe · Murudeshwar',
    },
    {
      id: 'malenadu',
      title: t('homeIntroMalenaduTitle'),
      kannadaTitle: 'ಮಲೆನಾಡು',
      icon: TreePine,
      iconBg: 'bg-emerald-50 text-emerald-700',
      badgeColor: 'border-emerald-200 text-emerald-800 bg-emerald-50/50',
      districts: language === 'kn' ? 'ಕೊಡಗು · ಚಿಕ್ಕಮಗಳೂರು · ಶಿವಮೊಗ್ಗ · ಹಾಸನ' : 'Kodagu · Chikkamagaluru · Shivamogga · Hassan',
      desc: t('homeIntroMalenaduDesc'),
      highlights: language === 'kn' ? 'ಜೋಗ ಜಲಪಾತ · ಕೂರ್ಗ್ · ಕುದುರೆಮುಖ' : 'Jog Falls · Coorg · Kudremukh',
    },
    {
      id: 'north',
      title: t('homeIntroNorthTitle'),
      kannadaTitle: 'ಉತ್ತರ ಕರ್ನಾಟಕ',
      icon: Castle,
      iconBg: 'bg-amber-50 text-amber-800',
      badgeColor: 'border-amber-200 text-amber-800 bg-amber-50/50',
      districts: language === 'kn' ? 'ವಿಜಯನಗರ · ಬಾಗಲಕೋಟೆ · ವಿಜಯಪುರ · ಬಾದಾಮಿ' : 'Vijayanagara · Bagalkote · Vijayapura · Badami',
      desc: t('homeIntroNorthDesc'),
      highlights: language === 'kn' ? 'ಹಂಪಿ · ಬಾದಾಮಿ ಗುಹೆಗಳು · ಪಟ್ಟದಕಲ್ಲು' : 'Hampi · Badami Caves · Pattadakal',
    },
    {
      id: 'south',
      title: t('homeIntroSouthTitle'),
      kannadaTitle: 'ಹಳೇ ಮೈಸೂರು',
      icon: Compass,
      iconBg: 'bg-indigo-50 text-indigo-700',
      badgeColor: 'border-indigo-200 text-indigo-800 bg-indigo-50/50',
      districts: language === 'kn' ? 'ಮೈಸೂರು · ಮಂಡ್ಯ · ಚಾಮರಾಜನಗರ · ಬೆಂಗಳೂರು' : 'Mysuru · Mandya · Chamarajanagar · Bengaluru',
      desc: t('homeIntroSouthDesc'),
      highlights: language === 'kn' ? 'ಮೈಸೂರು ಅರಮನೆ · ಕಬಿನಿ · ನಾಡಹಬ್ಬ ದಸರಾ' : 'Mysore Palace · Kabini · Dasara',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-stone-50 via-white to-stone-50/60 rounded-3xl border border-stone-200/90 p-6 sm:p-8 lg:p-10 shadow-xs space-y-8">
      {/* Introduction Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200/80">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold tracking-wide">
            <Compass className="w-3.5 h-3.5 text-[#0f4c5c]" />
            <span>{t('homeIntroBadge')}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-snug sm:leading-tight break-words">
            {t('homeIntroTitle')}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl break-words">
            {t('homeIntroSubtitle')}
          </p>
        </div>

        {/* Clear link to existing About Karnataka & Regions page */}
        <button
          onClick={onExploreRegions}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0f4c5c] hover:bg-[#093540] text-white font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-md active:scale-95 cursor-pointer shrink-0 self-start md:self-auto group"
        >
          <span>{t('homeIntroViewFullGuide')}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* 4 Regions Concise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {regionsSummary.map((reg) => {
          const IconComponent = reg.icon;
          return (
            <div
              key={reg.id}
              onClick={onExploreRegions}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl ${reg.iconBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${reg.badgeColor}`}>
                    {reg.kannadaTitle}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-stone-900 text-base leading-snug group-hover:text-[#0f4c5c] transition-colors break-words">
                    {reg.title}
                  </h3>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5 leading-normal break-words">
                    {reg.districts}
                  </p>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed break-words">
                  {reg.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-stone-400">
                  {reg.highlights}
                </span>
                <span className="text-[11px] font-bold text-[#0f4c5c] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>{language === 'kn' ? 'ವಿವರ' : 'Details'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle regional tip banner */}
      <div className="rounded-2xl bg-stone-100/80 border border-stone-200/70 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            {language === 'kn' 
              ? 'ಪ್ರತಿ ವಲಯವು ವಿಶಿಷ್ಟ ನೈಸರ್ಗಿಕ ಸೌಂದರ್ಯ, ಜಿಐ-ಟ್ಯಾಗ್ ಪಡೆದ ಕರಕುಶಲ ವಸ್ತುಗಳು ಮತ್ತು ಐತಿಹಾಸಿಕ ತಾಣಗಳನ್ನು ಹೊಂದಿದೆ.'
              : 'Each region offers distinct geography, GI-tagged authentic crafts, seasonal weather, and state road connections.'}
          </span>
        </div>
        <button
          onClick={onExploreRegions}
          className="text-xs font-bold text-[#0f4c5c] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <span>{language === 'kn' ? 'ಪೂರ್ಣ ಮಾಹಿತಿ ಪುಟಕ್ಕೆ ಹೋಗಿ' : 'Open Regional Guide'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
