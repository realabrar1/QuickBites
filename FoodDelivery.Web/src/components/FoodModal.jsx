import React, { useState } from 'react';
import { X, Plus, Minus, Clock, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const FoodModal = ({ food, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!food) return null;

  const handleAdd = async () => {
    if (!isAuthenticated) {
      onClose();
      navigate('/login');
      return;
    }
    const success = await addToCart(food.id, quantity);
    if (success) {
      onClose();
    }
  };

  const finalPrice = food.discountPrice ?? food.price;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '520px',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.85)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            cursor: 'pointer'
          }}
        >
          <X size={20} color="#171717" />
        </button>

        {/* Food Image */}
        <div style={{ height: '240px', width: '100%', position: 'relative' }}>
          <img
            src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'}
            alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem' }}>
            <span className={food.isVegetarian ? 'badge-veg' : 'badge-nonveg'} style={{ background: 'white' }}>
              <span className={food.isVegetarian ? 'badge-veg-dot' : 'badge-nonveg-dot'}></span>
            </span>
          </div>
        </div>

        {/* Food Content */}
        <div style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#171717' }}>{food.name}</h3>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FF5A1F' }}>₹{finalPrice}</span>
              {food.discountPrice && (
                <span style={{ fontSize: '0.9rem', color: '#9CA3AF', textDecoration: 'line-through', marginLeft: '0.4rem' }}>
                  ₹{food.price}
                </span>
              )}
            </div>
          </div>

          <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {food.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6B7280', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            <Clock size={16} color="#FF5A1F" />
            <span>Prep time: {food.preparationTimeMinutes} mins</span>
          </div>

          {/* Quantity Controls & Add Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#F3F4F6', padding: '0.4rem 0.8rem', borderRadius: '9999px' }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Minus size={16} color="#374151" />
              </button>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', minWidth: '24px', textAlign: 'center' }}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <Plus size={16} color="#374151" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={loading}
              className="btn-primary"
              style={{ flex: 1, padding: '0.8rem' }}
            >
              <ShoppingBag size={18} />
              <span>Add to Cart • ₹{finalPrice * quantity}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
