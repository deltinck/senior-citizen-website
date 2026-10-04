import React, { useState } from 'react';
import { 
  Sun, 
  Sunrise, 
  Sunset, 
  Moon, 
  Plus, 
  Check, 
  Trash2, 
  Clock, 
  Sparkles,
  CalendarCheck
} from 'lucide-react';
import { api } from '../api';

export default function RoutineView({ routines, refreshData }) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    stage: 'Morning',
    time_str: '08:00 AM',
    activity: '',
    icon_symbol: '📌',
    is_completed: false,
  });

  const stages = [
    { name: 'Morning', icon: Sunrise, color: '#f59e0b', desc: 'Gentle waking, stretching & morning nutrition' },
    { name: 'Midday', icon: Sun, color: '#0284c7', desc: 'Lunch, hydration & mild physical movement' },
    { name: 'Evening', icon: Sunset, color: '#8b5cf6', desc: 'Family time, light dinner & cognitive puzzles' },
    { name: 'Bedtime', icon: Moon, color: '#6366f1', desc: 'Calming routine, herbal tea & restful sleep' },
  ];

  const handleToggleCompleted = async (id, currentStatus) => {
    try {
      await api.updateRoutine(id, !currentStatus);
      await refreshData();
    } catch (err) {
      alert('Error updating routine: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this routine step?')) {
      try {
        await api.deleteRoutine(id);
        await refreshData();
      } catch (err) {
        alert('Error deleting routine: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createRoutine(formData);
      setShowModal(false);
      setFormData({
        stage: 'Morning',
        time_str: '08:00 AM',
        activity: '',
        icon_symbol: '📌',
        is_completed: false,
      });
      await refreshData();
    } catch (err) {
      alert('Error adding routine: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalSteps = routines.length;
  const completedSteps = routines.filter(r => r.is_completed).length;
  const percent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CalendarCheck size={28} color="#059669" /> Daily Care Routine
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Structured daily healthy habits for mind, body, wellness, and peace of mind.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          style={{ background: '#059669', borderColor: '#059669' }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} /> Add Routine Step
        </button>
      </div>

      {/* Daily Progress Overview Banner */}
      <div className="card" style={{ marginBottom: '28px', background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)', border: '1px solid #a7f3d0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#065f46' }}>
              Today's Care Plan Progress: {percent}% Complete
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#047857' }}>
              {completedSteps} out of {totalSteps} daily wellness activities checked off
            </p>
          </div>
          {percent === 100 && (
            <div style={{ background: '#059669', color: 'white', padding: '6px 16px', borderRadius: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={18} /> All Daily Goals Achieved!
            </div>
          )}
        </div>
        <div style={{ width: '100%', height: '12px', background: '#d1fae5', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${percent}%`, height: '100%', background: '#059669', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Stage Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {stages.map((stage) => {
          const StageIcon = stage.icon;
          const stageRoutines = routines.filter(r => r.stage.toLowerCase() === stage.name.toLowerCase());

          return (
            <div key={stage.name} className="card" style={{ borderLeft: `6px solid ${stage.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ background: 'var(--bg-page)', padding: '8px', borderRadius: '10px', color: stage.color }}>
                    <StageIcon size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>{stage.name} Routine</h3>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{stage.desc}</span>
                  </div>
                </div>
                <span className="badge" style={{ background: 'var(--bg-page)', color: 'var(--text-muted)' }}>
                  {stageRoutines.filter(r => r.is_completed).length} / {stageRoutines.length} Done
                </span>
              </div>

              {stageRoutines.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontStyle: 'italic', padding: '8px 0' }}>
                  No activities registered for this time block.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {stageRoutines.map((item) => (
                    <div 
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: item.is_completed ? 'var(--primary-light)' : 'var(--bg-page)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleToggleCompleted(item.id, item.is_completed)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {/* Large Touch Checkbox for Senior Ergonomics */}
                        <div 
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: item.is_completed ? '2px solid #059669' : '2px solid var(--border-color)',
                            background: item.is_completed ? '#059669' : 'var(--bg-card)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          {item.is_completed && <Check size={18} />}
                        </div>

                        <div>
                          <div style={{ 
                            fontSize: '1.05rem', 
                            fontWeight: 600, 
                            textDecoration: item.is_completed ? 'line-through' : 'none',
                            color: item.is_completed ? 'var(--text-muted)' : 'var(--text-main)'
                          }}>
                            <span style={{ marginRight: '8px' }}>{item.icon_symbol || '📌'}</span>
                            {item.activity}
                          </div>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> {item.time_str}
                          </span>
                        </div>
                      </div>

                      <button
                        className="btn btn-sm btn-outline"
                        style={{ padding: '6px 10px', color: '#dc2626', borderColor: 'transparent' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        title="Delete routine step"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Routine Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: '#059669' }}>
              Add Daily Routine Step
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Time of Day</label>
                <select
                  className="form-select"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                >
                  <option value="Morning">Morning</option>
                  <option value="Midday">Midday</option>
                  <option value="Evening">Evening</option>
                  <option value="Bedtime">Bedtime</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Approximate Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:30 AM"
                    className="form-input"
                    value={formData.time_str}
                    onChange={(e) => setFormData({ ...formData, time_str: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Icon Emoji</label>
                  <input
                    type="text"
                    placeholder="e.g. 🌅, 🥣, 🚶‍♂️, 💊"
                    className="form-input"
                    value={formData.icon_symbol}
                    onChange={(e) => setFormData({ ...formData, icon_symbol: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Activity Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15-minute garden walk and hydration"
                  className="form-input"
                  value={formData.activity}
                  onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ background: '#059669', borderColor: '#059669' }}
                >
                  {submitting ? 'Saving...' : 'Add Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
