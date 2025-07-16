import { Sparkles, Star } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

// You can replace this with your own pop sound asset
const POP_SOUND = "/public/avatar-assets/sounds/click_select.mp3";

function randomBetween(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

interface Bubble {
	id: number;
	left: number; // percent
	size: number; // px
	duration: number; // seconds
	color: string;
}

interface Particle {
	id: number;
	x: number;
	y: number;
	color: string;
	size: number;
}

const SCORE_GOAL = 10;
const BUBBLE_COLORS = [
	"from-pink-400 to-pink-200",
	"from-purple-400 to-purple-200",
	"from-blue-400 to-blue-200",
	"from-green-400 to-green-200",
	"from-yellow-400 to-yellow-200",
	"from-orange-400 to-orange-200",
	"from-red-400 to-red-200",
	"from-cyan-400 to-cyan-200",
];

export default function BubblePop() {
	const [bubbles, setBubbles] = useState<Bubble[]>([]);
	const [popIds, setPopIds] = useState<number[]>([]);
	const [particles, setParticles] = useState<Particle[]>([]);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const nextId = useRef(1);
	const particleId = useRef(1);

	// Add bubbles at intervals (only if not game over)
	useEffect(() => {
		if (gameOver) return;
		const interval = setInterval(() => {
			setBubbles((prev) => [
				...prev,
				{
					id: nextId.current++,
					left: randomBetween(5, 90),
					size: randomBetween(50, 100),
					duration: randomBetween(5, 9),
					color:
						BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
				},
			]);
		}, 800);
		return () => clearInterval(interval);
	}, [gameOver]);

	// Remove bubbles that float out of view
	const handleBubbleEnd = (id: number) => {
		setBubbles((prev) => prev.filter((b) => b.id !== id));
	};

	// Create particle explosion effect
	const createParticles = (x: number, y: number) => {
		const newParticles: Particle[] = [];
		for (let i = 0; i < 8; i++) {
			newParticles.push({
				id: particleId.current++,
				x: x + randomBetween(-20, 20),
				y: y + randomBetween(-20, 20),
				color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
				size: randomBetween(4, 8),
			});
		}
		setParticles((prev) => [...prev, ...newParticles]);

		// Remove particles after animation
		setTimeout(() => {
			setParticles((prev) =>
				prev.filter((p) => !newParticles.some((np) => np.id === p.id)),
			);
		}, 600);
	};

	// Pop bubble
	const handlePop = (id: number, event: React.MouseEvent) => {
		const rect = event.currentTarget.getBoundingClientRect();
		const x = rect.left + rect.width / 2;
		const y = rect.top + rect.height / 2;

		createParticles(x, y);
		setPopIds((prev) => [...prev, id]);

		try {
			const audio = new Audio(POP_SOUND);
			audio.play().catch(() => {}); // Ignore audio errors
		} catch {
			// Ignore audio errors
		}

		setScore((prev) => {
			const newScore = prev + 1;
			if (newScore >= SCORE_GOAL) {
				setGameOver(true);
			}
			return newScore;
		});

		setTimeout(() => {
			setBubbles((prev) => prev.filter((b) => b.id !== id));
			setPopIds((prev) => prev.filter((pid) => pid !== id));
		}, 300);
	};

	// Reset game
	const handleReset = () => {
		setScore(0);
		setGameOver(false);
		setBubbles([]);
		setPopIds([]);
		setParticles([]);
		nextId.current = 1;
		particleId.current = 1;
	};

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 relative overflow-hidden">
			{/* Animated background stars */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{[...Array(20)].map((_, i) => (
					<Star
						key={`star-bg-${i + 1}`}
						className="absolute text-white/20 animate-pulse"
						size={randomBetween(10, 20)}
						style={{
							left: `${randomBetween(0, 100)}%`,
							top: `${randomBetween(0, 100)}%`,
							animationDelay: `${randomBetween(0, 3)}s`,
							animationDuration: `${randomBetween(2, 4)}s`,
						}}
					/>
				))}
			</div>

			<div className="flex flex-col items-center justify-start min-h-screen w-full pt-8 relative z-10">
				<div className="w-full max-w-2xl flex flex-col items-center mb-6">
					<div className="flex items-center gap-2 mb-4">
						<Sparkles className="text-yellow-300 animate-spin" size={32} />
						<h2 className="text-4xl font-black text-white drop-shadow-lg parent">
							Bubble Pop Adventure! 🫧
						</h2>
						<Sparkles className="text-yellow-300 animate-spin" size={32} />
					</div>

					<div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border-4 border-white">
						<p className="text-lg font-bold text-purple-600 text-center">
							🎯 Pop the colorful bubbles! 🎯
						</p>
					</div>

					<div className="mt-4 bg-gradient-to-r from-green-400 to-blue-400 rounded-2xl px-8 py-4 shadow-lg border-4 border-white">
						<div className="text-2xl font-black text-white text-center drop-shadow-md">
							⭐ Score: {score} / {SCORE_GOAL} ⭐
						</div>
						<div className="w-full bg-white/30 rounded-full h-3 mt-2">
							<div
								className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500 shadow-inner"
								style={{ width: `${(score / SCORE_GOAL) * 100}%` }}
							/>
						</div>
					</div>
				</div>

				<div className="relative w-full max-w-6xl h-[500px] bg-gradient-to-b from-cyan-200/50 to-blue-300/50 backdrop-blur-sm rounded-3xl shadow-2xl border-4 border-white/50 overflow-hidden">
					{/* Floating bubbles in background */}
					<div className="absolute inset-0 pointer-events-none">
						{[...Array(5)].map((_, i) => (
							<div
								key={`float-bubble-bg-${i + 1}`}
								className="absolute w-4 h-4 bg-white/20 rounded-full animate-bounce"
								style={{
									left: `${randomBetween(10, 90)}%`,
									top: `${randomBetween(10, 90)}%`,
									animationDelay: `${randomBetween(0, 2)}s`,
									animationDuration: `${randomBetween(2, 4)}s`,
								}}
							/>
						))}
					</div>

					{/* Game bubbles */}
					{bubbles.map((bubble) => {
						const isPopping = popIds.includes(bubble.id);
						return (
							<button
								key={bubble.id}
								type="button"
								onClick={(e) => handlePop(bubble.id, e)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										handlePop(
											bubble.id,
											e as React.KeyboardEvent<HTMLButtonElement> as unknown as React.MouseEvent<HTMLButtonElement>,
										);
									}
								}}
								aria-label="Pop bubble"
								className={`absolute cursor-pointer select-none transition-all duration-300 bg-transparent border-none p-0 m-0 ${
									isPopping ? "scale-150 opacity-0" : "active:scale-95"
								}`}
								style={{
									left: `calc(${bubble.left}% - ${bubble.size / 2}px)`,
									bottom: 0,
									width: bubble.size,
									height: bubble.size,
									zIndex: 10,
									animation: isPopping
										? undefined
										: `bubble-float ${bubble.duration}s linear forwards`,
								}}
								onAnimationEnd={() => handleBubbleEnd(bubble.id)}
								disabled={gameOver}
							>
								<div
									className={`w-full h-full rounded-full bg-gradient-to-br ${bubble.color} border-4 border-white shadow-2xl relative overflow-hidden`}
									style={{
										boxShadow:
											"0 0 30px 10px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.5)",
									}}
								>
									{/* Bubble shine effect */}
									<div className="absolute top-2 left-2 w-1/3 h-1/3 bg-white/60 rounded-full blur-sm" />
									<div className="absolute top-1 left-1 w-1/4 h-1/4 bg-white/80 rounded-full" />
								</div>
							</button>
						);
					})}

					{/* Particle effects */}
					{particles.map((particle) => (
						<div
							key={particle.id}
							className={`absolute pointer-events-none rounded-full bg-gradient-to-br ${particle.color} animate-ping`}
							style={{
								left: particle.x,
								top: particle.y,
								width: particle.size,
								height: particle.size,
								animationDuration: "0.6s",
							}}
						/>
					))}

					{/* Bubble float animation */}
					<style>{`
                        @keyframes bubble-float {
                            0% { 
                                transform: translateY(0) rotate(0deg); 
                            }
                            25% { 
                                transform: translateY(-20vh) rotate(90deg); 
                            }
                            50% { 
                                transform: translateY(-40vh) rotate(180deg); 
                            }
                            75% { 
                                transform: translateY(-60vh) rotate(270deg); 
                            }
                            100% { 
                                transform: translateY(-80vh) rotate(360deg); 
                            }
                        }
                    `}</style>

					{/* Game over screen */}
					{gameOver && (
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-300/95 to-pink-300/95 backdrop-blur-sm z-20 rounded-3xl border-4 border-white">
							<div className="text-center space-y-4 animate-bounce">
								<div className="text-6xl animate-pulse">🎉</div>
								<div className="text-4xl font-black text-purple-600 drop-shadow-lg">
									AMAZING! 🌟
								</div>
								<div className="text-2xl font-bold text-blue-600">
									You popped all {SCORE_GOAL} bubbles! 🫧
								</div>
								<div className="flex gap-2 text-3xl animate-pulse">
									⭐ 🎊 ⭐ 🎊 ⭐
								</div>
							</div>
							<button
								type="button"
								onClick={handleReset}
								className="mt-6 px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-2xl font-black text-xl shadow-2xl border-4 border-white hover:scale-110 hover:rotate-3 transition-all duration-300 active:scale-95"
							>
								🚀 Play Again! 🚀
							</button>
						</div>
					)}
				</div>

				{/* Fun footer message */}
				<div className="mt-6 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border-4 border-white">
					<p className="text-lg font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
						🌈 Keep popping for fun! 🌈
					</p>
				</div>
			</div>
		</div>
	);
}
