import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  UserCheck, 
  Clock, 
  MapPin, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  CalendarDays,
  Video,
  Stethoscope,
  PhoneCall
} from 'lucide-react';
import { api } from '../api';

export default function AppointmentsView({ 
  appointments, 
  doctors = [], 
  currentUser, 
  refreshData, 
  onStartCall 
}) {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('All');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    doctor_name: doctors[0]?.name || 'Dr. Sarah Mitchell',
    doctor_email: doctors[0]?.email || 'sarah.mitchell@sagecare.com',
    consultation_type: 'Online',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '10:30 AM',
    reason: '',
  });

  const handleDoctorSelect = (e) => {
    const docName = e.target.value;
    const docObj = doctors.find(d => d.name === docName);
    setFormData({
      ...formData,
      doctor_name: docName,
      doctor_email: docObj?.email || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createAppointment({
        ...formData,
        patient_name: currentUser?.name || 'Arthur Pendelton',
        patient_email: currentUser?.email || 'arthur@sagecare.com',
      });
      setShowModal(false);
      setFormData({
        doctor_name: doctors[0]?.name || 'Dr. Sarah Mitchell',
        doctor_email: doctors[0]?.email || 'sarah.mitchell@sagecare.com',
        consultation_type: 'Online',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: '10:30 AM',
        reason: '',
      });
      await refreshData();
    } catch (err) {
      alert('Error creating appointment: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateAppointment(id, { status });
      await refreshData();
    } catch (err) {
      alert('Error updating appointment: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor appointment record?')) {
      try {
        await api.deleteAppointment(id);
        await refreshData();
      } catch (err) {
        alert('Error deleting appointment: ' + err.message);
      }
    }
  };

  const filteredAppointments = appointments.filter(a => {
    if (filter === 'All') return true;
    return a.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div>
      {/* Header with Title and Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarDays size={28} color="var(--primary)" /> Doctor Visits & Tele-Consultations
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Schedule visits with specialist physicians and join live telehealth video calls with one click.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}
        >
          <Plus size={20} /> Schedule Doctor Visit
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Appointment Cards Grid */}
      {filteredAppointments.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <Calendar size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h3>No appointments found</h3>
          <p style={{ marginTop: '6px' }}>No records match the current filter "{filter}".</p>
          <button className="btn btn-primary btn-sm" style={{ marginTop: '16px' }} onClick={() => setShowModal(true)}>
            Schedule an Appointment
          </button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredAppointments.map((appt) => {
            const isOnline = appt.consultation_type === 'Online';
            return (
              <div key={appt.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderTop: isOnline ? '5px solid #0284c7' : '5px solid #0d9488' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        background: isOnline ? '#e0f2fe' : '#ccfbf1', 
                        color: isOnline ? '#0284c7' : '#0d9488', 
                        padding: '10px', 
                        borderRadius: '12px' 
                      }}>
                        {isOnline ? <Video size={22} /> : <MapPin size={22} />}
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{appt.doctor_name}</h3>
                        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                          Patient: {appt.patient_name} • {appt.consultation_type}
                        </span>
                      </div>
                    </div>
                    <span className={`badge badge-${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </div>

                  <div style={{ background: 'var(--bg-page)', padding: '12px 16px', borderRadius: '10px', margin: '14px 0', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.95rem' }}>
                      <Calendar size={16} color="var(--primary)" />
                      <strong>Date:</strong> {appt.appointment_date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                      <Clock size={16} color="var(--primary)" />
                      <strong>Time:</strong> {appt.appointment_time}
                    </div>
                  </div>

                  {appt.reason && (
                    <p style={{ fontSize: '0.93rem', color: 'var(--text-muted)', marginBottom: '14px', fontStyle: 'italic' }}>
                      Reason: "{appt.reason}"
                    </p>
                  )}

                  {appt.doctor_notes && (
                    <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', color: '#134e4a', marginBottom: '14px' }}>
                      <strong>Doctor Notes:</strong> {appt.doctor_notes}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)', marginTop: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Live Video Call Button */}
                    {isOnline && (
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ background: '#0284c7', borderColor: '#0284c7' }}
                        onClick={() => onStartCall(appt)}
                        title="Join Telehealth Video Call with Doctor"
                      >
                        <Video size={16} /> Join Doctor Video Call
                      </button>
                    )}

                    {appt.status !== 'Completed' && (
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleUpdateStatus(appt.id, 'Completed')}
                        title="Mark as Completed"
                      >
                        <CheckCircle size={14} color="#15803d" /> Mark Done
                      </button>
                    )}
                  </div>

                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(appt.id)}
                    title="Delete Record"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book Appointment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--primary-dark)' }}>
              Schedule Doctor Visit
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Select Specialist Doctor</label>
                {doctors.length > 0 ? (
                  <select
                    className="form-select"
                    value={formData.doctor_name}
                    onChange={handleDoctorSelect}
                  >
                    {doctors.map((doc) => (
                      <option key={doc.id || doc.email} value={doc.name}>
                        {doc.name} — {doc.specialty || 'General Physician'} ({doc.hospital || 'SageCare'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sarah Mitchell (Cardiologist)"
                    className="form-input"
                    value={formData.doctor_name}
                    onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Mode</label>
                <select
                  className="form-select"
                  value={formData.consultation_type}
                  onChange={(e) => setFormData({ ...formData, consultation_type: e.target.value })}
                >
                  <option value="Online">Online TeleHealth Video Call (Recommended for Seniors)</option>
                  <option value="In-Person">In-Person Clinic Visit</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    required
                    className="form-input"
                    value={formData.appointment_date}
                    onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 10:30 AM"
                    className="form-input"
                    value={formData.appointment_time}
                    onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Symptoms for Consultation</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Blood pressure review, arthritis pain, or prescription renewal..."
                  className="form-textarea"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
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
                  className="btn btn-primary"
                >
                  {submitting ? 'Scheduling...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
