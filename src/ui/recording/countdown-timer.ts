export class CountdownTimer {
  private interval: NodeJS.Timer | null = null
  private currentCount: number

  onTick: ((count: number) => void) | null = null
  onFinished: (() => void) | null = null

  constructor(private readonly initialCount: number) {
    this.currentCount = initialCount
  }

  start(): void {
    this.cancel()
    this.currentCount = this.initialCount

    if (this.currentCount < 0) {
      throw new Error('Countdown cannot start with a negative count')
    }

    this.interval = setInterval(this.tickHandler, 1000)
    // call the first tick immediately
    this.tickHandler()
  }

  cancel(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  private tickHandler = (): void => {
    if (this.onTick) {
      this.onTick(this.currentCount)
    }

    this.currentCount--

    if (this.currentCount < 0) {
      this.cancel()
      if (this.onFinished) {
        this.onFinished()
      }
    }
  }
}
