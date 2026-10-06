import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, MapPin, User, LogOut, Shield, Store, Truck, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav style={{ background: '#FFFFFF', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px', gap: '1.5rem' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#171717' }}>
          <div style={{ background: '#FF5A1F', color: 'white', padding: '0.45rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Utensils size={22} />
          </div>
          <span style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            Quick<span style={{ color: '#FF5A1F' }}>Bite</span>
          </span>
        </Link>

        {/* Location Selector & Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, maxWidth: '580px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6B7280', fontSize: '0.9rem', fontWeight: 500, background: '#F9FAFB', padding: '0.5rem 0.8rem', borderRadius: '9999px', border: '1px solid #E5E7EB' }}>
            <MapPin size={16} color="#FF5A1F" />
            <span style={{ color: '#171717', fontWeight: 600 }}>Bangalore</span>
          </div>

          <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder="Search for restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.6rem',
                borderRadius: '9999px',
                border: '1px solid #E5E7EB',
                background: '#F9FAFB',
                fontSize: '0.9rem'
              }}
            />
            <Search size={17} color="#9CA3AF" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
          </form>
        </div>

        {/* Nav Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/restaurants" style={{ fontWeight: 600, fontSize: '0.95rem', color: '#374151' }}>
            Explore
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', borderRadius: '9999px', background: '#FFF0EB', color: '#FF5A1F', fontWeight: 700, fontSize: '0.9rem' }}>
            <ShoppingBag size={18} />
            <span>Cart</span>
            {totalItemCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#FF5A1F',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}>
                {totalItemCount}
              </span>
            )}
          </Link>

          {/* User Role Links & Profile */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {user?.role === 'RestaurantOwner' && (
                <Link to="/restaurant-dashboard" className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                  <Store size={16} /> Partner Portal
                </Link>
              )}
              {user?.role === 'DeliveryPartner' && (
                <Link to="/delivery-dashboard" className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                  <Truck size={16} /> Deliveries
                </Link>
              )}
              {user?.role === 'Admin' && (
                <Link to="/admin-dashboard" className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
                  <Shield size={16} /> Admin Portal
                </Link>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F3F4F6', padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>
                <User size={16} color="#4B5563" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.fullName?.split(' ')[0]}</span>
                <button onClick={logout} title="Logout" style={{ background: 'none', border: 'none', color: '#EF4444', marginLeft: '0.3rem', cursor: 'pointer' }}>
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
