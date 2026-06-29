import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { STATUS_OPTIONS } from '../utils/helpers';
import './TaskForm.css';

export default function TaskForm({ onClose, onSave, initialData = null }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    project: initialData?.project?._id || initialData?.project || '',
    team: initialData?.team?._id || initialData?.team || '',
    owners: initialData?.owners?.map(o => o._id || o) || [user.id || user._id],
    tags: initialData?.tags || [],
    timeToComplete: initialData?.timeToComplete || '',
    dueDate: '', // visual only
    status: initialData?.status || 'To Do'
  });

  useEffect(() => {
    // Fetch dropdown data
    Promise.all([
      API.get('/projects'), 
      API.get('/teams'),
      API.get('/tags')
    ])
      .then(([pRes, tRes, tagRes]) => {
        setProjects(pRes.data);
        setTeams(tRes.data);
        setUsers([]); // Fallback since users API is strictly outside the spec
        setAvailableTags(tagRes.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleMultiSelect = (e, field) => {
    const options = Array.from(e.target.options);
    const selected = options.filter(option => option.selected).map(option => option.value);
    setFormData({ ...formData, [field]: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        project: formData.project,
        team: formData.team,
        owners: formData.owners,
        tags: formData.tags,
        timeToComplete: Number(formData.timeToComplete) || 1,
        status: formData.status
      };
      
      if (initialData) {
        await API.post(`/tasks/${initialData._id}`, payload);
      } else {
        await API.post('/tasks', payload);
      }
      onSave();
    } catch (err) {
      console.error(err);
      alert('Error saving task');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{initialData ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="pdf-task-form">
          
          <div className="form-group">
            <label className="form-label">Task Name</label>
            <input 
              className="form-input" 
              placeholder="Enter Task Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Select Project</label>
              <select 
                className="form-select" 
                value={formData.project}
                onChange={e => setFormData({...formData, project: e.target.value})}
                required
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group flex-1">
              <label className="form-label">Select Team</label>
              <select 
                className="form-select" 
                value={formData.team}
                onChange={e => setFormData({...formData, team: e.target.value})}
                required
              >
                <option value="">Select Team</option>
                {teams.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Owners (Ctrl/Cmd+Click to multi-select)</label>
              <select 
                multiple
                className="form-select multi-select" 
                value={formData.owners}
                onChange={e => handleMultiSelect(e, 'owners')}
                required
              >
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Tags (Ctrl/Cmd+Click to multi-select)</label>
              <select 
                multiple
                className="form-select multi-select" 
                value={formData.tags}
                onChange={e => handleMultiSelect(e, 'tags')}
              >
                {availableTags.map(tag => (
                  <option key={tag._id} value={tag.name}>{tag.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Select Due date</label>
              <input 
                type="date"
                className="form-input"
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Estimated Time (Days)</label>
              <input 
                type="number"
                className="form-input" 
                placeholder="Enter Time in Days"
                value={formData.timeToComplete}
                onChange={e => setFormData({...formData, timeToComplete: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              className="form-select" 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
              required
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialData ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
