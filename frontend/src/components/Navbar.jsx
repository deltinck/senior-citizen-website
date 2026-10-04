import React from 'react';
import { 
  HeartHandshake, 
  LayoutDashboard, 
  CalendarCheck, 
  Pill, 
  Clock, 
  CheckSquare, 
  Gamepad2, 
  User, 
  Mic,
  Stethoscope,
  LogIn,
  LogOut,
  Users
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onOpenVoiceModal, 
  onOpenAuthModal, 
  onLogout 
}) {
  const isDoctor = currentUser?.role === 'doctor';

  const seniorNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'appointments', label: 'Doctor Visits', icon: CalendarCheck },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'routine', label: 'Daily Routine', icon: Clock },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'games', label: 'Brain Boosters', icon: Gamepad2 },
    { id: 'profile', label: 'Member Profile', icon: User },
  ];

  const doctorNavItems = [
    { id: 'doctor_portal', label: 'Doctor Clinical Portal', icon: Stethoscope },
    { id: 'appointments', label: 'All Appointments', icon: CalendarCheck },
    { id: 'medications', label: 'Prescriptions Pad', icon: Pill },
  ];

  const navItems = isDoctor ? doctorNavItems : seniorNavItems;

  return (
    <header className="nav-header">
      <div className="nav-inner">
        {/* Brand */}
        <a 
          href="#home" 
          onClick={(e) => {
            e.preventDefault();
            setActiveTab(isDoctor ? 'doctor_portal' : 'dashboard');
          }} 
          className="brand-link"
        >
          <div className="brand-icon-box" style={isDoctor ? { background: 'linear-gradient(135deg, #0d9488, #0284c7)' } : {}}>
            {isDoctor ? <Stethoscope size={26} /> : <HeartHandshake size={28} />}
          </div>
          <div>
            <div className="brand-name">SageCare</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {isDoctor ? 'Physician & Clinical Portal' : 'Senior Management Portal'}
            </div>
          </div>
        </a>

        {/* Dynamic Navigation Tabs */}
        <ul className="nav-tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Right Action Tools: Voice Helper, Current User Badge, Login/Logout */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {!isDoctor && (
            <button
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '24px', padding: '8px 14px' }}
              onClick={onOpenVoiceModal}
              title="Voice Commands Assistant"
            >
              <Mic size={16} />
              <span>Voice</span>
            </button>
          )}

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                onClick={onOpenAuthModal}
                style={{
                  background: isDoctor ? '#ccfbf1' : '#e0f2fe',
                  color: isDoctor ? '#0f766e' : '#0369a1',
                  border: '1.5px solid currentColor',
                  borderRadius: '20px',
                  padding: '6px 14px',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Click to Switch Account or Role"
              >
                {isDoctor ? <Stethoscope size={16} /> : <User size={16} />}
                <span>{currentUser.name}</span>
                <span style={{ fontSize: '0.78rem', background: isDoctor ? '#0f766e' : '#0369a1', color: 'white', padding: '2px 8px', borderRadius: '12px' }}>
                  {isDoctor ? 'Doctor' : 'Senior'}
                </span>
              </button>

              <button
                className="btn btn-sm btn-danger"
                style={{ borderRadius: '20px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
                onClick={onLogout}
                title="Log Out of current account"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-sm"
              style={{ borderRadius: '20px', padding: '8px 18px', fontWeight: 700 }}
              onClick={onOpenAuthModal}
            >
              <LogIn size={16} /> Log In / Register
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
