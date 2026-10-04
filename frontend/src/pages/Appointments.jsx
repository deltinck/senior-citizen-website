import React, { useState, useEffect } from 'react';
import { Calendar, User, Stethoscope, Video, Clock, Send, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function Appointments() {
  const [patientName, setPatientName] = useState('Senior Member');
  const [doctor, setDoctor] = useState('');
  const [consultType, setConsultType] = useState('In-Person');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [reason, setReason] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Set default date to tomorrow
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);
    setDate(tmr.toISOString().split('T')[0]);

    loadAppointments();
  }, []);

  const loadAppointments = () => {
    axios.get('http://127.0.0.1:8000/api/appointments/')
      .then(res => {
        if (res.data?.data) setAppointments(res.data.data);
      })
      .catch(() => {
        const local = JSON.parse(localStorage.getItem('sage_appts') || '[]');
        setAppointments(local);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      patient_name: patientName,
      doctor_name: doctor,
      consultation_type: consultType,
      appointment_date: date,
      appointment_time: time,
      reason: reason,
      status: 'Confirmed'
    };

    axios.post('http://127.0.0.1:8000/api/appointments/', payload)
      .then(() => {
        alert('Appointment successfully booked with ' + doctor);
        loadAppointments();
        setDoctor('');
        setReason('');
      })
      .catch(() => {
        const local = JSON.parse(localStorage.getItem('sage_appts') || '[]');
        local.unshift(payload);
        localStorage.setItem('sage_appts', JSON.stringify(local));
        alert('Appointment saved locally!');
        loadAppointments();
      });
  };

  const cancelAppt = (id, idx) => {
    if (window.confirm('Cancel this appointment?')) {
      if (id) {
        axios.delete(`http://127.0.0.1:8000/api/appointments/${id}/`)
          .then(() => loadAppointments())
          .catch(() => loadAppointments());
      } else {
        const local = JSON.parse(localStorage.getItem('sage_appts') || '[]');
        local.splice(idx, 1);
        localStorage.setItem('sage_appts', JSON.stringify(local));
        loadAppointments();
      }
    }
  };

  return (
    <main className="sc-container">
      <div className="sc-hero" style={{ background: 'linear-gradient(135deg, #2d7a6e 0%, #489b8d 100%)' }}>
        <h1><Calendar size={32} /> Doctor Appointment Booking & Tracking</h1>
        <p>Schedule medical visits and manage upcoming consultations effortlessly.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        {/* Form Card */}
        <div className="sc-card">
          <div className="sc-card-title"><User size={20} /> Book New Appointment</div>
          <form onSubmit={handleSubmit}>
            <div className="sc-form-group">
              <label><User size={16} /> Patient Name</label>
              <input type="text" className="sc-input" value={patientName} onChange={e => setPatientName(e.target.value)} required />
            </div>

            <div className="sc-form-group">
              <label><Stethoscope size={16} /> Doctor Specialty</label>
              <select className="sc-input" value={doctor} onChange={e => setDoctor(e.target.value)} required>
                <option value="">Select Doctor</option>
                <option value="Dr. John Doe - Cardiologist">Dr. John Doe - Cardiologist</option>
                <option value="Dr. Emily Smith - Dermatologist">Dr. Emily Smith - Dermatologist</option>
                <option value="Dr. Mark Lee - Orthopedic">Dr. Mark Lee - Orthopedic</option>
                <option value="Dr. Sarah Jenkins - General Physician">Dr. Sarah Jenkins - General Physician</option>
              </select>
            </div>

            <div className="sc-form-group">
              <label><Video size={16} /> Consultation Type</label>
              <div style={{ display: 'flex', gap: '20px', marginTop: '6px' }}>
                <label><input type="radio" name="ct" value="In-Person" checked={consultType === 'In-Person'} onChange={e => setConsultType(e.target.value)} /> In-Person Visit</label>
                <label><input type="radio" name="ct" value="Online" checked={consultType === 'Online'} onChange={e => setConsultType(e.target.value)} /> Online Video</label>
              </div>
            </div>

            <div className="sc-form-group" style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label><Calendar size={16} /> Date</label>
                <input type="date" className="sc-input" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div style={{ flex: 1 }}>
                <label><Clock size={16} /> Time</label>
                <input type="time" className="sc-input" value={time} onChange={e => setTime(e.target.value)} required />
              </div>
            </div>

            <div className="sc-form-group">
              <label>Reason for Visit</label>
              <textarea className="sc-input" rows="3" value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe symptoms or check-up purpose"></textarea>
            </div>

            <button type="submit" className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Send size={18} /> Submit Booking
            </button>
          </form>
        </div>

        {/* Tracker Table Card */}
        <div className="sc-card">
          <div className="sc-card-title"><Calendar size={20} /> My Appointments Tracker</div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Your upcoming scheduled visits:</p>

          <table className="sc-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Type</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No appointments scheduled yet.</td></tr>
              ) : (
                appointments.map((item, idx) => (
                  <tr key={idx}>
                    <td><strong>{item.doctor_name || item.doctor}</strong></td>
                    <td><span className="sc-badge sc-badge-green">{item.consultation_type || 'In-Person'}</span></td>
                    <td>{item.appointment_date}<br/><small style={{ color: 'var(--text-muted)' }}>{item.appointment_time}</small></td>
                    <td><span className="sc-badge sc-badge-green">{item.status || 'Confirmed'}</span></td>
                    <td>
                      <button className="sc-btn sc-btn-outline" style={{ padding: '4px 10px', fontSize: '0.8rem', color: '#f43f5e', borderColor: '#f43f5e' }} onClick={() => cancelAppt(item.id, idx)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
