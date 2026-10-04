import React, { useState, useEffect } from 'react';
import { Pill, Plus, Volume2, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function Medications() {
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Morning');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [doctorName, setDoctorName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [medList, setMedList] = useState([]);

  useEffect(() => {
    loadMeds();
  }, []);

  const loadMeds = () => {
    axios.get('http://127.0.0.1:8000/api/medications/')
      .then(res => {
        if (res.data?.data) setMedList(res.data.data);
      })
      .catch(() => {
        const local = JSON.parse(localStorage.getItem('sage_meds') || '[]');
        setMedList(local);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      medicine_name: medName,
      dosage: dosage,
      frequency: frequency,
      start_date: startDate,
      doctor_name: doctorName,
      instructions: instructions
    };

    axios.post('http://127.0.0.1:8000/api/medications/', payload)
      .then(() => {
        alert('Medication saved!');
        setMedName('');
        setDosage('');
        setInstructions('');
        loadMeds();
      })
      .catch(() => {
        const local = JSON.parse(localStorage.getItem('sage_meds') || '[]');
        local.unshift(payload);
        localStorage.setItem('sage_meds', JSON.stringify(local));
        alert('Medication saved locally!');
        loadMeds();
      });
  };

  const speakInst = (name, inst) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(`${name}: ${inst || 'Take as prescribed.'}`));
    }
  };

  const deleteMed = (id, idx) => {
    if (window.confirm('Delete prescription record?')) {
      if (id) {
        axios.delete(`http://127.0.0.1:8000/api/medications/${id}/`).then(() => loadMeds());
      } else {
        const local = JSON.parse(localStorage.getItem('sage_meds') || '[]');
        local.splice(idx, 1);
        localStorage.setItem('sage_meds', JSON.stringify(local));
        loadMeds();
      }
    }
  };

  return (
    <main className="sc-container">
      <div className="sc-hero" style={{ background: 'linear-gradient(135deg, #5b46e5 0%, #7a68e8 100%)' }}>
        <h1><Pill size={32} /> Medication & Prescription Storage</h1>
        <p>Keep track of prescribed medicines, dosages, and hear instructions read out loud.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
        {/* Form */}
        <div className="sc-card">
          <div className="sc-card-title"><Plus size={20} /> Add New Prescription</div>
          <form onSubmit={handleSubmit}>
            <div className="sc-form-group">
              <label>Medicine Name</label>
              <input type="text" className="sc-input" placeholder="e.g. Lisinopril, Metformin" value={medName} onChange={e => setMedName(e.target.value)} required />
            </div>

            <div className="sc-form-group" style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label>Dosage</label>
                <input type="text" className="sc-input" placeholder="e.g. 500mg, 1 tablet" value={dosage} onChange={e => setDosage(e.target.value)} required />
              </div>
              <div style={{ flex: 1 }}>
                <label>Schedule</label>
                <select className="sc-input" value={frequency} onChange={e => setFrequency(e.target.value)}>
                  <option value="Morning">Morning (8:00 AM)</option>
                  <option value="Midday">Midday (12:30 PM)</option>
                  <option value="Evening">Evening (6:30 PM)</option>
                  <option value="Bedtime">Bedtime (9:30 PM)</option>
                </select>
              </div>
            </div>

            <div className="sc-form-group">
              <label>Prescribing Doctor</label>
              <input type="text" className="sc-input" placeholder="e.g. Dr. John Doe" value={doctorName} onChange={e => setDoctorName(e.target.value)} />
            </div>

            <div className="sc-form-group">
              <label>Special Instructions</label>
              <textarea className="sc-input" rows="2" placeholder="e.g. Take after meals with plenty of water." value={instructions} onChange={e => setInstructions(e.target.value)}></textarea>
            </div>

            <button type="submit" className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--secondary)' }}>
              Save Medication
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="sc-card">
          <div className="sc-card-title"><Pill size={20} /> Active Prescriptions</div>
          <table className="sc-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Frequency</th>
                <th>Doctor</th>
                <th>Instructions</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {medList.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No medications added yet.</td></tr>
              ) : (
                medList.map((m, idx) => (
                  <tr key={idx}>
                    <td><strong>{m.medicine_name || m.medicineName}</strong><br/><span className="sc-badge sc-badge-green">{m.dosage}</span></td>
                    <td>{m.frequency}</td>
                    <td>{m.doctor_name || 'General Practitioner'}</td>
                    <td>
                      <span style={{ fontSize: '0.85rem' }}>{m.instructions || 'Take as prescribed.'}</span>
                      <button className="acc-btn" style={{ marginLeft: '6px' }} onClick={() => speakInst(m.medicine_name, m.instructions)}><Volume2 size={14} /></button>
                    </td>
                    <td>
                      <button className="sc-btn sc-btn-outline" style={{ padding: '4px 8px', color: '#f43f5e', borderColor: '#f43f5e' }} onClick={() => deleteMed(m.id, idx)}>
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
