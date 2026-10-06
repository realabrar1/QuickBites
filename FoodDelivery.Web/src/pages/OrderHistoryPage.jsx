import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, ShoppingBag } from 'lucide-react';
import { orderService } from '../services/orderService';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders()
      .then(data => setOrders(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#171717', marginBottom: '0.5rem' }}>Your Past Orders</h1>
      <p style={{ color: '#6B7280', marginBottom: '2rem' }}>Track live orders and view past delivery receipts</p>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E5E7EB' }}>
          <ShoppingBag size={48} color="#9CA3AF" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>No orders found</h3>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>You haven't placed any food orders yet.</p>
          <Link to="/restaurants" className="btn-primary">Explore Restaurants</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ background: '#FFFFFF', borderRadius: '18px', padding: '1.5rem', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#171717' }}>{order.restaurantName}</h3>
                  <span className={`status-pill status-${order.orderStatus}`}>{order.orderStatus.replace(/_/g, ' ')}</span>
                </div>
                <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '0.6rem' }}>
                  Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p style={{ color: '#4B5563', fontSize: '0.9rem' }}>
                  {order.items.map(i => `${i.quantity}x ${i.foodName}`).join(', ')}
                </p>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Total Paid</p>
                  <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FF5A1F' }}>₹{order.grandTotal}</p>
                </div>

                <Link to={`/order-tracking/${order.id}`} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                  <Eye size={16} /> Track Order
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
