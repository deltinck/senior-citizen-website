import React from 'react';
import { HeartHandshake, PhoneCall, Shield, Globe } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="sage-footer">
      <div className="footer-inner">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', marginBottom: '12px' }}>
            <HeartHandshake size={24} color="#38bdf8" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>SageCare Portal</h3>
          </div>
          <p style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>
            Empowering seniors and their dedicated families with comprehensive health management, daily routines, doctor appointments, and cognitive enrichment.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '14px', fontSize: '1rem', fontWeight: 700 }}>Quick Navigation</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.92rem' }}>
            <li>
              <button onClick={() => setActiveTab('appointments')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                Doctor Appointments
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('medications')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                Medications & Prescriptions
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('routine')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                Daily Care Routine
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('games')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                Brain Booster Memory Games
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '14px', fontSize: '1rem', fontWeight: 700 }}>Emergency Helplines</h4>
          <p style={{ color: '#f43f5e', fontWeight: 800, fontSize: '1.05rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PhoneCall size={18} /> Emergency Helpline: 112
          </p>
          <p style={{ fontSize: '0.88rem' }}>Senior Citizen National Welfare Support: 14567</p>
          <p style={{ fontSize: '0.88rem', marginTop: '4px' }}>Ambulance & Paramedic Dispatch: 108 / 911</p>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '32px auto 0', paddingTop: '20px', borderTop: '1px solid #1e293b', textAlign: 'center', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} SageCare Senior Management System. Built with Django REST Framework & Modern React with Accessibility Guidelines.
      </div>
    </footer>
  );
}
