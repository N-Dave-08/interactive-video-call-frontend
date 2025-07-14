"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden flex flex-col h-full w-3/4 mx-auto">
				<CardContent className="p-4 flex-1 flex flex-col justify-between">
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
									{emotions.find((e) => e.value === value)?.label.toLowerCase()}
									! That's perfectly okay! 💖
								</p>
							</div>
						</motion.div>
					)}

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.5 }}
						className="flex justify-between items-center mt-2"
					>
						<Button
							type="button"
							variant="outline"
							onClick={onBack}
							className="px-4 py-2 text-base font-semibold border-2 border-gray-300 text-gray-600 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 bg-transparent"
						>
							<ArrowLeft className="w-5 h-5 mr-2" />
							Back
						</Button>

						<Button
							type="button"
							onClick={onNext}
							disabled={loading || !value}
							className="px-6 py-2 text-base font-bold bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
					</motion.div>

					{error && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="mt-2 p-2 bg-red-100 border border-red-300 rounded-xl text-red-700 text-center text-xs"
						>
							{error}
						</motion.div>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}
