"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Box, Sphere, Cone, Center, Environment } from "@react-three/drei";
import * as THREE from "three";

function GeometricObjects() {
  const group = useRef<THREE.Group>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useFrame((state) => {
    if (!reducedMotion && group.current) {
      // Subtle rotation for the whole group
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
      
      // Parallax effect based on mouse
      const x = (state.pointer.x * Math.PI) / 10;
      const y = (state.pointer.y * Math.PI) / 10;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y, 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x, 0.05);
    }
  });

  const floatSpeed = reducedMotion ? 0 : 2;
  const floatRotation = reducedMotion ? 0 : 0.5;

  const particles = React.useMemo(() => {
    return [...Array(5)].map(() => ({
      position: [
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2
      ] as [number, number, number],
      color: Math.random() > 0.5 ? "#5B5FEF" : "#55C2A5"
    }));
  }, []);

  return (
    <group ref={group}>
      <Center>
        {/* Central Object - Book/Calendar representation */}
        <Float speed={floatSpeed} rotationIntensity={floatRotation} floatIntensity={1}>
          <Box args={[1.5, 2, 0.2]} position={[0, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#5B5FEF" roughness={0.2} metalness={0.1} />
          </Box>
          <Box args={[1.4, 1.9, 0.22]} position={[0.1, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </Box>
        </Float>

        {/* Secondary Object 1 - Sphere (Focus/Globe) */}
        <Float speed={floatSpeed * 1.5} rotationIntensity={floatRotation * 2} floatIntensity={1.5}>
          <Sphere args={[0.4, 32, 32]} position={[-1.5, 1, 0.5]} castShadow receiveShadow>
            <meshStandardMaterial color="#55C2A5" roughness={0.3} metalness={0.2} />
          </Sphere>
        </Float>

        {/* Secondary Object 2 - Cone (Pencil/Growth) */}
        <Float speed={floatSpeed * 1.2} rotationIntensity={floatRotation * 1.5} floatIntensity={1.2}>
          <Cone args={[0.3, 1, 32]} position={[1.5, -1, 0.2]} rotation={[Math.PI / 4, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#7C83FD" roughness={0.4} metalness={0.1} />
          </Cone>
        </Float>
        
        {/* Small floating particles */}
        {particles.map((p, i) => (
          <Float key={i} speed={floatSpeed * (1 + i * 0.2)} rotationIntensity={0} floatIntensity={2}>
            <Box args={[0.1, 0.1, 0.1]} position={p.position} castShadow receiveShadow>
              <meshStandardMaterial color={p.color} transparent opacity={0.6} />
            </Box>
          </Float>
        ))}
      </Center>
    </group>
  );
}

export default function LearningScene() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#5B5FEF" />
        
        <GeometricObjects />
        
        <Environment preset="city" background={false} />
      </Canvas>
    </div>
  );
}
