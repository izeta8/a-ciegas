"use client"

import { motion } from "framer-motion"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trophy, XCircle, RotateCcw, Home, TrophyIcon } from "lucide-react"
import Link from "next/link"

interface GameEndModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  misses: number
  highScore: number | null
  onNewGame: () => void
  onGoHome: () => void
}

export function GameEndModal({ open, onOpenChange, misses, highScore, onNewGame, onGoHome }: GameEndModalProps) {
  const isNewRecord = highScore !== null && misses <= highScore

  const getMessage = () => {
    if (misses === 0) return "¡Impresionante! ¡Partida perfecta!"
    if (misses <= 3) return "¡Excelente! ¡Muy pocas fallas!"
    if (misses <= 7) return "¡Buen trabajo! Sigue practicando."
    if (misses <= 15) return "No está mal, puedes mejorar."
    return "Sigue intentando, ¡la práctica hace al maestro!"
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="mx-auto mb-4"
          >
            <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary">
              <Trophy className="size-8 text-primary-foreground" />
            </div>
          </motion.div>
          <AlertDialogTitle className="text-2xl font-bold text-center">Juego Terminado</AlertDialogTitle>
          <AlertDialogDescription className="text-base text-center">
            {getMessage()}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4 py-6"
        >
          <div className="flex items-center gap-2">
            <XCircle className="size-8 text-destructive" />
            <span className="text-5xl font-bold">{misses}</span>
          </div>

          {isNewRecord && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 font-semibold text-sm"
            >
              Nuevo récord!
            </motion.div>
          )}

          {highScore !== null && !isNewRecord && (
            <p className="text-sm text-muted-foreground">
              Récord: {highScore} fallas
            </p>
          )}
        </motion.div>

        <AlertDialogFooter className="flex-col gap-2">
          <Link href="/leaderboard" className="w-full">
            <Button variant="secondary" className="w-full">
              <TrophyIcon className="size-4" />
              Clasificación
            </Button>
          </Link>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onGoHome} className="w-full">
              <Home className="size-4" />
              Inicio
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={onNewGame} className="w-full">
              <RotateCcw className="size-4" />
              Nueva Partida
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}