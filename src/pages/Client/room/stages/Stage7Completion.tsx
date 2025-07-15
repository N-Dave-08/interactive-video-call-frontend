import {
	Heart,
	Home,
	PartyPopper,
	Sparkles,
	Star,
	Trophy,
	Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuestionStore } from "@/store/questionStore";

interface Stage7CompletionProps {
	childName: string;
	onBack: () => void;
}

export default function Stage7Completion({ childName }: Stage7CompletionProps) {
	const [confetti, setConfetti] = useState<
		Array<{ id: number; x: number; y: number; color: string }>
	>([]);
	const navigate = useNavigate();
	const setQuestion = useQuestionStore((s) => s.setQuestion);

	// Generate confetti on mount
	useEffect(() => {
		setQuestion("🎉 Congratulations! 🎉");
	}, [setQuestion]);

	useEffect(() => {
		const colors = [
			"#FF6B6B",
			"#4ECDC4",
			"#45B7D1",
			"#96CEB4",
			"#FFEAA7",
			"#DDA0DD",
			"#98D8C8",
		];
		const newConfetti = Array.from({ length: 50 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			color: colors[Math.floor(Math.random() * colors.length)],
		}));
		setConfetti(newConfetti);
	}, []);

	const handleGoHome = () => {
		navigate("/dashboard");
	};

	const handleNewSession = () => {
		navigate("/sessions");
	};

	return (
		<div className="flex items-center justify-center p-4">
			<div className="relative bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full">
				{/* Animated Background Elements */}
				<div className="absolute inset-0 overflow-hidden">
					{/* Floating balloons */}
					<motion.div
						animate={{ y: [-5, 5, -5] }}
						transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
						className="absolute top-4 left-4 w-6 h-8 bg-red-400 rounded-full opacity-60"
					/>
					<motion.div
						animate={{ y: [5, -5, 5] }}
						transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
						className="absolute top-8 right-6 w-4 h-6 bg-blue-400 rounded-full opacity-60"
					/>
					<motion.div
						animate={{ y: [-4, 4, -4] }}
						transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
						className="absolute bottom-8 left-1/4 w-5 h-7 bg-green-400 rounded-full opacity-60"
					/>

					{/* Confetti */}
					{confetti.map((piece) => (
						<motion.div
							key={piece.id}
							initial={{ y: -50, x: piece.x, opacity: 1 }}
							animate={{ y: 400, opacity: 0 }}
							transition={{
								duration: 3 + Math.random() * 2,
								delay: Math.random() * 2,
							}}
							className="absolute w-1 h-1 rounded-full"
							style={{ backgroundColor: piece.color, left: `${piece.x}%` }}
						/>
					))}
				</div>

				{/* Main Content */}
				<div className="relative z-10 flex flex-col items-center justify-center p-6">
					<motion.div
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
						className="text-center mb-6"
					>
						<div className="relative inline-block">
							<Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
							<motion.div
								animate={{ rotate: [0, 10, -10, 0] }}
								transition={{ duration: 2, repeat: Infinity }}
								className="absolute -top-1 -right-1"
							>
								<Sparkles className="w-5 h-5 text-yellow-400" />
							</motion.div>
						</div>
						<h1 className="text-4xl font-bold text-purple-600 mb-3">
							🎉 Congratulations! 🎉
						</h1>
						<p className="text-lg text-gray-700 mb-2">
							Great job,{" "}
							<span className="font-bold text-pink-600">{childName}</span>!
						</p>
						<p className="text-base text-gray-600">
							You've completed your session successfully!
						</p>
					</motion.div>

					{/* Achievement Cards */}
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.8 }}
						className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-3xl"
					>
						<motion.div whileHover={{ scale: 1.05 }} className="group">
							<Card className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 border-2 border-pink-200 hover:border-pink-300 transition-all duration-300">
								<div className="text-center">
									<motion.div
										animate={{ y: [0, -10, 0] }}
										transition={{
											duration: 3,
											repeat: Infinity,
											ease: "linear",
										}}
										className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-3"
									>
										<Heart className="w-6 h-6 text-pink-600" />
									</motion.div>
									<h3 className="text-lg font-bold text-pink-700 mb-1">
										Emotional Growth
									</h3>
									<p className="text-sm text-pink-600">
										You explored your feelings beautifully!
									</p>
								</div>
							</Card>
						</motion.div>

						<motion.div whileHover={{ scale: 1.05 }} className="group">
							<Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
								<div className="text-center">
									<motion.div
										animate={{ rotate: [0, 360] }}
										transition={{ duration: 1, repeat: Infinity }}
										className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-3"
									>
										<Star className="w-6 h-6 text-blue-600" />
									</motion.div>
									<h3 className="text-lg font-bold text-blue-700 mb-1">
										Creative Expression
									</h3>
									<p className="text-sm text-blue-600">
										Your imagination is amazing!
									</p>
								</div>
							</Card>
						</motion.div>

						<motion.div whileHover={{ scale: 1.05 }} className="group">
							<Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-300 transition-all duration-300">
								<div className="text-center">
									<motion.div
										animate={{ scale: [1, 1.2, 1] }}
										transition={{ duration: 2, repeat: Infinity }}
										className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-3"
									>
										<PartyPopper className="w-6 h-6 text-green-600" />
									</motion.div>
									<h3 className="text-lg font-bold text-green-700 mb-1">
										Session Complete
									</h3>
									<p className="text-sm text-green-600">
										You finished everything perfectly!
									</p>
								</div>
							</Card>
						</motion.div>
					</motion.div>

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1, duration: 0.8 }}
						className="flex flex-col sm:flex-row gap-3"
					>
						<Button
							onClick={handleGoHome}
							className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
						>
							<Home className="w-4 h-4 mr-2" />
							Go Home
						</Button>
						<Button
							onClick={handleNewSession}
							variant="outline"
							className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-6 py-2 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
						>
							<Users className="w-4 h-4 mr-2" />
							New Session
						</Button>
					</motion.div>

					{/* Fun Stats */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1.5, duration: 0.8 }}
						className="mt-6 text-center"
					>
						<div className="flex flex-wrap justify-center gap-3">
							<Badge
								variant="secondary"
								className="bg-yellow-100 text-yellow-800 px-3 py-1 text-xs"
							>
								⭐ Session Complete
							</Badge>
							<Badge
								variant="secondary"
								className="bg-pink-100 text-pink-800 px-3 py-1 text-xs"
							>
								💖 Emotional Check-in Done
							</Badge>
							<Badge
								variant="secondary"
								className="bg-blue-100 text-blue-800 px-3 py-1 text-xs"
							>
								🎨 Creative Activities Finished
							</Badge>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
