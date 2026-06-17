'use client';

/**
 * RobotHero — a custom, fully code-built 3D mascot robot that holds a combination
 * wrench. Styled to match the dark, glossy "interactive 3D" look (spotlight card,
 * cursor-following). Built from three.js primitives so we fully control it — the
 * wrench is part of the model, no external scene/file needed.
 */

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, RoundedBox, Environment, Lightformer } from '@react-three/drei';
import type { Group } from 'three';

/** Combination wrench: an open jaw on one end, a closed ring on the other. */
function Wrench() {
  const steel = { color: '#cfd6de', metalness: 1, roughness: 0.22 };
  return (
    <group rotation={[0, 0, -0.3]}>
      {/* shaft */}
      <RoundedBox args={[0.16, 1.45, 0.1]} radius={0.045} smoothness={4}>
        <meshStandardMaterial {...steel} />
      </RoundedBox>

      {/* open-end head (top): a block with a V-notch insert */}
      <group position={[0, 0.86, 0]} rotation={[0, 0, 0.25]}>
        <RoundedBox args={[0.5, 0.46, 0.1]} radius={0.05} smoothness={4}>
          <meshStandardMaterial {...steel} />
        </RoundedBox>
        <mesh position={[0, 0.14, 0.02]}>
          <boxGeometry args={[0.2, 0.34, 0.14]} />
          <meshStandardMaterial color="#454c55" metalness={0.7} roughness={0.5} />
        </mesh>
      </group>

      {/* ring head (bottom) */}
      <group position={[0, -0.84, 0]} rotation={[0, 0, -0.25]}>
        <mesh>
          <torusGeometry args={[0.24, 0.075, 20, 36]} />
          <meshStandardMaterial {...steel} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.12, 12]} />
          <meshStandardMaterial color="#454c55" metalness={0.7} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}

function Robot() {
  const root = useRef<Group>(null);
  const head = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    target.current.x = state.pointer.x;
    target.current.y = state.pointer.y;
    const k = Math.min(1, delta * 3.5);
    if (root.current) {
      root.current.rotation.y += (target.current.x * 0.45 - root.current.rotation.y) * k;
      root.current.rotation.x += (-target.current.y * 0.22 - root.current.rotation.x) * k;
    }
    // Head tracks the cursor a bit more than the body for a lively feel.
    if (head.current) {
      head.current.rotation.y += (target.current.x * 0.35 - head.current.rotation.y) * k;
      head.current.rotation.x += (-target.current.y * 0.3 - head.current.rotation.x) * k;
    }
  });

  // Dark, glossy enamel shell + darker matte joints.
  const shell = { color: '#2b313a', metalness: 0.55, roughness: 0.28 };
  const dark = { color: '#1a1e24', metalness: 0.5, roughness: 0.45 };
  const glow = { color: '#5cc8ff', emissive: '#2f93e0', emissiveIntensity: 2 } as const;

  return (
    <group ref={root} position={[0, -0.15, 0]}>
      {/* HEAD */}
      <group ref={head} position={[0, 1.4, 0]}>
        <RoundedBox args={[1.55, 1.25, 1.3]} radius={0.32} smoothness={6}>
          <meshStandardMaterial {...shell} />
        </RoundedBox>
        {/* glossy black visor */}
        <RoundedBox args={[1.22, 0.6, 0.14]} radius={0.26} smoothness={6} position={[0, 0.04, 0.64]}>
          <meshStandardMaterial color="#0c0f13" metalness={0.6} roughness={0.08} />
        </RoundedBox>
        {/* eyes */}
        <mesh position={[-0.27, 0.06, 0.74]}>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial {...glow} />
        </mesh>
        <mesh position={[0.27, 0.06, 0.74]}>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial {...glow} />
        </mesh>
        {/* side ears */}
        {[-0.86, 0.86].map((x) => (
          <mesh key={x} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.2, 24]} />
            <meshStandardMaterial {...dark} />
          </mesh>
        ))}
        {/* antenna */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.38, 12]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshStandardMaterial {...glow} />
        </mesh>
      </group>

      {/* NECK */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 0.22, 24]} />
        <meshStandardMaterial {...dark} />
      </mesh>

      {/* BODY */}
      <group position={[0, 0.02, 0]}>
        <RoundedBox args={[1.6, 1.6, 1.2]} radius={0.34} smoothness={6}>
          <meshStandardMaterial {...shell} />
        </RoundedBox>
        {/* chest panel */}
        <RoundedBox args={[0.92, 0.72, 0.1]} radius={0.16} smoothness={6} position={[0, 0.12, 0.62]}>
          <meshStandardMaterial color="#0c0f13" metalness={0.6} roughness={0.12} />
        </RoundedBox>
        <mesh position={[0, 0.12, 0.69]}>
          <torusGeometry args={[0.17, 0.04, 16, 32]} />
          <meshStandardMaterial {...glow} emissiveIntensity={1.3} />
        </mesh>
        <mesh position={[0, 0.12, 0.7]}>
          <circleGeometry args={[0.08, 24]} />
          <meshStandardMaterial {...glow} emissiveIntensity={1.6} />
        </mesh>
      </group>

      {/* LEFT ARM (relaxed) */}
      <group position={[-1.0, 0.32, 0.05]} rotation={[0, 0, 0.4]}>
        <mesh position={[0, -0.05, 0]}>
          <capsuleGeometry args={[0.17, 0.7, 8, 16]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        <mesh position={[0, -0.62, 0]}>
          <sphereGeometry args={[0.23, 20, 20]} />
          <meshStandardMaterial {...shell} />
        </mesh>
      </group>

      {/* RIGHT ARM (raised) holding the wrench */}
      <group position={[1.0, 0.42, 0.18]} rotation={[0.25, 0, -0.95]}>
        <mesh position={[0, -0.05, 0]}>
          <capsuleGeometry args={[0.17, 0.7, 8, 16]} />
          <meshStandardMaterial {...dark} />
        </mesh>
        {/* hand gripping the wrench */}
        <mesh position={[0, -0.62, 0]}>
          <sphereGeometry args={[0.25, 20, 20]} />
          <meshStandardMaterial {...shell} />
        </mesh>
        <group position={[0, -0.64, 0.14]} rotation={[0.5, 0, 0.95]} scale={0.82}>
          <Wrench />
        </group>
      </group>

      {/* LEGS + base */}
      {[-0.46, 0.46].map((x) => (
        <mesh key={x} position={[x, -1.0, 0]}>
          <capsuleGeometry args={[0.21, 0.35, 8, 16]} />
          <meshStandardMaterial {...dark} />
        </mesh>
      ))}
      <mesh position={[0, -1.36, 0]}>
        <cylinderGeometry args={[0.72, 0.9, 0.2, 36]} />
        <meshStandardMaterial color="#23272e" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

export default function RobotHero() {
  const [ready, setReady] = useState(false);

  return (
    <div className="robot-stage">
      {!ready && (
        <div className="robot-loader" aria-hidden="true">
          <span className="robot-loader-dot" />
          <span className="robot-loader-dot" />
          <span className="robot-loader-dot" />
        </div>
      )}
      <Canvas
        className="robot-spline"
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.5, 6.2], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setReady(true)}
        style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.7s ease' }}
      >
        <ambientLight intensity={0.35} />
        {/* key spotlight from upper-left, like the reference "Spotlight" card */}
        <spotLight position={[-5, 6, 4]} angle={0.5} penumbra={0.8} intensity={2.4} castShadow color="#dbefff" />
        <directionalLight position={[5, 3, 5]} intensity={0.9} />
        {/* cool rim light from behind for the glossy edge */}
        <directionalLight position={[-3, 1, -5]} intensity={1.1} color="#3f7fff" />
        <pointLight position={[0, -1.5, 4]} intensity={0.5} color="#7cc6ff" />

        <Suspense fallback={null}>
          {/* Reflections on the glossy shell, built inline (no network fetch). */}
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 4, 2]} scale={[8, 3, 1]} color="#cfe6ff" />
            <Lightformer intensity={1.2} position={[-4, 1, 2]} scale={[3, 4, 1]} color="#6aa8ff" />
            <Lightformer intensity={1} position={[4, 0, 3]} scale={[3, 4, 1]} color="#ffffff" />
          </Environment>

          <Float speed={2} rotationIntensity={0.18} floatIntensity={0.55}>
            <Robot />
          </Float>

          <ContactShadows position={[0, -1.6, 0]} opacity={0.5} scale={8} blur={2.8} far={3.5} color="#000000" />
        </Suspense>
      </Canvas>
    </div>
  );
}
