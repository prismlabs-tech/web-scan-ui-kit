import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

// Simple confetti particle
function randomColor() {
  const colors = ['#FFD700', '#FF69B4', '#00CFFF', '#FF6347', '#32CD32', '#8A2BE2', '#FFB347']
  return colors[Math.floor(Math.random() * colors.length)]
}

interface ConfettiParticle {
  x: number
  y: number
  w: number
  h: number
  color: string
  vx: number // horizontal velocity
  vy: number // vertical velocity
  ay: number // gravity
  angle: number
  spin: number
}

function createConfettiParticle(
  width: number,
  height: number,
  i: number,
  total: number,
): ConfettiParticle {
  // Scatter confetti randomly across the screen
  const x = Math.random() * width
  return {
    x,
    y: -20 - Math.random() * 40,
    w: 10 + Math.random() * 8,
    h: 18 + Math.random() * 10,
    color: randomColor(),
    vx: (Math.random() - 0.5) * 3, // more horizontal drift
    vy: 0.7 + Math.random() * 0.7, // much slower initial vertical speed
    ay: 0.04 + Math.random() * 0.03, // much less gravity
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.13, // more spin for fluttering
  }
}

export const Confetti: React.FC = () => {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<ConfettiParticle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const width = (canvas.width = window.innerWidth)
    const height = (canvas.height = window.innerHeight)
    const confettiCount = 80
    const particles: ConfettiParticle[] = []
    for (let i = 0; i < confettiCount; i++) {
      particles.push(createConfettiParticle(width, height, i, confettiCount))
    }
    particlesRef.current = particles

    let finished = false
    function draw() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      let allDone = true
      particles.forEach((p) => {
        if (p.y < height + 30) {
          allDone = false
          p.x += p.vx
          p.y += p.vy
          p.vy += p.ay // gravity
          p.angle += p.spin
        }
        if (ctx) {
          ctx.save()
          ctx.globalAlpha = 0.95
          ctx.translate(p.x, p.y)
          ctx.rotate(p.angle)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          ctx.restore()
        }
      })
      if (!allDone) {
        animationRef.current = requestAnimationFrame(draw)
      } else {
        finished = true
      }
    }
    draw()
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        background: 'transparent',
      }}
    />
  )
}

export default Confetti
