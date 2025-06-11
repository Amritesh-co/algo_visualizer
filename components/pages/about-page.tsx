"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Code,
  Terminal,
  Cpu,
  Database,
  Zap,
  BarChart3,
  Network,
  Crown,
  TreePine,
  Activity,
  Layers,
  GitBranch,
  ChevronRight,
  Play,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { GalaxyBackground } from "@/components/effects/galaxy-background"

export function AboutPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  // Scroll animations
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8])

  // Refs for scroll animations
  const featuresRef = useRef<HTMLElement>(null)
  const implementationRef = useRef<HTMLElement>(null)

  // Feature cards data
  const featureCards = [
    {
      title: "Sorting Algorithms",
      description: "Visualize bubble sort, quick sort, merge sort with real-time comparisons and performance metrics",
      icon: <BarChart3 className="h-8 w-8" />,
      gradient: "from-blue-500 to-cyan-500",
      details: [
        "Real-time swap visualization",
        "Performance metrics tracking",
        "Step-by-step execution",
        "Multiple algorithm comparison",
      ],
    },
    {
      title: "Pathfinding Algorithms",
      description: "Interactive grid-based visualization of BFS, DFS, and Dijkstra's algorithm with obstacle placement",
      icon: <Network className="h-8 w-8" />,
      gradient: "from-purple-500 to-pink-500",
      details: [
        "Interactive grid manipulation",
        "Real-time path discovery",
        "Dynamic obstacle placement",
        "Algorithm comparison tools",
      ],
    },
    {
      title: "Graph Algorithms",
      description: "Dynamic network graphs showing traversal algorithms and shortest path calculations",
      icon: <TreePine className="h-8 w-8" />,
      gradient: "from-green-500 to-emerald-500",
      details: ["Network visualization", "Matrix representation", "Path highlighting", "Weight adjustment"],
    },
    {
      title: "Dynamic Programming",
      description: "Step-by-step visualization of DP problems with memoization tables and dependency tracking",
      icon: <Database className="h-8 w-8" />,
      gradient: "from-orange-500 to-red-500",
      details: [
        "Memoization table display",
        "Dependency visualization",
        "Step-by-step breakdown",
        "Pattern recognition",
      ],
    },
    {
      title: "N-Queens Problem",
      description: "Interactive chess board with backtracking visualization and real-time conflict detection",
      icon: <Crown className="h-8 w-8" />,
      gradient: "from-indigo-500 to-purple-500",
      details: ["Interactive placement", "Conflict visualization", "Backtracking animation", "Solution counting"],
    },
    {
      title: "Performance Analysis",
      description: "Real-time analysis of algorithm performance with complexity visualization and metrics",
      icon: <Activity className="h-8 w-8" />,
      gradient: "from-pink-500 to-rose-500",
      details: [
        "Time complexity analysis",
        "Space complexity tracking",
        "Operation counting",
        "Performance comparison",
      ],
    },
  ]

  // Implementation tabs data
  const implementationTabs = [
    {
      id: "frontend",
      label: "Frontend",
      icon: <Code className="h-4 w-4" />,
      content: [
        {
          title: "Core Technologies",
          items: [
            "Next.js 14 with App Router",
            "TypeScript for type safety",
            "Tailwind CSS for styling",
            "Framer Motion for animations",
          ],
          icon: <Code className="h-8 w-8 text-blue-400" />,
        },
        {
          title: "State Management",
          items: [
            "Zustand for global state",
            "React hooks for local state",
            "Custom stores per algorithm",
            "Persistent state management",
          ],
          icon: <Database className="h-8 w-8 text-green-400" />,
        },
        {
          title: "UI Components",
          items: [
            "Shadcn/ui component library",
            "Custom algorithm visualizers",
            "Interactive control panels",
            "Responsive design system",
          ],
          icon: <Layers className="h-8 w-8 text-purple-400" />,
        },
      ],
    },
    {
      id: "algorithms",
      label: "Algorithms",
      icon: <Cpu className="h-4 w-4" />,
      content: [
        {
          title: "Sorting Algorithms",
          items: [
            "Bubble Sort with optimization",
            "Quick Sort with pivot selection",
            "Merge Sort with divide-conquer",
            "Heap Sort with visualization",
          ],
          icon: <BarChart3 className="h-8 w-8 text-blue-400" />,
        },
        {
          title: "Graph Algorithms",
          items: [
            "Breadth-First Search (BFS)",
            "Depth-First Search (DFS)",
            "Dijkstra's shortest path",
            "Floyd-Warshall all-pairs",
          ],
          icon: <Network className="h-8 w-8 text-green-400" />,
        },
        {
          title: "Advanced Algorithms",
          items: [
            "Dynamic Programming solutions",
            "Backtracking with N-Queens",
            "Greedy algorithm implementations",
            "Divide and conquer strategies",
          ],
          icon: <Zap className="h-8 w-8 text-purple-400" />,
        },
      ],
    },
    {
      id: "visualization",
      label: "Visualization",
      icon: <Activity className="h-4 w-4" />,
      content: [
        {
          title: "Animation System",
          items: [
            "Step-by-step execution",
            "Smooth transition animations",
            "Real-time state updates",
            "Interactive speed controls",
          ],
          icon: <Activity className="h-8 w-8 text-blue-400" />,
        },
        {
          title: "Visual Elements",
          items: [
            "Color-coded algorithm states",
            "Dynamic chart animations",
            "Interactive grid systems",
            "Network graph visualizations",
          ],
          icon: <GitBranch className="h-8 w-8 text-green-400" />,
        },
        {
          title: "User Interaction",
          items: [
            "Drag and drop interfaces",
            "Real-time parameter adjustment",
            "Custom input validation",
            "Interactive algorithm controls",
          ],
          icon: <Terminal className="h-8 w-8 text-purple-400" />,
        },
      ],
    },
  ]

  // Scroll to section function
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Galaxy Background */}
      <GalaxyBackground />

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.section
          style={{ opacity }}
          className="text-center mb-32"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="px-4 py-2 text-sm bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              About the Project
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="text-white">Algorithm</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Visualizer
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-10"
          >
            An interactive platform that transforms complex algorithms into beautiful, understandable visualizations.
            Learn, explore, and master data structures and algorithms through immersive visual experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              onClick={() => scrollToSection(featuresRef)}
            >
              Explore Features
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 font-medium px-8 py-3 text-lg rounded-full backdrop-blur-sm"
              onClick={() => scrollToSection(implementationRef)}
            >
              View Implementation
            </Button>
          </motion.div>
        </motion.section>

        {/* Project Overview */}
        <section className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Project Overview</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Algorithm Visualizer revolutionizes algorithm education through interactive technology, providing
              real-time visualization and comprehensive learning tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                What We Built
              </h3>
              <div className="space-y-4 text-gray-300">
                <p>
                  Algorithm Visualizer is an advanced educational platform designed to make complex algorithms
                  accessible through interactive visualizations. The project transforms abstract algorithmic concepts
                  into engaging visual experiences.
                </p>
                <p>
                  Built with modern web technologies, the platform provides real-time algorithm execution with
                  step-by-step visualization, performance metrics, and interactive controls for comprehensive learning.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Key Objectives
              </h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  "Create interactive visualizations for major algorithm categories",
                  "Provide real-time performance metrics and complexity analysis",
                  "Enable hands-on learning through interactive controls",
                  "Support educational institutions with comprehensive tools",
                  "Build scalable platform for future algorithm additions",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} id="features" className="mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Key Features</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Comprehensive algorithm visualization modules with advanced interactive capabilities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">{feature.description}</p>

                <AnimatePresence>
                  {hoveredFeature === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ul className="space-y-1">
                        {feature.details.map((detail, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center gap-2 text-xs text-gray-400"
                          >
                            <div className="w-1 h-1 bg-blue-400 rounded-full" />
                            {detail}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Implementation Section */}
        <section ref={implementationRef} id="implementation" className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Implementation</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Technical architecture and implementation details of the algorithm visualization system.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Tabs defaultValue="frontend" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-full">
                  {implementationTabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-full"
                    >
                      <div className="flex items-center gap-2">
                        {tab.icon}
                        {tab.label}
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {implementationTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {tab.content.map((section, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          {section.icon}
                          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                        </div>

                        <ul className="space-y-2">
                          {section.items.map((item, j) => (
                            <motion.li
                              key={j}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.1 }}
                              className="flex items-start gap-2 text-sm text-gray-300"
                            >
                              <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                              {item}
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 shadow-xl"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Explore?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Experience the power of algorithm visualization and master data structures through interactive learning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <Play className="w-5 h-5 mr-2" />
                  Start Visualizing
                </Button>

                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 font-medium px-10 py-4 text-lg rounded-full backdrop-blur-sm"
                >
                  View Source Code
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
