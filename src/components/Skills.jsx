import { useState, useRef, useEffect, useMemo } from "react";
import { skillsData as serverBlades } from "../data/portfolioData";

export default function Skills({ isDark }) {
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Tương tác chuột làm nghiêng nhẹ phối cảnh
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Flatten all skills from cores
    const allSkills = useMemo(() => serverBlades.flatMap(blade => blade.cores), []);

    // Responsive rows: 7, 6, 5, 4 (Desktop) vs 3, 3, 3, 3... (Mobile)
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const updateRows = () => {
            const isMobile = window.innerWidth < 768;
            const itemsPerRow = isMobile ? 3 : 7;
            const newRows = [];
            for (let i = 0; i < allSkills.length; i += itemsPerRow) {
                newRows.push(allSkills.slice(i, i + itemsPerRow));
            }
            setRows(newRows);
        };
        updateRows();
        window.addEventListener("resize", updateRows);
        return () => window.removeEventListener("resize", updateRows);
    }, [allSkills]);

    const currentColor = isDark ? "#a855f7" : "#7e22ce"; // Using a purple tone similar to the reference image, but adapts to theme

    return (
        <section
            id="skills"
            ref={containerRef}
            data-testid="section-skills"
            className="relative min-h-[900px] py-32 flex flex-col items-center justify-center bg-paper text-ink transition-colors duration-500 overflow-hidden select-none perspective-[2500px]"
        >
            {/* Header Title */}
            <div className="relative z-20 mb-16 text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-acid-deep">
                        04 — Skills.collection()
                    </p>
                    <span className="w-12 h-[1px] bg-acid-deep/50" />
                </div>
                <h2
                    className="font-display uppercase text-5xl md:text-7xl lg:text-8xl font-black leading-none text-ink tracking-tight transition-colors duration-500"
                    data-testid="skills-heading"
                >
                    Tech Stack
                </h2>
            </div>

            {/* SÂN KHẤU 3D BACKGROUND (Lưới Tech Grid Perspective) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div
                    className="absolute w-[200vw] h-[150vh]"
                    style={{
                        background: `radial-gradient(circle at 50% 40%, ${currentColor}20 0%, transparent 60%)`,
                        transform: `translateY(10%)`,
                    }}
                />

                {/* 3D Wireframe Grid */}
                <div
                    className="absolute w-[300vw] h-[300vh] bottom-0 origin-bottom"
                    style={{
                        transform: `rotateX(75deg) translateY(20%) translateZ(-200px)`,
                        backgroundImage: `
                            linear-gradient(to right, ${currentColor}15 1px, transparent 1px), 
                            linear-gradient(to bottom, ${currentColor}15 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                        maskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 10%, transparent 70%)'
                    }}
                />
            </div>

            {/* GRID STACK CONTAINER WITH MOUSE PARALLAX */}
            <div className="relative w-full max-w-6xl mx-auto px-4 z-10 flex flex-col items-center justify-center perspective-[2000px]">
                <div
                    className="flex flex-col items-center gap-4 md:gap-6"
                    style={{
                        transform: `rotateX(${10 - mousePos.y * 15}deg) rotateY(${mousePos.x * 15}deg)`,
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.4s ease-out',
                    }}
                >
                    {rows.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="flex justify-center gap-4 md:gap-6"
                            style={{
                                transform: `translateZ(${rowIndex * 30}px)`,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {row.map((skill) => {
                                const brandColor = skill.colorBrand || currentColor;
                                // 8 lớp cắt (slices) mỗi lớp cách nhau 2px tạo độ dày 16px
                                const depthLayers = Array.from({ length: 8 }, (_, i) => -i * 2);

                                return (
                                    <div
                                        key={skill.name}
                                        className="relative flex flex-col items-center justify-center w-[72px] h-[85px] sm:w-[90px] sm:h-[100px] md:w-[110px] md:h-[120px] group cursor-pointer transition-all duration-300 hover:-translate-y-5 hover:scale-110 z-10 hover:z-30"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Bóng đổ dưới cùng (Shadow Base) */}
                                        <div
                                            className="absolute inset-0 rounded-2xl md:rounded-3xl transition-opacity duration-300 group-hover:opacity-60"
                                            style={{
                                                transform: 'translateZ(-20px)',
                                                backgroundColor: 'transparent',
                                                boxShadow: `0 30px 40px -10px ${isDark ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.3)'}`,
                                            }}
                                        />

                                        {/* Lớp đúc 3D (Extrusion Slices) */}
                                        {depthLayers.map((z, idx) => {
                                            const isLast = idx === depthLayers.length - 1;
                                            // Lớp cuối cùng tối hơn để tạo bóng đổ khối
                                            const layerColor = isDark
                                                ? (isLast ? '#11131a' : '#1e2029')
                                                : (isLast ? '#d9d4c6' : '#ece8dd');
                                            const borderColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';

                                            return (
                                                <div
                                                    key={z}
                                                    className="absolute inset-0 rounded-2xl md:rounded-3xl"
                                                    style={{
                                                        transform: `translateZ(${z}px)`,
                                                        backgroundColor: layerColor,
                                                        border: `1px solid ${borderColor}`,
                                                    }}
                                                />
                                            );
                                        })}

                                        {/* Mặt trên cùng (Top Face / Glass) */}
                                        <div
                                            className="absolute inset-0 rounded-2xl md:rounded-3xl backdrop-blur-md transition-all duration-300"
                                            style={{
                                                transform: 'translateZ(2px)',
                                                backgroundColor: isDark ? 'rgba(35, 38, 48, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                                                border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.15)',
                                                boxShadow: `inset 0 0 10px rgba(255,255,255,0.1)`,
                                                transformStyle: 'preserve-3d',
                                            }}
                                        >
                                            {/* Hover Glow */}
                                            <div
                                                className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                                style={{
                                                    boxShadow: `inset 0 0 25px ${brandColor}50, 0 0 30px ${brandColor}40`,
                                                    border: `1px solid ${brandColor}`
                                                }}
                                            />
                                        </div>

                                        {/* CONTENT (Nổi lên trên khối) */}
                                        <div
                                            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-transform duration-300 group-hover:scale-110"
                                            style={{ transform: 'translateZ(25px)', transformStyle: 'preserve-3d' }}
                                        >
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-2 md:mb-3 relative z-10 flex items-center justify-center">
                                                {skill.imgLogo ? (
                                                    <img
                                                        src={skill.imgLogo}
                                                        alt={skill.name}
                                                        className="w-full h-full object-contain filter drop-shadow-[0_5px_8px_rgba(0,0,0,0.5)]"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                            const fallback = e.currentTarget.parentElement.querySelector('.fallback-icon');
                                                            if (fallback) fallback.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div
                                                    className="fallback-icon w-full h-full text-ink dark:text-white flex items-center justify-center"
                                                    style={{ display: skill.imgLogo ? 'none' : 'flex' }}
                                                >
                                                    {skill.icon}
                                                </div>
                                            </div>

                                            <span
                                                className="text-[8px] sm:text-[9px] md:text-[11px] font-mono font-bold text-ink opacity-90 group-hover:text-ink transition-colors text-center px-1 md:px-2 leading-tight drop-shadow-md"
                                            >
                                                {skill.name}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

