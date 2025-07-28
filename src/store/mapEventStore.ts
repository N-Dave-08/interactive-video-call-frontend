import { create } from "zustand";

interface MapEventState {
  selectedPlace: string | null;
  setSelectedPlace: (place: string | null) => void;
  clearSelectedPlace: () => void;
}

export const useMapEventStore = create<MapEventState>((set) => ({
  selectedPlace: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  clearSelectedPlace: () => set({ selectedPlace: null }),
})); 