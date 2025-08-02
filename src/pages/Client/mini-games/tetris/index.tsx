import MiniGameLayout from "../layouts/MiniGameLayout";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;
const INITIAL_DROP_SPEED = 1000; // milliseconds
const SPEED_INCREASE = 50; // milliseconds per level

// Tetromino shapes and colors
const TETROMINOS = {
	I: {
		shape: [[1, 1, 1, 1]],
		color: "bg-cyan-500",
	},
	O: {
		shape: [
			[1, 1],
			[1, 1],
		],
		color: "bg-yellow-500",
	},
	T: {
		shape: [
			[0, 1, 0],
			[1, 1, 1],
		],
		color: "bg-purple-500",
	},
	S: {
		shape: [
			[0, 1, 1],
			[1, 1, 0],
		],
		color: "bg-green-500",
	},
	Z: {
		shape: [
			[1, 1, 0],
			[0, 1, 1],
		],
		color: "bg-red-500",
	},
	J: {
		shape: [
			[1, 0, 0],
			[1, 1, 1],
		],
		color: "bg-blue-500",
	},
	L: {
		shape: [
			[0, 0, 1],
			[1, 1, 1],
		],
		color: "bg-orange-500",
	},
};

const TETROMINO_TYPES = Object.keys(TETROMINOS);

interface Position {
	x: number;
	y: number;
}

interface Tetromino {
	type: string;
	shape: number[][];
	color: string;
	position: Position;
}

export default function Tetris() {
	const [board, setBoard] = useState<number[][]>(createEmptyBoard());
	const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
	const [nextPiece, setNextPiece] = useState<Tetromino | null>(null);
	const [score, setScore] = useState(0);
	const [level, setLevel] = useState(1);
	const [lines, setLines] = useState(0);
	const [gameOver, setGameOver] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [isPaused, setIsPaused] = useState(false);

	const dropTimeRef = useRef<number>(Date.now());
	const dropSpeedRef = useRef<number>(INITIAL_DROP_SPEED);

	// Create empty board
	function createEmptyBoard(): number[][] {
		return Array.from({ length: BOARD_HEIGHT }, () =>
			Array(BOARD_WIDTH).fill(0),
		);
	}

	// Create a new tetromino
	const createTetromino = useCallback((type?: string): Tetromino => {
		const tetrominoType =
			type ||
			TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
		const tetromino = TETROMINOS[tetrominoType as keyof typeof TETROMINOS];

		return {
			type: tetrominoType,
			shape: tetromino.shape,
			color: tetromino.color,
			position: {
				x:
					Math.floor(BOARD_WIDTH / 2) -
					Math.floor(tetromino.shape[0].length / 2),
				y: 0,
			},
		};
	}, []);

	// Check if a position is valid
	const isValidPosition = useCallback(
		(piece: Tetromino, position: Position): boolean => {
			for (let y = 0; y < piece.shape.length; y++) {
				for (let x = 0; x < piece.shape[y].length; x++) {
					if (piece.shape[y][x]) {
						const newX = position.x + x;
						const newY = position.y + y;

						if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
							return false;
						}

						if (newY >= 0 && board[newY][newX]) {
							return false;
						}
					}
				}
			}
			return true;
		},
		[board],
	);

	// Place piece on board
	const placePiece = useCallback(
		(piece: Tetromino) => {
			const newBoard = board.map((row) => [...row]);

			for (let y = 0; y < piece.shape.length; y++) {
				for (let x = 0; x < piece.shape[y].length; x++) {
					if (piece.shape[y][x]) {
						const boardX = piece.position.x + x;
						const boardY = piece.position.y + y;

						if (boardY >= 0) {
							newBoard[boardY][boardX] = 1;
						}
					}
				}
			}

			// Clear lines immediately after placing piece
			const linesToRemove = newBoard.filter((row) =>
				row.every((cell) => cell === 1),
			);
			const linesCleared = linesToRemove.length;

			if (linesCleared > 0) {
				// Remove completed lines
				const boardAfterClearing = newBoard.filter(
					(row) => !row.every((cell) => cell === 1),
				);

				// Add empty rows at the top
				while (boardAfterClearing.length < BOARD_HEIGHT) {
					boardAfterClearing.unshift(Array(BOARD_WIDTH).fill(0));
				}

				// Update score and level
				const newLines = lines + linesCleared;
				const newLevel = Math.floor(newLines / 10) + 1;
				const newScore = score + linesCleared * 100 * level;

				setLines(newLines);
				setLevel(newLevel);
				setScore(newScore);
				setBoard(boardAfterClearing);

				// Update drop speed
				dropSpeedRef.current = Math.max(
					INITIAL_DROP_SPEED - (newLevel - 1) * SPEED_INCREASE,
					100,
				);
			} else {
				setBoard(newBoard);
			}
		},
		[board, lines, score, level],
	);

	// Move piece
	const movePiece = useCallback(
		(dx: number, dy: number) => {
			if (!currentPiece || gameOver || !gameStarted || isPaused) return;

			const newPosition = {
				x: currentPiece.position.x + dx,
				y: currentPiece.position.y + dy,
			};

			if (isValidPosition(currentPiece, newPosition)) {
				setCurrentPiece({
					...currentPiece,
					position: newPosition,
				});
			} else if (dy > 0) {
				// Piece has landed
				placePiece(currentPiece);

				// Check for game over
				if (
					nextPiece &&
					!isValidPosition(nextPiece, {
						x: nextPiece.position.x,
						y: nextPiece.position.y,
					})
				) {
					setGameOver(true);
					return;
				}

				if (nextPiece) {
					setCurrentPiece(nextPiece);
					setNextPiece(createTetromino());
				}
			}
		},
		[
			currentPiece,
			gameOver,
			gameStarted,
			isPaused,
			isValidPosition,
			placePiece,
			nextPiece,
			createTetromino,
		],
	);

	// Rotate piece
	const rotatePiece = useCallback(() => {
		if (!currentPiece || gameOver || !gameStarted || isPaused) return;

		const rotatedShape = currentPiece.shape[0].map((_, index) =>
			currentPiece.shape.map((row) => row[index]).reverse(),
		);

		const rotatedPiece = {
			...currentPiece,
			shape: rotatedShape,
		};

		if (isValidPosition(rotatedPiece, currentPiece.position)) {
			setCurrentPiece(rotatedPiece);
		}
	}, [currentPiece, gameOver, gameStarted, isPaused, isValidPosition]);

	// Hard drop
	const hardDrop = useCallback(() => {
		if (!currentPiece || gameOver || !gameStarted || isPaused) return;

		let dropDistance = 0;
		while (
			isValidPosition(currentPiece, {
				...currentPiece.position,
				y: currentPiece.position.y + dropDistance + 1,
			})
		) {
			dropDistance++;
		}

		const newPosition = {
			...currentPiece.position,
			y: currentPiece.position.y + dropDistance,
		};

		setCurrentPiece({
			...currentPiece,
			position: newPosition,
		});

		// Place piece immediately
		placePiece({
			...currentPiece,
			position: newPosition,
		});

		// Check for game over
		if (
			nextPiece &&
			!isValidPosition(nextPiece, {
				x: nextPiece.position.x,
				y: nextPiece.position.y,
			})
		) {
			setGameOver(true);
			return;
		}

		if (nextPiece) {
			setCurrentPiece(nextPiece);
			setNextPiece(createTetromino());
		}
	}, [
		currentPiece,
		gameOver,
		gameStarted,
		isPaused,
		isValidPosition,
		placePiece,
		nextPiece,
		createTetromino,
	]);

	// Game loop
	useEffect(() => {
		if (!gameStarted || gameOver || isPaused) return;

		const now = Date.now();
		const delta = now - dropTimeRef.current;

		if (delta > dropSpeedRef.current) {
			movePiece(0, 1);
			dropTimeRef.current = now;
		}

		const gameInterval = setInterval(() => {
			const now = Date.now();
			const delta = now - dropTimeRef.current;

			if (delta > dropSpeedRef.current) {
				movePiece(0, 1);
				dropTimeRef.current = now;
			}
		}, 100);

		return () => clearInterval(gameInterval);
	}, [gameStarted, gameOver, isPaused, movePiece]);

	// Keyboard controls
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (gameOver || !gameStarted) return;

			switch (e.key) {
				case "ArrowLeft":
				case "a":
					e.preventDefault();
					movePiece(-1, 0);
					break;
				case "ArrowRight":
				case "d":
					e.preventDefault();
					movePiece(1, 0);
					break;
				case "ArrowDown":
				case "s":
					e.preventDefault();
					movePiece(0, 1);
					break;
				case "ArrowUp":
				case "w":
					e.preventDefault();
					rotatePiece();
					break;
				case " ":
					e.preventDefault();
					hardDrop();
					break;
				case "p":
					e.preventDefault();
					setIsPaused(!isPaused);
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameStarted, gameOver, movePiece, rotatePiece, hardDrop, isPaused]);

	// Initialize game
	useEffect(() => {
		if (gameStarted && !currentPiece) {
			const firstPiece = createTetromino();
			const secondPiece = createTetromino();
			setCurrentPiece(firstPiece);
			setNextPiece(secondPiece);
		}
	}, [gameStarted, currentPiece, createTetromino]);

	// Start game
	const startGame = () => {
		setGameStarted(true);
	};

	// Reset game
	const resetGame = () => {
		setBoard(createEmptyBoard());
		setCurrentPiece(null);
		setNextPiece(null);
		setScore(0);
		setLevel(1);
		setLines(0);
		setGameOver(false);
		setGameStarted(true);
		setIsPaused(false);
		dropSpeedRef.current = INITIAL_DROP_SPEED;
	};

	// Render board cell
	const renderCell = (value: number, x: number, y: number) => {
		const isCurrentPiece =
			currentPiece &&
			y >= currentPiece.position.y &&
			y < currentPiece.position.y + currentPiece.shape.length &&
			x >= currentPiece.position.x &&
			x < currentPiece.position.x + currentPiece.shape[0].length &&
			currentPiece.shape[y - currentPiece.position.y]?.[
				x - currentPiece.position.x
			];

		const cellClass = isCurrentPiece
			? currentPiece.color
			: value
				? "bg-gray-600 dark:bg-gray-400"
				: "bg-gray-100 dark:bg-gray-800";

		return (
			<div
				key={`${x}-${y}`}
				className={`border border-gray-300 dark:border-gray-600 ${cellClass}`}
				style={{
					width: CELL_SIZE,
					height: CELL_SIZE,
				}}
			/>
		);
	};

	// Render next piece
	const renderNextPiece = () => {
		if (!nextPiece) return null;

		return (
			<div className="flex flex-col items-center">
				<h3 className="text-lg font-semibold mb-2">Next</h3>
				<div className="border-2 border-gray-300 dark:border-gray-600 p-2">
					{nextPiece.shape.map((row, y) => (
						<div
							key={`next-row-${y}-${row.length}-${nextPiece.type}`}
							className="flex"
						>
							{row.map((cell, x) => (
								<div
									key={`next-${x}-${y}-${nextPiece.type}-${cell}`}
									className={`w-4 h-4 border ${
										cell ? nextPiece.color : "bg-transparent"
									}`}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<MiniGameLayout>
			<Card className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg rounded-lg">
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
						Tetris
					</CardTitle>
					<div className="flex gap-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
						<span>Score: {score}</span>
						<span>Level: {level}</span>
						<span>Lines: {lines}</span>
					</div>
				</CardHeader>
				<CardContent className="p-4">
					<div className="flex gap-6 justify-center items-start">
						{/* Game Board */}
						<div className="flex flex-col items-center">
							<div
								className="border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 relative"
								style={{
									width: BOARD_WIDTH * CELL_SIZE,
									height: BOARD_HEIGHT * CELL_SIZE,
								}}
							>
								{board.map((row, y) => (
									<div key={`board-row-${y}-${row.length}`} className="flex">
										{row.map((cell, x) => renderCell(cell, x, y))}
									</div>
								))}

								{/* Initial game start overlay */}
								{!gameStarted && !gameOver && (
									<div className="absolute inset-0 flex items-center justify-center bg-black/40 bg-opacity-50">
										<Button onClick={startGame} className="w-full max-w-xs">
											Start Game
										</Button>
									</div>
								)}

								{gameOver && (
									<div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-black/40 bg-opacity-50">
										<div className="text-center text-white text-2xl font-bold">
											Game Over!
										</div>
										<Button onClick={resetGame}>Play Again</Button>
									</div>
								)}

								{isPaused && gameStarted && !gameOver && (
									<div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-black/40 bg-opacity-50">
										<div className="text-center text-white text-2xl font-bold">
											PAUSED
										</div>
										<div className="flex gap-2">
											<Button
												onClick={() => setIsPaused(false)}
												variant="outline"
												className="bg-white text-black hover:bg-gray-100"
											>
												Resume
											</Button>
											<Button onClick={resetGame} variant="destructive">
												Reset Game
											</Button>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Side Panel */}
						<div className="flex flex-col gap-4">
							{renderNextPiece()}

							{/* Game Controls */}
							<div className="flex flex-col gap-2">
								<Button
									onClick={() => setIsPaused(!isPaused)}
									variant="outline"
									size="sm"
									className="w-full"
									disabled={!gameStarted || gameOver}
								>
									{isPaused ? "Resume" : "Pause"}
								</Button>
							</div>

							<div className="text-sm text-gray-600 dark:text-gray-400">
								<h4 className="font-semibold mb-2">Controls:</h4>
								<div className="space-y-1">
									<div>← → : Move</div>
									<div>↓ : Soft Drop</div>
									<div>↑ : Rotate</div>
									<div>Space : Hard Drop</div>
									<div>P : Pause</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</MiniGameLayout>
	);
}
