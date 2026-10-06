import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, Plus, ShoppingBag } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import { FoodModal } from '../components/FoodModal';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const { cart, addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    restaurantService.getById(id)
      .then(data => {
        setRestaurant(data);
        if (data.categories && data.categories.length > 0) {
          setActiveCategory(data.categories[0].id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: '#6B7280' }}>Loading restaurant details...</div>;
  }

  if (!restaurant) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Restaurant not found.</div>;
  }

  return (
    <div>
      {/* Cover Header */}
      <div style={{ height: '280px', width: '100%', position: 'relative', background: '#171717' }}>
        <img
          src={restaurant.coverImageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80'}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', height: '140px' }} />
      </div>

      {/* Restaurant Meta Info */}
      <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10, marginBottom: '2.5rem' }}>
        <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem' }}>
              <h1 style={{ fontSize: '2.2rem', color: '#171717' }}>{restaurant.name}</h1>
              <span style={{ background: '#FEF3C7', color: '#D97706', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={15} fill="#D97706" /> {restaurant.rating} ({restaurant.totalRatings}+)
              </span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '1rem', marginBottom: '0.8rem' }}>{restaurant.cuisineType}</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', color: '#4B5563', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={16} color="#FF5A1F" /> {restaurant.address}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={16} color="#FF5A1F" /> {restaurant.openingTime} - {restaurant.closingTime}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Phone size={16} color="#FF5A1F" /> {restaurant.phone}
              </span>
            </div>
          </div>

          <div style={{ background: '#FFF9F5', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #FFEFE6', textAlign: 'right' }}>
            <p style={{ fontSize: '0.85rem', color: '#6B7280' }}>Delivery Fee</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FF5A1F', marginBottom: '0.4rem' }}>₹{restaurant.deliveryFee}</p>
            <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Min Order: ₹{restaurant.minimumOrderAmount}</p>
          </div>
        </div>
      </div>

      {/* Main Menu Grid */}
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Menu Content */}
        <div>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #E5E7EB' }}>
            {restaurant.categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  whiteSpace: 'nowrap',
                  background: activeCategory === cat.id ? '#FF5A1F' : '#FFFFFF',
                  color: activeCategory === cat.id ? '#FFFFFF' : '#4B5563',
                  border: activeCategory === cat.id ? 'none' : '1px solid #E5E7EB',
                  boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(255,90,31,0.25)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {cat.name} ({cat.foodItems.length})
              </button>
            ))}
          </div>

          {/* Food Items */}
          {restaurant.categories
            .filter(c => !activeCategory || c.id === activeCategory)
            .map(cat => (
              <div key={cat.id} style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.5rem', color: '#171717', marginBottom: '0.3rem' }}>{cat.name}</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{cat.description}</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  {cat.foodItems.map(food => (
                    <div key={food.id} className="card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ height: '150px', width: '100%', borderRadius: '12px', overflow: 'hidden', marginBottom: '0.8rem', position: 'relative' }}>
                          <img
                            src={food.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'}
                            alt={food.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div style={{ position: 'absolute', top: '0.6rem', left: '0.6rem' }}>
                            <span className={food.isVegetarian ? 'badge-veg' : 'badge-nonveg'} style={{ background: 'white' }}>
                              <span className={food.isVegetarian ? 'badge-veg-dot' : 'badge-nonveg-dot'}></span>
                            </span>
                          </div>
                        </div>

                        <h4 style={{ fontSize: '1.1rem', color: '#171717', marginBottom: '0.3rem' }}>{food.name}</h4>
                        <p style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '0.8rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {food.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.8rem', borderTop: '1px solid #F3F4F6' }}>
                        <div>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FF5A1F' }}>
                            ₹{food.discountPrice ?? food.price}
                          </span>
                          {food.discountPrice && (
                            <span style={{ fontSize: '0.8rem', color: '#9CA3AF', textDecoration: 'line-through', marginLeft: '0.3rem' }}>
                              ₹{food.price}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedFood(food)}
                          className="btn-secondary"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                        >
                          <Plus size={16} /> Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Sticky Cart Summary Sidebar */}
        <div style={{ position: 'sticky', top: '90px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag color="#FF5A1F" /> Your Cart
            </h3>

            {!cart || !cart.items || cart.items.length === 0 ? (
              <p style={{ color: '#6B7280', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>Your cart is empty.</p>
            ) : (
              <div>
                <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {cart.items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                      <span>{item.quantity}x {item.foodName}</span>
                      <span style={{ fontWeight: 600 }}>₹{item.totalPrice}</span>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.4rem' }}>
                    <span>Subtotal</span>
                    <span>₹{cart.subtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#6B7280', marginBottom: '0.4rem' }}>
                    <span>Delivery Fee</span>
                    <span>₹{cart.deliveryFee}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: '#171717', paddingTop: '0.4rem', borderTop: '1px dashed #E5E7EB' }}>
                    <span>Grand Total</span>
                    <span style={{ color: '#FF5A1F' }}>₹{cart.grandTotal}</span>
                  </div>
                </div>

                <Link to="/checkout" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedFood && (
        <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
};
