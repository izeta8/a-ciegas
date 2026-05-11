import { Card, CardValue, Suit } from '@/types'

const SUITS: Suit[] = ['oros', 'copas', 'espadas', 'bastos']
const VALUES: CardValue[] = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]

export function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ value, suit })
    }
  }
  return deck
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function compareCards(card1: Card, card2: Card): 'mayor' | 'menor' | 'igual' {
  if (card2.value > card1.value) return 'mayor'
  if (card2.value < card1.value) return 'menor'
  return 'igual'
}

export function getCardImagePath(card: Card): string {
  return `/cards/${card.value}_${card.suit}.png`
}

export function getCardDisplayName(value: CardValue): string {
  const names: Record<CardValue, string> = {
    1: 'As',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    10: 'Sota',
    11: 'Caballo',
    12: 'Rey'
  }
  return names[value]
}

export function getSuitDisplayName(suit: Suit): string {
  const names: Record<Suit, string> = {
    oros: 'Oros',
    copas: 'Copas',
    espadas: 'Espadas',
    bastos: 'Bastos'
  }
  return names[suit]
}