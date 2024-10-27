'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import seedrandom from 'seedrandom'
import { Button } from "@/components/ui/button"

const shapes = ['circle', 'square', 'triangle']
const colors = ['red', 'blue', 'green', 'yellow']

function getRandomItem(array: any[], rng: () => number) {
  return array[Math.floor(rng() * array.length)]
}

function generatePuzzle(puzzleNumber: number) {
  const seed = `puzzle-${puzzleNumber}`
  const rng = seedrandom(seed)

  const shape = getRandomItem(shapes, rng)
  const color = getRandomItem(colors, rng)

  return { shape, color }
}

export default function UnlimitedPuzzles() {
  const [puzzleNumber, setPuzzleNumber] = useState(1)
  const [puzzle, setPuzzle] = useState(generatePuzzle(puzzleNumber))
  const [options, setOptions] = useState<string[]>([])
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    const newPuzzle = generatePuzzle(puzzleNumber)
    setPuzzle(newPuzzle)
    setSelectedShape(null)
    setIsCorrect(null)

    const allOptions = shapes.filter(s => s !== newPuzzle.shape)
    allOptions.push(newPuzzle.shape)
    setOptions(allOptions.sort(() => Math.random() - 0.5))
  }, [puzzleNumber])

  const handleShapeClick = (shape: string) => {
    setSelectedShape(shape)
    if (shape === puzzle.shape) {
      setIsCorrect(true)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })
    } else {
      setIsCorrect(false)
    }
  }

  const handleContinue = () => {
    setPuzzleNumber(prev => prev + 1)
  }

  const handleSkip = () => {
    setPuzzleNumber(prev => prev + 1)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">
      <h1 className="text-4xl font-bold mb-4 text-white">Shape Puzzles</h1>
      <p className="text-2xl mb-8 text-white">Puzzle #{puzzleNumber}</p>
      <div className="bg-white p-8 rounded-xl shadow-xl">
        <p className="text-2xl mb-4 text-center">Can you find the {puzzle.color} {puzzle.shape}?</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {options.map((shape, index) => (
            <motion.button
              key={index}
              className={`w-24 h-24 rounded-lg focus:outline-none ${
                selectedShape === shape ? 'ring-4 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: shape === puzzle.shape ? puzzle.color : getRandomItem(colors, Math.random) }}
              onClick={() => handleShapeClick(shape)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {shape === 'circle' && <div className="w-full h-full rounded-full" />}
              {shape === 'square' && <div className="w-full h-full" />}
              {shape === 'triangle' && (
                <div className="w-0 h-0 border-l-[48px] border-r-[48px] border-b-[96px] border-l-transparent border-r-transparent mx-auto" />
              )}
            </motion.button>
          ))}
        </div>
        {isCorrect !== null && (
          <p className={`text-2xl mb-4 text-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? 'Great job!' : 'Try again!'}
          </p>
        )}
        <div className="flex justify-between">
          <Button 
            onClick={handleSkip}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Skip
          </Button>
          <Button 
            onClick={handleContinue}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            disabled={!isCorrect}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}