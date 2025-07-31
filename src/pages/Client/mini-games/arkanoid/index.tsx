"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MiniGameLayout from "../layouts/MiniGameLayout";

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
const BRICK_WIDTH = 70;
const BRICK_HEIGHT = 20;
const BRICK_ROWS = 5;
const BRICK_COLS = 10;
const BALL_SPEED = 6;

// Initial brick layout
const initialBricks = Array.from({ length: BRICK_ROWS * BRICK_COLS }).map(
	(_, i) => ({
		id: i,
		x:
			(i % BRICK_COLS) * BRICK_WIDTH +
			(GAME_WIDTH - BRICK_COLS * BRICK_WIDTH) / 2,
		y: Math.floor(i / BRICK_COLS) * BRICK_HEIGHT + 50,
		status: 1, // 1 = active, 0 = destroyed
	}),
);

export default function Arkanoid() {
	const [paddleX, setPaddleX] = useState((GAME_WIDTH - PADDLE_WIDTH) / 2);
	const [ballX, setBallX] = useState(GAME_WIDTH / 2);
	const [ballY, setBallY] = useState(
		GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 1,
	);
	const [ballDx, setBallDx] = useState(0); // Initial horizontal speed
	const [ballDy, setBallDy] = useState(0); // Initial vertical speed
	const [bricks, setBricks] = useState(initialBricks);
	const [score, setScore] = useState(0);
	const [lives, setLives] = useState(3);
	const [gameStarted, setGameStarted] = useState(false);
	const [gameOver, setGameOver] = useState(false);
	const [gameWon, setGameWon] = useState(false);

	const gameLoopRef = useRef<number | null>(null);

	const resetBallAndPaddle = useCallback(() => {
		setPaddleX((GAME_WIDTH - PADDLE_WIDTH) / 2);
		setBallX(GAME_WIDTH / 2);
		setBallY(GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 1);
		setBallDx(0);
		setBallDy(0);
		setGameStarted(false);
	}, []);

	const startGame = useCallback(() => {
		if (!gameStarted && !gameOver && !gameWon) {
			setGameStarted(true);
			setBallDx(BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)); // Random initial horizontal direction
			setBallDy(-BALL_SPEED); // Always start moving up
		}
	}, [gameStarted, gameOver, gameWon]);

	const gameLoop = useCallback(() => {
		if (!gameStarted || gameOver || gameWon) return;

		// Move ball
		let newBallX = ballX + ballDx;
		let newBallY = ballY + ballDy;

		// Ball-wall collision
		if (newBallX + BALL_RADIUS > GAME_WIDTH || newBallX - BALL_RADIUS < 0) {
			setBallDx((prev) => -prev);
			newBallX = Math.max(
				BALL_RADIUS,
				Math.min(GAME_WIDTH - BALL_RADIUS, newBallX),
			); // Clamp to bounds
		}
		if (newBallY - BALL_RADIUS < 0) {
			setBallDy((prev) => -prev);
			newBallY = BALL_RADIUS; // Clamp to bounds
		}

		// Ball-paddle collision
		if (
			newBallY + BALL_RADIUS >= GAME_HEIGHT - PADDLE_HEIGHT &&
			ballY + BALL_RADIUS < GAME_HEIGHT - PADDLE_HEIGHT && // Only if ball was above paddle in previous frame
			newBallX + BALL_RADIUS > paddleX &&
			newBallX - BALL_RADIUS < paddleX + PADDLE_WIDTH &&
			ballDy > 0 // Only if moving downwards
		) {
			setBallDy((prev) => -prev);
			// Adjust ballDx based on where it hit the paddle
			const hitPoint = newBallX - (paddleX + PADDLE_WIDTH / 2);
			setBallDx(hitPoint * 0.1); // A simple way to make it bounce differently
			newBallY = GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS; // Prevent sticking
		}

		// Ball-bottom wall (lose a life)
		if (newBallY + BALL_RADIUS > GAME_HEIGHT) {
			setLives((prev) => prev - 1);
			if (lives - 1 <= 0) {
				setGameOver(true);
				if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
			} else {
				resetBallAndPaddle();
			}
			return; // Stop further updates for this frame to prevent immediate re-loss
		}

		// Ball-brick collision
		const newBricks = bricks.map((brick) => {
			if (brick.status === 1) {
				// Simple AABB collision detection
				if (
					newBallX + BALL_RADIUS > brick.x &&
					newBallX - BALL_RADIUS < brick.x + BRICK_WIDTH &&
					newBallY + BALL_RADIUS > brick.y &&
					newBallY - BALL_RADIUS < brick.y + BRICK_HEIGHT
				) {
					// Collision detected
					setScore((prev) => prev + 10);
					// Determine which side of the brick was hit to reverse the correct velocity
					const prevBallX = ballX;
					const prevBallY = ballY;

					const hitFromLeft =
						prevBallX - BALL_RADIUS <= brick.x &&
						newBallX - BALL_RADIUS > brick.x;
					const hitFromRight =
						prevBallX + BALL_RADIUS >= brick.x + BRICK_WIDTH &&
						newBallX + BALL_RADIUS < brick.x + BRICK_WIDTH;
					const hitFromTop =
						prevBallY - BALL_RADIUS <= brick.y &&
						newBallY - BALL_RADIUS > brick.y;
					const hitFromBottom =
						prevBallY + BALL_RADIUS >= brick.y + BRICK_HEIGHT &&
						newBallY + BALL_RADIUS < brick.y + BRICK_HEIGHT;

					if (hitFromLeft || hitFromRight) {
						setBallDx((prev) => -prev);
					} else if (hitFromTop || hitFromBottom) {
						setBallDy((prev) => -prev);
					} else {
						// Corner hit, reverse both (less common but handles edge cases)
						setBallDx((prev) => -prev);
						setBallDy((prev) => -prev);
					}

					return { ...brick, status: 0 }; // Mark brick as destroyed
				}
			}
			return brick;
		});

		setBricks(newBricks);
		setBallX(newBallX);
		setBallY(newBallY);

		// Check for win condition
		if (newBricks.every((brick) => brick.status === 0)) {
			setGameWon(true);
			if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
		}
	}, [
		ballX,
		ballY,
		ballDx,
		ballDy,
		paddleX,
		bricks,
		lives,
		gameStarted,
		gameOver,
		gameWon,
		resetBallAndPaddle,
	]);

	useEffect(() => {
		const gameArea = document.getElementById("game-area"); // Add an ID to the game area div

		const handleMouseMove = (e: MouseEvent) => {
			if (gameArea) {
				const gameAreaRect = gameArea.getBoundingClientRect();
				let newPaddleX = e.clientX - gameAreaRect.left - PADDLE_WIDTH / 2;
				newPaddleX = Math.max(
					0,
					Math.min(GAME_WIDTH - PADDLE_WIDTH, newPaddleX),
				);
				setPaddleX(newPaddleX);
			}
		};

		const handleSpaceBar = (e: KeyboardEvent) => {
			if (e.key === " " && !gameStarted) {
				startGame();
			}
		};

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("keydown", handleSpaceBar); // Keep spacebar for starting

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("keydown", handleSpaceBar);
		};
	}, [gameStarted, startGame]);

	useEffect(() => {
		const runGameLoop = () => {
			if (gameStarted && !gameOver && !gameWon) {
				gameLoop();
				gameLoopRef.current = requestAnimationFrame(runGameLoop);
			}
		};

		if (gameStarted && !gameOver && !gameWon) {
			gameLoopRef.current = requestAnimationFrame(runGameLoop);
		} else if (gameLoopRef.current) {
			cancelAnimationFrame(gameLoopRef.current);
		}

		return () => {
			if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
		};
	}, [gameStarted, gameOver, gameWon, gameLoop]);

	const restartGame = useCallback(() => {
		setPaddleX((GAME_WIDTH - PADDLE_WIDTH) / 2);
		setBallX(GAME_WIDTH / 2);
		setBallY(GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 1);
		setBallDx(0);
		setBallDy(0);
		setBricks(initialBricks);
		setScore(0);
		setLives(3);
		setGameStarted(false);
		setGameOver(false);
		setGameWon(false);
	}, []);

	return (
		<MiniGameLayout>
			<div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
				<h1 className="text-4xl font-bold mb-6 text-blue-400">Arkanoid</h1>
				<div className="flex justify-between w-full max-w-[800px] mb-4 px-2">
					<div className="text-lg">
						Score: <span className="font-semibold">{score}</span>
					</div>
					<div className="text-lg">
						Lives: <span className="font-semibold">{lives}</span>
					</div>
				</div>
				<div
					id="game-area" // Add this ID
					className="relative border-4 border-blue-500 bg-gray-800 overflow-hidden"
					style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
				>
					{/* Bricks */}
					{bricks.map((brick) =>
						brick.status === 1 ? (
							<div
								key={brick.id}
								className="absolute bg-green-500 border border-green-700 rounded-sm"
								style={{
									left: brick.x,
									top: brick.y,
									width: BRICK_WIDTH,
									height: BRICK_HEIGHT,
								}}
							/>
						) : null,
					)}

					{/* Paddle */}
					<div
						className="absolute bg-blue-600 rounded-lg"
						style={{
							left: paddleX,
							top: GAME_HEIGHT - PADDLE_HEIGHT,
							width: PADDLE_WIDTH,
							height: PADDLE_HEIGHT,
						}}
					/>

					{/* Ball */}
					<div
						className="absolute bg-red-500 rounded-full"
						style={{
							left: ballX - BALL_RADIUS,
							top: ballY - BALL_RADIUS,
							width: BALL_RADIUS * 2,
							height: BALL_RADIUS * 2,
						}}
					/>

					{/* Game Over / Win Overlay */}
					{(gameOver || gameWon) && (
						<div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white text-3xl font-bold">
							{gameOver && <p>Game Over!</p>}
							{gameWon && <p>You Win!</p>}
							<button
								type="button"
								onClick={restartGame}
								className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl"
							>
								Play Again
							</button>
						</div>
					)}

					{!gameStarted && !gameOver && !gameWon && (
						<div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white text-3xl font-bold">
							<p>Press SPACE to Start</p>
							<p className="text-xl mt-2">Move mouse to control paddle</p>
						</div>
					)}
				</div>
				<p className="mt-4 text-gray-400 text-sm">
					Move your mouse horizontally to control the paddle. Press SPACE to
					start the game.
				</p>
			</div>
		</MiniGameLayout>
	);
}
