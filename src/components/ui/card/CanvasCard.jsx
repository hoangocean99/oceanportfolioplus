import React, { useEffect, useRef } from "react";
import { idCardData } from "../../../data/portfolioData";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import './CanvasCard.css'

export default function CanvasCard({ mode, imageUrl = (mode === "dark") ? '/ImageCardDark.jpg' : '/ImageCardLight.jpg', cardSize = { w: 2.4, h: 3.2, t: 0.10 }, strapLength = -2 }) {
  const mountRef = useRef(null);
  const rafRef = useRef(0);
  const { w, h, t } = cardSize;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, isMobile ? 15 : 10); // Move camera back on mobile

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 2);
    dir.position.set(5, 6, 8);
    scene.add(dir);

    // Card
    const cardScale = isMobile ? 0.75 : 1;
    const geo = new RoundedBoxGeometry(w * cardScale, h * cardScale, t * cardScale, 8, 0.18 * cardScale);

    // Textures
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Procedural Back Texture
    function makeBackTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 768;
      const ctx = canvas.getContext('2d');

      const isDark = mode === 'dark';
      // Background
      ctx.fillStyle = isDark ? '#1a1a1a' : '#f8f9fa';
      ctx.fillRect(0, 0, 512, 768);

      // Magnetic Stripe
      ctx.fillStyle = '#111111';
      ctx.fillRect(0, 50, 512, 90);

      // Security Chip (Gold)
      const gradChip = ctx.createLinearGradient(40, 160, 120, 240);
      gradChip.addColorStop(0, '#ffd700');
      gradChip.addColorStop(0.5, '#fff4b0');
      gradChip.addColorStop(1, '#ccac00');
      ctx.fillStyle = gradChip;
      ctx.roundRect(40, 160, 80, 60, 10);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(40 + i * 20, 160); ctx.lineTo(40 + i * 20, 220); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(40, 160 + i * 15); ctx.lineTo(120, 160 + i * 15); ctx.stroke();
      }

      // Barcode
      ctx.fillStyle = isDark ? '#ffffff' : '#000000';
      for (let i = 0; i < 40; i++) {
        const bw = Math.random() * 6 + 2;
        ctx.fillRect(60 + i * 10, 640, bw, 60);
      }
      ctx.font = '12px Courier New';
      ctx.textAlign = 'center';
      ctx.fillText(idCardData.barcode, 256, 720);

      // QR Code
      ctx.fillStyle = isDark ? '#333333' : '#e9ecef';
      ctx.fillRect(360, 160, 100, 100);
      ctx.fillStyle = isDark ? '#ffffff' : '#000000';
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (Math.random() > 0.4) ctx.fillRect(360 + i * 10, 160 + j * 10, 10, 10);
        }
      }

      // Information Text - Personalized from portfolioData
      ctx.textAlign = 'left';
      ctx.fillStyle = isDark ? '#c8ee00' : '#00add8';
      ctx.font = 'bold 20px Arial';
      ctx.fillText("EMPLOYEE PROFILE", 40, 300);

      ctx.fillStyle = isDark ? '#ffffff' : '#333333';
      ctx.font = 'bold 14px Arial';
      ctx.fillText("NAME:", 40, 335);
      ctx.fillText("ROLE:", 40, 360);
      ctx.fillText("DEPT:", 40, 385);
      ctx.fillText("SKILLS:", 40, 410);

      ctx.font = '14px Arial';
      ctx.fillStyle = isDark ? '#aaaaaa' : '#666666';
      ctx.fillText(idCardData.name, 110, 335);
      ctx.fillText(idCardData.role, 110, 360);
      ctx.fillText(idCardData.dept, 110, 385);
      ctx.fillText(idCardData.skills, 110, 410);

      ctx.font = '12px Arial';
      ctx.fillStyle = isDark ? '#888888' : '#999999';
      const socialLines = [
        "",
        `GITHUB: ${idCardData.socials.github}`,
        `EMAIL: ${idCardData.socials.email}`,
        `WEBSITE: ${idCardData.socials.website}`
      ];
      socialLines.forEach((line, i) => {
        ctx.fillText(line, 40, 430 + i * 20);
      });

      // Holographic Seal
      const holo = ctx.createRadialGradient(400, 480, 5, 400, 480, 50);
      holo.addColorStop(0, 'rgba(200, 238, 0, 0.4)');
      holo.addColorStop(0.5, 'rgba(0, 255, 255, 0.2)');
      holo.addColorStop(1, 'rgba(255, 0, 255, 0.1)');
      ctx.fillStyle = holo;
      ctx.beginPath();
      ctx.arc(400, 480, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.stroke();

      const backTex = new THREE.CanvasTexture(canvas);
      backTex.colorSpace = THREE.SRGBColorSpace;
      return backTex;
    }

    const backTex = makeBackTexture();
    const matSide = new THREE.MeshStandardMaterial({ color: mode === 'dark' ? 0x111111 : 0xdddddd, roughness: 0.5 });
    const matFront = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.1 });
    const matBack = new THREE.MeshStandardMaterial({ map: backTex, roughness: 0.1 });

    const card = new THREE.Mesh(geo, [matSide, matSide, matSide, matSide, matFront, matBack]);

    // Hook + Ring (Scaled)
    const hookGeo = new THREE.TorusGeometry(0.2 * cardScale, 0.05 * cardScale, 12, 32, Math.PI);
    const hookMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.4 });
    const hook = new THREE.Mesh(hookGeo, hookMat);
    hook.rotation.x = Math.PI;

    const ringGeo = new THREE.TorusGeometry(0.15 * cardScale, 0.04 * cardScale, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.6, roughness: 0.4 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;

    // Anchors (Scaled)
    const anchorLeft = new THREE.Mesh(new THREE.SphereGeometry(0.05 * cardScale, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    anchorLeft.position.set(-0.6 * cardScale, 3.5, 0);
    anchorLeft.visible = false;
    scene.add(anchorLeft);

    const anchorRight = new THREE.Mesh(new THREE.SphereGeometry(0.05 * cardScale, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    anchorRight.position.set(0.6 * cardScale, 3.5, 0);
    anchorRight.visible = false;
    scene.add(anchorRight);

    // Swing Group
    const swingGroup = new THREE.Group();
    swingGroup.add(card);
    swingGroup.add(ring);
    swingGroup.add(hook);
    card.position.y = -(h * cardScale / 2 + 0.1 * cardScale + strapLength) - 0.05 * cardScale;
    ring.position.y = -strapLength - 0.11 * cardScale;
    hook.position.y = -strapLength + 0.19 * cardScale;
    scene.add(swingGroup);

    // Straps (Scaled width)
    const strapMat = new LineMaterial({ color: 0x1a2a1a, linewidth: 40 * cardScale });
    strapMat.resolution.set(width, height);

    const strapLeft = new Line2(new LineGeometry(), strapMat);
    const strapRight = new Line2(new LineGeometry(), strapMat);
    scene.add(strapLeft);
    scene.add(strapRight);

    // Physics - Lightweight ID badge (snappy but floats more)
    let isDragging = false;
    let wasPinned = true;
    let last = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0, tiltX: 0, tiltZ: 0 };
    const stiffness = 70;      // Lower stiffness for a more "loose" lanyard
    const damping = 2.5;       // Low damping so it swings freely (nảy)
    const gravity = 6;         // Low gravity for lightweight plastic feel
    const sensitivity = 0.01;  // High sensitivity to mouse movement
    const tiltThreshold = 2;   // Reacts to almost any movement

    function onPointerDown(e) {
      isDragging = true;
      const rect = renderer.domElement.getBoundingClientRect();
      last.x = e.clientX - rect.left;
      last.y = e.clientY - rect.top;
      renderer.domElement.setPointerCapture(e.pointerId || 1);
    }
    function onPointerUp() {
      isDragging = false;
    }
    function onPointerMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (isDragging) {
        const dx = x - last.x;
        const dy = y - last.y;

        swingGroup.position.x += dx * 0.01;
        swingGroup.position.y -= dy * 0.01;

        velocity.x = dx * 0.05;
        velocity.y = -dy * 0.05;

        if (Math.abs(dy) > tiltThreshold) {
          swingGroup.rotation.x += dy * sensitivity;
          velocity.tiltX = dy * sensitivity * 10;
        }
        if (Math.abs(dx) > tiltThreshold) {
          swingGroup.rotation.z += dx * sensitivity;
          velocity.tiltZ = dx * sensitivity * 10;
        }
      }
      last.x = x;
      last.y = y;
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerUp);
    renderer.domElement.addEventListener("pointermove", onPointerMove);

    // Animate
    const clock = new THREE.Clock();
    function animate() {
      const dt = Math.min(clock.getDelta(), 0.033);
      const rect = mount.getBoundingClientRect();
      const isPinned = rect.top > window.innerHeight * 0.20;

      if (!isDragging) {
        if (isPinned) {
          swingGroup.position.y += (-3.0 - swingGroup.position.y) * 0.08;
          swingGroup.rotation.z = Math.sin(clock.getElapsedTime() * 2) * 0.04;
          velocity.y = 0;
          wasPinned = true;
        } else {
          if (wasPinned) {
            velocity.y = 18;
            wasPinned = false;
          }
          const ax = -stiffness * swingGroup.position.x - damping * velocity.x;
          const ay = -stiffness * swingGroup.position.y - damping * velocity.y - gravity;
          velocity.x += ax * dt;
          velocity.y += ay * dt;
          swingGroup.position.x += velocity.x * dt;
          swingGroup.position.y += velocity.y * dt;

          const atx = -stiffness * swingGroup.rotation.x - damping * velocity.tiltX;
          velocity.tiltX += atx * dt;
          swingGroup.rotation.x += velocity.tiltX * dt;

          const atz = -stiffness * swingGroup.rotation.z - damping * velocity.tiltZ;
          velocity.tiltZ += atz * dt;
          swingGroup.rotation.z += velocity.tiltZ * dt;
        }
      }

      // Update straps
      const hookPos = hook.getWorldPosition(new THREE.Vector3());
      const leftPos = anchorLeft.getWorldPosition(new THREE.Vector3());
      const rightPos = anchorRight.getWorldPosition(new THREE.Vector3());

      function updateStrap(line, start, end, offsetX) {
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mid.y -= 0.3 * cardScale;
        mid.x += offsetX;
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const pts = curve.getPoints(20);
        const flat = pts.flatMap((p) => [p.x, p.y, p.z]);
        line.geometry.setPositions(flat);
        line.geometry.attributes.position.needsUpdate = true;
      }

      updateStrap(strapLeft, leftPos, hookPos.clone().add(new THREE.Vector3(-0.15 * cardScale, 0, 0)), -0.05 * cardScale);
      updateStrap(strapRight, rightPos, hookPos.clone().add(new THREE.Vector3(0.15 * cardScale, 0, 0)), 0.05 * cardScale);

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    }
    animate();

    // Handle resize
    function onResize() {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      strapMat.resolution.set(w, h);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointerleave", onPointerUp);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [mode, imageUrl, w, h, t, strapLength]);
  return (
    <div ref={mountRef} className="w-full h-full w-100 h-100 d-flex justify-content-center align-items-center contain-card"></div>
  );
}
