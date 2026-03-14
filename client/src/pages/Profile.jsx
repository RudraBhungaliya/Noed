import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User, Package, Settings } from 'lucide-react';

export default function Profile() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '40px 10%' }}>
        <h1 style={{ color: 'var(--accent-primary)', marginBottom: '30px' }}>My Blueprint Hub</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          
          {/* User ID Card */}
          <motion.div className="glass" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '30px', background: '#ffffff', alignSelf: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #000)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px' }}>
              {user.firstName ? user.firstName.charAt(0) : <User size={40} />}
            </div>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '5px' }}>{user.firstName} {user.lastName}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '30px' }}>{user.email}</p>
            
            <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px' }}>
              <LogOut size={18} /> Sign Out
            </button>
          </motion.div>

          {/* Account Details & Orders */}
          <motion.div className="glass" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ padding: '30px', background: '#ffffff' }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(0,0,128,0.1)', paddingBottom: '10px' }}>
              <Settings size={20} color="var(--accent-primary)" /> Account Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>First Name</p>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.firstName || 'Not Set'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Last Name</p>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.lastName || 'Not Set'}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '5px' }}>Email</p>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.email}</p>
              </div>
            </div>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(0,0,128,0.1)', paddingBottom: '10px' }}>
              <Package size={20} color="var(--accent-primary)" /> Recent Deployments
            </h3>
            <div style={{ padding: '20px', background: 'rgba(0,0,128,0.02)', borderRadius: '8px', border: '1px dashed rgba(0,0,128,0.2)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No recent orders found. Check out the <Link to="/shop" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Product Catalog</Link> to start building.
            </div>
          </motion.div>

        </div>
      </div>
    </PageWrapper>
  );
}
