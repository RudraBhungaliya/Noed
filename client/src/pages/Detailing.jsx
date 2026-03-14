import React, { useState, useRef } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { UploadCloud } from 'lucide-react';

export default function Detailing() {
  const [desc, setDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!desc) return alert("Please provide schematic details.");
    
    // Construct email parameters
    const email = "omdhola05@gmail.com";
    const subject = encodeURIComponent("New Custom 3D Print Order Request - Noed");
    const body = encodeURIComponent(`Hello Noed Team,\n\nI would like to request a custom 3D print.\n\nDescription:\n${desc}\n\n${fileName ? `(I have a reference image/model: ${fileName})` : ''}\n\nPlease let me know the estimated cost and feasibility.`);
    
    // Open mail client
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '40px 10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Custom Orders</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
          Describe your required 3D print in absolute detail. Our AI and expert engineers at Noed will review your request.
        </p>
        
        <form onSubmit={handleSubmit} className="glass" style={{ width: '100%', maxWidth: '600px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ padding: '20px', border: '2px dashed rgba(0,0,128,0.2)', borderRadius: '8px', textAlign: 'center', background: 'rgba(0,0,128,0.02)', cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={() => fileInputRef.current.click()} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0,0,128,0.2)'}>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} accept="image/*,.stl,.obj" />
            <UploadCloud size={32} color="var(--accent-primary)" style={{ margin: '0 auto 10px' }} />
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '5px' }}>Upload Reference Image or 3D Model (.STL, .OBJ)</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{fileName ? `Attached: ${fileName}` : "Click to browse files"}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Specification Details</label>
            <textarea 
              rows={6}
              value={desc}
              required
              onChange={(e) => setDesc(e.target.value)}
              placeholder="E.g., 15cm height, PLA+, infill 20%, high impact resistance needed..."
              style={{
                background: '#ffffff',
                border: '1px solid var(--glass-border)',
                borderRadius: '4px',
                padding: '15px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                resize: 'vertical',
                transition: 'border-color 0.3s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--glass-border)'}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end', width: '100%' }}>Send Request to Engineering</button>
        </form>
      </div>
    </PageWrapper>
  );
}
