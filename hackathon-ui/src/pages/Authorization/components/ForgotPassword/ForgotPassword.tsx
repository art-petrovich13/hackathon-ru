import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { forgotPassword } from '../../../../utils/api';
import styles from '../../Authorization.module.scss';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await forgotPassword({ email: email.trim() });
      if (response.success) {
        setMessage('Инструкции по сбросу пароля отправлены на ваш email');
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      if (err.errors?.email) {
        setError(err.errors.email[0]);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при запросе сброса пароля');
      }
    } finally {
      setLoading(false);
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
            <Mail size={32} />
          </div>
          <h1 className={styles.title}>Восстановление пароля</h1>
          <p className={styles.subtitle}>
            Введите ваш email, и мы отправим инструкции по сбросу пароля
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

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.message}>{message}</div>}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? <div className={styles.spinner}></div> : 'Отправить инструкции'}
          </button>

          <div className={styles.backToLogin}>
            <Link to="/login" className={styles.backLink}>
              <ArrowLeft size={16} />
              Назад к входу
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}