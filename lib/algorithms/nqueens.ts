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

interface NQueensResult {
  steps: NQueensStep[]
  metrics: NQueensMetrics
  solutions: number[][]
}

export class NQueensAlgorithm {
  private algorithm: string
  private steps: NQueensStep[] = []
  private solutions: number[][] = []
  private backtracks = 0
  private iterations = 0
  private n = 0

  constructor(algorithm: string) {
    this.algorithm = algorithm
  }

  solve(n: number, findAll = false): NQueensResult {
    this.steps = []
    this.solutions = []
    this.backtracks = 0
    this.iterations = 0
    this.n = n

    const board = Array(n).fill(-1)
    this.addStep(board, `Starting ${this.algorithm} algorithm for ${n}-Queens problem`)

    switch (this.algorithm) {
      case "backtracking":
        this.backtrackingSolve(board, 0, findAll)
        break
      case "genetic":
        this.geneticSolve(n, findAll)
        break
      default:
        this.backtrackingSolve(board, 0, findAll)
    }

    if (this.solutions.length > 0) {
      this.addStep(
        this.solutions[0],
        `✅ Found ${this.solutions.length} solution${this.solutions.length > 1 ? "s" : ""}!`,
        { solution: true },
      )
    } else {
      this.addStep(board, "❌ No solution exists for this configuration")
    }

    return {
      steps: this.steps,
      metrics: {
        solutions: this.solutions.length,
        backtracks: this.backtracks,
        iterations: this.iterations,
        timeComplexity: "O(N!)",
        spaceComplexity: "O(N)",
      },
      solutions: this.solutions,
    }
  }

  private backtrackingSolve(board: number[], row: number, findAll: boolean): boolean {
    this.iterations++

    if (row === this.n) {
      // Found a solution
      this.solutions.push([...board])
      this.addStep(board, `🎉 Solution ${this.solutions.length} found!`, {
        solution: true,
      })
      return !findAll // Return false if we want to find all solutions
    }

    this.addStep(board, `Trying to place queen in row ${row}`, {
      currentRow: row,
    })

    for (let col = 0; col < this.n; col++) {
      this.addStep(board, `Attempting to place queen at position (${row}, ${col})`, {
        placing: { row, col },
        currentRow: row,
      })

      if (this.isSafe(board, row, col)) {
        // Place queen
        board[row] = col
        this.addStep(board, `✅ Queen placed at (${row}, ${col}) - No conflicts!`, {
          placing: { row, col },
          currentRow: row,
        })

        // Recursively place queens in remaining rows
        if (this.backtrackingSolve(board, row + 1, findAll)) {
          return true
        }

        // Backtrack
        this.backtracks++
        this.addStep(board, `⬅️ Backtracking from (${row}, ${col}) - No solution in this path`, {
          backtrack: { row, col },
          currentRow: row,
        })
        board[row] = -1
      } else {
        // Show conflicts
        const conflicts = this.getConflicts(board, row, col)
        this.addStep(board, `❌ Cannot place queen at (${row}, ${col}) - Conflicts detected!`, {
          placing: { row, col },
          conflicts,
          currentRow: row,
        })
      }
    }

    return false
  }

  private geneticSolve(n: number, findAll: boolean): void {
    // Simplified genetic algorithm simulation
    const populationSize = 20
    const generations = 50
    let population: number[][] = []

    // Initialize random population
    for (let i = 0; i < populationSize; i++) {
      const individual = Array.from({ length: n }, () => Math.floor(Math.random() * n))
      population.push(individual)
    }

    this.addStep(population[0], "Initialized random population for genetic algorithm")

    for (let gen = 0; gen < generations; gen++) {
      this.iterations++

      // Evaluate fitness (lower conflicts = higher fitness)
      const fitness = population.map((individual) => {
        const conflicts = this.countConflicts(individual)
        return n * n - conflicts // Higher fitness for fewer conflicts
      })

      // Check for solutions
      for (let i = 0; i < population.length; i++) {
        if (fitness[i] === n * n) {
          // Perfect solution found
          this.solutions.push([...population[i]])
          this.addStep(population[i], `🎉 Genetic algorithm found solution in generation ${gen}!`, {
            solution: true,
          })
          if (!findAll) return
        }
      }

      // Show best individual of this generation
      const bestIndex = fitness.indexOf(Math.max(...fitness))
      const conflicts = this.countConflicts(population[bestIndex])
      this.addStep(population[bestIndex], `Generation ${gen}: Best individual has ${conflicts} conflicts`, {
        currentRow: gen % n,
      })

      // Selection and crossover (simplified)
      const newPopulation: number[][] = []
      for (let i = 0; i < populationSize; i++) {
        const parent1 = this.tournamentSelection(population, fitness)
        const parent2 = this.tournamentSelection(population, fitness)
        const child = this.crossover(parent1, parent2)
        this.mutate(child)
        newPopulation.push(child)
      }

      population = newPopulation
    }
  }

  private isSafe(board: number[], row: number, col: number): boolean {
    for (let i = 0; i < row; i++) {
      if (
        board[i] === col || // Same column
        board[i] - i === col - row || // Same diagonal
        board[i] + i === col + row
      ) {
        // Same anti-diagonal
        return false
      }
    }
    return true
  }

  private getConflicts(board: number[], row: number, col: number): { row: number; col: number }[] {
    const conflicts: { row: number; col: number }[] = []

    for (let i = 0; i < row; i++) {
      if (
        board[i] === col || // Same column
        board[i] - i === col - row || // Same diagonal
        board[i] + i === col + row
      ) {
        // Same anti-diagonal
        conflicts.push({ row: i, col: board[i] })
      }
    }

    return conflicts
  }

  private countConflicts(board: number[]): number {
    let conflicts = 0
    for (let i = 0; i < board.length; i++) {
      for (let j = i + 1; j < board.length; j++) {
        if (
          board[i] === board[j] || // Same column
          board[i] - i === board[j] - j || // Same diagonal
          board[i] + i === board[j] + j
        ) {
          // Same anti-diagonal
          conflicts++
        }
      }
    }
    return conflicts
  }

  private tournamentSelection(population: number[][], fitness: number[]): number[] {
    const tournamentSize = 3
    let best = Math.floor(Math.random() * population.length)

    for (let i = 1; i < tournamentSize; i++) {
      const competitor = Math.floor(Math.random() * population.length)
      if (fitness[competitor] > fitness[best]) {
        best = competitor
      }
    }

    return [...population[best]]
  }

  private crossover(parent1: number[], parent2: number[]): number[] {
    const crossoverPoint = Math.floor(Math.random() * parent1.length)
    const child = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)]
    return child
  }

  private mutate(individual: number[]): void {
    if (Math.random() < 0.1) {
      // 10% mutation rate
      const index = Math.floor(Math.random() * individual.length)
      individual[index] = Math.floor(Math.random() * individual.length)
    }
  }

  private addStep(board: number[], description: string, highlights?: any) {
    this.steps.push({
      board: [...board],
      description,
      highlights,
    })
  }
}
