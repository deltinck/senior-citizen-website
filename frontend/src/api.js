const API_BASE = '/api';

export const api = {
  // 1. Authentication & Users
  async login(email, password) {
    const res = await fetch(`${API_BASE}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || data.status === 'error') {
      throw new Error(data.message || 'Login failed');
    }
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (!res.ok || data.status === 'error') {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  async getDoctors() {
    const res = await fetch(`${API_BASE}/doctors/`);
    if (!res.ok) throw new Error('Failed to load doctors');
    const data = await res.json();
    return data.data || [];
  },

  async getPatients() {
    const res = await fetch(`${API_BASE}/patients/`);
    if (!res.ok) throw new Error('Failed to load patients');
    const data = await res.json();
    return data.data || [];
  },

  // 2. Profile
  async getProfile(email = '') {
    const url = email ? `${API_BASE}/profile/?email=${encodeURIComponent(email)}` : `${API_BASE}/profile/`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load profile');
    return await res.json();
  },

  async updateProfile(data) {
    const res = await fetch(`${API_BASE}/profile/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
  },

  // 3. Appointments
  async getAppointments(filters = {}) {
    let url = `${API_BASE}/appointments/`;
    const params = new URLSearchParams();
    if (filters.doctor_email) params.append('doctor_email', filters.doctor_email);
    if (filters.patient_email) params.append('patient_email', filters.patient_email);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load appointments');
    const data = await res.json();
    return data.data || [];
  },

  async createAppointment(appt) {
    const res = await fetch(`${API_BASE}/appointments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appt),
    });
    if (!res.ok) throw new Error('Failed to create appointment');
    return await res.json();
  },

  async updateAppointment(id, updates) {
    const res = await fetch(`${API_BASE}/appointments/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update appointment');
    return await res.json();
  },

  async deleteAppointment(id) {
    const res = await fetch(`${API_BASE}/appointments/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete appointment');
    return await res.json();
  },

  // 4. Medications
  async getMedications(filters = {}) {
    let url = `${API_BASE}/medications/`;
    const params = new URLSearchParams();
    if (filters.patient_email) params.append('patient_email', filters.patient_email);
    if (filters.patient_name) params.append('patient_name', filters.patient_name);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load medications');
    const data = await res.json();
    return data.data || [];
  },

  async createMedication(med) {
    const res = await fetch(`${API_BASE}/medications/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(med),
    });
    if (!res.ok) throw new Error('Failed to create medication');
    return await res.json();
  },

  async updateMedication(id, updates) {
    const res = await fetch(`${API_BASE}/medications/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update medication');
    return await res.json();
  },

  async deleteMedication(id) {
    const res = await fetch(`${API_BASE}/medications/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete medication');
    return await res.json();
  },

  // 5. Routines
  async getRoutines() {
    const res = await fetch(`${API_BASE}/routines/`);
    if (!res.ok) throw new Error('Failed to load routines');
    const data = await res.json();
    return data.data || [];
  },

  async createRoutine(routine) {
    const res = await fetch(`${API_BASE}/routines/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routine),
    });
    if (!res.ok) throw new Error('Failed to create routine');
    return await res.json();
  },

  async updateRoutine(id, is_completed) {
    const res = await fetch(`${API_BASE}/routines/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_completed }),
    });
    if (!res.ok) throw new Error('Failed to update routine');
    return await res.json();
  },

  async deleteRoutine(id) {
    const res = await fetch(`${API_BASE}/routines/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete routine');
    return await res.json();
  },

  // 6. Tasks
  async getTasks() {
    const res = await fetch(`${API_BASE}/tasks/`);
    if (!res.ok) throw new Error('Failed to load tasks');
    const data = await res.json();
    return data.data || [];
  },

  async createTask(task) {
    const res = await fetch(`${API_BASE}/tasks/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
  },

  async updateTaskStatus(id, status) {
    const res = await fetch(`${API_BASE}/tasks/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}/`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
    return await res.json();
  },

  // 7. Game Scores
  async getScores() {
    const res = await fetch(`${API_BASE}/scores/`);
    if (!res.ok) throw new Error('Failed to load scores');
    const data = await res.json();
    return data.data || [];
  },

  async saveScore(scoreData) {
    const res = await fetch(`${API_BASE}/scores/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scoreData),
    });
    if (!res.ok) throw new Error('Failed to save score');
    return await res.json();
  }
};
