import React from 'react';
import { 
  X, 
  BookmarkCheck, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Compass
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface GuestSaveModalProps {
  isOpen: boolean;
  itemDescription?: string;
  onClose: () => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

export const GuestSaveModal: React.FC<GuestSaveModalProps> = ({
  isOpen,
  itemDescription,
  onClose,
  onOpenRegister,
  onOpenLogin,
}) => {
  const { language } = useTranslation();
  const isKn = language === 'kn';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 p-6 sm:p-7 space-y-5 text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <BookmarkCheck className="w-7 h-7 text-white drop-shadow-xs" />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{isKn ? 'ನಿಮ್ಮ ಪ್ರವಾಸದ ನೆನಪುಗಳು' : 'Save Your Journey'}</span>
          </span>
          <h3 className="font-extrabold text-stone-900 text-xl leading-snug">
            {isKn 
              ? 'ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ನಮ್ಮ ಪ್ರಯಾಣದಲ್ಲಿ ಉಳಿಸಿ' 
              : 'Save your journey with Namma Prayana'}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
            {isKn
              ? 'ನಿಮ್ಮ ಕಸ್ಟಮ್ ಪ್ರವಾಸ ಯೋಜನೆಗಳು ಮತ್ತು ನೆಚ್ಚಿನ ತಾಣಗಳನ್ನು ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ ಶಾಶ್ವತವಾಗಿ ಸುರಕ್ಷಿತವಾಗಿರಿಸಲು ಖಾತೆ ತೆರೆಯಿರಿ ಅಥವಾ ಲಾಗಿನ್ ಆಗಿ.'
              : 'Create an account or log in to keep your trips and favourite destinations safe in your personal profile across all devices.'}
          </p>
          {itemDescription && (
            <div className="mt-2 py-1.5 px-3 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] text-stone-700 font-medium inline-block max-w-xs truncate">
              {itemDescription}
            </div>
          )}
        </div>

        {/* Benefits Badges */}
        <div className="grid grid-cols-2 gap-2 text-left pt-1">
          <div className="p-2.5 rounded-xl bg-teal-50/70 border border-teal-100 text-[11px] text-teal-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
            <span className="font-semibold leading-tight">{isKn ? 'ಖಾಸಗಿ & ಸುರಕ್ಷಿತ' : '100% Private Cloud'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 text-[11px] text-amber-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-700 shrink-0" />
            <span className="font-semibold leading-tight">{isKn ? 'ಎಲ್ಲಾ ಸಾಧನಗಳಲ್ಲಿ ಸಿಂಕ್' : 'Sync Across Devices'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0f4c5c] to-emerald-700 hover:from-[#0a333e] hover:to-emerald-800 shadow-md shadow-teal-950/20 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isKn ? 'ನಮ್ಮ ಪ್ರಯಾಣ ಸೇರಿ (Join Us)' : 'Join Us / Register'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 active:scale-[0.99] transition-colors cursor-pointer"
          >
            {isKn ? 'ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಲಾಗಿನ್ ಆಗಿ' : 'Already have an account? Log In'}
          </button>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 text-xs font-medium py-1 transition-colors cursor-pointer"
          >
            {isKn ? 'ಅನ್ವೇಷಣೆಯನ್ನು ಮುಂದುವರಿಸಿ (Continue Exploring)' : 'Continue Exploring as Guest'}
          </button>
        </div>
      </div>
    </div>
  );
};
