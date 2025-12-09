import React, { useState, useEffect } from 'react';
import './EventsPage.scss';

// Иконки
import {
  Calendar, Users, MapPin, Clock, Tag, ChevronRight,
  CheckCircle, XCircle, Star, Filter, Plus, User,
  TrendingUp, Award, Zap, Heart, Share2, X,
  Menu, Bell, Search, Settings
} from 'lucide-react';

// Event interface
interface Event {
  id: number;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  status: string;
  category: string;
  description: string;
  payment: string;
  userParticipating: boolean;
  location: string;
  organizer: string;
  rating: number;
}

// Mock data for events
const mockEvents: Event[] = [
  {
    id: 1,
    name: 'Tech Summit 2024',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-03-15',
    endDate: '2024-03-16',
    participants: 42,
    maxParticipants: 100,
    status: 'Активное',
    category: 'Технологии',
    description: 'Крупнейшая технологическая конференция года с участием ведущих экспертов индустрии. Обсуждение будущего AI, блокчейна и облачных технологий.',
    payment: 'Free',
    userParticipating: false,
    location: 'Москва, Крокус Сити',
    organizer: 'Tech Leaders Corp',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Арт-фестиваль "Весна"',
    image: 'https://images.unsplash.com/photo-1492684223066-e9e4aab4d25e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-04-20',
    endDate: '2024-04-22',
    participants: 85,
    maxParticipants: 150,
    status: 'Активное',
    category: 'Искусство',
    description: 'Трехдневный фестиваль современного искусства с выставками, мастер-классами и выступлениями художников.',
    payment: 'Paid',
    userParticipating: true,
    location: 'Санкт-Петербург, Эрмитаж',
    organizer: 'Art Collective',
    rating: 4.9
  },
  {
    id: 3,
    name: 'Марафон Здоровья',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-02-10',
    endDate: '2024-02-10',
    participants: 120,
    maxParticipants: 200,
    status: 'Прошедшее',
    category: 'Спорт',
    description: 'Ежегодный благотворительный марафон в поддержку здорового образа жизни.',
    payment: 'Free',
    userParticipating: true,
    location: 'Парк Горького, Москва',
    organizer: 'Healthy Life',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Бизнес-форум Startup',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-05-05',
    endDate: '2024-05-07',
    participants: 65,
    maxParticipants: 120,
    status: 'Активное',
    category: 'Бизнес',
    description: 'Международный форум для стартапов и инвесторов. Питч-сессии, нетворкинг, мастер-классы.',
    payment: 'Paid',
    userParticipating: false,
    location: 'Сколково',
    organizer: 'Startup Nation',
    rating: 4.6
  },
  {
    id: 5,
    name: 'Концерт классической музыки',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-04-01',
    endDate: '2024-04-01',
    participants: 180,
    maxParticipants: 250,
    status: 'Активное',
    category: 'Музыка',
    description: 'Вечер классической музыки в исполнении симфонического оркестра.',
    payment: 'Paid',
    userParticipating: false,
    location: 'Консерватория им. Чайковского',
    organizer: 'Classic Music Group',
    rating: 4.9
  },
  {
    id: 6,
    name: 'Хакатон AI Challenge',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-03-25',
    endDate: '2024-03-27',
    participants: 95,
    maxParticipants: 150,
    status: 'Активное',
    category: 'Технологии',
    description: '48-часовой хакатон по искусственному интеллекту с призовым фондом 1 млн рублей.',
    payment: 'Free',
    userParticipating: true,
    location: 'Москва, Digital October',
    organizer: 'AI Community',
    rating: 4.8
  }
];

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (start === end) {
      return startDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } else {
      const startStr = startDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long'
      });
      const endStr = endDate.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      return `${startStr} - ${endStr}`;
    }
  };

  useEffect(() => {
    const now = new Date();
    setEvents(prev => prev.map(event => {
      const end = new Date(event.endDate);
      if (now > end && event.status === 'Активное') {
        return { ...event, status: 'Прошедшее' };
      }
      return event;
    }));
  }, []);

  const filteredEvents = events.filter(event => {
    if (event.status === 'Отклоненное') return false;
    
    // Фильтрация по поиску
    if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !event.category.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    switch (activeTab) {
      case 'active':
        return event.status === 'Активное';
      case 'my':
        return event.userParticipating && (event.status === 'Активное' || event.status === 'Прошедшее');
      case 'past':
        return event.status === 'Прошедшее';
      default:
        return true;
    }
  });

  const showAlert = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleParticipate = (eventId: number) => {
    setEvents(prev => prev.map(event => {
      if (event.id === eventId) {
        if (event.maxParticipants && event.participants >= event.maxParticipants) {
          showAlert('🚫 Достигнут максимальный лимит участников');
          return event;
        }
        showAlert('🎉 Вы успешно присоединились к событию!');
        return { ...event, userParticipating: true, participants: event.participants + 1 };
      }
      return event;
    }));
  };

  const handleCancelParticipation = (eventId: number) => {
    if (window.confirm('Вы уверены, что хотите отменить участие?')) {
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          showAlert('✅ Участие отменено');
          return { ...event, userParticipating: false, participants: event.participants - 1 };
        }
        return event;
      }));
    }
  };

  const handleShare = (event: Event) => {
    navigator.clipboard.writeText(`${event.name} - ${window.location.href}`);
    showAlert('🔗 Ссылка скопирована в буфер обмена');
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Активное': return '#10b981';
      case 'Прошедшее': return '#64748b';
      default: return '#ef4444';
    }
  };

  const getPaymentColor = (payment: string): string => {
    return payment === 'Free' ? '#10b981' : '#f59e0b';
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return '#ef4444';
    if (progress >= 70) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="events-page">
      {/* Notification */}
      {showNotification && (
        <div className="notification">
          <CheckCircle size={20} />
          <span>{notificationMessage}</span>
          <button onClick={() => setShowNotification(false)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu size={24} />
        </button>
        <div className="mobile-logo">
          <Zap size={24} />
          <span>EventFlow</span>
        </div>
        <div className="mobile-actions">
          <button className="mobile-action-btn">
            <Bell size={20} />
          </button>
          <button className="mobile-action-btn">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Panel */}
      <nav className={`nav-panel ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-header">
          <div className="logo">
            <Zap size={28} />
            <span>EventFlow</span>
          </div>
          
          <div className="user-info">
            <div className="user-avatar">
              <User size={24} />
            </div>
            <div className="user-details">
              <div className="user-name">Алексей Петров</div>
              <div className="user-role">Premium участник</div>
            </div>
            <button className="settings-btn">
              <Settings size={18} />
            </button>
          </div>

          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Поиск событий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="nav-items">
          <div className={`nav-item ${activeTab === 'active' ? 'active' : ''}`} onClick={() => { setActiveTab('active'); setMobileMenuOpen(false); }}>
            <div className="nav-icon">
              <Calendar size={20} />
            </div>
            <div className="nav-text">Активные</div>
            <div className="nav-badge">{events.filter(e => e.status === 'Активное').length}</div>
          </div>
          
          <div className={`nav-item ${activeTab === 'my' ? 'active' : ''}`} onClick={() => { setActiveTab('my'); setMobileMenuOpen(false); }}>
            <div className="nav-icon">
              <Heart size={20} />
            </div>
            <div className="nav-text">Мои события</div>
            <div className="nav-badge">{events.filter(e => e.userParticipating).length}</div>
          </div>
          
          <div className={`nav-item ${activeTab === 'past' ? 'active' : ''}`} onClick={() => { setActiveTab('past'); setMobileMenuOpen(false); }}>
            <div className="nav-icon">
              <Award size={20} />
            </div>
            <div className="nav-text">Прошедшие</div>
            <div className="nav-badge">{events.filter(e => e.status === 'Прошедшее').length}</div>
          </div>

          <div className="nav-section">
            <div className="section-title">Категории</div>
            <div className="category-tags">
              {['Технологии', 'Искусство', 'Спорт', 'Бизнес', 'Музыка'].map(category => (
                <div key={category} className="category-tag">
                  {category}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-footer">
          <div className="stats">
            <div className="stat-item">
              <div className="stat-value">{events.filter(e => e.userParticipating).length}</div>
              <div className="stat-label">Мои события</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{events.filter(e => e.status === 'Активное').length}</div>
              <div className="stat-label">Активных</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{events.reduce((sum, e) => sum + e.participants, 0)}</div>
              <div className="stat-label">Всего участников</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay для мобильного меню */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <div className="content">
        <div className="content-wrapper">
          <div className="content-header">
            <div className="header-left">
              <h1>События</h1>
              <p className="subtitle">Откройте для себя уникальные мероприятия вокруг вас</p>
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
                />
              </div>
              <button className="btn-primary">
                <Plus size={18} />
                <span>Создать событие</span>
              </button>
              <button className="btn-secondary">
                <Filter size={18} />
                <span>Фильтры</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button className={`tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
              <div className="tab-content">
                <Calendar size={20} />
                <span>Активные события</span>
              </div>
              <div className="tab-badge">{events.filter(e => e.status === 'Активное').length}</div>
            </button>
            
            <button className={`tab ${activeTab === 'my' ? 'active' : ''}`} onClick={() => setActiveTab('my')}>
              <div className="tab-content">
                <Heart size={20} />
                <span>Мои события</span>
              </div>
              <div className="tab-badge">{events.filter(e => e.userParticipating).length}</div>
            </button>
            
            <button className={`tab ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>
              <div className="tab-content">
                <TrendingUp size={20} />
                <span>Прошедшие события</span>
              </div>
              <div className="tab-badge">{events.filter(e => e.status === 'Прошедшее').length}</div>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                <Calendar size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{events.filter(e => e.status === 'Активное').length}</div>
                <div className="stat-card-label">Активных событий</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Users size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{events.reduce((sum, e) => sum + e.participants, 0)}</div>
                <div className="stat-card-label">Всего участников</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <Star size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">4.8</div>
                <div className="stat-card-label">Средний рейтинг</div>
              </div>
            </div>
          </div>

          {/* Event List */}
          <div className="event-list">
            {filteredEvents.length === 0 ? (
              <div className="empty-state">
                <Calendar size={64} />
                <h3>Событий не найдено</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
              </div>
            ) : (
              <div className="events-grid">
                {filteredEvents.map(event => {
                  const progress = (event.participants / event.maxParticipants) * 100;
                  const progressColor = getProgressColor(progress);
                  
                  return (
                    <div key={event.id} className="event-card" onClick={() => setSelectedEvent(event)}>
                      <div className="event-image">
                        <img src={event.image} alt={event.name} />
                        <div className="event-badges">
                          <div className="status-badge" style={{ backgroundColor: getStatusColor(event.status) }}>
                            {event.status}
                          </div>
                          <div className="payment-badge" style={{ backgroundColor: getPaymentColor(event.payment) }}>
                            {event.payment === 'Free' ? 'Бесплатно' : 'Платно'}
                          </div>
                          {event.userParticipating && (
                            <div className="participating-badge">
                              <CheckCircle size={14} />
                              <span>Вы участвуете</span>
                            </div>
                          )}
                        </div>
                        <div className="event-rating">
                          <Star size={14} fill="#fbbf24" />
                          <span>{event.rating}</span>
                        </div>
                      </div>
                      
                      <div className="event-content">
                        <div className="event-category">
                          <Tag size={14} />
                          {event.category}
                        </div>
                        <h3 className="event-title">{event.name}</h3>
                        
                        <div className="event-details">
                          <div className="detail-item">
                            <MapPin size={16} />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="detail-item">
                            <Calendar size={16} />
                            <span>{new Date(event.startDate).toLocaleDateString('ru-RU')}</span>
                          </div>
                          <div className="detail-item">
                            <Users size={16} />
                            <span>{event.participants}/{event.maxParticipants}</span>
                            <div className="progress-container">
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ 
                                    width: `${progress}%`,
                                    backgroundColor: progressColor
                                  }}
                                />
                              </div>
                              <span className="progress-text">{Math.round(progress)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        {event.status === 'Активное' && (
                          <button 
                            className={event.userParticipating ? 'btn-participating' : 'btn-join'}
                            onClick={(e) => {
                              e.stopPropagation();
                              event.userParticipating 
                                ? handleCancelParticipation(event.id)
                                : handleParticipate(event.id);
                            }}
                            disabled={!event.userParticipating && event.participants >= event.maxParticipants}
                          >
                            {event.userParticipating ? (
                              <>
                                <CheckCircle size={16} />
                                <span>Вы участвуете</span>
                              </>
                            ) : (
                              <>
                                <Plus size={16} />
                                <span>Присоединиться</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedEvent(null)}>
              <X size={20} />
            </button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedEvent.image} alt={selectedEvent.name} />
                <div className="modal-image-overlay">
                  <div className="modal-badges">
                    <div className="status-badge" style={{ backgroundColor: getStatusColor(selectedEvent.status) }}>
                      {selectedEvent.status}
                    </div>
                    <div className="payment-badge" style={{ backgroundColor: getPaymentColor(selectedEvent.payment) }}>
                      {selectedEvent.payment === 'Free' ? 'Бесплатно' : 'Платно'}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="modal-body">
                <div className="modal-header">
                  <h2>{selectedEvent.name}</h2>
                  <div className="modal-category">
                    <Tag size={16} />
                    {selectedEvent.category}
                  </div>
                </div>
                
                <div className="modal-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <MapPin size={20} />
                      <div>
                        <label>Место проведения</label>
                        <p>{selectedEvent.location}</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <Calendar size={20} />
                      <div>
                        <label>Дата</label>
                        <p>
                          {formatDate(selectedEvent.startDate, selectedEvent.endDate)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <Clock size={20} />
                      <div>
                        <label>Время</label>
                        <p>10:00 - 18:00</p>
                      </div>
                    </div>
                    
                    <div className="info-item">
                      <Users size={20} />
                      <div>
                        <label>Участники</label>
                        <div className="participants-info">
                          <span>{selectedEvent.participants} / {selectedEvent.maxParticipants}</span>
                          <span className="progress-percent">
                            {Math.round((selectedEvent.participants / selectedEvent.maxParticipants) * 100)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${(selectedEvent.participants / selectedEvent.maxParticipants) * 100}%`,
                              backgroundColor: getProgressColor((selectedEvent.participants / selectedEvent.maxParticipants) * 100)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-description">
                    <h3>Описание</h3>
                    <p>{selectedEvent.description}</p>
                  </div>
                  
                  <div className="modal-organizer">
                    <h3>Организатор</h3>
                    <div className="organizer-info">
                      <div className="organizer-avatar">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="organizer-name">{selectedEvent.organizer}</p>
                        <p className="organizer-rating">
                          <Star size={14} fill="#fbbf24" />
                          <span>{selectedEvent.rating} · 120 отзывов</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    {selectedEvent.userParticipating && (
                      <div className="participation-status">
                        <CheckCircle size={20} />
                        <span>Вы участвуете в этом событии</span>
                      </div>
                    )}
                    
                    <div className="action-buttons">
                      {selectedEvent.status === 'Активное' && (
                        <>
                          {!selectedEvent.userParticipating ? (
                            <button 
                              className="btn-primary"
                              onClick={() => handleParticipate(selectedEvent.id)}
                              disabled={selectedEvent.participants >= selectedEvent.maxParticipants}
                            >
                              {selectedEvent.participants >= selectedEvent.maxParticipants 
                                ? 'Мест нет' 
                                : 'Присоединиться'
                              }
                            </button>
                          ) : (
                            <button 
                              className="btn-secondary"
                              onClick={() => handleCancelParticipation(selectedEvent.id)}
                            >
                              Отменить участие
                            </button>
                          )}
                        </>
                      )}
                      
                      <button 
                        className="btn-outline"
                        onClick={() => handleShare(selectedEvent)}
                      >
                        <Share2 size={18} />
                        Поделиться
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;