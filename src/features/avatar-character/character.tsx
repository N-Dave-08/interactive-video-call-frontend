import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SpeechBubble } from "./speech-bubble";

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
	color = "#10b981",
	message,
	type = "instruction",
	bubblePosition = "right",
	size = "md",
	showNext = false,
	showHint = false,
	onNext,
	onHint,
	speed = 40,
	delay = 500,
	className = "",
	interactive = true,
}: TutorialCharacterProps) {
	const [isComplete, setIsComplete] = useState(false);
	const [showButtons, setShowButtons] = useState(false);
	const [showBubble, setShowBubble] = useState(true); // Show bubble immediately
	const [hasMounted, setHasMounted] = useState(false);

	const handleComplete = () => {
		setIsComplete(true);
		setTimeout(() => setShowButtons(true), 300);
	};

	// Auto-show buttons after a delay
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsComplete(true);
			setTimeout(() => setShowButtons(true), 300);
		}, delay + 1500); // Show buttons 1.5 seconds after component mounts

		return () => clearTimeout(timer);
	}, [delay]);

	// Set mounted state after initial animation
	useEffect(() => {
		const timer = setTimeout(() => {
			setHasMounted(true);
		}, delay + 1500); // After all mounting animations complete

		return () => clearTimeout(timer);
	}, [delay]);

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
		<motion.div
			className={`flex flex-col items-center ${currentSize.gap} flex-shrink-0`}
			initial={hasMounted ? false : { opacity: 0, scale: 0, rotate: -180 }}
			animate={{ opacity: 1, scale: 1, rotate: 0 }}
			transition={{
				type: hasMounted ? "tween" : "spring",
				stiffness: hasMounted ? undefined : 200,
				damping: hasMounted ? undefined : 15,
				duration: hasMounted ? 0.3 : undefined,
				delay: hasMounted ? 0 : delay / 1000,
			}}
		>
			<motion.button
				className={`${currentSize.container} rounded-full flex items-center justify-center text-white font-bold ${currentSize.text} shadow-lg cursor-pointer select-none ${color}`}
				type="button"
				whileHover={{
					scale: 1.1,
					rotate: [0, -10, 10, 0],
					transition: { duration: 0.3 },
				}}
				whileTap={{ scale: 0.9 }}
			>
				<motion.span
					initial={hasMounted ? false : { scale: 0 }}
					animate={{ scale: 1 }}
					transition={{
						delay: hasMounted ? 0 : delay / 1000 + 0.2,
						type: hasMounted ? "tween" : "spring",
						stiffness: hasMounted ? undefined : 500,
						duration: hasMounted ? 0.2 : undefined,
					}}
				>
					{avatar}
				</motion.span>
			</motion.button>

			<motion.span
				className={`${currentSize.nameText} font-medium text-center text-muted-foreground max-w-20 truncate`}
				initial={hasMounted ? false : { opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					delay: hasMounted ? 0 : delay / 1000 + 0.4,
					type: hasMounted ? "tween" : "spring",
					stiffness: hasMounted ? undefined : 300,
					duration: hasMounted ? 0.3 : undefined,
				}}
			>
				{name}
			</motion.span>
		</motion.div>
	);

	// Speech Bubble Component - with childish animations
	const SpeechBubbleContent = () => (
		<>
			{showBubble && (
				<motion.div
					className="space-y-3"
					initial={
						hasMounted
							? false
							: {
									opacity: 0,
									scale: 0.5,
									rotate:
										bubblePosition === "left"
											? 15
											: bubblePosition === "right"
												? -15
												: 0,
									y:
										bubblePosition === "top"
											? 30
											: bubblePosition === "bottom"
												? -30
												: 0,
								}
					}
					animate={{
						opacity: 1,
						scale: 1,
						rotate: 0,
						y: 0,
					}}
					transition={{
						type: hasMounted ? "tween" : "spring",
						stiffness: hasMounted ? undefined : 150,
						damping: hasMounted ? undefined : 12,
						duration: hasMounted ? 0.4 : undefined,
						delay: hasMounted ? 0 : delay / 1000 + 0.6,
					}}
				>
					<motion.div
						initial={hasMounted ? false : { scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{
							type: hasMounted ? "tween" : "spring",
							stiffness: hasMounted ? undefined : 300,
							damping: hasMounted ? undefined : 20,
							duration: hasMounted ? 0.3 : undefined,
							delay: hasMounted ? 0 : delay / 1000 + 0.8,
						}}
					>
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
					</motion.div>

					{/* Action Buttons */}
					{showButtons && (
						<motion.div
							className="flex gap-2"
							initial={{ opacity: 0, scale: 0.7 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								type: "spring",
								stiffness: 400,
								damping: 22,
							}}
						>
							{showHint && (
								<motion.div
									whileHover={{ scale: 1.05, rotate: 2 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="outline"
										size="sm"
										onClick={onHint}
										className="text-sm bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
									>
										💡 Need a hint?
									</Button>
								</motion.div>
							)}
							{showNext && (
								<motion.div
									whileHover={{ scale: 1.05, rotate: -2 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										variant="default"
										size="sm"
										onClick={onNext}
										className="text-sm bg-green-600 hover:bg-green-700"
									>
										Got it! ✨
									</Button>
								</motion.div>
							)}
						</motion.div>
					)}
				</motion.div>
			)}
		</>
	);

	// Layout based on bubble position with layout animations
	const getLayout = () => {
		switch (bubblePosition) {
			case "top":
				return (
					<motion.div
						className={`flex flex-col items-center ${currentSize.bubbleGap} ${className}`}
						layout
						transition={{
							type: hasMounted ? "tween" : "spring",
							duration: hasMounted ? 0.5 : undefined,
							stiffness: hasMounted ? undefined : 200,
							damping: hasMounted ? undefined : 15,
						}}
					>
						<SpeechBubbleContent />
						<CharacterAvatar />
					</motion.div>
				);
			case "bottom":
				return (
					<motion.div
						className={`flex flex-col items-center ${currentSize.bubbleGap} ${className}`}
						layout
						transition={{
							type: hasMounted ? "tween" : "spring",
							duration: hasMounted ? 0.5 : undefined,
							stiffness: hasMounted ? undefined : 200,
							damping: hasMounted ? undefined : 15,
						}}
					>
						<CharacterAvatar />
						<SpeechBubbleContent />
					</motion.div>
				);
			case "left":
				return (
					<motion.div
						className={`flex items-start ${currentSize.bubbleGap} ${className}`}
						layout
						transition={{
							type: hasMounted ? "tween" : "spring",
							duration: hasMounted ? 0.5 : undefined,
							stiffness: hasMounted ? undefined : 200,
							damping: hasMounted ? undefined : 15,
						}}
					>
						<SpeechBubbleContent />
						<CharacterAvatar />
					</motion.div>
				);
			case "right":
			default:
				return (
					<motion.div
						className={`flex items-start ${currentSize.bubbleGap} ${className}`}
						layout
						transition={{
							type: hasMounted ? "tween" : "spring",
							duration: hasMounted ? 0.5 : undefined,
							stiffness: hasMounted ? undefined : 200,
							damping: hasMounted ? undefined : 15,
						}}
					>
						<CharacterAvatar />
						<SpeechBubbleContent />
					</motion.div>
				);
		}
	};

	return getLayout();
}
