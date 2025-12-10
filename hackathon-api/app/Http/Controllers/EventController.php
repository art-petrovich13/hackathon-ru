<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Participant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewParticipantMail;
use App\Mail\ParticipantCancelledMail;

class EventController extends Controller
{
    /**
     * Получение списка событий с фильтрацией
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            $tab = $request->query('tab', 'my'); // Значение по умолчанию: 'my'
            
            // Валидация параметра tab
            $validTabs = ['active', 'my', 'past'];
            if (!in_array($tab, $validTabs)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Некорректное значение вкладки',
                    'message' => 'Допустимые значения: ' . implode(', ', $validTabs)
                ], 400);
            }
            
            $query = Event::query()->with(['organizer:id,name']);
            
            switch ($tab) {
                case 'active':
                    // Активные события: статус 'active' и дата окончания в будущем
                    $query->where('status', 'active')
                          ->where('end_date', '>', now())
                          ->orderBy('start_date', 'asc');
                    break;
                    
                case 'my':
                    // События, в которых пользователь участвует (с подтвержденным участием)
                    $eventIds = Participant::where('user_id', $user->id)
                        ->where('status', 'confirmed')
                        ->pluck('event_id')
                        ->toArray();
                    
                    $query->whereIn('id', $eventIds)
                          ->orderBy('start_date', 'desc');
                    break;
                    
                case 'past':
                    // Прошедшие события
                    $query->where(function ($q) {
                        $q->where('status', 'past')
                          ->orWhere('end_date', '<', now());
                    })
                    ->orderBy('end_date', 'desc');
                    break;
            }
            
            // Исключаем отклоненные события для обычных пользователей
            if ($user->role !== 'admin') {
                $query->where('status', '!=', 'rejected');
            }
            
            // Пагинация
            $perPage = $request->query('per_page', 12);
            $events = $query->withCount(['participants' => function ($q) {
                $q->where('status', 'confirmed');
            }])
            ->paginate($perPage);
            
            // Форматирование ответа
            $formattedEvents = $events->map(function ($event) use ($user) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'short_description' => $event->short_description,
                    'image' => $event->image_thumbnail ?: $event->image,
                    'start_date' => $event->start_date->format('Y-m-d H:i:s'),
                    'end_date' => $event->end_date->format('Y-m-d H:i:s'),
                    'participants_count' => $event->participants_count,
                    'max_participants' => $event->max_participants,
                    'status' => $event->status,
                    'is_active' => $event->isActive(),
                    'is_past' => $event->isPast(),
                    'is_full' => $event->isFull(),
                    'price' => $event->price,
                    'payment_type' => $event->payment_type,
                    'location' => $event->location,
                    'organizer_name' => $event->organizer->name,
                    'is_participating' => $event->isUserParticipating($user->id),
                    'available_spots' => $event->availableSpots(),
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
                    ],
                    'filters' => [
                        'tab' => $tab,
                        'total_events' => $events->total(),
                    ]
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при получении списка событий: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'tab' => $tab,
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при получении списка событий',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Получение детальной информации о событии
     */
    public function show($id)
    {
        try {
            $user = Auth::user();
            
            $event = Event::with(['organizer:id,name,email'])
                ->withCount(['participants' => function ($q) {
                    $q->where('status', 'confirmed');
                }])
                ->find($id);
            
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'error' => 'Событие не найдено'
                ], 404);
            }
            
            // Проверка доступа (если событие отклонено, только админ видит)
            if ($event->status === 'rejected' && $user->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'error' => 'Доступ запрещен',
                    'message' => 'Это событие было отклонено'
                ], 403);
            }
            
            // Получаем информацию об участии пользователя
            $participation = $event->getUserParticipation($user->id);
            
            // Определяем доступные действия
            $availableActions = $this->getAvailableActions($event, $user, $participation);
            
            $responseData = [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'short_description' => $event->short_description,
                'image' => $event->image,
                'image_thumbnail' => $event->image_thumbnail,
                'start_date' => $event->start_date->format('Y-m-d H:i:s'),
                'end_date' => $event->end_date->format('Y-m-d H:i:s'),
                'location' => $event->location,
                'price' => $event->price,
                'payment_type' => $event->payment_type,
                'payment_details' => $event->payment_details,
                'max_participants' => $event->max_participants,
                'participants_count' => $event->participants_count,
                'status' => $event->status,
                'created_by' => $event->created_by,
                'organizer' => [
                    'id' => $event->organizer->id,
                    'name' => $event->organizer->name,
                    'email' => $event->organizer->email,
                ],
                'created_at' => $event->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $event->updated_at->format('Y-m-d H:i:s'),
                'is_active' => $event->isActive(),
                'is_past' => $event->isPast(),
                'is_full' => $event->isFull(),
                'available_spots' => $event->availableSpots(),
                'user_participation' => $participation ? [
                    'status' => $participation->status,
                    'registered_at' => $participation->registered_at->format('Y-m-d H:i:s'),
                    'cancelled_at' => $participation->cancelled_at ? $participation->cancelled_at->format('Y-m-d H:i:s') : null,
                ] : null,
                'available_actions' => $availableActions,
            ];
            
            return response()->json([
                'success' => true,
                'data' => $responseData
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при получении события: ' . $e->getMessage(), [
                'event_id' => $id,
                'user_id' => Auth::id(),
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при получении события',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Подтверждение участия в событии
     */
   public function participate($id)
{
    try {
        $user = Auth::user();
        $event = Event::withCount(['participants' => function ($q) {
            $q->where('status', 'confirmed');
        }])->find($id);
        
        if (!$event) {
            return response()->json([
                'success' => false,
                'error' => 'Событие не найдено'
            ], 404);
        }
        
        // Проверяем, что событие активно
        if (!$event->isActive()) {
            return response()->json([
                'success' => false,
                'error' => 'Событие не активно',
                'message' => 'Вы не можете участвовать в неактивном или прошедшем событии'
            ], 400);
        }
        
        // Проверяем, не участвует ли уже пользователь (используем firstOrCreate)
        $participant = Participant::where('user_id', $user->id)
            ->where('event_id', $event->id)
            ->first();
        
        if ($participant) {
            // Если запись уже существует, проверяем статус
            if ($participant->status === 'confirmed') {
                return response()->json([
                    'success' => false,
                    'error' => 'Вы уже участвуете',
                    'message' => 'Вы уже подтвердили участие в этом событии'
                ], 400);
            } else {
                // Если статус не 'confirmed', обновляем на 'confirmed'
                $participant->update([
                    'status' => 'confirmed',
                    'registered_at' => now(),
                    'cancelled_at' => null,
                ]);
            }
        } else {
            // Создаем новую запись об участии
            $participant = Participant::create([
                'user_id' => $user->id,
                'event_id' => $event->id,
                'status' => 'confirmed',
                'registered_at' => now(),
            ]);
        }
        
        // Отправляем уведомление организатору
        try {
            Mail::to($event->organizer->email)->send(new NewParticipantMail($user, $event, $participant));
            
            Log::info('Уведомление отправлено организатору', [
                'event_id' => $event->id,
                'organizer_id' => $event->organizer->id,
                'participant_id' => $user->id,
            ]);
        } catch (\Exception $mailException) {
            Log::error('Ошибка отправки уведомления организатору: ' . $mailException->getMessage());
            // Не прерываем выполнение
        }
        
        // Логируем успешное участие
        Log::info('Пользователь подтвердил участие в событии', [
            'user_id' => $user->id,
            'event_id' => $event->id,
            'participant_id' => $participant->id,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Участие успешно подтверждено',
            'data' => [
                'participant' => [
                    'id' => $participant->id,
                    'status' => $participant->status,
                    'registered_at' => $participant->registered_at->format('Y-m-d H:i:s'),
                ],
                'event' => [
                    'participants_count' => $event->participants_count + 1,
                    'available_spots' => $event->availableSpots(),
                ]
            ]
        ], 201);
        
    } catch (\Exception $e) {
        Log::error('Ошибка при подтверждении участия: ' . $e->getMessage(), [
            'event_id' => $id,
            'user_id' => Auth::id(),
            'exception' => $e
        ]);
        
        return response()->json([
            'success' => false,
            'error' => 'Ошибка при подтверждении участия',
            'message' => 'Произошла внутренняя ошибка сервера'
        ], 500);
    }
}
    
    /**
     * Отмена участия в событии
     */
    public function cancel($id)
    {
        try {
            $user = Auth::user();
            $event = Event::withCount(['participants' => function ($q) {
                $q->where('status', 'confirmed');
            }])->find($id);
            
            if (!$event) {
                return response()->json([
                    'success' => false,
                    'error' => 'Событие не найдено'
                ], 404);
            }
            
            // Находим участие пользователя
            $participant = $event->getUserParticipation($user->id);
            
            if (!$participant || !$participant->isConfirmed()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Вы не участвуете в этом событии',
                    'message' => 'Не найдено активного участия в данном событии'
                ], 400);
            }
            
            // Отменяем участие
            $participant->cancel();
            
            // Отправляем уведомление организатору
            try {
                Mail::to($event->organizer->email)->send(new ParticipantCancelledMail($user, $event, $participant));
                
                Log::info('Уведомление об отмене отправлено организатору', [
                    'event_id' => $event->id,
                    'organizer_id' => $event->organizer->id,
                    'participant_id' => $user->id,
                ]);
            } catch (\Exception $mailException) {
                Log::error('Ошибка отправки уведомления об отмене: ' . $mailException->getMessage());
                // Не прерываем выполнение
            }
            
            // Логируем отмену участия
            Log::info('Пользователь отменил участие в событии', [
                'user_id' => $user->id,
                'event_id' => $event->id,
                'participant_id' => $participant->id,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Участие успешно отменено',
                'data' => [
                    'participant' => [
                        'id' => $participant->id,
                        'status' => $participant->status,
                        'cancelled_at' => $participant->cancelled_at->format('Y-m-d H:i:s'),
                    ],
                    'event' => [
                        'participants_count' => max(0, $event->participants_count - 1),
                        'available_spots' => $event->availableSpots(),
                    ]
                ]
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Ошибка при отмене участия: ' . $e->getMessage(), [
                'event_id' => $id,
                'user_id' => Auth::id(),
                'exception' => $e
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Ошибка при отмене участия',
                'message' => 'Произошла внутренняя ошибка сервера'
            ], 500);
        }
    }
    
    /**
     * Вспомогательный метод для определения доступных действий
     */
    private function getAvailableActions(Event $event, $user, $participation = null): array
    {
        $actions = [
            'can_participate' => false,
            'can_cancel' => false,
            'can_view' => true,
            'is_participating' => false,
        ];
        
        // Пользователь уже участвует
        if ($participation && $participation->isConfirmed()) {
            $actions['is_participating'] = true;
            
            // Может отменить участие, если событие еще активно
            if ($event->isActive() && !$event->isPast()) {
                $actions['can_cancel'] = true;
            }
        } else {
            // Может участвовать, если событие активно и есть места
            if ($event->isActive() && !$event->isPast() && !$event->isFull()) {
                $actions['can_participate'] = true;
            }
        }
        
        return $actions;
    }
}