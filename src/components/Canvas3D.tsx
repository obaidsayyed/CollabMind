import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere({ position, color, scale = 1, speed = 2 }: { position: [number, number, number]; color: string; scale?: number; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });
  
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          roughness={0.2}
          metalness={0.9}
          distort={0.4}
          speed={3}
        />
      </Sphere>
    </Float>
  );
}

function AnimatedTorus({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Torus ref={meshRef} position={position} scale={scale} args={[1, 0.3, 16, 100]}>
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Torus>
    </Float>
  );
}

function AnimatedIcosahedron({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.15;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.8}>
      <Icosahedron ref={meshRef} position={position} scale={scale}>
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.9}
          wireframe
        />
      </Icosahedron>
    </Float>
  );
}

function Particles() {
  const count = 150;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);
  
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#8B5CF6" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

function RingParticles() {
  const count = 50;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 2;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return pos;
  }, []);
  
  const pointsRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#EC4899" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function GridLines() {
  return (
    <group position={[0, -5, 0]}>
      <gridHelper args={[40, 40, '#6366F1', '#6366F1']} rotation={[0, 0, 0]}>
        <meshBasicMaterial attach="material" color="#6366F1" wireframe transparent opacity={0.15} />
      </gridHelper>
    </group>
  );
}

export default function Canvas3D() {
  return (
    <div className="absolute inset-0">
      <Canvas
  camera={{ position: [0, 0, 10], fov: 60 }}
  gl={{ alpha: false }}
  onCreated={({ gl }) => {
    gl.setClearColor('#0B1120');
  }}
>
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={0.8} color="#8B5CF6" />
        <pointLight position={[10, 5, 5]} intensity={0.5} color="#EC4899" />
        
        <AnimatedSphere position={[-4, 1, -2]} color="#8B5CF6" scale={0.9} speed={2.5} />
        <AnimatedSphere position={[4, -1, -1]} color="#EC4899" scale={0.7} speed={2} />
        <AnimatedSphere position={[0, 2, -3]} color="#6366F1" scale={0.5} speed={3} />
        <AnimatedSphere position={[-2, -2, -2]} color="#A78BFA" scale={0.4} speed={2} />
        
        <AnimatedTorus position={[3, 2, -4]} color="#8B5CF6" scale={0.6} />
        <AnimatedTorus position={[-3, -1, -3]} color="#EC4899" scale={0.4} />
        
        <AnimatedIcosahedron position={[0, -2, -4]} color="#6366F1" scale={0.5} />
        
        <Particles />
        <RingParticles />
        <GridLines />
        
        <fog attach="fog" args={['#0B1120', 8, 30]} />
      </Canvas>
    </div>
  );
}
