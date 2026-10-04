import React from 'react';
import { Eye, Volume2, SunMoon, Type } from 'lucide-react';

export default function AccessibilityBar({ fontSize, setFontSize, highContrast, setHighContrast, onReadPage }) {
  return (
    <div className="acc-bar">
      <div className="acc-bar-title">
        <Eye size={18} />
        <span>Senior Accessibility & Comfort Controls</span>
      </div>
      <div className="acc-tools">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.9 }}>
          <Type size={16} /> Text Size:
        </span>
        <button
          className={`acc-pill ${fontSize === 'normal' ? 'active' : ''}`}
          onClick={() => setFontSize('normal')}
          title="Normal Text Size"
        >
          A
        </button>
        <button
          className={`acc-pill ${fontSize === 'large' ? 'active' : ''}`}
          onClick={() => setFontSize('large')}
          title="Large Text Size"
        >
          A+
        </button>
        <button
          className={`acc-pill ${fontSize === 'xlarge' ? 'active' : ''}`}
          onClick={() => setFontSize('xlarge')}
          title="Extra Large Text Size"
        >
          A++
        </button>

        <button
          className={`acc-pill ${highContrast ? 'active' : ''}`}
          onClick={() => setHighContrast(!highContrast)}
          style={{ marginLeft: '8px' }}
        >
          <SunMoon size={16} /> {highContrast ? 'Standard View' : 'High Contrast'}
        </button>

        <button
          className="acc-pill"
          onClick={onReadPage}
          style={{ background: '#0d9488', borderColor: '#14b8a6' }}
          title="Text-to-speech page reader"
        >
          <Volume2 size={16} /> Read Page Aloud
        </button>
      </div>
    </div>
  );
}
