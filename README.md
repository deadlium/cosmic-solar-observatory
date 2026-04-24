# 🌌 Cosmic Solar Observatory

An immersive, interactive 3D Solar System simulation built with **Next.js**, **Three.js**, and **React Three Fiber**. Experience the majesty of our celestial neighborhood with realistic physics, custom high-resolution textures, and a modern cinematic interface.

![Solar System Preview](https://github.com/deadlium/cosmic-solar-observatory/raw/master/public/next.svg) <!-- Placeholder for actual screenshot if available -->

## ✨ Features

- **Realistic 3D Simulation**: Proportional planetary sizes and orbital distances (logarithmically adjusted for visibility).
- **Dynamic Orbital Physics**: Accurate relative orbital and rotational speeds with a global time scale control.
- **Cinematic Camera**: GSAP-powered smooth transitions that follow planets in real-time as they orbit.
- **Interactive Planet Info**: Click any planet to zoom in and reveal a premium split-screen overlay with detailed stats and fun facts.
- **Custom Visuals**:
  - High-res planetary textures generated via AI for a unique aesthetic.
  - Glowing Sun with a corona effect and point-light illumination.
  - Realistic Saturn ring system.
  - Instanced Asteroid Belt between Mars and Jupiter.
- **Modern HUD**: Minimalist controls for time scaling, auto-rotation, label toggling, and orbit path visibility.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **3D Engine**: [Three.js](https://threejs.org/) with [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **3D Utilities**: [@react-three/drei](https://github.com/pmndrs/drei)
- **Animations**: [GSAP](https://greensock.com/gsap/) & [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm / yarn / pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/deadlium/cosmic-solar-observatory.git
   cd cosmic-solar-observatory
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎮 Controls

- **Orbit**: Left Click + Drag
- **Zoom**: Mouse Wheel / Pinch
- **Pan**: Right Click + Drag
- **Select Planet**: Click on any planet or use the Quick-Select menu in the HUD.
- **Focus Sun**: Click the Sun or the "Reset" button to return to the system overview.
- **Auto-Rotate**: Toggle the 🔄 button for a cinematic orbital view.

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router pages & globals
├── components/
│   ├── SolarSystem/      # 3D Components (Sun, Planet, Asteroids, etc.)
│   └── UI/               # React UI Components (HUD, PlanetOverlay)
├── data/                 # Planetary constants and facts
├── hooks/                # Custom hooks and Zustand store
└── public/
    └── textures/         # High-resolution planetary texture maps
```

## 📜 License

MIT License. Feel free to use and explore!

---

Developed with ❤️ by [deadlium](https://uddeshjaiswal.com/)
