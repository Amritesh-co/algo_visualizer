"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  RotateCcw,
  MapPin,
  Zap,
  Clock,
  Target,
  Activity,
  SkipForward,
  SkipBack,
  Shuffle,
  Grid3X3,
  Gauge,
} from "lucide-react"
import { usePathfindingStore } from "@/store/use-pathfinding-store"
import { PathfindingAlgorithm } from "@/lib/algorithms/pathfinding"

const algorithms = [
  {
    value: "dijkstra",
    label: "Dijkstra's Algorithm",
    description: "Finds shortest path using weighted distances",
    color: "from-blue-500 to-cyan-500",
  },
  {
    value: "bfs",
    label: "Breadth-First Search",
    description: "Explores level by level, guarantees shortest path",
    color: "from-green-500 to-emerald-500",
  },
  {
    value: "dfs",
    label: "Depth-First Search",
    description: "Explores as deep as possible before backtracking",
    color: "from-purple-500 to-violet-500",
  },
]

const speedSettings = [
  { value: 1, label: "Slow", delay: 150, color: "text-blue-500" },
  { value: 2, label: "Normal", delay: 75, color: "text-green-500" },
  { value: 3, label: "Fast", delay: 25, color: "text-yellow-500" },
  { value: 4, label: "Lightning", delay: 5, color: "text-red-500" },
]

const GRID_ROWS = 25
const GRID_COLS = 50

export function PathfindingVisualizer() {
  const {
    grid,
    algorithm,
    isPlaying,
    currentStep,
    steps,
    startNode,
    endNode,
    metrics,
    setGrid,
    setAlgorithm,
    setIsPlaying,
    setCurrentStep,
    setSteps,
    setStartNode,
    setEndNode,
    setMetrics,
    initializeGrid,
    resetVisualization,
  } = usePathfindingStore()

  const [mouseDown, setMouseDown] = useState(false)
  const [dragMode, setDragMode] = useState<"start" | "end" | "wall" | null>(null)
  const [speed, setSpeed] = useState(2)
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    nodesVisited: 0,
    pathLength: 0,
    executionTime: 0,
    pathFound: false,
  })
  const [isGeneratingMaze, setIsGeneratingMaze] = useState(false)
  const [currentDescription, setCurrentDescription] = useState("")

  const animationRef = useRef<NodeJS.Timeout | null>(null)
  const pathAnimationRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize grid on mount
  useEffect(() => {
    initializeGrid(GRID_ROWS, GRID_COLS)
  }, [initializeGrid])

  const currentAlgorithm = algorithms.find((a) => a.value === algorithm) || algorithms[0]
  const currentSpeed = speedSettings.find((s) => s.value === speed) || speedSettings[1]

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value)
    resetVisualization()
    setRealTimeMetrics({
      nodesVisited: 0,
      pathLength: 0,
      executionTime: 0,
      pathFound: false,
    })
    setCurrentDescription("")
  }

  const runAlgorithm = useCallback(() => {
    if (!startNode || !endNode || !grid || grid.length === 0) return

    try {
      const pathfindingAlgorithm = new PathfindingAlgorithm(algorithm)
      const result = pathfindingAlgorithm.findPath(grid, startNode, endNode)
      setSteps(result.steps || [])
      setMetrics(result.metrics || { nodesVisited: 0, pathLength: 0, executionTime: 0, pathFound: false })
      setCurrentStep(0)
      setRealTimeMetrics({
        nodesVisited: 0,
        pathLength: 0,
        executionTime: 0,
        pathFound: false,
      })
      setCurrentDescription(result.steps?.[0]?.description || "Starting algorithm...")
    } catch (error) {
      console.error("Algorithm execution failed:", error)
      resetVisualization()
    }
  }, [algorithm, grid, startNode, endNode, setSteps, setMetrics, setCurrentStep, resetVisualization])

  const handlePlay = () => {
    if (!steps || steps.length === 0) {
      runAlgorithm()
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    if (animationRef.current) clearTimeout(animationRef.current)
    if (pathAnimationRef.current) clearTimeout(pathAnimationRef.current)

    resetVisualization()
    setRealTimeMetrics({
      nodesVisited: 0,
      pathLength: 0,
      executionTime: 0,
      pathFound: false,
    })
    setCurrentDescription("")
    initializeGrid(GRID_ROWS, GRID_COLS)
  }

  const stepForward = () => {
    if (steps && currentStep < steps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      updateMetricsForStep(nextStep)
    }
  }

  const stepBackward = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      updateMetricsForStep(prevStep)
    }
  }

  const updateMetricsForStep = (step: number) => {
    if (!steps || !steps[step]) return

    const currentGrid = steps[step].grid
    if (currentGrid && Array.isArray(currentGrid)) {
      let visitedCount = 0
      let pathLength = 0

      currentGrid.forEach((row) => {
        if (Array.isArray(row)) {
          row.forEach((cell) => {
            if (cell) {
              if (cell.isVisited) visitedCount++
              if (cell.isPath) pathLength++
            }
          })
        }
      })

      const progressRatio = step / (steps.length - 1)
      const estimatedTime = metrics ? Math.floor(progressRatio * (metrics.executionTime || 0)) : 0

      setRealTimeMetrics({
        nodesVisited: visitedCount,
        pathLength: pathLength,
        executionTime: estimatedTime,
        pathFound: pathLength > 0,
      })

      setCurrentDescription(steps[step].description || "")
    }
  }

  const generateMaze = async () => {
    if (!grid || grid.length === 0) return

    setIsGeneratingMaze(true)
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell, isWall: false })))

    // Animated maze generation
    const wallPositions: Array<{ row: number; col: number }> = []

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        if (
          Math.random() < 0.3 &&
          !(startNode && row === startNode.row && col === startNode.col) &&
          !(endNode && row === endNode.row && col === endNode.col)
        ) {
          wallPositions.push({ row, col })
        }
      }
    }

    // Animate wall creation
    for (let i = 0; i < wallPositions.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2))
      const { row, col } = wallPositions[i]
      newGrid[row][col] = { ...newGrid[row][col], isWall: true }
      setGrid([...newGrid])
    }

    setIsGeneratingMaze(false)
    resetVisualization()
  }

  const clearMaze = () => {
    if (!grid || grid.length === 0) return
    const newGrid = grid.map((row) => row.map((cell) => ({ ...cell, isWall: false })))
    setGrid(newGrid)
    resetVisualization()
  }

  const handleMouseDown = (row: number, col: number) => {
    if (!grid || !grid[row] || !grid[row][col] || isPlaying) return

    setMouseDown(true)

    if (startNode && row === startNode.row && col === startNode.col) {
      setDragMode("start")
    } else if (endNode && row === endNode.row && col === endNode.col) {
      setDragMode("end")
    } else {
      setDragMode("wall")
      toggleWall(row, col)
    }
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!mouseDown || !grid || !grid[row] || !grid[row][col] || isPlaying) return

    if (dragMode === "start") {
      setStartNode({ row, col })
      resetVisualization()
    } else if (dragMode === "end") {
      setEndNode({ row, col })
      resetVisualization()
    } else if (dragMode === "wall") {
      toggleWall(row, col)
    }
  }

  const handleMouseUp = () => {
    setMouseDown(false)
    setDragMode(null)
  }

  const toggleWall = (row: number, col: number) => {
    if (
      !grid ||
      !grid[row] ||
      !grid[row][col] ||
      (startNode && row === startNode.row && col === startNode.col) ||
      (endNode && row === endNode.row && col === endNode.col)
    ) {
      return
    }

    const newGrid = [...grid]
    newGrid[row][col] = {
      ...newGrid[row][col],
      isWall: !newGrid[row][col].isWall,
    }
    setGrid(newGrid)
    resetVisualization()
  }

  // Enhanced auto-play logic with speed control
  useEffect(() => {
    if (isPlaying && steps && currentStep < steps.length - 1) {
      animationRef.current = setTimeout(() => {
        const nextStep = currentStep + 1
        setCurrentStep(nextStep)
        updateMetricsForStep(nextStep)
      }, currentSpeed.delay)

      return () => {
        if (animationRef.current) clearTimeout(animationRef.current)
      }
    } else if (steps && currentStep >= steps.length - 1) {
      setIsPlaying(false)
      if (metrics) {
        setRealTimeMetrics({
          nodesVisited: metrics.nodesVisited || 0,
          pathLength: metrics.pathLength || 0,
          executionTime: metrics.executionTime || 0,
          pathFound: metrics.pathFound || false,
        })
      }
    }
  }, [isPlaying, currentStep, steps, currentSpeed.delay, metrics])

  const getCurrentGrid = () => {
    if (!steps || steps.length === 0 || currentStep === -1) return grid || []
    return steps[currentStep]?.grid || grid || []
  }

  const getCellClass = (row: number, col: number) => {
    const currentGrid = getCurrentGrid()
    if (!currentGrid || !currentGrid[row] || !currentGrid[row][col]) {
      return "bg-slate-200 border-slate-300 hover:bg-slate-100"
    }

    const cell = currentGrid[row][col]

    if (startNode && row === startNode.row && col === startNode.col) {
      return "bg-gradient-to-br from-green-400 to-green-600 border-green-500 shadow-lg shadow-green-500/50 animate-pulse"
    }
    if (endNode && row === endNode.row && col === endNode.col) {
      return "bg-gradient-to-br from-red-400 to-red-600 border-red-500 shadow-lg shadow-red-500/50 animate-pulse"
    }
    if (cell.isWall) {
      return "bg-gradient-to-br from-slate-700 to-slate-900 border-slate-800 shadow-inner"
    }
    if (cell.isPath) {
      return `bg-gradient-to-br ${currentAlgorithm.color} border-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse`
    }
    if (cell.isVisited) {
      return "bg-gradient-to-br from-blue-300 to-blue-500 border-blue-400 shadow-sm shadow-blue-300/30"
    }

    return "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:shadow-sm transition-all duration-200"
  }

  // Don't render if grid is not properly initialized
  if (!grid || !Array.isArray(grid) || grid.length === 0 || !grid[0] || grid[0].length === 0) {
    return (
      <div className="space-y-6">
        <Card className="glassmorphism border-0">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Initializing pathfinding grid...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Algorithm Info Card */}
      <Card className="glassmorphism border-0 overflow-hidden">
        <div className={`h-1 bg-gradient-to-r ${currentAlgorithm.color}`} />
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${currentAlgorithm.color} shadow-lg`}>
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentAlgorithm.label}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{currentAlgorithm.description}</p>
              </div>
            </div>
            <Badge variant="outline" className={`${currentSpeed.color} border-current`}>
              <Gauge className="h-3 w-3 mr-1" />
              {currentSpeed.label}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glassmorphism border-0">
          <CardHeader>
            <CardTitle className="text-lg">Algorithm & Speed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Algorithm</Label>
              <Select value={algorithm || "dijkstra"} onValueChange={handleAlgorithmChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {algorithms.map((algo) => (
                    <SelectItem key={algo.value} value={algo.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${algo.color}`} />
                        {algo.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Speed</Label>
                <Badge variant="outline" className={`${currentSpeed.color} border-current`}>
                  {currentSpeed.label}
                </Badge>
              </div>
              <Slider
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                max={4}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
                <span>Lightning</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism border-0">
          <CardHeader>
            <CardTitle className="text-lg">Playback Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={isPlaying ? handlePause : handlePlay}
                size="sm"
                className="flex-1"
                disabled={isGeneratingMaze}
              >
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pause" : "Start"}
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm" disabled={isGeneratingMaze}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={stepBackward}
                variant="outline"
                size="sm"
                disabled={currentStep === 0 || isPlaying || isGeneratingMaze}
                className="flex-1"
              >
                <SkipBack className="h-4 w-4 mr-2" />
                Step Back
              </Button>
              <Button
                onClick={stepForward}
                variant="outline"
                size="sm"
                disabled={!steps || currentStep >= steps.length - 1 || isPlaying || isGeneratingMaze}
                className="flex-1"
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Step Forward
              </Button>
            </div>

            {steps && steps.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${currentAlgorithm.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glassmorphism border-0">
          <CardHeader>
            <CardTitle className="text-lg">Maze Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={generateMaze}
              variant="outline"
              className="w-full"
              disabled={isPlaying || isGeneratingMaze}
            >
              {isGeneratingMaze ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Generate Random Maze
                </>
              )}
            </Button>

            <Button onClick={clearMaze} variant="outline" className="w-full" disabled={isPlaying || isGeneratingMaze}>
              <Grid3X3 className="h-4 w-4 mr-2" />
              Clear Maze
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Click and drag to create walls</p>
              <p>• Drag start (green) and end (red) nodes</p>
              <p>• Use speed slider for visualization control</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Step Description */}
      {currentDescription && (
        <Card className="glassmorphism border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${currentAlgorithm.color}`}>
                <Activity className="h-4 w-4 text-white" />
              </div>
              <motion.p
                key={currentDescription}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium"
              >
                {currentDescription}
              </motion.p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Grid Visualization */}
      <Card className="glassmorphism border-0">
        <CardHeader>
          <CardTitle>Grid Visualization</CardTitle>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 border border-green-500 rounded shadow-sm"></div>
              <span>Start Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-red-400 to-red-600 border border-red-500 rounded shadow-sm"></div>
              <span>End Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-800 rounded"></div>
              <span>Wall</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-300 to-blue-500 border border-blue-400 rounded"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-4 h-4 bg-gradient-to-br ${currentAlgorithm.color} border border-yellow-400 rounded shadow-sm`}
              ></div>
              <span>Path</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto relative">
            <div
              className="inline-grid gap-0.5 border-2 border-slate-300 bg-slate-200 rounded-lg p-2"
              style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}
              onMouseLeave={handleMouseUp}
            >
              <AnimatePresence>
                {grid.map(
                  (row, rowIndex) =>
                    Array.isArray(row) &&
                    row.map((cell, colIndex) => (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        layout
                        className={`
                          relative w-4 h-4 border border-slate-300 cursor-pointer transition-all duration-200
                          ${getCellClass(rowIndex, colIndex)}
                        `}
                        onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        onMouseUp={handleMouseUp}
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        whileTap={{ scale: 0.9 }}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2, delay: (rowIndex + colIndex) * 0.001 }}
                      >
                        {/* Ripple effect for visited nodes */}
                        {cell && cell.isVisited && !cell.isPath && (
                          <motion.div
                            className="absolute inset-0 bg-blue-400/50 rounded-full"
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 3, opacity: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        )}

                        {/* Glow effect for path nodes */}
                        {cell && cell.isPath && (
                          <motion.div
                            className={`absolute inset-0 bg-gradient-to-br ${currentAlgorithm.color} rounded-sm opacity-30`}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 0.3 }}
                            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
                          />
                        )}
                      </motion.div>
                    )),
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Metrics Display */}
      <Card className="glassmorphism border-0">
        <CardHeader>
          <CardTitle>Real-time Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              className="text-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              key={`nodes-${realTimeMetrics.nodesVisited}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
              <motion.div
                className="text-3xl font-bold text-blue-500"
                key={realTimeMetrics.nodesVisited}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {realTimeMetrics.nodesVisited}
              </motion.div>
              <div className="text-sm text-muted-foreground">Nodes Visited</div>
            </motion.div>

            <motion.div
              className="text-center p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              key={`path-${realTimeMetrics.pathLength}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Target className="h-6 w-6 text-yellow-500" />
              </div>
              <motion.div
                className="text-3xl font-bold text-yellow-500"
                key={realTimeMetrics.pathLength}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {realTimeMetrics.pathLength}
              </motion.div>
              <div className="text-sm text-muted-foreground">Path Length</div>
            </motion.div>

            <motion.div
              className="text-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              key={`time-${realTimeMetrics.executionTime}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
              <motion.div
                className="text-3xl font-bold text-purple-500"
                key={realTimeMetrics.executionTime}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {realTimeMetrics.executionTime}ms
              </motion.div>
              <div className="text-sm text-muted-foreground">Execution Time</div>
            </motion.div>

            <motion.div
              className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              key={`found-${realTimeMetrics.pathFound}`}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-green-500" />
              </div>
              <motion.div
                className="text-3xl font-bold text-green-500"
                key={realTimeMetrics.pathFound.toString()}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {realTimeMetrics.pathFound ? "Yes" : "No"}
              </motion.div>
              <div className="text-sm text-muted-foreground">Path Found</div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
