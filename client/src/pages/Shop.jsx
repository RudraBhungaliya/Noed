import React, { useRef, useState, useEffect } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, OrbitControls, View, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useCart } from '../context/CartContext';
import axios from 'axios';

// Component rendering a unique 3D primitive based on the product ID
function ProductMesh({ geometryType, isHovered }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Idle slow spin
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x += delta * 0.1;
      
      // Fast spin when hovered
      if (isHovered) {
        meshRef.current.rotation.y += delta * 4;
      }
    }
  });

  // Simple pseudo-random color assignment based on str length to keep the vibrant aesthetic
  const materialColor = geometryType.length % 2 === 0 ? "#00ffcc" : "#ff00ff";

  const materialContent = (
    <meshPhysicalMaterial 
      color={materialColor}
      metalness={0.8} 
      roughness={0.2} 
      clearcoat={1} 
    />
  );

  return (
    <Float speed={isHovered ? 4 : 2} rotationIntensity={isHovered ? 2 : 1} floatIntensity={1.5}>
      <mesh ref={meshRef}>
        {geometryType === 'dragon' && <torusKnotGeometry args={[0.5, 0.15, 100, 16]} />}
        {geometryType === 'planter' && <octahedronGeometry args={[0.7, 0]} />}
        {geometryType === 'gear' && <torusGeometry args={[0.6, 0.2, 16, 100]} />}
        {geometryType === 'map' && <dodecahedronGeometry args={[0.6, 0]} />}
        {geometryType === 'keycap' && <icosahedronGeometry args={[0.6, 0]} />}
        {geometryType === 'sculpture' && <coneGeometry args={[0.5, 1, 32]} />}
        {materialContent}
      </mesh>
    </Float>
  );
}

// Wrap the container reference properly for Drei View
function ProductViewer({ product, isHovered }) {
  const containerRef = useRef();

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <View track={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
        <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={45} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />
        <ProductMesh geometryType={product.geometryType} isHovered={isHovered} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} makeDefault />
      </View>
    </div>
  );
}

// Extracted InteractiveCard outside of Shop to prevent React from re-creating 
// the component on every Shop render (which causes full unmounting and lagging)
const InteractiveCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();

  // Motion values for tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth the motion values for butter-smooth transitions
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  // Map bounds to rotation values (max 15 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate cursor position relative to center [-0.5, 0.5]
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    // Reset rotation completely when leaving
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: "0 25px 40px rgba(0,0,128,0.2)",
        borderColor: "var(--accent-primary)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ 
        padding: '24px', 
        display: 'flex', 
        flexDirection: 'column', 
        background: '#ffffff', 
        border: '1px solid rgba(0,0,128,0.1)', 
        cursor: 'pointer', 
        transition: 'border-color 0.3s',
        perspective: 1000,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="glass"
    >
      {/* Inner div that translates Z on hover to give depth effect to content */}
      <motion.div style={{ transform: "translateZ(30px)", display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Individual 3D Viewer Container */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--bg-color-alt) 0%, rgba(0,0,128,0.02) 100%)', 
          height: '240px', 
          borderRadius: '8px', 
          marginBottom: '20px', 
          border: '1px solid rgba(0,0,128,0.05)',
          overflow: 'hidden',
          pointerEvents: 'auto'
        }}>
          <ProductViewer product={product} isHovered={isHovered} />
        </div>
        
        <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: 'var(--text-primary)', fontWeight: 800 }}>{product.name}</h3>
        
        <div style={{ marginBottom: '25px', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div style={{ background: 'rgba(0,0,128,0.03)', padding: '8px 12px', borderRadius: '4px' }}>
            <strong style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Material</strong>
            {product.material}
          </div>
          <div style={{ background: 'rgba(0,0,128,0.03)', padding: '8px 12px', borderRadius: '4px' }}>
            <strong style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Finish</strong>
            {product.finish}
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--accent-primary)' }}>{product.price}</span>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="btn-primary" 
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            Acquire
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products from backend:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '40px 10%' }}>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}
        >
          Product Catalog
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}
        >
          Premium 3D printed materials ready for dispatch. Hover to interact with schematics.
        </motion.p>
        
        {!loading ? (
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', perspective: 1000 }}
          >
            {products.map(product => (
              <InteractiveCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div style={{ color: 'var(--text-primary)', textAlign: 'center', marginTop: '50px' }}>Loading Live Inventory...</div>
        )}
      </div>
    </PageWrapper>
  );
}
