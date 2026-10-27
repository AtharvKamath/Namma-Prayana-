# Namma Prayana – AI Travel Planner for Karnataka

**Tagline: Your Journey, Your Story**

Namma Prayana (ನಮ್ಮ ಪ್ರಯಾಣ) is an AI-based travel planning web application designed to help users explore Karnataka and plan personalized trips. It combines destination discovery, AI-generated itineraries, budget information, Kannada language support, and links to travel services in one platform.

## 🌐 Live Demo

- **Website:** https://namma-prayana.ai.studio
- **GitHub Repository:** https://github.com/AtharvKamath/Namma-Prayana-

## 📌 Problem Statement

Planning a trip often requires travellers to search across multiple websites for tourist destinations, activities, budgets, transportation, and accommodation options. This process can be time-consuming, especially for people who need personalized recommendations or prefer using Kannada.

Namma Prayana aims to make Karnataka travel planning simpler by bringing destination exploration and personalized itinerary planning together in one web application.

## 💡 Our Solution

Namma Prayana provides a single platform where users can discover places in Karnataka, enter their travel preferences, and generate a suggested itinerary using AI.

The application is designed to make travel planning more convenient and accessible, including for Kannada-speaking users.

## ✨ Key Features

- **AI-Based Trip Planning:** Generate personalized travel itineraries using Gemini AI when the AI service is enabled and available.
- **Personalized Preferences:** Plan trips based on starting location, duration, interests, budget, group size, and transport preferences, where supported by the application.
- **Explore Karnataka:** Discover tourist destinations across categories such as beaches, temples, waterfalls, and hill stations.
- **Day-by-Day Itinerary:** View suggested activities organized by day and time of day.
- **Budget Information:** View estimated trip expenses to help with travel planning.
- **Kannada Language Support:** Access supported interface content in Kannada.
- **Transport and Hotel Links:** Explore links to external travel and accommodation services.
- **Fallback Itinerary Generation:** Use the configured fallback itinerary system when Gemini AI generation is disabled or unavailable, where supported by the application.

*Feature availability may depend on application configuration, network connectivity, and the status of external services.*

## 🛠️ Technology Stack

The project uses the following technologies and services. Confirm the exact dependencies and configuration in the source code before modifying this list.

- **Frontend:** React, TypeScript, Vite
- **AI Integration:** Google Gemini API
- **Backend:** Server-side API for itinerary generation
- **Authentication and Data:** Firebase Authentication and Cloud Firestore, where configured
- **Maps and Places:** Google Maps Platform integrations, where configured
- **Version Control:** Git and GitHub
- **Deployment:** Google AI Studio-hosted application

## 🏗️ High-Level Architecture

```text
             User
              |
              v
     React + TypeScript UI
              |
              v
       Trip Planner Form
              |
              v
       Server-Side API
              |
              v
      Itinerary Generator
              |
        +-----+------+
        |            |
        v            v
    Gemini AI    Fallback
                 Itineraries
        |            |
        +-----+------+
              |
              v
      Generated Itinerary
              |
              v
      Results shown to User
```

Additional application services may include Firebase Authentication, Cloud Firestore, and Google Maps Platform integrations, depending on the configured features.

### How It Works

1. The user opens Namma Prayana and explores Karnataka destinations.
2. The user enters trip preferences in the trip planner.
3. The frontend sends the itinerary request to the server-side API.
4. The server generates a suggested itinerary using Gemini AI when enabled, or the configured fallback system.
5. The generated itinerary is returned to the application and displayed to the user.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Install the following tools:

- Node.js
- npm
- Git

You may also need API credentials for the external services you intend to enable.

### 1. Clone the Repository

```bash
git clone https://github.com/AtharvKamath/Namma-Prayana-.git
```

### 2. Open the Project Folder

```bash
cd Namma-Prayana-
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Check the repository's `.env.example` file for the variables supported by your version of the application.

Create a local `.env` file and configure the values required for your intended setup.

Example:

```env
ENABLE_GEMINI_AI=false
GEMINI_API_KEY=your_gemini_api_key
APP_URL=your_application_url
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

These are illustrative placeholders. Use the exact variable names and formats expected by the source code and deployment environment.

**Security:** Never commit real API keys, passwords, service-account credentials, or other secrets to GitHub. Keep server-side secrets on the server and use environment variables in the deployment platform.

### 5. Start the Application

Check `package.json` for the project's available scripts. If the following scripts are defined, use:

```bash
npm run dev
```

For a production build, if supported by the project:

```bash
npm run build
```

Use the actual scripts in `package.json` if they differ from these examples.

## 🔐 Security and Configuration

- Keep Gemini API credentials on the server side.
- Do not expose server-side secrets in frontend code.
- Do not commit `.env` files containing real credentials.
- Configure Firebase and Google Maps credentials according to the requirements of the enabled features.
- Restrict API usage and permissions appropriately for your deployment.

## ⚠️ Limitations

- AI-generated itineraries are suggestions and may require verification.
- Estimated costs can differ from actual travel expenses.
- Transport, hotel, map, and other external services may change their availability, prices, or information.
- The application does not guarantee bookings or real-time availability unless a service explicitly provides that functionality.
- Internet access and external API availability may affect some features.

## 🔮 Future Enhancements

Potential future improvements include:

- More accurate destination information and verified travel details.
- Improved route planning and travel-time estimates.
- Additional travel-service integrations.
- Expanded Kannada translations.
- Enhanced itinerary customization and accessibility.
- More comprehensive testing of AI-generated travel plans.

## 🎯 Project Objective

The goal of Namma Prayana is to make Karnataka tourism easier to explore by bringing AI-assisted trip planning, destination discovery, and Kannada language support together in one accessible platform.

## 👨‍💻 Project Information

- **Project:** Namma Prayana
- **Hackathon:** Kannada Digital Innovation Hackathon 2026
- **Problem Statement:** AI Travel Planner for Karnataka
- **Repository:** https://github.com/AtharvKamath/Namma-Prayana-
- **Live Demo:** https://namma-prayana.ai.studio

---

**Namma Prayana – Your Journey, Your Story.**
