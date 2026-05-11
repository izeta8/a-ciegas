import { useState, useCallback, useEffect } from 'react'
import { Card, Prediction, GameState } from '@/types'
import { createDeck, shuffleDeck, compareCards } from '@/lib/deck'

const STORAGE_KEY = 'aciegas_highscore'

interface UseGameReturn {
  currentCard: Card | null
  nextCard: Card | null
  misses: number
  isGameOver: boolean
  cardsRemaining: number
  totalCards: number
  highScore: number | null
  makePrediction: (prediction: Prediction) => void
  startNewGame: () => void
  abandonGame: () => void
  gameResult: { isCorrect: boolean; prediction: Prediction; result: 'mayor' | 'menor' | 'igual' } | null
  isHydrated: boolean
}

export function useGame(): UseGameReturn {
  const [isHydrated, setIsHydrated] = useState(false)
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    currentCardIndex: 0,
    misses: 0,
    isGameOver: false,
    prediction: null
  })
  const [highScore, setHighScore] = useState<number | null>(null)
  const [gameResult, setGameResult] = useState<{ isCorrect: boolean; prediction: Prediction; result: 'mayor' | 'menor' | 'igual' } | null>(null)

  useEffect(() => {
    const deck = shuffleDeck(createDeck())
    setGameState({
      deck,
      currentCardIndex: 0,
      misses: 0,
      isGameOver: false,
      prediction: null
    })
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setHighScore(parseInt(stored, 10))
    
    setIsHydrated(true)
  }, [])

  const currentCard = gameState.deck[gameState.currentCardIndex] || null
  const nextCard = gameState.deck[gameState.currentCardIndex + 1] || null

  useEffect(() => {
    if (!nextCard && gameState.deck.length > 0 && !gameState.isGameOver) {
      setGameState(prev => ({ ...prev, isGameOver: true }))
    }
  }, [nextCard, gameState.deck.length, gameState.isGameOver])

  const makePrediction = useCallback((prediction: Prediction) => {
    if (!nextCard || gameState.isGameOver) return

    const result = compareCards(currentCard, nextCard)
    const isCorrect = result === prediction

    setGameResult({ isCorrect, prediction, result })
    setTimeout(() => setGameResult(null), 1500)

    setGameState(prev => {
      const newMisses = isCorrect ? prev.misses : prev.misses + 1
      const nextIndex = prev.currentCardIndex + 1
      const isGameOver = nextIndex >= prev.deck.length

      if (!isCorrect && newMisses < (highScore ?? Infinity)) {
        setHighScore(newMisses)
        localStorage.setItem(STORAGE_KEY, String(newMisses))
      }

      return {
        ...prev,
        currentCardIndex: nextIndex,
        misses: newMisses,
        isGameOver,
        prediction: prediction
      }
    })
  }, [nextCard, currentCard, gameState.isGameOver, highScore])

  const startNewGame = useCallback(() => {
    setGameState({
      deck: shuffleDeck(createDeck()),
      currentCardIndex: 0,
      misses: 0,
      isGameOver: false,
      prediction: null
    })
    setGameResult(null)
  }, [])

  const abandonGame = useCallback(() => {
    setGameState({
      deck: [],
      currentCardIndex: 0,
      misses: 0,
      isGameOver: true,
      prediction: null
    })
  }, [])

  return {
    currentCard,
    nextCard,
    misses: gameState.misses,
    isGameOver: gameState.isGameOver,
    cardsRemaining: gameState.deck.length - gameState.currentCardIndex - 1,
    totalCards: gameState.deck.length,
    highScore,
    makePrediction,
    startNewGame,
    abandonGame,
    gameResult,
    isHydrated
  }
}