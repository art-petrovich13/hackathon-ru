// src/pages/AdminPage/index.tsx
import { useState, useEffect, useCallback } from 'react';
import { Users, Calendar } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import UsersSection from './components/UsersSection';
import EventsSection from './components/EventsSection';
import EditUserModal from './components/modals/EditUserModal';
import ResetPasswordModal from './components/modals/ResetPasswordModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import EventModal from './components/modals/EventModal';
import { useUsers } from './hooks/useUsers';
import { useEvents } from './hooks/useEvents';
import { getUsers as getAllUsers } from '../../utils/api/admin';
import type { AdminUser, AdminEvent } from '../../utils/api/admin';
import type {
  ModalType,
  TabType,
  UserFilters,
  EventFilters,
  UserFormData,
  EventFormState
} from './types';
import './AdminPage.scss';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [modalOpen, setModalOpen] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);

  // Состояния для пользователей
  const [userFilters, setUserFilters] = useState<UserFilters>({
    name: '',
    role: '',
    status: '',
    start_date: '',
    end_date: '',
  });
  const [usersPage, setUsersPage] = useState(1);
  const [eventFilters, setEventFilters] = useState<EventFilters>({
    status: '',
    title: '',
    start_date: '',
    end_date: '',
  });
  const [eventsPage, setEventsPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  // Формы
  const [newPassword, setNewPassword] = useState('');
  const [userForm, setUserForm] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });
  const [eventForm, setEventForm] = useState<EventFormState>({
    title: '',
    short_description: '',
    description: '',
    start_date: '',
    end_date: '',
    location: '',
    price: '0',
    payment_type: 'free',
    max_participants: '',
    image: null,
    participant_ids: [],
  });

  // Загрузка всех пользователей для выбора участников
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const loadAllUsers = useCallback(async () => {
    try {
      const data = await getAllUsers({ per_page: 1000 });
      setAllUsers(data.users);
    } catch (error) {
      console.error('Ошибка загрузки пользователей для выбора:', error);
    }
  }, []);

  // Хуки для данных
  const {
    users,
    isLoading: usersLoading,
    pagination: usersPagination,
    loadUsers,
    handleUpdateUser,
    handleResetPassword,
    handleDeleteUser
  } = useUsers();

  const {
    events,
    isLoading: eventsLoading,
    pagination: eventsPagination,
    loadEvents,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handleExportParticipants,
    getEvent
  } = useEvents();

  // Эффекты загрузки данных
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers(userFilters, usersPage);
    } else {
      loadEvents(eventFilters, eventsPage);
    }
  }, [activeTab, userFilters, usersPage, eventFilters, eventsPage, refreshKey]);

  useEffect(() => {
    if (modalOpen === 'createEvent' || modalOpen === 'editEvent') {
      loadAllUsers();
    }
  }, [modalOpen, loadAllUsers]);

  // Обработчики пользователей
  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setModalOpen('editUser');
  };

  const handleResetPasswordClick = (user: AdminUser) => {
    setSelectedUser(user);
    setNewPassword('');
    setModalOpen('resetPassword');
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    const success = await handleUpdateUser(selectedUser.id, userForm);
    if (success) {
      setRefreshKey(prev => prev + 1);
      setModalOpen(null);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (!selectedUser || !newPassword) return;
    
    const success = await handleResetPassword(selectedUser.id, newPassword);
    if (success) {
      setModalOpen(null);
    }
  };

  const handleDeleteUserClick = (user: AdminUser) => {
    setSelectedUser(user);
    setModalOpen('deleteConfirm');
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    const success = await handleDeleteUser(selectedUser.id);
    if (success) {
      setRefreshKey(prev => prev + 1);
      setModalOpen(null);
    }
  };

  // Обработчики событий
  const handleCreateEventClick = () => {
    setSelectedEvent(null);
    setEventForm({
      title: '',
      short_description: '',
      description: '',
      start_date: '',
      end_date: '',
      location: '',
      price: '0',
      payment_type: 'free',
      max_participants: '',
      image: null,
      participant_ids: [],
    });
    setModalOpen('createEvent');
  };

  const handleEditEvent = async (event: AdminEvent) => {
    try {
      const eventData = await getEvent(event.id);
      if (!eventData) return;

      setSelectedEvent(eventData);
      setEventForm({
        title: eventData.title,
        short_description: eventData.short_description || '',
        description: eventData.description,
        start_date: eventData.start_date.split(' ')[0],
        end_date: eventData.end_date.split(' ')[0],
        location: eventData.location,
        price: eventData.price.toString(),
        payment_type: eventData.payment_type,
        max_participants: eventData.max_participants?.toString() || '',
        image: null,
        participant_ids: eventData.participants?.map((p: any) => p.user_id) || [],
      });
      setModalOpen('editEvent');
    } catch (error) {
      console.error('Ошибка загрузки события:', error);
    }
  };

  const handleSaveEvent = async () => {
    const formData = new FormData();
    
    // Добавляем основные поля
    const { image, participant_ids, ...otherFields } = eventForm;
    
    Object.entries(otherFields).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value.toString());
      }
    });
    
    // Добавляем изображение
    if (image) {
      formData.append('image', image);
    }
    
    // Добавляем участников
    if (participant_ids.length > 0) {
      participant_ids.forEach(id => {
        formData.append('participant_ids[]', id.toString());
      });
    }
    
    let success = false;
    if (modalOpen === 'createEvent') {
      success = await handleCreateEvent(formData);
    } else if (modalOpen === 'editEvent' && selectedEvent) {
      success = await handleUpdateEvent(selectedEvent.id, formData);
    }
    
    if (success) {
      setRefreshKey(prev => prev + 1);
      setModalOpen(null);
    }
  };

  const handleDeleteEvent = async (event: AdminEvent) => {
    const success = await handleDeleteEvent(event.id);
    if (success) {
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleExportParticipantsClick = async (eventId: number) => {
    await handleExportParticipants(eventId);
  };

  // Вспомогательные функции
  const getEventStatus = useCallback((event: AdminEvent): 'upcoming' | 'ongoing' | 'past' => {
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    
    if (event.status === 'past' || endDate < now) return 'past';
    if (startDate <= now && endDate >= now) return 'ongoing';
    return 'upcoming';
  }, []);

  const closeModal = () => {
    setModalOpen(null);
    setSelectedUser(null);
    setSelectedEvent(null);
    setNewPassword('');
  };

  const applyUserFilters = () => {
    setUsersPage(1);
    setRefreshKey(prev => prev + 1);
  };

  const resetUserFilters = () => {
    setUserFilters({
      name: '',
      role: '',
      status: '',
      start_date: '',
      end_date: '',
    });
    setUsersPage(1);
    setTimeout(() => setRefreshKey(prev => prev + 1), 100);
  };

  const applyEventFilters = () => {
    setEventsPage(1);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="admin-page">
      <Toaster position="top-right" />
      
      <div className="admin-header">
        <h1>Панель администратора</h1>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          Управление пользователями ({usersPagination.total})
        </button>
        <button
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={20} />
          Управление событиями ({eventsPagination.total})
        </button>
      </div>

      {activeTab === 'users' && (
        <UsersSection
          filters={userFilters}
          onFiltersChange={setUserFilters}
          onApplyFilters={applyUserFilters}
          onResetFilters={resetUserFilters}
          users={users}
          isLoading={usersLoading}
          pagination={usersPagination}
          currentPage={usersPage}
          onPageChange={setUsersPage}
          onEditUser={handleEditUser}
          onResetPassword={handleResetPasswordClick}
          onDeleteUser={handleDeleteUserClick}
        />
      )}

      {activeTab === 'events' && (
        <EventsSection
          filters={eventFilters}
          onFiltersChange={setEventFilters}
          onApplyFilters={applyEventFilters}
          events={events}
          isLoading={eventsLoading}
          pagination={eventsPagination}
          currentPage={eventsPage}
          onPageChange={setEventsPage}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onExportParticipants={handleExportParticipantsClick}
          onCreateEvent={handleCreateEventClick}
          getEventStatus={getEventStatus}
        />
      )}

      {/* Модальные окна */}
      {modalOpen === 'editUser' && selectedUser && (
        <EditUserModal
          user={selectedUser}
          formData={userForm}
          onFormChange={setUserForm}
          onClose={closeModal}
          onSave={handleSaveUser}
          isLoading={false}
        />
      )}

      {modalOpen === 'resetPassword' && selectedUser && (
        <ResetPasswordModal
          user={selectedUser}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          onClose={closeModal}
          onConfirm={handleConfirmResetPassword}
          isLoading={false}
        />
      )}

      {modalOpen === 'deleteConfirm' && selectedUser && (
        <DeleteConfirmModal
          user={selectedUser}
          onClose={closeModal}
          onConfirm={handleConfirmDelete}
          isLoading={false}
        />
      )}

      {(modalOpen === 'createEvent' || modalOpen === 'editEvent') && (
        <EventModal
          mode={modalOpen === 'createEvent' ? 'create' : 'edit'}
          event={selectedEvent}
          formState={eventForm}
          setFormState={setEventForm}
          allUsers={allUsers}
          onClose={closeModal}
          onSave={handleSaveEvent}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default AdminPage;