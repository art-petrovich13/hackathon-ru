import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { register } from '../../../../utils/api';
import styles from '../../Authorization.module.scss';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setLoading(true);

    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      if (response.success) {
        // Регистрация успешна, переходим к подтверждению email
        navigate('/verify-email', { state: { email: email.trim() } });
      }
    } catch (err: any) {
      console.error('Register error:', err);
      if (err.errors) {
        setErrors(err.errors);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при регистрации');
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
            <UserPlus size={32} />
          </div>
          <h1 className={styles.title}>Создать аккаунт</h1>
          <p className={styles.subtitle}>Зарегистрируйтесь для доступа к системе</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>
              <User size={18} />
              <span>ФИО (только русские буквы)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Иванов Иван Иванович"
              required
              pattern="[А-Яа-яЁё\s]+"
              title="Только русские буквы и пробелы"
            />
            {errors.name && <div className={styles.error}>{errors.name[0]}</div>}
          </div>

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
            {errors.email && <div className={styles.error}>{errors.email[0]}</div>}
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
            {errors.password && <div className={styles.error}>{errors.password[0]}</div>}
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
            {errors.password_confirmation && (
              <div className={styles.error}>{errors.password_confirmation[0]}</div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? <div className={styles.spinner}></div> : 'Зарегистрироваться'}
          </button>
        </form>

        <div className={styles.switchMode}>
          <span>Уже есть аккаунт?</span>
          <Link to="/login" className={styles.switchButton}>
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}