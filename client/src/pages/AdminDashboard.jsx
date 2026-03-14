import React, { useState, useEffect } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { Users, Video, MessageSquare, Package, DollarSign, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function AdminDashboard() {
  const { isAdmin, logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'comms'
  const [activeChat, setActiveChat] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      const fetchOrders = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/orders/admin');
          setOrders(res.data);
        } catch (err) {
          console.error("Failed to fetch admin orders:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = () => {
    logoutAdmin();
    navigate('/');
  };

  return (
    <PageWrapper>
      <div className="page-container" style={{ padding: '20px 5%', maxWidth: '1400px' }}>
        
        {/* Dashboard Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
          <div>
            <h1 style={{ color: 'var(--accent-primary)', fontSize: '2rem', marginBottom: '5px' }}>Command Center</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Welcome back, O Dhola.</p>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Top Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'Total Sales', value: '₹20,700', icon: DollarSign },
            { label: 'Active Orders', value: '12', icon: Package },
            { label: 'Active Users', value: '4', icon: Users }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass"
              style={{ padding: '20px', background: '#ffffff', border: '1px solid rgba(0,0,128,0.1)', display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <div style={{ background: 'rgba(0,0,128,0.05)', padding: '15px', borderRadius: '12px' }}>
                <stat.icon size={28} color="var(--accent-primary)" />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>{stat.label}</p>
                <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
          
          {/* Sidebar Navigation */}
          <div className="glass" style={{ padding: '20px', background: '#ffffff', alignSelf: 'start' }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('orders')}
                  style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: activeTab === 'orders' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'orders' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  <Package size={20} /> Order Management
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('comms')}
                  style={{ width: '100%', padding: '15px', borderRadius: '8px', border: 'none', background: activeTab === 'comms' ? 'var(--accent-primary)' : 'transparent', color: activeTab === 'comms' ? '#fff' : 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', textAlign: 'left', fontWeight: 600, transition: 'all 0.2s' }}
                >
                  <MessageSquare size={20} /> Customer Comms
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div className="glass" style={{ padding: '30px', background: '#ffffff', minHeight: '500px' }}>
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 style={{ color: 'var(--text-primary)', marginBottom: '20px', fontSize: '1.3rem' }}>Recent Order Submissions</h2>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid rgba(0,0,128,0.1)' }}>
                          <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>ID</th>
                          <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Customer</th>
                          <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Type</th>
                          <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Status</th>
                          <th style={{ padding: '15px', color: 'var(--text-secondary)' }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Loading live database...</td></tr>
                        ) : orders.length === 0 ? (
                          <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No orders found in database.</td></tr>
                        ) : (
                          orders.map(order => (
                            <tr key={order._id} style={{ borderBottom: '1px solid rgba(0,0,128,0.05)' }}>
                              <td style={{ padding: '15px', fontWeight: 600, fontSize: '0.8rem' }}>...{order._id.substring(order._id.length - 6)}</td>
                              <td style={{ padding: '15px' }}>{order.customerName}</td>
                              <td style={{ padding: '15px' }}>
                                 <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', background: order.type === 'Custom' ? 'rgba(255,0,255,0.1)' : 'rgba(0,255,204,0.1)', color: order.type === 'Custom' ? '#d000d0' : '#00a080' }}>
                                   {order.type}
                                 </span>
                              </td>
                              <td style={{ padding: '15px' }}>{order.status}</td>
                              <td style={{ padding: '15px', fontWeight: 600, color: 'var(--accent-primary)' }}>{order.amount}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'comms' && (
                <motion.div key="comms" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', height: '500px', gap: '20px' }}>
                  {/* Chat List */}
                  <div style={{ width: '250px', borderRight: '1px solid rgba(0,0,128,0.1)', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Active Users</h3>
                    {['Alex Rivera', 'Pryia Singh'].map(user => (
                      <div 
                        key={user}
                        onClick={() => setActiveChat(user)}
                        style={{ padding: '15px', borderRadius: '8px', background: activeChat === user ? 'rgba(0,0,128,0.05)' : 'transparent', border: activeChat === user ? '1px solid var(--accent-primary)' : '1px solid var(--glass-border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                      >
                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {user.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chat Window */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {activeChat ? (
                      <>
                        <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,128,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ color: 'var(--text-primary)' }}>{activeChat}</h3>
                          <button className="btn-primary" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Video size={16} /> Start Video Call
                          </button>
                        </div>
                        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
                           <div style={{ alignSelf: 'flex-start', background: 'rgba(0,0,128,0.05)', padding: '15px', borderRadius: '12px 12px 12px 0', maxWidth: '80%' }}>
                             <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>Hi, I have a question about my custom print order ORD-001. Can we discuss the infill density?</p>
                           </div>
                        </div>
                        <div style={{ padding: '20px', borderTop: '1px solid rgba(0,0,128,0.1)', display: 'flex', gap: '10px' }}>
                          <input type="text" placeholder="Type a message..." style={{ flex: 1, padding: '12px', borderRadius: '4px', border: '1px solid var(--glass-border)', background: '#fafafa' }} />
                          <button className="btn-secondary">Send</button>
                        </div>
                      </>
                    ) : (
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                        Select a user to start messaging or video call.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
