import { useState } from "react";
import { allGameArchiveProjects as allGameProjects } from "../data/portfolioData";

export default function GameArchive({ onBack, onSelectProject }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filteredProjects = allGameProjects.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                              p.desc.toLowerCase().includes(search.toLowerCase()) ||
                              p.tech.some(t => t.toLowerCase().includes(search.toLowerCase()));
        const matchesFilter = filter === "All" || p.tag === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-[#0a0c10] text-white py-12 px-6 md:px-12 relative z-50">
            {/* Thanh điều hướng quay lại */}
            <div className="max-w-7xl mx-auto flex items-center justify-between border-b border-white/10 pb-6 mb-12">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#00e5ff] hover:translate-x-[-4px] transition-transform py-2 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#00e5ff]/40"
                >
                    ← Quay lại trang chủ
                </button>
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest hidden md:inline">
                    3D_GAMES_SIMULATIONS_ARCHIVE // WebGPU - WebGL
                </span>
            </div>

            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12 text-left">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-3 h-3 rounded-full bg-[#00e5ff] animate-pulse shadow-[0_0_10px_#00e5ff]" />
                    <span className="font-mono text-xs text-[#00e5ff] tracking-[0.2em] uppercase font-bold">
                        KHO LƯU TRỮ GAME & ĐỒ HỌA 3D CHUYÊN SÂU
                    </span>
                </div>
                <h1 className="font-display uppercase text-4xl md:text-6xl font-bold text-white leading-none mb-6">
                    Games & 3D Archive<span className="text-[#00e5ff]">.</span>
                </h1>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-[#0f1115] p-4 rounded-2xl border border-white/10">
                    <input 
                        type="text"
                        placeholder="Tìm kiếm theo tên, mô tả hoặc công nghệ (WebGPU, Three.js, Shaders)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent border-none text-white px-4 py-2 font-mono text-sm placeholder:text-white/30 focus:outline-none"
                    />
                    <div className="flex flex-wrap gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 pl-0 md:pl-4">
                        {["All", "WebGL", "WebGPU", "VR", "Indie 2D"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`font-mono text-xs px-4 py-2 rounded-xl border transition-all uppercase tracking-wider ${
                                    filter === f 
                                        ? "bg-[#00e5ff] text-black font-bold border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)]" 
                                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid hiển thị dự án */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {filteredProjects.map((p) => (
                    <div
                        key={p.n}
                        onClick={() => onSelectProject(p)}
                        className="h-[260px] rounded-2xl border border-white/10 p-6 bg-[#0f1115] hover:border-[#00e5ff] hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between relative group overflow-hidden cursor-pointer shadow-xl text-left"
                    >
                        {/* Ảnh nền overlay */}
                        <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl pointer-events-none">
                            <img 
                                src={p.bg} 
                                alt={p.name} 
                                className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-700 ease-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/70 to-transparent z-10" />
                        </div>

                        {/* Top Metadata */}
                        <div className="relative z-20">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-mono text-[#00e5ff] text-xs font-bold tracking-widest">
                                    {p.n}
                                </span>
                                <span className="font-mono text-[9px] px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-white uppercase tracking-widest">
                                    {p.tag}
                                </span>
                            </div>
                            <h3 className="font-display uppercase text-2xl font-bold text-white group-hover:text-[#00e5ff] transition-colors">
                                {p.name}
                            </h3>
                            <p className="font-mono text-[10px] text-white/50 tracking-wider uppercase mt-1">
                                {p.meta}
                            </p>
                        </div>

                        {/* Mô tả */}
                        <p className="text-white/80 font-body text-xs leading-relaxed line-clamp-2 my-auto relative z-20">
                            {p.desc}
                        </p>

                        {/* Footer & Tech Pills */}
                        <div className="pt-3 border-t border-white/10 flex flex-col gap-2 relative z-20">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_10px_#00e5ff]" />
                                <span className="font-mono text-[10px] font-bold text-[#00e5ff] uppercase tracking-wider line-clamp-1">
                                    {p.metrics}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {p.tech.map((t, idx) => (
                                    <span key={idx} className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/10 text-white/90 uppercase">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="col-span-full py-20 text-center text-white/40 font-mono text-sm uppercase">
                        Không tìm thấy dự án phù hợp với bộ lọc.
                    </div>
                )}
            </div>
        </div>
    );
}
