import React from 'react';
import { MapPin, Calendar, Users, Tag, CheckCircle, Share2, Star, Plus } from 'lucide-react';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    short_description: string;
    image: string;
    image_thumbnail: string;
    start_date: string;
    end_date: string;
    location: string;
    price: number;
    payment_type: string;
    participants_count: number;
    max_participants: number;
    status: string;
    is_active: boolean;
    is_past: boolean;
    is_full: boolean;
    is_participating: boolean;
    available_spots: number;
    organizer_name: string;
  };
  onViewDetails: (event: any) => void;
  onParticipate: (id: number) => void;
  onCancelParticipation: (id: number) => void;
  onShare: (event: any) => void;
  isLoading?: boolean;
}

export default function EventCard({
  event,
  onViewDetails,
  onParticipate,
  onCancelParticipation,
  onShare,
  isLoading = false,
}: EventCardProps) {
  
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

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10b981';
      case 'past': return '#64748b';
      case 'rejected': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getPaymentColor = (paymentType: string): string => {
    return paymentType === 'free' ? '#10b981' : '#f59e0b';
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 90) return '#ef4444';
    if (progress >= 70) return '#f59e0b';
    return '#10b981';
  };

  const progress = event.max_participants ? 
    (event.participants_count / event.max_participants) * 100 : 0;

  const getEventTooltip = (): string => {
    return `
Название: ${event.title}
Дата: ${formatDate(event.start_date, event.end_date)}
Место: ${event.location}
Статус: ${event.status === 'active' ? 'Активное' : event.status === 'past' ? 'Прошедшее' : 'Отклоненное'}
Оплата: ${event.payment_type === 'free' ? 'Бесплатно' : `Платно (${event.price} руб.)`}
Участники: ${event.participants_count}/${event.max_participants || 'не ограничено'}
Описание: ${event.short_description.substring(0, 100)}...
    `.trim();
  };

  return (
    <div 
      className="event-card"
      onClick={() => onViewDetails(event)}
      title={getEventTooltip()}
      role="button"
      tabIndex={0}
    >
      <div className="event-image">
        <img 
          src={event.image_thumbnail || event.image || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
          alt={event.title} 
          loading="lazy" 
        />
        <div className="event-badges">
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
            style={{ backgroundColor: getPaymentColor(event.payment_type) }}
          >
            {event.payment_type === 'free' ? 'Бесплатно' : `Платно ${event.price ? `(${event.price} руб.)` : ''}`}
          </div>
          {event.is_participating && (
            <div className="participating-badge">
              <CheckCircle size={14} />
              <span>Вы участвуете</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="event-content">
        <div className="event-category">
          <Tag size={14} />
          {event.payment_type === 'free' ? 'Бесплатное' : 'Платное'}
        </div>
        <h3 className="event-title">{event.title}</h3>
        
        <div className="event-details">
          <div className="detail-item">
            <MapPin size={16} />
            <span className="truncate" title={event.location}>{event.location}</span>
          </div>
          <div className="detail-item">
            <Calendar size={16} />
            <span>{formatDate(event.start_date, event.end_date)}</span>
          </div>
          <div className="detail-item">
            <Users size={16} />
            <span title={`${event.participants_count} из ${event.max_participants || '∞'} участников`}>
              {event.participants_count}/{event.max_participants || '∞'} участников
            </span>
            {event.max_participants && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: getProgressColor(progress)
                    }}
                  />
                </div>
                <span className="progress-text">{Math.round(progress)}%</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="event-actions">
          {event.is_active && !event.is_past && (
            <button 
              className={event.is_participating ? 'btn-participating' : 'btn-join'}
              onClick={(e) => {
                e.stopPropagation();
                if (event.is_participating) {
                  onCancelParticipation(event.id);
                } else {
                  onParticipate(event.id);
                }
              }}
              disabled={(isLoading || (!event.is_participating && event.is_full))}
              title={!event.is_participating && event.is_full ? 'Достигнут лимит участников' : ''}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : event.is_participating ? (
                <>
                  <CheckCircle size={16} />
                  <span>Вы участвуете</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>
                    {event.is_full 
                      ? 'Мест нет' 
                      : 'Присоединиться'
                    }
                  </span>
                </>
              )}
            </button>
          )}
          
          {event.is_past && event.is_participating && (
            <button className="btn-participating" disabled>
              <CheckCircle size={16} />
              <span>Вы участвовали</span>
            </button>
          )}
          
          <button 
            className="btn-share"
            onClick={(e) => {
              e.stopPropagation();
              onShare(event);
            }}
            title="Поделиться событием"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}