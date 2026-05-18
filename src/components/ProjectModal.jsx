import { useEffect } from "react";

export default function ProjectModal({ project, onClose }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!project) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md transition-all duration-500"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-4xl bg-[#0f1115] border border-acid/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col md:flex-row text-white text-left transition-transform duration-500 scale-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Nút Close góc trên */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/50 border border-white/10 hover:border-acid hover:text-acid flex items-center justify-center font-mono text-sm transition-all"
                >
                    ✕
                </button>

                {/* Phần Trái: Ảnh Banner */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden bg-black flex flex-col justify-end">
                    <img 
                        src={project.bg || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"} 
                        alt={project.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/40 to-transparent" />
                    
                    {/* Metadata hiển thị trên ảnh */}
                    <div className="relative z-10 p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-acid/20 border border-acid/30 text-acid-deep font-bold tracking-widest uppercase">
                                {project.tag || "Featured"}
                            </span>
                        </div>
                        <h2 className="font-display text-2xl md:text-4xl uppercase font-bold text-white leading-tight">
                            {project.name}
                        </h2>
                        <p className="font-mono text-xs text-white/60 tracking-wider mt-1 uppercase">
                            {project.meta}
                        </p>
                    </div>
                </div>

                {/* Phần Phải: Chi tiết thông tin */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
                    <div>
                        <div className="border-b border-white/10 pb-4 mb-6">
                            <p className="font-mono text-xs tracking-widest text-acid uppercase mb-1">
                                // PROJECT OVERVIEW
                            </p>
                            <p className="text-white/80 font-body text-sm leading-relaxed">
                                {project.desc}
                            </p>
                        </div>

                        {/* Chỉ số nổi bật */}
                        <div className="mb-6">
                            <p className="font-mono text-xs tracking-widest text-acid uppercase mb-2">
                                // KEY ARCHITECTURAL METRICS
                            </p>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                                <span className="text-xl">⚡</span>
                                <span className="font-mono text-xs font-bold text-acid-deep uppercase tracking-wider">
                                    {project.metrics || "High Performance Shading & Computing"}
                                </span>
                            </div>
                        </div>

                        {/* Công nghệ sử dụng */}
                        <div className="mb-8">
                            <p className="font-mono text-xs tracking-widest text-acid uppercase mb-3">
                                // TECH STACK & INTEGRATIONS
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {project.tech?.map((t, idx) => (
                                    <span 
                                        key={idx}
                                        className="font-mono text-xs px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-white/90 uppercase"
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex gap-4 pt-4 border-t border-white/10">
                        <a 
                            href={project.projectLink || "#"}
                            target={project.projectLink && project.projectLink !== "#" ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="flex-1 py-3 px-4 rounded-xl bg-acid text-black font-mono text-xs font-bold uppercase tracking-wider text-center hover:bg-acid-deep transition-colors shadow-lg shadow-acid/20"
                        >
                            ↗ Visit Live Preview
                        </a>
                        <a 
                            href={project.githubLink || "#"}
                            target={project.githubLink && project.githubLink !== "#" ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            className="py-3 px-5 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-xs uppercase tracking-wider text-center hover:bg-white/20 transition-colors"
                        >
                            &lt;/&gt; Source
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
