import React, { useState, useMemo } from 'react';
import { Destination, TravelCategory } from '../types/travel';
import { KARNATAKA_DESTINATIONS, DISTRICTS_LIST } from '../data/destinations';
import { DestinationModal } from './DestinationModal';
import { InteractiveMap } from './InteractiveMap';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Search, 
  MapPin, 
  Clock, 
  Plus, 
  ExternalLink, 
  Filter, 
  Map as MapIcon, 
  Grid, 
  Sparkles, 
  Star,
  Check,
  Heart
} from 'lucide-react';

interface DestinationExplorerProps {
  onPlanTripToDestination: (dest: Destination) => void;
  onAddDestinationToTripPlan?: (dest: Destination) => void;
  selectedDestinationNames?: string[];
  onToggleDestinationPreference?: (dest: Destination) => void;
  favoriteDestinationIds?: string[];
  onToggleFavorite?: (dest: Destination) => void;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  onPlanTripToDestination,
  onAddDestinationToTripPlan,
  selectedDestinationNames = [],
  onToggleDestinationPreference,
  favoriteDestinationIds = [],
  onToggleFavorite,
}) => {
  const { language, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TravelCategory>('all');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [activeModalDest, setActiveModalDest] = useState<Destination | null>(null);
  const [addedDestId, setAddedDestId] = useState<string | null>(null);

  const categories: { id: TravelCategory; label: string }[] = [
    { id: 'all', label: t('catAll') },
    { id: 'heritage', label: t('catHeritage') },
    { id: 'beach', label: t('catCoast') },
    { id: 'hills', label: t('catHills') },
    { id: 'wildlife', label: t('catWildlife') },
    { id: 'waterfalls', label: t('catWaterfalls') },
    { id: 'culture', label: t('catCulture') },
  ];

  const filteredDestinations = useMemo(() => {
    return KARNATAKA_DESTINATIONS.filter((dest) => {
      // Search query
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        dest.name.toLowerCase().includes(q) ||
        dest.district.toLowerCase().includes(q) ||
        dest.kannadaName.includes(searchQuery) ||
        dest.description.toLowerCase().includes(q);

      // Category
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'heritage' && (dest.category === 'heritage' || dest.category === 'temples')) ||
        (selectedCategory === 'beach' && dest.category === 'beach') ||
        (selectedCategory === 'hills' && (dest.category === 'hills' || dest.category === 'adventure')) ||
        (selectedCategory === 'wildlife' && dest.category === 'wildlife') ||
        (selectedCategory === 'waterfalls' && dest.category === 'waterfalls') ||
        (selectedCategory === 'culture' && (dest.category === 'culture' || dest.category === 'nature'));

      // District
      const matchesDistrict =
        selectedDistrict === 'All Districts' || 
        dest.district === selectedDistrict || 
        dest.district.includes(selectedDistrict);

      return matchesSearch && matchesCategory && matchesDistrict;
    });
  }, [searchQuery, selectedCategory, selectedDistrict]);

  const isDestinationSelected = (dest: Destination) => {
    return (selectedDestinationNames || []).some((name) => {
      if (!name) return false;
      const n = name.toLowerCase().trim();
      const destName = dest.name.toLowerCase().trim();
      const destId = dest.id.toLowerCase().trim();
      const destKn = (dest.kannadaName || '').toLowerCase().trim();
      return (
        n === destName ||
        n === destId ||
        (destKn && (n.includes(destKn) || destKn.includes(n))) ||
        (destName && (n.includes(destName) || destName.includes(n)))
      );
    });
  };

  const handleTogglePreference = (dest: Destination) => {
    if (onToggleDestinationPreference) {
      onToggleDestinationPreference(dest);
    } else if (onAddDestinationToTripPlan) {
      onAddDestinationToTripPlan(dest);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Explorer Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {t('explorerBadge')}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 mt-1 leading-snug sm:leading-tight break-words">
            {t('explorerTitle')}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed break-words">
            {t('explorerSubtitle')}
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 self-start md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>{t('tabGrid')}</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'map'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>{t('tabMap')}</span>
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="space-y-4 bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* District Dropdown */}
          <div className="md:w-64">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="All Districts">{t('filterAllDistricts')}</option>
              {DISTRICTS_LIST.map((dist) => (
                <option key={dist} value={dist}>
                  {language === 'kn' ? `${dist} ಜಿಲ್ಲೆ` : `${dist} District`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
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

      {/* Main Content Area */}
      {viewMode === 'map' ? (
        <div className="space-y-4">
          <InteractiveMap
            destinations={filteredDestinations}
            onSelectDestination={(dest) => setActiveModalDest(dest)}
            className="h-[600px] w-full"
          />
        </div>
      ) : (
        <>
          {filteredDestinations.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">{t('emptyDestinationsTitle')}</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {t('emptyDestinationsDesc')}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedDistrict('All Districts');
                }}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                {t('resetFiltersBtn')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => {
                const displayName = language === 'kn' ? dest.kannadaName : dest.name;
                const secondaryName = language === 'kn' ? dest.name : dest.kannadaName;
                return (
                  <div
                    key={dest.id}
                    className="bg-white rounded-3xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                  >
                    {/* Destination Image Banner */}
                    <div 
                      className="relative h-48 w-full overflow-hidden bg-stone-900 cursor-pointer"
                      onClick={() => setActiveModalDest(dest)}
                    >
                      <img
                        src={dest.imageUrl}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (dest.gallery?.[0] && target.src !== dest.gallery[0]) {
                            target.src = dest.gallery[0];
                          } else {
                            target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="150" viewBox="0 0 300 150"><rect width="300" height="150" fill="%230f4c5c"/><text x="150" y="75" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff" text-anchor="middle" dominant-baseline="middle">ನಮ್ಮ ಪ್ರಯಾಣ · Namma Prayana</text></svg>';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-bold tracking-wide uppercase">
                          {language === 'kn' ? `${dest.district} ಜಿಲ್ಲೆ` : dest.district}
                        </span>
                        {onToggleFavorite && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(dest);
                            }}
                            className="p-1.5 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/70 text-white transition-colors cursor-pointer"
                            title={
                              favoriteDestinationIds.includes(dest.id)
                                ? (language === 'kn' ? 'ನೆಚ್ಚಿನ ತಾಣಗಳಿಂದ ತೆಗೆಯಿರಿ' : 'Remove from Favorites')
                                : (language === 'kn' ? 'ನೆಚ್ಚಿನ ತಾಣವಾಗಿ ಉಳಿಸಿ' : 'Save as Favorite')
                            }
                            aria-label="Toggle Favorite"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 transition-colors ${
                                favoriteDestinationIds.includes(dest.id)
                                  ? 'fill-rose-500 text-rose-500'
                                  : 'text-white/90 hover:text-white'
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <div className="flex items-baseline gap-2">
                          <h3 className="font-extrabold text-lg leading-tight">
                            {displayName}
                          </h3>
                          <span className="text-xs text-amber-300 font-medium">
                            {secondaryName}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-200 font-medium line-clamp-1 mt-0.5">
                          {language === 'kn' && dest.taglineKn ? dest.taglineKn : dest.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                        {language === 'kn' && dest.descriptionKn ? dest.descriptionKn : dest.description}
                      </p>

                      {/* Meta Tags */}
                      <div className="space-y-3 pt-2 border-t border-stone-100">
                        <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            ~{dest.suggestedDurationHours}h
                          </span>
                          <span className="text-emerald-700 font-bold">
                            {dest.entryFeeInr === 0 ? t('cardFreeEntry') : `${t('cardEntryFee')}${dest.entryFeeInr}`}
                          </span>
                          <span>
                            ~{dest.approxDistanceKmFromBengaluru} km {t('cardFromBengaluru')}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            onClick={() => setActiveModalDest(dest)}
                            className="text-xs font-bold text-[#0f4c5c] hover:underline cursor-pointer"
                          >
                            {t('cardViewDetails')}
                          </button>

                          <div className="flex items-center gap-1.5">
                            {(onToggleDestinationPreference || onAddDestinationToTripPlan) && (() => {
                              const isSel = isDestinationSelected(dest);
                              return (
                                <button
                                  type="button"
                                  onClick={() => handleTogglePreference(dest)}
                                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                    isSel
                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs hover:bg-emerald-700'
                                      : 'border-stone-200 hover:border-emerald-500 text-stone-600 hover:text-emerald-800 bg-white'
                                  }`}
                                  title={
                                    isSel
                                      ? (language === 'kn' ? `${displayName} ಪ್ರವಾಸ ಆದ್ಯತೆಗಳಿಂದ ತೆಗೆದುಹಾಕಿ` : `Remove ${dest.name} from trip preferences`)
                                      : (language === 'kn' ? `${displayName} ಪ್ರವಾಸ ಆದ್ಯತೆಗಳಿಗೆ ಸೇರಿಸಿ` : `Add ${dest.name} to trip preferences`)
                                  }
                                  aria-label={
                                    isSel
                                      ? `Remove ${dest.name} from trip preferences`
                                      : `Add ${dest.name} to trip preferences`
                                  }
                                >
                                  {isSel ? (
                                    <Check className="w-4 h-4 stroke-[2.5]" />
                                  ) : (
                                    <Plus className="w-4 h-4" />
                                  )}
                                </button>
                              );
                            })()}

                            <button
                              onClick={() => onPlanTripToDestination(dest)}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0f4c5c] to-[#047857] text-white font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
                            >
                              {t('cardPlanTripHere')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Destination Modal */}
      {activeModalDest && (
        <DestinationModal
          destination={activeModalDest}
          onClose={() => setActiveModalDest(null)}
          onAddToTrip={onPlanTripToDestination}
        />
      )}
    </div>
  );
};
