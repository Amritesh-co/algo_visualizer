"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SortingVisualizer } from "@/components/visualizers/sorting-visualizer"
import { PathfindingVisualizer } from "@/components/visualizers/pathfinding-visualizer"
import { GraphVisualizer } from "@/components/visualizers/graph-visualizer"
import { DPVisualizer } from "@/components/visualizers/dp-visualizer"
import { NQueensVisualizer } from "@/components/visualizers/nqueens-visualizer"

function VisualizersContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("sorting")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["sorting", "pathfinding", "graph", "dp", "nqueens"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="sorting">Sorting</TabsTrigger>
        <TabsTrigger value="pathfinding">Pathfinding</TabsTrigger>
        <TabsTrigger value="graph">Graph</TabsTrigger>
        <TabsTrigger value="dp">Dynamic Programming</TabsTrigger>
        <TabsTrigger value="nqueens">N-Queens</TabsTrigger>
      </TabsList>

      <TabsContent value="sorting" className="mt-6">
        <SortingVisualizer />
      </TabsContent>

      <TabsContent value="pathfinding" className="mt-6">
        <PathfindingVisualizer />
      </TabsContent>

      <TabsContent value="graph" className="mt-6">
        <GraphVisualizer />
      </TabsContent>

      <TabsContent value="dp" className="mt-6">
        <DPVisualizer />
      </TabsContent>

      <TabsContent value="nqueens" className="mt-6">
        <NQueensVisualizer />
      </TabsContent>
    </Tabs>
  )
}

export function VisualizersPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Algorithm Visualizers
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interactive visualizations to help you understand how algorithms work step by step.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <div className="text-lg text-muted-foreground">Loading visualizers...</div>
          </div>
        }
      >
        <VisualizersContent />
      </Suspense>
    </div>
  )
}
