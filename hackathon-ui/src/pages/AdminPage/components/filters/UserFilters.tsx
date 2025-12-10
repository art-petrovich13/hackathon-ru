// src/pages/AdminPage/components/filters/UserFilters.tsx
import React from 'react';
import { Filter, Search, RefreshCw } from 'lucide-react';
import type { UserFilters } from '../../types';

interface UserFiltersProps {
  filters: UserFilters;
  onChange: (filters: UserFilters) => void;
  onApply: () => void;
  onReset: () => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  filters,
  onChange,
  onApply,
  onReset
}) => {
  const handleChange = (key: keyof UserFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onApply();
    }
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <Filter size={18} />
        <span>Фильтры</span>
        <button 
          className="reset-filters" 
          onClick={onReset}
          title="Сбросить фильтры"
        >
          <RefreshCw size={14} />
        </button>
      </div>
      <div className="filter-grid">
        <input
          type="text"
          placeholder="ФИО пользователя"
          value={filters.name}
          onChange={(e) => handleChange('name', e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <select
          value={filters.role}
          onChange={(e) => handleChange('role', e.target.value)}
        >
          <option value="">Все роли</option>
          <option value="user">Пользователь</option>
          <option value="admin">Администратор</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <option value="">Все статусы</option>
          <option value="active">Активен</option>
          <option value="deleted">Удален</option>
        </select>
        <input
          type="date"
          value={filters.start_date}
          onChange={(e) => handleChange('start_date', e.target.value)}
          placeholder="Дата от"
        />
        <input
          type="date"
          value={filters.end_date}
          onChange={(e) => handleChange('end_date', e.target.value)}
          placeholder="Дата до"
        />
        <button className="apply-filters" onClick={onApply}>
          <Search size={16} />
          Применить
        </button>
      </div>
    </div>
  );
};

export default UserFilters;