import { create } from "zustand"

interface SortingMetrics {
  comparisons: number
  swaps: number
  timeComplexity: string
  spaceComplexity: string
}

interface SortingStep {
  array: number[]
  description: string
  highlights?: {
    comparing?: number[]
    swapping?: number[]
    sorted?: number[]
  }
}

interface SortingStore {
  array: number[]
  algorithm: string
  isPlaying: boolean
  speed: number
  currentStep: number
  steps: SortingStep[]
  metrics: SortingMetrics | null
  setArray: (array: number[]) => void
  setAlgorithm: (algorithm: string) => void
  setSpeed: (speed: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentStep: (step: number) => void
  setSteps: (steps: SortingStep[]) => void
  setMetrics: (metrics: SortingMetrics) => void
  generateRandomArray: () => void
  resetVisualization: () => void
}

export const useSortingStore = create<SortingStore>((set, get) => ({
  array: [64, 34, 25, 12, 22, 11, 90],
  algorithm: "bubble",
  isPlaying: false,
  speed: 1,
  currentStep: -1,
  steps: [],
  metrics: null,

  setArray: (array) => set({ array }),
  setAlgorithm: (algorithm) => set({ algorithm }),
  setSpeed: (speed) => set({ speed }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setSteps: (steps) => set({ steps }),
  setMetrics: (metrics) => set({ metrics }),

  generateRandomArray: () => {
    const size = Math.floor(Math.random() * 15) + 5
    const array = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1)
    set({ array })
  },

  resetVisualization: () =>
    set({
      isPlaying: false,
      currentStep: -1,
      steps: [],
      metrics: null,
    }),
}))
