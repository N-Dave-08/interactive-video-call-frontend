import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Heart,
	Smile,
	Sparkles,
	Star,
} from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BodyMap from "@/features/bodymap";
import DrawingPad from "@/features/drawing-pad";
import { useQuestionStore } from "@/store/questionStore";
import StageCardLayout from "./StageCardLayout";

interface SelectedParts {
	[key: string]: { pain: boolean; touch: boolean };
}

export default function Stage5EmotionalExpressions({
	value,
	onChange,
	onNext,
	onBack,
	loading,
	error,
	onBodyMapChange,
	onDrawingComplete,
}: {
	value: string;
	onChange: (val: string) => void;
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
	onBodyMapChange?: (front: SelectedParts, back: SelectedParts) => void;
	onDrawingComplete?: (drawingBase64: string) => void;
}) {
	const setQuestion = useQuestionStore((s) => s.setQuestion);
	useEffect(() => {
		setQuestion("How are you feeling today?");
	}, [setQuestion]);

	const [currentTab, setCurrentTab] = React.useState<
		"feelings" | "bodymap" | "drawingpad"
	>("feelings");
	const [bodyMapComplete, setBodyMapComplete] = React.useState(false);
	const [drawingPadComplete, setDrawingPadComplete] = React.useState(false);

	const tabAudios = {
		feelings: "/ai-voiced/tell-me-how-you-feel.mp3",
		bodymap: "/ai-voiced/body-map.mp3",
		drawingpad: "/ai-voiced/draw-something.mp3",
	};

	const selectAudio = () => {
		const audio = new Audio(
			"/sound-effects/body-map&select-expressions/select.mp3",
		);
		audio.play().catch(() => {}); // Ignore errors if audio fails
	};

	useEffect(() => {
		const audio = new Audio(tabAudios[currentTab]);
		audio.play().catch(() => {}); // Ignore errors if audio fails

		// Cleanup function to stop audio if component unmounts
		return () => {
			audio.pause();
		};
	}, [currentTab]);

	const emotions = [
		{
			value: "happy",
			label: "Happy",
			emoji: (
				<Icon
					icon="fluent-emoji:smiling-face-with-smiling-eyes"
					className="text-4xl"
				/>
			),
			color: "from-yellow-300 via-yellow-400 to-orange-400",
			bgColor: "bg-yellow-100",
			borderColor: "border-yellow-300",
		},
		{
			value: "excited",
			label: "Excited",
			emoji: <Icon icon="fluent-emoji:star-struck" className="text-4xl" />,
			color: "from-pink-300 via-pink-400 to-red-400",
			bgColor: "bg-pink-100",
			borderColor: "border-pink-300",
		},
		{
			value: "calm",
			label: "Calm",
			emoji: <Icon icon="fluent-emoji:relieved-face" className="text-4xl" />,
			color: "from-blue-300 via-blue-400 to-cyan-400",
			bgColor: "bg-blue-100",
			borderColor: "border-blue-300",
		},
		{
			value: "curious",
			label: "Curious",
			emoji: <Icon icon="fluent-emoji:thinking-face" className="text-4xl" />,
			color: "from-purple-300 via-purple-400 to-violet-400",
			bgColor: "bg-purple-100",
			borderColor: "border-purple-300",
		},
		{
			value: "proud",
			label: "Proud",
			emoji: (
				<Icon
					icon="fluent-emoji:smiling-face-with-sunglasses"
					className="text-4xl"
				/>
			),
			color: "from-green-300 via-green-400 to-emerald-400",
			bgColor: "bg-green-100",
			borderColor: "border-green-300",
		},
		{
			value: "nervous",
			label: "Nervous",
			emoji: (
				<Icon
					icon="fluent-emoji:anxious-face-with-sweat"
					className="text-4xl"
				/>
			),
			color: "from-gray-300 via-gray-400 to-slate-400",
			bgColor: "bg-gray-100",
			borderColor: "border-gray-300",
		},
		{
			value: "sad",
			label: "Sad",
			emoji: <Icon icon="fluent-emoji:crying-face" className="text-4xl" />,
			color: "from-blue-200 via-blue-300 to-blue-500",
			bgColor: "bg-blue-50",
			borderColor: "border-blue-200",
		},
		{
			value: "angry",
			label: "Angry",
			emoji: <Icon icon="fluent-emoji:angry-face" className="text-4xl" />,
			color: "from-red-300 via-red-400 to-red-600",
			bgColor: "bg-red-100",
			borderColor: "border-red-300",
		},
	];

	// Check if all sections are complete
	const allComplete = value && bodyMapComplete && drawingPadComplete;

	const FloatingStars = () => (
		<div className="absolute inset-0 pointer-events-none overflow-hidden">
			{[...Array(6)].map((_, i) => (
				<motion.div
					key={`star-${i + 1}`}
					className="absolute text-yellow-300"
					initial={{
						x: `${Math.random() * 100}%`,
						y: `${Math.random() * 100}%`,
						rotate: 0,
						scale: 0.5 + Math.random() * 0.5,
					}}
					animate={{
						rotate: 360,
						y: [0, -20, 0],
					}}
					transition={{
						rotate: {
							duration: 8 + i * 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
						},
						y: {
							duration: 3 + i,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						},
					}}
				>
					<Star className="w-4 h-4 fill-current" />
				</motion.div>
			))}
		</div>
	);

	function renderTabContent() {
		switch (currentTab) {
			case "feelings":
				return (
					<div className="relative">
						<FloatingStars />
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className="text-center mb-4"
						>
							<motion.div
								className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 rounded-full mb-4 shadow-lg"
								whileHover={{ scale: 1.1, rotate: 5 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<Heart className="w-7 h-7 text-white" />
							</motion.div>
							<h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
								How are you feeling?
							</h2>
							<p className="text-gray-600 text-lg font-medium">
								Pick the emoji that shows how you feel right now!{" "}
								<Icon
									icon="fluent-emoji:sparkles"
									className="inline w-5 h-5 align-middle"
								/>
							</p>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="mb-8"
						>
							<Label className="text-lg font-bold text-gray-700 mb-6 flex items-center justify-center">
								<Smile className="w-6 h-6 mr-3 text-pink-500" />
								Choose your feeling
							</Label>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{emotions.map((emotion, index) => (
									<motion.button
										key={emotion.value}
										initial={{ opacity: 0, scale: 0.8, y: 20 }}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
										whileHover={{
											scale: 1.08,
											y: -5,
											boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
										}}
										whileTap={{ scale: 0.95 }}
										onClick={() => {
											onChange(emotion.value);
											selectAudio();
										}}
										className={`p-6 rounded-3xl border-3 transition-all duration-300 relative overflow-hidden min-h-[120px] flex flex-col items-center justify-center gap-2 ${
											value === emotion.value
												? `${emotion.borderColor} ${emotion.bgColor} shadow-xl transform scale-105`
												: "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-25 shadow-md"
										}`}
									>
										{value === emotion.value && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="absolute top-2 right-2 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
											>
												<Check className="w-4 h-4 text-white" />
											</motion.div>
										)}
										{/* Centered icon and label */}
										<div className="flex flex-col items-center justify-center flex-1">
											<div className="mb-2 flex items-center justify-center">
												{emotion.emoji}
											</div>
											<div className="text-sm font-bold text-gray-700 text-center">
												{emotion.label}
											</div>
										</div>
									</motion.button>
								))}
							</div>
						</motion.div>

						{value && (
							<motion.div
								initial={{ opacity: 0, y: 20, scale: 0.9 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{ duration: 0.5, type: "spring" }}
								className="text-center mb-6"
							>
								<div className="p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 rounded-3xl border-3 border-pink-200 shadow-lg relative overflow-hidden">
									<motion.div
										className="absolute top-2 right-2"
										animate={{ rotate: [0, 10, -10, 0] }}
										transition={{
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
										}}
									>
										<Sparkles className="w-5 h-5 text-purple-400" />
									</motion.div>
									<p className="text-lg text-purple-700 font-bold flex items-center justify-center gap-4">
										<span className="text-4xl">
											{emotions.find((e) => e.value === value)?.emoji}
										</span>
										<span>
											You're feeling{" "}
											<span className="text-pink-600">
												{emotions
													.find((e) => e.value === value)
													?.label.toLowerCase()}
											</span>
											! That's perfectly okay!{" "}
											<Icon
												icon="fluent-emoji:sparkling-heart"
												className="inline w-5 h-5 align-middle"
											/>
										</span>
									</p>
								</div>
							</motion.div>
						)}
					</div>
				);
			case "bodymap":
				return (
					<div className="my-8 text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="mb-6"
						>
							<h3 className="text-2xl font-bold text-purple-600 mb-2">
								Body Map Adventure!{" "}
								<Icon
									icon="fluent-emoji:world-map"
									className="inline w-7 h-7 mr-1 align-middle"
								/>
							</h3>
							<p className="text-gray-600">
								Show us where you feel things in your body!
							</p>
						</motion.div>
						<div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border-3 border-blue-200">
							<BodyMap
								onBodyPartClick={() => setBodyMapComplete(true)}
								onSelectionChange={onBodyMapChange}
								onSkip={() => setBodyMapComplete(true)}
							/>
						</div>
					</div>
				);
			case "drawingpad":
				return (
					<div className="my-8 text-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="mb-6"
						>
							<h3 className="text-2xl font-bold text-purple-600 mb-2">
								Drawing Time!{" "}
								<Icon
									icon="fluent-emoji:artist-palette"
									className="inline w-7 h-7 mr-1 align-middle"
								/>
							</h3>
							<p className="text-gray-600">Draw how you're feeling today!</p>
						</motion.div>
						<div className="bg-gradient-to-br from-yellow-50 to-pink-50 rounded-3xl p-6 border-3 border-yellow-200">
							<DrawingPad
								onComplete={onDrawingComplete}
								markCompleteTrigger={drawingPadComplete}
							/>
							{!drawingPadComplete ? (
								<motion.button
									type="button"
									className="mt-6 px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg border-3 border-pink-300 hover:from-pink-500 hover:to-purple-500 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
									onClick={() => setDrawingPadComplete(true)}
									whileHover={{ scale: 1.05, y: -2 }}
									whileTap={{ scale: 0.95 }}
								>
									<Icon
										icon="fluent-emoji:artist-palette"
										className="inline w-6 h-6 mr-1 align-middle"
									/>
									Mark Drawing as Complete!
								</motion.button>
							) : (
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									className="text-lg text-green-600 mt-4 flex items-center justify-center gap-2 font-bold"
								>
									<Check className="w-6 h-6 bg-green-100 rounded-full p-1" />
									Drawing Complete! Amazing work!{" "}
									<Icon
										icon="fluent-emoji:glowing-star"
										className="inline w-5 h-5 align-middle"
									/>
								</motion.div>
							)}
						</div>
					</div>
				);
			default:
				return null;
		}
	}

	const tabs: {
		id: "feelings" | "bodymap" | "drawingpad";
		label: string;
		emoji: React.ReactNode;
		complete: boolean;
	}[] = [
		{
			id: "feelings",
			label: "Feelings",
			emoji: (
				<Icon
					icon="fluent-emoji:smiling-face-with-smiling-eyes"
					className="text-xl"
				/>
			),
			complete: !!value,
		},
		{
			id: "bodymap",
			label: "Body Map",
			emoji: <Icon icon="fluent-emoji:world-map" className="text-xl" />,
			complete: bodyMapComplete,
		},
		{
			id: "drawingpad",
			label: "Drawing",
			emoji: <Icon icon="fluent-emoji:artist-palette" className="text-xl" />,
			complete: drawingPadComplete,
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<StageCardLayout>
				{/* Main Content */}
				<div className="flex flex-col min-h-[500px]">
					<div className="flex-1">{renderTabContent()}</div>

					{/* Playful Tabs */}
					<div>
						<div className="flex justify-center gap-2">
							{tabs.map((tab) => (
								<motion.button
									key={tab.id}
									type="button"
									className={`px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-2 border-3 relative overflow-hidden ${
										currentTab === tab.id
											? "bg-gradient-to-r from-pink-400 to-purple-400 text-white border-pink-300 shadow-lg"
											: "bg-white text-gray-700 border-gray-200 hover:border-pink-300 hover:bg-pink-50 shadow-md"
									}`}
									onClick={() => setCurrentTab(tab.id)}
									whileHover={{ scale: 1.05, y: -2 }}
									whileTap={{ scale: 0.95 }}
								>
									<span className="text-xl">{tab.emoji}</span>
									{tab.label}
									{tab.complete && (
										<motion.div
											initial={{ scale: 0, rotate: -180 }}
											animate={{ scale: 1, rotate: 0 }}
											className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center"
										>
											<Check className="w-3 h-3 text-white" />
										</motion.div>
									)}
								</motion.button>
							))}
						</div>
					</div>
				</div>

				{/* Navigation Buttons */}
				<div className="flex justify-between items-center">
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						className="px-6 py-4 text-lg font-bold border-3 border-gray-300 text-gray-600 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 bg-white shadow-md"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Back
					</Button>

					<motion.div
						animate={allComplete ? { scale: [1, 1.05, 1] } : {}}
						transition={{
							duration: 2,
							repeat: allComplete ? Number.POSITIVE_INFINITY : 0,
						}}
					>
						<Button
							type="button"
							onClick={onNext}
							className="px-8 py-4 text-lg font-black bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-3 border-pink-400 flex items-center justify-center gap-2"
							disabled={!allComplete || loading}
						>
							{loading ? (
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										duration: 1,
										repeat: Number.POSITIVE_INFINITY,
										ease: "linear",
									}}
									className="w-6 h-6 border-3 border-white border-t-transparent rounded-full mr-2"
								/>
							) : (
								<ArrowRight className="w-6 h-6 mr-2" />
							)}
							{loading ? (
								"Saving..."
							) : (
								<>
									<Icon
										icon="fluent-emoji:party-popper"
										className="inline w-6 h-6 mr-2 align-middle"
									/>
									Share My Feelings!
								</>
							)}
						</Button>
					</motion.div>
				</div>

				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="mt-4 p-4 bg-red-100 border-3 border-red-300 rounded-2xl text-red-700 text-center font-bold"
					>
						{error}
					</motion.div>
				)}
			</StageCardLayout>
		</motion.div>
	);
}
