import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import Webcam from "react-webcam";
import { Pose, POSE_LANDMARKS } from "@mediapipe/pose";
import * as THREE from "three";

/* =========================
   CONFIG
   ========================= */
const SMOOTHING = 0.28;
const DEFAULT_BASE_SCALE = 1.7;
const DEFAULT_POSITION_OFFSET_Y = -0.15;
const DEFAULT_POSITION_OFFSET_Z = -0.2;
const DEFAULT_MODEL_ROTATION_X = -180;
const DEFAULT_MODEL_ROTATION_Y = 180;
const DEFAULT_MODEL_ROTATION_Z = -4;

const degToRad = (d) => d * (Math.PI / 180);
const lerp = (a, b, t) => a + (b - a) * t;

/* =========================
   Small helpers
   ========================= */
function safeTraverseSetMeshProps(object3d, fn) {
    object3d.traverse((c) => {
        if (c.isMesh) {
            try {
                fn(c);
            } catch (e) {
                console.warn("mesh update failed", e);
            }
        }
    });
}

/* =========================
   Fallback simple shirt (always visible)
   ========================= */
function FallbackTShirt({ poseLandmarks, positionOffsetY, baseScale, positionOffsetZ, orientation }) {
    const groupRef = useRef();
    const { viewport } = useThree();

    useFrame(() => {
        const g = groupRef.current;
        if (!g || !poseLandmarks || poseLandmarks.length === 0) {
            if (g) g.visible = false;
            return;
        }

        const ls = poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
        const rs = poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
        const lh = poseLandmarks[POSE_LANDMARKS.LEFT_HIP];
        const rh = poseLandmarks[POSE_LANDMARKS.RIGHT_HIP];

        if (!ls || !rs || !lh || !rh) {
            g.visible = false;
            return;
        }

        g.visible = true;

        const shoulderCenterX = (ls.x + rs.x) / 2;
        const shoulderCenterY = (ls.y + rs.y) / 2;
        const hipCenterX = (lh.x + rh.x) / 2;
        const hipCenterY = (lh.y + rh.y) / 2;

        const torsoCenterX = (shoulderCenterX + hipCenterX) / 2;
        const torsoCenterY = (shoulderCenterY + hipCenterY) / 2;

        const x = (torsoCenterX - 0.5) * viewport.width;
        const y = -(torsoCenterY - 0.5) * viewport.height + positionOffsetY;

        g.position.set(x, y, positionOffsetZ);

        const shoulderWidth = Math.abs(rs.x - ls.x);
        const torsoHeight = Math.abs(hipCenterY - shoulderCenterY);
        const scaleFactor = 1 + shoulderWidth * 3 + torsoHeight * 2;
        const scale = baseScale * scaleFactor;
        g.scale.setScalar(scale);

        const shoulderAngle = Math.atan2(rs.y - ls.y, rs.x - ls.x);
        const userRotation = degToRad(orientation);
        g.rotation.set(0, userRotation, shoulderAngle);
    });

    return (
        <group ref={groupRef}>
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.35, 0.4, 1.0, 16]} />
                <meshPhysicalMaterial
                    color="#4f46e5"
                    roughness={0.8}
                    metalness={0.1}
                    transparent={true}
                    opacity={0.85}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh position={[-0.38, 0.22, 0]} rotation={[0, 0, degToRad(15)]}>
                <cylinderGeometry args={[0.1, 0.12, 0.5, 12]} />
                <meshPhysicalMaterial
                    color="#4f46e5"
                    roughness={0.8}
                    metalness={0.1}
                    transparent={true}
                    opacity={0.85}
                    side={THREE.DoubleSide}
                />
            </mesh>
            <mesh position={[0.38, 0.22, 0]} rotation={[0, 0, degToRad(-15)]}>
                <cylinderGeometry args={[0.1, 0.12, 0.5, 12]} />
                <meshPhysicalMaterial
                    color="#4f46e5"
                    roughness={0.8}
                    metalness={0.1}
                    transparent={true}
                    opacity={0.85}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}

/* =========================
   PNG Image Model - Simple and effective
   ========================= */
function PNGImageModel({
    imageUrl,
    poseLandmarks,
    orientation = 0,
    baseScale = DEFAULT_BASE_SCALE,
    positionOffsetY = DEFAULT_POSITION_OFFSET_Y,
    positionOffsetZ = DEFAULT_POSITION_OFFSET_Z,
    modelRotationX = DEFAULT_MODEL_ROTATION_X,
    modelRotationY = DEFAULT_MODEL_ROTATION_Y,
    modelRotationZ = DEFAULT_MODEL_ROTATION_Z,
    onLoadError,
    onLoadSuccess,
}) {
    const groupRef = useRef();
    const meshRef = useRef();
    const { viewport } = useThree();

    // Load texture
    const texture = useTexture("/black.png", (loadedTexture) => {
        console.log("Black texture loaded successfully");
        onLoadSuccess?.();
    }, (error) => {
        console.error("Black texture load failed:", error);
        onLoadError?.(error);
    });

    const [ready, setReady] = useState(false);

    // Smoothing references
    const smoothPos = useRef(new THREE.Vector3(0, positionOffsetY, positionOffsetZ));
    const smoothScale = useRef(baseScale);

    useEffect(() => {
        if (texture) {
            texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
            setReady(true);
        }
    }, [texture]);

    useFrame(() => {
        const group = groupRef.current;
        const mesh = meshRef.current;

        if (!group || !mesh || !ready) return;

        if (!poseLandmarks || poseLandmarks.length === 0) {
            group.visible = false;
            return;
        }

        const ls = poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
        const rs = poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
        const lh = poseLandmarks[POSE_LANDMARKS.LEFT_HIP];
        const rh = poseLandmarks[POSE_LANDMARKS.RIGHT_HIP];

        if (!ls || !rs || !lh || !rh) {
            group.visible = false;
            return;
        }

        group.visible = true;

        // Original tracking logic that worked
        const shoulderCenterX = (ls.x + rs.x) / 2;
        const shoulderCenterY = (ls.y + rs.y) / 2;
        const hipCenterX = (lh.x + rh.x) / 2;
        const hipCenterY = (lh.y + rh.y) / 2;
        const torsoCenterX = (shoulderCenterX + hipCenterX) / 2;
        const torsoCenterY = (shoulderCenterY + hipCenterY) / 2;

        // Convert to 3D coordinates
        const targetX = (torsoCenterX - 0.5) * viewport.width;
        const targetY = -(torsoCenterY - 0.5) * viewport.height + positionOffsetY;

        // Smooth position
        smoothPos.current.x = lerp(smoothPos.current.x, targetX, SMOOTHING);
        smoothPos.current.y = lerp(smoothPos.current.y, targetY, SMOOTHING);

        group.position.set(smoothPos.current.x, smoothPos.current.y, positionOffsetZ);

        // Rotation: align with shoulders
        const shoulderAngle = Math.atan2(rs.y - ls.y, rs.x - ls.x);
        const userRotation = degToRad(orientation);

        // Scale based on shoulder width & torso height
        const shoulderWidth = Math.abs(rs.x - ls.x);
        const torsoHeight = Math.abs(hipCenterY - shoulderCenterY);
        const scaleFactor = 1 + shoulderWidth * 3 + torsoHeight * 2;
        const targetScale = baseScale * scaleFactor;

        smoothScale.current = lerp(smoothScale.current, targetScale, SMOOTHING);
        group.scale.setScalar(smoothScale.current);

        // Apply rotations with model adjustments
        group.rotation.set(
            degToRad(modelRotationX),
            degToRad(modelRotationY) + userRotation,
            degToRad(modelRotationZ) + shoulderAngle
        );
    });

    if (!texture) return null;

    return (
        <group ref={groupRef}>
            <mesh ref={meshRef}>
                <planeGeometry args={[1, 1.2]} />
                <meshPhysicalMaterial
                    map={texture}
                    transparent={true}
                    opacity={0.9}
                    side={THREE.DoubleSide}
                    alphaTest={0.1}
                    depthWrite={false}
                />
            </mesh>

            {/* Simple neck blending ring */}
            <mesh position={[0, 0.45, 0.01]} rotation={[degToRad(5), 0, 0]}>
                <ringGeometry args={[0.18, 0.22, 16]} />
                <meshBasicMaterial
                    color="#000000"
                    transparent={true}
                    opacity={0.3}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

/* =========================
   HoodieModel — robust loader + placement (ORIGINAL WORKING VERSION)
   ========================= */
function HoodieModel({
    modelUrl = "/models/tshirt.glb",
    poseLandmarks,
    orientation = 0,
    baseScale = DEFAULT_BASE_SCALE,
    positionOffsetY = DEFAULT_POSITION_OFFSET_Y,
    positionOffsetZ = DEFAULT_POSITION_OFFSET_Z,
    modelRotationX = DEFAULT_MODEL_ROTATION_X,
    modelRotationY = DEFAULT_MODEL_ROTATION_Y,
    modelRotationZ = DEFAULT_MODEL_ROTATION_Z,
    onLoadError,
    onLoadSuccess,
}) {
    const outerRef = useRef(null);
    const modelContainerRef = useRef(null);
    const modelRef = useRef(null);
    const { viewport } = useThree();

    const [ready, setReady] = useState(false);
    const [loadError, setLoadError] = useState(null);

    // load GLTF using hook
    const gltf = useGLTF(modelUrl, true);

    // Preload for quicker failure logs (optional)
    useEffect(() => {
        try {
            useGLTF.preload(modelUrl);
        } catch (e) {
            // ignore
        }
    }, [modelUrl]);

    // setup model once gltf is available
    useEffect(() => {
        if (!gltf || !gltf.scene || !outerRef.current) {
            return;
        }

        try {
            // Clear previous contents
            outerRef.current.clear();

            // Create a container group for the model
            const modelContainer = new THREE.Group();
            modelContainerRef.current = modelContainer;

            // Clone the scene/mesh
            const cloned = gltf.scene.clone(true);
            modelRef.current = cloned;

            // Center the cloned model around origin
            const box = new THREE.Box3().setFromObject(cloned);
            const center = box.getCenter(new THREE.Vector3());
            cloned.position.sub(center);

            // apply per-mesh fixes
            safeTraverseSetMeshProps(cloned, (mesh) => {
                mesh.frustumCulled = false;
                if (mesh.material) {
                    // ensure material is not fully transparent and is double-sided
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach((m) => {
                            m.side = THREE.DoubleSide;
                            if (m.color) m.color.multiplyScalar(1.0);
                            m.transparent = !!m.transparent;
                            m.opacity = 0.9; // Reduced opacity for blending
                            m.needsUpdate = true;
                        });
                    } else {
                        mesh.material.side = THREE.DoubleSide;
                        mesh.material.opacity = 0.9; // Reduced opacity for blending
                        mesh.material.needsUpdate = true;
                    }
                }
            });

            // add the cloned model to the container
            modelContainer.add(cloned);

            // Apply model-specific rotations
            modelContainer.rotation.set(
                degToRad(modelRotationX),
                degToRad(modelRotationY),
                degToRad(modelRotationZ)
            );

            // apply a modest default scale
            const uniformScale = Math.max(0.001, 1.0);
            modelContainer.scale.setScalar(uniformScale);

            // add to outer group which is actually returned to scene
            outerRef.current.add(modelContainer);

            // success
            setReady(true);
            setLoadError(null);
            onLoadSuccess?.();
            console.log("Model loaded and attached.");
        } catch (err) {
            console.error("Model setup failed:", err);
            setLoadError(String(err));
            onLoadError?.(err);
        }
    }, [gltf, modelRotationX, modelRotationY, modelRotationZ, onLoadError, onLoadSuccess]);

    // update position / rotation / scale each frame based on detected pose
    const smoothPos = useRef(new THREE.Vector3(0, positionOffsetY, positionOffsetZ));
    const smoothScale = useRef(baseScale);

    useFrame(() => {
        const outer = outerRef.current;
        const container = modelContainerRef.current;
        if (!outer || !container || !ready) return;

        if (!poseLandmarks || poseLandmarks.length === 0) {
            outer.visible = false;
            return;
        }

        const ls = poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER];
        const rs = poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
        const lh = poseLandmarks[POSE_LANDMARKS.LEFT_HIP];
        const rh = poseLandmarks[POSE_LANDMARKS.RIGHT_HIP];

        if (!ls || !rs || !lh || !rh) {
            outer.visible = false;
            return;
        }

        outer.visible = true;

        // ORIGINAL WORKING TRACKING LOGIC
        const shoulderCenterX = (ls.x + rs.x) / 2;
        const shoulderCenterY = (ls.y + rs.y) / 2;
        const hipCenterX = (lh.x + rh.x) / 2;
        const hipCenterY = (lh.y + rh.y) / 2;
        const torsoCenterX = (shoulderCenterX + hipCenterX) / 2;
        const torsoCenterY = (shoulderCenterY + hipCenterY) / 2;

        // convert normalized to viewport coords
        const targetX = (torsoCenterX - 0.5) * viewport.width;
        const targetY = -(torsoCenterY - 0.5) * viewport.height + positionOffsetY;

        // smoothing
        smoothPos.current.x = lerp(smoothPos.current.x, targetX, SMOOTHING);
        smoothPos.current.y = lerp(smoothPos.current.y, targetY, SMOOTHING);
        outer.position.set(smoothPos.current.x, smoothPos.current.y, positionOffsetZ);

        // rotation: align with shoulders
        const shoulderAngle = Math.atan2(rs.y - ls.y, rs.x - ls.x);
        const userRotation = degToRad(orientation);

        // scale based on shoulder width & torso height
        const shoulderWidth = Math.abs(rs.x - ls.x);
        const torsoHeight = Math.abs(hipCenterY - shoulderCenterY);
        const scaleFactor = 1 + shoulderWidth * 3 + torsoHeight * 2;
        const targetScale = baseScale * scaleFactor;
        smoothScale.current = lerp(smoothScale.current, targetScale, SMOOTHING);

        // apply transforms
        outer.scale.setScalar(smoothScale.current);

        // rotation
        outer.rotation.set(0, userRotation, shoulderAngle);

        container.visible = true;
    });

    if (loadError) return null;

    return <group ref={outerRef} />;
}

/* =========================
   PoseSkeleton - visual debug
   ========================= */
function PoseSkeleton({ poseLandmarks }) {
    const { viewport } = useThree();
    if (!poseLandmarks || poseLandmarks.length === 0) return null;

    const drawSegment = (p1, p2, key) => {
        if (!p1 || !p2) return null;
        const x1 = (p1.x - 0.5) * viewport.width;
        const y1 = -(p1.y - 0.5) * viewport.height;
        const x2 = (p2.x - 0.5) * viewport.width;
        const y2 = -(p2.y - 0.5) * viewport.height;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const length = Math.hypot(x2 - x1, y2 - y1);
        const angle = Math.atan2(y2 - y1, x2 - x1);
        return (
            <mesh key={key} position={[midX, midY, 1]} rotation={[0, 0, angle]}>
                <boxGeometry args={[length, 0.06, 0.03]} />
                <meshBasicMaterial color="#22c55e" transparent opacity={0.9} />
            </mesh>
        );
    };

    return (
        <group>
            {drawSegment(poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER], poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER], "s-shoulder")}
            {drawSegment(poseLandmarks[POSE_LANDMARKS.LEFT_SHOULDER], poseLandmarks[POSE_LANDMARKS.LEFT_HIP], "ls-lh")}
            {drawSegment(poseLandmarks[POSE_LANDMARKS.RIGHT_SHOULDER], poseLandmarks[POSE_LANDMARKS.RIGHT_HIP], "rs-rh")}
            {drawSegment(poseLandmarks[POSE_LANDMARKS.LEFT_HIP], poseLandmarks[POSE_LANDMARKS.RIGHT_HIP], "hips")}
            {[POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.LEFT_HIP, POSE_LANDMARKS.RIGHT_HIP, POSE_LANDMARKS.NOSE].map((idx) => {
                const p = poseLandmarks[idx];
                if (!p) return null;
                const x = (p.x - 0.5) * viewport.width;
                const y = -(p.y - 0.5) * viewport.height;
                return (
                    <mesh key={"dot-" + idx} position={[x, y, 1]}>
                        <sphereGeometry args={[0.18, 12, 12]} />
                        <meshBasicMaterial color={idx === POSE_LANDMARKS.NOSE ? "#ef4444" : "#3b82f6"} />
                    </mesh>
                );
            })}
        </group>
    );
}

/* =========================
   Main component
   ========================= */
export default function ARTryOnViewer({ modelUrl = "/hoodie.glb" }) {
    const webcamRef = useRef(null);
    const poseRef = useRef(null);
    const frameRef = useRef(null);

    const [poseLandmarks, setPoseLandmarks] = useState([]);
    const [status, setStatus] = useState("Initializing...");
    const [error, setError] = useState(null);
    const [displayMode, setDisplayMode] = useState("model");
    const [showSkeleton, setShowSkeleton] = useState(true);
    const [orientation, setOrientation] = useState(0);
    const [modelLoadError, setModelLoadError] = useState(null);
    const [modelLoaded, setModelLoaded] = useState(false);

    const [baseScale, setBaseScale] = useState(DEFAULT_BASE_SCALE);
    const [positionOffsetY, setPositionOffsetY] = useState(DEFAULT_POSITION_OFFSET_Y);
    const [positionOffsetZ, setPositionOffsetZ] = useState(DEFAULT_POSITION_OFFSET_Z);

    const [modelRotationX, setModelRotationX] = useState(DEFAULT_MODEL_ROTATION_X);
    const [modelRotationY, setModelRotationY] = useState(DEFAULT_MODEL_ROTATION_Y);
    const [modelRotationZ, setModelRotationZ] = useState(DEFAULT_MODEL_ROTATION_Z);

    const [isMenuMinimized, setIsMenuMinimized] = useState(false);

    // Check if the modelUrl is an image
    const isImageModel = () => {
        if (!modelUrl) return false;
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];
        return imageExtensions.some(ext => modelUrl.toLowerCase().endsWith(ext));
    };

    // Initialize MediaPipe Pose and camera loop
    useEffect(() => {
        let mounted = true;
        const init = async () => {
            try {
                setStatus("Loading pose detector...");
                const pose = new Pose({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
                });

                pose.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                });

                pose.onResults((results) => {
                    if (!mounted) return;
                    setPoseLandmarks(results.poseLandmarks || []);
                });

                poseRef.current = pose;

                setStatus("Waiting for camera...");
                await new Promise((resolve) => {
                    const check = setInterval(() => {
                        const v = webcamRef.current?.video;
                        if (v && v.readyState >= 2 && v.videoWidth > 0) {
                            clearInterval(check);
                            resolve();
                        }
                    }, 80);
                    setTimeout(() => {
                        clearInterval(check);
                        resolve();
                    }, 12000);
                });

                setStatus("Starting tracking...");
                const loop = async () => {
                    if (!mounted || !poseRef.current) return;
                    const video = webcamRef.current?.video;
                    if (video && video.readyState >= 2) {
                        try {
                            await poseRef.current.send({ image: video });
                        } catch (e) { }
                    }
                    frameRef.current = requestAnimationFrame(loop);
                };
                loop();

                setStatus("Ready");
            } catch (err) {
                console.error("Pose init error:", err);
                setError("Pose initialization failed: " + (err?.message || err));
            }
        };

        init();

        return () => {
            mounted = false;
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            if (poseRef.current) {
                try {
                    poseRef.current.close();
                } catch (e) { }
            }
        };
    }, []);

    const rotateModel = () => setOrientation((p) => (p + 90) % 360);
    const resetSettings = () => {
        setBaseScale(DEFAULT_BASE_SCALE);
        setPositionOffsetY(DEFAULT_POSITION_OFFSET_Y);
        setPositionOffsetZ(DEFAULT_POSITION_OFFSET_Z);
        setOrientation(0);
        setModelRotationX(DEFAULT_MODEL_ROTATION_X);
        setModelRotationY(DEFAULT_MODEL_ROTATION_Y);
        setModelRotationZ(DEFAULT_MODEL_ROTATION_Z);
    };
    const cycleDisplay = () => setDisplayMode((m) => (m === "debug" ? "fallback" : m === "fallback" ? "model" : "debug"));
    const toggleMenu = () => setIsMenuMinimized(!isMenuMinimized);

    const applyRotationPreset = (preset) => {
        switch (preset) {
            case 'upright':
                setModelRotationX(0);
                setModelRotationY(0);
                setModelRotationZ(0);
                break;
            case 'lying_down_front':
                setModelRotationX(-90);
                setModelRotationY(0);
                setModelRotationZ(0);
                break;
            case 'lying_down_back':
                setModelRotationX(90);
                setModelRotationY(0);
                setModelRotationZ(0);
                break;
            case 'sideways_left':
                setModelRotationX(0);
                setModelRotationY(-90);
                setModelRotationZ(0);
                break;
            case 'sideways_right':
                setModelRotationX(0);
                setModelRotationY(90);
                setModelRotationZ(0);
                break;
            case 'upside_down':
                setModelRotationX(180);
                setModelRotationY(0);
                setModelRotationZ(0);
                break;
            default:
                break;
        }
    };

    if (error) {
        return (
            <div style={{ width: "100%", height: "100vh", background: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 42 }}>⚠️</div>
                    <div style={{ fontWeight: 700, marginTop: 8 }}>Error</div>
                    <div style={{ marginTop: 8 }}>{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#000" }}>
            <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={true}
                videoConstraints={{
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: "user"
                }}
                onUserMediaError={() => setError("Camera access denied")}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    zIndex: 0
                }}
            />

            <Canvas
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                    pointerEvents: "none"
                }}
                camera={{
                    fov: 45,
                    position: [0, 0, 5],
                    near: 0.01,
                    far: 1000
                }}
                gl={{
                    alpha: true,
                    antialias: true
                }}
            >
                <ambientLight intensity={2.0} />
                <directionalLight position={[5, 5, 5]} intensity={2.0} />
                <directionalLight position={[-5, 5, 5]} intensity={1.2} />
                <pointLight position={[0, 0, 5]} intensity={1.0} />

                <Suspense fallback={null}>
                    {displayMode === "debug" && <mesh position={[0, 0, 0]}><boxGeometry args={[0.6, 1.0, 0.3]} /><meshStandardMaterial color="#10b981" transparent opacity={0.8} /></mesh>}
                    {displayMode === "fallback" && <FallbackTShirt poseLandmarks={poseLandmarks} positionOffsetY={positionOffsetY} baseScale={baseScale} positionOffsetZ={positionOffsetZ} orientation={orientation} />}
                    {displayMode === "model" && (
                        isImageModel() ? (
                            <PNGImageModel
                                imageUrl={modelUrl}
                                poseLandmarks={poseLandmarks}
                                orientation={orientation}
                                baseScale={baseScale}
                                positionOffsetY={positionOffsetY}
                                positionOffsetZ={positionOffsetZ}
                                modelRotationX={modelRotationX}
                                modelRotationY={modelRotationY}
                                modelRotationZ={modelRotationZ}
                                onLoadError={(err) => {
                                    console.error("Image load failed:", err);
                                    setModelLoadError(String(err));
                                }}
                                onLoadSuccess={() => {
                                    setModelLoaded(true);
                                    setModelLoadError(null);
                                }}
                            />
                        ) : (
                            <HoodieModel
                                modelUrl={modelUrl}
                                poseLandmarks={poseLandmarks}
                                orientation={orientation}
                                baseScale={baseScale}
                                positionOffsetY={positionOffsetY}
                                positionOffsetZ={positionOffsetZ}
                                modelRotationX={modelRotationX}
                                modelRotationY={modelRotationY}
                                modelRotationZ={modelRotationZ}
                                onLoadError={(err) => {
                                    console.error("Model load failed:", err);
                                    setModelLoadError(String(err));
                                }}
                                onLoadSuccess={() => {
                                    setModelLoaded(true);
                                    setModelLoadError(null);
                                }}
                            />
                        )
                    )}
                    {showSkeleton && <PoseSkeleton poseLandmarks={poseLandmarks} />}
                </Suspense>
            </Canvas>

            {/* Controls */}
            <div style={{
                position: "absolute",
                left: 12,
                top: 12,
                zIndex: 6,
                width: isMenuMinimized ? 50 : 320,
                background: "rgba(0,0,0,0.85)",
                color: "#fff",
                padding: 12,
                borderRadius: 10,
                transition: "width 0.3s ease",
                overflow: "hidden"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: isMenuMinimized ? 0 : 8
                }}>
                    {!isMenuMinimized && (
                        <div style={{ fontWeight: 800, fontSize: 14 }}>
                            🎯 AR Try-On — {isImageModel() ? "2D Image" : "3D Model"}
                        </div>
                    )}
                    <button
                        onClick={toggleMenu}
                        style={{
                            background: "rgba(255,255,255,0.2)",
                            border: "none",
                            color: "white",
                            borderRadius: 4,
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontSize: 12
                        }}
                    >
                        {isMenuMinimized ? "☰" : "✕"}
                    </button>
                </div>

                {!isMenuMinimized && (
                    <>
                        <div style={{ fontSize: 13, marginBottom: 10 }}>
                            Mode: <strong>{displayMode}</strong> | Type: <strong>{isImageModel() ? "Image" : "3D"}</strong>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                            <button onClick={cycleDisplay} style={{ flex: 1, padding: 8, fontSize: 12 }}>Cycle Mode</button>
                            <button onClick={() => setShowSkeleton(s => !s)} style={{ flex: 1, padding: 8, fontSize: 12 }}>
                                {showSkeleton ? "Skeleton ON" : "Skeleton OFF"}
                            </button>
                        </div>

                        <div style={{ marginBottom: 12, padding: 8, background: "rgba(255,255,255,0.1)", borderRadius: 6 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Quick Rotation Presets:</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                <button onClick={() => applyRotationPreset('upright')} style={{ padding: 4, fontSize: 11 }}>Upright</button>
                                <button onClick={() => applyRotationPreset('lying_down_front')} style={{ padding: 4, fontSize: 11 }}>Lying Front</button>
                                <button onClick={() => applyRotationPreset('lying_down_back')} style={{ padding: 4, fontSize: 11 }}>Lying Back</button>
                                <button onClick={() => applyRotationPreset('sideways_left')} style={{ padding: 4, fontSize: 11 }}>Side Left</button>
                                <button onClick={() => applyRotationPreset('sideways_right')} style={{ padding: 4, fontSize: 11 }}>Side Right</button>
                                <button onClick={() => applyRotationPreset('upside_down')} style={{ padding: 4, fontSize: 11 }}>Upside Down</button>
                            </div>
                        </div>

                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 12, marginBottom: 4 }}>Model Rot X: {modelRotationX}°</div>
                            <input type="range" min={-180} max={180} step={1} value={modelRotationX} onChange={(e) => setModelRotationX(Number(e.target.value))} style={{ width: "100%" }} />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 12, marginBottom: 4 }}>Model Rot Y: {modelRotationY}°</div>
                            <input type="range" min={-180} max={180} step={1} value={modelRotationY} onChange={(e) => setModelRotationY(Number(e.target.value))} style={{ width: "100%" }} />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 12, marginBottom: 4 }}>Model Rot Z: {modelRotationZ}°</div>
                            <input type="range" min={-180} max={180} step={1} value={modelRotationZ} onChange={(e) => setModelRotationZ(Number(e.target.value))} style={{ width: "100%" }} />
                        </div>

                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 12, marginBottom: 4 }}>Size: {baseScale.toFixed(1)}x</div>
                            <input type="range" min={0.5} max={6} step={0.1} value={baseScale} onChange={(e) => setBaseScale(Number(e.target.value))} style={{ width: "100%" }} />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 12, marginBottom: 4 }}>Up/Down: {positionOffsetY.toFixed(2)}</div>
                            <input type="range" min={-3} max={1} step={0.05} value={positionOffsetY} onChange={(e) => setPositionOffsetY(Number(e.target.value))} style={{ width: "100%" }} />
                        </div>
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ fontSize: 12, marginBottom: 4 }}>Depth: {positionOffsetZ.toFixed(1)}</div>
                            <input type="range" min={-5} max={3} step={0.1} value={positionOffsetZ} onChange={(e) => setPositionOffsetZ(Number(e.target.value))} style={{ width: "100%" }} />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                            <button onClick={rotateModel} style={{ flex: 1, fontSize: 12 }}>Rotate ({orientation}°)</button>
                            <button onClick={resetSettings} style={{ flex: 1, fontSize: 12 }}>Reset All</button>
                        </div>
                    </>
                )}
            </div>

            {/* Status badge */}
            <div style={{
                position: "absolute",
                right: 12,
                top: 12,
                zIndex: 6,
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 14,
                fontSize: isMenuMinimized ? 12 : 14
            }}>
                <div style={{ fontWeight: 700, fontSize: "inherit" }}>
                    {poseLandmarks.length ? "Body Tracked" : status}
                </div>
                {displayMode === "model" && !isMenuMinimized && (
                    <div style={{ marginTop: 4, fontSize: 11 }}>
                        {modelLoaded ? `${isImageModel() ? "Image" : "Model"} loaded ✅` : modelLoadError ? "Load failed" : "Loading..."}
                    </div>
                )}
            </div>

            {/* Quick action buttons when menu is minimized */}
            {isMenuMinimized && (
                <div style={{
                    position: "absolute",
                    left: 12,
                    top: 70,
                    zIndex: 6,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8
                }}>
                    <button
                        onClick={cycleDisplay}
                        style={{
                            background: "rgba(0,0,0,0.7)",
                            border: "none",
                            color: "white",
                            borderRadius: 20,
                            padding: "8px",
                            cursor: "pointer",
                            fontSize: 12,
                            width: 40,
                            height: 40
                        }}
                        title="Cycle Display Mode"
                    >
                        M
                    </button>
                    <button
                        onClick={() => setShowSkeleton(s => !s)}
                        style={{
                            background: "rgba(0,0,0,0.7)",
                            border: "none",
                            color: "white",
                            borderRadius: 20,
                            padding: "8px",
                            cursor: "pointer",
                            fontSize: 12,
                            width: 40,
                            height: 40
                        }}
                        title="Toggle Skeleton"
                    >
                        S
                    </button>
                    <button
                        onClick={rotateModel}
                        style={{
                            background: "rgba(0,0,0,0.7)",
                            border: "none",
                            color: "white",
                            borderRadius: 20,
                            padding: "8px",
                            cursor: "pointer",
                            fontSize: 12,
                            width: 40,
                            height: 40
                        }}
                        title="Rotate Model"
                    >
                        R
                    </button>
                </div>
            )}
        </div>
    );
}