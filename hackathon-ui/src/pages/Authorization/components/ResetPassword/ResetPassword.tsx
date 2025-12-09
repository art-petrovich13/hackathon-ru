import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { checkResetToken, resetPassword } from '../../../../utils/api';
import styles from '../../Authorization.module.scss';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');

    if (!emailParam || !tokenParam) {
      setError('Неверная ссылка для сброса пароля');
      setCheckingToken(false);
      return;
    }

    setEmail(emailParam);
    setToken(tokenParam);

    const checkToken = async () => {
      try {
        const response = await checkResetToken({ email: emailParam, token: tokenParam });
        if (response.success) {
          setMessage('Токен действителен. Установите новый пароль.');
        }
      } catch (err: any) {
        console.error('Check token error:', err);
        if (err.message) {
          setError(err.message);
        } else {
          setError('Токен недействителен или истек');
        }
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      if (response.success) {
        setMessage('Пароль успешно изменен. Перенаправление на страницу входа...');
        // Переходим на страницу входа через 3 секунды
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Reset password error:', err);
      if (err.errors) {
        // Обработка ошибок валидации
        const errorMessages = Object.values(err.errors).flat();
        setError(errorMessages.join(', '));
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при сбросе пароля');
      }
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
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
            <h1 className={styles.title}>Проверка токена</h1>
            <p className={styles.subtitle}>Пожалуйста, подождите...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <Lock size={32} />
          </div>
          <h1 className={styles.title}>Новый пароль</h1>
          <p className={styles.subtitle}>Введите новый пароль для вашего аккаунта</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <Lock size={18} />
              <span>Новый пароль</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
                minLength={8}
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

          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <Lock size={18} />
              <span>Подтверждение пароля</span>
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPasswordConfirmation ? 'text' : 'password'}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={styles.input}
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                className={styles.passwordToggle}
              >
                {showPasswordConfirmation ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          {message && <div className={styles.message}>{message}</div>}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? <div className={styles.spinner}></div> : 'Изменить пароль'}
          </button>
        </form>
      </div>
    </div>
  );
}