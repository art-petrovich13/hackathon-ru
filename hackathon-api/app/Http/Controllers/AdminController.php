<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\PasswordResetMail;

class AdminController extends Controller
{
    /**
     * Получение списка пользователей с фильтрацией
     */
    public function getUsers(Request $request)
    {
        try {
            $query = User::query();
            
            // Фильтр по имени
            if ($request->has('name') && !empty($request->name)) {
                $query->where('name', 'like', '%' . $request->name . '%');
            }
            
            // Фильтр по роли
            if ($request->has('role') && !empty($request->role)) {
                $query->where('role', $request->role);
            }
            
            // Фильтр по статусу
            if ($request->has('status') && !empty($request->status)) {
                $query->where('status', $request->status);
            }
            
            // Фильтр по дате регистрации
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('created_at', [
                    $request->start_date . ' 00:00:00',
                    $request->end_date . ' 23:59:59'
                ]);
            }
            
            // Исключаем удаленных, если не запрошено иное
            if (!$request->has('include_deleted') || $request->include_deleted != 'true') {
                $query->where('status', '!=', 'deleted');
            }
            
            // Сортировка по умолчанию
            $query->orderBy('created_at', 'desc');
            
            // Пагинация
            $perPage = $request->input('per_page', 20);
            $users = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'users' => $users->items(),
                    'pagination' => [
                        'current_page' => $users->currentPage(),
                        'last_page' => $users->lastPage(),
                        'per_page' => $users->perPage(),
                        'total' => $users->total(),
                    ],
                    'filters' => [
                        'name' => $request->name ?? '',
                        'role' => $request->role ?? '',
                        'status' => $request->status ?? '',
                        'start_date' => $request->start_date ?? '',
                        'end_date' => $request->end_date ?? '',
                    ]
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при получении списка пользователей: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при получении списка пользователей',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Получение информации о конкретном пользователе
     */
    public function getUser($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Пользователь не найден'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'status' => $user->status,
                        'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $user->updated_at->format('Y-m-d H:i:s'),
                    ]
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при получении пользователя: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при получении пользователя',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Обновление данных пользователя
     */
    public function updateUser(Request $request, $id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Пользователь не найден'
                ], 404);
            }
            
            // Валидация
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'role' => 'sometimes|in:user,admin',
                'status' => 'sometimes|in:active,deleted',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Ошибка валидации',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Обновление полей
            if ($request->has('name')) {
                $user->name = $request->name;
            }
            
            if ($request->has('role')) {
                $user->role = $request->role;
            }
            
            if ($request->has('status')) {
                $user->status = $request->status;
            }
            
            $user->save();
            
            // Логирование
            Log::info('Администратор обновил данные пользователя', [
                'admin_id' => Auth::id(),
                'user_id' => $user->id,
                'changes' => $request->all()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Данные пользователя успешно обновлены',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                        'status' => $user->status,
                    ]
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при обновлении пользователя: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при обновлении пользователя',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Сброс пароля пользователя
     */
    public function resetPassword(Request $request, $id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Пользователь не найден'
                ], 404);
            }
            
            // Валидация нового пароля
            $validator = Validator::make($request->all(), [
                'password' => 'required|string|min:8|confirmed',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Ошибка валидации',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Генерация пароля, если не указан
            $newPassword = $request->password ?? Str::random(8);
            
            // Установка нового пароля
            $user->password = Hash::make($newPassword);
            $user->save();
            
            // Отправка пароля на почту
            try {
                Mail::to($user->email)->send(new PasswordResetMail($newPassword));
                
                Log::info('Пароль отправлен пользователю', [
                    'admin_id' => Auth::id(),
                    'user_id' => $user->id,
                    'email' => $user->email,
                ]);
            } catch (\Exception $mailException) {
                Log::error('Ошибка отправки пароля на почту: ' . $mailException->getMessage());
                // Не прерываем выполнение, пароль все равно сброшен
            }
            
            // Логирование
            Log::info('Администратор сбросил пароль пользователю', [
                'admin_id' => Auth::id(),
                'user_id' => $user->id,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Пароль успешно сброшен и отправлен на почту пользователя',
                'data' => [
                    'user_id' => $user->id,
                    'email_sent' => true,
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при сбросе пароля: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при сбросе пароля',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Удаление пользователя (мягкое удаление)
     */
    public function deleteUser($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'error' => 'Пользователь не найден'
                ], 404);
            }
            
            // Мягкое удаление - меняем статус
            $user->status = 'deleted';
            $user->save();
            
            // Удаляем токены (если используем Sanctum)
            $user->tokens()->delete();
            
            // Логирование
            Log::info('Администратор удалил пользователя', [
                'admin_id' => Auth::id(),
                'user_id' => $user->id,
                'user_name' => $user->name,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Пользователь успешно удален',
                'data' => [
                    'user_id' => $user->id,
                    'status' => $user->status,
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при удалении пользователя: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при удалении пользователя',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
     public function getAllEvents(Request $request)
    {
        try {
            $query = Event::query()->with(['organizer:id,name', 'participants']);
            
            // Фильтр по статусу
            if ($request->has('status') && !empty($request->status)) {
                if ($request->status === 'all') {
                    // Показываем все, включая отклоненные
                } elseif ($request->status === 'active') {
                    $query->where('status', 'active')->where('end_date', '>', now());
                } elseif ($request->status === 'past') {
                    $query->where('status', 'past')->orWhere('end_date', '<', now());
                } else {
                    $query->where('status', $request->status);
                }
            } else {
                // По умолчанию показываем все, кроме удаленных
                $query->where('status', '!=', 'deleted');
            }
            
            // Фильтр по названию
            if ($request->has('title') && !empty($request->title)) {
                $query->where('title', 'like', '%' . $request->title . '%');
            }
            
            // Фильтр по дате начала
            if ($request->has('start_date') && $request->has('end_date')) {
                $query->whereBetween('start_date', [
                    $request->start_date . ' 00:00:00',
                    $request->end_date . ' 23:59:59'
                ]);
            }
            
            // Сортировка
            $sortBy = $request->input('sort_by', 'start_date');
            $sortOrder = $request->input('sort_order', 'asc');
            $query->orderBy($sortBy, $sortOrder);
            
            // Пагинация
            $perPage = $request->input('per_page', 20);
            $events = $query->paginate($perPage);
            
            // Форматирование ответа
            $formattedEvents = $events->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'short_description' => $event->short_description,
                    'status' => $event->status,
                    'start_date' => $event->start_date->format('Y-m-d H:i:s'),
                    'end_date' => $event->end_date->format('Y-m-d H:i:s'),
                    'location' => $event->location,
                    'max_participants' => $event->max_participants,
                    'participants_count' => $event->participants->count(),
                    'organizer_name' => $event->organizer->name ?? 'Неизвестно',
                    'created_at' => $event->created_at->format('Y-m-d H:i:s'),
                    'payment_type' => $event->payment_type,
                    'price' => $event->price,
                ];
            });
            
            return response()->json([
                'success' => true,
                'data' => [
                    'events' => $formattedEvents,
                    'pagination' => [
                        'current_page' => $events->currentPage(),
                        'last_page' => $events->lastPage(),
                        'per_page' => $events->perPage(),
                        'total' => $events->total(),
                    ]
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при получении списка событий: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при получении списка событий',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Получение конкретного события
     */
    public function getEvent($id)
    {
        try {
            $event = Event::with(['organizer:id,name,email', 'participants.user:id,name,email'])
                        ->find($id);
            
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'error' => 'Событие не найдено'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => [
                    'event' => $event
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при получении события: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при получении события',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Создание события (админ)
     */
    public function createEvent(Request $request)
    {
        try {
            // Валидация
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'description' => 'required|string',
                'start_date' => 'required|date|after:today',
                'end_date' => 'required|date|after:start_date',
                'location' => 'required|string|max:255',
                'price' => 'nullable|numeric|min:0',
                'payment_type' => 'required|in:free,paid,donation',
                'payment_details' => 'nullable|string',
                'max_participants' => 'nullable|integer|min:1',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'participant_ids' => 'nullable|array',
                'participant_ids.*' => 'exists:users,id',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Ошибка валидации',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Обработка изображения
            $imagePath = null;
            if ($request->hasFile('image')) {
                $imageName = time() . '_' . $request->file('image')->getClientOriginalName();
                $imagePath = $request->file('image')->storeAs('events', $imageName, 'public');
            }
            
            // Создание события
            $event = Event::create([
                'title' => $request->title,
                'short_description' => $request->short_description,
                'description' => $request->description,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'location' => $request->location,
                'price' => $request->price ?? 0,
                'payment_type' => $request->payment_type,
                'payment_details' => $request->payment_details,
                'max_participants' => $request->max_participants,
                'image' => $imagePath,
                'status' => 'active',
                'created_by' => Auth::id(),
            ]);
            
            // Добавление участников, если указаны
            if ($request->has('participant_ids') && !empty($request->participant_ids)) {
                foreach ($request->participant_ids as $userId) {
                    Participant::create([
                        'user_id' => $userId,
                        'event_id' => $event->id,
                        'status' => 'confirmed',
                        'registered_at' => now(),
                    ]);
                }
                
                // Отправка уведомлений участникам
                // TODO: Реализовать отправку email
            }
            
            // Логирование
            Log::info('Администратор создал событие', [
                'admin_id' => Auth::id(),
                'event_id' => $event->id,
                'event_title' => $event->title,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Событие успешно создано',
                'data' => [
                    'event' => $event
                ]
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при создании события: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при создании события',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Обновление события
     */
    public function updateEvent(Request $request, $id)
    {
        try {
            $event = Event::find($id);
            
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'error' => 'Событие не найдено'
                ], 404);
            }
            
            // Валидация
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'description' => 'sometimes|string',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date|after:start_date',
                'location' => 'sometimes|string|max:255',
                'price' => 'nullable|numeric|min:0',
                'payment_type' => 'sometimes|in:free,paid,donation',
                'payment_details' => 'nullable|string',
                'max_participants' => 'nullable|integer|min:1',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'status' => 'sometimes|in:draft,pending,active,past,rejected,deleted',
            ]);
            
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Ошибка валидации',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            // Обработка изображения
            if ($request->hasFile('image')) {
                $imageName = time() . '_' . $request->file('image')->getClientOriginalName();
                $imagePath = $request->file('image')->storeAs('events', $imageName, 'public');
                $event->image = $imagePath;
            }
            
            // Обновление полей
            $event->fill($request->only([
                'title', 'short_description', 'description', 'start_date', 
                'end_date', 'location', 'price', 'payment_type', 
                'payment_details', 'max_participants', 'status'
            ]));
            
            // Автоматическое обновление статуса, если изменилась дата окончания
            if ($request->has('end_date')) {
                if (now()->gt($event->end_date) && $event->status !== 'past') {
                    $event->status = 'past';
                }
            }
            
            $event->save();
            
            // Логирование
            Log::info('Администратор обновил событие', [
                'admin_id' => Auth::id(),
                'event_id' => $event->id,
                'changes' => $request->all()
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Событие успешно обновлено',
                'data' => [
                    'event' => $event
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при обновлении события: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при обновлении события',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Удаление события
     */
    public function deleteEvent($id)
    {
        try {
            $event = Event::find($id);
            
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'error' => 'Событие не найдено'
                ], 404);
            }
            
            // Мягкое удаление - меняем статус
            $event->status = 'deleted';
            $event->save();
            
            // Логирование
            Log::info('Администратор удалил событие', [
                'admin_id' => Auth::id(),
                'event_id' => $event->id,
                'event_title' => $event->title,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Событие успешно удалено',
                'data' => [
                    'event_id' => $event->id,
                    'status' => $event->status,
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при удалении события: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при удалении события',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Экспорт списка участников события
     */
    public function exportParticipants($id)
    {
        try {
            $event = Event::with(['participants.user:id,name,email'])
                        ->find($id);
            
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'error' => 'Событие не найдено'
                ], 404);
            }
            
            // Формирование CSV
            $csvData = [];
            
            // Заголовки CSV
            $csvData[] = ['ФИО', 'Email', 'Статус участия', 'Дата регистрации'];
            
            // Данные участников
            foreach ($event->participants as $participant) {
                $csvData[] = [
                    $participant->user->name ?? 'Неизвестно',
                    $participant->user->email ?? '',
                    $participant->status,
                    $participant->registered_at ? $participant->registered_at->format('Y-m-d H:i:s') : '',
                ];
            }
            
            // Создание CSV файла
            $fileName = 'participants_event_' . $event->id . '_' . date('Y-m-d_H-i-s') . '.csv';
            $filePath = storage_path('app/exports/' . $fileName);
            
            // Создание директории, если не существует
            if (!file_exists(dirname($filePath))) {
                mkdir(dirname($filePath), 0755, true);
            }
            
            $file = fopen($filePath, 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
            
            // Отправка файла
            return response()->download($filePath, $fileName, [
                'Content-Type' => 'text/csv',
            ])->deleteFileAfterSend(true);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при экспорте участников: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при экспорте участников',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
}