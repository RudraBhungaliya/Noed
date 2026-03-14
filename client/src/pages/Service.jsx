import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { MessageSquare, Phone, Mail } from 'lucide-react';

export default function Service() {
  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '40px 10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--accent-primary)' }}>Contact & Support</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', textAlign: 'center' }}>
          Get in touch with the Noed engineering team for any assistance regarding your 3D prints.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '50px', width: '100%', maxWidth: '900px' }}>
          
          <div className="glass" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', background: '#ffffff' }}>
            <MessageSquare size={40} color="var(--accent-primary)" />
            <h3 style={{ color: 'var(--text-primary)' }}>Live Chat</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chat directly with a 3D printing specialist.</p>
            <button className="btn-secondary">Start Chat</button>
          </div>

          <div className="glass" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', background: '#ffffff' }}>
            <Phone size={40} color="var(--accent-primary)" />
            <h3 style={{ color: 'var(--text-primary)' }}>Phone Support</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Call our customer service directly.</p>
            <button className="btn-secondary">Call Us</button>
          </div>

          <div className="glass" style={{ padding: '30px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', background: '#ffffff' }}>
            <Mail size={40} color="var(--accent-primary)" />
            <h3 style={{ color: 'var(--text-primary)' }}>Email Us</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Send your queries via email.</p>
            <button className="btn-secondary">Send Email</button>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
