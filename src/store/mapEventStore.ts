import { create } from "zustand";
import type { MapEvent } from "../features/map-event-picker";

interface MapEventState {
	selectedPlace: string | null;
	currentStep: number;
	time: MapEvent["time"];
	weather: MapEvent["weather"];
	setSelectedPlace: (place: string | null) => void;
	setCurrentStep: (step: number) => void;
	setTime: (time: MapEvent["time"]) => void;
	setWeather: (weather: MapEvent["weather"]) => void;
	clearSelectedPlace: () => void;
	resetState: () => void;
}

export const useMapEventStore = create<MapEventState>((set) => ({
	selectedPlace: null,
	currentStep: 1,
	time: "morning",
	weather: "sunny",
	setSelectedPlace: (place) => set({ selectedPlace: place }),
	setCurrentStep: (step) => set({ currentStep: step }),
	setTime: (time) => set({ time }),
	setWeather: (weather) => set({ weather }),
	clearSelectedPlace: () => set({ selectedPlace: null }),
	resetState: () =>
		set({
			selectedPlace: null,
			currentStep: 1,
			time: "morning",
			weather: "sunny",
		}),
}));
