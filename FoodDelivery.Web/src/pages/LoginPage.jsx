import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(email, password);
      const role = res.user?.role;

      if (role === 'RestaurantOwner') navigate('/restaurant-dashboard');
      else if (role === 'DeliveryPartner') navigate('/delivery-dashboard');
      else if (role === 'Admin') navigate('/admin-dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', maxWidth: '440px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#FF5A1F', color: 'white', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Utensils size={24} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#171717' }}>Welcome Back</h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Sign in to your QuickBite account</p>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="customer@quickbite.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.95rem' }}
              />
              <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.95rem' }}
              />
              <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #F3F4F6' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Demo Quick Logins</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
            <button onClick={() => handleDemoFill('customer@quickbite.com', 'Customer@123')} className="btn-secondary" style={{ padding: '0.4rem', fontSize: '0.8rem' }}>Customer</button>
            <button onClick={() => handleDemoFill('ramesh@biryanihouse.com', 'Owner@123')} className="btn-secondary" style={{ padding: '0.4rem', fontSize: '0.8rem' }}>Restaurant Owner</button>
            <button onClick={() => handleDemoFill('delivery@quickbite.com', 'Delivery@123')} className="btn-secondary" style={{ padding: '0.4rem', fontSize: '0.8rem' }}>Delivery Partner</button>
            <button onClick={() => handleDemoFill('admin@quickbite.com', 'Admin@123')} className="btn-secondary" style={{ padding: '0.4rem', fontSize: '0.8rem' }}>Admin</button>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.9rem', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#FF5A1F', fontWeight: 600 }}>Create One</Link>
        </p>
      </div>
    </div>
  );
};
