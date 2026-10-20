import { GoogleGenAI } from '@google/genai';

export interface AssistantChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantChatRequest {
  message: string;
  language?: 'en' | 'kn';
  history?: AssistantChatMessage[];
}

export interface SuggestedAction {
  label: string;
  view: string;
}

export interface AssistantChatResponse {
  reply: string;
  suggestedActions?: SuggestedAction[];
  isAiGenerated: boolean;
  status: 'ai_active' | 'curated_guide' | 'fallback';
}

/**
 * Returns safe status of assistant feature flag and API key availability.
 * Never exposes secret values.
 */
export function getAssistantStatus() {
  const isExplicitlyDisabled = String(process.env.ENABLE_GEMINI_ASSISTANT || '').toLowerCase().trim() === 'false';
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY.trim());
  const isEnabled = !isExplicitlyDisabled && hasKey;

  return {
    assistantEnabled: isEnabled,
    hasKeyConfigured: hasKey,
    mode: isEnabled ? 'gemini-assistant' : 'curated-guide',
  };
}

/**
 * High-quality curated responses for website navigation & Karnataka travel guidance.
 * Used when GEMINI_API_KEY is not available, or as an offline fallback during network/API failures.
 */
function getCuratedGuideResponse(userMessage: string, language: 'en' | 'kn' = 'en'): { reply: string; suggestedActions?: SuggestedAction[] } {
  const isKn = language === 'kn';
  const q = (userMessage || '').toLowerCase();

  // 1. Support, contact, help, feedback
  if (q.includes('contact') || q.includes('support') || q.includes('help') || q.includes('reach') || q.includes('feedback') || q.includes('email') || q.includes('issue') || q.includes('ಸಂಪರ್ಕ') || q.includes('ಸಹಾಯ') || q.includes('ದೂರು')) {
    if (isKn) {
      return {
        reply: `ನಮ್ಮ ಪ್ರಯಾಣ ಬೆಂಬಲ ತಂಡವನ್ನು ಸಂಪರ್ಕಿಸಲು ವೆಬ್‌ಸೈಟ್‌ನ ಕೆಳಭಾಗದಲ್ಲಿರುವ (Footer) 'Contact Support' (ಬೆಂಬಲ ಸಂಪರ್ಕ) ಬಟನ್ ಅನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.\n\n1. ನಿಮ್ಮ ಹೆಸರು, ಇಮೇಲ್ ವಿಳಾಸ ಮತ್ತು ಪ್ರಶ್ನೆ ಅಥವಾ ಸಂದೇಶವನ್ನು ನಮೂದಿಸಿ 'ಸಂದೇಶ ಕಳುಹಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿ.\n2. ನಮ್ಮ ತಂಡವು ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ ತ್ವರಿತವಾಗಿ ಉತ್ತರಿಸುತ್ತದೆ.\n3. ತುರ್ತು ನೆರವು ಹಾಗೂ ಜಿಲ್ಲಾ ಪ್ರವಾಸೋದ್ಯಮ ಸಹಾಯವಾಣಿಗಳಿಗಾಗಿ ಮೇಲಿನ ಮೆನುವಿನಲ್ಲಿರುವ 'ಸಹಾಯ' (Help & Helplines) ಆಯ್ಕೆಯನ್ನು ಬಳಸಬಹುದು.`,
        suggestedActions: [
          { label: 'ಸಹಾಯ ಮತ್ತು ಸಂಪರ್ಕ', view: 'contact' },
          { label: 'ತುರ್ತು ಸಹಾಯವಾಣಿ', view: 'help' }
        ]
      };
    }
    return {
      reply: `You can contact Namma Prayana support directly through our website by clicking the 'Contact Support' button located in the footer at the bottom of any page.\n\n1. Fill in your name, email address, and inquiry in the in-app support form and click Send.\n2. Our dedicated support team will review your inquiry and get back to you promptly.\n3. For state tourism helplines (1363) or emergency contacts (112 / 108), click 'Emergency & Helplines' in the top navigation bar.`,
      suggestedActions: [
        { label: 'Contact Support', view: 'contact' },
        { label: 'Emergency Helplines', view: 'help' }
      ]
    };
  }

  // 2. Waterfalls in Karnataka
  if (q.includes('waterfall') || q.includes('water falls') || q.includes('falls') || q.includes('ಜಲಪಾತ')) {
    if (isKn) {
      return {
        reply: `ಕರ್ನಾಟಕದ ಪ್ರಸಿದ್ಧ ಮತ್ತು ರಮಣೀಯ ಜಲಪಾತಗಳು:\n\n• ಜೋಗ ಜಲಪಾತ (ಶಿವಮೊಗ್ಗ): ಭಾರತದ 2ನೇ ಅತಿ ಎತ್ತರದ ಜಲಪಾತ (ಶರಾವತಿ ನದಿ, ರಾಜ, ರೋರರ್, ರಾಕೆಟ್, ರಾಣಿ ಧಾರೆಗಳು).\n• ಅಬ್ಬಿ ಜಲಪಾತ (ಮಡಿಕೇರಿ, ಕೊಡಗು): ಕಾಫಿ ಮತ್ತು ಸಾಂಬಾರ ತೋಟಗಳ ಮಧ್ಯೆ ಧುಮ್ಮಿಕ್ಕುವ ಸುಂದರ ಜಲಧಾರ.\n• ಶಿವನಸಮುದ್ರ ಜಲಪಾತ (ಮಂಡ್ಯ): ಕಾವೇರಿ ನದಿಯ ಗಗನಚುಕ್ಕಿ ಮತ್ತು ಭರಚುಕ್ಕಿ ಪ್ರಸಿದ್ಧ ಜಂಟಿ ಜಲಪಾತಗಳು.\n• ಹೆಬ್ಬೆ ಮತ್ತು ಕಲ್ಹತ್ತಿ ಜಲಪಾತಗಳು (ಕೆಮ್ಮಣ್ಣುಗುಂಡಿ, ಚಿಕ್ಕಮಗಳೂರು): ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಚಾರಣ ತಾಣ.\n• ಸಾತೋಡಿ ಮತ್ತು ಮಾಗೋಡು ಜಲಪಾತಗಳು (ಯಲ್ಲಾಪುರ, ಉತ್ತರ ಕನ್ನಡ): ನಿತ್ಯಹರಿದ್ವರ್ಣ ಅರಣ್ಯದ ಜಲಪಾತಗಳು.\n• ಇರುಪ್ಪು ಜಲಪಾತ (ದಕ್ಷಿಣ ಕೊಡಗು): ಬ್ರಹ್ಮಗಿರಿ ಪರ್ವತ ತಪ್ಪಲಿನ ಪವಿತ್ರ ಜಲಪಾತ.\n\nಎಲ್ಲಾ ಜಲಪಾತಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಲು 'Explore' ಪುಟವನ್ನು ತೆರೆಯಿರಿ.`,
        suggestedActions: [
          { label: 'ತಾಣಗಳ ಅನ್ವೇಷಣೆ', view: 'explore' },
          { label: 'ಪ್ರವಾಸ ಯೋಜನೆ', view: 'planner' }
        ]
      };
    }
    return {
      reply: `Here are some of the most famous and breathtaking waterfalls in Karnataka:\n\n• Jog Falls (Shivamogga) — India's 2nd highest plunge waterfall (253m) formed by the Sharavathi River, cascading into Raja, Roarer, Rocket, and Rani.\n• Abbey Falls (Madikeri, Coorg) — Nestled amidst fragrant coffee estates and spice plantations.\n• Shivanasamudra Falls (Mandya) — Iconic twin cascades (Gaganachukki & Bharachukki) on the sacred Kaveri River.\n• Hebbe Falls & Kalhatti Falls (Kemmangundi, Chikkamagaluru) — Spectacular cascades surrounded by lush greenery.\n• Sathodi & Magod Falls (Yellapur, Uttara Kannada) — Secluded forest waterfalls in the Western Ghats.\n• Iruppu Falls (South Coorg) — Sacred cascade at the base of the Brahmagiri wildlife range.\n\nYou can explore these and view distance from Bengaluru in our 'Explore Karnataka' section under Waterfalls!`,
      suggestedActions: [
        { label: 'Explore Waterfalls', view: 'explore' },
        { label: 'Plan My Trip', view: 'planner' }
      ]
    };
  }

  // 3. Two-day trip / Mysuru from Bengaluru trip
  if ((q.includes('mysuru') || q.includes('mysore') || q.includes('ಮೈಸೂರು')) && (q.includes('day') || q.includes('2') || q.includes('two') || q.includes('trip') || q.includes('bengaluru') || q.includes('bangalore') || q.includes('ದಿನ') || q.includes('ಪ್ರವಾಸ'))) {
    if (isKn) {
      return {
        reply: `ಬೆಂಗಳೂರಿನಿಂದ ಮೈಸೂರಿಗೆ 2 ದಿನಗಳ ಸುಲಭ ಮತ್ತು ಪರಿಪೂರ್ಣ ಪ್ರವಾಸ ಯೋಜನೆ (~145 ಕಿ.ಮೀ, ಎನ್‌ಹೆಚ್ 275 ಎಕ್ಸ್‌ಪ್ರೆಸ್‌ವೇ):\n\n• ದಿನ 1: ಬೆಳಿಗ್ಗೆ ಬೆಂಗಳೂರಿನಿಂದ ಪ್ರಯಾಣ (~2.5 ಗಂಟೆ). ಮಾರ್ಗಮಧ್ಯೆ ಶ್ರೀರಂಗಪಟ್ಟಣಕ್ಕೆ ಭೇಟಿ (ಟಿಪ್ಪು ಸುಲ್ತಾನರ ಬೇಸಿಗೆ ಅರಮನೆ & ರಂಗನಾಥಸ್ವಾಮಿ ದೇವಾಲಯ). ಮಧ್ಯಾಹ್ನ ಮೈಸೂರು ಅರಮನೆ (ಅಂಬಾ ವಿಲಾಸ) ವೀಕ್ಷಣೆ. ಸಂಜೆ ಚಾಮುಂಡಿ ಬೆಟ್ಟ ಮತ್ತು ನಂದಿ ಪ್ರತಿಮೆ ವೀಕ್ಷಿಸಿ ಸೂರ್ಯಾಸ್ತ ಆನಂದಿಸಿ.\n• ದಿನ 2: ಬೆಳಿಗ್ಗೆ ಮೈಸೂರು ಮೃಗಾಲಯ ಅಥವಾ ಸೇಂಟ್ ಫಿಲೋಮಿನಾ ಚರ್ಚ್. ಮಧ್ಯಾಹ್ನ ರಂಗನತಿಟ್ಟು ಪಕ್ಷಿಧಾಮದಲ್ಲಿ ಬೋಟಿಂಗ್ ಅಥವಾ ಬೃಂದಾವನ ಗಾರ್ಡನ್ಸ್ ವೀಕ್ಷಿಸಿ, ಸಂಜೆ ಬೆಂಗಳೂರಿಗೆ ಹಿಂತಿರುಗಿ.\n\nಪೂರ್ಣ ದಿನವಾರು ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಅಂದಾಜು ಬಜೆಟ್ ಲೆಕ್ಕಾಚಾರಕ್ಕಾಗಿ 'Plan My Trip' ಪುಟವನ್ನು ಬಳಸಿ!`,
        suggestedActions: [
          { label: 'ಪ್ರವಾಸ ಯೋಜನೆ ರಚಿಸಿ', view: 'planner' },
          { label: 'ಮೈಸೂರು ಹೋಟೆಲ್‌ಗಳು', view: 'hotels' }
        ]
      };
    }
    return {
      reply: `Here is a recommended 2-day itinerary from Bengaluru to Mysuru (~145 km via the Bengaluru-Mysuru Expressway / NH 275 or Vande Bharat Express):\n\n• Day 1: Depart Bengaluru in the morning (~2.5h drive). En route, stop at historic Srirangapatna (Tipu Sultan's Summer Palace & Ranganathaswamy Temple). Check into your Mysuru stay, then explore the magnificent Mysuru Palace (Amba Vilas). In the late afternoon, head up to Chamundi Hill for sunset views over the heritage city.\n• Day 2: Morning visit to Sri Chamarajendra Zoological Gardens (Mysore Zoo) or St. Philomena's Cathedral. In the afternoon, enjoy a tranquil boat safari at Ranganathittu Bird Sanctuary or visit Brindavan Gardens (KRS Dam) before heading back to Bengaluru.\n\nOpen 'Plan My Trip' in the top menu to generate your personalized day-by-day plan with hourly schedules and budget breakdown!`,
      suggestedActions: [
        { label: 'Plan Trip to Mysuru', view: 'planner' },
        { label: 'Mysuru Hotels & Stays', view: 'hotels' }
      ]
    };
  }

  // 4. Planning a trip / Itinerary generator
  if (q.includes('plan') || q.includes('itinerary') || q.includes('circuit') || q.includes('route') || q.includes('ಯೋಜನೆ') || q.includes('ಪ್ರವಾಸ') || q.includes('ಮಾರ್ಗ')) {
    if (isKn) {
      return {
        reply: `ನಿಮ್ಮ ಕಸ್ಟಮ್ ಪ್ರವಾಸ ಯೋಜನೆ ರಚಿಸಲು ಮೇಲಿನ ಮೆನುವಿನಲ್ಲಿರುವ 'Plan My Trip' (ಪ್ರವಾಸ ಯೋಜನೆ) ತೆರೆಯಿರಿ.\n\n1. ನಿಮ್ಮ ಆರಂಭಿಕ ನಗರ (ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಮಂಗಳೂರು, ಇತ್ಯಾದಿ), ದಿನಗಳು (1–14), ಪ್ರಯಾಣಿಕರ ಸಂಖ್ಯೆ ಮತ್ತು ಬಜೆಟ್ ಶ್ರೇಣಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.\n2. 'ಪ್ರವಾಸ ಯೋಜನೆ ರಚಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿದರೆ ದಿನವಾರು ಮಾರ್ಗ, ಚಾಲನಾ ಸಮಯ ಮತ್ತು ಅಂದಾಜು ಬಜೆಟ್ ಸಿದ್ಧವಾಗುತ್ತದೆ.\n3. ಯೋಜನೆಯನ್ನು ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಳಿಸಲು 'Save to My Trips' ಅಥವಾ PDF ಪ್ರಿಂಟ್ ಬಳಸಿ.`,
        suggestedActions: [
          { label: 'ಪ್ರವಾಸ ಯೋಜನೆ ತೆರೆಯಿರಿ', view: 'planner' },
          { label: 'ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ', view: 'explore' }
        ]
      };
    }
    return {
      reply: `Open 'Plan My Trip' from the top menu to create your custom Karnataka itinerary.\n\n1. Select your starting city (Bengaluru, Mysuru, Mangaluru, Hubballi, etc.), duration (1–14 days), travellers, and budget tier.\n2. Click 'Generate Trip Plan' to create your day-by-day route with driving times, stops, and estimated costs.\n3. Click 'Save to My Trips' to keep your plan available offline or export to PDF anytime.`,
      suggestedActions: [
        { label: 'Open Trip Planner', view: 'planner' },
        { label: 'Explore Destinations', view: 'explore' }
      ]
    };
  }

  // 5. Finding hotels & stays
  if (q.includes('hotel') || q.includes('stay') || q.includes('resort') || q.includes('homestay') || q.includes('lodge') || q.includes('ಹೋಟೆಲ್') || q.includes('ವಸತಿ') || q.includes('ತಂಗುದಾಣ')) {
    if (isKn) {
      return {
        reply: `ಕರ್ನಾಟಕದ ಆಯ್ದ ತಂಗುದಾಣಗಳನ್ನು ವೀಕ್ಷಿಸಲು 'Hotels' (ಹೋಟೆಲ್‌ಗಳು) ಪುಟವನ್ನು ತೆರೆಯಿರಿ.\n\n1. ಜಿಲ್ಲೆ (ಮೈಸೂರು, ಕೊಡಗು, ಗೋಕರ್ಣ, ಹಂಪಿ) ಮತ್ತು ಬಜೆಟ್ ಶ್ರೇಣಿಯ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ.\n2. ಸರ್ಕಾರಿ ಜಂಗಲ್ ಲಾಡ್ಜಸ್ (Jungle Lodges & Resorts), ಪಾರಂಪರಿಕ ಹೋಟೆಲ್ ಮತ್ತು ಕಾಫಿ ಎಸ್ಟೇಟ್ ಹೋಮ್‌ಸ್ಟೇಗಳ ಅಂದಾಜು ದರಗಳನ್ನು ಹೋಲಿಸಿ.\n3. ತೋರಿಸಲಾದ ದರಗಳು ಅಂದಾಜುಗಳಾಗಿವೆ; ಲೈವ್ ದರ ಮತ್ತು ಲಭ್ಯತೆಗಾಗಿ ಒದಗಿಸಲಾದ ಅಧಿಕೃತ ಪಾಲುದಾರ ಲಿಂಕ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.`,
        suggestedActions: [
          { label: 'ಹೋಟೆಲ್‌ಗಳ ಪುಟಕ್ಕೆ ಹೋಗಿ', view: 'hotels' }
        ]
      };
    }
    return {
      reply: `Open the 'Hotels & Homestays' page to browse curated stays across Karnataka.\n\n1. Filter stays by district (such as Mysuru, Coorg, Gokarna, or Hampi) and budget tier.\n2. Compare official Govt Jungle Lodges & Resorts, heritage palace stays, and certified plantation homestays.\n3. Room tariffs shown are estimates; use the provided partner booking links (Jungle Lodges, MakeMyTrip, Goibibo) to check live seasonal room rates directly.`,
      suggestedActions: [
        { label: 'Browse Hotels & Stays', view: 'hotels' }
      ]
    };
  }

  // 6. Trains, IRCTC, MakeMyTrip, buses, transport
  if (q.includes('train') || q.includes('irctc') || q.includes('rail') || q.includes('bus') || q.includes('transport') || q.includes('flight') || q.includes('cab') || q.includes('ರೈಲು') || q.includes('ಬಸ್') || q.includes('ಸಾರಿಗೆ') || q.includes('ಟ್ಯಾಕ್ಸಿ')) {
    if (isKn) {
      return {
        reply: `ರೈಲು ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಲು 'Transport' ಪುಟದಲ್ಲಿರುವ ಅಧಿಕೃತ IRCTC ಕಾರ್ಡ್ ಬಳಸಿ.\n\n1. ಅಧಿಕೃತ irctc.co.in ತಾಣದಲ್ಲಿ ಲೈವ್ ರೈಲು ಬುಕಿಂಗ್ ಮತ್ತು ಸೀಟು ಕಾಯ್ದಿರಿಸಲು 'Book on IRCTC' ಕಾರ್ಡ್ ಬಳಸಿ.\n2. ಕರ್ನಾಟಕದ 31 ಜಿಲ್ಲೆಗಳಿಗೆ ಬಸ್ ಸಂಪರ್ಕಕ್ಕಾಗಿ KSRTC ಹಾಗೂ MakeMyTrip ಲಿಂಕ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಿ.\n3. ಲೈವ್ ದರಗಳು, ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಸೀಟು ಲಭ್ಯತೆಯು ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳಲ್ಲಿ ಮಾತ್ರ ನಿರ್ವಹಿಸಲ್ಪಡುತ್ತವೆ.`,
        suggestedActions: [
          { label: 'ರೈಲು ಬುಕಿಂಗ್ (IRCTC)', view: 'trains' },
          { label: 'ಸಾರಿಗೆ ಕೇಂದ್ರ ತೆರೆಯಿರಿ', view: 'transport' }
        ]
      };
    }
    return {
      reply: `Visit the 'Transport Hub' to access official booking links for trains, buses, flights, and cabs.\n\n1. Use the IRCTC card and click 'Book on IRCTC' (irctc.co.in) for live train reservations and PNR status.\n2. For state transport buses across all 31 districts, check the KSRTC links, or compare MakeMyTrip options for flights and cabs.\n3. Live ticket availability, schedules, and fares are managed directly on official transport portals.`,
      suggestedActions: [
        { label: 'Book Trains (IRCTC)', view: 'trains' },
        { label: 'Open Transport Hub', view: 'transport' }
      ]
    };
  }

  // 7. Changing language to Kannada / Kannada Helper
  if (q.includes('kannada') || q.includes('language') || q.includes('translate') || q.includes('ಕನ್ನಡ') || q.includes('ಭಾಷೆ')) {
    if (isKn) {
      return {
        reply: `ಭಾಷೆ ಬದಲಾಯಿಸಲು ಹೆಡರ್‌ನಲ್ಲಿರುವ 'ಕನ್ನಡ / English' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.\n\n1. ಕ್ಲಿಕ್ ಮಾಡಿದ ತಕ್ಷಣ ಇಡೀ ವೆಬ್‌ಸೈಟ್, ಬಟನ್‌ಗಳು ಮತ್ತು ಪ್ರವಾಸ ವಿವರಗಳು ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ಗೆ ಬದಲಾಗುತ್ತವೆ.\n2. ಪ್ರವಾಸಕ್ಕೆ ಉಪಯುಕ್ತ ಪದಗಳು ಮತ್ತು ಆಡಿಯೋ ಉಚ್ಚಾರಣೆಗಳಿಗಾಗಿ 'ಕನ್ನಡ ಸಹಾಯಕ' (Kannada Helper) ಪುಟವನ್ನು ಬಳಸಿ.`,
        suggestedActions: [
          { label: 'ಕನ್ನಡ ಸಹಾಯಕ ತೆರೆಯಿರಿ', view: 'kannada-helper' }
        ]
      };
    }
    return {
      reply: `Click the 'ಕನ್ನಡ / English' toggle in the top-right header to switch languages instantly.\n\n1. Toggling switches all website sections, buttons, and itineraries between English and Kannada.\n2. For essential Karnataka travel phrases and offline audio pronunciation, visit our 'Kannada Helper' section.`,
      suggestedActions: [
        { label: 'Open Kannada Helper', view: 'kannada-helper' }
      ]
    };
  }

  // 8. Suggestions of places to visit / Destinations
  if (q.includes('place') || q.includes('visit') || q.includes('suggest') || q.includes('destination') || q.includes('attraction') || q.includes('ಸ್ಥಳ') || q.includes('ತಾಣ') || q.includes('ಹಂಪಿ') || q.includes('ಕೂರ್ಗ್') || q.includes('ಗೋಕರ್ಣ') || q.includes('ಬಾದಾಮಿ')) {
    if (isKn) {
      return {
        reply: `ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಪ್ರವಾಸಿ ತಾಣಗಳನ್ನು ನೋಡಲು 'Explore' (ತಾಣಗಳ ಅನ್ವೇಷಣೆ) ಪುಟವನ್ನು ತೆರೆಯಿರಿ:\n\n• ಪರಂಪರೆ: ಹಂಪಿ ವಿಶ್ವ ಪರಂಪರೆ ತಾಣ, ಮೈಸೂರು ಅರಮನೆ, ಬಾದಾಮಿ ಗುಹೆಗಳು, ಬೇಲೂರು-ಹಳೇಬೀಡು.\n• ಗಿರಿಧಾಮಗಳು: ಕೊಡಗು (ಕೂರ್ಗ್) ಕಾಫಿ ತೋಟಗಳು, ಚಿಕ್ಕಮಗಳೂರು ಮುಳ್ಳಯ್ಯನಗಿರಿ.\n• ಕಡಲತೀರಗಳು: ಗೋಕರ್ಣ ಓಂ ಬೀಚ್ ಮತ್ತು ಉಡುಪಿ ಮಲ್ಪೆ ಸೇಂಟ್ ಮೇರಿಸ್ ಐಲ್ಯಾಂಡ್.\n• ವನ್ಯಜೀವಿ: ಕಬಿನಿ ಮತ್ತು ಬಂಡೀಪುರ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನಗಳು.\n\nತಾಣಗಳ ಸಮಯ ಮತ್ತು ಪ್ರವೇಶ ಶುಲ್ಕಗಳು ಅಂದಾಜುಗಳಾಗಿವೆ; ಭೇಟಿ ನೀಡುವ ಮುನ್ನ ಅಧಿಕೃತ ಪ್ರವಾಸೋದ್ಯಮ ಅಥವಾ ದೇವಾಲಯ ಪ್ರಾಧಿಕಾರಗಳಲ್ಲಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.`,
        suggestedActions: [
          { label: 'ಎಲ್ಲಾ ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ', view: 'explore' },
          { label: 'ಪ್ರವಾಸ ಯೋಜನೆ ರಚಿಸಿ', view: 'planner' }
        ]
      };
    }
    return {
      reply: `Explore Karnataka's top destinations in the 'Explore' section of our website:\n\n• Heritage & UNESCO: Hampi ruins, royal Mysuru Palace, Badami cave temples, and Hoysala temples at Belur-Halebidu.\n• Hill Stations: Coorg coffee estates and Chikkamagaluru's highest peak Mullayanagiri.\n• Beaches: Gokarna Om Beach and Udupi Malpe & St. Mary's Island.\n• Wildlife & Safaris: Kabini (Nagarhole) and Bandipur national parks.\n\nAll timings and entry fees listed on the website are estimates; please confirm current timings and guidelines through official district tourism offices before visiting.`,
      suggestedActions: [
        { label: 'Explore Destinations', view: 'explore' },
        { label: 'Plan a Custom Trip', view: 'planner' }
      ]
    };
  }

  // 9. My trips, saving, bookmarks
  if (q.includes('save') || q.includes('my trip') || q.includes('favourite') || q.includes('download') || q.includes('pdf') || q.includes('ಉಳಿಸಿ') || q.includes('ಬುಕ್‌ಮಾರ್ಕ್')) {
    if (isKn) {
      return {
        reply: `ನಿಮ್ಮ ಉಳಿಸಿದ ಪ್ರವಾಸಗಳನ್ನು ನೋಡಲು ಮೆನುವಿನಲ್ಲಿರುವ 'My Trips' (ನನ್ನ ಪ್ರವಾಸಗಳು) ಪುಟ ತೆರೆಯಿರಿ.\n\n1. ಯಾವುದೇ ಪ್ರವಾಸ ಯೋಜನೆಯಲ್ಲಿ 'Save to My Trips' ಕ್ಲಿಕ್ ಮಾಡಿದರೆ ಅದು ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಯುತ್ತದೆ.\n2. ಖಾತೆಯ ಅಗತ್ಯವಿಲ್ಲದೆ ಆಫ್‌ಲೈನ್‌ನಲ್ಲೂ ಇದು ಲಭ್ಯವಿರುತ್ತದೆ.\n3. ನಿಮ್ಮ ಯೋಜನೆಯನ್ನು ಸುಲಭವಾಗಿ PDF ಪ್ರಿಂಟ್ ಮಾಡಬಹುದು ಅಥವಾ JSON ರೂಪದಲ್ಲಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು.`,
        suggestedActions: [
          { label: 'ನನ್ನ ಪ್ರವಾಸಗಳು ವೀಕ್ಷಿಸಿ', view: 'my-trips' }
        ]
      };
    }
    return {
      reply: `Open 'My Trips' from the top menu to view your saved itineraries.\n\n1. On any generated itinerary, click 'Save to My Trips' to store it securely in your browser.\n2. Access your saved itineraries anytime offline without creating an account.\n3. You can also print the itinerary directly to PDF or export it as JSON.`,
      suggestedActions: [
        { label: 'View My Saved Trips', view: 'my-trips' }
      ]
    };
  }

  // General default helpful response answering Karnataka travel
  if (isKn) {
    return {
      reply: `ಕರ್ನಾಟಕ ಪ್ರವಾಸ ಮತ್ತು ನಮ್ಮ ಪ್ರಯಾಣ ವೆಬ್‌ಸೈಟ್‌ಗೆ ಸಂಬಂಧಿಸಿದ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಾನು ಮಾರ್ಗದರ್ಶನ ನೀಡಬಲ್ಲೆ:\n\n• 'Plan My Trip': ಆರಂಭಿಕ ನಗರ, ದಿನಗಳು ಮತ್ತು ಬಜೆಟ್‌ಗೆ ತಕ್ಕಂತೆ ಕಸ್ಟಮ್ ಪ್ರವಾಸ ಯೋಜನೆ\n• 'Explore': 31 ಜಿಲ್ಲೆಗಳ ಪರಂಪರೆ, ಜಲಪಾತ, ಕಡಲತೀರ ಮತ್ತು ಗಿರಿಧಾಮಗಳು\n• 'Hotels': ಆಯ್ದ ತಂಗುದಾಣಗಳು, ರೆಸಾರ್ಟ್‌ಗಳು ಮತ್ತು ಲೈವ್ ದರ ಲಿಂಕ್‌ಗಳು\n• 'Transport': IRCTC ರೈಲುಗಳು, KSRTC ಬಸ್ ಮತ್ತು ಕ್ಯಾಬ್‌ಗಳು\n• 'Contact Support': ವೆಬ್‌ಸೈಟ್ ಕೆಳಭಾಗದಲ್ಲಿರುವ ಬೆಂಬಲ ಸಂಪರ್ಕ ಫಾರ್ಮ್`,
      suggestedActions: [
        { label: 'ಪ್ರವಾಸ ಯೋಜನೆ', view: 'planner' },
        { label: 'ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ', view: 'explore' },
        { label: 'ಸಹಾಯ ಮತ್ತು ಸಂಪರ್ಕ', view: 'contact' }
      ]
    };
  }

  return {
    reply: `I can help guide you through Karnataka travel and all Namma Prayana features:\n\n• 'Plan My Trip': Create customized day-by-day itineraries with estimated budgets\n• 'Explore': Discover heritage sites, waterfalls, beaches, and hill stations across 31 districts\n• 'Hotels': Browse curated stays with links to check live seasonal room rates\n• 'Transport': Access official IRCTC train and KSRTC bus portals\n• 'Contact Support': Reach our support team using the in-app form in the footer`,
    suggestedActions: [
      { label: 'Plan My Trip', view: 'planner' },
      { label: 'Explore Destinations', view: 'explore' },
      { label: 'Contact Support', view: 'contact' }
    ]
  };
}

/**
 * Handle incoming chat message from the floating assistant.
 * Connects free-text questions directly to server-side Gemini AI models,
 * provides deep website and Karnataka travel guidance,
 * and falls back safely to curated guidance if Gemini is temporarily unavailable.
 */
export async function handleAssistantChat(request: AssistantChatRequest): Promise<AssistantChatResponse> {
  const rawMessage = typeof request?.message === 'string' ? request.message.trim() : '';
  const language = request?.language === 'kn' ? 'kn' : 'en';
  const isKn = language === 'kn';

  // Input validation: empty or whitespace check
  if (!rawMessage) {
    return {
      reply: isKn 
        ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ!' 
        : 'Please type a question. I am here to help you plan your Karnataka journey!',
      isAiGenerated: false,
      status: 'curated_guide'
    };
  }

  // Input length limit
  const sanitizedMessage = rawMessage.slice(0, 500);

  // Check if Gemini is enabled: enabled if GEMINI_API_KEY is present and not explicitly set to false
  const isExplicitlyDisabled = String(process.env.ENABLE_GEMINI_ASSISTANT || '').toLowerCase().trim() === 'false';
  const apiKey = process.env.GEMINI_API_KEY;
  const hasValidKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim());
  const shouldUseGemini = hasValidKey && !isExplicitlyDisabled;

  // If Gemini API is not configured, use high-quality curated guide response
  if (!shouldUseGemini || !apiKey) {
    const curated = getCuratedGuideResponse(sanitizedMessage, language);
    return {
      reply: curated.reply,
      suggestedActions: curated.suggestedActions,
      isAiGenerated: false,
      status: 'curated_guide'
    };
  }

  // Invoke Gemini API safely
  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-namma-prayana',
        },
      },
    });

    const systemInstruction = isKn
      ? `ನೀವು 'ನಮ್ಮ ಪ್ರಯಾಣ ಮಾರ್ಗದರ್ಶಿ' (Namma Prayana Guide), ಕರ್ನಾಟಕ ಪ್ರವಾಸೋದ್ಯಮ ಮತ್ತು ನಮ್ಮ ಪ್ರಯಾಣ (Namma Prayana) ವೆಬ್‌ಸೈಟ್‌ನ ಸ್ನೇಹಪರ, ಜ್ಞಾನಯುತ AI ಮಾರ್ಗದರ್ಶಕ.

ನಮ್ಮ ಪ್ರಯಾಣ ವೆಬ್‌ಸೈಟ್‌ನ ವೈಶಿಷ್ಟ್ಯಗಳು:
- ಪ್ರವಾಸ ಯೋಜನೆ (Plan My Trip - ಪುಟ: 'planner'): 1 ರಿಂದ 14 ದಿನಗಳ ಕಸ್ಟಮ್ ಪ್ರವಾಸ ಯೋಜನೆ, ಆರಂಭಿಕ ನಗರ, ದಿನವಾರು ಮಾರ್ಗ, ಚಾಲನಾ ಸಮಯ ಮತ್ತು ಅಂದಾಜು ಬಜೆಟ್ ಲೆಕ್ಕಾಚಾರ.
- ತಾಣಗಳ ಅನ್ವೇಷಣೆ (Explore - ಪುಟ: 'explore'): ಕರ್ನಾಟಕದ 31 ಜಿಲ್ಲೆಗಳು, ಪರಂಪರೆ, ಜಲಪಾತಗಳು (ಜೋಗ, ಅಬ್ಬಿ, ಶಿವನಸಮುದ್ರ), ಕಡಲತೀರಗಳು (ಗೋಕರ್ಣ, ಉಡುಪಿ), ಗಿರಿಧಾಮಗಳು (ಕೂರ್ಗ್, ಚಿಕ್ಕಮಗಳೂರು), ವನ್ಯಜೀವಿ (ಕಬಿನಿ).
- ಹೋಟೆಲ್‌ಗಳು ಮತ್ತು ಹೋಮ್‌ಸ್ಟೇಗಳು (Hotels - ಪುಟ: 'hotels'): ಸರ್ಕಾರಿ ಜಂಗಲ್ ಲಾಡ್ಜಸ್ (Jungle Lodges & Resorts), ಕಾಫಿ ಎಸ್ಟೇಟ್ ಹೋಮ್‌ಸ್ಟೇಗಳು, MakeMyTrip, Goibibo ಅಧಿಕೃತ ಬುಕಿಂಗ್ ಲಿಂಕ್‌ಗಳು.
- ಸಾರಿಗೆ ಕೇಂದ್ರ (Transport Hub - ಪುಟ: 'trains' ಅಥವಾ 'transport'): ಅಧಿಕೃತ IRCTC ರೈಲು ಬುಕಿಂಗ್ (irctc.co.in), KSRTC ಬಸ್‌ಗಳು, ವಿಮಾನಗಳು ಮತ್ತು ಕ್ಯಾಬ್‌ಗಳು.
- ಕನ್ನಡ ಸಹಾಯಕ (Kannada Helper - ಪುಟ: 'kannada-helper'): ಪ್ರವಾಸಕ್ಕೆ ಉಪಯುಕ್ತ ಕನ್ನಡ ನುಡಿಗಟ್ಟುಗಳು ಮತ್ತು ಆಡಿಯೋ ಉಚ್ಚಾರಣೆ.
- ಬಜೆಟ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್ (Budget Calculator - ಪುಟ: 'calculator'): ಇಂಧನ, ವಸತಿ, ಊಟ, ಟೋಲ್ ಅಂದಾಜು.
- ನನ್ನ ಉಳಿಸಿದ ಪ್ರವಾಸಗಳು (My Trips - ಪುಟ: 'my-trips'): ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿ ಉಳಿಸಿದ ಪ್ರವಾಸಗಳು, JSON ರಫ್ತು ಮತ್ತು PDF ಪ್ರಿಂಟ್.
- ಬೆಂಬಲ ಮತ್ತು ಸಂಪರ್ಕ (Contact Support): ಬಳಕೆದಾರರು ವೆಬ್‌ಸೈಟ್‌ನ ಕೆಳಭಾಗದಲ್ಲಿರುವ (Footer) 'Contact Support' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡುವ ಮೂಲಕ ನಮ್ಮ ಇನ್-ಆ್ಯಪ್ ಬೆಂಬಲ ಫಾರ್ಮ್ ಬಳಸಿ ನೇರವಾಗಿ ಸಂದೇಶ ಕಳುಹಿಸಬಹುದು. ತುರ್ತು ಸಹಾಯವಾಣಿಗಳಿಗಾಗಿ ಹೆಡರ್‌ನಲ್ಲಿರುವ 'ಸಹಾಯ' (Help) ಆಯ್ಕೆಯನ್ನು ಬಳಸಬಹುದು. ಎಂದಿಗೂ ನಕಲಿ ಇಮೇಲ್ ಅಥವಾ ಫೋನ್ ನಂಬರ್ ನೀಡಬೇಡಿ; ವೆಬ್‌ಸೈಟ್‌ನ 'Contact Support' ಫಾರ್ಮ್ ಬಳಸಲು ತಿಳಿಸಿ.

ಮಾರ್ಗದರ್ಶನ ನಿಯಮಗಳು:
1. ಪ್ರಶ್ನೆಗೆ ನೇರ ಉತ್ತರ ನೀಡಿ: ಬಳಕೆದಾರರ ನಿರ್ದಿಷ್ಟ ಪ್ರಶ್ನೆಗೆ ಮೊದಲ ವಾಕ್ಯದಲ್ಲೇ ನೇರ, ಸ್ಪಷ್ಟ ಉತ್ತರ ನೀಡಿ. ಅನಗತ್ಯ ಸಾಮಾನ್ಯ ಪರಿಚಯವನ್ನು ಮತ್ತೆ ಮತ್ತೆ ಪುನರಾವರ್ತಿಸಬೇಡಿ.
2. ಕರ್ನಾಟಕ ಪ್ರವಾಸದ ಪ್ರಶ್ನೆಗಳಿಗೆ (ಉದಾ. 2 ದಿನಗಳ ಮೈಸೂರು ಪ್ರವಾಸ, ಜಲಪಾತಗಳು, ಕೂರ್ಗ್, ಹಂಪಿ ಇತ್ಯಾದಿ) ನಿಖರ ಮತ್ತು ಉಪಯುಕ್ತ ಮಾಹಿತಿ ನೀಡಿ, ನಂತರ ವೆಬ್‌ಸೈಟ್‌ನ 'Plan My Trip' ಅಥವಾ 'Explore' ಬಳಸಲು ಸೂಚಿಸಿ.
3. ವೆಬ್‌ಸೈಟ್ ಬೆಂಬಲ ಅಥವಾ ಸಂಪರ್ಕದ ಬಗ್ಗೆ ಕೇಳಿದರೆ, ಫೂಟರ್‌ನಲ್ಲಿರುವ 'Contact Support' ಬಟನ್ ಬಳಸಲು ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿ.
4. ಭಾಷೆ: ಬಳಕೆದಾರರು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿದರೆ ಅಥವಾ ಭಾಷೆ 'kn' ಆಗಿದ್ದರೆ, ಸಂಪೂರ್ಣವಾಗಿ ಶುದ್ಧ, ಸ್ವಾಭಾವಿಕ ಕನ್ನಡ ಲಿಪಿಯಲ್ಲಿಯೇ ಉತ್ತರಿಸಿ.
5. ದರಗಳು ಮತ್ತು ಸಮಯಗಳು ಅಂದಾಜುಗಳು ಎಂದು ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿ; ಲೈವ್ ಬುಕಿಂಗ್ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗಳಲ್ಲಿ ನಡೆಯುತ್ತದೆ.`
      : `You are 'Namma Prayana Guide', the friendly, knowledgeable AI travel and website guide for Namma Prayana — AI Travel Planner for Karnataka.

Namma Prayana Website Features & Navigation:
- Plan My Trip (view: 'planner'): Custom day-by-day itineraries based on duration (1-14 days), origin city (Bengaluru, Mysuru, Mangaluru, Hubballi, etc.), travelers count, and budget tier (budget, comfort, luxury). Generates route maps, driving times, and itemized cost breakdowns.
- Explore Karnataka (view: 'explore'): 31 districts categorized by UNESCO Heritage (Hampi, Pattadakal, Belur-Halebidu), Waterfalls (Jog Falls, Abbey Falls, Shivanasamudra, Hebbe), Beaches (Gokarna, Malpe), Hill Stations (Coorg, Chikkamagaluru), Wildlife (Kabini, Bandipur).
- Hotels & Homestays (view: 'hotels'): Official Govt Jungle Lodges & Resorts, plantation coffee homestays, and verified partner booking links (Jungle Lodges, MakeMyTrip, Goibibo) with estimated seasonal tariffs.
- Transport Hub (view: 'trains' for IRCTC / 'transport' for all): Official booking cards for IRCTC Trains (irctc.co.in), KSRTC state buses, flights, and self-drive cabs.
- Kannada Helper (view: 'kannada-helper'): Essential Karnataka travel phrases with native audio pronunciation.
- Budget Calculator (view: 'calculator'): Realistic cost estimator for fuel, stay, food, toll, and permits.
- My Trips (view: 'my-trips'): Stored offline itineraries in local browser storage, print to PDF, and JSON export/import.
- Contact & Support: Users can contact Namma Prayana support through our secure in-app 'Contact Support' form located in the footer at the bottom of any page (or via the Contact modal). For emergencies or district tourism helplines, users can click 'Emergency & Helplines' in the top navigation or footer. NEVER invent private phone numbers or private email addresses; direct users to use the website's in-app Contact Support form.

Karnataka Travel Knowledge & Guidance:
- 2-day trip to Mysuru from Bengaluru: ~145 km via the 10-lane Bengaluru-Mysuru Expressway (NH 275, ~2.5h) or Vande Bharat train. Day 1: Bengaluru to Mysuru, stop at Srirangapatna (Tipu's Palace), Mysuru Palace (Amba Vilas), Chamundi Hill sunset. Day 2: Mysore Zoo / St. Philomena's, Brindavan Gardens (KRS Dam) or Ranganathittu Bird Sanctuary, return. Recommend 'Plan My Trip' for full schedule.
- Famous Waterfalls: Jog Falls (Shivamogga, 253m plunge, Sharavathi river, Raja/Roarer/Rocket/Rani), Abbey Falls (Madikeri, Coorg coffee setting), Shivanasamudra Falls (Mandya, Gaganachukki & Bharachukki on Kaveri river), Hebbe & Kalhatti Falls (Kemmangundi), Sathodi & Magod Falls (Uttara Kannada), Iruppu Falls (South Coorg).
- Heritage: Hampi (UNESCO, Vijayanagara ruins, Virupaksha, Stone Chariot), Badami cave temples, Belur-Halebidu (Hoysala architecture).
- Hill Stations: Coorg (Madikeri, coffee homestays), Chikkamagaluru (Mullayanagiri, Baba Budangiri).

Strict Response Guidelines:
1. Direct answer first: State the direct, specific answer to the visitor's question in the very first sentence. Do not repeat a generic welcome greeting like "Namaskara! I am your Namma Prayana Guide. Ask me anything...". Dive straight into answering what the user asked.
2. Concise and helpful: Keep answers informative and scannable (~70-130 words). Use 2-3 bullet points where helpful.
3. Website Guidance: When applicable, reference the relevant website section (e.g. 'Plan My Trip', 'Explore', 'Hotels', or 'Contact Support' in the footer) so the user knows where to click.
4. Language: Strictly answer in the requested language (natural Kannada script if asked in Kannada or language is 'kn', crisp English if asked in English).
5. Honesty on Live Data: All tariffs, driving times, and fees are estimates. Live bookings take place on official portals (IRCTC, partner portals).
6. CRITICAL COMPLETENESS REQUIREMENT: ALWAYS complete every sentence and markdown formatting tag fully. Never stop in the middle of a sentence, word, or markdown tag (like **). Always conclude with complete sentences and proper terminal punctuation (. ! ? ।).`;

    // Candidate models in preference order (gemini-3.8-flash first for high reliability Q&A, then flash-lite & flash-latest)
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let aiResponseText = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      const timeoutMs = 16000;
      let timeoutId: NodeJS.Timeout | undefined;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms with ${modelName}`)), timeoutMs);
      });

      try {
        const historyText = Array.isArray(request.history) && request.history.length > 0
          ? request.history.slice(-4).map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')
          : '';

        const fullPrompt = historyText
          ? `Conversation History:\n${historyText}\n\nUser Question:\n${sanitizedMessage}\n\nResponse:`
          : sanitizedMessage;

        const apiCall = ai.models.generateContent({
          model: modelName,
          contents: fullPrompt,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 1200,
          },
        });

        // Prevent unhandled promise rejection if timeoutPromise resolves/rejects first
        apiCall.catch(() => {});

        const attemptRes = await Promise.race([apiCall, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId);

        if (attemptRes && attemptRes.text && attemptRes.text.trim()) {
          let rawText = attemptRes.text.trim();

          // Post-processing check: Ensure text does not end mid-sentence or mid-bold tag
          const boldCount = (rawText.match(/\*\*/g) || []).length;
          if (boldCount % 2 !== 0) {
            rawText += '**';
          }

          // If text ends abruptly without punctuation (. ! ? । ॥) or closing paren/quote, clean up trailing incomplete phrase
          if (!/[.!?।॥:"'”)]\s*$/.test(rawText)) {
            const lastSentenceEnd = Math.max(
              rawText.lastIndexOf('.'),
              rawText.lastIndexOf('!'),
              rawText.lastIndexOf('?'),
              rawText.lastIndexOf('।'),
              rawText.lastIndexOf('॥')
            );
            if (lastSentenceEnd > 0 && lastSentenceEnd > rawText.length * 0.4) {
              rawText = rawText.slice(0, lastSentenceEnd + 1).trim();
            } else {
              rawText += '.';
            }
          }

          aiResponseText = rawText;
          break;
        }
      } catch (err: any) {
        if (timeoutId) clearTimeout(timeoutId);
        lastError = err;
        console.warn(`[Assistant] Model ${modelName} notice:`, err?.message || 'Unknown issue');
      }
    }

    if (aiResponseText) {
      // Determine helpful suggested actions based on message and response content
      const suggestedActions: SuggestedAction[] = [];
      const lower = (sanitizedMessage + ' ' + aiResponseText).toLowerCase();

      if (lower.includes('contact') || lower.includes('support') || lower.includes('help') || lower.includes('ಸಂಪರ್ಕ') || lower.includes('ಸಹಾಯ')) {
        suggestedActions.push({ label: isKn ? 'ಸಹಾಯ ಮತ್ತು ಸಂಪರ್ಕ' : 'Contact Support', view: 'contact' });
      }
      if (lower.includes('plan') || lower.includes('itinerary') || lower.includes('trip') || lower.includes('route') || lower.includes('ಯೋಜನೆ') || lower.includes('ಪ್ರವಾಸ')) {
        suggestedActions.push({ label: isKn ? 'ಪ್ರವಾಸ ಯೋಜನೆ' : 'Plan My Trip', view: 'planner' });
      }
      if (lower.includes('hotel') || lower.includes('stay') || lower.includes('resort') || lower.includes('homestay') || lower.includes('ಹೋಟೆಲ್') || lower.includes('ವಸತಿ')) {
        suggestedActions.push({ label: isKn ? 'ಹೋಟೆಲ್‌ಗಳು' : 'Find Hotels & Stays', view: 'hotels' });
      }
      if (lower.includes('waterfall') || lower.includes('explore') || lower.includes('destination') || lower.includes('place') || lower.includes('visit') || lower.includes('hampi') || lower.includes('coorg') || lower.includes('gokarna') || lower.includes('ಜಲಪಾತ') || lower.includes('ತಾಣ') || lower.includes('ಸ್ಥಳ')) {
        suggestedActions.push({ label: isKn ? 'ತಾಣಗಳ ಅನ್ವೇಷಣೆ' : 'Explore Karnataka', view: 'explore' });
      }
      if (lower.includes('train') || lower.includes('irctc') || lower.includes('ರೈಲು')) {
        suggestedActions.push({ label: isKn ? 'ರೈಲು ಬುಕಿಂಗ್ (IRCTC)' : 'Book Trains (IRCTC)', view: 'trains' });
      } else if (lower.includes('bus') || lower.includes('transport') || lower.includes('flight') || lower.includes('ಸಾರಿಗೆ') || lower.includes('ಬಸ್')) {
        suggestedActions.push({ label: isKn ? 'ಸಾರಿಗೆ ಕೇಂದ್ರ' : 'Transport Hub', view: 'transport' });
      }
      if (lower.includes('kannada') || lower.includes('language') || lower.includes('ಕನ್ನಡ') || lower.includes('ಭಾಷೆ')) {
        suggestedActions.push({ label: isKn ? 'ಕನ್ನಡ ಸಹಾಯಕ' : 'Kannada Helper', view: 'kannada-helper' });
      }
      if (lower.includes('save') || lower.includes('my trip') || lower.includes('ಉಳಿಸಿ')) {
        suggestedActions.push({ label: isKn ? 'ನನ್ನ ಪ್ರವಾಸಗಳು' : 'View My Trips', view: 'my-trips' });
      }

      return {
        reply: aiResponseText,
        suggestedActions: suggestedActions.slice(0, 2),
        isAiGenerated: true,
        status: 'ai_active',
      };
    }

    throw lastError || new Error('No valid response received from Gemini candidate models');
  } catch (err: any) {
    // Safe error handling: never log or expose keys, fall back smoothly
    console.error('[Assistant] Error generating AI response, using curated fallback:', err?.message || 'Unknown error');
    const curated = getCuratedGuideResponse(sanitizedMessage, language);
    return {
      reply: curated.reply,
      suggestedActions: curated.suggestedActions,
      isAiGenerated: false,
      status: 'fallback',
    };
  }
}
