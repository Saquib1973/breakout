'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import {
  type BallType,
  type BonusBrickType,
  type createBrickFunctionType,
  type GameType,
  type KeyzRefType,
  type ObjectType,
  type PlayerType,
} from './BreakoutGameTypes'

const BreakoutGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const gameRef = useRef<GameType>({
    grid: 60,
    animate: null,
    bricks: [],
    num: 100,
    gameover: true,
    bonus: [],
    inplay: false,
  })
  const playerRef = useRef<PlayerType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: 'red',
    speed: 5,
    lives: 5,
    score: 0,
  })
  const ballRef = useRef<BallType>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: 'black',
    dx: 0,
    dy: 0,
  })
  const keyzRef = useRef<KeyzRefType>({ ArrowLeft: false, ArrowRight: false })

  //initialize sounds
  const [ballHitSound] = useState(
    new Howl({
      src: ['/sounds/ball-hit.mp3'],
      volume: 0.5,
    })
  )
  const [blockHitSound] = useState(
    new Howl({
      src: ['/sounds/block-hit.mp3'],
      volume: 0.5,
    })
  )

  const resetBall = () => {
    const ball = ballRef.current
    const player = playerRef.current
    const game = gameRef.current

    ball.dx = 0
    ball.dy = 0
    ball.y = player.y - ball.height
    ball.x = player.x + player.width / 2
    game.inplay = false
  }

  const movement = () => {
    const player = playerRef.current
    const ball = ballRef.current
    const game = gameRef.current
    const canvas = canvasRef.current
    const speed = player.speed

    if (!canvas) return

    if (keyzRef.current.ArrowLeft && player.x > 0) {
      player.x = Math.max(0, player.x - speed)
    }
    if (keyzRef.current.ArrowRight && player.x < canvas.width - player.width) {
      player.x = Math.min(canvas.width - player.width, player.x + speed)
    }
    if (!game.inplay) {
      ball.x = player.x + player.width / 2
    }
  }

  const collisionDetection = (obj1: ObjectType, obj2: ObjectType) => {
    const xAxis = obj1.x < obj2.x + obj2.width && obj1.x + obj1.width > obj2.x
    const yAxis = obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y
    return xAxis && yAxis
  }

  const ballMove = () => {
    const ball = ballRef.current
    const player = playerRef.current
    const game = gameRef.current
    const canvas = canvasRef.current
    if (!canvas) return
    if (ball.x > canvas.width || ball.x < 0) {
      ball.dx *= -1
      ballHitSound.play()
    }
    if (ball.y < 0) {
      ball.dy *= -1
      ballHitSound.play()
    }
    if (ball.y > canvas.height) {
      player.lives--
      resetBall()
      if (player.lives === 0) {
        gameOver()
      }
    }
    if (ball.dy > -2 && ball.dy < 0) ball.dy = -3
    if (ball.dy > 0 && ball.dy < 2) ball.dy = 3
    ball.x += ball.dx
    ball.y += ball.dy
  }

  const gameOver = () => {
    const game = gameRef.current
    savePlayerScore()
    game.gameover = true
    game.inplay = false
    cancelAnimationFrame(game.animate)
  }

  const gameWinner = () => {
    const game = gameRef.current
    savePlayerScore()
    game.gameover = true
    game.inplay = false
    cancelAnimationFrame(game.animate)
  }
  function savePlayerScore() {
    let playerScore = playerRef.current.score
    let scores = JSON.parse(localStorage.getItem('scores') || '[]')
    scores.push(playerScore)
    scores = scores.sort((a: number, b: number) => b - a).slice(0, 5)
    localStorage.setItem('scores', JSON.stringify(scores))
    setScores(scores)
  }

  const createBrick: createBrickFunctionType = (xPos, yPos, width, height) => {
    const game = gameRef.current
    const randomColor = '#' + Math.random().toString(16).substr(-6)
    game.bricks.push({
      x: xPos,
      y: yPos,
      width,
      height,
      color: randomColor,
      value: Math.floor(Math.random() * 50),
      bonus: Math.floor(Math.random() * 10),
    })
  }

  const startGame = () => {
    const game = gameRef.current
    const player = playerRef.current
    const canvas = canvasRef.current
    if (!canvas) return
    game.inplay = false
    game.bricks = []
    player.x = game.grid * 7
    player.y = canvas.height - game.grid * 1.5
    player.width = game.grid * 2
    player.height = game.grid / 3
    player.score = 0
    player.lives = 1

    resetBall()

    const buffer = 10
    const width = game.grid
    const height = game.grid / 2
    const totalAcross = Math.floor(
      (canvas.width - game.grid) / (width + buffer)
    )
    let xPos = game.grid / 2
    let yPos = 0
    let maxRows = 4
    for (let i = 0; i < game.num; i++) {
      if (i % totalAcross === 0) {
        yPos += height + buffer
        xPos = game.grid / 2
        maxRows--
      }
      if (maxRows >= 0) {
        createBrick(xPos, yPos, width, height)
      }
      xPos += width + buffer
    }
  }

  const drawBall = (ctx: CanvasRenderingContext2D) => {
    const ball = ballRef.current
    const player = playerRef.current

    ctx.beginPath()
    ctx.strokeStyle = 'gray'
    ctx.rect(ball.x, ball.y, ball.width, ball.height)
    ctx.fillStyle = player.color
    ctx.closePath()

    ctx.beginPath()
    ctx.fillStyle = ball.color
    ctx.arc(
      ball.x + ball.width / 2,
      ball.y + ball.width / 2,
      ball.width / 2,
      0,
      Math.PI * 2
    )
    ctx.fill()
    ctx.closePath()
  }

  const drawBonus = (ctx: CanvasRenderingContext2D, obj: BonusBrickType) => {
    ctx.beginPath()
    ctx.rect(obj.x, obj.y, obj.width, obj.height)
    ctx.strokeStyle = 'gray'
    ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
    ctx.fillStyle = 'black'
    ctx.fill()
    ctx.closePath()
    ctx.beginPath()
    ctx.fillStyle = 'gray'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${obj.points}`, obj.x + obj.width / 2, obj.y + obj.height / 2)
    ctx.closePath()
  }

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    const player = playerRef.current
    ctx.beginPath()
    ctx.rect(player.x, player.y, player.width, player.height)
    ctx.fillStyle = player.color
    ctx.fill()
    ctx.closePath()
  }

  const init = () => {
    const canvas = canvasRef.current as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    const game = gameRef.current
    const player = playerRef.current
    const ball = ballRef.current
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    movement()
    ballMove()
    drawPlayer(ctx)
    drawBall(ctx)

    game.bonus.forEach((prize: BonusBrickType, index) => {
      prize.y += 5
      drawBonus(ctx, prize)
      if (collisionDetection(prize, player)) {
        player.score += prize.points
        game.bonus.splice(index, 1)
      }
      if (prize.y > canvas.height) {
        game.bonus.splice(index, 1)
      }
    })

    game.bricks.forEach((brick, index) => {
      ctx.beginPath()
      ctx.strokeStyle = 'gray'
      ctx.rect(brick.x, brick.y, brick.width, brick.height)
      ctx.fillStyle = brick.color
      ctx.fill()
      ctx.stroke()
      ctx.closePath()

      if (collisionDetection(ball, brick)) {
        game.bricks.splice(index, 1)
        player.score += brick.value
        if (ball.dy > -10 && ball.dy < 10) ball.dy--
        ball.dy *= -1
        blockHitSound.play()
        if (brick.bonus === 1) {
          game.bonus.push({
            x: brick.x,
            y: brick.y,
            width: brick.width,
            height: brick.height,
            points: Math.floor(Math.random() * 100) + 50,
          })
        }
        if (game.bricks.length === 0) {
          gameWinner()
        }
      }
    })

    if (collisionDetection(player, ball)) {
      ball.dy *= -1
      const num = ball.x + ball.width / 2 - (player.x + player.width / 2)
      ball.dx = Math.ceil(num / (player.width / 10))
      ballHitSound.play()
    }

    let output = `Lives: ${player.lives} Score: ${player.score}`
    ctx.font = '24px Arial'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'gray'

    if (!game.gameover) {
      game.animate = requestAnimationFrame(init)
    }

    if (game.gameover) {
      output = `Game over, your score is ${player.score}`
      ctx.fillStyle = 'red'
    }
    ctx.fillText(output, canvas.width / 2, canvas.height - 20)
  }

  const outputStartGame = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const output = 'Click to Start'
    ctx.font = '26px Arial'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'red'
    ctx.fillText(output, canvas.width / 2, canvas.height / 2)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const game = gameRef.current
    const ball = ballRef.current

    canvas.width = game.grid * 15
    canvas.height = game.grid * 10

    ball.width = game.grid / 3
    ball.height = game.grid / 3

    outputStartGame()

    const handleKeyDown = (e: KeyboardEvent) => {
      let keyz = keyzRef.current
      if (e.code in keyz) keyz[e.code] = true
      if (e.code === 'Space' && !game.inplay) {
        game.inplay = true
        ball.dx = 1
        ball.dy = -1
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keyzRef.current) keyzRef.current[e.code] = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      const player = playerRef.current
      const game = gameRef.current
      const ball = ballRef.current
      const val = e.clientX - canvas.offsetLeft

      if (val > player.width && val < canvas.width) {
        player.x = val - player.width
        if (!game.inplay) {
          ball.x = player.x + player.width / 2
        }
      }
    }

    const handleClick = () => {
      const game = gameRef.current
      const ball = ballRef.current

      if (game.gameover) {
        game.gameover = false
        startGame()
        game.animate = requestAnimationFrame(init)
      } else if (!game.inplay) {
        game.inplay = true
        ball.dx = 1
        ball.dy = -1
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('click', handleClick)
      cancelAnimationFrame(game.animate)
    }
  }, [])
  const [scores, setScores] = useState<number[]>([])
  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem('scores') || '[]')
    setScores(storedScores);
  }, [])
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex flex-col items-center w-full justify-center p-4">
      <div className="max-lg:flex hidden items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-red-500  px-6 py-3 text-lg font-semibold"
        >
          ⚠️ Not available on mobile/tablet devices. Please use a larger screen!
        </motion.div>
      </div>

      <div className="p-4 max-lg:hidden flex items-center justify-center h-full">
        <motion.canvas
          ref={canvasRef}
          className="bg-gray-50 shadow-inner border w-auto rounded-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>

      <div className=" max-lg:hidden h-full px-4 flex flex-col  items-center py-4">
        <h2 className="text-xl font-bold mb-2">🏆 Scoreboard</h2>
        <ul className="w-full text-center">
          {scores.length > 0 ? (
            scores.map((score, index) => (
              <li
                key={index}
                className={`py-1 ${
                  index === 0
                    ? 'text-2xl text-red-500'
                    : index === 1
                    ? 'text-xl text-red-400'
                    : ''
                }`}
              >
                {index + 1 === 1 ? '🎊 ' : ''}
                {index + 1}. {score} pts
                {index + 1 === 1 ? ' 🎊' : ''}
              </li>
            ))
          ) : (
            <p className="text-gray">No scores yet!</p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default BreakoutGame
