import { useEffect, useRef } from "react";

interface StageAudioConfig {
	[key: string]: string;
}

const stageAudioMap: StageAudioConfig = {
	stage1: "/ai-voiced/lets-have-some-fun-together.mp3",
	stage2: "/avatar-assets/sounds/you_made_it.mp3", // Avatar creation - "you made it" sound
	stage3: "/ai-voiced/stage3.mp3",
	stage4: "/ai-voiced/stage4-audio.mp3",
	stage5: "/ai-voiced/feelings-audio.mp3", // Default stage 5 audio
	// 'stage6': '/ai-voiced/lets-have-some-fun-together.mp3', // Session notes
	stage7: "/sound-effects/yay-celebration.mp3", // Completion - celebration sound
};

// Global audio manager to prevent overlapping
let currentAudio: HTMLAudioElement | null = null;

export const useStageAudio = (stage?: string, step?: number) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		// Stop any currently playing audio
		if (currentAudio && currentAudio !== audioRef.current) {
			currentAudio.pause();
			currentAudio.currentTime = 0;
			currentAudio = null;
		}

		// Get the appropriate audio file for the stage
		let audioFile = stageAudioMap[stage || ""]; // Use || '' to handle undefined stage

		// Special handling for Stage 1 which has multiple audio files based on step
		if (stage === "stage1" && typeof step === "number") {
			const stage1AudioFiles = [
				"/ai-voiced/what-is-your-name.mp3",
				"/ai-voiced/tell-me-your-age.mp3",
				"/ai-voiced/tell-me-your-gender.mp3",
				"/ai-voiced/when-is-your-bday.mp3",
			];
			audioFile = stage1AudioFiles[step] || stage1AudioFiles[0];
		}

		// Special handling for Stage 5 which has multiple tabs (feelings, map-event, bodymap, drawing)
		if (stage === "stage5" && typeof step === "number") {
			const stage5AudioFiles = [
				"/ai-voiced/feelings-audio.mp3", // step 0 - feelings
				"/ai-voiced/map-event-audio.mp3", // step 1 - map-event
				"/ai-voiced/body-map.mp3", // step 2 - bodymap
				"/ai-voiced/draw-something.mp3", // step 3 - drawing
			];
			audioFile = stage5AudioFiles[step] || stage5AudioFiles[0];
		}

		if (!audioFile) return;

		// Create and play new audio
		const audio = new Audio(audioFile);
		audioRef.current = audio;
		currentAudio = audio;

		audio.play().catch((error) => {
			console.warn("Failed to play audio:", error);
		});

		// Cleanup function
		return () => {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current.currentTime = 0;
				if (currentAudio === audioRef.current) {
					currentAudio = null;
				}
			}
		};
	}, [stage, step]);

	// Function to manually stop audio
	const stopAudio = () => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
			if (currentAudio === audioRef.current) {
				currentAudio = null;
			}
		}
	};

	return { stopAudio };
};
