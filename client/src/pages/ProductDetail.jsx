import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PageWrapper } from '../components/PageWrapper';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, ShieldCheck, Zap } from 'lucide-react';

function DetailedMesh({ geometryType }) {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  const materialColor = geometryType?.length % 2 === 0 ? "#00ffcc" : "#ff00ff";

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        {geometryType === 'dragon' && <torusKnotGeometry args={[1.5, 0.4, 256, 32]} />}
        {geometryType === 'planter' && <octahedronGeometry args={[2, 0]} />}
        {geometryType === 'gear' && <torusGeometry args={[1.8, 0.6, 32, 200]} />}
        {geometryType === 'map' && <dodecahedronGeometry args={[2, 0]} />}
        {geometryType === 'keycap' && <icosahedronGeometry args={[1.8, 0]} />}
        {geometryType === 'sculpture' && <coneGeometry args={[1.5, 3, 64]} />}
        
        <meshPhysicalMaterial 
          color={materialColor}
          metalness={0.9} 
          roughness={0.1} 
          clearcoat={1} 
          transmission={0.5}
          thickness={0.5}
        />
      </mesh>
    </Float>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 style={{ color: 'var(--accent-primary)' }}>Loading Hexagonal Schematics...</h2>
        </div>
      </PageWrapper>
    );
  }

  if (!product) {
    return (
      <PageWrapper>
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <h2 style={{ color: 'red' }}>Schematic Not Found</h2>
          <button className="btn-secondary" onClick={() => navigate('/shop')} style={{ marginTop: '20px' }}>Return to Catalog</button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '0', maxWidth: '100%', height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navbar Back Action */}
        <div style={{ padding: '20px 5%', display: 'flex', alignItems: 'center', zIndex: 10, position: 'absolute' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
            <ArrowLeft size={18} /> Back to Catalog
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(350px, 450px)', height: '100%' }}>
          
          {/* Left Side: Massive 3D Hexagonal Interactive View */}
          <div style={{ position: 'relative', height: '100%', background: 'radial-gradient(circle at center, rgba(0,0,128,0.05) 0%, #fafafa 100%)', overflow: 'hidden' }}>
            {/* Hexagonal Grid Overlay Background */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'103.92304845413264\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 25.98076211353316 L30 8.660254037844387 L60 25.98076211353316 L60 77.94228634059948 L30 95.26279441628825 L0 77.94228634059948 Z\' fill=\'none\' stroke=\'rgba(0,0,128,0.03)\' stroke-width=\'1\'/%3E%3C/svg%3E")',
              backgroundSize: '60px 103.92px',
              zIndex: 1,
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }}>
              <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 20, 10]} intensity={1.5} />
                <spotLight position={[-10, 10, 10]} angle={0.3} penumbra={1} intensity={2} color="#00ffcc" />
                <Environment preset="studio" />
                <DetailedMesh geometryType={product.geometryType} />
                <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
                <OrbitControls enablePan={false} enableZoom={true} minDistance={4} maxDistance={10} autoRotate={false} makeDefault />
              </Canvas>
            </div>
          </div>

          {/* Right Side: Data Panel */}
          <div className="glass" style={{ zIndex: 10, padding: '40px', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.95)', borderLeft: '1px solid rgba(0,0,128,0.1)', overflowY: 'auto' }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ display: 'inline-block', padding: '5px 10px', background: 'rgba(0,0,128,0.05)', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', borderRadius: '4px' }}>
                ID: {product.geometryType.toUpperCase()}-0{product.id}
              </div>
              
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '10px', lineHeight: 1.1 }}>
                {product.name}
              </h1>
              
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '30px' }}>
                {product.price}
              </p>

              <div style={{ background: '#fafafa', border: '1px solid rgba(0,0,128,0.05)', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '15px' }}>Technical Specifications</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Material</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{product.material}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Finish Grade</span>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{product.finish}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-secondary)' }}>
                  <ShieldCheck size={24} color="var(--accent-primary)" />
                  <span>QC Passed & Impact Tested</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--text-secondary)' }}>
                  <Zap size={24} color="#00cc66" />
                  <span>Rapid dispatch via Shiprocket</span>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  addToCart(product);
                  navigate('/checkout'); // Route straight to checkout for a premium flow
                }}
                className="btn-primary" 
                style={{ width: '100%', padding: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
              >
                <ShoppingCart size={24} /> Acquire Schematic
              </motion.button>
            </motion.div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
