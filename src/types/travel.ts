export type TravelCategory = 
  | 'all'
  | 'heritage'
  | 'beach'
  | 'hills'
  | 'wildlife'
  | 'waterfalls'
  | 'temples'
  | 'culture'
  | 'nature'
  | 'adventure';

export type BudgetTier = 'budget' | 'comfort' | 'premium';

export type TransportMode = 'car' | 'bus' | 'train' | 'cab';

export type StayType = 'homestay' | 'resort' | 'budget_hotel' | 'luxury_hotel';

export interface Destination {
  id: string;
  name: string;
  kannadaName: string;
  district: string;
  state: 'Karnataka';
  googlePlaceId?: string;
  region: 'Coastal' | 'Malenadu / Western Ghats' | 'North Karnataka' | 'South Karnataka' | 'Central';
  tagline: string;
  taglineKn?: string;
  description: string;
  descriptionKn?: string;
  category: 'heritage' | 'beach' | 'hills' | 'wildlife' | 'waterfalls' | 'temples' | 'culture' | 'nature' | 'adventure';
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  imageAttribution?: string;
  imageAltEn: string;
  imageAltKn: string;
  gallery: string[];
  bestTimeToVisit: string;
  bestTimeToVisitKn?: string;
  lat: number;
  lng: number;
  address: string;
  addressKn?: string;
  openingHours: string;
  openingHoursKn?: string;
  entryFee: string;
  entryFeeKn?: string;
  entryFeeInr: number;
  historicalBackground: string;
  historicalBackgroundKn?: string;
  mainAttractions: string[];
  mainAttractionsKn?: string[];
  recommendedActivities: string[];
  recommendedActivitiesKn?: string[];
  suggestedDurationHours: number;
  accessibilityNotes: string;
  accessibilityNotesKn?: string;
  officialSource: string;
  officialSourceUrl: string;
  lastVerifiedDate: string;
  nearestRailwayStation: string;
  nearestRailwayStationKn?: string;
  nearestAirport: string;
  nearestAirportKn?: string;
  approxDistanceKmFromBengaluru: number;
}

export interface ActivityItem {
  id: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  title: string;
  kannadaTitle?: string;
  description: string;
  locationName: string;
  durationHours: number;
  estimatedCostInr: number;
  travelTips?: string;
  verifiedAttractionId?: string;
}

export interface DayPlan {
  dayNumber: number;
  date?: string;
  title: string;
  destinationName: string;
  district: string;
  morning: ActivityItem[];
  afternoon: ActivityItem[];
  evening: ActivityItem[];
  stayRecommendation: {
    type: string;
    suggestedArea: string;
    estimatedCostInr: number;
  };
  dailyTravelDistanceKm: number;
  dailyNotes?: string;
}

export interface ItineraryBudgetBreakdown {
  transportInr: number;
  accommodationInr: number;
  foodInr: number;
  activitiesAndEntryInr: number;
  localTransportInr: number;
  contingencyInr: number;
  totalEstimatedInr: number;
  totalEstimatedBudgetInr?: number;
  perPersonInr: number;
  userBudgetInr: number;
  budgetStatus: 'within_budget' | 'moderate_exceed' | 'significant_exceed';
  assumptions: string[];
  savingsTips: string[];
}

export interface TripItinerary {
  id: string;
  tripTitle: string;
  title?: string;
  createdAt: string;
  originCity: string;
  destinationPreferences: string[];
  startDate: string;
  endDate: string;
  durationDays: number;
  travellersCount: number;
  budgetTier: BudgetTier;
  budgetInr: number;
  transportMode: TransportMode;
  accommodationType: StayType;
  interests: string[];
  days: DayPlan[];
  budgetBreakdown: ItineraryBudgetBreakdown;
  routeSummary: {
    totalDistanceKm: number;
    recommendedHubs: string[];
    routeFeasibilityNote: string;
  };
  usefulKannadaPhrases: Array<{
    kannada: string;
    transliteration: string;
    english: string;
    context: string;
  }>;
  warningsAndAdvisories: string[];
  alternativeDestinations?: Array<{
    name: string;
    district: string;
    whyRecommend: string;
  }>;
  isAiGenerated: boolean;
}

export interface TripPlannerInput {
  originCity: string;
  destinationPreferences: string[];
  startDate: string;
  endDate: string;
  durationDays: number;
  travellersCount: number;
  budgetInr: number;
  budgetTier: BudgetTier;
  interests: string[];
  travelStyle: string;
  accommodationPreference: StayType;
  transportMode: TransportMode;
  language?: 'en' | 'kn';
}

export interface KannadaPhrase {
  id: string;
  category: 'greetings' | 'directions' | 'transport' | 'hotels' | 'food' | 'shopping' | 'emergency';
  categoryLabel: string;
  kannada: string;
  transliteration: string;
  english: string;
  audioPronunciationText?: string;
  contextUsage: string;
}
