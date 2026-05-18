import { useState, useRef, useEffect } from "react";
import { allWebArchiveProjects as webProjects, allGameArchiveProjects as gameProjects } from "../data/portfolioData";

export default function Projects({ onSelectProject, onOpenWebArchive, onOpenGameArchive }) {
    const sectionRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let rafId;
        const handleScroll = () => {
            rafId = requestAnimationFrame(() => {
                if (!sectionRef.current) return;
                const rect = sectionRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const totalScroll = rect.height - viewportHeight;
                const scrolled = -rect.top;

                if (scrolled >= 0 && scrolled <= totalScroll) {
                    setProgress(scrolled / totalScroll);
                } else if (scrolled < 0) {
                    setProgress(0);
                } else if (scrolled > totalScroll) {
                    setProgress(1);
                }
            });
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <section
            id="projects"
            ref={sectionRef}
            data-testid="section-projects"
            className="relative h-[800vh] select-none"
        >
            {/* Sticky Viewport Container */}
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center pt-4 transition-colors duration-500">

                {/* Header Title */}
                <div className="max-w-7xl mx-auto px-6 md:px-10 w-full mb-3 relative z-20">
                    <div className="border-b border-ink/10 pb-3 text-left flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div>
                            <div className="flex items-center gap-4 mb-1.5">
                                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-acid-deep">
                                    03 — Projects.featured()
                                </p>
                                <span className="w-12 h-[1px] bg-acid-deep/50" />
                            </div>
                            <h2
                                className="font-display uppercase text-3xl md:text-4xl lg:text-5xl leading-[0.85] text-ink"
                                data-testid="projects-heading"
                            >
                                Selected
                                <br />
                                work
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-1">
                            <button
                                onClick={() => onOpenWebArchive && onOpenWebArchive()}
                                className="font-mono font-bold text-[11px] tracking-widest uppercase px-5 py-2.5 rounded-full bg-ink text-paper dark:bg-white dark:text-black hover:bg-acid-deep hover:text-black transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(200,238,0,0.6)] hover:scale-105 flex items-center gap-2 group"
                            >
                                Xem Kho Lưu Trữ <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dual Tracks Container */}
                <div className="relative w-full perspective-[2000px] z-10 overflow-x-hidden flex flex-col gap-4 md:gap-6 py-1">
                    {/* Ambient Core Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-acid/10 rounded-full blur-[140px] pointer-events-none" />

                    {/* Lập trình công thức Toán học Trượt Nối Tiếp Căn Mép Hoàn Hảo */}
                    {(() => {
                        // Dải Web di chuyển trong 50% tiến trình đầu
                        const webProgress = Math.min(1, Math.max(0, progress * 2));
                        // Dải Game di chuyển trong 50% tiến trình sau
                        const gameProgress = Math.min(1, Math.max(0, (progress - 0.5) * 2));

                        const isWebActive = progress < 0.5;

                        return (
                            <>
                                {/* TRACK 1: WEB PROJECTS (Glides Left during Phase 1) */}
                                <div className={`relative z-[900] transition-all duration-700 ${isWebActive ? "opacity-100" : "opacity-40"}`}>
                                    <div className="max-w-7xl mx-auto px-6 md:px-10 w-full text-left mb-2">
                                        <span className={`font-mono text-[10px] text-acid-deep bg-acid/10 border px-3 py-0.5 rounded-full uppercase tracking-widest inline-block transition-all duration-500 ${isWebActive ? "border-acid/40 shadow-[0_0_20px_rgba(200,238,0,0.3)] ring-1 ring-acid/30" : "border-ink/10 shadow-none"}`}>
                                            🌐 ARCHIVE — WEB_APPLICATIONS {isWebActive && "◄ ACTIVE"}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            transform: `translateX(calc((-100% + 100vw) * ${webProgress}))`
                                        }}
                                        className="flex gap-5 px-6 md:px-10 w-[max-content] transition-transform duration-300 ease-out items-center pr-6 md:pr-10"
                                    >
                                        {webProjects.map((p, i) => (
                                            <div
                                                key={p.n}
                                                data-testid={`web-card-${i}`}
                                                onClick={() => onSelectProject && onSelectProject(p)}
                                                className="w-[calc(100vw-48px)] sm:w-[320px] md:w-[360px] lg:w-[400px] h-[210px] md:h-[260px] flex-shrink-0 transition-all duration-500 ease-out p-5 rounded-2xl border-2 border-ink dark:border-white/10 text-left shadow-2xl hover:shadow-[0_20px_50px_rgba(200,238,0,0.3)] hover:border-acid-deep hover:scale-105 hover:z-30 flex flex-col justify-between relative group overflow-hidden bg-white dark:bg-[#0f1115] cursor-pointer"
                                            >
                                                {/* Background Image & Sci-Fi Overlay */}
                                                <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
                                                    <img
                                                        src={p.bg}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover opacity-10 dark:opacity-60 group-hover:opacity-40 transition-all duration-700 ease-out group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white dark:from-[#0f1115] dark:via-[#0f1115]/60 dark:to-transparent z-10" />
                                                </div>

                                                {/* Glowing Top Bar */}
                                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-ink dark:bg-transparent group-hover:bg-acid group-hover:acid-glow transition-all duration-500 z-20" />

                                                {/* Top Metadata */}
                                                <div className="relative z-20">
                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-acid-deep text-sm font-black tracking-widest">
                                                                {p.n}
                                                            </span>
                                                            <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-ink text-white dark:bg-white/10 border border-ink dark:border-white/10 font-black uppercase tracking-wider">
                                                                {p.tag}
                                                            </span>
                                                        </div>
                                                        <span className="font-mono text-sm text-ink group-hover:text-acid-deep group-hover:translate-x-1 transition-all duration-300 font-black">
                                                            ↗
                                                        </span>
                                                    </div>

                                                    <h3 className="font-display uppercase text-xl md:text-2xl leading-tight text-ink dark:text-white group-hover:text-acid-deep transition-colors line-clamp-1">
                                                        {p.name}
                                                    </h3>
                                                    <p className="font-mono text-[11px] tracking-[0.05em] uppercase text-ink font-black dark:text-white mt-0.5 line-clamp-1">
                                                        {p.meta}
                                                    </p>
                                                </div>

                                                {/* Description */}
                                                <p className="text-ink dark:text-white font-body text-xs md:text-sm leading-relaxed line-clamp-2 my-auto py-1 relative z-20 font-black">
                                                    {p.desc}
                                                </p>

                                                {/* Footer Metrics & Pills */}
                                                <div className="pt-3 border-t-2 border-ink dark:border-white/10 flex flex-col gap-2 relative z-20">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono text-[10px] font-black text-acid-deep uppercase tracking-wider line-clamp-1">
                                                            {p.metrics}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5">
                                                        {p.tech.map((item, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="font-mono text-[9px] tracking-wider px-2.5 py-1 rounded bg-ink text-white dark:bg-white/10 font-black uppercase"
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}


                                    </div>
                                </div>

                                {/* TRACK 2: 3D GAMES & SIMULATIONS (Glides Right during Phase 2) */}
                                <div className={`relative z-10 transition-all duration-700 pointer-events-none ${!isWebActive ? "opacity-100" : "opacity-40"}`}>
                                    <div className="max-w-7xl mx-auto px-6 md:px-10 w-full text-left mb-2">
                                        <span className={`font-mono text-[10px] text-[#00e5ff] bg-[#00e5ff]/10 border-2 border-[#00e5ff]/40 px-3 py-1 rounded-full uppercase tracking-widest inline-block font-black transition-all duration-500 ${!isWebActive ? "shadow-[0_0_20px_rgba(0,229,255,0.3)] ring-1 ring-[#00e5ff]/30" : "opacity-50"}`}>
                                            🎮 ARCHIVE — 3D_GAMES & SIMULATIONS {!isWebActive && "◄ ACTIVE"}
                                        </span>
                                    </div>

                                    <div
                                        style={{
                                            transform: `translateX(calc((-100% + 100vw) * (1 - ${gameProgress})))`
                                        }}
                                        className="flex gap-5 px-6 md:px-10 w-[max-content] transition-transform duration-300 ease-out items-center pr-6 md:pr-10"
                                    >


                                        {/* Danh sách dự án Game đảo ngược (04, 03, 02, 01) */}
                                        {[...gameProjects].reverse().map((p, i) => (
                                            <div
                                                key={p.n}
                                                data-testid={`game-card-${i}`}
                                                onClick={() => onSelectProject && onSelectProject(p)}
                                                className="w-[calc(100vw-48px)] sm:w-[320px] md:w-[360px] lg:w-[400px] h-[210px] md:h-[260px] flex-shrink-0 transition-all duration-500 ease-out p-5 rounded-2xl border-2 border-ink dark:border-white/10 text-left shadow-2xl hover:shadow-[0_20px_50px_rgba(0,229,255,0.3)] hover:border-[#00e5ff] hover:scale-105 hover:z-30 flex flex-col justify-between relative group overflow-hidden bg-white dark:bg-[#0f1115] cursor-pointer pointer-events-auto"
                                            >
                                                {/* Background Image & Sci-Fi Overlay */}
                                                <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
                                                    <img
                                                        src={p.bg}
                                                        alt={p.name}
                                                        className="w-full h-full object-cover opacity-10 dark:opacity-60 group-hover:opacity-40 transition-all duration-700 ease-out group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white dark:from-[#0f1115] dark:via-[#0f1115]/60 dark:to-transparent z-10" />
                                                </div>

                                                {/* Glowing Top Bar */}
                                                <div className="absolute top-0 left-0 right-0 h-1.5 bg-ink dark:bg-transparent group-hover:bg-[#00e5ff] group-hover:shadow-[0_0_15px_#00e5ff] transition-all duration-500 z-20" />

                                                {/* Top Metadata */}
                                                <div className="relative z-20">
                                                    <div className="flex items-center justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-[#00e5ff] text-sm font-black tracking-widest">
                                                                {p.n}
                                                            </span>
                                                            <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-ink text-white dark:bg-white/10 border border-ink dark:border-white/10 font-black uppercase tracking-wider">
                                                                {p.tag}
                                                            </span>
                                                        </div>
                                                        <span className="font-mono text-sm text-ink group-hover:text-[#00e5ff] group-hover:translate-x-1 transition-all duration-300 font-black">
                                                            ↗
                                                        </span>
                                                    </div>

                                                    <h3 className="font-display uppercase text-xl md:text-2xl leading-tight text-ink dark:text-white group-hover:text-[#00e5ff] transition-colors line-clamp-1">
                                                        {p.name}
                                                    </h3>
                                                    <p className="font-mono text-[11px] tracking-[0.05em] uppercase text-ink font-black dark:text-white mt-0.5 line-clamp-1">
                                                        {p.meta}
                                                    </p>
                                                </div>

                                                {/* Description */}
                                                <p className="text-ink dark:text-white font-body text-xs md:text-sm leading-relaxed line-clamp-2 my-auto py-1 relative z-20 font-black">
                                                    {p.desc}
                                                </p>

                                                {/* Footer Metrics & Pills */}
                                                <div className="pt-3 border-t-2 border-ink dark:border-white/10 flex flex-col gap-2 relative z-20">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-mono text-[10px] font-black text-[#00e5ff] uppercase tracking-wider line-clamp-1">
                                                            {p.metrics}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5">
                                                        {p.tech.map((item, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="font-mono text-[9px] tracking-wider px-2.5 py-1 rounded bg-ink text-white dark:bg-white/10 font-black uppercase"
                                                            >
                                                                {item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </section>
    );
}
