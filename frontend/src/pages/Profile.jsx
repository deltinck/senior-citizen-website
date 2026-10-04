import React, { useState, useEffect } from 'react';
import { User, Phone, Printer, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'Eleanor Vance',
    age: 72,
    address: '42 Oakwood Lane, Greenfield',
    emergency_contact: 'Robert Vance (Son)',
    emergency_phone: '+1 (555) 019-2834',
    health_conditions: 'Hypertension, Osteoarthritis',
    allergies: 'Penicillin, Dust Mites'
  });

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/profile/')
      .then(res => {
        if (res.data?.name) setProfile(res.data);
      })
      .catch(() => {
        const local = JSON.parse(localStorage.getItem('sage_profile') || 'null');
        if (local) setProfile(local);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/profile/', profile)
      .then(() => {
        alert('Profile saved!');
      })
      .catch(() => {
        localStorage.setItem('sage_profile', JSON.stringify(profile));
        alert('Profile saved locally!');
      });
  };

  return (
    <main className="sc-container">
      <div className="sc-hero" style={{ background: 'linear-gradient(135deg, #2d7a6e 0%, #489b8d 100%)' }}>
        <h1><User size={32} /> Senior Profile & Emergency Medical ID</h1>
        <p>Keep your contact details and medical information accessible for emergencies.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Edit Profile Form */}
        <div className="sc-card">
          <div className="sc-card-title"><User size={20} /> Edit Personal Details</div>
          <form onSubmit={handleSubmit}>
            <div className="sc-form-group">
              <label>Full Name</label>
              <input type="text" className="sc-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
            </div>

            <div className="sc-form-group" style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label>Age</label>
                <input type="number" className="sc-input" value={profile.age} onChange={e => setProfile({ ...profile, age: e.target.value })} required />
              </div>
              <div style={{ flex: 2 }}>
                <label>Home Address</label>
                <input type="text" className="sc-input" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} />
              </div>
            </div>

            <div className="sc-form-group" style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label>Emergency Contact Name</label>
                <input type="text" className="sc-input" value={profile.emergency_contact} onChange={e => setProfile({ ...profile, emergency_contact: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label>Emergency Phone</label>
                <input type="tel" className="sc-input" value={profile.emergency_phone} onChange={e => setProfile({ ...profile, emergency_phone: e.target.value })} />
              </div>
            </div>

            <div className="sc-form-group">
              <label>Health Conditions</label>
              <input type="text" className="sc-input" value={profile.health_conditions} onChange={e => setProfile({ ...profile, health_conditions: e.target.value })} />
            </div>

            <div className="sc-form-group">
              <label>Known Allergies</label>
              <input type="text" className="sc-input" value={profile.allergies} onChange={e => setProfile({ ...profile, allergies: e.target.value })} />
            </div>

            <button type="submit" className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Save size={18} /> Save Profile
            </button>
          </form>
        </div>

        {/* Printable Emergency ID Card */}
        <div className="sc-card" style={{ borderColor: '#f43f5e' }}>
          <div className="sc-card-title" style={{ justifyContent: 'space-between' }}>
            <span><AlertCircle color="#f43f5e" size={20} /> Emergency Medical ID</span>
            <button className="sc-btn sc-btn-outline" style={{ padding: '4px 12px', fontSize: '0.85rem' }} onClick={() => window.print()}>
              <Printer size={14} /> Print
            </button>
          </div>

          <div style={{ background: '#f8fafc', border: '2px dashed var(--primary)', borderRadius: '14px', padding: '20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80" alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
              <div>
                <h3 style={{ color: 'var(--primary)' }}>{profile.name}</h3>
                <p style={{ color: 'var(--text-muted)' }}>Age: {profile.age} • {profile.address}</p>
                <span className="sc-badge sc-badge-green" style={{ marginTop: '4px' }}>ACTIVE MEMBER</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', fontSize: '0.95rem' }}>
              <p><strong>Emergency Contact:</strong> {profile.emergency_contact}</p>
              <p><strong>Phone:</strong> {profile.emergency_phone}</p>
              <p style={{ marginTop: '6px' }}><strong>Conditions:</strong> {profile.health_conditions}</p>
              <p><strong>Allergies:</strong> {profile.allergies}</p>
            </div>
          </div>

          <a href="tel:112" className="sc-btn" style={{ background: '#f43f5e', color: 'white', width: '100%', justifyContent: 'center', marginTop: '20px' }}>
            <Phone size={18} /> Call Emergency Helpline (112)
          </a>
        </div>
      </div>
    </main>
  );
}
