import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventsPage.scss';
import { 
  Calendar, Users, MapPin, Filter, Plus, Search, 
  Bell, Settings, LogOut, Heart, TrendingUp, 
  Zap, Menu, X, Loader 
} from 'lucide-react';
import EventCard from '../../components/EventCard';
import EventModal from '../../components/EventModal';
import { 
  getEvents, 
  getEvent, 
  participateEvent, 
  cancelParticipation,
  getCurrentUser,
  logout
} from '../../utils/api/events';

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'my' | 'past'>('my');
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadEvents();
    }
  }, [activeTab, currentPage]);

  const checkAuthAndLoadData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const userResponse = await getCurrentUser();
      if (userResponse.success && userResponse.data) { // ✅ Добавлена проверка
        setCurrentUser(userResponse.data.user);
        localStorage.setItem('user', JSON.stringify(userResponse.data.user));
      } else {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const response = await getEvents(activeTab, currentPage);
      if (response.success && response.data) { // ✅ Уже есть проверка
        setEvents(response.data.events);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Ошибка загрузки событий:', error);
      showAlert('Ошибка при загрузке событий', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotificationMessage(`${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleParticipate = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await participateEvent(id);
      if (response.success) {
        showAlert('Вы успешно присоединились к событию!', 'success');
        loadEvents();
        if (selectedEvent?.id === id) {
          const eventResponse = await getEvent(id);
          if (eventResponse.success && eventResponse.data) { // ✅ Добавлена проверка
            setSelectedEvent(eventResponse.data.data);
          }
        }
      } else {
        showAlert(response.error || 'Ошибка при подтверждении участия', 'error');
      }
    } catch (error: any) {
      showAlert(error.error || 'Произошла ошибка при подтверждении участия', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelParticipation = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите отменить участие в этом событии?')) {
      setIsLoading(true);
      try {
        const response = await cancelParticipation(id);
        if (response.success) {
          showAlert('Участие отменено', 'success');
          loadEvents();
          if (selectedEvent?.id === id) {
            const eventResponse = await getEvent(id);
            if (eventResponse.success && eventResponse.data) { // ✅ Добавлена проверка
              setSelectedEvent(eventResponse.data.data);
            }
          }
        } else {
          showAlert(response.error || 'Ошибка при отмене участия', 'error');
        }
      } catch (error: any) {
        showAlert(error.error || 'Произошла ошибка при отмене участия', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleShare = (event: any) => {
    const shareText = `${event.title}\nДата: ${event.start_date}\nМесто: ${event.location}`;
    navigator.clipboard.writeText(shareText);
    showAlert('Ссылка скопирована в буфер обмена', 'info');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredEvents = events.filter(event => {
    if (searchQuery.trim() === '') return true;
    
    const query = searchQuery.toLowerCase();
    return (
      event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      (event.organizer_name && event.organizer_name.toLowerCase().includes(query))
    );
  });

  if (!currentUser) {
    return (
      <div className="loading-page">
        <Loader size={32} className="spin" />
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      {/* Уведомления */}
      {showNotification && (
        <div className="notification">
          <div className="notification-content">
            <span>{notificationMessage}</span>
            <button 
              onClick={() => setShowNotification(false)}
              className="notification-close"
              aria-label="Закрыть уведомление"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Основной контент */}
      <div className="content">
        <div className="content-wrapper">
          <div className="content-header">
            <div className="header-left">
              <h1>События</h1>
              <p className="subtitle">Добро пожаловать, {currentUser.name}</p>
            </div>
            <div className="header-actions">
              <div className="search-container">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Поиск событий..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Поиск событий"
                />
              </div>
              
              <button 
                className="btn-secondary" 
                onClick={handleLogout}
                title="Выйти"
              >
                <LogOut size={18} />
                <span>Выйти</span>
              </button>
            </div>
          </div>

          {/* Вкладки */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'my' ? 'active' : ''}`} 
              onClick={() => setActiveTab('my')}
              title="Мои события"
            >
              <div className="tab-content">
                <Heart size={20} />
                <span>Мои события</span>
              </div>
            </button>
            
            <button 
              className={`tab ${activeTab === 'active' ? 'active' : ''}`} 
              onClick={() => setActiveTab('active')}
              title="Активные события"
            >
              <div className="tab-content">
                <Calendar size={20} />
                <span>Активные события</span>
              </div>
            </button>
            
            <button 
              className={`tab ${activeTab === 'past' ? 'active' : ''}`} 
              onClick={() => setActiveTab('past')}
              title="Прошедшие события"
            >
              <div className="tab-content">
                <TrendingUp size={20} />
                <span>Прошедшие события</span>
              </div>
            </button>
          </div>

          {/* Список событий */}
          <div className="event-list">
            {isLoading ? (
              <div className="empty-state">
                <Loader size={48} className="spin" />
                <p>Загрузка событий...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="empty-state">
                <Calendar size={64} />
                <h3>Нет событий</h3>
                <p>В этой категории пока нет событий</p>
              </div>
            ) : (
              <>
                <div className="events-count">
                  Найдено событий: <span>{filteredEvents.length}</span>
                </div>
                <div className="events-grid">
                  {filteredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      onViewDetails={() => setSelectedEvent(event)}
                      onParticipate={handleParticipate}
                      onCancelParticipation={handleCancelParticipation}
                      onShare={handleShare}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
                
                {pagination && pagination.last_page > 1 && (
                  <div className="pagination">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Назад
                    </button>
                    <span>Страница {currentPage} из {pagination.last_page}</span>
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                      disabled={currentPage === pagination.last_page}
                    >
                      Вперед
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно события */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onParticipate={handleParticipate}
          onCancelParticipation={handleCancelParticipation}
          onShare={handleShare}
          isLoading={isLoading}
          isAdmin={currentUser.role === 'admin'}
        />
      )}
    </div>
  );
};

export default EventsPage;