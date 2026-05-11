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
    <main className="min-h-screen bg-background flex flex-col px-4 py-6 sm:items-center sm:justify-center sm:py-8">
      <div className="w-full sm:max-w-lg space-y-6">
        <header className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">A Ciegas</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Adivina si la siguiente carta es Mayor, Menor o Igual</p>
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
              className="font-semibold"
            >
              <RotateCcw className="size-4" />
              Nueva Partida
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
