import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useFBX, useTexture, PerspectiveCamera, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';

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
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(70, 70); // Reduced repeat to make the texture look "bigger"
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

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <spotLight
        color="red"
        position={[0, 10, -15]}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2.0}
        distance={500}
        intensity={500}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
      <spotLight
        color="white"
        position={[0, 10, 15]}
        angle={Math.PI / 3}
        penumbra={0.5}
        decay={2.0}
        distance={500}
        intensity={500}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      />
    </>
  );
}

export default function ThreeScene() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2
        }}
        camera={{ position: [15, 8, 15], fov: 45 }}
      >
        <color attach="background" args={['#000']} />
        {/* <fogExp2 attach="fog" args={['#000', 0.02]} /> */}

        <Suspense fallback={null}>
          <Lighting />
          <Mercedes />
          <Floor />
          <ContactShadows
            opacity={1}
            scale={20}
            blur={1}
            far={10}
            resolution={256}
            color="#000000"
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.04}
          autoRotate
          autoRotateSpeed={4.5}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />
      </Canvas>

      {/* Title Overlay */}
      <div style={{
        position: 'absolute',
        top: '40px',
        left: '40px',
        color: '#fff',
        fontFamily: 'Inter, sans-serif',
        pointerEvents: 'none',
        textShadow: '0 0 20px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.05em' }}>
          MERCEDES-BENZ (Maybe)
        </h1>
        <p style={{ margin: 0, opacity: 0.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          GLS 580 Showcase
        </p>
      </div>
    </div>
  );
}
