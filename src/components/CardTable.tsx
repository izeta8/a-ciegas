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
    <div className="flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-center sm:gap-4 overflow-x-auto">
      <AnimatePresence mode="wait">
        {currentCard && (
          <motion.div
            key={currentCard.value + currentCard.suit + "current"}
            initial={{ x: -50, opacity: 0, rotateY: 180 }}
            animate={{ x: 0, opacity: 1, rotateY: 0 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardComponent card={currentCard} />
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
            <ChevronRight className="size-6 sm:size-8 text-muted-foreground rotate-90 sm:rotate-0" />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={nextCard.value + nextCard.suit + "next"}
              initial={{ x: 50, opacity: 0, rotateY: 180 }}
              animate={{ x: 0, opacity: 1, rotateY: 0 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CardComponent card={nextCard} faceDown />
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  )
}
