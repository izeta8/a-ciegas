"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CardComponent } from "./Card"
import { Card } from "@/types"
import { ChevronRight } from "lucide-react"

interface CardTableProps {
  currentCard: Card | null
  nextCard: Card | null
  showNext?: boolean
}

export function CardTable({ currentCard, nextCard, showNext = true }: CardTableProps) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8 py-8">
      <AnimatePresence mode="wait">
        {currentCard && (
          <motion.div
            key={currentCard.value + currentCard.suit + "current"}
            initial={{ x: -100, opacity: 0, rotateY: 180 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardComponent card={currentCard} size="lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {showNext && nextCard && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ChevronRight className="w-8 h-8 text-slate-400" />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={nextCard.value + nextCard.suit + "next"}
              initial={{ x: 100, opacity: 0, rotateY: 180 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardComponent card={nextCard} size="lg" faceDown />
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}