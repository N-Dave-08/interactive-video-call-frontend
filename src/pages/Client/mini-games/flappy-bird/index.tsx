import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import MiniGameLayout from "../MiniGameLayout";

const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 500;
const BIRD_RADIUS = 18;
const GRAVITY = 0.1;
const JUMP_FORCE = -7;
const PIPE_WIDTH = 60;
const PIPE_GAP = 180; // Wider gap for kids
const PIPE_SPEED = 1.5; // Slower pipes

function getRandomPipeY() {
	// Keep pipes in a friendly range
	return Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 120) + 60;
}

export default function FlappyBird() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);

	const [gameState, setGameState] = useState<"menu" | "playing" | "gameOver">(
		"menu",
	);
	const [score, setScore] = useState(0);
	const [highScore, setHighScore] = useState(0);

	type Bird = {
		x: number;
		y: number;
		velocity: number;
		radius: number;
	};
	type Pipe = {
		x: number;
		topY: number;
		bottomY: number;
		passed: boolean;
	};
	const birdRef = useRef<Bird>({
		x: 80,
		y: CANVAS_HEIGHT / 2,
		velocity: 0,
		radius: BIRD_RADIUS,
	});
	const pipesRef = useRef<Pipe[]>([]);
	const frameCountRef = useRef(0);

	useEffect(() => {
		const saved = localStorage.getItem("flappyBirdHighScore");
		if (saved) setHighScore(Number(saved));
	}, []);

	const resetGame = useCallback(() => {
		birdRef.current = {
			x: 80,
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

	const checkCollision = useCallback((bird: Bird, pipes: Pipe[]) => {
		if (bird.y + bird.radius >= CANVAS_HEIGHT || bird.y - bird.radius <= 0) {
			return true;
		}
		for (const pipe of pipes) {
			if (
				bird.x + bird.radius > pipe.x &&
				bird.x - bird.radius < pipe.x + PIPE_WIDTH
			) {
				if (
					bird.y - bird.radius < pipe.topY ||
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
		bird.velocity += GRAVITY;
		bird.y += bird.velocity;
		frameCountRef.current++;
		if (frameCountRef.current % 110 === 0) {
			const topY = getRandomPipeY();
			pipes.push({
				x: CANVAS_WIDTH,
				topY,
				bottomY: topY + PIPE_GAP,
				passed: false,
			});
		}
		for (let i = pipes.length - 1; i >= 0; i--) {
			pipes[i].x -= PIPE_SPEED;
			if (!pipes[i].passed && bird.x > pipes[i].x + PIPE_WIDTH) {
				pipes[i].passed = true;
				setScore((s) => s + 1);
			}
			if (pipes[i].x + PIPE_WIDTH < 0) {
				pipes.splice(i, 1);
			}
		}
		if (checkCollision(bird, pipes)) {
			setGameState("gameOver");
			setHighScore((prev) => {
				const newHigh = Math.max(prev, score);
				localStorage.setItem("flappyBirdHighScore", String(newHigh));
				return newHigh;
			});
		}
	}, [gameState, score, checkCollision]);

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		// Sky
		ctx.fillStyle = "#87CEEB";
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		// Clouds
		ctx.fillStyle = "#fff8";
		ctx.beginPath();
		ctx.arc(60, 80, 20, 0, Math.PI * 2);
		ctx.arc(100, 90, 25, 0, Math.PI * 2);
		ctx.arc(140, 80, 20, 0, Math.PI * 2);
		ctx.fill();
		// Pipes
		ctx.fillStyle = "#4ade80";
		pipesRef.current.forEach((pipe) => {
			ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topY);
			ctx.fillRect(
				pipe.x,
				pipe.bottomY,
				PIPE_WIDTH,
				CANVAS_HEIGHT - pipe.bottomY,
			);
			ctx.fillStyle = "#22c55e";
			ctx.fillRect(pipe.x - 3, pipe.topY - 18, PIPE_WIDTH + 6, 18);
			ctx.fillRect(pipe.x - 3, pipe.bottomY, PIPE_WIDTH + 6, 18);
			ctx.fillStyle = "#4ade80";
		});
		// Bird
		const bird = birdRef.current;
		ctx.save();
		ctx.translate(bird.x, bird.y);
		ctx.rotate(Math.min(Math.max(bird.velocity * 0.08, -0.4), 0.4));
		ctx.fillStyle = "#facc15";
		ctx.beginPath();
		ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.arc(7, -6, 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#000";
		ctx.beginPath();
		ctx.arc(9, -6, 2, 0, Math.PI * 2);
		ctx.fill();
		ctx.fillStyle = "#f87171";
		ctx.beginPath();
		ctx.moveTo(bird.radius - 2, 0);
		ctx.lineTo(bird.radius + 10, -3);
		ctx.lineTo(bird.radius + 10, 3);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
		// Score
		ctx.font = "bold 28px Arial";
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#38bdf8";
		ctx.lineWidth = 3;
		ctx.textAlign = "center";
		ctx.strokeText(String(score), CANVAS_WIDTH / 2, 50);
		ctx.fillText(String(score), CANVAS_WIDTH / 2, 50);
		// Game over/menu overlays
		if (gameState === "menu" || gameState === "gameOver") {
			ctx.fillStyle = "rgba(0,0,0,0.5)";
			ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			ctx.fillStyle = "#fff";
			ctx.font = "bold 32px Arial";
			ctx.fillText("Flappy Bird", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 60);
			ctx.font = "20px Arial";
			ctx.fillText(
				gameState === "menu"
					? "Click or press Space/↑ to start!"
					: "Game Over!",
				CANVAS_WIDTH / 2,
				CANVAS_HEIGHT / 2 - 20,
			);
			if (gameState === "gameOver") {
				ctx.font = "18px Arial";
				ctx.fillText(
					`Score: ${score}  Best: ${highScore}`,
					CANVAS_WIDTH / 2,
					CANVAS_HEIGHT / 2 + 20,
				);
				ctx.fillText(
					"Click or press Space/↑ to try again!",
					CANVAS_WIDTH / 2,
					CANVAS_HEIGHT / 2 + 50,
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
			if (animationRef.current) cancelAnimationFrame(animationRef.current);
		};
	}, [gameLoop]);

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (e.code === "Space" || e.code === "ArrowUp") {
				e.preventDefault();
				jump();
			}
		};
		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [jump]);

	return (
		<MiniGameLayout>
			<div className="text-center mb-2">
				<h1 className="text-2xl font-bold text-gray-800 mb-1">Flappy Bird</h1>
				<p className="text-gray-600 text-base">
					Click or press Space/↑ to flap!
				</p>
			</div>
			<div className="flex justify-center">
				<canvas
					ref={canvasRef}
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
					onClick={jump}
					className="border-2 border-blue-200 rounded-lg cursor-pointer bg-sky-200"
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
			<div className="text-center mt-2 text-sm text-gray-500">
				<p>Use mouse click, spacebar, or arrow up key to play</p>
			</div>
		</MiniGameLayout>
	);
}
