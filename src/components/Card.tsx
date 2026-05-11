"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card as CardType } from "@/types"
import { getCardImagePath, getSuitDisplayName, getCardDisplayName } from "@/lib/deck"
import { cn } from "@/lib/utils"

interface CardComponentProps {
  card: CardType
  className?: string
  faceDown?: boolean
}

export function CardComponent({ card, className, faceDown = false }: CardComponentProps) {
  if (faceDown) {
    return (
      <motion.div
        className={cn(
          "relative w-32 h-48 sm:w-36 sm:h-52 md:w-40 md:h-56 rounded-xl overflow-hidden border border-border",
          className
        )}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 180 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/cards/back.svg"
          alt="Carta boca abajo"
          fill
          className="object-cover"
        />
      </motion.div>
    )
  }

  return (
    <motion.div
        className={cn(
          "relative w-32 h-48 sm:w-36 sm:h-52 md:w-40 md:h-56 rounded-xl overflow-hidden border border-border",
          className
        )}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Image
        src={getCardImagePath(card)}
        alt={`${getCardDisplayName(card.value)} de ${getSuitDisplayName(card.suit)}`}
        fill
        className="object-cover"
        unoptimized
      />
    </motion.div>
  )
}
