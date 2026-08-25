# 🌍 Tourism Explorer - Hackathon Project

Welcome to the **Tourism Explorer**, a React-based interactive web application built specifically for a Hackathon. Out of the three problem statements provided, we chose the **Tourism Explorer** topic. Our goal was to build a seamless, smart, and interactive platform that makes travel planning effortless and engaging.

## 👨‍💻 Author Details

	- **Name:** Divyansh Sharma
	- **College:** Jaypee Institute of Information Technology, Noida
	- **College Enrollment Number:** 23103358
	- **Personal Email:** divyanshsharma9704@gmail.com
	- **College Email:** 23103358@mail.jiit.ac.in
	- **Phone Number:** 8081655084
	- **GitHub:** [divyansh9704](https://github.com/divyansh9704)

---

## 📒 Project Summary

Tourism Explorer is an intelligent destination discovery module. It allows users to search any city in the world, or use their current GPS location, to instantly view top attractions, museums, and parks. By integrating Geoapify for real-time location data and mapping, coupled with an AI Travel Assistant (Llama 3), this project acts as a comprehensive, one-stop-trip-planner.

## 🎸 Interface & WX (Design Experience)

	- **Dynamic Hero Section:** A visually striking, gradient-layered world map background that immediately sets the travel theme, housing a global search bar for instant navigation.
	- **Dual-View Controls:** Users can seamlessly toggle between a rich **List View** of attraction cards and an immersive **Map View** to understand their spatial surroundings.
	- **Actionable Attraction Cards:** Beautifully styled cards that allow users to bookmark places into their personalized Trip Itinerary drawer.
	- **Contextual AI Chat overlay:** A sleek, floating modal where the AIAssistant (aware of the user's current viewed city) provides instant, factual travel advice, hidden gems, and food recommendations.
	- **Smart Category Filters:** Button-pill filters to instantly sort attractions by Landmarks, Museums, Parks, or Historic sites.

---

## 🚀 Key Features

	- **AI Travel Assistant:** Powered by OpenRouter & Llama 3.
	- **Interactive Mapping: ** Powered by Geoapify to fetch points of interest.
	- **GPS Location Tracking:** One-click hardware location geocoding.
	- **Trip Itinerary Builder:** Bookmarking system for building a custom trip.

## 🟠 Technology Stack

	- **Frontend:** React.js, Vite, Tailwind CSS
	- **APIs:** Geoapify (Geocoding, Places, & Maps), OpenRouter AI (LLM)
	- **Icons:** Lucide React

## 💦 Setup & Execution

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the root directory and add your API keys:
		```env
		VITE_OPENROUTER_API_KEY=your_openrouter_key
		```
		*(Note: The Geoapify key is handled within the application)*
4. Run the development server: `npm run dev`
5. Build for production: `npm run build`

---
**This project runs independently as a standalone component and integrates seamlessly with any overarching search platform.**