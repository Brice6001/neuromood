<div align="center">
  # NeuroMood

  **Empowering Mental Wellness through AI-Driven Insights**

  [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google-gemini&logoColor=white)](https://aistudio.google.com/)
</div>

---

## Overview

NeuroMood is a modern, AI-powered mental wellness companion designed to help users track their emotional health with precision and ease. By leveraging the Google Gemini API, NeuroMood transforms daily mood logs into actionable wellness insights, identifying patterns and providing personalized advice to improve mental resilience.

Built with a focus on visual excellence and user experience, the platform features a premium interface with glassmorphism elements, smooth animations, and a mobile-first responsive design.

## Key Features

- **Intelligent Dashboard**: A comprehensive overview of your wellness journey, featuring real-time mood trends, energy tracking, and personalized balance metrics.
- **AI-Driven Insights**: Powered by Gemini, the app analyzes your emotional patterns to provide proactive suggestions (e.g., detecting afternoon energy dips and suggesting mindful breaks).
- **Intuitive Mood Logging**: A frictionless check-in experience with interactive emoji selection, intensity sliders, and private journaling.
- **Responsive and Premium UI**: A state-of-the-art interface built with Tailwind CSS 4 and Framer Motion, optimized for both desktop and mobile devices.
- **Mood History**: Detailed chronological tracking of emotional states to help identify long-term triggers and improvements.

## Tech Stack

- **Core**: React 19 (TypeScript)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **AI Engine**: Google Gemini Pro via @google/genai
- **Animations**: Framer Motion / Motion
- **Icons**: Lucide React and Google Material Symbols
- **Routing**: React Router 7

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd neuromood
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a .env.local file in the root directory and add your API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Project Structure

```text
neuromood/
├── src/
│   ├── components/      # Reusable UI components (Layout, Nav, etc.)
│   ├── pages/           # Main application screens (Dashboard, Logger, Login)
│   ├── assets/          # Static assets and images
│   ├── App.tsx          # Main application logic and routing
│   └── main.tsx         # Entry point
├── public/              # Static files
├── docs/                # Project documentation and planning
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Roadmap and Milestones

The project is currently in active development. Below are the key milestones:

### Milestone 1: AI Fundamentals and Scaffolding (In Progress)
- [x] Initial project setup and design system implementation.
- [x] UI scaffolding for Dashboard and Mood Logger.
- [x] Comprehensive README and documentation.
- [ ] Fix page title and application metadata.

### Milestone 2: Core functional MVP (Upcoming)
- [ ] **Functional Mood Logger**: Real state management and localStorage persistence.
- [ ] **Mood History**: View and browse past entries in a chronological list.
- [ ] **Gemini-Powered Insights**: Integrate AI to analyze 7-day mood trends.
- [ ] **Personalization**: User settings for display name and preferences.

### Milestone 3: Polish and Launch
- [ ] **Dark Mode**: Complete theme support for night-time usage.
- [ ] **Accessibility (a11y)**: WCAG AA compliance audit and fixes.
- [ ] **PWA Support**: Make NeuroMood installable on mobile devices.

## Design Philosophy

NeuroMood adheres to a premium, clean, and calming aesthetic:
- **Palette**: Deep purples and soft corals for a balanced, "neuro" feel.
- **Typography**: Modern, readable sans-serif fonts optimized for digital screens.
- **Interactions**: Subtle micro-animations using Framer Motion to make the app feel alive.

---

<div align="center">
  Built for better mental health.
</div>

