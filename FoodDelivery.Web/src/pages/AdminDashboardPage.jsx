import React, { useState, useEffect } from 'react';
import { Users, Store, ShoppingBag, DollarSign, Shield, CheckCircle, XCircle } from 'lucide-react';
import { adminService } from '../services/adminService';
import { restaurantService } from '../services/restaurantService';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsData, usersData, restData] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getAllUsers(),
        restaurantService.getAll()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setRestaurants(restData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      await adminService.toggleUserActive(userId);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Could not toggle user status.');
    }
  };

  const handleToggleRestaurantStatus = async (restId) => {
    try {
      await restaurantService.toggleStatus(restId);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Could not toggle restaurant status.');
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading Admin Control Center...</div>;

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#171717' }}>System Admin Control Center</h1>
        <p style={{ color: '#6B7280' }}>Platform analytics, user moderation, and restaurant management</p>
      </div>

      {/* Overview Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <div style={{ background: '#E0F2FE', color: '#0284C7', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
            <Users size={22} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Total Users</p>
          <h3 style={{ fontSize: '1.8rem', color: '#171717' }}>{stats?.totalUsers ?? 0}</h3>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <div style={{ background: '#FEF3C7', color: '#D97706', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
            <Store size={22} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Restaurants</p>
          <h3 style={{ fontSize: '1.8rem', color: '#171717' }}>{stats?.totalRestaurants ?? 0}</h3>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <div style={{ background: '#F3E8FF', color: '#9333EA', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
            <ShoppingBag size={22} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Total Orders</p>
          <h3 style={{ fontSize: '1.8rem', color: '#171717' }}>{stats?.totalOrders ?? 0}</h3>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <div style={{ background: '#DCFCE7', color: '#16A34A', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
            <DollarSign size={22} />
          </div>
          <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Total GMV Revenue</p>
          <h3 style={{ fontSize: '1.8rem', color: '#171717' }}>₹{stats?.totalRevenue ?? 0}</h3>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.95rem',
            background: activeTab === 'users' ? '#FF5A1F' : '#FFFFFF',
            color: activeTab === 'users' ? '#FFFFFF' : '#4B5563',
            border: activeTab === 'users' ? 'none' : '1px solid #E5E7EB',
            cursor: 'pointer'
          }}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('restaurants')}
          style={{
            padding: '0.6rem 1.25rem',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '0.95rem',
            background: activeTab === 'restaurants' ? '#FF5A1F' : '#FFFFFF',
            color: activeTab === 'restaurants' ? '#FFFFFF' : '#4B5563',
            border: activeTab === 'restaurants' ? 'none' : '1px solid #E5E7EB',
            cursor: 'pointer'
          }}
        >
          Restaurants ({restaurants.length})
        </button>
      </div>

      {/* User Accounts Table */}
      {activeTab === 'users' && (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#4B5563' }}>
              <tr>
                <th style={{ padding: '1rem' }}>User Name</th>
                <th style={{ padding: '1rem' }}>Email</th>
                <th style={{ padding: '1rem' }}>Phone</th>
                <th style={{ padding: '1rem' }}>Role</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{u.fullName}</td>
                  <td style={{ padding: '1rem', color: '#6B7280' }}>{u.email}</td>
                  <td style={{ padding: '1rem', color: '#6B7280' }}>{u.phoneNumber}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: '#FFF0EB', color: '#FF5A1F' }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: u.isActive ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleUserStatus(u.id)}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Restaurants Table */}
      {activeTab === 'restaurants' && (
        <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', color: '#4B5563' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Restaurant</th>
                <th style={{ padding: '1rem' }}>Cuisine</th>
                <th style={{ padding: '1rem' }}>Address</th>
                <th style={{ padding: '1rem' }}>Rating</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '1rem', color: '#6B7280' }}>{r.cuisineType}</td>
                  <td style={{ padding: '1rem', color: '#6B7280' }}>{r.address}</td>
                  <td style={{ padding: '1rem', fontWeight: 700 }}>★ {r.rating}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ color: r.isActive ? '#10B981' : '#EF4444', fontWeight: 700 }}>
                      {r.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleRestaurantStatus(r.id)}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      {r.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
