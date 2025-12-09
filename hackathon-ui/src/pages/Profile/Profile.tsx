// ProfilePage.tsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Camera,
  Edit3,
  Save,
  X,
  LogOut,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Settings,
  Bell,
  Shield,
  Bookmark,
  Heart,
  Star,
  Upload,
  Trash2,
  ChevronRight
} from 'lucide-react';
import './ProfilePage.scss';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio: string;
  location: string;
  phone: string;
  website: string;
  avatar: string | null;
  joinedDate: string;
  eventsCount: number;
  friendsCount: number;
  reviewsCount: number;
  interests: string[];
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'events' | 'bookmarks' | 'settings'>('profile');

  const [profile, setProfile] = useState<UserProfile>({
    id: 'user_123',
    username: 'alexander_ivanov',
    email: 'alex@example.com',
    fullName: 'Александр Иванов',
    bio: 'Люблю искусство, путешествия и хорошую компанию. Часто посещаю выставки и концерты.',
    location: 'Москва, Россия',
    phone: '+7 (999) 123-45-67',
    website: 'https://alexivanov.me',
    avatar: null,
    joinedDate: '15 января 2023',
    eventsCount: 24,
    friendsCount: 156,
    reviewsCount: 42,
    interests: ['Искусство', 'Музыка', 'Театр', 'Кино', 'Путешествия', 'Еда']
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (avatarPreview) {
      setProfile(prev => ({ ...prev, avatar: avatarPreview }));
    }
    setIsEditing(false);
    // Здесь обычно отправляем данные на сервер
    alert('Профиль сохранен!');
  };

  const handleCancelEdit = () => {
    setAvatarPreview(null);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      // Очистка данных авторизации
      localStorage.removeItem('auth_token');
      navigate('/login');
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !profile.interests.includes(interest)) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
      setIsEditing(true);
    }
  };

  const removeInterest = (index: number) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
    setIsEditing(true);
  };

  const mockEvents = [
    { id: 1, title: 'Выставка современного искусства', date: '25 мая 2024', status: 'участвую' },
    { id: 2, title: 'Концерт классической музыки', date: '10 июня 2024', status: 'буду' },
    { id: 3, title: 'Театральная премьера', date: '1 июня 2024', status: 'участвовал' },
    { id: 4, title: 'Фестиваль уличной еды', date: '15 мая 2024', status: 'участвовал' },
    { id: 5, title: 'Джазовый вечер в парке', date: '20 июня 2024', status: 'буду' },
    { id: 6, title: 'Мастер-класс по фотографии', date: '5 июля 2024', status: 'участвую' },
    { id: 7, title: 'Кинофестиваль под открытым небом', date: '12 июля 2024', status: 'буду' },
    { id: 8, title: 'Выставка скульптур', date: '18 июля 2024', status: 'участвую' },
    { id: 9, title: 'Концерт рок-группы', date: '25 июля 2024', status: 'буду' },
    { id: 10, title: 'Театральный фестиваль', date: '1 августа 2024', status: 'участвовал' },
    { id: 11, title: 'Фестиваль народной музыки', date: '8 августа 2024', status: 'участвую' },
    { id: 12, title: 'Выставка цифрового искусства', date: '15 августа 2024', status: 'буду' },
    { id: 13, title: 'Концерт симфонической музыки', date: '22 августа 2024', status: 'участвовал' },
    { id: 14, title: 'Мастер-класс по живописи', date: '29 августа 2024', status: 'участвую' },
    { id: 15, title: 'Фестиваль современного танца', date: '5 сентября 2024', status: 'буду' },
  ];

  const mockBookmarks = [
    { id: 1, title: 'Выставка Ван Гога', category: 'Искусство' },
    { id: 2, title: 'Джазовый вечер', category: 'Музыка' },
    { id: 3, title: 'Стендап-концерт', category: 'Юмор' },
    { id: 4, title: 'Мастер-класс по живописи', category: 'Обучение' },
  ];

  return (
    <div className="container">
      {/* Боковая панель */}
      <aside className="sidebar">
        <div className="userCard">
          <div className="avatarSection">
            <div className="avatarContainer">
              {avatarPreview || profile.avatar ? (
                <img
                  src={avatarPreview || profile.avatar!}
                  alt="Аватар"
                  className="avatarImage"
                />
              ) : (
                <div className="avatarPlaceholder">
                  <User size={48} />
                </div>
              )}

              <button
                className="avatarButton"
                onClick={() => fileInputRef.current?.click()}
                title="Изменить фото"
              >
                <Camera size={18} />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <h2 className="userName">@{profile.username}</h2>
          <p className="userEmail">{profile.email}</p>

          <div className="stats">
            <div className="statItem">
              <span className="statNumber">{profile.eventsCount}</span>
              <span className="statLabel">Событий</span>
            </div>
            <div className="statItem">
              <span className="statNumber">{profile.friendsCount}</span>
              <span className="statLabel">Друзей</span>
            </div>
            <div className="statItem">
              <span className="statNumber">{profile.reviewsCount}</span>
              <span className="statLabel">Отзывов</span>
            </div>
          </div>
        </div>

        <nav className="navigation">
          <button
            className={`navButton ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={20} />
            <span>Профиль</span>
            <ChevronRight size={16} />
          </button>

          <button
            className={`navButton ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={20} />
            <span>Мои события</span>
            <span className="badge">{mockEvents.length}</span>
          </button>

          <button
            className={`navButton ${activeTab === 'bookmarks' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookmarks')}
          >
            <Bookmark size={20} />
            <span>Закладки</span>
            <span className="badge">{mockBookmarks.length}</span>
          </button>

          <button
            className={`navButton ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Настройки</span>
            <ChevronRight size={16} />
          </button>
        </nav>

        <button className="logoutButton" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Выйти</span>
        </button>
      </aside>

      {/* Основное содержимое */}
      <main className="content">
        <header className="header">
          <h1 className="title">
            {activeTab === 'profile' && 'Мой профиль'}
            {activeTab === 'events' && 'Мои события'}
            {activeTab === 'bookmarks' && 'Закладки'}
            {activeTab === 'settings' && 'Настройки'}
          </h1>

          {activeTab === 'profile' && (
            <div className="headerActions">
              {isEditing ? (
                <>
                  <button className="saveButton" onClick={handleSaveProfile}>
                    <Save size={18} />
                    Сохранить
                  </button>
                  <button className="cancelButton" onClick={handleCancelEdit}>
                    <X size={18} />
                    Отмена
                  </button>
                </>
              ) : (
                <button className="editButton" onClick={() => setIsEditing(true)}>
                  <Edit3 size={18} />
                  Редактировать
                </button>
              )}
            </div>
          )}
        </header>

        <div className="contentSection">
          {activeTab === 'profile' && (
            <div className="profileForm">
              <div className="formSection">
                <h3 className="sectionTitle">
                  <User size={20} />
                  Основная информация
                </h3>

                <div className="formGrid">
                  <div className="formGroup">
                    <label className="label">
                      <User size={16} />
                      Имя пользователя
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="input"
                      />
                    ) : (
                      <p className="value">@{profile.username}</p>
                    )}
                  </div>

                  <div className="formGroup">
                    <label className="label">
                      <User size={16} />
                      Полное имя
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="input"
                      />
                    ) : (
                      <p className="value">{profile.fullName}</p>
                    )}
                  </div>

                  <div className="formGroup">
                    <label className="label">
                      <Mail size={16} />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="input"
                      />
                    ) : (
                      <p className="value">{profile.email}</p>
                    )}
                  </div>

                  <div className="formGroup">
                    <label className="label">
                      <Phone size={16} />
                      Телефон
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="input"
                      />
                    ) : (
                      <p className="value">{profile.phone}</p>
                    )}
                  </div>

                  <div className="formGroup">
                    <label className="label">
                      <MapPin size={16} />
                      Местоположение
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="input"
                        placeholder="Город, страна"
                      />
                    ) : (
                      <p className="value">{profile.location}</p>
                    )}
                  </div>

                  <div className="formGroup">
                    <label className="label">
                      <Globe size={16} />
                      Веб-сайт
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="input"
                      />
                    ) : (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link"
                      >
                        {profile.website}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="formSection">
                <h3 className="sectionTitle">
                  <Edit3 size={20} />
                  О себе
                </h3>
                <div className="formGroup">
                  {isEditing ? (
                    <textarea
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="textarea"
                      rows={3}
                      placeholder="Расскажите о себе..."
                    />
                  ) : (
                    <p className="value">{profile.bio}</p>
                  )}
                </div>
              </div>

              <div className="formSection">
                <h3 className="sectionTitle">
                  <Heart size={20} />
                  Интересы
                </h3>
                <div className="interests-container">
                  {profile.interests.map((interest, index) => (
                    <div key={index} className="interest-tag">
                      {interest}
                      {isEditing && (
                        <button
                          className="interest-remove"
                          onClick={() => removeInterest(index)}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {isEditing && (
                    <button
                      className="interest-add"
                      onClick={() => {
                        const newInterest = prompt('Добавить интерес:');
                        if (newInterest) addInterest(newInterest);
                      }}
                    >
                      + Добавить
                    </button>
                  )}
                </div>
              </div>

              <div className="formSection">
                <h3 className="sectionTitle">
                  <Calendar size={20} />
                  Информация об аккаунте
                </h3>
                <div className="accountInfo">
                  <div className="infoItem">
                    <span className="infoLabel">Дата регистрации:</span>
                    <span className="infoValue">{profile.joinedDate}</span>
                  </div>
                  <div className="infoItem">
                    <span className="infoLabel">ID пользователя:</span>
                    <span className="infoValue">{profile.id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="activitySection">
              <div className="events-header">
                <h3 className="sectionTitle">Предстоящие события</h3>
                <button className="btn btn-primary" onClick={() => navigate('/events')}>
                  Найти события
                </button>
              </div>

              <div className="activityList">
                {mockEvents.map(event => (
                  <div key={event.id} className="activityItem">
                    <div className="activityIcon">
                      <Calendar size={20} />
                    </div>
                    <div className="activityContent">
                      <h4 className="activityText">{event.title}</h4>
                      <div className="activityTime">
                        <Calendar size={16} />
                        {event.date}
                      </div>
                      <div className="event-actions">
                        <button className="btn btn-small">Подробнее</button>
                        <button className="btn btn-small btn-outline">Отменить</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookmarks' && (
            <div className="activitySection">
              <div className="bookmarks-header">
                <h3 className="sectionTitle">Сохраненные события</h3>
                <button className="btn btn-primary" onClick={() => navigate('/events')}>
                  Добавить еще
                </button>
              </div>

              <div className="activityList">
                {mockBookmarks.map(bookmark => (
                  <div key={bookmark.id} className="activityItem">
                    <div className="activityIcon">
                      <Bookmark size={20} />
                    </div>
                    <div className="activityContent">
                      <h4 className="activityText">{bookmark.title}</h4>
                      <span className="bookmark-category">{bookmark.category}</span>
                      <div className="bookmark-actions">
                        <button className="icon-btn" title="Удалить">
                          <Trash2 size={18} />
                        </button>
                        <button className="btn btn-small">Перейти</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settingsSection">
              <div className="settings-grid">
                <div className="setting-card">
                  <div className="activityIcon">
                    <Bell size={24} />
                  </div>
                  <div className="activityContent">
                    <h4>Уведомления</h4>
                    <p>Настройте получение уведомлений о событиях</p>
                    <button className="btn btn-outline">Настроить</button>
                  </div>
                </div>

                <div className="setting-card">
                  <div className="activityIcon">
                    <Shield size={24} />
                  </div>
                  <div className="activityContent">
                    <h4>Приватность</h4>
                    <p>Управление видимостью профиля</p>
                    <button className="btn btn-outline">Настроить</button>
                  </div>
                </div>

                <div className="setting-card">
                  <div className="activityIcon">
                    <Star size={24} />
                  </div>
                  <div className="activityContent">
                    <h4>Оценки и отзывы</h4>
                    <p>Просмотр и управление вашими отзывами</p>
                    <button className="btn btn-outline">Перейти</button>
                  </div>
                </div>
              </div>

              <div className="dangerZone">
                <h3 className="dangerTitle">Опасная зона</h3>
                <div className="danger-actions">
                  <button className="dangerButton">
                    <Trash2 size={18} />
                    Удалить аккаунт
                  </button>
                  <p className="dangerHint">
                    Это действие нельзя отменить. Все данные будут удалены.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;