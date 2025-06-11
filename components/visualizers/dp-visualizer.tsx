"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Calculator, Lightbulb, Search, CheckCircle, Plus, Minus } from "lucide-react"
import { useDPStore } from "@/store/use-dp-store"
import { DynamicProgrammingAlgorithm } from "@/lib/algorithms/dp"
import { Slider } from "@/components/ui/slider"

const algorithms = [
  { value: "subset-sum", label: "Sum of Subset", description: "Find if subset with given sum exists" },
  { value: "knapsack", label: "0/1 Knapsack", description: "Maximize value within weight capacity" },
  { value: "uniqueness", label: "Uniqueness Detection", description: "Check if all elements are unique" },
]

export function DPVisualizer() {
  const {
    algorithm,
    isPlaying,
    currentStep,
    steps,
    metrics,
    dpTable,
    setAlgorithm,
    setIsPlaying,
    setCurrentStep,
    setSteps,
    setMetrics,
    setDPTable,
    resetVisualization,
  } = useDPStore()

  const [inputSet, setInputSet] = useState("3,34,4,12,5,2")
  const [targetSum, setTargetSum] = useState("9")
  const [weights, setWeights] = useState("10,20,30")
  const [values, setValues] = useState("60,100,120")
  const [capacity, setCapacity] = useState("50")
  const [speed, setSpeed] = useState(1)

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value)
    resetVisualization()
  }

  const parseInput = (input: string) => {
    return input
      .split(",")
      .map((n) => Number.parseInt(n.trim()))
      .filter((n) => !isNaN(n))
  }

  const runAlgorithm = useCallback(() => {
    const dpAlgorithm = new DynamicProgrammingAlgorithm(algorithm)
    let result

    switch (algorithm) {
      case "subset-sum":
        const set = parseInput(inputSet)
        const target = Number.parseInt(targetSum)
        if (set.length > 0 && !isNaN(target) && target >= 0) {
          result = dpAlgorithm.subsetSum(set, target)
        }
        break
      case "knapsack":
        const w = parseInput(weights)
        const v = parseInput(values)
        const cap = Number.parseInt(capacity)
        if (w.length > 0 && v.length > 0 && w.length === v.length && !isNaN(cap) && cap > 0) {
          result = dpAlgorithm.knapsack(w, v, cap)
        }
        break
      case "uniqueness":
        const arr = parseInput(inputSet)
        if (arr.length > 0) {
          result = dpAlgorithm.uniquenessDetection(arr)
        }
        break
    }

    if (result) {
      setSteps(result.steps)
      setMetrics(result.metrics)
      setDPTable(result.table || [])
      setCurrentStep(0)
    }
  }, [algorithm, inputSet, targetSum, weights, values, capacity, setSteps, setMetrics, setDPTable, setCurrentStep])

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

  const getCurrentData = () => {
    if (steps.length === 0 || currentStep === -1) {
      return { table: dpTable, array: null }
    }
    const step = steps[currentStep]
    return { table: step.table || dpTable, array: step.array || null }
  }

  const getCurrentHighlights = () => {
    if (steps.length === 0 || currentStep === -1) return {}
    return steps[currentStep].highlights || {}
  }

  const { table: currentTable, array: currentArray } = getCurrentData()
  const highlights = getCurrentHighlights()

  const getCellClass = (i: number, j: number) => {
    const baseClass =
      "w-16 h-12 flex items-center justify-center text-sm border border-slate-600 transition-all duration-300 relative code-font font-bold"

    if (highlights.current && highlights.current.i === i && highlights.current.j === j) {
      return `${baseClass} bg-red-500/40 border-red-400 text-white scale-105 z-10`
    }

    if (highlights.comparing && highlights.comparing.some((pos: any) => pos.i === i && pos.j === j)) {
      return `${baseClass} bg-blue-500/40 border-blue-400 text-blue-200`
    }

    if (highlights.solution && highlights.solution.some((pos: any) => pos.i === i && pos.j === j)) {
      return `${baseClass} bg-green-500/40 border-green-400 text-green-200`
    }

    return `${baseClass} bg-slate-800 text-slate-300`
  }

  const getArrayCellClass = (index: number) => {
    const baseClass =
      "w-16 h-16 flex items-center justify-center text-lg border border-slate-600 transition-all duration-500 relative code-font font-bold rounded-lg"

    if (highlights.arrayHighlight?.includes(index)) {
      if (highlights.duplicateFound) {
        return `${baseClass} bg-red-500/40 border-red-400 text-white scale-110 z-10`
      }
      return `${baseClass} bg-blue-500/40 border-blue-400 text-blue-200 scale-105`
    }

    return `${baseClass} bg-slate-800 text-slate-300 hover:bg-slate-700`
  }

  const formatCellValue = (cell: any) => {
    if (typeof cell === "boolean") {
      return cell ? "T" : "F"
    }
    return cell.toString()
  }

  const getExampleInputs = () => {
    switch (algorithm) {
      case "subset-sum":
        return {
          set: "3,34,4,12,5,2",
          target: "9",
          explanation: "Can we find a subset that sums to 9? (3+4+2=9 ✓)",
        }
      case "knapsack":
        return {
          weights: "10,20,30",
          values: "60,100,120",
          capacity: "50",
          explanation: "Items: [w:10,v:60], [w:20,v:100], [w:30,v:120]. Capacity: 50",
        }
      case "uniqueness":
        return {
          array: "1,2,3,2,1",
          explanation: "Are all elements unique? (No, 1 and 2 appear twice)",
        }
    }
  }

  const examples = getExampleInputs()

  const renderInputs = () => {
    switch (algorithm) {
      case "subset-sum":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-blue-400 font-semibold">Input Set (comma-separated)</Label>
              <Input
                value={inputSet}
                onChange={(e) => setInputSet(e.target.value)}
                placeholder="3,34,4,12,5,2"
                className="tech-button code-font"
              />
              <Button
                onClick={() => setInputSet(examples?.set || "")}
                variant="outline"
                size="sm"
                className="tech-button text-xs"
              >
                Use Example
              </Button>
            </div>
            <div className="space-y-3">
              <Label className="text-purple-400 font-semibold">Target Sum</Label>
              <Input
                value={targetSum}
                onChange={(e) => setTargetSum(e.target.value)}
                placeholder="9"
                type="number"
                min="0"
                className="tech-button code-font"
              />
            </div>
          </div>
        )
      case "knapsack":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <Label className="text-blue-400 font-semibold">Weights (comma-separated)</Label>
              <Input
                value={weights}
                onChange={(e) => setWeights(e.target.value)}
                placeholder="10,20,30"
                className="tech-button code-font"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-purple-400 font-semibold">Values (comma-separated)</Label>
              <Input
                value={values}
                onChange={(e) => setValues(e.target.value)}
                placeholder="60,100,120"
                className="tech-button code-font"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-green-400 font-semibold">Capacity</Label>
              <Input
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="50"
                type="number"
                min="1"
                className="tech-button code-font"
              />
            </div>
          </div>
        )
      case "uniqueness":
        return (
          <div className="space-y-3">
            <Label className="text-blue-400 font-semibold">Input Array (comma-separated)</Label>
            <Input
              value={inputSet}
              onChange={(e) => setInputSet(e.target.value)}
              placeholder="1,2,3,2,1"
              className="tech-button code-font"
            />
            <Button
              onClick={() => setInputSet(examples?.array || "")}
              variant="outline"
              size="sm"
              className="tech-button text-xs"
            >
              Use Example
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const selectedAlgorithm = algorithms.find((algo) => algo.value === algorithm)

  const getCurrentMetrics = () => {
    if (steps.length === 0 || currentStep === -1) return metrics

    const currentStepData = steps[currentStep]
    if (currentStepData && metrics) {
      const progress = (currentStep + 1) / steps.length
      return {
        ...metrics,
        operations: Math.floor(metrics.operations * progress),
        tableSize: metrics.tableSize,
        timeComplexity: metrics.timeComplexity,
        spaceComplexity: metrics.spaceComplexity,
      }
    }
    return metrics
  }

  const currentMetrics = getCurrentMetrics()

  // Render subset visualization for Sum of Subset
  const renderSubsetVisualization = () => {
    if (algorithm !== "subset-sum" || !highlights.subsetVisualization) return null

    const viz = highlights.subsetVisualization
    const inputArray = parseInput(inputSet)

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-200 mb-2">🎯 Subset Sum Visualization</h3>
          <p className="text-sm text-slate-400">
            Target: <span className="text-yellow-400 font-bold">{viz.targetSum}</span> | Current Sum:{" "}
            <span className="text-blue-400 font-bold">{viz.currentSum}</span>
          </p>
        </div>

        {/* Input Array with Current Element Highlight */}
        <div className="glassmorphism rounded-xl p-6 tech-border">
          <h4 className="text-lg font-semibold text-blue-400 mb-4">📊 Input Array</h4>
          <div className="flex gap-3 justify-center flex-wrap">
            {inputArray.map((element, index) => (
              <motion.div
                key={index}
                className={`
                  w-16 h-16 flex items-center justify-center text-lg font-bold rounded-lg border-2 transition-all duration-500
                  ${
                    viz.currentElement === element && highlights.arrayHighlight?.includes(index)
                      ? "bg-yellow-500/30 border-yellow-400 text-yellow-200 scale-110 shadow-lg shadow-yellow-400/30"
                      : viz.includedElements.includes(element)
                        ? "bg-green-500/30 border-green-400 text-green-200"
                        : viz.excludedElements.includes(element)
                          ? "bg-red-500/30 border-red-400 text-red-200"
                          : "bg-slate-800 border-slate-600 text-slate-300"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {element}
                {viz.currentElement === element && highlights.arrayHighlight?.includes(index) && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    👆
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decision Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Include Decision */}
          <motion.div
            className={`glassmorphism rounded-xl p-6 tech-border transition-all duration-500 ${
              viz.decision === "include" ? "ring-2 ring-green-400 bg-green-500/10" : ""
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Plus className="h-5 w-5 text-green-400" />
              </div>
              <h4 className="text-lg font-semibold text-green-400">Include {viz.currentElement}</h4>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                If we include <span className="text-green-400 font-bold">{viz.currentElement}</span>:
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-300">New sum would be:</span>
                <span className="text-green-400 font-bold">{viz.currentSum}</span>
              </div>
              {viz.includedElements.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Subset so far:</span>
                  <span className="text-green-400 font-bold">[{viz.includedElements.join(", ")}]</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Exclude Decision */}
          <motion.div
            className={`glassmorphism rounded-xl p-6 tech-border transition-all duration-500 ${
              viz.decision === "exclude" ? "ring-2 ring-red-400 bg-red-500/10" : ""
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Minus className="h-5 w-5 text-red-400" />
              </div>
              <h4 className="text-lg font-semibold text-red-400">Exclude {viz.currentElement}</h4>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-400">
                If we exclude <span className="text-red-400 font-bold">{viz.currentElement}</span>:
              </p>
              <div className="flex items-center gap-2">
                <span className="text-slate-300">Sum remains:</span>
                <span className="text-red-400 font-bold">{viz.currentSum}</span>
              </div>
              {viz.excludedElements.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Excluded:</span>
                  <span className="text-red-400 font-bold">[{viz.excludedElements.join(", ")}]</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Reasoning */}
        <motion.div
          className="glassmorphism rounded-xl p-6 tech-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 mt-1">
              <Lightbulb className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-400 mb-2">💡 Algorithm Logic</h4>
              <p className="text-slate-300 leading-relaxed">{viz.reasoning}</p>
            </div>
          </div>
        </motion.div>

        {/* Final Solution */}
        {viz.possibleSubsets.length > 0 && (
          <motion.div
            className="glassmorphism rounded-xl p-6 tech-border bg-green-500/10 ring-2 ring-green-400"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-green-400">🎉 Solution Found!</h4>
            </div>
            <div className="space-y-3">
              {viz.possibleSubsets.map((subset, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-slate-300">Subset:</span>
                  <span className="text-green-400 font-bold text-lg">[{subset.join(", ")}]</span>
                  <span className="text-slate-300">=</span>
                  <span className="text-yellow-400 font-bold text-lg">{subset.reduce((a, b) => a + b, 0)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="glassmorphism tech-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 tech-border">
                {algorithm === "uniqueness" ? (
                  <Search className="h-6 w-6 text-blue-400" />
                ) : (
                  <Calculator className="h-6 w-6 text-blue-400" />
                )}
              </div>
              <div>
                <span className="text-2xl text-slate-200">Dynamic Programming Visualizer</span>
                {selectedAlgorithm && (
                  <div className="text-sm text-blue-400 code-font mt-1">{selectedAlgorithm.description}</div>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <Label className="text-blue-400 font-semibold">Algorithm</Label>
                <Select value={algorithm} onValueChange={handleAlgorithmChange}>
                  <SelectTrigger className="tech-button">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glassmorphism tech-border">
                    {algorithms.map((algo) => (
                      <SelectItem key={algo.value} value={algo.value} className="hover:bg-blue-400/10">
                        <div className="flex flex-col">
                          <span className="font-medium">{algo.label}</span>
                          <span className="text-xs text-slate-400">{algo.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Label className="text-green-400 font-semibold">Playback</Label>
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

            {/* Example explanation */}
            {examples && (
              <div className="glassmorphism rounded-xl p-6 tech-border">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-yellow-400 font-semibold mb-2">Example:</h3>
                    <p className="text-sm text-slate-400">{examples.explanation}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Algorithm-specific inputs */}
            {renderInputs()}

            {/* Visualization */}
            {algorithm === "subset-sum" ? (
              renderSubsetVisualization()
            ) : algorithm === "uniqueness" && currentArray ? (
              /* Array Visualization for Uniqueness Detection */
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">Array Uniqueness Detection</h3>
                  <p className="text-sm text-slate-400">Checking each element for duplicates</p>
                </div>

                <div className="overflow-auto flex justify-center">
                  <div className="inline-block">
                    {/* Array indices */}
                    <div className="flex gap-2 mb-2 justify-center">
                      {currentArray.map((_, index) => (
                        <div key={index} className="w-16 h-8 flex items-center justify-center">
                          <span className="text-blue-400 font-bold code-font text-sm">[{index}]</span>
                        </div>
                      ))}
                    </div>

                    {/* Array elements */}
                    <div className="flex gap-2 justify-center">
                      <AnimatePresence mode="wait">
                        {currentArray.map((element, index) => (
                          <motion.div
                            key={`${index}-${element}`}
                            className={getArrayCellClass(index)}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            {element}

                            {/* Duplicate indicator */}
                            {highlights.duplicateFound && highlights.duplicateFound.positions.includes(index) && (
                              <motion.div
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold"
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ duration: 0.5 }}
                              >
                                !
                              </motion.div>
                            )}

                            {/* Highlight overlay */}
                            {highlights.arrayHighlight?.includes(index) && (
                              <motion.div
                                className="absolute inset-0 bg-blue-400/20 rounded-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                              />
                            )}
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Duplicate connection lines */}
                    {highlights.duplicateFound && highlights.duplicateFound.positions.length > 1 && (
                      <div className="mt-4 relative h-8">
                        <svg className="absolute inset-0 w-full h-full">
                          {highlights.duplicateFound.positions.slice(1).map((pos, idx) => {
                            const firstPos = highlights.duplicateFound!.positions[0]
                            const x1 = firstPos * 72 + 32 // 72px = 64px width + 8px gap
                            const x2 = pos * 72 + 32
                            const yOffset = 20
                            const midX = (x1 + x2) / 2
                            return (
                              <motion.path
                                key={idx}
                                d={`M${x1},8 C${midX},${-yOffset},${midX},${-yOffset},${x2},8`}
                                stroke="#ef4444"
                                strokeWidth="3"
                                fill="transparent"
                                strokeDasharray="50"
                                strokeDashoffset="50"
                                initial={{ strokeDashoffset: 50 }}
                                animate={{ strokeDashoffset: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                              />
                            )
                          })}
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Legend for uniqueness */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500/40 border border-blue-400 rounded"></div>
                    <span className="text-slate-400">Current element</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500/40 border border-red-400 rounded"></div>
                    <span className="text-slate-400">Duplicate found</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500/40 border border-green-400 rounded"></div>
                    <span className="text-slate-400">All unique</span>
                  </div>
                </div>
              </div>
            ) : (
              /* DP Table Visualization for other algorithms */
              currentTable &&
              currentTable.length > 0 && (
                <div className="space-y-6 relative">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">Dynamic Programming Table</h3>
                    <p className="text-sm text-slate-400">
                      {algorithm === "subset-sum" && "Rows: elements, Columns: target sums"}
                      {algorithm === "knapsack" && "Rows: items, Columns: weight capacity"}
                    </p>
                  </div>

                  <div className="overflow-auto flex justify-center">
                    <div className="inline-block relative">
                      {/* Column headers */}
                      <div className="flex mb-2">
                        <div className="w-16 h-8"></div>
                        {currentTable[0] &&
                          currentTable[0].map((_, j) => (
                            <div key={j} className="w-16 h-8 flex items-center justify-center">
                              <span className="text-blue-400 font-bold code-font text-xs">{j}</span>
                            </div>
                          ))}
                      </div>

                      {/* Table with row headers */}
                      {currentTable.map((row, i) => (
                        <div key={i} className="flex">
                          {/* Row header */}
                          <div className="w-16 h-12 flex items-center justify-center">
                            <span className="text-blue-400 font-bold code-font text-xs">{i}</span>
                          </div>

                          {/* Table cells */}
                          {row.map((cell, j) => (
                            <motion.div
                              key={`${i}-${j}`}
                              className={getCellClass(i, j)}
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              {formatCellValue(cell)}

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

                  {/* Legend for DP table */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500/40 border border-red-400 rounded"></div>
                      <span className="text-slate-400">Current cell</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500/40 border border-blue-400 rounded"></div>
                      <span className="text-slate-400">Comparing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500/40 border border-green-400 rounded"></div>
                      <span className="text-slate-400">Solution</span>
                    </div>
                  </div>
                </div>
              )
            )}

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
                {algorithm === "uniqueness" ? (
                  <Search className="h-6 w-6 text-blue-400" />
                ) : (
                  <Calculator className="h-6 w-6 text-blue-400" />
                )}
                <span className="text-slate-200">Algorithm Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Operations", value: currentMetrics.operations, color: "text-blue-400" },
                  { label: "Data Size", value: currentMetrics.tableSize, color: "text-purple-400" },
                  { label: "Time Complexity", value: currentMetrics.timeComplexity, color: "text-green-400" },
                  { label: "Space Complexity", value: currentMetrics.spaceComplexity, color: "text-yellow-400" },
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
