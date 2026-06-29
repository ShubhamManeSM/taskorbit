import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { STATUS_OPTIONS } from '../utils/helpers';
import './TeamView.css';

export default function TeamView() {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [teamError, setTeamError] = useState('');

  const selectedTeam = searchParams.get('team') || '';
  const statusFilter = searchParams.get('status') || '';

  const fetchData = async () => {
    try {
      const [teamsRes, tasksRes] = await Promise.all([
        API.get('/teams'),
        API.get('/tasks')
      ]);
      setTeams(teamsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectTeam = (teamName) => {
    const params = new URLSearchParams(searchParams);
    if (teamName === selectedTeam) {
      params.delete('team');
    } else {
      params.set('team', teamName);
    }
    params.delete('status');
    setSearchParams(params);
  };

  const filterByStatus = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status === statusFilter) {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    setSearchParams(params);
  };

  const filteredTasks = tasks.filter(t => {
    if (selectedTeam && t.team?.name !== selectedTeam) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    return true;
  });

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setTeamError('');
    try {
      await API.post('/teams', newTeam);
      setNewTeam({ name: '', description: '' });
      setShowNewTeam(false);
      fetchData();
    } catch (err) {
      setTeamError(err.response?.data?.message || 'Error creating team');
    }
  };

  const teamColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#06b6d4', '#eab308', '#f43f5e'];

  if (loading) {
    return (
      <>
        <Navbar title="Teams" />
        <div className="main-content">
          <div className="loading-spinner"><div className="spinner"></div></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title="Teams" />
      <div className="main-content">
        <div className="page-header">
          <h1>Teams</h1>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            <button className="btn btn-secondary" onClick={() => setShowNewTeam(!showNewTeam)}>
              {showNewTeam ? 'Cancel' : '+ New Team'}
            </button>
            <button className="btn btn-primary" onClick={() => setShowTaskForm(true)}>
              + New Task
            </button>
          </div>
        </div>

        {/* New Team Form */}
        {showNewTeam && (
          <div className="glass-card" style={{ marginBottom: 'var(--space-lg)' }}>
            {teamError && <div className="error-message">{teamError}</div>}
            <form onSubmit={handleCreateTeam} style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'flex-end' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Enter team name"
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Description</label>
                <input
                  type="text"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                  placeholder="Optional description"
                />
              </div>
              <button type="submit" className="btn btn-primary">Create</button>
            </form>
          </div>
        )}

        {/* Team Cards */}
        <div className="team-grid">
          {teams.map((team, index) => {
            const teamTasks = tasks.filter(t => t.team?._id === team._id);
            const completed = teamTasks.filter(t => t.status === 'Completed').length;
            const inProgress = teamTasks.filter(t => t.status === 'In Progress').length;
            const isSelected = selectedTeam === team.name;
            const color = teamColors[index % teamColors.length];

            return (
              <div
                key={team._id}
                className={`team-card ${isSelected ? 'selected' : ''}`}
                onClick={() => selectTeam(team.name)}
              >
                <div className="team-color-bar" style={{ background: color }}></div>
                <div className="team-card-content">
                  <div className="team-card-header">
                    <h3>{team.name}</h3>
                    <span className="team-member-count">{teamTasks.length} tasks</span>
                  </div>
                  {team.description && (
                    <p className="team-desc">{team.description}</p>
                  )}
                  <div className="team-mini-stats">
                    <span className="mini-stat">
                      <span className="mini-dot" style={{ background: 'var(--status-completed)' }}></span>
                      {completed} done
                    </span>
                    <span className="mini-stat">
                      <span className="mini-dot" style={{ background: 'var(--status-progress)' }}></span>
                      {inProgress} active
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Filters */}
        {selectedTeam && (
          <div className="quick-filters" style={{ marginTop: 'var(--space-lg)' }}>
            {STATUS_OPTIONS.map(status => (
              <button
                key={status}
                className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
                onClick={() => filterByStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        )}

        {/* Task List */}
        {selectedTeam && (
          <section style={{ marginTop: 'var(--space-md)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>
              {selectedTeam} Tasks ({filteredTasks.length})
            </h3>
            {filteredTasks.length > 0 ? (
              <div className="task-grid">
                {filteredTasks.map(task => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <h3>No tasks found</h3>
                <p>No tasks match the current filters</p>
              </div>
            )}
          </section>
        )}

        {!selectedTeam && (
          <div className="empty-state" style={{ marginTop: 'var(--space-xl)' }}>
            <div className="empty-icon">👆</div>
            <h3>Select a team</h3>
            <p>Click on a team card above to view its tasks</p>
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
