<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\EmailVerification;
use App\Mail\EmailVerificationMail;
use App\Mail\WelcomeMail;
use App\Mail\PasswordResetMail;
use App\Mail\PasswordResetSuccessMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    /**
     * Регистрация нового пользователя
     */
    public function register(Request $request)
    {
        try {
            // 1. Валидация данных
            $validator = Validator::make($request->all(), [
                'name' => 'required|regex:/^[А-Яа-яЁёA-Za-z\s\-]+$/u',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/',
                'password_confirmation' => 'required|same:password',
            ], [
                'name.required' => 'ФИО обязательно для заполнения',
                'name.regex' => 'ФИО может содержать только буквы, пробелы и дефисы',
                'email.required' => 'Email обязателен для заполнения',
                'email.email' => 'Введите корректный email адрес',
                'email.unique' => 'Этот email уже зарегистрирован',
                'password.required' => 'Пароль обязателен для заполнения',
                'password.min' => 'Пароль должен содержать минимум 8 символов',
                'password.regex' => 'Пароль должен содержать минимум одну заглавную букву, одну строчную, одну цифру и один специальный символ (@$!%*?&)',
                'password_confirmation.required' => 'Подтверждение пароля обязательно',
                'password_confirmation.same' => 'Пароли не совпадают',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // 2. Проверяем, нет ли активного кода для этого email
            $existingVerification = EmailVerification::where('email', $request->email)
                ->where('expires_at', '>', now())
                ->first();

            if ($existingVerification) {
                // Если код уже есть, удаляем старый
                $existingVerification->delete();
            }

            // 3. Генерация кода подтверждения
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // 4. Сохраняем код в email_verifications
            $verification = EmailVerification::create([
                'email' => $request->email,
                'code' => $code,
                'expires_at' => now()->addHours(24),
            ]);

            // 5. Сохраняем данные пользователя во временном кэше для подтверждения
            $registrationData = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
            ];
            
            // Сохраняем данные на 30 минут
            Cache::put('registration_' . $request->email, $registrationData, now()->addMinutes(30));

            // 6. Отправляем письмо с кодом
            try {
                Mail::to($request->email)->send(new EmailVerificationMail($code, $request->name));
                
                Log::info('Письмо с кодом подтверждения отправлено на ' . $request->email, [
                    'email' => $request->email,
                    'code' => $code
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Код подтверждения отправлен на ваш email',
                    'data' => [
                        'email' => $request->email,
                        'expires_at' => $verification->expires_at->format('Y-m-d H:i:s'),
                    ]
                ], 201);
                
            } catch (\Exception $mailException) {
                // Если не удалось отправить письмо, удаляем созданную запись
                $verification->delete();
                Cache::forget('registration_' . $request->email);
                
                Log::error('Ошибка отправки email подтверждения: ' . $mailException->getMessage(), [
                    'email' => $request->email,
                    'exception' => $mailException
                ]);
                
                return response()->json([
                    'success' => false,
                    'error' => 'Не удалось отправить письмо с подтверждением',
                    'message' => 'Пожалуйста, проверьте правильность email адреса'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Ошибка при регистрации: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при регистрации',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }

    /**
     * Подтверждение email
     */
    public function verifyEmail(Request $request)
    {
        try {
            // 1. Валидация
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'code' => 'required|digits:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // 2. Находим запись о верификации
            $verification = EmailVerification::where('email', $request->email)
                ->where('code', $request->code)
                ->where('expires_at', '>', now())
                ->first();

            if (!$verification) {
                return response()->json([
                    'success' => false,
                    'error' => 'Неверный или просроченный код подтверждения',
                    'message' => 'Проверьте правильность кода или запросите новый'
                ], 400);
            }

            // 3. Получаем данные регистрации из кэша
            $registrationData = Cache::get('registration_' . $request->email);
            
            if (!$registrationData) {
                $verification->delete();
                return response()->json([
                    'success' => false,
                    'error' => 'Данные регистрации устарели',
                    'message' => 'Пожалуйста, начните регистрацию заново'
                ], 400);
            }

            // 4. Проверяем, не зарегистрирован ли уже email
            if (User::where('email', $request->email)->exists()) {
                $verification->delete();
                Cache::forget('registration_' . $request->email);
                return response()->json([
                    'success' => false,
                    'error' => 'Этот email уже зарегистрирован',
                    'message' => 'Попробуйте войти в систему'
                ], 400);
            }

            // 5. Создаем пользователя
            $user = User::create([
                'name' => $registrationData['name'],
                'email' => $registrationData['email'],
                'password' => Hash::make($registrationData['password']),
                'role' => 'user',
                'email_verified_at' => now(),
                'status' => 'active',
            ]);

            // 6. Удаляем использованный код и данные из кэша
            $verification->delete();
            Cache::forget('registration_' . $request->email);

            // 7. Создаем токен для автоматической авторизации
            $token = $user->createToken('auth-token')->plainTextToken;

            // 8. Отправляем приветственное письмо
            try {
                Mail::to($user->email)->send(new WelcomeMail($user));
                Log::info('Приветственное письмо отправлено на ' . $user->email);
            } catch (\Exception $mailException) {
                Log::error('Ошибка отправки приветственного письма: ' . $mailException->getMessage());
                // Не прерываем процесс, если не удалось отправить приветственное письмо
            }

            Log::info('Пользователь успешно зарегистрирован', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Регистрация успешно завершена!',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'token' => $token,
                    'token_type' => 'Bearer',
                    'expires_in' => config('sanctum.expiration') ? config('sanctum.expiration') * 60 : null,
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error('Ошибка при подтверждении email: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при подтверждении email',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }

    /**
     * Запрос на сброс пароля
     */
    public function forgotPassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
            ], [
                'email.exists' => 'Пользователь с таким email не найден'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Получаем пользователя для имени
            $user = User::where('email', $request->email)->first();
            
            // Проверяем, не слишком ли часто запрашивается сброс
            $resetAttempts = Cache::get('password_reset_attempts_' . $request->email, 0);
            
            if ($resetAttempts >= 5) {
                Log::warning('Превышен лимит запросов на сброс пароля', [
                    'email' => $request->email,
                    'attempts' => $resetAttempts
                ]);
                
                return response()->json([
                    'success' => false,
                    'error' => 'Слишком много попыток',
                    'message' => 'Попробуйте позже через 1 час'
                ], 429);
            }

            // Увеличиваем счетчик попыток
            Cache::put('password_reset_attempts_' . $request->email, $resetAttempts + 1, now()->addHour());

            // Генерируем токен для сброса пароля
            $token = Str::random(64);
            
            // Сохраняем в таблицу password_resets
            DB::table('password_resets')->updateOrInsert(
                ['email' => $request->email],
                [
                    'token' => Hash::make($token),
                    'expires_at' => now()->addHours(1),
                    'created_at' => now()
                ]
            );

            // Отправляем письмо с токеном
            try {
                Mail::to($request->email)->send(new PasswordResetMail($token, $request->email, $user->name));
                
                Log::info('Письмо для сброса пароля отправлено на ' . $request->email, [
                    'email' => $request->email,
                    'user_id' => $user->id,
                    'token_hash' => Hash::make($token)
                ]);
                
                $response = [
                    'success' => true,
                    'message' => 'Инструкции по сбросу пароля отправлены на ваш email',
                    'data' => [
                        'email' => $request->email,
                        'expires_at' => now()->addHours(1)->format('Y-m-d H:i:s'),
                    ]
                ];

                // В режиме разработки возвращаем токен для тестирования
                if (config('app.env') === 'local' || config('app.debug')) {
                    $response['data']['test_token'] = $token;
                }

                return response()->json($response, 200);
                
            } catch (\Exception $mailException) {
                Log::error('Ошибка отправки письма для сброса пароля: ' . $mailException->getMessage(), [
                    'email' => $request->email,
                    'exception' => $mailException
                ]);
                
                // Удаляем запись о токене, если не удалось отправить письмо
                DB::table('password_resets')->where('email', $request->email)->delete();
                
                return response()->json([
                    'success' => false,
                    'error' => 'Не удалось отправить письмо для сброса пароля',
                    'message' => 'Пожалуйста, попробуйте позже'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Ошибка при запросе сброса пароля: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при запросе сброса пароля'
            ], 500);
        }
    }

    /**
     * Проверка токена для сброса пароля
     */
    public function checkResetToken(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'token' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $passwordReset = DB::table('password_resets')
                ->where('email', $request->email)
                ->first();

            if (!$passwordReset) {
                return response()->json([
                    'success' => false,
                    'error' => 'Токен не найден',
                    'message' => 'Запросите новый токен для сброса пароля'
                ], 400);
            }

            if (!Hash::check($request->token, $passwordReset->token)) {
                Log::warning('Неверный токен для сброса пароля', [
                    'email' => $request->email,
                    'provided_token' => $request->token
                ]);
                
                return response()->json([
                    'success' => false,
                    'error' => 'Неверный токен'
                ], 400);
            }

            if (now()->gt($passwordReset->expires_at)) {
                DB::table('password_resets')->where('email', $request->email)->delete();
                
                Log::info('Токен для сброса пароля истек', [
                    'email' => $request->email
                ]);
                
                return response()->json([
                    'success' => false,
                    'error' => 'Срок действия токена истек',
                    'message' => 'Запросите новый токен для сброса пароля'
                ], 400);
            }

            // Рассчитываем оставшееся время в минутах
            $remainingMinutes = now()->diffInMinutes($passwordReset->expires_at, false);
            $isValid = $remainingMinutes > 0;

            Log::info('Токен для сброса пароля проверен', [
                'email' => $request->email,
                'is_valid' => $isValid,
                'remaining_minutes' => $remainingMinutes
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Токен действителен',
                'data' => [
                    'email' => $request->email,
                    'is_valid' => $isValid,
                    'expires_at' => $passwordReset->expires_at->format('Y-m-d H:i:s'),
                    'remaining_minutes' => max(0, $remainingMinutes),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Ошибка при проверке токена: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при проверке токена'
            ], 500);
        }
    }

    /**
     * Сброс пароля
     */
    public function resetPassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
                'token' => 'required',
                'password' => 'required|min:8|confirmed',
            ], [
                'email.exists' => 'Пользователь с таким email не найден',
                'password.min' => 'Пароль должен содержать минимум 8 символов',
                'password.confirmed' => 'Пароли не совпадают',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Находим запись о сбросе пароля
            $passwordReset = DB::table('password_resets')
                ->where('email', $request->email)
                ->first();

            if (!$passwordReset) {
                return response()->json([
                    'success' => false,
                    'error' => 'Токен не найден',
                    'message' => 'Запросите новый токен для сброса пароля'
                ], 400);
            }

            if (!Hash::check($request->token, $passwordReset->token)) {
                Log::warning('Неверный токен при попытке сброса пароля', [
                    'email' => $request->email
                ]);
                
                return response()->json([
                    'success' => false,
                    'error' => 'Неверный токен'
                ], 400);
            }

            // Проверяем, не истек ли срок действия токена
            if (now()->gt($passwordReset->expires_at)) {
                DB::table('password_resets')->where('email', $request->email)->delete();
                
                return response()->json([
                    'success' => false,
                    'error' => 'Срок действия токена истек',
                    'message' => 'Запросите новый токен для сброса пароля'
                ], 400);
            }

            // Обновляем пароль пользователя
            $user = User::where('email', $request->email)->first();
            $oldPasswordHash = $user->password; // Для логирования (только хеш)
            
            $user->password = Hash::make($request->password);
            $user->save();

            // Логируем смену пароля
            Log::info('Пароль пользователя изменен', [
                'user_id' => $user->id,
                'email' => $user->email,
                'old_password_hash' => substr($oldPasswordHash, 0, 20) . '...', // Только часть для логирования
                'new_password_hash' => substr($user->password, 0, 20) . '...',
                'changed_at' => now(),
                'ip_address' => $request->ip()
            ]);

            // Удаляем токен и сбрасываем счетчик попыток
            DB::table('password_resets')->where('email', $request->email)->delete();
            Cache::forget('password_reset_attempts_' . $request->email);

            // Отправляем уведомление об успешном сбросе пароля
            try {
                Mail::to($user->email)->send(new PasswordResetSuccessMail($user));
                Log::info('Письмо об успешном сбросе пароля отправлено на ' . $user->email);
            } catch (\Exception $mailException) {
                Log::error('Ошибка отправки письма об успешном сбросе пароля: ' . $mailException->getMessage());
                // Не прерываем выполнение
            }

            // Уведомляем пользователя о смене пароля (можно отправлять в другие системы)
            $this->notifyPasswordChange($user, $request->ip());

            return response()->json([
                'success' => true,
                'message' => 'Пароль успешно изменен',
                'data' => [
                    'email' => $user->email,
                    'changed_at' => now()->format('Y-m-d H:i:s'),
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Ошибка при сбросе пароля: ' . $e->getMessage(), [
                'request_data' => $request->except(['password', 'password_confirmation']),
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при сбросе пароля'
            ], 500);
        }
    }

    /**
     * Вспомогательный метод для уведомления о смене пароля
     */
    private function notifyPasswordChange($user, $ipAddress)
    {
        // Здесь можно добавить дополнительную логику:
        // - Отправка уведомлений в Slack/Telegram
        // - Запись в отдельную таблицу аудита
        // - Отправка SMS уведомления
        
        try {
            // Пример: запись в таблицу аудита безопасности
            DB::table('security_audit_log')->insert([
                'user_id' => $user->id,
                'action' => 'password_reset',
                'ip_address' => $ipAddress,
                'user_agent' => request()->userAgent(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            Log::info('Аудит безопасности: пароль изменен', [
                'user_id' => $user->id,
                'action' => 'password_reset',
                'ip' => $ipAddress
            ]);
            
        } catch (\Exception $e) {
            Log::warning('Не удалось записать в аудит безопасности: ' . $e->getMessage());
        }
    }

    /**
     * Повторная отправка кода подтверждения
     */
    public function resendVerificationCode(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            // Проверяем, есть ли данные регистрации в кэше
            $registrationData = Cache::get('registration_' . $request->email);
            
            if (!$registrationData) {
                return response()->json([
                    'success' => false,
                    'error' => 'Данные регистрации не найдены',
                    'message' => 'Пожалуйста, начните регистрацию заново'
                ], 400);
            }

            // Удаляем старый код, если есть
            EmailVerification::where('email', $request->email)->delete();

            // Генерируем новый код
            $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            $verification = EmailVerification::create([
                'email' => $request->email,
                'code' => $code,
                'expires_at' => now()->addHours(24),
            ]);

            // Отправляем письмо с новым кодом
            try {
                Mail::to($request->email)->send(new EmailVerificationMail($code, $registrationData['name']));
                
                Log::info('Повторная отправка кода подтверждения на ' . $request->email, [
                    'email' => $request->email,
                    'code' => $code
                ]);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Новый код подтверждения отправлен на ваш email',
                    'data' => [
                        'email' => $request->email,
                        'expires_at' => $verification->expires_at->format('Y-m-d H:i:s'),
                    ]
                ], 200);
                
            } catch (\Exception $mailException) {
                $verification->delete();
                Log::error('Ошибка отправки email при повторной отправке кода: ' . $mailException->getMessage());
                
                return response()->json([
                    'success' => false,
                    'error' => 'Не удалось отправить письмо с подтверждением'
                ], 500);
            }

        } catch (\Exception $e) {
            Log::error('Ошибка при повторной отправке кода: ' . $e->getMessage(), [
                'request_data' => $request->all(),
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при отправке кода'
            ], 500);
        }
    }
}