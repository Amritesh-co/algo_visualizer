"use client"

import type React from "react"

import { useCallback, useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Shuffle, Network, Info, Minus, Plus } from "lucide-react"
import { useGraphStore } from "@/store/use-graph-store"
import { FloydWarshallAlgorithm } from "@/lib/algorithms/graph"

const INFINITY = 999

interface NetworkGraphProps {
  matrix: number[][]
  matrixSize: number
  highlights: any // Consider defining a more specific type for highlights
}

const NetworkGraph: React.FC<NetworkGraphProps> = ({ matrix, matrixSize, highlights }) => {
  const nodePositions = useRef<{ x: number; y: number }[]>([])

  useEffect(() => {
    if (matrixSize > 0) {
      nodePositions.current = Array.from({ length: matrixSize }, (_, i) => {
        const angle = (i / matrixSize) * 2 * Math.PI
        const radius = 150
        const centerX = 200 // Center of the 400x400 box
        const centerY = 200
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        return { x, y }
      })
    } else {
      nodePositions.current = []
    }
  }, [matrixSize])

  const getNodeLabel = (index: number) => {
    return String.fromCharCode(65 + index)
  }

  // Handle cases where the graph cannot or should not be rendered
  if (matrixSize === 0) {
    return <div className="relative w-[400px] h-[400px]" aria-label="Empty graph: 0 nodes" />
  }

  if (nodePositions.current.length !== matrixSize) {
    // Node positions are not yet calculated for the current matrixSize,
    // this can happen on initial render or after matrixSize changes, before useEffect runs.
    return (
      <div className="relative w-[400px] h-[400px] flex items-center justify-center">
        <p className="text-slate-400">Initializing graph...</p>
      </div>
    )
  }

  return (
    <div className="relative w-[400px] h-[400px]">
      {/* Edges */}
      {Array.from({ length: matrixSize }).map((_, i) =>
        Array.from({ length: matrixSize }).map((_, j) => {
          if (i === j) return null // No self-loops for visualization

          // Critical check: Ensure matrix[i] and matrix[i][j] are accessible
          if (!matrix || !matrix[i] || typeof matrix[i][j] === "undefined") {
            // console.warn(`Matrix data inconsistent or missing at [${i}][${j}] for matrixSize ${matrixSize}`)
            return null
          }

          if (matrix[i][j] === INFINITY) {
            return null
          }

          // Node positions should be valid here due to the guard above
          const start = nodePositions.current[i]
          const end = nodePositions.current[j]

          // Additional safety for node positions, though the main guard should cover this
          if (!start || !end) {
            // console.error(`Node position undefined for edge ${i}-${j} despite matrixSize checks.`)
            return null
          }

          const weight = matrix[i][j]
          let edgeColor = "rgba(255, 255, 255, 0.1)"
          let edgeWidth = 1
          let zIndex = 0

          if (highlights.current && highlights.current.i === i && highlights.current.j === j) {
            edgeColor = "rgba(239, 68, 68, 0.9)" // Brighter Red for current edge (from red-500)
            edgeWidth = 3
            zIndex = 10
          } else if (
            highlights.via &&
            (highlights.via.k === i || highlights.via.k === j) &&
            !(highlights.current && highlights.current.i === i && highlights.current.j === j)
          ) {
            // Avoid override if it's also the current edge
            edgeColor = "rgba(59, 130, 246, 0.7)" // Brighter Blue (from blue-500)
            edgeWidth = 2.5
            zIndex = 5
          } else if (highlights.updated && highlights.updated.some((pos: any) => pos.i === i && pos.j === j)) {
            edgeColor = "rgba(34, 197, 94, 0.8)" // Brighter Green (from green-500)
            edgeWidth = 2.5
            zIndex = 5
          }

          return (
            <motion.svg
              key={`edge-${i}-${j}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                overflow: "visible",
                zIndex: zIndex,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <motion.line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke={edgeColor}
                strokeWidth={edgeWidth}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              {/* Edge weight text */}
              <text
                x={(start.x + end.x) / 2}
                y={(start.y + end.y) / 2 - (weight < 0 ? 12 : 8)} // Adjust y for negative sign
                fill={edgeColor === "rgba(255, 255, 255, 0.1)" ? "rgba(200,200,200,0.7)" : edgeColor}
                fontSize="11"
                fontWeight="medium"
                textAnchor="middle"
                style={{ pointerEvents: "none", userSelect: "none" }}
              >
                {weight}
              </text>
            </motion.svg>
          )
        }),
      )}

      {/* Nodes */}
      {Array.from({ length: matrixSize }).map((_, i) => {
        const position = nodePositions.current[i]
        if (!position) {
          // Should be caught by main guard, but for safety
          // console.error(`Node position undefined for node ${i}`);
          return null
        }

        let nodeBgColor = "bg-slate-700 hover:bg-slate-600"
        let textColor = "text-slate-200"
        let currentScale = 1
        let currentZIndex = 20 // Nodes above default edges

        if (highlights.via && highlights.via.k === i) {
          nodeBgColor = "bg-blue-500 ring-2 ring-blue-400"
          textColor = "text-white"
          currentScale = 1.25
          currentZIndex = 30 // 'Via' node most prominent
        } else if (highlights.current && (highlights.current.i === i || highlights.current.j === i)) {
          nodeBgColor = "bg-red-500 ring-2 ring-red-400"
          textColor = "text-white"
          currentScale = 1.15
          currentZIndex = 25
        }

        return (
          <motion.div
            key={`node-${i}`}
            className={`absolute w-10 h-10 rounded-full flex items-center justify-center ${nodeBgColor} ${textColor} font-bold text-sm shadow-lg transition-colors duration-300`}
            style={{
              left: position.x - 20, // (width/2)
              top: position.y - 20, // (height/2)
              zIndex: currentZIndex,
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: currentScale, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: i * 0.05 }}
          >
            {getNodeLabel(i)}
          </motion.div>
        )
      })}
    </div>
  )
}

export function GraphVisualizer() {
  const {
    matrix,
    matrixSize,
    isPlaying,
    currentStep,
    steps,
    metrics,
    setMatrix,
    setMatrixSize,
    setIsPlaying,
    setCurrentStep,
    setSteps,
    setMetrics,
    initializeMatrix,
    resetVisualization,
  } = useGraphStore()

  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    initializeMatrix(matrixSize)
  }, [matrixSize, initializeMatrix])

  const handleMatrixSizeChange = (value: number[]) => {
    const newSize = value[0]
    setMatrixSize(newSize)
    initializeMatrix(newSize)
    resetVisualization()
  }

  const handleCellChange = (i: number, j: number, value: string) => {
    const newMatrix = [...matrix]

    // Handle empty, infinity cases
    if (value === "" || value.toLowerCase() === "inf" || value === "∞") {
      newMatrix[i][j] = INFINITY
    } else {
      // Parse the number - this now properly handles negative numbers
      const numValue = Number.parseFloat(value)
      if (!isNaN(numValue)) {
        // Allow ANY number - positive, negative, or zero
        newMatrix[i][j] = Math.round(numValue) // Round to integer for cleaner display
      }
    }

    setMatrix(newMatrix)
    resetVisualization()
  }

  const handleCellIncrement = (i: number, j: number, increment: number) => {
    const newMatrix = [...matrix]
    const currentValue = newMatrix[i][j]

    if (currentValue === INFINITY) {
      newMatrix[i][j] = increment
    } else {
      newMatrix[i][j] = currentValue + increment
    }

    setMatrix(newMatrix)
    resetVisualization()
  }

  const generateRandomMatrix = () => {
    const newMatrix = Array(matrixSize)
      .fill(null)
      .map(() => Array(matrixSize).fill(INFINITY))

    // Set diagonal to 0
    for (let i = 0; i < matrixSize; i++) {
      newMatrix[i][i] = 0
    }

    // Add random edges with varied weights (including negative weights)
    for (let i = 0; i < matrixSize; i++) {
      for (let j = 0; j < matrixSize; j++) {
        if (i !== j && Math.random() < 0.4) {
          // Generate weights from -20 to +50 for interesting examples
          newMatrix[i][j] = Math.floor(Math.random() * 71) - 20
        }
      }
    }

    setMatrix(newMatrix)
    resetVisualization()
  }

  const generateNegativeCycleExample = () => {
    const newMatrix = Array(matrixSize)
      .fill(null)
      .map(() => Array(matrixSize).fill(INFINITY))

    // Set diagonal to 0
    for (let i = 0; i < matrixSize; i++) {
      newMatrix[i][i] = 0
    }

    // Create a negative cycle example for demonstration
    if (matrixSize >= 3) {
      newMatrix[0][1] = 5
      newMatrix[1][2] = -10
      newMatrix[2][0] = 3 // This creates a negative cycle: 5 + (-10) + 3 = -2
      if (matrixSize >= 4) {
        newMatrix[0][3] = 15
        newMatrix[3][1] = -5
      }
    }

    setMatrix(newMatrix)
    resetVisualization()
  }

  const generatePositiveExample = () => {
    const newMatrix = Array(matrixSize)
      .fill(null)
      .map(() => Array(matrixSize).fill(INFINITY))

    // Set diagonal to 0
    for (let i = 0; i < matrixSize; i++) {
      newMatrix[i][i] = 0
    }

    // Create a simple positive example
    if (matrixSize >= 4) {
      newMatrix[0][1] = 5
      newMatrix[0][3] = 10
      newMatrix[1][2] = 3
      newMatrix[2][3] = 1
      newMatrix[1][3] = 8
    }

    setMatrix(newMatrix)
    resetVisualization()
  }

  const clearMatrix = () => {
    const newMatrix = Array(matrixSize)
      .fill(null)
      .map(() => Array(matrixSize).fill(INFINITY))

    for (let i = 0; i < matrixSize; i++) {
      newMatrix[i][i] = 0
    }

    setMatrix(newMatrix)
    resetVisualization()
  }

  const runAlgorithm = useCallback(() => {
    const algorithm = new FloydWarshallAlgorithm()
    const result = algorithm.findShortestPaths(matrix)
    setSteps(result.steps)
    setMetrics(result.metrics)
    setCurrentStep(0)
  }, [matrix, setSteps, setMetrics, setCurrentStep])

  const handlePlay = () => {
    if (steps.length === 0) {
      runAlgorithm()
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    resetVisualization()
  }

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 2000 / speed)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, steps.length, speed, setCurrentStep, setIsPlaying])

  const getCurrentMatrix = () => {
    if (steps.length === 0 || currentStep === -1) return matrix
    return steps[currentStep].matrix
  }

  const getCurrentHighlights = () => {
    if (steps.length === 0 || currentStep === -1) return {}
    return steps[currentStep].highlights || {}
  }

  const currentMatrix = getCurrentMatrix()
  const highlights = getCurrentHighlights()

  const getCellClass = (i: number, j: number) => {
    const baseClass =
      "w-24 h-20 text-center border border-slate-600 text-sm transition-all duration-300 relative flex flex-col"

    if (i === j) {
      return `${baseClass} bg-slate-700 font-bold text-green-400`
    }

    if (highlights.current && highlights.current.i === i && highlights.current.j === j) {
      return `${baseClass} bg-red-500/30 border-red-400 text-white font-bold scale-105 z-10`
    }

    if (highlights.via && (highlights.via.k === i || highlights.via.k === j)) {
      return `${baseClass} bg-blue-500/30 border-blue-400 text-blue-200`
    }

    if (highlights.updated && highlights.updated.some((pos: any) => pos.i === i && pos.j === j)) {
      return `${baseClass} bg-green-500/30 border-green-400 text-green-200 font-bold`
    }

    // Color negative weights differently
    const cellValue = currentMatrix[i][j]
    if (cellValue < 0 && cellValue !== INFINITY) {
      return `${baseClass} bg-orange-900/30 hover:bg-orange-800/30 text-orange-200`
    }

    return `${baseClass} bg-slate-800 hover:bg-slate-700 text-slate-300`
  }

  const formatCellValue = (value: number) => {
    if (value === INFINITY) return "∞"
    return value.toString()
  }

  const getNodeLabel = (index: number) => {
    return String.fromCharCode(65 + index) // A, B, C, D, etc.
  }

  const getCurrentMetrics = () => {
    if (steps.length === 0 || currentStep === -1) return metrics

    const currentStepData = steps[currentStep]
    if (currentStepData && metrics) {
      const progress = (currentStep + 1) / steps.length
      return {
        ...metrics,
        iterations: Math.floor(metrics.iterations * progress),
        comparisons: Math.floor(metrics.comparisons * progress),
        timeComplexity: metrics.timeComplexity,
        spaceComplexity: metrics.spaceComplexity,
      }
    }
    return metrics
  }

  const currentMetrics = getCurrentMetrics()

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="glassmorphism tech-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 tech-border">
                <Network className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <span className="text-2xl text-slate-200">Floyd-Warshall Algorithm</span>
                <div className="text-sm text-blue-400 code-font mt-1">All-Pairs Shortest Path - O(n³)</div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label className="text-blue-400 font-semibold">
                  Matrix Size: {matrixSize}×{matrixSize}
                </Label>
                <Slider
                  value={[matrixSize]}
                  onValueChange={handleMatrixSizeChange}
                  min={2}
                  max={6}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-purple-400 font-semibold">Speed: {speed}x</Label>
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
                <Label className="text-green-400 font-semibold">Matrix Actions</Label>
                <div className="flex gap-2">
                  <Button onClick={generateRandomMatrix} variant="outline" size="sm" className="tech-button flex-1">
                    <Shuffle className="h-4 w-4 mr-1" />
                    Random
                  </Button>
                  <Button onClick={clearMatrix} variant="outline" size="sm" className="tech-button flex-1">
                    Clear
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-yellow-400 font-semibold">Playback</Label>
                <div className="flex gap-2">
                  <Button onClick={isPlaying ? handlePause : handlePlay} className="tech-button flex-1">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="tech-button">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Instructions */}
            <div className="glassmorphism rounded-xl p-6 tech-border">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-3">
                  <h3 className="text-blue-400 font-semibold">How to Input Numbers:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
                    <div>
                      <h4 className="text-green-400 font-medium mb-2">✅ Supported Inputs:</h4>
                      <ul className="space-y-1">
                        <li>
                          • <span className="text-green-400">Positive</span>: 5, 10, 25
                        </li>
                        <li>
                          • <span className="text-orange-400">Negative</span>: -5, -10, -20
                        </li>
                        <li>
                          • <span className="text-blue-400">Zero</span>: 0
                        </li>
                        <li>
                          • <span className="text-purple-400">Infinity</span>: inf, ∞, or empty
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-yellow-400 font-medium mb-2">💡 Tips:</h4>
                      <ul className="space-y-1">
                        <li>• Type directly in cells</li>
                        <li>• Use +/- buttons for quick changes</li>
                        <li>• Try example buttons below</li>
                        <li>• Diagonal is always 0</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Example buttons */}
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={generatePositiveExample} variant="outline" className="tech-button">
                <Plus className="h-4 w-4 mr-2" />
                Positive Example
              </Button>
              <Button onClick={generateNegativeCycleExample} variant="outline" className="tech-button">
                <Minus className="h-4 w-4 mr-2" />
                Negative Example
              </Button>
            </div>

            {/* Matrix Visualization */}
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Distance Matrix</h3>
                <p className="text-sm text-slate-400">
                  Nodes: {Array.from({ length: matrixSize }, (_, i) => getNodeLabel(i)).join(", ")}
                </p>
              </div>

              <div className="overflow-auto flex justify-center">
                <div className="inline-block">
                  {/* Column headers */}
                  <div className="flex mb-2">
                    <div className="w-24 h-8"></div>
                    {Array.from({ length: matrixSize }, (_, j) => (
                      <div key={j} className="w-24 h-8 flex items-center justify-center">
                        <span className="text-blue-400 font-bold code-font text-lg">{getNodeLabel(j)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Matrix with row headers */}
                  {currentMatrix.map((row, i) => (
                    <div key={i} className="flex">
                      {/* Row header */}
                      <div className="w-24 h-20 flex items-center justify-center">
                        <span className="text-blue-400 font-bold code-font text-lg">{getNodeLabel(i)}</span>
                      </div>

                      {/* Matrix cells */}
                      {row.map((cell, j) => (
                        <motion.div
                          key={`${i}-${j}`}
                          className={getCellClass(i, j)}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {i === j ? (
                            <div className="flex items-center justify-center h-full">
                              <span className="code-font font-bold text-lg">0</span>
                            </div>
                          ) : (
                            <div className="flex flex-col h-full">
                              {/* Input field */}
                              <Input
                                value={cell === INFINITY ? "" : cell.toString()}
                                onChange={(e) => handleCellChange(i, j, e.target.value)}
                                className="flex-1 text-center border-0 bg-transparent text-inherit code-font font-medium text-sm p-1"
                                placeholder="∞"
                                disabled={isPlaying}
                                type="text"
                              />

                              {/* Quick increment/decrement buttons */}
                              {!isPlaying && (
                                <div className="flex">
                                  <button
                                    onClick={() => handleCellIncrement(i, j, -1)}
                                    className="flex-1 text-xs py-0.5 hover:bg-red-500/20 transition-colors"
                                    disabled={isPlaying}
                                  >
                                    -
                                  </button>
                                  <button
                                    onClick={() => handleCellIncrement(i, j, 1)}
                                    className="flex-1 text-xs py-0.5 hover:bg-green-500/20 transition-colors"
                                    disabled={isPlaying}
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Highlight overlay */}
                          {highlights.current?.i === i && highlights.current?.j === j && (
                            <motion.div
                              className="absolute inset-0 bg-red-400/20 rounded"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 1, 0] }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                            />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Network Graph Visualization */}
            <div className="flex justify-center">
              <NetworkGraph matrix={currentMatrix} matrixSize={matrixSize} highlights={highlights} />
            </div>

            {/* Enhanced Legend */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-700 border border-slate-600 rounded"></div>
                <span className="text-slate-400">Diagonal (self)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-900/30 border border-orange-600 rounded"></div>
                <span className="text-slate-400">Negative weight</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500/30 border border-red-400 rounded"></div>
                <span className="text-slate-400">Current cell</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500/30 border border-blue-400 rounded"></div>
                <span className="text-slate-400">Via node</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/30 border border-green-400 rounded"></div>
                <span className="text-slate-400">Updated</span>
              </div>
            </div>

            {/* Progress */}
            {steps.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-400 font-semibold code-font">
                    Step {currentStep + 1} / {steps.length}
                  </span>
                  <span className="text-purple-400 font-semibold code-font">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 progress-glow"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            {/* Current Step Description */}
            {steps.length > 0 && currentStep >= 0 && steps[currentStep] && (
              <motion.div
                className="code-block rounded-xl p-6 data-visualization"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-slate-300 code-font text-lg">{steps[currentStep].description}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Metrics */}
      {currentMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glassmorphism tech-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Network className="h-6 w-6 text-blue-400" />
                <span className="text-slate-200">Algorithm Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: "Iterations", value: currentMetrics.iterations, color: "text-blue-400" },
                  { label: "Comparisons", value: currentMetrics.comparisons, color: "text-purple-400" },
                  { label: "Time Complexity", value: "O(n³)", color: "text-green-400" },
                ].map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="text-center metric-card rounded-lg p-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className={`text-2xl font-bold ${metric.color} code-font mb-2`}
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
