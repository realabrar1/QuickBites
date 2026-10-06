import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, CheckCircle, Package } from 'lucide-react';
import { orderService } from '../services/orderService';

export const DeliveryDashboardPage = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const [avail, my] = await Promise.all([
        orderService.getAvailableDeliveries(),
        orderService.getMyDeliveries()
      ]);
      setAvailableOrders(avail);
      setMyDeliveries(my);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      await orderService.acceptDelivery(orderId);
      alert('Delivery accepted!');
      fetchDeliveries();
    } catch (err) {
      alert(err.message || 'Could not accept delivery.');
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await orderService.updateStatus(orderId, 'DELIVERED');
      alert('Order marked as DELIVERED!');
      fetchDeliveries();
    } catch (err) {
      alert(err.message || 'Failed to update order status.');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Delivery Portal...</div>;

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#171717' }}>Delivery Partner Portal</h1>
        <p style={{ color: '#6B7280' }}>Accept pickup assignments & update live delivery statuses</p>
      </div>

      {/* Active Delivery Section */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#171717' }}>My Active & Assigned Deliveries</h2>
      {myDeliveries.length === 0 ? (
        <div style={{ background: '#FFFFFF', padding: '2rem', textAlign: 'center', borderRadius: '18px', border: '1px solid #E5E7EB', marginBottom: '3rem' }}>
          <p style={{ color: '#6B7280' }}>No active deliveries assigned yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
          {myDeliveries.map(o => (
            <div key={o.id} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800 }}>#{o.orderNumber}</span>
                  <span className={`status-pill status-${o.orderStatus}`}>{o.orderStatus.replace(/_/g, ' ')}</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#171717' }}>Pickup: {o.restaurantName}</h4>
                <p style={{ color: '#6B7280', fontSize: '0.85rem' }}>Drop Address: {o.address?.houseFlat}, {o.address?.street}, {o.address?.city}</p>
                <p style={{ color: '#4B5563', fontSize: '0.85rem' }}>Customer Phone: {o.address?.phoneNumber}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF5A1F' }}>₹{o.grandTotal}</span>
                {o.orderStatus !== 'DELIVERED' && (
                  <button onClick={() => handleMarkDelivered(o.id)} className="btn-primary" style={{ background: '#059669' }}>
                    <CheckCircle size={18} /> Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Pickups Section */}
      <h2 style={{ fontSize: '1.4rem', marginBottom: '1rem', color: '#171717' }}>Available Orders for Pickup</h2>
      {availableOrders.length === 0 ? (
        <div style={{ background: '#FFFFFF', padding: '2rem', textAlign: 'center', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <p style={{ color: '#6B7280' }}>No pending orders available for pickup right now.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {availableOrders.map(o => (
            <div key={o.id} className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ fontWeight: 800 }}>#{o.orderNumber}</span>
                <span style={{ color: '#FF5A1F', fontWeight: 700 }}>₹{o.deliveryFee} Fee</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{o.restaurantName}</h4>
              <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '1rem' }}>Destination: {o.address?.area}, {o.address?.city}</p>
              <button onClick={() => handleAccept(o.id)} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Accept Delivery
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
