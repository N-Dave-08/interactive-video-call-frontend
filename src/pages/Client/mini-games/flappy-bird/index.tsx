import { useEffect, useRef, useState, useCallback } from "react";
import MiniGameLayout from "../layouts/MiniGameLayout";

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BIRD_WIDTH = 34;
const BIRD_HEIGHT = 24;
const BIRD_START_X = GAME_WIDTH / 4;
const BIRD_START_Y = GAME_HEIGHT / 2;
const PIPE_WIDTH = 52;
const PIPE_GAP = GAME_HEIGHT / 4;
const PIPE_SPEED = 2;
const GRAVITY = 0.03;
const JUMP_VELOCITY = -1.5;

interface Bird {
	x: number;
	y: number;
	velocity: number;
	width: number;
	height: number;
	frame: number;
	frameCount: number;
}

interface Pipe {
	x: number;
	topHeight: number;
	bottomY: number;
	width: number;
	passed: boolean;
}

interface GameState {
	bird: Bird;
	pipes: Pipe[];
	score: number;
	gameOver: boolean;
	gameStarted: boolean;
	animationId: number | null;
}

export default function FlappyBird() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [gameState, setGameState] = useState<GameState>({
		bird: {
			x: BIRD_START_X,
			y: BIRD_START_Y,
			velocity: 0,
			width: BIRD_WIDTH,
			height: BIRD_HEIGHT,
			frame: 0,
			frameCount: 0,
		},
		pipes: [],
		score: 0,
		gameOver: false,
		gameStarted: false,
		animationId: null,
	});

	const [images, setImages] = useState<{
		background: HTMLImageElement | null;
		bird: HTMLImageElement | null;
		pipeGreen: HTMLImageElement | null;
		land: HTMLImageElement | null;
		startButton: HTMLImageElement | null;
	}>({
		background: null,
		bird: null,
		pipeGreen: null,
		land: null,
		startButton: null,
	});

	// Load images
	useEffect(() => {
		const loadImage = (src: string): Promise<HTMLImageElement> => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve(img);
				img.onerror = reject;
				img.src = src;
			});
		};

		const loadAllImages = async () => {
			try {
				const [background, bird, pipeGreen, land, startButton] =
					await Promise.all([
						loadImage("/flappy-bird-assets/background.png"),
						loadImage("/flappy-bird-assets/birds.png"),
						loadImage("/flappy-bird-assets/pipe-green.png"),
						loadImage("/flappy-bird-assets/land.png"),
						loadImage("/flappy-bird-assets/start_button.png"),
					]);

				setImages({
					background,
					bird,
					pipeGreen,
					land,
					startButton,
				});
			} catch {
				// Silently handle image loading errors
			}
		};

		loadAllImages();
	}, []);

	// Create new pipe
	const createPipe = useCallback((): Pipe => {
		const minTop = GAME_HEIGHT / 8;
		const maxTop = GAME_HEIGHT / 2;
		const topHeight = minTop + Math.random() * (maxTop - minTop);

		const pipe = {
			x: GAME_WIDTH,
			topHeight,
			bottomY: topHeight + PIPE_GAP,
			width: PIPE_WIDTH,
			passed: false,
		};

		return pipe;
	}, []);

	// Initialize game
	const initGame = useCallback(() => {
		setGameState({
			bird: {
				x: BIRD_START_X,
				y: BIRD_START_Y,
				velocity: 0,
				width: BIRD_WIDTH,
				height: BIRD_HEIGHT,
				frame: 0,
				frameCount: 0,
			},
			pipes: [createPipe()],
			score: 0,
			gameOver: false,
			gameStarted: false,
			animationId: null,
		});
	}, [createPipe]);

	// Bird physics
	const updateBird = useCallback((bird: Bird): Bird => {
		// Update bird animation frame
		bird.frameCount += 0.1;
		if (bird.frameCount > 3) {
			bird.frameCount = 0;
		}
		bird.frame = Math.floor(bird.frameCount);

		// Apply gravity
		bird.velocity += GRAVITY;
		bird.y += bird.velocity;

		// Prevent bird from going above screen
		if (bird.y <= 0) {
			bird.y = 0;
			bird.velocity = 0;
		}

		return bird;
	}, []);

	// Update pipes
	const updatePipes = useCallback(
		(pipes: Pipe[], score: number): { pipes: Pipe[]; score: number } => {
			const updatedPipes = pipes.map((pipe) => ({
				...pipe,
				x: pipe.x - PIPE_SPEED,
			}));

			// Remove pipes that are off screen
			const visiblePipes = updatedPipes.filter(
				(pipe) => pipe.x + pipe.width > 0,
			);

			// Check if bird passed a pipe
			visiblePipes.forEach((pipe) => {
				if (!pipe.passed && pipe.x + pipe.width < gameState.bird.x) {
					pipe.passed = true;
					score += 1;
				}
			});

			// Create new pipe if needed
			if (
				visiblePipes.length === 0 ||
				(visiblePipes.length === 1 && visiblePipes[0].x <= GAME_WIDTH / 2)
			) {
				visiblePipes.push(createPipe());
			}

			return { pipes: visiblePipes, score };
		},
		[gameState.bird.x, createPipe],
	);

	// Collision detection
	const checkCollision = useCallback((bird: Bird, pipes: Pipe[]): boolean => {
		// Check collision with ground
		if (bird.y + bird.height >= GAME_HEIGHT - 100) {
			return true;
		}

		// Check collision with pipes
		for (const pipe of pipes) {
			if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipe.width) {
				// Bird is within pipe's x-range
				if (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY) {
					return true;
				}
			}
		}

		return false;
	}, []);

	// Game loop
	const gameLoop = useCallback(() => {
		if (!gameState.gameStarted || gameState.gameOver) {
			return;
		}

		setGameState((prevState) => {
			// Update bird
			const updatedBird = updateBird(prevState.bird);

			// Update pipes and score
			const { pipes, score } = updatePipes(prevState.pipes, prevState.score);

			// Check collision
			const collision = checkCollision(updatedBird, pipes);

			return {
				...prevState,
				bird: updatedBird,
				pipes,
				score,
				gameOver: collision,
			};
		});
	}, [
		updateBird,
		updatePipes,
		checkCollision,
		gameState.gameStarted,
		gameState.gameOver,
	]);

	// Start game loop
	useEffect(() => {
		let animationId: number;

		const runGameLoop = () => {
			if (gameState.gameStarted && !gameState.gameOver) {
				gameLoop();
				animationId = requestAnimationFrame(runGameLoop);
			}
		};

		if (gameState.gameStarted && !gameState.gameOver) {
			animationId = requestAnimationFrame(runGameLoop);
		}

		return () => {
			if (animationId) {
				cancelAnimationFrame(animationId);
			}
		};
	}, [gameState.gameStarted, gameState.gameOver, gameLoop]);

	// Handle user input
	const handleClick = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (gameState.gameOver) {
				initGame();
			} else if (gameState.gameStarted) {
				setGameState((prev) => ({
					...prev,
					bird: {
						...prev.bird,
						velocity: JUMP_VELOCITY,
					},
				}));
			} else {
				setGameState((prev) => ({
					...prev,
					gameStarted: true,
					bird: {
						...prev.bird,
						velocity: JUMP_VELOCITY,
					},
				}));
			}
		},
		[gameState.gameOver, gameState.gameStarted, initGame],
	);

	// Draw game
	const drawGame = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || !images.background) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

		// Draw background
		ctx.drawImage(images.background, 0, 0, GAME_WIDTH, GAME_HEIGHT);

		// Draw pipes
		if (images.pipeGreen) {
			const pipeImage = images.pipeGreen;
			gameState.pipes.forEach((pipe) => {
				// Draw top pipe (flipped vertically)
				ctx.save();
				ctx.translate(pipe.x + pipe.width / 2, pipe.topHeight);
				ctx.scale(1, -1);
				ctx.drawImage(
					pipeImage,
					-pipe.width / 2,
					0,
					pipe.width,
					pipeImage.height,
				);
				ctx.restore();

				// Draw bottom pipe
				ctx.drawImage(
					pipeImage,
					pipe.x,
					pipe.bottomY,
					pipe.width,
					pipeImage.height,
				);
			});
		}

		// Draw land
		if (images.land) {
			ctx.drawImage(images.land, 0, GAME_HEIGHT - 100, GAME_WIDTH, 100);
		}

		// Draw bird
		if (images.bird) {
			const birdFrameX = 9 + gameState.bird.frame * (BIRD_WIDTH + 18);
			ctx.drawImage(
				images.bird,
				birdFrameX,
				10,
				BIRD_WIDTH,
				BIRD_HEIGHT,
				gameState.bird.x,
				gameState.bird.y,
				BIRD_WIDTH,
				BIRD_HEIGHT,
			);
		}

		// Draw score
		ctx.fillStyle = "white";
		ctx.font = "48px Arial";
		ctx.textAlign = "center";
		ctx.fillText(gameState.score.toString(), GAME_WIDTH / 2, 100);

		// Draw game over screen
		if (gameState.gameOver && images.startButton) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

			ctx.drawImage(
				images.startButton,
				GAME_WIDTH / 2 - images.startButton.width / 2,
				GAME_HEIGHT / 2 - images.startButton.height / 2,
			);
		}
	}, [gameState, images]);

	// Draw game on every frame
	useEffect(() => {
		drawGame();
	}, [drawGame]);

	// Initialize game on mount
	useEffect(() => {
		initGame();
	}, [initGame]);

	return (
		<MiniGameLayout>
			<div className="relative">
				<canvas
					ref={canvasRef}
					width={GAME_WIDTH}
					height={GAME_HEIGHT}
					className=" rounded-lg shadow-lg cursor-pointer"
					onClick={handleClick}
					onMouseDown={handleClick}
					onTouchStart={handleClick}
					style={{
						maxWidth: "100%",
						height: "auto",
					}}
				/>
				{!gameState.gameStarted && !gameState.gameOver && (
					<button
						type="button"
						className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg cursor-pointer border-0"
						onClick={handleClick}
						onMouseDown={handleClick}
						onTouchStart={handleClick}
					>
						<div className="text-center text-white">
							<div className="text-xl font-bold">Click to Start!</div>
						</div>
					</button>
				)}
			</div>
		</MiniGameLayout>
	);
}
