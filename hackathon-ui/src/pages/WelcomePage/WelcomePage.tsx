// WelcomePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.scss';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = () => {
    navigate('/authorization');
  };

  return (
    <div className="welcome-page">
      {/* Фоновые элементы */}
      <div className="background-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="pulse-dot"></div>
      </div>

      <div className="welcome-container">
        {/* Логотип и название */}
        <div className={`logo-section ${animated ? 'animate' : ''}`}>
          <div className="logo-icon">
            <svg viewBox="0 0 100 100" className="logo-svg">
              <path 
                d="M50,10 L90,30 L90,70 L50,90 L10,70 L10,30 Z" 
                className="logo-hexagon"
              />
              <text x="50" y="65" textAnchor="middle" className="logo-text">K</text>
            </svg>
          </div>
          <h1 className="app-title">
            <span className="title-part title-kuda">Kuda</span>
            <span className="title-part title-go">Go</span>
            <span className="title-domain">.ru</span>
          </h1>
        </div>

        {/* Основной контент */}
        <div className={`content-section ${animated ? 'animate' : ''}`}>
          <h2 className="tagline">
            Идеальные события<br />для вашей компании
          </h2>
          
          <div className="features">
            <div className="feature">
              <span className="feature-icon">✨</span>
              <span className="feature-text">Персональный подбор</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <span className="feature-text">Точные рекомендации</span>
            </div>
          </div>
        </div>

        {/* Кнопка перехода */}
        <div className={`action-section ${animated ? 'animate' : ''}`}>
          <button 
            className="cta-button"
            onClick={handleNavigate}
            onMouseEnter={(e) => {
              e.currentTarget.classList.add('hover');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.classList.remove('hover');
            }}
          >
            <span className="button-text">Найти события</span>
            <span className="button-arrow">→</span>
          </button>
          
          <div className="hint">
            <span className="hint-text">10,000+ мероприятий уже ждут</span>
          </div>
        </div>

        {/* Декоративные иконки */}
        <div className="decorative-elements">
          <div className="event-icon icon-1">🎨</div>
          <div className="event-icon icon-2">🎵</div>
          <div className="event-icon icon-3">🎭</div>
        </div>
      </div>

      {/* Подложка */}
      <div className="gradient-overlay"></div>
    </div>
  );
};

export default WelcomePage;