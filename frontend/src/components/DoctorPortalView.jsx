import React, { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Video, 
  Pill, 
  User, 
  Plus, 
  CheckCircle, 
  Clock, 
  PhoneCall, 
  FileText, 
  Search,
  ShieldAlert,
  ChevronRight,
  Hospital
} from 'lucide-react';
import { api } from '../api';

export default function DoctorPortalView({ 
  currentUser, 
  appointments, 
  patients, 
  medications, 
  refreshData,
  onStartCall 
}) {
  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments', 'prescribe', 'patients'
  const [selectedPatient, setSelectedPatient] = useState(patients[0]?.name || 'Arthur Pendelton');
  
  // Prescribing modal/form
  const [showPrescribeModal, setShowPrescribeModal] = useState(false);
  const [targetPatient, setTargetPatient] = useState(null);
  const [submittingMed, setSubmittingMed] = useState(false);
  const [medForm, setMedForm] = useState({
    medicine_name: '',
    dosage: '',
    frequency: 'Once Daily (Morning)',
    instructions: 'Take after meal with warm water',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
  });

  // Filter doctor's appointments
  const doctorAppointments = appointments.filter(a => {
    if (!currentUser?.email) return true;
    return a.doctor_email === currentUser.email || a.doctor_name?.toLowerCase().includes(currentUser.name?.toLowerCase().split(' ')[1] || '');
  });

  // Fallback to all appointments if no doctor specific matches
  const displayAppts = doctorAppointments.length > 0 ? doctorAppointments : appointments;

  const handleUpdateApptStatus = async (id, status) => {
    try {
      await api.updateAppointment(id, { status });
      await refreshData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const openPrescribeForPatient = (patientName, patientEmail = '') => {
    setTargetPatient({ name: patientName, email: patientEmail });
    setShowPrescribeModal(true);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    setSubmittingMed(true);
    try {
      await api.createMedication({
        patient_name: targetPatient?.name || selectedPatient,
        patient_email: targetPatient?.email || '',
        medicine_name: medForm.medicine_name,
        dosage: medForm.dosage,
        frequency: medForm.frequency,
        instructions: medForm.instructions,
        doctor_name: currentUser?.name || 'Attending Physician',
        prescribed_by_email: currentUser?.email || '',
        start_date: medForm.start_date,
        end_date: medForm.end_date,
      });
      setShowPrescribeModal(false);
      setMedForm({
        medicine_name: '',
        dosage: '',
        frequency: 'Once Daily (Morning)',
        instructions: 'Take after meal with warm water',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
      });
      await refreshData();
      alert(`Prescription successfully registered for ${targetPatient?.name || selectedPatient}!`);
    } catch (err) {
      alert('Failed to save prescription: ' + err.message);
    } finally {
      setSubmittingMed(false);
    }
  };

  // Medications for the currently selected patient in the prescribing tab
  const patientMeds = medications.filter(m => 
    m.patient_name?.toLowerCase().includes(selectedPatient.toLowerCase())
  );

  return (
    <div>
      {/* Doctor Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0d9488 0%, #0369a1 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        color: 'white',
        marginBottom: '28px',
        boxShadow: '0 8px 24px rgba(13, 148, 136, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '16px' }}>
            <Stethoscope size={40} color="white" />
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.25)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
              <Hospital size={14} /> {currentUser?.hospital || 'SageCare Medical Network'}
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              {currentUser?.name || 'Dr. Sarah Mitchell'}
            </h1>
            <p style={{ fontSize: '1rem', opacity: 0.9 }}>
              {currentUser?.specialty || 'Chief Cardiologist & Senior Care Specialist'} • License: {currentUser?.license_no || 'MD-88914'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-secondary"
            style={{ background: 'white', color: '#0f766e', border: 'none' }}
            onClick={() => setActiveTab('prescribe')}
          >
            <Pill size={18} /> Prescribe Medicines
          </button>
        </div>
      </div>

      {/* Doctor Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('appointments')}
        >
          <Calendar size={18} /> My Patient Appointments ({displayAppts.length})
        </button>
        <button
          className={`btn ${activeTab === 'prescribe' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('prescribe')}
        >
          <Pill size={18} /> Prescription Manager
        </button>
        <button
          className={`btn ${activeTab === 'patients' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('patients')}
        >
          <User size={18} /> Senior Patients Directory ({patients.length})
        </button>
      </div>

      {/* TAB 1: Appointments & Video Call Queue */}
      {activeTab === 'appointments' && (
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              Telehealth & Clinic Appointments
            </h3>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Launch high-definition video calls or update patient treatment plans directly.
            </span>
          </div>

          <div className="grid-2">
            {displayAppts.map((appt) => (
              <div 
                key={appt.id} 
                className="card"
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderTop: '5px solid #0d9488'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ background: '#ccfbf1', color: '#0d9488', padding: '10px', borderRadius: '12px' }}>
                        <User size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{appt.patient_name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {appt.patient_email || 'Verified Senior Member'}
                        </span>
                      </div>
                    </div>
                    <span className={`badge badge-${appt.status.toLowerCase()}`}>
                      {appt.status}
                    </span>
                  </div>

                  <div style={{ background: 'var(--bg-page)', padding: '12px 16px', borderRadius: '10px', margin: '14px 0', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem', marginBottom: '6px' }}>
                      <Calendar size={15} color="var(--primary)" />
                      <strong>Date & Time:</strong> {appt.appointment_date} at {appt.appointment_time}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.92rem' }}>
                      <Video size={15} color="var(--secondary)" />
                      <strong>Type:</strong> {appt.consultation_type} Consultation
                    </div>
                  </div>

                  {appt.reason && (
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '14px', fontStyle: 'italic' }}>
                      Clinical Reason: "{appt.reason}"
                    </p>
                  )}

                  {appt.doctor_notes && (
                    <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', color: '#134e4a', marginBottom: '14px' }}>
                      <strong>Your Clinical Notes:</strong> {appt.doctor_notes}
                    </div>
                  )}
                </div>

                {/* Doctor Action Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Launch Video Call */}
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ background: '#0d9488', borderColor: '#0d9488' }}
                      onClick={() => onStartCall(appt)}
                      title="Start Video Consultation"
                    >
                      <Video size={16} /> Start Tele-Call
                    </button>

                    {/* Prescribe Medicines */}
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => openPrescribeForPatient(appt.patient_name, appt.patient_email)}
                      title="Prescribe Medicine for Patient"
                    >
                      <Pill size={16} /> Prescribe
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    {appt.status !== 'Completed' && (
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleUpdateApptStatus(appt.id, 'Completed')}
                      >
                        <CheckCircle size={14} color="#15803d" /> Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Prescription Manager */}
      {activeTab === 'prescribe' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          {/* Left: Patient Selector & Prescription Form */}
          <div className="card">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pill size={22} color="var(--secondary)" /> Prescribe Medication
            </h3>

            <div className="form-group">
              <label className="form-label">Select Senior Patient</label>
              <select
                className="form-select"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                {patients.map(p => (
                  <option key={p.id || p.name} value={p.name}>
                    {p.name} (Age: {p.age || 70})
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSavePrescription}>
              <div className="form-group">
                <label className="form-label">Medicine / Drug Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine, Metformin, or Atorvastatin"
                  className="form-input"
                  value={medForm.medicine_name}
                  onChange={(e) => setMedForm({ ...medForm, medicine_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Dosage & Strength</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 mg Tablet"
                    className="form-input"
                    value={medForm.dosage}
                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Schedule / Frequency</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Once Daily (Morning)"
                    className="form-input"
                    value={medForm.frequency}
                    onChange={(e) => setMedForm({ ...medForm, frequency: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Doctor Special Instructions</label>
                <textarea
                  rows="3"
                  placeholder="Special guidelines, dietary precautions, with or without food..."
                  className="form-textarea"
                  value={medForm.instructions}
                  onChange={(e) => setMedForm({ ...medForm, instructions: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submittingMed}
                className="btn btn-secondary btn-block"
                style={{ width: '100%', marginTop: '10px' }}
              >
                <Plus size={18} /> {submittingMed ? 'Registering...' : `Submit Prescription for ${selectedPatient}`}
              </button>
            </form>
          </div>

          {/* Right: Active Prescriptions for Selected Patient */}
          <div className="card">
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>
              Current Prescriptions for {selectedPatient}
            </h3>

            {patientMeds.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '16px 0' }}>
                No active medications found on record for {selectedPatient}.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {patientMeds.map(m => (
                  <div 
                    key={m.id}
                    style={{
                      padding: '14px 18px',
                      background: 'var(--bg-page)',
                      borderRadius: '12px',
                      borderLeft: '5px solid var(--secondary)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '1.05rem' }}>{m.medicine_name}</strong>
                      <span className="badge badge-confirmed">{m.dosage}</span>
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                      Schedule: {m.frequency}
                    </div>
                    {m.instructions && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '6px' }}>
                        Instructions: <em>{m.instructions}</em>
                      </div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: '#0d9488', marginTop: '6px' }}>
                      Prescribed by: {m.doctor_name || 'Dr. Sarah Mitchell'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Patients Directory */}
      {activeTab === 'patients' && (
        <div className="grid-2">
          {patients.map(p => (
            <div key={p.id || p.name} className="card">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                <img 
                  src={p.photo_data || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"}
                  alt={p.name}
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--secondary)' }}
                />
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{p.name}</h4>
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                    Age: {p.age || 74} years • Phone: {p.phone || '+1 (555) 234-5678'}
                  </span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {p.address || 'Senior Care Residence'}
                  </div>
                </div>
              </div>

              {p.allergies && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', color: '#991b1b', marginBottom: '10px' }}>
                  <strong>Known Allergies:</strong> {p.allergies}
                </div>
              )}

              {p.health_conditions && (
                <div style={{ background: 'var(--bg-page)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '14px' }}>
                  <strong>Conditions:</strong> {p.health_conditions}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Emergency Contact: {p.emergency_contact || 'Family Caregiver'}
                </span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => openPrescribeForPatient(p.name, p.email)}
                >
                  <Pill size={14} /> Prescribe
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Prescribe Modal (Triggered from an appointment or patient card) */}
      {showPrescribeModal && (
        <div className="modal-overlay" onClick={() => setShowPrescribeModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: 'var(--secondary)' }}>
              Prescribe Medication for {targetPatient?.name}
            </h3>

            <form onSubmit={handleSavePrescription}>
              <div className="form-group">
                <label className="form-label">Medicine Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amlodipine or Metformin"
                  className="form-input"
                  value={medForm.medicine_name}
                  onChange={(e) => setMedForm({ ...medForm, medicine_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 mg Tablet"
                    className="form-input"
                    value={medForm.dosage}
                    onChange={(e) => setMedForm({ ...medForm, dosage: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Frequency</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Once Daily (Morning)"
                    className="form-input"
                    value={medForm.frequency}
                    onChange={(e) => setMedForm({ ...medForm, frequency: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Doctor's Instructions</label>
                <textarea
                  rows="3"
                  placeholder="Directions for senior patient, time of day, water intake..."
                  className="form-textarea"
                  value={medForm.instructions}
                  onChange={(e) => setMedForm({ ...medForm, instructions: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowPrescribeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMed}
                  className="btn btn-secondary"
                >
                  {submittingMed ? 'Saving...' : 'Add Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
