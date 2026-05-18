import { introData, heroData } from "../data/portfolioData";

export default function Intro() {
    return (
        <section
            id="intro"
            data-testid="section-intro"
            className="relative min-h-[100vh] flex items-center py-32"
        >
            <div className="relative z-10 w-full px-8 md:px-16 lg:px-24 xl:px-32 flex justify-center md:justify-end items-center">
                <div className="w-full max-w-xl text-left">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="font-mono font-bold text-xs md:text-sm tracking-[0.3em] uppercase text-acid-deep">
                            {introData.status}
                        </span>
                    </div>
                    <p className="font-mono font-bold text-sm tracking-[0.25em] uppercase text-ink-soft mb-4">
                        &gt; ROLE = "{introData.role}"
                    </p>
                    <p className="text-ink opacity-90 font-base text-md md:text-xl lg:text-2xl leading-[1.6] mb-12">
                        {introData.description}
                    </p>

                    <div className="mt-8 pt-8 border-t border-ink/15 flex flex-wrap items-center gap-10 md:gap-28 font-mono text-ink-soft">
                        {heroData.metrics.map((m, idx) => (
                            <div key={idx}>
                                <div className="text-acid-deep text-3xl md:text-5xl font-display font-black tracking-tight mb-1">
                                    {m.value}
                                </div>
                                <div className="text-[9px] md:text-xs font-bold tracking-widest uppercase">{m.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
