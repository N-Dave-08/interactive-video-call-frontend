import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Bird {
	x: number;
	y: number;
	velocity: number;
	radius: number;
}

interface Pipe {
	x: number;
	topHeight: number;
	bottomY: number;
	width: number;
	gap: number;
	passed: boolean;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_RADIUS = 15;
const GRAVITY = 0.5;
const JUMP_FORCE = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 2;

export default function FlappyBird() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);

	const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
		"menu",
	);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);

	const birdRef = useRef<Bird>({
		x: 100,
		y: CANVAS_HEIGHT / 2,
		velocity: 0,
		radius: BIRD_RADIUS,
	});

	const pipesRef = useRef<Pipe[]>([]);
	const frameCountRef = useRef(0);

	// Initialize high score from localStorage
	useEffect(() => {
		const savedHighScore = localStorage.getItem("flappyBirdHighScore");
		if (savedHighScore) {
			setHighScore(Number.parseInt(savedHighScore));
		}
	}, []);

	const resetGame = useCallback(() => {
		birdRef.current = {
			x: 100,
			y: CANVAS_HEIGHT / 2,
			velocity: 0,
			radius: BIRD_RADIUS,
		};
		pipesRef.current = [];
		frameCountRef.current = 0;
		setScore(0);
	}, []);

	const startGame = useCallback(() => {
		resetGame();
		setGameState("playing");
	}, [resetGame]);

	const jump = useCallback(() => {
		if (gameState === "playing") {
			birdRef.current.velocity = JUMP_FORCE;
		} else if (gameState === "menu" || gameState === "gameOver") {
			startGame();
		}
	}, [gameState, startGame]);

	const generatePipe = useCallback((): Pipe => {
		const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
		return {
			x: CANVAS_WIDTH,
			topHeight,
			bottomY: topHeight + PIPE_GAP,
			width: PIPE_WIDTH,
			gap: PIPE_GAP,
			passed: false,
		};
	}, []);

	const checkCollision = useCallback((bird: Bird, pipes: Pipe[]): boolean => {
		// Check ground and ceiling collision
		if (bird.y + bird.radius >= CANVAS_HEIGHT || bird.y - bird.radius <= 0) {
			return true;
		}

		// Check pipe collision
		for (const pipe of pipes) {
			// Check if bird is within pipe's x range
			if (
				bird.x + bird.radius > pipe.x &&
				bird.x - bird.radius < pipe.x + pipe.width
			) {
				// Check if bird hits top or bottom pipe
				if (
					bird.y - bird.radius < pipe.topHeight ||
					bird.y + bird.radius > pipe.bottomY
				) {
					return true;
				}
			}
		}

		return false;
	}, []);

	const updateGame = useCallback(() => {
		if (gameState !== "playing") return;

		const bird = birdRef.current;
		const pipes = pipesRef.current;

		// Update bird physics
		bird.velocity += GRAVITY;
		bird.y += bird.velocity;

		// Generate new pipes
		frameCountRef.current++;
		if (frameCountRef.current % 120 === 0) {
			// Every 2 seconds at 60fps
			pipes.push(generatePipe());
		}

		// Update pipes
		for (let i = pipes.length - 1; i >= 0; i--) {
			const pipe = pipes[i];
			pipe.x -= PIPE_SPEED;

			// Check if bird passed the pipe
			if (!pipe.passed && bird.x > pipe.x + pipe.width) {
				pipe.passed = true;
				setScore((prev) => prev + 1);
			}

			// Remove pipes that are off screen
			if (pipe.x + pipe.width < 0) {
				pipes.splice(i, 1);
			}
		}

		// Check collisions
		if (checkCollision(bird, pipes)) {
			setGameState("gameOver");
			const newHighScore = Math.max(score, highScore);
			setHighScore(newHighScore);
			localStorage.setItem("flappyBirdHighScore", newHighScore.toString());
		}
	}, [gameState, generatePipe, checkCollision, score, highScore]);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Clear canvas with sky blue background
		ctx.fillStyle = "#87CEEB";
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

		// Draw clouds
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		for (let i = 0; i < 3; i++) {
			const x =
				((frameCountRef.current * 0.5 + i * 150) % (CANVAS_WIDTH + 100)) - 50;
			ctx.beginPath();
			ctx.arc(x, 80 + i * 40, 20, 0, Math.PI * 2);
			ctx.arc(x + 25, 80 + i * 40, 25, 0, Math.PI * 2);
			ctx.arc(x + 50, 80 + i * 40, 20, 0, Math.PI * 2);
			ctx.fill();
		}

		if (gameState === "playing" || gameState === "gameOver") {
			// Draw pipes
			ctx.fillStyle = "#228B22";
			pipesRef.current.forEach((pipe) => {
				// Top pipe
				ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
				// Bottom pipe
				ctx.fillRect(
					pipe.x,
					pipe.bottomY,
					pipe.width,
					CANVAS_HEIGHT - pipe.bottomY,
				);

				// Pipe caps
				ctx.fillStyle = "#32CD32";
				ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, pipe.width + 10, 20);
				ctx.fillRect(pipe.x - 5, pipe.bottomY, pipe.width + 10, 20);
				ctx.fillStyle = "#228B22";
			});

			// Draw bird
			const bird = birdRef.current;
			ctx.save();
			ctx.translate(bird.x, bird.y);

			// Rotate bird based on velocity
			const rotation = Math.min(Math.max(bird.velocity * 0.1, -0.5), 0.5);
			ctx.rotate(rotation);

			// Bird body
			ctx.fillStyle = "#FFD700";
			ctx.beginPath();
			ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
			ctx.fill();

			// Bird eye
			ctx.fillStyle = "white";
			ctx.beginPath();
			ctx.arc(5, -5, 4, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = "black";
			ctx.beginPath();
			ctx.arc(6, -4, 2, 0, Math.PI * 2);
			ctx.fill();

			// Bird beak
			ctx.fillStyle = "#FF8C00";
			ctx.beginPath();
			ctx.moveTo(bird.radius - 2, 0);
			ctx.lineTo(bird.radius + 8, -2);
			ctx.lineTo(bird.radius + 8, 2);
			ctx.closePath();
			ctx.fill();

			ctx.restore();
		}

		// Draw score
		if (gameState === "playing" || gameState === "gameOver") {
			ctx.fillStyle = "white";
			ctx.strokeStyle = "black";
			ctx.lineWidth = 2;
			ctx.font = "bold 32px Arial";
			ctx.textAlign = "center";
			ctx.strokeText(score.toString(), CANVAS_WIDTH / 2, 60);
			ctx.fillText(score.toString(), CANVAS_WIDTH / 2, 60);
		}

		// Draw game over screen
		if (gameState === "gameOver") {
			ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
			ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

			ctx.fillStyle = "white";
			ctx.font = "bold 36px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Game Over!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

			ctx.font = "bold 24px Arial";
			ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
			ctx.fillText(
				`Best: ${highScore}`,
				CANVAS_WIDTH / 2,
				CANVAS_HEIGHT / 2 + 20,
			);

			ctx.font = "18px Arial";
			ctx.fillText(
				"Click to restart",
				CANVAS_WIDTH / 2,
				CANVAS_HEIGHT / 2 + 60,
			);
		}

		// Draw start screen
		if (gameState === "menu") {
			ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
			ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

			ctx.fillStyle = "white";
			ctx.font = "bold 36px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Flappy Bird", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);

			ctx.font = "18px Arial";
			ctx.fillText("Click to start", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
			ctx.fillText(
				"Click to flap wings",
				CANVAS_WIDTH / 2,
				CANVAS_HEIGHT / 2 + 30,
			);

			if (highScore > 0) {
				ctx.fillText(
					`Best Score: ${highScore}`,
					CANVAS_WIDTH / 2,
					CANVAS_HEIGHT / 2 + 70,
				);
			}
		}
	}, [gameState, score, highScore]);

	const gameLoop = useCallback(() => {
		updateGame();
		draw();
		animationRef.current = requestAnimationFrame(gameLoop);
	}, [updateGame, draw]);

	useEffect(() => {
		gameLoop();
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [gameLoop]);

	// Handle keyboard input
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code === "Space" || e.code === "ArrowUp") {
				e.preventDefault();
				jump();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [jump]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-blue-600 p-4">
			<Card className="p-6 bg-white/90 backdrop-blur-sm shadow-2xl">
				<div className="text-center mb-4">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Flappy Bird</h1>
					<p className="text-gray-600">Click or press Space/↑ to flap!</p>
				</div>

				<div className="relative">
					<canvas
						ref={canvasRef}
						width={CANVAS_WIDTH}
						height={CANVAS_HEIGHT}
						onClick={jump}
						className="border-2 border-gray-300 rounded-lg cursor-pointer bg-sky-200"
						style={{ display: "block" }}
					/>
				</div>

				<div className="flex justify-center gap-4 mt-4">
					<Button
						onClick={startGame}
						variant="default"
						className="bg-green-500 hover:bg-green-600"
					>
						{gameState === "menu" ? "Start Game" : "Restart"}
					</Button>

					<div className="flex items-center gap-4 text-sm text-gray-600">
						<span>Score: {score}</span>
						<span>Best: {highScore}</span>
					</div>
				</div>

				<div className="text-center mt-4 text-sm text-gray-500">
					<p>Use mouse click, spacebar, or arrow up key to play</p>
				</div>
			</Card>
		</div>
	);
}
