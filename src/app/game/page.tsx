"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGame } from "@/hooks/useGame"
import { CardTable } from "@/components/CardTable"
import { PredictionButtons } from "@/components/PredictionButtons"
import { ScoreDisplay } from "@/components/ScoreDisplay"
import { GameEndModal } from "@/components/GameEndModal"
import { QuitConfirmation } from "@/components/QuitConfirmation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function GamePage() {
  const router = useRouter()
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
    abandonGame,
    gameResult,
    isHydrated
  } = useGame()

  const [showQuitDialog, setShowQuitDialog] = useState(false)
  const [showEndModal, setShowEndModal] = useState(false)

  const handleAbandon = () => {
    setShowQuitDialog(true)
  }

  const confirmAbandon = () => {
    abandonGame()
    setShowQuitDialog(false)
    router.push('/')
  }

  const handleNewGame = () => {
    setShowEndModal(false)
    startNewGame()
  }

  const handleGoHome = () => {
    setShowEndModal(false)
    router.push('/')
  }

  useEffect(() => {
    if (isGameOver && totalCards > 0 && cardsRemaining <= 0) {
      const timer = setTimeout(() => {
        setShowEndModal(true)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [isGameOver, totalCards, cardsRemaining])

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Cargando...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col px-4 py-4 sm:items-center sm:justify-center sm:py-8">
      <div className="w-full sm:max-w-lg space-y-4">
        <header className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">A Ciegas</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Mayor, Menor o Igual</p>
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

        {isGameOver && totalCards === 40 && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowEndModal(true)}
              size="lg"
              className="font-semibold"
            >
              Ver Resultados
            </Button>
          </div>
        )}

        {!isGameOver && (
          <div className="pt-4">
            <Button variant="ghost" onClick={handleAbandon} className="w-full text-muted-foreground hover:text-foreground">
              <LogOut className="size-4" />
              Salir de la partida
            </Button>
          </div>
        )}
      </div>

      <QuitConfirmation
        open={showQuitDialog}
        onOpenChange={setShowQuitDialog}
        onConfirm={confirmAbandon}
      />

      <GameEndModal
        open={showEndModal}
        onOpenChange={setShowEndModal}
        misses={misses}
        highScore={highScore}
        onNewGame={handleNewGame}
        onGoHome={handleGoHome}
      />
    </main>
  )
}