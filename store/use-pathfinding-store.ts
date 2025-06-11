import { create } from "zustand"

interface GridNode {
  row: number
  col: number
  isWall: boolean
  isVisited: boolean
  isPath: boolean
  distance: number
  previousNode: GridNode | null
}

interface PathfindingMetrics {
  nodesVisited: number
  pathLength: number
  executionTime: number
  pathFound: boolean
}

interface PathfindingStep {
  grid: GridNode[][]
  description: string
}

interface PathfindingStore {
  grid: GridNode[][]
  algorithm: string
  isPlaying: boolean
  currentStep: number
  steps: PathfindingStep[]
  startNode: { row: number; col: number } | null
  endNode: { row: number; col: number } | null
  isDrawingWalls: boolean
  metrics: PathfindingMetrics | null
  setGrid: (grid: GridNode[][]) => void
  setAlgorithm: (algorithm: string) => void
  setIsPlaying: (isPlaying: boolean) => void
  setCurrentStep: (step: number) => void
  setSteps: (steps: PathfindingStep[]) => void
  setStartNode: (node: { row: number; col: number }) => void
  setEndNode: (node: { row: number; col: number }) => void
  setIsDrawingWalls: (isDrawing: boolean) => void
  setMetrics: (metrics: PathfindingMetrics) => void
  initializeGrid: (rows: number, cols: number) => void
  resetVisualization: () => void
}

export const usePathfindingStore = create<PathfindingStore>((set, get) => ({
  grid: [],
  algorithm: "dijkstra",
  isPlaying: false,
  currentStep: -1,
  steps: [],
  startNode: { row: 10, col: 10 },
  endNode: { row: 10, col: 40 },
  isDrawingWalls: false,
  metrics: null,

  setGrid: (grid) => set({ grid }),
  setAlgorithm: (algorithm) => set({ algorithm }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  setSteps: (steps) => set({ steps }),
  setStartNode: (startNode) => set({ startNode }),
  setEndNode: (endNode) => set({ endNode }),
  setIsDrawingWalls: (isDrawingWalls) => set({ isDrawingWalls }),
  setMetrics: (metrics) => set({ metrics }),

  initializeGrid: (rows, cols) => {
    const grid = Array(rows)
      .fill(null)
      .map((_, row) =>
        Array(cols)
          .fill(null)
          .map((_, col) => ({
            row,
            col,
            isWall: false,
            isVisited: false,
            isPath: false,
            distance: Number.POSITIVE_INFINITY,
            previousNode: null,
          })),
      )
    set({ grid })
  },

  resetVisualization: () => {
    const { grid } = get()
    const newGrid = grid.map((row) =>
      row.map((node) => ({
        ...node,
        isVisited: false,
        isPath: false,
        distance: Number.POSITIVE_INFINITY,
        previousNode: null,
      })),
    )
    set({
      grid: newGrid,
      isPlaying: false,
      currentStep: -1,
      steps: [],
      metrics: null,
    })
  },
}))
