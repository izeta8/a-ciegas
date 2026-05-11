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
      <div className="flex justify-center gap-6 sm:gap-10">
        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm text-muted-foreground">Fallas</span>
          <motion.div
            key={misses}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 text-2xl sm:text-3xl font-bold"
          >
            <XCircle className="size-5 sm:size-6 text-destructive" />
            {misses}
          </motion.div>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-xs sm:text-sm text-muted-foreground">Cartas</span>
          <div className="text-2xl sm:text-3xl font-bold">
            {totalCards - cardsRemaining}/{totalCards}
          </div>
        </div>

        {highScore !== null && (
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm text-muted-foreground">Mejor</span>
            <div className="flex items-center gap-1 text-2xl sm:text-3xl font-bold text-yellow-600">
              <Trophy className="size-5 sm:size-6" />
              {highScore}
            </div>
          </div>
        )}
      </div>

      <Progress value={progress} className="w-full max-w-xs sm:max-w-md mx-auto h-2" />

      <AnimatePresence>
        {gameResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-lg sm:text-xl font-semibold ${gameResult.isCorrect ? 'text-green-600' : 'text-destructive'}`}
          >
            {gameResult.isCorrect ? 'Correcto!' : 'Falla!'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}