import { create } from 'zustand';
import { PlanetData } from '../data/planets';
import { MotionMode, HELICAL_CONSTANTS } from '../utils/motion';

export const simClock = {
  time: 0,
};

interface SolarSystemState {
  selectedPlanet: PlanetData | null;
  timeScale: number;
  isPaused: boolean;
  showLabels: boolean;
  showOrbits: boolean;
  autoRotate: boolean;
  motionMode: MotionMode;
  forwardSpeed: number;
  setSelectedPlanet: (planet: PlanetData | null) => void;
  setTimeScale: (scale: number) => void;
  togglePaused: () => void;
  toggleLabels: () => void;
  toggleOrbits: () => void;
  toggleAutoRotate: () => void;
  setMotionMode: (mode: MotionMode) => void;
  toggleMotionMode: () => void;
  setForwardSpeed: (speed: number) => void;
  resetSimulation: () => void;
}

export const useSolarSystem = create<SolarSystemState>((set) => ({
  selectedPlanet: null,
  timeScale: 1,
  isPaused: false,
  showLabels: true,
  showOrbits: true,
  autoRotate: false,
  motionMode: 'helical',
  forwardSpeed: HELICAL_CONSTANTS.FORWARD_SPEED,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  setTimeScale: (scale) => set({ timeScale: scale }),
  togglePaused: () => set((state) => ({ isPaused: !state.isPaused })),
  toggleLabels: () => set((state) => ({ showLabels: !state.showLabels })),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setMotionMode: (mode) => set({ motionMode: mode }),
  toggleMotionMode: () =>
    set((state) => ({
      motionMode: state.motionMode === 'helical' ? 'circular' : 'helical',
    })),
  setForwardSpeed: (speed) => set({ forwardSpeed: speed }),
  resetSimulation: () => {
    simClock.time = 0;
    set({ selectedPlanet: null });
  },
}));
