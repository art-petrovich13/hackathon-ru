import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../../../../utils/api';
import styles from '../../Authorization.module.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // В обработчике handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await login({ email: email.trim(), password });
    if (response.success && response.data?.token) {
      // Сохраняем токен
      localStorage.setItem('token', response.data.token);
      
      // Сохраняем информацию о пользователе
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Переходим на страницу событий
      navigate('/events');
    } else {
      setError(response.error || 'Ошибка при входе');
    }
  } catch (err: any) {
    console.error('Login error:', err);
    if (err.error === 'Email не подтвержден') {
      // Перенаправляем на страницу подтверждения email
      navigate('/verify-email', { state: { email: email.trim() } });
    } else if (err.message) {
      setError(err.message);
    } else {
      setError('Произошла ошибка при входе');
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
            <LogIn size={32} />
          </div>
          <h1 className={styles.title}>Добро пожаловать</h1>
          <p className={styles.subtitle}>Войдите в свой аккаунт для продолжения</p>
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
              <Lock size={18} />
              <span>Пароль</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.forgotPassword}>
            <Link to="/forgot-password" className={styles.forgotPasswordLink}>
              Забыли пароль?
            </Link>
          </div>

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? <div className={styles.spinner}></div> : 'Войти'}
          </button>
        </form>

        <div className={styles.switchMode}>
          <span>Нет аккаунта?</span>
          <Link to="/register" className={styles.switchButton}>
            Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}