import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface HeroSectionProps {
  onStartPlanning: () => void;
  onExploreDestinations: () => void;
  onSelectQuickCircuit: (circuit: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartPlanning,
  onExploreDestinations,
  onSelectQuickCircuit,
}) => {
  const { language, t } = useTranslation();

  const quickCircuits = [
    { 
      label: language === 'kn' ? 'ಮೈಸೂರು ಅರಮನೆ & ಕೊಡಗು' : 'Royal Mysore & Coorg', 
      destinations: ['Mysuru Palace', 'Coorg'] 
    },
    { 
      label: language === 'kn' ? 'ಯುನೆಸ್ಕೋ ಹಂಪಿ & ಬಾದಾಮಿ' : 'UNESCO Hampi & Badami', 
      destinations: ['Hampi', 'Badami Cave Temples'] 
    },
    { 
      label: language === 'kn' ? 'ಗೋಕರ್ಣ & ಮಲ್ಪೆ ಬೀಚ್' : 'Gokarna & Malpe Beach', 
      destinations: ['Gokarna & Om Beach', 'Udupi & Malpe Beach'] 
    },
    { 
      label: language === 'kn' ? 'ಚಿಕ್ಕಮಗಳೂರು & ಬೇಲೂರು' : 'Chikkamagaluru & Belur', 
      destinations: ['Chikkamagaluru', 'Belur & Halebidu'] 
    },
  ];

  const isKn = language === 'kn';

  return (
    <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl min-h-[540px] flex items-center">
      {/* Background Image Carousel / Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1800&q=85"
          alt="Majestic Karnataka Hampi Landscape"
          className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-10000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 w-full min-w-0 box-border py-16 sm:py-20 space-y-8">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t('heroBadge')}</span>
        </div>

        {/* Hero Headline */}
        <div className="w-full min-w-0 box-border space-y-4 max-w-3xl">
          <h1 className={
            isKn
              ? 'kannada-hero-heading font-bold text-white'
              : 'text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-snug sm:leading-tight lg:leading-[1.15] text-white break-words'
          }>
            {isKn ? (
              <>
                <span className="block max-w-full">{t('heroHeadline1')}</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 inline-block max-w-full">
                  {t('heroHeadlineHighlight')}
                </span>
              </>
            ) : (
              <>
                <span>{t('heroHeadline1')}</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 inline-block max-w-full">
                  {t('heroHeadlineHighlight')}
                </span>
              </>
            )}
          </h1>

          <p className={
            isKn
              ? 'text-sm sm:text-base text-stone-200/90 leading-[1.75] sm:leading-[1.8] max-w-2xl font-normal font-kannada w-full min-w-0 [overflow-wrap:break-word]'
              : 'text-base sm:text-lg text-stone-200 leading-relaxed max-w-2xl font-normal break-words'
          }>
            {t('heroSubheadline')}
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
          <button
            onClick={onStartPlanning}
            className="px-5 sm:px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#059669] to-[#047857] hover:from-[#047857] hover:to-[#065f46] text-white font-extrabold text-sm sm:text-base shadow-lg transition-all active:scale-95 flex items-center gap-2.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <span className="leading-tight">{t('heroCtaPlanner')}</span>
            <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
          </button>

          <button
            onClick={onExploreDestinations}
            className="px-5 sm:px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-teal-300 shrink-0" />
            <span className="leading-tight">{t('heroCtaExplore')}</span>
          </button>
        </div>

        {/* Curated Popular Circuits Quick-Chips */}
        <div className="border-t border-white/15 pt-4 space-y-2">
          <span className="text-xs uppercase font-bold tracking-wider text-stone-400 block">
            {t('heroCircuitsLabel')}
          </span>
          <div className="flex flex-wrap gap-2">
            {quickCircuits.map((c, i) => (
              <button
                key={i}
                onClick={() => onSelectQuickCircuit(c.label)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-stone-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{c.label}</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Realism Guarantees */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('heroBadgeVerified')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('heroBadgeRoadTimes')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('heroBadgeBudget')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
