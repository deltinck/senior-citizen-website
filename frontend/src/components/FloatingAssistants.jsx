import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MessageSquare, X, Robot } from 'lucide-react';

export default function FloatingAssistants() {
  const [showVoice, setShowVoice] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [statusText, setStatusText] = useState('Press microphone to speak your command...');
  const navigate = useNavigate();

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setStatusText('Listening... Speak now!');
      recognition.onresult = (event) => {
        const cmd = event.results[0][0].transcript.toLowerCase();
        setStatusText(`You said: "${cmd}"`);
        processCommand(cmd);
      };
      recognition.onerror = () => setStatusText("Sorry, I couldn't understand. Please try again.");
      recognition.start();
    } else {
      speak('Speech recognition is not supported in this browser.');
    }
  };

  const processCommand = (cmd) => {
    if (cmd.includes('appointment') || cmd.includes('doctor')) {
      speak('Navigating to Doctor Appointments.');
      navigate('/appointments');
    } else if (cmd.includes('medication') || cmd.includes('pill')) {
      speak('Navigating to Medications.');
      navigate('/medications');
    } else if (cmd.includes('routine')) {
      speak('Navigating to Daily Care Routine.');
      navigate('/routine');
    } else if (cmd.includes('game') || cmd.includes('brain')) {
      speak('Navigating to Brain Booster Games.');
      navigate('/games');
    } else if (cmd.includes('tracker')) {
      speak('Navigating to Task Tracker.');
      navigate('/tracker');
    } else {
      speak(`Searching for ${cmd}`);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(cmd)}`, '_blank');
    }
  };

  return (
    <>
      <div className="sc-floating-container">
        <button
          className="sc-float-btn sc-float-mic"
          title="Voice Assistant"
          onClick={() => { setShowVoice(!showVoice); setShowChat(false); }}
        >
          <Mic size={26} />
        </button>

        <button
          className="sc-float-btn sc-float-chat"
          title="AI Chatbot"
          onClick={() => { setShowChat(!showChat); setShowVoice(false); }}
        >
          <MessageSquare size={26} />
        </button>
      </div>

      {showVoice && (
        <div className="sc-card" style={{ position: 'fixed', bottom: '100px', right: '28px', width: '340px', zIndex: 1000, boxShadow: '0 20px 30px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}><Robot size={20} /> Voice Assistant</h4>
            <button className="acc-btn" onClick={() => setShowVoice(false)}><X size={16} /></button>
          </div>
          <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px', fontSize: '0.9rem', marginBottom: '14px' }}>
            {statusText}
          </div>
          <button className="sc-btn sc-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={startListening}>
            <Mic size={18} /> Start Listening
          </button>
        </div>
      )}

      {showChat && (
        <div className="sc-card" style={{ position: 'fixed', bottom: '100px', right: '28px', width: '380px', height: '480px', zIndex: 1000, padding: '16px', boxShadow: '0 20px 30px rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ color: 'var(--primary)' }}>SageCare AI CareBot</h4>
            <button className="acc-btn" onClick={() => setShowChat(false)}><X size={16} /></button>
          </div>
          <iframe src="https://www.chatbase.co/chatbot-iframe/Qucvhwz-VTOK-VmNrkXCN" width="100%" height="400px" style={{ border: 'none', borderRadius: '10px' }}></iframe>
        </div>
      )}
    </>
  );
}
