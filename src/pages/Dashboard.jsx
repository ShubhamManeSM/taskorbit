import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { getStatusBadgeClass } from '../utils/helpers';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        API.get('/tasks'),
        API.get('/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // My tasks (tasks owned by current user)
  const myTasks = tasks.filter(t =>
    t.owners?.some(o => o._id === user?.id || o._id === user?._id)
  );

  // Helper to determine project status based on its tasks
  const getProjectStatus = (projectId) => {
    const projectTasks = tasks.filter(t => t.project?._id === projectId);
    if (projectTasks.length === 0) return 'To Do';
    if (projectTasks.every(t => t.status === 'Completed')) return 'Completed';
    return 'In Progress';
  };

  if (loading) {
    return (
      <>
        <Navbar title="" />
        <div className="main-content">
          <div className="loading-spinner"><div className="spinner"></div></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="" />
      <div className="main-content">
        
        {/* Projects Section */}
        <div className="section-header">
          <div className="section-title-group">
            <h2>Projects</h2>
            <select className="form-select filter-select">
              <option>Filter</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/projects')}>
            + New Project
          </button>
        </div>

        <div className="project-grid">
          {projects.map(p => {
            const status = getProjectStatus(p._id);
            return (
              <div 
                key={p._id} 
                className="pdf-project-card" 
                onClick={() => navigate(`/projects?project=${encodeURIComponent(p.name)}`)}
              >
                <span className={`badge ${getStatusBadgeClass(status)}`}>{status}</span>
                <h3>{p.name}</h3>
                <p>{p.description || "This project centers around compiling a digital moodboard to set the visual direction and tone for a new brand identity."}</p>
              </div>
            );
          })}
        </div>

        {/* My Tasks Section */}
        <div className="section-header" style={{ marginTop: 'var(--space-xl)' }}>
          <div className="section-title-group">
            <h2>My Tasks</h2>
            <select className="form-select filter-select">
              <option>Filter</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>
            + New Task
          </button>
        </div>

        <div className="task-grid">
          {myTasks.length > 0 ? (
            myTasks.map(task => (
              <TaskCard key={task._id} task={task} />
            ))
          ) : (
            <div className="empty-state">
              <p>No tasks found.</p>
            </div>
          )}
        </div>

      </div>

      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSave={() => {
            setShowTaskForm(false);
            fetchData();
          }}
        />
      )}
    </>
  );
}
