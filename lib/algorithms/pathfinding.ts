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

interface PathfindingResult {
  steps: PathfindingStep[]
  metrics: PathfindingMetrics
}

export class PathfindingAlgorithm {
  private algorithm: string
  private steps: PathfindingStep[] = []
  private startTime = 0

  constructor(algorithm: string) {
    this.algorithm = algorithm
  }

  findPath(
    grid: GridNode[][],
    start: { row: number; col: number },
    end: { row: number; col: number },
  ): PathfindingResult {
    this.steps = []
    this.startTime = performance.now()

    const gridCopy = grid.map((row) => row.map((node) => ({ ...node })))

    let result: { path: GridNode[]; visitedNodes: GridNode[] }

    switch (this.algorithm) {
      case "dijkstra":
        result = this.dijkstra(gridCopy, start, end)
        break
      case "bfs":
        result = this.bfs(gridCopy, start, end)
        break
      case "dfs":
        result = this.dfs(gridCopy, start, end)
        break
      default:
        result = this.dijkstra(gridCopy, start, end)
    }

    const endTime = performance.now()

    return {
      steps: this.steps,
      metrics: {
        nodesVisited: result.visitedNodes.length,
        pathLength: result.path.length,
        executionTime: Math.round(endTime - this.startTime),
        pathFound: result.path.length > 0,
      },
    }
  }

  private addStep(grid: GridNode[][], description: string) {
    this.steps.push({
      grid: grid.map((row) => row.map((node) => ({ ...node }))),
      description,
    })
  }

  private dijkstra(grid: GridNode[][], start: { row: number; col: number }, end: { row: number; col: number }) {
    const visitedNodes: GridNode[] = []
    const unvisitedNodes: GridNode[] = []

    // Initialize
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++) {
        grid[row][col].distance = Number.POSITIVE_INFINITY
        grid[row][col].previousNode = null
        unvisitedNodes.push(grid[row][col])
      }
    }

    grid[start.row][start.col].distance = 0
    this.addStep(grid, "Initialized Dijkstra's algorithm")

    while (unvisitedNodes.length > 0) {
      // Sort by distance and get closest node
      unvisitedNodes.sort((a, b) => a.distance - b.distance)
      const closestNode = unvisitedNodes.shift()!

      if (closestNode.isWall) continue
      if (closestNode.distance === Number.POSITIVE_INFINITY) break

      closestNode.isVisited = true
      visitedNodes.push(closestNode)
      this.addStep(grid, `Visiting node at (${closestNode.row}, ${closestNode.col})`)

      if (closestNode.row === end.row && closestNode.col === end.col) {
        const path = this.reconstructPath(closestNode)
        this.markPath(grid, path)
        this.addStep(grid, "Path found!")
        return { path, visitedNodes }
      }

      this.updateNeighbors(closestNode, grid)
    }

    return { path: [], visitedNodes }
  }

  private bfs(grid: GridNode[][], start: { row: number; col: number }, end: { row: number; col: number }) {
    const visitedNodes: GridNode[] = []
    const queue: GridNode[] = []

    const startNode = grid[start.row][start.col]
    queue.push(startNode)
    startNode.isVisited = true
    this.addStep(grid, "Initialized BFS algorithm")

    while (queue.length > 0) {
      const currentNode = queue.shift()!
      visitedNodes.push(currentNode)
      this.addStep(grid, `Visiting node at (${currentNode.row}, ${currentNode.col})`)

      if (currentNode.row === end.row && currentNode.col === end.col) {
        const path = this.reconstructPath(currentNode)
        this.markPath(grid, path)
        this.addStep(grid, "Path found!")
        return { path, visitedNodes }
      }

      const neighbors = this.getNeighbors(currentNode, grid)
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited && !neighbor.isWall) {
          neighbor.isVisited = true
          neighbor.previousNode = currentNode
          queue.push(neighbor)
        }
      }
    }

    return { path: [], visitedNodes }
  }

  private dfs(grid: GridNode[][], start: { row: number; col: number }, end: { row: number; col: number }) {
    const visitedNodes: GridNode[] = []
    const stack: GridNode[] = []

    const startNode = grid[start.row][start.col]
    stack.push(startNode)
    this.addStep(grid, "Initialized DFS algorithm")

    while (stack.length > 0) {
      const currentNode = stack.pop()!

      if (currentNode.isVisited || currentNode.isWall) continue

      currentNode.isVisited = true
      visitedNodes.push(currentNode)
      this.addStep(grid, `Visiting node at (${currentNode.row}, ${currentNode.col})`)

      if (currentNode.row === end.row && currentNode.col === end.col) {
        const path = this.reconstructPath(currentNode)
        this.markPath(grid, path)
        this.addStep(grid, "Path found!")
        return { path, visitedNodes }
      }

      const neighbors = this.getNeighbors(currentNode, grid)
      for (const neighbor of neighbors) {
        if (!neighbor.isVisited && !neighbor.isWall) {
          neighbor.previousNode = currentNode
          stack.push(neighbor)
        }
      }
    }

    return { path: [], visitedNodes }
  }

  private getNeighbors(node: GridNode, grid: GridNode[][]): GridNode[] {
    const neighbors: GridNode[] = []
    const { row, col } = node

    // Up, Down, Left, Right
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow
      const newCol = col + dCol

      if (newRow >= 0 && newRow < grid.length && newCol >= 0 && newCol < grid[0].length) {
        neighbors.push(grid[newRow][newCol])
      }
    }

    return neighbors
  }

  private updateNeighbors(node: GridNode, grid: GridNode[][]) {
    const neighbors = this.getNeighbors(node, grid)

    for (const neighbor of neighbors) {
      if (!neighbor.isVisited && !neighbor.isWall) {
        const tentativeDistance = node.distance + 1

        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance
          neighbor.previousNode = node
        }
      }
    }
  }

  private reconstructPath(endNode: GridNode): GridNode[] {
    const path: GridNode[] = []
    let currentNode: GridNode | null = endNode

    while (currentNode) {
      path.unshift(currentNode)
      currentNode = currentNode.previousNode
    }

    return path
  }

  private markPath(grid: GridNode[][], path: GridNode[]) {
    for (const node of path) {
      grid[node.row][node.col].isPath = true
    }
  }
}
