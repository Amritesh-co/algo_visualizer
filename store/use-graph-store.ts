import { create } from "zustand"

interface GraphMetrics {
  iterations: number
  comparisons: number
  timeComplexity: string
  spaceComplexity: string
}

interface GraphStep {
  matrix: number[][]
  description: string
  highlights?: {
    current?: { i: number; j: number }
    via?: { k: number }
    updated?: { i: number; j: number }[]
  }
}

interface GraphStore {
  matrix: number[][]
  matrixSize: number
  isPlaying: boolean
  currentStep: number
  steps: GraphStep[]
  metrics: GraphMetrics | null
  setMatrix: (matrix: number[][]) => void
  setMatrixSize: (size: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentStep: (step: number) => void
  setSteps: (steps: GraphStep[]) => void
  setMetrics: (metrics: GraphMetrics) => void
  initializeMatrix: (size: number) => void
  resetVisualization: () => void
}

const INFINITY = 999

export const useGraphStore = create<GraphStore>((set, get) => ({
  matrix: [],
  matrixSize: 4,
  isPlaying: false,
  currentStep: -1,
  steps: [],
  metrics: null,

  setMatrix: (matrix) => set({ matrix }),
  setMatrixSize: (matrixSize) => set({ matrixSize }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setSteps: (steps) => set({ steps }),
  setMetrics: (metrics) => set({ metrics }),

  initializeMatrix: (size) => {
    const matrix = Array(size)
      .fill(null)
      .map((_, i) =>
        Array(size)
          .fill(null)
          .map((_, j) => {
            if (i === j) return 0
            if ((i === 0 && j === 1) || (i === 1 && j === 0)) return 5
            if ((i === 0 && j === 3) || (i === 3 && j === 0)) return 10
            if ((i === 1 && j === 2) || (i === 2 && j === 1)) return 3
            if ((i === 2 && j === 3) || (i === 3 && j === 2)) return 1
            return INFINITY
          }),
      )
    set({ matrix, matrixSize: size })
  },

  resetVisualization: () =>
    set({
      isPlaying: false,
      currentStep: -1,
      steps: [],
      metrics: null,
    }),
}))
