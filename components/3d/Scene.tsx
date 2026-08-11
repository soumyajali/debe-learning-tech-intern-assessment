"use client";

import { Float, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface SceneProps {
  modalOpen: boolean;
}

export default function Scene({ modalOpen }: SceneProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.35, 7], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        fallback={<div aria-hidden="true" />}
      >
        <Classroom modalOpen={modalOpen} />
      </Canvas>
    </div>
  );
}

function Classroom({ modalOpen }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const clockHand = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const eased = 1 - Math.exp(-delta * 3.5);
    const targetY = modalOpen ? -0.55 : 0;
    const targetRotation = modalOpen ? -0.24 : 0.1;

    if (group.current) {
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, eased);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation, eased);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, modalOpen ? 0.08 : 0, eased);
    }
    if (clockHand.current) {
      clockHand.current.rotation.z = state.clock.elapsedTime * 0.45;
    }
  });

  return (
    <>
      <color attach="background" args={["#07131f"]} />
      <fog attach="fog" args={["#07131f", 8, 17]} />
      <ambientLight intensity={0.7} color="#b9e7ff" />
      <pointLight position={[-4, 4, 4]} intensity={45} color="#31c6ff" distance={10} />
      <pointLight position={[4, 1, 3]} intensity={28} color="#a78bfa" distance={9} />
      <Sparkles count={70} scale={[12, 7, 5]} size={2} speed={0.25} color="#b8efff" />

      <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.7}>
        <group ref={group} position={[1.85, -0.15, 0]} rotation={[0, 0.1, 0]}>
          <group rotation={[0.15, -0.55, 0.08]}>
            <mesh castShadow>
              <boxGeometry args={[2.4, 0.2, 1.65]} />
              <meshStandardMaterial color="#3b82f6" roughness={0.35} metalness={0.25} />
            </mesh>
            <mesh position={[0, 0.16, 0]} castShadow>
              <boxGeometry args={[2.25, 0.16, 1.5]} />
              <meshStandardMaterial color="#dbeafe" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[1.5, 0.12, 0.98]} />
              <meshStandardMaterial color="#fbbf24" roughness={0.42} />
            </mesh>
          </group>

          <group position={[-1.65, 1.55, -0.2]}>
            <mesh>
              <cylinderGeometry args={[0.75, 0.75, 0.12, 48]} />
              <meshStandardMaterial color="#eff6ff" roughness={0.3} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.07, 0]}>
              <cylinderGeometry args={[0.64, 0.64, 0.02, 48]} />
              <meshStandardMaterial color="#172554" roughness={0.5} />
            </mesh>
            <group ref={clockHand} position={[0, 0.1, 0]}>
              <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[0.045, 0.58, 0.04]} />
                <meshBasicMaterial color="#67e8f9" />
              </mesh>
            </group>
          </group>
        </group>
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#0c2333" roughness={0.9} />
      </mesh>
    </>
  );
}
