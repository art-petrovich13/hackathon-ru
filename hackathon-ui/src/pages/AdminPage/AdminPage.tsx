import { useState } from 'react';
import { Users, Calendar, Filter, Plus, Edit2, Key, Trash2, X } from 'lucide-react';
import './AdminPage.scss';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin';
  registrationDate: string;
  status: 'active' | 'deleted';
}

interface Event {
  id: string;
  title: string;
  shortDescription?: string;
  fullDescription: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  paymentInfo?: string;
  maxParticipants?: number;
  participants: string[];
  status: 'upcoming' | 'ongoing' | 'past';
}

type ModalType = 'editUser' | 'resetPassword' | 'createEvent' | 'editEvent' | null;

function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'events'>('users');
  const [modalOpen, setModalOpen] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [userFilters, setUserFilters] = useState({
    fullName: '',
    role: '',
    status: '',
    dateFrom: '',
    dateTo: '',
  });

  const [eventFilter, setEventFilter] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const users: User[] = [];
  const events: Event[] = [];
  const allUsers: User[] = [];

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalOpen('editUser');
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setModalOpen('resetPassword');
  };

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId);
  };

  const handleSaveUser = () => {
    console.log('Save user:', selectedUser);
    setModalOpen(null);
  };

  const handleConfirmResetPassword = () => {
    console.log('Reset password for:', selectedUser, 'New password:', newPassword);
    setModalOpen(null);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setModalOpen('createEvent');
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen('editEvent');
  };

  const handleSaveEvent = () => {
    console.log('Save event:', selectedEvent);
    setModalOpen(null);
  };

  const closeModal = () => {
    setModalOpen(null);
    setSelectedUser(null);
    setSelectedEvent(null);
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Панель администратора</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Управление пользователями
        </button>
        <button
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={20} />
          Управление событиями
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="users-section">
          <div className="filter-panel">
            <div className="filter-header">
              <Filter size={18} />
              <span>Фильтры</span>
            </div>
            <div className="filter-grid">
              <input
                type="text"
                placeholder="ФИО пользователя"
                value={userFilters.fullName}
                onChange={(e) => setUserFilters({ ...userFilters, fullName: e.target.value })}
              />
              <select
                value={userFilters.role}
                onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
              >
                <option value="">Все роли</option>
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
              <select
                value={userFilters.status}
                onChange={(e) => setUserFilters({ ...userFilters, status: e.target.value })}
              >
                <option value="">Все статусы</option>
                <option value="active">Активен</option>
                <option value="deleted">Удален</option>
              </select>
              <input
                type="date"
                placeholder="Дата от"
                value={userFilters.dateFrom}
                onChange={(e) => setUserFilters({ ...userFilters, dateFrom: e.target.value })}
              />
              <input
                type="date"
                placeholder="Дата до"
                value={userFilters.dateTo}
                onChange={(e) => setUserFilters({ ...userFilters, dateTo: e.target.value })}
              />
            </div>
          </div>

          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ФИО пользователя</th>
                  <th>Адрес почты</th>
                  <th>Роль</th>
                  <th>Дата регистрации</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
                      </span>
                    </td>
                    <td>{new Date(user.registrationDate).toLocaleDateString('ru-RU')}</td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status === 'active' ? 'Активен' : 'Удален'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={() => handleEditUser(user)}
                          title="Редактировать"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="action-btn reset"
                          onClick={() => handleResetPassword(user)}
                          title="Сбросить пароль"
                        >
                          <Key size={16} />
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDeleteUser(user.id)}
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
            {users.length === 0 && (
              <div className="empty-state">Пользователи не найдены</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="events-section">
          <div className="events-header">
            <div className="filter-row">
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="event-filter"
              >
                <option value="">Все события</option>
                <option value="upcoming">Предстоящие</option>
                <option value="ongoing">Текущие</option>
                <option value="past">Прошедшие</option>
              </select>
            </div>
            <button className="create-event-btn" onClick={handleCreateEvent}>
              <Plus size={20} />
              Создать новое событие
            </button>
          </div>

          <div className="table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Дата начала</th>
                  <th>Дата окончания</th>
                  <th>Участников</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.title}</td>
                    <td>{new Date(event.startDate).toLocaleDateString('ru-RU')}</td>
                    <td>{new Date(event.endDate).toLocaleDateString('ru-RU')}</td>
                    <td>
                      {event.participants.length}
                      {event.maxParticipants && ` / ${event.maxParticipants}`}
                    </td>
                    <td>
                      <span className={`status-badge ${event.status}`}>
                        {event.status === 'upcoming' && 'Предстоящее'}
                        {event.status === 'ongoing' && 'Текущее'}
                        {event.status === 'past' && 'Прошедшее'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditEvent(event)}
                        title="Редактировать"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {events.length === 0 && (
              <div className="empty-state">События не найдены</div>
            )}
          </div>
        </div>
      )}

      {modalOpen === 'editUser' && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Редактирование пользователя</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>ФИО</label>
                <input
                  type="text"
                  value={selectedUser.fullName}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Адрес почты</label>
                <input type="email" value={selectedUser.email} disabled />
              </div>
              <div className="form-group">
                <label>Роль</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, role: e.target.value as 'user' | 'admin' })
                  }
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Отмена
              </button>
              <button className="btn-primary" onClick={handleSaveUser}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen === 'resetPassword' && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Сброс пароля</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>Сброс пароля для пользователя: <strong>{selectedUser.fullName}</strong></p>
              <div className="form-group">
                <label>Новый пароль</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Введите новый пароль"
                />
              </div>
              <p className="info-text">
                Пароль будет автоматически отправлен на почту пользователя
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Отмена
              </button>
              <button className="btn-primary" onClick={handleConfirmResetPassword}>
                Подтвердить
              </button>
            </div>
          </div>
        </div>
      )}

      {(modalOpen === 'createEvent' || modalOpen === 'editEvent') && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalOpen === 'createEvent' ? 'Создание события' : 'Редактирование события'}</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Название *</label>
                  <input type="text" placeholder="Название события" />
                </div>
                <div className="form-group">
                  <label>Краткое описание</label>
                  <input type="text" placeholder="Для всплывающей подсказки" />
                </div>
                <div className="form-group full-width">
                  <label>Полное описание *</label>
                  <textarea rows={4} placeholder="Полное описание для карточки события" />
                </div>
                <div className="form-group">
                  <label>Дата начала *</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Дата окончания *</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>Изображение *</label>
                  <input type="file" accept="image/*" />
                </div>
                <div className="form-group">
                  <label>Максимальное количество участников</label>
                  <input type="number" min="0" placeholder="Не ограничено" />
                </div>
                <div className="form-group full-width">
                  <label>Данные по оплате</label>
                  <textarea
                    rows={3}
                    placeholder="Например: Сегодня у Синельникова Станислава день рождения, собираем ему на подарок..."
                  />
                </div>
                <div className="form-group full-width">
                  <label>Участники</label>
                  <div className="participants-list">
                    {allUsers.map((user) => (
                      <label key={user.id} className="checkbox-label">
                        <input type="checkbox" />
                        <span>{user.fullName} ({user.email})</span>
                      </label>
                    ))}
                  </div>
                  {allUsers.length === 0 && (
                    <p className="info-text">Нет зарегистрированных пользователей</p>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Отмена
              </button>
              <button className="btn-primary" onClick={handleSaveEvent}>
                {modalOpen === 'createEvent' ? 'Создать' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
