import { useEffect, useState } from "react";

export default function Loader({ onDone, isDark }) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState("loading"); // "loading" | "splitting" | "hidden"

    useEffect(() => {
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 4 + 1;
            if (p >= 100) {
                p = 100;
                setProgress(100);
                clearInterval(interval);
                setTimeout(() => {
                    setPhase("splitting");
                    // We call onDone after the animation is finished
                    setTimeout(() => {
                        setPhase("hidden");
                        onDone && onDone();
                    }, 6500); // Wait for the 6s animation to finish
                }, 1200);
            } else {
                setProgress(p);
            }
        }, 130);
        return () => clearInterval(interval);
    }, [onDone]);

    if (phase === "hidden") return null;

    const bgPanel = isDark ? "#050505" : "#f3eee3";
    const borderPanel = isDark ? "2px solid #c8ee00" : "2px solid #5a6b00";
    const textColor = isDark ? "#ffffff" : "#0a0a0a";
    const ghostColor = isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)";
    const accentColor = isDark ? "#c8ee00" : "#5a6b00"; // Muted green for light mode

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                backgroundColor: 'transparent',
                pointerEvents: phase === 'splitting' ? 'none' : 'auto',
                contain: 'strict'
            }}
        >
            <style>{`
                @keyframes splitTop {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-100%); }
                }
                @keyframes splitBottom {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(100%); }
                }
                @keyframes fadeOut {
                    0% { opacity: 1; transform: scale(1); filter: blur(0); }
                    30% { opacity: 0; transform: scale(1.1); filter: blur(10px); }
                    100% { opacity: 0; transform: scale(1.2); filter: blur(20px); }
                }
            `}</style>

            {/* Top Panel */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '50.5%',
                    background: bgPanel,
                    borderBottom: borderPanel,
                    zIndex: 2,
                    willChange: 'transform',
                    animation: phase === 'splitting' ? 'splitTop 6s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
            >
                {/* Visual Detail */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100px', background: `linear-gradient(to top, ${accentColor}0D, transparent)`, pointerEvents: 'none' }} />
            </div>

            {/* Bottom Panel */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '50.5%',
                    background: bgPanel,
                    borderTop: borderPanel,
                    zIndex: 2,
                    willChange: 'transform',
                    animation: phase === 'splitting' ? 'splitBottom 6s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
            >
                {/* Visual Detail */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100px', background: `linear-gradient(to bottom, ${accentColor}0D, transparent)`, pointerEvents: 'none' }} />
            </div>

            {/* Central Content */}
            <div
                style={{
                    position: 'relative',
                    zIndex: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    willChange: 'opacity, transform, filter',
                    animation: phase === 'splitting' ? 'fadeOut 2s ease-out forwards' : 'none',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                }}
            >
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Ghost Number (Huge) */}
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%) translateZ(0)',
                        fontSize: '25rem',
                        fontWeight: 900,
                        color: ghostColor,
                        userSelect: 'none',
                        zIndex: -1,
                        pointerEvents: 'none'
                    }}>
                        {Math.floor(progress)}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', transform: 'translateZ(0)' }}>
                        <span style={{ fontSize: '10rem', fontWeight: 900, color: textColor, letterSpacing: '-5px', lineHeight: 1 }}>
                            {Math.floor(progress)}
                        </span>
                        <span style={{ fontSize: '2.5rem', color: accentColor, fontWeight: 'bold' }}>%</span>
                    </div>

                    <div style={{ width: '300px', height: '2px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', marginTop: '40px', position: 'relative', overflow: 'hidden' }}>
                        <div
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                background: accentColor,
                                width: `${progress}%`,
                                transition: 'width 0.3s ease-out',
                                boxShadow: `0 0 20px ${accentColor}`,
                                willChange: 'width'
                            }}
                        />
                    </div>

                    <p style={{ marginTop: '40px', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.8em', color: accentColor, opacity: 0.5, textTransform: 'uppercase' }}>
                        Loading Assets
                    </p>
                </div>
            </div>

            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) translateZ(0)',
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at center, ${accentColor}0D 0%, transparent 80%)`,
                zIndex: 1,
                pointerEvents: 'none'
            }} />
        </div>
    );
}
