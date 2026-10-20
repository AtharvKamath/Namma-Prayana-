import React, { useState, useEffect, useRef } from 'react';
import { NammaPrayanaLogo } from './NammaPrayanaLogo';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  Hotel, 
  Plane, 
  Bus, 
  Train,
  Car,
  Bookmark, 
  Languages, 
  Menu, 
  X, 
  HeartHandshake,
  ChevronDown,
  ChevronRight,
  Landmark,
  MoreHorizontal,
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  savedTripsCount: number;
  language?: 'en' | 'kn';
  onToggleLanguage?: () => void;
  onOpenHelp: () => void;
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onOpenAuth?: (initialMode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  savedTripsCount,
  onOpenHelp,
  onOpenLogin,
  onOpenRegister,
  onOpenAuth,
}) => {
  const { user, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [transportDropdownOpen, setTransportDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileTransportOpen, setMobileTransportOpen] = useState(true);
  const { language, toggleLanguage, t } = useTranslation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const moreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isKn = language === 'kn';

  // Close dropdowns on click outside, touch, scroll, or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTransportDropdownOpen(false);
      }
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const handleScroll = () => {
      setTransportDropdownOpen(false);
      setMoreDropdownOpen(false);
      setUserMenuOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTransportDropdownOpen(false);
        setMoreDropdownOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    };
  }, []);

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
    setTransportDropdownOpen(false);
    setMoreDropdownOpen(false);
    setUserMenuOpen(false);
  };

  const handleMouseEnterMore = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
  };

  const handleMouseLeaveMore = () => {
    if (moreTimeoutRef.current) clearTimeout(moreTimeoutRef.current);
    moreTimeoutRef.current = setTimeout(() => {
      setMoreDropdownOpen(false);
    }, 220);
  };

  const isTransportActive = [
    'transport', 
    'booking',
    'buses', 
    'trains', 
    'flights', 
    'cabs', 
    'cab', 
    'self-drive'
  ].includes(currentView);

  const transportOptions = [
    {
      id: 'transport',
      label: t('navTransportAll'),
      subLabel: language === 'kn' ? 'ಎಲ್ಲಾ ಸಾರಿಗೆ ಆಯ್ಕೆಗಳು & ಮಾರ್ಗಗಳು' : 'Full Transport Hub & Benchmarks',
      icon: Compass,
      badge: 'All in One',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'buses',
      label: t('navTransportBuses'),
      subLabel: language === 'kn' ? 'KSRTC ಐರಾವತ, redBus, AbhiBus' : 'KSRTC Airavat, redBus, AbhiBus',
      icon: Bus,
      badge: 'KSRTC',
      badgeColor: 'bg-red-100 text-red-800',
    },
    {
      id: 'trains',
      label: t('navTransportTrains'),
      subLabel: language === 'kn' ? 'ವಂದೇ ಭಾರತ್, IRCTC & ಕೊಂಕಣ ರೈಲ್ವೆ' : 'Vande Bharat, IRCTC & Rail status',
      icon: Train,
      badge: 'IRCTC',
      badgeColor: 'bg-sky-100 text-sky-800',
    },
    {
      id: 'flights',
      label: t('navTransportFlights'),
      subLabel: language === 'kn' ? 'ಬೆಂಗಳೂರು, ಮಂಗಳೂರು ವಿಮಾನ ನಿಲ್ದಾಣಗಳು' : 'BLR, IXE, MYQ & State Airports',
      icon: Plane,
      badge: 'Airports',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
    {
      id: 'cabs',
      label: t('navTransportCabs'),
      subLabel: language === 'kn' ? 'ಸವಾರಿ ಔಟ್‌ಸ್ಟೇಷನ್ ಟ್ಯಾಕ್ಸಿ & ಚಾಲಕರು' : 'Savaari Chauffeur Outstation Cabs',
      icon: Car,
      badge: 'Outstation',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'self-drive',
      label: t('navTransportSelfDrive'),
      subLabel: language === 'kn' ? 'ಜೂಮ್‌ಕಾರ್ ಸ್ವಯಂ ಚಾಲನಾ ಕಾರುಗಳು' : 'Zoomcar Airport & Hub Pickups',
      icon: Car,
      badge: 'Self-Drive',
      badgeColor: 'bg-teal-100 text-teal-800',
    },
  ];

  const handleMouseEnterDropdown = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setTransportDropdownOpen(true);
  };

  const handleMouseLeaveDropdown = () => {
    timeoutRef.current = setTimeout(() => {
      setTransportDropdownOpen(false);
    }, 180);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-4 xl:px-4 2xl:px-6">
        <div className="flex items-center justify-between h-20 gap-1 lg:gap-2 xl:gap-2.5">
          {/* Brand Logo & 3-line branding text */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl py-1 cursor-pointer shrink-0 transition-opacity hover:opacity-95"
            title="Namma Prayana — Karnataka Travel Planner"
          >
            <NammaPrayanaLogo size="md" />
          </button>

          {/* Desktop Navigation Links (xl+ viewports to guarantee generous spacing for Kannada & English) */}
          <nav className={`hidden xl:flex items-center ${isKn ? 'gap-0.5 2xl:gap-1 text-[11px] xl:text-xs 2xl:text-sm font-kannada' : 'gap-0.5 2xl:gap-1.5 text-xs 2xl:text-sm'} font-semibold text-stone-700`}>
            {/* 1. Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`${isKn ? 'px-1.5 xl:px-1.5 2xl:px-2.5 py-1.5 xl:py-2' : 'px-1.5 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2'} rounded-xl transition-colors flex items-center gap-1 xl:gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'home'
                  ? 'text-[#0f4c5c] font-bold bg-stone-100'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Compass className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${currentView === 'home' ? 'text-[#0f4c5c]' : 'text-stone-400'}`} />
              <span>{t('navHome')}</span>
            </button>

            {/* 2. Explore Karnataka */}
            <button
              onClick={() => handleNavClick('explore')}
              className={`${isKn ? 'px-1.5 xl:px-1.5 2xl:px-2.5 py-1.5 xl:py-2' : 'px-1.5 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2'} rounded-xl transition-colors flex items-center gap-1 xl:gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'explore'
                  ? 'text-[#0f4c5c] font-bold bg-stone-100'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${currentView === 'explore' ? 'text-[#0f4c5c]' : 'text-stone-400'}`} />
              <span>{t('navExplore')}</span>
            </button>

            {/* 3. About */}
            <button
              onClick={() => handleNavClick('about')}
              className={`${
                isKn ? 'hidden 2xl:flex px-1.5 2xl:px-2.5 py-1.5 xl:py-2' : 'flex px-1.5 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2'
              } rounded-xl transition-colors items-center gap-1 xl:gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'about'
                  ? 'text-[#0f4c5c] font-bold bg-stone-100'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Landmark className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${currentView === 'about' ? 'text-[#0f4c5c]' : 'text-stone-400'}`} />
              <span>{t('navAbout')}</span>
            </button>

            {/* 4. Hotels & Stays */}
            <button
              onClick={() => handleNavClick('hotels')}
              className={`${
                isKn ? 'hidden 2xl:flex px-1.5 2xl:px-2.5 py-1.5 xl:py-2' : 'flex px-1.5 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2'
              } rounded-xl transition-colors items-center gap-1 xl:gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'hotels'
                  ? 'text-[#0f4c5c] font-bold bg-stone-100'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Hotel className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${currentView === 'hotels' ? 'text-[#0f4c5c]' : 'text-stone-400'}`} />
              <span>{t('navHotels')}</span>
            </button>

            {/* 5. Combined Transport Dropdown (Buses, Trains, Flights, Cabs, Self-drive) */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleMouseEnterDropdown}
              onMouseLeave={handleMouseLeaveDropdown}
            >
              <button
                onClick={() => setTransportDropdownOpen(!transportDropdownOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'Enter') {
                    setTransportDropdownOpen(true);
                  }
                }}
                aria-haspopup="true"
                aria-expanded={transportDropdownOpen}
                className={`${isKn ? 'px-1.5 xl:px-1.5 2xl:px-2.5 py-1.5 xl:py-2' : 'px-1.5 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2'} rounded-xl transition-colors flex items-center gap-1 xl:gap-1.5 cursor-pointer whitespace-nowrap ${
                  isTransportActive
                    ? 'text-[#0f4c5c] font-bold bg-stone-100 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Bus className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${isTransportActive ? 'text-[#0f4c5c]' : 'text-stone-400'}`} />
                <span>{t('navTransport')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  transportDropdownOpen ? 'rotate-180 text-[#0f4c5c]' : 'text-stone-400'
                }`} />
              </button>

              {/* Transport Dropdown Menu */}
              {transportDropdownOpen && (
                <div 
                  role="menu"
                  className="absolute left-0 top-full pt-1.5 w-84 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-stone-200/90 p-2 overflow-hidden">
                    <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                        {language === 'kn' ? 'ಕರ್ನಾಟಕ ಸಾರಿಗೆ & ಬುಕಿಂಗ್' : 'Karnataka Transit & Bookings'}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        {language === 'kn' ? 'ನೇರ ಸೇವೆಗಳು' : 'Direct Services'}
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5">
                      {transportOptions.map((opt) => {
                        const Icon = opt.icon;
                        const isCurrent = currentView === opt.id || (opt.id === 'cabs' && currentView === 'cab');
                        return (
                          <button
                            key={opt.id}
                            role="menuitem"
                            onClick={() => handleNavClick(opt.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer group ${
                              isCurrent
                                ? 'bg-emerald-50/80 text-[#0f4c5c]'
                                : 'hover:bg-stone-50 text-stone-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isCurrent 
                                  ? 'bg-[#0f4c5c] text-white' 
                                  : 'bg-stone-100 text-stone-600 group-hover:bg-stone-200'
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold leading-tight truncate">
                                  {opt.label}
                                </div>
                                <div className="text-[10px] text-stone-500 leading-tight truncate mt-0.5">
                                  {opt.subLabel}
                                </div>
                              </div>
                            </div>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0 ml-2 ${opt.badgeColor}`}>
                              {opt.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Kannada Helper: directly visible on 2xl+; housed in More menu on xl */}
            <button
              onClick={() => handleNavClick('kannada-helper')}
              className={`hidden 2xl:flex ${isKn ? 'px-1.5 2xl:px-2.5 py-1.5 xl:py-2' : 'px-1.5 2xl:px-2.5 py-1.5 xl:py-2'} rounded-xl transition-colors items-center gap-1 xl:gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'kannada-helper'
                  ? 'text-[#0f4c5c] font-bold bg-stone-100'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Languages className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${currentView === 'kannada-helper' ? 'text-[#0f4c5c]' : 'text-amber-500'}`} />
              <span>{t('navKannadaHelper')}</span>
            </button>

            {/* 7. My Trips: directly visible on 2xl+; housed in More menu on xl */}
            <button
              onClick={() => handleNavClick('my-trips')}
              className={`relative hidden 2xl:flex ${isKn ? 'px-1.5 2xl:px-2.5 py-1.5 xl:py-2' : 'px-1.5 2xl:px-2.5 py-1.5 xl:py-2'} rounded-xl transition-colors items-center gap-1 xl:gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'my-trips'
                  ? 'text-[#0f4c5c] font-bold bg-stone-100'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${currentView === 'my-trips' ? 'text-[#0f4c5c]' : 'text-stone-400'}`} />
              <span>{t('navMyTrips')}</span>
              {savedTripsCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-emerald-600 rounded-full">
                  {savedTripsCount}
                </span>
              )}
            </button>

            {/* Responsive More Menu (Shown on xl viewports to ensure zero header overflow & Plan My Trip is never clipped) */}
            <div 
              ref={moreDropdownRef}
              className="relative xl:block 2xl:hidden"
              onMouseEnter={handleMouseEnterMore}
              onMouseLeave={handleMouseLeaveMore}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setTransportDropdownOpen(false);
                  setMoreDropdownOpen(!moreDropdownOpen);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' || e.key === 'Enter') {
                    setTransportDropdownOpen(false);
                    setMoreDropdownOpen(true);
                  }
                }}
                aria-haspopup="true"
                aria-expanded={moreDropdownOpen}
                className={`px-1.5 xl:px-2 py-1.5 xl:py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  currentView === 'kannada-helper' || currentView === 'my-trips' || (isKn && (currentView === 'about' || currentView === 'hotels'))
                    ? 'text-[#0f4c5c] font-bold bg-stone-100 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <MoreHorizontal className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                <span>{isKn ? 'ಇನ್ನಷ್ಟು' : 'More'}</span>
                {savedTripsCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                )}
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${
                  moreDropdownOpen ? 'rotate-180 text-[#0f4c5c]' : 'text-stone-400'
                }`} />
              </button>

              {moreDropdownOpen && (
                <div 
                  role="menu"
                  className="absolute right-0 top-full pt-1.5 w-64 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-stone-200/90 p-2 overflow-hidden">
                    <div className="py-1 space-y-1">
                      {/* About Karnataka (Shown in More menu on xl for Kannada) */}
                      {isKn && (
                        <button
                          role="menuitem"
                          onClick={() => handleNavClick('about')}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer group ${
                            currentView === 'about'
                              ? 'bg-emerald-50/80 text-[#0f4c5c] font-bold'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                              <Landmark className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold leading-tight">
                                {t('navAbout')}
                              </div>
                              <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                                ಕರ್ನಾಟಕದ ಇತಿಹಾಸ & ವಿವರ
                              </div>
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Hotels & Stays (Shown in More menu on xl for Kannada) */}
                      {isKn && (
                        <button
                          role="menuitem"
                          onClick={() => handleNavClick('hotels')}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer group ${
                            currentView === 'hotels'
                              ? 'bg-emerald-50/80 text-[#0f4c5c] font-bold'
                              : 'hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                              <Hotel className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold leading-tight">
                                {t('navHotels')}
                              </div>
                              <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                                ಕೆಎಸ್‌ಟಿಡಿಸಿ ಹೋಟೆಲ್‌ಗಳು & ರೆಸಾರ್ಟ್‌ಗಳು
                              </div>
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Kannada Helper */}
                      <button
                        role="menuitem"
                        onClick={() => handleNavClick('kannada-helper')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          currentView === 'kannada-helper'
                            ? 'bg-emerald-50/80 text-[#0f4c5c] font-bold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                            <Languages className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight">
                              {t('navKannadaHelper')}
                            </div>
                            <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                              {isKn ? 'ಪ್ರಯಾಣ ನುಡಿಗಟ್ಟುಗಳು & ಸಹಾಯ' : 'Phrases & travel assistance'}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* My Trips */}
                      <button
                        role="menuitem"
                        onClick={() => handleNavClick('my-trips')}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer group ${
                          currentView === 'my-trips'
                            ? 'bg-emerald-50/80 text-[#0f4c5c] font-bold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <Bookmark className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight">
                              {t('navMyTrips')}
                            </div>
                            <div className="text-[10px] text-stone-500 leading-tight mt-0.5">
                              {isKn ? 'ಉಳಿಸಲಾದ ಪ್ರವಾಸ ಯೋಜನೆಗಳು' : 'Saved itineraries & circuits'}
                            </div>
                          </div>
                        </div>
                        {savedTripsCount > 0 && (
                          <span className="px-2 py-0.5 text-[10px] font-bold text-white bg-emerald-600 rounded-full">
                            {savedTripsCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Cluster (xl+ viewports) */}
          <div className={`hidden xl:flex items-center ${isKn ? 'gap-1.5 2xl:gap-2' : 'gap-1.5 2xl:gap-2'} shrink-0`}>
            {/* Language Switcher */}
            <button
              onClick={() => {
                setTransportDropdownOpen(false);
                setMoreDropdownOpen(false);
                setUserMenuOpen(false);
                toggleLanguage();
              }}
              className="px-2 xl:px-2.5 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1 xl:gap-1.5 cursor-pointer shrink-0"
              title="Toggle English / ಕನ್ನಡ"
            >
              <span className="text-emerald-700 font-bold">{language === 'kn' ? 'KN' : 'EN'}</span>
              <span className="text-stone-300">|</span>
              <span className="text-stone-500 font-kannada text-[11px]">{language === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            {/* Help / Guide */}
            <button
              onClick={() => {
                setUserMenuOpen(false);
                onOpenHelp();
              }}
              className="p-1.5 xl:p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer shrink-0"
              title="Helpline & Karnataka Travel Guide"
            >
              <HeartHandshake className="w-4 h-4 xl:w-5 xl:h-5 text-stone-600" />
            </button>

            {/* Single Compact Auth Button or User Menu */}
            {!user ? (
              <button
                onClick={() => {
                  setTransportDropdownOpen(false);
                  setMoreDropdownOpen(false);
                  setUserMenuOpen(false);
                  if (onOpenAuth) {
                    onOpenAuth('login');
                  } else if (onOpenLogin) {
                    onOpenLogin();
                  }
                }}
                className="px-2.5 xl:px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 border border-emerald-200/90 transition-colors cursor-pointer shrink-0 shadow-2xs flex items-center gap-1.5"
                title={language === 'kn' ? 'ಲಾಗಿನ್ ಅಥವಾ ಖಾತೆ ರಚಿಸಿ' : 'Login or Create an Account'}
              >
                <User className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>{t('loginSignUpBtn')}</span>
              </button>
            ) : (
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200/80 bg-white"
                  title={profile?.fullName || user.displayName || 'Profile'}
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#0f4c5c] to-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
                    {profile?.photoURL || user.photoURL ? (
                      <img src={profile?.photoURL || user.photoURL || ''} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{(profile?.fullName || user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-stone-800 max-w-[80px] 2xl:max-w-[100px] truncate hidden sm:inline">
                    {(profile?.fullName || user.displayName || user.email?.split('@')[0] || 'Traveler').split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full pt-1.5 w-60 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="bg-white rounded-2xl shadow-xl border border-stone-200/90 p-2 overflow-hidden">
                      <div className="px-3 py-2 border-b border-stone-100">
                        <div className="font-bold text-xs text-stone-900 truncate">
                          {profile?.fullName || user.displayName || 'Karnataka Traveler'}
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          {user.email}
                        </div>
                      </div>
                      <div className="py-1 space-y-0.5">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onNavigate('profile');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 text-left cursor-pointer"
                        >
                          <User className="w-4 h-4 text-stone-500" />
                          <span>{t('myProfile')}</span>
                        </button>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onNavigate('my-trips');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <Bookmark className="w-4 h-4 text-stone-500" />
                            <span>{t('navMyTrips')}</span>
                          </div>
                          {savedTripsCount > 0 && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold text-white bg-emerald-600 rounded-full">
                              {savedTripsCount}
                            </span>
                          )}
                        </button>
                        <div className="my-1 border-t border-stone-100"></div>
                        <button
                          onClick={async () => {
                            setUserMenuOpen(false);
                            await logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>{t('logoutBtn')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Primary CTA: Plan My Trip */}
            <button
              onClick={() => handleNavClick('planner')}
              className={`inline-flex items-center gap-1.5 ${
                isKn ? 'px-3 xl:px-3.5 py-2 xl:py-2 text-xs xl:text-xs 2xl:text-sm font-kannada' : 'px-3 xl:px-4 py-2 xl:py-2.5 text-xs xl:text-sm'
              } rounded-xl font-bold text-white bg-gradient-to-r from-[#0f4c5c] to-[#047857] hover:from-[#093540] hover:to-[#035f45] shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 whitespace-nowrap`}
              title={isKn ? 'ಪ್ರವಾಸ ಯೋಜನೆ ಪ್ರಾರಂಭಿಸಿ' : 'Plan My Trip'}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap">{t('planMyTripBtn')}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle & Compact Actions (< 1280px) */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:hidden shrink-0">
            {/* Quick Plan My Trip Button on mobile and tablets */}
            <button
              onClick={() => handleNavClick('planner')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 ${
                isKn ? 'px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-kannada' : 'px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs'
              } rounded-xl font-bold text-white bg-gradient-to-r from-[#0f4c5c] to-[#047857] hover:from-[#093540] hover:to-[#035f45] shadow-xs active:scale-95 cursor-pointer shrink-0`}
              title={language === 'kn' ? 'ಪ್ರವಾಸ ಯೋಜನೆ ಪ್ರಾರಂಭಿಸಿ' : 'Plan My Trip'}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              {isKn ? (
                <>
                  <span className="inline sm:hidden whitespace-nowrap">ಪ್ರವಾಸ ಯೋಜನೆ</span>
                  <span className="hidden sm:inline whitespace-nowrap">ಪ್ರವಾಸ ಯೋಜನೆ ಪ್ರಾರಂಭಿಸಿ</span>
                </>
              ) : (
                <>
                  <span className="inline sm:hidden whitespace-nowrap">Plan Trip</span>
                  <span className="hidden sm:inline whitespace-nowrap">Plan My Trip</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setTransportDropdownOpen(false);
                setMoreDropdownOpen(false);
                toggleLanguage();
              }}
              className="px-2 sm:px-2.5 py-1.5 rounded-lg border border-stone-200 text-xs font-bold text-emerald-800 bg-white hover:bg-stone-50 cursor-pointer shrink-0"
              title="Toggle English / ಕನ್ನಡ"
            >
              {language === 'kn' ? 'English' : 'ಕನ್ನಡ'}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2.5 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="pb-2.5 border-b border-stone-100 flex items-center justify-between">
            <NammaPrayanaLogo size="sm" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Auth Status or Login / Sign Up Button */}
          {!user ? (
            <div className="pb-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenAuth) {
                    onOpenAuth('login');
                  } else if (onOpenLogin) {
                    onOpenLogin();
                  } else if (onOpenRegister) {
                    onOpenRegister();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200/90 text-emerald-800 font-bold text-xs hover:bg-emerald-100 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-2xs"
              >
                <User className="w-4 h-4 text-emerald-700" />
                <span>{t('loginSignUpBtn')}</span>
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0f4c5c] to-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
                  {profile?.photoURL || user.photoURL ? (
                    <img src={profile?.photoURL || user.photoURL || ''} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(profile?.fullName || user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 truncate">
                    {profile?.fullName || user.displayName || 'Karnataka Traveler'}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate">
                    {user.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleNavClick('profile')}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-[#0f4c5c] hover:bg-stone-50 cursor-pointer shadow-2xs"
                >
                  {t('myProfile')}
                </button>
              </div>
            </div>
          )}

          {/* Core Mobile Nav Items */}
          <div className="space-y-1">
            {/* Home */}
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-colors ${
                currentView === 'home' ? 'bg-emerald-50 text-[#0f4c5c]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Compass className="w-5 h-5 text-stone-500" />
              <span>{t('navHome')}</span>
            </button>

            {/* Explore */}
            <button
              onClick={() => handleNavClick('explore')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-colors ${
                currentView === 'explore' ? 'bg-emerald-50 text-[#0f4c5c]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <MapPin className="w-5 h-5 text-stone-500" />
              <span>{t('navExplore')}</span>
            </button>

            {/* About */}
            <button
              onClick={() => handleNavClick('about')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-colors ${
                currentView === 'about' ? 'bg-emerald-50 text-[#0f4c5c]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Landmark className="w-5 h-5 text-stone-500" />
              <span>{t('navAbout')}</span>
            </button>

            {/* Hotels */}
            <button
              onClick={() => handleNavClick('hotels')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-colors ${
                currentView === 'hotels' ? 'bg-emerald-50 text-[#0f4c5c]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Hotel className="w-5 h-5 text-stone-500" />
              <span>{t('navHotels')}</span>
            </button>

            {/* Combined Transport Menu (Accordion) */}
            <div className="rounded-xl border border-stone-200/90 overflow-hidden bg-stone-50/50">
              <button
                onClick={() => setMobileTransportOpen(!mobileTransportOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-left font-semibold text-sm transition-colors cursor-pointer ${
                  isTransportActive ? 'text-[#0f4c5c] bg-stone-100' : 'text-stone-700 hover:bg-stone-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bus className="w-5 h-5 text-[#0f4c5c]" />
                  <span>{t('navTransport')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    6 {language === 'kn' ? 'ಆಯ್ಕೆಗಳು' : 'options'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileTransportOpen ? 'rotate-180 text-[#0f4c5c]' : 'text-stone-400'}`} />
                </div>
              </button>

              {mobileTransportOpen && (
                <div className="p-2 space-y-1 bg-white border-t border-stone-100">
                  {transportOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isCurrent = currentView === opt.id || (opt.id === 'cabs' && currentView === 'cab');
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleNavClick(opt.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                          isCurrent ? 'bg-emerald-50 text-[#0f4c5c] font-bold' : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-[#0f4c5c]' : 'text-stone-500'}`} />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold block truncate">{opt.label}</span>
                            <span className="text-[10px] text-stone-500 block truncate">{opt.subLabel}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0 ml-1" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Kannada Helper */}
            <button
              onClick={() => handleNavClick('kannada-helper')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-colors ${
                currentView === 'kannada-helper' ? 'bg-emerald-50 text-[#0f4c5c]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Languages className="w-5 h-5 text-amber-500" />
              <span>{t('navKannadaHelper')}</span>
            </button>

            {/* My Trips */}
            <button
              onClick={() => handleNavClick('my-trips')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-colors ${
                currentView === 'my-trips' ? 'bg-emerald-50 text-[#0f4c5c]' : 'text-stone-700 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-stone-500" />
                <span>{t('navMyTrips')}</span>
              </div>
              {savedTripsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-emerald-600 rounded-full">
                  {savedTripsCount}
                </span>
              )}
            </button>

            {/* My Profile (Mobile) */}
            {user && (
              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-colors ${
                  currentView === 'profile' ? 'bg-emerald-50 text-[#0f4c5c]' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <User className="w-5 h-5 text-stone-500" />
                <span>{t('myProfile')}</span>
              </button>
            )}
          </div>

          {/* Action CTAs in Mobile Drawer */}
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('planner')}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#0f4c5c] to-[#047857] shadow-sm cursor-pointer ${
                isKn ? 'font-kannada' : ''
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('planMyTripBtn')}</span>
            </button>

            <button
              onClick={() => {
                onOpenHelp();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {t('emergencyHelplinesBtn')}
            </button>

            {user && (
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await logout();
                }}
                className="w-full py-2.5 px-3 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold text-center cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logoutBtn')}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
