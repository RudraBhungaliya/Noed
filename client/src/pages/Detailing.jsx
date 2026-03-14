import React, { useState, useRef } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { UploadCloud } from 'lucide-react';
import axios from 'axios';

export default function Detailing() {
  const [desc, setDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef();

  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc) return alert("Please provide schematic details.");

    try {
      const orderPayload = {
        customerName: "Guest User",
        customerEmail: "guest@example.com",
        type: "Custom",
        amount: "Pending Estimation",
        customDescription: desc,
        referenceFileName: fileName
      };
      
      await axios.post('http://localhost:5000/api/orders', orderPayload);
      setSuccess(true);
      
      // Still open mail client for immediate thread attachment
      const email = "omdhola05@gmail.com";
      const subject = encodeURIComponent("New Custom 3D Print Order Request - Noed");
      const body = encodeURIComponent(`Hello Noed Team,\n\nI have submitted a custom request via the portal.\n\nDescription:\n${desc}\n\n${fileName ? `(I have a reference image/model: ${fileName})` : ''}\n\nPlease let me know the estimated cost and feasibility.`);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    } catch (err) {
      console.error("Order submission failed:", err);
      alert("Failed to submit custom request order to system.");
    }
  };

  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '40px 10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Custom Orders</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
          Describe your required 3D print in absolute detail. Our AI and expert engineers at Noed will review your request.
        </p>
        
        {success ? (
          <div className="glass" style={{ width: '100%', maxWidth: '600px', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--accent-primary)', marginBottom: '15px' }}>Blueprint Submitted.</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Your schematic request has been successfully saved to the Noed Engineering database. We will reply to your email thread with an estimation shortly.</p>
          </div>
        ) : (
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
        )}
      </div>
    </PageWrapper>
  );
}
