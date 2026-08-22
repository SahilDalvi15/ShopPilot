import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Float, Environment, ContactShadows } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

// A premium looking abstract 3D object to act as our placeholder product
const PremiumObject = () => {
  const meshRef = useRef();

  // Gently rotate the object over time
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* A beautiful twisted knot shape */}
        <torusKnotGeometry args={[1, 0.3, 200, 32]} />
        {/* Metallic gold material */}
        <meshStandardMaterial 
          color="#d4af37" 
          metalness={0.9} 
          roughness={0.1} 
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
};

const Product3DViewer = () => {
  return (
    <div className="w-full h-full relative bg-gray-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-inner cursor-move flex items-center justify-center">
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Environment map for realistic reflections */}
        <Environment preset="city" />
        
        {/* Ambient light for base visibility */}
        <ambientLight intensity={0.5} />
        
        {/* Main directional light for shadows and highlights */}
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={1024}
        />
        <directionalLight 
          position={[-10, -10, -5]} 
          intensity={0.5} 
        />

        {/* The object itself */}
        <Stage environment="city" intensity={0.5} contactShadow={false}>
          <PremiumObject />
        </Stage>

        {/* High quality contact shadow underneath the object */}
        <ContactShadows 
          position={[0, -1.5, 0]} 
          opacity={0.7} 
          scale={10} 
          blur={2.5} 
          far={4} 
        />

        {/* Controls to let user rotate, pan, and zoom */}
        <OrbitControls 
          makeDefault 
          autoRotate 
          autoRotateSpeed={0.5} 
          enablePan={false}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
      
      {/* Helper text overlay */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <span className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md">
          Drag to rotate • Scroll to zoom
        </span>
      </div>
    </div>
  );
};

export default Product3DViewer;
