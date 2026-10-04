import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Heart, 
  Briefcase, 
  User, 
  Calendar,
  Check
} from 'lucide-react';
import { api } from '../api';

export default function TasksView({ tasks, refreshData }) {
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const [formData, setFormData] = useState({
    task_name: '',
    category: 'Shopping',
    due_date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    { name: 'All', icon: CheckSquare },
    { name: 'Health', icon: Heart },
    { name: 'Shopping', icon: ShoppingCart },
    { name: 'Personal', icon: User },
    { name: 'Work', icon: Briefcase },
  ];

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.updateTaskStatus(id, nextStatus);
      await refreshData();
    } catch (err) {
      alert('Error updating task: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.deleteTask(id);
        await refreshData();
      } catch (err) {
        alert('Error deleting task: ' + err.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createTask({
        ...formData,
        status: 'Pending'
      });
      setShowModal(false);
      setFormData({
        task_name: '',
        category: 'Shopping',
        due_date: new Date().toISOString().split('T')[0],
      });
      await refreshData();
    } catch (err) {
      alert('Error creating task: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(t => {
    if (activeCategory === 'All') return true;
    return t.category.toLowerCase() === activeCategory.toLowerCase();
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckSquare size={28} color="#7c3aed" /> Senior Task & Grocery Tracker
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Organize personal errands, pharmacy refills, grocery lists, and family reminders.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} /> Add New Task
        </button>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={isActive ? { background: '#7c3aed', borderColor: '#7c3aed' } : {}}
              onClick={() => setActiveCategory(cat.name)}
            >
              <Icon size={16} /> {cat.name}
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
          <CheckSquare size={48} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
          <h3>No tasks in this category</h3>
          <p style={{ marginTop: '6px' }}>Add items to stay organized throughout your week.</p>
          <button 
            className="btn btn-primary btn-sm" 
            style={{ marginTop: '16px', background: '#7c3aed', borderColor: '#7c3aed' }}
            onClick={() => setShowModal(true)}
          >
            Create Task
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTasks.map((task) => {
            const isDone = task.status === 'Completed';
            return (
              <div 
                key={task.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  background: isDone ? 'var(--primary-light)' : 'var(--bg-card)',
                  cursor: 'pointer'
                }}
                onClick={() => handleToggleStatus(task.id, task.status)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div 
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      border: isDone ? '2px solid #7c3aed' : '2px solid var(--border-color)',
                      background: isDone ? '#7c3aed' : 'var(--bg-card)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {isDone && <Check size={18} />}
                  </div>

                  <div>
                    <div style={{ 
                      fontSize: '1.05rem', 
                      fontWeight: 700, 
                      textDecoration: isDone ? 'line-through' : 'none',
                      color: isDone ? 'var(--text-muted)' : 'var(--text-main)'
                    }}>
                      {task.task_name}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                      <span className="badge" style={{ background: 'var(--bg-page)', fontSize: '0.8rem' }}>
                        {task.category}
                      </span>
                      {task.due_date && (
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> Due: {task.due_date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span className={`badge ${isDone ? 'badge-confirmed' : 'badge-pending'}`}>
                    {task.status}
                  </span>
                  <button
                    className="btn btn-sm btn-outline"
                    style={{ padding: '6px 10px', color: '#dc2626', borderColor: 'transparent' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task.id);
                    }}
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '16px', color: '#7c3aed' }}>
              Add Personal Task or Errands
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Task Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Order prescription refill or buy groceries"
                  className="form-input"
                  value={formData.task_name}
                  onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Health">Health</option>
                    <option value="Shopping">Shopping & Groceries</option>
                    <option value="Personal">Personal & Family</option>
                    <option value="Work">Work / Administrative</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
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
                  style={{ background: '#7c3aed', borderColor: '#7c3aed' }}
                >
                  {submitting ? 'Saving...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
