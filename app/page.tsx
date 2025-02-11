"use client"
import image from '@/public/game.gif'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-window flex flex-col gap-3 items-center justify-center px-6">
      <motion.h1
        className="text-4xl md:text-5xl text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Welcome to <span className="text-red-500 font-bold">Break</span>
        <span className="font-medium">Bricks</span>
        {` Game`}
      </motion.h1>

      <motion.p
        className="mt-2 text-lg md:text-xl text-gray-400 text-center max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        An exciting brick-breaking arcade game built using{' '}
        <span className="text-yellow-500 underline underline-offset-4">
          javascript
        </span>
        . Test your reflexes and challenge your high score!
      </motion.p>

      <motion.div
        className="mt-6 py-4"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        <Image
          src={image}
          alt="Breakout Game Preview"
          className="scale-110 shadow-md rounded-md"
        />
      </motion.div>

      <motion.div
        className="flex gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Link className="button-light" href="/play">
          Play Now
        </Link>
        <Link className="button" href="https://github.com/Saquib1973/breakout">
          GitHub
        </Link>
      </motion.div>
    </div>
  )
}
