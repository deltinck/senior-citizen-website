import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, Heart } from 'lucide-react';

export default function EmergencyBanner({ profile }) {
  const contactName = profile?.emergency_contact || 'Eleanor Pendelton (Daughter)';
  const contactPhone = profile?.emergency_phone || '+1 (555) 234-5678';

  return (
    <aside className="emergency-strip" aria-label="Emergency Assistance">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%' }}>
          <AlertTriangle size={24} color="#ffffff" />
        </div>
        <div>
          <strong style={{ fontSize: '1.05rem', display: 'block' }}>
            Emergency & Care Helpline Available 24/7
          </strong>
          <span style={{ fontSize: '0.9rem', opacity: 0.95 }}>
            Senior Member: <strong>{profile?.name || 'Arthur Pendelton'}</strong> | Emergency Contact: {contactName} ({contactPhone})
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <a 
          href={`tel:${contactPhone.replace(/[^0-9+]/g, '')}`} 
          className="emergency-btn"
          style={{ background: '#fef2f2', color: '#991b1b' }}
        >
          <PhoneCall size={18} />
          <span>Call Caregiver</span>
        </a>
        <a 
          href="tel:112" 
          className="emergency-btn"
        >
          <ShieldAlert size={18} />
          <span>Emergency SOS 112</span>
        </a>
      </div>
    </aside>
  );
}
