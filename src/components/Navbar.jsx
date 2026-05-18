import { useEffect, useState } from "react";
import { navLinks } from "../data/portfolioData";
import { auth, signInWithGoogle, logOut } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar({ isDark, toggleDark }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const go = (id) => (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <>
            <div className="flex justify-center w-full fixed top-0 left-0 z-50 pointer-events-none">
            <nav
                data-testid="main-navbar"
                className={`pointer-events-auto transition-all duration-500 rounded-full w-[98%] max-w-[1400px] flex items-center justify-between px-4 md:px-6 ${
                    scrolled
                        ? "mt-4 h-16 bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-2xl border border-ink/10 dark:border-white/10 shadow-lg dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]"
                        : "mt-6 h-16 bg-white/10 dark:bg-black/10 backdrop-blur-lg border border-ink/5 dark:border-white/5 shadow-sm"
                }`}
            >
                {/* Logo */}
                <a
                    href="#hero"
                    onClick={go("hero")}
                    className="font-display font-black text-lg md:text-xl tracking-tight text-ink flex items-center gap-3 group pointer-events-auto"
                >
                    <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-acid-deep bg-ink/5 dark:bg-white/5 shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <img 
                            src="/AnhMyself-removebg-preview.png" 
                            alt="Logo" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="hidden sm:block">
                        Ocean
                    </span>
                </a>

                {/* Animated Links */}
                <ul className="hidden lg:flex items-center gap-2 xl:gap-3">
                    {navLinks.map((l) => (
                        <li key={l.id}>
                            <a
                                href={`#${l.id}`}
                                onClick={go(l.id)}
                                className="relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer transition-all duration-500 hover:w-[100px] xl:hover:w-[120px] group/item bg-ink/5 dark:bg-white/5 shadow-inner"
                            >
                                {/* Gradient Background & Glow */}
                                <div 
                                    className="absolute inset-0 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity duration-500 z-0"
                                    style={{ background: `linear-gradient(45deg, ${l.i}, ${l.j})` }}
                                ></div>
                                <div 
                                    className="absolute inset-0 top-2 rounded-full opacity-0 group-hover/item:opacity-50 blur-[10px] transition-opacity duration-500 z-[-1]"
                                    style={{ background: `linear-gradient(45deg, ${l.i}, ${l.j})` }}
                                ></div>

                                {/* Icon */}
                                <span className="absolute flex items-center justify-center text-ink/70 dark:text-white/70 transition-all duration-500 delay-[200ms] group-hover/item:scale-0 group-hover/item:delay-0 z-10 text-sm">
                                    <i className={l.icon}></i>
                                </span>

                                {/* Title */}
                                <span className="absolute text-white font-mono text-[9px] xl:text-[11px] font-bold tracking-widest uppercase scale-0 transition-all duration-500 delay-0 group-hover/item:scale-100 group-hover/item:delay-[200ms] z-10 whitespace-nowrap">
                                    {l.label}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={toggleDark}
                            className="w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 border border-ink/10 dark:border-white/10 flex items-center justify-center text-ink hover:bg-[#c8ee00] hover:text-black hover:border-transparent transition-all shadow-sm"
                            title="Toggle Theme"
                        >
                            {isDark ? <i className="fa-solid fa-sun text-sm"></i> : <i className="fa-solid fa-moon text-sm"></i>}
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-10 h-10 rounded-full bg-white/50 dark:bg-black/50 border border-ink/10 dark:border-white/10 flex items-center justify-center text-ink hover:bg-[#c8ee00] hover:text-black transition-all shadow-sm"
                        >
                            <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
                        </button>
                    
                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent('openChatbot', { detail: { type: 'hire' } }));
                        }}
                        className="hidden md:flex font-mono font-bold text-[11px] tracking-widest uppercase px-6 py-2.5 rounded-full bg-ink text-paper dark:bg-white dark:text-black hover:bg-[#c8ee00] hover:text-black dark:hover:bg-[#c8ee00] transition-all shadow-md items-center gap-2 group"
                    >
                        Hire Me <i className="fa-solid fa-arrow-right-long group-hover:translate-x-1 transition-transform"></i>
                    </a>
                </div>
            </nav>
        </div>

        {/* Mobile Menu Drawer */}
        <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="absolute inset-0 bg-paper/90 backdrop-blur-xl" onClick={() => setMobileMenuOpen(false)}></div>
            <div className={`absolute right-0 top-0 h-full w-[280px] bg-white dark:bg-[#0a0a0a] border-l border-ink/10 shadow-2xl transition-transform duration-500 transform ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex flex-col h-full p-8">
                    <div className="flex items-center justify-between mb-12">
                        <span className="font-display font-black text-xl text-ink">MENU</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-2xl text-ink"><i className="fa-solid fa-xmark"></i></button>
                    </div>
                    <ul className="flex flex-col gap-6">
                        {navLinks.map((l) => (
                            <li key={l.id}>
                                <a
                                    href={`#${l.id}`}
                                    onClick={go(l.id)}
                                    className="flex items-center gap-4 text-ink hover:text-acid-deep transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-ink/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-acid-deep group-hover:text-black transition-all">
                                        <i className={l.icon}></i>
                                    </div>
                                    <span className="font-display text-2xl font-bold uppercase tracking-tighter">{l.label}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </>
);
}
