export interface BookingProvider {
  id: string;
  name: string;
  category: 'bus' | 'hotel' | 'flight' | 'train' | 'cab';
  logoText: string;
  logoUrl?: string;
  badge: string;
  badgeKn: string;
  description: string;
  descriptionKn: string;
  officialWebsite: string;
  allowedDomains: string[];
  isOfficialGovt?: boolean;
  buttonLabel?: string;
  buttonLabelKn?: string;
  searchUrlGenerator: (params?: {
    origin?: string;
    destination?: string;
    date?: string;
    guests?: number;
    checkIn?: string;
    checkOut?: string;
  }) => string;
}

export interface RouteTransportMode {
  mode: string;
  modeKn?: string;
  priceRangeInr: string;
  details: string;
  detailsKn?: string;
}

export interface PopularRoute {
  route: string;
  routeKn?: string;
  fromCity: string;
  toCity: string;
  distanceKm: number;
  travelTime: string;
  travelTimeKn?: string;
  transportModes: RouteTransportMode[];
}

export function isValidProviderUrl(url: string, allowedDomains: string[]): boolean {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    return allowedDomains.some((d) => hostname === d.toLowerCase() || hostname.endsWith(`.${d.toLowerCase()}`));
  } catch {
    return false;
  }
}

export function cleanDestinationName(dest?: string): string {
  if (!dest) return 'Karnataka';
  const trimmed = dest.trim();
  const mapping: Record<string, string> = {
    'ಕೊಡಗು': 'Coorg',
    'ಕೂರ್ಗ್': 'Coorg',
    'ಕೊಡಗು (ಕೂರ್ಗ್)': 'Coorg',
    'ಚಿಕ್ಕಮಗಳೂರು': 'Chikkamagaluru',
    'ಮೈಸೂರು': 'Mysuru',
    'ಹಂಪಿ': 'Hampi',
    'ಕಬಿನಿ': 'Kabini',
    'ಗೋಕರ್ಣ': 'Gokarna',
    'ದಾಂಡೇಲಿ': 'Dandeli',
    'ಬೆಂಗಳೂರು': 'Bengaluru',
  };
  for (const [kn, en] of Object.entries(mapping)) {
    if (trimmed.includes(kn)) return en;
  }
  return trimmed.replace(/\([^)]*\)/g, '').trim() || 'Karnataka';
}

export const BOOKING_PROVIDERS: BookingProvider[] = [
  // ================= Buses =================
  {
    id: 'ksrtc',
    name: 'KSRTC (Karnataka State Road Transport)',
    category: 'bus',
    logoText: 'KSRTC',
    logoUrl: '/images/logos/ksrtc.png',
    badge: 'Official Karnataka Govt',
    badgeKn: 'ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಸರ್ಕಾರಿ',
    description: 'Premier state bus network with Airavat Club Class, Rajahamsa, and Non-AC Sleeper coaches connecting every Karnataka district.',
    descriptionKn: 'ಕರ್ನಾಟಕದ ಪ್ರತಿಯೊಂದು ಜಿಲ್ಲೆಯನ್ನು ಸಂಪರ್ಕಿಸುವ ಐರಾವತ ಕ್ಲಬ್ ಕ್ಲಾಸ್, ರಾಜಹಂಸ ಮತ್ತು ಸ್ಲೀಪರ್ ಬಸ್‌ಗಳ ಅಧಿಕೃತ ಸಾರಿಗೆ ಜಾಲ.',
    officialWebsite: 'https://ksrtc.in',
    allowedDomains: ['ksrtc.in'],
    isOfficialGovt: true,
    searchUrlGenerator: () => 'https://ksrtc.in/oprs-web/guest/home.do'
  },
  {
    id: 'redbus',
    name: 'RedBus',
    category: 'bus',
    logoText: 'RedBus',
    logoUrl: '/images/logos/redbus.svg',
    badge: 'Official Bus Aggregator',
    badgeKn: 'ಪ್ರಮುಖ ಬಸ್ ಪೋರ್ಟಲ್',
    description: 'Compare private and state operators (VRL, SRS, Sugama, Sea Bird, KSRTC) across Karnataka with live tracking and passenger reviews.',
    descriptionKn: 'VRL, ಸುಗಮ, ಸೀ ಬರ್ಡ್ ಸೇರಿದಂತೆ 500+ ಖಾಸಗಿ ಹಾಗೂ ಸರ್ಕಾರಿ ಬಸ್‌ಗಳ ದರ ಹೋಲಿಕೆ ಮತ್ತು ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್.',
    officialWebsite: 'https://www.redbus.in/',
    allowedDomains: ['redbus.in'],
    searchUrlGenerator: () => 'https://www.redbus.in/'
  },
  {
    id: 'abhibus',
    name: 'AbhiBus',
    category: 'bus',
    logoText: 'AbhiBus',
    logoUrl: '/images/logos/abhibus.png',
    badge: 'Direct Booking Partner',
    badgeKn: 'ನೇರ ಬುಕಿಂಗ್ ಪಾಲುದಾರ',
    description: 'Instant ticket confirmation for intercity AC sleepers and express routes across Bengaluru, Mangaluru, Gokarna, and Hampi.',
    descriptionKn: 'ಬೆಂಗಳೂರು, ಮಂಗಳೂರು, ಗೋಕರ್ಣ ಮತ್ತು ಹಂಪಿ ನಡುವಿನ AC ಸ್ಲೀಪರ್ ಮತ್ತು ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಬಸ್‌ಗಳ ತ್ವರಿತ ಸೀಟು ಬುಕಿಂಗ್.',
    officialWebsite: 'https://www.abhibus.com/',
    allowedDomains: ['abhibus.com'],
    searchUrlGenerator: () => 'https://www.abhibus.com/'
  },

  // ================= Hotels & Homestays =================
  {
    id: 'kstdc-jlr',
    name: 'Jungle Lodges & Resorts (JLR) / KSTDC Stays',
    category: 'hotel',
    logoText: 'JLR / KSTDC',
    logoUrl: '/images/logos/jlr.png',
    badge: 'Official Govt Eco-Resorts',
    badgeKn: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಇಕೋ-ರೆಸಾರ್ಟ್',
    description: 'Pioneering eco-tourism stays at Kabini, Bandipur, Dandeli, and KSTDC Mayura heritage hotels at Hampi, Belur, and Jog Falls.',
    descriptionKn: 'ಕಬಿನಿ, ಬಂಡೀಪುರ, ದಾಂಡೇಲಿ ಹಾಗೂ ಹಂಪಿ, ಬೇಲೂರು, ಜೋಗ ಜಲಪಾತಗಳಲ್ಲಿರುವ ಅಧಿಕೃತ ಮಯೂರ ಪಾರಂಪರಿಕ ಹೋಟೆಲ್‌ಗಳು.',
    officialWebsite: 'https://www.junglelodges.com',
    allowedDomains: ['junglelodges.com', 'kstdc.co'],
    isOfficialGovt: true,
    searchUrlGenerator: () => 'https://www.junglelodges.com/resorts/'
  },
  {
    id: 'makemytrip-hotels',
    name: 'MakeMyTrip Hotels & Stays',
    category: 'hotel',
    logoText: 'MakeMyTrip',
    logoUrl: '/images/logos/makemytrip.svg',
    badge: 'Verified Stays Platform',
    badgeKn: 'ಪರಿಶೀಲಿಸಿದ ಹೋಟೆಲ್ ವೇದಿಕೆ',
    description: 'Browse verified plantation homestays in Coorg and Chikkamagaluru, heritage palaces in Mysuru, and beach stays in Gokarna.',
    descriptionKn: 'ಕೊಡಗು, ಚಿಕ್ಕಮಗಳೂರಿನ ಕಾಫಿ ಎಸ್ಟೇಟ್ ಹೋಮ್‌ಸ್ಟೇಗಳು, ಮೈಸೂರಿನ ಅರಮನೆ ತಂಗುದಾಣಗಳು ಮತ್ತು ಗೋಕರ್ಣದ ಬೀಚ್ ರೆಸಾರ್ಟ್‌ಗಳು.',
    officialWebsite: 'https://www.makemytrip.com',
    allowedDomains: ['makemytrip.com'],
    searchUrlGenerator: ({ destination = 'Mysuru', guests = 2 } = {}) =>
      `https://www.makemytrip.com/hotels/hotel-listing/?searchText=${encodeURIComponent(destination)}&roomStayQualifier=${guests}e0e`
  },
  {
    id: 'goibibo-hotels',
    name: 'Goibibo Stays',
    category: 'hotel',
    logoText: 'Goibibo',
    logoUrl: '/images/logos/goibibo.svg',
    badge: 'Budget & Homestays',
    badgeKn: 'ಬಜೆಟ್ & ಹೋಮ್‌ಸ್ಟೇ',
    description: 'Competitive room pricing, certified user reviews, pay-at-hotel options, and verified coffee estate stays.',
    descriptionKn: 'ಗ್ರಾಹಕರ ನೈಜ ವಿಮರ್ಶೆಗಳು, ಹೋಟೆಲ್‌ನಲ್ಲಿ ಪಾವತಿ ಆಯ್ಕೆ ಮತ್ತು ಪರಿಶೀಲಿಸಿದ ತೋಟದ ಹೋಮ್‌ಸ್ಟೇಗಳು.',
    officialWebsite: 'https://www.goibibo.com/hotels/',
    allowedDomains: ['goibibo.com'],
    buttonLabel: 'Book Stays on Goibibo',
    buttonLabelKn: 'Goibibo ನಲ್ಲಿ ವಸತಿ ಬುಕ್ ಮಾಡಿ',
    searchUrlGenerator: () => 'https://www.goibibo.com/hotels/'
  },

  // ================= Flights =================
  {
    id: 'makemytrip-flights',
    name: 'MakeMyTrip Flights',
    category: 'flight',
    logoText: 'MMT Flights',
    logoUrl: '/images/logos/makemytrip.svg',
    badge: 'Airlines Aggregator',
    badgeKn: 'ವಿಮಾನ ಪ್ರಯಾಣ ಪೋರ್ಟಲ್',
    description: 'Direct and connecting flights connecting Bengaluru (BLR), Mangaluru (IXE), Mysuru (MYQ), Hubballi (HBX), Belagavi (IXG), and Shivamogga (RQY).',
    descriptionKn: 'ಬೆಂಗಳೂರು, ಮಂಗಳೂರು, ಮೈಸೂರು, ಹುಬ್ಬಳ್ಳಿ, ಬೆಳಗಾವಿ ಹಾಗೂ ಶಿವಮೊಗ್ಗ ವಿಮಾನ ನಿಲ್ದಾಣಗಳ ನೇರ ವಿಮಾನ ಶೋಧ.',
    officialWebsite: 'https://www.makemytrip.com/flights/',
    allowedDomains: ['makemytrip.com'],
    buttonLabel: 'Book Flights',
    buttonLabelKn: 'ವಿಮಾನ ಬುಕ್ ಮಾಡಿ',
    searchUrlGenerator: () => 'https://www.makemytrip.com/flights/'
  },
  {
    id: 'irctc-air',
    name: 'IRCTC Air',
    category: 'flight',
    logoText: 'IRCTC Air',
    logoUrl: '/images/logos/irctc-air.svg',
    badge: 'Official Govt Air Portal',
    badgeKn: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಏರ್ ಪೋರ್ಟಲ್',
    description: 'Official Indian Railways & Tourism airline portal offering zero convenience fee on defense bookings, LTC claims, and domestic flights across Karnataka airports.',
    descriptionKn: 'ಐಆರ್‌ಸಿಟಿಸಿ ಅಧಿಕೃತ ವಿಮಾನ ಟಿಕೆಟ್ ಬುಕಿಂಗ್, ರಕ್ಷಣಾ ಸಿಬ್ಬಂದಿ ರಿಯಾಯಿತಿ, ಎಲ್‌ಟಿಸಿ ಕ್ಲೈಮ್ ಮತ್ತು ಕರ್ನಾಟಕದ ವಿಮಾನ ನಿಲ್ದಾಣಗಳಿಗೆ ಕಡಿಮೆ ದರದ ವಿಮಾನ ಶೋಧ.',
    officialWebsite: 'https://www.air.irctc.co.in/',
    allowedDomains: ['air.irctc.co.in', 'irctc.co.in'],
    isOfficialGovt: true,
    buttonLabel: 'Book Flights',
    buttonLabelKn: 'ವಿಮಾನ ಬುಕ್ ಮಾಡಿ',
    searchUrlGenerator: () => 'https://www.air.irctc.co.in/'
  },
  {
    id: 'air-india',
    name: 'Air India',
    category: 'flight',
    logoText: 'Air India',
    logoUrl: '/images/logos/air-india.svg',
    badge: 'Flag Carrier Airline',
    badgeKn: 'ರಾಷ್ಟ್ರೀಯ ವಿಮಾನಯಾನ ಸಂಸ್ಥೆ',
    description: 'Tata Group full-service carrier operating daily flights connecting Bengaluru (Kempegowda BLR) and Mangaluru (IXE) with major domestic and international routes.',
    descriptionKn: 'ಟಾಟಾ ಗ್ರೂಪ್‌ನ ಪೂರ್ಣ-ಸೇವಾ ವಿಮಾನಯಾನ ಸಂಸ್ಥೆ; ಬೆಂಗಳೂರು (ಕೆಂಪೇಗೌಡ ಬಿಎಲ್‌ಆರ್) ಮತ್ತು ಮಂಗಳೂರು ಮೂಲಕ ದೇಶೀಯ ಹಾಗೂ ಅಂತರರಾಷ್ಟ್ರೀಯ ಸಂಪರ್ಕ.',
    officialWebsite: 'https://www.airindia.com/',
    allowedDomains: ['airindia.com'],
    buttonLabel: 'Book Flights',
    buttonLabelKn: 'ವಿಮಾನ ಬುಕ್ ಮಾಡಿ',
    searchUrlGenerator: () => 'https://www.airindia.com/'
  },
  {
    id: 'indigo',
    name: 'IndiGo',
    category: 'flight',
    logoText: 'IndiGo',
    logoUrl: '/images/logos/indigo.svg',
    badge: 'Leading Domestic Airline',
    badgeKn: 'ಪ್ರಮುಖ ದೇಶೀಯ ವಿಮಾನಯಾನ',
    description: 'India’s largest passenger airline with extensive flight frequencies connecting Bengaluru, Mangaluru, Belagavi, Hubballi, and Shivamogga with 6E rewards.',
    descriptionKn: 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ನಗರಗಳಾದ ಬೆಂಗಳೂರು, ಮಂಗಳೂರು, ಬೆಳಗಾವಿ, ಹುಬ್ಬಳ್ಳಿ ಮತ್ತು ಶಿವಮೊಗ್ಗವನ್ನು ಸಂಪರ್ಕಿಸುವ ಭಾರತದ ಅತಿದೊಡ್ಡ ವಿಮಾನಯಾನ ಸಂಸ್ಥೆ.',
    officialWebsite: 'https://www.goindigo.in/',
    allowedDomains: ['goindigo.in'],
    buttonLabel: 'Book Flights',
    buttonLabelKn: 'ವಿಮಾನ ಬುಕ್ ಮಾಡಿ',
    searchUrlGenerator: () => 'https://www.goindigo.in/'
  },

  // ================= Trains =================
  {
    id: 'makemytrip-trains',
    name: 'MakeMyTrip Trains',
    category: 'train',
    logoText: 'MMT Rail',
    logoUrl: '/images/logos/makemytrip.svg',
    badge: 'Official Train Booking',
    badgeKn: 'ಅಧಿಕೃತ ರೈಲು ಬುಕಿಂಗ್',
    description: 'Instant Indian Railways ticket reservations for Vande Bharat, Jan Shatabdi, and Konkan Railway across Karnataka with live train running status.',
    descriptionKn: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ವಂದೇ ಭಾರತ್, ಜನಶತಾಬ್ದಿ ಮತ್ತು ಕೊಂಕಣ ರೈಲ್ವೆ ಟಿಕೆಟ್‌ಗಳ ತ್ವರಿತ ಬುಕಿಂಗ್ ಮತ್ತು ಲೈವ್ ರೈಲು ಮಾಹಿತಿ.',
    officialWebsite: 'https://www.makemytrip.com/railways/',
    allowedDomains: ['makemytrip.com'],
    searchUrlGenerator: () => 'https://www.makemytrip.com/railways/'
  },
  {
    id: 'irctc-trains',
    name: 'IRCTC — Indian Railway Catering and Tourism Corporation',
    category: 'train',
    logoText: 'IRCTC',
    logoUrl: '/images/logos/irctc.svg',
    badge: 'Official Indian Railways Portal',
    badgeKn: 'ಅಧಿಕೃತ ಭಾರತೀಯ ರೈಲ್ವೆ ಪೋರ್ಟಲ್',
    description: 'Book official Indian Railways train tickets, search trains, check availability, and manage railway reservations through the IRCTC website.',
    descriptionKn: 'ಅಧಿಕೃತ ಭಾರತೀಯ ರೈಲ್ವೆ ಟಿಕೆಟ್ ಬುಕಿಂಗ್, ರೈಲುಗಳ ಹುಡುಕಾಟ, ಸೀಟು ಲಭ್ಯತೆ ಪರಿಶೀಲನೆ ಮತ್ತು ರೈಲ್ವೆ ಮೀಸಲಾತಿ ನಿರ್ವಹಣೆ.',
    officialWebsite: 'https://www.irctc.co.in/nget/train-search',
    allowedDomains: ['irctc.co.in'],
    isOfficialGovt: true,
    buttonLabel: 'Book on IRCTC',
    buttonLabelKn: 'Book on IRCTC',
    searchUrlGenerator: () => 'https://www.irctc.co.in/nget/train-search'
  },

  // ================= Cabs & Rentals =================
  {
    id: 'savaari',
    name: 'Savaari Car Rentals',
    category: 'cab',
    logoText: 'Savaari',
    logoUrl: '/images/logos/savaari.png',
    badge: 'Chauffeur Outstation',
    badgeKn: 'ಚಾಲಕ ಸಹಿತ ಔಟ್‌ಸ್ಟೇಷನ್ ಟ್ಯಾಕ್ಸಿ',
    description: 'Reliable chauffeur-driven round-trip outstation cabs from Bengaluru, Mysuru, and Mangaluru through the Western Ghats.',
    descriptionKn: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು ಮತ್ತು ಕರಾವಳಿಯ ಪ್ರವಾಸಕ್ಕೆ ಬೆಂಗಳೂರು, ಮೈಸೂರುಗಳಿಂದ ನಂಬಿಕಸ್ಥ ಚಾಲಕರೊಂದಿಗೆ ಔಟ್‌ಸ್ಟೇಷನ್ ಕ್ಯಾಬ್‌ಗಳು.',
    officialWebsite: 'https://www.savaari.com',
    allowedDomains: ['savaari.com'],
    searchUrlGenerator: ({ origin = 'Bangalore', destination = 'Coorg' } = {}) =>
      `https://www.savaari.com/${encodeURIComponent(origin.toLowerCase().trim())}/outstation-cabs/${encodeURIComponent(origin.toLowerCase().trim())}-to-${encodeURIComponent(destination.toLowerCase().trim())}`
  },
  {
    id: 'zoomcar',
    name: 'Zoomcar Self-Drive',
    category: 'cab',
    logoText: 'Zoomcar',
    logoUrl: '/images/logos/zoomcar.png',
    badge: 'Self-Drive Fleet',
    badgeKn: 'ಸ್ವಯಂ ಚಾಲನಾ ಕಾರುಗಳು',
    description: 'Rent self-drive hatchbacks, sedans, and 4x4 SUVs from Bengaluru Airport and city hubs for road trips.',
    descriptionKn: 'ಕರ್ನಾಟಕ ರೋಡ್ ಟ್ರಿಪ್‌ಗಾಗಿ ಬೆಂಗಳೂರು ವಿಮಾನ ನಿಲ್ದಾಣ ಹಾಗೂ ನಗರದಾದ್ಯಂತ ಸ್ವಯಂ ಚಾಲನಾ ಕಾರುಗಳು.',
    officialWebsite: 'https://www.zoomcar.com',
    allowedDomains: ['zoomcar.com'],
    searchUrlGenerator: () => 'https://www.zoomcar.com/in/bangalore'
  }
];

export const POPULAR_KARNATAKA_ROUTES: PopularRoute[] = [
  {
    route: 'Bengaluru to Mysuru',
    routeKn: 'ಬೆಂಗಳೂರು - ಮೈಸೂರು',
    fromCity: 'Bengaluru',
    toCity: 'Mysuru',
    distanceKm: 145,
    travelTime: '2 hrs via Expressway / 1h 45m via Vande Bharat',
    travelTimeKn: 'ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ ಮೂಲಕ 2 ಗಂಟೆ / ವಂದೇ ಭಾರತ್ ಮೂಲಕ 1 ಗಂ 45 ನಿಮಿಷ',
    transportModes: [
      {
        mode: 'Train',
        modeKn: 'ರೈಲು',
        priceRangeInr: '₹85 (Express) - ₹650 (Vande Bharat AC)',
        details: 'Frequent daily services from KSR Bengaluru & Yesvantpur.',
        detailsKn: 'ಬೆಂಗಳೂರು ಸಿಟಿ ಹಾಗೂ ಯಶವಂತಪುರದಿಂದ ಪ್ರತಿದಿನ ನಿರಂತರ ರೈಲುಗಳು.'
      },
      {
        mode: 'KSRTC Bus',
        modeKn: 'KSRTC ಬಸ್',
        priceRangeInr: '₹180 (Sarige) - ₹380 (Airavat Club Class)',
        details: 'Buses depart every 5 to 10 minutes from Satellite Bus Station (BSBS).',
        detailsKn: 'ಸ್ಯಾಟಲೈಟ್ ಬಸ್ ನಿಲ್ದಾಣದಿಂದ ಪ್ರತಿ 5-10 ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ಬಸ್‌ಗಳು.'
      },
      {
        mode: 'Private Cab',
        modeKn: 'ಖಾಸಗಿ ಟ್ಯಾಕ್ಸಿ',
        priceRangeInr: '₹2,500 - ₹3,800',
        details: 'Smooth 10-lane expressway drive.',
        detailsKn: 'ದಶಪಥ ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇಯಲ್ಲಿ ಸುಗಮ ಚಾಲನೆ.'
      }
    ]
  },
  {
    route: 'Bengaluru to Coorg (Madikeri)',
    routeKn: 'ಬೆಂಗಳೂರು - ಕೊಡಗು (ಮಡಿಕೇರಿ)',
    fromCity: 'Bengaluru',
    toCity: 'Coorg',
    distanceKm: 265,
    travelTime: '5.5 - 6.5 hours',
    travelTimeKn: '5.5 ರಿಂದ 6.5 ಗಂಟೆಗಳು',
    transportModes: [
      {
        mode: 'KSRTC Bus',
        modeKn: 'KSRTC ಬಸ್',
        priceRangeInr: '₹420 - ₹850 (Airavat Multi-Axle)',
        details: 'Overnight and morning luxury sleeper buses from Kempegowda Bus Station.',
        detailsKn: 'ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣದಿಂದ ರಾತ್ರಿ ಹಾಗೂ ಬೆಳಗಿನ ಐಷಾರಾಮಿ ಸ್ಲೀಪರ್ ಬಸ್‌ಗಳು.'
      },
      {
        mode: 'Self-Drive',
        modeKn: 'ಸ್ವಯಂ ಚಾಲನಾ ಕಾರು',
        priceRangeInr: '₹3,200 (Fuel + Tolls estimate)',
        details: 'Scenic route via Mysuru Expressway and Kushalnagar.',
        detailsKn: 'ಮೈಸೂರು ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ ಮತ್ತು ಕುಶಾಲನಗರ ಮೂಲಕ ಸುಂದರ ಮಾರ್ಗ.'
      },
      {
        mode: 'Private Cab',
        modeKn: 'ಖಾಸಗಿ ಟ್ಯಾಕ್ಸಿ',
        priceRangeInr: '₹4,800 - ₹6,500',
        details: 'Ideal for group travel with sightseeing stops at Golden Temple Bylakuppe.',
        detailsKn: 'ಬೈಲಕುಪ್ಪೆ ಗೋಲ್ಡನ್ ಟೆಂಪಲ್ ವೀಕ್ಷಣೆ ಸೇರಿದಂತೆ ಗುಂಪು ಪ್ರಯಾಣಕ್ಕೆ ಸೂಕ್ತ.'
      }
    ]
  },
  {
    route: 'Bengaluru to Hampi (Hosapete)',
    routeKn: 'ಬೆಂಗಳೂರು - ಹಂಪಿ (ಹೊಸಪೇಟೆ)',
    fromCity: 'Bengaluru',
    toCity: 'Hampi',
    distanceKm: 345,
    travelTime: '6 - 7 hours (NH 48 & NH 50)',
    travelTimeKn: '6 ರಿಂದ 7 ಗಂಟೆಗಳು (ರಾಷ್ಟ್ರೀಯ ಹೆದ್ದಾರಿ)',
    transportModes: [
      {
        mode: 'Train',
        modeKn: 'ರೈಲು',
        priceRangeInr: '₹240 (Sleeper) - ₹1,100 (3AC)',
        details: 'Hampi Express (16591) departs SBC at 9:50 PM, arrives Hosapete at 7:10 AM.',
        detailsKn: 'ಹಂಪಿ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ರಾತ್ರಿ 9:50ಕ್ಕೆ ಹೊರಟು ಬೆಳಗ್ಗೆ 7:10ಕ್ಕೆ ಹೊಸಪೇಟೆ ತಲುಪುತ್ತದೆ.'
      },
      {
        mode: 'KSRTC Bus',
        modeKn: 'KSRTC ಬಸ್',
        priceRangeInr: '₹550 - ₹1,050',
        details: 'Airavat & Non-AC Sleeper night departures.',
        detailsKn: 'ಐರಾವತ ಹಾಗೂ ಸ್ಲೀಪರ್ ರಾತ್ರಿ ಬಸ್‌ಗಳು.'
      },
      {
        mode: 'Private Cab',
        modeKn: 'ಖಾಸಗಿ ಟ್ಯಾಕ್ಸಿ',
        priceRangeInr: '₹6,500 - ₹8,500',
        details: 'Comfortable road trip via Chitradurga Fort.',
        detailsKn: 'ಚಿತ್ರದುರ್ಗದ ಕಲ್ಲಿನ ಕೋಟೆ ಮಾರ್ಗವಾಗಿ ಆರಾಮದಾಯಕ ರಸ್ತೆ ಪ್ರಯಾಣ.'
      }
    ]
  },
  {
    route: 'Bengaluru to Gokarna',
    routeKn: 'ಬೆಂಗಳೂರು - ಗೋಕರ್ಣ',
    fromCity: 'Bengaluru',
    toCity: 'Gokarna',
    distanceKm: 490,
    travelTime: '8.5 - 10 hours',
    travelTimeKn: '8.5 ರಿಂದ 10 ಗಂಟೆಗಳು',
    transportModes: [
      {
        mode: 'Train',
        modeKn: 'ರೈಲು',
        priceRangeInr: '₹310 (Sleeper) - ₹1,350 (3AC)',
        details: 'Panchaganga Express (16595) or Karwar Express overnight.',
        detailsKn: 'ಪಂಚಗಂಗಾ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಅಥವಾ ಕಾರವಾರ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ರಾತ್ರಿ ರೈಲು.'
      },
      {
        mode: 'KSRTC Bus',
        modeKn: 'KSRTC ಬಸ್',
        priceRangeInr: '₹750 - ₹1,400',
        details: 'Direct AC Sleeper buses via Shimoga and Sirsi.',
        detailsKn: 'ಶಿವಮೊಗ್ಗ-ಶಿರಸಿ ಮಾರ್ಗವಾಗಿ ನೇರ AC ಸ್ಲೀಪರ್ ಬಸ್‌ಗಳು.'
      },
      {
        mode: 'Private Cab',
        modeKn: 'ಖಾಸಗಿ ಟ್ಯಾಕ್ಸಿ',
        priceRangeInr: '₹9,000 - ₹12,000',
        details: 'Long scenic drive along Western Ghats and coastal NH 66.',
        detailsKn: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು ಮತ್ತು NH 66 ಕರಾವಳಿ ಹೆದ್ದಾರಿಯ ರಮಣೀಯ ಚಾಲನೆ.'
      }
    ]
  },
  {
    route: 'Mangaluru to Udupi & Malpe',
    routeKn: 'ಮಂಗಳೂರು - ಉಡುಪಿ & ಮಲ್ಪೆ',
    fromCity: 'Mangaluru',
    toCity: 'Udupi',
    distanceKm: 58,
    travelTime: '1 hour 15 mins (NH 66)',
    travelTimeKn: '1 ಗಂಟೆ 15 ನಿಮಿಷ (NH 66)',
    transportModes: [
      {
        mode: 'KSRTC Bus',
        modeKn: 'KSRTC ಬಸ್',
        priceRangeInr: '₹65 - ₹120',
        details: 'Express buses depart every 5 minutes from KSRTC Bejai / State Bank.',
        detailsKn: 'ಬಿಜೈ ಹಾಗೂ ಸ್ಟೇಟ್ ಬ್ಯಾಂಕ್‌ನಿಂದ ಪ್ರತಿ 5 ನಿಮಿಷಕ್ಕೊಮ್ಮೆ ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಬಸ್‌ಗಳು.'
      },
      {
        mode: 'Train',
        modeKn: 'ರೈಲು',
        priceRangeInr: '₹45 (Unreserved) - ₹180',
        details: 'Scenic Konkan railway crossing Netravati and Pavanje rivers.',
        detailsKn: 'ನೇತ್ರಾವತಿ ಹಾಗೂ ಪಾವಂಜೆ ನದಿಗಳನ್ನು ದಾಟುವ ಕೊಂಕಣ ರೈಲ್ವೆ ಮಾರ್ಗ.'
      },
      {
        mode: 'Private Cab',
        modeKn: 'ಖಾಸಗಿ ಟ್ಯಾಕ್ಸಿ',
        priceRangeInr: '₹1,400 - ₹2,000',
        details: 'Direct airport/city drop to Malpe beach.',
        detailsKn: 'ಮಂಗಳೂರು ವಿಮಾನ ನಿಲ್ದಾಣದಿಂದ ಮಲ್ಪೆ ಬೀಚ್‌ಗೆ ನೇರ ಡ್ರಾಪ್.'
      }
    ]
  }
];
