import type { KannadaPhrase } from '../types/travel.ts';

export const KANNADA_PHRASES: KannadaPhrase[] = [
  // Greetings & Essentials
  {
    id: 'g-1',
    category: 'greetings',
    categoryLabel: 'Greetings & Courtesies',
    kannada: 'ನಮಸ್ಕಾರ',
    transliteration: 'Namaskāra',
    english: 'Hello / Greetings (formal and universally respectful)',
    audioPronunciationText: 'Namaskaara',
    contextUsage: 'Use whenever meeting hotel staff, elders, shopkeepers, or locals.'
  },
  {
    id: 'g-2',
    category: 'greetings',
    categoryLabel: 'Greetings & Courtesies',
    kannada: 'ಧನ್ಯವಾದಗಳು',
    transliteration: 'Dhanyavādagaḷu',
    english: 'Thank you very much',
    audioPronunciationText: 'Dhanyavaadagalu',
    contextUsage: 'Expressing gratitude to drivers, guides, restaurant servers.'
  },
  {
    id: 'g-3',
    category: 'greetings',
    categoryLabel: 'Greetings & Courtesies',
    kannada: 'ಹೌದು / ಇಲ್ಲ',
    transliteration: 'Haudu / Illa',
    english: 'Yes / No',
    audioPronunciationText: 'Haudu / Illa',
    contextUsage: 'Simple affirmative or polite refusal.'
  },
  {
    id: 'g-4',
    category: 'greetings',
    categoryLabel: 'Greetings & Courtesies',
    kannada: 'ನೀವು ಹೇಗಿದ್ದೀರಾ? ನಾನು ಆರಾಮಾಗಿದ್ದೇನೆ.',
    transliteration: 'Nīvu hēgiddīrā? Nānu ārāmāgiddēne.',
    english: 'How are you? I am doing well.',
    audioPronunciationText: 'Neevu hegiddeera? Naanu aaraamaagiddene.',
    contextUsage: 'Friendly conversation starter with homestay hosts or locals.'
  },
  {
    id: 'g-5',
    category: 'greetings',
    categoryLabel: 'Greetings & Courtesies',
    kannada: 'ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ',
    transliteration: 'Dayaviṭṭu svalpa nidhānavāgi mātanāḍi',
    english: 'Please speak a little slowly',
    audioPronunciationText: 'Dayavittu svalpa nidhaanavaagi maatanaadi',
    contextUsage: 'When someone speaks Kannada quickly.'
  },

  // Directions
  {
    id: 'd-1',
    category: 'directions',
    categoryLabel: 'Asking for Directions',
    kannada: 'ಈ ದಾರಿ ಹಂಪಿಗೆ ಹೋಗುತ್ತದೆಯೇ?',
    transliteration: 'Ī dāri Hampige hōguttadeyē?',
    english: 'Does this road go to Hampi?',
    audioPronunciationText: 'Ee daari Hampige hooguttadeye?',
    contextUsage: 'Asking highway junctions or villagers for route verification.'
  },
  {
    id: 'd-2',
    category: 'directions',
    categoryLabel: 'Asking for Directions',
    kannada: 'ಇಲ್ಲಿಂದ ದೇವಸ್ಥಾನ ಎಷ್ಟು ದೂರವಿದೆ?',
    transliteration: 'Illinda dēvasthāna eṣṭu dūravide?',
    english: 'How far is the temple from here?',
    audioPronunciationText: 'Illinda devasthaana eshtu dooravide?',
    contextUsage: 'Checking distance to walking or driving sights.'
  },
  {
    id: 'd-3',
    category: 'directions',
    categoryLabel: 'Asking for Directions',
    kannada: 'ಬಲಕ್ಕೆ ತಿರುಗಿ / ಎಡಕ್ಕೆ ತಿರುಗಿ / ನೇರವಾಗಿ ಹೋಗಿ',
    transliteration: 'Balakke tirugi / Eḍakke tirugi / Nēravāgi hōgi',
    english: 'Turn right / Turn left / Go straight',
    audioPronunciationText: 'Balakke tirugi / Edakke tirugi / Neravaagi hoogi',
    contextUsage: 'Understanding or giving instructions to auto or cab drivers.'
  },
  {
    id: 'd-4',
    category: 'directions',
    categoryLabel: 'Asking for Directions',
    kannada: 'ಹತ್ತಿರದ ಪೆಟ್ರೋಲ್ ಬಂಕ್ ಎಲ್ಲಿದೆ?',
    transliteration: 'Hattirada peṭrōl baṅk ellide?',
    english: 'Where is the nearest petrol pump?',
    audioPronunciationText: 'Hattirada petrol bunk ellide?',
    contextUsage: 'Crucial on Western Ghats road trips (Chikmagalur, Coorg, Kudremukh).'
  },

  // Transport & Buses
  {
    id: 't-1',
    category: 'transport',
    categoryLabel: 'Buses, Trains & Autos',
    kannada: 'ಮೈಸೂರಿಗೆ ಮುಂದಿನ ಬಸ್ ಯಾವಾಗ?',
    transliteration: 'Maisūrige mundina bas yāvāga?',
    english: 'When is the next bus to Mysuru?',
    audioPronunciationText: 'Mysurige mundina bus yaavaaga?',
    contextUsage: 'Asking at KSRTC bus stands or enquiry counters.'
  },
  {
    id: 't-2',
    category: 'transport',
    categoryLabel: 'Buses, Trains & Autos',
    kannada: 'ಟಿಕೆಟ್‌ಗೆ ಎಷ್ಟು ರೂಪಾಯಿ?',
    transliteration: 'Ṭikeṭ-ge eṣṭu rūpāyi?',
    english: 'How much rupees is the ticket?',
    audioPronunciationText: 'Ticket-ge eshtu roopaayi?',
    contextUsage: 'Buying local transport, bus tickets, or entry tokens.'
  },
  {
    id: 't-3',
    category: 'transport',
    categoryLabel: 'Buses, Trains & Autos',
    kannada: 'ದಯವಿಟ್ಟು ಬಸ್ ನಿಲ್ಲಿಸಿ, ನಾನು ಇಲ್ಲಿ ಇಳಿಯಬೇಕು',
    transliteration: 'Dayaviṭṭu bas nillisi, nānu illi iḷiyabēku',
    english: 'Please stop the bus, I need to get down here',
    audioPronunciationText: 'Dayavittu bus nillisi, naanu illi iliyabeku',
    contextUsage: 'Telling bus conductor or auto driver you arrived at your stop.'
  },
  {
    id: 't-4',
    category: 'transport',
    categoryLabel: 'Buses, Trains & Autos',
    kannada: 'ಆಟೋ ಮೀಟರ್ ಹಾಕಿ ಹೋಗಿ',
    transliteration: 'Āṭō mīṭar hāki hōgi',
    english: 'Please put on the auto meter',
    audioPronunciationText: 'Auto meter haaki hoogi',
    contextUsage: 'Hiring autos in Bengaluru, Mysuru, or Mangaluru.'
  },

  // Food & Dining
  {
    id: 'f-1',
    category: 'food',
    categoryLabel: 'Food & Coffee',
    kannada: 'ಒಂದು ಮಸಾಲೆ ದೋಸೆ ಮತ್ತು ಬಿಸಿ ಫಿಲ್ಟರ್ ಕಾಫಿ ಕೊಡಿ',
    transliteration: 'Ondu masāle dōse mattu bisi philṭar kāphi koḍi',
    english: 'Please give one masala dosa and hot filter coffee',
    audioPronunciationText: 'Ondu masaale dosey mattu bisi filter coffee kodi',
    contextUsage: 'The essential Karnataka breakfast order at Darshinis & cafes.'
  },
  {
    id: 'f-2',
    category: 'food',
    categoryLabel: 'Food & Coffee',
    kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಖಾರ ಮಾಡಿ',
    transliteration: 'Svalpa kaḍime khāra māḍi',
    english: 'Please make it less spicy',
    audioPronunciationText: 'Svalpa kadime khaara maadi',
    contextUsage: 'When ordering spicy Malenadu or coastal curries.'
  },
  {
    id: 'f-3',
    category: 'food',
    categoryLabel: 'Food & Coffee',
    kannada: 'ಕುಡಿಯುವ ನೀರು ಕೊಡಿ',
    transliteration: 'Kuḍiyuva nīru koḍi',
    english: 'Please provide drinking water',
    audioPronunciationText: 'Kudiyuva neeru kodi',
    contextUsage: 'Requesting potable or bottled drinking water.'
  },
  {
    id: 'f-4',
    category: 'food',
    categoryLabel: 'Food & Coffee',
    kannada: 'ಊಟ ತುಂಬಾ ರುಚಿಯಾಗಿತ್ತು!',
    transliteration: 'Ūṭa tumbā ruciyāgittu!',
    english: 'The meal was delicious!',
    audioPronunciationText: 'Oota tumba ruchiyaagittu!',
    contextUsage: 'Complimenting homestay cook or restaurant chef.'
  },

  // Hotels & Stays
  {
    id: 'h-1',
    category: 'hotels',
    categoryLabel: 'Hotels & Homestays',
    kannada: 'ರೂಮ್ ಖಾಲಿ ಇದೆಯಾ?',
    transliteration: 'Rūm khāli ideyā?',
    english: 'Are there any rooms available / vacant?',
    audioPronunciationText: 'Room khaali ideya?',
    contextUsage: 'Walk-in hotel or homestay enquiry.'
  },
  {
    id: 'h-2',
    category: 'hotels',
    categoryLabel: 'Hotels & Homestays',
    kannada: 'ಒಂದು ದಿನಕ್ಕೆ ಬಾಡಿಗೆ ಎಷ್ಟು?',
    transliteration: 'Ondu dinakke bāḍige eṣṭu?',
    english: 'What is the tariff per day?',
    audioPronunciationText: 'Ondu dinakke baadige eshtu?',
    contextUsage: 'Checking room or homestay night tariff.'
  },
  {
    id: 'h-3',
    category: 'hotels',
    categoryLabel: 'Hotels & Homestays',
    kannada: 'ಬಿಸಿ ನೀರು ಬರುತ್ತದೆಯೇ?',
    transliteration: 'Bisi nīru baruttadeyē?',
    english: 'Is hot water available?',
    audioPronunciationText: 'Bisi neeru baruttadeye?',
    contextUsage: 'Essential in chilly hill stations like Coorg and Chikkamagaluru.'
  },
  {
    id: 'h-4',
    category: 'hotels',
    categoryLabel: 'Hotels & Homestays',
    kannada: 'ವೈ-ಫೈ ಪಾಸ್‌ವರ್ಡ್ ಏನು?',
    transliteration: 'Vai-Phai pās-varḍ ēnu?',
    english: 'What is the Wi-Fi password?',
    audioPronunciationText: 'Wi-Fi password yenu?',
    contextUsage: 'Checking internet credentials at your stay.'
  },

  // Shopping & Bargaining
  {
    id: 's-1',
    category: 'shopping',
    categoryLabel: 'Shopping & Markets',
    kannada: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
    transliteration: 'Idara bele eṣṭu?',
    english: 'How much does this cost?',
    audioPronunciationText: 'Idara beley eshtu?',
    contextUsage: 'Asking price at handicrafts, silk, spice, or fruit markets.'
  },
  {
    id: 's-2',
    category: 'shopping',
    categoryLabel: 'Shopping & Markets',
    kannada: 'ಸ್ವಲ್ಪ ಕಡಿಮೆ ಮಾಡಿ / ರಿಯಾಯಿತಿ ಇದೆಯಾ?',
    transliteration: 'Svalpa kaḍime māḍi / Riyāyiti ideyā?',
    english: 'Please reduce the price a little / Is there a discount?',
    audioPronunciationText: 'Svalpa kadime maadi / Riyaayiti ideya?',
    contextUsage: 'Polite bargaining at street markets and souvenir stalls.'
  },
  {
    id: 's-3',
    category: 'shopping',
    categoryLabel: 'Shopping & Markets',
    kannada: 'ಇದು ಶುದ್ಧ ಶ್ರೀಗಂಧವೇ?',
    transliteration: 'Idu śuddha Śrīganghavē?',
    english: 'Is this authentic sandalwood?',
    audioPronunciationText: 'Idu shuddha shreegandhave?',
    contextUsage: 'When buying Mysore sandalwood soap or carvings (Cauvery Arts Emporium is recommended).'
  },

  // Emergency & Assistance
  {
    id: 'e-1',
    category: 'emergency',
    categoryLabel: 'Emergency & Help',
    kannada: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ',
    transliteration: 'Dayaviṭṭu nanage sahāya māḍi',
    english: 'Please help me',
    audioPronunciationText: 'Dayavittu nanage sahaaya maadi',
    contextUsage: 'Universal emergency cry for urgent assistance.'
  },
  {
    id: 'e-2',
    category: 'emergency',
    categoryLabel: 'Emergency & Help',
    kannada: 'ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಅಥವಾ ಕ್ಲಿನಿಕ್ ಎಲ್ಲಿದೆ?',
    transliteration: 'Hattirada āspatre athavā klinīk ellide?',
    english: 'Where is the nearest hospital or clinic?',
    audioPronunciationText: 'Hattirada aaspatrey athava clinic ellide?',
    contextUsage: 'Medical emergencies.'
  },
  {
    id: 'e-3',
    category: 'emergency',
    categoryLabel: 'Emergency & Help',
    kannada: 'ಪೊಲೀಸ್ ಠಾಣೆ ಎಲ್ಲಿದೆ?',
    transliteration: 'Polīs ṭhāṇe ellide?',
    english: 'Where is the police station?',
    audioPronunciationText: 'Police thaane ellide?',
    contextUsage: 'Safety, lost property, or emergency reporting.'
  },
  {
    id: 'e-4',
    category: 'emergency',
    categoryLabel: 'Emergency & Help',
    kannada: 'ತುರ್ತು ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ ೧೧೨ (112)',
    transliteration: 'Turtu sahāyavāṇi saṅkhye 112',
    english: 'Emergency Helpline Number is 112 (Police / Fire / Ambulance)',
    audioPronunciationText: 'Turtu sahaayavaani sankhye 112',
    contextUsage: 'All-in-one emergency dispatch in Karnataka.'
  }
];
