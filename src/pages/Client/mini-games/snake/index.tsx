import MiniGameLayout from "../layouts/MiniGameLayout";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
// Game constants
const BOARD_WIDTH = 50; // Number of cells in width
const BOARD_HEIGHT = 30; // Number of cells in height
const CELL_SIZE = 20; // Size of each cell in pixels
const INITIAL_SNAKE = [{ x: 10, y: 10 }]; // Starting position of the snake
const INITIAL_FOOD = { x: 5, y: 5 }; // Starting position of the food
const INITIAL_DIRECTION = { dx: 1, dy: 0 }; // Initial direction: right
const GAME_SPEED = 90; // Game update interval in milliseconds

export default function Snake() {
	const [snake, setSnake] = useState(INITIAL_SNAKE);
	const [food, setFood] = useState(INITIAL_FOOD);
	const [direction, setDirection] = useState(INITIAL_DIRECTION);
	const [score, setScore] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);

	// Use a ref to store the current direction, allowing the interval callback to always access the latest value
	const directionRef = useRef(direction);
	useEffect(() => {
		directionRef.current = direction;
	}, [direction]);

	// Function to generate new food at a random position, avoiding the snake's body
	const generateFood = useCallback(() => {
		let newFood: { x: number; y: number };
		do {
			newFood = {
				x: Math.floor(Math.random() * BOARD_WIDTH),
				y: Math.floor(Math.random() * BOARD_HEIGHT),
			};
		} while (
			snake.some(
				(segment) => segment.x === newFood.x && segment.y === newFood.y,
			)
		);
		setFood(newFood);
	}, [snake]); // Dependency on snake to ensure food doesn't spawn on it

	// Function to move the snake
	const moveSnake = useCallback(() => {
		if (gameOver || !gameStarted) return;

		setSnake((prevSnake) => {
			const newSnake = [...prevSnake];
			const head = { ...newSnake[0] }; // Copy head to avoid direct mutation

			const currentDirection = directionRef.current; // Get the latest direction from the ref
			head.x += currentDirection.dx;
			head.y += currentDirection.dy;

			// Check for wall collision
			if (
				head.x < 0 ||
				head.x >= BOARD_WIDTH ||
				head.y < 0 ||
				head.y >= BOARD_HEIGHT
			) {
				setGameOver(true);
				return prevSnake;
			}

			// Check for self-collision
			// If the snake is eating food, its tail doesn't move, so we check against all segments.
			// If not eating, the tail moves, so we exclude the last segment from the collision check.
			const isEatingFood = head.x === food.x && head.y === food.y;
			const segmentsToCheck = isEatingFood ? newSnake : newSnake.slice(0, -1);

			if (
				segmentsToCheck.some(
					(segment) => segment.x === head.x && segment.y === head.y,
				)
			) {
				setGameOver(true);
				return prevSnake;
			}

			newSnake.unshift(head); // Add new head

			// Handle food consumption
			if (isEatingFood) {
				setScore((prevScore) => prevScore + 1);
				generateFood(); // Generate new food
				// Add 3 more segments to make total growth of 4 (head + 3 additional segments)
				for (let i = 0; i < 3; i++) {
					newSnake.push({ ...newSnake[newSnake.length - 1] });
				}
			} else {
				newSnake.pop(); // Remove tail if no food was eaten
			}

			return newSnake;
		});
	}, [gameOver, gameStarted, food, generateFood]); // Dependencies for moveSnake useCallback

	// Effect for the game loop (movement)
	useEffect(() => {
		if (gameOver || !gameStarted) return;

		const gameInterval = setInterval(moveSnake, GAME_SPEED);
		return () => clearInterval(gameInterval); // Clear interval on component unmount or game over
	}, [gameOver, gameStarted, moveSnake]); // moveSnake is a stable callback, so this effect only re-runs when game state changes

	// Effect for keyboard input
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (gameOver || !gameStarted) return;

			const currentDirection = directionRef.current; // Get the latest direction from the ref

			// Prevent immediate reverse direction
			switch (e.key) {
				case "ArrowUp":
					if (currentDirection.dy === 0) setDirection({ dx: 0, dy: -1 });
					break;
				case "ArrowDown":
					if (currentDirection.dy === 0) setDirection({ dx: 0, dy: 1 });
					break;
				case "ArrowLeft":
					if (currentDirection.dx === 0) setDirection({ dx: -1, dy: 0 });
					break;
				case "ArrowRight":
					if (currentDirection.dx === 0) setDirection({ dx: 1, dy: 0 });
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameOver, gameStarted]); // Dependencies for keyboard input effect

	// Function to start the game
	const startGame = () => {
		setGameStarted(true);
	};

	// Function to reset the game
	const resetGame = () => {
		setSnake(INITIAL_SNAKE);
		setFood(INITIAL_FOOD);
		setDirection(INITIAL_DIRECTION);
		setScore(0);
		setGameOver(false);
		setGameStarted(true); // Automatically start the game when resetting
	};

	return (
		<MiniGameLayout>
			<div
				className="relative border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 mx-auto"
				style={{
					width: BOARD_WIDTH * CELL_SIZE,
					height: BOARD_HEIGHT * CELL_SIZE,
				}}
			>
				{/* Render snake segments */}
				{snake.map((segment, index) => (
					<div
						key={`${segment.x}-${segment.y}-${index}`} // Unique key for each segment
						className="bg-green-400 absolute"
						style={{
							left: segment.x * CELL_SIZE,
							top: segment.y * CELL_SIZE,
							width: CELL_SIZE,
							height: CELL_SIZE,
						}}
					/>
				))}
				{/* Render food */}
				<div
					className="absolute bg-red-500 rounded-full"
					style={{
						left: food.x * CELL_SIZE,
						top: food.y * CELL_SIZE,
						width: CELL_SIZE,
						height: CELL_SIZE,
					}}
				/>

				{/* Overlay for game messages and buttons */}
				{/* Game Over overlay */}
				{gameOver && (
					<div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
						<div className="text-red-600 dark:text-red-400 text-3xl font-bold mb-4">
							Game Over!
						</div>
						<Button
							onClick={resetGame}
							className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
						>
							Play Again
						</Button>
					</div>
				)}

				{/* Start Game overlay */}
				{!gameStarted && !gameOver && (
					<div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
						<div className="text-white text-xl mb-4">Snake Game</div>
						<Button
							onClick={startGame}
							className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
						>
							Start Game
						</Button>
					</div>
				)}
			</div>

			{/* Score display outside the game board */}
			<div className="mt-4 text-center">
				<div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
					Score: {score}
				</div>
			</div>

			{/* Reset button (only shown when game is running) */}
			{gameStarted && !gameOver && (
				<div className="mt-4 flex justify-center">
					<Button
						onClick={resetGame}
						className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
					>
						Reset Game
					</Button>
				</div>
			)}
		</MiniGameLayout>
	);
}
