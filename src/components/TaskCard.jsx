import { useNavigate } from 'react-router-dom';
import { getStatusBadgeClass, getInitials, stringToColor } from '../utils/helpers';
import './TaskCard.css';

export default function TaskCard({ task }) {
  const navigate = useNavigate();

  // Compute a mock due date based on timeToComplete (for visual matching with PDF)
  const computeDueDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + (days || 1));
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="pdf-task-card" onClick={() => navigate(`/tasks/${task._id}`)}>
      <div className="pdf-task-header">
        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
          {task.status}
        </span>
      </div>
      
      <h4 className="pdf-task-title">{task.name}</h4>
      
      <p className="pdf-task-due">
        Due on: {computeDueDate(task.timeToComplete)}
      </p>

      <div className="pdf-task-footer">
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
      </div>
    </div>
  );
}
