"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function SchoolObjects() {
  const group = useRef<THREE.Group>(null);
  const book = useRef<THREE.Group>(null);
  const pencil = useRef<THREE.Group>(null);
  const apple = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#main-scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });

      tl.to(group.current!.rotation, { y: Math.PI * 1.5, x: Math.PI / 4, ease: "none" }, 0);
      
      tl.to(book.current!.position, { x: 3, y: -2, z: -2, ease: "power1.inOut" }, 0);
      tl.to(book.current!.rotation, { x: Math.PI, y: Math.PI, ease: "power1.inOut" }, 0);
      
      tl.to(pencil.current!.position, { x: -3, y: 2, z: 2, ease: "power1.inOut" }, 0);
      tl.to(pencil.current!.rotation, { z: Math.PI / 2, ease: "power1.inOut" }, 0);
      
      tl.to(apple.current!.scale, { x: 1.5, y: 1.5, z: 1.5, ease: "power2.inOut" }, 0);
      tl.to(apple.current!.position, { y: 2, ease: "power2.inOut" }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <group ref={group}>
      {/* Book */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={book} position={[-2, 1, -1]} rotation={[0.2, -0.4, 0]}>
          <mesh>
            <boxGeometry args={[2, 0.4, 1.5]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
             <boxGeometry args={[1.95, 0.35, 1.45]} />
             <meshStandardMaterial color="#f8fafc" />
          </mesh>
        </group>
      </Float>

      {/* Pencil */}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <group ref={pencil} position={[2, -1, 1]} rotation={[0, 0, Math.PI / 4]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 2, 16]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.1, 0.4, 16]} />
            <meshStandardMaterial color="#d4d4d8" />
          </mesh>
          <mesh position={[0, -1.35, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.03, 0.1, 16]} />
            <meshStandardMaterial color="#18181b" />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
            <meshStandardMaterial color="#fca5a5" />
          </mesh>
          <mesh position={[0, 1.0, 0]}>
             <cylinderGeometry args={[0.11, 0.11, 0.1, 16]} />
             <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </group>
      </Float>

      {/* Apple */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={apple} position={[0, 0.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial color="#ef4444" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#4ade80" />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-50 w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <spotLight position={[-10, -10, -5]} intensity={0.5} color="#fbbf24" />
        
        <SchoolObjects />
        
        <Environment preset="apartment" />
        <ContactShadows position={[0, -3, 0]} opacity={0.3} scale={20} blur={2} far={4.5} color="#1e293b" />
      </Canvas>
    </div>
  );
}
