import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import './App.css';
import Navbar from './components/Navbar';
import Background3D from './components/Background3D';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Detailing from './pages/Detailing';
import Checkout from './pages/Checkout';
import Service from './pages/Service';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  return (
    <AuthProvider>
      <CartProvider>
        <Background3D isHome={isHome} />
        <Navbar />
        <main className="content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/detailing" element={<Detailing />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/service" element={<Service />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </AnimatePresence>
        
        {/* Global Canvas for Drei Views - Solves multiple Canvas WebGL context limit crashing */}
        <Canvas 
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 100 }}
          eventSource={document.getElementById('root')}
          className="canvas-view-overlay"
        >
          <View.Port />
        </Canvas>
      </main>
      </CartProvider>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
