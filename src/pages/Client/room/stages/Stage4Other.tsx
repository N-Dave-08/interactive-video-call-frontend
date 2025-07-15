import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, Lightbulb, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import StageCardLayout from "./StageCardLayout";

export default function Stage4Other({
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
	const puzzles = [
		{ emoji: "��", label: "Puzzle 1", completed: true },
		{ emoji: "🎯", label: "Puzzle 2", completed: true },
		{ emoji: "🌟", label: "Puzzle 3", completed: false },
		{ emoji: "🎪", label: "Puzzle 4", completed: false },
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
					className="text-center mb-4"
				>
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mb-4">
						<Puzzle className="w-8 h-8 text-white" />
					</div>
					<h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
						Special Activities
					</h2>
					<p className="text-gray-600 text-lg">
						Let's do some fun challenges together!
					</p>
				</motion.div>

				<div className="space-y-4 mb-4 flex-1 flex flex-col justify-between">
					{/* Activity Grid */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
							<Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
							Brain Teasers
						</h3>
						<div className="grid grid-cols-2 gap-2">
							{puzzles.map((puzzle, index) => (
								<motion.div
									key={puzzle.label}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
										puzzle.completed
											? "border-green-400 bg-green-50 shadow-lg"
											: "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-25"
									}`}
								>
									<div className="text-center">
										<div className="text-2xl mb-1">{puzzle.emoji}</div>
										<div className="text-xs font-medium text-gray-700">
											{puzzle.label}
										</div>
										{puzzle.completed && (
											<div className="text-xs text-green-600 mt-1 font-semibold">
												✓ Complete!
											</div>
										)}
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Encouragement Section */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.6, duration: 0.5 }}
						className="p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl border-2 border-pink-200"
					>
						<div className="flex items-center space-x-4">
							<div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
								<Heart className="w-5 h-5 text-white" />
							</div>
							<div>
								<h4 className="text-base font-bold text-purple-700 mb-1">
									You're doing amazing!
								</h4>
								<p className="text-sm text-purple-600">
									Keep up the great work, superstar!
								</p>
							</div>
						</div>
					</motion.div>

					{/* Progress Indicator */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7, duration: 0.5 }}
						className="text-center"
					>
						<div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full border-2 border-blue-200 text-sm">
							<div className="text-2xl">🏆</div>
							<span className="text-blue-700 font-semibold">
								2 out of 4 completed!
							</span>
						</div>
					</motion.div>
				</div>

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
						disabled={loading}
						className="px-6 py-2 text-base font-bold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
						{loading ? "Loading..." : "Next Challenge!"}
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
			</StageCardLayout>
		</motion.div>
	);
}
