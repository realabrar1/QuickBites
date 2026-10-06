import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Star, Clock, ShieldCheck, Flame, ArrowRight, UtensilsCrossed } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';
import { FoodModal } from '../components/FoodModal';

export const HomePage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    restaurantService.getAll()
      .then(data => setRestaurants(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80' },
    { name: 'Dosa', img: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&q=80' },
    { name: 'North Indian', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&q=80' },
    { name: 'Chinese', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&q=80' },
    { name: 'Desserts', img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&q=80' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #FFF9F5 0%, #FFEFE6 100%)',
        padding: '4rem 0 5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#FFF0EB', color: '#FF5A1F', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              <Flame size={16} /> Hot & Fresh Delivery in 30 Mins
            </div>
            <h1 style={{ fontSize: '3.2rem', color: '#171717', marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
              Good food, delivered <span style={{ color: '#FF5A1F' }}>fast to your door.</span>
            </h1>
            <p style={{ color: '#6B7280', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '520px' }}>
              Discover top-rated local restaurants, authentic biryanis, crispy dosas, and delicious desserts delivered hot and ready to enjoy.
            </p>

            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', background: '#FFFFFF', padding: '0.5rem', borderRadius: '9999px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', maxWidth: '520px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flex: 1, paddingLeft: '1rem' }}>
                <Search size={20} color="#9CA3AF" />
                <input
                  type="text"
                  placeholder="Search for biryani, dosa, butter chicken..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '1rem' }}
                />
              </div>
              <button type="submit" className="btn-primary">Find Food</button>
            </form>
          </div>

          <div style={{ position: 'relative', textAlign: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
              alt="Delicious Food Spread"
              style={{ width: '100%', maxHeight: '440px', objectFit: 'cover', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
            />
          </div>
        </div>
      </section>

      {/* Category Icons Carousel */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#171717' }}>Popular Categories</h2>
          <Link to="/restaurants" style={{ color: '#FF5A1F', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            See All <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.25rem' }}>
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/restaurants?cuisine=${encodeURIComponent(cat.name)}`)}
              className="card"
              style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer' }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 0.8rem' }}
              />
              <h4 style={{ fontSize: '1rem', color: '#171717' }}>{cat.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#171717' }}>Top Rated Restaurants</h2>
            <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Verified restaurants near you in Bangalore</p>
          </div>
          <Link to="/restaurants" className="btn-secondary">View All Restaurants</Link>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>Loading delicious restaurants...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.75rem' }}>
            {restaurants.map(r => (
              <div
                key={r.id}
                onClick={() => navigate(`/restaurants/${r.id}`)}
                className="card"
                style={{ cursor: 'pointer' }}
              >
                <div style={{ height: '180px', width: '100%', position: 'relative' }}>
                  <img
                    src={r.coverImageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80'}
                    alt={r.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', background: '#FFFFFF', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', boxShadow: 'var(--shadow-sm)' }}>
                    <Star size={14} color="#F59E0B" fill="#F59E0B" /> {r.rating} ({r.totalRatings})
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: '#171717', marginBottom: '0.3rem' }}>{r.name}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{r.cuisineType}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid #F3F4F6', fontSize: '0.85rem', color: '#4B5563' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} color="#FF5A1F" /> 30-35 mins
                    </span>
                    <span>₹{r.deliveryFee} delivery fee</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why QuickBite */}
      <section style={{ background: '#FFFFFF', padding: '4rem 0', marginTop: '5rem', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Why Choose QuickBite?</h2>
          <p style={{ color: '#6B7280', marginBottom: '3rem' }}>The fastest, most reliable food delivery experience</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#FFF9F5', borderRadius: '20px' }}>
              <div style={{ background: '#FF5A1F', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Lightning Fast</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Hot & fresh food delivered directly to your doorstep in 30 mins.</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#FFF9F5', borderRadius: '20px' }}>
              <div style={{ background: '#2A9D8F', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Verified Hygiene</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Strict hygiene standards and quality checks across all partner restaurants.</p>
            </div>

            <div style={{ padding: '1.5rem', background: '#FFF9F5', borderRadius: '20px' }}>
              <div style={{ background: '#F59E0B', color: 'white', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <UtensilsCrossed size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Minimum Order</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Order a single coffee or a full family banquet with zero hassle.</p>
            </div>
          </div>
        </div>
      </section>

      {selectedFood && (
        <FoodModal food={selectedFood} onClose={() => setSelectedFood(null)} />
      )}
    </div>
  );
};
