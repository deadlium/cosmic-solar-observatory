import { create } from 'zustand';
import { PlanetData } from '../data/planets';

interface SolarSystemState {
  selectedPlanet: PlanetData | null;
  timeScale: number;
  isPaused: boolean;
  showLabels: boolean;
  showOrbits: boolean;
  autoRotate: boolean;
  setSelectedPlanet: (planet: PlanetData | null) => void;
  setTimeScale: (scale: number) => void;
  togglePaused: () => void;
  toggleLabels: () => void;
  toggleOrbits: () => void;
  toggleAutoRotate: () => void;
}

export const useSolarSystem = create<SolarSystemState>((set) => ({
  selectedPlanet: null,
  timeScale: 1,
  isPaused: false,
  showLabels: true,
  showOrbits: true,
  autoRotate: true,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  togglePaused: () => set((state) => ({ isPaused: !state.isPaused })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
}));
