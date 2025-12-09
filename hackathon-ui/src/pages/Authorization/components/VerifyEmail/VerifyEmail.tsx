import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck } from 'lucide-react';
import { verifyEmail, resendVerification } from '../../../../utils/api';
import styles from '../../Authorization.module.scss';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || '';
  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await verifyEmail({ email: email.trim(), code });
      if (response.success) {
        // Сохраняем токен
        localStorage.setItem('token', response.data.token);
        setMessage('Регистрация успешно завершена!');
        // Переходим на страницу событий через 2 секунды
        setTimeout(() => {
          navigate('/events');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Verify email error:', err);
      if (err.message) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при подтверждении email');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError('');
    setMessage('');

    try {
      const response = await resendVerification({ email: email.trim() });
      if (response.success) {
        setMessage('Новый код отправлен на ваш email');
      }
    } catch (err: any) {
      console.error('Resend verification error:', err);
      if (err.message) {
        setError(err.message);
      } else {
        setError('Не удалось отправить код');
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>

      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.iconWrapper}>
            <ShieldCheck size={32} />
          </div>
          <h1 className={styles.title}>Подтверждение email</h1>
          <p className={styles.subtitle}>
            Введите код подтверждения, отправленный на вашу почту
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <ShieldCheck size={18} />
              <span>Код подтверждения</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={styles.input}
              placeholder="123456"
              required
              maxLength={6}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.message}>{message}</div>}

          <div className={styles.resendCode}>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className={styles.resendButton}
            >
              {resending ? 'Отправка...' : 'Отправить код повторно'}
            </button>
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? <div className={styles.spinner}></div> : 'Подтвердить'}
          </button>
        </form>
      </div>
    </div>
  );
}