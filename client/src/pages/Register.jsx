import React, { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(formData);
    if (res.success) {
      navigate('/profile');
    } else {
      setError(res.error);
    }
  };

  return (
    <PageWrapper>
      <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass" 
          style={{ width: '100%', maxWidth: '450px', padding: '40px', background: '#ffffff', textAlign: 'center' }}
        >
          <h2 style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}>Join Noed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Create an account to track your blueprints.</p>
          
          {error && <div style={{ color: 'red', marginBottom: '20px', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} style={{ padding: '15px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: '#fafafa' }} />
              <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} style={{ padding: '15px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: '#fafafa' }} />
            </div>
            <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} style={{ padding: '15px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: '#fafafa' }} />
            <input type="password" name="password" placeholder="Password" required onChange={handleChange} style={{ padding: '15px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: '#fafafa' }} />
            
            <button type="submit" className="btn-primary" style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}>Create Account</button>
          </form>

          <p style={{ marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>Sign In</Link>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
