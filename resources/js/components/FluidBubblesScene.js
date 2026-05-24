"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FluidBubblesScene;
var drei_1 = require("@react-three/drei");
var fiber_1 = require("@react-three/fiber");
var react_1 = require("react");
var THREE = require("three");
var use_appearance_1 = require("@/hooks/use-appearance");
function Bubble(_a) {
    var index = _a.index, position = _a.position, scale = _a.scale, speed = _a.speed, isDark = _a.isDark, startAnim = _a.startAnim, delay = _a.delay, bubblePositions = _a.bubblePositions, scales = _a.scales;
    var meshRef = (0, react_1.useRef)(null);
    var animStartTime = (0, react_1.useRef)(null);
    var currentPos = (0, react_1.useRef)(new THREE.Vector3(0, -25, 0));
    var velocity = (0, react_1.useRef)(new THREE.Vector3(0, 0, 0));
    (0, fiber_1.useFrame)(function (state) {
        if (!meshRef.current) {
            return;
        }
        var t = state.clock.getElapsedTime();
        var easeOutBack = 0;
        var targetX = position[0];
        var targetY = position[1];
        var targetZ = position[2];
        var idleAnim = false;
        if (startAnim) {
            if (animStartTime.current === null) {
                animStartTime.current = t;
            }
            var elapsed = t - animStartTime.current - delay;
            var duration = 2.0;
            if (elapsed < 0) {
                // waiting
            }
            else if (elapsed < duration) {
                var p = elapsed / duration;
                var c1 = 1.70158;
                var c3 = c1 + 1;
                easeOutBack =
                    1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
                targetY = -25 + (position[1] - -25) * Math.max(0, easeOutBack);
                targetX = 0 + (position[0] - 0) * Math.max(0, easeOutBack);
                targetZ = 0 + (position[2] - 0) * Math.max(0, easeOutBack);
            }
            else {
                easeOutBack = 1;
                idleAnim = true;
            }
        }
        if (idleAnim) {
            targetX = position[0] + Math.cos(t * speed * 0.8 + index * 123) * 2;
            targetY = position[1] + Math.sin(t * speed + index * 123) * 2;
            targetZ =
                position[2] + Math.sin(t * speed * 0.5 + index * 123) * 1.5;
        }
        if (startAnim &&
            animStartTime.current !== null &&
            t - animStartTime.current - delay >= 0) {
            if (!idleAnim) {
                currentPos.current.set(targetX, targetY, targetZ);
                velocity.current.set(0, 0, 0);
            }
            else {
                var attractForce = new THREE.Vector3(targetX, targetY, targetZ)
                    .sub(currentPos.current)
                    .multiplyScalar(0.015);
                velocity.current.add(attractForce);
                var timeSinceIdle = t - animStartTime.current - delay - 2.0;
                if (timeSinceIdle > 3.0) {
                    for (var i = 0; i < bubblePositions.current.length; i++) {
                        if (i === index) {
                            continue;
                        }
                        var otherPos = bubblePositions.current[i];
                        var dist = currentPos.current.distanceTo(otherPos);
                        // Min distance: sum of radii + padding
                        var minDist = (scale + scales[i]) * 1.1;
                        if (dist < minDist && dist > 0.01) {
                            var overlap = minDist - dist;
                            var forceDir = currentPos.current
                                .clone()
                                .sub(otherPos)
                                .normalize();
                            // Soft push that scales quadratically with overlap
                            var pushStrength = Math.pow(overlap, 2) * 0.03;
                            velocity.current.add(forceDir.multiplyScalar(pushStrength));
                        }
                    }
                }
                velocity.current.multiplyScalar(0.85); // Damping
                currentPos.current.add(velocity.current);
            }
            meshRef.current.position.copy(currentPos.current);
            bubblePositions.current[index].copy(currentPos.current);
            var currentScale = scale * Math.min(1, Math.max(0.01, easeOutBack));
            meshRef.current.scale.setScalar(currentScale);
            meshRef.current.rotation.x = t * speed * 0.5 + index;
            meshRef.current.rotation.y = t * speed * 0.3 + index;
        }
        else {
            meshRef.current.position.set(0, -25, 0);
            meshRef.current.scale.setScalar(0.01);
        }
    });
    return (<mesh ref={meshRef} castShadow receiveShadow>
            <sphereGeometry args={[1, 64, 64]}/>
            <drei_1.MeshDistortMaterial speed={speed * 5} distort={0.3} radius={1} color={isDark ? '#ffffff' : '#ffffff'} transmission={1} roughness={0.1} metalness={0.1} thickness={2} ior={1.5} iridescence={0.3} iridescenceIOR={1.3}/>
        </mesh>);
}
function Bubbles(_a) {
    var isDark = _a.isDark;
    var _b = (0, drei_1.useProgress)(), active = _b.active, progress = _b.progress;
    var _c = react_1.default.useState(false), startAnim = _c[0], setStartAnim = _c[1];
    react_1.default.useEffect(function () {
        if (!active && progress === 100) {
            var t_1 = setTimeout(function () { return setStartAnim(true); }, 600); // Wait for preloader to hide
            return function () { return clearTimeout(t_1); };
        }
    }, [active, progress]);
    var bubblesData = react_1.default.useState(function () {
        return Array.from({ length: 12 }).map(function () { return ({
            position: [
                (Math.random() - 0.5) * 12,
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 8 - 2,
            ],
            scale: Math.random() * 1.5 + 0.8,
            speed: Math.random() * 0.4 + 0.2,
            delay: Math.random() * 1.5,
        }); });
    })[0];
    var bubblePositions = (0, react_1.useRef)(bubblesData.map(function () { return new THREE.Vector3(0, -25, 0); }));
    var scales = (0, react_1.useMemo)(function () { return bubblesData.map(function (d) { return d.scale; }); }, [bubblesData]);
    return (<>
            {bubblesData.map(function (data, i) { return (<Bubble key={i} index={i} {...data} isDark={isDark} startAnim={startAnim} bubblePositions={bubblePositions} scales={scales}/>); })}
        </>);
}
function FluidBubblesScene() {
    var resolvedAppearance = (0, use_appearance_1.useAppearance)().resolvedAppearance;
    var isDark = resolvedAppearance === 'dark';
    var _a = react_1.default.useState(false), mounted = _a[0], setMounted = _a[1];
    react_1.default.useEffect(function () {
        setMounted(true);
    }, []);
    var activeIsDark = mounted ? isDark : false;
    return (<div className={"absolute inset-0 w-full h-full ".concat(activeIsDark ? 'bg-[#050505]' : 'bg-[#f8f9fa]')}>
            <fiber_1.Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
                <color attach="background" args={[activeIsDark ? '#050505' : '#f8f9fa']}/>
                {activeIsDark ? (<fog attach="fog" args={['#050505', 10, 30]}/>) : (<fog attach="fog" args={['#f8f9fa', 10, 30]}/>)}

                <ambientLight intensity={activeIsDark ? 0.2 : 0.8}/>
                <directionalLight position={[10, 10, 5]} intensity={activeIsDark ? 2 : 2.5} color={activeIsDark ? '#aa44ff' : '#ffffff'}/>
                <directionalLight position={[-10, -10, -5]} intensity={activeIsDark ? 1 : 1.5} color={activeIsDark ? '#006aff' : '#ffeedd'}/>
                <pointLight position={[0, 0, 5]} intensity={activeIsDark ? 1 : 0.5} color={activeIsDark ? '#ff0055' : '#ffffff'}/>

                <react_1.default.Suspense fallback={null}>
                    <Bubbles isDark={activeIsDark}/>
                    <drei_1.Environment preset={activeIsDark ? 'night' : 'night'}/>
                </react_1.default.Suspense>

                <drei_1.ContactShadows position={[0, -10, 0]} opacity={activeIsDark ? 0.8 : 0.3} scale={40} blur={3} far={15} color={activeIsDark ? '#000000' : '#222222'}/>
            </fiber_1.Canvas>
        </div>);
}
