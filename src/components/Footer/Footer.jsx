import { useEffect, useState } from "react";
import "./Footer.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { footerData } from "../../data/portfolioData";

export default function Footer() {
    const [githubData, setGithubData] = useState({ repos: 0, followers: 0, latestCommit: "Fetching...", loading: true });

    useEffect(() => {
        const fetchGithubData = async () => {
            try {
                // Fetch basic user info
                const userRes = await fetch(`https://api.github.com/users/${footerData.githubUsername}`);
                const userData = await userRes.json();

                // Fetch recent events
                const eventsRes = await fetch(`https://api.github.com/users/${footerData.githubUsername}/events/public`);
                const eventsData = await eventsRes.json();

                let commitMsg = "No recent commits";
                if (Array.isArray(eventsData)) {
                    const latestPush = eventsData.find(e => e.type === "PushEvent");
                    if (latestPush && latestPush.payload.commits && latestPush.payload.commits.length > 0) {
                        commitMsg = latestPush.payload.commits[0].message;
                        if (commitMsg.length > 30) commitMsg = commitMsg.substring(0, 30) + "...";
                    }
                }

                setGithubData({
                    repos: userData.public_repos || 0,
                    followers: userData.followers || 0,
                    latestCommit: commitMsg,
                    loading: false
                });
            } catch (error) {
                console.error("Error fetching GitHub data:", error);
                setGithubData(prev => ({ ...prev, loading: false, latestCommit: "Fetch failed" }));
            }
        };

        fetchGithubData();
    }, []);

    const scrollToId = (id) => {
        const view = document.getElementById(id);
        if (view) view.scrollIntoView({ behavior: "smooth", block: 'start' });
    }

    return (
        <footer className="w-full bg-paper border-t border-ink/15 text-ink py-10 transition-colors duration-500 relative z-20">
            <div className="w-full px-6 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16 items-center">

                    {/* Left: My Motto */}
                    <div className="flex flex-col gap-6 md:col-span-1">
                        <h4 className="font-display uppercase text-2xl tracking-widest text-ink flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-acid text-[#0a0a0a] flex items-center justify-center text-sm shadow-md">✨</span>
                            My Motto
                        </h4>
                        <div className="bg-white/60 dark:bg-[#1a1c23]/60 border border-ink/10 p-6 rounded-2xl shadow-sm backdrop-blur-md transition-colors duration-500">
                            <p className="font-body italic text-ink opacity-80 text-[15px] leading-relaxed mb-5">
                                {footerData.motto}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-acid-deep/20 text-ink text-[9px] font-mono uppercase tracking-widest rounded-full border border-acid-deep/30">
                                    🚀 10+ Projects
                                </span>
                                <span className="px-3 py-1.5 bg-ink/5 dark:bg-white/5 text-ink text-[9px] font-mono uppercase tracking-widest rounded-full border border-ink/10">
                                    💡 Tech Passionate
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Follow Me (Kept exact social blocks + Footer.css) */}
                    <div className="flex flex-col gap-2 items-center justify-center overflow-visible md:col-span-2">
                        <h4 className="font-display uppercase text-2xl tracking-widest text-ink mb-4">
                            Follow Me
                        </h4>
                        <ul className="footer-social">
                            {footerData.socialLinks.map((link, idx) => (
                                <li key={idx}>
                                    <a href={link.href} target="_blank" rel="noreferrer">
                                        <i className={`fa ${link.icon}`}></i>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right: Terminal Status */}
                    <div className="flex flex-col gap-6 items-start md:items-end w-full md:col-span-1">
                        <h4 className="font-display uppercase text-2xl tracking-widest text-ink flex items-center gap-3 flex-row-reverse md:flex-row">
                            System
                            <span className="w-8 h-8 rounded-full bg-ink text-paper dark:bg-white dark:text-black flex items-center justify-center text-sm shadow-md">⚡</span>
                        </h4>

                        <div className="w-full bg-[#11131a] dark:bg-black/60 rounded-xl border border-ink/20 shadow-xl p-4 font-mono text-[10px] md:text-xs overflow-hidden relative group text-white hover:scale-[1.02] transition-transform duration-300">
                            {/* Window controls */}
                            <div className="flex items-center gap-1.5 mb-3 border-b border-white/10 pb-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></span>
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                                <span className="ml-2 text-white/40 font-bold tracking-wider">guest@ocean-sys:~</span>
                            </div>

                            {/* Terminal output */}
                            <div className="flex flex-col gap-2 tracking-wide leading-relaxed text-left">
                                <p><span className="text-[#c8ee00]">➜</span> <span className="text-[#3b82f6]">~</span> <span className="text-white">git status</span></p>
                                <p className="text-white/60">On branch main</p>
                                <p className="text-white/60">Your branch is up to date with 'origin/main'.</p>

                                <p className="mt-1"><span className="text-[#c8ee00]">➜</span> <span className="text-[#3b82f6]">~</span> <span className="text-white">node fetch-stats.js</span></p>
                                <div className="flex flex-col gap-1 text-white/60 ml-2 border-l border-white/20 pl-3 py-1">
                                    <p>Public Repos: <span className="text-[#c8ee00] font-bold">{githubData.loading ? "..." : githubData.repos}</span></p>
                                    <p>Followers: <span className="text-[#c8ee00] font-bold">{githubData.loading ? "..." : githubData.followers}</span></p>
                                    <p>Latest Commit: <span className="text-[#c8ee00] font-bold text-[9px] md:text-[10px]">"{githubData.loading ? "..." : githubData.latestCommit}"</span></p>
                                    <p>Status: <span className="text-[#10b981] font-bold animate-[pulse_2s_ease-in-out_infinite]">● Available for work</span></p>
                                </div>

                                <p className="mt-1 flex items-center gap-1.5">
                                    <span className="text-[#c8ee00]">➜</span> <span className="text-[#3b82f6]">~</span>
                                    <span className="w-2 h-3.5 bg-[#c8ee00] animate-[blink_1s_steps(2)_infinite]"></span>
                                </p>
                            </div>

                            {/* Subtle Glass Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#c8ee00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-10 border-t border-ink/10 text-center justify-between items-center transition-colors duration-500">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink opacity-60">
                        © {new Date().getFullYear()} Ocean. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
// Trigger Webpack rebuild
