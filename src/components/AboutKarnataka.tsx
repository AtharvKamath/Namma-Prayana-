import React from 'react';
import { NammaPrayanaLogo } from './NammaPrayanaLogo';
import { useTranslation } from '../i18n/LanguageContext';
import { 
  Sparkles, 
  MapPin, 
  Compass, 
  ShieldCheck, 
  Coffee, 
  TreePine, 
  Waves, 
  Castle, 
  ExternalLink 
} from 'lucide-react';

export const AboutKarnataka: React.FC = () => {
  const { language, t } = useTranslation();

  const regions = [
    {
      name: language === 'kn' ? 'ಕರಾವಳಿ (ಕರಾವಳಿ ತೀರ ಪ್ರದೇಶ)' : 'Karavali (The Coastal Belt)',
      kannada: 'ಕರಾವಳಿ',
      icon: Waves,
      districts: language === 'kn' ? 'ಉತ್ತರ ಕನ್ನಡ, ಉಡುಪಿ, ದಕ್ಷಿಣ ಕನ್ನಡ' : 'Uttara Kannada, Udupi, Dakshina Kannada',
      highlight: language === 'kn'
        ? '320 ಕಿ.ಮೀ ಅರಬ್ಬೀ ಸಮುದ್ರ ತೀರ, ಗೋಕರ್ಣ ಮತ್ತು ಮಲ್ಪೆ ಕಡಲತೀರಗಳು, ಮುರುಡೇಶ್ವರ ರಾಜಗೋಪುರ, ನೇತ್ರಾಣಿ ಹವಳದ ದಿಬ್ಬಗಳು ಮತ್ತು ವಿಶ್ವಪ್ರಸಿದ್ಧ ಕರಾವಳಿ ಊಟೋಪಚಾರ.'
        : '320 km of Arabian Sea coastline, pristine beaches (Gokarna, Malpe), Murudeshwar sea gopura, Netrani coral reefs, and legendary coastal tiffin and seafood.',
    },
    {
      name: language === 'kn' ? 'ಮಲೆನಾಡು (ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಮಳೆಕಾಡುಗಳು)' : 'Malenadu (The Western Ghats Rainforests)',
      kannada: 'ಮಲೆನಾಡು',
      icon: TreePine,
      districts: language === 'kn' ? 'ಕೊಡಗು, ಚಿಕ್ಕಮಗಳೂರು, ಶಿವಮೊಗ್ಗ, ಹಾಸನ' : 'Kodagu, Chikkamagaluru, Shivamogga, Hassan',
      highlight: language === 'kn'
        ? 'ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಜೀವವೈವಿಧ್ಯ ತಾಣ, ಕಾಫಿ ಮತ್ತು ಸಂಬಾರ ತೋಟಗಳು, ಜೋಗ ಜಲಪಾತ, ಕುದುರೆಮುಖ, ಮುಳ್ಳಯ್ಯನಗಿರಿ ಮತ್ತು ಮಂಜು ಕವಿದ ಬೆಟ್ಟದ ಹೋಮ್‌ಸ್ಟೇಗಳು.'
        : 'UNESCO World Heritage biodiversity hotspot, coffee & spice plantations, Jog Falls, Kudremukh, Mullayanagiri, and misty hill homestays.',
    },
    {
      name: language === 'kn' ? 'ಉತ್ತರ ಕರ್ನಾಟಕ & ದಖನ್ ಪರಂಪರೆ' : 'North Karnataka & Deccan Heritage',
      kannada: 'ಉತ್ತರ ಕರ್ನಾಟಕ',
      icon: Castle,
      districts: language === 'kn' ? 'ವಿಜಯನಗರ, ಬಾಗಲಕೋಟೆ, ವಿಜಯಪುರ, ಧಾರವಾಡ, ಬೆಳಗಾವಿ' : 'Vijayanagara, Bagalkote, Vijayapura, Dharwad, Belagavi',
      highlight: language === 'kn'
        ? 'ಹಂಪಿ ಮತ್ತು ಪಟ್ಟದಕಲ್ಲು ಯುನೆಸ್ಕೋ ತಾಣಗಳು, ಬಾದಾಮಿಯ ಗುಹಾಂತರ ದೇವಾಲಯಗಳು, ಗೋಲ್ ಗುಂಬಜ್ ಮತ್ತು ಜೋಳದ ರೊಟ್ಟಿ ಸಂಸ್ಕೃತಿ.'
        : 'UNESCO sites of Hampi and Pattadakal, rock-cut Chalukyan caves of Badami, Gol Gumbaz, and rich classical music and culinary traditions (Jolada Rotti).',
    },
    {
      name: language === 'kn' ? 'ಹಳೇ ಮೈಸೂರು & ದಕ್ಷಿಣ ಬಯಲುಸೀಮೆ' : 'Old Mysore & Southern Heartland',
      kannada: 'ಹಳೇ ಮೈಸೂರು',
      icon: Compass,
      districts: language === 'kn' ? 'ಮೈಸೂರು, ಮಂಡ್ಯ, ಚಾಮರಾಜನಗರ, ಬೆಂಗಳೂರು' : 'Mysuru, Mandya, Chamarajanagar, Bengaluru',
      highlight: language === 'kn'
        ? 'ಮೈಸೂರು ಅಂಬಾವಿಲಾಸ ಅರಮನೆ, ನಾಡಹಬ್ಬ ದಸರಾ, ಕಬಿನಿ ಮತ್ತು ನಾಗರಹೊಳೆ ಹುಲಿ ಸಂರಕ್ಷಿತಾರಣ್ಯಗಳು ಮತ್ತು ಮೈಸೂರು ರೇಷ್ಮೆ ಹಾಗೂ ಶ್ರೀಗಂಧ.'
        : 'Royal Amba Vilas Palace, world-renowned Dasara processions, Kabini and Nagarhole tiger reserves, and Silk & Sandalwood emporiums.',
    },
  ];

  const giProducts = [
    { 
      name: language === 'kn' ? 'ಮೈಸೂರು ರೇಷ್ಮೆ ಸೀರೆಗಳು' : 'Mysore Silk Sarees', 
      district: 'Mysuru', 
      desc: language === 'kn' ? 'ಶುದ್ಧ ಹಿಪ್ಪುನೇರಳೆ ರೇಷ್ಮೆ ಮತ್ತು 24 ಕ್ಯಾರೆಟ್ ಶುದ್ಧ ಚಿನ್ನದ ಜರಿಯಿಂದ ನೇಯ್ದ ಸೀರೆಗಳು.' : 'Woven with pure mulberry silk and authentic 24-karat gold zari embroidery.' 
    },
    { 
      name: language === 'kn' ? 'ಚನ್ನಪಟ್ಟಣದ ಮರದ ಗೊಂಬೆಗಳು' : 'Channapatna Wooden Toys', 
      district: 'Ramanagara', 
      desc: language === 'kn' ? 'ಹಾಲೆ ಮರದಿಂದ ತಯಾರಿಸಿದ ಮತ್ತು ನೈಸರ್ಗಿಕ ತರಕಾರಿ ಬಣ್ಣಗಳನ್ನು ಬಳಸಿದ ಪರಿಸರಸ್ನೇಹಿ ಆಟಿಕೆಗಳು.' : 'Handcrafted ivory-wood toys dyed with non-toxic vegetable colors.' 
    },
    { 
      name: language === 'kn' ? 'ಕೊಡಗು ಮತ್ತು ಚಿಕ್ಕಮಗಳೂರು ಅರೇಬಿಕಾ ಕಾಫಿ' : 'Coorg & Chikmagalur Arabica Coffee', 
      district: 'Kodagu & Chikkamagaluru', 
      desc: language === 'kn' ? 'ದಟ್ಟ ಮಳೆಕಾಡಿನ ನೆರಳಿನಲ್ಲಿ ಬೆಳೆದ ಚಾಕೊಲೇಟ್ ಮತ್ತು ಸಿಟ್ರಸ್ ಸುವಾಸನೆಯ ಕಾಫಿ ಬೀಜಗಳು.' : 'Shade-grown under rainforest canopies with unique chocolate and citrus notes.' 
    },
    { 
      name: language === 'kn' ? 'ಮೈಸೂರು ಶ್ರೀಗಂಧದ ಎಣ್ಣೆ & ಸಾಬೂನು' : 'Mysore Sandalwood Oil & Soap', 
      district: 'Mysuru', 
      desc: language === 'kn' ? 'ಶುದ್ಧ ಸಂತಾಲಮ್ ಆಲ್ಬಮ್ ಮರದಿಂದ ಆವಿ ಬಟ್ಟಿ ಇಳಿಸಿದ ಜಗತ್ಪ್ರಸಿದ್ಧ ಶ್ರೀಗಂಧ.' : 'Steam-distilled pure Santalum album timber with world-famous fragrance.' 
    },
    { 
      name: language === 'kn' ? 'ಬಿದರಿ ಕಲೆ (ಬೆಳ್ಳಿ ಕೆತ್ತನೆ)' : 'Bidriware Silver Inlay Craft', 
      district: 'Bidar', 
      desc: language === 'kn' ? 'ಸತು ಮತ್ತು ತಾಮ್ರದ ಮಿಶ್ರಲೋಹದ ಮೇಲೆ ಶುದ್ಧ ಬೆಳ್ಳಿಯ ತಂತಿಯಿಂದ ಕೆತ್ತಲಾದ ಪ್ರಾಚೀನ ಕಲೆ.' : 'Blackened zinc and copper alloy intricately inlaid with pure silver wire.' 
    },
    { 
      name: language === 'kn' ? 'ಇಳಕಲ್ ಸೀರೆಗಳು' : 'Ilkal Sarees', 
      district: 'Bagalkote', 
      desc: language === 'kn' ? 'ಕಸೂತಿ ಕಲೆ ಮತ್ತು ವಿಶಿಷ್ಟ ಕೆಂಪು-ಬಿಳಿ ಟೋಪೆ-ತೆಂಗೆ ಪಲ್ಲು ಹೊಂದಿರುವ ನೇಕಾರಿಕೆ.' : 'Unique red-and-white tope-tenge pallu woven using ancient Kasuti techniques.' 
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Brand Mission Section */}
      <div className="bg-gradient-to-br from-[#093540] via-[#0f4c5c] to-[#047857] rounded-3xl p-8 sm:p-12 text-white shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="shrink-0 flex justify-center">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
            <NammaPrayanaLogo size="lg" variant="symbol" />
          </div>
        </div>

        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('aboutBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug sm:leading-tight break-words">
            {t('aboutTitle')}
          </h1>
          <p className="text-sm sm:text-base text-teal-100 max-w-2xl leading-relaxed break-words">
            {t('aboutDesc')}
          </p>
        </div>
      </div>

      {/* Four Distinct Geographical & Cultural Zones */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug break-words">
            {t('aboutFourLandsTitle')}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 leading-relaxed break-words">
            {t('aboutFourLandsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {regions.map((reg, idx) => {
            const Icon = reg.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-xs p-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-kannada font-bold text-amber-700 text-sm">
                    {reg.kannada}
                  </span>
                </div>

                <h3 className="font-extrabold text-stone-900 text-base leading-snug break-words">
                  {reg.name}
                </h3>

                <p className="text-xs text-emerald-900 font-semibold">
                  {reg.districts}
                </p>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {reg.highlight}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geographical Indications (GI) of Karnataka */}
      <div className="space-y-6">
        <div className="border-b border-stone-200 pb-3">
          <h2 className="text-2xl font-extrabold text-stone-900">
            {t('aboutGiTitle')}
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {t('aboutGiSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {giProducts.map((prod, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/80 p-5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                  GI Tagged
                </span>
                <span className="text-[10px] text-stone-400">
                  {prod.district}
                </span>
              </div>
              <h4 className="font-bold text-stone-900 text-sm">{prod.name}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{prod.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Government Tourism Portals (Requirement 9) */}
      <div className="bg-stone-50 p-6 rounded-3xl border border-stone-200/80 space-y-4">
        <div>
          <h3 className="font-bold text-stone-900 text-base">
            {t('aboutOfficialPortalsTitle')}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {t('aboutOfficialPortalsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <a
            href="https://karnatakatourism.org"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-stone-900">Karnataka Tourism</div>
              <div className="text-[11px] text-stone-500">Official Department Portal</div>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400" />
          </a>

          <a
            href="https://kstdc.co"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-stone-900">KSTDC Portals</div>
              <div className="text-[11px] text-stone-500">State Tourism Hotels & Tours</div>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400" />
          </a>

          <a
            href="https://ksrtc.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-stone-900">KSRTC Awatar</div>
              <div className="text-[11px] text-stone-500">State Road Transport Booking</div>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400" />
          </a>

          <a
            href="https://aranya.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-500 transition-colors flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-stone-900">Karnataka Forest (Aranya)</div>
              <div className="text-[11px] text-stone-500">Trekking & Safari Permits</div>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
