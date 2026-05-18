export default function Ticker() {
    const items = [
        "AVAILABLE FOR JOB",
        "FULL-STACK · GAME · AI",
        "BASED IN VIETNAM · GMT+7",
        "OPEN TO COLLABORATIONS",
        "SHIPPING SINCE 2023",
    ];
    const row = [...items, ...items];
    return (
        <div
            data-testid="marquee-ticker"
            className="relative z-10 border-y border-ink/15 bg-paper-soft/60 backdrop-blur-sm overflow-hidden py-5"
        >
            <div className="animate-ticker flex whitespace-nowrap gap-12 font-display uppercase text-3xl md:text-5xl">
                {row.map((t, i) => (
                    <span
                        key={i}
                        className={`flex items-center gap-12 ${i % 2 === 0 ? "text-ink" : "text-acid-deep"
                            }`}
                    >
                        {t}
                        <span className="text-acid-deep text-2xl">★</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
