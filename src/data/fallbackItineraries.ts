import type { TripItinerary, TripPlannerInput, DayPlan } from '../types/travel.ts';
import { KARNATAKA_DESTINATIONS } from './destinations.ts';

export function generateCuratedFallbackItinerary(input: TripPlannerInput): TripItinerary {
  const safeInput = input || ({} as TripPlannerInput);
  const isKn = safeInput.language === 'kn';
  const duration = Math.min(Math.max(safeInput.durationDays || 3, 1), 10);
  const travellers = Math.max(safeInput.travellersCount || 1, 1);
  const rawTier = String(safeInput.budgetTier || '').toLowerCase();
  const tier: 'budget' | 'comfort' | 'premium' =
    rawTier === 'premium' || rawTier === 'luxury'
      ? 'premium'
      : rawTier === 'budget'
      ? 'budget'
      : 'comfort';

  // Cost multipliers per tier
  const tierCostMap = {
    budget: { stay: 1200, food: 600, transport: 500, local: 300 },
    comfort: { stay: 3200, food: 1200, transport: 1200, local: 600 },
    premium: { stay: 7500, food: 2500, transport: 2500, local: 1200 }
  };
  const tierCostPerDay = tierCostMap[tier] || tierCostMap.comfort;

  // Pick destinations that match preferences or default circuits
  const userInterests = Array.isArray(safeInput.interests) ? safeInput.interests : [];
  const requestedLower = (safeInput.destinationPreferences || []).map(d => (d || '').toLowerCase());
  let selectedDests = KARNATAKA_DESTINATIONS.filter(d => 
    requestedLower.some(r => 
      d.name.toLowerCase().includes(r) || 
      d.kannadaName.includes(r) ||
      d.district.toLowerCase().includes(r) || 
      r === 'all' || 
      r === 'explore all karnataka' || 
      r === 'ಕರ್ನಾಟಕ ಪೂರ್ತಿ ಅನ್ವೇಷಿಸಿ'
    )
  );

  if (selectedDests.length === 0) {
    if (userInterests.some(i => i.toLowerCase().includes('beach') || i.includes('ಕಡಲತೀರ'))) {
      selectedDests = KARNATAKA_DESTINATIONS.filter(d => ['gokarna', 'udupi-malpe', 'st-marys-island', 'murudeshwar', 'maravanthe-beach', 'kaup-beach'].includes(d.id));
    } else if (userInterests.some(i => i.toLowerCase().includes('waterfall') || i.includes('ಜಲಪಾತ'))) {
      selectedDests = KARNATAKA_DESTINATIONS.filter(d => ['jog-falls', 'abbey-falls', 'shivanasamudra-falls', 'hebbe-falls'].includes(d.id));
    } else if (userInterests.some(i => i.toLowerCase().includes('wildlife') || i.includes('ವನ್ಯಜೀವಿ'))) {
      selectedDests = KARNATAKA_DESTINATIONS.filter(d => ['kabini-nagarhole', 'bandipur', 'bhadra-wildlife', 'ranganathittu'].includes(d.id));
    } else if (userInterests.some(i => i.toLowerCase().includes('hill') || i.toLowerCase().includes('trek') || i.includes('ಬೆಟ್ಟ') || i.includes('ಗಿರಿ'))) {
      selectedDests = KARNATAKA_DESTINATIONS.filter(d => ['coorg', 'chikkamagaluru', 'mullayanagiri-peak', 'nandi-hills'].includes(d.id));
    } else if (userInterests.some(i => i.toLowerCase().includes('heritage') || i.toLowerCase().includes('history') || i.includes('ಪರಂಪರೆ'))) {
      selectedDests = KARNATAKA_DESTINATIONS.filter(d => ['hampi', 'badami', 'pattadakal-aihole', 'mysuru-palace', 'belur-halebidu', 'chitradurga-fort', 'somanathapura'].includes(d.id));
    } else {
      selectedDests = KARNATAKA_DESTINATIONS.filter(d => ['mysuru-palace', 'coorg', 'chikkamagaluru', 'belur-halebidu', 'hampi'].includes(d.id));
    }
  }

  // Build days
  const days: DayPlan[] = [];
  let cumulativeDistanceKm = 0;

  for (let d = 1; d <= duration; d++) {
    const dest = selectedDests[(d - 1) % selectedDests.length];
    const isFinalDay = d === duration && duration > 1;
    const originCityName = safeInput.originCity || (isKn ? 'ಬೆಂಗಳೂರು' : 'Bengaluru');
    const travelDist = d === 1
      ? Math.min(dest.approxDistanceKmFromBengaluru || 145, 200)
      : isFinalDay
      ? Math.min(dest.approxDistanceKmFromBengaluru || 145, 200)
      : 40 + (d * 10);
    cumulativeDistanceKm += travelDist;

    const destDisplayName = isKn ? dest.kannadaName : dest.name;
    const destDistrictName = isKn ? `${dest.district} ಜಿಲ್ಲೆ` : `${dest.district} District`;

    let dayDate = `Day ${d}`;
    if (safeInput.startDate) {
      const parsedTime = new Date(safeInput.startDate).getTime();
      if (!isNaN(parsedTime)) {
        dayDate = new Date(parsedTime + (d - 1) * 86400000).toISOString().split('T')[0];
      }
    }

    days.push({
      dayNumber: d,
      date: dayDate,
      title: isFinalDay
        ? (isKn ? `ದಿನ ${d}: ${destDisplayName} ಪ್ರವಾಸ & ${originCityName} ಗೆ ಮರಳಿ ಪ್ರಯಾಣ` : `Day ${d}: ${dest.name} & Return to ${originCityName}`)
        : (isKn ? `ದಿನ ${d}: ${destDisplayName} ಪ್ರವಾಸ` : `Day ${d}: Discover ${dest.name}`),
      destinationName: destDisplayName,
      district: dest.district,
      morning: [
        {
          id: `act-m-${d}`,
          timeSlot: 'morning',
          title: isKn 
            ? `${destDisplayName} - ಸೂರ್ಯೋದಯ & ${dest.mainAttractions[0] || 'ಐತಿಹಾಸಿಕ ಸ್ಥಳ'} ವೀಕ್ಷಣೆ`
            : `Sunrise & Heritage Exploration at ${dest.mainAttractions[0] || dest.name}`,
          description: isKn
            ? `${dest.mainAttractions[0] || destDisplayName} ತಾಣಕ್ಕೆ ಬೆಳಗಿನ ಭೇಟಿ. ನೈಸರ್ಗಿಕ ಬೆಳಕಿನಲ್ಲಿ ಅದ್ಭುತ ಛಾಯಾಗ್ರಹಣ ಮತ್ತು ಪ್ರಶಾಂತ ವಾತಾವರಣ.`
            : `Early morning exploration of ${dest.mainAttractions[0] || dest.name} to avoid midday heat and capture gentle golden lighting.`,
          locationName: destDisplayName,
          durationHours: 3,
          estimatedCostInr: dest.entryFeeInr * travellers,
          travelTips: isKn 
            ? 'ಕುಡಿಯುವ ನೀರು ಮತ್ತು ದೇವಾಲಯದ ನಿಯಮಗಳಿಗೆ ತಕ್ಕ ಉಡುಪು ಧರಿಸಿ.' 
            : 'Carry drinking water, sunscreen, and modest clothing for heritage and temple sites.'
        }
      ],
      afternoon: [
        {
          id: `act-a-${d}`,
          timeSlot: 'afternoon',
          title: isKn
            ? `ಸಾಂಪ್ರದಾಯಿಕ ಊಟ & ${dest.mainAttractions[1] || 'ಪ್ರಸಿದ್ಧ ಸ್ಥಳ'}`
            : `Traditional Lunch & ${dest.mainAttractions[1] || 'Scenic Viewpoint'}`,
          description: isKn
            ? `ಪ್ರಾದೇಶಿಕ ವಿಶೇಷ ಊಟ (ಉಡುಪಿ ಸಾತ್ವಿಕ ಊಟ / ಮಲೆನಾಡು ರುಚಿಗಳು) ಸೇವಿಸಿದ ನಂತರ ${dest.mainAttractions[1] || destDisplayName} ವೀಕ್ಷಣೆ.`
            : `Savour regional local cuisine (Udupi meals / Malenadu lunch / North Karnataka Jolada Rotti) followed by an insightful tour of ${dest.mainAttractions[1] || dest.name}.`,
          locationName: destDistrictName,
          durationHours: 3.5,
          estimatedCostInr: Math.round(tierCostPerDay.food * 0.4 * travellers),
          travelTips: isKn ? 'ಸ್ಥಳೀಯ ಸಿಹಿ ತಿನಿಸುಗಳು ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಸವಿಯಿರಿ.' : 'Try local specialty sweets and filter coffee.'
        }
      ],
      evening: [
        {
          id: `act-e-${d}`,
          timeSlot: 'evening',
          title: isFinalDay
            ? (isKn ? `${originCityName} ಗೆ ಮರಳಿ ಪ್ರಯಾಣ` : `Return Drive to ${originCityName}`)
            : (isKn ? `${dest.mainAttractions[2] || 'ಸೂರ್ಯಾಸ್ತ'} ಹಾಗೂ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆ` : `Sunset Vista & Evening Stroll at ${dest.mainAttractions[2] || 'Promenade / Bazaar'}`),
          description: isFinalDay
            ? (isKn ? `${originCityName} ಕಡೆಗೆ ಹೆದ್ದಾರಿ ಮೂಲಕ ಆರಾಮದಾಯಕ ಮರಳಿ ಪ್ರಯಾಣ. ದಾರಿಯಲ್ಲಿ ಉಪಹಾರ ಮತ್ತು ನೆನಪಿನ ವಸ್ತುಗಳ ಖರೀದಿ.` : `Scenic return highway journey back to ${originCityName}. Stop for highway refreshments and snacks en-route.`)
            : (isKn ? `${dest.mainAttractions[2] || destDisplayName} ಪರಿಸರದಲ್ಲಿ ರಮಣೀಯ ಸೂರ್ಯಾಸ್ತ ವೀಕ್ಷಣೆ ಮತ್ತು ಕರಕುಶಲ ವಸ್ತುಗಳ ಮಾರುಕಟ್ಟೆ ಭೇಟಿ.` : `Relaxing sunset experience at ${dest.mainAttractions[2] || dest.name}, followed by walking through local artisan markets.`),
          locationName: isFinalDay ? `${destDisplayName} / NH 275` : destDisplayName,
          durationHours: isFinalDay ? 3.5 : 2.5,
          estimatedCostInr: (isFinalDay ? 150 : 200) * travellers,
          travelTips: isFinalDay
            ? (isKn ? 'ಹೆದ್ದಾರಿಯ ಟೋಲ್ ಮತ್ತು ಸಂಜೆ ದಟ್ಟಣೆಯನ್ನು ತಪ್ಪಿಸಲು ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಹೊರಡಿ.' : 'Depart early to avoid evening peak commuter traffic on highway entry points.')
            : (isKn ? 'ಜಿಐ ಮಾನ್ಯತೆಯ ಕರಕುಶಲ ವಸ್ತುಗಳು ಮತ್ತು ನೆನಪಿನ ಕಾಣಿಕೆಗಳಿಗೆ ಸೂಕ್ತ ಸಮಯ.' : 'Great time for photography and purchasing local GI-tagged handicrafts.')
        }
      ],
      stayRecommendation: isFinalDay
        ? {
            type: isKn ? 'ಮರಳಿ ಪ್ರಯಾಣ' : 'Return Journey',
            suggestedArea: isKn ? `${originCityName} ಗೆ ತಲುಪುವುದು` : `Reach ${originCityName}`,
            estimatedCostInr: 0
          }
        : {
            type: isKn
              ? (tier === 'premium' ? 'ಐಷಾರಾಮಿ ರೆಸಾರ್ಟ್ / ಅರಮನೆ ತಂಗುದಾಣ' : tier === 'comfort' ? 'ಕಾಫಿ ಎಸ್ಟೇಟ್ ಹೋಮ್‌ಸ್ಟೇ / ಪಾರಂಪರಿಕ ಹೋಟೆಲ್' : 'ಸ್ವಚ್ಛ ಬಜೆಟ್ ಹೋಟೆಲ್')
              : (tier === 'premium' ? 'Luxury Resort / Palace Stay' : tier === 'comfort' ? 'Plantation Homestay / Heritage Hotel' : 'Clean Budget Stay / Guest House'),
            suggestedArea: `${dest.district} Central or Scenic Suburb`,
            estimatedCostInr: tierCostPerDay.stay
          },
      dailyTravelDistanceKm: travelDist,
      dailyNotes: isFinalDay
        ? (isKn ? `${originCityName} ಗೆ ಸುಖಕರ ಮರಳಿ ಪ್ರಯಾಣ. ವಾಹನದ ಇಂಧನ ಮತ್ತು ಫಾಸ್ಟ್ಯಾಗ್ ಪರಿಶೀಲಿಸಿ.` : `Comfortable return journey to ${originCityName}. Check vehicle fuel and Fastag balance.`)
        : (isKn ? `ಅಧಿಕೃತ ಪ್ರವೇಶ ಸಮಯ: ${dest.openingHours}` : `Pace yourself and respect local customs. Verified opening hours: ${dest.openingHours}`)
    });
  }

  // Budget calculations
  const totalStay = tierCostPerDay.stay * Math.max(duration - 1, 1);
  const totalFood = tierCostPerDay.food * duration * travellers;
  const totalTransport = tierCostPerDay.transport * duration * (input.transportMode === 'car' ? 1.5 : 1);
  const totalActivities = 350 * duration * travellers;
  const totalLocal = tierCostPerDay.local * duration;
  const subtotal = totalStay + totalFood + totalTransport + totalActivities + totalLocal;
  const contingency = Math.round(subtotal * 0.1);
  const totalEstimated = subtotal + contingency;
  const perPerson = Math.round(totalEstimated / travellers);

  const userBudget = input.budgetInr || (tier === 'budget' ? 12000 : tier === 'comfort' ? 25000 : 50000);
  let budgetStatus: 'within_budget' | 'moderate_exceed' | 'significant_exceed' = 'within_budget';
  if (totalEstimated > userBudget * 1.25) {
    budgetStatus = 'significant_exceed';
  } else if (totalEstimated > userBudget) {
    budgetStatus = 'moderate_exceed';
  }

  const primaryDestName = isKn ? (selectedDests[0]?.kannadaName || 'ಕರ್ನಾಟಕ') : (selectedDests[0]?.name || 'Karnataka');
  const generatedTitle = isKn
    ? `${duration} ದಿನಗಳ ಸುಂದರ ${primaryDestName} ಕರ್ನಾಟಕ ಪ್ರವಾಸ`
    : `${duration}-Day Journey through ${primaryDestName} & Malenadu`;

  return {
    id: `plan-${Date.now()}`,
    tripTitle: generatedTitle,
    title: generatedTitle,
    createdAt: new Date().toISOString(),
    originCity: safeInput.originCity || (isKn ? 'ಬೆಂಗಳೂರು' : 'Bengaluru'),
    destinationPreferences: safeInput.destinationPreferences,
    startDate: safeInput.startDate && !isNaN(new Date(safeInput.startDate).getTime())
      ? safeInput.startDate
      : new Date().toISOString().split('T')[0],
    endDate: safeInput.endDate && !isNaN(new Date(safeInput.endDate).getTime())
      ? safeInput.endDate
      : new Date(Date.now() + duration * 86400000).toISOString().split('T')[0],
    durationDays: duration,
    travellersCount: travellers,
    budgetTier: tier,
    budgetInr: userBudget,
    transportMode: safeInput.transportMode || 'car',
    accommodationType: safeInput.accommodationPreference || 'homestay',
    interests: safeInput.interests,
    days,
    budgetBreakdown: {
      transportInr: Math.round(totalTransport),
      accommodationInr: Math.round(totalStay),
      foodInr: Math.round(totalFood),
      activitiesAndEntryInr: Math.round(totalActivities),
      localTransportInr: Math.round(totalLocal),
      contingencyInr: Math.round(contingency),
      totalEstimatedInr: Math.round(totalEstimated),
      totalEstimatedBudgetInr: Math.round(totalEstimated),
      perPersonInr: perPerson,
      userBudgetInr: userBudget,
      budgetStatus,
      assumptions: isKn ? [
        `${travellers} ಪ್ರಯಾಣಿಕರಿಗೆ ${duration} ದಿನಗಳ ಪ್ರವಾಸದ ಅಂದಾಜು.`,
        'ಡಬಲ್ ಆಕ್ಯುಪೆನ್ಸಿ ರೂಮ್ ಆಧಾರದ ಮೇಲೆ ವಸತಿ ವೆಚ್ಚ.',
        'ಇಂಧನ, ಟೋಲ್ ಅಥವಾ KSRTC ಎಕ್ಸ್‌ಪ್ರೆಸ್ ಬಸ್ ದರಗಳು ಸೇರಿವೆ.',
        'ASI ಮತ್ತು ಅರಣ್ಯ ಇಲಾಖೆಯ ಅಧಿಕೃತ ಪ್ರವೇಶ ದರಗಳ ಪ್ರಕಾರ ಲೆಕ್ಕಾಚಾರ.'
      ] : [
        `Calculated for ${travellers} traveller(s) over ${duration} day(s) at ${tier} tier.`,
        'Includes double-occupancy hotel/homestay rooms.',
        'Transport estimate accounts for fuel, tolls, or state express bus fares.',
        'Entry tickets verified against published ASI and Karnataka Forest Dept tariffs.'
      ],
      savingsTips: isKn ? [
        'KSRTC ಐರಾವತ ಬಸ್ ಅಥವಾ ರೈಲು ಮುಂಗಡ ಬುಕಿಂಗ್ ಮಾಡುವುದರಿಂದ ಸಾರಿಗೆ ವೆಚ್ಚದಲ್ಲಿ ಶೇ 40% ಉಳಿತಾಯವಾಗುತ್ತದೆ.',
        'ಪರಿಶೀಲಿಸಿದ ಕಾಫಿ ಎಸ್ಟೇಟ್ ಹೋಮ್‌ಸ್ಟೇಗಳಲ್ಲಿ ಮನೆ ಅಡುಗೆ ಉಪಹಾರ ಲಭ್ಯವಿರುತ್ತದೆ.',
        'ಹಂಪಿ ಹಾಗೂ ಪಟ್ಟದಕಲ್ಲಿನಲ್ಲಿ ASI ಸಂಯುಕ್ತ ಟಿಕೆಟ್‌ಗಳು ಉಪಯುಕ್ತವಾಗಿವೆ.'
      ] : [
        'Booking KSRTC Airavat buses or trains reduces transport expenses by up to 40% compared to private cabs.',
        'Staying at verified plantation homestays includes home-cooked Malenadu breakfasts and dinners.',
        'Composite ASI tickets in Hampi and Pattadakal provide substantial savings over individual site entries.'
      ]
    },
    routeSummary: {
      totalDistanceKm: cumulativeDistanceKm,
      recommendedHubs: Array.from(new Set(selectedDests.map(d => isKn ? d.kannadaName : d.name))),
      routeFeasibilityNote: isKn
        ? `ಒಟ್ಟು ಅಂದಾಜು ರಸ್ತೆ ಪ್ರಯಾಣ ದೂರ ${cumulativeDistanceKm} ಕಿ.ಮೀ. ದಿನಕ್ಕೆ ಸರಾಸರಿ 2-3 ಗಂಟೆಗಳ ಆರಾಮದಾಯಕ ಚಾಲನೆ.`
        : `Total driving distance is approximately ${cumulativeDistanceKm} km across ${duration} days. Daily drive time averages 2-3 hours, leaving ample daylight for sightseeing and relaxation.`
    },
    usefulKannadaPhrases: [
      {
        kannada: 'ನಮಸ್ಕಾರ, ಈ ದಾರಿ ದೇವಸ್ಥಾನಕ್ಕೆ ಹೋಗುತ್ತದೆಯೇ?',
        transliteration: 'Namaskāra, ī dāri dēvasthānakke hōguttadeyē?',
        english: 'Hello, does this road lead to the temple?',
        context: isKn ? 'ದಾರಿ ದೃಢಪಡಿಸಿಕೊಳ್ಳಲು' : 'Use when confirming routes with locals along the circuit.'
      },
      {
        kannada: 'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ',
        transliteration: 'Ondu masāle dōse mattu bisi philṭar kāphi koḍi',
        english: 'Please give one masala dosa and hot filter coffee',
        context: isKn ? 'ಬೆಳಗಿನ ಉಪಹಾರಕ್ಕೆ' : 'Essential morning order at Karnataka breakfast joints.'
      },
      {
        kannada: 'ಬಸ್ ಯಾವಾಗ ಹೊರಡುತ್ತದೆ?',
        transliteration: 'Bas yāvāga horaḍuttade?',
        english: 'When does the bus depart?',
        context: isKn ? 'ಬಸ್ ನಿಲ್ದಾಣದಲ್ಲಿ' : 'Enquiring at transit hubs or bus stands.'
      },
      {
        kannada: 'ಧನ್ಯವಾದಗಳು, ಊಟ ತುಂಬಾ ರುಚಿಯಾಗಿತ್ತು!',
        transliteration: 'Dhanyavādagaḷu, ūṭa tumbā ruciyāgittu!',
        english: 'Thank you, the meal was delicious!',
        context: isKn ? 'ಆತಿಥ್ಯ ಮೆಚ್ಚುಗೆಗೆ' : 'Showing gratitude to homestay hosts.'
      }
    ],
    warningsAndAdvisories: isKn ? [
      'ಘಾಟಿ ರಸ್ತೆಗಳಲ್ಲಿ (ಚಾರ್ಮಾಡಿ, ಶಿರಾಡಿ, ಆಗುಂಬೆ) ಮಂಜು ಇರುವುದರಿಂದ ನಿಧಾನ ಚಾಲನೆ ಮಾಡಿ.',
      'ಉಡುಪಿ ಶ್ರೀ ಕೃಷ್ಣ ಮಠ, ಗೋಕರ್ಣ ಮಹಾಬಲೇಶ್ವರ ಹಾಗೂ ಹಂಪಿ ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯಗಳಲ್ಲಿ ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಪು ಕಡ್ಡಾಯ.',
      'ಕುದುರೆಮುಖ, ಸೇಂಟ್ ಮೇರೀಸ್ ದ್ವೀಪ ಮತ್ತು ಕಬಿನಿಯಲ್ಲಿ ಪ್ಲಾಸ್ಟಿಕ್ ಬಾಟಲಿಗಳು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ.'
    ] : [
      'Ghat section roads (Charmadi, Shiradi, Agumbe) can experience heavy fog and rainfall; maintain low gears.',
      'Temple dress code: Modest attire required at Sri Krishna Matha Udupi, Mahabaleshwar Gokarna, and Virupaksha Hampi.',
      'Plastic-free zones are strictly enforced at Kudremukh, St. Mary’s Islands, and Kabini Tiger Reserve; carry reusable bottles.'
    ],
    alternativeDestinations: [
      {
        name: isKn ? 'ಬೇಲೂರು & ಹಳೇಬೀಡು' : 'Belur & Halebidu',
        district: isKn ? 'ಹಾಸನ' : 'Hassan',
        whyRecommend: isKn ? 'ಯುನೆಸ್ಕೋ ಹೊಯ್ಸಳ ದೇವಾಲಯಗಳ ವಿಶ್ವವಿಖ್ಯಾತ ಶಿಲ್ಪಕಲೆ.' : 'UNESCO Hoysala temples on the route between Bengaluru and Chikkamagaluru.'
      },
      {
        name: isKn ? 'ಮುರುಡೇಶ್ವರ' : 'Murudeshwar',
        district: isKn ? 'ಉತ್ತರ ಕನ್ನಡ' : 'Uttara Kannada',
        whyRecommend: isKn ? 'ಬೃಹತ್ ಸಮುದ್ರತೀರದ ಶಿವನ ಮೂರ್ತಿ ಮತ್ತು 20 ಅಂತಸ್ತಿನ ರಾಜಗೋಪುರ.' : 'Giant seaside Shiva statue and Raja Gopura directly accessible along NH 66.'
      }
    ],
    isAiGenerated: false
  };
}
