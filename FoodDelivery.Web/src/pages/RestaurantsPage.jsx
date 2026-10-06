import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Star, Clock, Filter } from 'lucide-react';
import { restaurantService } from '../services/restaurantService';

export const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') || '';
  const cuisine = searchParams.get('cuisine') || '';
  const sort = searchParams.get('sort') || 'rating';

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    restaurantService.getAll(search, cuisine, sort)
      .then(data => setRestaurants(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [search, cuisine, sort]);

  const handleSearchChange = (e) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (e.target.value) p.set('search', e.target.value);
      else p.delete('search');
      return p;
    });
  };

  const handleCuisineSelect = (c) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      if (c === cuisine) p.delete('cuisine');
      else p.set('cuisine', c);
      return p;
    });
  };

  const handleSortChange = (e) => {
    setSearchParams(prev => {
      const p = new URLSearchParams(prev);
      p.set('sort', e.target.value);
      return p;
    });
  };

  const cuisinesList = ['Biryani', 'South Indian', 'North Indian', 'Chinese', 'Mughlai', 'Tandoori', 'Desserts'];

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      {/* Header & Controls */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.4rem', color: '#171717', marginBottom: '0.5rem' }}>Explore Restaurants</h1>
        <p style={{ color: '#6B7280' }}>Discover top dining choices & delivered favorites in your area</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Sidebar Filters */}
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', color: '#171717' }}>
            <Filter size={18} color="#FF5A1F" /> Filters
          </div>

          {/* Search Box */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Search</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Restaurant or food..."
                value={search}
                onChange={handleSearchChange}
                style={{ width: '100%', padding: '0.5rem 0.8rem 0.5rem 2.2rem', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.9rem' }}
              />
              <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Sort By */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Sort By</label>
            <select
              value={sort}
              onChange={handleSortChange}
              style={{ width: '100%', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '0.9rem', background: '#FFFFFF' }}
            >
              <option value="rating">Top Rated</option>
              <option value="deliveryfee">Lowest Delivery Fee</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>

          {/* Cuisine Filters */}
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.6rem' }}>Cuisines</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {cuisinesList.map(c => (
                <button
                  key={c}
                  onClick={() => handleCuisineSelect(c)}
                  style={{
                    textAlign: 'left',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: cuisine === c ? 700 : 500,
                    background: cuisine === c ? '#FFF0EB' : 'transparent',
                    color: cuisine === c ? '#FF5A1F' : '#4B5563',
                    border: 'none'
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>Fetching restaurants...</p>
          ) : restaurants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E5E7EB' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No restaurants found</h3>
              <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Try broadening your search or clearing filters.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {restaurants.map(r => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/restaurants/${r.id}`)}
                  className="card"
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ height: '170px', width: '100%', position: 'relative' }}>
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
                    <h3 style={{ fontSize: '1.2rem', color: '#171717', marginBottom: '0.3rem' }}>{r.name}</h3>
                    <p style={{ color: '#6B7280', fontSize: '0.85rem', marginBottom: '0.8rem' }}>{r.cuisineType}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.8rem', borderTop: '1px solid #F3F4F6', fontSize: '0.85rem', color: '#4B5563' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} color="#FF5A1F" /> 30-35 mins
                      </span>
                      <span>₹{r.deliveryFee} fee</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
