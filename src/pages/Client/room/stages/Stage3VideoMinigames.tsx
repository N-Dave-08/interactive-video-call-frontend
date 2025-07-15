"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, GamepadIcon, Play, Star } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useQuestionStore } from "@/store/questionStore";
import StageCardLayout from "./StageCardLayout";

export default function Stage3VideoMinigames({
	onNext,
	onBack,
	loading,
	error,
}: {
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}) {
	const setQuestion = useQuestionStore((s) => s.setQuestion);
	useEffect(() => {
		setQuestion("Ready for some video and minigames?");
	}, [setQuestion]);

	const activities = [
		{
			title: "Fun Videos",
			description: "Watch exciting educational videos",
			icon: Play,
			color: "from-red-400 to-pink-400",
			emoji: "🎬",
		},
		{
			title: "Mini Games",
			description: "Play interactive learning games",
			icon: GamepadIcon,
			color: "from-green-400 to-blue-400",
			emoji: "🎮",
		},
		{
			title: "Creative Activities",
			description: "Draw, color, and create amazing art",
			icon: Star,
			color: "from-yellow-400 to-orange-400",
			emoji: "🎨",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<StageCardLayout>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="text-center mb-6"
				>
					<div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-3">
						<GamepadIcon className="w-6 h-6 text-white" />
					</div>
					<h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-1">
						Fun Time!
					</h2>
					<p className="text-gray-600 text-base">
						Let's play some games and watch videos
					</p>
				</motion.div>

				<div className="grid gap-6 mb-8">
					{activities.map((activity, index) => (
						<motion.div
							key={activity.title}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
							whileHover={{ scale: 1.02 }}
							className="group cursor-pointer"
						>
							<div className="relative">
								<div
									className={`absolute inset-0 bg-gradient-to-r ${activity.color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
								/>
								<div className="relative p-4 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200 group-hover:border-gray-300 transition-all duration-300">
									<div className="flex items-center space-x-3">
										<div
											className={`w-10 h-10 bg-gradient-to-r ${activity.color} rounded-2xl flex items-center justify-center text-xl`}
										>
											{activity.emoji}
										</div>
										<div className="flex-1">
											<h3 className="text-base font-bold text-gray-800 mb-0.5">
												{activity.title}
											</h3>
											<p className="text-gray-600 text-sm">
												{activity.description}
											</p>
										</div>
										<motion.div
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											className={`w-8 h-8 bg-gradient-to-r ${activity.color} rounded-full flex items-center justify-center`}
										>
											<activity.icon className="w-4 h-4 text-white" />
										</motion.div>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7, duration: 0.5 }}
					className="text-center mb-6"
				>
					<div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200">
						<div className="text-2xl mb-1">🎉</div>
						<p className="text-base text-purple-700 font-semibold">
							Great job exploring! Ready for the next adventure?
						</p>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.5 }}
					className="flex justify-between items-center"
				>
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						className="px-4 py-2 text-base font-semibold border-2 border-gray-300 text-gray-600 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 bg-transparent"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</Button>

					<Button
						type="button"
						onClick={onNext}
						disabled={loading}
						className="px-6 py-2 text-base font-bold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
					>
						{loading ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{
									duration: 1,
									repeat: Number.POSITIVE_INFINITY,
									ease: "linear",
								}}
								className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
							/>
						) : (
							<ArrowRight className="w-4 h-4 mr-2" />
						)}
						{loading ? "Loading..." : "Continue Adventure!"}
					</Button>
				</motion.div>

				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="mt-3 p-3 bg-red-100 border border-red-300 rounded-2xl text-red-700 text-center text-sm"
					>
						{error}
					</motion.div>
				)}
			</StageCardLayout>
		</motion.div>
	);
}
