import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import './TaskList.css';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [searchParams] = useSearchParams();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      // Build query string from URL search params
      const params = {};
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }
      const res = await API.get('/tasks', { params });
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [searchParams]);

  return (
    <>
      <Navbar title="Tasks" />
      <div className="main-content">
        <div className="page-header">
          <h1>All Tasks</h1>
          <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>
            + New Task
          </button>
        </div>

        <FilterBar />

        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div></div>
        ) : tasks.length > 0 ? (
          <div className="task-list-grid">
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No tasks found</h3>
            <p>Try adjusting your filters or create a new task</p>
          </div>
        )}
      </div>

      {showTaskForm && (
        <TaskForm
          onClose={() => setShowTaskForm(false)}
          onSave={() => {
            setShowTaskForm(false);
            fetchTasks();
          }}
        />
      )}
    </>
  );
}
