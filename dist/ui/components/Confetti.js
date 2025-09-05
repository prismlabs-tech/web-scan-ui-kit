import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// Simple confetti particle
function randomColor() {
    var colors = ['#FFD700', '#FF69B4', '#00CFFF', '#FF6347', '#32CD32', '#8A2BE2', '#FFB347'];
    return colors[Math.floor(Math.random() * colors.length)];
}
function createConfettiParticle(width, height, i, total) {
    // Scatter confetti randomly across the screen
    var x = Math.random() * width;
    return {
        x: x,
        y: -20 - Math.random() * 40,
        w: 10 + Math.random() * 8,
        h: 18 + Math.random() * 10,
        color: randomColor(),
        vx: (Math.random() - 0.5) * 3, // more horizontal drift
        vy: 0.7 + Math.random() * 0.7, // much slower initial vertical speed
        ay: 0.04 + Math.random() * 0.03, // much less gravity
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.13, // more spin for fluttering
    };
}
export var Confetti = function () {
    var t = useTranslation().t;
    var canvasRef = useRef(null);
    var animationRef = useRef(null);
    var particlesRef = useRef([]);
    useEffect(function () {
        var canvas = canvasRef.current;
        if (!canvas)
            return;
        var ctx = canvas.getContext('2d');
        var width = (canvas.width = window.innerWidth);
        var height = (canvas.height = window.innerHeight);
        var confettiCount = 80;
        var particles = [];
        for (var i = 0; i < confettiCount; i++) {
            particles.push(createConfettiParticle(width, height, i, confettiCount));
        }
        particlesRef.current = particles;
        var finished = false;
        function draw() {
            if (!ctx)
                return;
            ctx.clearRect(0, 0, width, height);
            var allDone = true;
            particles.forEach(function (p) {
                if (p.y < height + 30) {
                    allDone = false;
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += p.ay; // gravity
                    p.angle += p.spin;
                }
                if (ctx) {
                    ctx.save();
                    ctx.globalAlpha = 0.95;
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.angle);
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                }
            });
            if (!allDone) {
                animationRef.current = requestAnimationFrame(draw);
            }
            else {
                finished = true;
            }
        }
        draw();
        return function () {
            if (animationRef.current)
                cancelAnimationFrame(animationRef.current);
        };
    }, []);
    return (_jsx("canvas", { ref: canvasRef, style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 0,
            background: 'transparent',
        } }));
};
export default Confetti;
