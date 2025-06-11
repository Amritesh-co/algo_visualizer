"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Pause, RotateCcw, Shuffle, SkipForward, SkipBack, Activity, BarChart3 } from "lucide-react"
import { useSortingStore } from "@/store/use-sorting-store"
import { SortingAlgorithm } from "@/lib/algorithms/sorting"

const algorithms = [
  { value: "bubble", label: "Bubble Sort", complexity: "O(n²)" },
  { value: "selection", label: "Selection Sort", complexity: "O(n²)" },
  { value: "insertion", label: "Insertion Sort", complexity: "O(n²)" },
  { value: "merge", label: "Merge Sort", complexity: "O(n log n)" },
  { value: "quick", label: "Quick Sort", complexity: "O(n log n)" },
  { value: "heap", label: "Heap Sort", complexity: "O(n log n)" },
]

export function SortingVisualizer() {
  const {
    array,
    algorithm,
    isPlaying,
    speed,
    currentStep,
    steps,
    metrics,
    setArray,
    setAlgorithm,
    setSpeed,
    setIsPlaying,
    setCurrentStep,
    setSteps,
    setMetrics,
    generateRandomArray,
    resetVisualization,
  } = useSortingStore()

  const [customInput, setCustomInput] = useState("")

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value)
    resetVisualization()
  }

  const handleGenerateArray = () => {
    generateRandomArray()
    resetVisualization()
  }

  const handleCustomInput = () => {
    try {
      const newArray = customInput
        .split(",")
        .map((num) => Number.parseInt(num.trim()))
        .filter((num) => !isNaN(num) && num >= 1 && num <= 100)

      if (newArray.length > 0) {
        setArray(newArray)
        resetVisualization()
        setCustomInput("")
      }
    } catch (error) {
      console.error("Invalid input")
    }
  }

  const runAlgorithm = useCallback(() => {
    const sortingAlgorithm = new SortingAlgorithm(algorithm)
    const result = sortingAlgorithm.sort([...array])
    setSteps(result.steps)
    setMetrics(result.metrics)
    setCurrentStep(0)
  }, [algorithm, array, setSteps, setMetrics, setCurrentStep])

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

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 1000 / speed)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, steps.length, speed, setCurrentStep, setIsPlaying])

  const getCurrentArray = () => {
    if (steps.length === 0 || currentStep === -1) return array
    return steps[currentStep].array
  }

  const getCurrentHighlights = () => {
    if (steps.length === 0 || currentStep === -1) return {}
    return steps[currentStep].highlights || {}
  }

  // PERFECT real-time metrics calculation using operationType
  const getCurrentMetrics = () => {
    if (!metrics || steps.length === 0 || currentStep === -1) {
      return {
        comparisons: 0,
        swaps: 0,
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
      }
    }

    // Count actual operations up to current step using operationType
    let comparisons = 0
    let swaps = 0

    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      const step = steps[i]
      if (step.operationType === "comparison") {
        comparisons++
      }
      if (step.operationType === "swap") {
        swaps++
      }
    }

    return {
      comparisons,
      swaps,
      timeComplexity: metrics.timeComplexity,
      spaceComplexity: metrics.spaceComplexity,
    }
  }

  const maxValue = Math.max(...array)
  const currentArray = getCurrentArray()
  const highlights = getCurrentHighlights()
  const currentMetrics = getCurrentMetrics()

  const getBarColor = (index: number) => {
    if (highlights.comparing?.includes(index)) return "bg-blue-500"
    if (highlights.swapping?.includes(index)) return "bg-red-500"
    if (highlights.sorted?.includes(index)) return "bg-green-500"
    return "bg-slate-600"
  }

  const selectedAlgorithm = algorithms.find((algo) => algo.value === algorithm)

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <Card className="glassmorphism tech-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 tech-border">
                <BarChart3 className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <span className="text-2xl text-slate-200">Sorting Algorithm Visualizer</span>
                {selectedAlgorithm && (
                  <div className="text-sm text-blue-400 code-font mt-1">
                    {selectedAlgorithm.label} - {selectedAlgorithm.complexity}
                  </div>
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
                          <span className="text-xs text-slate-400 code-font">{algo.complexity}</span>
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
                  max={5}
                  step={0.5}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-green-400 font-semibold">Array Size: {array.length}</Label>
                <Button onClick={handleGenerateArray} variant="outline" className="w-full tech-button">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Generate Random
                </Button>
              </div>
            </div>

            {/* Custom Input */}
            <div className="space-y-3">
              <Label className="text-yellow-400 font-semibold">Custom Array</Label>
              <div className="flex gap-3">
                <Input
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g., 64, 34, 25, 12, 22, 11, 90"
                  className="flex-1 tech-button code-font"
                />
                <Button onClick={handleCustomInput} variant="outline" className="tech-button">
                  Set Array
                </Button>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex justify-center gap-3">
              {[
                { icon: SkipBack, onClick: handleStepBackward, disabled: currentStep <= 0 },
                { icon: isPlaying ? Pause : Play, onClick: isPlaying ? handlePause : handlePlay, disabled: false },
                { icon: SkipForward, onClick: handleStepForward, disabled: currentStep >= steps.length - 1 },
                { icon: RotateCcw, onClick: handleReset, disabled: false },
              ].map((btn, index) => (
                <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={btn.onClick} disabled={btn.disabled} className="tech-button" size="lg">
                    <btn.icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Visualization */}
            <div className="glassmorphism rounded-xl p-8 min-h-[400px] flex items-end justify-center gap-1 relative overflow-hidden">
              <div className="tech-grid absolute inset-0 opacity-30" />
              <AnimatePresence mode="wait">
                {currentArray.map((value, index) => (
                  <motion.div
                    key={`${index}-${value}`}
                    layout="position"
                    className={`
                      algorithm-bar min-w-[12px] flex items-end justify-center text-xs font-bold text-white relative
                      ${getBarColor(index)} subtle-glow
                    `}
                    style={{
                      height: `${(value / maxValue) * 300}px`,
                      width: `${Math.max(25, 500 / currentArray.length)}px`,
                    }}
                    initial={{ height: 0, scale: 0.8 }}
                    animate={{
                      height: `${(value / maxValue) * 300}px`,
                      scale: highlights.comparing?.includes(index) || highlights.swapping?.includes(index) ? 1.05 : 1,
                    }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="mb-2 drop-shadow-lg code-font">{value}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
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
                    transition={{ duration: 0.3, ease: "easeOut" }}
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
                <p className="text-slate-300 code-font">{steps[currentStep].description}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="glassmorphism tech-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Activity className="h-6 w-6 text-blue-400" />
              <span className="text-slate-200">Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Comparisons", value: currentMetrics.comparisons, color: "text-blue-400" },
                { label: "Swaps", value: currentMetrics.swaps, color: "text-purple-400" },
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
                    key={`${metric.label}-${metric.value}`}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span
                      key={metric.value}
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {metric.value}
                    </motion.span>
                  </motion.div>
                  <div className="text-sm text-slate-500 font-medium">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
