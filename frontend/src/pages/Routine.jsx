import React, { useState } from 'react';
import { Sun, CloudSun, Coffee, Moon, Volume2, CheckCircle } from 'lucide-react';

export default function Routine() {
  const [currentStage, setCurrentStage] = useState('Morning');

  const defaultRoutines = {
    Morning: [
      { time: '6:00 AM', activity: 'Wake Up & Hydrate', icon: '🌅', done: true },
      { time: '7:00 AM', activity: 'Morning Stretch & Prayer', icon: '🧘‍♀️', done: true },
      { time: '8:00 AM', activity: 'Healthy Breakfast', icon: '🍳', done: true },
      { time: '8:30 AM', activity: 'Take Morning Pills (Lisinopril)', icon: '💊', done: false }
    ],
    Midday: [
      { time: '12:00 PM', activity: 'Nutritious Lunch & Rest', icon: '🥗', done: false },
      { time: '1:30 PM', activity: 'Afternoon Nap', icon: '😴', done: false }
    ],
    Evening: [
      { time: '5:30 PM', activity: 'Walk in Garden', icon: '🌳', done: false },
      { time: '7:30 PM', activity: 'Dinner', icon: '🍲', done: false }
    ],
    Bedtime: [
      { time: '9:30 PM', activity: 'Take Bedtime Pills (Calcium)', icon: '💊', done: false },
      { time: '10:00 PM', activity: 'Sleep', icon: '🌙', done: false }
    ]
  };

  const [routineData, setRoutineData] = useState(() => {
    return JSON.parse(localStorage.getItem('sage_routines') || JSON.stringify(defaultRoutines));
  });

  const toggleItem = (idx) => {
    const updated = { ...routineData };
    updated[currentStage][idx].done = !updated[currentStage][idx].done;
    setRoutineData(updated);
    localStorage.setItem('sage_routines', JSON.stringify(updated));
  };

  const speakItem = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const total = Object.values(routineData).flat().length;
  const doneCount = Object.values(routineData).flat().filter(i => i.done).length;
  const pct = Math.round((doneCount / total) * 100);

  return (
    <main className="sc-container">
      <div className="sc-hero" style={{ background: 'linear-gradient(135deg, #10b981 0%, #0f766e 100%)' }}>
        <h1><Sun size={32} /> Daily Care Routine & Pill Schedule</h1>
        <p>Maintain a balanced daily routine for exercise, prayer, meals, and medicines.</p>
      </div>

      {/* Progress Card */}
      <div className="sc-card" style={{ background: 'linear-gradient(135deg, #e6f7ed, #e0f2fe)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle /> Routine Completion</h3>
          <p style={{ color: 'var(--text-muted)' }}>Complete your scheduled activities throughout the day</p>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>{pct}%</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', margin: '24px 0', justifyContent: 'center' }}>
        <button className={`sc-btn ${currentStage === 'Morning' ? 'sc-btn-primary' : 'sc-btn-outline'}`} onClick={() => setCurrentStage('Morning')}><Sun size={18} /> Morning</button>
        <button className={`sc-btn ${currentStage === 'Midday' ? 'sc-btn-primary' : 'sc-btn-outline'}`} onClick={() => setCurrentStage('Midday')}><CloudSun size={18} /> Midday</button>
        <button className={`sc-btn ${currentStage === 'Evening' ? 'sc-btn-primary' : 'sc-btn-outline'}`} onClick={() => setCurrentStage('Evening')}><Coffee size={18} /> Evening</button>
        <button className={`sc-btn ${currentStage === 'Bedtime' ? 'sc-btn-primary' : 'sc-btn-outline'}`} onClick={() => setCurrentStage('Bedtime')}><Moon size={18} /> Bedtime</button>
      </div>

      {/* Table */}
      <div className="sc-card">
        <div className="sc-card-title">{currentStage} Schedule</div>
        <table className="sc-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Done</th>
              <th style={{ width: '140px' }}>Time</th>
              <th>Activity / Medication</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {routineData[currentStage]?.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <input type="checkbox" checked={item.done} onChange={() => toggleItem(idx)} style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                </td>
                <td><strong>{item.time}</strong></td>
                <td>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>{item.icon}</span>
                  <span style={{ textDecoration: item.done ? 'line-through' : 'none', opacity: item.done ? 0.6 : 1 }}>{item.activity}</span>
                </td>
                <td>
                  <button className="acc-btn" onClick={() => speakItem(`${item.time}: ${item.activity}`)}><Volume2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
