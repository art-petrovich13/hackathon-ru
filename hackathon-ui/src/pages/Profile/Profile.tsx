// ProfilePage.tsx - Вариант 1
import React, { useState, useRef, useEffect } from 'react';
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
  ChevronRight,
  Check,
  Loader,
  AlertCircle,
  Folder,
  HardDrive,
  Image as ImageIcon,
  Search,
  CheckCircle,
  Eye,
  Download
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

interface DiskFolder {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface DiskImage {
  id: string;
  name: string;
  url: string;
  path: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'events' | 'bookmarks' | 'settings'>('profile');
  const [isUploading, setIsUploading] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [showAvatarError, setShowAvatarError] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(false);
  const [diskFolders, setDiskFolders] = useState<DiskFolder[]>([]);
  const [diskImages, setDiskImages] = useState<DiskImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<DiskImage | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCameraTooltip, setShowCameraTooltip] = useState(false);

  // Мокап аватара по умолчанию
  const defaultAvatars = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=User123',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Profile',
  ];

  const [profile, setProfile] = useState<UserProfile>({
    id: 'user_123',
    username: 'alexander_ivanov',
    email: 'alex@example.com',
    fullName: 'Александр Иванов',
    bio: 'Люблю искусство, путешествия и хорошую компанию. Часто посещаю выставки и концерты.',
    location: 'Москва, Россия',
    phone: '+7 (999) 123-45-67',
    website: 'https://alexivanov.me',
    avatar: defaultAvatars[0],
    joinedDate: '15 января 2023',
    eventsCount: 24,
    friendsCount: 156,
    reviewsCount: 42,
    interests: ['Искусство', 'Музыка', 'Театр', 'Кино', 'Путешествия', 'Еда']
  });

  // Имитация дисков и папок
  const mockDiskFolders: DiskFolder[] = [
    {
      id: 'desktop',
      name: 'Рабочий стол',
      path: 'C:/Users/User/Desktop',
      icon: <div className="folder-icon">🖥️</div>
    },
    {
      id: 'pictures',
      name: 'Изображения',
      path: 'C:/Users/User/Pictures',
      icon: <div className="folder-icon">🖼️</div>
    },
    {
      id: 'downloads',
      name: 'Загрузки',
      path: 'C:/Users/User/Downloads',
      icon: <div className="folder-icon">📥</div>
    },
    {
      id: 'documents',
      name: 'Документы',
      path: 'C:/Users/User/Documents',
      icon: <div className="folder-icon">📁</div>
    },
    {
      id: 'drive_c',
      name: 'Диск C',
      path: 'C:/',
      icon: <div className="folder-icon">💽</div>
    },
    {
      id: 'drive_d',
      name: 'Диск D',
      path: 'D:/',
      icon: <div className="folder-icon">💽</div>
    }
  ];

  // Имитация изображений в папках
  const mockImages: DiskImage[] = [
    {
      id: '1',
      name: 'nature.jpg',
      url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      path: 'C:/Users/User/Pictures/nature.jpg'
    },
    {
      id: '2',
      name: 'portrait.png',
      url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      path: 'C:/Users/User/Pictures/portrait.png'
    },
    {
      id: '3',
      name: 'cityscape.webp',
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      path: 'C:/Users/User/Pictures/cityscape.webp'
    },
    {
      id: '4',
      name: 'sunset.jpeg',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      path: 'C:/Users/User/Desktop/sunset.jpeg'
    }
  ];

  // Валидация изображения
  const validateImage = (file: File): boolean => {
    setAvatarError(null);
    
    if (!file.type.startsWith('image/')) {
      setAvatarError('Пожалуйста, выберите файл изображения (JPG, PNG, GIF)');
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Размер файла не должен превышать 5MB');
      return false;
    }

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !validExtensions.includes(extension)) {
      setAvatarError('Допустимые форматы: JPG, PNG, GIF, WebP');
      return false;
    }

    return true;
  };

  // Загрузка аватара с устройства
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setShowAvatarError(false);

    if (!validateImage(file)) {
      setShowAvatarError(true);
      return;
    }

    setIsUploading(true);
    setShowUploadModal(true);
    setUploadProgress(0);

    try {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + 10;
        });
      }, 100);

      await new Promise(resolve => setTimeout(resolve, 1500));

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setUploadProgress(100);
        
        setTimeout(() => {
          setAvatarPreview(result);
          setProfile(prev => ({ ...prev, avatar: result }));
          setIsUploading(false);
          setShowUploadModal(false);
          setShowAvatarMenu(false);
          setIsEditing(true);
          setUploadProgress(0);
          
          setTimeout(() => {
            alert('✅ Аватар успешно загружен! Не забудьте сохранить изменения.');
          }, 300);
        }, 500);
      };
      reader.onerror = () => {
        setAvatarError('Ошибка при чтении файла');
        setShowAvatarError(true);
        setIsUploading(false);
        setShowUploadModal(false);
        setUploadProgress(0);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setAvatarError('Ошибка при загрузке изображения');
      setShowAvatarError(true);
      setIsUploading(false);
      setShowUploadModal(false);
      setUploadProgress(0);
    }

    event.target.value = '';
  };

  // Открытие файлового проводника
  const openFileExplorer = () => {
    setShowFileExplorer(true);
    setDiskFolders(mockDiskFolders);
    setDiskImages(mockImages);
    setShowAvatarMenu(false);
    setSelectedFolder(null);
    setSelectedImage(null);
    setSearchQuery('');
  };

  // Выбор папки
  const selectFolder = (folderId: string) => {
    setSelectedFolder(folderId);
    const folder = mockDiskFolders.find(f => f.id === folderId);
    const folderImages = mockImages.filter(img => 
      img.path.toLowerCase().startsWith(folder?.path.toLowerCase() || '')
    );
    setDiskImages(folderImages);
    setSelectedImage(null);
  };

  // Выбор изображения
  const selectImage = (image: DiskImage) => {
    setSelectedImage(image);
  };

  // Подтверждение выбора изображения
  const confirmImageSelection = () => {
    if (selectedImage) {
      setAvatarPreview(selectedImage.url);
      setProfile(prev => ({ ...prev, avatar: selectedImage.url }));
      setIsEditing(true);
      setShowFileExplorer(false);
      setSelectedImage(null);
      setSelectedFolder(null);
      setShowPreview(true);
    }
  };

  // Подтверждение аватара из предпросмотра
  const confirmAvatarFromPreview = () => {
    if (avatarPreview) {
      setProfile(prev => ({ ...prev, avatar: avatarPreview }));
      setShowPreview(false);
      setIsEditing(true);
      alert('✅ Аватар выбран из галереи! Не забудьте сохранить изменения.');
    }
  };

  // Выбор аватара из галереи готовых
  const handleSelectAvatar = (avatarUrl: string) => {
    setAvatarPreview(avatarUrl);
    setProfile(prev => ({ ...prev, avatar: avatarUrl }));
    setIsEditing(true);
    setShowAvatarMenu(false);
  };

  // Удаление аватара
  const handleRemoveAvatar = () => {
    if (window.confirm('Вы уверены, что хотите удалить текущий аватар?')) {
      setAvatarPreview(null);
      setProfile(prev => ({ ...prev, avatar: defaultAvatars[0] }));
      setIsEditing(true);
      setShowAvatarMenu(false);
      alert('✅ Аватар удален. Возвращен стандартный аватар.');
    }
  };

  // Сохранение профиля
  const handleSaveProfile = async () => {
    setIsUploading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (avatarPreview) {
        setProfile(prev => ({ ...prev, avatar: avatarPreview }));
      }
      
      setIsEditing(false);
      setAvatarPreview(null);
      alert('✅ Профиль успешно сохранен!');
    } catch (error) {
      alert('❌ Ошибка при сохранении профиля');
    } finally {
      setIsUploading(false);
    }
  };

  // Отмена редактирования
  const handleCancelEdit = () => {
    if (isEditing) {
      if (window.confirm('Отменить все изменения?')) {
        setAvatarPreview(null);
        setIsEditing(false);
        setAvatarError(null);
        setShowAvatarError(false);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      localStorage.removeItem('auth_token');
      navigate('/login');
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setIsEditing(true);
  };

  // Компонент аватара - Вариант 1: Стильный с hover-эффектами
  const AvatarComponent = () => (
    <div className="avatarContainer">
      <div className="avatarWrapper">
        {profile.avatar ? (
          <img
            src={avatarPreview || profile.avatar}
            alt="Аватар"
            className="avatarImage"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.fullName)}&background=random&size=150`;
            }}
          />
        ) : (
          <div className="avatarPlaceholder">
            <User size={48} />
          </div>
        )}

        {isUploading && (
          <div className="avatarOverlay loading">
            <Loader size={24} className="spin" />
            <span>Загрузка...</span>
          </div>
        )}

        {/* Улучшенная кнопка изменения фото */}
        <div className="avatarActionButtons">
          {!isUploading && (
            <>
              <button
                className="avatarChangeButton"
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                title="Изменить фото"
                onMouseEnter={() => setShowCameraTooltip(true)}
                onMouseLeave={() => setShowCameraTooltip(false)}
              >
                <Camera size={20} />
                <span>Изменить фото</span>
              </button>
              
              {/* Быстрые действия */}
              <div className="quickActions">
                <button
                  className="quickAction"
                  onClick={() => fileInputRef.current?.click()}
                  title="Загрузить фото"
                >
                  <Upload size={16} />
                </button>
                <button
                  className="quickAction"
                  onClick={openFileExplorer}
                  title="Выбрать из галереи"
                >
                  <Folder size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Тулкит камеры */}
        {showCameraTooltip && !isUploading && (
          <div className="cameraTooltip">
            <Camera size={12} />
            <span>Нажмите, чтобы изменить фото профиля</span>
          </div>
        )}
      </div>

      {/* Меню для аватара */}
      {showAvatarMenu && !isUploading && (
        <div className="avatarMenu">
          <div className="avatarMenuHeader">
            <div className="menuTitle">
              <Camera size={20} />
              <h4>Изменение фотографии профиля</h4>
            </div>
            <button 
              className="avatarMenuClose"
              onClick={() => setShowAvatarMenu(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="avatarMenuOptions">
            <div className="optionGroup">
              <h5>Загрузить новое фото</h5>
              <button
                className="avatarMenuOption primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={18} />
                <div className="optionContent">
                  <span className="optionTitle">С компьютера</span>
                  <span className="optionDescription">JPG, PNG, GIF, WebP до 5MB</span>
                </div>
                <ChevronRight size={16} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </button>
              
              <button
                className="avatarMenuOption primary"
                onClick={openFileExplorer}
              >
                <Folder size={18} />
                <div className="optionContent">
                  <span className="optionTitle">Из галереи диска</span>
                  <span className="optionDescription">Выбрать из папок на компьютере</span>
                </div>
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="optionGroup">
              <h5>Готовые аватары</h5>
              <div className="avatarGallery">
                <div className="avatarGalleryGrid">
                  {defaultAvatars.map((avatar, index) => (
                    <button
                      key={index}
                      className="avatarGalleryItem"
                      onClick={() => handleSelectAvatar(avatar)}
                      title={`Аватар ${index + 1}`}
                    >
                      <img src={avatar} alt={`Аватар ${index + 1}`} />
                      {profile.avatar === avatar && (
                        <div className="avatarSelected">
                          <Check size={14} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {profile.avatar !== defaultAvatars[0] && (
              <div className="optionGroup">
                <button
                  className="avatarMenuOption danger"
                  onClick={handleRemoveAvatar}
                >
                  <Trash2 size={18} />
                  <div className="optionContent">
                    <span className="optionTitle">Удалить текущий аватар</span>
                    <span className="optionDescription">Вернуться к стандартному аватару</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {showAvatarError && avatarError && (
            <div className="avatarError">
              <AlertCircle size={16} />
              <span>{avatarError}</span>
              <button 
                className="avatarErrorClose"
                onClick={() => setShowAvatarError(false)}
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="avatarTips">
        <p className="tip">
          <Camera size={14} />
          Наведите на фото, чтобы изменить его
        </p>
      </div>
    </div>
  );

  // Компонент файлового проводника
  const FileExplorerModal = () => (
    <div className="fileExplorerModal">
      <div className="fileExplorerContent">
        <div className="fileExplorerHeader">
          <h3>Выберите фото из галереи диска</h3>
          <button 
            className="avatarMenuClose"
            onClick={() => setShowFileExplorer(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="fileExplorerBody">
          <div className="searchBox">
            <Search size={18} />
            <input
              type="text"
              placeholder="Поиск по названию файла..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="fileExplorerFolders">
            {mockDiskFolders.map(folder => (
              <div
                key={folder.id}
                className={`folderItem ${selectedFolder === folder.id ? 'selected' : ''}`}
                onClick={() => selectFolder(folder.id)}
              >
                {folder.icon}
                <h4 className="folderName">{folder.name}</h4>
                <p className="folderPath">{folder.path}</p>
              </div>
            ))}
          </div>

          <div className="fileExplorerImages">
            <h4>Доступные изображения {selectedFolder ? `в ${mockDiskFolders.find(f => f.id === selectedFolder)?.name}` : ''}</h4>
            <div className="imagesGrid">
              {diskImages
                .filter(img => 
                  img.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  img.path.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(image => (
                  <div
                    key={image.id}
                    className={`imageItem ${selectedImage?.id === image.id ? 'selected' : ''}`}
                    onClick={() => selectImage(image)}
                  >
                    <img src={image.url} alt={image.name} />
                    <div className="imageOverlay">
                      <Eye size={16} />
                      <span className="imageName">{image.name}</span>
                    </div>
                    {selectedImage?.id === image.id && (
                      <div className="imageSelectedBadge">
                        <CheckCircle size={16} />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="fileExplorerActions">
          <button 
            className="btn btn-outline"
            onClick={() => setShowFileExplorer(false)}
          >
            Отмена
          </button>
          <button 
            className="btn btn-primary"
            onClick={confirmImageSelection}
            disabled={!selectedImage}
          >
            {selectedImage ? `Выбрать "${selectedImage.name}"` : 'Выберите изображение'}
          </button>
        </div>
      </div>
    </div>
  );

  // Компонент предпросмотра
  const PreviewModal = () => (
    <div className="previewModal">
      <div className="previewContent">
        <h3>Предпросмотр аватара</h3>
        <img src={avatarPreview || ''} alt="Предпросмотр" className="previewImage" />
        <div className="previewActions">
          <button 
            className="btn btn-outline"
            onClick={() => setShowPreview(false)}
          >
            Отмена
          </button>
          <button 
            className="btn btn-primary"
            onClick={confirmAvatarFromPreview}
          >
            Использовать это фото
          </button>
        </div>
      </div>
    </div>
  );

  // Компонент загрузки
  const UploadModal = () => (
    <div className="uploadModal">
      <div className="uploadContent">
        <Loader size={32} className="spin" />
        <h4>Загрузка изображения</h4>
        <div className="uploadProgress">
          <div 
            className="progressBar" 
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="uploadStatus">{uploadProgress}%</p>
      </div>
    </div>
  );

  // Мокап событий
  const [events] = useState([
    { id: 1, title: 'Выставка современного искусства', date: '25 мая 2024', status: 'участвую' },
    { id: 2, title: 'Концерт классической музыки', date: '10 июня 2024', status: 'буду' },
  ]);

  const mockBookmarks = [
    { id: 1, title: 'Выставка Ван Гога', category: 'Искусство' },
    { id: 2, title: 'Джазовый вечер', category: 'Музыка' },
  ];

  // Закрытие меню аватара при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.avatarContainer') && !target.closest('.avatarMenu')) {
        setShowAvatarMenu(false);
      }
    };

    if (showAvatarMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAvatarMenu]);

  return (
    <div className="container">
      {/* Боковая панель */}
      <aside className="sidebar">
        <div className="userCard">
          <div className="avatarSection">
            <AvatarComponent />
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
            <span className="badge">{events.length}</span>
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
                  <button 
                    className="saveButton" 
                    onClick={handleSaveProfile}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader size={18} className="spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Сохранить
                      </>
                    )}
                  </button>
                  <button 
                    className="cancelButton" 
                    onClick={handleCancelEdit}
                    disabled={isUploading}
                  >
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
                        disabled={isUploading}
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
                        disabled={isUploading}
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
                        disabled={isUploading}
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
                        disabled={isUploading}
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
                        disabled={isUploading}
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
                        disabled={isUploading}
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
                      disabled={isUploading}
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
                      {isEditing && !isUploading && (
                        <button
                          className="interest-remove"
                          onClick={() => {
                            const newInterests = [...profile.interests];
                            newInterests.splice(index, 1);
                            setProfile(prev => ({ ...prev, interests: newInterests }));
                            setIsEditing(true);
                          }}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {isEditing && !isUploading && (
                    <button
                      className="interest-add"
                      onClick={() => {
                        const newInterest = prompt('Добавить интерес:');
                        if (newInterest && newInterest.trim()) {
                          if (!profile.interests.includes(newInterest.trim())) {
                            setProfile(prev => ({
                              ...prev,
                              interests: [...prev.interests, newInterest.trim()]
                            }));
                            setIsEditing(true);
                          } else {
                            alert('Этот интерес уже добавлен');
                          }
                        }
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
                {events.map(event => (
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
                  <div className="
                  ">
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

      {/* Модальные окна */}
      {showFileExplorer && <FileExplorerModal />}
      {showPreview && <PreviewModal />}
      {showUploadModal && <UploadModal />}

      {/* Плавающая кнопка для мобильных */}
      <button 
        className="floatingCameraButton"
        onClick={() => setShowAvatarMenu(true)}
        title="Изменить фото"
      >
        <Camera size={24} />
      </button>
    </div>
  );
};

export default ProfilePage;