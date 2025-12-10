<?php

namespace App\Console\Commands;

use App\Models\Event;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateEventStatuses extends Command
{
    protected $signature = 'events:update-status';
    protected $description = 'Обновление статусов событий на основе дат';

    public function handle()
    {
        $this->info('Начало обновления статусов событий...');
        
        try {
            // 1. Помечаем прошедшие события
            $pastEvents = Event::where('end_date', '<', now())
                ->where('status', '!=', 'past')
                ->update(['status' => 'past']);
            
            $this->info("Обновлено прошедших событий: {$pastEvents}");
            Log::info('Обновлены прошедшие события', ['count' => $pastEvents]);
            
            // 2. Помечаем активные события
            $activeEvents = Event::where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->where('status', '!=', 'active')
                ->where('status', '!=', 'rejected')
                ->update(['status' => 'active']);
            
            $this->info("Обновлено активных событий: {$activeEvents}");
            Log::info('Обновлены активные события', ['count' => $activeEvents]);
            
            // 3. Помечаем будущие события как ожидающие (если статус draft)
            $upcomingEvents = Event::where('start_date', '>', now())
                ->where('status', 'draft')
                ->update(['status' => 'pending']);
            
            $this->info("Обновлено будущих событий: {$upcomingEvents}");
            Log::info('Обновлены будущие события', ['count' => $upcomingEvents]);
            
            // 4. Получаем статистику
            $stats = [
                'active' => Event::where('status', 'active')->count(),
                'past' => Event::where('status', 'past')->count(),
                'pending' => Event::where('status', 'pending')->count(),
                'draft' => Event::where('status', 'draft')->count(),
                'rejected' => Event::where('status', 'rejected')->count(),
            ];
            
            $this->info("Статистика событий:");
            $this->table(
                ['Статус', 'Количество'],
                [
                    ['Активные', $stats['active']],
                    ['Прошедшие', $stats['past']],
                    ['Ожидающие', $stats['pending']],
                    ['Черновики', $stats['draft']],
                    ['Отклоненные', $stats['rejected']],
                ]
            );
            
            Log::info('Обновление статусов событий завершено', ['stats' => $stats]);
            $this->info('Обновление статусов событий успешно завершено!');
            
        } catch (\Exception $e) {
            Log::error('Ошибка при обновлении статусов событий: ' . $e->getMessage(), [
                'exception' => $e
            ]);
            
            $this->error('Произошла ошибка при обновлении статусов событий: ' . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}