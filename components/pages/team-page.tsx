"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, GraduationCap, Cpu, Binary, Terminal, Users, BookOpen, Star } from "lucide-react"

const teamMembers = [
  {
    name: "AMRITESH SAHU",
    usn: "1RV23CD006",
  },
  {
    name: "SANIKA P",
    usn: "1RV24CD404",
  },
  {
    name: "YOGEETHA M",
    usn: "1RV24CD405",
  },
  
]

const faculty = {
  name: "Dr.Chethana R. Murthy",
  designation: "Associate Professor",
  department: "Computer Science Engineering",
}

export function TeamPage() {
  return (
    <div className="space-y-16 relative">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <motion.section
        className="text-center space-y-6 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent relative"
          animate={{
            textShadow: [
              "0 0 20px rgba(59, 130, 246, 0.5)",
              "0 0 30px rgba(147, 51, 234, 0.5)",
              "0 0 20px rgba(6, 182, 212, 0.5)",
              "0 0 20px rgba(59, 130, 246, 0.5)",
            ],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          Meet Our Team
        </motion.h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Computer Science and Data Science Engineering students from RV College of Engineering, driven by a passion for building innovative and intuitive algorithm visualization tools that enhance understanding and learning.
        </p>
      </motion.section>

      {/* Faculty Guide */}
      <motion.section
        className="text-center space-y-8 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-300">Under the guidance of</h2>
          <motion.div
            className="w-24 h-0.5 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto"
            animate={{
              boxShadow: [
                "0 0 10px rgba(16, 185, 129, 0.5)",
                "0 0 20px rgba(16, 185, 129, 0.8)",
                "0 0 10px rgba(16, 185, 129, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <motion.div className="flex justify-center" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
          <Card className="w-full max-w-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-0 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
            {/* Neon border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-lg p-[2px] group-hover:p-[3px] transition-all duration-300">
              <div className="h-full w-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-lg" />
            </div>

            {/* Animated glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />

            <CardContent className="relative z-10 p-8 text-center space-y-6">
              {/* Faculty Icon with neon effect */}
              <motion.div
                className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg relative"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(16, 185, 129, 0.5)",
                      "0 0 40px rgba(16, 185, 129, 0.8)",
                      "0 0 20px rgba(16, 185, 129, 0.5)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                <BookOpen className="h-10 w-10 text-white relative z-10" />
              </motion.div>

              <div className="space-y-4">
                <motion.h3
                  className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(16, 185, 129, 0.5)",
                      "0 0 20px rgba(16, 185, 129, 0.8)",
                      "0 0 10px rgba(16, 185, 129, 0.5)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  {faculty.name}
                </motion.h3>

                <div className="space-y-3">
                  <motion.div
                    className="inline-block px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20 relative"
                    whileHover={{
                      boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
                      borderColor: "rgba(16, 185, 129, 0.6)",
                    }}
                  >
                    <span className="text-emerald-400 font-medium">{faculty.designation}</span>
                  </motion.div>

                  <div className="block">
                    <span className="text-slate-400 text-lg">{faculty.department}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.section>

      {/* Team Grid */}
      <motion.section
        className="space-y-8 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-slate-300">Development Team</h2>
          <motion.div
            className="w-24 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto"
            animate={{
              boxShadow: [
                "0 0 10px rgba(59, 130, 246, 0.5)",
                "0 0 20px rgba(147, 51, 234, 0.8)",
                "0 0 10px rgba(59, 130, 246, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="group"
            >
              <Card className="h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-0 backdrop-blur-sm shadow-xl relative overflow-hidden">
                {/* Neon border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg p-[2px] group-hover:p-[3px] transition-all duration-300">
                  <div className="h-full w-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-lg" />
                </div>

                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.4, 0.2],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                />

                {/* Scanning line effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent h-1 opacity-0 group-hover:opacity-100"
                  animate={{
                    y: [0, 300, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                <CardContent className="relative z-10 p-8 text-center space-y-6">
                  {/* Tech Icon with neon effect */}
                  <motion.div
                    className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg relative"
                    whileHover={{ rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
                      animate={{
                        boxShadow: [
                          "0 0 15px rgba(59, 130, 246, 0.5)",
                          "0 0 30px rgba(147, 51, 234, 0.8)",
                          "0 0 15px rgba(59, 130, 246, 0.5)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                    />
                    {index % 4 === 0 && <Code className="h-8 w-8 text-white relative z-10" />}
                    {index % 4 === 1 && <Cpu className="h-8 w-8 text-white relative z-10" />}
                    {index % 4 === 2 && <Binary className="h-8 w-8 text-white relative z-10" />}
                    {index % 4 === 3 && <Terminal className="h-8 w-8 text-white relative z-10" />}
                  </motion.div>

                  <div className="space-y-4">
                    <motion.h3
                      className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                      animate={{
                        textShadow: [
                          "0 0 10px rgba(59, 130, 246, 0.3)",
                          "0 0 20px rgba(147, 51, 234, 0.6)",
                          "0 0 10px rgba(59, 130, 246, 0.3)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                    >
                      {member.name}
                    </motion.h3>

                    <div className="space-y-3">
                      <motion.div
                        className="inline-block px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 relative"
                        whileHover={{
                          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                          borderColor: "rgba(59, 130, 246, 0.6)",
                        }}
                      >
                        <span className="text-blue-400 font-mono text-sm">{member.usn}</span>
                      </motion.div>

                      <div className="block">
                        <span className="text-purple-400 font-medium">Computer Science with Data Science  Engineering</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated tech pattern */}
                  <motion.div
                    className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(9)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-1 bg-blue-400 rounded-full"
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>

                  {/* Floating particles */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-60"
                        style={{
                          left: `${20 + i * 30}%`,
                          top: `${30 + (i % 2) * 40}%`,
                        }}
                        animate={{
                          y: [-10, -20, -10],
                          x: [-5, 5, -5],
                          opacity: [0, 0.6, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.5,
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* College Information */}
      <motion.section
        className="text-center space-y-8 py-16 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <Card className="max-w-5xl mx-auto bg-gradient-to-br from-slate-800/30 to-slate-900/30 border-0 backdrop-blur-sm relative overflow-hidden group">
          {/* Neon border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-lg p-[2px] group-hover:p-[3px] transition-all duration-300">
            <div className="h-full w-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-lg" />
          </div>

          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-lg blur-2xl"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          />

          <CardContent className="relative z-10 p-12 space-y-8">
            <motion.div
              className="flex justify-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg relative"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                    "0 0 40px rgba(147, 51, 234, 0.8)",
                    "0 0 20px rgba(59, 130, 246, 0.5)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                <GraduationCap className="h-12 w-12 text-white" />
              </motion.div>
            </motion.div>

            <motion.h2
              className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              animate={{
                textShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 30px rgba(147, 51, 234, 0.6)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              RV College of Engineering
            </motion.h2>

            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
              We are <span className="text-blue-400 font-semibold">Computer Science- Data Science Engineering</span> students from{" "}
              <span className="text-purple-400 font-semibold">RV College of Engineering</span>, guided by{" "}
              <span className="text-emerald-400 font-semibold">Dr.Chethana R. Murthy</span>. Together, we've created this
              comprehensive algorithm visualization platform to make complex algorithms accessible and understandable
              for students and educators worldwide.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              {[
                { label: "Team Members", value: "3", color: "text-blue-400", icon: Users },
                { label: "Department", value: "CD", color: "text-purple-400", icon: Code },
                { label: "Batch", value: "2027", color: "text-green-400", icon: GraduationCap },
                { label: "College", value: "RVCE", color: "text-yellow-400", icon: Star },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-6 rounded-lg bg-slate-800/30 border border-slate-700/30 relative overflow-hidden group"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {/* Neon border for stats */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
                  />

                  <div className="relative z-10">
                    <div className="flex justify-center mb-3">
                      <motion.div
                        animate={{
                          boxShadow: [
                            `0 0 10px ${
                              stat.color.includes("blue")
                                ? "rgba(59, 130, 246, 0.5)"
                                : stat.color.includes("purple")
                                  ? "rgba(147, 51, 234, 0.5)"
                                  : stat.color.includes("green")
                                    ? "rgba(34, 197, 94, 0.5)"
                                    : "rgba(234, 179, 8, 0.5)"
                            }`,
                            `0 0 20px ${
                              stat.color.includes("blue")
                                ? "rgba(59, 130, 246, 0.8)"
                                : stat.color.includes("purple")
                                  ? "rgba(147, 51, 234, 0.8)"
                                  : stat.color.includes("green")
                                    ? "rgba(34, 197, 94, 0.8)"
                                    : "rgba(234, 179, 8, 0.8)"
                            }`,
                            `0 0 10px ${
                              stat.color.includes("blue")
                                ? "rgba(59, 130, 246, 0.5)"
                                : stat.color.includes("purple")
                                  ? "rgba(147, 51, 234, 0.5)"
                                  : stat.color.includes("green")
                                    ? "rgba(34, 197, 94, 0.5)"
                                    : "rgba(234, 179, 8, 0.5)"
                            }`,
                          ],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                      >
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </motion.div>
                    </div>
                    <div className={`text-2xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.section>
    </div>
  )
}
