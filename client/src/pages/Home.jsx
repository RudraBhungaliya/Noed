import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
        
        {/* The 'Noed' text is now rendered in 3D inside Background3D.jsx */}
        <div style={{ height: '120px', marginBottom: '1rem' }} />

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2.5rem' }}
        >
          Class-leading 3D printed materials and bespoke manufacturing. Experience premium quality, dynamic ordering, and unparalleled precision.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
          style={{ display: 'flex', gap: '20px' }}
        >
          <button className="btn-primary" onClick={() => navigate('/shop')}>Browse Products</button>
          <button className="btn-secondary" onClick={() => navigate('/detailing')}>Custom Orders</button>
        </motion.div>

      </div>
    </PageWrapper>
  );
}
