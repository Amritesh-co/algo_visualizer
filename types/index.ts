export interface SortingMetrics {
  comparisons: number
  swaps: number
  timeComplexity: string
  spaceComplexity: string
}

export interface SortingStep {
  array: number[]
  description: string
  highlights?: {
    comparing?: number[]
    swapping?: number[]
    sorted?: number[]
  }
}

export interface GridNode {
  row: number
  col: number
  isWall: boolean
  isVisited: boolean
  isPath: boolean
  distance: number
  previousNode: GridNode | null
}

export interface PathfindingMetrics {
  nodesVisited: number
  pathLength: number
  executionTime: number
  pathFound: boolean
}

export interface GraphMetrics {
  iterations: number
  comparisons: number
  timeComplexity: string
  spaceComplexity: string
}

export interface DPMetrics {
  operations: number
  tableSize: string
  timeComplexity: string
  spaceComplexity: string
}

export interface AlgorithmStep {
  description: string
  highlights?: Record<string, any>
}
