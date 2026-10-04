import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Heart, 
  AlertTriangle, 
  FileText, 
  Edit3, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api';

export default function ProfileView({ profile, refreshData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: profile?.name || 'Arthur Pendelton',
    age: profile?.age || 74,
    address: profile?.address || '42 Whispering Pines Lane, Brookside Gardens, CA 90210',
    emergency_contact: profile?.emergency_contact || 'Eleanor Pendelton (Daughter)',
    emergency_phone: profile?.emergency_phone || '+1 (555) 234-5678',
    health_conditions: profile?.health_conditions || 'Mild Hypertension, Osteoarthritis in knees',
    medications_summary: profile?.medications_summary || 'Amlodipine 5mg (Daily morning), Glucosamine (Noon)',
    allergies: profile?.allergies || 'Penicillin, Sulfa drugs, Raw Shellfish',
    photo_data: profile?.photo_data || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.updateProfile(formData);
      setIsEditing(false);
      await refreshData();
    } catch (err) {
      alert('Error saving profile: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={28} color="var(--primary)" /> Senior Member Profile & Medical ID
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Confidential medical credentials, verified emergency contacts, and vital medical notes.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            setFormData({
              name: profile?.name || '',
              age: profile?.age || 70,
              address: profile?.address || '',
              emergency_contact: profile?.emergency_contact || '',
              emergency_phone: profile?.emergency_phone || '',
              health_conditions: profile?.health_conditions || '',
              medications_summary: profile?.medications_summary || '',
              allergies: profile?.allergies || '',
              photo_data: profile?.photo_data || '',
            });
            setIsEditing(true);
          }}
        >
          <Edit3 size={18} /> Update Medical Profile
        </button>
      </div>

      <div className="grid-2">
        {/* Personal & Emergency Card */}
        <div className="card">
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
            <img 
              src={profile?.photo_data || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"}
              alt={profile?.name || "Member Photo"}
              style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--primary)' }}
            />
            <div>
              <span className="badge badge-confirmed" style={{ marginBottom: '6px' }}>Verified Senior Citizen</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{profile?.name || 'Arthur Pendelton'}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>Age: {profile?.age || 74} years old</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <MapPin size={14} /> {profile?.address || 'Brookside Gardens, CA'}
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '18px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '12px', color: 'var(--primary-dark)' }}>
              Emergency Caregiver Contact
            </h4>
            <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <strong style={{ fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>
                {profile?.emergency_contact || 'Eleanor Pendelton (Daughter)'}
              </strong>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)' }}>
                <Phone size={16} />
                <a href={`tel:${profile?.emergency_phone}`} style={{ color: 'inherit', fontWeight: 700, textDecoration: 'none' }}>
                  {profile?.emergency_phone || '+1 (555) 234-5678'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical History & Allergies */}
        <div className="card">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="var(--secondary)" /> Clinical Record & Precautions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Allergies Alert */}
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 800, marginBottom: '6px' }}>
                <AlertTriangle size={18} /> CRITICAL ALLERGIES & ADVERSE REACTIONS
              </div>
              <p style={{ color: '#7f1d1d', fontSize: '0.95rem' }}>
                {profile?.allergies || 'Penicillin, Sulfa drugs, Raw Shellfish'}
              </p>
            </div>

            {/* Chronic Conditions */}
            <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px', fontSize: '0.95rem' }}>
                CHRONIC HEALTH CONDITIONS
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {profile?.health_conditions || 'Mild Hypertension, Osteoarthritis in knees'}
              </p>
            </div>

            {/* Prescriptions Summary */}
            <div style={{ background: 'var(--bg-page)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px', fontSize: '0.95rem' }}>
                CURRENT PRESCRIPTIONS SUMMARY
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {profile?.medications_summary || 'Amlodipine 5mg (Daily morning), Glucosamine (Noon), Low-Dose Aspirin (Evening)'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary-dark)' }}>
              Edit Senior Health Profile
            </h3>

            <form onSubmit={handleUpdate}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    required
                    className="form-input"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Emergency Contact Name & Relation</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.emergency_contact}
                    onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Contact Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Medical Conditions</label>
                <textarea
                  rows="2"
                  className="form-textarea"
                  value={formData.health_conditions}
                  onChange={(e) => setFormData({ ...formData, health_conditions: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Known Allergies</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Profile Photo URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.photo_data}
                  onChange={(e) => setFormData({ ...formData, photo_data: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                >
                  {submitting ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
