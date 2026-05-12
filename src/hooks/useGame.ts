import { useState, useCallback, useEffect, useRef } from 'react'
import { Card, Prediction, GameState } from '@/types'
import { createDeck, shuffleDeck, compareCards } from '@/lib/deck'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth'
import { User } from '@supabase/supabase-js'

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
  const { user } = useAuth()
  const supabase = createClient()
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
  const [activeGameId, setActiveGameId] = useState<string | null>(null)
  const userRef = useRef<User | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    userRef.current = user
  }, [user])

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const initGame = async () => {
      if (!userRef.current) {
        const deck = shuffleDeck(createDeck())
        setGameState({
          deck,
          currentCardIndex: 0,
          misses: 0,
          isGameOver: false,
          prediction: null
        })
        setIsHydrated(true)
        return
      }

      const { data: bestGame } = await supabase
        .from('games')
        .select('misses')
        .eq('user_id', userRef.current.id)
        .eq('game_status', 'completed')
        .order('misses', { ascending: true })
        .limit(1)
        .maybeSingle()

      if (bestGame) {
        setHighScore(bestGame.misses)
      }

      const { data: existingGame } = await supabase
        .from('games')
        .select('id, deck, current_card_index, misses, game_status')
        .eq('user_id', userRef.current.id)
        .eq('game_status', 'in_progress')
        .limit(1)
        .maybeSingle()

      if (existingGame) {
        setActiveGameId(existingGame.id)
        setGameState({
          deck: existingGame.deck as Card[],
          currentCardIndex: existingGame.current_card_index,
          misses: existingGame.misses,
          isGameOver: false,
          prediction: null
        })
      } else {
        const deck = shuffleDeck(createDeck())
        const { data: newGame } = await supabase
          .from('games')
          .insert({
            user_id: userRef.current.id,
            deck: deck,
            current_card_index: 0,
            misses: 0,
            game_status: 'in_progress',
            total_cards: 40
          })
          .select('id')
          .single()

        if (newGame) {
          setActiveGameId(newGame.id)
        }

        setGameState({
          deck,
          currentCardIndex: 0,
          misses: 0,
          isGameOver: false,
          prediction: null
        })
      }

      setIsHydrated(true)
    }

    initGame()
  }, [supabase])

  const currentCard = gameState.deck[gameState.currentCardIndex] || null
  const nextCard = gameState.deck[gameState.currentCardIndex + 1] || null
  const isGameOver = gameState.isGameOver || (!nextCard && gameState.deck.length > 0)

  const makePrediction = useCallback(async (prediction: Prediction) => {
    if (!nextCard || isGameOver) return

    const result = compareCards(currentCard, nextCard)
    const isCorrect = result === prediction

    setGameResult({ isCorrect, prediction, result })
    setTimeout(() => setGameResult(null), 1500)

    const currentMisses = gameState.misses
    const nextIndex = gameState.currentCardIndex + 1
    const deckLength = gameState.deck.length
    const willBeGameOver = nextIndex >= deckLength - 1
    const newMisses = isCorrect ? currentMisses : currentMisses + 1
    const shouldUpdateHighScore = highScore !== null && newMisses < highScore
    
    if (shouldUpdateHighScore) {
      setHighScore(newMisses)
    }

    setGameState(prev => ({
      ...prev,
      currentCardIndex: nextIndex,
      misses: newMisses,
      isGameOver: willBeGameOver,
      prediction: prediction
    }))

    if (userRef.current && activeGameId) {
      const updates: Record<string, unknown> = {
        current_card_index: nextIndex,
        misses: newMisses,
        updated_at: new Date().toISOString()
      }

      if (willBeGameOver) {
        updates.game_status = 'completed'
        updates.completed_at = new Date().toISOString()

        const { data: bestGame } = await supabase
          .from('games')
          .select('misses')
          .eq('user_id', userRef.current.id)
          .eq('game_status', 'completed')
          .order('misses', { ascending: true })
          .limit(1)
          .maybeSingle()

        if (!bestGame || newMisses < bestGame.misses) {
          setHighScore(newMisses)
        }
      }

      await supabase
        .from('games')
        .update(updates)
        .eq('id', activeGameId)

      if (willBeGameOver) {
        setActiveGameId(null)
      }
    }
  }, [nextCard, isGameOver, currentCard, gameState.misses, gameState.currentCardIndex, gameState.deck.length, highScore, supabase, activeGameId])

  const startNewGame = useCallback(async () => {
    const newDeck = shuffleDeck(createDeck())
    
    if (userRef.current) {
      if (activeGameId) {
        await supabase
          .from('games')
          .update({
            game_status: 'abandoned',
            updated_at: new Date().toISOString()
          })
          .eq('id', activeGameId)
      }

      const { data: newGame } = await supabase
        .from('games')
        .insert({
          user_id: userRef.current.id,
          deck: newDeck,
          current_card_index: 0,
          misses: 0,
          game_status: 'in_progress',
          total_cards: 40
        })
        .select('id')
        .single()

      if (newGame) {
        setActiveGameId(newGame.id)
      }
    }

    setGameState({
      deck: newDeck,
      currentCardIndex: 0,
      misses: 0,
      isGameOver: false,
      prediction: null
    })
    setGameResult(null)
  }, [supabase, activeGameId])

  const abandonGame = useCallback(async () => {
    if (userRef.current && activeGameId) {
      await supabase
        .from('games')
        .update({
          game_status: 'abandoned',
          updated_at: new Date().toISOString()
        })
        .eq('id', activeGameId)
      setActiveGameId(null)
    }

    setGameState({
      deck: [],
      currentCardIndex: 0,
      misses: 0,
      isGameOver: true,
      prediction: null
    })
  }, [supabase, activeGameId])

  return {
    currentCard,
    nextCard,
    misses: gameState.misses,
    isGameOver,
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