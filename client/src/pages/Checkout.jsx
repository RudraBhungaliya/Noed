import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';

export default function Checkout() {
  const { cart, getCartTotal, removeFromCart } = useCart();
  const total = getCartTotal();
  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '40px 10%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--accent-primary)', marginBottom: '10px' }}>Checkout</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Secure your Noed 3D printed materials.</p>
        
        <div style={{ display: 'flex', gap: '40px', width: '100%', maxWidth: '1000px', flexWrap: 'wrap' }}>
          
          <div className="glass" style={{ flex: 1, minWidth: '300px', padding: '30px', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Order Summary</h2>
            
            {cart.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>Your cart is empty. Return to the Armory to add 3D prints.</p>
            ) : (
              cart.map(item => (
                <div key={item.id} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '15px', marginBottom: '15px', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 'bold' }}>{item.name} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>(x{item.quantity})</span></p>
                    <p style={{ fontSize: '0.8rem' }}>{item.material} - {item.finish}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{item.price}</span>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff4444' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
            
            <h3 style={{ color: 'var(--accent-primary)', marginTop: '20px' }}>Total: ₹{total.toLocaleString()}</h3>
          </div>

          <div className="glass" style={{ flex: 1, minWidth: '300px', padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#ffffff' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Payment & Delivery</h2>
            
            <div style={{ background: 'rgba(0,0,128,0.03)', padding: '15px', borderRadius: '4px', border: '1px solid rgba(0,0,128,0.1)' }}>
              <p style={{ fontWeight: 600, marginBottom: '5px', color: 'var(--text-primary)' }}>Delivery Partner: Shiprocket</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Estimated delivery: 3-5 standard days.</p>
            </div>

            <div style={{ background: 'rgba(0,0,128,0.03)', padding: '15px', borderRadius: '4px', border: '1px solid rgba(0,0,128,0.1)' }}>
              <p style={{ fontWeight: 600, marginBottom: '5px', color: 'var(--text-primary)' }}>UPI Payment Gateway</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Scan QR or enter VPA securely via your PSP app.</p>
            </div>

            <button className="btn-primary" style={{ marginTop: 'auto' }}>Pay Now</button>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
