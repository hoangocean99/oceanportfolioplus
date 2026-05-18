import { useEffect, useRef } from "react";

export default function TechRain({ isDark }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Configuration
        const particles = [];
        const numParticles = 12; // Giảm mật độ để mượt hơn nữa
        const shapes = ['circle', 'ring', 'cross', 'square', 'dot'];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.z = Math.random() * 2 + 0.5; // Depth factor (0.5 to 2.5)
                this.size = (Math.random() * 4 + 2) * this.z; // Shape size
                this.speed = (Math.random() * 0.4 + 0.1) * this.z; // Float speed
                this.shape = shapes[Math.floor(Math.random() * shapes.length)];
                this.opacity = (Math.random() * 0.3 + 0.1) * (this.z / 2);
                this.glow = this.z > 1.8;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.02; // Spin speed
            }

            update() {
                // Fall downwards gently
                this.y += this.speed;
                // Add horizontal drift
                this.x += Math.sin(this.y * 0.005) * 0.5 * this.z;
                // Rotate
                this.rotation += this.rotSpeed;

                // Wrap around when reaching bottom
                if (this.y > height + 30) {
                    this.y = -30;
                    this.x = Math.random() * width;
                    this.speed = (Math.random() * 0.4 + 0.1) * this.z;
                }
            }

            draw(ctx, isDark) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                const rgbBase = isDark ? '200, 238, 0' : '0, 0, 0';

                // Fast fake glow for foreground particles instead of slow shadowBlur
                if (this.glow) {
                    ctx.fillStyle = `rgba(${rgbBase}, ${this.opacity * 0.3})`;
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size * 1.8, 0, Math.PI * 2);
                    ctx.fill();
                }

                const color = `rgba(${rgbBase}, ${this.opacity})`;

                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                ctx.lineWidth = 1.5;

                ctx.beginPath();
                if (this.shape === 'dot') {
                    ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
                    ctx.fill();
                } else if (this.shape === 'circle') {
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (this.shape === 'ring') {
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.stroke();
                } else if (this.shape === 'square') {
                    ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
                    ctx.stroke();
                } else if (this.shape === 'cross') {
                    const s = this.size / 2;
                    ctx.moveTo(-s, 0);
                    ctx.lineTo(s, 0);
                    ctx.moveTo(0, -s);
                    ctx.lineTo(0, s);
                    ctx.stroke();
                }

                ctx.restore();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw(ctx, isDark);
            });
            animationId = requestAnimationFrame(animate);
        };

        animate();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-[30]"
        />
    );
}
