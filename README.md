# Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ) — "Your Journey, Your Story"

> Discover Karnataka. Plan smarter. Travel better.

A modern, production-minded, full-stack travel-planning web application crafted specifically for exploring Karnataka, India. Namma Prayana combines verified destination research, Google Maps Platform geospatial routing, Gemini AI itinerary intelligence, multi-provider travel booking discovery (KSRTC, redBus, AbhiBus, MakeMyTrip, Goibibo, IRCTC), authentic Kannada language assistance, and transparent expense estimation.

---

## 1. Problem Being Solved

Travel planning across Karnataka is traditionally fragmented:
- Travellers struggle to gauge real driving distances between destinations across the Western Ghats (e.g., steep ghat sections like Charmadi or Shiradi Ghat vs. flat expressway corridors like Bengaluru-Mysuru).
- Generic AI tools invent non-existent attractions or propose geographically unfeasible day plans (e.g. attempting to visit Hampi, Gokarna, and Coorg in a single weekend).
- Unofficial booking sites confuse travellers with fabricated discounts or fake seat confirmation claims.
- Travellers lack authentic, respectful Kannada language travel phrases when interacting with local bus conductors, homestay hosts, and artisan markets.

**Namma Prayana solves this** with an integrated, verified Karnataka travel ecosystem that pairs AI creativity with grounded geographical, cultural, and budgetary realities.

---

## 2. Key Features

### 🏛️ Verified Karnataka Destination Explorer
- Curated database of 18+ premier Karnataka destinations:
  - **Heritage**: Hampi (Vijayanagara), Mysuru Palace, Badami Cave Temples, Pattadakal & Aihole, Belur & Halebidu (UNESCO Hoysala temples).
  - **Coasts & Beaches**: Gokarna & Om Beach, Udupi & Malpe Beach, St. Mary’s Islands basaltic rocks, Murudeshwar seaside gopura, Mangaluru.
  - **Hill Stations & Malenadu**: Coorg (Madikeri), Chikkamagaluru (Mullayanagiri peak & coffee cradle), Kudremukh Shola sanctuary.
  - **Waterfalls & Wildlife**: Jog Falls (Sharavathi plunge), Kabini & Nagarhole tiger reserve, Shivamogga, Dandeli whitewater rafting.
- Verified ASI & Karnataka Forest Department entry tariffs in INR.
- Official visiting hours, real GPS coordinates, accessibility notes, and heritage background.
- Direct links to Google Maps directions.

### 🤖 Gemini AI & Curated Itinerary Engine
- Personalized multi-day itinerary generation powered by **Gemini 3.8 Flash** via a secure server-side proxy route.
- Automatic clustering of geographically proximate destinations to prevent travel fatigue.
- Morning, afternoon, and evening activity timelines with estimated costs.
- Transparent budget calculations (Transport, Stays, Food, ASI Monument entries, Local transport, and 10% contingency buffer).
- Smart budget health indicators with warnings if requested journeys exceed financial constraints.
- **Fail-safe offline engine**: If Gemini API is unreachable or rate-limited, the system seamlessly generates a verified, curated Karnataka itinerary matching user inputs.

### 🗺️ Interactive Maps & Routing
- Interactive map powered by `@vis.gl/react-google-maps` using modern `AdvancedMarkerElement` and custom pin markers.
- Interactive InfoWindows showcasing destination photography, timings, and direct Google Maps navigation deep links.

### 🎟️ Travel Booking Discovery & Fare Comparison
- Dedicated booking discovery sections for **Buses**, **Hotels & Homestays**, **Flights**, and **Cabs**.
- Parameter-preserving search links into:
  - **KSRTC (Awatar)** official portal
  - **redBus** & **AbhiBus**
  - **MakeMyTrip** & **Goibibo**
  - **IRCTC** official Indian Railways portal
  - **Savaari** outstation chauffeur cabs & **Zoomcar**
- Benchmark route fares and transit duration comparisons across top Karnataka circuits (e.g., Bengaluru to Mysuru, Coorg, Hampi, Gokarna).
- Strict transparency: No fabricated live prices, fake seats, or counterfeit booking confirmations.

### 🗣️ Kannada Travel Helper (ಕನ್ನಡ ಪ್ರವಾಸ ಸಹಾಯಕ)
- Practical travel phrases organized into Greetings, Directions, Bus & Transport, Hotels, Food & Coffee, Shopping, and Emergency.
- Triple representation: Authentic Kannada script, phonetic English transliteration, and English translation.
- Natural speech playback via browser Web Speech API.
- Quick copy to clipboard with toast feedback.

### 💾 Browser-Persistent "My Trips"
- Full offline availability via `localStorage`.
- Export saved itineraries as JSON backup or print-friendly PDF guides.
- Import saved trips directly into the app.
- Interactive timeline editor: reorder days, remove stops, and customize trip notes.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React icons, Motion.
- **Maps**: Google Maps Platform via `@vis.gl/react-google-maps` with `AdvancedMarkerElement`.
- **AI**: Google Gemini API via `@google/genai` TypeScript SDK (`gemini-3.8-flash`).
- **Backend / API**: Express & Vite Connect middleware server-side API proxy.
- **Persistence**: LocalStorage with JSON Export/Import for client-side privacy and offline resilience.

---

## 4. Architecture & Data Flow

```
[User Input / UI Form]
         │
         ▼
[Client: geminiService.ts]
         │
         ├──► POST /api/itinerary/generate (Server Route)
         │           │
         │           ├──► @google/genai (Gemini 3.8 Flash)
         │           │       │
         │           │       ▼
         │           │    Valid JSON Itinerary with real Karnataka data
         │           │
         │           └──► (On quota/failure) ──► generateCuratedFallbackItinerary()
         │
         ▼
[React State / ItineraryView]
         ├──► InteractiveMap (@vis.gl/react-google-maps)
         ├──► BudgetCalculator & Savings Tips
         ├──► Kannada Travel Phrases
         └──► LocalStorage ("My Trips")
```

---

## 5. Local Development & Installation

### Prerequisites
- Node.js (version 20 or higher recommended)
- npm or bun

### Setup Commands

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd namma-prayana
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

   Configure the variables in `.env`:
   ```env
   # GEMINI_API_KEY: Injected by AI Studio or configure from Google AI Studio (https://aistudio.google.com)
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

   # VITE_GOOGLE_MAPS_API_KEY: Google Maps Platform API key
   VITE_GOOGLE_MAPS_API_KEY="YOUR_GOOGLE_MAPS_API_KEY"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

5. **Build for Production**:
   ```bash
   npm run build
   ```

6. **Run Production Server**:
   ```bash
   npm start
   ```

---

## 6. Official Data Sources & Attribution

- **Archaeological Survey of India (ASI)**: Official entry fees, opening hours, and historical background for Hampi, Badami, Pattadakal, Aihole, and Belur & Halebidu.
- **Department of Tourism, Government of Karnataka (KSTDC)**: Official tourism portal references, circuit guidelines, and destination descriptions.
- **Karnataka Forest Department (Aranya Portal)**: Permit requirements and wildlife safari details for Kudremukh, Kabini, and Nagarhole.
- **Geological Survey of India (GSI)**: Geological history of St. Mary's Islands columnar basalt rocks.
- **Imagery**: Curated high-resolution destination photography via Unsplash.

---

## 7. Emergency Contact Numbers (Karnataka)

- **National Emergency Helpline**: `112` (Police, Fire, Ambulance)
- **Karnataka State Tourism Helpline**: `1800-425-4646` / `080-22352525`
- **KSRTC Customer Care**: `080-49596666` / `7760990034`
- **Women Helpline**: `1091`
- **Wildlife & Forest Rescue**: `1926`

---

*NAMMA PRAYANA (ನಮ್ಮ ಪ್ರಯಾಣ) — Your Journey, Your Story.*
