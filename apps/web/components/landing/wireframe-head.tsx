import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

function ExplodingCube() {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const edgesRef = useRef<THREE.InstancedMesh>(null);
    const groupRef = useRef<THREE.Group>(null);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Create geometries once and memoize them
    const { boxGeo, edgesGeo } = useMemo(() => {
        const box = new THREE.BoxGeometry(0.55, 0.55, 0.55);
        const edges = new THREE.EdgesGeometry(box);
        return { boxGeo: box, edgesGeo: edges };
    }, []);

    const cubeData = useMemo(() => {
        const data: {
            basePosition: THREE.Vector3;
            fromCenter: THREE.Vector3;
        }[] = [];

        const gridSize = 3;
        const spacing = 0.65;
        const offset = (gridSize - 1) * spacing * 0.5;

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < gridSize; z++) {
                    const basePos = new THREE.Vector3(
                        x * spacing - offset,
                        y * spacing - offset,
                        z * spacing - offset
                    );

                    const fromCenter = basePos.clone().normalize();
                    if (basePos.length() === 0) fromCenter.set(0, 1, 0);

                    data.push({
                        basePosition: basePos,
                        fromCenter: fromCenter,
                    });
                }
            }
        }
        return data;
    }, []);

    // Initial setup
    useEffect(() => {
        if (meshRef.current && edgesRef.current) {
            cubeData.forEach((cube, i) => {
                dummy.position.copy(cube.basePosition);
                dummy.rotation.set(0, 0, 0);
                dummy.updateMatrix();
                meshRef.current?.setMatrixAt(i, dummy.matrix);
                edgesRef.current?.setMatrixAt(i, dummy.matrix);
            });
            meshRef.current.instanceMatrix.needsUpdate = true;
            edgesRef.current.instanceMatrix.needsUpdate = true;
        }
    }, [cubeData, dummy]);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.3;
            groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.1;
        }

        const pulseSpeed = 0.5;
        const oscillate = Math.sin(time * pulseSpeed);
        const pulse = (oscillate + 1) * 0.5;

        const maxExplosion = 0.5;
        const explosionStrength = pulse * maxExplosion;

        cubeData.forEach((data, i) => {
            const { basePosition, fromCenter } = data;
            dummy.position.copy(basePosition).addScaledVector(fromCenter, explosionStrength);

            const wiggle = explosionStrength * 0.5;
            dummy.rotation.x = Math.sin(time + i) * wiggle;
            dummy.rotation.y = Math.cos(time + i) * wiggle;
            dummy.rotation.z = Math.sin(time + i * 0.5) * wiggle;

            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            if (meshRef.current) meshRef.current.setMatrixAt(i, dummy.matrix);

            dummy.scale.set(1.001, 1.001, 1.001);
            dummy.updateMatrix();
            if (edgesRef.current) edgesRef.current.setMatrixAt(i, dummy.matrix);
        });

        if (meshRef.current) meshRef.current.instanceMatrix.needsUpdate = true;
        if (edgesRef.current) edgesRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <group ref={groupRef}>
            {/* Main Glass Cubes */}
            <instancedMesh ref={meshRef} args={[boxGeo, undefined, cubeData.length]}>
                {/* Material is passed as child, geometry is passed in args or prop */}
                <meshPhysicalMaterial
                    transparent
                    transmission={1}
                    opacity={1}
                    roughness={0.0}
                    metalness={0}
                    ior={1.5}
                    thickness={1.5}
                    color="#0f766e"
                    attenuationColor="#ffffff"
                    attenuationDistance={0.5}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    side={THREE.DoubleSide}
                />
            </instancedMesh>

            {/* Wireframe Edges */}
            <instancedMesh ref={edgesRef} args={[edgesGeo, undefined, cubeData.length]}>
                <lineBasicMaterial color="#2dd4bf" toneMapped={false} linewidth={1} />
            </instancedMesh>
        </group>
    );
}

export function WireframeHead() {
    return (
        <div className="w-full h-full relative">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
                dpr={[1, 1.5]}
            >
                <Environment preset="city" />

                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#0f766e" />

                <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                    <ExplodingCube />
                </Float>
            </Canvas>
        </div>
    );
}
