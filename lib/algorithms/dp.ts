interface DPMetrics {
  operations: number
  tableSize: string
  timeComplexity: string
  spaceComplexity: string
}

interface DPStep {
  table?: any[][]
  array?: any[]
  description: string
  highlights?: {
    current?: { i: number; j?: number }
    comparing?: { i: number; j?: number }[]
    solution?: { i: number; j?: number }[]
    arrayHighlight?: number[]
    duplicateFound?: { element: any; positions: number[] }
    subsetVisualization?: {
      currentElement: number
      currentSum: number
      targetSum: number
      includedElements: number[]
      excludedElements: number[]
      possibleSubsets: number[][]
      decision: "include" | "exclude" | "both"
      reasoning: string
    }
  }
}

interface DPResult {
  steps: DPStep[]
  metrics: DPMetrics
  table?: any[][]
}

export class DynamicProgrammingAlgorithm {
  private algorithm: string
  private steps: DPStep[] = []
  private operations = 0

  constructor(algorithm: string) {
    this.algorithm = algorithm
  }

  subsetSum(set: number[], targetSum: number): DPResult {
    this.steps = []
    this.operations = 0

    const n = set.length
    const dp: boolean[][] = Array(n + 1)
      .fill(null)
      .map(() => Array(targetSum + 1).fill(false))

    // Initialize first column (sum = 0 is always possible with empty subset)
    for (let i = 0; i <= n; i++) {
      dp[i][0] = true
    }

    this.addStep(
      { table: dp, array: set },
      "🎯 Starting Sum of Subset Problem! We want to find if any subset sums to " + targetSum,
      {
        subsetVisualization: {
          currentElement: -1,
          currentSum: 0,
          targetSum,
          includedElements: [],
          excludedElements: [],
          possibleSubsets: [[]],
          decision: "both",
          reasoning: "Empty subset always sums to 0, so first column is TRUE",
        },
      },
    )

    for (let i = 1; i <= n; i++) {
      const currentElement = set[i - 1]

      this.addStep({ table: dp, array: set }, `🔍 Now considering element: ${currentElement} (position ${i})`, {
        current: { i, j: 0 },
        arrayHighlight: [i - 1],
        subsetVisualization: {
          currentElement,
          currentSum: 0,
          targetSum,
          includedElements: [],
          excludedElements: [],
          possibleSubsets: [],
          decision: "both",
          reasoning: `We need to decide: Should we include ${currentElement} in our subset?`,
        },
      })

      for (let j = 1; j <= targetSum; j++) {
        this.operations++

        this.addStep({ table: dp, array: set }, `🤔 Can we make sum ${j} using elements up to position ${i}?`, {
          current: { i, j },
          arrayHighlight: [i - 1],
          subsetVisualization: {
            currentElement,
            currentSum: j,
            targetSum,
            includedElements: [],
            excludedElements: [],
            possibleSubsets: [],
            decision: "both",
            reasoning: `Checking if sum ${j} is possible with element ${currentElement}`,
          },
        })

        if (currentElement > j) {
          // Element is too big, can't include it
          dp[i][j] = dp[i - 1][j]

          this.addStep(
            { table: dp, array: set },
            `❌ Element ${currentElement} > ${j}, so we CANNOT include it. Result = ${dp[i][j]}`,
            {
              current: { i, j },
              comparing: [{ i: i - 1, j }],
              arrayHighlight: [i - 1],
              subsetVisualization: {
                currentElement,
                currentSum: j,
                targetSum,
                includedElements: [],
                excludedElements: [currentElement],
                possibleSubsets: [],
                decision: "exclude",
                reasoning: `${currentElement} is bigger than ${j}, so we must EXCLUDE it`,
              },
            },
          )
        } else {
          // We can choose to include or exclude
          const withoutCurrent = dp[i - 1][j]
          const withCurrent = dp[i - 1][j - currentElement]
          dp[i][j] = withoutCurrent || withCurrent

          let decision: "include" | "exclude" | "both" = "both"
          let reasoning = ""
          let includedElements: number[] = []
          let excludedElements: number[] = []

          if (withCurrent && !withoutCurrent) {
            decision = "include"
            reasoning = `We MUST include ${currentElement} to make sum ${j}`
            includedElements = [currentElement]
          } else if (!withCurrent && withoutCurrent) {
            decision = "exclude"
            reasoning = `We MUST exclude ${currentElement} to make sum ${j}`
            excludedElements = [currentElement]
          } else if (withCurrent && withoutCurrent) {
            decision = "both"
            reasoning = `We can either include OR exclude ${currentElement} to make sum ${j}`
          } else {
            decision = "exclude"
            reasoning = `No way to make sum ${j} with or without ${currentElement}`
            excludedElements = [currentElement]
          }

          this.addStep({ table: dp, array: set }, `🎯 ${reasoning}. Final result: ${dp[i][j]}`, {
            current: { i, j },
            comparing: [
              { i: i - 1, j },
              { i: i - 1, j: j - currentElement },
            ],
            arrayHighlight: [i - 1],
            subsetVisualization: {
              currentElement,
              currentSum: j,
              targetSum,
              includedElements,
              excludedElements,
              possibleSubsets: [],
              decision,
              reasoning,
            },
          })
        }
      }
    }

    // Final result
    const solutionExists = dp[n][targetSum]
    const finalSubset: number[] = []

    if (solutionExists) {
      // Backtrack to find one possible subset
      let i = n,
        j = targetSum
      while (i > 0 && j > 0) {
        if (dp[i][j] && !dp[i - 1][j]) {
          finalSubset.unshift(set[i - 1])
          j -= set[i - 1]
        }
        i--
      }
    }

    this.addStep(
      { table: dp, array: set },
      solutionExists
        ? `🎉 SUCCESS! Found subset [${finalSubset.join(", ")}] that sums to ${targetSum}!`
        : `❌ No subset can sum to ${targetSum}`,
      {
        solution: [{ i: n, j: targetSum }],
        arrayHighlight: solutionExists ? finalSubset.map((el) => set.indexOf(el)) : [],
        subsetVisualization: {
          currentElement: -1,
          currentSum: targetSum,
          targetSum,
          includedElements: finalSubset,
          excludedElements: [],
          possibleSubsets: solutionExists ? [finalSubset] : [],
          decision: "both",
          reasoning: solutionExists
            ? `Found it! Subset [${finalSubset.join(", ")}] = ${finalSubset.reduce((a, b) => a + b, 0)}`
            : "No possible subset found",
        },
      },
    )

    return {
      steps: this.steps,
      metrics: {
        operations: this.operations,
        tableSize: `${n + 1} × ${targetSum + 1}`,
        timeComplexity: "O(n × sum)",
        spaceComplexity: "O(n × sum)",
      },
      table: dp,
    }
  }

  knapsack(weights: number[], values: number[], capacity: number): DPResult {
    this.steps = []
    this.operations = 0

    const n = weights.length
    const dp: number[][] = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0))

    this.addStep({ table: dp }, "Initialized DP table for 0/1 Knapsack problem")

    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        this.operations++

        this.addStep(
          { table: dp },
          `Processing item ${i} (weight: ${weights[i - 1]}, value: ${values[i - 1]}) for capacity ${w}`,
          {
            current: { i, j: w },
          },
        )

        if (weights[i - 1] <= w) {
          const includeValue = values[i - 1] + dp[i - 1][w - weights[i - 1]]
          const excludeValue = dp[i - 1][w]

          dp[i][w] = Math.max(includeValue, excludeValue)

          this.addStep(
            { table: dp },
            `Item fits! Max(include: ${includeValue}, exclude: ${excludeValue}) = ${dp[i][w]}`,
            {
              current: { i, j: w },
              comparing: [
                { i: i - 1, j: w },
                { i: i - 1, j: w - weights[i - 1] },
              ],
            },
          )
        } else {
          dp[i][w] = dp[i - 1][w]
          this.addStep(
            { table: dp },
            `Item doesn't fit (weight ${weights[i - 1]} > capacity ${w}), so dp[${i}][${w}] = dp[${i - 1}][${w}] = ${dp[i][w]}`,
            {
              current: { i, j: w },
              comparing: [{ i: i - 1, j: w }],
            },
          )
        }
      }
    }

    this.addStep({ table: dp }, `Maximum value that can be obtained: ${dp[n][capacity]}`, {
      solution: [{ i: n, j: capacity }],
    })

    return {
      steps: this.steps,
      metrics: {
        operations: this.operations,
        tableSize: `${n + 1} × ${capacity + 1}`,
        timeComplexity: "O(n × W)",
        spaceComplexity: "O(n × W)",
      },
      table: dp,
    }
  }

  uniquenessDetection(arr: number[]): DPResult {
    this.steps = []
    this.operations = 0

    const n = arr.length
    const seen = new Set<number>()
    const seenPositions = new Map<number, number[]>()

    // Track positions of each element
    arr.forEach((element, index) => {
      if (!seenPositions.has(element)) {
        seenPositions.set(element, [])
      }
      seenPositions.get(element)!.push(index)
    })

    this.addStep({ array: [...arr] }, `Starting uniqueness detection on array: [${arr.join(", ")}]`)

    for (let i = 0; i < n; i++) {
      this.operations++
      const currentElement = arr[i]

      this.addStep({ array: [...arr] }, `Checking element ${currentElement} at position ${i}`, {
        arrayHighlight: [i],
      })

      if (seen.has(currentElement)) {
        // Found duplicate
        const positions = seenPositions.get(currentElement) || []
        const previousPositions = positions.filter((pos) => pos < i)

        this.addStep(
          { array: [...arr] },
          `🚨 DUPLICATE FOUND! Element ${currentElement} was already seen at position(s): ${previousPositions.join(", ")}`,
          {
            duplicateFound: { element: currentElement, positions: [i, ...previousPositions] },
            arrayHighlight: [i, ...previousPositions],
          },
        )

        this.addStep({ array: [...arr] }, `❌ Array contains duplicates. Algorithm terminates.`, {
          solution: [{ i }],
          arrayHighlight: [i, ...previousPositions],
        })

        return {
          steps: this.steps,
          metrics: {
            operations: this.operations,
            tableSize: `Array length: ${n}`,
            timeComplexity: "O(n)",
            spaceComplexity: "O(n)",
          },
        }
      } else {
        seen.add(currentElement)
        this.addStep({ array: [...arr] }, `✅ Element ${currentElement} is unique so far. Added to seen set.`, {
          arrayHighlight: [i],
        })
      }
    }

    // All elements are unique
    this.addStep({ array: [...arr] }, `🎉 SUCCESS! All elements in the array are unique.`, {
      solution: [{ i: n - 1 }],
      arrayHighlight: Array.from({ length: n }, (_, i) => i),
    })

    return {
      steps: this.steps,
      metrics: {
        operations: this.operations,
        tableSize: `Array length: ${n}`,
        timeComplexity: "O(n)",
        spaceComplexity: "O(n)",
      },
    }
  }

  private addStep(data: { table?: any[][]; array?: any[] }, description: string, highlights?: any) {
    this.steps.push({
      ...data,
      description,
      highlights,
    })
  }
}
