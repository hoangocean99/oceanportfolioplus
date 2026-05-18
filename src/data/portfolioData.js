import React from "react";

// ==========================================
// 1. HERO SECTION DATA
// ==========================================
export const heroData = {
    sysStatus: "SYS.ONLINE",
    titleLines: ["Hoang", "Duong"],
    metrics: [
        { value: "1", label: "Years.Exp" },
        { value: "24", label: "Projects.Live" },
        { value: "100%", label: "Success.Rate" },
    ],
};

// ==========================================
// 2. NAVIGATION DATA
// ==========================================
export const navLinks = [
    { id: "hero", label: "Home", icon: "fa-solid fa-house", i: "#8a6aff", j: "#5c00b3" },
    { id: "intro", label: "Role", icon: "fa-solid fa-id-badge", i: "#00add8", j: "#006b86" },
    { id: "about", label: "About", icon: "fa-solid fa-user", i: "#2e7d32", j: "#064a1f" },
    { id: "experience", label: "Exp", icon: "fa-solid fa-timeline", i: "#d68933", j: "#b35c00" },
    { id: "projects", label: "Work", icon: "fa-solid fa-briefcase", i: "#2196f3", j: "#01579b" },
    { id: "skills", label: "Skills", icon: "fa-solid fa-cube", i: "#c8ee00", j: "#6f8400" },
    { id: "contact", label: "Contact", icon: "fa-solid fa-envelope", i: "#c2185b", j: "#880e4f" },
];

// ==========================================
// 3. ID CARD DATA
// ==========================================
export const idCardData = {
    name: "Ocean (HaiDuong)",
    role: "Full-Stack Developer",
    dept: "Engineering & Design",
    skills: "React, Three.js, Node.js",
    socials: {
        github: "github.com/HoangOcean99",
        email: "duonghaiduong090905@gmail.com",
        website: "https://haiduong.name.vn/"
    },
    barcode: "HE190117",
    location: "Từ Liêm, Hà Nội",
    phone: "+84 (0) 968178905"
};

// ==========================================
// 4. INTRO SECTION DATA
// ==========================================
export const introData = {
    status: "AVAILABLE FOR HIRE",
    role: "FULL_STACK_DEVELOPER",
    description: "I architect performant web experiences and ship production-grade systems. Currently obsessing over 3D on the web, edge-runtime APIs, and beautifully engineered interfaces.",
    ctaPrimary: "GO TO GITHUB →",
    ctaSecondary: "DOWNLOAD CV"
};

// ==========================================
// 5. FOOTER DATA
// ==========================================
export const footerData = {
    motto: "“Impossible is just a challenge waiting to be solved.”",
    socialLinks: [
        { href: "https://www.facebook.com/hoang.hai.duong.484951", icon: "fa-brands fa-facebook" },
        { href: "https://www.tiktok.com/@ocean09905", icon: "fa-brands fa-tiktok" },
        { href: "mailto:duonghaiduong090905@gmail.com", icon: "fa-solid fa-envelope" },
        { href: "https://www.instagram.com/haiduong09905", icon: "fa-brands fa-instagram" }
    ],
    githubUsername: "HoangOcean99",
    copyrightName: "Ocean"
};

// ==========================================
// 2. ABOUT SECTION DATA
// ==========================================
export const aboutData = {
    sectionTag: "01 — About.me()",
    headingLines: ["software", "Engineering"],
    paragraphs: [
        "Hello, my name is Hoang Duong Duong - fullstack Developer passionate about turning ideas into meaningful digital products. I have experience working in both Frontend and Backend development. My strengths are fast learning, time management, adaptability to new technologies, and a creative problem-solving mindset. I believe that a great product is not only about smooth functionality but also about delivering a positive user experience.",
        "Beyond coding, I’m deeply interested in AI, UI/UX design, technology infrastructure, and building real-world applications. My goal is to become a well-rounded developer who can contribute throughout the entire process—from ideation and design to deployment and system operation—ensuring every project meets both customer and business needs.",
    ],
    infoGrid: [
        { label: "Based", value: "Vietnam" },
        { label: "Status", value: "Open" },
        { label: "Focus", value: "Web · Game · AI" },
        { label: "GPA", value: "3.5/4.0" },
    ],
};

// ==========================================
// 3. EXPERIENCE SECTION DATA
// ==========================================
export const experienceData = [
    {
        period: "2023 — 2025",
        role: "Aspiring Developer",
        org: "Self-Learning",
        desc: "Started the journey of conquering Website and Game development. Built a solid foundation in system thinking and user experience design.",
        metric: "🎮 10+ Mini Games & Web Apps",
        tech: ["HTML/CSS", "JavaScript", "Unity", "C#"],
        bg: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80"
    },
    {
        period: "2025",
        role: "Frontend Developer Intern",
        org: "Landinvest",
        desc: "Responsible for developing real-time charting systems for gold and silver price prediction and advisory websites. Optimized complex data visualization.",
        metric: "📈 Real-time Data Visualization",
        tech: ["React", "D3.js", "Chart.js", "TailwindCSS"],
        bg: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
    },
    {
        period: "Late 2025 — Present",
        role: "Backend Developer Intern (.NET)",
        org: "HDSoft",
        desc: "Developing server-side systems for large-scale warehouse management solutions. Designed high-performance APIs and optimized database queries.",
        metric: "📦 Warehouse Management Systems",
        tech: [".NET", "SQL Server", "Web API", "Microservices"],
        bg: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
    },
    {
        period: "∞",
        role: "AI System & Security focus",
        org: "Future Evolution",
        desc: "Currently focused on deep research into AI systems and information security to build intelligent, secure, and sustainable applications.",
        metric: "🧠 AI System Engineer — Security",
        tech: ["AI Systems", "Cybersecurity", "LLMs", "Rust", "WebGPU"],
        bg: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
    },
];

// ==========================================
// 4. SKILLS SECTION DATA
// ==========================================
export const skillsData = [
    {
        id: "frontend",
        slot: "BLADE_01",
        title: "Frontend Client Subsystem",
        meta: "CLIENT_GPU // SHADER_CORE",
        color: "#c8ee00",
        colorLight: "#6f8400",
        bgLight: "bg-acid/10",
        borderTone: "border-acid/40",
        desc: "Hardware accelerated UI rendering engine. Optimized for sub-second FCP and 60 FPS WebGL asset streaming.",
        cores: [
            {
                name: "React / Next.js",
                frequency: "4.8 GHz",
                level: "95%",
                allocation: "32 GB/s",
                details: "Server Components, Suspense, Concurrent Mode Architecture",
                colorBrand: "#00d8ff",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)" /><circle cx="12" cy="12" r="2" fill="currentColor" /></svg>
            },
            {
                name: "TypeScript",
                frequency: "4.2 GHz",
                level: "90%",
                allocation: "16 GB/s",
                details: "Strict Type Metaprogramming, AST Transformers",
                colorBrand: "#3178c6",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 4h16v16H4V4z" /><path d="M9 10H7v6H5v-6H3V8h6v2zm7 6h-3v-1.5h1.5a1.5 1.5 0 0 0 0-3H12V8h3v1.5h-1.5a1.5 1.5 0 0 0 0 3H16V16z" /></svg>
            },
            {
                name: "Three.js / WebGL",
                frequency: "5.0 GHz",
                level: "88%",
                allocation: "64 GB/s",
                details: "Custom GLSL Shaders, Post-processing pipelines, VBO indexing",
                colorBrand: "#00e5ff",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><path d="M3.27 6.96L12 12l8.73-5.04M12 22V12" /></svg>
            },
            {
                name: "TailwindCSS",
                frequency: "3.8 GHz",
                level: "95%",
                allocation: "8 GB/s",
                details: "Atomic Design Tokens, Glassmorphism Engine",
                colorBrand: "#38b2ac",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 6c-2.5 0-4 1.5-4 4s1.5 4 4 4 2.5 1.5 2.5 3-1.5 3-4 3c-1 0-2-.5-2.5-1" /><path d="M18 6c-2.5 0-4 1.5-4 4s1.5 4 4 4 2.5 1.5 2.5 3-1.5 3-4 3c-1 0-2-.5-2.5-1" /></svg>
            },
            {
                name: "Bootstrap",
                frequency: "4.0 GHz",
                level: "90%",
                allocation: "16 GB/s",
                details: "Responsive grid, Utility classes, Pre-built components",
                colorBrand: "#7952b3",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M24 4.5v15c0 2.485-2.015 4.5-4.5 4.5h-15C2.015 24 0 21.985 0 19.5v-15C0 2.015 2.015 0 4.5 0h15C21.985 0 24 2.015 24 4.5z" fillOpacity="0.2" /><path d="M7.5 5.5h4.5c1.5 0 2.5 1 2.5 2.5 0 1-.5 1.5-1.5 2 1.5.5 2 1.5 2 2.5 0 1.5-1 2.5-2.5 2.5H7.5v-12zm2.5 2.5v2h1.5c.5 0 1-.5 1-1s-.5-1-1-1H10zm0 4.5v2.5h2c.5 0 1-.5 1-1s-.5-1-1-1H10z" /></svg>
            },
            {
                name: "GSAP / Framer",
                frequency: "4.5 GHz",
                level: "85%",
                allocation: "24 GB/s",
                details: "Sub-millisecond timeline choreography, FLIP physics",
                colorBrand: "#88ce02",
                imgLogo: "", // Sử dụng SVG icon fallback
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M5 3l14 9-14 9V3z" fill="currentColor" fillOpacity="0.2" /><path d="M12 3a9 9 0 0 1 0 18" strokeDasharray="2 2" /><path d="M16 7a5 5 0 0 1 0 10" strokeDasharray="2 2" /></svg>
            },
            {
                name: "WebGPU",
                frequency: "5.2 GHz",
                level: "80%",
                allocation: "128 GB/s",
                details: "WGSL compute shader calculations, Parallel physics simulation",
                colorBrand: "#a855f7",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><rect x="3" y="3" width="18" height="18" rx="2" /><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /></svg>
            },
        ]
    },
    {
        id: "backend",
        slot: "BLADE_02",
        title: "Backend Processing Cluster",
        meta: "SERVER_CORE // HIGH_CONCURRENCY",
        color: "#00e5ff",
        colorLight: "#008b99",
        bgLight: "bg-[#00e5ff]/10",
        borderTone: "border-[#00e5ff]/40",
        desc: "Distributed microservices backend processing unit. Engineered for 10,000+ Req/Sec with zero-allocation JSON parsing.",
        cores: [
            {
                name: "Node.js / Express",
                frequency: "4.6 GHz",
                level: "92%",
                allocation: "32 GB/s",
                details: "V8 Engine Optimization, Cluster Mode, Async Hooks",
                colorBrand: "#339933",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polygon points="12 2 22 7.5 22 16.5 12 22 2 16.5 2 7.5 12 2" /><circle cx="12" cy="12" r="3" fill="currentColor" /></svg>
            },
            {
                name: "Python / FastAPI",
                frequency: "4.4 GHz",
                level: "90%",
                allocation: "48 GB/s",
                details: "AsyncIO, Pydantic validation, AI Model Serving Pipelines",
                colorBrand: "#ffd43b",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 3c-4 0-5 1.5-5 4v2h6v2H6a3 3 0 0 0-3 3v2c0 2.5 1.5 4 5 4h2v-2h-2c-1 0-1.5-.5-1.5-2v-1h6a3 3 0 0 0 3-3V6c0-2.5-1.5-3-5-3z" /><path d="M12 21c4 0 5-1.5 5-4v-2h-6v-2h7a3 3 0 0 0 3-3V8c0-2.5-1.5-4-5-4h-2v2h2c1 0 1.5.5 1.5 2v1h-6a3 3 0 0 0-3 3v4c0 2.5 1.5 3 5 3z" /></svg>
            },
            {
                name: "C# / .NET",
                frequency: "4.7 GHz",
                level: "88%",
                allocation: "64 GB/s",
                details: "C#, ASP.NET Core, Entity Framework, LINQ",
                colorBrand: "#512bd4",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2L2 7v10l10 5 10-5V7l-10-5z" fillOpacity="0.2" /><path d="M12 22l10-5V7l-10 5-10-5v10l10 5z" /></svg>
            },
            {
                name: "GraphQL / REST",
                frequency: "4.0 GHz",
                level: "90%",
                allocation: "16 GB/s",
                details: "Schema Federation, Batching DataLoader, Rate limiting",
                colorBrand: "#e10098",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polygon points="12 3 21 18 3 18" /><circle cx="12" cy="3" r="2" fill="currentColor" /><circle cx="21" cy="18" r="2" fill="currentColor" /><circle cx="3" cy="18" r="2" fill="currentColor" /></svg>
            },
            {
                name: "Java / Spring Boot",
                frequency: "4.5 GHz",
                level: "90%",
                allocation: "128 GB/s",
                details: "Java, Spring MVC, Security, Hibernate",
                colorBrand: "#6db33f",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/springboot/springboot-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.48 17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
            },

        ]
    },
    {
        id: "database",
        slot: "BLADE_03",
        title: "Database Caching Storage",
        meta: "NVME_STORAGE // SUB_MS_CACHE",
        color: "#ff0055",
        colorLight: "#cc0044",
        bgLight: "bg-[#ff0055]/10",
        borderTone: "border-[#ff0055]/40",
        desc: "Memory-first persistence storage array. Delivering sub-millisecond query latency across relational and NoSQL clusters.",
        cores: [
            {
                name: "PostgreSQL",
                frequency: "4.2 GHz",
                level: "90%",
                allocation: "64 GB/s",
                details: "ACID transactions, Partial indexing, JSONB queries, Connection pooling",
                colorBrand: "#336791",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /></svg>
            },
            {
                name: "MongoDB",
                frequency: "4.5 GHz",
                level: "92%",
                allocation: "128 GB/s",
                details: "Sharding clusters, Aggregation pipelines, Atlas Search",
                colorBrand: "#47a248",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 2C8 6 6 11 6 16c0 3.31 2.69 6 6 6s6-2.69 6-6c0-5-2-10-6-14z" /><path d="M12 2v20" strokeDasharray="2 2" /></svg>
            },
            {
                name: "SQL Server",
                frequency: "4.0 GHz",
                level: "85%",
                allocation: "32 GB/s",
                details: "T-SQL, Stored procedures, Query optimization",
                colorBrand: "#CC292B",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /><ellipse cx="12" cy="6" rx="8" ry="3" /><line x1="12" y1="9" x2="12" y2="21" /></svg>
            },
            {
                name: "MySQL",
                frequency: "4.3 GHz",
                level: "88%",
                allocation: "64 GB/s",
                details: "Relational queries, Replication, InnoDB engine",
                colorBrand: "#00758F",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /></svg>
            },
            {
                name: "Firebase",
                frequency: "4.6 GHz",
                level: "90%",
                allocation: "128 GB/s",
                details: "Realtime Database, Firestore, Authentication, Hosting",
                colorBrand: "#FFCA28",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M3.89 15.55L5.42 2.76c.07-.58.74-.88 1.18-.49l2.76 2.45-3.47 10.83zM15.5 13l-1.12-1.12L12 9.5l-1.38 1.38L9.5 12l-2.05 2.05L12 21.5l5.55-5.55-2.05-2.05z" /></svg>
            },
        ]
    },
    {
        id: "devops",
        slot: "BLADE_04",
        title: "DevOps Infrastructure Mesh",
        meta: "CONTAINER_MESH // MULTI_REGION",
        color: "#a855f7",
        colorLight: "#7e22ce",
        bgLight: "bg-[#a855f7]/10",
        borderTone: "border-[#a855f7]/40",
        desc: "Multi-region cloud infrastructure mesh. Automated GitOps deployments ensuring 99.99% high availability.",
        cores: [
            {
                name: "Docker / Containers",
                frequency: "4.0 GHz",
                level: "90%",
                allocation: "32 GB/s",
                details: "Multi-stage builds, Distroless base, Vulnerability scan",
                colorBrand: "#2496ed",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M2 16h20v2H2z" /><rect x="4" y="10" width="4" height="4" /><rect x="10" y="10" width="4" height="4" /><rect x="16" y="10" width="4" height="4" /><rect x="10" y="4" width="4" height="4" /></svg>
            },
            {
                name: "Vercel",
                frequency: "4.5 GHz",
                level: "95%",
                allocation: "16 GB/s",
                details: "Zero-config deployments, Edge functions, Analytics",
                colorBrand: "#000000",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M24 22.525H0L12 1.475L24 22.525Z" /></svg>
            },
            {
                name: "AWS / GCP",
                frequency: "4.7 GHz",
                level: "88%",
                allocation: "256 GB/s",
                details: "IAM policies, VPC peering, Serverless Lambda",
                colorBrand: "#ff9900",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /><path d="M12 12l3 3m-3-3l-3 3m3-3v8" /></svg>
            },
            {
                name: "GitHub Actions",
                frequency: "4.3 GHz",
                level: "92%",
                allocation: "16 GB/s",
                details: "Matrix builds, Caching dependencies, Semantic release",
                colorBrand: "#2088ff",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.69c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10z" /></svg>
            },
            {
                name: "Render",
                frequency: "4.2 GHz",
                level: "90%",
                allocation: "16 GB/s",
                details: "Web services, Static sites, Background workers, Cron jobs",
                colorBrand: "#46E3B7",
                imgLogo: "", // Sử dụng SVG icon fallback
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
            },
            {
                name: "Linux / Bash",
                frequency: "4.5 GHz",
                level: "88%",
                allocation: "64 GB/s",
                details: "Kernel tuning, eBPF inspection, Cron scheduling",
                colorBrand: "#fcc624",
                imgLogo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full"><polyline points="4 7 10 12 4 17" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
            },
        ]
    }
];

// ==========================================
// 5. PROJECTS SECTION DATA
// ==========================================

export const allWebArchiveProjects = [
    {
        n: "01",
        name: "Medical Appointment Management System",
        meta: "SaaS · ReactJS · NodeJS · Postgres",
        desc: "A fullstack web-based platform designed to digitize and streamline the end-to-end workflow of a medical clinic. The system supports multiple roles including Patients, Doctors, Receptionists, Lab Technicians, Accountants, and Administrators.",
        tag: "SaaS",
        metrics: "⚡ Sub-second Latency // 50M+ Events",
        tech: ["React", "NodeJS", "Postgres", "Redis"],
        bg: "/project/MedicalAppointmentManagementSystem.jpg",
        projectLink: "https://medschedule.haiduong.name.vn",
        githubLink: "https://github.com/HoangOcean99/PatientManagementSystem",
    },
    {
        n: "02",
        name: "Gundam Shop",
        meta: "SaaS · NodeJS · MongoDB · ReactJS",
        desc: "A fullstack e-commerce web application that allows users to browse, search, and purchase Gundam models online. The system provides a seamless shopping experience with product management, user authentication, order processing, and admin management features.",
        tag: "SaaS",
        metrics: "🧠 Semantic Embeddings // Automated Triage",
        tech: ["ReactJS", "NodeJS", "MongoDB"],
        bg: "/project/GundamShop.jpg",
        projectLink: "https://ocan.ducanh.haiduong.name.vn",
        githubLink: "https://github.com/HoangOcean99/GundamShop",
    },
    {
        n: "03",
        name: "EmotiQ DOLAH",
        meta: "AI · FastAPI · ReactJS · MongoDB",
        desc: "An intelligent enterprise-level emotional analysis and management platform. DOLAH serves as a powerful employee emotional health monitoring system, leveraging advanced AI to detect and analyze emotional fluctuations through text input, voice analysis, and behavioral patterns.",
        tag: "AI",
        metrics: "🌟 4k+ Developers // Tree-shakable SVG",
        tech: ["ReactJS", "NodeJS", "MongoDB", "FastAPI"],
        bg: "/project/EmotiQ.jpg",
        projectLink: "https://emotiq-dolah-1.onrender.com",
        githubLink: "https://github.com/HoangOcean99/EmotiQ_DOLAH",
    },
    {
        n: "04",
        name: "Ocean ToDo App",
        meta: "ReactJS · NodeJS · MongoDB · Firebase",
        desc: "A modern web application that streamlines daily task management. It features a user-friendly interface for organizing tasks, real-time synchronization powered by Firebase, and a robust backend built with Node.js and MongoDB. The app allows users to create, edit, delete, and prioritize tasks with ease, ensuring productivity on any device.",
        tag: "SaaS",
        metrics: "⚡ Real-time Sync // 5ms Cold Start",
        tech: ["ReactJS", "NodeJS", "MongoDB", "Firebase"],
        bg: "/project/ToDoApp.jpg",
        projectLink: "https://ocean-todoapp.onrender.com",
        githubLink: "https://github.com/HoangOcean99/Ocean_toDoApp",
    },
    {
        n: "05",
        name: "Buddy Puppy",
        meta: "SaaS · ReactJS · NodeJS · MongoDB · FiseBase",
        desc: "An engaging and supportive learning platform designed for children with Autism Spectrum Disorder (ASD). Through interactive lessons, games, and personalized activities, BuddyPuppy helps children develop social, emotional, and cognitive skills in a fun and nurturing environment.",
        tag: "SaaS",
        metrics: "🤖 90 FPS WebXR // Rapier Physics",
        tech: ["ReactJS", "NodeJS", "MongoDB", "Firebase"],
        bg: "/project/BuddyPuppy.jpg",
        projectLink: "https://buddypuppy1.vercel.app/",
        githubLink: "https://github.com/pknguyen2704/BuddyPuppy-FE",
    },
    {
        n: "06",
        name: "Ecodian",
        meta: "Html · Css · Javascript · JQuery",
        desc: "This website introduces Ecodian, an educational game about environmental protection, and showcases its development process, including design, coding, and creative decisions behind the game.",
        tag: "Game",
        metrics: "🎙️ Responsive Design // Cross-Browser",
        tech: ["Html", "Css", "Javascript", "JQuery"],
        bg: "/project/Ecodian.jpg",
        projectLink: "https://ecodian-l8k3w35bw-hoanghaiduongs-projects-6b9ae2e4.vercel.app/?fbclid=IwY2xjawJHR2ZleHRuA2FlbQIxMAABHUtUVYEz65FRaKAZtw10ZanXSHA0865hjDVf2_uDTh3xNBmyAxCpS2zpIA_aem_Xn-_Ct185fruTXEqgfOndw",
        githubLink: "https://github.com/HoangOcean99/LandingPage_Ecodian",
    },
];

export const allGameArchiveProjects = [
    {
        n: "01",
        name: "Euphoria",
        meta: "C# · Unity · Prefab",
        desc: "Euphoria is a challenging platformer where players navigate tricky obstacles, hidden traps, and unexpected surprises, testing their reflexes and wits in a mischievous, fun-filled adventure.",
        tag: "Game",
        metrics: "🎨 Custom Shaders // 60 FPS Streaming",
        tech: ["Unity", "C#", "Prefab"],
        bg: "/project/Euphoria.jpg",
        projectLink: "https://hoangocean99.itch.io/totm",
        githubLink: "https://github.com/HoangOcean99/Euphoria_github",
    },
    {
        n: "02",
        name: "EcoDian",
        meta: "C# · Unity · Prefab",
        desc: "EcoDian is an educational adventure game that empowers players to protect the environment. Explore vibrant worlds, complete eco-missions, and learn sustainable habits while having fun.",
        tag: "Game",
        metrics: "💥 WebGPU Rendering // Spatial Audio",
        tech: ["Unity", "C#", "Prefab"],
        bg: "/project/EcodianGame.jpg",
        projectLink: "https://hoangocean99.itch.io/ecodian",
        githubLink: "https://github.com/HoangOcean99/Game-BVMT-SSG-team4",
    },
    {
        n: "03",
        name: "JSpark",
        meta: "Unity · C# · Netcode",
        desc: "JSpark is a cooperative multiplayer puzzle game where players work together to solve challenges and overcome obstacles. Inspired by Pico Park, it’s all about teamwork, fun, and creativity!",
        tag: "Game",
        metrics: "🤖 90 FPS WebXR // Rapier Physics",
        tech: ["Unity", "C#", "Netcode"],
        bg: "/project/JSPark.jpg",
        projectLink: "https://hoangocean99.itch.io/jspark",
        githubLink: "https://github.com/hvu2005/HexTech-Team-6",
    },
    {
        n: "04",
        name: "CODEFEST 2024",
        meta: "Unity · C# · SDK · Java",
        desc: "CODEFEST 2024 is an event organized by JS Club aiming to spread the passion for programming among students across Northern Vietnam. Participants will use Java to create bots and compete against each other. This is a great opportunity for teams to enjoy a fun and challenging playground while gaining valuable academic experience and new skills.",
        tag: "Game",
        metrics: "⚔️ Custom Engine // Procedural Dungeons",
        tech: ["Unity", "C#", "SDK", "Java"],
        bg: "/project/CodeFest.jpg",
        projectLink: "https://codefest2025.jsclub.dev/",
        githubLink: "https://github.com/fu-js/j-surviv/tree/main/JSurvivUnity",
    },
    {
        n: "05",
        name: "Over/Under Gambling",
        meta: "Java · Java Swing · Spring boot · Hibernate",
        desc: "Experience the thrill of Sic Bo with our realistic Tài Xỉu simulator app. Place bets, test your luck, and enjoy fast-paced gameplay in a safe, risk-free environment.",
        tag: "Game",
        metrics: "⚔️ Custom Engine // Procedural Dungeons",
        tech: ["Java", "Java Swing", "Spring boot", "Hibernate"],
        bg: "/project/TaiXiu.jpg",
        projectLink: "https://hoangocean99.itch.io/app-overunder-gambing",
        githubLink: "https://github.com/HoangOcean99/AppOverUnderGambling_github",
    },
    {
        n: "06",
        name: "Snake game app",
        meta: "Java · Javaswing",
        desc: "Classic Snake Game brings the timeless arcade fun to your device. Navigate the snake, collect food, and grow longer while avoiding collisions. Simple, addictive, and perfect for quick gaming sessions.",
        tag: "Game",
        metrics: "⚔️ Custom Engine // Procedural Dungeons",
        tech: ["Java", "Javaswing"],
        bg: "/project/Snake.jpg",
        projectLink: "https://hoangocean99.itch.io/snake-game-app",
        githubLink: "https://github.com/HoangOcean99/SnakeGame/blob/main/README.md",
    },
];