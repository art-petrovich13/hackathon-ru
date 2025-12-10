import React, { useState, useEffect } from 'react';
import './EventsPage.scss';

// Иконки
import {
  Calendar, Users, MapPin, Clock, Tag,
  CheckCircle, XCircle, Star, Filter, Plus, User,
  TrendingUp, Award, Zap, Heart, Share2, X,
  Menu, Bell, Search, Settings, Home, Package,
  MessageSquare, Shield, LogOut, ArrowRight,
  AlertCircle, Loader, ChevronRight, Edit
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
  fullDescription?: string;
  payment: 'Free' | 'Paid';
  paymentInfo?: string;
  userParticipating: boolean;
  location: string;
  organizer: string;
  rating: number;
  price?: string;
  invitedUsers?: number[];
}

// User interface
interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
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
    startDate: '2026-03-15',
    endDate: '2026-03-16',
    participants: 42,
    maxParticipants: 100,
    status: 'Активное',
    category: 'Технологии',
    description: 'Крупнейшая технологическая конференция года с участием ведущих экспертов индустрии. Обсуждение будущего AI, блокчейна и облачных технологий.',
    fullDescription: 'Tech Summit 2024 - это масштабное событие, объединяющее лидеров технологической индустрии, инноваторов и энтузиастов. В течение двух дней участники смогут посетить более 50 сессий по различным темам, включая искусственный интеллект, машинное обучение, блокчейн, кибербезопасность и облачные вычисления. Ключевые докладчики из ведущих компаний поделятся своим опытом и видением будущего технологий.',
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
    startDate: '2026-04-20',
    endDate: '2026-04-22',
    participants: 85,
    maxParticipants: 150,
    status: 'Активное',
    category: 'Искусство',
    description: 'Трехдневный фестиваль современного искусства с выставками, мастер-классами и выступлениями художников.',
    fullDescription: 'Арт-фестиваль "Весна" представляет собой уникальное собрание современных художников, скульпторов и фотографов. В рамках фестиваля пройдут выставки, мастер-классы по различным техникам живописи и скульптуры, а также лекции об истории искусства. Особое внимание уделяется интерактивным инсталляциям и цифровому искусству.',
    payment: 'Paid',
    userParticipating: true,
    location: 'Санкт-Петербург, Эрмитаж',
    organizer: 'Art Collective',
    rating: 4.9,
    price: '1500 руб',
    paymentInfo: 'Оплата через официальный сайт фестиваля или на месте. Для студентов и пенсионеров предусмотрена скидка 30% при предъявлении подтверждающих документов.'
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
    fullDescription: 'Марафон Здоровья - это благотворительное мероприятие, направленное на популяризацию здорового образа жизни и сбор средств для детских медицинских учреждений. Дистанции: 5 км, 10 км и полумарафон (21.1 км). Каждый участник получит памятную медаль и футболку. После забега - праздничная программа с выступлениями музыкальных коллективов и фудкортом.',
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
    startDate: '2026-05-05',
    endDate: '2026-05-07',
    participants: 65,
    maxParticipants: 120,
    status: 'Активное',
    category: 'Бизнес',
    description: 'Международный форум для стартапов и инвесторов. Питч-сессии, нетворкинг, мастер-классы.',
    fullDescription: 'Бизнес-форум Startup - это платформа для встреч начинающих предпринимателей с опытными инвесторами и менторами. В программе: питч-сессии, где стартапы могут представить свои проекты, мастер-классы по бизнес-моделированию, маркетингу и привлечению инвестиций, а также нетворкинг-сессии с представителями венчурных фондов.',
    payment: 'Paid',
    userParticipating: false,
    location: 'Сколково',
    organizer: 'Startup Nation',
    rating: 4.6,
    price: '3000 руб',
    paymentInfo: 'Оплата банковской картой через безопасный платежный шлюз. Возможна оплата по счету для юридических лиц.'
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
    fullDescription: 'Концерт Московского государственного симфонического оркестра под управлением маэстро Петрова. В программе: произведения Чайковского, Рахманинова и Шостаковича. Особенностью вечера станет исполнение "Весны священной" Стравинского в оригинальной аранжировке.',
    payment: 'Paid',
    userParticipating: false,
    location: 'Консерватория им. Чайковского',
    organizer: 'Classic Music Group',
    rating: 4.9,
    price: '2000 руб',
    paymentInfo: 'Билеты можно приобрести в кассах консерватории или на официальном сайте. Электронные билеты действительны при предъявлении на экране мобильного устройства.'
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
    fullDescription: 'Хакатон AI Challenge - это соревнование для разработчиков, data scientist и ML-инженеров. Участникам предстоит решить реальные бизнес-кейсы от партнеров мероприятия с использованием современных технологий искусственного интеллекта. Призовой фонд: 1 000 000 рублей. Победители также получат возможность пройти стажировку в ведущих IT-компаниях.',
    payment: 'Free',
    userParticipating: true,
    location: 'Москва, Digital October',
    organizer: 'AI Community',
    rating: 4.8,
    invitedUsers: [1, 3, 5]
  },
  {
    id: 8,
    name: 'Выставка современного искусства',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-03-20',
    endDate: '2024-04-20',
    participants: 45,
    maxParticipants: 80,
    status: 'Активное',
    category: 'Искусство',
    description: 'Выставка работ современных российских художников. Инсталляции, картины, скульптуры.',
    fullDescription: 'Выставка представляет работы более 30 современных российских художников, работающих в различных техниках и жанрах. Особое внимание уделяется интерактивным инсталляциям и мультимедийным проектам. В рамках выставки запланированы встречи с художниками и кураторские экскурсии.',
    payment: 'Paid',
    userParticipating: false,
    location: 'Галерея современного искусства, Москва',
    organizer: 'Московская галерея',
    rating: 4.7,
    price: '500 руб'
  },
  {
    id: 9,
    name: 'Воркшоп по цифровому маркетингу',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-03-18',
    endDate: '2024-03-18',
    participants: 32,
    maxParticipants: 50,
    status: 'Активное',
    category: 'Бизнес',
    description: 'Интенсивный воркшоп по digital-маркетингу для предпринимателей и маркетологов.',
    fullDescription: 'Однодневный интенсивный воркшоп, посвященный современным инструментам цифрового маркетинга. В программе: SEO-оптимизация, контекстная реклама, SMM, email-маркетинг, аналитика и автоматизация. Практические кейсы и разбор реальных ситуаций. Каждый участник получит шаблоны и чек-листы для работы.',
    payment: 'Paid',
    userParticipating: false,
    location: 'Бизнес-центр "Город столиц", Москва',
    organizer: 'Digital Marketing Academy',
    rating: 4.5,
    price: '2500 руб'
  },
  {
    id: 10,
    name: 'Кулинарный мастер-класс от шефа',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-03-22',
    endDate: '2024-03-22',
    participants: 18,
    maxParticipants: 25,
    status: 'Активное',
    category: 'Кулинария',
    description: 'Мастер-класс по приготовлению авторских блюд от известного шеф-повара.',
    fullDescription: 'Мастер-класс от шеф-повара ресторана с мишленовской звездой. Участники научатся готовить три авторских блюда: закуску, основное блюдо и десерт. Все ингредиенты предоставляются, каждый участник работает на отдельной кухонной станции. По окончании - дегустация приготовленных блюд с бокалом вина.',
    payment: 'Paid',
    userParticipating: true,
    location: 'Кулинарная студия "Вкусно", Москва',
    organizer: 'Шеф Андрей Иванов',
    rating: 4.9,
    price: '3500 руб'
  },
  {
    id: 11,
    name: 'Фестиваль уличного кино',
    image: 'https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-03-28',
    endDate: '2024-03-30',
    participants: 110,
    maxParticipants: 200,
    status: 'Активное',
    category: 'Кино',
    description: 'Фестиваль короткометражного кино на открытом воздухе. Показы, встречи с режиссерами, дискуссии.',
    fullDescription: 'Трехдневный фестиваль короткометражного кино под открытым небом. В программе: конкурсный показ фильмов, встречи с режиссерами и актерами, дискуссии о современном кино, воркшопы по сценарному мастерству и режиссуре. Вечерние кинопоказы сопровождаются живой музыкой.',
    payment: 'Free',
    userParticipating: false,
    location: 'Парк "Зарядье", Москва',
    organizer: 'Киносообщество Москвы',
    rating: 4.6
  },
  {
    id: 12,
    name: 'Йога-ретрит на природе',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-04-05',
    endDate: '2024-04-07',
    participants: 25,
    maxParticipants: 40,
    status: 'Активное',
    category: 'Здоровье',
    description: 'Выходные на природе с практиками йоги, медитациями и здоровым питанием.',
    fullDescription: 'Йога-ретрит в живописном месте Подмосковья. Программа включает: утренние и вечерние практики йоги, медитации, лекции о здоровом питании и аюрведе, прогулки на природе, баню. Питание - вегетарианское, приготовленное из экологически чистых продуктов. Проживание в комфортных номерах эко-отеля.',
    payment: 'Paid',
    userParticipating: false,
    location: 'Эко-отель "Лесная сказка", Подмосковье',
    organizer: 'Yoga Harmony',
    rating: 4.8,
    price: '8000 руб'
  },
  {
    id: 7,
    name: 'Отклоненное событие',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    participants: 0,
    maxParticipants: 50,
    status: 'Отклоненное',
    category: 'Тестирование',
    description: 'Это событие отклонено и не должно отображаться на вкладках',
    fullDescription: 'Тестовое событие для проверки функционала отклоненных событий.',
    payment: 'Free',
    userParticipating: false,
    location: 'Тестовое место',
    organizer: 'Тестовая организация',
    rating: 0
  }
];

// Mock data for users
const mockUsers: User[] = [
  { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', role: 'user' },
  { id: 2, name: 'Петр Петров', email: 'petr@example.com', role: 'user' },
  { id: 3, name: 'Мария Сидорова', email: 'maria@example.com', role: 'user' },
  { id: 4, name: 'Алексей Козлов', email: 'alex@example.com', role: 'admin' },
  { id: 5, name: 'Елена Новикова', email: 'elena@example.com', role: 'user' },
  { id: 6, name: 'Дмитрий Волков', email: 'dmitry@example.com', role: 'user' },
  { id: 7, name: 'Анна Смирнова', email: 'anna@example.com', role: 'user' },
  { id: 8, name: 'Сергей Попов', email: 'sergey@example.com', role: 'user' },
  { id: 9, name: 'Ольга Морозова', email: 'olga@example.com', role: 'user' },
  { id: 10, name: 'Николай Орлов', email: 'nikolay@example.com', role: 'user' },
];

// Navigation items
const navigationItems: NavItem[] = [
  { id: 'events', name: 'События', icon: <Calendar size={20} /> },
  { id: 'messages', name: 'Сообщения', icon: <MessageSquare size={20} />, badge: 3 },
  { id: 'organizations', name: 'Организации', icon: <Package size={20} /> },
  { id: 'administration', name: 'Администрирование', icon: <Shield size={20} /> },
];

const EventsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('my');
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('events');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  
  // Текущий пользователь (администратор)
  const [currentUser] = useState<User>({
    id: 4,
    name: 'Алексей Петров',
    email: 'admin@example.com',
    role: 'admin'
  });

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
    const interval = setInterval(updateEventStatuses, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Фильтрация событий
  const filteredEvents = events.filter(event => {
    if (event.status === 'Отклоненное' && activeNavItem !== 'administration') {
      return false;
    }
    
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          if (event.maxParticipants && event.participants >= event.maxParticipants) {
            showAlert('Достигнут максимальный лимит участников', 'error');
            return event;
          }
          
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

  // Отправка уведомлений пользователям
  const sendNotifications = async (eventName: string, selectedUsers: number[]) => {
    const selectedUserEmails = mockUsers
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.email);
    
    console.log(`Отправка уведомлений о событии "${eventName}" пользователям:`, selectedUserEmails);
    
    // В реальном приложении здесь был бы API запрос
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return selectedUserEmails;
  };

  // Создание нового события
  const handleCreateEvent = async (formData: any) => {
    setIsLoading(true);
    try {
      // Отправляем уведомления выбранным пользователям
      if (formData.selectedUsers.length > 0) {
        await sendNotifications(formData.name, formData.selectedUsers);
      }
      
      const newEvent: Event = {
        id: events.length + 13,
        name: formData.name,
        image: formData.image,
        startDate: formData.startDate,
        endDate: formData.endDate,
        participants: 0,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : 0,
        status: 'Активное',
        category: formData.category,
        description: formData.shortDescription || formData.fullDescription.substring(0, 100) + '...',
        fullDescription: formData.fullDescription,
        payment: formData.paymentType,
        paymentInfo: formData.paymentInfo,
        userParticipating: false,
        location: formData.location,
        organizer: 'Вы (Администратор)',
        rating: 0,
        price: formData.paymentType === 'Paid' ? formData.price : undefined,
        invitedUsers: formData.selectedUsers
      };
      
      setEvents(prev => [...prev, newEvent]);
      showAlert(`Событие "${formData.name}" успешно создано! Уведомления отправлены ${formData.selectedUsers.length} пользователям.`, 'success');
      setIsCreateModalOpen(false);
      
    } catch (error) {
      console.error('Ошибка при создании события:', error);
      showAlert('Произошла ошибка при создании события. Пожалуйста, попробуйте снова.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Редактирование события
  const handleUpdateEvent = async (formData: any, eventId: number) => {
    setIsLoading(true);
    try {
      // Обновляем статус события на основе даты окончания
      const now = new Date();
      const endDate = new Date(formData.endDate);
      const status = now > endDate ? 'Прошедшее' : 'Активное';
      
      setEvents(prev => prev.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            name: formData.name,
            image: formData.image,
            startDate: formData.startDate,
            endDate: formData.endDate,
            maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : 0,
            status: status,
            category: formData.category,
            description: formData.shortDescription || formData.fullDescription.substring(0, 100) + '...',
            fullDescription: formData.fullDescription,
            payment: formData.paymentType,
            paymentInfo: formData.paymentInfo,
            location: formData.location,
            price: formData.paymentType === 'Paid' ? formData.price : undefined,
            invitedUsers: formData.selectedUsers
          };
        }
        return event;
      }));
      
      showAlert(`Событие "${formData.name}" успешно обновлено!`, 'success');
      setIsEditModalOpen(false);
      setEventToEdit(null);
      
      // Обновляем выбранное событие, если оно было открыто
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(prev => prev ? {
          ...prev,
          name: formData.name,
          image: formData.image,
          startDate: formData.startDate,
          endDate: formData.endDate,
          maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : 0,
          status: status,
          category: formData.category,
          description: formData.shortDescription || formData.fullDescription.substring(0, 100) + '...',
          fullDescription: formData.fullDescription,
          payment: formData.paymentType,
          paymentInfo: formData.paymentInfo,
          location: formData.location,
          price: formData.paymentType === 'Paid' ? formData.price : undefined
        } : null);
      }
      
    } catch (error) {
      console.error('Ошибка при обновлении события:', error);
      showAlert('Произошла ошибка при обновлении события.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Открытие формы редактирования
  const handleEditEvent = (event: Event) => {
    setEventToEdit(event);
    setIsEditModalOpen(true);
    setSelectedEvent(null); // Закрываем модальное окно просмотра
  };

  // Форма создания/редактирования события
  const EventForm = ({ mode, event, onSubmit, onCancel }: {
    mode: 'create' | 'edit';
    event?: Event;
    onSubmit: (formData: any, eventId?: number) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: event?.name || '',
      shortDescription: event?.description || '',
      fullDescription: event?.fullDescription || event?.description || '',
      startDate: event?.startDate || '',
      endDate: event?.endDate || '',
      image: event?.image || '',
      paymentInfo: event?.paymentInfo || '',
      maxParticipants: event?.maxParticipants?.toString() || '',
      category: event?.category || '',
      location: event?.location || '',
      price: event?.price || '',
      paymentType: event?.payment || 'Free' as 'Free' | 'Paid',
      selectedUsers: event?.invitedUsers || [] as number[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = ['Технологии', 'Искусство', 'Спорт', 'Бизнес', 'Музыка', 'Кулинария', 'Кино', 'Здоровье', 'Образование', 'Наука', 'Другое'];

    const validateForm = () => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.name.trim()) {
        newErrors.name = 'Название обязательно';
      }
      
      if (!formData.fullDescription.trim()) {
        newErrors.fullDescription = 'Полное описание обязательно';
      }
      
      if (!formData.startDate) {
        newErrors.startDate = 'Дата начала обязательна';
      } else if (new Date(formData.startDate) < new Date()) {
        newErrors.startDate = 'Дата начала должна быть в будущем';
      }
      
      if (!formData.endDate) {
        newErrors.endDate = 'Дата окончания обязательна';
      } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
        newErrors.endDate = 'Дата окончания должна быть позже даты начала';
      }
      
      if (!formData.image.trim()) {
        newErrors.image = 'Изображение обязательно';
      }
      
      if (formData.maxParticipants && parseInt(formData.maxParticipants) < 1) {
        newErrors.maxParticipants = 'Количество участников должно быть положительным';
      }
      
      if (!formData.location.trim()) {
        newErrors.location = 'Место проведения обязательно';
      }
      
      if (!formData.category.trim()) {
        newErrors.category = 'Категория обязательна';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    const handleUserSelection = (userId: number) => {
      setFormData(prev => {
        const isSelected = prev.selectedUsers.includes(userId);
        return {
          ...prev,
          selectedUsers: isSelected
            ? prev.selectedUsers.filter(id => id !== userId)
            : [...prev.selectedUsers, userId]
        };
      });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validateForm()) {
        return;
      }
      
      setIsSubmitting(true);
      try {
        if (mode === 'create') {
          await onSubmit(formData);
        } else {
          await onSubmit(formData, event?.id);
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="event-modal create-event-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'create' ? 'Создание нового события' : 'Редактирование события'}</h2>
          <button 
            className="modal-close" 
            onClick={onCancel}
            disabled={isSubmitting}
            title="Закрыть"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name" className="required">
                  Название события
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Введите название события"
                  className={errors.name ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="shortDescription">
                  Краткое описание (для всплывающей подсказки)
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Краткое описание, которое будет отображаться при наведении"
                  rows={2}
                  disabled={isSubmitting}
                />
                <small>Необязательное поле</small>
              </div>

              <div className="form-group full-width">
                <label htmlFor="fullDescription" className="required">
                  Полное описание
                </label>
                <textarea
                  id="fullDescription"
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  placeholder="Подробное описание события"
                  rows={4}
                  className={errors.fullDescription ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.fullDescription && <span className="error-message">{errors.fullDescription}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="startDate" className="required">
                  Дата начала
                </label>
                <div className="input-with-icon">
                  <Calendar size={16} />
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={errors.startDate ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="endDate" className="required">
                  Дата окончания
                </label>
                <div className="input-with-icon">
                  <Calendar size={16} />
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className={errors.endDate ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.endDate && <span className="error-message">{errors.endDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="location" className="required">
                  Место проведения
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Город, адрес или онлайн"
                  className={errors.location ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.location && <span className="error-message">{errors.location}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category" className="required">
                  Категория
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                  disabled={isSubmitting}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="image" className="required">
                  Изображение (URL)
                </label>
                <div className="input-with-icon">
                  <Search size={16} />
                  <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className={errors.image ? 'error' : ''}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.image && <span className="error-message">{errors.image}</span>}
                {formData.image && (
                  <div className="image-preview">
                    <img src={formData.image} alt="Предпросмотр" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Тип оплаты</label>
                <div className="payment-type-selector">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentType"
                      value="Free"
                      checked={formData.paymentType === 'Free'}
                      onChange={() => setFormData(prev => ({ ...prev, paymentType: 'Free' }))}
                      disabled={isSubmitting}
                    />
                    <span>Бесплатно</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentType"
                      value="Paid"
                      checked={formData.paymentType === 'Paid'}
                      onChange={() => setFormData(prev => ({ ...prev, paymentType: 'Paid' }))}
                      disabled={isSubmitting}
                    />
                    <span>Платно</span>
                  </label>
                </div>
              </div>

              {formData.paymentType === 'Paid' && (
                <div className="form-group">
                  <label htmlFor="price">
                    Цена
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="1000 руб"
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="maxParticipants">
                  Максимальное количество участников
                </label>
                <input
                  type="number"
                  id="maxParticipants"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  placeholder="Оставьте пустым для неограниченного"
                  min="1"
                  className={errors.maxParticipants ? 'error' : ''}
                  disabled={isSubmitting}
                />
                {errors.maxParticipants && <span className="error-message">{errors.maxParticipants}</span>}
                <small>Необязательное поле</small>
              </div>

              <div className="form-group full-width">
                <label htmlFor="paymentInfo">
                  Информация об оплате
                </label>
                <textarea
                  id="paymentInfo"
                  name="paymentInfo"
                  value={formData.paymentInfo}
                  onChange={handleChange}
                  placeholder="Опишите процесс оплаты, реквизиты и т.д."
                  rows={3}
                  disabled={isSubmitting}
                />
                <small>
                  Пример: "Сегодня у Синельникова Станислава день рождения, собираем ему на подарок. Можно перевести на ВТБ (200р) по номеру 89185123076. В переводе прошу указать свое ФИО и подтвердить участие."
                </small>
              </div>

              <div className="form-group full-width">
                <label htmlFor="users">
                  Пригласить пользователей
                </label>
                <div className="users-selection">
                  <div className="users-list">
                    {mockUsers
                      .filter(user => user.id !== currentUser.id)
                      .map(user => (
                        <label key={user.id} className="user-checkbox">
                          <input
                            type="checkbox"
                            checked={formData.selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelection(user.id)}
                            disabled={isSubmitting}
                          />
                          <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-email">{user.email}</span>
                          </div>
                        </label>
                      ))}
                  </div>
                  <div className="selected-count">
                    Выбрано: {formData.selectedUsers.length} пользователей
                  </div>
                </div>
                <small>
                  Выбранные пользователи получат уведомление о событии на почту
                </small>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size={18} className="spin" />
                    <span>{mode === 'create' ? 'Создание...' : 'Сохранение...'}</span>
                  </>
                ) : (
                  mode === 'create' ? 'Создать событие' : 'Сохранить изменения'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
              <div className="user-name">{currentUser.name}</div>
              <div className="user-role">{currentUser.role === 'admin' ? 'Администратор' : 'Участник'}</div>
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
              {['Технологии', 'Искусство', 'Спорт', 'Бизнес', 'Музыка', 'Кулинария', 'Кино', 'Здоровье'].map(category => (
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
              
              {/* Кнопка создания события показывается только администраторам */}
              {currentUser.role === 'admin' && (
                <button 
                  className="btn-primary" 
                  onClick={() => setIsCreateModalOpen(true)}
                  title="Создать новое событие"
                >
                  <Plus size={18} />
                  <span>Создать событие</span>
                </button>
              )}
              
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
                    <p>{selectedEvent.fullDescription || selectedEvent.description}</p>
                  </div>
                  
                  {selectedEvent.paymentInfo && (
                    <div className="payment-info">
                      <h3>Информация об оплате</h3>
                      <p>{selectedEvent.paymentInfo}</p>
                    </div>
                  )}
                  
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
                      
                      {/* Кнопка редактирования для администратора */}
                      {currentUser.role === 'admin' && (
                        <button 
                          className="btn-secondary"
                          onClick={() => handleEditEvent(selectedEvent)}
                          title="Редактировать событие"
                        >
                          <Edit size={18} />
                          <span>Редактировать</span>
                        </button>
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

      {/* Модальное окно создания события */}
      {isCreateModalOpen && (
        <div className="modal-overlay" onClick={() => !isLoading && setIsCreateModalOpen(false)}>
          <EventForm
            mode="create"
            onSubmit={handleCreateEvent}
            onCancel={() => !isLoading && setIsCreateModalOpen(false)}
          />
        </div>
      )}

      {/* Модальное окно редактирования события */}
      {isEditModalOpen && eventToEdit && (
        <div className="modal-overlay" onClick={() => !isLoading && setIsEditModalOpen(false)}>
          <EventForm
            mode="edit"
            event={eventToEdit}
            onSubmit={(formData) => handleUpdateEvent(formData, eventToEdit.id)}
            onCancel={() => !isLoading && setIsEditModalOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

export default EventsPage;