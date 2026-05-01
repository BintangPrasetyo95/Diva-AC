import { OrbitControls, useTexture, ContactShadows, Center, useGLTF, useAnimations, Environment } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import * as THREE from 'three';
import { useAppearance } from '@/hooks/use-appearance';

function CarModel() {
  const { scene, animations } = useGLTF('/models/car.glb');
  const { actions } = useAnimations(animations, scene);
  
  React.useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => action?.play());
    }

    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        if ((child as THREE.Mesh).material) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat.color && mat.color.r === 0 && mat.color.g === 0 && mat.color.b === 0) {
            mat.color.set('#000000');
          }
        }
      }
    });
  }, [scene, actions]);

  return (
    <group position={[0, 0.2, 0]}>
      <Center>
        <primitive object={scene} scale={1.0} />
      </Center>
    </group>
  );
}

function Floor() {
  const texture = useTexture('/img/concrete_floor.png');
  // eslint-disable-next-line react-hooks/immutability
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(90, 90);
  // eslint-disable-next-line react-hooks/immutability
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          map={texture}
          color="#888888"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function Lighting({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.8 : 1.2} />
      <Environment preset={isDark ? "night" : "forest"} />
      {isDark && (
        <>
          <spotLight
            color="#ffffff"
            position={[10, 20, 10]}
            angle={0.5}
            penumbra={1}
            decay={2}
            distance={50}
            intensity={10}
            castShadow
          />
          <spotLight
            color="#ffffff"
            position={[-10, 20, -10]}
            angle={0.5}
            penumbra={1}
            decay={2}
            distance={50}
            intensity={10}
            castShadow
          />
          <pointLight position={[0, 5, 0]} intensity={50} color="gray" />
        </>
      )}
      {!isDark && (
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
      )}
    </>
  );
}

export default function ThreeScene() {
  const { resolvedAppearance } = useAppearance();
  const isDark = resolvedAppearance === 'dark';
  const bgColor = isDark ? '#080808' : '#ffffff';
  
  const [isMobile, setIsMobile] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    useGLTF.preload('/models/car.glb');

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeBgColor = mounted ? bgColor : '#ffffff';
  const activeIsDark = mounted ? isDark : false;

  // SSR Guard: Never render Three.js content on the server to avoid Suspense/Canvas errors
  if (!mounted) {
    return <div style={{ width: '100%', height: '100%', background: activeBgColor }} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', background: activeBgColor }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: activeIsDark ? 1.5 : 1.0,
        }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        camera={{ 
          position: [4, 2, 4], // Moved closer for better framing
          fov: isMobile ? 65 : 45 
        }}
      >
        <color attach="background" args={[activeBgColor]} />
        {activeIsDark && <fogExp2 attach="fog" args={['#080808', 0.01]} />}

        <Suspense fallback={null}>
          <Lighting isDark={activeIsDark} />
          <CarModel />
          {activeIsDark && <Floor />}
          <ContactShadows
            opacity={activeIsDark ? 0.8 : 0.4}
            scale={20}
            blur={2}
            far={10}
            position={[0, -0.5, 0]} 
            resolution={512}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={activeIsDark ? 1.5 : 1.0}
          maxPolarAngle={Math.PI / 2 - 0.05}
          enableZoom={false}
          target={[0, -0.5, 0]}
        />
      </Canvas>
    </div>
  );
}
