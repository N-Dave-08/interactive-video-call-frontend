import { useEffect, useRef, useState, useCallback } from "react";
import MiniGameLayout from "../layouts/MiniGameLayout";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface GameObject {
	x: number;
	y: number;
	width: number;
	height: number;
	type: "player" | "enemy" | "bullet" | "enemyBullet";
	health?: number;
	speed?: number;
}

interface GameState {
	isPlaying: boolean;
	isPaused: boolean;
	score: number;
	lives: number;
	gameOver: boolean;
	player: GameObject;
	enemies: GameObject[];
	bullets: GameObject[];
	enemyBullets: GameObject[];
	gameSpeed: number;
	isInvulnerable: boolean;
	invulnerabilityTimer: number;
}

interface GameImages {
	xwing: HTMLImageElement | null;
	tieFighter: HTMLImageElement | null;
	outerSpace: HTMLImageElement | null;
	xwingBlast: HTMLImageElement | null;
	tieFighterBlast: HTMLImageElement | null;
}

const GAME_WIDTH = 1200;
const GAME_HEIGHT = 800;
const PLAYER_SIZE = 40;
const ENEMY_SIZE = 35;
const BULLET_SIZE = 20;

// Game speed configuration
const INITIAL_GAME_SPEED = 2;
const MAX_GAME_SPEED = 6;
const SPEED_INCREASE_RATE = 0.001;
const ENEMY_SPAWN_RATE = 0.02;
const BULLET_SPEED = 8;
const ENEMY_BULLET_SPEED = 3;

export default function Galaga() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number | undefined>(undefined);
	const firingRef = useRef<NodeJS.Timeout | null>(null);
	const [images, setImages] = useState<GameImages>({
		xwing: null,
		tieFighter: null,
		outerSpace: null,
		xwingBlast: null,
		tieFighterBlast: null,
	});

	const [gameState, setGameState] = useState<GameState>({
		isPlaying: false,
		isPaused: false,
		score: 0,
		lives: 3,
		gameOver: false,
		player: {
			x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
			y: GAME_HEIGHT - 80,
			width: PLAYER_SIZE,
			height: PLAYER_SIZE,
			type: "player",
		},
		enemies: [],
		bullets: [],
		enemyBullets: [],
		gameSpeed: INITIAL_GAME_SPEED,
		isInvulnerable: false,
		invulnerabilityTimer: 0,
	});

	// Load Star Wars images
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
				const [xwing, tieFighter, xwingBlast, tieFighterBlast] =
					await Promise.all([
						loadImage("/star-wars-assets/xwing.png"),
						loadImage("/star-wars-assets/tiefighter.png"),
						loadImage("/star-wars-assets/xwingblast.png"),
						loadImage("/star-wars-assets/tiefighterblast.png"),
					]);

				setImages({
					xwing,
					tieFighter,
					outerSpace: null,
					xwingBlast,
					tieFighterBlast,
				});
			} catch (error) {
				console.warn("Some Star Wars assets failed to load:", error);
			}
		};

		loadAllImages();
	}, []);

	const generateEnemy = useCallback(() => {
		return {
			x: Math.random() * (GAME_WIDTH - ENEMY_SIZE),
			y: -ENEMY_SIZE,
			width: ENEMY_SIZE,
			height: ENEMY_SIZE,
			type: "enemy" as const,
			health: 1,
			speed: 1 + Math.random() * 2,
		};
	}, []);

	const generateEnemyBullet = useCallback((enemy: GameObject) => {
		return {
			x: enemy.x + enemy.width / 2 - BULLET_SIZE / 2,
			y: enemy.y + enemy.height,
			width: BULLET_SIZE,
			height: BULLET_SIZE,
			type: "enemyBullet" as const,
			speed: ENEMY_BULLET_SPEED,
		};
	}, []);

	const checkCollision = useCallback(
		(obj1: GameObject, obj2: GameObject): boolean => {
			return (
				obj1.x < obj2.x + obj2.width &&
				obj1.x + obj1.width > obj2.x &&
				obj1.y < obj2.y + obj2.height &&
				obj1.y + obj1.height > obj2.y
			);
		},
		[],
	);

	const shoot = useCallback(() => {
		if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver)
			return;

		setGameState((prev) => ({
			...prev,
			bullets: [
				...prev.bullets,
				{
					x: prev.player.x + prev.player.width / 2 - BULLET_SIZE / 2,
					y: prev.player.y,
					width: BULLET_SIZE,
					height: BULLET_SIZE,
					type: "bullet",
				},
			],
		}));
	}, [gameState.isPlaying, gameState.isPaused, gameState.gameOver]);

	const movePlayer = useCallback(
		(mouseX: number) => {
			if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver)
				return;

			const canvas = canvasRef.current;
			if (!canvas) return;

			const rect = canvas.getBoundingClientRect();
			const relativeX = mouseX - rect.left;
			const newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, relativeX));

			setGameState((prev) => ({
				...prev,
				player: {
					...prev.player,
					x: newX,
				},
			}));
		},
		[gameState.isPlaying, gameState.isPaused, gameState.gameOver],
	);

	const resetGame = useCallback(() => {
		setGameState({
			isPlaying: false,
			isPaused: false,
			score: 0,
			lives: 3,
			gameOver: false,
			player: {
				x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
				y: GAME_HEIGHT - 80,
				width: PLAYER_SIZE,
				height: PLAYER_SIZE,
				type: "player",
			},
			enemies: [],
			bullets: [],
			enemyBullets: [],
			gameSpeed: INITIAL_GAME_SPEED,
			isInvulnerable: false,
			invulnerabilityTimer: 0,
		});
	}, []);

	const startGame = useCallback(() => {
		setGameState((prev) => ({
			...prev,
			isPlaying: true,
			isPaused: false,
			gameOver: false,
			score: 0,
			lives: 3,
			enemies: [],
			bullets: [],
			enemyBullets: [],
			gameSpeed: INITIAL_GAME_SPEED,
		}));
	}, []);

	const startFiring = useCallback(() => {
		if (firingRef.current) return; // already firing
		shoot(); // shoot immediately
		firingRef.current = setInterval(() => {
			shoot();
		}, 200); // adjust the interval as needed
	}, [shoot]);

	const stopFiring = useCallback(() => {
		if (firingRef.current) {
			clearInterval(firingRef.current);
			firingRef.current = null;
		}
	}, []);

	const togglePause = useCallback(() => {
		setGameState((prev) => ({
			...prev,
			isPaused: !prev.isPaused,
		}));
	}, []);

	const gameLoop = useCallback(() => {
		if (!gameState.isPlaying || gameState.isPaused || gameState.gameOver) {
			animationRef.current = requestAnimationFrame(gameLoop);
			return;
		}

		setGameState((prev) => {
			// Update bullets
			const updatedBullets = prev.bullets
				.map((bullet) => ({
					...bullet,
					y: bullet.y - BULLET_SPEED,
				}))
				.filter((bullet) => bullet.y > -BULLET_SIZE);

			// Update enemy bullets
			const updatedEnemyBullets = prev.enemyBullets
				.map((bullet) => ({
					...bullet,
					y: bullet.y + (bullet.speed ?? 0),
				}))
				.filter((bullet) => bullet.y < GAME_HEIGHT);

			// Update enemies
			const updatedEnemies = prev.enemies
				.map((enemy) => ({
					...enemy,
					y: enemy.y + (enemy.speed ?? 0),
				}))
				.filter((enemy) => enemy.y < GAME_HEIGHT + ENEMY_SIZE);

			// Generate new enemies
			const newEnemies = [...updatedEnemies];
			if (Math.random() < ENEMY_SPAWN_RATE) {
				newEnemies.push(generateEnemy());
			}

			// Generate enemy bullets
			const newEnemyBullets = [...updatedEnemyBullets];
			updatedEnemies.forEach((enemy) => {
				if (Math.random() < 0.005) {
					newEnemyBullets.push(generateEnemyBullet(enemy));
				}
			});

			// Check bullet-enemy collisions
			let newScore = prev.score;
			let newEnemiesAfterCollision = [...newEnemies];
			let newBulletsAfterCollision = [...updatedBullets];

			// Check each bullet against enemies
			newBulletsAfterCollision = newBulletsAfterCollision.filter((bullet) => {
				let bulletHit = false;

				// Check if this bullet hits any enemy
				newEnemiesAfterCollision = newEnemiesAfterCollision.filter((enemy) => {
					if (!bulletHit && checkCollision(bullet, enemy)) {
						newScore += 10;
						bulletHit = true; // Mark bullet as hit
						return false; // Remove enemy
					}
					return true;
				});

				return !bulletHit; // Remove bullet if it hit an enemy
			});

			// Check player-enemy collisions
			let newLives = prev.lives;
			let gameOver = prev.gameOver;
			let isInvulnerable = prev.isInvulnerable;
			let invulnerabilityTimer = prev.invulnerabilityTimer;

			// Update invulnerability timer
			if (isInvulnerable) {
				invulnerabilityTimer--;
				if (invulnerabilityTimer <= 0) {
					isInvulnerable = false;
				}
			}

			// Only check collisions if not invulnerable
			if (!isInvulnerable) {
				let hit = false;

				// Check enemy collisions
				newEnemiesAfterCollision.forEach((enemy) => {
					if (checkCollision(prev.player, enemy)) {
						hit = true;
					}
				});

				// Check bullet collisions
				newEnemyBullets.forEach((bullet) => {
					if (checkCollision(prev.player, bullet)) {
						hit = true;
					}
				});

				// Handle hit
				if (hit) {
					newLives--;
					isInvulnerable = true;
					invulnerabilityTimer = 120; // 2 seconds at 60fps
					if (newLives <= 0) {
						gameOver = true;
					}
				}
			}

			// Increase game speed
			const newGameSpeed = Math.min(
				prev.gameSpeed + SPEED_INCREASE_RATE,
				MAX_GAME_SPEED,
			);

			return {
				...prev,
				bullets: newBulletsAfterCollision,
				enemies: newEnemiesAfterCollision,
				enemyBullets: newEnemyBullets,
				score: newScore,
				lives: newLives,
				gameOver,
				gameSpeed: newGameSpeed,
				isInvulnerable,
				invulnerabilityTimer,
			};
		});

		animationRef.current = requestAnimationFrame(gameLoop);
	}, [
		gameState.isPlaying,
		gameState.isPaused,
		gameState.gameOver,
		generateEnemy,
		generateEnemyBullet,
		checkCollision,
	]);

	useEffect(() => {
		gameLoop();
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [gameLoop]);

	// Cleanup firing on unmount
	useEffect(() => {
		return () => {
			stopFiring();
		};
	}, [stopFiring]);

	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.code === "Space") {
				e.preventDefault();
				shoot();
			}
		};

		const handleMouseMove = (e: MouseEvent) => {
			movePlayer(e.clientX);
		};

		const handleMouseDown = (e: MouseEvent) => {
			if (e.target === canvasRef.current) {
				startFiring();
			}
		};

		const handleMouseUp = () => {
			stopFiring();
		};

		window.addEventListener("keydown", handleKeyPress);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mousedown", handleMouseDown);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("mousedown", handleMouseDown);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [shoot, movePlayer, startFiring, stopFiring]);

	const renderGame = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

		// Draw space background
		ctx.fillStyle = "#0a0a2e";
		ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

		// Draw moving stars
		ctx.fillStyle = "#ffffff";
		const time = Date.now() * 0.001; // Get current time for animation
		for (let i = 0; i < 100; i++) {
			// Use more random positioning for natural star distribution
			const x = (i * 37 + Math.sin(i * 0.1) * 50) % GAME_WIDTH;
			const y =
				(i * 73 + Math.cos(i * 0.1) * 30 + (time * 30 + i * 1.5)) %
				(GAME_HEIGHT + 20);
			ctx.fillRect(x, y, 1, 1);
		}

		// Draw player (X-Wing) - blinking when invulnerable
		if (
			!gameState.isInvulnerable ||
			Math.floor(gameState.invulnerabilityTimer / 10) % 2 === 0
		) {
			if (images.xwing) {
				ctx.drawImage(
					images.xwing,
					gameState.player.x,
					gameState.player.y,
					gameState.player.width,
					gameState.player.height,
				);
			} else {
				// Fallback to green rectangle
				ctx.fillStyle = "#00ff00";
				ctx.fillRect(
					gameState.player.x,
					gameState.player.y,
					gameState.player.width,
					gameState.player.height,
				);
			}
		}

		// Draw enemies (TIE Fighters)
		gameState.enemies.forEach((enemy) => {
			if (images.tieFighter) {
				ctx.drawImage(
					images.tieFighter,
					enemy.x,
					enemy.y,
					enemy.width,
					enemy.height,
				);
			} else {
				// Fallback to red rectangle for TIE Fighter
				ctx.fillStyle = "#ff0000";
				ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

				// Draw TIE Fighter details
				ctx.fillStyle = "#ffffff";
				ctx.fillRect(enemy.x + 8, enemy.y + 8, 19, 19);
			}
		});

		// Draw player bullets (X-Wing blasts)
		gameState.bullets.forEach((bullet) => {
			if (images.xwingBlast) {
				ctx.drawImage(
					images.xwingBlast,
					bullet.x,
					bullet.y,
					bullet.width,
					bullet.height,
				);
			} else {
				// Fallback to yellow rectangle
				ctx.fillStyle = "#ffff00";
				ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
			}
		});

		// Draw enemy bullets (TIE Fighter blasts)
		gameState.enemyBullets.forEach((bullet) => {
			if (images.tieFighterBlast) {
				ctx.drawImage(
					images.tieFighterBlast,
					bullet.x,
					bullet.y,
					bullet.width,
					bullet.height,
				);
			} else {
				// Fallback to purple rectangle
				ctx.fillStyle = "#ff00ff";
				ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
			}
		});

		// Draw UI with Star Wars theme
		ctx.fillStyle = "#ffffff";
		ctx.font = "bold 20px Arial";
		ctx.fillText(`Score: ${gameState.score}`, 20, 30);
		ctx.fillText(`Lives: ${gameState.lives}`, 20, 60);

		// Draw game over screen
		if (gameState.gameOver) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
			ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 48px Arial";
			ctx.textAlign = "center";
			ctx.fillText("GAME OVER", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50);
			ctx.font = "24px Arial";
			ctx.fillText(
				`Final Score: ${gameState.score}`,
				GAME_WIDTH / 2,
				GAME_HEIGHT / 2,
			);
			ctx.textAlign = "left";
		}
	}, [gameState, images]);

	useEffect(() => {
		renderGame();
	}, [renderGame]);

	return (
		<MiniGameLayout>
			<div className="flex flex-col items-center gap-6">
				<div className="relative">
					<canvas
						ref={canvasRef}
						width={GAME_WIDTH}
						height={GAME_HEIGHT}
						className="border-2 border-white/20 rounded-lg bg-gray-900"
					/>

					{!gameState.isPlaying && !gameState.gameOver && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
							<Button
								onClick={startGame}
								size="lg"
								className="bg-blue-600 hover:bg-blue-700"
							>
								<Play className="mr-2 h-4 w-4" />
								Start Game
							</Button>
						</div>
					)}

					{gameState.isPlaying && !gameState.gameOver && (
						<div className="absolute top-4 right-4">
							<Button
								onClick={togglePause}
								size="sm"
								variant="outline"
								className="bg-white/10 text-white border-white/20"
							>
								{gameState.isPaused ? (
									<Play className="h-4 w-4" />
								) : (
									<Pause className="h-4 w-4" />
								)}
							</Button>
						</div>
					)}

					{gameState.gameOver && (
						<div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
							<div className="text-center">
								<Button
									onClick={resetGame}
									size="lg"
									className="bg-red-600 hover:bg-red-700"
								>
									<RotateCcw className="mr-2 h-4 w-4" />
									Play Again
								</Button>
							</div>
						</div>
					)}
				</div>
			</div>
		</MiniGameLayout>
	);
}
