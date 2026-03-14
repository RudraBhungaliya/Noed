import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Octahedron, Float, MeshDistortMaterial, Environment, Sphere, ContactShadows, Text3D, Center, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Standard 3D Geometry
function DetailedGeometry({ isHome, scaleRef }) {
  const groupRef = useRef();
  
  const physicalMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  }), []);

  const vividMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#00ffcc', // Vivid Cyan
    metalness: 0.3,
    roughness: 0.2,
    transmission: 0.9, 
    ior: 1.5,
    thickness: 0.5,
    envMapIntensity: 2,
    transparent: true,
  }), []);

  const darkMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ff00ff', // Vivid Magenta
    metalness: 0.8,
    roughness: 0.2,
    clearcoat: 0.5,
    transparent: true,
  }), []);

  useFrame((state, delta) => {
    // Only animate rotation if visible
    if(groupRef.current && scaleRef.current > 0.01) {
        // We add a slow orbital rotation to the entire group so objects pass behind the text
        groupRef.current.rotation.y += delta * 0.2;
        groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, -2]}>
      {/* Central Complex Object */}
      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
        <TorusKnot args={[1.2, 0.4, 256, 64]} position={[0, 0, -2]}>
          <primitive object={vividMaterial} attach="material" />
        </TorusKnot>
      </Float>

      {/* Floating Metallic Sphere */}
      <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
        <Sphere args={[0.9, 64, 64]} position={[-3, 1, 0]}>
          <primitive object={physicalMaterial} attach="material" />
        </Sphere>
      </Float>
      
      {/* Dark Geometric Sharp Object */}
      <Float speed={2.5} rotationIntensity={2} floatIntensity={1}>
        <Octahedron args={[1.4, 0]} position={[3, -1, 1]}>
          <primitive object={darkMaterial} attach="material" />
        </Octahedron>
      </Float>

      {/* Background Distorted Blob */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={3}>
        <Sphere args={[2, 64, 64]} position={[0, -2, -6]}>
          <MeshDistortMaterial color="#7000ff" distort={0.6} speed={1.5} roughness={0.1} metalness={0.9} />
        </Sphere>
      </Float>
    </group>
  );
}

// Transparent Silver Glass Text
function NoedText() {
  const textRef = useRef();

  // Subtle floating animation for the text
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });

  return (
    <group ref={textRef} position={[0, 1.2, 2]}>
      {/* Center aligns the text perfectly in the middle */}
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={3.5}
          height={0.8}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.05}
          bevelOffset={0}
          bevelSegments={8}
        >
          Noed
          <MeshTransmissionMaterial 
            backside
            thickness={3.0}
            roughness={0.05}
            transmission={1}
            ior={1.2}
            chromaticAberration={0.1}
            anisotropy={0.5}
            color="#ffffff" 
          />
        </Text3D>
      </Center>
    </group>
  );
}

// Controller for all Home 3D elements
function HomeScene({ isHome }) {
  const scaleRef = useRef(0);
  const groupRef = useRef();

  useFrame((state, delta) => {
    const targetScale = isHome ? 1 : 0;
    
    // Smooth damp towards target
    if (Math.abs(scaleRef.current - targetScale) > 0.005) {
      scaleRef.current = THREE.MathUtils.damp(scaleRef.current, targetScale, isHome ? 3 : 5, delta);
      
      let finalScale = scaleRef.current;
      if (isHome && scaleRef.current > 0.7) {
        finalScale += Math.sin(scaleRef.current * Math.PI) * 0.05;
      }
      
      if (groupRef.current) {
         groupRef.current.scale.set(finalScale, finalScale, finalScale);
      }
    } else {
        if (groupRef.current) {
            groupRef.current.scale.set(targetScale, targetScale, targetScale);
        }
    }
  });

  return (
    <group ref={groupRef} scale={[0,0,0]}>
      <NoedText />
      <DetailedGeometry isHome={isHome} scaleRef={scaleRef} />
    </group>
  );
}

export default function Background3D({ isHome }) {
  return (
    <div id="canvas-container" style={{ pointerEvents: isHome ? 'auto' : 'none', zIndex: isHome ? 1 : 0 }}>
      {/* Set zIndex 1 to allow canvas to render over HTML backgrounds on home, transparent otherwise */}
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} shadows>
        <color attach="background" args={['#ffffff']} /> {/* Canvas itself needs a white background so glass can refract it if nothing else is behind it, although we want the DOM strictly. Actually we want DOM to show through. We will omit attach="background". */}
        <Environment preset="city" />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#00ffcc" />
        <pointLight position={[0, 5, 0]} intensity={2} color="#ff00ff" />

        <HomeScene isHome={isHome} />

        <ContactShadows position={[0, -4, 0]} opacity={isHome ? 0.4 : 0.0} scale={20} blur={2} far={4.5} />
      </Canvas>
    </div>
  );
}
