import React, { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('customer'); // 'customer' or 'admin'
  const [formData, setFormData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  
  const { loginUser, loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      const success = loginAdmin(formData.username, formData.password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError("Command override denied. Invalid credentials.");
      }
    } else {
      const res = await loginUser({ email: formData.email, password: formData.password });
      if (res.success) {
        navigate('/profile');
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <PageWrapper>
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="glass" 
          style={{ width: '100%', maxWidth: '800px', display: 'flex', borderRadius: '12px', overflow: 'hidden', background: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,128,0.1)' }}
        >
          {/* Left Side: Role Selector & Branding */}
          <div style={{ flex: '1', background: 'linear-gradient(135deg, var(--bg-color-alt) 0%, rgba(0,0,128,0.05) 100%)', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: '1px solid rgba(0,0,128,0.1)' }}>
            <h2 style={{ color: 'var(--accent-primary)', marginBottom: '10px', fontSize: '2rem' }}>Authenticate</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>Select your portal authorization level.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <button 
                onClick={() => { setRole('customer'); setError(''); }}
                style={{ 
                  padding: '20px', 
                  borderRadius: '8px', 
                  border: `2px solid ${role === 'customer' ? 'var(--accent-primary)' : 'rgba(0,0,128,0.1)'}`, 
                  background: role === 'customer' ? '#ffffff' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '15px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: role === 'customer' ? 'var(--accent-primary)' : 'rgba(0,0,128,0.1)', color: role === 'customer' ? '#fff' : 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Customer Portal</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Access your blueprint hub</span>
                </div>
              </button>

              <button 
                onClick={() => { setRole('admin'); setError(''); }}
                style={{ 
                  padding: '20px', 
                  borderRadius: '8px', 
                  border: `2px solid ${role === 'admin' ? '#000' : 'rgba(0,0,128,0.1)'}`, 
                  background: role === 'admin' ? '#ffffff' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '15px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: role === 'admin' ? '#000' : 'rgba(0,0,128,0.1)', color: role === 'admin' ? '#fff' : 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldAlert size={20} />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <strong style={{ display: 'block', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Admin Command</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logistics and fulfillment</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Side: Dynamic Form */}
          <div style={{ flex: '1', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={role}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '25px', color: 'var(--text-primary)' }}>
                  {role === 'customer' ? 'Welcome Back' : 'Secure Override Protocol'}
                </h3>

                {error && <div style={{ color: 'red', marginBottom: '20px', fontSize: '0.9rem', padding: '10px', background: 'rgba(255,0,0,0.05)', borderRadius: '4px' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  {role === 'customer' ? (
                    <input type="email" name="email" placeholder="Email Address" required value={formData.email} onChange={handleChange} style={{ padding: '15px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: '#fafafa' }} />
                  ) : (
                    <input type="text" name="username" placeholder="Admin Identifier" required value={formData.username} onChange={handleChange} style={{ padding: '15px', borderRadius: '4px', border: '3px solid #000', background: '#fafafa', fontFamily: 'monospace' }} />
                  )}
                  
                  <input type="password" name="password" placeholder="Passkey" required value={formData.password} onChange={handleChange} style={{ padding: '15px', borderRadius: '4px', border: role === 'admin' ? '3px solid #000' : '1px solid var(--glass-border)', background: '#fafafa', fontFamily: role === 'admin' ? 'monospace' : 'inherit' }} />
                  
                  <button type="submit" className={role === 'admin' ? "" : "btn-primary"} style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px', background: role === 'admin' ? '#000' : '', color: role === 'admin' ? '#fff' : '', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                    {role === 'customer' ? 'Sign In' : 'Execute Override'}
                  </button>
                </form>

                {role === 'customer' && (
                  <p style={{ marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Register</Link>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
            
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
