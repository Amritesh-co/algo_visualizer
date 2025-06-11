import { create } from "zustand"

interface NQueensMetrics {
  solutions: number
  backtracks: number
  iterations: number
  timeComplexity: string
  spaceComplexity: string
}

interface NQueensStep {
  board: number[]
  description: string
  highlights?: {
    placing?: { row: number; col: number }
    conflicts?: { row: number; col: number }[]
    backtrack?: { row: number; col: number }
    solution?: boolean
    currentRow?: number
  }
}

interface NQueensStore {
  boardSize: number
  algorithm: string
  isPlaying: boolean
  currentStep: number
  steps: NQueensStep[]
  metrics: NQueensMetrics | null
  solutions: number[][]
  currentSolution: number
  userBoard: number[]
  isInteractive: boolean
  setBoardSize: (size: number) => void
  setAlgorithm: (algorithm: string) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentStep: (step: number) => void
  setSteps: (steps: NQueensStep[]) => void
  setMetrics: (metrics: NQueensMetrics) => void
  setSolutions: (solutions: number[][]) => void
  setCurrentSolution: (solution: number) => void
  setUserBoard: (board: number[]) => void
  setIsInteractive: (interactive: boolean) => void
  initializeBoard: (size: number) => void
  resetVisualization: () => void
}

export const useNQueensStore = create<NQueensStore>((set, get) => ({
  boardSize: 8,
  algorithm: "backtracking",
  isPlaying: false,
  currentStep: -1,
  steps: [],
  metrics: null,
  solutions: [],
  currentSolution: 0,
  userBoard: [],
  isInteractive: false,

  setBoardSize: (boardSize) => set({ boardSize }),
  setAlgorithm: (algorithm) => set({ algorithm }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setSteps: (steps) => set({ steps }),
  setMetrics: (metrics) => set({ metrics }),
  setSolutions: (solutions) => set({ solutions }),
  setCurrentSolution: (currentSolution) => set({ currentSolution }),
  setUserBoard: (userBoard) => set({ userBoard }),
  setIsInteractive: (isInteractive) => set({ isInteractive }),

  initializeBoard: (size) => {
    const board = Array(size).fill(-1)
    set({ userBoard: board })
  },

  resetVisualization: () =>
    set({
      isPlaying: false,
      currentStep: -1,
      steps: [],
      metrics: null,
      solutions: [],
      currentSolution: 0,
    }),
}))
