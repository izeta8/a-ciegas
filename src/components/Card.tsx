"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Card } from "@/types"
import { getCardImagePath, getCardDisplayName, getSuitDisplayName } from "@/lib/deck"
import { cn } from "@/lib/utils"

interface CardProps {
  card: Card
  className?: string
  faceDown?: boolean
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "w-16 h-24",
  md: "w-24 h-36",
  lg: "w-32 h-48"
}

const suitColors = {
  oros: "text-yellow-500",
  copas: "text-red-500",
  espadas: "text-slate-800",
  bastos: "text-slate-800"
}

export function CardComponent({ card, className, faceDown = false, size = "md" }: CardProps) {
  if (faceDown) {
    return (
      <motion.div
        className={cn(
          "relative rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-600 flex items-center justify-center",
          sizeClasses[size],
          className
        )}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 180 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-slate-600 text-2xl font-serif">AC</div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn(
        "relative rounded-lg bg-white border-2 border-slate-200 shadow-xl overflow-hidden",
        sizeClasses[size],
        className
      )}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute inset-0 p-2 flex flex-col justify-between">
        <div className="flex items-center gap-1">
          <span className={cn("font-bold text-lg", suitColors[card.suit])}>
            {getCardDisplayName(card.value)}
          </span>
        </div>
        <div className="flex items-center justify-center h-full">
          <Image
            src={getCardImagePath(card)}
            alt={`${getCardDisplayName(card.value)} de ${getSuitDisplayName(card.suit)}`}
            width={200}
            height={300}
            className="object-contain w-full h-full"
            unoptimized
          />
        </div>
        <div className="flex items-center justify-end">
          <span className={cn("font-bold text-lg", suitColors[card.suit])}>
            {getCardDisplayName(card.value)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}