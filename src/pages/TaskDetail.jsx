import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import { getStatusBadgeClass, getInitials, stringToColor, formatDate, STATUS_OPTIONS } from '../utils/helpers';
import './TaskDetail.css';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await API.post(`/tasks/${id}`, { status: newStatus });
      setTask(res.data);
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      navigate('/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar title="Task Details" />
        <div className="main-content">
          <div className="loading-spinner"><div className="spinner"></div></div>
        </div>
      </>
    );
  }

  if (!task) {
    return (
      <>
        <Navbar title="Task Details" />
        <div className="main-content">
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h3>Task not found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/tasks')}>Back to Tasks</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="Task Details" />
      <div className="main-content">
        <button className="btn btn-ghost btn-sm back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="task-detail-card">
          <div className="task-detail-header">
            <div>
              <h1 className="task-detail-title">{task.name}</h1>
              <span className={`badge ${getStatusBadgeClass(task.status)}`} style={{ fontSize: '0.8rem', padding: '0.35rem 0.875rem' }}>
                {task.status}
              </span>
            </div>
            <div className="task-detail-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowEditForm(true)}>
                ✎ Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                ✕ Delete
              </button>
            </div>
          </div>

          <div className="task-detail-grid">
            <div className="detail-item">
              <span className="detail-label">Project</span>
              <span className="detail-value">
                <span className="detail-icon">◉</span>
                {task.project?.name || 'N/A'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Team</span>
              <span className="detail-value">
                <span className="detail-icon">⚑</span>
                {task.team?.name || 'N/A'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Time to Complete</span>
              <span className="detail-value">
                <span className="detail-icon">⏱</span>
                {task.timeToComplete} days
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Created</span>
              <span className="detail-value">
                {formatDate(task.createdAt)}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Last Updated</span>
              <span className="detail-value">
                {formatDate(task.updatedAt)}
              </span>
            </div>
          </div>

          {/* Owners */}
          <div className="detail-section">
            <h4 className="detail-section-title">Owners</h4>
            <div className="owners-list">
              {task.owners?.map((owner, i) => (
                <div key={owner._id || i} className="owner-item">
                  <div
                    className="owner-avatar"
                    style={{ background: stringToColor(owner.name) }}
                  >
                    {getInitials(owner.name)}
                  </div>
                  <div className="owner-info">
                    <span className="owner-name">{owner.name}</span>
                    <span className="owner-email">{owner.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {task.tags?.length > 0 && (
            <div className="detail-section">
              <h4 className="detail-section-title">Tags</h4>
              <div className="tags-list">
                {task.tags.map((tag, i) => (
                  <span key={i} className="badge badge-tag" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status Update */}
          <div className="detail-section">
            <h4 className="detail-section-title">Update Status</h4>
            <div className="status-actions">
              {STATUS_OPTIONS.map(status => (
                <button
                  key={status}
                  className={`btn btn-sm ${task.status === status ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || task.status === status}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {task.status !== 'Completed' && (
            <button
              className="btn btn-primary btn-lg mark-complete-btn"
              onClick={() => handleStatusChange('Completed')}
              disabled={updating}
            >
              ✓ Mark as Complete
            </button>
          )}
        </div>
      </div>

      {showEditForm && (
        <TaskForm
          initialData={task}
          onClose={() => setShowEditForm(false)}
          onSave={() => {
            setShowEditForm(false);
            fetchTask();
          }}
        />
      )}
    </>
  );
}
