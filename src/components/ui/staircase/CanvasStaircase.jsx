import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export default function CanvasStaircase({ activeIndex, onSelectIndex, cardRefs, mode = "dark" }) {
    const mountRef = useRef(null);
    const activeRef = useRef(activeIndex);

    useEffect(() => {
        activeRef.current = activeIndex;
    }, [activeIndex]);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const width = mount.clientWidth;
        const height = mount.clientHeight;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 1, 12);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height);
        mount.appendChild(renderer.domElement);

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, mode === "dark" ? 0.8 : 1.5);
        scene.add(ambient);

        const dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);

        const pointLight = new THREE.PointLight(0x00ff66, 2, 10);
        pointLight.position.set(0, 2, 2);
        scene.add(pointLight);

        // Staircase coordinates
        // 4 steps rising from bottom-left to top-right across full viewport
        const stepsData = [
            { pos: new THREE.Vector3(-4.2, -2.8, 2.0), size: [2.8, 0.3, 2.5] },
            { pos: new THREE.Vector3(-1.4, -1.4, 1.2), size: [2.8, 0.3, 2.5] },
            { pos: new THREE.Vector3(1.4, 0.0, 0.4), size: [2.8, 0.3, 2.5] },
            { pos: new THREE.Vector3(4.2, 1.4, -0.4), size: [2.8, 0.3, 2.5] },
        ];

        const stepMeshes = [];
        const pillarMeshes = [];
        const group = new THREE.Group();
        scene.add(group);

        const normalMat = new THREE.MeshStandardMaterial({
            color: mode === "dark" ? 0x22252a : 0xe0e5ec,
            metalness: 0.8,
            roughness: 0.2,
        });

        const activeMat = new THREE.MeshStandardMaterial({
            color: 0x00ff66,
            metalness: 0.3,
            roughness: 0.1,
            emissive: 0x00ff66,
            emissiveIntensity: 0.4,
        });

        stepsData.forEach((data, i) => {
            // Platform
            const geo = new RoundedBoxGeometry(data.size[0], data.size[1], data.size[2], 5, 0.08);
            const mesh = new THREE.Mesh(geo, normalMat.clone());
            mesh.position.copy(data.pos);
            mesh.userData = { index: i, basePos: data.pos.clone() };
            group.add(mesh);
            stepMeshes.push(mesh);

            // Energy Pillar underneath
            const pillarGeo = new THREE.CylinderGeometry(0.8, 0.1, 6, 16);
            const pillarMat = new THREE.MeshBasicMaterial({
                color: 0x00ff66,
                transparent: true,
                opacity: 0.1,
                wireframe: true,
            });
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.set(data.pos.x, data.pos.y - 3.15, data.pos.z);
            group.add(pillar);
            pillarMeshes.push(pillar);
        });

        // Floating cyber particles
        const particleCount = 150;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            pPos[i] = (Math.random() - 0.5) * 15;
        }
        pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0x00ff66,
            size: 0.08,
            transparent: true,
            opacity: 0.6,
        });
        const particles = new THREE.Points(pGeo, pMat);
        group.add(particles);

        // Raycasting for interactive mouse click/hover
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(-100, -100);

        function onPointerMove(e) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        }

        function onPointerDown() {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(stepMeshes);
            if (intersects.length > 0) {
                const idx = intersects[0].object.userData.index;
                if (onSelectIndex) onSelectIndex(idx);
            }
        }

        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("pointerdown", onPointerDown);

        // Animation Loop
        const clock = new THREE.Clock();
        let rafId;

        function animate() {
            const t = clock.getElapsedTime();

            // Orbit group slightly based on mouse
            const targetRotY = mouse.x * 0.15;
            const targetRotX = -mouse.y * 0.15;
            group.rotation.y += (targetRotY - group.rotation.y) * 0.05;
            group.rotation.x += (targetRotX - group.rotation.x) * 0.05;

            // Animate particles
            const positions = pGeo.attributes.position.array;
            for (let i = 1; i < particleCount * 3; i += 3) {
                positions[i] += 0.02;
                if (positions[i] > 7) positions[i] = -7;
            }
            pGeo.attributes.position.needsUpdate = true;

            // Animate steps & project coordinates
            stepMeshes.forEach((mesh, i) => {
                const isAct = i === activeRef.current;

                // Target material
                const targetMat = isAct ? activeMat : normalMat;
                mesh.material.color.lerp(targetMat.color, 0.1);
                if (mesh.material.emissive) {
                    mesh.material.emissive.lerp(targetMat.emissive, 0.1);
                }

                // Elevation & floating sine wave
                const base = mesh.userData.basePos;
                const targetY = base.y + (isAct ? 0.4 : 0) + Math.sin(t * 2 + i) * 0.12;
                mesh.position.y += (targetY - mesh.position.y) * 0.1;

                // Adjust pillar visibility/opacity
                pillarMeshes[i].position.y = mesh.position.y - 3.15;
                pillarMeshes[i].material.opacity = THREE.MathUtils.lerp(
                    pillarMeshes[i].material.opacity,
                    isAct ? 0.4 : 0.05,
                    0.1
                );

                // Project 3D position to 2D screen for HUD cards
                const worldPos = new THREE.Vector3();
                mesh.getWorldPosition(worldPos);
                worldPos.y += 0.8; // Float HUD card elegantly above step
                worldPos.project(camera);

                const x = (worldPos.x * 0.5 + 0.5) * mount.clientWidth;
                const y = (-(worldPos.y * 0.5) + 0.5) * mount.clientHeight;

                if (cardRefs && cardRefs.current && cardRefs.current[i]) {
                    cardRefs.current[i].style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
                }
            });

            renderer.render(scene, camera);
            rafId = requestAnimationFrame(animate);
        }
        animate();

        // Resize
        function onResize() {
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        }
        window.addEventListener("resize", onResize);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("resize", onResize);
            renderer.domElement.removeEventListener("pointermove", onPointerMove);
            renderer.domElement.removeEventListener("pointerdown", onPointerDown);
            mount.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, [mode, onSelectIndex, cardRefs]);

    return (
        <div ref={mountRef} className="w-full h-full cursor-pointer"></div>
    );
}
