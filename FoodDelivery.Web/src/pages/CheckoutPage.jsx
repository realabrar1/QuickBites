import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, Plus, CheckCircle, ShieldCheck } from 'lucide-react';
import { addressService } from '../services/addressService';
import { orderService } from '../services/orderService';
import { useCart } from '../context/CartContext';

export const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();

  const couponCode = location.state?.couponCode || '';

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // New Address Form State
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phoneNumber: '',
    houseFlat: '',
    street: '',
    area: '',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560001',
    addressType: 'Home'
  });

  useEffect(() => {
    addressService.getAll()
      .then(data => {
        setAddresses(data);
        if (data.length > 0) {
          const defaultAddr = data.find(a => a.isDefault) || data[0];
          setSelectedAddressId(defaultAddr.id);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const created = await addressService.create(newAddr);
      setAddresses([...addresses, created]);
      setSelectedAddressId(created.id);
      setShowAddressModal(false);
    } catch (err) {
      alert(err.message || 'Could not save address.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert('Please select a delivery address.');
      return;
    }

    setLoading(true);
    try {
      const order = await orderService.checkout({
        addressId: selectedAddressId,
        paymentMethod,
        couponCode: couponCode || null,
        specialInstructions
      });

      await fetchCart();
      navigate(`/order-tracking/${order.id}`);
    } catch (err) {
      alert(err.message || 'Order placement failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Your cart is empty.</div>;
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#171717', marginBottom: '2rem' }}>Checkout & Payment</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Step 1: Delivery Address */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin color="#FF5A1F" /> 1. Select Delivery Address
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>No saved addresses. Please add an address to continue.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    style={{
                      padding: '1rem',
                      borderRadius: '14px',
                      border: selectedAddressId === addr.id ? '2px solid #FF5A1F' : '1px solid #E5E7EB',
                      background: selectedAddressId === addr.id ? '#FFF9F5' : '#FFFFFF',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {selectedAddressId === addr.id && (
                      <CheckCircle size={18} color="#FF5A1F" style={{ position: 'absolute', top: '0.8rem', right: '0.8rem' }} />
                    )}
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.5rem', background: '#F3F4F6', borderRadius: '4px', textTransform: 'uppercase' }}>
                      {addr.addressType}
                    </span>
                    <h4 style={{ fontSize: '1rem', marginTop: '0.5rem', marginBottom: '0.2rem' }}>{addr.fullName}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.4 }}>
                      {addr.houseFlat}, {addr.street}, {addr.area}, {addr.city} - {addr.postalCode}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#374151', marginTop: '0.4rem' }}>Phone: {addr.phoneNumber}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard color="#FF5A1F" /> 2. Payment Method
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                onClick={() => setPaymentMethod('COD')}
                style={{
                  padding: '1.25rem',
                  borderRadius: '14px',
                  border: paymentMethod === 'COD' ? '2px solid #FF5A1F' : '1px solid #E5E7EB',
                  background: paymentMethod === 'COD' ? '#FFF9F5' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}
              >
                <Banknote size={24} color="#FF5A1F" />
                <div>
                  <h4 style={{ fontSize: '1rem' }}>Cash on Delivery</h4>
                  <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Pay cash upon food arrival</p>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('Online')}
                style={{
                  padding: '1.25rem',
                  borderRadius: '14px',
                  border: paymentMethod === 'Online' ? '2px solid #FF5A1F' : '1px solid #E5E7EB',
                  background: paymentMethod === 'Online' ? '#FFF9F5' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem'
                }}
              >
                <CreditCard size={24} color="#2A9D8F" />
                <div>
                  <h4 style={{ fontSize: '1rem' }}>Online Payment</h4>
                  <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>UPI, Cards, NetBanking</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Special Instructions */}
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem' }}>Delivery Instructions (Optional)</h3>
            <textarea
              placeholder="e.g. Please leave at front door, ring doorbell, make it extra spicy..."
              value={specialInstructions}
              onChange={e => setSpecialInstructions(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Order Summary & Place Order */}
        <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Final Order Summary</h3>

          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
            {cart.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span>{item.quantity}x {item.foodName}</span>
                <span style={{ fontWeight: 600 }}>₹{item.totalPrice}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.4rem' }}>
              <span>Subtotal</span>
              <span>₹{cart.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.4rem' }}>
              <span>Delivery Fee</span>
              <span>₹{cart.deliveryFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#171717', paddingTop: '0.6rem', borderTop: '1px dashed #E5E7EB' }}>
              <span>Grand Total</span>
              <span style={{ color: '#FF5A1F' }}>₹{cart.grandTotal}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            <ShieldCheck size={20} />
            <span>{loading ? 'Placing Order...' : 'Place Order Now'}</span>
          </button>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '20px', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Add Delivery Address</h3>
            <form onSubmit={handleCreateAddress} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input type="text" placeholder="Full Name" required value={newAddr.fullName} onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              <input type="text" placeholder="Phone Number" required value={newAddr.phoneNumber} onChange={e => setNewAddr({ ...newAddr, phoneNumber: e.target.value })} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              <input type="text" placeholder="House / Flat No." required value={newAddr.houseFlat} onChange={e => setNewAddr({ ...newAddr, houseFlat: e.target.value })} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              <input type="text" placeholder="Street / Road" required value={newAddr.street} onChange={e => setNewAddr({ ...newAddr, street: e.target.value })} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              <input type="text" placeholder="Area / Locality" required value={newAddr.area} onChange={e => setNewAddr({ ...newAddr, area: e.target.value })} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="City" value={newAddr.city} onChange={e => setNewAddr({ ...newAddr, city: e.target.value })} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <input type="text" placeholder="Pincode" value={newAddr.postalCode} onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })} style={{ width: '100px', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E5E7EB' }} />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddressModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
