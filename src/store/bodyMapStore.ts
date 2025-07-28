import { create } from "zustand";

export interface SelectedParts {
  [key: string]: { pain: boolean; touch: boolean };
}

interface BodyMapState {
  frontSelectedParts: SelectedParts;
  backSelectedParts: SelectedParts;
  setFrontSelectedParts: (parts: SelectedParts) => void;
  setBackSelectedParts: (parts: SelectedParts) => void;
  clearAll: () => void;
}

export const useBodyMapStore = create<BodyMapState>((set) => ({
  frontSelectedParts: {},
  backSelectedParts: {},
  setFrontSelectedParts: (parts) => set({ frontSelectedParts: parts }),
  setBackSelectedParts: (parts) => set({ backSelectedParts: parts }),
  clearAll: () => set({ frontSelectedParts: {}, backSelectedParts: {} }),
})); 