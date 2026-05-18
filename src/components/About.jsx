import { useState, useEffect, useRef } from "react";
import CanvasCard from "./ui/card/CanvasCard";
import { aboutData } from "../data/portfolioData";

export default function About({ isDark }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="about"
            ref={sectionRef}
            data-testid="section-about"
            className="relative min-h-[100vh] flex flex-col lg:flex-row items-center py-20 lg:py-32 overflow-hidden"
        >
            <div
                className={`relative lg:absolute top-0 left-0 w-full lg:w-[45%] h-[400px] lg:h-full pointer-events-auto transition-transform duration-1000 ease-out transform ${isVisible ? "translate-y-0" : "translate-y-20 opacity-0"
                    }`}
            >
                <CanvasCard mode={isDark ? "dark" : "light"} />
            </div>

            <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                <div
                    className={`lg:col-span-8 lg:col-start-5 p-4 md:p-8 text-left transition-all duration-1000 delay-300 ease-out transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                        }`}
                >
                    <p className="font-mono text-[11px] tracking-[0.3em] uppercase text-acid-deep mb-5">
                        {aboutData.sectionTag}
                    </p>
                    <h2
                        className="font-display uppercase text-4xl md:text-5xl lg:text-6xl leading-[0.9] mb-8 text-ink"
                        data-testid="about-heading"
                    >
                        {aboutData.headingLines[0]}
                        <br />
                        {aboutData.headingLines[1]}
                        <br />
                        {aboutData.headingLines[2]}
                    </h2>
                    <div className="space-y-5 text-ink opacity-80 font-body text-base md:text-lg leading-relaxed max-w-4xl">
                        {aboutData.paragraphs.map((para, idx) => (
                            <p key={idx}>{para}</p>
                        ))}
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 max-w-4xl font-mono text-sm tracking-wider">
                        {aboutData.infoGrid.map((info) => (
                            <div
                                key={info.label}
                                className="flex justify-between border-b border-ink/15 pb-2"
                            >
                                <span className="text-ink-soft uppercase">
                                    {info.label}
                                </span>
                                <span
                                    className={
                                        info.value === "Open"
                                            ? "text-acid-deep font-bold"
                                            : "text-ink"
                                    }
                                >
                                    {info.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
