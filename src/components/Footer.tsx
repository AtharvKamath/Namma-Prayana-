import React from 'react';
import { NammaPrayanaLogo } from './NammaPrayanaLogo';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  HeartHandshake, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  Phone 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenHelp: () => void;
  onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenHelp,
  onOpenContact,
}) => {
  const { language, t } = useTranslation();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-4">
            <div className="inline-block py-1">
              <NammaPrayanaLogo size="md" theme="dark" />
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              {t('footerAboutText')}
            </p>

            <div className="text-[11px] text-amber-400/90 font-medium">
              {t('footerMadeWithPride')}
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              {t('footerQuickNavTitle')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('navHome')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('navExplore')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('planner')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('navPlanner')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hotels')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('navHotels')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('transport')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('navTransport')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('navAbout')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Local Tools & Resources */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              {t('footerTravelAssistanceTitle')}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('calculator')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('calcTitle')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kannada-helper')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('navKannadaHelper')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('my-trips')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {t('navMyTrips')}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>{language === 'kn' ? 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ' : 'Contact Us'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenHelp}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('emergencyHelplinesBtn')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Tourism & Transport Direct Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              {t('footerOfficialTourismTitle')}
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <a
                  href="https://karnatakatourism.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Karnataka Tourism (Dept)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://ksrtc.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>KSRTC Awatar Booking</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://kstdc.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>KSTDC Hotels & Package Tours</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://aranya.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Aranya Forest Trekking Permits</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://asi.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>ASI Hampi & Pattadakal Info</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="pt-8 border-t border-stone-800 space-y-4 text-[11px] text-stone-500 leading-relaxed">
          <p>
            {t('footerDisclaimerText')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-400 pt-2 border-t border-stone-800/60">
            <div className="flex items-center gap-2">
              <span className="font-kannada font-bold text-amber-500">ನಮ್ಮ ಪ್ರಯಾಣ</span>
              <span>·</span>
              <span>{t('footerCopyright')}</span>
            </div>

            <div className="flex items-center gap-4 text-[10px]">
              <span>Hampi · Mysuru · Coorg · Gokarna · Udupi · Belur · Badami</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
