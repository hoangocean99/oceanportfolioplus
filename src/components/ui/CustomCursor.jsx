import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
    const dotRef = useRef(null);
    const ringRef = useRef(null);

    const [clicked, setClicked] = useState(false);
    const [hovered, setHovered] = useState(false);

    const mouse = useRef({ x: -100, y: -100 });
    const ring = useRef({ x: -100, y: -100 });

    useEffect(() => {
        let animationFrameId;

        // Zero-latency update for the core dot
        const move = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            // Move dot immediately via GPU
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(calc(${mouse.current.x}px - 50%), calc(${mouse.current.y}px - 50%), 0)`;
            }
        };

        // Smooth trailing (Lerp) for the outer ring via requestAnimationFrame
        const render = () => {
            ring.current.x += (mouse.current.x - ring.current.x) * 0.2;
            ring.current.y += (mouse.current.y - ring.current.y) * 0.2;

            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(calc(${ring.current.x}px - 50%), calc(${ring.current.y}px - 50%), 0)`;
            }
            animationFrameId = requestAnimationFrame(render);
        };
        render();

        const down = () => setClicked(true);
        const up = () => setClicked(false);

        window.addEventListener("mousemove", move, { passive: true });
        window.addEventListener("mousedown", down);
        window.addEventListener("mouseup", up);

        // Detect hover on clickable elements
        const handleMouseOver = (e) => {
            const isClickable =
                e.target.tagName.toLowerCase() === 'a' ||
                e.target.tagName.toLowerCase() === 'button' ||
                e.target.closest('a') ||
                e.target.closest('button');

            if (isClickable) {
                setHovered(true);
            } else {
                setHovered(false);
            }
        };
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mousedown", down);
            window.removeEventListener("mouseup", up);
            window.removeEventListener("mouseover", handleMouseOver);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
            {/* Core dot - GPU accelerated transform */}
            <div
                ref={dotRef}
                className={`absolute top-0 left-0 bg-acid-deep dark:bg-acid rounded-full pointer-events-none mix-blend-difference will-change-transform ${hovered ? 'w-0 h-0 opacity-0' : 'w-2 h-2 opacity-100'}`}
                style={{ transition: 'width 0.3s, height 0.3s, opacity 0.3s' }} // Only transition dimensions, not transform
            >
                <div className={`w-full h-full rounded-full transition-transform duration-75 ${clicked ? 'scale-50' : 'scale-100'}`} />
            </div>

            {/* Outer tech ring / Hover active circle */}
            <div
                ref={ringRef}
                className={`absolute top-0 left-0 pointer-events-none flex items-center justify-center rounded-full mix-blend-difference will-change-transform ${hovered ? 'w-5 h-5 bg-white border-transparent' : 'w-8 h-8 border border-acid-deep dark:border-acid bg-transparent'}`}
                style={{ transition: 'width 0.3s, height 0.3s, background-color 0.3s, border-color 0.3s' }} // Only transition styles, not transform
            >
                <div className={`w-full h-full rounded-full transition-transform duration-300 ease-out flex items-center justify-center ${clicked ? 'scale-75' : 'scale-100'}`}>
                    {/* Tech spinning radar on hover */}
                    {hovered && (
                        <div className="absolute inset-0 rounded-full border-2 border-white border-dashed animate-[spin_3s_linear_infinite] opacity-30"></div>
                    )}
                </div>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    * {
                        cursor: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
