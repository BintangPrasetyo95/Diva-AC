"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ThreeScene;
var drei_1 = require("@react-three/drei");
var fiber_1 = require("@react-three/fiber");
var react_1 = require("react");
var THREE = require("three");
var use_appearance_1 = require("@/hooks/use-appearance");
function CarModel() {
    var _a = (0, drei_1.useGLTF)('/models/car.glb'), scene = _a.scene, animations = _a.animations;
    var actions = (0, drei_1.useAnimations)(animations, scene).actions;
    react_1.default.useEffect(function () {
        if (actions && Object.keys(actions).length > 0) {
            Object.values(actions).forEach(function (action) { return action === null || action === void 0 ? void 0 : action.play(); });
        }
        scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    var mat = child
                        .material;
                    if (mat.color &&
                        mat.color.r === 0 &&
                        mat.color.g === 0 &&
                        mat.color.b === 0) {
                        mat.color.set('#000000');
                    }
                }
            }
        });
    }, [scene, actions]);
    return (<group position={[0, 0.2, 0]}>
            <drei_1.Center>
                <primitive object={scene} scale={1.0}/>
            </drei_1.Center>
        </group>);
}
function Floor(_a) {
    var isDark = _a.isDark;
    var texture = (0, drei_1.useTexture)('/img/concrete_floor.png');
    // eslint-disable-next-line react-hooks/immutability
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(90, 90);
    // eslint-disable-next-line react-hooks/immutability
    texture.colorSpace = THREE.SRGBColorSpace;
    return (<group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]} receiveShadow>
                <planeGeometry args={[1000, 1000]}/>
                <meshStandardMaterial map={texture} color={isDark ? '#222222' : '#888888'} roughness={0.9} metalness={0.1}/>
            </mesh>
        </group>);
}
function Lighting(_a) {
    var isDark = _a.isDark;
    return (<>
            <ambientLight intensity={isDark ? 0.05 : 1.2}/>
            <drei_1.Environment preset={isDark ? 'night' : 'forest'} blur={0.8}/>
            {isDark && (<>
                    <spotLight color="#ffffff" position={[0, 10, 0]} angle={0.4} penumbra={0.5} decay={1} distance={50} intensity={150} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024}/>
                    {/* Subtle rim light for the car */}
                    <pointLight position={[5, 2, 5]} intensity={10} color="#ffffff"/>
                    <pointLight position={[-5, 2, -5]} intensity={10} color="#ffffff"/>
                </>)}
            {!isDark && (<directionalLight position={[10, 10, 5]} intensity={1.5} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}/>)}
        </>);
}
function ThreeScene() {
    var resolvedAppearance = (0, use_appearance_1.useAppearance)().resolvedAppearance;
    var isDark = resolvedAppearance === 'dark';
    var _a = react_1.default.useState(false), isMobile = _a[0], setIsMobile = _a[1];
    var _b = react_1.default.useState(false), mounted = _b[0], setMounted = _b[1];
    react_1.default.useEffect(function () {
        setMounted(true);
        var handleResize = function () { return setIsMobile(window.innerWidth < 768); };
        handleResize();
        window.addEventListener('resize', handleResize);
        drei_1.useGLTF.preload('/models/car.glb');
        return function () { return window.removeEventListener('resize', handleResize); };
    }, []);
    var activeIsDark = mounted ? isDark : false;
    // SSR Guard: Never render Three.js content on the server to avoid Suspense/Canvas errors
    if (!mounted) {
        return (<div className={"w-full h-full ".concat(activeIsDark ? 'bg-[#080808]' : 'bg-white')}/>);
    }
    return (<div className={"w-full h-full ".concat(activeIsDark ? 'bg-[#080808]' : 'bg-white')}>
            <fiber_1.Canvas shadows="percentage" dpr={[1, 2]} gl={{
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: activeIsDark ? 1.5 : 1.0,
        }} camera={{
            position: [4, 2, 4], // Moved closer for better framing
            fov: isMobile ? 65 : 45,
        }}>
                <color attach="background" args={[activeIsDark ? '#080808' : '#ffffff']}/>
                {activeIsDark && (<fogExp2 attach="fog" args={['#080808', 0.05]}/>)}

                <react_1.Suspense fallback={null}>
                    <Lighting isDark={activeIsDark}/>
                    <CarModel />
                    {activeIsDark && <Floor isDark={activeIsDark}/>}
                    <drei_1.ContactShadows opacity={activeIsDark ? 0.6 : 0.4} scale={10} blur={2.5} far={10} position={[0, -0.39, 0]} resolution={512} color="#000000"/>
                </react_1.Suspense>

                <drei_1.OrbitControls makeDefault enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={activeIsDark ? 1.5 : 1.0} maxPolarAngle={Math.PI / 2 - 0.05} enableZoom={false} target={[0, -0.5, 0]}/>
            </fiber_1.Canvas>
        </div>);
}
