// src/pages/AdminPage/components/UsersSection.tsx
import React from 'react';
import { Edit2, Key, Trash2, AlertCircle } from 'lucide-react';
import type { AdminUser } from '../../../utils/api/admin';
import type UserFilters from './filters/UserFilters';
import type { UserFilters as UserFiltersType } from '../types';

interface UsersSectionProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  users: AdminUser[];
  isLoading: boolean;
  pagination: {
    current_page: number;
    last_page: number;
    total: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
  onEditUser: (user: AdminUser) => void;
  onResetPassword: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({
  filters,
  onFiltersChange,
  onApplyFilters,
  onResetFilters,
  users,
  isLoading,
  pagination,
  currentPage,
  onPageChange,
  onEditUser,
  onResetPassword,
  onDeleteUser
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="users-section">
      <UserFilters
        filters={filters}
        onChange={onFiltersChange}
        onApply={onApplyFilters}
        onReset={onResetFilters}
      />

      <div className="table-container">
        {isLoading ? (
          <div className="loading-state">Загрузка...</div>
        ) : (
          <>
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ФИО</th>
                  <th>Email</th>
                  <th>Роль</th>
                  <th>Дата регистрации</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: AdminUser) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Админ' : 'Пользователь'}
                      </span>
                    </td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === 'active' ? 'Активен' : 'Удален'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={() => onEditUser(user)}
                          title="Редактировать"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn reset"
                          onClick={() => onResetPassword(user)}
                          title="Сбросить пароль"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => onDeleteUser(user)}
                          title="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && !isLoading && (
              <div className="empty-state">
                <AlertCircle size={48} />
                <p>Пользователи не найдены</p>
              </div>
            )}
          </>
        )}

        {pagination.last_page > 1 && (
          <div className="pagination">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Назад
            </button>
            <span>
              Страница {currentPage} из {pagination.last_page}
            </span>
            <button
              onClick={() => onPageChange(Math.min(pagination.last_page, currentPage + 1))}
              disabled={currentPage === pagination.last_page}
            >
              Вперед
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersSection;