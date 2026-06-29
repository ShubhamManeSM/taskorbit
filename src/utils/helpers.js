/**
 * Get the CSS class for a status badge
 */
export function getStatusBadgeClass(status) {
  const map = {
    'To Do': 'badge-todo',
    'In Progress': 'badge-progress',
    'Completed': 'badge-completed',
    'Blocked': 'badge-blocked'
  };
  return map[status] || 'badge-todo';
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Get initials from a name
 */
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a consistent color from a string (for avatar backgrounds)
 */
export function stringToColor(str) {
  if (!str) return '#6366f1';
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
    '#f97316', '#eab308', '#22c55e', '#14b8a6',
    '#06b6d4', '#3b82f6'
  ];
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Status options for dropdowns
 */
export const STATUS_OPTIONS = ['To Do', 'In Progress', 'Completed', 'Blocked'];
