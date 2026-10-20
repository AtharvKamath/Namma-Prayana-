import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  X, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  Loader2, 
  User, 
  MessageSquare 
} from 'lucide-react';

interface ContactSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactSupportModal: React.FC<ContactSupportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, t } = useTranslation();
  const isKn = language === 'kn';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [botField, setBotField] = useState(''); // Honeypot field for bot/spam prevention

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Reset form status when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (trimmedName.length < 2) {
      setStatus('error');
      setStatusMessage(isKn ? 'ದಯವಿಟ್ಟು ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.' : 'Please enter a valid name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setStatus('error');
      setStatusMessage(isKn ? 'ದಯವಿಟ್ಟು ಮಾನ್ಯ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.' : 'Please enter a valid email address.');
      return;
    }

    if (trimmedMessage.length < 10) {
      setStatus('error');
      setStatusMessage(isKn ? 'ಸಂದೇಶವು ಕನಿಷ್ಠ 10 ಅಕ್ಷರಗಳನ್ನು ಹೊಂದಿರಬೇಕು.' : 'Message must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setStatusMessage('');

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          message: trimmedMessage,
          bot_field: botField, // Hidden honeypot
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || (isKn ? 'ಸಂದೇಶ ಕಳುಹಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ನಂತರ ಪ್ರಯತ್ನಿಸಿ.' : 'Failed to send message. Please try again later.'));
      }

      setStatus('success');
      setStatusMessage(
        isKn
          ? 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ನಮ್ಮ ಪ್ರಯಾಣ ಬೆಂಬಲ ತಂಡಕ್ಕೆ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ.'
          : 'Thank you! Your message has been successfully sent to Namma Prayana Support.'
      );
      setName('');
      setEmail('');
      setMessage('');
      setBotField('');
    } catch (err: any) {
      console.error('Contact form error:', err);
      setStatus('error');
      setStatusMessage(err?.message || (isKn ? 'ಸಂದೇಶ ಕಳುಹಿಸುವಾಗ ದೋಷ ಸಂಭವಿಸಿದೆ.' : 'An error occurred while sending your message. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 p-6 sm:p-7 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100/80">
              <Mail className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              {/* EXACT REQUIRED TITLE */}
              <h3 id="contact-modal-title" className="font-extrabold text-stone-900 text-base sm:text-lg leading-snug">
                Contact Namma Prayana Support
              </h3>
              <p className="text-xs text-stone-500">
                {isKn ? 'ನಮ್ಮ ಪ್ರಯಾಣ ಬೆಂಬಲ ಸಂಪರ್ಕ — ನಿಮ್ಮ ವಿಚಾರಣೆಯನ್ನು ನಮಗೆ ಕಳುಹಿಸಿ' : 'We typically reply within 24 hours'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banners */}
        {status === 'success' && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block text-sm">
                {isKn ? 'ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ!' : 'Message Sent Successfully!'}
              </span>
              <p className="text-emerald-900 leading-relaxed">
                {statusMessage}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors cursor-pointer"
                >
                  {isKn ? 'ಮುಚ್ಚಿ' : 'Close Window'}
                </button>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold block">
                {isKn ? 'ದೋಷ ಸಂಭವಿಸಿದೆ' : 'Unable to Send'}
              </span>
              <p className="text-rose-900 leading-relaxed">
                {statusMessage}
              </p>
            </div>
          </div>
        )}

        {/* Contact Form */}
        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Honeypot field (hidden from real users) */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="hp_website">Leave this field empty</label>
              <input
                id="hp_website"
                type="text"
                name="website_url_check"
                tabIndex={-1}
                autoComplete="off"
                value={botField}
                onChange={(e) => setBotField(e.target.value)}
              />
            </div>

            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="contact-name" className="block text-xs font-bold text-stone-700">
                {isKn ? 'ನಿಮ್ಮ ಹೆಸರು *' : 'Your Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  id="contact-name"
                  type="text"
                  required
                  disabled={isSubmitting}
                  minLength={2}
                  maxLength={100}
                  placeholder={t('contactNamePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-stone-50/50 focus:bg-white text-xs disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="contact-email" className="block text-xs font-bold text-stone-700">
                {isKn ? 'ಇಮೇಲ್ ವಿಳಾಸ *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  id="contact-email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  maxLength={150}
                  placeholder={t('contactEmailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-stone-50/50 focus:bg-white text-xs disabled:opacity-50"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="contact-message" className="block text-xs font-bold text-stone-700">
                  {isKn ? 'ನಿಮ್ಮ ಸಂದೇಶ *' : 'Your Message *'}
                </label>
                <span className="text-[10px] text-stone-400">
                  {message.length}/3000
                </span>
              </div>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <textarea
                  id="contact-message"
                  required
                  disabled={isSubmitting}
                  rows={4}
                  minLength={10}
                  maxLength={3000}
                  placeholder={t('contactMessagePlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-stone-50/50 focus:bg-white text-xs disabled:opacity-50 resize-y"
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold hover:bg-stone-50 transition-colors cursor-pointer text-xs disabled:opacity-50"
              >
                {isKn ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0f4c5c] to-[#047857] hover:from-[#0b3844] hover:to-[#035f45] text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-xs shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isKn ? 'ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...' : 'Submitting...'}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('contactSubmitBtn')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
