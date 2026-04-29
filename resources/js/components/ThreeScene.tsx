import { OrbitControls, useFBX, useTexture, ContactShadows, Center } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import * as THREE from 'three';
import { useAppearance } from '@/hooks/use-appearance';

function Mercedes() {
  const fbx = useFBX('/models/mercedes.fbx');

  return (
    <Center top>
      <primitive object={fbx} scale={0.07} castShadow receiveShadow />
    </Center>
  );
}

function Floor() {
  const texture = useTexture('/img/concrete_floor.png');
  // eslint-disable-next-line react-hooks/immutability
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(70, 70); // Reduced repeat to make the texture look "bigger"
  // eslint-disable-next-line react-hooks/immutability
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial
          map={texture}
          color="#888888"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      {/* Large light glow below the model */}
      {/* <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[10, 10]} />
        <meshBasicMaterial transparent opacity={0.4}>
          <canvasTexture attach="map" args={[(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d')!;
            const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
            gradient.addColorStop(0, 'rgba(150, 220, 255, 1)');
            gradient.addColorStop(0.5, 'rgba(150, 220, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(150, 220, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);
            return canvas;
          })()]} />
        </meshBasicMaterial>
      </mesh> */}
    </group>
  );
}

function Lighting({ isDark }: { isDark: boolean }) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.8 : 1.2} />
      {isDark && (
        <>
          <spotLight
            color="#ff0000"
            position={[10, 20, 10]}
            angle={0.5}
            penumbra={1}
            decay={2}
            distance={100}
            intensity={1500}
            castShadow
          />
          <spotLight
            color="#ffffff"
            position={[-10, 20, -10]}
            angle={0.5}
            penumbra={1}
            decay={2}
            distance={100}
            intensity={1000}
            castShadow
          />
          <pointLight position={[0, 5, 0]} intensity={500} color="red" />
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

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', background: bgColor }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isDark ? 1.5 : 1.0
        }}
        camera={{ 
          position: [15, 8, 15], 
          fov: isMobile ? 65 : 45 
        }}
      >
        <color attach="background" args={[bgColor]} />
        {isDark && <fogExp2 attach="fog" args={['#080808', 0.01]} />}

        <Suspense fallback={null}>
          <Lighting isDark={isDark} />
          <Mercedes />
          {isDark && <Floor />}
          <ContactShadows
            opacity={isDark ? 0.8 : 0.4}
            scale={20}
            blur={2}
            far={10}
            resolution={512}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={isDark ? 1.5 : 1.0}
          maxPolarAngle={Math.PI / 2 - 0.05}
          enableZoom={false}
        />
      </Canvas>
    </div>
  );
}
