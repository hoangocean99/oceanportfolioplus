import React, { useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "../lib/scrollStore";

/* ============================================================
 *  PROCEDURAL TEXTURE GENERATORS
 * ============================================================ */
let leatherNoiseTex = null;
function makeLeatherNoiseTexture() {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, size, size);

    // Draw fine leather grain / noise
    for (let i = 0; i < 4000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 0.5 + Math.random() * 1.0;
        const val = 128 + (Math.random() - 0.5) * 24;
        ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    // Tiny subtle leather pores
    ctx.strokeStyle = "rgba(100, 100, 100, 0.12)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = 1.5 + Math.random() * 3.0;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);
    return tex;
}

function getLeatherNoiseTexture() {
    if (!leatherNoiseTex) {
        leatherNoiseTex = makeLeatherNoiseTexture();
    }
    return leatherNoiseTex;
}

function makeShadowTexture() {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, size, size);

    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.95)");
    grad.addColorStop(0.2, "rgba(0, 0, 0, 0.8)");
    grad.addColorStop(0.5, "rgba(0, 0, 0, 0.35)");
    grad.addColorStop(0.8, "rgba(0, 0, 0, 0.08)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.0)");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
}

function makeBarcaTexture() {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const x = c.getContext("2d");

    // Vertical stripes: deep Blaugrana blue and crimson red
    const stripeWidth = 256 / 5; // 5 stripes
    const blue = "#004d98";
    const red = "#a50044";
    const gold = "#edbb00"; // FC Barcelona Gold accent

    for (let i = 0; i < 5; i++) {
        x.fillStyle = (i % 2 === 0) ? blue : red;
        x.fillRect(stripeWidth * i, 0, stripeWidth, 256);
    }

    // Elegant gold thin border
    x.strokeStyle = gold;
    x.lineWidth = 10;
    x.strokeRect(5, 5, 246, 246);

    // FCB lettering in bold gold in the center
    x.fillStyle = gold;
    x.font = "bold 44px sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText("FCB", 128, 128);

    const tex = new THREE.CanvasTexture(c);
    return tex;
}

let worldCupTex = null;
function getWorldCupPanelTexture() {
    if (!worldCupTex) {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Pure leather white background
        ctx.fillStyle = "#fafafa";
        ctx.fillRect(0, 0, size, size);

        // Subtle leather noise directly printed on base canvas
        for (let i = 0; i < 5000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const val = 250 + (Math.random() - 0.5) * 12;
            ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
            ctx.fillRect(x, y, 1, 1);
        }

        // Draw World Cup style high-velocity swooshes (Cyan, Pink, and Gold)
        ctx.save();
        ctx.translate(size / 2, size / 2);

        for (let i = 0; i < 3; i++) {
            ctx.rotate((Math.PI * 2) / 3);

            // Dynamic colorful swoosh gradient
            const grad = ctx.createLinearGradient(0, 0, 95, 75);
            grad.addColorStop(0, "#00f0ff"); // Neon Blue/Cyan
            grad.addColorStop(0.5, "#ff007f"); // Neon Pink/Magenta
            grad.addColorStop(1, "#ffd700"); // Gold

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(15, 5);
            ctx.bezierCurveTo(45, -15, 85, 15, 105, 45);
            ctx.bezierCurveTo(75, 40, 35, 20, 15, 5);
            ctx.closePath();
            ctx.fill();

            // Navy accent line
            ctx.strokeStyle = "#121b3a"; // deep navy
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(17, 10);
            ctx.bezierCurveTo(48, -3, 88, 25, 108, 52);
            ctx.stroke();

            // Tiny gold specks
            ctx.fillStyle = "#ffd700";
            ctx.beginPath();
            ctx.arc(80, 12, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add center gold star decal
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        for (let j = 0; j < 5; j++) {
            const angle = (j * Math.PI * 2) / 5 - Math.PI / 2;
            ctx.lineTo(Math.cos(angle) * 8, Math.sin(angle) * 8);
            const innerAngle = angle + Math.PI / 5;
            ctx.lineTo(Math.cos(innerAngle) * 3, Math.sin(innerAngle) * 3);
        }
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        worldCupTex = new THREE.CanvasTexture(canvas);
        worldCupTex.anisotropy = 4;
    }
    return worldCupTex;
}

/* ============================================================
 *  MATERIAL FACTORY
 * ============================================================ */
const mat = {
    skin: () =>
        new THREE.MeshStandardMaterial({
            color: "#f0d3b1",
            roughness: 0.5,
            metalness: 0.03,
        }),
    skinShadow: () =>
        new THREE.MeshStandardMaterial({
            color: "#d9b187",
            roughness: 0.6,
        }),
    hair: () =>
        new THREE.MeshStandardMaterial({
            color: "#4a3324",
            roughness: 0.35,
            metalness: 0.55,
        }),
    hairHighlight: () =>
        new THREE.MeshStandardMaterial({
            color: "#a89880",
            roughness: 0.3,
            metalness: 0.7,
        }),
    suit: () =>
        new THREE.MeshStandardMaterial({
            color: "#1a1a1a",
            roughness: 0.85,
            metalness: 0.12,
        }),
    pants: () =>
        new THREE.MeshStandardMaterial({
            color: "#141414",
            roughness: 0.9,
            metalness: 0.05,
        }),
    shirt: () =>
        new THREE.MeshStandardMaterial({
            color: "#fafafa",
            roughness: 0.55,
        }),
    tie: () =>
        new THREE.MeshStandardMaterial({
            color: "#0a0a0a",
            roughness: 0.6,
            metalness: 0.25,
        }),
    eyeWhite: () =>
        new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.25,
        }),
    iris: () =>
        new THREE.MeshStandardMaterial({
            color: "#2b1b10",
            roughness: 0.2,
        }),
    pupil: () =>
        new THREE.MeshStandardMaterial({
            color: "#050505",
            roughness: 0.1,
        }),
    lips: () =>
        new THREE.MeshStandardMaterial({
            color: "#a06250",
            roughness: 0.55,
        }),
    metal: () =>
        new THREE.MeshStandardMaterial({
            color: "#a8a8a8",
            roughness: 0.35,
            metalness: 0.85,
        }),
    plastic: () =>
        new THREE.MeshStandardMaterial({
            color: "#222222",
            roughness: 0.45,
            metalness: 0.25,
        }),
    monitorBg: () =>
        new THREE.MeshStandardMaterial({
            color: "#0d0d0d",
            roughness: 0.4,
            metalness: 0.3,
        }),
    wood: () =>
        new THREE.MeshStandardMaterial({
            color: "#cfa97a",
            roughness: 0.7,
            metalness: 0.05,
        }),
    floor: () =>
        new THREE.MeshStandardMaterial({
            color: "#ede4d2",
            roughness: 0.95,
        }),
    wall: () =>
        new THREE.MeshStandardMaterial({
            color: "#f4eedf",
            roughness: 1.0,
        }),
    leather: () =>
        new THREE.MeshStandardMaterial({
            color: "#1f1814",
            roughness: 0.55,
        }),
    acid: () =>
        new THREE.MeshStandardMaterial({
            color: "#C8EE00",
            emissive: "#C8EE00",
            emissiveIntensity: 0.5,
        }),
    soccerWhite: () =>
        new THREE.MeshPhysicalMaterial({
            map: getWorldCupPanelTexture(),
            roughness: 0.22,
            metalness: 0.04,
            clearcoat: 0.65,
            clearcoatRoughness: 0.18,
            bumpMap: getLeatherNoiseTexture(),
            bumpScale: 0.0012,
        }),
    soccerBlack: () =>
        new THREE.MeshPhysicalMaterial({
            color: "#14151e", // deep blue-black space color
            roughness: 0.2,
            metalness: 0.28, // metallic touch
            clearcoat: 0.65,
            clearcoatRoughness: 0.18,
            bumpMap: getLeatherNoiseTexture(),
            bumpScale: 0.0012,
        }),
    frameWood: () =>
        new THREE.MeshStandardMaterial({
            color: "#4a3220",
            roughness: 0.55,
            metalness: 0.15,
        }),
};

const mk = (geom, material, pos = [0, 0, 0], rot = [0, 0, 0], scale = 1) => {
    const m = new THREE.Mesh(geom, material);
    m.position.set(...pos);
    m.rotation.set(...rot);
    if (typeof scale === "number") m.scale.setScalar(scale);
    else m.scale.set(...scale);
    return m;
};

/* ============================================================
 *  FACE TEXTURE — realistic painted features on a canvas
 * ============================================================ */
function drawBrow(ctx, x, y, side) {
    ctx.save();

    // Create a beautiful gradient for the eyebrow body
    const grad = ctx.createLinearGradient(x - side * 80, y, x + side * 80, y);
    if (side === -1) {
        grad.addColorStop(0, "rgba(50, 30, 18, 0.2)"); // Inner soft head
        grad.addColorStop(0.3, "rgba(35, 20, 10, 0.85)"); // Mid arch
        grad.addColorStop(1, "rgba(25, 12, 5, 0.95)"); // Sharp tail
    } else {
        grad.addColorStop(0, "rgba(25, 12, 5, 0.95)"); // Sharp tail
        grad.addColorStop(0.7, "rgba(35, 20, 10, 0.85)"); // Mid arch
        grad.addColorStop(1, "rgba(50, 30, 18, 0.2)"); // Inner soft head
    }

    // Draw the main elegant arch
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x - side * 95, y + 5);
    ctx.quadraticCurveTo(x, y - 22, x + side * 95, y + 2);
    ctx.quadraticCurveTo(x + side * 30, y - 5, x - side * 95, y + 5);
    ctx.closePath();
    ctx.fill();

    // Fine hair strokes for realistic texture
    ctx.strokeStyle = "rgba(15, 8, 3, 0.55)";
    ctx.lineWidth = 1.0;

    for (let i = 0; i < 30; i++) {
        const t = i / 29;
        const sx = x - 90 + t * 180;
        const angle = (t - 0.5) * 0.4 + side * 0.2;
        const hLength = 12 + Math.sin(t * Math.PI) * 6;

        ctx.beginPath();
        ctx.moveTo(sx, y + Math.sin(t * Math.PI) * 4);
        ctx.lineTo(sx + Math.sin(angle) * hLength, y - Math.cos(angle) * hLength + 4);
        ctx.stroke();
    }

    ctx.restore();
}

function drawEye(ctx, x, y, side, lookX = 0, lookY = 0) {
    ctx.save();

    // Sclera (slight cream tint) - stays fixed at (x, y)
    ctx.fillStyle = "#faf6ed";
    ctx.beginPath();
    ctx.ellipse(x, y, 78, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Upper shadow inside the eyeball (creates depth under the eyelid) - stays fixed at (x, y)
    const scleraShadow = ctx.createLinearGradient(x, y - 30, x, y + 30);
    scleraShadow.addColorStop(0, "rgba(100, 90, 80, 0.35)");
    scleraShadow.addColorStop(0.35, "rgba(100, 90, 80, 0.1)");
    scleraShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = scleraShadow;
    ctx.beginPath();
    ctx.ellipse(x, y, 78, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft pink inner corner (lacrimal caruncle) - stays fixed
    ctx.fillStyle = "rgba(224, 142, 125, 0.5)";
    ctx.beginPath();
    ctx.ellipse(x + side * 66, y, 12, 10, side * 0.1, 0, Math.PI * 2);
    ctx.fill();

    // ===== EYE MASK CLIPPING PATH =====
    // Set clipping mask strictly inside the eyeball ellipse so iris/pupil never spill out onto the skin!
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y, 78, 30, 0, 0, Math.PI * 2);
    ctx.clip();

    // DYNAMIC EYE LOOK COORDINATES - INCREASED SENSITIVITY (HORIZONTAL TO 22, VERTICAL TO 12)
    // Calculate the eyeball center (iris/pupil) shift with expanded dynamic range
    const eyeX = x + lookX * 22;
    const eyeY = y - lookY * 12;

    // Base Iris - moves dynamically! (Deeper, sharper dark espresso-black iris gradients)
    const irisGrad = ctx.createRadialGradient(eyeX, eyeY, 4, eyeX, eyeY, 29);
    irisGrad.addColorStop(0, "#5a3a1a");       // Center glow (warm medium dark brown)
    irisGrad.addColorStop(0.35, "#2c170a");    // Deep rich dark chocolate brown
    irisGrad.addColorStop(0.8, "#100602");     // Midnight espresso black-brown
    irisGrad.addColorStop(1, "#030100");       // Solid sharp limbal ring
    ctx.fillStyle = irisGrad;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 28, 0, Math.PI * 2);
    ctx.fill();

    // Iris details & reflections (striations) - moves dynamically!
    ctx.strokeStyle = "rgba(235, 175, 110, 0.28)"; // Crisper golden-amber threads
    ctx.lineWidth = 1.0;
    for (let i = 0; i < 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(eyeX + Math.cos(a) * 7, eyeY + Math.sin(a) * 7);
        ctx.lineTo(eyeX + Math.cos(a) * (18 + Math.random() * 8), eyeY + Math.sin(a) * (18 + Math.random() * 8));
        ctx.stroke();
    }

    // Inner glowing ring (pupillary zone) - moves dynamically!
    const pupilGlow = ctx.createRadialGradient(eyeX, eyeY, 8, eyeX, eyeY, 18);
    pupilGlow.addColorStop(0, "rgba(220, 140, 70, 0.35)");
    pupilGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = pupilGlow;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 18, 0, Math.PI * 2);
    ctx.fill();

    // Dark Limbal Ring Outline (smooth and crisp) - moves dynamically!
    ctx.strokeStyle = "rgba(10, 5, 2, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 28, 0, Math.PI * 2);
    ctx.stroke();

    // Pupil (rich dark obsidian black, slightly larger and extremely sharp!) - moves dynamically!
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 12.5, 0, Math.PI * 2);
    ctx.fill();

    // Primary sharp glossy highlight (studio light reflection, larger and brighter) - moves dynamically!
    const pGlint = ctx.createRadialGradient(eyeX - 10, eyeY - 10, 1, eyeX - 10, eyeY - 10, 75);
    pGlint.addColorStop(0, "#ffffff");
    pGlint.addColorStop(0.3, "#ffffff"); // expanded white core
    pGlint.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = pGlint;
    ctx.beginPath();
    ctx.arc(eyeX - 10, eyeY - 10, 7, 0, Math.PI * 2);
    ctx.fill();

    // Secondary soft reflection (ground / ambient fill light bounce) - moves dynamically!
    const sGlint = ctx.createRadialGradient(eyeX + 11, eyeY + 10, 0, eyeX + 11, eyeY + 10, 4);
    sGlint.addColorStop(0, "rgba(255, 230, 210, 0.85)");
    sGlint.addColorStop(0.5, "rgba(255, 220, 190, 0.45)");
    sGlint.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sGlint;
    ctx.beginPath();
    ctx.arc(eyeX + 11, eyeY + 10, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Restore context to remove clipping mask for eyelids/skin drawing

    // Upper eyelid crease (soft fold above eye) - stays fixed at (x, y)
    ctx.strokeStyle = "rgba(125, 75, 55, 0.45)";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(x - 68, y - 38);
    ctx.quadraticCurveTo(x, y - 48, x + 68, y - 38);
    ctx.stroke();

    // Upper eyelid shadow (darker background fill) - stays fixed
    ctx.fillStyle = "rgba(35, 18, 10, 0.95)";
    ctx.beginPath();
    ctx.moveTo(x - 80, y);
    ctx.bezierCurveTo(x - 60, y - 36, x + 60, y - 36, x + 80, y);
    ctx.bezierCurveTo(x + 60, y - 25, x - 60, y - 25, x - 80, y);
    ctx.closePath();
    ctx.fill();

    // Upper lash line (thick, sharp, stylized) - stays fixed
    ctx.strokeStyle = "#080504";
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(x - 80, y);
    ctx.bezierCurveTo(x - 55, y - 31, x + 55, y - 31, x + 80, y);
    ctx.stroke();

    // Lower lash line (softer brown) - stays fixed
    ctx.strokeStyle = "rgba(40, 22, 14, 0.85)";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(x - 76, y);
    ctx.bezierCurveTo(x - 55, y + 26, x + 55, y + 26, x + 76, y);
    ctx.stroke();

    // Stylized, elegant eyelashes (sweeping outward) - stays fixed
    ctx.strokeStyle = "#080504";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x + side * 74, y - 8);
    ctx.quadraticCurveTo(x + side * 90, y - 24, x + side * 94, y - 18);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - side * 74, y - 8);
    ctx.quadraticCurveTo(x - side * 82, y - 18, x - side * 84, y - 15);
    ctx.stroke();

    // Subtle lower lid shadow - stays fixed
    ctx.strokeStyle = "rgba(140, 85, 60, 0.3)";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(x - 65, y + 18);
    ctx.bezierCurveTo(x - 30, y + 24, x + 30, y + 24, x + 65, y + 18);
    ctx.stroke();

    ctx.restore();
}

function drawNose(ctx, cx, cy) {
    ctx.save();

    // Soft under-nose ambient occlusion shadow
    const underNoseGlow = ctx.createRadialGradient(cx, cy + 130, 10, cx, cy + 130, 48);
    underNoseGlow.addColorStop(0, "rgba(130, 75, 48, 0.35)");
    underNoseGlow.addColorStop(1, "rgba(130, 75, 48, 0)");
    ctx.fillStyle = underNoseGlow;
    ctx.beginPath();
    ctx.arc(cx, cy + 130, 48, 0, Math.PI * 2);
    ctx.fill();

    // Bridge shadows (softer, blended)
    const leftBridge = ctx.createLinearGradient(cx - 30, cy, cx - 10, cy);
    leftBridge.addColorStop(0, "rgba(150, 95, 65, 0.18)");
    leftBridge.addColorStop(1, "rgba(150, 95, 65, 0)");
    ctx.fillStyle = leftBridge;
    ctx.fillRect(cx - 30, cy - 30, 20, 140);

    const rightBridge = ctx.createLinearGradient(cx + 30, cy, cx + 10, cy);
    rightBridge.addColorStop(0, "rgba(150, 95, 65, 0.18)");
    rightBridge.addColorStop(1, "rgba(150, 95, 65, 0)");
    ctx.fillStyle = rightBridge;
    ctx.fillRect(cx + 10, cy - 30, 20, 140);

    // Nostrils (delicate, deep shadows)
    ctx.fillStyle = "rgba(45, 22, 12, 0.9)";
    ctx.beginPath();
    ctx.ellipse(cx - 16, cy + 138, 7, 11, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 16, cy + 138, 7, 11, 0.18, 0, Math.PI * 2);
    ctx.fill();

    // Nose wings shading
    const wingGlowL = ctx.createRadialGradient(cx - 24, cy + 130, 2, cx - 24, cy + 130, 18);
    wingGlowL.addColorStop(0, "rgba(145, 85, 55, 0.26)");
    wingGlowL.addColorStop(1, "rgba(145, 85, 55, 0)");
    ctx.fillStyle = wingGlowL;
    ctx.beginPath();
    ctx.arc(cx - 24, cy + 130, 18, 0, Math.PI * 2);
    ctx.fill();

    const wingGlowR = ctx.createRadialGradient(cx + 24, cy + 130, 2, cx + 24, cy + 130, 18);
    wingGlowR.addColorStop(0, "rgba(145, 85, 55, 0.26)");
    wingGlowR.addColorStop(1, "rgba(145, 85, 55, 0)");
    ctx.fillStyle = wingGlowR;
    ctx.beginPath();
    ctx.arc(cx + 24, cy + 130, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawMouth(ctx, cx, cy) {
    ctx.save();

    // Philtrum shadow (subtle dip above the upper lip)
    const philtrum = ctx.createLinearGradient(cx - 12, cy - 28, cx + 12, cy - 28);
    philtrum.addColorStop(0, "rgba(150, 90, 60, 0)");
    philtrum.addColorStop(0.3, "rgba(150, 90, 60, 0.15)");
    philtrum.addColorStop(0.5, "rgba(150, 90, 60, 0.2)");
    philtrum.addColorStop(0.7, "rgba(150, 90, 60, 0.15)");
    philtrum.addColorStop(1, "rgba(150, 90, 60, 0)");
    ctx.fillStyle = philtrum;
    ctx.fillRect(cx - 12, cy - 28, 24, 25);

    // --- UPPER LIP (Soft gradient) ---
    const upperLipGrad = ctx.createLinearGradient(cx, cy - 14, cx, cy);
    upperLipGrad.addColorStop(0, "rgba(150, 75, 60, 0.95)"); // Soft outline
    upperLipGrad.addColorStop(1, "rgba(110, 50, 38, 1)");     // Darker inside
    ctx.fillStyle = upperLipGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 72, cy);
    ctx.bezierCurveTo(cx - 44, cy - 14, cx - 18, cy - 8, cx, cy - 5);
    ctx.bezierCurveTo(cx + 18, cy - 8, cx + 44, cy - 14, cx + 72, cy);
    ctx.bezierCurveTo(cx + 44, cy + 3, cx - 44, cy + 3, cx - 72, cy);
    ctx.closePath();
    ctx.fill();

    // --- LOWER LIP (Full and plush) ---
    const lowerLipGrad = ctx.createLinearGradient(cx, cy, cx, cy + 24);
    lowerLipGrad.addColorStop(0, "rgba(182, 100, 85, 1)");    // Rich warm peach
    lowerLipGrad.addColorStop(0.6, "rgba(165, 84, 68, 0.95)"); // Soft bottom curve
    lowerLipGrad.addColorStop(1, "rgba(145, 65, 52, 0)");      // Blends into chin
    ctx.fillStyle = lowerLipGrad;
    ctx.beginPath();
    ctx.moveTo(cx - 72, cy);
    ctx.bezierCurveTo(cx - 55, cy + 24, cx + 55, cy + 24, cx + 72, cy);
    ctx.bezierCurveTo(cx + 44, cy + 3, cx - 44, cy + 3, cx - 72, cy);
    ctx.closePath();
    ctx.fill();

    // --- LIP HIGHLIGHT ---
    const lipHighlight = ctx.createRadialGradient(cx, cy + 13, 1, cx, cy + 13, 16);
    lipHighlight.addColorStop(0, "rgba(255, 235, 225, 0.75)");
    lipHighlight.addColorStop(0.4, "rgba(255, 210, 195, 0.35)");
    lipHighlight.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = lipHighlight;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 12, 28, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // --- CONFIDENT PLEASANT SMIRK ---
    ctx.strokeStyle = "rgba(65, 20, 10, 0.95)";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(cx - 72, cy);
    ctx.bezierCurveTo(cx - 30, cy + 4, cx + 30, cy + 4, cx + 72, cy);
    ctx.stroke();

    // Corner shadows
    const cornerShadowL = ctx.createRadialGradient(cx - 72, cy + 1, 1, cx - 72, cy + 1, 6);
    cornerShadowL.addColorStop(0, "rgba(65, 20, 10, 0.85)");
    cornerShadowL.addColorStop(1, "rgba(65, 20, 10, 0)");
    ctx.fillStyle = cornerShadowL;
    ctx.beginPath();
    ctx.arc(cx - 72, cy + 1, 6, 0, Math.PI * 2);
    ctx.fill();

    const cornerShadowR = ctx.createRadialGradient(cx + 72, cy + 1, 1, cx + 72, cy + 1, 6);
    cornerShadowR.addColorStop(0, "rgba(65, 20, 10, 0.85)");
    cornerShadowR.addColorStop(1, "rgba(65, 20, 10, 0)");
    ctx.fillStyle = cornerShadowR;
    ctx.beginPath();
    ctx.arc(cx + 72, cy + 1, 6, 0, Math.PI * 2);
    ctx.fill();

    // Mentolabial sulcus (soft chin shadow below lower lip)
    const chinShadow = ctx.createRadialGradient(cx, cy + 38, 4, cx, cy + 38, 28);
    chinShadow.addColorStop(0, "rgba(130, 75, 48, 0.28)");
    chinShadow.addColorStop(1, "rgba(130, 75, 48, 0)");
    ctx.fillStyle = chinShadow;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 38, 28, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawFaceOnCanvas(c, ctx, lookX = 0, lookY = 0) {
    const w = 1024,
        h = 1024;

    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.5;

    // Apply scale matrix to make the eyes, nose, mouth and eyebrows larger and more proportional to the expanded head size
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1.5, 1.5); // Elegant 1.5x scale (user customized!)
    ctx.translate(-cx, -cy);

    // 1. Soft overall face shading - changed to keep skin color fully white and fair
    const shade = ctx.createRadialGradient(cx, cy + 80, 100, cx, cy + 80, 480);
    shade.addColorStop(0, "rgba(255,255,255,0)");
    shade.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, w, h);

    // 2. High-end subtle blush on cheeks - toned down to maintain fair skin purity
    const leftBlush = ctx.createRadialGradient(cx - 240, cy + 100, 20, cx - 240, cy + 100, 140);
    leftBlush.addColorStop(0, "rgba(255, 200, 190, 0.04)");
    leftBlush.addColorStop(1, "rgba(255, 200, 190, 0)");
    ctx.fillStyle = leftBlush;
    ctx.beginPath();
    ctx.arc(cx - 240, cy + 100, 140, 0, Math.PI * 2);
    ctx.fill();

    const rightBlush = ctx.createRadialGradient(cx + 240, cy + 100, 20, cx + 240, cy + 100, 140);
    rightBlush.addColorStop(0, "rgba(255, 200, 190, 0.04)");
    rightBlush.addColorStop(1, "rgba(255, 200, 190, 0)");
    ctx.fillStyle = rightBlush;
    ctx.beginPath();
    ctx.arc(cx + 240, cy + 100, 140, 0, Math.PI * 2);
    ctx.fill();

    // 3. Forehead & Cheekbone highlights for skin depth/structure
    const foreheadGlow = ctx.createRadialGradient(cx, cy - 220, 10, cx, cy - 220, 160);
    foreheadGlow.addColorStop(0, "rgba(255, 245, 235, 0.22)");
    foreheadGlow.addColorStop(1, "rgba(255, 245, 235, 0)");
    ctx.fillStyle = foreheadGlow;
    ctx.beginPath();
    ctx.arc(cx, cy - 220, 160, 0, Math.PI * 2);
    ctx.fill();

    const cheekHighlightL = ctx.createRadialGradient(cx - 180, cy + 40, 5, cx - 180, cy + 40, 80);
    cheekHighlightL.addColorStop(0, "rgba(255, 248, 240, 0.18)");
    cheekHighlightL.addColorStop(1, "rgba(255, 248, 240, 0)");
    ctx.fillStyle = cheekHighlightL;
    ctx.beginPath();
    ctx.arc(cx - 180, cy + 40, 80, 0, Math.PI * 2);
    ctx.fill();

    const cheekHighlightR = ctx.createRadialGradient(cx + 180, cy + 40, 5, cx + 180, cy + 40, 80);
    cheekHighlightR.addColorStop(0, "rgba(255, 248, 240, 0.18)");
    cheekHighlightR.addColorStop(1, "rgba(255, 248, 240, 0)");
    ctx.fillStyle = cheekHighlightR;
    ctx.beginPath();
    ctx.arc(cx + 180, cy + 40, 80, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows (confident, handsome, neutral arch)
    const browY = cy - 110;
    drawBrow(ctx, cx - 160, browY, -1);
    drawBrow(ctx, cx + 160, browY, 1);

    // Eyes (with trackable pupils!)
    drawEye(ctx, cx - 160, cy - 25, -1, lookX, lookY);
    drawEye(ctx, cx + 160, cy - 25, 1, lookX, lookY);

    // Nose
    drawNose(ctx, cx, cy - 30);

    // Mouth
    drawMouth(ctx, cx, cy + 200);

    ctx.restore();

    // Soft alpha fade at edges so the texture blends into the skull silhouette (unscaled to avoid clipping)
    const fade = ctx.createRadialGradient(cx, cy, 330, cx, cy, 480);
    fade.addColorStop(0, "rgba(255,255,255,1)");
    fade.addColorStop(0.65, "rgba(255,255,255,0.85)");
    fade.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = fade;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
}

/* ============================================================
 *  HEAD — sculpted skull + face texture plane (formal serious)
 * ============================================================ */
function buildHead() {
    const head = new THREE.Group();
    const skin = mat.skin();
    const hair = mat.hair();
    const hairHi = mat.hairHighlight();

    // ===== Skull (egg-shaped) =====
    const skull = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), skin);
    skull.scale.set(1.0, 1.18, 0.95);
    head.add(skull);

    // Jaw — narrower, forward
    head.add(
        mk(
            new THREE.SphereGeometry(0.34, 32, 32),
            skin,
            [0, -0.3, 0.05],
            [0, 0, 0],
            [0.95, 0.7, 1.0],
        ),
    );

    // Cheek volumes
    // head.add(
    //     mk(
    //         new THREE.SphereGeometry(0.16, 24, 24),
    //         skin,
    //         [-0.32, -0.05, 0.34],
    //         [0, 0, 0],
    //         [1, 0.85, 0.7],
    //     ),
    // );
    // head.add(
    //     mk(
    //         new THREE.SphereGeometry(0.16, 24, 24),
    //         skin,
    //         [0.32, -0.05, 0.34],
    //         [0, 0, 0],
    //         [1, 0.85, 0.7],
    //     ),
    // );

    // ===== FACE TEXTURE PLANE =====
    const faceCanvas = document.createElement("canvas");
    faceCanvas.width = 1024;
    faceCanvas.height = 1024;
    const faceCtx = faceCanvas.getContext("2d");

    // Draw initial face looking straight ahead
    drawFaceOnCanvas(faceCanvas, faceCtx, 0, 0);

    const faceTex = new THREE.CanvasTexture(faceCanvas);
    faceTex.anisotropy = 8;

    const faceMat = new THREE.MeshStandardMaterial({
        map: faceTex,
        transparent: true,
        alphaTest: 0.02,
        roughness: 0.5,
        metalness: 0.03,
        side: THREE.DoubleSide,
    });
    // Larger plane (covers ear-to-ear) wraps onto the front of the skull sphere segment perfectly
    const facePlaneGeom = new THREE.PlaneGeometry(1.05, 1.2, 28, 28);
    const pos = facePlaneGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);

        // Map flat plane onto the surface of the scaled ellipsoid skull:
        // Sphere R = 0.5, scales: sx = 1.0, sy = 1.18, sz = 0.95
        // We use spherical mapping scaling factors to fit within the front hemisphere:
        const theta = (x * 0.65) / 0.5;
        const phi = (y * 0.65) / 0.59;

        // Projected horizontal and vertical coordinates
        const X = 0.5 * Math.sin(theta);
        const Y = 0.59 * Math.sin(phi);

        // Y coordinate offset is -0.05 because the mesh is positioned at y = -0.05
        const Y_abs = Y - 0.05;

        // Ellipsoid depth formula: X^2 + (Y_abs/sy)^2 + (Z/sz)^2 = R^2
        // => Z = sz * sqrt(R^2 - X^2 - (Y_abs/sy)^2)
        const d = 0.25 - X * X - (Y_abs / 1.18) * (Y_abs / 1.18);
        const Z = 0.95 * Math.sqrt(Math.max(0.001, d));

        pos.setX(i, X);
        pos.setY(i, Y);
        pos.setZ(i, Z + 0.0035); // Slight offset to float perfectly over the skull mesh
    }
    facePlaneGeom.computeVertexNormals();
    const facePlane = new THREE.Mesh(facePlaneGeom, faceMat);
    facePlane.position.set(0, -0.05, 0); // Position at mesh origin since vertex coordinates are absolute in Z
    head.add(facePlane);

    // ===== 3D nose tip — gives side profile a proper bump =====
    // head.add(
    //     mk(
    //         new THREE.SphereGeometry(0.045, 20, 20),
    //         skin,
    //         [0, -0.08, 0.55],
    //         [0, 0, 0],
    //         [1.0, 0.9, 1.2],
    //     ),
    // );
    // // Nose bridge tiny ridge
    // head.add(
    //     mk(
    //         new THREE.BoxGeometry(0.045, 0.14, 0.05),
    //         skin,
    //         [0, 0.02, 0.52],
    //         [0.1, 0, 0],
    //     ),
    // );

    // ===== HAIR — Clean, Professional Short Hairstyle (Tóc gáy và đỉnh đầu, không chạm trán/mặt) =====
    // Base cap - Extended down the back of the skull and pulled backward
    const hairCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 48, 48, 0, Math.PI * 2, 0, Math.PI / 1.32),
        hair,
    );
    hairCap.position.set(0, 0.11, -0.08); // Pulled further back (Z from -0.05 to -0.08)
    head.add(hairCap);

    // 1. Center top volume (Kiểu tóc Short Spiky Crop vuốt dựng cực kỳ nam tính và trẻ trung)
    // Khối đế phồng thấp làm nền cho tóc dựng
    const centerHair = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 32), hair);
    centerHair.position.set(0.0, 0.40, -0.08);
    centerHair.scale.set(1.1, 0.45, 1.1);
    head.add(centerHair);

    // 1b. Các lọn tóc vuốt dựng ở giữa đỉnh đầu hướng lên trên-ra trước (Masculine Spikes)
    const spikeCenter = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), hair);
    spikeCenter.position.set(0.0, 0.44, -0.02);
    spikeCenter.scale.set(0.75, 1.35, 0.75); // Kéo giãn đứng tạo lọn tóc vuốt keo dựng đứng
    spikeCenter.rotation.set(0.2, 0, 0); // Nghiêng nhẹ về phía trước
    head.add(spikeCenter);

    const spikeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), hair);
    spikeLeft.position.set(-0.08, 0.43, -0.04);
    spikeLeft.scale.set(0.7, 1.25, 0.7);
    spikeLeft.rotation.set(0.18, 0, 0.15); // Nghiêng chéo sang trái
    head.add(spikeLeft);

    const spikeRight = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), hair);
    spikeRight.position.set(0.08, 0.43, -0.04);
    spikeRight.scale.set(0.7, 1.25, 0.7);
    spikeRight.rotation.set(0.18, 0, -0.15); // Nghiêng chéo sang phải
    head.add(spikeRight);

    // lọn tóc vuốt dựng trước mái (trên trán) hướng nhô lên-ra trước cực ngầu
    const spikeFront = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), hair);
    spikeFront.position.set(0.0, 0.42, 0.08); // Nhô ra phía trước trên trán một chút
    spikeFront.scale.set(0.7, 1.25, 0.8);
    spikeFront.rotation.set(0.35, 0, 0); // Nghiêng nhiều về phía trước đầy cá tính
    head.add(spikeFront);

    // 2. Left outer wave (lớp tóc bám sát thái dương trái - undercut sát gọn gàng)
    const leftWave = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), hair);
    leftWave.position.set(-0.25, 0.28, -0.05);
    leftWave.scale.set(0.65, 0.38, 0.75); // Rất phẳng ôm sát đầu
    leftWave.rotation.set(0.15, -0.15, -0.1);
    head.add(leftWave);

    // 3. Right outer wave (lớp tóc bám sát thái dương phải - undercut sát gọn gàng)
    const rightWave = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 24), hair);
    rightWave.position.set(0.25, 0.28, -0.05);
    rightWave.scale.set(0.65, 0.38, 0.75); // Rất phẳng ôm sát đầu
    rightWave.rotation.set(0.15, 0.15, 0.1);
    head.add(rightWave);

    // 4. Back volume fill (mái phồng phía sau gáy ôm sát gáy gọn gàng)
    const backHair = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), hair);
    backHair.position.set(0.0, 0.26, -0.22);
    backHair.scale.set(1.0, 0.8, 0.75); // Ôm gọn hơn, sát đầu
    head.add(backHair);

    // 5. Nape Hair (Tóc bao phủ gáy và sau đầu, gọn gàng và nam tính)
    const napeHair = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 24), hair); // Thu nhỏ bán kính
    napeHair.position.set(0.0, -0.02, -0.25); // Kéo lên trên và sát vào đầu hơn
    napeHair.scale.set(1.0, 0.85, 0.8); // Giảm độ phồng để khớp với hộp sọ
    head.add(napeHair);

    // 6. Premium 3D highlights (vệt sáng bóng bẩy vuốt dựng theo lọn tóc đỉnh)
    const highlightPositions = [
        { pos: [0.0, 0.52, -0.01], rot: [0.2, 0, 0], scale: [0.08, 0.04, 0.16] }, // Bắt sáng trên lọn tóc dựng giữa
    ];
    highlightPositions.forEach((h) => {
        const hMesh = new THREE.Mesh(new THREE.SphereGeometry(1.0, 16, 16), hairHi);
        hMesh.position.set(...h.pos);
        hMesh.rotation.set(...h.rot);
        hMesh.scale.set(...h.scale);
        head.add(hMesh);
    });

    // Sideburns (Tóc mai - lùi sát về phía sau tai, hoàn toàn không lấn ra má hay mặt)
    head.add(
        mk(
            new THREE.BoxGeometry(0.04, 0.16, 0.08),
            hair,
            [-0.42, -0.02, 0.06], // Pulled back to align perfectly with ears at Z=0.06 (from 0.18)
        ),
    );
    head.add(
        mk(
            new THREE.BoxGeometry(0.04, 0.16, 0.08),
            hair,
            [0.42, -0.02, 0.06], // Pulled back to align perfectly with ears at Z=0.06 (from 0.18)
        ),
    );

    // ===== EARS =====
    head.add(
        mk(new THREE.SphereGeometry(0.085, 16, 16), skin, [-0.5, -0.04, 0.06]),
    );
    head.add(
        mk(new THREE.SphereGeometry(0.085, 16, 16), skin, [0.5, -0.04, 0.06]),
    );
    // Inner ear darker
    head.add(
        mk(
            new THREE.SphereGeometry(0.04, 12, 12),
            new THREE.MeshStandardMaterial({ color: "#c19272", roughness: 0.6 }),
            [-0.5, -0.04, 0.11],
        ),
    );
    head.add(
        mk(
            new THREE.SphereGeometry(0.04, 12, 12),
            new THREE.MeshStandardMaterial({ color: "#c19272", roughness: 0.6 }),
            [0.5, -0.04, 0.11],
        ),
    );

    // ===== Neck ===== (removed from head to be placed in buildCharacter for better scale & independence)

    // Expose interactive face updating logic (eyeball looking at mouse)
    head.userData.updateFace = (lookX, lookY) => {
        drawFaceOnCanvas(faceCanvas, faceCtx, lookX, lookY);
        faceTex.needsUpdate = true;
    };

    return head;
}


/* ============================================================
 *  HEAD
 * ============================================================ */

/* ============================================================
 *  CHARACTER — full body with ROUNDED limbs
 * ============================================================ */
function buildCharacter() {
    const character = new THREE.Group();
    const suit = mat.suit();
    const pants = mat.pants();
    const shirt = mat.shirt();
    const tie = mat.tie();
    const skin = mat.skin();
    const leather = mat.leather();

    // ===== Torso =====
    const torso = new THREE.Group();
    // Main torso (height 0.9, shifted down to -0.1 to extend body into hips and eliminate gap)
    torso.add(
        mk(
            new THREE.CylinderGeometry(0.415, 0.45, 0.9, 24),
            suit,
            [0, -0.1, 0],
            [0, 0, 0],
            [1.0, 1.0, 0.52],
        ),
    );
    // Shoulder Dome
    torso.add(
        mk(
            new THREE.SphereGeometry(0.415, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2),
            suit,
            [0, 0.35, 0],
            [0, 0, 0],
            [1.0, 0.45, 0.52],
        ),
    );
    // Shoulders removed from torso and moved to arm joints for better articulation
    // Shirt placket (nẹp khuy áo)
    torso.add(
        mk(
            new THREE.BoxGeometry(0.08, 0.9, 0.01),
            suit,
            [0, -0.1, 0.22],
        ),
    );

    // Buttons (khuy áo kim loại bạc)
    const buttonMat = new THREE.MeshStandardMaterial({ color: "#888888", roughness: 0.2, metalness: 0.8 });
    [-0.5, -0.35, -0.2, -0.05, 0.1, 0.25].forEach((y) => {
        torso.add(
            mk(
                new THREE.CylinderGeometry(0.012, 0.012, 0.006, 12),
                buttonMat,
                [0, y, 0.225],
                [Math.PI / 2, 0, 0],
            ),
        );
    });

    // Shirt pocket (túi ngực áo sơ mi)
    torso.add(
        mk(
            new THREE.BoxGeometry(0.12, 0.14, 0.01),
            suit,
            [-0.18, 0.08, 0.21],
        ),
    );

    // Tie (Lowered to follow the chest/neck slope)
    torso.add(
        mk(new THREE.BoxGeometry(0.06, 0.12, 0.02), tie, [0, 0.19, 0.23]),
    );
    torso.add(
        mk(new THREE.BoxGeometry(0.07, 0.52, 0.02), tie, [0, -0.14, 0.23]),
    );
    torso.add(
        mk(
            new THREE.BoxGeometry(0.06, 0.06, 0.02),
            tie,
            [0, -0.42, 0.23],
            [0, 0, Math.PI / 4],
        ),
    );
    // Collars (Lowered to match shirt neckline)
    torso.add(
        mk(
            new THREE.BoxGeometry(0.11, 0.13, 0.03),
            suit,
            [-0.085, 0.34, 0.22],
            [0, 0, 0.35],
        ),
    );
    torso.add(
        mk(
            new THREE.BoxGeometry(0.11, 0.13, 0.03),
            suit,
            [0.085, 0.34, 0.22],
            [0, 0, -0.35],
        ),
    );
    torso.position.set(0, 1.11, 0);
    character.add(torso);

    // ===== Neck =====
    character.add(
        mk(
            new THREE.CylinderGeometry(0.058, 0.075, 0.54, 24),
            skin,
            [0, 1.64, 0.08],
        ),
    );
    const head = buildHead();
    head.scale.setScalar(0.415);
    head.position.set(0, 1.89, 0.05);
    character.add(head);
    character.userData.head = head;

    // ===== ARMS (nested joint hierarchy for realistic bent elbows) =====
    const armR = 0.082;

    // Left arm group
    const leftArm = new THREE.Group();
    leftArm.position.set(-0.315, 1.46, 0.0);

    // Left Upper Arm (Bicep)
    const leftUpperArm = new THREE.Group();
    leftUpperArm.rotation.set(-0.90, -0.15, 0);

    // Shoulder joint sphere
    leftUpperArm.add(
        mk(new THREE.SphereGeometry(armR * 1.15, 16, 16), suit, [0, 0, 0]),
    );

    // Bicep cylinder
    leftUpperArm.add(
        mk(
            new THREE.CylinderGeometry(armR, armR * 0.95, 0.36, 20),
            suit,
            [0, -0.18, 0],
        ),
    );
    // Elbow joint sphere
    leftUpperArm.add(
        mk(new THREE.SphereGeometry(armR * 1.05, 16, 16), suit, [0, -0.36, 0]),
    );

    // Left Forearm
    const leftForearm = new THREE.Group();
    leftForearm.position.set(0, -0.36, 0);
    leftForearm.rotation.set(-0.67, 0.15, 0);

    // Forearm cylinder (shorter height 0.28, centered at -0.14)
    leftForearm.add(
        mk(
            new THREE.CylinderGeometry(armR * 0.95, armR * 0.85, 0.28, 20),
            suit,
            [0, -0.14, 0],
        ),
    );
    // Cuff (at wrist Y = -0.28)
    leftForearm.add(
        mk(
            new THREE.CylinderGeometry(armR * 0.92, armR * 0.85, 0.04, 20),
            suit,
            [0, -0.28, 0],
        ),
    );

    // Left Hand (nested at wrist!)
    const leftHand = new THREE.Group();
    leftHand.position.set(0.02, -0.38, 0.04);
    leftHand.rotation.set(1.8, 0, 0);

    // Palm
    leftHand.add(
        mk(
            new THREE.BoxGeometry(0.11, 0.035, 0.11),
            skin,
            [0, -0.05, 0],
        ),
    );
    // Thumb
    leftHand.add(
        mk(
            new THREE.CylinderGeometry(0.014, 0.012, 0.07, 8),
            skin,
            [0.05, -0.05, 0.02],
            [0.2, 0.4, 0.5],
        ),
    );
    // Fingers
    const leftFingerPositions = [
        { dx: -0.04, dz: 0.06, len: 0.08, rotX: -0.02 },
        { dx: -0.012, dz: 0.07, len: 0.09, rotX: -0.03 },
        { dx: 0.015, dz: 0.06, len: 0.08, rotX: -0.02 },
        { dx: 0.042, dz: 0.05, len: 0.065, rotX: -0.01 },
    ];
    leftFingerPositions.forEach((f) => {
        leftHand.add(
            mk(
                new THREE.CylinderGeometry(0.012, 0.01, f.len, 8),
                skin,
                [f.dx, -0.05 - f.len / 2, f.dz],
                [Math.PI / 2 + f.rotX, 0, 0],
            ),
        );
    });

    leftForearm.add(leftHand);
    leftUpperArm.add(leftForearm);
    leftArm.add(leftUpperArm);
    character.add(leftArm);


    // Right Arm
    const rightArm = new THREE.Group();
    rightArm.position.set(0.315, 1.46, 0.0);

    // Right Upper Arm
    const rightUpperArm = new THREE.Group();
    rightUpperArm.rotation.set(-0.90, 0.15, 0);

    // Shoulder joint sphere
    rightUpperArm.add(
        mk(new THREE.SphereGeometry(armR * 1.15, 16, 16), suit, [0, 0, 0]),
    );

    // Bicep cylinder
    rightUpperArm.add(
        mk(
            new THREE.CylinderGeometry(armR, armR * 0.95, 0.36, 20),
            suit,
            [0, -0.18, 0],
        ),
    );
    // Elbow joint sphere
    rightUpperArm.add(
        mk(new THREE.SphereGeometry(armR * 1.05, 16, 16), suit, [0, -0.36, 0]),
    );

    // Right Forearm
    const rightForearm = new THREE.Group();
    rightForearm.position.set(0, -0.36, 0);
    rightForearm.rotation.set(-0.67, -0.15, 0);

    // Forearm cylinder (shorter height 0.28, centered at -0.14)
    rightForearm.add(
        mk(
            new THREE.CylinderGeometry(armR * 0.95, armR * 0.85, 0.28, 20),
            suit,
            [0, -0.14, 0],
        ),
    );
    // Cuff (at wrist Y = -0.28)
    rightForearm.add(
        mk(
            new THREE.CylinderGeometry(armR * 0.92, armR * 0.85, 0.06, 20),
            suit,
            [0, -0.28, 0],
        ),
    );

    // Right Hand (nested at wrist!)
    const rightHand = new THREE.Group();
    rightHand.position.set(0.02, -0.28, 0.04); // Positioned flat at wrist Y = -0.28
    // Mathematically exact values to lay the palm perfectly flat palm-down resting on the desk surface
    rightHand.rotation.set(1.8, 0, 0);
    // Palm
    rightHand.add(
        mk(
            new THREE.BoxGeometry(0.11, 0.035, 0.11),
            skin,
            [0, -0.05, 0],
        ),
    );
    // Thumb
    rightHand.add(
        mk(
            new THREE.CylinderGeometry(0.014, 0.012, 0.07, 8),
            skin,
            [-0.05, -0.05, 0.02],
            [0.2, -0.4, -0.5],
        ),
    );
    // Fingers (resting flatly on the desk surface)
    const rightFingerPositions = [
        { dx: 0.04, dz: 0.06, len: 0.08, rotX: -0.02 },
        { dx: 0.012, dz: 0.07, len: 0.09, rotX: -0.03 },
        { dx: -0.015, dz: 0.06, len: 0.08, rotX: -0.02 },
        { dx: -0.042, dz: 0.05, len: 0.065, rotX: -0.01 },
    ];
    rightFingerPositions.forEach((f) => {
        rightHand.add(
            mk(
                new THREE.CylinderGeometry(0.012, 0.01, f.len, 8),
                skin,
                [f.dx, -0.05 - f.len / 2, f.dz],
                [Math.PI / 2 + f.rotX, 0, 0],
            ),
        );
    });

    rightForearm.add(rightHand);
    rightUpperArm.add(rightForearm);
    rightArm.add(rightUpperArm);
    character.add(rightArm);

    character.userData.leftForearm = leftForearm;
    character.userData.rightForearm = rightForearm;
    character.userData.leftHand = leftHand; // Added for wrist-only typing animations
    character.userData.rightHand = rightHand;

    // ===== Hips =====
    const hips = mk(
        new THREE.CylinderGeometry(0.42, 0.45, 0.3, 20),
        pants,
        [0, 0.5, 0],
        [0, 0, 0],
        [1, 1, 0.6],
    );
    character.add(hips);

    // ===== LEGS (rounded cylinders, sitting pose) =====
    const legR = 0.14;
    // Thighs (horizontal because seated, shortened from 0.85 to 0.70 for better proportions)
    const leftThigh = new THREE.Mesh(
        new THREE.CylinderGeometry(legR, legR * 0.9, 0.70, 20),
        pants,
    );
    leftThigh.position.set(-0.22, 0.4, 0.33);
    leftThigh.rotation.set(Math.PI / 2, 0, 0);
    character.add(leftThigh);

    const rightThigh = new THREE.Mesh(
        new THREE.CylinderGeometry(legR, legR * 0.9, 0.70, 20),
        pants,
    );
    rightThigh.position.set(0.22, 0.4, 0.33);
    rightThigh.rotation.set(Math.PI / 2, 0, 0);
    character.add(rightThigh);

    // Knee joints (shifted back to Z = 0.68 to match shortened thighs)
    character.add(
        mk(new THREE.SphereGeometry(legR + 0.01, 16, 16), pants, [
            -0.22,
            0.4,
            0.68,
        ]),
    );
    character.add(
        mk(new THREE.SphereGeometry(legR + 0.01, 16, 16), pants, [
            0.22,
            0.4,
            0.68,
        ]),
    );

    // Shins (vertical going down, lengthened to 0.88 and lowered to touch the floor)
    character.add(
        mk(
            new THREE.CylinderGeometry(legR * 0.85, legR * 0.78, 0.88, 20),
            pants,
            [-0.22, -0.04, 0.68],
        ),
    );
    character.add(
        mk(
            new THREE.CylinderGeometry(legR * 0.85, legR * 0.78, 0.88, 20),
            pants,
            [0.22, -0.04, 0.68],
        ),
    );

    // Shoes — rounded leather (lowered to Y = -0.485 to sit perfectly flat on the floor Y = -0.5)
    character.add(
        mk(
            new THREE.SphereGeometry(0.16, 24, 24),
            leather,
            [-0.22, -0.485, 0.78],
            [0, 0, 0],
            [1, 0.5, 1.5],
        ),
    );
    character.add(
        mk(
            new THREE.SphereGeometry(0.16, 24, 24),
            leather,
            [0.22, -0.485, 0.78],
            [0, 0, 0],
            [1, 0.5, 1.5],
        ),
    );

    return character;
}

/* ============================================================
 *  PROGRAMMER EASTER EGGS: RUBBER DUCK & CLEAN CODE BOOK
 * ============================================================ */
function buildRubberDuck() {
    const grp = new THREE.Group();

    // Materials
    const yellow = new THREE.MeshStandardMaterial({ color: "#facc15", roughness: 0.2, metalness: 0.05 });
    const orange = new THREE.MeshStandardMaterial({ color: "#f97316", roughness: 0.3 });
    const black = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.1, metalness: 0.8 });

    // Body (Sphere)
    grp.add(mk(new THREE.SphereGeometry(0.045, 16, 16), yellow, [0, 0.035, 0]));

    // Head (Sphere)
    grp.add(mk(new THREE.SphereGeometry(0.03, 16, 16), yellow, [0, 0.07, 0.012]));

    // Beak (Cone pointing forward)
    grp.add(mk(new THREE.ConeGeometry(0.009, 0.018, 8), orange, [0, 0.068, 0.038], [Math.PI / 2, 0, 0]));

    // Cool Programmer Sunglasses
    // Left lens
    grp.add(mk(new THREE.BoxGeometry(0.012, 0.008, 0.004), black, [-0.01, 0.075, 0.035]));
    // Right lens
    grp.add(mk(new THREE.BoxGeometry(0.012, 0.008, 0.004), black, [0.01, 0.075, 0.035]));
    // Glasses Bridge
    grp.add(mk(new THREE.BoxGeometry(0.012, 0.002, 0.002), black, [0, 0.076, 0.036]));

    // Tiny Wings
    grp.add(mk(new THREE.BoxGeometry(0.01, 0.02, 0.03), yellow, [-0.042, 0.038, 0], [0, 0, 0.2]));
    grp.add(mk(new THREE.BoxGeometry(0.01, 0.02, 0.03), yellow, [0.042, 0.038, 0], [0, 0, -0.2]));

    return grp;
}

function makeBookCoverTexture() {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Deep dark code-theme cover
    ctx.fillStyle = "#0f172a"; // slate-900
    ctx.fillRect(0, 0, size, size);

    // Elegant border
    ctx.strokeStyle = "#c29d50"; // gold
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, size - 12, size - 12);

    // Title "CLEAN CODE"
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 14px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText("CLEAN", size / 2, 42);
    ctx.fillText("CODE", size / 2, 59);

    // Gold braces "< / >"
    ctx.fillStyle = "#c29d50";
    ctx.font = "bold 15px JetBrains Mono, monospace";
    ctx.fillText("< / >", size / 2, 85);

    // Subtext
    ctx.fillStyle = "#94a3b8";
    ctx.font = "8px JetBrains Mono, monospace";
    ctx.fillText("JS PATTERNS", size / 2, 106);

    return new THREE.CanvasTexture(canvas);
}

function buildCodeBook() {
    const grp = new THREE.Group();
    const coverMat = new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.4 });
    const pagesMat = new THREE.MeshStandardMaterial({ color: "#fafafa", roughness: 0.9 });

    // Base book body (blue-black outer cover spine)
    grp.add(mk(new THREE.BoxGeometry(0.18, 0.028, 0.24), coverMat, [0, 0.014, 0]));

    // Inner pages (white blocks sticking out on three sides)
    grp.add(mk(new THREE.BoxGeometry(0.168, 0.022, 0.23), pagesMat, [0.004, 0.014, 0]));

    // Cover graphic plate on top cover
    const coverTex = makeBookCoverTexture();
    const coverGraphicMat = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.2 });
    grp.add(mk(new THREE.PlaneGeometry(0.178, 0.238), coverGraphicMat, [0, 0.0285, 0], [-Math.PI / 2, 0, 0]));

    return grp;
}

/* ============================================================
 *  LAPTOP (Angled secondary screen)
 * ============================================================ */
function drawLaptopScreenOnCanvas(c, ctx, maxLines = 10, scrollY = 0) {
    const w = c.width,
        h = c.height;

    // 1. VS Code Deep Dark Theme Background (Catppuccin Mocha)
    ctx.fillStyle = "#1e1e2e";
    ctx.fillRect(0, 0, w, h);

    // 2. VS Code Header bar (Title Bar)
    ctx.fillStyle = "#181825";
    ctx.fillRect(0, 0, w, 28);

    // Red, Yellow, Green Mac Window Controls
    ctx.fillStyle = "#ff5f56"; // Red
    ctx.beginPath(); ctx.arc(15, 14, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffbd2e"; // Yellow
    ctx.beginPath(); ctx.arc(28, 14, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#27c93f"; // Green
    ctx.beginPath(); ctx.arc(41, 14, 5, 0, Math.PI * 2); ctx.fill();

    // File/Title text
    ctx.fillStyle = "#a6adc8";
    ctx.font = "bold 11px Courier New, monospace";
    ctx.textAlign = "center";
    ctx.fillText("antigravity_core.py — VS Code", w / 2, 18);

    // 3. Tab Bar
    ctx.fillStyle = "#11111b";
    ctx.fillRect(0, 28, w, 24);

    // Active Tab
    ctx.fillStyle = "#1e1e2e";
    ctx.fillRect(55, 28, 140, 24);

    // Active Tab Blue Highlight Indicator Line at top
    ctx.fillStyle = "#89b4fa";
    ctx.fillRect(55, 28, 140, 2);

    // Tab Text
    ctx.fillStyle = "#cdd6f4";
    ctx.font = "10px Courier New, monospace";
    ctx.textAlign = "left";
    // Tiny Python icon color (orange)
    ctx.fillStyle = "#ff9e3b";
    ctx.fillText("py", 65, 44);
    ctx.fillStyle = "#cdd6f4";
    ctx.fillText("antigravity_core.py", 85, 44);

    // Tab Close Cross 'x'
    ctx.fillStyle = "#585b70";
    ctx.fillText("×", 182, 44);

    // 4. Activity Bar (Left Sidebar Icons)
    ctx.fillStyle = "#11111b";
    ctx.fillRect(0, 28, 48, h - 28);

    // Sidebar icons
    const iconY = [45, 75, 105, 135];
    iconY.forEach((iy, idx) => {
        ctx.fillStyle = idx === 0 ? "#89b4fa" : "#45475a"; // Active icon is bright blue
        ctx.fillRect(16, iy, 16, 16);
        if (idx === 0) {
            ctx.fillRect(0, iy - 2, 3, 20);
        }
    });

    // Code lines array (expanded to 24 lines for rich scrolling experience!)
    // Code lines array (expanded to 32 lines for rich scrolling experience!)
    const codeLines = [
        { type: "comment", text: "# Antigravity Core AI Solver" },
        { type: "keyword", text: "import", extra: " antigravity as ag" },
        { type: "keyword", text: "import", extra: " time, sys, math, os" },
        { type: "blank" },
        { type: "class", text: "class", extra: " AntigravityAgent(ag.Agent):" },
        { type: "def", indent: 4, text: "def", extra: " __init__(self):" },
        { type: "expr", indent: 8, text: "self.model = ", val: '"Gemini-2.0"', valType: "string" },
        { type: "expr", indent: 8, text: "self.power = ", val: '"Over 9000!"', valType: "string" },
        { type: "expr", indent: 8, text: "self.speed = ", val: '"Ultra Fast"', valType: "string" },
        { type: "blank" },
        { type: "def", indent: 4, text: "def", extra: " analyze_workspace(self, repo):" },
        { type: "comment", indent: 8, text: "# Deep scanning of all project files" },
        { type: "expr", indent: 8, text: "tree = repo.get_file_tree()" },
        { type: "keyword", indent: 8, text: "return", extra: " tree.optimize()" },
        { type: "blank" },
        { type: "def", indent: 4, text: "def", extra: " build_ast(self, files):" },
        { type: "comment", indent: 8, text: "# Constructing Abstract Syntax Tree" },
        { type: "expr", indent: 8, text: "ast = ag.parser.parse(files)" },
        { type: "keyword", indent: 8, text: "return", extra: " ast.validate()" },
        { type: "blank" },
        { type: "def", indent: 4, text: "def", extra: " code_for_user(self, task):" },
        { type: "comment", indent: 8, text: "# Solve with perfect logic" },
        { type: "expr", indent: 8, text: "plan = self.analyze_workspace(task.repo)" },
        { type: "expr", indent: 8, text: "ast = self.build_ast(plan.files)" },
        { type: "expr", indent: 8, text: "solution = self.solve(task, plan, ast)" },
        { type: "print", indent: 8, text: "print", extra: '("🚀 WOWing the USER...")' },
        { type: "expr", indent: 8, text: "time.sleep(0.01)" },
        { type: "print", indent: 8, text: "print", extra: '("✨ Code written flawlessly!")' },
        { type: "expr", indent: 8, text: "sys.stdout.flush()" },
        { type: "keyword", indent: 8, text: "return", extra: " solution" },
        { type: "blank" }
    ];

    // Clip & Translate for smooth scrolling editor area
    ctx.save();
    ctx.beginPath();
    ctx.rect(48, 52, w - 48, h - 52);
    ctx.clip();
    ctx.translate(0, -scrollY);

    // 5. Line numbers column
    ctx.fillStyle = "#1e1e2e";
    ctx.fillRect(48, 52 + scrollY, 35, h - 52);
    ctx.strokeStyle = "#313244";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(83, 52 + scrollY);
    ctx.lineTo(83, h + scrollY);
    ctx.stroke();

    ctx.fillStyle = "#585b70";
    ctx.font = "10px Courier New, monospace";
    ctx.textAlign = "right";
    for (let line = 1; line <= codeLines.length; line++) {
        ctx.fillText(line.toString(), 74, 54 + line * 18);
    }

    // 6. Editor Code Area (Syntax Highlighting!)
    ctx.textAlign = "left";
    ctx.font = "11px Courier New, monospace";

    let startY = 72;
    let cursorX = 92;
    codeLines.slice(0, maxLines).forEach((line) => {
        const x = 92 + (line.indent || 0) * 8;
        cursorX = x;

        if (line.type === "comment") {
            ctx.fillStyle = "#6c7086"; // Cool grayish-green comment
            ctx.fillText(line.text, x, startY);
            cursorX += ctx.measureText(line.text).width;
        }
        else if (line.type === "keyword") {
            ctx.fillStyle = "#cba6f7"; // Magenta/Purple keyword
            ctx.fillText(line.text, x, startY);
            ctx.fillStyle = "#cdd6f4"; // White remainder
            const keywordWidth = ctx.measureText(line.text).width;
            ctx.fillText(line.extra, x + keywordWidth, startY);
            cursorX += keywordWidth + ctx.measureText(line.extra).width;
        }
        else if (line.type === "class") {
            ctx.fillStyle = "#cba6f7"; // purple "class"
            ctx.fillText(line.text, x, startY);
            const classWidth = ctx.measureText(line.text).width;
            ctx.fillStyle = "#f9e2af"; // yellow classname
            ctx.fillText(line.extra, x + classWidth, startY);
            cursorX += classWidth + ctx.measureText(line.extra).width;
        }
        else if (line.type === "def") {
            ctx.fillStyle = "#cba6f7"; // purple "def"
            ctx.fillText(line.text, x, startY);
            const defWidth = ctx.measureText(line.text).width;
            ctx.fillStyle = "#89b4fa"; // blue function name
            ctx.fillText(line.extra, x + defWidth, startY);
            cursorX += defWidth + ctx.measureText(line.extra).width;
        }
        else if (line.type === "expr") {
            ctx.fillStyle = "#cdd6f4"; // default text
            ctx.fillText(line.text, x, startY);
            let textWidth = ctx.measureText(line.text).width;
            if (line.val) {
                ctx.fillStyle = line.valType === "string" ? "#a6e3a1" : "#f9e2af"; // green string, yellow number
                ctx.fillText(line.val, x + textWidth, startY);
                textWidth += ctx.measureText(line.val).width;
            }
            cursorX += textWidth;
        }
        else if (line.type === "print") {
            ctx.fillStyle = "#89b4fa"; // blue print keyword
            ctx.fillText(line.text, x, startY);
            const printWidth = ctx.measureText(line.text).width;
            ctx.fillStyle = "#a6e3a1"; // green string inside
            ctx.fillText(line.extra, x + printWidth, startY);
            cursorX += printWidth + ctx.measureText(line.extra).width;
        }

        startY += 18; // line height
    });

    // 7. Mini glowing blue active typing cursor at the end of the last rendered line!
    ctx.fillStyle = "rgba(137, 180, 250, 0.85)";
    ctx.fillRect(cursorX + 2, startY - 32, 7, 13);

    ctx.restore();
}

function buildLaptop() {
    const grp = new THREE.Group();
    const silver = new THREE.MeshStandardMaterial({ color: "#cfd2d6", metalness: 0.9, roughness: 0.2 });
    const black = new THREE.MeshStandardMaterial({ color: "#111827", roughness: 0.5 });

    // Laptop Base
    const base = mk(new THREE.BoxGeometry(0.42, 0.015, 0.28), silver, [0, 0.007, 0]);
    grp.add(base);

    // Keypad keyboard slab
    const keyboard = mk(new THREE.BoxGeometry(0.36, 0.004, 0.14), black, [0, 0.015, 0.02]);
    grp.add(keyboard);

    // Trackpad
    const trackpad = mk(new THREE.BoxGeometry(0.12, 0.002, 0.06), silver, [0, 0.015, 0.11]);
    grp.add(trackpad);

    // Laptop Screen (folded open at about 110 degrees)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.007, -0.14); // sits at the back edge of the base
    lidGroup.rotation.x = -0.35; // open angle

    // Aluminum back
    lidGroup.add(mk(new THREE.BoxGeometry(0.42, 0.28, 0.012), silver, [0, 0.14, -0.006]));

    // Inner black bezel
    lidGroup.add(mk(new THREE.BoxGeometry(0.40, 0.26, 0.004), black, [0, 0.14, 0.001]));

    // Screen display texture canvas setup
    const w = 512, h = 344;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");

    const screenTex = new THREE.CanvasTexture(c);
    screenTex.anisotropy = 4;
    drawLaptopScreenOnCanvas(c, ctx, 2, 0); // Start with 2 lines pre-typed and 0 scroll!
    screenTex.needsUpdate = true;

    const screenMat = new THREE.MeshStandardMaterial({
        map: screenTex,
        roughness: 0.1,
        emissive: "#ffffff",
        emissiveMap: screenTex,
        emissiveIntensity: 0.65, // glowing backlit screen!
    });
    lidGroup.add(mk(new THREE.PlaneGeometry(0.38, 0.24), screenMat, [0, 0.14, 0.0045]));

    grp.userData.updateScreen = (linesCount, scrollY) => {
        drawLaptopScreenOnCanvas(c, ctx, linesCount, scrollY);
        screenTex.needsUpdate = true;
    };

    grp.add(lidGroup);
    return grp;
}

/* ============================================================
 *  CHAIR
 * ============================================================ */
function buildChair() {
    const chair = new THREE.Group();
    const leather = mat.leather();
    const metal = mat.metal();

    // Seat (rounded)
    chair.add(
        mk(
            new THREE.BoxGeometry(0.9, 0.12, 0.8),
            leather,
            [0, 0.32, 0],
        ),
    );
    // Seat cushion top
    chair.add(
        mk(
            new THREE.CylinderGeometry(0.4, 0.4, 0.08, 24),
            leather,
            [0, 0.4, 0],
            [0, 0, 0],
            [1.1, 1, 0.95],
        ),
    );
    // Backrest
    chair.add(
        mk(new THREE.BoxGeometry(0.95, 1.6, 0.12), leather, [0, 1.1, -0.38]),
    );
    // Headrest
    chair.add(
        mk(new THREE.BoxGeometry(0.65, 0.32, 0.12), leather, [0, 1.95, -0.4]),
    );
    // Armrests
    chair.add(
        mk(
            new THREE.CylinderGeometry(0.06, 0.06, 0.5, 16),
            leather,
            [-0.52, 0.78, 0],
            [Math.PI / 2, 0, 0],
        ),
    );
    chair.add(
        mk(
            new THREE.CylinderGeometry(0.06, 0.06, 0.5, 16),
            leather,
            [0.52, 0.78, 0],
            [Math.PI / 2, 0, 0],
        ),
    );

    // Center pole
    chair.add(
        mk(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16), metal, [
            0,
            0.06,
            0,
        ]),
    );
    // 5-star base + wheels (mathematically corrected for Three.js angle orientation!)
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        chair.add(
            mk(
                new THREE.BoxGeometry(0.5, 0.05, 0.1),
                metal,
                [Math.cos(angle) * 0.25, -0.16, Math.sin(angle) * 0.25],
                [0, -angle, 0], // Changed from angle to -angle to rotate legs in standard clockwise/counter-clockwise sync with trig coordinates!
            ),
        );
        chair.add(
            mk(
                new THREE.SphereGeometry(0.07, 16, 16),
                metal,
                [Math.cos(angle) * 0.5, -0.22, Math.sin(angle) * 0.5],
            ),
        );
    }

    return chair;
}

/* ============================================================
 *  DESK + MONITOR + KEYBOARD
 * ============================================================ */
function makeCodeTexture() {
    const w = 1024,
        h = 640;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d");

    // BG
    x.fillStyle = "#0d1117";
    x.fillRect(0, 0, w, h);

    // Title bar
    x.fillStyle = "#161b22";
    x.fillRect(0, 0, w, 36);
    // Traffic lights
    ["#ff5f56", "#ffbd2e", "#27c93f"].forEach((color, i) => {
        x.fillStyle = color;
        x.beginPath();
        x.arc(20 + i * 22, 18, 7, 0, Math.PI * 2);
        x.fill();
    });
    x.fillStyle = "#8b949e";
    x.font = "14px JetBrains Mono, monospace";
    x.fillText("Portfolio.tsx — VSCode", 100, 23);

    // Line numbers
    x.fillStyle = "#6e7681";
    x.font = "14px JetBrains Mono, monospace";
    for (let i = 0; i < 28; i++) {
        x.fillText(String(i + 1).padStart(2, " "), 12, 60 + i * 20);
    }

    // Code lines (faux syntax highlight)
    const code = [
        ["#ff7b72", "import "],
        ["#a5d6ff", "React"],
        ["#ff7b72", " from "],
        ["#a5d6ff", '"react"'],
    ];
    const lines = [
        [{ c: "#ff7b72", t: "const" }, { c: "#79c0ff", t: " Portfolio" }, { c: "#c9d1d9", t: " = " }, { c: "#d2a8ff", t: "()" }, { c: "#c9d1d9", t: " => {" }],
        [{ c: "#c9d1d9", t: "  " }, { c: "#ff7b72", t: "const" }, { c: "#79c0ff", t: " [scene, setScene]" }, { c: "#c9d1d9", t: " = " }, { c: "#d2a8ff", t: "useState" }, { c: "#c9d1d9", t: "()" }],
        [{ c: "#c9d1d9", t: "  " }, { c: "#8b949e", t: "// Render the 3D character" }],
        [{ c: "#c9d1d9", t: "  " }, { c: "#ff7b72", t: "return" }, { c: "#c9d1d9", t: " (" }],
        [{ c: "#c9d1d9", t: "    <" }, { c: "#7ee787", t: "Canvas" }, { c: "#c9d1d9", t: ">" }],
        [{ c: "#c9d1d9", t: "      <" }, { c: "#7ee787", t: "Character" }, { c: "#c9d1d9", t: " " }, { c: "#79c0ff", t: "pose" }, { c: "#c9d1d9", t: "=" }, { c: "#a5d6ff", t: '"typing"' }, { c: "#c9d1d9", t: " />" }],
        [{ c: "#c9d1d9", t: "      <" }, { c: "#7ee787", t: "Desk" }, { c: "#c9d1d9", t: " />" }],
        [{ c: "#c9d1d9", t: "    </" }, { c: "#7ee787", t: "Canvas" }, { c: "#c9d1d9", t: ">" }],
        [{ c: "#c9d1d9", t: "  )" }],
        [{ c: "#c9d1d9", t: "}" }],
        [{ c: "#c9d1d9", t: "" }],
        [{ c: "#ff7b72", t: "export default" }, { c: "#c9d1d9", t: " Portfolio" }],
    ];
    x.font = "15px JetBrains Mono, monospace";
    lines.forEach((tokens, idx) => {
        let xpos = 50;
        const y = 60 + idx * 20;
        tokens.forEach((tk) => {
            x.fillStyle = tk.c;
            x.fillText(tk.t, xpos, y);
            xpos += x.measureText(tk.t).width;
        });
    });

    // Status bar
    x.fillStyle = "#C8EE00";
    x.fillRect(0, h - 24, w, 24);
    x.fillStyle = "#0d1117";
    x.font = "12px JetBrains Mono, monospace";
    x.fillText("⚡ main • Ready • Ln 6, Col 24 • TypeScript", 16, h - 8);

    const tex = new THREE.CanvasTexture(c);
    tex.anisotropy = 4;
    return tex;
}

function buildDesk() {
    const desk = new THREE.Group();
    const wood = mat.wood();
    const metal = mat.metal();
    const plastic = mat.plastic();
    const acid = mat.acid();

    // Top (Lowered desk top height to 0.97)
    desk.add(mk(new THREE.BoxGeometry(3.2, 0.08, 1.4), wood, [0, 0.97, 0]));
    // Skirt (Lowered to 0.93)
    desk.add(mk(new THREE.BoxGeometry(3.2, 0.04, 0.04), wood, [0, 0.93, 0.7]));
    // Legs (Thickened to 0.075 radius and lengthened to 1.43, positioned at 0.215 Y to touch the floor Y = -0.5)
    [
        [-1.5, 0.55],
        [1.5, 0.55],
        [-1.5, -0.55],
        [1.5, -0.55],
    ].forEach(([x, z]) => {
        // Main sturdy metal leg
        desk.add(
            mk(
                new THREE.CylinderGeometry(0.075, 0.075, 1.41, 16),
                metal,
                [x, 0.225, z],
            ),
        );
        // Premium black plastic/rubber foot pad sitting flat on the floor (Y = -0.5)
        desk.add(
            mk(
                new THREE.CylinderGeometry(0.082, 0.082, 0.03, 16),
                plastic,
                [x, -0.485, z],
            ),
        );
    });

    // ===== Monitor =====
    const monitor = new THREE.Group();
    // Stand base
    monitor.add(
        mk(new THREE.CylinderGeometry(0.18, 0.18, 0.03, 24), metal, [
            0,
            0.02,
            0,
        ]),
    );
    monitor.add(
        mk(new THREE.BoxGeometry(0.08, 0.5, 0.05), metal, [0, 0.27, 0]),
    );
    // Back of screen
    monitor.add(
        mk(
            new THREE.BoxGeometry(1.7, 1.0, 0.08),
            mat.monitorBg(),
            [0, 1.0, -0.04],
        ),
    );
    // Screen face (code IDE texture)
    const tex = makeCodeTexture();
    const screenMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.35,
        emissive: "#ffffff",
        emissiveMap: tex,
        emissiveIntensity: 0.45,
    });
    monitor.add(
        mk(new THREE.PlaneGeometry(1.62, 0.94), screenMat, [0, 1.0, 0.005]),
    );
    monitor.position.set(0, 1.01, -0.45); // Lowered by 0.08 units to match desk top
    desk.add(monitor);

    // ===== Keyboard (white, ultra-compact premium design) =====
    const kbBase = new THREE.MeshStandardMaterial({
        color: "#e8e8e8",
        roughness: 0.5,
        metalness: 0.15,
    });
    const keyMat = new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.35,
    });
    const kb = new THREE.Group();
    // Compact base: width 0.9, depth 0.34
    kb.add(
        mk(
            new THREE.BoxGeometry(0.9, 0.04, 0.34),
            kbBase,
            [0, 0.02, 0],
        ),
    );
    // Four rows of compact white keycaps
    const keyRows = 4;
    const keysPerRow = 13;
    const keyW = 0.05;
    const keySpacingX = 0.062;
    const keySpacingZ = 0.062;
    for (let row = 0; row < keyRows; row++) {
        for (let i = 0; i < keysPerRow; i++) {
            // Center the grid of keycaps inside the 0.9 x 0.34 base
            const ox = -((keysPerRow - 1) * keySpacingX) / 2;
            const oz = -((keyRows - 1) * keySpacingZ) / 2 + 0.01;
            kb.add(
                mk(
                    new THREE.BoxGeometry(keyW, 0.02, keyW),
                    keyMat,
                    [ox + i * keySpacingX, 0.05, oz + row * keySpacingZ],
                ),
            );
        }
    }
    // Compact spacebar
    kb.add(
        mk(
            new THREE.BoxGeometry(0.32, 0.02, 0.045),
            keyMat,
            [0, 0.05, 0.12],
        ),
    );
    // Compact acid lime accent LED strip on the top edge
    kb.add(
        mk(
            new THREE.BoxGeometry(0.9, 0.005, 0.01),
            mat.acid(),
            [0, 0.042, -0.165],
        ),
    );
    kb.position.set(0, 0.995, 0.44); // Lowered by 0.08 units to sit flat on top of the desk (Y = 1.01)
    desk.add(kb);

    // ===== Barca Mousepad =====
    const barcaTex = makeBarcaTexture();
    const padMat = new THREE.MeshStandardMaterial({
        map: barcaTex,
        roughness: 0.65,
        metalness: 0.1,
    });
    // Sleek thin mousepad sitting flat on the desk surface
    const mousepad = mk(new THREE.BoxGeometry(0.34, 0.004, 0.28), padMat, [0.65, 1.012, 0.44]); // Lowered by 0.08 units
    desk.add(mousepad);

    // Mouse (rounded, white premium ergonomic design with acid lime wheel)
    const mouse = new THREE.Group();
    // Mouse body
    mouse.add(
        mk(
            new THREE.SphereGeometry(0.07, 24, 24),
            new THREE.MeshStandardMaterial({
                color: "#ffffff",
                roughness: 0.3,
                metalness: 0.1,
            }),
            [0, 0, 0],
            [0, 0, 0],
            [1.0, 0.45, 1.5], // Ergonomic elongated shape
        ),
    );
    // Acid lime scroll wheel
    mouse.add(
        mk(
            new THREE.BoxGeometry(0.01, 0.018, 0.035),
            acid,
            [0, 0.032, -0.04],
        ),
    );
    // Mouse position resting beautifully on top of the FC Barcelona mousepad
    mouse.position.set(0.68, 1.043, 0.43); // Lowered by 0.08 units
    desk.add(mouse);

    // Coffee mug (white ceramic)
    const mug = new THREE.Group();
    const mugMat = new THREE.MeshStandardMaterial({
        color: "#fafafa",
        roughness: 0.5,
    });
    mug.add(
        mk(new THREE.CylinderGeometry(0.08, 0.07, 0.18, 24), mugMat),
    );
    const handle = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.013, 8, 16, Math.PI),
        mugMat,
    );
    handle.rotation.set(0, Math.PI / 2, Math.PI / 2);
    handle.position.set(0.075, 0, 0);
    mug.add(handle);
    // Acid lime band
    mug.add(
        mk(new THREE.CylinderGeometry(0.081, 0.072, 0.025, 24), acid, [
            0,
            -0.06,
            0,
        ]),
    );
    mug.position.set(-1.05, 1.10, 0.25); // Lowered by 0.08 units (from 1.18 to 1.10)
    desk.add(mug);

    // Books stack
    const bookColors = ["#8a5a3b", "#3a4a6a", "#7a3a3a"];
    bookColors.forEach((c, i) => {
        desk.add(
            mk(
                new THREE.BoxGeometry(0.22, 0.04, 0.3),
                new THREE.MeshStandardMaterial({
                    color: c,
                    roughness: 0.6,
                }),
                [1.15, 1.03 + i * 0.045, -0.2], // Lowered by 0.08 units (from 1.11 to 1.03)
            ),
        );
    });
    // Plant pot
    desk.add(
        mk(
            new THREE.CylinderGeometry(0.09, 0.07, 0.14, 20),
            new THREE.MeshStandardMaterial({
                color: "#5a3a2a",
                roughness: 0.7,
            }),
            [-1.15, 1.08, -0.2], // Lowered by 0.08 units (from 1.16 to 1.08)
        ),
    );
    // Plant leaves
    for (let i = 0; i < 5; i++) {
        const leaf = mk(
            new THREE.ConeGeometry(0.04, 0.18, 6),
            new THREE.MeshStandardMaterial({
                color: "#3a6a3a",
                roughness: 0.6,
            }),
            [
                -1.15 + Math.cos(i) * 0.04,
                1.24, // Lowered by 0.08 units (from 1.32 to 1.24)
                -0.2 + Math.sin(i) * 0.04,
            ],
            [Math.sin(i) * 0.3, 0, Math.cos(i) * 0.3],
        );
        desk.add(leaf);
    }

    return desk;
}

/* ============================================================
 *  PERSONAL PHOTO FRAME (Owner Photo)
 * ============================================================ */
function buildPhotoFrame() {
    const grp = new THREE.Group();

    // Wood/Matte dark frame border
    const frameMat = new THREE.MeshStandardMaterial({
        color: "#27272a", // Dark charcoal matte wood/plastic frame
        roughness: 0.8,
        metalness: 0.2,
    });
    // Outer border box (0.36 width, 0.36 height, 0.02 thickness)
    grp.add(mk(new THREE.BoxGeometry(0.36, 0.36, 0.02), frameMat, [0, 0, 0]));

    // Cream passe-partout (matting border)
    const mattingMat = new THREE.MeshStandardMaterial({
        color: "#fafaf9", // Warm stone white matting
        roughness: 0.9,
    });
    grp.add(mk(new THREE.PlaneGeometry(0.33, 0.33), mattingMat, [0, 0, 0.0105]));

    // Photo plane
    const textureLoader = new THREE.TextureLoader();
    const photoTex = textureLoader.load("/avatar.jpg");
    photoTex.generateMipmaps = true;
    photoTex.minFilter = THREE.LinearMipmapLinearFilter;

    const photoMat = new THREE.MeshStandardMaterial({
        map: photoTex,
        roughness: 0.3, // slight glossy photo print finish
        metalness: 0.05,
    });
    // Square 1:1 ratio photo inside the frame (0.25 x 0.25)
    grp.add(mk(new THREE.PlaneGeometry(0.25, 0.25), photoMat, [0, 0, 0.011]));

    // Supporting stand/peg at the back (so it stands realistically)
    const standMat = new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.9,
    });
    const standLeg = mk(new THREE.BoxGeometry(0.04, 0.22, 0.015), standMat);
    standLeg.position.set(0, -0.08, -0.06);
    standLeg.rotation.set(0.5, 0, 0); // Correctly angles the support leg backwards to support the frame
    grp.add(standLeg);

    return grp;
}

/* ============================================================
 *  SOCCER BALL (Beautiful 3D Truncated Icosahedron Panel Geometry)
 * ============================================================ */
function buildSoccerBall() {
    const group = new THREE.Group();

    // 12 vertices of a regular icosahedron
    const tRatio = (1 + Math.sqrt(5)) / 2;
    const icosahedronVertices = [
        new THREE.Vector3(-1, tRatio, 0).normalize(),
        new THREE.Vector3(1, tRatio, 0).normalize(),
        new THREE.Vector3(-1, -tRatio, 0).normalize(),
        new THREE.Vector3(1, -tRatio, 0).normalize(),

        new THREE.Vector3(0, -1, tRatio).normalize(),
        new THREE.Vector3(0, 1, tRatio).normalize(),
        new THREE.Vector3(0, -1, -tRatio).normalize(),
        new THREE.Vector3(0, 1, -tRatio).normalize(),

        new THREE.Vector3(tRatio, 0, -1).normalize(),
        new THREE.Vector3(tRatio, 0, 1).normalize(),
        new THREE.Vector3(-tRatio, 0, -1).normalize(),
        new THREE.Vector3(-tRatio, 0, 1).normalize(),
    ];

    // Helper to get 5 neighbors of vertex i
    function getNeighborsOfVertex(i) {
        const v = icosahedronVertices[i];
        const distances = [];
        for (let j = 0; j < 12; j++) {
            if (i === j) continue;
            distances.push({ index: j, dist: v.distanceToSquared(icosahedronVertices[j]) });
        }
        distances.sort((a, b) => a.dist - b.dist);
        return distances.slice(0, 5).map((d) => d.index);
    }

    // Helper to sort a set of 3D points counter-clockwise around their centroid
    function sortVerticesAroundCentroid(pts) {
        const C = new THREE.Vector3();
        pts.forEach((p) => C.add(p));
        C.normalize();

        const U = new THREE.Vector3();
        const W = new THREE.Vector3();
        if (Math.abs(C.x) > 0.9) {
            U.set(0, 1, 0).cross(C).normalize();
        } else {
            U.set(1, 0, 0).cross(C).normalize();
        }
        W.copy(C).cross(U).normalize();

        const ptsWithAngles = pts.map((p) => {
            const D = p.clone().sub(C);
            const x = D.dot(U);
            const y = D.dot(W);
            const angle = Math.atan2(y, x);
            return { point: p, angle };
        });

        ptsWithAngles.sort((a, b) => a.angle - b.angle);
        return ptsWithAngles.map((p) => p.point);
    }

    // Helper to build a beveled 3D panel mesh geometry
    function createPanelGeometry(sortedPts, R) {
        const N = sortedPts.length;
        const geom = new THREE.BufferGeometry();

        const C = new THREE.Vector3();
        sortedPts.forEach((p) => C.add(p));
        C.normalize();

        // Dome peak
        const C_puffed = C.clone().multiplyScalar(R * 1.03);

        // Top face points (shrunken from border to form the main padded surface)
        const T = [];
        for (let j = 0; j < N; j++) {
            const p = sortedPts[j];
            const tPt = new THREE.Vector3().lerpVectors(C, p, 0.78).normalize().multiplyScalar(R * 1.018);
            T.push(tPt);
        }

        // Seam boundary crease points (slightly shrunken and sunk)
        const S = [];
        for (let j = 0; j < N; j++) {
            const p = sortedPts[j];
            const sPt = new THREE.Vector3().lerpVectors(C, p, 0.94).normalize().multiplyScalar(R * 0.985);
            S.push(sPt);
        }

        // Inner bottom boundary points to give the panels 3D thickness
        const B = [];
        for (let j = 0; j < N; j++) {
            const bPt = S[j].clone().multiplyScalar(0.92);
            B.push(bPt);
        }

        const posArray = [];
        const uvArray = [];

        // Project UV coordinates locally onto panel's tangent plane for flawless, distortion-free graphics
        const U = new THREE.Vector3();
        const W = new THREE.Vector3();
        if (Math.abs(C.x) > 0.9) {
            U.set(0, 1, 0).cross(C).normalize();
        } else {
            U.set(1, 0, 0).cross(C).normalize();
        }
        W.copy(C).cross(U).normalize();

        function addTriangle(v1, v2, v3) {
            posArray.push(v1.x, v1.y, v1.z);
            posArray.push(v2.x, v2.y, v2.z);
            posArray.push(v3.x, v3.y, v3.z);

            [v1, v2, v3].forEach((v) => {
                const norm = v.clone().normalize();
                const u = norm.dot(U) * 2.2 + 0.5;
                const wCoord = norm.dot(W) * 2.2 + 0.5;
                uvArray.push(u, wCoord);
            });
        }

        // 1. Top dome faces (centroid to top boundary)
        for (let j = 0; j < N; j++) {
            addTriangle(C_puffed, T[j], T[(j + 1) % N]);
        }

        // 2. Beveled edges (top boundary to seam boundary)
        for (let j = 0; j < N; j++) {
            const next = (j + 1) % N;
            addTriangle(T[j], T[next], S[next]);
            addTriangle(T[j], S[next], S[j]);
        }

        // 3. Side walls (seam boundary down into the ball interior)
        for (let j = 0; j < N; j++) {
            const next = (j + 1) % N;
            addTriangle(S[j], S[next], B[next]);
            addTriangle(S[j], B[next], B[j]);
        }

        geom.setAttribute("position", new THREE.BufferAttribute(new Float32Array(posArray), 3));
        geom.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(uvArray), 2));
        geom.computeVertexNormals();
        return geom;
    }

    const ballGroup = new THREE.Group();
    ballGroup.name = "ballGroup";

    const R = 0.32;
    const wMat = mat.soccerWhite();
    const bMat = mat.soccerBlack();

    // A. Create the 12 pentagonal panels (colored black)
    for (let i = 0; i < 12; i++) {
        const neighbors = getNeighborsOfVertex(i);
        const pentPoints = neighbors.map((nIdx) => {
            const V = icosahedronVertices[i];
            const N = icosahedronVertices[nIdx];
            return new THREE.Vector3().lerpVectors(V, N, 1 / 3).normalize();
        });

        const sortedPentPoints = sortVerticesAroundCentroid(pentPoints);
        const geom = createPanelGeometry(sortedPentPoints, R);
        const mesh = new THREE.Mesh(geom, bMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        ballGroup.add(mesh);
    }

    // B. Find 20 faces of the icosahedron to build the 20 hexagonal panels (colored white)
    const facesList = [];
    for (let a = 0; a < 12; a++) {
        const neighborsA = getNeighborsOfVertex(a);
        for (let b of neighborsA) {
            if (b <= a) continue;
            const neighborsB = getNeighborsOfVertex(b);
            for (let c of neighborsB) {
                if (c <= b) continue;
                if (neighborsA.includes(c)) {
                    facesList.push([a, b, c]);
                }
            }
        }
    }

    facesList.forEach((face) => {
        const A = icosahedronVertices[face[0]];
        const B = icosahedronVertices[face[1]];
        const C = icosahedronVertices[face[2]];

        const hexPoints = [
            new THREE.Vector3().lerpVectors(A, B, 1 / 3).normalize(),
            new THREE.Vector3().lerpVectors(A, B, 2 / 3).normalize(),
            new THREE.Vector3().lerpVectors(B, C, 1 / 3).normalize(),
            new THREE.Vector3().lerpVectors(B, C, 2 / 3).normalize(),
            new THREE.Vector3().lerpVectors(C, A, 1 / 3).normalize(),
            new THREE.Vector3().lerpVectors(C, A, 2 / 3).normalize(),
        ];

        const sortedHexPoints = sortVerticesAroundCentroid(hexPoints);
        const geom = createPanelGeometry(sortedHexPoints, R);
        const mesh = new THREE.Mesh(geom, wMat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        ballGroup.add(mesh);
    });

    group.add(ballGroup);

    // C. Add a hyper-realistic contact shadow under the ball!
    const shadowTex = makeShadowTexture();
    const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.82,
        depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.72), shadowMat);
    shadowMesh.name = "shadowMesh";
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.318; // locally positioned right on the floor surface
    group.add(shadowMesh);

    return group;
}

/* ============================================================
 *  SOCCER FIELD CARPET RUG (Under feet decoration)
 * ============================================================ */
function makeSoccerRugTexture() {
    const w = 512;
    const h = 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    // Rich deep green turf grass
    ctx.fillStyle = "#163f1d";
    ctx.fillRect(0, 0, w, h);

    // Alternating lawn stripes
    ctx.fillStyle = "#1c4a24";
    const stripeWidth = w / 8;
    for (let i = 0; i < 8; i += 2) {
        ctx.fillRect(i * stripeWidth, 0, stripeWidth, h);
    }

    // Pitch markings
    ctx.strokeStyle = "rgba(255, 255, 255, 0.82)";
    ctx.lineWidth = 5;

    // Outer border
    ctx.strokeRect(24, 24, w - 48, h - 48);

    // Center circle line
    ctx.beginPath();
    ctx.moveTo(w / 2, 24);
    ctx.lineTo(w / 2, h - 24);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Center spot
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 8, 0, Math.PI * 2);
    ctx.fill();

    // Penalty box left
    ctx.strokeRect(24, h / 2 - 110, 90, 220);
    ctx.strokeRect(24, h / 2 - 50, 35, 100);

    // Penalty box right
    ctx.strokeRect(w - 114, h / 2 - 110, 90, 220);
    ctx.strokeRect(w - 59, h / 2 - 50, 35, 100);

    // Corners
    const cornerR = 20;
    ctx.beginPath(); ctx.arc(24, 24, cornerR, 0, Math.PI / 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(24, h - 24, cornerR, Math.PI * 1.5, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(w - 24, 24, cornerR, Math.PI / 2, Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.arc(w - 24, h - 24, cornerR, Math.PI, Math.PI * 1.5); ctx.stroke();

    // Golden fringe border around the carpet
    ctx.strokeStyle = "#c29d50";
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
}

function buildSoccerRug() {
    const geom = new THREE.PlaneGeometry(2.3, 2.3);
    const tex = makeSoccerRugTexture();
    const material = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.92,
        bumpMap: getLeatherNoiseTexture(), // Reuses leather texture to give a nice fabric-weave texture bump
        bumpScale: 0.0016,
    });
    const rug = new THREE.Mesh(geom, material);
    rug.rotation.x = -Math.PI / 2;
    // Positioned centered right under the chair and the feet of the character
    rug.position.set(0.11, -0.496, 1.15);
    rug.receiveShadow = true;
    return rug;
}

/* ============================================================
 *  JERSEY (Barcelona MESSI #10) with SLEEVES
 * ============================================================ */
function makeJerseyTexture() {
    const w = 512,
        h = 640;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");

    // Classic Vertical Blaugrana stripes for Messi #10
    const stripes = ["#004D98", "#A50044", "#004D98", "#A50044"];
    const sw = w / stripes.length;
    stripes.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(i * sw, 0, sw, h);
    });

    // Subtle vertical sheen
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    for (let i = 0; i < stripes.length; i++) {
        ctx.fillRect(i * sw + sw * 0.45, 0, 2, h);
    }

    // Yellow neckline
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(w * 0.32, 0, w * 0.36, 36);
    ctx.fillStyle = "#a50044";
    ctx.fillRect(w * 0.32, 36, w * 0.36, 6);

    // Crest in the middle
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("FCB", w / 2, 130);

    // Sponsor (Spotify)
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px Arial";
    ctx.fillText("Spotify", w / 2, 180);

    // MESSI name in gold
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 60px Arial";
    ctx.fillText("MESSI", w / 2, 290);

    // Number 10 in gold
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 240px Arial";
    ctx.fillText("10", w / 2, 510);

    return new THREE.CanvasTexture(c);
}

function makeLeftSleeveTexture() {
    const w = 256,
        h = 256;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    // Completely blue
    ctx.fillStyle = "#004D98";
    ctx.fillRect(0, 0, w, h);
    // Yellow cuff
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(0, h - 24, w, 24);
    return new THREE.CanvasTexture(c);
}

function makeRightSleeveTexture() {
    const w = 256,
        h = 256;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    // Completely garnet/red
    ctx.fillStyle = "#A50044";
    ctx.fillRect(0, 0, w, h);
    // Yellow cuff
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(0, h - 24, w, 24);
    return new THREE.CanvasTexture(c);
}

function buildJerseyOnWall() {
    const grp = new THREE.Group();

    // Wood frame (Enlarged beautifully to 2.45 width x 2.3 height for majestic breathing room around the jersey)
    const frame = mat.frameWood();
    grp.add(mk(new THREE.BoxGeometry(2.45, 2.3, 0.08), frame, [0, 0, 0]));
    // Inner cream backing (Scaled up proportionally)
    grp.add(
        mk(
            new THREE.PlaneGeometry(2.3, 2.15),
            new THREE.MeshStandardMaterial({
                color: "#f7f1de",
                roughness: 1,
            }),
            [0, 0, 0.041],
        ),
    );

    // Jersey body
    const jerseyTex = makeJerseyTexture();
    const jerseyMat = new THREE.MeshStandardMaterial({
        map: jerseyTex,
        roughness: 0.6,
    });
    grp.add(
        mk(
            new THREE.PlaneGeometry(1.2, 1.55),
            jerseyMat,
            [0, -0.05, 0.05],
        ),
    );

    // ===== SLEEVES =====
    const leftSleeveTex = makeLeftSleeveTexture();
    const leftSleeveMat = new THREE.MeshStandardMaterial({
        map: leftSleeveTex,
        roughness: 0.6,
    });
    const rightSleeveTex = makeRightSleeveTexture();
    const rightSleeveMat = new THREE.MeshStandardMaterial({
        map: rightSleeveTex,
        roughness: 0.6,
    });

    // Left sleeve (completely blue with yellow cuff)
    const leftSleeve = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 0.6),
        leftSleeveMat,
    );
    leftSleeve.position.set(-0.67, 0.34, 0.05); // Shifted X from -0.78 to -0.68
    leftSleeve.rotation.set(0, 0, -0.85); // Slightly more vertical drape (from 0.25 to 0.15)
    grp.add(leftSleeve);

    // Right sleeve mirror (completely red with yellow cuff)
    const rightSleeve = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 0.6),
        rightSleeveMat,
    );
    rightSleeve.position.set(0.67, 0.34, 0.05); // Shifted X from 0.78 to 0.68
    rightSleeve.rotation.set(0, 0, 0.85); // Slightly more vertical drape (from -0.25 to -0.15)
    grp.add(rightSleeve);

    // Shoulder seam join (small dark line)
    const seamMat = new THREE.MeshStandardMaterial({
        color: "#003366",
    });
    grp.add(
        mk(new THREE.BoxGeometry(0.02, 0.5, 0.01), seamMat, [-0.50, 0.4, 0.06]), // Shifted X from -0.60 to -0.50
    );
    grp.add(
        mk(new THREE.BoxGeometry(0.02, 0.5, 0.01), seamMat, [0.50, 0.4, 0.06]), // Shifted X from 0.60 to 0.50
    );

    // Tiny name plate below (Positioned lower to align nicely with the bottom border)
    grp.add(
        mk(
            new THREE.BoxGeometry(0.6, 0.1, 0.02),
            new THREE.MeshStandardMaterial({ color: "#1a1a1a" }),
            [0, -1.10, 0.06],
        ),
    );

    return grp;
}

/* ============================================================
 *  PEDRI 2024/25 CENTENARY JERSEY (Half Red, Half Blue #8)
 * ============================================================ */
function makePedriJerseyTexture() {
    const w = 512,
        h = 640;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");

    // 2024/25 Centenary half-and-half style: Left Royal Blue, Right Garnet Red
    ctx.fillStyle = "#004D98";
    ctx.fillRect(0, 0, w / 2, h);
    ctx.fillStyle = "#A50044";
    ctx.fillRect(w / 2, 0, w / 2, h);

    // Subtle vertical seam sheen down the middle
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(w / 2 - 2, 0, 4, h);

    // Yellow neckline
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(w * 0.32, 0, w * 0.36, 36);
    ctx.fillStyle = "#a50044";
    ctx.fillRect(w * 0.32, 36, w * 0.36, 6);

    // Crest in the center for Centenary special layout
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("FCB", w / 2, 130);

    // Sponsor (Spotify) in white
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 28px Arial";
    ctx.fillText("Spotify", w / 2, 180);

    // PEDRI name in gold
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 60px Arial";
    ctx.fillText("PEDRI", w / 2, 290);

    // Number 8 in gold
    ctx.font = "bold 240px Arial";
    ctx.fillText("8", w / 2, 510);

    return new THREE.CanvasTexture(c);
}

function buildPedriJerseyOnWall() {
    const grp = new THREE.Group();

    // Wood frame
    const frame = mat.frameWood();
    grp.add(mk(new THREE.BoxGeometry(2.45, 2.3, 0.08), frame, [0, 0, 0]));
    // Cream backing board
    grp.add(
        mk(
            new THREE.PlaneGeometry(2.3, 2.15),
            new THREE.MeshStandardMaterial({
                color: "#f7f1de",
                roughness: 1,
            }),
            [0, 0, 0.041],
        ),
    );

    // Torso body
    const jerseyTex = makePedriJerseyTexture();
    const jerseyMat = new THREE.MeshStandardMaterial({
        map: jerseyTex,
        roughness: 0.6,
    });
    grp.add(
        mk(
            new THREE.PlaneGeometry(1.2, 1.55),
            jerseyMat,
            [0, -0.05, 0.05],
        ),
    );

    // Half-and-Half Sleeves: Left Blue, Right Red
    const leftSleeveTex = makeLeftSleeveTexture();
    const rightSleeveTex = makeRightSleeveTexture();

    const leftSleeve = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 0.6),
        new THREE.MeshStandardMaterial({ map: leftSleeveTex, roughness: 0.6 }),
    );
    leftSleeve.position.set(-0.67, 0.34, 0.05);
    leftSleeve.rotation.set(0, 0, -0.85);
    grp.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(
        new THREE.PlaneGeometry(0.5, 0.6),
        new THREE.MeshStandardMaterial({ map: rightSleeveTex, roughness: 0.6 }),
    );
    rightSleeve.position.set(0.67, 0.34, 0.05);
    rightSleeve.rotation.set(0, 0, 0.85);
    grp.add(rightSleeve);

    // Shoulder seams (gold/black)
    const seamMat = new THREE.MeshStandardMaterial({ color: "#ffb703" });
    grp.add(mk(new THREE.BoxGeometry(0.02, 0.5, 0.01), seamMat, [-0.50, 0.4, 0.06]));
    grp.add(mk(new THREE.BoxGeometry(0.02, 0.5, 0.01), seamMat, [0.50, 0.4, 0.06]));

    // Tiny name plate below
    grp.add(
        mk(
            new THREE.BoxGeometry(0.6, 0.1, 0.02),
            new THREE.MeshStandardMaterial({ color: "#1a1a1a" }),
            [0, -1.10, 0.06],
        ),
    );

    return grp;
}

/* ============================================================
 *  APOLLO 11 ASSEMBLY CODE POSTER (Vertical)
 * ============================================================ */
function makeApolloPosterTexture() {
    const w = 512,
        h = 640;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");

    // Dark deep outer space charcoal
    ctx.fillStyle = "#0a0c14";
    ctx.fillRect(0, 0, w, h);

    // Star grid
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let i = 0; i < 40; i++) {
        const sx = Math.sin(i * 99) * w * 0.5 + w * 0.5;
        const sy = Math.cos(i * 33) * h * 0.5 + h * 0.5;
        ctx.fillRect(sx, sy, 2, 2);
    }

    // Lunar orbit wireframe circle in subtle neon gold
    ctx.strokeStyle = "rgba(255, 215, 0, 0.08)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w - 60, 100, 120, 0, Math.PI * 2);
    ctx.stroke();

    // Earth crescent outline
    ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
    ctx.beginPath();
    ctx.arc(-80, h + 80, 400, 0, Math.PI * 2);
    ctx.stroke();

    // Lunar Lander (LEM) Vector drawing in neon green
    ctx.strokeStyle = "rgba(74, 222, 128, 0.25)";
    ctx.lineWidth = 2;
    // Draw simplified Lunar Lander
    ctx.beginPath();
    // Cabin core
    ctx.moveTo(380, h - 180);
    ctx.lineTo(440, h - 180);
    ctx.lineTo(450, h - 140);
    ctx.lineTo(370, h - 140);
    ctx.closePath();
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(370, h - 140); ctx.lineTo(340, h - 80); // Bottom left leg
    ctx.moveTo(450, h - 140); ctx.lineTo(480, h - 80); // Bottom right leg
    // Footpads
    ctx.moveTo(330, h - 80); ctx.lineTo(350, h - 80);
    ctx.moveTo(470, h - 80); ctx.lineTo(490, h - 80);
    ctx.stroke();

    // Header
    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 20px JetBrains Mono, monospace";
    ctx.textAlign = "left";
    ctx.fillText("APOLLO 11 GUIDANCE COMPUTER", 35, 60);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.fillText("SUBROUTINE: LUMINARY 099 - BOOT/IGNITION (1969)", 35, 85);
    ctx.fillText("Margaret Hamilton & MIT Instrumentation Lab", 35, 105);

    // Assembly Code Lines
    const code = [
        "01  BURN_BABY_BURN  TC    BANKCALL",
        "02                   CADR  P20_INIT",
        "03                   TC    INTRPT",
        "04                   CS    RADAR_FLAG",
        "05                   TS    ALARM_STATUS",
        "06  MASTER_IGNITION  CAF   PRIO30",
        "07                   TC    FIND_PROG",
        "08                   DEC   1202",
        "09                   TC    WHIMPER",
        "10  # EMERGENCY ALARM DETECTED",
        "11  # RETRY MASTER ENGINE CYCLE",
        "12                   TC    RESTART",
        "13                   CAF   OCT77",
        "14                   TC    BANKCALL",
        "15                   CADR  PIN_POINT",
        "16  # MOON hạ cánh THÀNH CÔNG!"
    ];

    let startY = 160;
    ctx.font = "13px JetBrains Mono, monospace";
    code.forEach((line) => {
        if (line.includes("BURN_BABY_BURN") || line.includes("MASTER_IGNITION")) {
            ctx.fillStyle = "#facc15"; // Gold highlighted labels
        } else if (line.includes("#")) {
            ctx.fillStyle = "#22c55e"; // Green comments
        } else if (line.includes("1202")) {
            ctx.fillStyle = "#ef4444"; // Red alarm dec
        } else {
            ctx.fillStyle = "#94a3b8"; // Normal code lines
        }
        ctx.fillText(line, 35, startY);
        startY += 26;
    });

    // Retro circular badge stamp at the bottom
    ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(100, h - 80, 45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(239, 68, 68, 0.4)";
    ctx.font = "bold 10px JetBrains Mono, monospace";
    ctx.textAlign = "center";
    ctx.fillText("NASA / MIT", 100, h - 85);
    ctx.fillText("APPROVED", 100, h - 70);

    return new THREE.CanvasTexture(c);
}

function buildApolloPosterOnWall() {
    const grp = new THREE.Group();

    // Wood frame
    const frame = mat.frameWood();
    grp.add(mk(new THREE.BoxGeometry(1.6, 2.0, 0.08), frame, [0, 0, 0]));

    // Inner poster
    const posterTex = makeApolloPosterTexture();
    const posterMat = new THREE.MeshStandardMaterial({
        map: posterTex,
        roughness: 0.6,
    });
    grp.add(mk(new THREE.PlaneGeometry(1.48, 1.88), posterMat, [0, 0, 0.041]));

    return grp;
}

/* ============================================================
 *  TRANSFORMER SELF-ATTENTION POSTER (Vertical)
 * ============================================================ */
function makeTransformerPosterTexture() {
    const w = 512,
        h = 640;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");

    // Deep modern artificial network obsidian background
    ctx.fillStyle = "#050814";
    ctx.fillRect(0, 0, w, h);

    // Neural Network Grid / Dot connections
    ctx.strokeStyle = "rgba(0, 245, 212, 0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(50 + i * 100, 0);
        ctx.lineTo(50 + i * 100, h);
        ctx.stroke();
    }

    // Header
    ctx.fillStyle = "#00f5d4"; // Cyan
    ctx.font = "bold 20px JetBrains Mono, monospace";
    ctx.textAlign = "left";
    ctx.fillText("TRANSFORMER SELF-ATTENTION", 35, 60);

    ctx.fillStyle = "#64748b";
    ctx.font = "12px JetBrains Mono, monospace";
    ctx.fillText("ATTENTION IS ALL YOU NEED — VASWANI ET AL. (2017)", 35, 85);
    ctx.fillText("Core Engine of Modern Generative AI & LLMs", 35, 105);

    // Flowchart diagram blocks: Scale Dot-Product Attention
    ctx.strokeStyle = "rgba(0, 245, 212, 0.15)";
    ctx.lineWidth = 1.5;

    // Drawing blocks
    const drawBlock = (x, y, txt, col) => {
        ctx.fillStyle = "rgba(10, 15, 30, 0.85)";
        ctx.fillRect(x, y, 120, 36);
        ctx.strokeStyle = col;
        ctx.strokeRect(x, y, 120, 36);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 11px JetBrains Mono, monospace";
        ctx.textAlign = "center";
        ctx.fillText(txt, x + 60, y + 22);
    };

    // Draw the blocks symmetrically in the lower half
    const bx = w / 2 - 60;
    drawBlock(bx, 140, "Input (Q, K, V)", "rgba(56, 189, 248, 0.5)");

    // Connection lines
    ctx.strokeStyle = "rgba(0, 245, 212, 0.3)";
    ctx.beginPath();
    ctx.moveTo(bx + 60, 176); ctx.lineTo(bx + 60, 210);
    ctx.stroke();

    drawBlock(bx, 210, "MatMul (Q × Kᵀ)", "#ec4899");

    ctx.beginPath();
    ctx.moveTo(bx + 60, 246); ctx.lineTo(bx + 60, 280);
    ctx.stroke();

    drawBlock(bx, 280, "Scale (1 / √d_k)", "#38bdf8");

    ctx.beginPath();
    ctx.moveTo(bx + 60, 316); ctx.lineTo(bx + 60, 350);
    ctx.stroke();

    drawBlock(bx, 350, "Softmax", "#10b981");

    ctx.beginPath();
    ctx.moveTo(bx + 60, 386); ctx.lineTo(bx + 60, 420);
    ctx.stroke();

    drawBlock(bx, 420, "MatMul (× V)", "#f59e0b");

    // The legendary attention equation! Large and glowing!
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#f43f5e"; // Pink glow
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 21px Times New Roman, serif";
    ctx.textAlign = "center";
    ctx.fillText("Attention(Q, K, V) = Softmax( QKᵀ / √d_k ) V", w / 2, 520);
    ctx.shadowBlur = 0; // reset shadow

    ctx.fillStyle = "#f43f5e";
    ctx.font = "bold 21px Times New Roman, serif";
    ctx.fillText("Attention(Q, K, V) = Softmax( QKᵀ / √d_k ) V", w / 2, 520);

    // Explanations
    ctx.fillStyle = "#64748b";
    ctx.font = "11px JetBrains Mono, monospace";
    ctx.fillText("Q: Queries  |  K: Keys  |  V: Values  |  d_k: Dimension", w / 2, 565);
    ctx.fillText("Softmax probability distribution aligns context semantics", w / 2, 585);

    return new THREE.CanvasTexture(c);
}

function buildTransformerPosterOnWall() {
    const grp = new THREE.Group();

    // Wood frame
    const frame = mat.frameWood();
    grp.add(mk(new THREE.BoxGeometry(1.6, 2.0, 0.08), frame, [0, 0, 0]));

    // Inner poster
    const posterTex = makeTransformerPosterTexture();
    const posterMat = new THREE.MeshStandardMaterial({
        map: posterTex,
        roughness: 0.6,
    });
    grp.add(mk(new THREE.PlaneGeometry(1.48, 1.88), posterMat, [0, 0, 0.041]));

    return grp;
}

/* ============================================================
 *  ROOM
 * ============================================================ */
function buildRoom() {
    const room = new THREE.Group();
    // Floor (Restored back to Y = -0.5 for realistic legroom and spacious seated posture)
    room.add(
        mk(
            new THREE.PlaneGeometry(24, 24),
            mat.floor(),
            [0, -0.5, 0],
            [-Math.PI / 2, 0, 0],
        ),
    );
    // Back wall — now at +Z (behind character), normal facing -Z (toward camera)
    room.add(
        mk(
            new THREE.PlaneGeometry(24, 12),
            mat.wall(),
            [0, 4, 3.0],
            [0, Math.PI, 0],
        ),
    );
    // Left side wall — perpendicular to back wall, facing +X (toward the desk/camera)
    room.add(
        mk(
            new THREE.PlaneGeometry(16, 12),
            mat.wall(),
            [-4.8, 4, -1.0], // Meets back wall at Z = 3.0 and goes forward
            [0, Math.PI / 2, 0], // Rotated 90 degrees around Y so it is perpendicular!
        ),
    );
    // Subtle floor grid lines (Restored back to Y = -0.49)
    for (let i = -10; i <= 10; i += 2) {
        room.add(
            mk(
                new THREE.PlaneGeometry(0.015, 24),
                new THREE.MeshBasicMaterial({ color: "#d4ccba" }),
                [i, -0.49, 0],
                [-Math.PI / 2, 0, 0],
            ),
        );
    }
    return room;
}

/* ============================================================
 *  PARTICLES (subtle dark dots on cream bg)
 * ============================================================ */
function buildParticles(count = 70) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 14;
        positions[i * 3 + 1] = Math.random() * 6 - 0.5;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const m = new THREE.PointsMaterial({
        color: "#6f8400",
        size: 0.045,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.55,
    });
    return new THREE.Points(geom, m);
}

/* ============================================================
 *  LIGHTS
 * ============================================================ */
function buildLights() {
    const g = new THREE.Group();
    // Bright ambient for cream scene
    g.add(new THREE.AmbientLight("#ffffff", 0.85));
    const key = new THREE.DirectionalLight("#ffffff", 1.0);
    key.position.set(3, 5, 4);
    g.add(key);
    const fill = new THREE.DirectionalLight("#ffe9c4", 0.6);
    fill.position.set(-4, 3, 2);
    g.add(fill);
    const rim = new THREE.DirectionalLight("#C8EE00", 0.5);
    rim.position.set(-2, 2, -3);
    g.add(rim);
    // Monitor glow
    const monGlow = new THREE.PointLight("#C8EE00", 0.45, 4);
    monGlow.position.set(0, 2.0, -0.2);
    g.add(monGlow);
    return g;
}

/* ============================================================
 *  SCENE CONTENTS
 * ============================================================ */
function SceneContents() {
    const lights = useMemo(() => buildLights(), []);
    const room = useMemo(() => buildRoom(), []);
    const desk = useMemo(() => {
        const d = buildDesk();
        d.position.y = -0.08; // Lowered desk and all its child items by 0.05
        return d;
    }, []);
    const chair = useMemo(() => {
        const c = buildChair();
        c.position.set(0, -0.12, 1.18); // Raised slightly to Y=-0.12 to match the taller character seating height
        c.rotation.y = Math.PI; // Rotate 180° so the backrest sits behind the character, facing the desk
        return c;
    }, []);
    const character = useMemo(() => {
        const c = buildCharacter();
        c.scale.setScalar(0.85); // Scale down the entire character to make them 15% smaller and highly proportional!
        c.position.set(0.11, -0.02, 1.08); // Raised to Y=-0.02 to place the shoulders and elbows beautifully above the table top, ensuring forearms are clearly ON TOP of the table!
        c.rotation.y = Math.PI;
        return c;
    }, []);
    const duck = useMemo(() => {
        const d = buildRubberDuck();
        d.position.set(-0.36, 0.93, 0.54); // Lowered by 0.08 units to match desktop
        d.rotation.y = 0.6; // angled towards camera
        return d;
    }, []);
    const book = useMemo(() => {
        const b = buildCodeBook();
        // Moved further outwards to the right edge of the desk to make space for the FC Barcelona mousepad
        b.position.set(1.05, 0.93, 0.44); // Lowered by 0.08 units to match desktop
        b.rotation.y = -0.3; // slightly rotated
        return b;
    }, []);
    const laptop = useMemo(() => {
        const l = buildLaptop();
        l.position.set(-0.72, 0.93, 0.1); // Lowered by 0.08 units to match desktop
        l.rotation.y = 1.0; // angled towards the character so it faces them!
        return l;
    }, []);
    const photoFrame = useMemo(() => {
        const pf = buildPhotoFrame();
        // Placed in the corner between the laptop and the monitor stand base (as shown in the screenshot)
        pf.position.set(-0.65, 1.10, -0.33); // Lowered by 0.08 units
        pf.rotation.set(-0.16, 0.48, 0.07); // Tilted back slightly and rotated (positive Y) to face the character directly
        return pf;
    }, []);
    const ball = useMemo(() => {
        const b = buildSoccerBall();
        b.position.set(1.15, -0.18, 1.7); // Restored to -0.18 to rest on the floor (Y = -0.5)
        b.userData = {
            pos: new THREE.Vector3(1.15, -0.18, 1.7),
            vel: new THREE.Vector3(0, 0, 0),
            rot: new THREE.Vector3(0, 0, 0),
            rotVel: new THREE.Vector3(0, 0, 0),
        };
        return b;
    }, []);
    const rug = useMemo(() => buildSoccerRug(), []);
    const jersey = useMemo(() => {
        const j = buildJerseyOnWall();
        // Rotate 90 degrees around Y to fit flush against the perpendicular Left Wall (facing +X)
        j.rotation.y = Math.PI / 2;
        // Positioned on the left side wall, closer to the corner (Z=1.4)
        j.position.set(-4.75, 2.0, 1.4);
        return j;
    }, []);
    const pedriJersey = useMemo(() => {
        const j = buildPedriJerseyOnWall();
        // Rotate 90 degrees around Y to fit flush against the perpendicular Left Wall (facing +X)
        j.rotation.y = Math.PI / 2;
        // Positioned on the left side wall, closer to the front/camera (Z=-0.8)
        j.position.set(-4.75, 2.0, -0.8);
        return j;
    }, []);
    const apolloPoster = useMemo(() => {
        const p = buildApolloPosterOnWall();
        // Rotate 180 degrees to face the camera flatly on the back wall
        p.rotation.y = Math.PI;
        // Positioned on the LEFT side of the back wall (completely unblocked!)
        p.position.set(-2, 2.1, 2.9);
        return p;
    }, []);
    const transformerPoster = useMemo(() => {
        const p = buildTransformerPosterOnWall();
        // Rotate 180 degrees to face the camera flatly on the back wall
        p.rotation.y = Math.PI;
        // Positioned on the RIGHT side of the back wall
        p.position.set(1.0, 2.1, 2.9);
        return p;
    }, []);
    const particles = useMemo(() => buildParticles(70), []);

    useEffect(() => {
        return () => {
            const dispose = (o) =>
                o.traverse?.((c) => {
                    if (c.geometry) c.geometry.dispose();
                    if (c.material) {
                        if (Array.isArray(c.material))
                            c.material.forEach((m) => m.dispose && m.dispose());
                        else c.material.dispose && c.material.dispose();
                    }
                });
            [
                room,
                desk,
                chair,
                character,
                duck,
                book,
                laptop,
                photoFrame,
                ball,
                jersey,
                pedriJersey,
                apolloPoster,
                transformerPoster,
                particles,
                rug,
            ].forEach(dispose);
        };
    }, [
        room,
        desk,
        chair,
        character,
        duck,
        book,
        laptop,
        photoFrame,
        ball,
        jersey,
        pedriJersey,
        apolloPoster,
        transformerPoster,
        particles,
        rug,
    ]);

    useFrame((state, dt) => {
        const s = scrollStore.get();
        const t = state.clock.elapsedTime;

        // Camera — SAME angle throughout, just dolly back from close to wide.
        // Direction is fixed: from upper-right behind the monitor toward the
        // character at the desk. Only the distance changes per section.
        const lookAt = [0, 1.3, 1.0];
        const dir = [0.866, 0.157, -0.472]; // unit vector camera-from-lookAt
        const distances = [2.7, 5.0, 7.5, 10.5, 13.5, 16.5, 4.0];
        const idx = Math.max(0, Math.min(6, s.section));
        const next = Math.min(6, idx + 1);
        const ease = THREE.MathUtils.smoothstep(s.sectionProgress, 0, 1);
        const lerp = (a, b, x) => a + (b - a) * x;
        const dist = lerp(distances[idx], distances[next], ease);
        const tx = lookAt[0] + dir[0] * dist;
        const ty = lookAt[1] + dir[1] * dist;
        const tz = lookAt[2] + dir[2] * dist;

        state.camera.position.x = THREE.MathUtils.damp(
            state.camera.position.x,
            tx + s.mouseX * 0.25,
            15, // Increased from 3 for faster scroll response
            dt,
        );
        state.camera.position.y = THREE.MathUtils.damp(
            state.camera.position.y,
            ty + s.mouseY * 0.15,
            15, // Increased from 3 for faster scroll response
            dt,
        );
        state.camera.position.z = THREE.MathUtils.damp(
            state.camera.position.z,
            tz,
            15, // Increased from 3 for faster scroll response
            dt,
        );
        state.camera.lookAt(lookAt[0], lookAt[1], lookAt[2]);

        // ===== Eye/head tracking — head follows the mouse cursor =====
        // Character is rotated 180° in Y so its local -Z points toward camera.
        // mouseX > 0 means cursor on the right side of viewport.
        // We want the character to look TOWARD the cursor.
        const head = character.userData.head;
        if (head) {
            const targetY = s.mouseX * 0.45 + Math.sin(t * 0.6) * 0.03;
            const targetX = -s.mouseY * 0.3 + Math.sin(t * 0.9 + 0.2) * 0.02;
            head.rotation.y = THREE.MathUtils.damp(
                head.rotation.y,
                targetY,
                5,
                dt,
            );
            head.rotation.x = THREE.MathUtils.damp(
                head.rotation.x,
                targetX,
                5,
                dt,
            );

            // Dynamically update the pupils/irises so they look at the mouse cursor
            if (head.userData.updateFace) {
                if (head.userData.lookX === undefined) {
                    head.userData.lookX = 0;
                    head.userData.lookY = 0;
                }
                head.userData.lookX = THREE.MathUtils.damp(head.userData.lookX, s.mouseX, 8, dt);
                head.userData.lookY = THREE.MathUtils.damp(head.userData.lookY, s.mouseY, 8, dt);
                head.userData.updateFace(head.userData.lookX, head.userData.lookY);
            }

            character.position.y =
                -0.02 + Math.sin(t * 1.4) * 0.01; // Animated around -0.02 Y to keep shoulders elevated and elbows beautifully above table top
        }

        // Typing animation — only animate the hands/wrists, keeping forearms resting and static
        const isTyping = s.section >= 1 && s.section <= 4;
        const lh = character.userData.leftHand;
        const rh = character.userData.rightHand;
        if (lh && rh) {
            const typeAmp = isTyping ? 0.035 : 0.008; // Delicate, premium wrist typing oscillation
            lh.position.y = -0.36 + Math.sin(t * 16) * typeAmp; // Adjusted to match flat forearm resting posture Y = -0.36
            rh.position.y = -0.36 + Math.sin(t * 16 + 1.2) * typeAmp; // Adjusted to match flat forearm resting posture Y = -0.36
        }

        // Progressive typing on laptop screen as user scrolls down!
        if (laptop && laptop.userData.updateScreen) {
            // We want lines to appear faster as user scrolls. 
            // Total lines = 31. We start at 2.
            const totalProgress = Math.min(1.2, s.section + s.sectionProgress) / 1.2; // reaches 100% by section 1.2 (extremely fast typing speed!)
            const targetLines = 2 + Math.min(29, Math.floor(totalProgress * 30));

            if (laptop.userData.currentScrollY === undefined) {
                laptop.userData.currentScrollY = 0;
            }
            const cursorY = 72 + (targetLines - 1) * 18;
            const desiredScrollY = Math.max(0, cursorY - 260);

            laptop.userData.currentScrollY = THREE.MathUtils.damp(
                laptop.userData.currentScrollY,
                desiredScrollY,
                5,
                dt
            );

            if (laptop.userData.currentLines !== targetLines || Math.abs(laptop.userData.currentScrollY - desiredScrollY) > 0.5) {
                laptop.userData.currentLines = targetLines;
                laptop.userData.updateScreen(targetLines, laptop.userData.currentScrollY);
            }
        }

        // Particles
        particles.rotation.y += dt * 0.02;
        particles.rotation.x = s.mouseY * 0.06;

        // ===== Ball Physics Simulation (Interactive & Kickable!) =====
        const ballGroup = ball.getObjectByName("ballGroup");
        const shadowMesh = ball.getObjectByName("shadowMesh");

        if (ballGroup) {
            const pState = ball.userData;
            if (!pState.vel) {
                // Initialize if not present
                pState.pos = new THREE.Vector3(1.15, -0.18, 1.7);
                pState.vel = new THREE.Vector3(0, 0, 0);
                pState.rot = new THREE.Vector3(0, 0, 0);
                pState.rotVel = new THREE.Vector3(0, 0, 0);
            }

            // Limit dt to prevent giant physics jumps on lag spikes
            const dTime = Math.min(0.03, dt);

            const speed = pState.vel.length();
            const rotSpeed = pState.rotVel.length();

            // 1. Idle state behavior
            if (speed < 0.01 && rotSpeed < 0.01 && pState.pos.y <= -0.179) {
                pState.pos.y = -0.18 + Math.sin(t * 1.2) * 0.008; // gentle float
                pState.pos.x = THREE.MathUtils.damp(pState.pos.x, 1.15, 1.5, dTime); // slide back home
                pState.pos.z = THREE.MathUtils.damp(pState.pos.z, 1.7, 1.5, dTime);

                ballGroup.position.y = pState.pos.y - (-0.18);
                ballGroup.rotation.y += dTime * 0.25;
                ballGroup.rotation.x = THREE.MathUtils.damp(ballGroup.rotation.x, 0, 2, dTime);
                ballGroup.rotation.z = THREE.MathUtils.damp(ballGroup.rotation.z, 0, 2, dTime);

                ball.position.x = pState.pos.x;
                ball.position.z = pState.pos.z;

                if (shadowMesh) {
                    const heightFactor = (pState.pos.y + 0.18) / 0.016;
                    shadowMesh.scale.setScalar(0.9 + heightFactor * 0.15);
                    shadowMesh.material.opacity = 0.85 - heightFactor * 0.2;
                }
            } else {
                // 2. ACTIVE PHYSICS
                // Gravity
                pState.vel.y -= 9.2 * dTime;

                // Position update
                pState.pos.addScaledVector(pState.vel, dTime);

                // Air resistance damping
                pState.vel.x *= Math.exp(-0.45 * dTime);
                pState.vel.y *= Math.exp(-0.15 * dTime);
                pState.vel.z *= Math.exp(-0.45 * dTime);
                pState.rotVel.multiplyScalar(Math.exp(-0.6 * dTime));

                // Floor Collision
                if (pState.pos.y <= -0.18) {
                    pState.pos.y = -0.18;
                    pState.vel.y = -pState.vel.y * 0.65; // bounce rebound factor

                    // Transfer rotation spin to linear roll velocity
                    pState.vel.x += pState.rotVel.z * 0.06;
                    pState.vel.z -= pState.rotVel.x * 0.06;

                    // Ground friction damping on rotation
                    pState.rotVel.multiplyScalar(0.72);
                }

                // Wall boundaries
                if (pState.pos.x <= -4.8 + 0.32) { // Left Wall
                    pState.pos.x = -4.8 + 0.32;
                    pState.vel.x = -pState.vel.x * 0.6;
                    pState.rotVel.z = -pState.rotVel.z * 0.6;
                }
                if (pState.pos.x >= 4.8 - 0.32) { // Right invisible bound
                    pState.pos.x = 4.8 - 0.32;
                    pState.vel.x = -pState.vel.x * 0.6;
                    pState.rotVel.z = -pState.rotVel.z * 0.6;
                }
                if (pState.pos.z >= 3.0 - 0.32) { // Back Wall
                    pState.pos.z = 3.0 - 0.32;
                    pState.vel.z = -pState.vel.z * 0.6;
                    pState.rotVel.x = -pState.rotVel.x * 0.6;
                }
                if (pState.pos.z <= -1.5) { // Front bound
                    pState.pos.z = -1.5;
                    pState.vel.z = -pState.vel.z * 0.6;
                    pState.rotVel.x = -pState.rotVel.x * 0.6;
                }

                // Desk leg cylinder collisions (4 legs of radius 0.05)
                const legs = [
                    { x: -1.5, z: 0.55 },
                    { x: 1.5, z: 0.55 },
                    { x: -1.5, z: -0.55 },
                    { x: 1.5, z: -0.55 },
                ];
                legs.forEach((leg) => {
                    const dx = pState.pos.x - leg.x;
                    const dz = pState.pos.z - leg.z;
                    const distXZ = Math.sqrt(dx * dx + dz * dz);
                    const minDist = 0.05 + 0.32;
                    if (distXZ < minDist && pState.pos.y < 1.05) {
                        const nx = dx / distXZ;
                        const nz = dz / distXZ;
                        pState.pos.x = leg.x + nx * minDist;
                        pState.pos.z = leg.z + nz * minDist;

                        const dotProd = pState.vel.x * nx + pState.vel.z * nz;
                        pState.vel.x = (pState.vel.x - 2 * dotProd * nx) * 0.72;
                        pState.vel.z = (pState.vel.z - 2 * dotProd * nz) * 0.72;

                        pState.rotVel.y += (Math.random() - 0.5) * 8; // spin leg impact
                    }
                });

                // Desk top solid box collision
                const ballRadius = 0.32;
                if (pState.pos.x > -1.6 - ballRadius && pState.pos.x < 1.6 + ballRadius &&
                    pState.pos.z > -0.7 - ballRadius && pState.pos.z < 0.7 + ballRadius &&
                    pState.pos.y > 0.92 - ballRadius && pState.pos.y < 1.08 + ballRadius) {

                    const fromBottom = pState.pos.y < 0.96;
                    const fromTop = pState.pos.y > 1.04;

                    if (fromBottom) {
                        pState.pos.y = 0.92 - ballRadius;
                        pState.vel.y = -Math.abs(pState.vel.y) * 0.65;
                    } else if (fromTop) {
                        pState.pos.y = 1.08 + ballRadius;
                        pState.vel.y = Math.abs(pState.vel.y) * 0.65;
                    } else {
                        if (Math.abs(pState.pos.x) > 1.5) {
                            pState.pos.x = Math.sign(pState.pos.x) * (1.6 + ballRadius);
                            pState.vel.x = -pState.vel.x * 0.65;
                        } else {
                            pState.pos.z = Math.sign(pState.pos.z) * (0.7 + ballRadius);
                            pState.vel.z = -pState.vel.z * 0.65;
                        }
                    }
                }

                // Synchronize Three.js Group
                ballGroup.position.y = pState.pos.y - (-0.18);
                ballGroup.rotation.x += pState.rotVel.x * dTime;
                ballGroup.rotation.y += pState.rotVel.y * dTime;
                ballGroup.rotation.z += pState.rotVel.z * dTime;

                ball.position.x = pState.pos.x;
                ball.position.z = pState.pos.z;

                if (shadowMesh) {
                    const height = pState.pos.y - (-0.18);
                    const heightFactor = Math.min(1.0, height / 2.0);
                    shadowMesh.scale.setScalar(0.9 + heightFactor * 0.7);
                    shadowMesh.material.opacity = Math.max(0.0, 0.85 - heightFactor * 0.75);
                }
            }
        }
    });

    // Allow interactive R3F raycasting with Pointer events to trigger kicks
    const ballElement = React.createElement("primitive", {
        object: ball,
        onClick: (e) => {
            e.stopPropagation();
            const pState = ball.userData;
            if (pState) {
                // Impose realistic high-velocity 3D kick trajectory
                pState.vel.x = (Math.random() - 0.5) * 5.8;  // horizontal launch
                pState.vel.y = 4.2 + Math.random() * 2.8;     // upward vertical bounce
                pState.vel.z = -3.0 - Math.random() * 3.8;   // shoot backward towards wall

                // Inflict spin
                pState.rotVel.x = (Math.random() - 0.5) * 16;
                pState.rotVel.y = (Math.random() - 0.5) * 22;
                pState.rotVel.z = (Math.random() - 0.5) * 16;
            }
        },
        onPointerOver: (e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
        },
        onPointerOut: (e) => {
            e.stopPropagation();
            document.body.style.cursor = "auto";
        }
    });

    return React.createElement(
        React.Fragment,
        null,
        React.createElement("primitive", { object: lights }),
        React.createElement("primitive", { object: room }),
        React.createElement("primitive", { object: jersey }),
        React.createElement("primitive", { object: pedriJersey }),
        React.createElement("primitive", { object: apolloPoster }),
        React.createElement("primitive", { object: transformerPoster }),
        React.createElement("primitive", { object: desk }),
        React.createElement("primitive", { object: duck }),
        React.createElement("primitive", { object: book }),
        React.createElement("primitive", { object: laptop }),
        React.createElement("primitive", { object: photoFrame }),
        React.createElement("primitive", { object: chair }),
        React.createElement("primitive", { object: character }),
        React.createElement("primitive", { object: rug }),
        ballElement,
        React.createElement("primitive", { object: particles }),
    );
}

export default function Scene3D() {
    return (
        <div
            className="pointer-events-none fixed inset-0 z-0"
            data-testid="three-canvas-container"
        >
            <Canvas
                style={{ pointerEvents: "auto" }}
                camera={{ position: [2.34, 1.72, -0.27], fov: 35 }}
                dpr={[1, 1.2]}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                onCreated={({ scene }) => {
                    scene.background = new THREE.Color("#f3eee3");
                    scene.fog = new THREE.Fog("#f3eee3", 6, 18);
                }}
            >
                <SceneContents />
            </Canvas>
        </div>
    );
}
