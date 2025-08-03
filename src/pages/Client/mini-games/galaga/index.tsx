import { useEffect, useRef, useState, useCallback } from "react";
import MiniGameLayout from "../layouts/MiniGameLayout";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

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
	level: number;
	player: GameObject;
	enemies: GameObject[];
	bullets: GameObject[];
	enemyBullets: GameObject[];
	gameSpeed: number;
	isInvulnerable: boolean;
	invulnerabilityTimer: number;
}

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 30;
const ENEMY_SIZE = 25;
const BULLET_SIZE = 4;

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
	const [showSettings, setShowSettings] = useState(false);
	const [gameConfig, setGameConfig] = useState({
		gameSpeed: INITIAL_GAME_SPEED,
		maxSpeed: MAX_GAME_SPEED,
		speedIncreaseRate: SPEED_INCREASE_RATE,
		enemySpawnRate: ENEMY_SPAWN_RATE,
		bulletSpeed: BULLET_SPEED,
		enemyBulletSpeed: ENEMY_BULLET_SPEED,
	});
	const [gameState, setGameState] = useState<GameState>({
		isPlaying: false,
		isPaused: false,
		score: 0,
		lives: 3,
		gameOver: false,
		level: 1,
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
		gameSpeed: gameConfig.gameSpeed,
		isInvulnerable: false,
		invulnerabilityTimer: 0,
	});

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

	const generateEnemyBullet = useCallback(
		(enemy: GameObject) => {
			return {
				x: enemy.x + enemy.width / 2 - BULLET_SIZE / 2,
				y: enemy.y + enemy.height,
				width: BULLET_SIZE,
				height: BULLET_SIZE,
				type: "enemyBullet" as const,
				speed: gameConfig.enemyBulletSpeed,
			};
		},
		[gameConfig.enemyBulletSpeed],
	);

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
			level: 1,
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
			gameSpeed: gameConfig.gameSpeed,
			isInvulnerable: false,
			invulnerabilityTimer: 0,
		});
	}, [gameConfig.gameSpeed]);

	const startGame = useCallback(() => {
		setGameState((prev) => ({
			...prev,
			isPlaying: true,
			isPaused: false,
			gameOver: false,
			score: 0,
			lives: 3,
			level: 1,
			enemies: [],
			bullets: [],
			enemyBullets: [],
			gameSpeed: gameConfig.gameSpeed,
		}));
	}, [gameConfig.gameSpeed]);

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
					y: bullet.y - gameConfig.bulletSpeed,
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
			if (Math.random() < gameConfig.enemySpawnRate) {
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
			const newBulletsAfterCollision = [...updatedBullets];

			updatedBullets.forEach((bullet) => {
				newEnemiesAfterCollision = newEnemiesAfterCollision.filter((enemy) => {
					if (checkCollision(bullet, enemy)) {
						newScore += 10;
						return false; // Remove enemy
					}
					return true;
				});
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
				prev.gameSpeed + gameConfig.speedIncreaseRate,
				gameConfig.maxSpeed,
			);

			// Level up
			let newLevel = prev.level;
			if (newScore > 0 && newScore % 100 === 0) {
				newLevel++;
			}

			return {
				...prev,
				bullets: newBulletsAfterCollision,
				enemies: newEnemiesAfterCollision,
				enemyBullets: newEnemyBullets,
				score: newScore,
				lives: newLives,
				gameOver,
				level: newLevel,
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
		gameConfig,
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

		const handleMouseClick = (e: MouseEvent) => {
			if (e.target === canvasRef.current) {
				shoot();
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("click", handleMouseClick);
		return () => {
			window.removeEventListener("keydown", handleKeyPress);
			window.removeEventListener("mousemove", handleMouseMove);
			window.removeEventListener("click", handleMouseClick);
		};
	}, [shoot, movePlayer]);

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

		// Draw stars
		ctx.fillStyle = "#ffffff";
		for (let i = 0; i < 50; i++) {
			const x = (i * 37) % GAME_WIDTH;
			const y = (i * 73) % GAME_HEIGHT;
			ctx.fillRect(x, y, 1, 1);
		}

		// Draw player (blinking when invulnerable)
		if (
			!gameState.isInvulnerable ||
			Math.floor(gameState.invulnerabilityTimer / 10) % 2 === 0
		) {
			ctx.fillStyle = "#00ff00";
			ctx.fillRect(
				gameState.player.x,
				gameState.player.y,
				gameState.player.width,
				gameState.player.height,
			);

			// Draw player details
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(gameState.player.x + 5, gameState.player.y + 5, 20, 20);
		}

		// Draw enemies
		gameState.enemies.forEach((enemy) => {
			ctx.fillStyle = "#ff0000";
			ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

			// Enemy details
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(enemy.x + 5, enemy.y + 5, 15, 15);
		});

		// Draw bullets
		gameState.bullets.forEach((bullet) => {
			ctx.fillStyle = "#ffff00";
			ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
		});

		// Draw enemy bullets
		gameState.enemyBullets.forEach((bullet) => {
			ctx.fillStyle = "#ff00ff";
			ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
		});

		// Draw UI
		ctx.fillStyle = "#ffffff";
		ctx.font = "20px Arial";
		ctx.fillText(`Score: ${gameState.score}`, 20, 30);
		ctx.fillText(`Lives: ${gameState.lives}`, 20, 60);
		ctx.fillText(`Level: ${gameState.level}`, 20, 90);

		// Draw game over screen
		if (gameState.gameOver) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
			ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

			ctx.fillStyle = "#ffffff";
			ctx.font = "48px Arial";
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
	}, [gameState]);

	useEffect(() => {
		renderGame();
	}, [renderGame]);

	return (
		<MiniGameLayout>
			<div className="flex flex-col items-center gap-6">
				<div className="text-center">
					<h1 className="text-4xl font-bold text-white mb-2">Galaga</h1>
					<p className="text-white/80 mb-4">
						Move mouse to control ship, click or press Space to shoot!
					</p>
				</div>

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

				<div className="flex gap-4">
					<Button
						onClick={shoot}
						disabled={
							!gameState.isPlaying || gameState.isPaused || gameState.gameOver
						}
					>
						Shoot
					</Button>
					<Button
						onClick={() => movePlayer(gameState.player.x - 50)}
						disabled={
							!gameState.isPlaying || gameState.isPaused || gameState.gameOver
						}
					>
						← Left
					</Button>
					<Button
						onClick={() => movePlayer(gameState.player.x + 50)}
						disabled={
							!gameState.isPlaying || gameState.isPaused || gameState.gameOver
						}
					>
						Right →
					</Button>
					<Button onClick={resetGame} variant="outline">
						Reset
					</Button>
					<Button
						onClick={() => setShowSettings(!showSettings)}
						variant="outline"
						className="bg-white/10 text-white border-white/20"
					>
						<Settings className="h-4 w-4" />
					</Button>
				</div>

				{showSettings && (
					<Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
						<h3 className="text-lg font-bold text-white mb-4">Game Settings</h3>
						<div className="space-y-4">
							<div>
								<label
									htmlFor="game-speed-slider"
									className="text-white text-sm font-medium"
								>
									Game Speed: {gameConfig.gameSpeed.toFixed(1)}
								</label>
								<Slider
									id="game-speed-slider"
									value={[gameConfig.gameSpeed]}
									onValueChange={(value) =>
										setGameConfig((prev) => ({ ...prev, gameSpeed: value[0] }))
									}
									max={8}
									min={1}
									step={0.5}
									className="mt-2"
								/>
							</div>
							<div>
								<label
									htmlFor="max-speed-slider"
									className="text-white text-sm font-medium"
								>
									Max Speed: {gameConfig.maxSpeed.toFixed(1)}
								</label>
								<Slider
									id="max-speed-slider"
									value={[gameConfig.maxSpeed]}
									onValueChange={(value) =>
										setGameConfig((prev) => ({ ...prev, maxSpeed: value[0] }))
									}
									max={10}
									min={4}
									step={0.5}
									className="mt-2"
								/>
							</div>
							<div>
								<label
									htmlFor="enemy-spawn-slider"
									className="text-white text-sm font-medium"
								>
									Enemy Spawn Rate:{" "}
									{(gameConfig.enemySpawnRate * 100).toFixed(1)}%
								</label>
								<Slider
									id="enemy-spawn-slider"
									value={[gameConfig.enemySpawnRate]}
									onValueChange={(value) =>
										setGameConfig((prev) => ({
											...prev,
											enemySpawnRate: value[0],
										}))
									}
									max={0.05}
									min={0.01}
									step={0.001}
									className="mt-2"
								/>
							</div>
							<div>
								<label
									htmlFor="bullet-speed-slider"
									className="text-white text-sm font-medium"
								>
									Bullet Speed: {gameConfig.bulletSpeed}
								</label>
								<Slider
									id="bullet-speed-slider"
									value={[gameConfig.bulletSpeed]}
									onValueChange={(value) =>
										setGameConfig((prev) => ({
											...prev,
											bulletSpeed: value[0],
										}))
									}
									max={15}
									min={5}
									step={1}
									className="mt-2"
								/>
							</div>
							<div>
								<label
									htmlFor="enemy-bullet-slider"
									className="text-white text-sm font-medium"
								>
									Enemy Bullet Speed: {gameConfig.enemyBulletSpeed}
								</label>
								<Slider
									id="enemy-bullet-slider"
									value={[gameConfig.enemyBulletSpeed]}
									onValueChange={(value) =>
										setGameConfig((prev) => ({
											...prev,
											enemyBulletSpeed: value[0],
										}))
									}
									max={8}
									min={1}
									step={0.5}
									className="mt-2"
								/>
							</div>
						</div>
					</Card>
				)}
			</div>
		</MiniGameLayout>
	);
}
