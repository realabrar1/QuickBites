import React, { useState, useEffect } from 'react';
import { Store, DollarSign, ShoppingBag, Utensils, CheckCircle, Clock, Plus, Eye } from 'lucide-react';
import { adminService } from '../services/adminService';
import { orderService } from '../services/orderService';
import { foodService } from '../services/foodService';
import { restaurantService } from '../services/restaurantService';

export const RestaurantDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Food Item Modal Form State
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [foodForm, setFoodForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    imageUrl: '',
    isVegetarian: true,
    categoryId: 1
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const myRest = await restaurantService.getOwnerRestaurants();
      setRestaurants(myRest);
      const restId = myRest.length > 0 ? myRest[0].id : null;
      setSelectedRestaurantId(restId);

      const [statsData, ordersData] = await Promise.all([
        adminService.getRestaurantStats(),
        orderService.getRestaurantOrders(restId)
      ]);
      setStats(statsData);
      setOrders(ordersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      const updatedOrders = await orderService.getRestaurantOrders(selectedRestaurantId);
      setOrders(updatedOrders);
    } catch (err) {
      alert(err.message || 'Could not update status.');
    }
  };

  const handleAddFoodSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRestaurantId) return;

    try {
      await foodService.create({
        ...foodForm,
        price: parseFloat(foodForm.price),
        discountPrice: foodForm.discountPrice ? parseFloat(foodForm.discountPrice) : null,
        restaurantId: selectedRestaurantId,
        categoryId: parseInt(foodForm.categoryId) || 1
      });
      setShowFoodModal(false);
      alert('Food item added successfully!');
      fetchDashboard();
    } catch (err) {
      alert(err.message || 'Failed to add food item.');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Partner Dashboard...</div>;

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', color: '#171717' }}>Restaurant Partner Portal</h1>
          <p style={{ color: '#6B7280' }}>Manage incoming orders, update food availability & track daily revenue</p>
        </div>

        <button onClick={() => setShowFoodModal(true)} className="btn-primary">
          <Plus size={18} /> Add New Dish
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <div style={{ background: '#FFF0EB', color: '#FF5A1F', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
            <DollarSign size={22} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Total Revenue</p>
          <h3 style={{ fontSize: '1.8rem', color: '#171717' }}>₹{stats?.totalRevenue ?? 0}</h3>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <div style={{ background: '#FEF3C7', color: '#D97706', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
            <ShoppingBag size={22} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Total Orders</p>
          <h3 style={{ fontSize: '1.8rem', color: '#171717' }}>{stats?.totalOrders ?? 0}</h3>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <div style={{ background: '#F3E8FF', color: '#9333EA', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
            <Clock size={22} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Pending Orders</p>
          <h3 style={{ fontSize: '1.8rem', color: '#171717' }}>{stats?.pendingOrdersCount ?? 0}</h3>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <div style={{ background: '#E0F2FE', color: '#0284C7', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
            <Utensils size={22} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Active Dishes</p>
          <h3 style={{ fontSize: '1.8rem', color: '#171717' }}>{stats?.totalMenuItems ?? 0}</h3>
        </div>
      </div>

      {/* Live Orders Feed */}
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', color: '#171717' }}>Incoming & Active Orders</h2>

      {orders.length === 0 ? (
        <div style={{ background: '#FFFFFF', padding: '3rem', textAlign: 'center', borderRadius: '20px', border: '1px solid #E5E7EB' }}>
          <p style={{ color: '#6B7280' }}>No incoming orders right now.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map(o => (
            <div key={o.id} style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>#{o.orderNumber}</span>
                  <span className={`status-pill status-${o.orderStatus}`}>{o.orderStatus.replace(/_/g, ' ')}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#374151', marginBottom: '0.4rem' }}>
                  Customer: <strong>{o.customerName}</strong> ({o.customerPhone})
                </p>
                <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                  Items: {o.items.map(i => `${i.quantity}x ${i.foodName}`).join(', ')}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF5A1F' }}>₹{o.grandTotal}</span>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>{o.paymentMethod} ({o.paymentStatus})</p>
                </div>

                {/* Status Action Buttons */}
                {o.orderStatus === 'PLACED' && (
                  <button onClick={() => handleUpdateStatus(o.id, 'CONFIRMED')} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                    Confirm Order
                  </button>
                )}
                {o.orderStatus === 'CONFIRMED' && (
                  <button onClick={() => handleUpdateStatus(o.id, 'PREPARING')} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: '#9333EA' }}>
                    Start Preparing
                  </button>
                )}
                {o.orderStatus === 'PREPARING' && (
                  <button onClick={() => handleUpdateStatus(o.id, 'READY')} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: '#16A34A' }}>
                    Mark Ready for Pickup
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Food Modal */}
      {showFoodModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '20px', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Add New Food Item</h3>
            <form onSubmit={handleAddFoodSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input type="text" placeholder="Dish Name" required value={foodForm.name} onChange={e => setFoodForm({ ...foodForm, name: e.target.value })} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              <textarea placeholder="Description" required value={foodForm.description} onChange={e => setFoodForm({ ...foodForm, description: e.target.value })} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" placeholder="Price (₹)" required value={foodForm.price} onChange={e => setFoodForm({ ...foodForm, price: e.target.value })} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <input type="number" placeholder="Discount Price (₹)" value={foodForm.discountPrice} onChange={e => setFoodForm({ ...foodForm, discountPrice: e.target.value })} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              </div>
              <input type="text" placeholder="Image URL (Unsplash/HTTP)" value={foodForm.imageUrl} onChange={e => setFoodForm({ ...foodForm, imageUrl: e.target.value })} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" id="vegCheck" checked={foodForm.isVegetarian} onChange={e => setFoodForm({ ...foodForm, isVegetarian: e.target.checked })} />
                <label htmlFor="vegCheck" style={{ fontSize: '0.9rem' }}>Vegetarian Dish</label>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowFoodModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Dish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
