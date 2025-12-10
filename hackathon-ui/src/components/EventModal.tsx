import React from 'react';
import { X, MapPin, Calendar, Clock, Users, CheckCircle, AlertCircle, Share2, Loader } from 'lucide-react';

interface EventModalProps {
  event: {
    id: number;
    title: string;
    description: string;
    image: string;
    start_date: string;
    end_date: string;
    location: string;
    price: number;
    payment_type: string;
    payment_details?: any;
    max_participants: number;
    participants_count: number;
    status: string;
    is_active: boolean;
    is_past: boolean;
    is_full: boolean;
    available_spots: number;
    is_participating: boolean;
    organizer: {
      id: number;
      name: string;
      email: string;
    };
    created_at: string;
    updated_at: string;
  };
  onClose: () => void;
  onParticipate: (id: number) => void;
  onCancelParticipation: (id: number) => void;
  onShare: (event: any) => void;
  isLoading?: boolean;
  isAdmin?: boolean;
  onEdit?: (event: any) => void;
}

export default function EventModal({
  event,
  onClose,
  onParticipate,
  onCancelParticipation,
  onShare,
  isLoading = false,
  isAdmin = false,
  onEdit,
}: EventModalProps) {
  
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

  const formatTime = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    const startTime = startDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const endTime = endDate.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `${startTime} - ${endTime}`;
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10b981';
      case 'past': return '#64748b';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return '#ef4444';
    if (progress >= 70) return '#f59e0b';
    return '#10b981';
  };

  const progress = event.max_participants ? 
    (event.participants_count / event.max_participants) * 100 : 0;

  const canParticipate = event.is_active && !event.is_past && !event.is_full && !event.is_participating;
  const canCancel = event.is_participating && !event.is_past;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close" 
          onClick={onClose}
          title="Закрыть"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        
        <div className="modal-content">
          <div className="modal-image">
            <img src={event.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} alt={event.title} />
            <div className="modal-image-overlay">
              <div className="modal-badges">
                <div 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(event.status) }}
                >
                  {event.status === 'active' ? 'Активное' : 
                   event.status === 'past' ? 'Прошедшее' : 
                   event.status === 'rejected' ? 'Отклоненное' : event.status}
                </div>
                <div 
                  className="payment-badge" 
                  style={{ backgroundColor: event.payment_type === 'free' ? '#10b981' : '#f59e0b' }}
                >
                  {event.payment_type === 'free' ? 'Бесплатно' : `Платно ${event.price ? `(${event.price} руб.)` : ''}`}
                </div>
                {event.is_participating && (
                  <div className="participating-badge">
                    <CheckCircle size={16} />
                    <span>Вы участвуете</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-body">
            <div className="modal-header">
              <h2>{event.title}</h2>
              <div className="modal-category">
                {event.payment_type === 'free' ? 'Бесплатное' : 'Платное'}
              </div>
            </div>
            
            <div className="modal-info">
              <div className="info-grid">
                <div className="info-item">
                  <MapPin size={20} />
                  <div>
                    <label>Место проведения</label>
                    <p>{event.location}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <Calendar size={20} />
                  <div>
                    <label>Дата проведения</label>
                    <p>{formatDate(event.start_date, event.end_date)}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <Clock size={20} />
                  <div>
                    <label>Время</label>
                    <p>{formatTime(event.start_date, event.end_date)}</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <Users size={20} />
                  <div>
                    <label>Участники</label>
                    <div className="participants-info">
                      <span>{event.participants_count} / {event.max_participants || 'не ограничено'}</span>
                      {event.max_participants && (
                        <span className="progress-percent">
                          {Math.round(progress)}%
                        </span>
                      )}
                    </div>
                    {event.max_participants && (
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: getProgressColor(progress)
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="modal-description">
                <h3>Описание события</h3>
                <p>{event.description}</p>
              </div>
              
              {event.payment_details && (
                <div className="payment-info">
                  <h3>Информация об оплате</h3>
                  <p>{typeof event.payment_details === 'string' ? event.payment_details : JSON.stringify(event.payment_details)}</p>
                </div>
              )}
              
              <div className="modal-organizer">
                <h3>Организатор</h3>
                <div className="organizer-info">
                  <div className="organizer-avatar">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="organizer-name">{event.organizer?.name || 'Неизвестно'}</p>
                    <p className="organizer-email">{event.organizer?.email || ''}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-actions">
                <div className="user-participation-status">
                  {event.is_participating ? (
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
                  {/* Кнопка записи/отмены участия */}
                  {!event.is_participating ? (
                    <button 
                      className="btn-primary"
                      onClick={() => onParticipate(event.id)}
                      disabled={isLoading || event.is_past || event.is_full || !event.is_active}
                      title={
                        event.is_past ? 'Событие уже прошло' : 
                        event.is_full ? 'Достигнут лимит участников' : 
                        !event.is_active ? 'Событие не активно' : 
                        'Записаться на мероприятие'
                      }
                    >
                      {isLoading ? (
                        <>
                          <Loader size={18} className="spin" />
                          <span>Обработка...</span>
                        </>
                      ) : event.is_full ? (
                        'Мест нет'
                      ) : event.is_past ? (
                        'Событие прошло'
                      ) : !event.is_active ? (
                        'Не активно'
                      ) : (
                        'Записаться на мероприятие'
                      )}
                    </button>
                  ) : (
                    <button 
                      className="btn-secondary"
                      onClick={() => onCancelParticipation(event.id)}
                      disabled={isLoading || event.is_past}
                      title={event.is_past ? 'Нельзя отменить участие в прошедшем событии' : 'Отменить запись'}
                    >
                      {isLoading ? (
                        <>
                          <Loader size={18} className="spin" />
                          <span>Обработка...</span>
                        </>
                      ) : (
                        'Отменить запись'
                      )}
                    </button>
                  )}
                  
                  {/* Кнопка поделиться */}
                  <button 
                    className="btn-outline"
                    onClick={() => onShare(event)}
                    title="Поделиться событием"
                  >
                    <Share2 size={18} />
                    Поделиться
                  </button>
                  
                  {/* Кнопка редактирования для админа */}
                  {isAdmin && onEdit && (
                    <button 
                      className="btn-secondary"
                      onClick={() => onEdit(event)}
                      title="Редактировать событие"
                    >
                      Редактировать
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}