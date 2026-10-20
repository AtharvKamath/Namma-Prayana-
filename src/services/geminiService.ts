import { TripPlannerInput, TripItinerary } from '../types/travel';
import { generateCuratedFallbackItinerary } from '../data/fallbackItineraries';

export async function requestTripItinerary(input: TripPlannerInput): Promise<TripItinerary> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s client-side timeout

    const response = await fetch('/api/itinerary/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${response.status}`);
    }

    const data: TripItinerary = await response.json();
    return data;
  } catch (err: any) {
    console.warn('[TripPlanner] Backend route unavailable or timed out; generating curated verified itinerary fallback:', err?.message || err);
    // Graceful offline fallback
    const fallback = generateCuratedFallbackItinerary(input);
    return fallback;
  }
}
