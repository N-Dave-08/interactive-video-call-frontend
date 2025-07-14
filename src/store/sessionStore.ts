import { create } from "zustand";

interface SessionState {
	title: string;
	setTitle: (title: string) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
	title: "",
	setTitle: (title) => set({ title }),
}));
