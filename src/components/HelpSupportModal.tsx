import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  X, 
  HeartHandshake, 
  Send, 
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, t } = useTranslation();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const helplines = [
    { 
      title: language === 'kn' ? 'ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಸಹಾಯವಾಣಿ' : 'National Emergency Dispatch', 
      number: '112', 
      desc: language === 'kn' ? 'ಪೊಲೀಸ್, ಅಗ್ನಿಶಾಮಕ, ಆಂಬ್ಯುಲೆನ್ಸ್ — ಕರ್ನಾಟಕದಾದ್ಯಂತ 24/7' : 'Police, Fire, Ambulance, All-in-One across Karnataka' 
    },
    { 
      title: language === 'kn' ? 'ಕರ್ನಾಟಕ ಪ್ರವಾಸೋದ್ಯಮ ಸಹಾಯವಾಣಿ' : 'Karnataka State Tourism Helpline', 
      number: '1800-425-4646', 
      desc: language === 'kn' ? 'ಉಚಿತ ಟೋಲ್‌ಫ್ರೀ ಪ್ರವಾಸಿ ಮಾಹಿತಿ & KSTDC ಬೆಂಬಲ' : 'Toll-free 24/7 tourist assistance & KSTDC info' 
    },
    { 
      title: language === 'kn' ? 'KSRTC ಗ್ರಾಹಕ ಸಹಾಯವಾಣಿ' : 'KSRTC Customer Helpline', 
      number: '080-49596666', 
      desc: language === 'kn' ? 'ಐರಾವತ ಬಸ್ ಬುಕಿಂಗ್ & ವಿಚಾರಣೆ' : 'Awatar bus booking & bus status enquiry' 
    },
    { 
      title: language === 'kn' ? 'ಮಹಿಳಾ ಸುರಕ್ಷತಾ ಸಹಾಯವಾಣಿ' : 'Women Helpline', 
      number: '1091', 
      desc: language === 'kn' ? '24/7 ಮಹಿಳೆಯರ ಸುರಕ್ಷತೆ ಮತ್ತು ನೆರವು' : 'Dedicated 24/7 safety and women assistance' 
    },
    { 
      title: language === 'kn' ? 'ಅರಣ್ಯ & ವನ್ಯಜೀವಿ ಸಹಾಯವಾಣಿ' : 'Wildlife & Forest Helpline', 
      number: '1926', 
      desc: language === 'kn' ? 'ಅರಣ್ಯ ಇಲಾಖೆ ವನ್ಯಜೀವಿ ರಕ್ಷಣೆ & ಸಫಾರಿ ಮಾಹಿತಿ' : 'Forest department wildlife rescue & safari support' 
    },
    { 
      title: language === 'kn' ? 'ಪ್ರವಾಸಿ ಪೊಲೀಸ್ ಬೆಂಗಳೂರು' : 'Tourist Police Bangalore', 
      number: '080-22200100', 
      desc: language === 'kn' ? 'ದೇಶ-ವಿದೇಶ ಪ್ರವಾಸಿಗರಿಗೆ ವಿಶೇಷ ಮಾರ್ಗದರ್ಶನ' : 'Assistance for domestic & international tourists' 
    },
  ];

  const faqs = [
    {
      q: language === 'kn' ? 'ಕರ್ನಾಟಕಕ್ಕೆ ಭೇಟಿ ನೀಡಲು ಸೂಕ್ತ ಕಾಲ ಯಾವುದು?' : 'When is the best season to visit Karnataka?',
      a: language === 'kn' ? 'ಅಕ್ಟೋಬರ್‌ನಿಂದ ಮಾರ್ಚ್ ವರೆಗೆ ಎಲ್ಲಾ ಪ್ರದೇಶಗಳಿಗೆ ಭೇಟಿ ನೀಡಲು ಹಿತಕರ ವಾತಾವರಣವಿರುತ್ತದೆ. ಜೂನ್‌ನಿಂದ ಸೆಪ್ಟೆಂಬರ್ ಮಳೆಗಾಲದಲ್ಲಿ ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಜಲಪಾತಗಳು ಮತ್ತು ಕಾಫಿ ಎಸ್ಟೇಟ್‌ಗಳು ಸುಂದರವಾಗಿರುತ್ತವೆ.' : 'October to March offers ideal sunny and pleasant weather across all regions. June to September is magical for Western Ghats waterfalls and coffee homestays (monsoon season).'
    },
    {
      q: language === 'kn' ? 'ಕುದುರೆಮುಖ ಅಥವಾ ಬಂಡೀಪುರ/ಕಬಿನಿಗೆ ಮುಂಗಡ ಅನುಮತಿ ಬೇಕೇ?' : 'Do I need advance permits for Kudremukh or Bandipur/Kabini?',
      a: language === 'kn' ? 'ಹೌದು. ಕುದುರೆಮುಖ ಚಾರಣಕ್ಕೆ ಕರ್ನಾಟಕ ಅರಣ್ಯ ಇಲಾಖೆಯ ಅರಣ್ಯ ಪೋರ್ಟಲ್ ಮೂಲಕ ದಿನಕ್ಕೆ ಕೇವಲ 50 ಜನರಿಗೆ ಮಾತ್ರ ಅವಕಾಶ. ಕಬಿನಿ ಸಫಾರಿ ಜೀಪ್‌ಗಳನ್ನು ವಾರಗಳ ಮುಂಚೆಯೇ ಕಾಯ್ದಿರಿಸಬೇಕು.' : 'Yes. Kudremukh trekking has a strict daily limit of 50 trekkers through the Karnataka Forest Aranya portal. Kabini safari gypsies must be reserved weeks in advance.'
    },
    {
      q: language === 'kn' ? 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ದೇವಾಲಯಗಳಲ್ಲಿ ವಸ್ತ್ರ ಸಂಹಿತೆ (Dress code) ಇದೆಯೇ?' : 'What is the dress code for Karnataka temples?',
      a: language === 'kn' ? 'ಹೌದು, ಉಡುಪಿ ಶ್ರೀ ಕೃಷ್ಣ ಮಠ, ಗೋಕರ್ಣ ಮಹಾಬಲೇಶ್ವರ ಹಾಗೂ ಕೊಲ್ಲೂರು ಮೂಕಾಂಬಿಕಾ ದೇವಾಲಯಗಳಲ್ಲಿ ಸಾಂಪ್ರದಾಯಿಕ ಮತ್ತು ಸಭ್ಯ ಉಡುಪು ಕಡ್ಡಾಯವಾಗಿದೆ.' : 'Modest traditional or covered attire (shoulders and knees covered) is required at major temples such as Sri Krishna Matha Udupi, Mahabaleshwar Gokarna, and Kollur Mookambika.'
    },
    {
      q: language === 'kn' ? 'ಟೋಲ್ ರಸ್ತೆಗಳಲ್ಲಿ ನಗದು ರಹಿತ ಪಾವತಿ ಕಡ್ಡಾಯವೇ?' : 'Are toll roads cashless?',
      a: language === 'kn' ? 'ಹೌದು, ಬೆಂಗಳೂರು-ಮೈಸೂರು ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ ಸೇರಿದಂತೆ ಎಲ್ಲಾ ರಾಷ್ಟ್ರೀಯ ಮತ್ತು ರಾಜ್ಯ ಹೆದ್ದಾರಿ ಟೋಲ್‌ಗಳಲ್ಲಿ ಫಾಸ್ಟ್‌ಟ್ಯಾಗ್ (FASTag) ಕಡ್ಡಾಯವಾಗಿದೆ.' : 'Yes, FASTag is mandatory across all National and State Highway toll plazas (including the Bengaluru-Mysuru Expressway).'
    }
  ];

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || (language === 'kn' ? 'ಸಂದೇಶ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Failed to send message. Please try again.'));
      }

      setFeedbackSent(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => {
        setFeedbackSent(false);
      }, 5000);
    } catch (err: any) {
      console.error('Support form error:', err);
      setErrorMessage(err?.message || (language === 'kn' ? 'ಸಂದೇಶ ಕಳುಹಿಸುವಾಗ ದೋಷ ಸಂಭವಿಸಿದೆ.' : 'An error occurred while sending your message.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-stone-900 text-lg leading-snug break-words">
                {t('helplinesTitle')}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed break-words">
                {t('helplinesSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Numbers Grid */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            {t('helplineEmergencyLabel')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {helplines.map((h, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">{h.title}</span>
                  <a
                    href={`tel:${h.number}`}
                    className="text-xs font-black text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md hover:bg-emerald-200"
                  >
                    {h.number}
                  </a>
                </div>
                <p className="text-[11px] text-stone-500">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="space-y-3 pt-3 border-t border-stone-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            {t('faqsTitle')}
          </h4>
          <div className="space-y-2 text-xs">
            {faqs.map((faq, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/60 space-y-1">
                <div className="font-bold text-stone-900">Q: {faq.q}</div>
                <div className="text-stone-600 leading-relaxed">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support Form */}
        <div className="space-y-3 pt-3 border-t border-stone-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            {t('contactSupportTitle')}
          </h4>

          {feedbackSent ? (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{t('contactSuccessToast')}</span>
            </div>
          ) : (
            <form onSubmit={handleSendFeedback} className="space-y-3 text-xs">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t('contactNamePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isSubmitting}
                  minLength={2}
                  maxLength={100}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                />
                <input
                  type="email"
                  placeholder={t('contactEmailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  maxLength={150}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                />
              </div>

              <textarea
                placeholder={t('contactMessagePlaceholder')}
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={isSubmitting}
                minLength={10}
                maxLength={3000}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              ></textarea>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#0f4c5c] to-[#047857] text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'kn' ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('contactSubmitBtn')}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
