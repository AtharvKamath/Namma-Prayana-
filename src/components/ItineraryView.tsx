import React, { useState } from 'react';
import { TripItinerary } from '../types/travel';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Printer, 
  AlertTriangle, 
  Languages, 
  Trash2, 
  ArrowUpDown, 
  Check, 
  Car, 
  Hotel, 
  Compass,
  Train,
  Bus,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface ItineraryViewProps {
  itinerary: TripItinerary;
  onSaveTrip: (itinerary: TripItinerary) => void;
  isSaved?: boolean;
  onModifyPreferences: () => void;
  onNavigateToBooking: (category: string) => void;
  onSelectDestinationForDetail: (destName: string) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary: initialItinerary,
  onSaveTrip,
  isSaved = false,
  onModifyPreferences,
  onNavigateToBooking,
  onSelectDestinationForDetail,
}) => {
  const { language, t } = useTranslation();
  const [itinerary, setItinerary] = useState<TripItinerary>(initialItinerary);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);

  const { budgetBreakdown, routeSummary } = itinerary;

  // Consistent numeric INR calculations and strict comparison
  const estimatedCost = Math.round(Number(budgetBreakdown?.totalEstimatedInr) || 0);
  const targetBudget = Math.round(Number(budgetBreakdown?.userBudgetInr) || 0);
  const isBudgetExceeded = targetBudget > 0 && estimatedCost > targetBudget;
  const isBudgetExact = targetBudget > 0 && estimatedCost === targetBudget;
  const isBudgetUnder = targetBudget > 0 && estimatedCost < targetBudget;
  const budgetDifference = Math.abs(estimatedCost - targetBudget);

  // Handle removing a day
  const handleRemoveDay = (dayIndex: number) => {
    if (itinerary.days.length <= 1) {
      setValidationWarning(
        language === 'kn' 
          ? 'ಪ್ರವಾಸ ಯೋಜನೆಯಲ್ಲಿ ಕನಿಷ್ಠ 1 ದಿನವಿರಬೇಕು.' 
          : 'An itinerary must contain at least 1 day.'
      );
      setTimeout(() => setValidationWarning(null), 3000);
      return;
    }
    const updatedDays = itinerary.days.filter((_, idx) => idx !== dayIndex).map((day, idx) => ({
      ...day,
      dayNumber: idx + 1,
      title: day.title.replace(/Day \d+:/, `Day ${idx + 1}:`).replace(/ದಿನ \d+:/, `ದಿನ ${idx + 1}:`),
    }));

    const updatedItinerary: TripItinerary = {
      ...itinerary,
      durationDays: updatedDays.length,
      days: updatedDays,
    };
    setItinerary(updatedItinerary);
    if (activeDayTab > updatedDays.length) {
      setActiveDayTab(updatedDays.length);
    }
  };

  // Handle reordering days
  const handleSwapDays = (index1: number, index2: number) => {
    if (index1 < 0 || index2 < 0 || index1 >= itinerary.days.length || index2 >= itinerary.days.length) return;
    const newDays = [...itinerary.days];
    const temp = newDays[index1];
    newDays[index1] = newDays[index2];
    newDays[index2] = temp;

    const updated = newDays.map((d, i) => ({
      ...d,
      dayNumber: i + 1,
      title: d.title.replace(/Day \d+:/, `Day ${i + 1}:`).replace(/ದಿನ \d+:/, `ದಿನ ${i + 1}:`),
    }));

    setItinerary({
      ...itinerary,
      days: updated,
    });
  };

  const handleShare = () => {
    const summaryText = `*${itinerary.tripTitle}*\n${t('itineraryDurationLabel')}: ${itinerary.durationDays} | ${itinerary.travellersCount} Travellers\n${t('totalEstimatedCostLabel')}: ₹${budgetBreakdown.totalEstimatedInr.toLocaleString('en-IN')}\nHubs: ${routeSummary.recommendedHubs.join(' -> ')}\nPlanned via Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ).`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Itinerary Header Banner */}
      <div className="bg-gradient-to-br from-[#093540] via-[#0f4c5c] to-[#047857] rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-md relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{itinerary.isAiGenerated ? (language === 'kn' ? 'ಜೆಮಿನಿ AI ರಚಿತ ಪ್ರವಾಸ' : 'Gemini AI Generated Itinerary') : (language === 'kn' ? 'ಪರಿಶೀಲಿಸಿದ ಕರ್ನಾಟಕ ಪ್ರವಾಸ' : 'Curated Karnataka Itinerary')}</span>
              <span>·</span>
              <span>{itinerary.durationDays} {t('itineraryDurationLabel')}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug sm:leading-tight break-words">
              {itinerary.tripTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-teal-100">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                {t('itineraryOriginLabel')} <strong>{itinerary.originCity}</strong>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                {itinerary.startDate} - {itinerary.endDate}
              </span>
              <span>·</span>
              <span>{itinerary.travellersCount} {language === 'kn' ? 'ಪ್ರಯಾಣಿಕರು' : 'Traveller(s)'}</span>
              <span>·</span>
              <span className="capitalize">{itinerary.budgetTier} {t('itineraryBudgetTierLabel')}</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onSaveTrip(itinerary)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                isSaved
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-white text-stone-900 hover:bg-stone-100 shadow-sm'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4 text-stone-700" />}
              <span>{isSaved ? t('itinerarySavedBtn') : t('itinerarySaveBtn')}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Copy trip summary"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onModifyPreferences}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/90 hover:bg-amber-500 text-stone-950 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              {t('itineraryModifyBtn')}
            </button>
          </div>
        </div>
      </div>

      {validationWarning && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>{validationWarning}</span>
        </div>
      )}

      {/* Budget Warning Banner ONLY if strictly exceeded */}
      {isBudgetExceeded && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm">
              {t('budgetWarningTitle')}
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              {t('budgetWarningDesc', { 
                estimated: estimatedCost.toLocaleString('en-IN'),
                budget: targetBudget.toLocaleString('en-IN')
              })}
              {budgetBreakdown.savingsTips.length > 0 && ` 💡 ${budgetBreakdown.savingsTips[0]}`}
            </p>
          </div>
        </div>
      )}

      {/* Budget On-Target Banner if estimated equals target budget */}
      {isBudgetExact && (
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-3.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-emerald-900">
              {t('budgetOnTargetTitle')}
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              {t('budgetOnTargetDesc', { 
                budget: targetBudget.toLocaleString('en-IN')
              })}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Days Timeline (Left) & Budget + Route Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Day-by-Day Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {itinerary.days.map((day) => (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayTab(day.dayNumber)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeDayTab === day.dayNumber
                    ? 'bg-[#0f4c5c] text-white shadow-sm ring-2 ring-[#0f4c5c]/20'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {language === 'kn' ? `ದಿನ ${day.dayNumber}: ${day.destinationName}` : `Day ${day.dayNumber}: ${day.destinationName}`}
              </button>
            ))}
          </div>

          {/* Active Day Card */}
          {itinerary.days
            .filter((d) => d.dayNumber === activeDayTab)
            .map((day, dayIndex) => (
              <div
                key={day.dayNumber}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6"
              >
                {/* Day Header with Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      {t('dayHeaderOf', { current: day.dayNumber, total: itinerary.durationDays })}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5 leading-snug break-words">
                      {day.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{day.destinationName}, {day.district}</span>
                      <span>·</span>
                      <span>~{day.dailyTravelDistanceKm} km {language === 'kn' ? 'ರಸ್ತೆ ಪ್ರಯಾಣ' : 'road transit'}</span>
                    </p>
                  </div>

                  {/* Day actions: Reorder / Remove */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {dayIndex > 0 && (
                      <button
                        onClick={() => handleSwapDays(dayIndex, dayIndex - 1)}
                        className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs flex items-center gap-1 cursor-pointer"
                        title="Move Day Earlier"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{t('moveDayUpBtn')}</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveDay(dayIndex)}
                      className="p-1.5 rounded-lg border border-stone-200 text-red-600 hover:bg-red-50 text-xs flex items-center gap-1 cursor-pointer"
                      title="Remove Day"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">{t('removeDayBtn')}</span>
                    </button>
                  </div>
                </div>

                {/* Day Slots: Morning, Afternoon, Evening */}
                <div className="space-y-6">
                  {/* Morning Slot */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 tracking-wider uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t('slotMorning')}</span>
                    </div>

                    {day.morning.map((act) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">{act.title}</h4>
                          {act.estimatedCostInr > 0 && (
                            <span className="text-xs font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-stone-200 shrink-0">
                              ₹{act.estimatedCostInr}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">{act.description}</p>
                        {act.travelTips && (
                          <p className="text-[11px] text-amber-900 font-medium">
                            💡 {act.travelTips}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Afternoon Slot */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 tracking-wider uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t('slotAfternoon')}</span>
                    </div>

                    {day.afternoon.map((act) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">{act.title}</h4>
                          {act.estimatedCostInr > 0 && (
                            <span className="text-xs font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-stone-200 shrink-0">
                              ₹{act.estimatedCostInr}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">{act.description}</p>
                        {act.travelTips && (
                          <p className="text-[11px] text-emerald-900 font-medium">
                            🍽️ {act.travelTips}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Evening Slot */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0f4c5c] tracking-wider uppercase">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t('slotEvening')}</span>
                    </div>

                    {day.evening.map((act) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100 space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-stone-900 text-sm">{act.title}</h4>
                          {act.estimatedCostInr > 0 && (
                            <span className="text-xs font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-stone-200 shrink-0">
                              ₹{act.estimatedCostInr}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">{act.description}</p>
                        {act.travelTips && (
                          <p className="text-[11px] text-teal-900 font-medium">
                            🌅 {act.travelTips}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stay Recommendation for the Night */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0">
                      <Hotel className="w-5 h-5 text-[#0f4c5c]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        {t('nightStayRec')}
                      </span>
                      <h5 className="font-bold text-stone-900 text-sm">
                        {day.stayRecommendation.type} · {day.stayRecommendation.suggestedArea}
                      </h5>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs font-bold text-stone-900">
                      ~₹{day.stayRecommendation.estimatedCostInr} / night
                    </span>
                    <button
                      onClick={() => onNavigateToBooking('hotels')}
                      className="px-3 py-1.5 rounded-lg bg-[#0f4c5c] text-white font-semibold text-xs hover:bg-[#082f38] transition-colors cursor-pointer"
                    >
                      {t('compareStaysBtn')}
                    </button>
                  </div>
                </div>

                {day.dailyNotes && (
                  <p className="text-[11px] text-stone-500 italic">
                    ℹ️ Note: {day.dailyNotes}
                  </p>
                )}
              </div>
            ))}
        </div>

        {/* Right Column: Itemized Budget Breakdown & Circuit Insights */}
        <div className="space-y-6">
          {/* Budget Breakdown Card */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-base">{t('itemizedBudgetTitle')}</h3>
              </div>
              <span className="text-xs font-semibold text-stone-500">
                {itinerary.travellersCount} {language === 'kn' ? 'ಪ್ರಯಾಣಿಕರು' : 'Person(s)'}
              </span>
            </div>

            {/* Total Estimated Cost */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 text-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider">
                  {t('totalEstimatedCostLabel')}
                </span>
                {targetBudget > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isBudgetExceeded 
                      ? 'bg-amber-100 text-amber-800' 
                      : isBudgetExact 
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-teal-100 text-teal-800'
                  }`}>
                    {isBudgetExceeded 
                      ? (language === 'kn' ? `+₹${budgetDifference.toLocaleString('en-IN')} ಹೆಚ್ಚುವರಿ` : `+₹${budgetDifference.toLocaleString('en-IN')} Over Budget`)
                      : isBudgetExact 
                      ? (language === 'kn' ? 'ನಿಖರ ಬಜೆಟ್ ಮಿತಿ' : 'Exact Budget Match')
                      : (language === 'kn' ? `₹${budgetDifference.toLocaleString('en-IN')} ಉಳಿತಾಯ` : `₹${budgetDifference.toLocaleString('en-IN')} Under Budget`)}
                  </span>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-0.5">
                ₹{estimatedCost.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                {t('perPersonLabel', { amount: Math.round(estimatedCost / Math.max(itinerary.travellersCount || 1, 1)).toLocaleString('en-IN') })}
              </div>
            </div>

            {/* Breakdown Categories */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-stone-400" />
                  {t('costTransport')}
                </span>
                <span className="font-bold text-stone-900">
                  ₹{budgetBreakdown.transportInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5 text-stone-400" />
                  {t('costAccommodation')} ({itinerary.durationDays - 1} {language === 'kn' ? 'ರಾತ್ರಿಗಳು' : 'nights'})
                </span>
                <span className="font-bold text-stone-900">
                  ₹{budgetBreakdown.accommodationInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span>{t('costFood')}</span>
                <span className="font-bold text-stone-900">
                  ₹{budgetBreakdown.foodInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span>{t('costActivities')}</span>
                <span className="font-bold text-stone-900">
                  ₹{budgetBreakdown.activitiesAndEntryInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600">
                <span>{t('costLocalTransit')}</span>
                <span className="font-bold text-stone-900">
                  ₹{budgetBreakdown.localTransportInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-600 pt-2 border-t border-stone-100">
                <span className="text-stone-500">{t('costContingency')}</span>
                <span className="font-bold text-stone-700">
                  ₹{budgetBreakdown.contingencyInr.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Assumptions */}
            {budgetBreakdown.assumptions.length > 0 && (
              <div className="pt-2 border-t border-stone-100 space-y-1 text-[11px] text-stone-500">
                <div className="font-semibold text-stone-700">{t('costAssumptionsTitle')}</div>
                {budgetBreakdown.assumptions.map((asm, i) => (
                  <div key={i} className="flex items-start gap-1">
                    <span>·</span>
                    <span>{asm}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Route Summary */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Compass className="w-5 h-5 text-[#0f4c5c]" />
              <h3 className="font-bold text-stone-900 text-base">{t('routeFeasibilityTitle')}</h3>
            </div>

            <div className="space-y-2 text-xs text-stone-700">
              <p className="leading-relaxed">
                {routeSummary.routeFeasibilityNote}
              </p>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-[11px]">
                <span className="font-semibold text-stone-800">{t('keyCircuitHubs')} </span>
                {routeSummary.recommendedHubs.join(' ➔ ')}
              </div>
            </div>

            {/* Warnings and Advisories */}
            {itinerary.warningsAndAdvisories.length > 0 && (
              <div className="pt-3 border-t border-stone-100 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  {t('localAdvisoriesTitle')}
                </h4>
                <ul className="space-y-1 text-[11px] text-stone-600">
                  {itinerary.warningsAndAdvisories.map((warn, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold shrink-0">!</span>
                      <span>{warn}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Direct Transport Booking Actions */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Train className="w-5 h-5 text-sky-700" />
                <h3 className="font-bold text-stone-900 text-base">
                  {language === 'kn' ? 'ಪ್ರಯಾಣ ಟಿಕೆಟ್ ಬುಕಿಂಗ್ (ರೈಲು & ಬಸ್)' : 'Book Travel (Trains & Buses)'}
                </h3>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'kn'
                ? 'ಕರ್ನಾಟಕದ ಈ ಮಾರ್ಗಕ್ಕಾಗಿ ನೇರ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳಲ್ಲಿ ಟಿಕೆಟ್‌ಗಳನ್ನು ಕಾಯ್ದಿರಿಸಿ.'
                : 'Reserve direct tickets for this Karnataka route via verified official transport providers.'}
            </p>

            <div className="space-y-2.5">
              {/* MakeMyTrip Trains */}
              <a
                href="https://www.makemytrip.com/railways/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-950 font-bold text-xs flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4 text-sky-700" />
                  <span>{language === 'kn' ? 'ರೈಲುಗಳು (MakeMyTrip Trains)' : 'Trains (MakeMyTrip Trains)'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* IRCTC Indian Railways */}
              <a
                href="https://www.irctc.co.in/nget/train-search"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-bold text-xs flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Train className="w-4 h-4 text-amber-700" />
                  <span>{language === 'kn' ? 'IRCTC ಅಧಿಕೃತ ರೈಲ್ವೆ ಬುಕಿಂಗ್' : 'IRCTC Official Railway Booking'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* RedBus */}
              <a
                href="https://www.redbus.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-950 font-bold text-xs flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-red-700" />
                  <span>{language === 'kn' ? 'RedBus ಅಧಿಕೃತ ಬಸ್ ಬುಕಿಂಗ್' : 'RedBus Official Bus Booking'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-red-600 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* AbhiBus */}
              <a
                href="https://www.abhibus.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 font-bold text-xs flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-amber-700" />
                  <span>{language === 'kn' ? 'AbhiBus ಬಸ್ ಬುಕಿಂಗ್' : 'AbhiBus Bus Booking'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* KSRTC */}
              <a
                href="https://ksrtc.in/oprs-web/guest/home.do"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-950 font-bold text-xs flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Bus className="w-4 h-4 text-teal-700" />
                  <span>{language === 'kn' ? 'KSRTC (ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ ಬಸ್)' : 'KSRTC (Karnataka Govt Bus)'}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Useful Kannada Phrases for this Itinerary */}
          {itinerary.usefulKannadaPhrases.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50/60 to-emerald-50/40 rounded-3xl border border-amber-200/70 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-amber-200/50">
                <Languages className="w-5 h-5 text-[#0f4c5c]" />
                <h3 className="font-bold text-stone-900 text-sm">
                  {t('handyPhrasesTitle')}
                </h3>
              </div>

              <div className="space-y-3">
                {itinerary.usefulKannadaPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/80 border border-stone-200/80 space-y-1 text-xs"
                  >
                    <div className="font-kannada font-bold text-stone-900 text-sm">
                      {phrase.kannada}
                    </div>
                    <div className="text-emerald-800 font-semibold text-[11px]">
                      {phrase.transliteration}
                    </div>
                    <div className="text-stone-600 text-[11px]">
                      "{phrase.english}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
