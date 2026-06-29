import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInitials, stringToColor } from '../utils/helpers';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '◈' },
    { path: '/tasks', label: 'Tasks', icon: '☰' },
    { path: '/projects', label: 'Projects', icon: '◉' },
    { path: '/teams', label: 'Teams', icon: '⚑' },
    { path: '/reports', label: 'Reports', icon: '◫' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">◆</span>
          <span className="logo-text">TaskOrbit</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive && location.pathname === item.path ? 'active' : ''}`
                }
                end={item.path === '/'}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="user-section">
            <div
              className="user-avatar"
              style={{ background: stringToColor(user.name) }}
            >
              {getInitials(user.name)}
            </div>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button className="logout-btn" onClick={logout} title="Logout">
              ⏻
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
