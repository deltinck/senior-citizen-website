import React, { useState, useEffect } from 'react';
import AccessibilityBar from './components/AccessibilityBar';
import Navbar from './components/Navbar';
import EmergencyBanner from './components/EmergencyBanner';
import Dashboard from './components/Dashboard';
import AppointmentsView from './components/AppointmentsView';
import MedicationsView from './components/MedicationsView';
import RoutineView from './components/RoutineView';
import TasksView from './components/TasksView';
import BrainGamesView from './components/BrainGamesView';
import ProfileView from './components/ProfileView';
import DoctorPortalView from './components/DoctorPortalView';
import TeleCallModal from './components/TeleCallModal';
import AuthModal from './components/AuthModal';
import AuthPage from './components/AuthPage';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import Footer from './components/Footer';
import { api } from './api';

export default function App() {
  // First loading goes directly to Sign In / Sign Up page for patients and doctors
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('sage_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const isDoctor = currentUser?.role === 'doctor';
  const [activeTab, setActiveTab] = useState(isDoctor ? 'doctor_portal' : 'dashboard');
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  // Modals state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [activeCallAppt, setActiveCallAppt] = useState(null);

  // Data states from Django Backend
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [scores, setScores] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Font size & Contrast body class sync
  useEffect(() => {
    document.body.classList.remove('text-large', 'text-xlarge');
    if (fontSize === 'large') document.body.classList.add('text-large');
    if (fontSize === 'xlarge') document.body.classList.add('text-xlarge');
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Load all platform data
  const loadAllData = async () => {
    try {
      const [
        profData, 
        apptsData, 
        medsData, 
        routData, 
        tasksData, 
        scoresData,
        docsData,
        patsData
      ] = await Promise.all([
        api.getProfile().catch(() => null),
        api.getAppointments().catch(() => []),
        api.getMedications().catch(() => []),
        api.getRoutines().catch(() => []),
        api.getTasks().catch(() => []),
        api.getScores().catch(() => []),
        api.getDoctors().catch(() => []),
        api.getPatients().catch(() => []),
      ]);

      if (profData) setProfile(profData);
      if (apptsData) setAppointments(apptsData);
      if (medsData) setMedications(medsData);
      if (routData) setRoutines(routData);
      if (tasksData) setTasks(tasksData);
      if (scoresData) setScores(scoresData);
      if (docsData) setDoctors(docsData);
      if (patsData) setPatients(patsData);
    } catch (e) {
      console.error('Error fetching data from Django backend:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('sage_user', JSON.stringify(user));
    if (user.role === 'doctor') {
      setActiveTab('doctor_portal');
    } else {
      setActiveTab('dashboard');
    }
    loadAllData();
  };

  const handleLogout = () => {
    localStorage.removeItem('sage_user');
    setCurrentUser(null);
  };

  const handleStartCall = (appt) => {
    setActiveCallAppt(appt);
    setIsCallModalOpen(true);
  };

  // If no user is logged in (initial load or after logout), show the Sign In / Sign Up page!
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Senior Text-to-Speech page reader
  const handleReadPage = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    let textToRead = `You are on the SageCare portal, logged in as ${currentUser?.name || 'Member'}. Currently viewing ${activeTab}. `;
    if (activeTab === 'dashboard') {
      textToRead += `You have ${appointments.length} appointments scheduled and ${medications.length} active prescriptions.`;
    } else if (activeTab === 'appointments') {
      textToRead += `There are ${appointments.length} doctor visits listed. You can join online video calls or schedule a new visit.`;
    } else if (activeTab === 'doctor_portal') {
      textToRead += `Doctor portal active. You can launch patient calls and prescribe medicines.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="app-container">
      {/* 1. Senior Accessibility Controls */}
      <AccessibilityBar
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onReadPage={handleReadPage}
      />

      {/* 2. Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 3. Emergency SOS Banner (Visible to all, tailored for seniors) */}
      {!isDoctor && <EmergencyBanner profile={currentUser || profile} />}

      {/* 4. Main Views */}
      <main className="main-content">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>⏳</div>
            <h2>Connecting to SageCare Cloud Health Network...</h2>
          </div>
        ) : (
          <>
            {/* DOCTOR SPECIFIC VIEW */}
            {activeTab === 'doctor_portal' && (
              <DoctorPortalView
                currentUser={currentUser}
                appointments={appointments}
                patients={patients}
                medications={medications}
                refreshData={loadAllData}
                onStartCall={handleStartCall}
              />
            )}

            {/* SENIOR DASHBOARD */}
            {activeTab === 'dashboard' && (
              <Dashboard
                profile={currentUser || profile}
                appointments={appointments}
                medications={medications}
                routines={routines}
                tasks={tasks}
                scores={scores}
                setActiveTab={setActiveTab}
              />
            )}

            {/* APPOINTMENTS VIEW (For both seniors and doctors) */}
            {activeTab === 'appointments' && (
              <AppointmentsView
                appointments={appointments}
                doctors={doctors}
                currentUser={currentUser}
                refreshData={loadAllData}
                onStartCall={handleStartCall}
              />
            )}

            {/* MEDICATIONS VIEW */}
            {activeTab === 'medications' && (
              <MedicationsView
                medications={medications}
                refreshData={loadAllData}
              />
            )}

            {/* ROUTINES VIEW */}
            {activeTab === 'routine' && (
              <RoutineView
                routines={routines}
                refreshData={loadAllData}
              />
            )}

            {/* TASKS VIEW */}
            {activeTab === 'tasks' && (
              <TasksView
                tasks={tasks}
                refreshData={loadAllData}
              />
            )}

            {/* COGNITIVE BRAIN BOOSTERS */}
            {activeTab === 'games' && (
              <BrainGamesView
                scores={scores}
                refreshData={loadAllData}
                profile={currentUser || profile}
              />
            )}

            {/* SENIOR PROFILE */}
            {activeTab === 'profile' && (
              <ProfileView
                profile={currentUser || profile}
                refreshData={loadAllData}
              />
            )}
          </>
        )}
      </main>

      {/* 5. TeleHealth Consultation Call Modal */}
      <TeleCallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        appointment={activeCallAppt}
        currentUser={currentUser}
        onPrescriptionAdded={loadAllData}
      />

      {/* 6. Auth / Registration / Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 7. Voice Helper Modal */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* 8. Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
