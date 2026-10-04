import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  LogIn, 
  UserPlus, 
  X, 
  Lock, 
  Mail, 
  Phone, 
  Building2, 
  Heart, 
  AlertCircle,
  Zap
} from 'lucide-react';
import { api } from '../api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('senior'); // 'senior' or 'doctor'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    // Doctor
    specialty: 'Chief Cardiologist',
    hospital: 'SageCare Heart Institute',
    license_no: '',
    // Senior
    age: 72,
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    health_conditions: '',
    allergies: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(formData.email, formData.password);
        onLoginSuccess(res.user);
        onClose();
      } else {
        const res = await api.register({
          ...formData,
          role: role
        });
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
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
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 150 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              {mode === 'login' ? 'Welcome to SageCare' : 'Create Your Account'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {mode === 'login' 
                ? 'Sign in as Senior Citizen or Doctor to manage care & appointments.' 
                : 'Join the SageCare Healthcare and Elder Management Network.'}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Demo Logins Banner */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#0369a1', marginBottom: '8px' }}>
            <Zap size={14} color="#f59e0b" /> Quick 1-Click Demo Profiles:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.78rem', padding: '6px', justifyContent: 'flex-start' }}
              onClick={() => handleQuickLogin('arthur@sagecare.com', 'password123')}
            >
              👴 Arthur (Senior)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.78rem', padding: '6px', justifyContent: 'flex-start' }}
              onClick={() => handleQuickLogin('eleanor@sagecare.com', 'password123')}
            >
              👵 Eleanor (Senior)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.78rem', padding: '6px', justifyContent: 'flex-start', color: '#0d9488', borderColor: '#99f6e4' }}
              onClick={() => handleQuickLogin('sarah.mitchell@sagecare.com', 'doctor123')}
            >
              🩺 Dr. Mitchell (Cardio)
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.78rem', padding: '6px', justifyContent: 'flex-start', color: '#0d9488', borderColor: '#99f6e4' }}
              onClick={() => handleQuickLogin('robert.vance@sagecare.com', 'doctor123')}
            >
              🩺 Dr. Vance (Ortho)
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            className={`btn btn-sm ${mode === 'login' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('login'); setError(''); }}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            type="button"
            className={`btn btn-sm ${mode === 'register' ? 'btn-primary' : 'btn-outline'}`}
            style={{ flex: 1 }}
            onClick={() => { setMode('register'); setError(''); }}
          >
            <UserPlus size={16} /> Register
          </button>
        </div>

        {/* Role Selector (visible in Register mode or optional in Login mode) */}
        {mode === 'register' && (
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Select Your Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRole('senior')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: role === 'senior' ? '2px solid var(--primary)' : '2px solid var(--border-color)',
                  background: role === 'senior' ? 'var(--primary-light)' : 'var(--bg-card)',
                  color: role === 'senior' ? 'var(--primary-dark)' : 'var(--text-main)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center'
                }}
              >
                <User size={18} /> Senior Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: role === 'doctor' ? '2px solid var(--secondary)' : '2px solid var(--border-color)',
                  background: role === 'doctor' ? 'var(--secondary-light)' : 'var(--bg-card)',
                  color: role === 'doctor' ? 'var(--secondary)' : 'var(--text-main)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center'
                }}
              >
                <Stethoscope size={18} /> Medical Doctor
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name {role === 'doctor' ? '(including Dr. prefix)' : ''}</label>
              <input
                type="text"
                required
                placeholder={role === 'doctor' ? 'e.g. Dr. Jane Campbell' : 'e.g. Arthur Pendelton'}
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
              placeholder="e.g. user@sagecare.com"
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

          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              {/* Doctor Specific Registration Fields */}
              {role === 'doctor' && (
                <div style={{ background: 'var(--bg-page)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '10px' }}>
                    Doctor Credentials & Practice
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label">Specialty / Department</label>
                      <input
                        type="text"
                        placeholder="e.g. Cardiologist"
                        className="form-input"
                        value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Medical License / ID</label>
                      <input
                        type="text"
                        placeholder="e.g. MD-98214"
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
                      placeholder="e.g. SageCare Medical Center"
                      className="form-input"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Senior Citizen Specific Registration Fields */}
              {role === 'senior' && (
                <div style={{ background: 'var(--bg-page)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '10px' }}>
                    Senior Health & Emergency Setup
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
                      <label className="form-label">Emergency Caregiver Name</label>
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
                    <label className="form-label">Known Medical Conditions & Allergies</label>
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
            className="btn btn-primary btn-block"
            style={{ width: '100%', marginTop: '12px' }}
          >
            {loading 
              ? 'Please wait...' 
              : mode === 'login' ? 'Sign In to Portal' : `Complete ${role === 'doctor' ? 'Doctor' : 'Senior'} Registration`}
          </button>
        </form>
      </div>
    </div>
  );
}
