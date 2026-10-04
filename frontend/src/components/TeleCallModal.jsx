import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Pill, 
  Plus, 
  CheckCircle2, 
  AlertTriangle,
  User,
  Stethoscope
} from 'lucide-react';
import { api } from '../api';

export default function TeleCallModal({ 
  isOpen, 
  onClose, 
  appointment, 
  currentUser, 
  onPrescriptionAdded 
}) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'prescribe'
  
  // Doctor in-call prescription form state
  const [medData, setMedData] = useState({
    medicine_name: '',
    dosage: '',
    frequency: 'Once Daily (Morning)',
    instructions: 'Take with warm water after breakfast',
  });
  const [prescribing, setPrescribing] = useState(false);
  const [prescribeSuccess, setPrescribeSuccess] = useState(false);

  // Doctor in-call consultation notes
  const [notes, setNotes] = useState(appointment?.doctor_notes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    let timer;
    if (isOpen) {
      setSeconds(0);
      timer = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (appointment?.doctor_notes) {
      setNotes(appointment.doctor_notes);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const isDoctor = currentUser?.role === 'doctor';
  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const secs = (totalSec % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await api.updateAppointment(appointment.id, { 
        doctor_notes: notes,
        status: 'Completed'
      });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (err) {
      alert('Error saving notes: ' + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handlePrescribeMedicine = async (e) => {
    e.preventDefault();
    setPrescribing(true);
    try {
      await api.createMedication({
        patient_name: appointment.patient_name,
        patient_email: appointment.patient_email || '',
        medicine_name: medData.medicine_name,
        dosage: medData.dosage,
        frequency: medData.frequency,
        instructions: medData.instructions,
        doctor_name: currentUser?.name || appointment.doctor_name,
        prescribed_by_email: currentUser?.email || '',
        start_date: new Date().toISOString().split('T')[0],
      });
      setPrescribeSuccess(true);
      setMedData({
        medicine_name: '',
        dosage: '',
        frequency: 'Once Daily (Morning)',
        instructions: 'Take with warm water after breakfast',
      });
      if (onPrescriptionAdded) onPrescriptionAdded();
      setTimeout(() => setPrescribeSuccess(false), 3500);
    } catch (err) {
      alert('Error prescribing medicine: ' + err.message);
    } finally {
      setPrescribing(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 200, padding: '10px' }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1080px', 
          width: '95vw', 
          maxHeight: '92vh', 
          padding: '20px',
          background: '#0f172a',
          color: 'white',
          border: '1px solid #334155'
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#0284c7', padding: '8px', borderRadius: '10px' }}>
              <Stethoscope size={22} color="white" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                SageCare TeleHealth Live Consultation
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Secure Room: <code>{appointment.call_room_id || 'room-sc-telehealth'}</code> • Encrypted WebRTC Session
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#1e293b', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', color: '#38bdf8' }}>
              <Clock size={16} />
              <span style={{ fontWeight: 700 }}>{formatTime(seconds)}</span>
            </div>
            <button 
              onClick={onClose}
              style={{ background: '#e11d48', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PhoneOff size={16} /> End Call
            </button>
          </div>
        </div>

        {/* Main Grid: Video Stream on Left, Doctor Workspace / Patient Info on Right */}
        <div style={{ display: 'grid', gridTemplateColumns: isDoctor ? '1.4fr 1fr' : '1fr', gap: '18px', minHeight: '440px' }}>
          
          {/* Video Stream Container */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ 
              position: 'relative', 
              background: '#020617', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              height: '380px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '2px solid #1e293b'
            }}>
              {/* Simulated / Remote Video Frame */}
              <div style={{ textAlign: 'center' }}>
                <img 
                  src={isDoctor 
                    ? "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80"
                    : "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
                  }
                  alt="Remote Participant"
                  style={{ width: '130px', height: '130px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #0284c7', margin: '0 auto 12px' }}
                />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {isDoctor ? appointment.patient_name : appointment.doctor_name}
                </h4>
                <p style={{ color: '#38bdf8', fontSize: '0.9rem' }}>
                  {isDoctor ? 'Senior Citizen (Patient)' : 'Attending Specialist (Doctor)'}
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', marginTop: '8px' }}>
                  ● Live Audio & HD Video Connected
                </div>
              </div>

              {/* Local Self-View PiP */}
              <div style={{ 
                position: 'absolute', 
                bottom: '16px', 
                right: '16px', 
                width: '120px', 
                height: '90px', 
                background: '#1e293b', 
                borderRadius: '10px', 
                border: '2px solid #0284c7', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem'
              }}>
                {isVideoOff ? (
                  <span style={{ color: '#94a3b8' }}>Camera Off</span>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, color: '#38bdf8' }}>You ({currentUser?.name?.split(' ')[0] || 'User'})</div>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{isMuted ? 'Muted' : 'Speaking'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* In-Call Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '10px 0' }}>
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                style={{ 
                  background: isMuted ? '#ef4444' : '#334155', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px', 
                  borderRadius: '50%', 
                  cursor: 'pointer',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={isMuted ? "Unmute Mic" : "Mute Mic"}
              >
                {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
              </button>

              <button 
                onClick={() => setIsVideoOff(!isVideoOff)} 
                style={{ 
                  background: isVideoOff ? '#ef4444' : '#334155', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px', 
                  borderRadius: '50%', 
                  cursor: 'pointer',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title={isVideoOff ? "Turn Video On" : "Turn Video Off"}
              >
                {isVideoOff ? <VideoOff size={22} /> : <Video size={22} />}
              </button>

              <button 
                onClick={onClose} 
                style={{ 
                  background: '#e11d48', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: '30px', 
                  cursor: 'pointer',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <PhoneOff size={20} /> End Call
              </button>
            </div>
          </div>

          {/* Right Panel: Doctor Consultation Suite (Prescriptions & Notes) */}
          {isDoctor && (
            <div style={{ background: '#1e293b', borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                <button
                  onClick={() => setActiveTab('prescribe')}
                  style={{
                    background: activeTab === 'prescribe' ? '#0d9488' : 'transparent',
                    color: 'white',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Pill size={16} /> Prescribe Medicines
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  style={{
                    background: activeTab === 'notes' ? '#0284c7' : 'transparent',
                    color: 'white',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={16} /> Clinical Notes
                </button>
              </div>

              {/* Tab 1: Live Medicine Prescribing */}
              {activeTab === 'prescribe' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '12px' }}>
                    Prescribing directly for: <strong style={{ color: '#38bdf8' }}>{appointment.patient_name}</strong>
                  </div>

                  {prescribeSuccess && (
                    <div style={{ background: '#14532d', color: '#86efac', padding: '8px 12px', borderRadius: '8px', fontSize: '0.88rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Prescription saved to patient records!
                    </div>
                  )}

                  <form onSubmit={handlePrescribeMedicine} style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Medicine Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Atorvastatin or Lisinopril"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '0.92rem' }}
                        value={medData.medicine_name}
                        onChange={(e) => setMedData({ ...medData, medicine_name: e.target.value })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Dosage</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. 10 mg Tablet"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '0.92rem' }}
                          value={medData.dosage}
                          onChange={(e) => setMedData({ ...medData, dosage: e.target.value })}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Frequency</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Every evening"
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '0.92rem' }}
                          value={medData.frequency}
                          onChange={(e) => setMedData({ ...medData, frequency: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>Doctor Instructions</label>
                      <textarea 
                        rows="2" 
                        placeholder="Special guidelines, food cautions, or hydration advice"
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #475569', background: '#0f172a', color: 'white', fontSize: '0.92rem' }}
                        value={medData.instructions}
                        onChange={(e) => setMedData({ ...medData, instructions: e.target.value })}
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={prescribing}
                      style={{ 
                        marginTop: 'auto', 
                        background: '#0d9488', 
                        color: 'white', 
                        border: 'none', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        fontWeight: 700, 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Plus size={16} /> {prescribing ? 'Saving...' : 'Add to Patient Prescription'}
                    </button>
                  </form>
                </div>
              )}

              {/* Tab 2: Clinical Consultation Notes */}
              {activeTab === 'notes' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
                    Reason for visit: <em>"{appointment.reason || 'General medical review'}"</em>
                  </div>

                  {notesSaved && (
                    <div style={{ background: '#1e3a8a', color: '#93c5fd', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '8px' }}>
                      ✓ Consultation notes saved successfully!
                    </div>
                  )}

                  <textarea 
                    rows="8"
                    placeholder="Document clinical diagnosis, patient symptoms, blood pressure/vitals, and next appointment recommendation..."
                    style={{ 
                      width: '100%', 
                      flex: 1, 
                      padding: '10px 14px', 
                      borderRadius: '8px', 
                      border: '1px solid #475569', 
                      background: '#0f172a', 
                      color: 'white', 
                      fontSize: '0.92rem',
                      marginBottom: '10px'
                    }}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <button 
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    style={{ 
                      background: '#0284c7', 
                      color: 'white', 
                      border: 'none', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      fontWeight: 700, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={16} /> {savingNotes ? 'Saving...' : 'Save Notes & Mark Completed'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
