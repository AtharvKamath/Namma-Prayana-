import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { TripItinerary, Destination } from '../types/travel';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  homeCity?: string;
  preferredLanguage?: 'en' | 'kn';
  travelInterests?: string[];
  photoURL?: string;
  emailOtpVerified?: boolean;
  mobileOtpVerified?: boolean;
  phoneVerified?: boolean;
  isFullyVerified?: boolean;
  authProvider?: 'password' | 'google' | 'github';
  createdAt?: string;
  updatedAt?: string;
}

export interface UserTripRecord {
  id: string;
  userId: string;
  title: string;
  startCity: string;
  durationDays: number;
  budgetTier: string;
  travelersCount: number;
  tripType?: string;
  destinations: string[];
  totalEstimatedCost?: number;
  days: any[];
  itineraryData?: TripItinerary;
  createdAt: string;
  updatedAt: string;
}

export interface UserFavoriteRecord {
  id: string;
  userId: string;
  destinationId: string;
  destinationName: string;
  category?: string;
  district?: string;
  imageUrl?: string;
  createdAt: string;
}

/**
 * Fetch private user profile from Firestore: users/{userId}
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn('[userTravelService] Error fetching user profile:', err);
    return null;
  }
}

/**
 * Create or overwrite private user profile document
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const userRef = doc(db, 'users', profile.uid);
  const now = new Date().toISOString();
  const cleanData: UserProfile = {
    uid: profile.uid,
    fullName: profile.fullName || 'Karnataka Traveler',
    email: profile.email,
    phoneNumber: profile.phoneNumber || '',
    dateOfBirth: profile.dateOfBirth || '',
    homeCity: profile.homeCity || '',
    preferredLanguage: profile.preferredLanguage || 'en',
    travelInterests: profile.travelInterests || [],
    photoURL: profile.photoURL || '',
    emailOtpVerified: profile.emailOtpVerified ?? false,
    mobileOtpVerified: profile.mobileOtpVerified ?? false,
    phoneVerified: profile.phoneVerified ?? false,
    isFullyVerified: profile.isFullyVerified ?? false,
    authProvider: profile.authProvider || 'password',
    createdAt: profile.createdAt || now,
    updatedAt: now,
  };
  await setDoc(userRef, cleanData, { merge: true });
}

/**
 * Update permitted profile fields
 */
export async function updateUserProfileDoc(userId: string, updates: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const payload = {
    ...updates,
    updatedAt: new Date().toISOString()
  };
  await updateDoc(userRef, payload as any);
}

/**
 * Fetch all saved trips for an authenticated user: users/{userId}/trips
 */
export async function fetchUserTrips(userId: string): Promise<TripItinerary[]> {
  try {
    const tripsCol = collection(db, 'users', userId, 'trips');
    const q = query(tripsCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const trips: TripItinerary[] = [];
    snapshot.forEach((d) => {
      const data = d.data() as UserTripRecord;
      if (data.itineraryData) {
        trips.push(data.itineraryData);
      } else {
        // Reconstruct TripItinerary structure
        trips.push({
          id: data.id,
          tripTitle: data.title,
          title: data.title,
          isAiGenerated: true,
          createdAt: data.createdAt,
          originCity: data.startCity,
          destinationPreferences: data.destinations || [],
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + (data.durationDays || 3) * 86400000).toISOString().split('T')[0],
          durationDays: data.durationDays,
          travellersCount: data.travelersCount || 2,
          budgetTier: (data.budgetTier as any) || 'comfort',
          budgetInr: data.totalEstimatedCost || 12000,
          transportMode: 'car',
          accommodationType: 'resort',
          interests: [],
          days: data.days || [],
          budgetBreakdown: {
            transportInr: 3000,
            accommodationInr: 5000,
            foodInr: 3000,
            activitiesAndEntryInr: 1000,
            localTransportInr: 0,
            contingencyInr: 0,
            totalEstimatedInr: data.totalEstimatedCost || 12000,
            perPersonInr: Math.round((data.totalEstimatedCost || 12000) / (data.travelersCount || 2)),
            userBudgetInr: data.totalEstimatedCost || 12000,
            budgetStatus: 'within_budget',
            assumptions: [],
            savingsTips: []
          },
          routeSummary: {
            totalDistanceKm: 350,
            recommendedHubs: data.destinations || [],
            routeFeasibilityNote: 'Custom saved itinerary'
          },
          usefulKannadaPhrases: [],
          warningsAndAdvisories: []
        });
      }
    });

    return trips;
  } catch (err) {
    console.warn('[userTravelService] Error fetching user trips from Firestore:', err);
    return [];
  }
}

/**
 * Save trip itinerary to Firestore: users/{userId}/trips/{tripId}
 */
export async function saveUserTripToFirestore(userId: string, trip: TripItinerary): Promise<void> {
  const tripId = trip.id || `trip-${Date.now()}`;
  const tripRef = doc(db, 'users', userId, 'trips', tripId);
  const now = new Date().toISOString();

  const record: UserTripRecord = {
    id: tripId,
    userId,
    title: trip.tripTitle || trip.title || 'Karnataka Itinerary',
    startCity: trip.originCity || 'Bengaluru',
    durationDays: trip.durationDays || (trip.days?.length || 3),
    budgetTier: trip.budgetTier || 'comfort',
    travelersCount: trip.travellersCount || 2,
    destinations: trip.destinationPreferences || [],
    totalEstimatedCost: trip.budgetBreakdown?.totalEstimatedInr || trip.budgetInr || 10000,
    days: trip.days || [],
    itineraryData: { ...trip, id: tripId },
    createdAt: trip.createdAt || now,
    updatedAt: now,
  };

  await setDoc(tripRef, record);
}

/**
 * Delete trip itinerary from Firestore
 */
export async function deleteUserTripFromFirestore(userId: string, tripId: string): Promise<void> {
  const tripRef = doc(db, 'users', userId, 'trips', tripId);
  await deleteDoc(tripRef);
}

/**
 * Fetch favorite destination IDs for authenticated user: users/{userId}/favorites
 */
export async function fetchUserFavorites(userId: string): Promise<UserFavoriteRecord[]> {
  try {
    const favsCol = collection(db, 'users', userId, 'favorites');
    const snapshot = await getDocs(favsCol);
    const favs: UserFavoriteRecord[] = [];
    snapshot.forEach(d => {
      favs.push(d.data() as UserFavoriteRecord);
    });
    return favs;
  } catch (err) {
    console.warn('[userTravelService] Error fetching user favorites from Firestore:', err);
    return [];
  }
}

/**
 * Add destination to user favorites in Firestore
 */
export async function addFavoriteToFirestore(userId: string, destination: Destination): Promise<void> {
  const favId = destination.id;
  const favRef = doc(db, 'users', userId, 'favorites', favId);
  const record: UserFavoriteRecord = {
    id: favId,
    userId,
    destinationId: destination.id,
    destinationName: destination.name,
    category: destination.category,
    district: destination.district,
    imageUrl: destination.imageUrl,
    createdAt: new Date().toISOString()
  };
  await setDoc(favRef, record);
}

/**
 * Remove destination from user favorites in Firestore
 */
export async function removeFavoriteFromFirestore(userId: string, destinationId: string): Promise<void> {
  const favRef = doc(db, 'users', userId, 'favorites', destinationId);
  await deleteDoc(favRef);
}
