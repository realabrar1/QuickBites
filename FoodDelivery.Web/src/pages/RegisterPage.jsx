import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, Lock, Mail, User, Phone, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [error, setError] = useState('');

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(fullName, email, phoneNumber, password, role);
      alert('Registration successful! Please sign in with your credentials.');
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 150px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.25rem' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2.5rem', maxWidth: '480px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#FF5A1F', color: 'white', width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Utensils size={24} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#171717' }}>Create Your Account</h2>
          <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Join QuickBite for fast & delicious food delivery</p>
        </div>

        {error && (
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="Alex Developer"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.95rem' }}
              />
              <User size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="alex.dev@foodclub.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.95rem' }}
              />
              <Mail size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.95rem' }}
              />
              <Phone size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.6rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.95rem' }}
              />
              <Lock size={18} color="#9CA3AF" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Account Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.95rem', background: '#FFFFFF' }}
            >
              <option value="Customer">Customer</option>
              <option value="RestaurantOwner">Restaurant Owner</option>
              <option value="DeliveryPartner">Delivery Partner</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}>
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.9rem', marginTop: '1.5rem' }}>
          Already registered? <Link to="/login" style={{ color: '#FF5A1F', fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};
