import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Store, Truck, Package, Star } from 'lucide-react';
import { orderService } from '../services/orderService';
import { reviewService } from '../services/reviewService';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 8000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = () => {
    orderService.getById(id)
      .then(data => setOrder(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await reviewService.create(order.id, rating, comment);
      setReviewSubmitted(true);
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#6B7280' }}>Loading order status...</div>;
  if (!order) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Order not found.</div>;

  const statuses = [
    { key: 'PLACED', label: 'Order Placed', icon: Package },
    { key: 'CONFIRMED', label: 'Confirmed by Restaurant', icon: Store },
    { key: 'PREPARING', label: 'Chef is Preparing Food', icon: Clock },
    { key: 'READY', label: 'Ready for Pickup', icon: CheckCircle2 },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered Hot & Fresh', icon: CheckCircle2 }
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === order.orderStatus);

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2rem', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #F3F4F6', pb: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>Order #{order.orderNumber}</span>
            <h1 style={{ fontSize: '2rem', color: '#171717', marginTop: '0.2rem' }}>{order.restaurantName}</h1>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`status-pill status-${order.orderStatus}`}>{order.orderStatus.replace(/_/g, ' ')}</span>
            <p style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: '0.4rem' }}>Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        {/* Live Status Pipeline Timeline */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', position: 'relative', margin: '3rem 0' }}>
          {statuses.map((step, idx) => {
            const isCompleted = idx <= currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.key} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: isCurrent ? '#FF5A1F' : isCompleted ? '#10B981' : '#F3F4F6',
                  color: isCompleted || isCurrent ? '#FFFFFF' : '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.8rem',
                  boxShadow: isCurrent ? '0 0 0 6px rgba(255,90,31,0.2)' : 'none',
                  transition: 'all 0.3s ease'
                }}>
                  <StepIcon size={22} />
                </div>

                <h4 style={{ fontSize: '0.85rem', fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500, color: isCurrent ? '#FF5A1F' : isCompleted ? '#171717' : '#9CA3AF' }}>
                  {step.label}
                </h4>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Section (Shown if Delivered) */}
      {order.orderStatus === 'DELIVERED' && (
        <div style={{ background: '#FFF9F5', borderRadius: '24px', padding: '2rem', border: '1px solid #FFEFE6', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#171717' }}>Rate Your Experience</h3>
          <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.25rem' }}>How was your food from {order.restaurantName}?</p>

          {reviewSubmitted ? (
            <p style={{ color: '#10B981', fontWeight: 700 }}>Thank you for your review!</p>
          ) : (
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Star size={28} color="#F59E0B" fill={star <= rating ? '#F59E0B' : 'none'} />
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Share feedback on taste, packaging, or delivery..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '0.9rem' }}
              />

              <button type="submit" className="btn-primary" style={{ width: 'fit-content' }}>Submit Review</button>
            </form>
          )}
        </div>
      )}

      {/* Order Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Order Items</h3>
          {order.items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid #F3F4F6' }}>
              <span>{item.quantity}x {item.foodName}</span>
              <span style={{ fontWeight: 700 }}>₹{item.totalPrice}</span>
            </div>
          ))}

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800 }}>
            <span>Grand Total</span>
            <span style={{ color: '#FF5A1F' }}>₹{order.grandTotal}</span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin color="#FF5A1F" /> Delivery Address
          </h3>
          <h4 style={{ fontSize: '1rem', color: '#171717' }}>{order.address?.fullName}</h4>
          <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.5, margin: '0.4rem 0' }}>
            {order.address?.houseFlat}, {order.address?.street}, {order.address?.area}, {order.address?.city}
          </p>
          <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>Phone: {order.address?.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};
