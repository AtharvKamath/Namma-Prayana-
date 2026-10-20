export type Language = 'en' | 'kn';

export interface Translations {
  // Brand & Navigation
  brandName: string;
  brandKannadaName: string;
  tagline: string;
  travelPlannerSubtitle: string;
  navHome: string;
  navExplore: string;
  navAbout: string;
  navPlanner: string;
  navHotels: string;
  navTransport: string;
  navTransportAll: string;
  navTransportBuses: string;
  navTransportTrains: string;
  navTransportFlights: string;
  navTransportCabs: string;
  navTransportSelfDrive: string;
  navTransportSubtitle: string;
  navBuses: string;
  navTrains: string;
  navFlights: string;
  navKannadaHelper: string;
  navMyTrips: string;
  planMyTripBtn: string;
  emergencyHelplinesBtn: string;
  loginBtn: string;
  joinUsBtn: string;
  loginSignUpBtn: string;
  createAccount: string;
  alreadyHaveAccount: string;
  newToNammaPrayana: string;
  logoutBtn: string;
  myProfile: string;

  // Hero Section
  heroBadge: string;
  heroHeadline1: string;
  heroHeadlineHighlight: string;
  heroSubheadline: string;
  heroCtaPlanner: string;
  heroCtaExplore: string;
  heroCircuitsLabel: string;
  heroBadgeVerified: string;
  heroBadgeRoadTimes: string;
  heroBadgeBudget: string;

  // Discover Karnataka Introduction (Home)
  homeIntroBadge: string;
  homeIntroTitle: string;
  homeIntroSubtitle: string;
  homeIntroViewFullGuide: string;
  homeIntroKaravaliTitle: string;
  homeIntroKaravaliDesc: string;
  homeIntroMalenaduTitle: string;
  homeIntroMalenaduDesc: string;
  homeIntroNorthTitle: string;
  homeIntroNorthDesc: string;
  homeIntroSouthTitle: string;
  homeIntroSouthDesc: string;

  // Home Quick Planner
  quickPlannerBadge: string;
  quickPlannerTitle: string;
  quickPlannerSubtitle: string;
  featuredHighlightsBadge: string;
  featuredHighlightsTitle: string;
  featuredHighlightsSubtitle: string;
  viewAllDestinationsBtn: string;
  interactiveMapTitle: string;
  interactiveMapSubtitle: string;

  // Travel Services Grid
  serviceHotelsTitle: string;
  serviceHotelsDesc: string;
  serviceHotelsCta: string;
  serviceBusesTitle: string;
  serviceBusesDesc: string;
  serviceBusesCta: string;
  serviceTrainsTitle: string;
  serviceTrainsDesc: string;
  serviceTrainsCta: string;
  serviceHelperTitle: string;
  serviceHelperDesc: string;
  serviceHelperCta: string;

  // Planner Form
  plannerFormBadge: string;
  plannerFormTitle: string;
  plannerFormSubtitle: string;
  fieldStartingCity: string;
  fieldStartingCityPlaceholder: string;
  fieldTravelDates: string;
  fieldDurationDays: string;
  fieldTravellersCount: string;
  fieldDestinationPreferences: string;
  exploreAllKarnatakaBtn: string;
  exploringAllKarnatakaActive: string;
  fieldInterestsThemes: string;
  fieldBudgetTier: string;
  fieldTotalBudgetInr: string;
  tierBudget: string;
  tierBudgetDesc: string;
  tierComfort: string;
  tierComfortDesc: string;
  tierPremium: string;
  tierPremiumDesc: string;
  fieldTransportMode: string;
  fieldAccommodationStyle: string;
  modeCar: string;
  modeCab: string;
  modeBus: string;
  modeTrain: string;
  stayHomestay: string;
  stayResort: string;
  stayBudgetHotel: string;
  stayLuxuryHotel: string;
  generateItineraryBtn: string;
  generatingItineraryBtn: string;
  trustVerifiedDestinations: string;
  trustFeasibleDriveTimes: string;
  trustNoFabricatedBookings: string;

  // Destination Explorer
  explorerBadge: string;
  explorerTitle: string;
  explorerSubtitle: string;
  searchPlaceholder: string;
  filterAllDistricts: string;
  tabGrid: string;
  tabMap: string;
  catAll: string;
  catHeritage: string;
  catCoast: string;
  catHills: string;
  catWildlife: string;
  catWaterfalls: string;
  catCulture: string;
  emptyDestinationsTitle: string;
  emptyDestinationsDesc: string;
  resetFiltersBtn: string;
  cardFreeEntry: string;
  cardEntryFee: string;
  cardViewDetails: string;
  cardPlanTripHere: string;
  cardAddedToTrip: string;
  cardFromBengaluru: string;

  // Destination Detail Modal
  modalBestTime: string;
  modalEntryTariff: string;
  modalDuration: string;
  modalAboutTitle: string;
  modalHeritageTitle: string;
  modalKeyAttractions: string;
  modalRecommendedExperiences: string;
  modalTimings: string;
  modalOfficialTariffs: string;
  modalLocation: string;
  modalTransitLinks: string;
  modalAccessibilityNotes: string;
  modalOfficialSource: string;
  modalLastVerified: string;
  modalGetDirections: string;
  modalAddToMyTrip: string;

  // Itinerary View
  itineraryDurationLabel: string;
  itineraryOriginLabel: string;
  itineraryBudgetTierLabel: string;
  itinerarySaveBtn: string;
  itinerarySavedBtn: string;
  itineraryShareBtn: string;
  itineraryPrintBtn: string;
  itineraryModifyBtn: string;
  budgetWarningTitle: string;
  budgetWarningDesc: string;
  budgetOnTargetTitle: string;
  budgetOnTargetDesc: string;
  budgetWithinTitle: string;
  budgetWithinDesc: string;
  dayHeaderOf: string;
  slotMorning: string;
  slotAfternoon: string;
  slotEvening: string;
  nightStayRec: string;
  compareStaysBtn: string;
  moveDayUpBtn: string;
  removeDayBtn: string;
  itemizedBudgetTitle: string;
  totalEstimatedCostLabel: string;
  perPersonLabel: string;
  costTransport: string;
  costAccommodation: string;
  costFood: string;
  costActivities: string;
  costLocalTransit: string;
  costContingency: string;
  costAssumptionsTitle: string;
  routeFeasibilityTitle: string;
  keyCircuitHubs: string;
  localAdvisoriesTitle: string;
  handyPhrasesTitle: string;

  // Budget Calculator
  calcBadge: string;
  calcTitle: string;
  calcSubtitle: string;
  calcDurationLabel: string;
  calcTravellersLabel: string;
  calcComfortLabel: string;
  calcUserBudgetLabel: string;
  calcIncludeContingency: string;
  calcTotalEstimated: string;
  calcWithinBudget: string;
  calcExceedsBudget: string;
  calcBreakdownTitle: string;

  // Booking Hub (Transport)
  bookingBadge: string;
  bookingTitle: string;
  bookingSubtitle: string;
  bookingTransparencyNoticeTitle: string;
  bookingTransparencyNoticeDesc: string;
  bookingTabBus: string;
  bookingTabTrain: string;
  bookingTabHotel: string;
  bookingTabFlight: string;
  bookingTabCab: string;
  bookingPrefillTitle: string;
  bookingFieldFrom: string;
  bookingFieldTo: string;
  bookingFieldDate: string;
  bookingFieldGuests: string;
  bookingOfficialPortal: string;
  bookingSearchOn: string;
  bookingRouteBenchmarksTitle: string;
  bookingRouteBenchmarksSubtitle: string;

  // Hotels & Homestays Dedicated Page
  hotelsPageTitle: string;
  hotelsPageSubtitle: string;
  hotelsBadge: string;
  hotelsFilterAll: string;
  hotelsFilterGovt: string;
  hotelsFilterHomestays: string;
  hotelsFilterBudget: string;
  hotelsPrefillTitle: string;
  hotelsFieldDestination: string;
  hotelsFieldCheckIn: string;
  hotelsFieldCheckOut: string;
  hotelsFieldGuests: string;
  hotelsStayTypesTitle: string;
  hotelsStayTypesSubtitle: string;
  hotelsTransparencyTitle: string;
  hotelsTransparencyDesc: string;
  hotelsPopularDestinationsTitle: string;
  hotelsQuickSearchLabel: string;
  hotelsDirectPortalNotice: string;
  hotelsBookDirectBtn: string;

  // Kannada Helper
  helperBadge: string;
  helperTitle: string;
  helperSubtitle: string;
  helperEtiquetteTitle: string;
  helperEtiquetteDesc: string;
  helperSearchPlaceholder: string;
  helperListenAudio: string;
  helperCopyPhrase: string;
  helperCopiedToast: string;

  // Saved Trips
  savedBadge: string;
  savedTitle: string;
  savedSubtitle: string;
  savedImportBtn: string;
  savedExportBtn: string;
  savedEmptyTitle: string;
  savedEmptyDesc: string;
  savedPlanNewJourneyBtn: string;
  savedOpenItineraryBtn: string;

  // About Karnataka
  aboutBadge: string;
  aboutTitle: string;
  aboutDesc: string;
  aboutFourLandsTitle: string;
  aboutFourLandsSubtitle: string;
  aboutGiTitle: string;
  aboutGiSubtitle: string;
  aboutOfficialPortalsTitle: string;
  aboutOfficialPortalsSubtitle: string;

  // Footer & Helplines
  footerAboutText: string;
  footerMadeWithPride: string;
  footerQuickNavTitle: string;
  footerTravelAssistanceTitle: string;
  footerOfficialTourismTitle: string;
  footerDisclaimerText: string;
  footerCopyright: string;
  helplinesTitle: string;
  helplinesSubtitle: string;
  helplineEmergencyLabel: string;
  faqsTitle: string;
  contactSupportTitle: string;
  contactNamePlaceholder: string;
  contactEmailPlaceholder: string;
  contactMessagePlaceholder: string;
  contactSubmitBtn: string;
  contactSuccessToast: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    brandName: 'NAMMA PRAYANA',
    brandKannadaName: 'ನಮ್ಮ ಪ್ರಯಾಣ',
    tagline: 'Your Journey, Your Story.',
    travelPlannerSubtitle: 'Travel Planner for Karnataka',
    navHome: 'Home',
    navExplore: 'Explore Karnataka',
    navAbout: 'About',
    navPlanner: 'AI Trip Planner',
    navHotels: 'Hotels',
    navTransport: 'Transport',
    navTransportAll: 'All Transport Options',
    navTransportBuses: 'Buses (KSRTC & Private)',
    navTransportTrains: 'Trains (IRCTC & Rail)',
    navTransportFlights: 'Flights (Karnataka Airports)',
    navTransportCabs: 'Cabs & Outstation Taxis',
    navTransportSelfDrive: 'Self-Drive Rentals',
    navTransportSubtitle: 'Buses, Trains, Flights, Cabs & Self-Drive across Karnataka',
    navBuses: 'Buses',
    navTrains: 'Trains',
    navFlights: 'Flights',
    navKannadaHelper: 'Kannada Helper',
    navMyTrips: 'My Trips',
    planMyTripBtn: 'Plan My Trip',
    emergencyHelplinesBtn: 'Emergency Helplines & Travel Guide',
    loginBtn: 'Login',
    joinUsBtn: 'Join Us',
    loginSignUpBtn: 'Login / Sign Up',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account? Login',
    newToNammaPrayana: 'New to Namma Prayana? Create an account',
    logoutBtn: 'Logout',
    myProfile: 'My Profile',

    heroBadge: 'Your Journey, Your Story. · ನಮ್ಮ ಪ್ರಯಾಣ',
    heroHeadline1: 'Discover Karnataka,',
    heroHeadlineHighlight: 'Your Way.',
    heroSubheadline: 'From peaceful beaches and misty mountains to royal palaces and ancient heritage, plan a journey that fits your interests, time, and budget.',
    heroCtaPlanner: 'Generate My Itinerary',
    heroCtaExplore: 'Explore 18+ Verified Destinations',
    heroCircuitsLabel: 'Popular Karnataka Travel Circuits:',
    heroBadgeVerified: 'ASI & KSTDC Verified Locations',
    heroBadgeRoadTimes: 'Realistic Road Travel Times',
    heroBadgeBudget: 'Transparent INR Budgeting',

    // Discover Karnataka Introduction (Home)
    homeIntroBadge: 'Discover Karnataka · One State, Many Worlds',
    homeIntroTitle: 'Discover Karnataka: Four Distinct Landscapes',
    homeIntroSubtitle: 'From the Arabian Sea coastline and misty rainforests of the Western Ghats to ancient Deccan stone empires and royal Mysore heritage, Karnataka brings together four breathtaking regions.',
    homeIntroViewFullGuide: 'Explore About Karnataka & Regions Guide',
    homeIntroKaravaliTitle: 'Karavali (The Coastal Belt)',
    homeIntroKaravaliDesc: '320 km of Arabian Sea coastline, pristine beaches (Gokarna, Malpe), Murudeshwar sea gopura, and legendary coastal cuisine.',
    homeIntroMalenaduTitle: 'Malenadu (Western Ghats)',
    homeIntroMalenaduDesc: 'UNESCO World Heritage rainforests, Jog Falls, coffee & spice plantations of Coorg and Chikkamagaluru, and misty peaks.',
    homeIntroNorthTitle: 'North Karnataka (Deccan Heritage)',
    homeIntroNorthDesc: 'UNESCO monuments of Hampi and Pattadakal, rock-cut Chalukyan caves of Badami, Gol Gumbaz, and rich folklore traditions.',
    homeIntroSouthTitle: 'Old Mysore (Southern Heartland)',
    homeIntroSouthDesc: 'Royal Amba Vilas Palace, world-renowned Dasara celebrations, Kabini and Nagarhole tiger reserves, and Silk & Sandalwood.',

    quickPlannerBadge: 'Intelligent Route & Budget Planner',
    quickPlannerTitle: 'Plan Your Custom Karnataka Itinerary',
    quickPlannerSubtitle: 'Enter your departure point, travel dates, and budget to generate a realistic day-by-day plan with genuine driving distances.',
    featuredHighlightsBadge: 'Handpicked Highlights',
    featuredHighlightsTitle: 'Icons of Karnataka',
    featuredHighlightsSubtitle: 'World Heritage monuments, mist-clad peaks, and untouched Arabian Sea sands.',
    viewAllDestinationsBtn: 'View All 18+ Destinations',
    interactiveMapTitle: 'Interactive Karnataka Route Map',
    interactiveMapSubtitle: 'Click any marker to view entry tariffs, timings, and verified directions links.',

    serviceHotelsTitle: 'Hotels & Plantation Homestays',
    serviceHotelsDesc: 'Discover authentic Malenadu coffee estate stays, heritage palaces in Mysuru, and beachfront shacks in Gokarna.',
    serviceHotelsCta: 'Compare Stays',
    serviceBusesTitle: 'Buses (KSRTC, redBus, AbhiBus)',
    serviceBusesDesc: 'Direct search on official KSRTC Awatar and private AC sleepers with live tracking and verified seat routes.',
    serviceBusesCta: 'Search Bus Routes',
    serviceTrainsTitle: 'Trains (IRCTC, MakeMyTrip Trains)',
    serviceTrainsDesc: 'Compare train booking options through IRCTC and MakeMyTrip Trains for journeys across Karnataka, including Vande Bharat, Jan Shatabdi, and Konkan Railway routes.',
    serviceTrainsCta: 'Search Train Routes',
    serviceHelperTitle: 'Kannada Travel Helper',
    serviceHelperDesc: 'Everyday phrases with Kannada script, pronunciation guides, and audio playback for food, buses, and asking directions.',
    serviceHelperCta: 'Explore Phrases',

    plannerFormBadge: 'Intelligent Route & Budget Planner',
    plannerFormTitle: 'Plan Your Karnataka Journey',
    plannerFormSubtitle: 'Tailored to your departure hub, preferred travel pacing, real road distances, and exact budget.',
    fieldStartingCity: 'Starting City / Location',
    fieldStartingCityPlaceholder: 'e.g. Bengaluru, Mysuru, Hubballi',
    fieldTravelDates: 'Travel Start Date',
    fieldDurationDays: 'Duration (Days)',
    fieldTravellersCount: 'Travellers',
    fieldDestinationPreferences: 'Destination Preferences',
    exploreAllKarnatakaBtn: 'Explore All Karnataka',
    exploringAllKarnatakaActive: '✓ Exploring All Karnataka',
    fieldInterestsThemes: 'Travel Interests & Themes',
    fieldBudgetTier: 'Budget Tier',
    fieldTotalBudgetInr: 'Total Budget in INR (₹)',
    tierBudget: 'Budget',
    tierBudgetDesc: 'Hostels / KSRTC',
    tierComfort: 'Comfort',
    tierComfortDesc: 'Homestays / AC',
    tierPremium: 'Premium',
    tierPremiumDesc: 'Resorts / Private',
    fieldTransportMode: 'Preferred Transport Mode',
    fieldAccommodationStyle: 'Accommodation Style',
    modeCar: 'Self-Drive Car',
    modeCab: 'Private Cab & Driver',
    modeBus: 'KSRTC / Private Bus',
    modeTrain: 'Train / Rail',
    stayHomestay: 'Plantation Homestay',
    stayResort: 'Heritage / Eco Resort',
    stayBudgetHotel: 'Budget Comfort Hotel',
    stayLuxuryHotel: '4/5-Star Luxury',
    generateItineraryBtn: 'Generate My Itinerary',
    generatingItineraryBtn: 'Crafting Verified Itinerary...',
    trustVerifiedDestinations: 'Verified Karnataka Destinations',
    trustFeasibleDriveTimes: 'Feasible road & travel times',
    trustNoFabricatedBookings: 'No fabricated bookings',

    explorerBadge: 'Verified Karnataka Travel Directory',
    explorerTitle: 'Explore Karnataka',
    explorerSubtitle: 'Researched destinations with verified GPS coordinates, official ASI opening hours, entry fees, and cultural heritage.',
    searchPlaceholder: 'Search by monument, beach, hill, district (e.g. Hampi, Gokarna, Coorg)...',
    filterAllDistricts: 'All Districts',
    tabGrid: 'Grid Cards',
    tabMap: 'Interactive Map',
    catAll: 'All Destinations',
    catHeritage: 'Heritage & Temples',
    catCoast: 'Coastal & Beaches',
    catHills: 'Hill Stations & Western Ghats',
    catWildlife: 'Wildlife Sanctuaries',
    catWaterfalls: 'Waterfalls & Rivers',
    catCulture: 'Culture & Gastronomy',
    emptyDestinationsTitle: 'No destinations found',
    emptyDestinationsDesc: 'Try adjusting your search query or selecting "All Districts".',
    resetFiltersBtn: 'Reset All Filters',
    cardFreeEntry: 'Free Entry',
    cardEntryFee: 'Entry: ₹',
    cardViewDetails: 'View Details',
    cardPlanTripHere: 'Plan Trip Here',
    cardAddedToTrip: 'Added to preferences',
    cardFromBengaluru: 'from BLR',

    modalBestTime: 'Best Time',
    modalEntryTariff: 'Entry Fee',
    modalDuration: 'Duration',
    modalAboutTitle: 'About This Destination',
    modalHeritageTitle: 'Historical & Cultural Heritage',
    modalKeyAttractions: 'Key Attractions',
    modalRecommendedExperiences: 'Recommended Experiences',
    modalTimings: 'Timings:',
    modalOfficialTariffs: 'Official Tariffs:',
    modalLocation: 'Location:',
    modalTransitLinks: 'Transit Links:',
    modalAccessibilityNotes: 'Accessibility Notes:',
    modalOfficialSource: 'Source:',
    modalLastVerified: 'Last verified:',
    modalGetDirections: 'Get Directions',
    modalAddToMyTrip: 'Add to My Trip',

    itineraryDurationLabel: 'Days',
    itineraryOriginLabel: 'Origin:',
    itineraryBudgetTierLabel: 'Tier',
    itinerarySaveBtn: 'Save to My Trips',
    itinerarySavedBtn: 'Trip Saved',
    itineraryShareBtn: 'Share / Copy',
    itineraryPrintBtn: 'Print / Save as PDF',
    itineraryModifyBtn: 'Modify Trip',
    budgetWarningTitle: 'Budget Warning: Estimated Expenses Exceed Your Target Budget',
    budgetWarningDesc: 'Your requested plan estimates ₹{estimated} INR against your stated budget of ₹{budget} INR.',
    budgetOnTargetTitle: 'Budget On Target: Matches Your Target Budget',
    budgetOnTargetDesc: 'Estimated expenses of ₹{budget} INR match your target travel budget exactly.',
    budgetWithinTitle: 'Within Budget: ₹{savings} Under Your Target Budget',
    budgetWithinDesc: 'Your plan estimates ₹{estimated} INR, leaving ₹{savings} INR headroom from your stated budget of ₹{budget} INR.',
    dayHeaderOf: 'Day {current} of {total}',
    slotMorning: 'Morning (6:00 AM – 12:00 PM)',
    slotAfternoon: 'Afternoon (12:00 PM – 4:30 PM)',
    slotEvening: 'Evening & Sunset (4:30 PM – 9:00 PM)',
    nightStayRec: 'Night Stay Recommendation',
    compareStaysBtn: 'Compare Stays',
    moveDayUpBtn: 'Move Up',
    removeDayBtn: 'Remove',
    itemizedBudgetTitle: 'Itemized Budget',
    totalEstimatedCostLabel: 'Total Estimated Cost',
    perPersonLabel: '≈ ₹{amount} per person',
    costTransport: 'Transport & Fuel',
    costAccommodation: 'Accommodation',
    costFood: 'Food & Dining',
    costActivities: 'ASI / Monument Entry Tickets',
    costLocalTransit: 'Local Transit & Autos',
    costContingency: '10% Emergency Contingency',
    costAssumptionsTitle: 'Cost Assumptions:',
    routeFeasibilityTitle: 'Route & Drive Feasibility',
    keyCircuitHubs: 'Key Circuit Hubs:',
    localAdvisoriesTitle: 'Local Advisories',
    handyPhrasesTitle: 'Handy Kannada Phrases for this Trip',

    calcBadge: 'Interactive Trip Cost Estimator',
    calcTitle: 'Karnataka Trip Budget Calculator',
    calcSubtitle: 'Simulate realistic travel expenses for any duration, group size, and comfort preference across Karnataka.',
    calcDurationLabel: 'Trip Duration',
    calcTravellersLabel: 'Travellers',
    calcComfortLabel: 'Comfort Category',
    calcUserBudgetLabel: 'Your Target Trip Budget (INR)',
    calcIncludeContingency: 'Include recommended 10% emergency buffer',
    calcTotalEstimated: 'Total Estimated Journey Cost',
    calcWithinBudget: 'Comfortably within budget',
    calcExceedsBudget: 'Exceeds target by',
    calcBreakdownTitle: 'Cost Component Breakdown',

    bookingBadge: 'Transparent Booking Discovery & Fare Comparison',
    bookingTitle: 'Travel Booking & Fare Comparison',
    bookingSubtitle: 'Search verified transit routes across Karnataka. Compare official state transports (KSRTC Awatar) with leading aggregators (MakeMyTrip, Goibibo, redBus, AbhiBus) with your search parameters preserved.',
    bookingTransparencyNoticeTitle: 'Direct Provider Booking Policy',
    bookingTransparencyNoticeDesc: 'Namma Prayana connects you directly to verified transport websites. We never collect payment, process tickets, or display fabricated seat availability. When clicking a provider, you will leave Namma Prayana and complete your booking safely on their secured portal.',
    bookingTabBus: 'Buses (KSRTC & Private)',
    bookingTabTrain: 'Trains',
    bookingTabHotel: 'Hotels & Homestays',
    bookingTabFlight: 'Flights',
    bookingTabCab: 'Cabs & Self-Drive',
    bookingPrefillTitle: 'Set Your Journey Parameters for Provider Redirect',
    bookingFieldFrom: 'From',
    bookingFieldTo: 'To / Destination',
    bookingFieldDate: 'Travel Date',
    bookingFieldGuests: 'Passengers / Guests',
    bookingOfficialPortal: 'Official Govt Portal',
    bookingSearchOn: 'Search on',
    bookingRouteBenchmarksTitle: 'Popular Karnataka Route Fare Benchmarks',
    bookingRouteBenchmarksSubtitle: 'Verified realistic price ranges and typical journey durations to help you budget accurately.',

    // Dedicated Hotels & Homestays Page
    hotelsPageTitle: 'Hotels & Homestays in Karnataka',
    hotelsPageSubtitle: 'Discover jungle eco-resorts, plantation homestays, heritage palaces, and budget stays across Karnataka. Book directly on trusted provider portals.',
    hotelsBadge: 'Karnataka Accommodations',
    hotelsFilterAll: 'All Stays',
    hotelsFilterGovt: 'Official Govt Eco-Resorts (JLR & KSTDC)',
    hotelsFilterHomestays: 'Plantation & Heritage Stays',
    hotelsFilterBudget: 'Budget & Comfort Stays',
    hotelsPrefillTitle: 'Search Karnataka Accommodations & Open Direct Booking Portals',
    hotelsFieldDestination: 'Destination / Region in Karnataka',
    hotelsFieldCheckIn: 'Check-in Date',
    hotelsFieldCheckOut: 'Check-out Date',
    hotelsFieldGuests: 'Guests',
    hotelsStayTypesTitle: 'Authentic Karnataka Stay Styles',
    hotelsStayTypesSubtitle: 'From lush Western Ghats coffee estates to royal palaces and seaside retreats.',
    hotelsTransparencyTitle: 'Direct Provider Booking Policy',
    hotelsTransparencyDesc: 'Namma Prayana provides direct links to trusted accommodation providers. We do not collect payments or display fabricated live room rates. When you click a provider, you will leave Namma Prayana and complete your stay reservation directly on their official website.',
    hotelsPopularDestinationsTitle: 'Popular Karnataka Stay Destinations',
    hotelsQuickSearchLabel: 'Quick Search:',
    hotelsDirectPortalNotice: 'Direct Booking Partner Links',
    hotelsBookDirectBtn: 'Book on',

    helperBadge: 'ಕನ್ನಡ ಪ್ರವಾಸ ಸಹಾಯಕ · Local Travel Companion',
    helperTitle: 'Kannada Travel Helper',
    helperSubtitle: 'Essential everyday Kannada phrases for travellers exploring Karnataka. Includes authentic Kannada script, phonetic English transliteration, English translation, and audio pronunciation.',
    helperEtiquetteTitle: 'A Warm Karnataka Greeting Goes a Long Way!',
    helperEtiquetteDesc: 'Starting your conversations with a warm "Namaskāra" (ನಮಸ್ಕಾರ) and saying "Dhanyavādagaḷu" (ಧನ್ಯವಾದಗಳು) will instantly bring smiles and warm hospitality from locals across Karnataka!',
    helperSearchPlaceholder: 'Search phrases (e.g., dosae, bus, road, hotel, bill)...',
    helperListenAudio: 'Listen to pronunciation',
    helperCopyPhrase: 'Copy phrase',
    helperCopiedToast: 'Phrase copied to clipboard!',

    savedBadge: 'Browser Persistent Storage',
    savedTitle: 'My Saved Trips',
    savedSubtitle: 'Access, view, export, and manage your personalized Karnataka itineraries. Stored locally in your browser so you can access them offline during your journeys.',
    savedImportBtn: 'Import Trips',
    savedExportBtn: 'Export All (JSON)',
    savedEmptyTitle: 'No saved trips yet',
    savedEmptyDesc: 'Generate an itinerary using our AI Trip Planner and click "Save to My Trips" to store it for your upcoming travels.',
    savedPlanNewJourneyBtn: 'Plan a New Journey',
    savedOpenItineraryBtn: 'Open Itinerary',

    aboutBadge: 'Discover Karnataka. Plan smarter. Travel better.',
    aboutTitle: 'Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ)',
    aboutDesc: '"Your Journey, Your Story." We are dedicated to creating an exceptional, authentic, and culturally grounded travel-planning experience for travellers exploring Karnataka — celebrating its ancient dynasties, untamed wildlife, sacred temples, and scenic coastline.',
    aboutFourLandsTitle: 'The Four Lands of Karnataka',
    aboutFourLandsSubtitle: 'Karnataka is one of India\'s most geographically diverse states, stretching from the Arabian Sea to the Deccan plateau.',
    aboutGiTitle: 'Geographical Indications (GI) of Karnataka',
    aboutGiSubtitle: 'Authentic souvenirs and produce protected under the Geographical Indications of Goods Act.',
    aboutOfficialPortalsTitle: 'Official Karnataka Tourism Portals',
    aboutOfficialPortalsSubtitle: 'For official festival dates, wildlife safari bookings, and KSTDC tour packages.',

    footerAboutText: 'NAMMA PRAYANA (ನಮ್ಮ ಪ್ರಯಾಣ) — “Your Journey, Your Story.” Discover Karnataka. Plan smarter. Travel better. Personalized AI itineraries, destination explorer, budget calculator, and Kannada travel assistance.',
    footerMadeWithPride: 'Made with pride for travellers exploring Karnataka.',
    footerQuickNavTitle: 'Explore & Plan',
    footerTravelAssistanceTitle: 'Travel Assistance',
    footerOfficialTourismTitle: 'Official Tourism Portals',
    footerDisclaimerText: 'Booking & Estimation Disclaimer: Namma Prayana provides intelligent travel discovery, AI route optimization, and fare estimates based on published tariffs and current distance data. Direct provider links redirect to official third-party booking systems (MakeMyTrip, Goibibo, redBus, AbhiBus, KSRTC, IRCTC). We never claim live booking confirmations without external checkout.',
    footerCopyright: 'Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ). All rights reserved.',
    helplinesTitle: 'Travel Assistance & Helplines',
    helplinesSubtitle: 'Official Karnataka emergency numbers & traveller support',
    helplineEmergencyLabel: 'Emergency & Official Helplines (Karnataka)',
    faqsTitle: 'Frequently Asked Travel Questions',
    contactSupportTitle: 'Contact Namma Prayana Support',
    contactNamePlaceholder: 'Your Name',
    contactEmailPlaceholder: 'Your Email',
    contactMessagePlaceholder: 'How can we assist your Karnataka journey?',
    contactSubmitBtn: 'Submit Message',
    contactSuccessToast: 'Thank you! Your inquiry has been recorded. Our team will reach out.',
  },

  kn: {
    brandName: 'ನಮ್ಮ ಪ್ರಯಾಣ',
    brandKannadaName: 'ನಮ್ಮ ಪ್ರಯಾಣ',
    tagline: 'ನಿಮ್ಮ ಪಯಣ, ನಿಮ್ಮ ಕಥೆ.',
    travelPlannerSubtitle: 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜನೆ',
    navHome: 'ಮುಖಪುಟ',
    navExplore: 'ಕರ್ನಾಟಕ ತಾಣಗಳು',
    navAbout: 'ಪರಿಚಯ',
    navPlanner: 'AI ಪ್ರವಾಸ ಯೋಜನೆ',
    navHotels: 'ಹೋಟೆಲ್‌ಗಳು & ಹೋಮ್‌ಸ್ಟೇ',
    navTransport: 'ಸಾರಿಗೆ',
    navTransportAll: 'ಎಲ್ಲಾ ಸಾರಿಗೆ ಆಯ್ಕೆಗಳು',
    navTransportBuses: 'ಬಸ್‌ಗಳು (KSRTC & ಖಾಸಗಿ)',
    navTransportTrains: 'ರೈಲುಗಳು (IRCTC & ವಂದೇ ಭಾರತ್)',
    navTransportFlights: 'ವಿಮಾನಗಳು (ವಿಮಾನ ನಿಲ್ದಾಣಗಳು)',
    navTransportCabs: 'ಟ್ಯಾಕ್ಸಿ & ಔಟ್‌ಸ್ಟೇಷನ್ ಕ್ಯಾಬ್‌ಗಳು',
    navTransportSelfDrive: 'ಸ್ವಯಂ ಚಾಲನಾ ಕಾರುಗಳು',
    navTransportSubtitle: 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಬಸ್, ರೈಲು, ವಿಮಾನ, ಕ್ಯಾಬ್ ಮತ್ತು ಸ್ವಯಂ ಚಾಲನಾ ಸೌಲಭ್ಯ',
    navBuses: 'ಬಸ್‌ಗಳು',
    navTrains: 'ರೈಲುಗಳು',
    navFlights: 'ವಿಮಾನಗಳು',
    navKannadaHelper: 'ಕನ್ನಡ ಸಹಾಯ',
    navMyTrips: 'ನನ್ನ ಪ್ರವಾಸಗಳು',
    planMyTripBtn: 'ಪ್ರವಾಸ ಯೋಜನೆ ಪ್ರಾರಂಭಿಸಿ',
    emergencyHelplinesBtn: 'ತುರ್ತು ಸಹಾಯವಾಣಿ & ಮಾರ್ಗದರ್ಶಿ',
    loginBtn: 'ಲಾಗಿನ್',
    joinUsBtn: 'ನಮ್ಮ ಪ್ರಯಾಣ ಸೇರಿ',
    loginSignUpBtn: 'ಲಾಗಿನ್ / ಸೈನ್ ಅಪ್',
    createAccount: 'ಖಾತೆ ರಚಿಸಿ',
    alreadyHaveAccount: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ? ಲಾಗಿನ್ ಆಗಿ',
    newToNammaPrayana: 'ನಮ್ಮ ಪ್ರಯಾಣಕ್ಕೆ ಹೊಸಬರೇ? ಖಾತೆ ರಚಿಸಿ',
    logoutBtn: 'ಲಾಗ್‌ಔಟ್',
    myProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',

    heroBadge: 'ನಿಮ್ಮ ಪಯಣ, ನಿಮ್ಮ ಕಥೆ. · ನಮ್ಮ ಪ್ರಯಾಣ',
    heroHeadline1: 'ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ,',
    heroHeadlineHighlight: 'ನಿಮ್ಮ ಶೈಲಿಯಲ್ಲಿ.',
    heroSubheadline: 'ಪ್ರಶಾಂತ ಕಡಲತೀರಗಳಿಂದ ಮಂಜು ಕವಿದ ಗಿರಿಧಾಮಗಳವರೆಗೆ, ಭವ್ಯ ಅರಮನೆಗಳಿಂದ ಪ್ರಾಚೀನ ಶಿಲ್ಪಕಲೆಯವರೆಗೆ — ನಿಮ್ಮ ಸಮಯ, ಆಸಕ್ತಿ ಮತ್ತು ಬಜೆಟ್‌ಗೆ ತಕ್ಕಂತೆ ಸುಲಭವಾಗಿ ಯೋಜಿಸಿ.',
    heroCtaPlanner: 'ನನ್ನ ಪ್ರವಾಸ ಯೋಜನೆ ರಚಿಸಿ',
    heroCtaExplore: '18+ ಪರಿಶೀಲಿಸಿದ ತಾಣಗಳನ್ನು ನೋಡಿ',
    heroCircuitsLabel: 'ಜನಪ್ರಿಯ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಮಾರ್ಗಗಳು:',
    heroBadgeVerified: 'ASI & KSTDC ಪರಿಶೀಲಿಸಿದ ಸ್ಥಳಗಳು',
    heroBadgeRoadTimes: 'ನಿಖರ ರಸ್ತೆ ಪ್ರಯಾಣ ಸಮಯ',
    heroBadgeBudget: 'ಪಾರದರ್ಶಕ ರೂಪಾಯಿ ವೆಚ್ಚದ ಲೆಕ್ಕಾಚಾರ',

    // Discover Karnataka Introduction (Home)
    homeIntroBadge: 'ಕರ್ನಾಟಕ ಪರಿಚಯ · ಒಂದು ರಾಜ್ಯ, ಹಲವು ಜಗತ್ತು',
    homeIntroTitle: 'ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ: ನಾಲ್ಕು ವಿಶಿಷ್ಟ ಭೌಗೋಳಿಕ ವಲಯಗಳು',
    homeIntroSubtitle: 'ಅರಬ್ಬೀ ಸಮುದ್ರದ ಕರಾವಳಿ ತೀರ ಮತ್ತು ಮಲೆನಾಡಿನ ಮಂಜು ಕವಿದ ಬೆಟ್ಟಗಳಿಂದ ಹಿಡಿದು, ಉತ್ತರ ಕರ್ನಾಟಕದ ಪ್ರಾಚೀನ ಸಾಮ್ರಾಜ್ಯಗಳ ಶಿಲ್ಪಕಲೆ ಹಾಗೂ ಮೈಸೂರಿನ ರಾಜವೈಭವದವರೆಗೆ — ಕರ್ನಾಟಕದ ಅದ್ಭುತ ವಲಯಗಳು.',
    homeIntroViewFullGuide: 'ಕರ್ನಾಟಕ ಮತ್ತು ೪ ವಲಯಗಳ ಸಂಪೂರ್ಣ ವಿವರ ನೋಡಿ',
    homeIntroKaravaliTitle: 'ಕರಾವಳಿ (ಕರಾವಳಿ ತೀರ ಪ್ರದೇಶ)',
    homeIntroKaravaliDesc: '320 ಕಿ.ಮೀ ಅರಬ್ಬೀ ಸಮುದ್ರ ತೀರ, ಗೋಕರ್ಣ ಮತ್ತು ಮಲ್ಪೆ ಕಡಲತೀರಗಳು, ಮುರುಡೇಶ್ವರ ಹಾಗೂ ವಿಶ್ವಪ್ರಸಿದ್ಧ ಕರಾವಳಿ ಊಟೋಪಚಾರ.',
    homeIntroMalenaduTitle: 'ಮಲೆನಾಡು (ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು)',
    homeIntroMalenaduDesc: 'ಯುನೆಸ್ಕೋ ವಿಶ್ವ ಜೀವವೈವಿಧ್ಯ, ಜೋಗ ಜಲಪಾತ, ಕೊಡಗು ಮತ್ತು ಚಿಕ್ಕಮಗಳೂರಿನ ಕಾಫಿ ತೋಟಗಳು ಹಾಗೂ ಮಂಜಿನ ಗಿರಿಧಾಮಗಳು.',
    homeIntroNorthTitle: 'ಉತ್ತರ ಕರ್ನಾಟಕ (ದಖನ್ ಪರಂಪರೆ)',
    homeIntroNorthDesc: 'ಹಂಪಿ ಮತ್ತು ಪಟ್ಟದಕಲ್ಲು ಯುನೆಸ್ಕೋ ತಾಣಗಳು, ಬಾದಾಮಿಯ ಗುಹೆಗಳು, ಗೋಲ್ ಗುಂಬಜ್ ಮತ್ತು ಜೋಳದ ರೊಟ್ಟಿ ಸಂಸ್ಕೃತಿ.',
    homeIntroSouthTitle: 'ಹಳೇ ಮೈಸೂರು (ದಕ್ಷಿಣ ಬಯಲುಸೀಮೆ)',
    homeIntroSouthDesc: 'ಭವ್ಯ ಮೈಸೂರು ಅರಮನೆ, ವಿಶ್ವವಿಖ್ಯಾತ ದಸರಾ, ಕಬಿನಿ ಮತ್ತು ನಾಗರಹೊಳೆ ಹುಲಿ ಸಂರಕ್ಷಿತಾರಣ್ಯಗಳು ಹಾಗೂ ಮೈಸೂರು ರೇಷ್ಮೆ.',

    quickPlannerBadge: 'ಸ್ಮಾರ್ಟ್ ಮಾರ್ಗ & ಬಜೆಟ್ ಪ್ಲಾನರ್',
    quickPlannerTitle: 'ನಿಮ್ಮ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜಿಸಿ',
    quickPlannerSubtitle: 'ಹೊರಡುವ ಸ್ಥಳ, ದಿನಾಂಕಗಳು ಮತ್ತು ಬಜೆಟ್ ನಮೂದಿಸಿ — ನಿಖರ ಚಾಲನಾ ದೂರ ಮತ್ತು ದೈನಂದಿನ ಕಾರ್ಯಕ್ರಮದೊಂದಿಗೆ ಪೂರ್ಣ ಯೋಜನೆ ಪಡೆಯಿರಿ.',
    featuredHighlightsBadge: 'ಪ್ರಮುಖ ಆಕರ್ಷಣೆಗಳು',
    featuredHighlightsTitle: 'ಕರ್ನಾಟಕದ ಐತಿಹಾಸಿಕ ರತ್ನಗಳು',
    featuredHighlightsSubtitle: 'ವಿಶ್ವ ಪರಂಪರೆಯ ಸ್ಮಾರಕಗಳು, ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಶಿಖರಗಳು ಮತ್ತು ಸುವರ್ಣ ಕಡಲತೀರಗಳು.',
    viewAllDestinationsBtn: 'ಎಲ್ಲಾ 18+ ತಾಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    interactiveMapTitle: 'ಕರ್ನಾಟಕ ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ',
    interactiveMapSubtitle: 'ಪ್ರವೇಶ ಶುಲ್ಕ, ಸಮಯ ಮತ್ತು ನಕ್ಷೆ ಮಾರ್ಗ ನೋಡಲು ಮಾರ್ಕರ್ ಕ್ಲಿಕ್ ಮಾಡಿ.',

    serviceHotelsTitle: 'ಹೋಟೆಲ್‌ಗಳು & ಕಾಫಿ ಎಸ್ಟೇಟ್ ಹೋಮ್‌ಸ್ಟೇಗಳು',
    serviceHotelsDesc: 'ಮಲೆನಾಡಿನ ಕಾಫಿ ತೋಟದ ಹೋಮ್‌ಸ್ಟೇಗಳು, ಮೈಸೂರಿನ ಪಾರಂಪರಿಕ ಅರಮನೆ ತಂಗುದಾಣಗಳು ಮತ್ತು ಗೋಕರ್ಣದ ಕಡಲತೀರದ ಕುಟೀರಗಳು.',
    serviceHotelsCta: 'ವಸತಿ ಹೋಲಿಸಿ',
    serviceBusesTitle: 'ಬಸ್‌ಗಳು (KSRTC, redBus, AbhiBus)',
    serviceBusesDesc: 'KSRTC ಐರಾವತ ಹಾಗೂ ಖಾಸಗಿ AC ಸ್ಲೀಪರ್ ಬಸ್‌ಗಳ ನೇರ ಶೋಧ ಮತ್ತು ಖಚಿತ ಸೀಟುಗಳ ಪರಿಶೀಲನೆ.',
    serviceBusesCta: 'ಬಸ್ ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಿ',
    serviceTrainsTitle: 'ರೈಲುಗಳು (IRCTC, MakeMyTrip Trains)',
    serviceTrainsDesc: 'IRCTC ಮತ್ತು MakeMyTrip Trains ಮೂಲಕ ವಂದೇ ಭಾರತ್, ಜನಶತಾಬ್ದಿ ಹಾಗೂ ಕೊಂಕಣ ರೈಲ್ವೆ ಮಾರ್ಗಗಳ ರೈಲು ಬುಕಿಂಗ್ ಆಯ್ಕೆಗಳನ್ನು ಹೋಲಿಸಿ.',
    serviceTrainsCta: 'ರೈಲು ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಿ',
    serviceHelperTitle: 'ಕನ್ನಡ ಪ್ರವಾಸ ಸಹಾಯಕ',
    serviceHelperDesc: 'ಊಟ, ಕಾಫಿ, ಬಸ್ ಹಾಗೂ ದಾರಿ ಕೇಳಲು ಉಪಯುಕ್ತ ದೈನಂದಿನ ಕನ್ನಡ ವಾಕ್ಯಗಳು ಮತ್ತು ಧ್ವನಿ ಉಚ್ಚಾರಣೆ.',
    serviceHelperCta: 'ವಾಕ್ಯಗಳನ್ನು ಕಲಿಯಿರಿ',

    plannerFormBadge: 'ಸ್ಮಾರ್ಟ್ ಮಾರ್ಗ & ಬಜೆಟ್ ಪ್ಲಾನರ್',
    plannerFormTitle: 'ನಿಮ್ಮ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜಿಸಿ',
    plannerFormSubtitle: 'ಹೊರಡುವ ನಗರ, ವಾಹನ, ಆಸಕ್ತಿಗಳು ಮತ್ತು ಬಜೆಟ್‌ಗೆ ಅನುಗುಣವಾಗಿ ನೈಜ ದಿನನಿತ್ಯದ ಕಾರ್ಯಕ್ರಮ.',
    fieldStartingCity: 'ಹೊರಡುವ ನಗರ / ಸ್ಥಳ',
    fieldStartingCityPlaceholder: 'ಉದಾ: ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಹುಬ್ಬಳ್ಳಿ',
    fieldTravelDates: 'ಪ್ರವಾಸ ಪ್ರಾರಂಭ ದಿನಾಂಕ',
    fieldDurationDays: 'ಅವಧಿ (ದಿನಗಳು)',
    fieldTravellersCount: 'ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ',
    fieldDestinationPreferences: 'ಆಯ್ಕೆಯ ತಾಣಗಳು',
    exploreAllKarnatakaBtn: 'ಕರ್ನಾಟಕ ಪೂರ್ತಿ ಅನ್ವೇಷಿಸಿ',
    exploringAllKarnatakaActive: '✓ ಕರ್ನಾಟಕ ಪೂರ್ತಿ ಅನ್ವೇಷಣೆ',
    fieldInterestsThemes: 'ಪ್ರವಾಸದ ಆಸಕ್ತಿಗಳು & ಅನುಭವಗಳು',
    fieldBudgetTier: 'ಬಜೆಟ್ ವರ್ಗ',
    fieldTotalBudgetInr: 'ಒಟ್ಟು ಬಜೆಟ್ ರೂಪಾಯಿಗಳಲ್ಲಿ (₹)',
    tierBudget: 'ಬಜೆಟ್ (ಮಿತವ್ಯಯ)',
    tierBudgetDesc: 'ಹಾಸ್ಟೆಲ್ / KSRTC',
    tierComfort: 'ಕಂಫರ್ಟ್ (ಆರಾಮ)',
    tierComfortDesc: 'ಹೋಮ್‌ಸ್ಟೇ / AC',
    tierPremium: 'ಪ್ರೀಮಿಯಂ (ಭವ್ಯ)',
    tierPremiumDesc: 'ರೆಸಾರ್ಟ್ / ಕಾರು',
    fieldTransportMode: 'ಆದ್ಯತೆಯ ಸಾರಿಗೆ ವಿಧಾನ',
    fieldAccommodationStyle: 'ವಸತಿ ಶೈಲಿ',
    modeCar: 'ಸ್ವಯಂ ಚಾಲನಾ ಕಾರು',
    modeCab: 'ಖಾಸಗಿ ಟ್ಯಾಕ್ಸಿ & ಚಾಲಕ',
    modeBus: 'KSRTC / ಖಾಸಗಿ ಬಸ್',
    modeTrain: 'ರೈಲು ಪ್ರಯಾಣ',
    stayHomestay: 'ಕಾಫಿ ಎಸ್ಟೇಟ್ ಹೋಮ್‌ಸ್ಟೇ',
    stayResort: 'ಪಾರಂಪರಿಕ / ಇಕೋ ರೆಸಾರ್ಟ್',
    stayBudgetHotel: 'ಸ್ವಚ್ಛ ಬಜೆಟ್ ಹೋಟೆಲ್',
    stayLuxuryHotel: '4/5-ಸ್ಟಾರ್ ಐಷಾರಾಮಿ',
    generateItineraryBtn: 'ನನ್ನ ಪ್ರವಾಸ ಯೋಜನೆ ರಚಿಸಿ',
    generatingItineraryBtn: 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜನೆ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...',
    trustVerifiedDestinations: 'ಪರಿಶೀಲಿಸಿದ ಕರ್ನಾಟಕ ತಾಣಗಳು',
    trustFeasibleDriveTimes: 'ನೈಜ ರಸ್ತೆ ಪ್ರಯಾಣ ಸಮಯ',
    trustNoFabricatedBookings: 'ಪಾರದರ್ಶಕ ವೆಚ್ಚದ ಲೆಕ್ಕಾಚಾರ',

    explorerBadge: 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ ನಿರ್ದೇಶಿಕೆ',
    explorerTitle: 'ಕರ್ನಾಟಕ ತಾಣಗಳು',
    explorerSubtitle: 'ನಿಖರ ಜಿಪಿಎಸ್ ನಿರ್ದೇಶಾಂಕಗಳು, ಅಧಿಕೃತ ASI ಪ್ರವೇಶ ಸಮಯ, ಶುಲ್ಕ ಮತ್ತು ಇತಿಹಾಸದ ಮಾಹಿತಿ.',
    searchPlaceholder: 'ಸ್ಮಾರಕ, ಕಡಲತೀರ, ಬೆಟ್ಟ, ಜಿಲ್ಲೆ ಮೂಲಕ ಹುಡುಕಿ (ಉದಾ: ಹಂಪಿ, ಗೋಕರ್ಣ, ಕೊಡಗು)...',
    filterAllDistricts: 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು',
    tabGrid: 'ಕಾರ್ಡ್ ಗ್ರಿಡ್',
    tabMap: 'ಸಂವಾದಾತ್ಮಕ ನಕ್ಷೆ',
    catAll: 'ಎಲ್ಲಾ ತಾಣಗಳು',
    catHeritage: 'ಪರಂಪರೆ & ದೇವಾಲಯಗಳು',
    catCoast: 'ಕರಾವಳಿ & ಕಡಲತೀರಗಳು',
    catHills: 'ಗಿರಿಧಾಮಗಳು & ಮಲೆನಾಡು',
    catWildlife: 'ವನ್ಯಜೀವಿ ಧಾಮಗಳು',
    catWaterfalls: 'ಜಲಪಾತಗಳು & ನದಿಗಳು',
    catCulture: 'ಸಂಸ್ಕೃತಿ & ಊಟೋಪಚಾರ',
    emptyDestinationsTitle: 'ಯಾವುದೇ ತಾಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
    emptyDestinationsDesc: 'ಹುಡುಕಾಟ ಪದ ಬದಲಾಯಿಸಿ ಅಥವಾ "ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು" ಆಯ್ಕೆ ಮಾಡಿ.',
    resetFiltersBtn: 'ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ',
    cardFreeEntry: 'ಉಚಿತ ಪ್ರವೇಶ',
    cardEntryFee: 'ಪ್ರವೇಶ: ₹',
    cardViewDetails: 'ವಿವರ ನೋಡಿ',
    cardPlanTripHere: 'ಇಲ್ಲಿಗೆ ಪ್ರವಾಸ ಯೋಜಿಸಿ',
    cardAddedToTrip: 'ಆದ್ಯತೆಗೆ ಸೇರಿಸಲಾಗಿದೆ',
    cardFromBengaluru: 'ಬೆಂಗಳೂರಿನಿಂದ',

    modalBestTime: 'ಉತ್ತಮ ಸಮಯ',
    modalEntryTariff: 'ಪ್ರವೇಶ ಶುಲ್ಕ',
    modalDuration: 'ಭೇಟಿಯ ಅವಧಿ',
    modalAboutTitle: 'ಈ ತಾಣದ ಬಗ್ಗೆ',
    modalHeritageTitle: 'ಐತಿಹಾಸಿಕ & ಸಾಂಸ್ಕೃತಿಕ ಪರಂಪರೆ',
    modalKeyAttractions: 'ಪ್ರಮುಖ ಆಕರ್ಷಣೆಗಳು',
    modalRecommendedExperiences: 'ಶಿಫಾರಸು ಮಾಡಿದ ಅನುಭವಗಳು',
    modalTimings: 'ಸಮಯ:',
    modalOfficialTariffs: 'ಅಧಿಕೃತ ಶುಲ್ಕ:',
    modalLocation: 'ವಿಳಾಸ:',
    modalTransitLinks: 'ಸಾರಿಗೆ ಸಂಪರ್ಕ:',
    modalAccessibilityNotes: 'ಪ್ರವೇಶ ನಿಯಮಗಳು:',
    modalOfficialSource: 'ಮಾಹಿತಿ ಮೂಲ:',
    modalLastVerified: 'ಪರಿಶೀಲಿಸಿದ ದಿನಾಂಕ:',
    modalGetDirections: 'ದಾರಿ ತೋರಿಸಿ (ಗೂಗಲ್ ಮ್ಯಾಪ್ಸ್)',
    modalAddToMyTrip: 'ನನ್ನ ಪ್ರವಾಸಕ್ಕೆ ಸೇರಿಸಿ',

    itineraryDurationLabel: 'ದಿನಗಳು',
    itineraryOriginLabel: 'ಹೊರಡುವ ಸ್ಥಳ:',
    itineraryBudgetTierLabel: 'ವರ್ಗ',
    itinerarySaveBtn: 'ನನ್ನ ಪ್ರವಾಸಗಳಲ್ಲಿ ಉಳಿಸಿ',
    itinerarySavedBtn: 'ಉಳಿಸಲಾಗಿದೆ',
    itineraryShareBtn: 'ಹಂಚಿಕೊಳ್ಳಿ',
    itineraryPrintBtn: 'ಪಿಡಿಎಫ್ / ಪ್ರಿಂಟ್ ಮಾಡಿ',
    itineraryModifyBtn: 'ಪ್ರವಾಸ ಮಾರ್ಪಡಿಸಿ',
    budgetWarningTitle: 'ಬಜೆಟ್ ಎಚ್ಚರಿಕೆ: ಅಂದಾಜು ವೆಚ್ಚವು ನಿಮ್ಮ ಗುರಿ ಬಜೆಟ್‌ಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ',
    budgetWarningDesc: 'ನಿಮ್ಮ ನಿಗದಿತ ಬಜೆಟ್ ₹{budget} ಆಗಿದ್ದು, ಯೋಜನೆಯ ಅಂದಾಜು ವೆಚ್ಚ ₹{estimated} ಆಗಿದೆ.',
    budgetOnTargetTitle: 'ಬಜೆಟ್ ಮಿತಿಯಲ್ಲಿದೆ: ನಿಗದಿತ ಬಜೆಟ್‌ಗೆ ಸಮನಾಗಿದೆ',
    budgetOnTargetDesc: 'ಒಟ್ಟು ಅಂದಾಜು ವೆಚ್ಚ ₹{budget} INR ನಿಮ್ಮ ನಿಗದಿತ ಪ್ರವಾಸ ಬಜೆಟ್‌ಗೆ ನಿಖರವಾಗಿ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ.',
    budgetWithinTitle: 'ಬಜೆಟ್ ಒಳಗೆ: ₹{savings} ಉಳಿತಾಯ',
    budgetWithinDesc: 'ನಿಮ್ಮ ಅಂದಾಜು ವೆಚ್ಚ ₹{estimated} ಆಗಿದ್ದು, ನಿಗದಿತ ಬಜೆಟ್ ₹{budget} ನಿಂದ ₹{savings} ಉಳಿತಾಯವಾಗಲಿದೆ.',
    dayHeaderOf: 'ದಿನ {current} / {total}',
    slotMorning: 'ಬೆಳಗ್ಗೆ (6:00 AM – 12:00 PM)',
    slotAfternoon: 'ಮಧ್ಯಾಹ್ನ (12:00 PM – 4:30 PM)',
    slotEvening: 'ಸಂಜೆ & ಸೂರ್ಯಾಸ್ತ (4:30 PM – 9:00 PM)',
    nightStayRec: 'ರಾತ್ರಿ ವಾಸ್ತವ್ಯದ ಶಿಫಾರಸು',
    compareStaysBtn: 'ವಸತಿ ಹೋಲಿಸಿ',
    moveDayUpBtn: 'ಮೇಲಕ್ಕೆ ಸರಿಸಿ',
    removeDayBtn: 'ತೆಗೆದುಹಾಕಿ',
    itemizedBudgetTitle: 'ವೆಚ್ಚದ ವಿವರವಾದ ಪಟ್ಟಿ',
    totalEstimatedCostLabel: 'ಒಟ್ಟು ಅಂದಾಜು ವೆಚ್ಚ',
    perPersonLabel: '≈ ತಲಾ ₹{amount}',
    costTransport: 'ಸಾರಿಗೆ & ಇಂಧನ',
    costAccommodation: 'ವಸತಿ & ತಂಗುದಾಣ',
    costFood: 'ಊಟ & ಕಾಫಿ ತಿಂಡಿ',
    costActivities: 'ASI / ಸ್ಮಾರಕ ಪ್ರವೇಶ ಶುಲ್ಕ',
    costLocalTransit: 'ಸ್ಥಳೀಯ ಆಟೋ & ಟ್ಯಾಕ್ಸಿ',
    costContingency: '10% ತುರ್ತು ಮೀಸಲು ನಿಧಿ',
    costAssumptionsTitle: 'ವೆಚ್ಚದ ಲೆಕ್ಕಾಚಾರದ ಆಧಾರಗಳು:',
    routeFeasibilityTitle: 'ಮಾರ್ಗ & ಪ್ರಯಾಣದ ಸುಲಭತೆ',
    keyCircuitHubs: 'ಪ್ರಮುಖ ನಿಲುಗಡೆಗಳು:',
    localAdvisoriesTitle: 'ಸ್ಥಳೀಯ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು',
    handyPhrasesTitle: 'ಈ ಪ್ರವಾಸಕ್ಕೆ ಉಪಯುಕ್ತ ಕನ್ನಡ ವಾಕ್ಯಗಳು',

    calcBadge: 'ಸಂವಾದಾತ್ಮಕ ಪ್ರವಾಸ ವೆಚ್ಚ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    calcTitle: 'ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಬಜೆಟ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    calcSubtitle: 'ಯಾವುದೇ ಅವಧಿ, ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ ಮತ್ತು ಆರಾಮದಾಯಕ ವರ್ಗಕ್ಕೆ ನೈಜ ವೆಚ್ಚವನ್ನು ಅಂದಾಜಿಸಿ.',
    calcDurationLabel: 'ಪ್ರವಾಸದ ಅವಧಿ',
    calcTravellersLabel: 'ಪ್ರಯಾಣಿಕರು',
    calcComfortLabel: 'ಆರಾಮದ ವರ್ಗ',
    calcUserBudgetLabel: 'ನಿಮ್ಮ ನಿರೀಕ್ಷಿತ ಬಜೆಟ್ (ರೂ)',
    calcIncludeContingency: '10% ತುರ್ತು ಮೀಸಲು ನಿಧಿ ಸೇರಿಸಿ',
    calcTotalEstimated: 'ಒಟ್ಟು ಅಂದಾಜು ಪ್ರವಾಸ ವೆಚ್ಚ',
    calcWithinBudget: 'ಬಜೆಟ್ ಮಿತಿಯಲ್ಲಿದೆ',
    calcExceedsBudget: 'ಬಜೆಟ್‌ಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ:',
    calcBreakdownTitle: 'ಪ್ರಮುಖ ವೆಚ್ಚಗಳ ವಿಭಜನೆ',

    bookingBadge: 'ಪಾರದರ್ಶಕ ಬುಕಿಂಗ್ & ದರ ಹೋಲಿಕೆ',
    bookingTitle: 'ಪ್ರವಾಸ ಬುಕಿಂಗ್ & ದರ ಹೋಲಿಕೆ',
    bookingSubtitle: 'ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ಸಾರಿಗೆ (KSRTC Awatar) ಹಾಗೂ ಪ್ರಮುಖ ಪೋರ್ಟಲ್‌ಗಳನ್ನು (MakeMyTrip, Goibibo, redBus, AbhiBus) ಪೂರ್ವ-ತುಂಬಿದ ವಿವರಗಳೊಂದಿಗೆ ನೇರವಾಗಿ ಹೋಲಿಸಿ.',
    bookingTransparencyNoticeTitle: 'ನೇರ ಪೋರ್ಟಲ್ ಬುಕಿಂಗ್ ನೀತಿ',
    bookingTransparencyNoticeDesc: 'ನಮ್ಮ ಪ್ರಯಾಣವು ನಿಮ್ಮನ್ನು ಅಧಿಕೃತ ಸಾರಿಗೆ ಪೋರ್ಟಲ್‌ಗಳಿಗೆ ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ. ನಾವು ಯಾವುದೇ ಹಣ ಪಾವತಿ ಅಥವಾ ಟಿಕೆಟ್ ಪ್ರಕ್ರಿಯೆಯನ್ನು ಇಲ್ಲಿ ನಡೆಸುವುದಿಲ್ಲ ಮತ್ತು ನಕಲಿ ಸೀಟು ಲಭ್ಯತೆಯನ್ನು ತೋರಿಸುವುದಿಲ್ಲ. ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿದಾಗ ಆಯಾ ವೆಬ್‌ಸೈಟ್‌ಗೆ ತೆರಳಿ ಸುರಕ್ಷಿತವಾಗಿ ಬುಕಿಂಗ್ ಮಾಡಬಹುದು.',
    bookingTabBus: 'ಬಸ್‌ಗಳು (KSRTC & ಖಾಸಗಿ)',
    bookingTabTrain: 'ರೈಲುಗಳು',
    bookingTabHotel: 'ಹೋಟೆಲ್‌ಗಳು & ಹೋಮ್‌ಸ್ಟೇ',
    bookingTabFlight: 'ವಿಮಾನಗಳು',
    bookingTabCab: 'ಟ್ಯಾಕ್ಸಿ & ಸೆಲ್ಫ್-ಡ್ರೈವ್',
    bookingPrefillTitle: 'ಬುಕಿಂಗ್ ಪೋರ್ಟಲ್‌ಗೆ ಕಳುಹಿಸಲು ಪ್ರಯಾಣದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
    bookingFieldFrom: 'ಹೊರಡುವ ಸ್ಥಳ',
    bookingFieldTo: 'ತಲುಪುವ ಸ್ಥಳ',
    bookingFieldDate: 'ಪ್ರಯಾಣ ದಿನಾಂಕ',
    bookingFieldGuests: 'ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ',
    bookingOfficialPortal: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್',
    bookingSearchOn: 'ಬುಕ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ:',
    bookingRouteBenchmarksTitle: 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಮಾರ್ಗಗಳ ದರ ಮಾನದಂಡಗಳು',
    bookingRouteBenchmarksSubtitle: 'ನಿಮ್ಮ ಬಜೆಟ್ ಸಿದ್ಧತೆಗೆ ನೈಜ ದರ ಶ್ರೇಣಿಗಳು ಮತ್ತು ಪ್ರಯಾಣ ಸಮಯ.',

    // Dedicated Hotels & Homestays Page (ಕನ್ನಡ)
    hotelsPageTitle: 'ಕರ್ನಾಟಕದ ಹೋಟೆಲ್‌ಗಳು ಮತ್ತು ಹೋಮ್‌ಸ್ಟೇಗಳು',
    hotelsPageSubtitle: 'ಕರ್ನಾಟಕದ ಜಂಗಲ್ ಇಕೋ-ರೆಸಾರ್ಟ್‌ಗಳು, ಕಾಫಿ ತೋಟದ ಹೋಮ್‌ಸ್ಟೇಗಳು, ಪಾರಂಪರಿಕ ಅರಮನೆಗಳು ಮತ್ತು ಬಜೆಟ್ ತಂಗುದಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ. ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳ ಮೂಲಕ ನೇರವಾಗಿ ಬುಕ್ ಮಾಡಿ.',
    hotelsBadge: 'ಕರ್ನಾಟಕ ತಂಗುದಾಣಗಳು',
    hotelsFilterAll: 'ಎಲ್ಲಾ ತಂಗುದಾಣಗಳು',
    hotelsFilterGovt: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಇಕೋ-ರೆಸಾರ್ಟ್‌ಗಳು (JLR & KSTDC)',
    hotelsFilterHomestays: 'ತೋಟದ ಹೋಮ್‌ಸ್ಟೇಗಳು & ಪಾರಂಪರಿಕ ತಂಗುದಾಣ',
    hotelsFilterBudget: 'ಬಜೆಟ್ & ಕಂಫರ್ಟ್ ಸ್ಟೇಗಳು',
    hotelsPrefillTitle: 'ಕರ್ನಾಟಕದ ತಂಗುದಾಣಗಳ ಹುಡುಕಾಟ ಮತ್ತು ನೇರ ಪೋರ್ಟಲ್ ಸಂಪರ್ಕ',
    hotelsFieldDestination: 'ಕರ್ನಾಟಕದ ತಾಣ / ನಗರ',
    hotelsFieldCheckIn: 'ಚೆಕ್-ಇನ್ ದಿನಾಂಕ',
    hotelsFieldCheckOut: 'ಚೆಕ್-ಔಟ್ ದಿನಾಂಕ',
    hotelsFieldGuests: 'ಅತಿಥಿಗಳು',
    hotelsStayTypesTitle: 'ಕರ್ನಾಟಕದ ವಿಶಿಷ್ಟ ತಂಗುದಾಣ ಶೈಲಿಗಳು',
    hotelsStayTypesSubtitle: 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಕಾಫಿ ಎಸ್ಟೇಟ್‌ಗಳಿಂದ ಹಿಡಿದು ರಾಜಮನೆತನದ ಅರಮನೆಗಳು ಮತ್ತು ಕರಾವಳಿಯ ರೆಸಾರ್ಟ್‌ಗಳವರೆಗೆ.',
    hotelsTransparencyTitle: 'ನೇರ ಪೋರ್ಟಲ್ ಬುಕಿಂಗ್ ನೀತಿ',
    hotelsTransparencyDesc: 'ನಮ್ಮ ಪ್ರಯಾಣವು ವಿಶ್ವಾಸಾರ್ಹ ತಂಗುದಾಣ ಪೋರ್ಟಲ್‌ಗಳಿಗೆ ನೇರ ಲಿಂಕ್‌ಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ನಾವು ಯಾವುದೇ ಹಣ ಪಾವತಿಯನ್ನು ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ ಅಥವಾ ನಕಲಿ ಕೊಠಡಿ ಕೊರತೆ ತೋರಿಸುವುದಿಲ್ಲ. ಲಿಂಕ್ ಕ್ಲಿಕ್ ಮಾಡಿದಾಗ ಆಯಾ ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ಗೆ ತೆರಳಿ ಅಲ್ಲಿಯೇ ನಿಮ್ಮ ಕೊಠಡಿ ಕಾಯ್ದಿರಿಸಬಹುದು.',
    hotelsPopularDestinationsTitle: 'ಜನಪ್ರಿಯ ಕರ್ನಾಟಕ ತಂಗುದಾಣ ತಾಣಗಳು',
    hotelsQuickSearchLabel: 'ತ್ವರಿತ ಹುಡುಕಾಟ:',
    hotelsDirectPortalNotice: 'ನೇರ ಬುಕಿಂಗ್ ಪಾಲುದಾರ ಲಿಂಕ್‌ಗಳು',
    hotelsBookDirectBtn: 'ಬುಕ್ ಮಾಡಲು ತೆರೆಯಿರಿ:',

    helperBadge: 'ಕನ್ನಡ ಪ್ರವಾಸ ಸಹಾಯಕ · Local Travel Companion',
    helperTitle: 'ಕನ್ನಡ ಪ್ರವಾಸ ಸಹಾಯಕ',
    helperSubtitle: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಸಂಚರಿಸುವ ಪ್ರವಾಸಿಗರಿಗೆ ಅತ್ಯಗತ್ಯವಾದ ದಿನನಿತ್ಯದ ಕನ್ನಡ ವಾಕ್ಯಗಳು, ಇಂಗ್ಲಿಷ್ ಉಚ್ಚಾರಣೆ ಮತ್ತು ಧ್ವನಿ ಸಹಾಯಕ.',
    helperEtiquetteTitle: 'ಸ್ನೇಹಪರ ನಮಸ್ಕಾರದಿಂದ ನಿಮ್ಮ ಪ್ರಯಾಣ ಆರಂಭಿಸಿ!',
    helperEtiquetteDesc: 'ಯಾವುದೇ ಸಂಭಾಷಣೆಯನ್ನು "ನಮಸ್ಕಾರ" ಎಂದು ಶುರುಮಾಡಿ "ಧನ್ಯವಾದಗಳು" ಎಂದು ಮುಗಿಸಿದರೆ ಕರ್ನಾಟಕದ ಜನರು ಅತಿ ಪ್ರೀತಿಯಿಂದ ನೆರವಾಗುತ್ತಾರೆ!',
    helperSearchPlaceholder: 'ವಾಕ್ಯಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ: ದೋಸೆ, ಬಸ್, ದಾರಿ, ಹೋಟೆಲ್, ಬಿಲ್)...',
    helperListenAudio: 'ಧ್ವನಿ ಆಲಿಸಿ',
    helperCopyPhrase: 'ವಾಕ್ಯ ಕಾಪಿ ಮಾಡಿ',
    helperCopiedToast: 'ವಾಕ್ಯವನ್ನು ಕ್ಲಿಪ್‌ಬೋರ್ಡ್‌ಗೆ ಕಾಪಿ ಮಾಡಲಾಗಿದೆ!',

    savedBadge: 'ಬ್ರೌಸರ್ ಸುರಕ್ಷಿತ ಸಂಗ್ರಹಣೆ',
    savedTitle: 'ನನ್ನ ಉಳಿಸಿದ ಪ್ರವಾಸಗಳು',
    savedSubtitle: 'ನಿಮ್ಮ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಯೋಜನೆಗಳನ್ನು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿಯೂ ಸುಲಭವಾಗಿ ವೀಕ್ಷಿಸಿ, ಎಡಿಟ್ ಮಾಡಿ ಮತ್ತು ಜೈಸನ್ (JSON) ರೂಪದಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಿ.',
    savedImportBtn: 'ಪ್ರವಾಸ ಆಮದು (Import)',
    savedExportBtn: 'ಎಲ್ಲವನ್ನೂ ರಫ್ತು ಮಾಡಿ (JSON)',
    savedEmptyTitle: 'ಇನ್ನೂ ಯಾವುದೇ ಪ್ರವಾಸಗಳು ಉಳಿಸಿಲ್ಲ',
    savedEmptyDesc: 'AI ಪ್ರವಾಸ ಯೋಜಕದಲ್ಲಿ ಹೊಸ ಪ್ಲಾನ್ ತಯಾರಿಸಿ "ನನ್ನ ಪ್ರವಾಸಗಳಲ್ಲಿ ಉಳಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.',
    savedPlanNewJourneyBtn: 'ಹೊಸ ಪ್ರವಾಸ ಯೋಜಿಸಿ',
    savedOpenItineraryBtn: 'ಯೋಜನೆ ತೆರೆಯಿರಿ',

    aboutBadge: 'ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ. ಸ್ಮಾರ್ಟ್ ಆಗಿ ಯೋಜಿಸಿ. ಉತ್ತಮವಾಗಿ ಪಯಣಿಸಿ.',
    aboutTitle: 'ನಮ್ಮ ಪ್ರಯಾಣ (NAMMA PRAYANA)',
    aboutDesc: '"ನಿಮ್ಮ ಪಯಣ, ನಿಮ್ಮ ಕಥೆ." ಕರ್ನಾಟಕದ ಪ್ರಾಚೀನ ಇತಿಹಾಸ, ಸಮೃದ್ಧ ವನ್ಯಜೀವಿಗಳು, ಪವಿತ್ರ ದೇಗುಲಗಳು ಮತ್ತು ಸುಂದರ ಕಡಲತೀರಗಳನ್ನು ಪ್ರತಿಯೊಬ್ಬ ಪ್ರವಾಸಿಗರಿಗೂ ಸರಳವಾಗಿ ತಲುಪಿಸುವುದೇ ನಮ್ಮ ಗುರಿ.',
    aboutFourLandsTitle: 'ಕರ್ನಾಟಕದ ನಾಲ್ಕು ಪ್ರಾಕೃತಿಕ ವಲಯಗಳು',
    aboutFourLandsSubtitle: 'ಅರಬ್ಬೀ ಸಮುದ್ರದ ಕರಾವಳಿಯಿಂದ ದಖನ್ ಪ್ರಸ್ಥಭೂಮಿಯವರೆಗೆ ಕರ್ನಾಟಕ ಅದ್ಭುತ ಭೌಗೋಳಿಕ ವೈವಿಧ್ಯತೆಯನ್ನು ಹೊಂದಿದೆ.',
    aboutGiTitle: 'ಕರ್ನಾಟಕದ ಜಿಐ (GI) ಟ್ಯಾಗ್ ಪಡೆದ ಪಾರಂಪರಿಕ ಉತ್ಪನ್ನಗಳು',
    aboutGiSubtitle: 'ಭೌಗೋಳಿಕ ಮಾನ್ಯತೆ ಪಡೆದ ಅಧಿಕೃತ ಕರಕುಶಲ ಮತ್ತು ಕೃಷಿ ಉತ್ಪನ್ನಗಳು.',
    aboutOfficialPortalsTitle: 'ಅಧಿಕೃತ ಕರ್ನಾಟಕ ಪ್ರವಾಸೋದ್ಯಮ ಪೋರ್ಟಲ್‌ಗಳು',
    aboutOfficialPortalsSubtitle: 'ಅಧಿಕೃತ ಉತ್ಸವ ದಿನಾಂಕಗಳು, ಸಫಾರಿ ಬುಕಿಂಗ್ ಮತ್ತು KSTDC ಪ್ಯಾಕೇಜ್‌ಗಳಿಗಾಗಿ.',

    footerAboutText: 'ನಮ್ಮ ಪ್ರಯಾಣ (NAMMA PRAYANA) — “ನಿಮ್ಮ ಪಯಣ, ನಿಮ್ಮ ಕಥೆ.” ಕರ್ನಾಟಕವನ್ನು ಅನ್ವೇಷಿಸಿ. ಸ್ಮಾರ್ಟ್ ಆಗಿ ಯೋಜಿಸಿ. ಸುಲಭವಾಗಿ ಪಯಣಿಸಿ.',
    footerMadeWithPride: 'ಕರ್ನಾಟಕದ ಪ್ರವಾಸಿಗರಿಗಾಗಿ ಹೆಮ್ಮೆಯಿಂದ ನಿರ್ಮಿಸಲಾಗಿದೆ.',
    footerQuickNavTitle: 'ಅನ್ವೇಷಣೆ & ಯೋಜನೆ',
    footerTravelAssistanceTitle: 'ಪ್ರವಾಸ ನೆರವು',
    footerOfficialTourismTitle: 'ಅಧಿಕೃತ ಪ್ರವಾಸೋದ್ಯಮ ತಾಣಗಳು',
    footerDisclaimerText: 'ಬುಕಿಂಗ್ & ಅಂದಾಜು ಹಕ್ಕುತ್ಯಾಗ: ನಮ್ಮ ಪ್ರಯಾಣವು ಅಧಿಕೃತ ಸಾರಿಗೆ ಮತ್ತು ಪ್ರವಾಸೋದ್ಯಮ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ ಮಾರ್ಗಗಳು ಮತ್ತು ಅಂದಾಜು ವೆಚ್ಚಗಳನ್ನು ಒದಗಿಸುತ್ತದೆ. ನೇರ ಬುಕಿಂಗ್ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳಲ್ಲೇ (MakeMyTrip, Goibibo, redBus, AbhiBus, KSRTC, IRCTC) ನಡೆಯುತ್ತದೆ.',
    footerCopyright: 'ನಮ್ಮ ಪ್ರಯಾಣ. ಸರ್ವ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    helplinesTitle: 'ಪ್ರವಾಸ ನೆರವು & ತುರ್ತು ಸಹಾಯವಾಣಿಗಳು',
    helplinesSubtitle: 'ಕರ್ನಾಟಕದ ಅಧಿಕೃತ ತುರ್ತು ಸಂಖ್ಯೆಗಳು & ಪ್ರವಾಸಿ ಬೆಂಬಲ',
    helplineEmergencyLabel: 'ತುರ್ತು & ಅಧಿಕೃತ ಸಹಾಯವಾಣಿಗಳು (ಕರ್ನಾಟಕ)',
    faqsTitle: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರವಾಸ ಪ್ರಶ್ನೆಗಳು',
    contactSupportTitle: 'ನಮ್ಮ ಪ್ರಯಾಣ ಬೆಂಬಲ ಸಂಪರ್ಕ',
    contactNamePlaceholder: 'ನಿಮ್ಮ ಹೆಸರು',
    contactEmailPlaceholder: 'ನಿಮ್ಮ ಇಮೇಲ್',
    contactMessagePlaceholder: 'ನಿಮ್ಮ ಕರ್ನಾಟಕ ಪ್ರವಾಸಕ್ಕೆ ನಾವು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
    contactSubmitBtn: 'ಸಂದೇಶ ಕಳುಹಿಸಿ',
    contactSuccessToast: 'ಧನ್ಯವಾದಗಳು! ನಿಮ್ಮ ಸಂದೇಶ ದಾಖಲಾಗಿದೆ. ನಮ್ಮ ತಂಡ ಶೀಘ್ರದಲ್ಲೇ ಸಂಪರ್ಕಿಸಲಿದೆ.',
  },
};
