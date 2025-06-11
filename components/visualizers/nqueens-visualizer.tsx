"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  RotateCcw,
  Crown,
  SkipForward,
  SkipBack,
  Shuffle,
  Target,
  Brain,
  MousePointer,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Zap,
  Eye,
  AlertTriangle,
} from "lucide-react"
import { useNQueensStore } from "@/store/use-nqueens-store"
import { NQueensAlgorithm } from "@/lib/algorithms/nqueens"

const algorithms = [
  {
    value: "backtracking",
    label: "Backtracking",
    icon: Target,
    description: "Classic recursive backtracking",
    color: "from-blue-500 to-cyan-500",
  },
  {
    value: "genetic",
    label: "Genetic Algorithm",
    icon: Brain,
    description: "Evolutionary optimization",
    color: "from-purple-500 to-pink-500",
  },
]

export function NQueensVisualizer() {
  const {
    boardSize,
    algorithm,
    isPlaying,
    currentStep,
    steps,
    metrics,
    solutions,
    currentSolution,
    userBoard,
    isInteractive,
    setBoardSize,
    setAlgorithm,
    setIsPlaying,
    setCurrentStep,
    setSteps,
    setMetrics,
    setSolutions,
    setCurrentSolution,
    setUserBoard,
    setIsInteractive,
    initializeBoard,
    resetVisualization,
  } = useNQueensStore()

  const [speed, setSpeed] = useState(1)
  const [showHints, setShowHints] = useState(true)
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null)

  // Ensure we have valid data before rendering
  const safeUserBoard = userBoard || Array(boardSize).fill(-1)
  const safeSteps = steps || []
  const safeMetrics = metrics || {
    solutions: 0,
    backtracks: 0,
    iterations: 0,
    timeComplexity: "O(N!)",
    spaceComplexity: "O(N)",
  }
  const safeSolutions = solutions || []

  useEffect(() => {
    initializeBoard(boardSize)
  }, [boardSize, initializeBoard])

  const handleBoardSizeChange = (value: number[]) => {
    const newSize = value[0]
    setBoardSize(newSize)
    initializeBoard(newSize)
    resetVisualization()
  }

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value)
    resetVisualization()
  }

  const handleInteractiveModeToggle = () => {
    setIsInteractive(!isInteractive)
    resetVisualization()
    initializeBoard(boardSize)
  }

  const runAlgorithm = useCallback(() => {
    const nQueensAlgorithm = new NQueensAlgorithm(algorithm)
    const result = nQueensAlgorithm.solve(boardSize, false)
    setSteps(result.steps)
    setMetrics(result.metrics)
    setSolutions(result.solutions)
    setCurrentStep(0)
    setCurrentSolution(0)
  }, [algorithm, boardSize, setSteps, setMetrics, setSolutions, setCurrentStep, setCurrentSolution])

  const handlePlay = () => {
    if (safeSteps.length === 0) {
      runAlgorithm()
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    resetVisualization()
    initializeBoard(boardSize)
  }

  const handleStepForward = () => {
    if (currentStep < safeSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (!isInteractive || isPlaying) return

    const newBoard = [...safeUserBoard]
    if (newBoard[row] === col) {
      newBoard[row] = -1 // Remove queen
    } else {
      newBoard[row] = col // Place queen
    }
    setUserBoard(newBoard)
  }

  const generateRandomBoard = () => {
    const newBoard = Array.from({ length: boardSize }, () =>
      Math.random() < 0.3 ? Math.floor(Math.random() * boardSize) : -1,
    )
    setUserBoard(newBoard)
  }

  const clearBoard = () => {
    setUserBoard(Array(boardSize).fill(-1))
  }

  const nextSolution = () => {
    if (safeSolutions.length > 0) {
      setCurrentSolution((currentSolution + 1) % safeSolutions.length)
    }
  }

  const prevSolution = () => {
    if (safeSolutions.length > 0) {
      setCurrentSolution((currentSolution - 1 + safeSolutions.length) % safeSolutions.length)
    }
  }

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && currentStep < safeSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 1500 / speed)
      return () => clearTimeout(timer)
    } else if (currentStep >= safeSteps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, safeSteps.length, speed, setCurrentStep, setIsPlaying])

  const getCurrentBoard = () => {
    if (isInteractive) return safeUserBoard
    if (safeSteps.length === 0 || currentStep === -1) return Array(boardSize).fill(-1)
    return safeSteps[currentStep]?.board || Array(boardSize).fill(-1)
  }

  const getCurrentHighlights = () => {
    if (safeSteps.length === 0 || currentStep === -1) return {}
    return safeSteps[currentStep]?.highlights || {}
  }

  const currentBoard = getCurrentBoard()
  const highlights = getCurrentHighlights()

  const isQueenSafe = (row: number, col: number, board: number[]) => {
    if (!board) return true

    for (let i = 0; i < board.length; i++) {
      if (i !== row && board[i] !== -1) {
        if (
          board[i] === col || // Same column
          board[i] - i === col - row || // Same diagonal
          board[i] + i === col + row
        ) {
          // Same anti-diagonal
          return false
        }
      }
    }
    return true
  }

  const getAttackingQueens = (row: number, col: number, board: number[]) => {
    if (!board) return []

    const attackers = []
    for (let i = 0; i < board.length; i++) {
      if (i !== row && board[i] !== -1) {
        if (
          board[i] === col || // Same column
          board[i] - i === col - row || // Same diagonal
          board[i] + i === col + row
        ) {
          attackers.push({ row: i, col: board[i] })
        }
      }
    }
    return attackers
  }

  const getCellClass = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0
    const hasQueen = currentBoard && currentBoard[row] === col
    const isSafe = hasQueen ? isQueenSafe(row, col, currentBoard) : true

    let baseClass = `
      relative cursor-pointer transition-all duration-500 flex items-center justify-center overflow-hidden
      ${isLight ? "bg-gradient-to-br from-amber-50 to-amber-100" : "bg-gradient-to-br from-amber-700 to-amber-800"}
      ${isInteractive ? "hover:scale-105 hover:shadow-lg" : ""}
      border-2 border-amber-300/30
    `

    // Interactive hover effects
    if (isInteractive && hoveredCell?.row === row && hoveredCell?.col === col) {
      baseClass += " ring-4 ring-blue-400/50 scale-105 z-30"
    }

    // Highlight effects from algorithm
    if (highlights.placing && highlights.placing.row === row && highlights.placing.col === col) {
      return `${baseClass} ring-4 ring-blue-400 bg-gradient-to-br from-blue-200 to-blue-300 scale-110 z-20 shadow-xl`
    }

    if (highlights.conflicts?.some((conflict: any) => conflict.row === row && conflict.col === col)) {
      return `${baseClass} ring-4 ring-red-400 bg-gradient-to-br from-red-200 to-red-300 scale-105 z-10 shadow-lg animate-pulse`
    }

    if (highlights.backtrack && highlights.backtrack.row === row && highlights.backtrack.col === col) {
      return `${baseClass} ring-4 ring-orange-400 bg-gradient-to-br from-orange-200 to-orange-300 scale-105 z-10 shadow-lg`
    }

    if (highlights.currentRow === row) {
      return `${baseClass} ring-2 ring-purple-300 bg-gradient-to-br from-purple-100 to-purple-200`
    }

    if (highlights.solution) {
      return `${baseClass} ring-2 ring-green-400 bg-gradient-to-br from-green-100 to-green-200 shadow-lg`
    }

    // Interactive mode conflict highlighting
    if (isInteractive && hasQueen && !isSafe) {
      return `${baseClass} ring-4 ring-red-500 bg-gradient-to-br from-red-200 to-red-300 animate-pulse`
    }

    return baseClass
  }

  const getQueenClass = (row: number, col: number) => {
    const hasQueen = currentBoard && currentBoard[row] === col
    if (!hasQueen) return ""

    const isSafe = isQueenSafe(row, col, currentBoard)
    const baseClass = "text-5xl transition-all duration-700 filter drop-shadow-lg"

    if (highlights.placing && highlights.placing.row === row && highlights.placing.col === col) {
      return `${baseClass} text-blue-600 scale-125 animate-bounce`
    }

    if (highlights.conflicts?.some((conflict: any) => conflict.row === row && conflict.col === col)) {
      return `${baseClass} text-red-600 scale-110 animate-pulse`
    }

    if (highlights.backtrack && highlights.backtrack.row === row && highlights.backtrack.col === col) {
      return `${baseClass} text-orange-600 scale-90 opacity-50 animate-ping`
    }

    if (!isSafe && isInteractive) {
      return `${baseClass} text-red-500 scale-110 animate-pulse`
    }

    if (highlights.solution) {
      return `${baseClass} text-green-600 scale-110 animate-pulse filter drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]`
    }

    return `${baseClass} text-purple-600 hover:scale-110 filter drop-shadow-[0_0_8px_rgba(147,51,234,0.3)]`
  }

  const selectedAlgorithm = algorithms.find((algo) => algo.value === algorithm)

  const getCurrentMetrics = () => {
    if (safeSteps.length === 0 || currentStep === -1) return safeMetrics

    const currentStepData = safeSteps[currentStep]
    if (currentStepData && safeMetrics) {
      const progress = (currentStep + 1) / safeSteps.length
      return {
        ...safeMetrics,
        solutions: safeMetrics.solutions,
        backtracks: Math.floor(safeMetrics.backtracks * progress),
        iterations: Math.floor(safeMetrics.iterations * progress),
        timeComplexity: safeMetrics.timeComplexity,
        spaceComplexity: safeMetrics.spaceComplexity,
      }
    }
    return safeMetrics
  }

  const currentMetrics = getCurrentMetrics()
  const conflictCount =
    isInteractive && currentBoard
      ? currentBoard.filter((col: number, row: number) => col !== -1 && !isQueenSafe(row, col, currentBoard)).length
      : 0
  const queenCount = currentBoard ? currentBoard.filter((col: number) => col !== -1).length : 0

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="glassmorphism tech-border overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <CardTitle className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg bg-gradient-to-br ${selectedAlgorithm?.color || "from-purple-500/20 to-pink-500/20"} tech-border`}
              >
                <Crown className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <span className="text-2xl text-slate-200 flex items-center gap-3">
                  N-Queens Problem Visualizer
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Interactive
                  </Badge>
                </span>
                {selectedAlgorithm && (
                  <div className="text-sm text-purple-400 code-font mt-1 flex items-center gap-2">
                    <selectedAlgorithm.icon className="h-4 w-4" />
                    {selectedAlgorithm.description}
                  </div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            {/* Enhanced Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label className="text-purple-400 font-semibold flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Board Size: {boardSize}×{boardSize}
                </Label>
                <Slider
                  value={[boardSize]}
                  onValueChange={handleBoardSizeChange}
                  min={4}
                  max={12}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-blue-400 font-semibold flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Algorithm
                </Label>
                <Select value={algorithm} onValueChange={handleAlgorithmChange}>
                  <SelectTrigger className="tech-button">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glassmorphism tech-border">
                    {algorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value} className="hover:bg-purple-400/10">
                        <div className="flex items-center gap-2">
                          <algo.icon className="h-4 w-4" />
                          <div className="flex flex-col">
                            <span className="font-medium">{algo.label}</span>
                            <span className="text-xs text-slate-400">{algo.description}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-green-400 font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Speed: {speed}x
                </Label>
                <Slider
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  min={0.5}
                  max={3}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-yellow-400 font-semibold flex items-center gap-2">
                  <MousePointer className="h-4 w-4" />
                  Mode
                </Label>
                <Button
                  onClick={handleInteractiveModeToggle}
                  variant={isInteractive ? "default" : "outline"}
                  className="w-full tech-button"
                  disabled={isPlaying}
                >
                  <MousePointer className="h-4 w-4 mr-2" />
                  {isInteractive ? "Interactive" : "Algorithm"}
                </Button>
              </div>
            </div>

            {/* Interactive Status Bar */}
            {isInteractive && (
              <div className="glassmorphism rounded-xl p-6 tech-border bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <MousePointer className="h-5 w-5 text-blue-400" />
                    <h3 className="text-blue-400 font-semibold">Interactive Mode</h3>
                    <Button onClick={() => setShowHints(!showHints)} variant="ghost" size="sm" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      {showHints ? "Hide" : "Show"} Hints
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant={queenCount === boardSize ? "default" : "secondary"}>
                      <Crown className="h-3 w-3 mr-1" />
                      {queenCount}/{boardSize} Queens
                    </Badge>
                    {conflictCount > 0 && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {conflictCount} Conflicts
                      </Badge>
                    )}
                    {conflictCount === 0 && queenCount === boardSize && (
                      <Badge className="bg-green-500">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Solution Found!
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button onClick={generateRandomBoard} variant="outline" className="tech-button">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Random Setup
                  </Button>
                  <Button onClick={clearBoard} variant="outline" className="tech-button">
                    Clear Board
                  </Button>
                  <div className="text-sm text-slate-400 flex items-center">💡 Click cells to place/remove queens</div>
                </div>
              </div>
            )}

            {/* Playback Controls */}
            {!isInteractive && (
              <div className="flex justify-center gap-3">
                {[
                  { icon: SkipBack, onClick: handleStepBackward, disabled: currentStep <= 0, label: "Previous Step" },
                  {
                    icon: isPlaying ? Pause : Play,
                    onClick: isPlaying ? handlePause : handlePlay,
                    disabled: false,
                    label: isPlaying ? "Pause" : "Play",
                  },
                  {
                    icon: SkipForward,
                    onClick: handleStepForward,
                    disabled: currentStep >= safeSteps.length - 1,
                    label: "Next Step",
                  },
                  { icon: RotateCcw, onClick: handleReset, disabled: false, label: "Reset" },
                ].map((btn, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={btn.onClick}
                      disabled={btn.disabled}
                      className="tech-button"
                      size="lg"
                      title={btn.label}
                    >
                      <btn.icon className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Enhanced Chess Board */}
            <div className="flex justify-center">
              <div className="inline-block p-6 glassmorphism rounded-xl tech-border bg-gradient-to-br from-amber-900/20 to-amber-800/20">
                <div
                  className="grid gap-1 p-6 bg-gradient-to-br from-amber-900 to-amber-800 rounded-lg shadow-2xl border-4 border-amber-600/30"
                  style={{
                    gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
                    aspectRatio: "1",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {Array.from({ length: boardSize * boardSize }, (_, index) => {
                      const row = Math.floor(index / boardSize)
                      const col = index % boardSize
                      const hasQueen = currentBoard && currentBoard[row] === col
                      const attackers = hasQueen && isInteractive ? getAttackingQueens(row, col, currentBoard) : []

                      return (
                        <motion.div
                          key={`${row}-${col}`}
                          className={getCellClass(row, col)}
                          style={{
                            width: `${Math.max(50, 400 / boardSize)}px`,
                            height: `${Math.max(50, 400 / boardSize)}px`,
                          }}
                          onClick={() => handleCellClick(row, col)}
                          onMouseEnter={() => setHoveredCell({ row, col })}
                          onMouseLeave={() => setHoveredCell(null)}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.4, delay: (row + col) * 0.02 }}
                          whileHover={isInteractive ? { scale: 1.05, zIndex: 20 } : {}}
                          whileTap={isInteractive ? { scale: 0.95 } : {}}
                        >
                          {/* Enhanced Row and column labels */}
                          {col === 0 && (
                            <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-sm font-bold text-amber-300 bg-slate-800/80 rounded px-2 py-1">
                              {row + 1}
                            </div>
                          )}
                          {row === 0 && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-bold text-amber-300 bg-slate-800/80 rounded px-2 py-1">
                              {String.fromCharCode(65 + col)}
                            </div>
                          )}

                          {/* Queen with enhanced animations */}
                          <AnimatePresence>
                            {hasQueen && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180, y: -20 }}
                                animate={{ scale: 1, rotate: 0, y: 0 }}
                                exit={{ scale: 0, rotate: 180, opacity: 0, y: 20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={getQueenClass(row, col)}
                              >
                                👑
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Interactive hints */}
                          {isInteractive &&
                            showHints &&
                            hoveredCell?.row === row &&
                            hoveredCell?.col === col &&
                            !hasQueen && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 0.7, scale: 1 }}
                                className="absolute inset-0 bg-blue-400/20 rounded flex items-center justify-center"
                              >
                                <Crown className="h-6 w-6 text-blue-400" />
                              </motion.div>
                            )}

                          {/* Attack visualization for interactive mode */}
                          {isInteractive && hasQueen && attackers.length > 0 && (
                            <div className="absolute inset-0 pointer-events-none">
                              <div className="absolute inset-0 bg-red-500/30 animate-pulse rounded" />
                              {attackers.map((attacker, idx) => (
                                <motion.div
                                  key={idx}
                                  className="absolute inset-0"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: idx * 0.1 }}
                                >
                                  <svg className="absolute inset-0 w-full h-full">
                                    <motion.line
                                      x1="50%"
                                      y1="50%"
                                      x2={`${(attacker.col - col) * 100 + 50}%`}
                                      y2={`${(attacker.row - row) * 100 + 50}%`}
                                      stroke="#ef4444"
                                      strokeWidth="2"
                                      strokeDasharray="4,4"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    />
                                  </svg>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Solutions Navigation */}
            {safeSolutions.length > 0 && (
              <div className="glassmorphism rounded-xl p-6 tech-border bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-green-400 font-semibold flex items-center gap-2">
                    <Crown className="h-5 w-5" />
                    Solutions Found: {safeSolutions.length}
                    <Badge className="bg-green-500">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Success!
                    </Badge>
                  </h3>
                  {safeSolutions.length > 1 && (
                    <div className="flex items-center gap-3">
                      <Button onClick={prevSolution} variant="outline" size="sm" className="tech-button">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-slate-400 code-font bg-slate-800/50 px-3 py-1 rounded">
                        {currentSolution + 1} / {safeSolutions.length}
                      </span>
                      <Button onClick={nextSolution} variant="outline" size="sm" className="tech-button">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Progress */}
            {safeSteps.length > 0 && !isInteractive && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-400 font-semibold code-font flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Step {currentStep + 1} / {safeSteps.length}
                  </span>
                  <span className="text-pink-400 font-semibold code-font">
                    {Math.round(((currentStep + 1) / safeSteps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-purple-500/30">
                  <motion.div
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 progress-glow"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / safeSteps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Enhanced Current Step Description */}
            {safeSteps.length > 0 && currentStep >= 0 && safeSteps[currentStep] && !isInteractive && (
              <motion.div
                className="code-block rounded-xl p-6 data-visualization border-l-4 border-purple-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <p className="text-slate-300 code-font text-lg leading-relaxed">
                    {safeSteps[currentStep]?.description || "Processing step..."}
                  </p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Metrics */}
      {currentMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glassmorphism tech-border">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <CardTitle className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-purple-400" />
                <span className="text-slate-200">Algorithm Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Solutions", value: currentMetrics.solutions, color: "text-green-400", icon: Crown },
                  { label: "Backtracks", value: currentMetrics.backtracks, color: "text-orange-400", icon: RotateCcw },
                  { label: "Iterations", value: currentMetrics.iterations, color: "text-blue-400", icon: Zap },
                  {
                    label: "Time Complexity",
                    value: currentMetrics.timeComplexity,
                    color: "text-purple-400",
                    icon: Target,
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="text-center metric-card rounded-lg p-6 border border-slate-700/50"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                    <motion.div
                      className={`text-3xl font-bold ${metric.color} code-font mb-2`}
                      key={metric.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {metric.value}
                    </motion.div>
                    <div className="text-sm text-slate-500 font-medium">{metric.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
