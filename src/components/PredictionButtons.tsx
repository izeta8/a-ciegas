"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Prediction } from "@/types"
import { ArrowUp, ArrowDown, Equal } from "lucide-react"

interface PredictionButtonsProps {
  onPredict: (prediction: Prediction) => void
  disabled?: boolean
}

export function PredictionButtons({ onPredict, disabled = false }: PredictionButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-row sm:gap-3">
      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => onPredict('menor')}
          disabled={disabled}
          variant="outline"
          className="w-full h-14 text-base sm:w-36 sm:h-16 sm:text-lg font-medium"
        >
          <ArrowDown className="size-4 sm:size-5" />
        </Button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => onPredict('igual')}
          disabled={disabled}
          variant="outline"
          className="w-full h-14 text-base sm:w-36 sm:h-16 sm:text-lg font-medium"
        >
          <Equal className="size-4 sm:size-5" />
        </Button>
      </motion.div>

      <motion.div whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => onPredict('mayor')}
          disabled={disabled}
          variant="outline"
          className="w-full h-14 text-base sm:w-36 sm:h-16 sm:text-lg font-medium"
        >
          <ArrowUp className="size-4 sm:size-5" />
        </Button>
      </motion.div>
    </div>
  )
}
