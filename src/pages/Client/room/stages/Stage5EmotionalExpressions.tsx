import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Smile } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import BodyMap from "@/features/bodymap";
import DrawingPad from "@/features/drawing-pad";
import { useQuestionStore } from "@/store/questionStore";
import StageCardLayout from "./StageCardLayout";

export default function Stage5EmotionalExpressions({
	value,
	onChange,
	onNext,
	onBack,
	loading,
	error,
}: {
	value: string;
	onChange: (val: string) => void;
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}) {
	const setQuestion = useQuestionStore((s) => s.setQuestion);
	useEffect(() => {
		setQuestion("How are you feeling today?");
	}, [setQuestion]);

	const [stepIndex, setStepIndex] = React.useState(0);

	const emotions = [
		{
			value: "happy",
			label: "Happy",
			emoji: "😊",
			color: "from-yellow-400 to-orange-400",
		},
		{
			value: "excited",
			label: "Excited",
			emoji: "🤩",
			color: "from-pink-400 to-red-400",
		},
		{
			value: "calm",
			label: "Calm",
			emoji: "😌",
			color: "from-blue-400 to-cyan-400",
		},
		{
			value: "curious",
			label: "Curious",
			emoji: "🤔",
			color: "from-purple-400 to-violet-400",
		},
		{
			value: "proud",
			label: "Proud",
			emoji: "😎",
			color: "from-green-400 to-emerald-400",
		},
		{
			value: "nervous",
			label: "Nervous",
			emoji: "😰",
			color: "from-gray-400 to-slate-400",
		},
		{
			value: "sad",
			label: "Sad",
			emoji: "😢",
			color: "from-blue-300 to-blue-500",
		},
		{
			value: "angry",
			label: "Angry",
			emoji: "😠",
			color: "from-red-400 to-red-600",
		},
	];

	const steps = [
		{
			key: "emotions",
			label: "Emotional Expressions",
			completed: !!value, // Step is complete if emotion is selected
		},
		{
			key: "bodymap",
			label: "Body Map",
			completed: stepIndex > 0, // Step is complete if we've moved past it
		},
		{
			key: "drawingpad",
			label: "Drawing Pad",
			completed: stepIndex > 1, // Step is complete if we've moved past it
		},
	];
	const currentStep = steps[stepIndex].key;

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<StageCardLayout>
				{/* Progress Indicator */}
				<div className="mb-8">
					<div className="flex justify-center items-center gap-2 mb-4">
						{steps.map((step, idx) => (
							<button
								type="button"
								key={step.key}
								onClick={() => setStepIndex(idx)}
								disabled={idx > stepIndex}
								className={`h-2 rounded-full transition-all duration-300 ${
									step.completed
										? "bg-gradient-to-r from-green-400 to-emerald-400 w-16 hover:w-20"
										: idx <= stepIndex
											? "bg-gradient-to-r from-pink-400 to-purple-400 w-16 hover:w-20"
											: "bg-gray-200 w-8 cursor-not-allowed"
								} ${idx <= stepIndex ? "cursor-pointer" : ""}`}
							/>
						))}
					</div>
					<div className="flex justify-between items-center px-2">
						{steps.map((step, idx) => (
							<button
								type="button"
								key={step.key}
								onClick={() => setStepIndex(idx)}
								disabled={idx > stepIndex}
								className={`text-center transition-all duration-300 ${
									step.completed
										? "text-green-600 font-semibold hover:text-green-700"
										: idx <= stepIndex
											? "text-pink-600 font-semibold hover:text-pink-700"
											: "text-gray-400 cursor-not-allowed"
								} ${idx <= stepIndex ? "cursor-pointer" : ""}`}
							>
								<div className="text-xs font-medium flex items-center justify-center gap-1">
									{step.label}
									{step.completed && <span className="text-green-500">✓</span>}
								</div>
								<div className="text-xs opacity-75">
									{idx === 0 && "Step 1"}
									{idx === 1 && "Step 2"}
									{idx === 2 && "Step 3"}
								</div>
							</button>
						))}
					</div>
				</div>
				{/* Step Content */}
				{currentStep === "emotions" && (
					<>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className="text-center mb-4"
						>
							<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mb-4">
								<Heart className="w-8 h-8 text-white" />
							</div>
							<h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
								How are you feeling?
							</h2>
							<p className="text-gray-600 text-lg">
								Pick the emoji that shows how you feel right now
							</p>
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="mb-4"
						>
							<Label className="text-base font-semibold text-gray-700 mb-4 flex items-center justify-center">
								<Smile className="w-5 h-5 mr-2 text-pink-500" />
								Choose your feeling
							</Label>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-2">
								{emotions.map((emotion, index) => (
									<motion.button
										key={emotion.value}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => onChange(emotion.value)}
										className={`p-3 rounded-xl border-2 transition-all duration-300 ${
											value === emotion.value
												? "border-pink-400 bg-pink-50 shadow-lg transform scale-105"
												: "border-gray-200 bg-white hover:border-pink-300 hover:bg-pink-25"
										}`}
									>
										<div className="text-center">
											<div className="text-2xl mb-1">{emotion.emoji}</div>
											<div className="text-xs font-medium text-gray-700">
												{emotion.label}
											</div>
										</div>
										{value === emotion.value && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="mt-2 w-5 h-5 bg-pink-400 rounded-full mx-auto flex items-center justify-center"
											>
												<div className="w-2 h-2 bg-white rounded-full" />
											</motion.div>
										)}
									</motion.button>
								))}
							</div>
						</motion.div>
						{value && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="text-center mb-4"
							>
								<div className="p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border-2 border-pink-200">
									<div className="text-2xl mb-1">
										{emotions.find((e) => e.value === value)?.emoji}
									</div>
									<p className="text-base text-pink-700 font-semibold">
										You're feeling{" "}
										{emotions
											.find((e) => e.value === value)
											?.label.toLowerCase()}
										! That's perfectly okay! 💖
									</p>
								</div>
							</motion.div>
						)}
					</>
				)}
				{currentStep === "bodymap" && (
					<div className="my-6">
						<BodyMap />
					</div>
				)}
				{currentStep === "drawingpad" && (
					<div className="my-6">
						<DrawingPad />
					</div>
				)}
				{/* Navigation Buttons */}
				<div className="flex justify-between items-center mt-6">
					<Button
						type="button"
						variant="outline"
						onClick={() => {
							if (stepIndex === 0) onBack();
							else setStepIndex(stepIndex - 1);
						}}
						className="px-4 py-2 text-base font-semibold border-2 border-gray-300 text-gray-600 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 bg-transparent"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Back
					</Button>
					{stepIndex < steps.length - 1 ? (
						<Button
							type="button"
							onClick={() => setStepIndex(stepIndex + 1)}
							disabled={currentStep === "emotions" && !value}
							className="px-6 py-2 text-base font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							Next
						</Button>
					) : (
						<Button
							type="button"
							onClick={onNext}
							className="px-6 py-2 text-base font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
							disabled={loading}
						>
							{loading ? (
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										duration: 1,
										repeat: Number.POSITIVE_INFINITY,
										ease: "linear",
									}}
									className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-2"
								/>
							) : (
								<ArrowRight className="w-5 h-5 mr-2" />
							)}
							{loading ? "Saving..." : "Share My Feelings!"}
						</Button>
					)}
				</div>
				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="mt-2 p-2 bg-red-100 border border-red-300 rounded-xl text-red-700 text-center text-xs"
					>
						{error}
					</motion.div>
				)}
			</StageCardLayout>
		</motion.div>
	);
}
