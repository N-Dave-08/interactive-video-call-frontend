import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SpeechBubble } from "./speech-bubble";
import { motion } from "motion/react";

interface CharacterProps {
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

export function Character({
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
	delay = 500,
	className = "",
}: CharacterProps) {
	const [showButtons, setShowButtons] = useState(false);
	const [showBubble, setShowBubble] = useState(true);
	const [hasMounted, setHasMounted] = useState(false);
	const [hasMountedOnce, setHasMountedOnce] = useState(false);

	const greetingAudioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		if (
			greetingAudioRef.current &&
			message === "Hello! Let's have some fun together."
		) {
			greetingAudioRef.current.currentTime = 0;
			greetingAudioRef.current.play();
		}

		setShowBubble(true);

		const showButtonsTimer = setTimeout(() => {
			setShowButtons(true);
		}, delay + 1500);

		const mountedTimer = setTimeout(() => {
			setHasMounted(true);
			setHasMountedOnce(true);
		}, delay + 1500);

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
				className={`${currentSize.container} rounded-full flex items-center justify-center text-white font-bold ${currentSize.text} shadow-lg cursor-pointer select-none overflow-hidden ${color}`}
				type="button"
				whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
				whileTap={{ scale: 0.9 }}
				onClick={() => setShowBubble((prev) => !prev)}
			>
				<motion.span
					initial={hasMounted ? false : { scale: 0 }}
					animate={{ scale: 1 }}
					transition={{
						delay: hasMounted ? 0 : delay / 1000 + 0.2,
						type: hasMounted ? "tween" : "spring",
						stiffness: 500,
						duration: 0.2,
					}}
				>
					{avatar.match(/\.(png|jpe?g|gif|svg)$/i) ? (
						<img
							src={avatar}
							alt="Avatar"
							className="w-full h-full object-cover rounded-full"
						/>
					) : (
						avatar
					)}
				</motion.span>
			</motion.button>
			<motion.span
				className={`${currentSize.nameText} font-medium text-center text-muted-foreground max-w-20 truncate`}
				initial={hasMounted ? false : { opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					delay: hasMounted ? 0 : delay / 1000 + 0.4,
					type: hasMounted ? "tween" : "spring",
					stiffness: 300,
					duration: 0.3,
				}}
			>
				{name}
			</motion.span>
		</motion.div>
	);

	const SpeechBubbleContent = () => (
		<motion.div
			className="space-y-3"
			initial={
				hasMountedOnce
					? false
					: {
							opacity: 0,
							scale: 0.5,
							x:
								bubblePosition === "left"
									? 90
									: bubblePosition === "right"
										? -90
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
				opacity: showBubble ? 1 : 0,
				scale: showBubble ? 1 : 0.95,
				x: 0,
				y: 0,
				pointerEvents: showBubble ? "auto" : "none",
			}}
			transition={{
				type: "spring",
				stiffness: 150,
				damping: 12,
				duration: 0.4,
				delay: hasMountedOnce ? 0 : delay / 1000 + 0.6,
			}}
		>
			<motion.div
				initial={hasMountedOnce ? false : { scale: 0.8 }}
				animate={{ scale: 1 }}
				transition={{
					type: hasMounted ? "tween" : "spring",
					stiffness: 300,
					damping: 20,
					duration: 0.3,
					delay: hasMountedOnce ? 0 : delay / 1000 + 0.8,
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
	);

	const getLayout = () => {
		const layoutProps = {
			layout: true,
			transition: {
				type: hasMounted ? ("tween" as const) : ("spring" as const),
				duration: hasMounted ? 0.5 : undefined,
				stiffness: 200,
				damping: 15,
			},
			className: `${className} ${currentSize.bubbleGap}`,
		};

		if (bubblePosition === "top" || bubblePosition === "bottom") {
			return (
				<motion.div
					{...layoutProps}
					className={`flex flex-col items-center ${layoutProps.className}`}
				>
					{bubblePosition === "top" ? (
						<>
							<SpeechBubbleContent />
							<CharacterAvatar />
						</>
					) : (
						<>
							<CharacterAvatar />
							<SpeechBubbleContent />
						</>
					)}
				</motion.div>
			);
		}

		return (
			<motion.div
				{...layoutProps}
				className={`flex items-start ${layoutProps.className}`}
			>
				{bubblePosition === "left" ? (
					<>
						<SpeechBubbleContent />
						<CharacterAvatar />
					</>
				) : (
					<>
						<CharacterAvatar />
						<SpeechBubbleContent />
					</>
				)}
			</motion.div>
		);
	};

	return (
		<>
			{message === "Hello! Let's have some fun together." && (
				<audio
					ref={greetingAudioRef}
					src="/ai-voiced/lets-have-some-fun-together.mp3"
					preload="auto"
				>
					<track kind="captions" label="Greeting sound" />
				</audio>
			)}
			{getLayout()}
		</>
	);
}
