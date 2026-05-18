import { useState, useRef, useEffect } from "react";
import { experienceData as timeline } from "../data/portfolioData";

export default function Experience() {
    const containerRef = useRef(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Kiểm tra kích thước màn hình để tự động điều chỉnh layout trái/phải hoặc giữa
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Tính toán tỷ lệ cuộn khi người dùng đi qua vùng 400vh
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const totalScroll = rect.height - window.innerHeight;

            // Tỷ lệ cuộn từ 0.0 đến 1.0
            let progress = -rect.top / totalScroll;
            progress = Math.max(0, Math.min(1, progress));

            setScrollProgress(progress);

            // Cập nhật active index
            const currentIdx = Math.round(progress * (timeline.length - 1));
            setActiveIndex(currentIdx);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Hàm hỗ trợ click nhảy nhanh đến vị trí cuộn tương ứng
    const scrollToItem = (idx) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const totalScroll = rect.height - window.innerHeight;
        const targetScrollY = window.scrollY + rect.top + (idx / (timeline.length - 1)) * totalScroll;
        window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    };

    return (
        <section
            id="experience"
            ref={containerRef}
            data-testid="section-experience"
            className="relative h-[400vh] bg-paper text-ink transition-colors duration-500 select-none"
        >
            {/* Nhúng CSS 3D Engine */}
            <style>{`
                .transform-style-3d {
                    transform-style: preserve-3d;
                    perspective: 2500px;
                }
            `}</style>

            {/* Khung Sticky bám dính màn hình trong suốt quá trình cuộn */}
            <div className="sticky top-0 w-full h-screen flex flex-col justify-center items-center overflow-hidden perspective-[2500px]">

                {/* Ambient Glow Lõi Trục Xoay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-acid-deep/5 blur-[120px] pointer-events-none" />

                {/* Tiêu đề góc trái phía trên */}
                <div className="absolute top-12 left-6 md:left-12 z-50 pointer-events-none text-left">
                    <div className="flex items-center gap-3 mb-2">
                        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-acid-deep font-bold">
                            02 — Career.Experiences()
                        </p>
                    </div>
                    <h2 className="font-display uppercase text-3xl md:text-5xl font-black leading-none text-ink tracking-tight">
                        Trajectory
                    </h2>
                </div>

                {/* SÂN KHẤU TRỤC BÁNH XE XOAY DỌC 3D (VERTICAL FERRIS WHEEL DRUM) */}
                <div className="relative w-full max-w-6xl h-[600px] flex items-center justify-center transform-style-3d px-6">

                    {timeline.map((t, i) => {
                        // Vị trí thực tại của bánh xe dựa trên tiến trình scroll (0.0 -> 3.0)
                        const currentFloat = scrollProgress * (timeline.length - 1);
                        const diff = i - currentFloat;
                        const isEven = i % 2 === 0;

                        // Góc xoay dọc (theta): mỗi item cách nhau 60 độ
                        const theta = diff * 60;
                        const rad = (theta * Math.PI) / 180;
                        const radius = 350; // Bán kính trục bánh xe (px)

                        // Tính toán tọa độ Y (lên/xuống) và Z (xa/gần)
                        const y = Math.sin(rad) * radius;
                        const z = Math.cos(rad) * radius - radius + 150;

                        // Phân bổ X: Thẻ chẵn nằm bên Trái (-300px), thẻ lẻ nằm bên Phải (300px) trên Desktop
                        // Trên thiết bị Mobile, giữ nguyên chính giữa (0px)
                        const x = isMobile ? 0 : (isEven ? -300 : 300);

                        // Độ xoay rotateX để mặt thẻ lật theo vòng cung của bánh xe
                        const rotateX = -theta;

                        // Tính toán độ mờ (opacity) và tỷ lệ (scale)
                        const absDiff = Math.abs(diff);
                        const isActive = absDiff < 0.35;
                        const opacity = Math.max(0, 1 - absDiff * 0.65);
                        const scale = Math.max(0.65, 1 - absDiff * 0.25);

                        return (
                            <div
                                key={i}
                                onClick={() => scrollToItem(i)}
                                style={{
                                    transform: `translateX(${x}px) translateY(${y}px) translateZ(${z}px) rotateX(${rotateX}deg) scale(${scale})`,
                                    opacity: opacity,
                                    zIndex: Math.round(100 - absDiff * 10),
                                    willChange: "transform, opacity"
                                }}
                                className={`absolute w-[90%] md:w-[450px] transition-all duration-100 ease-out p-6 md:p-10 rounded-3xl bg-paper/95 dark:bg-[#0f1115]/95 backdrop-blur-2xl border text-left cursor-pointer overflow-hidden group/card ${isActive
                                    ? "border-acid-deep ring-2 ring-acid-deep/40 shadow-[0_30px_90px_rgba(0,255,102,0.25)] z-50"
                                    : "border-ink/10 shadow-lg hover:border-ink/30"
                                    }`}
                            >
                                {/* Background Image & Overlay */}
                                {t.bg && (
                                    <div className="absolute inset-0 z-0 opacity-40 group-hover/card:opacity-60 transition-opacity duration-700">
                                        <img
                                            src={t.bg}
                                            alt={t.role}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-paper/90 dark:from-[#0f1115]/90 via-transparent to-transparent" />
                                    </div>
                                )}

                                {/* Badge mốc thời gian */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                                    <div className={`px-4 py-1 rounded-full border text-[10px] font-mono tracking-widest font-bold shadow-md transition-colors duration-500 ${isActive
                                        ? "bg-acid-deep text-black border-acid-deep animate-pulse shadow-[0_0_15px_#00ff66]"
                                        : "bg-ink/10 text-ink opacity-60 border-ink/10 dark:bg-white/10 dark:text-white/60"
                                        }`}>
                                        TIMELINE: {t.period}
                                    </div>
                                </div>

                                <div className="relative z-10 flex flex-col justify-between gap-6 pt-10">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink/10 pb-6">
                                        <div>
                                            <h3 className={`font-display uppercase text-2xl md:text-3xl font-bold transition-colors duration-500 leading-tight ${isActive ? "text-acid-deep" : "text-ink"
                                                }`}>
                                                {t.role}
                                            </h3>
                                        </div>
                                        <span className="font-mono text-xs px-3 py-1.5 rounded-xl bg-ink/5 border border-ink/10 text-ink-soft self-start md:self-auto uppercase tracking-wider font-semibold">
                                            {t.org}
                                        </span>
                                    </div>

                                    <p className="text-ink opacity-80 font-body text-sm md:text-base leading-relaxed">
                                        {t.desc}
                                    </p>

                                    {/* Footer Metrics */}
                                    <div className="pt-4 border-t border-ink/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <span className={`font-mono text-xs px-3 py-1.5 rounded-lg border transition-colors duration-500 ${isActive
                                            ? "bg-acid/10 border-acid/30 text-acid-deep font-bold shadow-sm"
                                            : "bg-ink/5 border-ink/10 text-ink-soft"
                                            }`}>
                                            {t.metric}
                                        </span>

                                        <div className="flex flex-wrap gap-1.5">
                                            {t.tech.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="font-mono text-[10px] tracking-wider px-2 py-1 rounded bg-ink/5 text-ink-soft uppercase"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
