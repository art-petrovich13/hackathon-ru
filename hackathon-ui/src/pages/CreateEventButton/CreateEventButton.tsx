import React, { useState } from 'react';
import { Plus, X, Calendar, Upload, Users, DollarSign, Loader } from 'lucide-react';
import '../EventsPage.scss';

interface CreateEventButtonProps {
  onEventCreated: (event: any) => void;
  users: User[];
}

const CreateEventButton: React.FC<CreateEventButtonProps> = ({ onEventCreated, users }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Состояния формы
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    startDate: '',
    endDate: '',
    image: '',
    paymentInfo: '',
    maxParticipants: '',
    category: '',
    location: '',
    price: '',
    paymentType: 'Free' as 'Free' | 'Paid',
    selectedUsers: [] as number[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Валидация формы
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

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Обработчик выбора пользователей
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

  // Отправка уведомлений пользователям (симуляция)
  const sendNotifications = async (eventName: string, selectedUsers: number[]) => {
    const selectedUserEmails = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.email);
    
    console.log(`Отправка уведомлений о событии "${eventName}" пользователям:`, selectedUserEmails);
    
    // В реальном приложении здесь был бы API запрос
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return selectedUserEmails;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Отправляем уведомления выбранным пользователям
      if (formData.selectedUsers.length > 0) {
        await sendNotifications(formData.name, formData.selectedUsers);
      }
      
      // Создаем новое событие
      const newEvent = {
        id: Date.now(), // В реальном приложении id генерировался бы на сервере
        name: formData.name,
        image: formData.image,
        startDate: formData.startDate,
        endDate: formData.endDate,
        participants: 0,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : 0,
        status: 'Активное' as const,
        category: formData.category,
        description: formData.shortDescription,
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
      
      // Вызываем callback для добавления события
      onEventCreated(newEvent);
      
      // Показываем уведомление об успехе
      alert(`Событие "${formData.name}" успешно создано! Уведомления отправлены ${formData.selectedUsers.length} пользователям.`);
      
      // Закрываем модальное окно и сбрасываем форму
      setIsOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('Ошибка при создании события:', error);
      alert('Произошла ошибка при создании события. Пожалуйста, попробуйте снова.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Сброс формы
  const resetForm = () => {
    setFormData({
      name: '',
      shortDescription: '',
      fullDescription: '',
      startDate: '',
      endDate: '',
      image: '',
      paymentInfo: '',
      maxParticipants: '',
      category: '',
      location: '',
      price: '',
      paymentType: 'Free',
      selectedUsers: []
    });
    setErrors({});
  };

  // Категории для выбора
  const categories = ['Технологии', 'Искусство', 'Спорт', 'Бизнес', 'Музыка', 'Кулинария', 'Кино', 'Здоровье', 'Образование', 'Наука'];

  return (
    <>
      {/* Кнопка создания события - показывается только администраторам */}
      <button 
        className="btn-primary" 
        onClick={() => setIsOpen(true)}
        title="Создать новое событие"
      >
        <Plus size={18} />
        <span>Создать событие</span>
      </button>

      {/* Модальное окно создания события */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setIsOpen(false)}>
          <div className="event-modal create-event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Создание нового события</h2>
              <button 
                className="modal-close" 
                onClick={() => !isSubmitting && setIsOpen(false)}
                disabled={isSubmitting}
                title="Закрыть"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Название события */}
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

                  {/* Краткое описание */}
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

                  {/* Полное описание */}
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

                  {/* Даты начала и окончания */}
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

                  {/* Место проведения */}
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

                  {/* Категория */}
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

                  {/* Изображение */}
                  <div className="form-group full-width">
                    <label htmlFor="image" className="required">
                      Изображение (URL)
                    </label>
                    <div className="input-with-icon">
                      <Upload size={16} />
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

                  {/* Тип оплаты */}
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

                  {/* Цена (только для платных событий) */}
                  {formData.paymentType === 'Paid' && (
                    <div className="form-group">
                      <label htmlFor="price">
                        Цена
                      </label>
                      <div className="input-with-icon">
                        <DollarSign size={16} />
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
                    </div>
                  )}

                  {/* Максимальное количество участников */}
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

                  {/* Информация об оплате */}
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

                  {/* Выбор пользователей */}
                  <div className="form-group full-width">
                    <label htmlFor="users">
                      Пригласить пользователей
                    </label>
                    <div className="users-selection">
                      <div className="users-list">
                        {users.map(user => (
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
                    onClick={() => !isSubmitting && setIsOpen(false)}
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
                        <span>Создание...</span>
                      </>
                    ) : (
                      'Создать событие'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateEventButton;