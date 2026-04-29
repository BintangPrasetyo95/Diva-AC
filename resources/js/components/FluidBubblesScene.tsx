import { Environment, MeshDistortMaterial, ContactShadows, useProgress } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useAppearance } from '@/hooks/use-appearance';

function Bubble({ index, position, scale, speed, isDark, startAnim, delay, bubblePositions, scales }: { 
  index: number, 
  position: [number, number, number], 
  scale: number, 
  speed: number, 
  isDark: boolean, 
  startAnim: boolean, 
  delay: number,
  bubblePositions: React.MutableRefObject<THREE.Vector3[]>,
  scales: number[]
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const animStartTime = useRef<number | null>(null);
  const currentPos = useRef(new THREE.Vector3(0, -25, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    if (!meshRef.current) {
return;
}

    const t = state.clock.getElapsedTime();

    let easeOutBack = 0;
    let targetX = position[0];
    let targetY = position[1];
    let targetZ = position[2];
    let idleAnim = false;

    if (startAnim) {
      if (animStartTime.current === null) {
animStartTime.current = t;
}
      
      const elapsed = t - animStartTime.current - delay;
      const duration = 2.0;

      if (elapsed < 0) {
        // waiting
      } else if (elapsed < duration) {
        const p = elapsed / duration;
        const c1 = 1.70158;
        const c3 = c1 + 1;
        easeOutBack = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
        targetY = -25 + (position[1] - -25) * Math.max(0, easeOutBack);
        targetX = 0 + (position[0] - 0) * Math.max(0, easeOutBack);
        targetZ = 0 + (position[2] - 0) * Math.max(0, easeOutBack);
      } else {
        easeOutBack = 1;
        idleAnim = true;
      }
    }

    if (idleAnim) {
       targetX = position[0] + Math.cos(t * speed * 0.8 + index * 123) * 2;
       targetY = position[1] + Math.sin(t * speed + index * 123) * 2;
       targetZ = position[2] + Math.sin(t * speed * 0.5 + index * 123) * 1.5;
    }

    if (startAnim && animStartTime.current !== null && (t - animStartTime.current - delay) >= 0) {
        if (!idleAnim) {
            currentPos.current.set(targetX, targetY, targetZ);
            velocity.current.set(0, 0, 0);
        } else {
            const attractForce = new THREE.Vector3(targetX, targetY, targetZ).sub(currentPos.current).multiplyScalar(0.015);
            velocity.current.add(attractForce);
            const timeSinceIdle = (t - animStartTime.current - delay) - 2.0;
            
            if (timeSinceIdle > 3.0) {
                for (let i = 0; i < bubblePositions.current.length; i++) {
                  if (i === index) {
continue;
}

                  const otherPos = bubblePositions.current[i];
                  const dist = currentPos.current.distanceTo(otherPos);
                  
                  // Min distance: sum of radii + padding
                  const minDist = (scale + scales[i]) * 1.1;
                  
                  if (dist < minDist && dist > 0.01) {
                    const overlap = minDist - dist;
                    const forceDir = currentPos.current.clone().sub(otherPos).normalize();
                    // Soft push that scales quadratically with overlap
                    const pushStrength = Math.pow(overlap, 2) * 0.03; 
                    velocity.current.add(forceDir.multiplyScalar(pushStrength));
                  }
                }
            }
            
            velocity.current.multiplyScalar(0.85); // Damping
            currentPos.current.add(velocity.current);
        }

        meshRef.current.position.copy(currentPos.current);
        bubblePositions.current[index].copy(currentPos.current);
        
        const currentScale = scale * Math.min(1, Math.max(0.01, easeOutBack));
        meshRef.current.scale.setScalar(currentScale);
        
        meshRef.current.rotation.x = t * speed * 0.5 + index;
        meshRef.current.rotation.y = t * speed * 0.3 + index;
    } else {
        meshRef.current.position.set(0, -25, 0);
        meshRef.current.scale.setScalar(0.01);
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        speed={speed * 5}
        distort={0.3}
        radius={1}
        color={isDark ? "#ffffff" : "#ffffff"}
        transmission={1}
        roughness={0.1}
        metalness={0.1}
        thickness={2}
        ior={1.5}
        iridescence={0.3}
        iridescenceIOR={1.3}
      />
    </mesh>
  );
}

function Bubbles({ isDark }: { isDark: boolean }) {
  const { active, progress } = useProgress();
  const [startAnim, setStartAnim] = React.useState(false);

  React.useEffect(() => {
    if (!active && progress === 100) {
      const t = setTimeout(() => setStartAnim(true), 600); // Wait for preloader to hide

      return () => clearTimeout(t);
    }
  }, [active, progress]);

  const [bubblesData] = React.useState(() => {
    return Array.from({ length: 12 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8 - 2
      ] as [number, number, number],
      scale: Math.random() * 1.5 + 0.8,
      speed: Math.random() * 0.4 + 0.2,
      delay: Math.random() * 1.5,
    }));
  });

  const bubblePositions = useRef(bubblesData.map(() => new THREE.Vector3(0, -25, 0)));
  const scales = useMemo(() => bubblesData.map(d => d.scale), [bubblesData]);

  return (
    <>
      {bubblesData.map((data, i) => (
        <Bubble 
            key={i} 
            index={i} 
            {...data} 
            isDark={isDark} 
            startAnim={startAnim} 
            bubblePositions={bubblePositions}
            scales={scales}
        />
      ))}
    </>
  );
}

export default function FluidBubblesScene() {
  const { resolvedAppearance } = useAppearance();
  const isDark = resolvedAppearance === 'dark';
  const bgColor = isDark ? '#050505' : '#f8f9fa';

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const activeIsDark = mounted ? isDark : false;
  const activeBgColor = mounted ? bgColor : '#f8f9fa';

  return (
    <div style={{ width: '100%', height: '100%', background: activeBgColor, position: 'absolute', inset: 0 }}>
      <Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
        <color attach="background" args={[activeBgColor]} />
        {activeIsDark && <fog attach="fog" args={['#050505', 10, 30]} />}
        {!activeIsDark && <fog attach="fog" args={['#f8f9fa', 10, 30]} />}
        
        <ambientLight intensity={activeIsDark ? 0.2 : 0.8} />
        <directionalLight position={[10, 10, 5]} intensity={activeIsDark ? 2 : 2.5} color={activeIsDark ? "#aa44ff" : "#ffffff"} />
        <directionalLight position={[-10, -10, -5]} intensity={activeIsDark ? 1 : 1.5} color={activeIsDark ? "#006aff" : "#ffeedd"} />
        <pointLight position={[0, 0, 5]} intensity={activeIsDark ? 1 : 0.5} color={activeIsDark ? "#ff0055" : "#ffffff"} />
        
        <React.Suspense fallback={null}>
          <Bubbles isDark={activeIsDark} />
          <Environment preset={activeIsDark ? 'night' : 'city'} />
        </React.Suspense>
        
        <ContactShadows 
          position={[0, -10, 0]} 
          opacity={activeIsDark ? 0.8 : 0.3} 
          scale={40} 
          blur={3} 
          far={15} 
          color={activeIsDark ? "#000000" : "#222222"}
        />
      </Canvas>
    </div>
  );
}
