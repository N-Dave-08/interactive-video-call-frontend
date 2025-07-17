import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, GamepadIcon, Play } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// Get the panel state from URL parameter, default to 'activities'
	const currentPanel = searchParams.get("panel") || "activities";
	const showGamesPanel = currentPanel === "games";

	useEffect(() => {
		setQuestion("Ready for some video and minigames?");
	}, [setQuestion]);

	// Function to update URL parameter
	const updatePanelState = (panel: "activities" | "games") => {
		const newSearchParams = new URLSearchParams(searchParams);
		if (panel === "activities") {
			newSearchParams.delete("panel");
		} else {
			newSearchParams.set("panel", panel);
		}
		setSearchParams(newSearchParams);
	};

	const activities = [
		{
			title: "Fun Videos",
			description: "Watch exciting educational videos",
			icon: Play,
			color: "from-purple-400 to-pink-400",
			emoji: "🎬",
		},
		{
			title: "Mini Games",
			description: "Play interactive learning games",
			icon: GamepadIcon,
			color: "from-teal-400 to-blue-400",
			emoji: "🎮",
		},
	];

	const miniGames = [
		{
			name: "Flappy Bird",
			icon: "🐦",
		},
		{
			name: "Snake",
			icon: "🐍",
		},
		{
			name: "Gentle Puzzle",
			icon: "🧩",
		},
		{
			name: "Bubble Pop",
			icon: "🫧",
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
		>
			<StageCardLayout>
				{/* Header Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="text-center mb-8"
				>
					<div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-4 shadow-lg">
						<GamepadIcon className="w-7 h-7 text-white" />
					</div>
					<h2 className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
						Fun Time!
					</h2>
					<p className="text-gray-600 text-lg font-medium">
						Let's play some games and watch videos
					</p>
				</motion.div>

				{/* Inline Games Panel or Activities List */}
				{showGamesPanel ? (
					<motion.div
						key="game-selection"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
						className="grid gap-6 mb-8"
					>
						<div className="text-center mb-4 text-2xl font-bold text-gray-800">
							Choose a Game!
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ">
							{miniGames.map((game) => {
								const slug = game.name.toLowerCase().replace(/\s+/g, "-");
								return (
									<motion.div
										key={game.name}
										whileHover={{
											scale: 1.05,
											boxShadow:
												"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
										}}
										whileTap={{ scale: 0.98 }}
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 20,
											duration: 0.3,
										}}
										className="relative cursor-pointer group rounded-3xl"
										onClick={() => navigate(`mini-games/${slug}`)}
									>
										{/* Glowing gradient blur background */}
										<div
											className={`absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 rounded-3xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300`}
										/>
										<Card className="relative flex flex-col items-center justify-center p-6 text-center rounded-3xl border-2 border-blue-200 group-hover:border-blue-400 bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300">
											<CardContent className="p-0 flex flex-col items-center">
												<span className="text-5xl mb-4">{game.icon}</span>
												<CardTitle className="text-xl font-extrabold text-gray-800">
													{game.name}
												</CardTitle>
											</CardContent>
										</Card>
									</motion.div>
								);
							})}
						</div>
						<Button
							variant="link"
							className="mt-6 text-lg font-semibold text-gray-600 hover:text-gray-800"
							onClick={() => updatePanelState("activities")}
						>
							<ArrowLeft className="w-5 h-5 mr-2" /> Back to Activities
						</Button>
					</motion.div>
				) : (
					// Main activities list
					<div className="grid gap-6 mb-8">
						{activities.map((activity, index) => (
							<motion.div
								key={activity.title}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								whileHover={{
									scale: 1.05,
									boxShadow:
										"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
								}}
								whileTap={{ scale: 0.98 }}
								transition={{
									delay: 0.3 + index * 0.1,
									duration: 0.5,
									type: "spring",
									stiffness: 300,
									damping: 20,
								}}
								className="group cursor-pointer rounded-3xl"
								onClick={
									activity.title === "Mini Games"
										? () => updatePanelState("games")
										: undefined
								}
							>
								<div className="relative">
									<div
										className={`absolute inset-0 bg-gradient-to-r ${activity.color} rounded-3xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300`}
									/>
									<div className="relative p-5 bg-white/90 backdrop-blur-md rounded-3xl border-2 border-gray-200 group-hover:border-gray-300 transition-all duration-300 shadow-md">
										<div className="flex items-center space-x-4">
											<div
												className={`w-12 h-12 bg-gradient-to-r ${activity.color} rounded-2xl flex items-center justify-center text-2xl shadow-md`}
											>
												{activity.emoji}
											</div>
											<div className="flex-1">
												<h3 className="text-lg font-bold text-gray-800 mb-1">
													{activity.title}
												</h3>
												<p className="text-gray-600 text-sm">
													{activity.description}
												</p>
											</div>
											<motion.div
												whileHover={{ scale: 1.1 }}
												whileTap={{ scale: 0.9 }}
												className={`w-10 h-10 bg-gradient-to-r ${activity.color} rounded-full flex items-center justify-center shadow-md`}
											>
												<activity.icon className="w-5 h-5 text-white" />
											</motion.div>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				)}

				{/* Call to action / Next adventure section */}
				{!showGamesPanel && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7, duration: 0.5 }}
						className="text-center mb-6"
					>
						<div className="p-5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl border-2 border-purple-200 shadow-md">
							<div className="text-3xl mb-2">🎉</div>
							<p className="text-lg text-purple-700 font-semibold">
								Great job exploring! Ready for the next adventure?
							</p>
						</div>
					</motion.div>
				)}

				{/* Navigation Buttons */}
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
						className="px-5 py-2.5 text-base font-semibold border-2 border-gray-300 text-gray-600 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 bg-transparent shadow-sm hover:shadow-md"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back
					</Button>
					<Button
						type="button"
						onClick={onNext}
						disabled={loading}
						className="px-7 py-2.5 text-base font-bold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

				{/* Error Message */}
				{error && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className="mt-4 p-4 bg-red-100 border border-red-300 rounded-2xl text-red-700 text-center text-sm shadow-sm"
					>
						{error}
					</motion.div>
				)}
			</StageCardLayout>
		</motion.div>
	);
}
