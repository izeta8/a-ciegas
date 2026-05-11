"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { XCircle, Trophy } from "lucide-react"

interface ScoreDisplayProps {
  misses: number
  cardsRemaining: number
  totalCards: number
  highScore: number | null
  gameResult?: { isCorrect: boolean } | null
  isGameOver: boolean
}

export function ScoreDisplay({ misses, cardsRemaining, totalCards, highScore, gameResult, isGameOver }: ScoreDisplayProps) {
  const progress = ((totalCards - cardsRemaining) / totalCards) * 100

  return (
    <div className="space-y-4 text-center">
      <div className="flex justify-center gap-8">
        <div className="flex flex-col items-center">
          <span className="text-sm text-slate-500">Fallas</span>
          <motion.div
            key={misses}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 text-3xl font-bold text-red-500"
          >
            <XCircle className="w-6 h-6" />
            {misses}
          </motion.div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-sm text-slate-500">Cartas</span>
          <div className="text-3xl font-bold text-slate-700">
            {totalCards - cardsRemaining}/{totalCards}
          </div>
        </div>

        {highScore !== null && (
          <div className="flex flex-col items-center">
            <span className="text-sm text-slate-500">Mejor</span>
            <div className="flex items-center gap-1 text-3xl font-bold text-yellow-600">
              <Trophy className="w-6 h-6" />
              {highScore}
            </div>
          </div>
        )}
      </div>

      <Progress value={progress} className="w-full max-w-md mx-auto" />

      <AnimatePresence>
        {gameResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-2xl font-bold ${gameResult.isCorrect ? 'text-green-500' : 'text-red-500'}`}
          >
            {gameResult.isCorrect ? 'Correcto!' : 'Falla!'}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-6 bg-slate-900 text-white rounded-xl"
          >
            <h2 className="text-3xl font-bold mb-2">Juego Terminado</h2>
            <p className="text-xl">
              Fallas totales: <span className="text-yellow-400 font-bold">{misses}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}