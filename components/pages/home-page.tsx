"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowRight, Sparkles, Code, BarChart3, Network, TreePine, Crown } from "lucide-react"
import { GalaxyBackground } from "@/components/effects/galaxy-background"

export function HomePage() {
  const [currentAlgorithm, setCurrentAlgorithm] = useState(0)

  const algorithms = [
    { name: "Bubble Sort", color: "from-blue-500 to-cyan-500" },
    { name: "Quick Sort", color: "from-purple-500 to-pink-500" },
    { name: "Dijkstra's Algorithm", color: "from-green-500 to-emerald-500" },
    { name: "BFS Traversal", color: "from-orange-500 to-red-500" },
    { name: "Dynamic Programming", color: "from-indigo-500 to-purple-500" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlgorithm((prev) => (prev + 1) % algorithms.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [algorithms.length])

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Sorting Algorithms",
      description: "Visualize sorting algorithms with real-time comparisons",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: "Pathfinding",
      description: "Interactive grid-based pathfinding visualization",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <TreePine className="w-6 h-6" />,
      title: "Graph Algorithms",
      description: "Dynamic graph traversal and shortest path algorithms",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "N-Queens Problem",
      description: "Backtracking algorithm with interactive chess board",
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Galaxy Background */}
      <GalaxyBackground />

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Badge className="px-4 py-2 text-sm bg-white/10 border-white/20 text-white backdrop-blur-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Interactive Learning Platform
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="text-white">Algorithm</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Visualizer
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-8"
          >
            <p className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto">
              Transform complex algorithms into
            </p>
            <div className="text-2xl md:text-3xl font-semibold h-12 flex items-center justify-center">
              <motion.span
                key={currentAlgorithm}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`bg-gradient-to-r ${algorithms[currentAlgorithm].color} bg-clip-text text-transparent`}
                transition={{ duration: 0.5 }}
              >
                {algorithms[currentAlgorithm].name}
              </motion.span>
            </div>
            <p className="text-xl md:text-2xl text-gray-300 mt-6">beautiful visual experiences</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/visualizers">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Visualizing
              </Button>
            </Link>

            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 font-medium px-8 py-3 text-lg rounded-full backdrop-blur-sm"
              >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-wrap justify-center gap-8 text-center"
          >
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                15+
              </div>
              <div className="text-gray-300 text-sm">Algorithms</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                5
              </div>
              <div className="text-gray-300 text-sm">Categories</div>
            </div>
            <div className="group">
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <div className="text-gray-300 text-sm">Interactive</div>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mb-20"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">What You Can Explore</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Dive deep into different algorithm categories with interactive visualizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 shadow-xl">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Start Learning?</h2>
              <p className="text-lg text-gray-300 mb-8">
                Join thousands of students mastering algorithms through interactive visualization
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/visualizers">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-10 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Code className="w-5 h-5 mr-2" />
                    Explore Algorithms
                  </Button>
                </Link>

                <Link href="/team">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 font-medium px-10 py-4 text-lg rounded-full backdrop-blur-sm"
                  >
                    Meet the Team
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}
