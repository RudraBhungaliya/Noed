import React, { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Access Denied.');
    }
  };

  return (
    <PageWrapper>
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#ffffff', border: '1px solid rgba(0,0,128,0.2)' }}>
          <ShieldAlert size={48} color="var(--accent-primary)" style={{ marginBottom: '20px' }} />
          <h1 style={{ color: 'var(--text-primary)', marginBottom: '10px' }}>Admin Protocol</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', textAlign: 'center' }}>Secure access for Noed administration.</p>
          
          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ background: 'rgba(255,0,0,0.1)', color: 'red', padding: '10px', borderRadius: '4px', textAlign: 'center', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Admin Identity</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin name"
                style={{ padding: '12px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: '#fafafa', color: 'var(--text-primary)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <label style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Access Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{ padding: '12px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: '#fafafa', color: 'var(--text-primary)' }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Authenticate</button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
