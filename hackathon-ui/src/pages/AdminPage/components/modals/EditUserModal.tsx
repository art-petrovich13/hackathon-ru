// src/pages/AdminPage/components/modals/EditUserModal.tsx
import React from 'react';
import { X } from 'lucide-react';
import type { AdminUser } from '../../../../utils/api/admin';
import type { UserFormData } from '../../types';

interface EditUserModalProps {
  user: AdminUser;
  formData: UserFormData;
  onFormChange: (data: UserFormData) => void;
  onClose: () => void;
  onSave: () => Promise<void>;
  isLoading: boolean;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  formData,
  onFormChange,
  onClose,
  onSave,
  isLoading
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Редактирование пользователя</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>ФИО *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user.email} disabled />
            </div>
            <div className="form-group">
              <label>Роль</label>
              <select
                value={formData.role}
                onChange={(e) => onFormChange({ 
                  ...formData, 
                  role: e.target.value as 'user' | 'admin' 
                })}
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
            <div className="form-group">
              <label>Статус</label>
              <select
                value={formData.status}
                onChange={(e) => onFormChange({ 
                  ...formData, 
                  status: e.target.value as 'active' | 'deleted' 
                })}
              >
                <option value="active">Активен</option>
                <option value="deleted">Удален</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={isLoading}
            >
              Отмена
            </button>
            <button 
              type="submit"
              className="btn-primary" 
              disabled={isLoading || !formData.name.trim()}
            >
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;