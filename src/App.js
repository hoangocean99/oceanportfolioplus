import { useState, useEffect } from "react";
import "./App.css";
import { Toaster } from "sonner";

import Scene3D from "./components/Scene3D";
import ScrollManager from "./components/ScrollManager";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Intro from "./components/Intro";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader";
import Ticker from "./components/Ticker";
import Chatbot from "./components/Chatbot";

import ProjectModal from "./components/ProjectModal";
import ProjectArchive from "./components/ProjectArchive";
import CustomCursor from "./components/ui/CustomCursor";
import TechRain from "./components/ui/TechRain";

function App() {
    // Khởi tạo theme từ localStorage, mặc định là true (dark mode) cho lần đầu
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("portfolio-theme");
        return saved !== null ? saved === "dark" : true;
    });
    
    const [currentView, setCurrentView] = useState("main"); // "main" | "web-archive" | "game-archive"
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        console.log("App currentView changed to:", currentView);
    }, [currentView]);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("portfolio-theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("portfolio-theme", "light");
        }
    }, [isDark]);

    // Tự động cuộn lên đầu trang khi chuyển view
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentView]);

    return (
        <div className="App relative min-h-screen bg-paper text-ink bg-noise transition-colors duration-500">
            <Loader isDark={isDark} />
            
            <CustomCursor />
            <TechRain isDark={isDark} />
            <ScrollManager />
            <Scene3D />
            <div className="fixed inset-0 pointer-events-none z-[1] bg-tech-grid opacity-50" />
            <div className="fixed inset-0 pointer-events-none z-[2] bg-white/20 dark:bg-[#0f1115]/20 transition-colors duration-500" />

            <div className="relative z-10">
                <Navbar isDark={isDark} toggleDark={() => setIsDark(!isDark)} />
                
                {/* HIỂN THỊ CHÍNH (MAIN PORTFOLIO) */}
                {currentView === "main" && (
                    <main>
                        <Hero />
                        <Intro />
                        <div className="bg-paper relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.3)] transition-colors duration-500">
                            <Ticker />
                            <About isDark={isDark} />
                            <Experience isDark={isDark} />
                            <Projects 
                                onSelectProject={(p) => setSelectedProject(p)}
                                onOpenWebArchive={() => setCurrentView("web-archive")}
                                onOpenGameArchive={() => setCurrentView("game-archive")}
                            />
                            <Skills isDark={isDark} />
                            <Contact />
                            <Footer />
                        </div>
                    </main>
                )}

                {/* KHO LƯU TRỮ DỰ ÁN (Gộp Web và Game) */}
                {(currentView === "web-archive" || currentView === "game-archive") && (
                    <ProjectArchive 
                        defaultType={currentView === "web-archive" ? "web" : "game"}
                        onBack={() => setCurrentView("main")} 
                        onSelectProject={(p) => setSelectedProject(p)}
                    />
                )}
            </div>

            {/* MODAL CHI TIẾT DỰ ÁN */}
            <ProjectModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
            />

            <Chatbot />

            <Toaster
                theme={isDark ? "dark" : "light"}
                position="bottom-right"
                toastOptions={{
                    style: {
                        background: isDark ? "#171921" : "#ffffff",
                        border: `1px solid ${isDark ? "#2b2e3b" : "#1a1a1a"}`,
                        color: isDark ? "#f3eee3" : "#0a0a0a",
                        fontFamily: "JetBrains Mono, monospace",
                        fontSize: "12px",
                        borderRadius: 0,
                    },
                }}
            />
        </div>
    );
}

export default App;
