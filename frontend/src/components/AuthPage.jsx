import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Stethoscope, 
  User, 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  AlertCircle, 
  Zap, 
  Building2, 
  Sparkles,
  Heart
} from 'lucide-react';
import { api } from '../api';

export default function AuthPage({ onLoginSuccess }) {
  const [role, setRole] = useState('senior'); // 'senior' or 'doctor'
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    // Doctor specific
    specialty: 'Chief Cardiologist',
    hospital: 'SageCare Heart & Vascular Institute',
    license_no: '',
    // Senior specific
    age: 74,
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    health_conditions: '',
    allergies: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isSignUp) {
        // Sign In
        const res = await api.login(formData.email, formData.password);
        onLoginSuccess(res.user);
      } else {
        // Sign Up
        const res = await api.register({
          ...formData,
          role: role,
        });
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication error. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (email, password) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 50%, #f8fafc 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px 16px',
    }}>
      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px', maxWidth: '640px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #0284c7, #0d9488)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)'
        }}>
          <HeartHandshake size={36} />
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Welcome to SageCare
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginTop: '6px' }}>
          Senior Management Portal & Doctor Telehealth Consultation Network
        </p>
      </div>

      {/* Main Authentication Card */}
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        padding: '36px 32px',
      }}>
        {/* Role Selector Tabs */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
            Choose Portal Profile:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <button
              type="button"
              onClick={() => { setRole('senior'); setError(''); }}
              style={{
                padding: '14px',
                borderRadius: '14px',
                border: role === 'senior' ? '2px solid #0284c7' : '2px solid #e2e8f0',
                background: role === 'senior' ? '#e0f2fe' : '#ffffff',
                color: role === 'senior' ? '#0369a1' : '#64748b',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <User size={20} />
              <span>Senior Citizen</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('doctor'); setError(''); }}
              style={{
                padding: '14px',
                borderRadius: '14px',
                border: role === 'doctor' ? '2px solid #0d9488' : '2px solid #e2e8f0',
                background: role === 'doctor' ? '#ccfbf1' : '#ffffff',
                color: role === 'doctor' ? '#0f766e' : '#64748b',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Stethoscope size={20} />
              <span>Medical Doctor</span>
            </button>
          </div>
        </div>

        {/* Action Toggle: Sign In vs Sign Up */}
        <div style={{
          display: 'flex',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '14px',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: !isSignUp ? '#ffffff' : 'transparent',
              color: !isSignUp ? '#0f172a' : '#64748b',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: !isSignUp ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: isSignUp ? '#ffffff' : 'transparent',
              color: isSignUp ? '#0f172a' : '#64748b',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: isSignUp ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <UserPlus size={16} /> Create Account (Sign Up)
          </button>
        </div>

        {/* 1-Click Demo Profiles Bar */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#0369a1', marginBottom: '8px' }}>
            <Zap size={14} color="#f59e0b" /> Instant 1-Click Demo Login:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.82rem', padding: '8px 10px', justifyContent: 'flex-start' }}
              onClick={() => handleQuickLogin('arthur@sagecare.com', 'password123')}
            >
              👴 Arthur (Senior)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.82rem', padding: '8px 10px', justifyContent: 'flex-start' }}
              onClick={() => handleQuickLogin('eleanor@sagecare.com', 'password123')}
            >
              👵 Eleanor (Senior)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.82rem', padding: '8px 10px', justifyContent: 'flex-start', color: '#0d9488', borderColor: '#99f6e4' }}
              onClick={() => handleQuickLogin('sarah.mitchell@sagecare.com', 'doctor123')}
            >
              🩺 Dr. Mitchell (Cardio)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.82rem', padding: '8px 10px', justifyContent: 'flex-start', color: '#0d9488', borderColor: '#99f6e4' }}
              onClick={() => handleQuickLogin('robert.vance@sagecare.com', 'doctor123')}
            >
              🩺 Dr. Vance (Ortho)
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', fontSize: '0.92rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="form-group">
              <label className="form-label">
                Full Name {role === 'doctor' ? '(with Dr. prefix)' : ''}
              </label>
              <input
                type="text"
                required
                placeholder={role === 'doctor' ? 'e.g. Dr. Sarah Mitchell' : 'e.g. Arthur Pendelton'}
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. yourname@sagecare.com"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="form-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Registration Specific Fields */}
          {isSignUp && (
            <>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 234-5678"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {role === 'doctor' ? (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0d9488', marginBottom: '8px' }}>
                    Doctor Practice Details
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Medical Specialty</label>
                      <input
                        type="text"
                        placeholder="e.g. Cardiologist"
                        className="form-input"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">License Number</label>
                      <input
                        type="text"
                        placeholder="e.g. MD-8821"
                        className="form-input"
                        value={formData.license_no}
                        onChange={(e) => setFormData({ ...formData, license_no: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Affiliated Clinic or Hospital</label>
                    <input
                      type="text"
                      placeholder="e.g. SageCare Heart Institute"
                      className="form-input"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0284c7', marginBottom: '8px' }}>
                    Senior Care & Emergency Setup
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Home Address</label>
                      <input
                        type="text"
                        placeholder="Residential address"
                        className="form-input"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Emergency Contact Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Daughter Eleanor"
                        className="form-input"
                        value={formData.emergency_contact}
                        onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Emergency Phone</label>
                      <input
                        type="text"
                        placeholder="+1 (555) 234-5678"
                        className="form-input"
                        value={formData.emergency_phone}
                        onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Known Allergies & Conditions</label>
                    <input
                      type="text"
                      placeholder="e.g. Hypertension, Penicillin allergy"
                      className="form-input"
                      value={formData.health_conditions}
                      onChange={(e) => setFormData({ ...formData, health_conditions: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '1.05rem',
              borderRadius: '14px',
              background: role === 'doctor' ? '#0d9488' : '#0284c7',
              borderColor: role === 'doctor' ? '#0d9488' : '#0284c7',
              marginTop: '8px'
            }}
          >
            {loading 
              ? 'Processing...' 
              : !isSignUp ? `Sign In as ${role === 'doctor' ? 'Doctor' : 'Senior Patient'}` : `Complete ${role === 'doctor' ? 'Doctor' : 'Senior'} Registration`}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div style={{ marginTop: '24px', fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>
        Protected by SageCare Health Data Security Standards • 24/7 Senior Emergency Support (112)
      </div>
    </div>
  );
}
