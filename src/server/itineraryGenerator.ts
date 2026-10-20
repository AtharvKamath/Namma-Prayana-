import { GoogleGenAI } from '@google/genai';
import type { TripPlannerInput, TripItinerary } from '../types/travel.ts';
import { generateCuratedFallbackItinerary } from '../data/fallbackItineraries.ts';
import { KARNATAKA_DESTINATIONS } from '../data/destinations.ts';

/**
 * Validates that an object conforms to the core TripItinerary schema.
 */
function isValidItineraryData(data: any): data is TripItinerary {
  if (!data || typeof data !== 'object') return false;
  if (typeof data.tripTitle !== 'string' || !data.tripTitle.trim()) return false;
  if (!Array.isArray(data.days) || data.days.length === 0) return false;
  if (!data.budgetBreakdown || typeof data.budgetBreakdown !== 'object') return false;
  if (!data.routeSummary || typeof data.routeSummary !== 'object') return false;

  // Validate at least the first day has essential activity arrays
  const firstDay = data.days[0];
  if (!firstDay || typeof firstDay.dayNumber !== 'number') return false;
  if (!Array.isArray(firstDay.morning) || !Array.isArray(firstDay.afternoon) || !Array.isArray(firstDay.evening)) {
    return false;
  }

  return true;
}

/**
 * Normalizes and sanitizes a valid itinerary returned by Gemini.
 */
function normalizeItinerary(parsed: any, input: TripPlannerInput): TripItinerary {
  parsed.id = parsed.id || `plan-ai-${Date.now()}`;
  parsed.createdAt = parsed.createdAt || new Date().toISOString();
  parsed.isAiGenerated = true;
  parsed.tripTitle = parsed.tripTitle || parsed.title || 'Karnataka Discovery Journey';
  parsed.title = parsed.tripTitle;

  // Ensure origin and duration match input
  parsed.originCity = input.originCity || parsed.originCity || 'Bengaluru';
  parsed.durationDays = input.durationDays || parsed.days.length;
  parsed.travellersCount = input.travellersCount || parsed.travellersCount || 1;
  parsed.budgetTier = input.budgetTier || parsed.budgetTier || 'comfort';
  parsed.budgetInr = input.budgetInr || parsed.budgetInr || 20000;
  parsed.transportMode = input.transportMode || parsed.transportMode || 'car';
  parsed.accommodationType = input.accommodationPreference || parsed.accommodationType || 'homestay';

  // Ensure days array has all slots
  parsed.days = (parsed.days || []).map((day: any, idx: number) => {
    let dayDate = day.date;
    if (!dayDate && input?.startDate) {
      const parsedTime = new Date(input.startDate).getTime();
      dayDate = !isNaN(parsedTime)
        ? new Date(parsedTime + idx * 86400000).toISOString().split('T')[0]
        : `Day ${idx + 1}`;
    }
    return {
      dayNumber: day.dayNumber || idx + 1,
      date: dayDate || `Day ${idx + 1}`,
    title: day.title || `Day ${idx + 1}`,
    destinationName: day.destinationName || 'Karnataka Destination',
    district: day.district || 'Karnataka',
    morning: Array.isArray(day.morning) ? day.morning : [],
    afternoon: Array.isArray(day.afternoon) ? day.afternoon : [],
    evening: Array.isArray(day.evening) ? day.evening : [],
    stayRecommendation: day.stayRecommendation || {
      type: 'Verified Stay',
      suggestedArea: day.destinationName || 'Central Hub',
      estimatedCostInr: Math.round(parsed.budgetInr / parsed.durationDays * 0.4),
    },
    dailyTravelDistanceKm: typeof day.dailyTravelDistanceKm === 'number' ? day.dailyTravelDistanceKm : 60,
    dailyNotes: day.dailyNotes || '',
  };
});

  // Ensure budget breakdown estimate disclaimer
  const assumptions = Array.isArray(parsed.budgetBreakdown?.assumptions) ? parsed.budgetBreakdown.assumptions : [];
  const estimateDisclaimer = input.language === 'kn'
    ? 'ಎಲ್ಲಾ ದರಗಳು ಮತ್ತು ವೆಚ್ಚಗಳು ಸರಾಸರಿ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಮಾನದಂಡಗಳ ಅಂದಾಜುಗಳು. ಋತುಮಾನ ಮತ್ತು ಬುಕಿಂಗ್ ಸಮಯಕ್ಕೆ ತಕ್ಕಂತೆ ನೈಜ ದರಗಳು ಬದಲಾಗಬಹುದು.'
    : 'All prices and costs are estimates based on average Karnataka travel benchmarks. Actual tariffs vary by season, provider, and booking timing.';

  if (!assumptions.some((a: string) => a.includes('estimate') || a.includes('ಅಂದಾಜು'))) {
    assumptions.push(estimateDisclaimer);
  }

  const userBudgetInr = Math.max(Math.round(Number(input.budgetInr || parsed.budgetInr) || 20000), 1000);
  const travellers = Math.max(Math.round(Number(input.travellersCount || parsed.travellersCount) || 1), 1);

  const transportInr = Math.round(Number(parsed.budgetBreakdown?.transportInr) || Math.round(userBudgetInr * 0.25));
  const accommodationInr = Math.round(Number(parsed.budgetBreakdown?.accommodationInr) || Math.round(userBudgetInr * 0.35));
  const foodInr = Math.round(Number(parsed.budgetBreakdown?.foodInr) || Math.round(userBudgetInr * 0.20));
  const activitiesAndEntryInr = Math.round(Number(parsed.budgetBreakdown?.activitiesAndEntryInr) || Math.round(userBudgetInr * 0.10));
  const localTransportInr = Math.round(Number(parsed.budgetBreakdown?.localTransportInr) || Math.round(userBudgetInr * 0.05));
  const contingencyInr = Math.round(Number(parsed.budgetBreakdown?.contingencyInr) || Math.round(userBudgetInr * 0.05));

  const itemizedSum = transportInr + accommodationInr + foodInr + activitiesAndEntryInr + localTransportInr + contingencyInr;
  const rawTotal = Number(parsed.budgetBreakdown?.totalEstimatedInr);
  const totalEstimatedInr = (!isNaN(rawTotal) && rawTotal > 0 && Math.abs(rawTotal - itemizedSum) <= 250)
    ? Math.round(rawTotal)
    : itemizedSum;

  const perPersonInr = Math.round(totalEstimatedInr / travellers);

  // STRICT budget comparison:
  // ONLY set exceed status if totalEstimatedInr > userBudgetInr (strictly greater)
  let budgetStatus: 'within_budget' | 'moderate_exceed' | 'significant_exceed' = 'within_budget';
  if (totalEstimatedInr > userBudgetInr * 1.25) {
    budgetStatus = 'significant_exceed';
  } else if (totalEstimatedInr > userBudgetInr) {
    budgetStatus = 'moderate_exceed';
  } else {
    budgetStatus = 'within_budget';
  }

  parsed.budgetBreakdown = {
    transportInr,
    accommodationInr,
    foodInr,
    activitiesAndEntryInr,
    localTransportInr,
    contingencyInr,
    totalEstimatedInr,
    totalEstimatedBudgetInr: totalEstimatedInr,
    perPersonInr,
    userBudgetInr,
    budgetStatus,
    assumptions,
    savingsTips: Array.isArray(parsed.budgetBreakdown?.savingsTips) ? parsed.budgetBreakdown.savingsTips : [],
  };

  // Ensure routeSummary distance is consistent with sum of daily distances
  const sumDailyDistance = parsed.days.reduce((acc: number, d: any) => acc + (Math.round(Number(d.dailyTravelDistanceKm)) || 0), 0);
  const reportedRouteDist = Math.round(Number(parsed.routeSummary?.totalDistanceKm) || 0);
  const totalDistanceKm = reportedRouteDist > 0 && Math.abs(reportedRouteDist - sumDailyDistance) <= Math.max(60, sumDailyDistance * 0.2)
    ? reportedRouteDist
    : (sumDailyDistance > 0 ? sumDailyDistance : (parsed.days.length * 80));

  parsed.routeSummary = {
    totalDistanceKm,
    recommendedHubs: Array.isArray(parsed.routeSummary?.recommendedHubs) && parsed.routeSummary.recommendedHubs.length > 0
      ? parsed.routeSummary.recommendedHubs
      : Array.from(new Set(parsed.days.map((d: any) => d.destinationName || d.district))),
    routeFeasibilityNote: parsed.routeSummary?.routeFeasibilityNote || (
      input.language === 'kn'
        ? `ಒಟ್ಟು ರಸ್ತೆ ಪ್ರಯಾಣ ದೂರ ಅಂದಾಜು ${totalDistanceKm} ಕಿ.ಮೀ. ದಿನಕ್ಕೆ ಸರಾಸರಿ 2-3 ಗಂಟೆಗಳ ಆರಾಮದಾಯಕ ಚಾಲನೆ.`
        : `Total driving route covers approximately ${totalDistanceKm} km across ${parsed.durationDays} days.`
    ),
  };

  parsed.usefulKannadaPhrases = Array.isArray(parsed.usefulKannadaPhrases) && parsed.usefulKannadaPhrases.length > 0
    ? parsed.usefulKannadaPhrases
    : [
        {
          kannada: 'ನಮಸ್ಕಾರ, ಈ ದಾರಿ ದೇವಸ್ಥಾನಕ್ಕೆ ಹೋಗುತ್ತದೆಯೇ?',
          transliteration: 'Namaskāra, ī dāri dēvasthānakke hōguttadeyē?',
          english: 'Hello, does this road lead to the temple?',
          context: 'Confirming routes with locals along the circuit.'
        },
        {
          kannada: 'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ',
          transliteration: 'Ondu masāle dōse mattu bisi philṭar kāphi koḍi',
          english: 'Please give one masala dosa and hot filter coffee',
          context: 'Essential morning order at Karnataka breakfast joints.'
        }
      ];

  parsed.warningsAndAdvisories = Array.isArray(parsed.warningsAndAdvisories) ? parsed.warningsAndAdvisories : [];
  parsed.alternativeDestinations = Array.isArray(parsed.alternativeDestinations) ? parsed.alternativeDestinations : [];

  return parsed as TripItinerary;
}

export async function generateItineraryBackend(input: TripPlannerInput): Promise<TripItinerary> {
  const safeInput = input || ({} as TripPlannerInput);
  const isEnabled = String(process.env.ENABLE_GEMINI_AI || '').toLowerCase().trim() === 'true';
  const apiKey = process.env.GEMINI_API_KEY;
  const isKn = safeInput.language === 'kn';

  // REQUIREMENT 1 & 2: Disabled by default. Return verified curated generator without external AI calls.
  if (!isEnabled) {
    return generateCuratedFallbackItinerary(safeInput);
  }

  // REQUIREMENT 5: Check credentials. If missing or placeholder, gracefully fall back.
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || !apiKey.trim()) {
    console.warn('[Gemini AI] ENABLE_GEMINI_AI is true, but GEMINI_API_KEY is not configured or placeholder. Falling back to curated generator.');
    return generateCuratedFallbackItinerary(safeInput);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Prioritize user selected destinations and top matching destinations to keep prompt compact and fast
    const requestedLower = (safeInput.destinationPreferences || []).map(p => (p || '').toLowerCase().trim());
    const matchedDests = KARNATAKA_DESTINATIONS.filter(d => 
      requestedLower.some(r => r && (d.name.toLowerCase().includes(r) || d.kannadaName.includes(r) || d.district.toLowerCase().includes(r)))
    );
    const topDests = matchedDests.length > 0 ? matchedDests : KARNATAKA_DESTINATIONS.slice(0, 8);
    const destinationNamesList = topDests.map(d => `${d.name} (${d.kannadaName}, ${d.district})`).join(', ');

    const languageInstruction = isKn 
      ? `IMPORTANT LANGUAGE REQUIREMENT: The user's active language is KANNADA (ಕನ್ನಡ).
You MUST generate all descriptive text (tripTitle, day titles, activity titles, activity descriptions, travelTips, stayRecommendation.type, dailyNotes, warningsAndAdvisories, assumptions, savingsTips, routeFeasibilityNote) in natural, grammatically correct Kannada (ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿ ಬರೆಯಿರಿ). Destination names can be in Kannada with English in brackets (e.g., ಹಂಪಿ (Hampi), ಮೈಸೂರು ಅರಮನೆ (Mysuru Palace)).`
      : `The user's active language is ENGLISH. Generate all descriptive text in fluent English.`;

    const prompt = `
Generate a realistic, highly personalized travel itinerary for a journey in Karnataka, India, matching the user's specific constraints:

User Inputs:
- Language: ${isKn ? 'Kannada (ಕನ್ನಡ)' : 'English'}
- Origin City: ${safeInput.originCity || (isKn ? 'ಬೆಂಗಳೂರು' : 'Bengaluru')}
- Destination Preferences: ${(safeInput.destinationPreferences || []).join(', ') || 'Best of Karnataka'}
- Trip Duration: ${safeInput.durationDays || 3} days (Start: ${safeInput.startDate || 'flexible'}, End: ${safeInput.endDate || 'flexible'})
- Travellers: ${safeInput.travellersCount || 2} people
- Total Budget: ₹${safeInput.budgetInr || 15000} INR (${safeInput.budgetTier || 'comfort'} tier)
- Interests: ${(safeInput.interests || []).join(', ') || 'Culture, Nature, Food, Heritage'}
- Travel Style: ${safeInput.travelStyle || 'Balanced'}
- Transport Mode: ${safeInput.transportMode || 'car'}
- Accommodation Preference: ${safeInput.accommodationPreference || 'comfort_hotel'}

Verified Karnataka Destinations Available for Reference:
${destinationNamesList}

Strict Realism & Accuracy Rules:
1. ${languageInstruction}
2. ABSOLUTE KARNATAKA GEOGRAPHIC BOUNDARY: You MUST ONLY include destinations, attractions, and cities located within the state of KARNATAKA, INDIA. NEVER include places outside Karnataka such as Taj Mahal, Agra, Goa, Kerala, Tamil Nadu, Maharashtra, or Delhi under any circumstances.
3. Do not invent non-existent tourist attractions, fake historical monuments, or unverified live hotel tariffs/fares. Clearly frame all budget numbers as realistic Karnataka travel estimates.
4. ROUTE GEOGRAPHY, SENSIBLE DAY ORDERING & VERIFIED HIGHWAYS:
   - Sensible Journey Flow: The journey order must follow realistic travel logic. For a trip starting from an origin city (e.g. Bengaluru to Mysuru):
     - Day 1 begins from the origin (e.g. Bengaluru), travels forward along the verified highway corridor (e.g. NH 275 Bengaluru-Mysuru Expressway ~140-145 km, passing Ramanagara / Channapatna / Maddur / Mandya / Srirangapatna), visits introductory or en-route sights, and stays overnight at the destination (e.g. Mysuru).
     - Intermediate days explore attractions within the destination and its immediate cluster without backtracking.
     - Final day completes remaining local attractions and undertakes the return journey back to origin city (e.g. Mysuru to Bengaluru ~145 km). On a round-trip returning to origin, Day 2 evening returns to Bengaluru, and the last day's stay recommendation indicates return to origin (stay cost: 0).
     - Do not invert or scramble days (e.g. do not schedule departure from origin on the last day or return to origin on Day 1). If the user requested a one-way trip or different origin/destination, maintain a coherent forward travel route.
5. INTERNALLY CONSISTENT DISTANCES (DO NOT INVENT DISTANCES):
   - Bengaluru to Mysuru: ~140-145 km via Expressway (NH 275).
   - Bengaluru to Hampi: ~340-350 km via NH 48 / NH 50.
   - Bengaluru to Coorg (Madikeri): ~250 km via NH 275.
   - Mysuru to Coorg: ~120 km.
   - Gokarna to Udupi: ~180 km via NH 66.
   - Ensure dailyTravelDistanceKm on each day reflects actual distance traveled that day (including highway and local sightseeing).
   - Ensure routeSummary.totalDistanceKm matches the sum of dailyTravelDistanceKm across all days (within ±10%).
   - Ensure every activity's locationName and district are geographically situated in that day's destination.
6. STRICT BUDGET CALCULATION & STATUS RULES:
   - Calculate realistic integer INR estimates for transportInr, accommodationInr, foodInr, activitiesAndEntryInr, localTransportInr, and contingencyInr.
   - Set totalEstimatedInr to the EXACT sum of these categories.
   - Compare totalEstimatedInr with userBudgetInr:
     - If totalEstimatedInr <= userBudgetInr, set budgetStatus to 'within_budget'.
     - If totalEstimatedInr > userBudgetInr, set budgetStatus to 'moderate_exceed' (or 'significant_exceed' if > 25% over).
     - Never report budgetStatus as 'moderate_exceed' or 'significant_exceed' if totalEstimatedInr is less than or equal to userBudgetInr.
7. Provide specific morning, afternoon, and evening recommendations each day.
8. Include authentic and contextually useful Kannada travel phrases with Kannada script, English transliteration, and English translation.
9. Include realistic travel advisories/warnings (ghat roads, dress codes, seasonal notes, wildlife permits).

Output Schema (Must be strict valid JSON):
{
  "tripTitle": "string",
  "originCity": "${safeInput.originCity || (isKn ? 'ಬೆಂಗಳೂರು' : 'Bengaluru')}",
  "destinationPreferences": ${JSON.stringify(safeInput.destinationPreferences || [])},
  "startDate": "${safeInput.startDate || ''}",
  "endDate": "${safeInput.endDate || ''}",
  "durationDays": ${safeInput.durationDays || 3},
  "travellersCount": ${safeInput.travellersCount || 1},
  "budgetTier": "${safeInput.budgetTier || 'comfort'}",
  "budgetInr": ${safeInput.budgetInr || 20000},
  "transportMode": "${safeInput.transportMode || 'car'}",
  "accommodationType": "${safeInput.accommodationPreference || 'homestay'}",
  "interests": ${JSON.stringify(safeInput.interests || [])},
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "title": "Day 1: Title",
      "destinationName": "Destination name",
      "district": "District name",
      "morning": [
        {
          "id": "act-1-1",
          "timeSlot": "morning",
          "title": "Activity name",
          "description": "Details",
          "locationName": "Location",
          "durationHours": 3,
          "estimatedCostInr": 200,
          "travelTips": "Tips"
        }
      ],
      "afternoon": [...],
      "evening": [...],
      "stayRecommendation": {
        "type": "Hotel / Homestay type",
        "suggestedArea": "Area name",
        "estimatedCostInr": 2500
      },
      "dailyTravelDistanceKm": 80,
      "dailyNotes": "Notes"
    }
  ],
  "budgetBreakdown": {
    "transportInr": 4500,
    "accommodationInr": 6000,
    "foodInr": 4000,
    "activitiesAndEntryInr": 1500,
    "localTransportInr": 1000,
    "contingencyInr": 1700,
    "totalEstimatedInr": 18700,
    "perPersonInr": 9350,
    "userBudgetInr": ${safeInput.budgetInr || 20000},
    "budgetStatus": "within_budget",
    "assumptions": ["string"],
    "savingsTips": ["string"]
  },
  "routeSummary": {
    "totalDistanceKm": 450,
    "recommendedHubs": ["Mysuru", "Coorg"],
    "routeFeasibilityNote": "string"
  },
  "usefulKannadaPhrases": [
    {
      "kannada": "ಕನ್ನಡ ವಾಕ್ಯ",
      "transliteration": "Kannada vaakya",
      "english": "English meaning",
      "context": "When to use"
    }
  ],
  "warningsAndAdvisories": ["string"],
  "alternativeDestinations": [
    {
      "name": "string",
      "district": "string",
      "whyRecommend": "string"
    }
  ]
}
`;

    // Candidate models in preference order (fast gemini-3.1-flash-lite first, then standard flash)
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    const timeoutMs = 18000;
    let response: any = null;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      let timeoutId: NodeJS.Timeout | undefined;
      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error(`Gemini API call timed out after ${timeoutMs}ms for ${modelName}`)), timeoutMs);
        });

        const apiCall = ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: isKn
              ? 'ನೀವು ನಮ್ಮ ಪ್ರಯಾಣ (Namma Prayana) ಸಂಸ್ಥೆಯ ಕರ್ನಾಟಕ ಪ್ರವಾಸ ತಜ್ಞರು. ಎಲ್ಲಾ ವಿವರಣೆಗಳನ್ನು ನೈಸರ್ಗಿಕ, ಶುದ್ಧ ಕನ್ನಡದಲ್ಲಿಯೇ ಬರೆಯಿರಿ. ಕೇವಲ ಮಾನ್ಯತೆ ಪಡೆದ JSON ಮಾತ್ರ ಹಿಂತಿರುಗಿಸಿ. ಎಲ್ಲಾ ಬಜೆಟ್ ಅಂಕಿ-ಅಂಶಗಳನ್ನು ಅಂದಾಜು ಎಂದು ಪರಿಗಣಿಸಿ.'
              : 'You are Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ), the premier AI travel planning engine for Karnataka, India. Return only valid, well-structured JSON adhering to real Karnataka geography, routes, and cultural etiquette. Treat all costs as estimates.',
          },
        });

        apiCall.catch(() => {});

        const attemptRes = await Promise.race([apiCall, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);
        if (attemptRes && attemptRes.text && attemptRes.text.trim()) {
          response = attemptRes;
          break;
        }
      } catch (err: any) {
        if (timeoutId) clearTimeout(timeoutId);
        lastError = err;
        console.warn(`[Gemini AI] Attempt with ${modelName} failed, trying next candidate:`, err?.message || 'Unknown error');
      }
    }

    if (!response || !response.text || !response.text.trim()) {
      throw lastError || new Error('Empty response received from Gemini API');
    }

    const rawText = response.text.trim();

    let parsed: any;
    try {
      parsed = JSON.parse(rawText);
    } catch (parseError: any) {
      throw new Error(`Invalid JSON format from Gemini API: ${parseError?.message}`);
    }

    // REQUIREMENT 5: Schema validation
    if (!isValidItineraryData(parsed)) {
      throw new Error('Gemini response did not conform to required TripItinerary schema');
    }

    // REQUIREMENT 5 & 8: Geographic validation filter
    const nonKarnatakaKeywords = ['taj mahal', 'agra', 'qutub minar', 'gateway of india', 'goa', 'munnar', 'ooty', 'jaipur', 'chennai', 'hyderabad', 'delhi', 'kerala', 'tamil nadu'];
    const itineraryStr = JSON.stringify(parsed).toLowerCase();
    const hasInvalidPlace = nonKarnatakaKeywords.some(keyword => itineraryStr.includes(keyword));
    if (hasInvalidPlace) {
      console.warn('[Gemini AI] Detected non-Karnataka locations in response. Falling back to verified Karnataka dataset.');
      return generateCuratedFallbackItinerary(safeInput);
    }

    return normalizeItinerary(parsed, safeInput);
  } catch (err: any) {
    // REQUIREMENT 5: On any failure (credentials, timeout, rate limit, schema violation), log safely and return fallback
    console.error('[Gemini AI] Error during itinerary generation, safely falling back to curated generator:', err?.message || 'Unknown error');
    const fallback = generateCuratedFallbackItinerary(safeInput);
    return fallback;
  }
}

