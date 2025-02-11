export type PlayerType = {
  x: number
  y: number
  width: number
  height: number
  color: string
  speed: number
  lives: number
  score: number
}


export type BallType = {
  x: number
  y: number
  width: number
  height: number
  color: string
  dx: number
  dy: number
}
export type BrickType = {
  x: number
  y: number
  width: number
  height: number
  color: string
  value: number
  bonus: number
}

export type BonusBrickType = {
  x: number
  y: number
  width: number
  height: number
  points: number
}

export type createBrickFunctionType = (
  x: number,
  y: number,
  width: number,
  height: number
) => void

export type GameType = {
  grid: number
  animate: any
  bricks: BrickType[]
  num: number
  gameover: boolean
  bonus: BonusBrickType[]
  inplay: boolean
}


export type ObjectType = BallType | PlayerType | BrickType | BonusBrickType

export type drawBallType = (ctx: HTMLCanvasElement) => void
export type KeyzRefType = {
  ArrowLeft: boolean
  ArrowRight: boolean
  [key: string]: boolean
}
