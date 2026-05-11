"use client"

import { useGame } from "@/hooks/useGame"
import { CardTable } from "@/components/CardTable"
import { PredictionButtons } from "@/components/PredictionButtons"
import { ScoreDisplay } from "@/components/ScoreDisplay"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export default function GamePage() {
  const {
    currentCard,
    nextCard,
    misses,
    isGameOver,
    cardsRemaining,
    totalCards,
    highScore,
    makePrediction,
    startNewGame,
    gameResult
  } = useGame()

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">A Ciegas</h1>
          <p className="text-slate-400">Adivina si la siguiente carta es Mayor, Menor o Igual</p>
        </header>

        <CardTable
          currentCard={currentCard}
          nextCard={nextCard}
          showNext={!isGameOver}
        />

        <PredictionButtons
          onPredict={makePrediction}
          disabled={isGameOver || !nextCard}
        />

        <ScoreDisplay
          misses={misses}
          cardsRemaining={cardsRemaining}
          totalCards={totalCards}
          highScore={highScore}
          gameResult={gameResult}
          isGameOver={isGameOver}
        />

        {isGameOver && (
          <div className="flex justify-center">
            <Button
              onClick={startNewGame}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Nueva Partida
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}