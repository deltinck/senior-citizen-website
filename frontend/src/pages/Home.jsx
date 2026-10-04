import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Pill, Brain, UserMd, PrescriptionBottle, Sun, Puzzle, Tasks, Film } from 'lucide-react';
import axios from 'axios';

export default function Home() {
  const [nextAppt, setNextAppt] = useState({ doctor: 'Dr. John Doe', details: 'Cardiologist • Tomorrow at 10:00 AM', status: 'CONFIRMED' });
  const [pillInfo, setPillInfo] = useState({ name: 'Multivitamin & BP Care', schedule: 'Schedule: 8:00 AM & 8:00 PM' });
  const [scoreInfo, setScoreInfo] = useState({ score: 250, level: 3 });

  useEffect(() => {
    // Fetch data from Django API
    axios.get('http://127.0.0.1:8000/api/appointments/')
      .then(res => {
        if (res.data?.data?.length > 0) {
          const appt = res.data.data[0];
          setNextAppt({
            doctor: appt.doctor_name,
            details: `${appt.consultation_type} • ${appt.appointment_date} at ${appt.appointment_time}`,
            status: appt.status.toUpperCase()
          });
        }
      })
      .catch(() => {});

    axios.get('http://127.0.0.1:8000/api/medications/')
      .then(res => {
        if (res.data?.data?.length > 0) {
          const med = res.data.data[0];
          setPillInfo({
            name: `${med.medicine_name} (${med.dosage})`,
            schedule: `Schedule: ${med.frequency}`
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main className="sc-container">
      <!-- Screenshot-Exact Hero Gradient Banner -->
      <section className="sc-hero">
        <h1>Empowering Lives with Compassion and Care</h1>
        <p>"Your wisdom and kindness inspire us all to live life with grace, health, and strength."</p>
        <div className="sc-hero-btns">
          <Link to="/appointments" className="sc-btn sc-btn-primary">
            <Calendar size={18} /> Book Doctor Visit
          </Link>
          <Link to="/medications" className="sc-btn sc-btn-outline">
            <Pill size={18} /> My Medications
          </Link>
        </div>
      </section>

      <!-- Screenshot-Exact 3 Summary Cards Grid -->
      <div className="sc-grid-3">
        <!-- Next Doctor Visit Card -->
        <div className="sc-card" style={{ borderColor: 'var(--primary)' }}>
          <div className="sc-card-title">
            <Calendar size={24} color="var(--primary)" /> Next Doctor Visit
          </div>
          <h3 style={{ color: 'var(--primary)', fontSize: '1.3rem', marginBottom: '4px' }}>{nextAppt.doctor}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{nextAppt.details}</p>
          <span className="sc-badge sc-badge-green">{nextAppt.status}</span>
        </div>

        <!-- Today's Pills Card -->
        <div className="sc-card" style={{ borderColor: 'var(--secondary)' }}>
          <div className="sc-card-title" style={{ color: 'var(--secondary)' }}>
            <Pill size={24} color="var(--secondary)" /> Today's Pills
          </div>
          <h3 style={{ color: 'var(--primary)', fontSize: '1.3rem', marginBottom: '4px' }}>{pillInfo.name}</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{pillInfo.schedule}</p>
          <Link to="/routine" className="sc-btn sc-btn-outline" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', padding: '6px 16px', fontSize: '0.9rem' }}>
            Check Routine
          </Link>
        </div>

        <!-- Brain Score Card -->
        <div className="sc-card" style={{ borderColor: 'var(--accent-gold)' }}>
          <div className="sc-card-title" style={{ color: 'var(--accent-gold)' }}>
            <Brain size={24} color="var(--accent-gold)" /> Brain Score
          </div>
          <div style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
            {scoreInfo.score} pts
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Brain Booster Rank: Level {scoreInfo.level}</p>
          <Link to="/games" className="sc-btn" style={{ background: 'var(--primary)', color: 'white', padding: '8px 18px', fontSize: '0.9rem' }}>
            Play Memory Games
          </Link>
        </div>
      </div>

      <!-- Screenshot-Exact Centered Title -->
      <h2 style={{ fontSize: '2.2rem', fontWeight: '800', textAlign: 'center', color: 'var(--primary)', margin: '40px 0 28px 0' }}>
        Explore Care Services
      </h2>

      <!-- Services Grid -->
      <div className="sc-grid-3">
        <div className="sc-card">
          <UserMd size={40} color="var(--primary)" style={{ marginBottom: '12px' }} />
          <h3>Doctor Appointments</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 16px 0' }}>Book and track medical check-ups with specialist doctors.</p>
          <Link to="/appointments" className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Schedule Now
          </Link>
        </div>

        <div className="sc-card">
          <PrescriptionBottle size={40} color="var(--secondary)" style={{ marginBottom: '12px' }} />
          <h3>Medications & Prescriptions</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 16px 0' }}>Store prescribed medicines, dosages, and doctor instructions.</p>
          <Link to="/medications" className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--secondary)' }}>
            Manage Medicines
          </Link>
        </div>

        <div className="sc-card">
          <Sun size={40} color="#10b981" style={{ marginBottom: '12px' }} />
          <h3>Daily Care Routine</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 16px 0' }}>Balanced schedule for exercises, meals, and medicines.</p>
          <Link to="/routine" className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#10b981' }}>
            View Schedule
          </Link>
        </div>

        <div className="sc-card">
          <Puzzle size={40} color="var(--accent-gold)" style={{ marginBottom: '12px' }} />
          <h3>Brain Boosters</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 16px 0' }}>Fun memory games, fruit matching, and math puzzles.</p>
          <Link to="/games" className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-gold)' }}>
            Play Games
          </Link>
        </div>

        <div className="sc-card">
          <Tasks size={40} color="#8b5cf6" style={{ marginBottom: '12px' }} />
          <h3>Personal Task Tracker</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 16px 0' }}>Wishlist and errand checklist with Chart.js metrics.</p>
          <Link to="/tracker" className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#8b5cf6' }}>
            Open Tracker
          </Link>
        </div>

        <div className="sc-card">
          <Film size={40} color="#f43f5e" style={{ marginBottom: '12px' }} />
          <h3>Senior Entertainment</h3>
          <p style={{ color: 'var(--text-muted)', margin: '10px 0 16px 0' }}>Curated video documentaries, music, and audiobooks.</p>
          <Link to="/entertain" className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center', background: '#f43f5e' }}>
            Watch & Relax
          </Link>
        </div>
      </div>
    </main>
  );
}
