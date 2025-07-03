import { create } from "zustand";

export const useMusicPlayerStore = create((set) => ({
	isMinimized: false,
	setIsMinimized: (val: boolean) => set({ isMinimized: val }),
}));
