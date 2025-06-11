import { create } from "zustand"

interface DPMetrics {
  operations: number
  tableSize: string
  timeComplexity: string
  spaceComplexity: string
}

interface DPStep {
  table: any[][]
  description: string
  highlights?: {
    current?: { i: number; j: number }
    comparing?: { i: number; j: number }[]
    solution?: { i: number; j: number }[]
  }
}

interface DPStore {
  algorithm: string
  isPlaying: boolean
  currentStep: number
  steps: DPStep[]
  metrics: DPMetrics | null
  dpTable: any[][]
  setAlgorithm: (algorithm: string) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentStep: (step: number) => void
  setSteps: (steps: DPStep[]) => void
  setMetrics: (metrics: DPMetrics) => void
  setDPTable: (table: any[][]) => void
  resetVisualization: () => void
}

export const useDPStore = create<DPStore>((set, get) => ({
  algorithm: "subset-sum",
  isPlaying: false,
  currentStep: -1,
  steps: [],
  metrics: null,
  dpTable: [],

  setAlgorithm: (algorithm) => set({ algorithm }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setSteps: (steps) => set({ steps }),
  setMetrics: (metrics) => set({ metrics }),
  setDPTable: (dpTable) => set({ dpTable }),

  resetVisualization: () =>
    set({
      isPlaying: false,
      currentStep: -1,
      steps: [],
      metrics: null,
      dpTable: [],
    }),
}))
