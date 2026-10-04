import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, AlertCircle } from 'lucide-react';

export default function VoiceAssistantModal({ isOpen, onClose, setActiveTab }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMsg, setResponseMsg] = useState('Tap the microphone and speak clearly. For example: "Go to medications" or "Show doctor appointments".');

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const processCommand = (cmd) => {
    const text = cmd.toLowerCase();
    if (text.includes('appointment') || text.includes('doctor')) {
      speak("Opening Doctor Appointments.");
      setActiveTab('appointments');
      setResponseMsg("Navigated to Doctor Appointments.");
      setTimeout(onClose, 1200);
    } else if (text.includes('medication') || text.includes('medicine') || text.includes('pill')) {
      speak("Opening Medications and Prescriptions.");
      setActiveTab('medications');
      setResponseMsg("Navigated to Medications.");
      setTimeout(onClose, 1200);
    } else if (text.includes('routine') || text.includes('daily') || text.includes('schedule')) {
      speak("Opening Daily Routine.");
      setActiveTab('routine');
      setResponseMsg("Navigated to Daily Routine.");
      setTimeout(onClose, 1200);
    } else if (text.includes('game') || text.includes('brain') || text.includes('memory')) {
      speak("Opening Cognitive Brain Booster games.");
      setActiveTab('games');
      setResponseMsg("Navigated to Brain Games.");
      setTimeout(onClose, 1200);
    } else if (text.includes('task') || text.includes('shopping') || text.includes('grocery')) {
      speak("Opening Task Tracker.");
      setActiveTab('tasks');
      setResponseMsg("Navigated to Tasks.");
      setTimeout(onClose, 1200);
    } else if (text.includes('profile') || text.includes('doctor') || text.includes('emergency')) {
      speak("Opening Member Profile.");
      setActiveTab('profile');
      setResponseMsg("Navigated to Member Profile.");
      setTimeout(onClose, 1200);
    } else if (text.includes('time')) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      speak(`The current time is ${now}`);
      setResponseMsg(`The current time is ${now}`);
    } else {
      speak(`I heard: ${text}. Trying to find related information.`);
      setResponseMsg(`Understood: "${text}". Please choose from Appointments, Medications, Routine, or Games.`);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setResponseMsg("Listening... Speak now!");
      };

      recognition.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        processCommand(result);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setResponseMsg("Could not detect clear speech. Please tap the microphone and speak again.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', padding: '36px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={22} color="var(--primary)" /> SageCare Voice Helper
          </h3>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', marginBottom: '24px' }}>
          Hands-free voice assistant designed specifically for senior accessibility and comfort.
        </p>

        {/* Large Voice Action Button */}
        <div style={{ margin: '20px auto' }}>
          <button
            onClick={startListening}
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '50%',
              border: isListening ? '4px solid #ef4444' : '4px solid #0284c7',
              background: isListening ? '#fee2e2' : '#e0f2fe',
              color: isListening ? '#dc2626' : '#0284c7',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: isListening ? '0 0 24px rgba(239, 68, 68, 0.4)' : '0 8px 20px rgba(2, 132, 199, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {isListening ? <MicOff size={42} /> : <Mic size={42} />}
          </button>
          <div style={{ marginTop: '12px', fontWeight: 700, color: isListening ? '#dc2626' : 'var(--primary-dark)' }}>
            {isListening ? 'Listening to your voice...' : 'Tap to Speak Command'}
          </div>
        </div>

        {transcript && (
          <div style={{ background: 'var(--bg-page)', padding: '12px 16px', borderRadius: '10px', margin: '14px 0', border: '1px solid var(--border-color)', fontSize: '1rem', fontStyle: 'italic' }}>
            "{transcript}"
          </div>
        )}

        <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', color: 'var(--text-main)', fontSize: '0.95rem' }}>
          {responseMsg}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {['Appointments', 'Medications', 'Daily Routine', 'Brain Games'].map((cmd) => (
            <button
              key={cmd}
              className="btn btn-sm btn-outline"
              onClick={() => processCommand(cmd)}
            >
              "{cmd}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
