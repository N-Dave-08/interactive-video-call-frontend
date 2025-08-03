import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuestionStore } from "@/store/questionStore";
import { useStageAudio } from "@/hooks/useStageAudio";
import StageCardLayout from "../layouts/StageCardLayout";

interface ConversationData {
	currentQuestionIndex: number;
	questionsAsked: number;
	totalQuestions: number;
}

export default function Stage4Other({
	value = {
		currentQuestionIndex: 0,
		questionsAsked: 0,
		totalQuestions: 0,
	},
	onChange = () => {},
	onNext,
	onBack,
	loading,
	error,
}: {
	value?: ConversationData;
	onChange?: (val: ConversationData) => void;
	onNext: () => void;
	onBack: () => void;
	loading?: boolean;
	error?: string;
}) {
	const setQuestion = useQuestionStore((s) => s.setQuestion);
	const [isAsking, setIsAsking] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
		value?.currentQuestionIndex || 0,
	);
	const [questionsAsked, setQuestionsAsked] = useState(
		value?.questionsAsked || 0,
	);

	// Stage audio management
	useStageAudio("stage4");

	const selectSound = () => {
		const audio = new Audio("/event/sounds/select.mp3");
		audio.play().catch(() => {}); // Ignore errors if audio fails
	};

	const questions = [
		{
			emoji: "🚀",
			text: "What do you want to be when you grow up?",
			subtitle: "Dream big, you can do anything!",
			bgColor: "from-blue-400 via-purple-500 to-pink-500",
		},
		{
			emoji: "🎨",
			text: "What's your favorite thing to create?",
			subtitle: "Let your imagination run wild!",
			bgColor: "from-pink-400 via-red-400 to-orange-400",
		},
		{
			emoji: "⭐",
			text: "If you could have any superpower, what would it be?",
			subtitle: "You're already super amazing!",
			bgColor: "from-yellow-400 via-orange-400 to-red-400",
		},
		{
			emoji: "🌈",
			text: "What makes you really happy?",
			subtitle: "Happiness is the best superpower!",
			bgColor: "from-green-400 via-blue-400 to-purple-400",
		},
		{
			emoji: "🦄",
			text: "What's the most magical thing you can imagine?",
			subtitle: "Magic is all around us!",
			bgColor: "from-purple-400 via-pink-400 to-purple-600",
		},
		{
			emoji: "🌟",
			text: "If you could visit anywhere in the world, where would you go?",
			subtitle: "Adventure awaits everywhere!",
			bgColor: "from-cyan-400 via-blue-400 to-indigo-500",
		},
		{
			emoji: "📚",
			text: "What's your favorite story or book?",
			subtitle: "Stories take us on magical journeys!",
			bgColor: "from-indigo-400 via-blue-500 to-teal-400",
		},
		{
			emoji: "🎵",
			text: "If your life had a theme song, what would it sound like?",
			subtitle: "Everyone has their own special rhythm!",
			bgColor: "from-pink-500 via-purple-500 to-indigo-500",
		},
		{
			emoji: "🐉",
			text: "If you had a pet dragon, what would you name it?",
			subtitle: "Every great adventure needs a sidekick!",
			bgColor: "from-red-400 via-yellow-500 to-pink-500",
		},
		{
			emoji: "🚪",
			text: "If you opened a magic door, where would it lead?",
			subtitle: "Behind every door is a new wonder!",
			bgColor: "from-teal-400 via-green-400 to-lime-400",
		},
		{
			emoji: "👽",
			text: "What would you say to an alien visitor?",
			subtitle: "Even space friends need a hello!",
			bgColor: "from-lime-400 via-cyan-400 to-blue-500",
		},
		{
			emoji: "⏳",
			text: "If you had a time machine, what year would you visit?",
			subtitle: "Past or future, it's your adventure!",
			bgColor: "from-yellow-300 via-orange-400 to-pink-500",
		},
		{
			emoji: "🍕",
			text: "If you could invent a new food, what would it be?",
			subtitle: "Yum! The world needs your recipe!",
			bgColor: "from-orange-300 via-red-300 to-yellow-400",
		},
		{
			emoji: "🖌️",
			text: "If you could paint the sky, what colors would you use?",
			subtitle: "The sky is your canvas!",
			bgColor: "from-purple-300 via-blue-300 to-pink-300",
		},
		{
			emoji: "🎭",
			text: "If you could be any character in a movie, who would you be?",
			subtitle: "Lights, camera, action — you're the star!",
			bgColor: "from-red-400 via-pink-500 to-purple-400",
		},
		{
			emoji: "⚙️",
			text: "If you could build a robot, what would it do?",
			subtitle: "The best inventions start with big ideas!",
			bgColor: "from-gray-400 via-blue-500 to-cyan-400",
		},
		{
			emoji: "🌌",
			text: "What do you think outer space smells like?",
			subtitle: "Let your imagination blast off!",
			bgColor: "from-indigo-600 via-purple-500 to-blue-500",
		},
		{
			emoji: "🧃",
			text: "If you could make your own drink flavor, what would it taste like?",
			subtitle: "Sweet, silly, or super sour — your choice!",
			bgColor: "from-orange-300 via-yellow-400 to-pink-300",
		},
		{
			emoji: "🛸",
			text: "What would your spaceship look like?",
			subtitle: "Design it your way, captain!",
			bgColor: "from-blue-300 via-teal-400 to-indigo-400",
		},
		{
			emoji: "🏰",
			text: "If you had a castle, what would be inside?",
			subtitle: "Build your dream kingdom!",
			bgColor: "from-purple-500 via-indigo-500 to-blue-500",
		},
		{
			emoji: "🧞",
			text: "If a genie gave you 3 wishes, what would you wish for?",
			subtitle: "Use them wisely—or wildly!",
			bgColor: "from-teal-300 via-cyan-400 to-indigo-400",
		},
		{
			emoji: "🌳",
			text: "If you could talk to animals, what would you ask them?",
			subtitle: "Imagine the stories they'd tell!",
			bgColor: "from-green-400 via-lime-400 to-yellow-300",
		},
		{
			emoji: "🏝️",
			text: "What would you do on a secret island?",
			subtitle: "Your own hidden paradise awaits!",
			bgColor: "from-yellow-400 via-orange-300 to-pink-400",
		},
		{
			emoji: "🎂",
			text: "If you could design the perfect birthday party, what would it be like?",
			subtitle: "The cake, the games, the fun — all yours!",
			bgColor: "from-pink-300 via-red-400 to-purple-400",
		},
	];

	useEffect(() => {
		setQuestion(
			"Let's have a fun conversation! I'd love to get to know you better.",
		);
	}, [setQuestion]);

	const handleNextQuestion = () => {
		selectSound();
		setIsAsking(true);
		setTimeout(() => {
			const newIndex = (currentQuestionIndex + 1) % questions.length;
			// Don't increment questionsAsked beyond the total number of questions
			const newQuestionsAsked = Math.min(questionsAsked + 1, questions.length);

			setCurrentQuestionIndex(newIndex);
			setQuestionsAsked(newQuestionsAsked);

			// Update the parent component with new data
			onChange({
				currentQuestionIndex: newIndex,
				questionsAsked: newQuestionsAsked,
				totalQuestions: questions.length,
			});

			setIsAsking(false);
		}, 800);
	};

	const currentQuestion = questions[currentQuestionIndex];

	return (
		<StageCardLayout>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2, duration: 0.5 }}
				className="text-center mb-8"
			>
				<h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
					Let's Chat!
				</h2>
				<p className="text-gray-600 text-lg font-semibold">
					A super fun way to connect with amazing kids!
				</p>
			</motion.div>

			{/* Main Question Card */}
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.3, duration: 0.5 }}
				className="mb-8"
			>
				<div className="overflow-hidden shadow-xl border-0 transform hover:scale-[1.02] transition-all duration-500 rounded-lg">
					<div
						className={`bg-gradient-to-r rounded-lg ${currentQuestion.bgColor} text-white p-8 text-center relative overflow-hidden`}
					>
						<div className="relative z-10 max-w-3xl mx-auto">
							<div className="text-6xl mb-4 animate-bounce">
								{currentQuestion.emoji}
							</div>
							<h3 className="text-2xl md:text-3xl font-black mb-3 leading-tight drop-shadow-lg">
								{currentQuestion.text}
							</h3>
							<p className="text-white/95 text-lg md:text-xl font-bold">
								{currentQuestion.subtitle}
							</p>
						</div>
					</div>
				</div>
			</motion.div>

			{/* Ask Next Question Button */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.5 }}
				className="flex justify-center mb-8"
			>
				<Button
					onClick={handleNextQuestion}
					disabled={isAsking || questionsAsked >= questions.length}
					className={`px-8 py-4 text-lg font-black rounded-full shadow-xl transform transition-all duration-300 border-4 border-white/30 ${
						isAsking || questionsAsked >= questions.length
							? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50 scale-100"
							: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white hover:scale-110"
					}`}
				>
					{isAsking
						? "Getting new question..."
						: questionsAsked >= questions.length
							? "All questions asked!"
							: "Ask Next Question"}
				</Button>
			</motion.div>

			{/* Feature Cards */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.5 }}
				className="grid md:grid-cols-2 gap-6 mb-8"
			>
				<Card className="bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
					<CardContent className="p-6 text-center">
						<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-sky-500 rounded-full flex items-center justify-center shadow-xl">
							<Clock className="w-8 h-8 text-white" />
						</div>
						<h4 className="font-black text-gray-800 text-xl mb-2">
							Take Your Time!
						</h4>
						<p className="text-gray-600 text-sm leading-relaxed font-semibold">
							Let the child think and express themselves freely! No rush!
						</p>
					</CardContent>
				</Card>

				<Card className="bg-gradient-to-br from-emerald-100 via-green-100 to-lime-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
					<CardContent className="p-6 text-center">
						<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl">
							<Star className="w-8 h-8 text-white" />
						</div>
						<h4 className="font-black text-gray-800 text-xl mb-2">
							No Wrong Answers!
						</h4>
						<p className="text-gray-600 text-sm leading-relaxed font-semibold">
							Every answer is perfect and special! You're amazing!
						</p>
					</CardContent>
				</Card>
			</motion.div>

			{/* Progress Badge */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.5 }}
				className="flex justify-center mb-8"
			>
				<Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 text-sm font-black rounded-full shadow-lg">
					{questionsAsked} questions asked • {questions.length} total questions
				</Badge>
			</motion.div>

			{/* Navigation Buttons */}
			<div className="sticky bottom-0 w-full z-20 bg-white/80 backdrop-blur-sm py-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7, duration: 0.5 }}
					className="flex justify-between items-center"
				>
					<Button
						type="button"
						variant="outline"
						onClick={onBack}
						className="px-6 py-3 text-base font-semibold border-2 border-gray-300 text-gray-600 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 bg-transparent relative z-10"
					>
						<ArrowLeft className="w-5 h-5 mr-2" />
						Back
					</Button>

					<Button
						type="button"
						onClick={onNext}
						disabled={loading}
						className={`px-8 py-3 text-base font-semibold rounded-2xl shadow-lg transition-all duration-300 relative z-10 ${
							loading
								? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
								: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:shadow-xl transform hover:scale-105 cursor-pointer"
						}`}
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
						{loading ? "Saving..." : "Next Step!"}
					</Button>
				</motion.div>
				{error && <div className="text-red-500 text-center mt-2">{error}</div>}
			</div>
		</StageCardLayout>
	);
}
