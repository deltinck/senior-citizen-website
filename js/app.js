/**
 * SageCare - Core JavaScript Library
 * Handles Header/Footer Sync, Django REST API, Voice Assistant, Accessibility, and Chatbot
 */

const SageCare = {
  // Django API endpoints
  apiBase: '/api',

  init() {
    this.renderAccessibilityBar();
    this.renderNavbar();
    this.renderFooter();
    this.renderFloatingWidgets();
    this.setupAccessibilityListeners();
    this.setupVoiceAssistant();
    this.restoreSettings();
  },

  // 1. Senior Accessibility Top Bar
  renderAccessibilityBar() {
    if (document.getElementById('sage-acc-bar')) return;
    const bar = document.createElement('div');
    bar.id = 'sage-acc-bar';
    bar.className = 'accessibility-bar';
    bar.innerHTML = `
      <div><i class="fas fa-eye"></i> Senior Accessibility Tools</div>
      <div class="accessibility-tools">
        <span>Text Size:</span>
        <button class="acc-btn" onclick="SageCare.setFontSize('normal')">A</button>
        <button class="acc-btn" onclick="SageCare.setFontSize('large')">A+</button>
        <button class="acc-btn" onclick="SageCare.setFontSize('xlarge')">A++</button>
        <button class="acc-btn" onclick="SageCare.toggleContrast()"><i class="fas fa-adjust"></i> High Contrast</button>
        <button class="acc-btn" onclick="SageCare.readPage()"><i class="fas fa-volume-up"></i> Read Screen</button>
      </div>
    `;
    document.body.prepend(bar);
  },

  // 2. Navigation Header Injection
  renderNavbar() {
    if (document.getElementById('sage-navbar')) return;
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    const nav = document.createElement('nav');
    nav.id = 'sage-navbar';
    nav.className = 'sage-navbar';
    nav.innerHTML = `
      <a href="index.html" class="sage-brand">
        <div class="sage-brand-logo"><i class="fas fa-heartbeat"></i></div>
        <span class="sage-brand-text">SageCare</span>
      </a>
      <ul class="sage-nav-links">
        <li><a href="index.html" class="sage-nav-link ${currentPath === 'index.html' ? 'active' : ''}"><i class="fas fa-home"></i> Home</a></li>
        <li><a href="appointment.html" class="sage-nav-link ${currentPath === 'appointment.html' ? 'active' : ''}"><i class="fas fa-calendar-check"></i> Appointments</a></li>
        <li><a href="health.html" class="sage-nav-link ${currentPath === 'health.html' ? 'active' : ''}"><i class="fas fa-pills"></i> Medications</a></li>
        <li><a href="routine.html" class="sage-nav-link ${currentPath === 'routine.html' ? 'active' : ''}"><i class="fas fa-clock"></i> Daily Routine</a></li>
        <li><a href="profile.html" class="sage-nav-link ${currentPath === 'profile.html' ? 'active' : ''}"><i class="fas fa-user-circle"></i> Profile</a></li>
        <li><a href="games.html" class="sage-nav-link ${currentPath === 'games.html' ? 'active' : ''}"><i class="fas fa-gamepad"></i> Brain Games</a></li>
        <li><a href="tracker.html" class="sage-nav-link ${currentPath === 'tracker.html' ? 'active' : ''}"><i class="fas fa-tasks"></i> Tracker</a></li>
        <li><a href="entertain.html" class="sage-nav-link ${currentPath === 'entertain.html' ? 'active' : ''}"><i class="fas fa-tv"></i> Entertainment</a></li>
        <li><a href="about.html" class="sage-nav-link ${currentPath === 'about.html' ? 'active' : ''}"><i class="fas fa-info-circle"></i> About</a></li>
        <li><a href="login.html" class="sage-nav-link sage-nav-cta"><i class="fas fa-sign-in-alt"></i> Login</a></li>
      </ul>
    `;
    
    const accBar = document.getElementById('sage-acc-bar');
    if (accBar && accBar.nextSibling) {
      document.body.insertBefore(nav, accBar.nextSibling);
    } else {
      document.body.prepend(nav);
    }
  },

  // 3. Footer Injection
  renderFooter() {
    if (document.getElementById('sage-footer')) return;
    const footer = document.createElement('footer');
    footer.id = 'sage-footer';
    footer.className = 'sage-footer';
    footer.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; text-align: left;">
        <div>
          <h3 style="color: white; margin-bottom: 10px;"><i class="fas fa-heartbeat" style="color: #14b8a6;"></i> SageCare Portal</h3>
          <p>Empowering seniors to live healthy, independent, and joyful lives.</p>
        </div>
        <div>
          <h4 style="color: white; margin-bottom: 10px;">Quick Links</h4>
          <p><a href="appointment.html">Book Appointment</a> | <a href="health.html">Medications</a> | <a href="games.html">Brain Games</a></p>
        </div>
        <div>
          <h4 style="color: white; margin-bottom: 10px;">Emergency Services</h4>
          <p style="color: #f43f5e; font-weight: bold;"><i class="fas fa-phone-alt"></i> Emergency Helpline: 112</p>
        </div>
      </div>
      <div style="margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px;">
        &copy; 2026 SageCare Elderly Assistance System. Built with Django & Senior Accessibility Standards.
      </div>
    `;
    document.body.appendChild(footer);
  },

  // 4. Floating Voice & Chatbot Widgets
  renderFloatingWidgets() {
    if (document.getElementById('sage-floating-widgets')) return;
    const container = document.createElement('div');
    container.id = 'sage-floating-widgets';
    container.innerHTML = `
      <!-- Mic Button -->
      <button class="floating-widget-btn floating-mic-btn" id="voice-trigger-btn" title="Voice Assistant">
        <i class="fas fa-microphone"></i>
      </button>

      <!-- Chatbot Button -->
      <button class="floating-widget-btn" id="chat-trigger-btn" title="AI Chatbot">
        <i class="fas fa-comments"></i>
      </button>

      <!-- Voice Assistant Panel -->
      <div class="voice-assistant-panel" id="voice-panel">
        <div class="voice-panel-header">
          <h3 style="color: var(--primary);"><i class="fas fa-robot"></i> Voice Assistant</h3>
          <button class="acc-btn" onclick="SageCare.toggleVoicePanel()">✕</button>
        </div>
        <div class="voice-status" id="voice-status-text">Press the microphone icon and speak your command...</div>
        <button class="btn btn-primary btn-block" id="start-listen-btn">
          <i class="fas fa-microphone"></i> Start Listening
        </button>
      </div>

      <!-- Chatbot Iframe Panel -->
      <div class="voice-assistant-panel" id="chat-panel" style="width: 380px; height: 500px;">
        <div class="voice-panel-header">
          <h3 style="color: var(--primary);"><i class="fas fa-comment-dots"></i> SageCare CareBot</h3>
          <button class="acc-btn" onclick="SageCare.toggleChatPanel()">✕</button>
        </div>
        <iframe src="https://www.chatbase.co/chatbot-iframe/Qucvhwz-VTOK-VmNrkXCN" width="100%" height="420px" frameborder="0"></iframe>
      </div>
    `;
    document.body.appendChild(container);

    document.getElementById('voice-trigger-btn').addEventListener('click', () => this.toggleVoicePanel());
    document.getElementById('chat-trigger-btn').addEventListener('click', () => this.toggleChatPanel());
    document.getElementById('start-listen-btn').addEventListener('click', () => this.startVoiceRecognition());
  },

  toggleVoicePanel() {
    const vPanel = document.getElementById('voice-panel');
    const cPanel = document.getElementById('chat-panel');
    cPanel.classList.remove('active');
    vPanel.classList.toggle('active');
  },

  toggleChatPanel() {
    const vPanel = document.getElementById('voice-panel');
    const cPanel = document.getElementById('chat-panel');
    vPanel.classList.remove('active');
    cPanel.classList.toggle('active');
  },

  // 5. Senior Accessibility Settings
  setFontSize(size) {
    document.body.classList.remove('text-large', 'text-xlarge');
    if (size === 'large') document.body.classList.add('text-large');
    if (size === 'xlarge') document.body.classList.add('text-xlarge');
    localStorage.setItem('sage_font_size', size);
  },

  toggleContrast() {
    document.body.classList.toggle('high-contrast');
    const isContrast = document.body.classList.contains('high-contrast');
    localStorage.setItem('sage_contrast', isContrast ? 'true' : 'false');
  },

  restoreSettings() {
    const fontSize = localStorage.getItem('sage_font_size');
    if (fontSize) this.setFontSize(fontSize);
    const contrast = localStorage.getItem('sage_contrast');
    if (contrast === 'true') document.body.classList.add('high-contrast');
  },

  readPage() {
    const text = document.querySelector('main') ? document.querySelector('main').innerText : document.body.innerText;
    this.speak(text.substring(0, 500) + "...");
  },

  speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  },

  // 6. Voice Assistant Logic
  setupVoiceAssistant() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.onstart = () => {
        const status = document.getElementById('voice-status-text');
        if (status) status.textContent = "Listening... Speak now!";
      };
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const status = document.getElementById('voice-status-text');
        if (status) status.textContent = `You said: "${transcript}"`;
        this.processVoiceCommand(transcript);
      };
      this.recognition.onerror = () => {
        const status = document.getElementById('voice-status-text');
        if (status) status.textContent = "Sorry, I couldn't hear that clearly. Try again.";
      };
    }
  },

  startVoiceRecognition() {
    if (this.recognition) {
      this.recognition.start();
    } else {
      this.speak("Speech recognition is not supported in this browser.");
    }
  },

  processVoiceCommand(cmd) {
    if (cmd.includes('appointment') || cmd.includes('doctor')) {
      this.speak("Opening Doctor Appointments page.");
      window.location.href = "appointment.html";
    } else if (cmd.includes('medication') || cmd.includes('medicine') || cmd.includes('pill')) {
      this.speak("Opening Medication and Prescription records.");
      window.location.href = "health.html";
    } else if (cmd.includes('routine') || cmd.includes('daily')) {
      this.speak("Opening Daily Care Routine.");
      window.location.href = "routine.html";
    } else if (cmd.includes('game') || cmd.includes('brain')) {
      this.speak("Opening Cognitive Brain Games.");
      window.location.href = "games.html";
    } else if (cmd.includes('tracker') || cmd.includes('task')) {
      this.speak("Opening Personal Task Tracker.");
      window.location.href = "tracker.html";
    } else if (cmd.includes('emergency') || cmd.includes('help')) {
      this.speak("Emergency assistance requested. Please call 112 or your emergency contact.");
      alert("Emergency Helpline: 112");
    } else if (cmd.includes('time')) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.speak(`The current time is ${now}`);
    } else {
      this.speak(`Searching information for ${cmd}`);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(cmd)}`, '_blank');
    }
  },

  // 7. API Helper Functions with LocalStorage Fallback
  async fetchAPI(url, options = {}) {
    try {
      const res = await fetch(this.apiBase + url, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("API request failed, using localStorage fallback:", e);
    }
    return null;
  }
};

document.addEventListener('DOMContentLoaded', () => SageCare.init());
