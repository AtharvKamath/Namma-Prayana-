import React, { useState } from 'react';
import { BudgetTier } from '../types/travel';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  IndianRupee, 
  Users, 
  Calendar, 
  Sparkles, 
  Car, 
  Hotel, 
  Utensils, 
  Ticket, 
  ShieldAlert, 
  CheckCircle2 
} from 'lucide-react';

export const BudgetCalculator: React.FC = () => {
  const { language, t } = useTranslation();
  const [durationDays, setDurationDays] = useState(4);
  const [travellers, setTravellers] = useState(2);
  const [tier, setTier] = useState<BudgetTier>('comfort');
  const [userBudget, setUserBudget] = useState(30000);
  const [includeContingency, setIncludeContingency] = useState(true);

  // Daily unit rates in INR per category
  const rates = {
    budget: { stayPerNight: 1200, foodPerPerson: 550, transportPerDay: 700, entryPerPerson: 100, localPerDay: 300 },
    comfort: { stayPerNight: 3200, foodPerPerson: 1100, transportPerDay: 1800, entryPerPerson: 250, localPerDay: 600 },
    premium: { stayPerNight: 7500, foodPerPerson: 2200, transportPerDay: 3500, entryPerPerson: 450, localPerDay: 1200 },
  }[tier];

  // Room count assumes 2 people per double room
  const roomsNeeded = Math.ceil(travellers / 2);
  const nights = Math.max(durationDays - 1, 1);

  const stayTotal = rates.stayPerNight * roomsNeeded * nights;
  const foodTotal = rates.foodPerPerson * travellers * durationDays;
  const transportTotal = rates.transportPerDay * durationDays;
  const entryTotal = rates.entryPerPerson * travellers * durationDays;
  const localTotal = rates.localPerDay * durationDays;

  const subtotal = stayTotal + foodTotal + transportTotal + entryTotal + localTotal;
  const contingency = includeContingency ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal + contingency;
  const perPerson = Math.round(grandTotal / travellers);

  const difference = userBudget - grandTotal;
  const isOverBudget = difference < 0;

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 lg:p-10 space-y-8 animate-in fade-in duration-300">
      {/* Title */}
      <div className="border-b border-stone-100 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {t('calcBadge')}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 leading-snug sm:leading-tight break-words">
          {t('calcTitle')}
        </h2>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed break-words">
          {t('calcSubtitle')}
        </p>
      </div>

      {/* Interactive Sliders and Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-200/80">
        {/* Duration Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>{t('calcDurationLabel')}</span>
            <span className="text-emerald-800">
              {durationDays} {language === 'kn' ? 'ದಿನಗಳು' : 'Days'} ({nights} {language === 'kn' ? 'ರಾತ್ರಿಗಳು' : 'Nights'})
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="14"
            value={durationDays}
            onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
            className="w-full accent-[#0f4c5c] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>1 {language === 'kn' ? 'ದಿನ' : 'day'}</span>
            <span>7 {language === 'kn' ? 'ದಿನಗಳು' : 'days'}</span>
            <span>14 {language === 'kn' ? 'ದಿನಗಳು' : 'days'}</span>
          </div>
        </div>

        {/* Travellers Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700">
            <span>{t('calcTravellersLabel')}</span>
            <span className="text-emerald-800">
              {travellers} {language === 'kn' ? 'ಪ್ರಯಾಣಿಕರು' : 'People'} ({roomsNeeded} {language === 'kn' ? 'ಕೊಠಡಿಗಳು' : `room${roomsNeeded > 1 ? 's' : ''}`})
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={travellers}
            onChange={(e) => setTravellers(parseInt(e.target.value, 10))}
            className="w-full accent-[#0f4c5c] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>1</span>
            <span>6</span>
            <span>12</span>
          </div>
        </div>

        {/* Comfort Tier Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-stone-700">
            {t('calcComfortLabel')}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
            {(['budget', 'comfort', 'premium'] as BudgetTier[]).map((tId) => (
              <button
                key={tId}
                onClick={() => setTier(tId)}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center leading-snug break-words ${
                  tier === tId
                    ? 'bg-[#0f4c5c] text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {tId === 'budget' ? t('tierBudget') : tId === 'comfort' ? t('tierComfort') : t('tierPremium')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target User Budget Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-200/80 items-center">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            {t('calcUserBudgetLabel')}
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="number"
              step="1000"
              min="5000"
              max="1000000"
              value={userBudget}
              onChange={(e) => setUserBudget(parseInt(e.target.value, 10) || 5000)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 md:pt-0">
          <input
            type="checkbox"
            id="contingency"
            checked={includeContingency}
            onChange={(e) => setIncludeContingency(e.target.checked)}
            className="w-4 h-4 accent-[#0f4c5c] rounded cursor-pointer"
          />
          <label htmlFor="contingency" className="text-xs text-stone-700 font-medium cursor-pointer">
            {t('calcIncludeContingency')}
          </label>
        </div>
      </div>

      {/* Comparison Outcome Banner */}
      <div className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 ${
        isOverBudget
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
      }`}>
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[11px] uppercase font-bold tracking-wider opacity-75">
            {t('calcTotalEstimated')}
          </span>
          <div className="text-3xl sm:text-4xl font-black">
            ₹{grandTotal.toLocaleString('en-IN')}
          </div>
          <span className="text-xs opacity-80 block">
            ≈ ₹{perPerson.toLocaleString('en-IN')} {language === 'kn' ? 'ತಲಾ' : 'per person'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isOverBudget ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <span>{t('calcExceedsBudget')} ₹{Math.abs(difference).toLocaleString('en-IN')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{t('calcWithinBudget')} (+₹{difference.toLocaleString('en-IN')})</span>
            </div>
          )}
        </div>
      </div>

      {/* Itemized Cost Breakdown */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-stone-900 text-base">
          {t('calcBreakdownTitle')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
              <Hotel className="w-3.5 h-3.5" />
              <span>{t('costAccommodation')}</span>
            </div>
            <div className="text-lg font-black text-stone-900">
              ₹{stayTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-400">
              {roomsNeeded} {language === 'kn' ? 'ಕೊಠಡಿ' : 'room(s)'} × {nights} {language === 'kn' ? 'ರಾತ್ರಿಗಳು' : 'nights'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
              <Utensils className="w-3.5 h-3.5" />
              <span>{t('costFood')}</span>
            </div>
            <div className="text-lg font-black text-stone-900">
              ₹{foodTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-400">
              {travellers} {language === 'kn' ? 'ಜನರು' : 'people'} × {durationDays} {language === 'kn' ? 'ದಿನಗಳು' : 'days'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
              <Car className="w-3.5 h-3.5" />
              <span>{t('costTransport')}</span>
            </div>
            <div className="text-lg font-black text-stone-900">
              ₹{transportTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-400">
              {language === 'kn' ? 'ಇಂಧನ / ಬಸ್ ಶುಲ್ಕ' : 'Intercity road & fuel'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
              <Ticket className="w-3.5 h-3.5" />
              <span>{t('costActivities')}</span>
            </div>
            <div className="text-lg font-black text-stone-900">
              ₹{entryTotal.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-400">
              {language === 'kn' ? 'ASI ಸ್ಮಾರಕ & ಸಫಾರಿ ಶುಲ್ಕ' : 'ASI monuments & safaris'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-1">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs font-medium">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{t('costContingency')}</span>
            </div>
            <div className="text-lg font-black text-stone-900">
              ₹{contingency.toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-stone-400">
              {language === 'kn' ? '10% ತುರ್ತು ಮೀಸಲು' : '10% Emergency buffer'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
