import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import './Reports.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const chartColors = [
  'rgba(99, 102, 241, 0.8)',
  'rgba(139, 92, 246, 0.8)',
  'rgba(236, 72, 153, 0.8)',
  'rgba(249, 115, 22, 0.8)',
  'rgba(34, 197, 94, 0.8)',
  'rgba(6, 182, 212, 0.8)',
  'rgba(234, 179, 8, 0.8)',
  'rgba(244, 63, 94, 0.8)',
];

const chartBorderColors = [
  'rgba(99, 102, 241, 1)',
  'rgba(139, 92, 246, 1)',
  'rgba(236, 72, 153, 1)',
  'rgba(249, 115, 22, 1)',
  'rgba(34, 197, 94, 1)',
  'rgba(6, 182, 212, 1)',
  'rgba(234, 179, 8, 1)',
  'rgba(244, 63, 94, 1)',
];

const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#94a3b8',
        font: { family: 'Inter', size: 12 }
      }
    },
    title: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(26, 29, 46, 0.95)',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(148, 163, 184, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
      titleFont: { family: 'Inter', weight: '600' },
      bodyFont: { family: 'Inter' }
    }
  },
  scales: {
    x: {
      ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
      grid: { color: 'rgba(148, 163, 184, 0.06)' }
    },
    y: {
      ticks: { color: '#64748b', font: { family: 'Inter', size: 11 } },
      grid: { color: 'rgba(148, 163, 184, 0.06)' },
      beginAtZero: true
    }
  }
};

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#94a3b8',
        font: { family: 'Inter', size: 12 },
        padding: 16
      }
    },
    tooltip: {
      backgroundColor: 'rgba(26, 29, 46, 0.95)',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(148, 163, 184, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 12,
    }
  }
};

export default function Reports() {
  const [lastWeek, setLastWeek] = useState(null);
  const [pending, setPending] = useState(null);
  const [closedTasks, setClosedTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [lastWeekRes, pendingRes, closedRes] = await Promise.all([
          API.get('/report/last-week'),
          API.get('/report/pending'),
          API.get('/report/closed-tasks')
        ]);
        setLastWeek(lastWeekRes.data);
        setPending(pendingRes.data);
        setClosedTasks(closedRes.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar title="Reports" />
        <div className="main-content">
          <div className="loading-spinner"><div className="spinner"></div></div>
        </div>
      </>
    );
  }

  // Last Week Bar Chart
  const lastWeekData = {
    labels: Object.keys(lastWeek?.dailyCounts || {}),
    datasets: [{
      label: 'Tasks Completed',
      data: Object.values(lastWeek?.dailyCounts || {}),
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  // Pending by Project Bar Chart
  const pendingLabels = Object.keys(pending?.byProject || {});
  const pendingData = {
    labels: pendingLabels,
    datasets: [{
      label: 'Pending Days',
      data: pendingLabels.map(k => pending.byProject[k].days),
      backgroundColor: chartColors.slice(0, pendingLabels.length),
      borderColor: chartBorderColors.slice(0, pendingLabels.length),
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  // Closed by Team Pie Chart
  const teamLabels = Object.keys(closedTasks?.byTeam || {});
  const closedByTeamData = {
    labels: teamLabels,
    datasets: [{
      data: Object.values(closedTasks?.byTeam || {}),
      backgroundColor: chartColors.slice(0, teamLabels.length),
      borderColor: 'rgba(15, 17, 23, 0.8)',
      borderWidth: 3,
    }]
  };

  // Closed by Owner Bar Chart
  const ownerLabels = Object.keys(closedTasks?.byOwner || {});
  const closedByOwnerData = {
    labels: ownerLabels,
    datasets: [{
      label: 'Tasks Closed',
      data: Object.values(closedTasks?.byOwner || {}),
      backgroundColor: chartColors.slice(0, ownerLabels.length),
      borderColor: chartBorderColors.slice(0, ownerLabels.length),
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  return (
    <>
      <Navbar title="Reports" />
      <div className="main-content">
        <div className="page-header">
          <h1>Reports & Analytics</h1>
        </div>

        {/* Summary Stats */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{lastWeek?.totalCompleted || 0}</div>
            <div className="stat-label">Completed Last Week</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pending?.totalPendingDays || 0}</div>
            <div className="stat-label">Total Pending Days</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pending?.totalPendingTasks || 0}</div>
            <div className="stat-label">Pending Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{closedTasks?.totalClosed || 0}</div>
            <div className="stat-label">Total Tasks Closed</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Last Week */}
          <div className="chart-card">
            <h3 className="chart-title">Work Completed Last Week</h3>
            <p className="chart-subtitle">Tasks completed per day in the past 7 days</p>
            <div className="chart-container">
              {Object.keys(lastWeek?.dailyCounts || {}).length > 0 ? (
                <Bar data={lastWeekData} options={defaultChartOptions} />
              ) : (
                <div className="chart-empty">No completed tasks in the last 7 days</div>
              )}
            </div>
          </div>

          {/* Closed by Team */}
          <div className="chart-card">
            <h3 className="chart-title">Tasks Closed by Team</h3>
            <p className="chart-subtitle">Distribution of completed tasks across teams</p>
            <div className="chart-container">
              {teamLabels.length > 0 ? (
                <Pie data={closedByTeamData} options={pieChartOptions} />
              ) : (
                <div className="chart-empty">No completed tasks yet</div>
              )}
            </div>
          </div>

          {/* Pending by Project */}
          <div className="chart-card">
            <h3 className="chart-title">Pending Work by Project</h3>
            <p className="chart-subtitle">Total days of work remaining per project</p>
            <div className="chart-container">
              {pendingLabels.length > 0 ? (
                <Bar data={pendingData} options={defaultChartOptions} />
              ) : (
                <div className="chart-empty">No pending tasks</div>
              )}
            </div>
          </div>

          {/* Closed by Owner */}
          <div className="chart-card">
            <h3 className="chart-title">Tasks Closed by Owner</h3>
            <p className="chart-subtitle">Most productive team members</p>
            <div className="chart-container">
              {ownerLabels.length > 0 ? (
                <Bar data={closedByOwnerData} options={defaultChartOptions} />
              ) : (
                <div className="chart-empty">No completed tasks yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
