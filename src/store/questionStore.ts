import { create } from "zustand";

interface QuestionState {
	question: string;
	setQuestion: (q: string) => void;
}

export const useQuestionStore = create<QuestionState>((set) => ({
	question: "",
	setQuestion: (q) => set({ question: q }),
}));
