import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { STATUS_OPTIONS } from '../utils/helpers';
import './FilterBar.css';

export default function FilterBar({ onFilterChange }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tags, setTags] = useState([]);

  const [filters, setFilters] = useState({
    team: searchParams.get('team') || '',
    project: searchParams.get('project') || '',
    status: searchParams.get('status') || '',
    tags: searchParams.get('tags') || '',
    sort: searchParams.get('sort') || ''
  });

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [teamsRes, projectsRes, tagsRes] = await Promise.all([
          API.get('/teams'),
          API.get('/projects'),
          API.get('/tags')
        ]);
        setTeams(teamsRes.data);
        setProjects(projectsRes.data);
        setTags(tagsRes.data);
      } catch (err) {
        console.error('Error fetching filter data:', err);
      }
    };
    fetchFilterData();
  }, []);

  useEffect(() => {
    // Update filters from URL on mount / URL change
    setFilters({
      team: searchParams.get('team') || '',
      project: searchParams.get('project') || '',
      status: searchParams.get('status') || '',
      tags: searchParams.get('tags') || '',
      sort: searchParams.get('sort') || ''
    });
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL search params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    setSearchParams(params);

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const emptyFilters = { team: '', project: '', status: '', tags: '', sort: '' };
    setFilters(emptyFilters);
    setSearchParams({});
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        <div className="filter-item">
          <select
            value={filters.team}
            onChange={(e) => updateFilter('team', e.target.value)}
            className="form-select filter-select"
          >
            <option value="">All Teams</option>
            {teams.map(t => (
              <option key={t._id} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <select
            value={filters.project}
            onChange={(e) => updateFilter('project', e.target.value)}
            className="form-select filter-select"
          >
            <option value="">All Projects</option>
            {projects.map(p => (
              <option key={p._id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="form-select filter-select"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <select
            value={filters.tags}
            onChange={(e) => updateFilter('tags', e.target.value)}
            className="form-select filter-select"
          >
            <option value="">All Tags</option>
            {tags.map(t => (
              <option key={t._id} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="form-select filter-select"
          >
            <option value="">Sort by</option>
            <option value="dueDate">Due Date</option>
            <option value="status">Status</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button className="btn btn-ghost btn-sm clear-filters" onClick={clearFilters}>
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  );
}
