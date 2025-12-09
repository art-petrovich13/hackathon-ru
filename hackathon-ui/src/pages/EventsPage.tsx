import React, { useState, useEffect } from 'react';
import './EventsPage.scss';

// Иконки
import {
  Calendar, Users, MapPin, Clock, Tag,
  CheckCircle, XCircle, Star, Filter, Plus, User,
  TrendingUp, Award, Zap, Heart, Share2, X,
  Menu, Bell, Search, Settings, Home, Package,
  MessageSquare, Shield, LogOut, ArrowRight,
  AlertCircle, Loader, ChevronRight
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
  status: 'Активное' | 'Прошедшее' | 'Отклоненное';
  category: string;
  description: string;
  payment: 'Free' | 'Paid';
  userParticipating: boolean;
  location: string;
  organizer: string;
  rating: number;
  price?: string;
}

// Navigation items interface
interface NavItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  badge?: number;
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
    image: 'https://www.rewizor.ru/files/118344jxjj.jpg',
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
    rating: 4.9,
    price: '1500 руб'
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
    rating: 4.6,
    price: '3000 руб'
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
    rating: 4.9,
    price: '2000 руб'
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
  },
  {
    id: 7,
    name: 'Отклоненное событие',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    participants: 0,
    maxParticipants: 50,
    status: 'Отклоненное',
    category: 'Тестирование',
    description: 'Это событие отклонено и не должно отображаться на вкладках',
    payment: 'Free',
    userParticipating: false,
    location: 'Тестовое место',
    organizer: 'Тестовая организация',
    rating: 0
  }
];

// Navigation items
const navigationItems: NavItem[] = [
  { id: 'events', name: 'События', icon: <Calendar size={20} /> },
  { id: 'messages', name: 'Сообщения', icon: <MessageSquare size={20} />, badge: 3 },
  { id: 'organizations', name: 'Организации', icon: <Package size={20} /> },
  { id: 'administration', name: 'Администрирование', icon: <Shield size={20} /> },
];

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('my'); // По умолчанию "Мои события"
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('events');

  // Форматирование даты
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

  // Автоматическое обновление статусов событий
  useEffect(() => {
    const updateEventStatuses = () => {
      const now = new Date();
      setEvents(prev => prev.map(event => {
        const end = new Date(event.endDate);
        const start = new Date(event.startDate);
        
        // Если событие отклонено, не меняем его статус
        if (event.status === 'Отклоненное') return event;
        
        if (now > end && event.status !== 'Прошедшее') {
          return { ...event, status: 'Прошедшее' };
        } else if (now >= start && now <= end && event.status !== 'Активное') {
          return { ...event, status: 'Активное' };
        }
        return event;
      }));
    };

    updateEventStatuses();
    const interval = setInterval(updateEventStatuses, 60000); // Обновлять каждую минуту
    
    return () => clearInterval(interval);
  }, []);

  // Фильтрация событий
  const filteredEvents = events.filter(event => {
    // Скрываем отклоненные события со всех вкладок (кроме админки)
    if (event.status === 'Отклоненное' && activeNavItem !== 'administration') {
      return false;
    }
    
    // Поиск по всем полям
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const searchableFields = [
        event.name.toLowerCase(),
        event.description.toLowerCase(),
        event.category.toLowerCase(),
        event.location.toLowerCase(),
        event.organizer.toLowerCase()
      ];
      
      if (!searchableFields.some(field => field.includes(query))) {
        return false;
      }
    }
    
    // Фильтрация по вкладкам
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

  // Показать уведомление
  const showAlert = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotificationMessage(`${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'} ${message}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Подтверждение участия
  const handleParticipate = async (eventId: number) => {
    setIsLoading(true);
    try {
      // Имитация API запроса
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          // Проверка лимита участников
          if (event.maxParticipants && event.participants >= event.maxParticipants) {
            showAlert('Достигнут максимальный лимит участников', 'error');
            return event;
          }
          
          // Проверка статуса события
          if (event.status !== 'Активное') {
            showAlert('Нельзя присоединиться к неактивному событию', 'error');
            return event;
          }
          
          showAlert('Вы успешно присоединились к событию! Уведомление отправлено организатору.', 'success');
          return { 
            ...event, 
            userParticipating: true, 
            participants: event.participants + 1 
          };
        }
        return event;
      }));
      
      // Закрываем модальное окно, если оно открыто
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(prev => prev ? {...prev, userParticipating: true, participants: prev.participants + 1} : null);
      }
    } catch (error) {
      showAlert('Произошла ошибка при подтверждении участия', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Отмена участия
  const handleCancelParticipation = async (eventId: number) => {
    if (window.confirm('Вы уверены, что хотите отменить участие в этом событии?')) {
      setIsLoading(true);
      try {
        // Имитация API запроса
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setEvents(prev => prev.map(event => {
          if (event.id === eventId) {
            showAlert('Участие отменено. Уведомление отправлено организатору.', 'success');
            return { 
              ...event, 
              userParticipating: false, 
              participants: Math.max(0, event.participants - 1)
            };
          }
          return event;
        }));
        
        // Обновляем модальное окно, если оно открыто
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(prev => prev ? {...prev, userParticipating: false, participants: Math.max(0, prev.participants - 1)} : null);
        }
      } catch (error) {
        showAlert('Произошла ошибка при отмене участия', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Поделиться событием
  const handleShare = (event: Event) => {
    const shareText = `${event.name}\nДата: ${formatDate(event.startDate, event.endDate)}\nМесто: ${event.location}`;
    navigator.clipboard.writeText(shareText);
    showAlert('Ссылка скопирована в буфер обмена', 'info');
  };

  // Получить цвет статуса
  const getStatusColor = (status: Event['status']): string => {
    switch (status) {
      case 'Активное': return '#10b981';
      case 'Прошедшее': return '#64748b';
      case 'Отклоненное': return '#ef4444';
      default: return '#64748b';
    }
  };

  // Получить цвет оплаты
  const getPaymentColor = (payment: Event['payment']): string => {
    return payment === 'Free' ? '#10b981' : '#f59e0b';
  };

  // Получить цвет прогресса
  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return '#ef4444';
    if (progress >= 70) return '#f59e0b';
    return '#10b981';
  };

  // Сообщение при пустом списке
  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'active':
        return { 
          title: 'Нет активных событий', 
          description: 'Попробуйте изменить параметры поиска или создайте своё событие' 
        };
      case 'my':
        return { 
          title: 'Вы не участвуете в событиях', 
          description: 'Присоединяйтесь к интересным событиям или создайте своё' 
        };
      case 'past':
        return { 
          title: 'Нет прошедших событий', 
          description: 'Здесь появятся события, в которых вы участвовали ранее' 
        };
      default:
        return { 
          title: 'Событий не найдено', 
          description: 'Попробуйте изменить параметры фильтрации' 
        };
    }
  };

  // Контент всплывающей подсказки для события
  const getEventTooltip = (event: Event): string => {
    return `
Название: ${event.name}
Дата: ${formatDate(event.startDate, event.endDate)}
Место: ${event.location}
Статус: ${event.status}
Оплата: ${event.payment === 'Free' ? 'Бесплатно' : `Платно (${event.price || 'цена не указана'})`}
Участники: ${event.participants}/${event.maxParticipants}
Категория: ${event.category}
Рейтинг: ${event.rating}/5.0
Описание: ${event.description.substring(0, 100)}...
    `.trim();
  };

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

      {/* Загрузка */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <Loader size={32} className="spin" />
            <span>Загрузка...</span>
          </div>
        </div>
      )}

      {/* Мобильный заголовок */}
      <div className="mobile-header">
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Открыть меню"
        >
          <Menu size={24} />
        </button>
        <div className="mobile-logo">
          <Zap size={24} />
          <span>EventFlow</span>
        </div>
        <div className="mobile-actions">
          <button className="mobile-action-btn" aria-label="Уведомления">
            <Bell size={20} />
          </button>
          <button className="mobile-action-btn" aria-label="Поиск">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Панель навигации */}
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
              <div className="user-role">Участник</div>
            </div>
            <button className="settings-btn" aria-label="Настройки">
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
              aria-label="Поиск событий"
            />
          </div>
        </div>

        <div className="nav-items">
          {/* Основная навигация */}
          <div className="nav-section">
            <div className="section-title">Навигация</div>
            {navigationItems.map((item) => (
              <div 
                key={item.id}
                className={`nav-item ${activeNavItem === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveNavItem(item.id);
                  setMobileMenuOpen(false);
                }}
                title={item.name}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && setActiveNavItem(item.id)}
              >
                <div className="nav-icon">
                  {item.icon}
                </div>
                <div className="nav-text">{item.name}</div>
                {item.badge && (
                  <div className="nav-badge">{item.badge}</div>
                )}
              </div>
            ))}
          </div>

          {/* Фильтры событий */}
          <div className="nav-section">
            <div className="section-title">События</div>
            <div 
              className={`nav-item ${activeTab === 'my' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('my'); setMobileMenuOpen(false); }}
              title="Мои события"
              role="button"
              tabIndex={0}
            >
              <div className="nav-icon">
                <Heart size={20} />
              </div>
              <div className="nav-text">Мои события</div>
              <div className="nav-badge">
                {events.filter(e => e.userParticipating && e.status !== 'Отклоненное').length}
              </div>
            </div>
            
            <div 
              className={`nav-item ${activeTab === 'active' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('active'); setMobileMenuOpen(false); }}
              title="Активные события"
              role="button"
              tabIndex={0}
            >
              <div className="nav-icon">
                <Calendar size={20} />
              </div>
              <div className="nav-text">Активные</div>
              <div className="nav-badge">
                {events.filter(e => e.status === 'Активное').length}
              </div>
            </div>
            
            <div 
              className={`nav-item ${activeTab === 'past' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('past'); setMobileMenuOpen(false); }}
              title="Прошедшие события"
              role="button"
              tabIndex={0}
            >
              <div className="nav-icon">
                <Award size={20} />
              </div>
              <div className="nav-text">Прошедшие</div>
              <div className="nav-badge">
                {events.filter(e => e.status === 'Прошедшее').length}
              </div>
            </div>
          </div>

          {/* Категории */}
          <div className="nav-section">
            <div className="section-title">Категории</div>
            <div className="category-tags">
              {['Технологии', 'Искусство', 'Спорт', 'Бизнес', 'Музыка'].map(category => (
                <button 
                  key={category} 
                  className="category-tag"
                  onClick={() => setSearchQuery(category)}
                  title={`Поиск по категории: ${category}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="nav-footer">
          <div className="stats">
            <div className="stat-item" title="Количество ваших событий">
              <div className="stat-value">{events.filter(e => e.userParticipating && e.status !== 'Отклоненное').length}</div>
              <div className="stat-label">Мои события</div>
            </div>
            <div className="stat-item" title="Активных событий">
              <div className="stat-value">{events.filter(e => e.status === 'Активное').length}</div>
              <div className="stat-label">Активных</div>
            </div>
            <div className="stat-item" title="Всего участников">
              <div className="stat-value">{events.filter(e => e.status !== 'Отклоненное').reduce((sum, e) => sum + e.participants, 0)}</div>
              <div className="stat-label">Участников</div>
            </div>
          </div>
          <button className="logout-btn">
            <LogOut size={16} />
            <span>Выйти</span>
          </button>
        </div>
      </nav>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Основной контент */}
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
                  aria-label="Поиск событий"
                />
              </div>
              <button className="btn-primary" title="Создать новое событие">
                <Plus size={18} />
                <span>Создать событие</span>
              </button>
              <button className="btn-secondary" title="Применить фильтры">
                <Filter size={18} />
                <span>Фильтры</span>
              </button>
            </div>
          </div>

          {/* Вкладки */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'my' ? 'active' : ''}`} 
              onClick={() => setActiveTab('my')}
              title="События, в которых вы участвуете"
            >
              <div className="tab-content">
                <Heart size={20} />
                <span>Мои события</span>
              </div>
              <div className="tab-badge">
                {events.filter(e => e.userParticipating && e.status !== 'Отклоненное').length}
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
              <div className="tab-badge">
                {events.filter(e => e.status === 'Активное').length}
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
              <div className="tab-badge">
                {events.filter(e => e.status === 'Прошедшее').length}
              </div>
            </button>
          </div>

          {/* Статистика */}
          <div className="stats-cards">
            <div className="stat-card" title="Активные события">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                <Calendar size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">{events.filter(e => e.status === 'Активное').length}</div>
                <div className="stat-card-label">Активных событий</div>
              </div>
            </div>
            <div className="stat-card" title="Всего участников">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                <Users size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">
                  {events.filter(e => e.status !== 'Отклоненное').reduce((sum, e) => sum + e.participants, 0)}
                </div>
                <div className="stat-card-label">Всего участников</div>
              </div>
            </div>
            <div className="stat-card" title="Средний рейтинг событий">
              <div className="stat-card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                <Star size={24} />
              </div>
              <div className="stat-card-content">
                <div className="stat-card-value">
                  {Math.round(events.filter(e => e.status !== 'Отклоненное').reduce((sum, e) => sum + e.rating, 0) / 
                    events.filter(e => e.status !== 'Отклоненное').length * 10) / 10 || 0}
                </div>
                <div className="stat-card-label">Средний рейтинг</div>
              </div>
            </div>
          </div>

          {/* Список событий */}
          <div className="event-list">
            {filteredEvents.length === 0 ? (
              <div className="empty-state">
                <Calendar size={64} />
                <h3>{getEmptyStateMessage().title}</h3>
                <p>{getEmptyStateMessage().description}</p>
                {searchQuery && (
                  <button 
                    className="btn-clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    Очистить поиск
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="events-count">
                  Найдено событий: <span>{filteredEvents.length}</span>
                </div>
                <div className="events-grid">
                  {filteredEvents.map(event => {
                    const progress = event.maxParticipants ? (event.participants / event.maxParticipants) * 100 : 0;
                    const progressColor = getProgressColor(progress);
                    
                    return (
                      <div 
                        key={event.id} 
                        className="event-card"
                        onClick={() => setSelectedEvent(event)}
                        title={getEventTooltip(event)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => e.key === 'Enter' && setSelectedEvent(event)}
                      >
                        <div className="event-image">
                          <img src={event.image} alt={event.name} loading="lazy" />
                          <div className="event-badges">
                            <div 
                              className="status-badge" 
                              style={{ backgroundColor: getStatusColor(event.status) }}
                            >
                              {event.status}
                            </div>
                            <div 
                              className="payment-badge" 
                              style={{ backgroundColor: getPaymentColor(event.payment) }}
                            >
                              {event.payment === 'Free' ? 'Бесплатно' : `Платно ${event.price ? `(${event.price})` : ''}`}
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
                              <span className="truncate" title={event.location}>{event.location}</span>
                            </div>
                            <div className="detail-item">
                              <Calendar size={16} />
                              <span>{formatDate(event.startDate, event.endDate)}</span>
                            </div>
                            <div className="detail-item">
                              <Users size={16} />
                              <span title={`${event.participants} из ${event.maxParticipants} участников`}>
                                {event.participants}/{event.maxParticipants} участников
                              </span>
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
                          
                          <div className="event-actions">
                            {event.status === 'Активное' && (
                              <button 
                                className={event.userParticipating ? 'btn-participating' : 'btn-join'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (event.userParticipating) {
                                    handleCancelParticipation(event.id);
                                  } else {
                                    handleParticipate(event.id);
                                  }
                                }}
                                disabled={(!event.userParticipating && event.participants >= event.maxParticipants) || isLoading}
                                title={!event.userParticipating && event.participants >= event.maxParticipants ? 'Достигнут лимит участников' : ''}
                              >
                                {isLoading ? (
                                  <Loader size={14} className="spin" />
                                ) : event.userParticipating ? (
                                  <>
                                    <CheckCircle size={16} />
                                    <span>Вы участвуете</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus size={16} />
                                    <span>
                                      {event.participants >= event.maxParticipants 
                                        ? 'Мест нет' 
                                        : 'Присоединиться'
                                      }
                                    </span>
                                  </>
                                )}
                              </button>
                            )}
                            
                            {event.status === 'Прошедшее' && event.userParticipating && (
                              <button className="btn-participating" disabled>
                                <CheckCircle size={16} />
                                <span>Вы участвовали</span>
                              </button>
                            )}
                            
                            <button 
                              className="btn-share"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare(event);
                              }}
                              title="Поделиться событием"
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно события */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setSelectedEvent(null)}
              title="Закрыть"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
            
            <div className="modal-content">
              <div className="modal-image">
                <img src={selectedEvent.image} alt={selectedEvent.name} />
                <div className="modal-image-overlay">
                  <div className="modal-badges">
                    <div 
                      className="status-badge" 
                      style={{ backgroundColor: getStatusColor(selectedEvent.status) }}
                    >
                      {selectedEvent.status}
                    </div>
                    <div 
                      className="payment-badge" 
                      style={{ backgroundColor: getPaymentColor(selectedEvent.payment) }}
                    >
                      {selectedEvent.payment === 'Free' ? 'Бесплатно' : `Платно ${selectedEvent.price ? `(${selectedEvent.price})` : ''}`}
                    </div>
                    {selectedEvent.userParticipating && (
                      <div className="participating-badge">
                        <CheckCircle size={16} />
                        <span>Вы участвуете</span>
                      </div>
                    )}
                  </div>
                  <div className="modal-rating">
                    <Star size={18} fill="#fbbf24" />
                    <span>{selectedEvent.rating} / 5.0</span>
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
                        <label>Дата проведения</label>
                        <p>{formatDate(selectedEvent.startDate, selectedEvent.endDate)}</p>
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
                    <h3>Описание события</h3>
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
                    <div className="user-participation-status">
                      {selectedEvent.userParticipating ? (
                        <div className="participation-status">
                          <CheckCircle size={20} />
                          <span>Вы участвуете в этом событии</span>
                        </div>
                      ) : (
                        <div className="not-participating-status">
                          <AlertCircle size={20} />
                          <span>Вы не участвуете в этом событии</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="action-buttons">
                      {selectedEvent.status === 'Активное' && (
                        <>
                          {!selectedEvent.userParticipating ? (
                            <button 
                              className="btn-primary"
                              onClick={() => handleParticipate(selectedEvent.id)}
                              disabled={selectedEvent.participants >= selectedEvent.maxParticipants || isLoading}
                              title={selectedEvent.participants >= selectedEvent.maxParticipants ? 'Достигнут лимит участников' : 'Подтвердить участие'}
                            >
                              {isLoading ? (
                                <>
                                  <Loader size={18} className="spin" />
                                  <span>Обработка...</span>
                                </>
                              ) : selectedEvent.participants >= selectedEvent.maxParticipants ? (
                                'Мест нет'
                              ) : (
                                'Подтвердить участие'
                              )}
                            </button>
                          ) : (
                            <button 
                              className="btn-secondary"
                              onClick={() => handleCancelParticipation(selectedEvent.id)}
                              disabled={isLoading}
                              title="Отменить участие"
                            >
                              {isLoading ? (
                                <>
                                  <Loader size={18} className="spin" />
                                  <span>Обработка...</span>
                                </>
                              ) : (
                                'Отменить участие'
                              )}
                            </button>
                          )}
                        </>
                      )}
                      
                      <button 
                        className="btn-outline"
                        onClick={() => handleShare(selectedEvent)}
                        title="Поделиться событием"
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