import MiniGameLayout from "../layouts/MiniGameLayout";
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Game constants
const BOARD_SIZE = 20 // Number of cells in width/height
const CELL_SIZE = 20 // Size of each cell in pixels
const INITIAL_SNAKE = [{ x: 10, y: 10 }] // Starting position of the snake
const INITIAL_FOOD = { x: 5, y: 5 } // Starting position of the food
const INITIAL_DIRECTION = { dx: 1, dy: 0 } // Initial direction: right
const GAME_SPEED = 150 // Game update interval in milliseconds


export default function Snake() {
	const [snake, setSnake] = useState(INITIAL_SNAKE)
	const [food, setFood] = useState(INITIAL_FOOD)
	const [direction, setDirection] = useState(INITIAL_DIRECTION)
	const [score, setScore] = useState(0)
	const [gameOver, setGameOver] = useState(false)
	const [gameStarted, setGameStarted] = useState(false)
  
	// Use a ref to store the current direction, allowing the interval callback to always access the latest value
	const directionRef = useRef(direction)
	useEffect(() => {
	  directionRef.current = direction
	}, [direction])
  
	// Function to generate new food at a random position, avoiding the snake's body
	const generateFood = useCallback(() => {
	  let newFood: { x: number; y: number }
	  do {
		newFood = {
		  x: Math.floor(Math.random() * BOARD_SIZE),
		  y: Math.floor(Math.random() * BOARD_SIZE),
		}
	  } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
	  setFood(newFood)
	}, [snake]) // Dependency on snake to ensure food doesn't spawn on it
  
	// Function to move the snake
	const moveSnake = useCallback(() => {
	  if (gameOver || !gameStarted) return
  
	  setSnake((prevSnake) => {
		const newSnake = [...prevSnake]
		const head = { ...newSnake[0] } // Copy head to avoid direct mutation
  
		const currentDirection = directionRef.current // Get the latest direction from the ref
		head.x += currentDirection.dx
		head.y += currentDirection.dy
  
		// Check for wall collision
		if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
		  setGameOver(true)
		  return prevSnake
		}
  
		// Check for self-collision
		// If the snake is eating food, its tail doesn't move, so we check against all segments.
		// If not eating, the tail moves, so we exclude the last segment from the collision check.
		const isEatingFood = head.x === food.x && head.y === food.y
		const segmentsToCheck = isEatingFood ? newSnake : newSnake.slice(0, -1)
  
		if (segmentsToCheck.some((segment) => segment.x === head.x && segment.y === head.y)) {
		  setGameOver(true)
		  return prevSnake
		}
  
		newSnake.unshift(head) // Add new head
  
		// Handle food consumption
		if (isEatingFood) {
		  setScore((prevScore) => prevScore + 1)
		  generateFood() // Generate new food
		} else {
		  newSnake.pop() // Remove tail if no food was eaten
		}
  
		return newSnake
	  })
	}, [gameOver, gameStarted, food, generateFood]) // Dependencies for moveSnake useCallback
  
	// Effect for the game loop (movement)
	useEffect(() => {
	  if (gameOver || !gameStarted) return
  
	  const gameInterval = setInterval(moveSnake, GAME_SPEED)
	  return () => clearInterval(gameInterval) // Clear interval on component unmount or game over
	}, [gameOver, gameStarted, moveSnake]) // moveSnake is a stable callback, so this effect only re-runs when game state changes
  
	// Effect for keyboard input
	useEffect(() => {
	  const handleKeyDown = (e: KeyboardEvent) => {
		// Start game on spacebar press
		if (!gameStarted && e.key === " ") {
		  setGameStarted(true)
		  return
		}
		if (gameOver) return
  
		const currentDirection = directionRef.current // Get the latest direction from the ref
  
		// Prevent immediate reverse direction
		switch (e.key) {
		  case "ArrowUp":
			if (currentDirection.dy === 0) setDirection({ dx: 0, dy: -1 })
			break
		  case "ArrowDown":
			if (currentDirection.dy === 0) setDirection({ dx: 0, dy: 1 })
			break
		  case "ArrowLeft":
			if (currentDirection.dx === 0) setDirection({ dx: -1, dy: 0 })
			break
		  case "ArrowRight":
			if (currentDirection.dx === 0) setDirection({ dx: 1, dy: 0 })
			break
		}
	  }
  
	  window.addEventListener("keydown", handleKeyDown)
	  return () => window.removeEventListener("keydown", handleKeyDown)
	}, [gameOver, gameStarted]) // Dependencies for keyboard input effect
  
	// Function to reset the game
	const resetGame = () => {
	  setSnake(INITIAL_SNAKE)
	  setFood(INITIAL_FOOD)
	  setDirection(INITIAL_DIRECTION)
	  setScore(0)
	  setGameOver(false)
	  setGameStarted(false)
	}

	return <MiniGameLayout>
		<Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg">
	<CardHeader className="flex flex-row items-center justify-between pb-2">
	  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">Snake Game</CardTitle>
	  <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">Score: {score}</div>
	</CardHeader>
	<CardContent className="p-4">
	  <div
		className="relative border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 mx-auto"
		style={{
		  width: BOARD_SIZE * CELL_SIZE,
		  height: BOARD_SIZE * CELL_SIZE,
		}}
	  >
		{/* Render snake segments */}
		{snake.map((segment, index) => (
		  <div
			key={`${segment.x}-${segment.y}-${index}`} // Unique key for each segment
			className={`absolute rounded-sm ${
			  index === 0 ? "bg-green-600 dark:bg-green-500" : "bg-green-500 dark:bg-green-600"
			}`}
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
	  </div>
	  {/* Game Over message */}
	  {gameOver && (
		<div className="mt-4 text-center text-red-600 dark:text-red-400 text-xl font-bold">Game Over!</div>
	  )}
	  {/* Start Game message */}
	  {!gameStarted && !gameOver && (
		<div className="mt-4 text-center text-gray-600 dark:text-gray-400 text-lg">Press Spacebar to Start</div>
	  )}
	  {/* Reset/Play Again button */}
	  <div className="mt-6 flex justify-center">
		<Button onClick={resetGame} className="w-full max-w-xs">
		  {gameOver || !gameStarted ? "Play Again" : "Reset Game"}
		</Button>
	  </div>
	</CardContent>
  </Card>
  </MiniGameLayout>;
}
