# Algo Visualizer

An interactive, browser-based visualizer for classic algorithms. Pick an algorithm, tweak the input, and watch it run step by step.

**Live demo:** https://algo-visualizer-ten-rho.vercel.app

## What it visualizes

| Module | Algorithms |
| --- | --- |
| Sorting | Step-by-step comparison and swap animations |
| Pathfinding | Grid-based shortest-path search |
| Graph | Traversals on user-built graphs |
| Dynamic Programming | Table-filling visualizations |
| N-Queens | Backtracking on an N×N board |

Algorithm logic lives in `lib/algorithms/` (`sorting.ts`, `pathfinding.ts`, `graph.ts`, `dp.ts`, `nqueens.ts`), and each visualizer keeps its state in its own Zustand store under `store/`.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui components
- Zustand for state management
- Light/dark theme with animated backgrounds

## Run locally

```bash
git clone https://github.com/Amritesh-co/algo_visualizer.git
cd algo_visualizer
npm install
npm run dev
```

Then open http://localhost:3000.

## Project structure

```
app/            # routes: home, visualizers, about, team
components/     # page components, effects, layout, ui
lib/algorithms/ # algorithm implementations
store/          # Zustand stores, one per visualizer
types/          # shared TypeScript types
```
