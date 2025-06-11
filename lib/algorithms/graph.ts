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

interface GraphResult {
  steps: GraphStep[]
  metrics: GraphMetrics
}

const INFINITY = 999

export class FloydWarshallAlgorithm {
  private steps: GraphStep[] = []
  private iterations = 0
  private comparisons = 0

  findShortestPaths(matrix: number[][]): GraphResult {
    this.steps = []
    this.iterations = 0
    this.comparisons = 0

    const n = matrix.length
    const dist = matrix.map((row) => [...row])

    this.addStep(dist, "Initial distance matrix")

    for (let k = 0; k < n; k++) {
      this.addStep(dist, `Starting iteration ${k + 1}: Using vertex ${k} as intermediate`, {
        via: { k },
      })

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          this.iterations++
          this.comparisons++

          this.addStep(dist, `Checking if path ${i} → ${k} → ${j} is shorter than direct path ${i} → ${j}`, {
            current: { i, j },
            via: { k },
          })

          if (dist[i][k] !== INFINITY && dist[k][j] !== INFINITY && dist[i][k] + dist[k][j] < dist[i][j]) {
            const oldDistance = dist[i][j]
            dist[i][j] = dist[i][k] + dist[k][j]

            this.addStep(
              dist,
              `Updated distance[${i}][${j}] from ${oldDistance === INFINITY ? "∞" : oldDistance} to ${dist[i][j]}`,
              {
                current: { i, j },
                via: { k },
                updated: [{ i, j }],
              },
            )
          }
        }
      }

      this.addStep(dist, `Completed iteration ${k + 1}`)
    }

    this.addStep(dist, "Floyd-Warshall algorithm completed! All shortest paths found.")

    return {
      steps: this.steps,
      metrics: {
        iterations: this.iterations,
        comparisons: this.comparisons,
        timeComplexity: "O(n³)",
        spaceComplexity: "O(n²)",
      },
    }
  }

  private addStep(matrix: number[][], description: string, highlights?: any) {
    this.steps.push({
      matrix: matrix.map((row) => [...row]),
      description,
      highlights,
    })
  }
}
