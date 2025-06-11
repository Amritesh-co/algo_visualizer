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
  operationType?: "comparison" | "swap" | "info"
}

interface SortingResult {
  steps: SortingStep[]
  metrics: SortingMetrics
}

export class SortingAlgorithm {
  private algorithm: string
  private steps: SortingStep[] = []
  private comparisons = 0
  private swaps = 0

  constructor(algorithm: string) {
    this.algorithm = algorithm
  }

  sort(array: number[]): SortingResult {
    this.steps = []
    this.comparisons = 0
    this.swaps = 0

    const sortedArray = [...array]

    switch (this.algorithm) {
      case "bubble":
        this.bubbleSort(sortedArray)
        break
      case "selection":
        this.selectionSort(sortedArray)
        break
      case "insertion":
        this.insertionSort(sortedArray)
        break
      case "merge":
        this.mergeSort(sortedArray, 0, sortedArray.length - 1)
        break
      case "quick":
        this.quickSort(sortedArray, 0, sortedArray.length - 1)
        break
      case "heap":
        this.heapSort(sortedArray)
        break
    }

    return {
      steps: this.steps,
      metrics: this.getMetrics(),
    }
  }

  private addStep(
    array: number[],
    description: string,
    highlights?: any,
    operationType: "comparison" | "swap" | "info" = "info",
  ) {
    this.steps.push({
      array: [...array],
      description,
      highlights,
      operationType,
    })
  }

  private bubbleSort(arr: number[]) {
    const n = arr.length
    this.addStep(arr, "🫧 Starting Bubble Sort", {}, "info")

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        this.comparisons++
        this.addStep(
          arr,
          `🔍 Comparing ${arr[j]} and ${arr[j + 1]}`,
          {
            comparing: [j, j + 1],
          },
          "comparison",
        )

        if (arr[j] > arr[j + 1]) {
          // ACTUAL SWAP HAPPENING
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          this.swaps++
          this.addStep(
            arr,
            `🔄 SWAPPED ${arr[j + 1]} and ${arr[j]} (positions ${j} and ${j + 1})`,
            {
              swapping: [j, j + 1],
            },
            "swap",
          )
        }
      }
      this.addStep(
        arr,
        `✅ Element ${arr[n - i - 1]} is now in correct position`,
        {
          sorted: [n - i - 1],
        },
        "info",
      )
    }
    this.addStep(
      arr,
      "🎉 Bubble Sort completed!",
      {
        sorted: Array.from({ length: n }, (_, i) => i),
      },
      "info",
    )
  }

  private selectionSort(arr: number[]) {
    const n = arr.length
    this.addStep(arr, "🎯 Starting Selection Sort", {}, "info")

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      this.addStep(
        arr,
        `🔍 Finding minimum from position ${i} onwards`,
        {
          comparing: [i],
        },
        "info",
      )

      for (let j = i + 1; j < n; j++) {
        this.comparisons++
        this.addStep(
          arr,
          `🔍 Comparing ${arr[minIdx]} and ${arr[j]}`,
          {
            comparing: [minIdx, j],
          },
          "comparison",
        )

        if (arr[j] < arr[minIdx]) {
          minIdx = j
          this.addStep(
            arr,
            `📍 New minimum ${arr[j]} found at position ${j}`,
            {
              comparing: [minIdx],
            },
            "info",
          )
        }
      }

      if (minIdx !== i) {
        // ACTUAL SWAP HAPPENING
        const temp1 = arr[i]
        const temp2 = arr[minIdx]
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
        this.swaps++
        this.addStep(
          arr,
          `🔄 SWAPPED ${temp1} and ${temp2} (positions ${i} and ${minIdx})`,
          {
            swapping: [i, minIdx],
          },
          "swap",
        )
      }

      this.addStep(
        arr,
        `✅ Element ${arr[i]} is now in correct position`,
        {
          sorted: [i],
        },
        "info",
      )
    }
    this.addStep(
      arr,
      "🎉 Selection Sort completed!",
      {
        sorted: Array.from({ length: n }, (_, i) => i),
      },
      "info",
    )
  }

  private insertionSort(arr: number[]) {
    const n = arr.length
    this.addStep(arr, "📝 Starting Insertion Sort", {}, "info")

    for (let i = 1; i < n; i++) {
      const key = arr[i]
      let j = i - 1

      this.addStep(
        arr,
        `🎯 Inserting element ${key} into sorted portion`,
        {
          comparing: [i],
        },
        "info",
      )

      while (j >= 0 && arr[j] > key) {
        this.comparisons++
        this.addStep(
          arr,
          `🔍 Comparing ${arr[j]} with ${key}`,
          {
            comparing: [j, i],
          },
          "comparison",
        )

        // ACTUAL SHIFT (which is like a swap)
        arr[j + 1] = arr[j]
        this.swaps++ // Count shifts as swaps
        this.addStep(
          arr,
          `🔄 SHIFTED ${arr[j + 1]} to the right (position ${j} to ${j + 1})`,
          {
            swapping: [j, j + 1],
          },
          "swap",
        )
        j--
      }

      if (j >= 0) {
        this.comparisons++
        this.addStep(
          arr,
          `🔍 Comparing ${arr[j]} with ${key}`,
          {
            comparing: [j, i],
          },
          "comparison",
        )
      }

      arr[j + 1] = key
      this.addStep(
        arr,
        `📍 Placed ${key} at position ${j + 1}`,
        {
          sorted: Array.from({ length: i + 1 }, (_, idx) => idx),
        },
        "info",
      )
    }
    this.addStep(
      arr,
      "🎉 Insertion Sort completed!",
      {
        sorted: Array.from({ length: n }, (_, i) => i),
      },
      "info",
    )
  }

  private mergeSort(arr: number[], left: number, right: number) {
    if (left >= right) return

    const mid = Math.floor((left + right) / 2)
    this.addStep(arr, `🔪 Dividing array: [${left}..${mid}] and [${mid + 1}..${right}]`, {}, "info")

    this.mergeSort(arr, left, mid)
    this.mergeSort(arr, mid + 1, right)
    this.merge(arr, left, mid, right)
  }

  private merge(arr: number[], left: number, mid: number, right: number) {
    const leftArr = arr.slice(left, mid + 1)
    const rightArr = arr.slice(mid + 1, right + 1)

    let i = 0,
      j = 0,
      k = left

    this.addStep(arr, `🔗 Merging subarrays [${left}..${mid}] and [${mid + 1}..${right}]`, {}, "info")

    while (i < leftArr.length && j < rightArr.length) {
      this.comparisons++
      this.addStep(
        arr,
        `🔍 Comparing ${leftArr[i]} and ${rightArr[j]}`,
        {
          comparing: [k],
        },
        "comparison",
      )

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i]
        this.addStep(
          arr,
          `📍 Placed ${leftArr[i]} at position ${k}`,
          {
            comparing: [k],
          },
          "info",
        )
        i++
      } else {
        arr[k] = rightArr[j]
        this.addStep(
          arr,
          `📍 Placed ${rightArr[j]} at position ${k}`,
          {
            comparing: [k],
          },
          "info",
        )
        j++
      }
      k++
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i]
      this.addStep(arr, `📍 Placed remaining element ${leftArr[i]} at position ${k}`, {}, "info")
      i++
      k++
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j]
      this.addStep(arr, `📍 Placed remaining element ${rightArr[j]} at position ${k}`, {}, "info")
      j++
      k++
    }
  }

  private quickSort(arr: number[], low: number, high: number) {
    if (low < high) {
      const pi = this.partition(arr, low, high)
      this.addStep(arr, `🎯 Pivot ${arr[pi]} is now in correct position ${pi}`, {}, "info")

      this.quickSort(arr, low, pi - 1)
      this.quickSort(arr, pi + 1, high)
    }
  }

  private partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high]
    let i = low - 1

    this.addStep(
      arr,
      `🎯 Partitioning with pivot ${pivot} at position ${high}`,
      {
        comparing: [high],
      },
      "info",
    )

    for (let j = low; j < high; j++) {
      this.comparisons++
      this.addStep(
        arr,
        `🔍 Comparing ${arr[j]} with pivot ${pivot}`,
        {
          comparing: [j, high],
        },
        "comparison",
      )

      if (arr[j] < pivot) {
        i++
        if (i !== j) {
          // ACTUAL SWAP HAPPENING
          const temp1 = arr[i]
          const temp2 = arr[j]
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          this.swaps++
          this.addStep(
            arr,
            `🔄 SWAPPED ${temp1} and ${temp2} (positions ${i} and ${j})`,
            {
              swapping: [i, j],
            },
            "swap",
          )
        }
      }
    }

    // ACTUAL SWAP HAPPENING - placing pivot
    const temp1 = arr[i + 1]
    const temp2 = arr[high]
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    this.swaps++
    this.addStep(
      arr,
      `🔄 SWAPPED pivot ${temp2} with ${temp1} (positions ${i + 1} and ${high})`,
      {
        swapping: [i + 1, high],
      },
      "swap",
    )

    return i + 1
  }

  private heapSort(arr: number[]) {
    const n = arr.length
    this.addStep(arr, "🏗️ Starting Heap Sort - Building max heap", {}, "info")

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(arr, n, i)
    }

    this.addStep(arr, "✅ Max heap built successfully", {}, "info")

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // ACTUAL SWAP HAPPENING
      const temp1 = arr[0]
      const temp2 = arr[i]
      ;[arr[0], arr[i]] = [arr[i], arr[0]]
      this.swaps++
      this.addStep(
        arr,
        `🔄 SWAPPED maximum ${temp1} with ${temp2} (positions 0 and ${i})`,
        {
          swapping: [0, i],
          sorted: [i],
        },
        "swap",
      )

      this.heapify(arr, i, 0)
    }

    this.addStep(
      arr,
      "🎉 Heap Sort completed!",
      {
        sorted: Array.from({ length: n }, (_, i) => i),
      },
      "info",
    )
  }

  private heapify(arr: number[], n: number, i: number) {
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    if (left < n) {
      this.comparisons++
      this.addStep(
        arr,
        `🔍 Comparing parent ${arr[i]} with left child ${arr[left]}`,
        {
          comparing: [i, left],
        },
        "comparison",
      )
      if (arr[left] > arr[largest]) {
        largest = left
      }
    }

    if (right < n) {
      this.comparisons++
      this.addStep(
        arr,
        `🔍 Comparing ${arr[largest]} with right child ${arr[right]}`,
        {
          comparing: [largest, right],
        },
        "comparison",
      )
      if (arr[right] > arr[largest]) {
        largest = right
      }
    }

    if (largest !== i) {
      // ACTUAL SWAP HAPPENING
      const temp1 = arr[i]
      const temp2 = arr[largest]
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      this.swaps++
      this.addStep(
        arr,
        `🔄 SWAPPED ${temp1} and ${temp2} (positions ${i} and ${largest}) - Heapifying`,
        {
          swapping: [i, largest],
        },
        "swap",
      )
      this.heapify(arr, n, largest)
    }
  }

  private getMetrics(): SortingMetrics {
    const complexities = {
      bubble: { time: "O(n²)", space: "O(1)" },
      selection: { time: "O(n²)", space: "O(1)" },
      insertion: { time: "O(n²)", space: "O(1)" },
      merge: { time: "O(n log n)", space: "O(n)" },
      quick: { time: "O(n log n)", space: "O(log n)" },
      heap: { time: "O(n log n)", space: "O(1)" },
    }

    const complexity = complexities[this.algorithm as keyof typeof complexities] || { time: "O(n²)", space: "O(1)" }

    return {
      comparisons: this.comparisons,
      swaps: this.swaps,
      timeComplexity: complexity.time,
      spaceComplexity: complexity.space,
    }
  }
}
