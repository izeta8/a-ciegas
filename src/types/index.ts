export type Suit = 'oros' | 'copas' | 'espadas' | 'bastos'

export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12

export interface Card {
  value: CardValue
  suit: Suit
}

export type Prediction = 'mayor' | 'menor' | 'igual'

export interface GameState {
  deck: Card[]
  currentCardIndex: number
  misses: number
  isGameOver: boolean
  prediction: Prediction | null
}

export interface GameResult {
  misses: number
  totalCards: number
  completedAt: Date
}