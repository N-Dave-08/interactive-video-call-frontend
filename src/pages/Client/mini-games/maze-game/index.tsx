import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Position {
  x: number
  y: number
}

interface Enemy {
  x: number
  y: number
  direction: number
}

const MAZE_SIZE = 21
const CELL_SIZE = 20
const VISIBILITY_RADIUS = 3

// Hard maze layout (1 = wall, 0 = path, 2 = start, 3 = end)
const HARD_MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

export default function MazeGame() {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1, y: 1 })
  const [enemies, setEnemies] = useState<Enemy[]>([
    { x: 5, y: 5, direction: 0 },
    { x: 15, y: 10, direction: 1 },
    { x: 10, y: 15, direction: 2 },
    { x: 8, y: 8, direction: 3 },
  ])
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing")

  // Enemy movement
  useEffect(() => {
    if (gameState !== "playing") return

    const moveEnemies = () => {
      setEnemies((prevEnemies) =>
        prevEnemies.map((enemy) => {
          const directions = [
            { x: 0, y: -1 }, // up
            { x: 1, y: 0 }, // right
            { x: 0, y: 1 }, // down
            { x: -1, y: 0 }, // left
          ]

          let newX = enemy.x
          let newY = enemy.y
          let newDirection = enemy.direction

          // Try to move in current direction
          const currentDir = directions[enemy.direction]
          const nextX = enemy.x + currentDir.x
          const nextY = enemy.y + currentDir.y

          if (HARD_MAZE[nextY] && HARD_MAZE[nextY][nextX] !== 1) {
            newX = nextX
            newY = nextY
          } else {
            // Change direction if blocked
            newDirection = (enemy.direction + 1) % 4
          }

          return { x: newX, y: newY, direction: newDirection }
        }),
      )
    }

    const enemyTimer = setInterval(moveEnemies, 800)
    return () => clearInterval(enemyTimer)
  }, [gameState])

  // Check collision with enemies
  useEffect(() => {
    const collision = enemies.some((enemy) => enemy.x === playerPos.x && enemy.y === playerPos.y)

    if (collision && gameState === "playing") {
      setGameState("lost")
    }
  }, [playerPos, enemies, gameState])

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (gameState !== "playing") return

      setPlayerPos((prev) => {
        const newX = prev.x + dx
        const newY = prev.y + dy

        // Check bounds and walls
        if (newX < 0 || newX >= MAZE_SIZE || newY < 0 || newY >= MAZE_SIZE) {
          return prev
        }

        if (HARD_MAZE[newY][newX] === 1) {
          return prev
        }

        // Check if reached the end
        if (HARD_MAZE[newY][newX] === 3) {
          setGameState("won")
        }

        return { x: newX, y: newY }
      })
    },
    [gameState],
  )

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "arrowup":
        case "w":
          e.preventDefault()
          movePlayer(0, -1)
          break
        case "arrowdown":
        case "s":
          e.preventDefault()
          movePlayer(0, 1)
          break
        case "arrowleft":
        case "a":
          e.preventDefault()
          movePlayer(-1, 0)
          break
        case "arrowright":
        case "d":
          e.preventDefault()
          movePlayer(1, 0)
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [movePlayer])

  const startGame = () => {
    setPlayerPos({ x: 1, y: 1 })
    setGameState("playing")
    setEnemies([
      { x: 5, y: 5, direction: 0 },
      { x: 15, y: 10, direction: 1 },
      { x: 10, y: 15, direction: 2 },
      { x: 8, y: 8, direction: 3 },
    ])
  }

  const isVisible = (x: number, y: number) => {
    const dx = Math.abs(playerPos.x - x)
    const dy = Math.abs(playerPos.y - y)
    return dx <= VISIBILITY_RADIUS && dy <= VISIBILITY_RADIUS
  }

  const renderMaze = () => {
    return HARD_MAZE.map((row, y) =>
      row.map((cell, x) => {
        const isPlayer = playerPos.x === x && playerPos.y === y
        const isEnemy = enemies.some((enemy) => enemy.x === x && enemy.y === y)
        const isEnd = cell === 3
        const isWall = cell === 1
        const visible = isVisible(x, y)

        let cellClass = "absolute border border-gray-800 "
        let content = ""

        if (!visible && gameState === "playing") {
          cellClass += "bg-black"
        } else if (isWall) {
          cellClass += "bg-gray-900"
        } else if (isPlayer) {
          cellClass += "bg-blue-500 animate-pulse"
          content = "🟦"
        } else if (isEnemy) {
          cellClass += "bg-red-500 animate-bounce"
          content = "👹"
        } else if (isEnd) {
          cellClass += "bg-green-500 animate-pulse"
          content = "🏆"
        } else {
          cellClass += "bg-gray-100"
        }

        return (
          <div
            key={`${x}-${y + 1}`}
            className={cellClass}
            style={{
              left: x * CELL_SIZE,
              top: y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE,
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {content}
          </div>
        )
      }),
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      {/* Maze */}
      <div
        className="relative border-4 border-gray-700 bg-black"
        style={{
          width: MAZE_SIZE * CELL_SIZE,
          height: MAZE_SIZE * CELL_SIZE,
        }}
      >
        {renderMaze()}
      </div>

      {/* Controls */}
      <div className="mt-4 text-center bg-white/60 px-4 py-1 rounded-lg">
        <p className="text-sm">Use WASD or Arrow Keys to move</p>
      </div>

      {/* Game Over Modals */}
      {gameState === "won" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-3xl font-bold text-green-500 mb-4">Victory! 🏆</h2>
            <p className="text-gray-600 mb-4">You escaped the maze!</p>
            <Button onClick={startGame} className="w-full">
              Play Again
            </Button>
          </Card>
        </div>
      )}

      {gameState === "lost" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-3xl font-bold text-red-500 mb-4">Game Over! 💀</h2>
            <p className="text-gray-600 mb-4">A monster caught you!</p>
            <Button onClick={startGame} className="w-full">
              Play Again
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
