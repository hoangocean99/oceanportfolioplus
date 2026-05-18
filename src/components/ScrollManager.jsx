import { useEffect } from "react";
import Lenis from "lenis";
import { scrollStore } from "../lib/scrollStore";

const SECTION_IDS = [
    "hero",
    "intro",
    "about",
    "experience",
    "projects",
    "skills",
    "contact",
];

export default function ScrollManager() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            wheelMultiplier: 1,
        });

        const onScroll = () => {
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const scrollY = window.scrollY;
            const progress = docHeight > 0 ? scrollY / docHeight : 0;

            // Determine which section & how far we are within it
            const winCenter = scrollY + window.innerHeight / 2;
            let activeIdx = 0;
            let sectionProgress = 0;
            for (let i = 0; i < SECTION_IDS.length; i++) {
                const el = document.getElementById(SECTION_IDS[i]);
                if (!el) continue;
                const top = el.offsetTop;
                const height = el.offsetHeight;
                if (winCenter >= top && winCenter < top + height) {
                    activeIdx = i;
                    sectionProgress = (winCenter - top) / height;
                    break;
                }
                if (winCenter >= top + height) {
                    activeIdx = i;
                    sectionProgress = 1;
                }
            }
            scrollStore.setProgress(progress, activeIdx, sectionProgress);
        };

        lenis.on("scroll", onScroll);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        let rafId;
        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }
        rafId = requestAnimationFrame(raf);

        const onMouse = (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = -(e.clientY / window.innerHeight - 0.5) * 2;
            scrollStore.setMouse(x, y);
        };
        window.addEventListener("mousemove", onMouse);
        window.addEventListener("resize", onScroll);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return null;
}
