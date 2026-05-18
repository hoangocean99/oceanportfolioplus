// Tiny shared store for scroll progress (0..1) used by the 3D scene.
// We use a mutable ref-like object + subscribers to avoid re-renders on every frame.

const state = {
    progress: 0,
    section: 0, // 0..5 (hero, about, skills, projects, experience, contact)
    sectionProgress: 0, // 0..1 within the current section
    mouseX: 0,
    mouseY: 0,
};

const listeners = new Set();

export const scrollStore = {
    get() {
        return state;
    },
    setProgress(p, section, sectionProgress) {
        state.progress = p;
        state.section = section;
        state.sectionProgress = sectionProgress;
        listeners.forEach((l) => l(state));
    },
    setMouse(x, y) {
        state.mouseX = x;
        state.mouseY = y;
    },
    subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
};
