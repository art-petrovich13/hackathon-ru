import React, { useState, useEffect } from 'react';
import { Edit, X, Calendar, Upload, Users, DollarSign, Loader, Save } from 'lucide-react';
import './EditButton.scss';

interface EditEventButtonProps {
  event: any;
  onEventUpdated: (updatedEvent: any) => void;
  users: User[];
}

const EditEventButton: React.FC<EditEventButtonProps> = ({ event, onEventUpdated, users }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  // Инициализация формы данными события
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        shortDescription: event.description || '',
        fullDescription: event.fullDescription || event.description || '',
        startDate: event.startDate || '',
        endDate: event.endDate || '',
        image: event.image || '',
        paymentInfo: event.paymentInfo || '',
        maxParticipants: event.maxParticipants ? event.maxParticipants.toString() : '',
        category: event.category || '',
        location: event.location || '',
        price: event.price || '',
        paymentType: event.payment || 'Free',
        selectedUsers: event.invitedUsers || []
      });
    }
  }, [event]);

  // Валидация формы (аналогично CreateEventButton)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Обновляем статус события на основе даты окончания
      const now = new Date();
      const endDate = new Date(formData.endDate);
      const status = now > endDate ? 'Прошедшее' : 'Активное';
      
      const updatedEvent = {
        ...event,
        name: formData.name,
        description: formData.shortDescription,
        fullDescription: formData.fullDescription,
        startDate: formData.startDate,
        endDate: formData.endDate,
        image: formData.image,
        paymentInfo: formData.paymentInfo,
        maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : 0,
        category: formData.category,
        location: formData.location,
        payment: formData.paymentType,
        price: formData.paymentType === 'Paid' ? formData.price : undefined,
        status: status,
        invitedUsers: formData.selectedUsers
      };
      
      onEventUpdated(updatedEvent);
      alert(`Событие "${formData.name}" успешно обновлено!`);
      setIsOpen(false);
      
    } catch (error) {
      console.error('Ошибка при обновлении события:', error);
      alert('Произошла ошибка при обновлении события.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // В модальном окне события добавим кнопку редактирования для администраторов
  return (
    <>
      {currentUser.role === 'admin' && (
        <button 
          className="btn-secondary"
          onClick={() => setIsOpen(true)}
          title="Редактировать событие"
        >
          <Edit size={18} />
          <span>Редактировать</span>
        </button>
      )}
      
      {isOpen && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setIsOpen(false)}>
          <div className="event-modal create-event-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Редактирование события</h2>
              <button 
                className="modal-close" 
                onClick={() => !isSubmitting && setIsOpen(false)}
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              {/* Та же форма, что и в CreateEventButton, но с текущими значениями */}
              <form onSubmit={handleSubmit}>
                {/* ... форма редактирования ... */}
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
                        <span>Сохранение...</span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Сохранить изменения</span>
                      </>
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

export default EditEventButton;