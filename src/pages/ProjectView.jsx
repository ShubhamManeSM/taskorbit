import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import { getStatusBadgeClass, getInitials, stringToColor } from '../utils/helpers';
import './ProjectView.css';

export default function ProjectView() {
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get('project');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const fetchData = async () => {
    try {
      const res = await API.get('/tasks');
      // If a project is selected, filter. Otherwise show all projects' tasks.
      let filtered = res.data;
      if (projectName) {
        filtered = res.data.filter(t => t.project?.name === projectName);
      }
      setTasks(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectName]);

  const computeDueDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + (days || 1));
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getMockPriority = (task) => {
    if (task.tags?.includes('Urgent') || task.tags?.includes('High Priority')) return { label: 'High', color: 'var(--priority-high)', bg: 'var(--priority-high-bg)' };
    if (task.timeToComplete < 3) return { label: 'High', color: 'var(--priority-high)', bg: 'var(--priority-high-bg)' };
    if (task.timeToComplete > 5) return { label: 'Low', color: 'var(--priority-low)', bg: 'var(--priority-low-bg)' };
    return { label: 'Medium', color: 'var(--priority-medium)', bg: 'var(--priority-medium-bg)' };
  };

  return (
    <>
      <Navbar title="" />
      <div className="main-content">
        
        <div className="project-view-header">
          <div className="project-view-titles">
            <h1>{projectName ? `Project: ${projectName}` : 'All Projects'}</h1>
            {projectName && <p className="project-desc">This project centers around compiling a digital moodboard to set the visual direction and tone.</p>}
          </div>
        </div>

        <div className="project-view-controls">
          <div className="controls-left">
            <span className="sort-label">Sort by:</span>
            <button className="btn-pill">Priority Low-High</button>
            <button className="btn-pill">Priority High-Low</button>
            <button className="btn-pill">Newest First</button>
            <button className="btn-pill">Oldest First</button>
          </div>
          <div className="controls-right">
            <select className="form-select filter-select" style={{ width: 'auto' }}>
              <option>Filter ▾</option>
            </select>
            <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>
              + New Task
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : (
          <div className="table-container">
            <table className="pdf-task-table">
              <thead>
                <tr>
                  <th>TASKS</th>
                  <th>OWNER</th>
                  <th>PRIORITY</th>
                  <th>DUE ON</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? tasks.map(task => {
                  const prio = getMockPriority(task);
                  return (
                    <tr key={task._id}>
                      <td className="col-task-name">{task.name}</td>
                      <td className="col-owners">
                        <div className="task-owners">
                          {task.owners?.slice(0, 3).map((owner, i) => (
                            <div
                              key={owner._id || i}
                              className="owner-avatar-sm"
                              style={{ background: stringToColor(owner.name || owner) }}
                              title={owner.name || owner}
                            >
                              {getInitials(owner.name || owner)}
                            </div>
                          ))}
                          {task.owners?.length > 3 && (
                            <span className="owner-more">+{task.owners.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="priority-badge" style={{ color: prio.color, backgroundColor: prio.bg }}>
                          {prio.label === 'High' ? '⚑' : '⚑'} {prio.label}
                        </span>
                      </td>
                      <td className="col-due">{computeDueDate(task.timeToComplete)}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>No tasks found in this project.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
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
