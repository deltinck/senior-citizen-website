import React from 'react';
import { 
  Calendar, 
  Pill, 
  CheckCircle2, 
  Trophy, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  Heart,
  Plus
} from 'lucide-react';

export default function Dashboard({ 
  profile, 
  appointments, 
  medications, 
  routines, 
  tasks, 
  scores, 
  setActiveTab 
}) {
  const nextAppt = appointments && appointments.length > 0 ? appointments[0] : null;
  const activeMeds = medications.filter(m => m.is_active);
  const completedRoutines = routines.filter(r => r.is_completed).length;
  const routinePercent = routines.length > 0 ? Math.round((completedRoutines / routines.length) * 100) : 0;
  const topScore = scores && scores.length > 0 ? scores[0].score : 450;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      {/* Hero Welcome */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px 32px',
        color: 'white',
        marginBottom: '28px',
        boxShadow: '0 10px 25px rgba(2, 132, 199, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', marginBottom: '12px' }}>
            <Activity size={16} /> SageCare Active Health Monitoring
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>
            {greeting}, {profile?.name || 'Arthur'}!
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: 0.95, lineHeight: 1.6 }}>
            "Empowering seniors to live healthy, independent, and joyful lives with compassion and dignified care."
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setActiveTab('appointments')}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          >
            <Calendar size={18} /> Schedule Doctor Visit
          </button>
          <button 
            className="btn btn-outline" 
            onClick={() => setActiveTab('medications')}
            style={{ color: 'white', borderColor: 'white', background: 'rgba(255,255,255,0.1)' }}
          >
            <Pill size={18} /> View Medications
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid-3" style={{ marginBottom: '32px' }}>
        {/* Next Appointment Card */}
        <div className="card" style={{ borderTop: '5px solid #0284c7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.95rem' }}>NEXT DOCTOR VISIT</div>
            <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '8px', borderRadius: '10px' }}>
              <Calendar size={22} />
            </div>
          </div>
          {nextAppt ? (
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '4px' }}>
                {nextAppt.doctor_name}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '10px' }}>
                {nextAppt.consultation_type} • {nextAppt.appointment_date} at {nextAppt.appointment_time}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge badge-${nextAppt.status.toLowerCase()}`}>
                  {nextAppt.status}
                </span>
                <button 
                  onClick={() => setActiveTab('appointments')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Manage <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>
              <p>No upcoming visits scheduled.</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: '8px' }} onClick={() => setActiveTab('appointments')}>
                Book a Visit
              </button>
            </div>
          )}
        </div>

        {/* Medications Card */}
        <div className="card" style={{ borderTop: '5px solid #0d9488' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.95rem' }}>ACTIVE MEDICATIONS</div>
            <div style={{ background: '#ccfbf1', color: '#0d9488', padding: '8px', borderRadius: '10px' }}>
              <Pill size={22} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '4px' }}>
            {activeMeds.length} Active Prescriptions
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '12px' }}>
            {activeMeds.length > 0 ? `${activeMeds[0].medicine_name} (${activeMeds[0].dosage})` : 'All prescriptions up to date'}
          </p>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => setActiveTab('medications')}
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>Check Pill Routine</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Daily Routine Completion */}
        <div className="card" style={{ borderTop: '5px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.95rem' }}>TODAY'S ROUTINE</div>
            <div style={{ background: '#dcfce7', color: '#10b981', padding: '8px', borderRadius: '10px' }}>
              <CheckCircle2 size={22} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>
              {routinePercent}%
            </h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              ({completedRoutines} of {routines.length} completed)
            </span>
          </div>
          {/* Progress bar */}
          <div style={{ width: '100%', height: '10px', background: 'var(--border-color)', borderRadius: '5px', overflow: 'hidden', marginBottom: '14px' }}>
            <div style={{ width: `${routinePercent}%`, height: '100%', background: '#10b981', transition: 'width 0.4s' }} />
          </div>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => setActiveTab('routine')}
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>Review Routine Steps</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Brain Score Card */}
        <div className="card" style={{ borderTop: '5px solid #f59e0b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.95rem' }}>COGNITIVE BRAIN SCORE</div>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '8px', borderRadius: '10px' }}>
              <Trophy size={22} />
            </div>
          </div>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', marginBottom: '4px' }}>
            {topScore} Points
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '12px' }}>
            Brain Fitness Rank: Level 4 Cognitive Master
          </p>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => setActiveTab('games')}
            style={{ width: '100%', justifyContent: 'space-between', background: '#f59e0b', borderColor: '#f59e0b' }}
          >
            <span>Play Memory Games</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Two-Column Deep Dive: Today's Schedule & Health Snapshot */}
      <div className="grid-2">
        {/* Today's Care Schedule */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="var(--primary)" /> Today's Care Schedule
            </h3>
            <button 
              className="btn btn-sm btn-outline" 
              onClick={() => setActiveTab('routine')}
            >
              All Activities
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {routines.slice(0, 4).map((r) => (
              <div 
                key={r.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  background: r.is_completed ? 'var(--primary-light)' : 'var(--bg-page)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  opacity: r.is_completed ? 0.8 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{r.icon_symbol || '📌'}</span>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.98rem' }}>{r.activity}</strong>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.stage} • {r.time_str}</span>
                  </div>
                </div>
                <span className={`badge ${r.is_completed ? 'badge-confirmed' : 'badge-pending'}`}>
                  {r.is_completed ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Member Health & Emergency Details */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="var(--secondary)" /> Senior Member Profile Snapshot
            </h3>
            <button 
              className="btn btn-sm btn-outline" 
              onClick={() => setActiveTab('profile')}
            >
              Full Profile
            </button>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '20px' }}>
            <img 
              src={profile?.photo_data || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"} 
              alt={profile?.name || "Senior Member"} 
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }}
            />
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{profile?.name || 'Arthur Pendelton'}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Age: {profile?.age || 74} years • Primary Care ID: #SC-7402</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{profile?.address || 'Brookside Gardens, CA'}</p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-page)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>
              ALLERGIES & MEDICAL PRECAUTIONS
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
              {profile?.allergies || 'Penicillin, Sulfa drugs, Raw Shellfish'}
            </p>
          </div>

          <div style={{ background: 'var(--bg-page)', padding: '14px 18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '4px' }}>
              EMERGENCY CONTACT
            </div>
            <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
              {profile?.emergency_contact || 'Eleanor Pendelton (Daughter)'} —{' '}
              <a href={`tel:${profile?.emergency_phone}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                {profile?.emergency_phone || '+1 (555) 234-5678'}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
