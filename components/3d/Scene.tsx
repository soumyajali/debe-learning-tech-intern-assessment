"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Html, Loader } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        className="h-full w-full"
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 1.2, 5.8], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={<Html center><Loader /></Html>}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}

function SceneContent() {
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null);
  const scrollProgress = useRef(0);

  const targetPosition = useMemo(() => new THREE.Vector3(0, 1.15, 4.8), []);
  const targetRotation = useMemo(() => new THREE.Euler(-0.08, 0, 0), []);
  const targetModelPosition = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const targetModelRotation = useMemo(() => new THREE.Euler(0.16, -0.36, 0), []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const timeline = gsap.timeline({
      defaults: { ease: "power2.out" },
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      },
    });

    const cameraPosition = isMobile
      ? new THREE.Vector3(0, 0.95, 5.2)
      : new THREE.Vector3(0, 1.28, 5.6);

    const cameraRotation = isMobile
      ? new THREE.Euler(-0.05, 0, 0)
      : new THREE.Euler(-0.12, 0, 0);

    timeline
      .to(camera.position, {
        x: cameraPosition.x,
        y: cameraPosition.y,
        z: cameraPosition.z,
        duration: 1,
      })
      .to(camera.rotation, {
        x: cameraRotation.x,
        y: cameraRotation.y,
        z: cameraRotation.z,
        duration: 1,
      }, 0)
      .to(targetModelPosition, {
        y: -0.32,
        duration: 1,
      }, 0);

    return () => {
      timeline.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [camera, targetModelPosition]);

  useFrame((state, delta) => {
    const targetScroll = scrollProgress.current;

    camera.position.lerp(targetPosition.clone().set(
      targetPosition.x,
      targetPosition.y + (targetScroll - 0.5) * 0.45,
      targetPosition.z - targetScroll * 1.8
    ), 1 - Math.pow(0.001, delta));

    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotation.x, delta * 4);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotation.y + targetScroll * 0.35, delta * 4);

    if (root.current) {
      root.current.position.lerp(targetModelPosition, delta * 4);
      root.current.rotation.x = THREE.MathUtils.lerp(root.current.rotation.x, targetModelRotation.x, delta * 4);
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, targetModelRotation.y + targetScroll * 2.4, delta * 4);
    }
  });

  return (
    <>
      <color attach="background" args={["#07111a"]} />
      <fog attach="fog" args={["#07111a", 7, 15]} />

      <ambientLight intensity={0.4} />
      <directionalLight
        castShadow
        position={[3, 8, 5]}
        intensity={2.2}
        color="#b8eaff"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      <Environment preset="city" />

      <Float speed={1.2} rotationIntensity={0.55} floatIntensity={1.2}>
        <group ref={root}>
          <mesh position={[-1.2, 0, 0]} castShadow receiveShadow>
            <icosahedronGeometry args={[0.95, 1]} />
            <meshPhysicalMaterial color="#4ad6ff" roughness={0.2} metalness={0.15} transmission={0.1} />
          </mesh>

          <mesh position={[1.02, 0.05, -0.24]} rotation={[0.3, 0.2, 0]} castShadow>
            <octahedronGeometry args={[0.78, 0]} />
            <meshPhysicalMaterial color="#91f7b7" roughness={0.3} metalness={0.25} />
          </mesh>

          <mesh position={[0.08, -1.05, -0.2]} rotation={[0, 0.5, 0]} castShadow receiveShadow>
            <torusGeometry args={[1.45, 0.045, 16, 128]} />
            <meshStandardMaterial color="#bda7ff" roughness={0.55} metalness={0.3} />
          </mesh>
        </group>
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.62, 0]} receiveShadow>
        <circleGeometry args={[3.2, 128]} />
        <meshStandardMaterial color="#152b35" roughness={0.93} />
      </mesh>
    </>
  );
}
