import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, Tag, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { couponService } from '../services/couponService';

export const CartPage = () => {
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;

    try {
      const res = await couponService.validate(couponCode, cart.subtotal);
      setAppliedCoupon(res);
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code.');
      setAppliedCoupon(null);
    }
  };

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === 'Percentage'
      ? Math.min((cart.subtotal * appliedCoupon.discountValue) / 100, appliedCoupon.maximumDiscount || Infinity)
      : appliedCoupon.discountValue
    : 0;

  const finalGrandTotal = cart ? Math.max(0, cart.grandTotal - discountAmount) : 0;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '5rem 1.25rem', textAlign: 'center' }}>
        <div style={{ background: '#FFF0EB', color: '#FF5A1F', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
          <ShoppingBag size={40} />
        </div>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Your cart is empty</h2>
        <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Explore top restaurants and add your favorite dishes to get started.</p>
        <Link to="/restaurants" className="btn-primary">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#171717' }}>Your Shopping Cart</h1>
          <p style={{ color: '#6B7280' }}>Ordering from <strong style={{ color: '#171717' }}>{cart.restaurantName}</strong></p>
        </div>

        <button onClick={clearCart} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
          Clear Cart
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Cart Items List */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
          {cart.items.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem 0', borderBottom: '1px solid #F3F4F6' }}>
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80'}
                alt={item.foodName}
                style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
              />

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1.05rem', color: '#171717', marginBottom: '0.2rem' }}>{item.foodName}</h4>
                <p style={{ color: '#FF5A1F', fontWeight: 700, fontSize: '0.95rem' }}>₹{item.unitPrice}</p>
              </div>

              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: '#F3F4F6', padding: '0.35rem 0.7rem', borderRadius: '9999px' }}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Minus size={14} color="#374151" />
                </button>
                <span style={{ fontWeight: 700, fontSize: '0.95rem', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Plus size={14} color="#374151" />
                </button>
              </div>

              <span style={{ fontWeight: 800, fontSize: '1.1rem', minWidth: '70px', textAlign: 'right' }}>₹{item.totalPrice}</span>

              <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary & Coupon Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Coupon Input */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Tag size={16} color="#FF5A1F" /> Apply Coupon
            </h4>

            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Enter coupon code (QUICK50)"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.9rem', textTransform: 'uppercase' }}
              />
              <button type="submit" className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>Apply</button>
            </form>

            {appliedCoupon && (
              <p style={{ color: '#10B981', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>
                Coupon '{appliedCoupon.code}' applied! Saved ₹{discountAmount.toFixed(2)}.
              </p>
            )}
            {couponError && (
              <p style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{couponError}</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Bill Details</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem', color: '#4B5563', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Item Subtotal</span>
                <span>₹{cart.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee</span>
                <span>₹{cart.deliveryFee}</span>
              </div>
              {appliedCoupon && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 600 }}>
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: '#171717' }}>
              <span>Total Pay</span>
              <span style={{ color: '#FF5A1F' }}>₹{finalGrandTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => navigate('/checkout', { state: { couponCode: appliedCoupon?.code } })}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
