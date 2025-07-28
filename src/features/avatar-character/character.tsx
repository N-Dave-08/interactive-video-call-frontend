import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SpeechBubble } from "./speech-bubble";
import { motion } from "motion/react";

interface TutorialCharacterProps {
	name: string;
	avatar: string;
	color?: string;
	message: string;
	type?: "instruction" | "encouragement" | "hint" | "celebration" | "question";
	bubblePosition?: "top" | "bottom" | "left" | "right";
	size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
	showNext?: boolean;
	showHint?: boolean;
	onNext?: () => void;
	onHint?: () => void;
	speed?: number;
	delay?: number;
	className?: string;
	interactive?: boolean;
}

export function TutorialCharacter({
	name,
	avatar,
	color,
	message,
	type = "instruction",
	bubblePosition = "right",
	size = "md",
	showNext = false,
	showHint = false,
	onNext,
	onHint,
	// speed = 40,
	delay = 500,
	className = "",
	// interactive = true,
}: TutorialCharacterProps) {
	const [showButtons, setShowButtons] = useState(false);
	const [showBubble, setShowBubble] = useState(true); // Show bubble immediately
	const [hasMounted, setHasMounted] = useState(false);

	// Greeting audio effect
	const greetingAudioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		// Play greeting audio if message matches
		if (
			greetingAudioRef.current &&
			message === "Hello! Let's have some fun together."
		) {
			greetingAudioRef.current.currentTime = 0;
			greetingAudioRef.current.play();
		}

		// Auto-show speech bubble on message change
		setShowBubble(true);

		// Show buttons after a delay
		const showButtonsTimer = setTimeout(() => {
			setShowButtons(true);
		}, delay + 1500);

		// Set mounted state after a delay
		const mountedTimer = setTimeout(() => {
			setHasMounted(true);
		}, delay + 1500);

		// Cleanup timers
		return () => {
			clearTimeout(showButtonsTimer);
			clearTimeout(mountedTimer);
		};
	}, [message, delay]);



	const getVariantByType = () => {
		switch (type) {
			case "encouragement":
				return "primary";
			case "celebration":
				return "secondary";
			case "hint":
				return "default";
			case "question":
				return "destructive";
			default:
				return "default";
		}
	};

	// Size configurations
	const sizeConfig = {
		xs: {
			container: "w-8 h-8",
			text: "text-xs",
			nameText: "text-xs",
			gap: "gap-1",
			bubbleGap: "gap-2",
		},
		sm: {
			container: "w-10 h-10",
			text: "text-sm",
			nameText: "text-xs",
			gap: "gap-1.5",
			bubbleGap: "gap-3",
		},
		md: {
			container: "w-16 h-16",
			text: "text-2xl",
			nameText: "text-sm",
			gap: "gap-2",
			bubbleGap: "gap-4",
		},
		lg: {
			container: "w-20 h-20",
			text: "text-3xl",
			nameText: "text-base",
			gap: "gap-2.5",
			bubbleGap: "gap-5",
		},
		xl: {
			container: "w-24 h-24",
			text: "text-4xl",
			nameText: "text-lg",
			gap: "gap-3",
			bubbleGap: "gap-6",
		},
		"2xl": {
			container: "w-32 h-32",
			text: "text-5xl",
			nameText: "text-xl",
			gap: "gap-4",
			bubbleGap: "gap-8",
		},
	};

	const currentSize = sizeConfig[size];

	// Character Avatar Component
	const CharacterAvatar = () => (
		<div
			className={`flex flex-col items-center ${currentSize.gap} flex-shrink-0`}
		>
			<motion.button
				className={`${currentSize.container} rounded-full flex items-center justify-center text-white font-bold ${currentSize.text} shadow-lg cursor-pointer select-none overflow-hidden ${color}`}
				type="button"
				onClick={() => setShowBubble((prev) => !prev)}
				whileHover={{ scale: 1.08 }}
				whileTap={{ scale: 0.92 }}
			>
				<span>
					{avatar.endsWith('.png') || avatar.endsWith('.jpg') || avatar.endsWith('.jpeg') || avatar.endsWith('.gif') || avatar.endsWith('.svg') ? (
						<img 
							src={avatar} 
							alt="Avatar" 
							className="w-full h-full object-cover rounded-full"
						/>
					) : (
						avatar
					)}
				</span>
			</motion.button>
			<span
				className={`${currentSize.nameText} font-medium text-center text-muted-foreground max-w-20 truncate`}
			>
				{name}
			</span>
		</div>
	);

	// Speech Bubble Component - with childish animations
	const SpeechBubbleContent = () => (
		<>
			{showBubble && (
				<div className="space-y-3">
					<div>
						<SpeechBubble
							variant={getVariantByType()}
							tailPosition={
								bubblePosition === "top"
									? "bottom"
									: bubblePosition === "bottom"
										? "top"
										: bubblePosition === "left"
											? "right"
											: "left"
							}
							tailOffset="center"
						>
							<p className="text-base leading-relaxed">{message}</p>
						</SpeechBubble>
					</div>
					{/* Action Buttons (keep animation for buttons if desired) */}
					{showButtons && (
						<div
							className="flex gap-2"
						>
							{showHint && (
								<div
								>
									<Button
										variant="outline"
										size="sm"
										onClick={onHint}
										className="text-sm bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
									>
										💡 Need a hint?
									</Button>
								</div>
							)}
							{showNext && (
								<div
								>
									<Button
										variant="default"
										size="sm"
										onClick={onNext}
										className="text-sm bg-green-600 hover:bg-green-700"
									>
										Got it! ✨
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</>
	);

	// Layout based on bubble position with layout animations
	const getLayout = () => {
		switch (bubblePosition) {
			case "top":
				return (
					<div
						className={`flex flex-col items-center ${currentSize.bubbleGap} ${className}`}
					>
						<SpeechBubbleContent />
						<CharacterAvatar />
					</div>
				);
			case "bottom":
				return (
					<div
						className={`flex flex-col items-center ${currentSize.bubbleGap} ${className}`}
					>
						<CharacterAvatar />
						<SpeechBubbleContent />
					</div>
				);
			case "left":
				return (
					<div
						className={`flex items-start ${currentSize.bubbleGap} ${className}`}
					>
						<SpeechBubbleContent />
						<CharacterAvatar />
					</div>
				);
			case "right":
			default:
				return (
					<div
						className={`flex items-start ${currentSize.bubbleGap} ${className}`}
					>
						<CharacterAvatar />
						<SpeechBubbleContent />
					</div>
				);
		}
	};

	return (
		<>
			{/* Greeting Audio */}
			{message === "Hello! Let's have some fun together." && (
				<audio ref={greetingAudioRef} src="/ai-voiced/lets-have-some-fun-together.mp3" preload="auto">
					<track kind="captions" label="Greeting sound" />
				</audio>
			)}
			{/* Layout */}
			{getLayout()}
		</>
	);
}
