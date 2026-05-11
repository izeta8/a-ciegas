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
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => onPredict('menor')}
          disabled={disabled}
          variant="outline"
          size="lg"
          className="w-full sm:w-40 h-14 text-lg font-semibold border-2 hover:border-blue-500 hover:bg-blue-50"
        >
          <ArrowDown className="w-5 h-5 mr-2" />
          Menor
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => onPredict('igual')}
          disabled={disabled}
          variant="outline"
          size="lg"
          className="w-full sm:w-40 h-14 text-lg font-semibold border-2 hover:border-purple-500 hover:bg-purple-50"
        >
          <Equal className="w-5 h-5 mr-2" />
          Igual
        </Button>
      </motion.div>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => onPredict('mayor')}
          disabled={disabled}
          variant="outline"
          size="lg"
          className="w-full sm:w-40 h-14 text-lg font-semibold border-2 hover:border-red-500 hover:bg-red-50"
        >
          <ArrowUp className="w-5 h-5 mr-2" />
          Mayor
        </Button>
      </motion.div>
    </div>
  )
}