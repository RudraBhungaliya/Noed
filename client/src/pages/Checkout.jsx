import React, { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useCart } from '../context/CartContext';
import { Trash2 } from 'lucide-react';
import axios from 'axios';

export default function Checkout() {
  const { cart, getCartTotal, removeFromCart, clearCart } = useCart();
  const total = getCartTotal();
  const [success, setSuccess] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty.");

    try {
      const orderPayload = {
        customerName: "Guest User", // Mock guest for now
        customerEmail: "guest@example.com",
        type: "Shop",
        amount: `₹${total}`,
        items: cart.map(item => ({
          productId: item._id, // Live MongoDB ID
          quantity: item.quantity,
          price: item.price
        }))
      };

      await axios.post('http://localhost:5000/api/orders', orderPayload);
      clearCart();
      setSuccess(true);
    } catch (err) {
      console.error("Order submission failed:", err);
      alert("Failed to process order.");
    }
  };
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
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Secure Payment</h2>
            
            {success ? (
              <div style={{ padding: '20px', background: 'rgba(0,255,100,0.1)', border: '1px solid #00cc66', borderRadius: '8px', color: '#00cc66', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '10px' }}>Order Deployed!</h3>
                <p>Your 3D prints are scheduled for manufacturing. The Engineering team will notify you upon dispatch via Shiprocket.</p>
              </div>
            ) : (
              <>
                <div style={{ padding: '20px', background: 'rgba(0,0,128,0.02)', borderRadius: '8px', border: '1px solid rgba(0,0,128,0.1)' }}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" style={{ height: '30px', marginBottom: '15px' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>Scan with any UPI app to pay directly to Noed Engineering.</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Enter UPI ID (e.g., user@okicici)" style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
                    <button className="btn-secondary" style={{ padding: '10px 15px' }}>Verify</button>
                  </div>
                </div>

                <div style={{ padding: '20px', background: 'rgba(0,0,128,0.02)', borderRadius: '8px', border: '1px solid rgba(0,0,128,0.1)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Delivery Processing via Shiprocket</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>We partner with Shiprocket to guarantee rapid, secure dispatch of fragile 3D printed components nationwide. Tracking IDs are generated automatically post-fabrication.</p>
                </div>

                <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: 'auto' }}>
                  Authorize Payment (₹{total.toLocaleString()})
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
