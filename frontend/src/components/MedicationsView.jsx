import React, { useState } from 'react';
import { 
  Pill, 
  Plus, 
  Trash2, 
  Clock, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { api } from '../api';

export default function MedicationsView({ medications, refreshData }) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    medicine_name: '',
    dosage: '',
    frequency: 'Once Daily (Morning)',
    doctor_name: '',
    instructions: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createMedication(formData);
      setShowModal(false);
      setFormData({
        medicine_name: '',
        dosage: '',
        frequency: 'Once Daily (Morning)',
        doctor_name: '',
        instructions: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
      });
      await refreshData();
    } catch (err) {
      alert('Error adding medication: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await api.updateMedication(id, { is_active: !currentStatus });
      await refreshData();
    } catch (err) {
      alert('Error updating medication status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this medication from records?')) {
      try {
        await api.deleteMedication(id);
        await refreshData();
      } catch (err) {
        alert('Error deleting medication: ' + err.message);
      }
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pill size={28} color="var(--secondary)" /> Medication & Prescription Tracker
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Maintain accurate records of prescribed pills, daily dosage schedules, and doctor instructions.
          </p>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => setShowModal(true)}
          style={{ boxShadow: '0 4px 14px rgba(13, 148, 136, 0.3)' }}
        >
          <Plus size={20} /> Add Medication
        </button>
      </div>

      {/* Safety Notice Banner */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldCheck size={24} color="#16a34a" />
        <span style={{ fontSize: '0.95rem', color: '#166534', fontWeight: 500 }}>
          <strong>Senior Pill Safety Reminder:</strong> Always take prescribed medicines with plenty of fresh water and as guided by your attending physician.
        </span>
      </div>

      {/* Medications Grid */}
      {medications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <Pill size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h3>No medications recorded yet</h3>
          <p style={{ marginTop: '6px' }}>Click below to add your first prescription or supplement.</p>
          <button className="btn btn-secondary btn-sm" style={{ marginTop: '16px' }} onClick={() => setShowModal(true)}>
            Add Prescription
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {medications.map((med) => (
            <div 
              key={med.id} 
              className="card"
              style={{
                borderLeft: med.is_active ? '6px solid var(--secondary)' : '6px solid #94a3b8',
                opacity: med.is_active ? 1 : 0.75,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: med.is_active ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {med.medicine_name}
                  </h3>
                  <span className={`badge ${med.is_active ? 'badge-confirmed' : 'badge-cancelled'}`}>
                    {med.is_active ? 'Active' : 'Paused / Inactive'}
                  </span>
                </div>

                <div style={{ display: 'inline-block', background: '#ccfbf1', color: '#0f766e', fontWeight: 700, padding: '4px 10px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '14px' }}>
                  Dosage: {med.dosage}
                </div>

                <div style={{ background: 'var(--bg-page)', padding: '12px 16px', borderRadius: '10px', marginBottom: '14px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.95rem' }}>
                    <Clock size={16} color="var(--secondary)" />
                    <strong>Schedule:</strong> {med.frequency}
                  </div>
                  {med.doctor_name && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                      <Stethoscope size={16} color="var(--secondary)" />
                      <strong>Prescribing Doctor:</strong> {med.doctor_name}
                    </div>
                  )}
                </div>

                {med.instructions && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <AlertCircle size={16} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span><strong>Instructions:</strong> {med.instructions}</span>
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-color)', marginTop: '8px' }}>
                <button
                  className={`btn btn-sm ${med.is_active ? 'btn-outline' : 'btn-secondary'}`}
                  onClick={() => handleToggleActive(med.id, med.is_active)}
                >
                  <CheckCircle2 size={14} /> {med.is_active ? 'Mark Paused' : 'Mark Active'}
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(med.id)}
                  title="Delete Medication"
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Medication Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--secondary)' }}>
              Add Prescribed Medication
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Medicine / Supplement Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine Besylate"
                  className="form-input"
                  value={formData.medicine_name}
                  onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Dosage (Strength)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 mg Tablet"
                    className="form-input"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Frequency / Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Morning after meal"
                    className="form-input"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Prescribing Physician</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Sarah Mitchell"
                  className="form-input"
                  value={formData.doctor_name}
                  onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Special Usage Instructions</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Take with warm water. Avoid grapefruit juice."
                  className="form-textarea"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-secondary"
                >
                  {submitting ? 'Saving...' : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
