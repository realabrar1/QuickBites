import React from 'react';
import { Utensils, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{ background: '#171717', color: '#9CA3AF', padding: '4rem 0 2rem', marginTop: '4rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#FFFFFF', marginBottom: '1rem' }}>
              <div style={{ background: '#FF5A1F', color: 'white', padding: '0.4rem', borderRadius: '10px' }}>
                <Utensils size={20} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Quick<span style={{ color: '#FF5A1F' }}>Bite</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Delivering happiness, one hot meal at a time. Verified top-rated restaurants, lightning-fast delivery.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem' }}>Company</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>About Us</li>
              <li>Careers</li>
              <li>Team</li>
              <li>QuickBite One</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem' }}>Contact & Support</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>Help & Support</li>
              <li>Partner with us</li>
              <li>Ride with us</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem' }}>We Deliver To</h4>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
              Bangalore, Hyderabad, Mumbai, Delhi NCR, Chennai, Pune, Ahmedabad, Kolkata
            </p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #262626', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.85rem' }}>
          <p>© 2026 QuickBite Food Platform. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with <Heart size={14} color="#FF5A1F" fill="#FF5A1F" /> for foodies everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
