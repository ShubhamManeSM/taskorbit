import { useAuth } from '../context/AuthContext';
import { getInitials, stringToColor } from '../utils/helpers';
import './Navbar.css';

export default function Navbar({ title }) {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">{title || 'Dashboard'}</h2>
      </div>
      <div className="navbar-right">
        {user && (
          <div className="navbar-user">
            <span className="navbar-greeting">Hello, {user.name?.split(' ')[0]}</span>
            <div
              className="navbar-avatar"
              style={{ background: stringToColor(user.name) }}
            >
              {getInitials(user.name)}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
