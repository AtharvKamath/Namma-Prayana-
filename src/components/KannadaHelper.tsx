import React, { useState } from 'react';
import { KANNADA_PHRASES } from '../data/kannadaPhrases';
import { KannadaPhrase } from '../types/travel';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Languages, 
  Search, 
  Volume2, 
  Copy, 
  Check, 
  HeartHandshake 
} from 'lucide-react';

export const KannadaHelper: React.FC = () => {
  const { language, t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: language === 'kn' ? 'ಎಲ್ಲಾ ವಾಕ್ಯಗಳು' : 'All Phrases' },
    { id: 'greetings', label: language === 'kn' ? 'ಶುಭಾಶಯಗಳು' : 'Greetings' },
    { id: 'directions', label: language === 'kn' ? 'ದಾರಿ & ಸ್ಥಳಗಳು' : 'Directions' },
    { id: 'transport', label: language === 'kn' ? 'ಬಸ್ & ಸಾರಿಗೆ' : 'Bus & Transport' },
    { id: 'food', label: language === 'kn' ? 'ಊಟ & ಉಪಹಾರ' : 'Food & Dining' },
    { id: 'hotels', label: language === 'kn' ? 'ಹೋಟೆಲ್ & ವಸತಿ' : 'Hotels & Rooms' },
    { id: 'shopping', label: language === 'kn' ? 'ಖರೀದಿ & ಮಾರುಕಟ್ಟೆ' : 'Shopping' },
    { id: 'emergency', label: language === 'kn' ? 'ತುರ್ತು ನೆರವು' : 'Emergency & Help' },
  ];

  const filteredPhrases = KANNADA_PHRASES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.kannada.includes(searchQuery) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.english.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (phrase: KannadaPhrase) => {
    const text = `${phrase.kannada} (${phrase.transliteration}) - "${phrase.english}"`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(phrase.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSpeak = (phrase: KannadaPhrase) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase.kannada);
      utterance.lang = 'kn-IN';
      utterance.rate = 0.85;

      utterance.onstart = () => setIsPlayingId(phrase.id);
      utterance.onend = () => setIsPlayingId(null);
      utterance.onerror = () => setIsPlayingId(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f4c5c] to-[#047857] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Languages className="w-4 h-4" />
          <span>{t('helperBadge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug sm:leading-tight break-words">
          {t('helperTitle')}
        </h1>
        <p className="text-teal-100 text-xs sm:text-sm max-w-2xl leading-relaxed break-words">
          {t('helperSubtitle')}
        </p>
      </div>

      {/* Cultural Etiquette Tip */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
        <HeartHandshake className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5 min-w-0">
          <span className="font-bold block leading-snug">{t('helperEtiquetteTitle')}</span>
          <p className="text-[11px] text-amber-900 leading-relaxed break-words">
            {t('helperEtiquetteDesc')}
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('helperSearchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#0f4c5c] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Phrases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhrases.map((phrase) => (
          <div
            key={phrase.id}
            className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                {phrase.categoryLabel}
              </span>

              {/* Kannada Script with generous line-height for zero glyph clipping */}
              <div className="text-xl font-kannada font-bold text-stone-900 leading-relaxed break-words">
                {phrase.kannada}
              </div>

              {/* Transliteration */}
              <div className="text-xs font-semibold text-emerald-800">
                "{phrase.transliteration}"
              </div>

              {/* English Meaning */}
              <div className="text-xs text-stone-600 font-medium pt-1">
                Meaning: {phrase.english}
              </div>

              {/* Context Usage */}
              <div className="text-[11px] text-stone-400 italic pt-1 border-t border-stone-100">
                When to use: {phrase.contextUsage}
              </div>
            </div>

            {/* Action Buttons: Audio and Copy */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <button
                onClick={() => handleSpeak(phrase)}
                className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPlayingId === phrase.id
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800 animate-pulse'
                    : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                }`}
                title={t('helperListenAudio')}
              >
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span className="text-[11px] font-semibold">{t('helperListenAudio')}</span>
              </button>

              <button
                onClick={() => handleCopy(phrase)}
                className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title={t('helperCopyPhrase')}
              >
                {copiedId === phrase.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px] font-bold text-emerald-700">{language === 'kn' ? 'ಕಾಪಿ ಆಗಿದೆ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-500" />
                    <span className="text-[11px]">{t('helperCopyPhrase')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
