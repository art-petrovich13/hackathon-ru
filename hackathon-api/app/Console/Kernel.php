<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Регистрация пользовательских команд Artisan.
     * Эти команды загружаются автоматически Laravel.
     *
     * @var array
     */
    protected $commands = [
        // Здесь можно регистрировать пользовательские команды,
        // но обычно они автоматически обнаруживаются Laravel
        // если находятся в папке app/Console/Commands
    ];

    /**
     * Определение расписания выполнения команд.
     * Здесь настраиваются автоматически выполняемые задачи.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // ============== ЕЖЕДНЕВНЫЕ ЗАДАЧИ ==============
        
        // 1. Обновление статусов событий каждый день в 00:01
        $schedule->command('events:update-status')
            ->dailyAt('00:01')
            ->description('Обновление статусов событий (активные/прошедшие)')
            ->onOneServer() // Выполнять только на одном сервере в кластере
            ->withoutOverlapping() // Не запускать, если предыдущий запуск еще выполняется
            ->appendOutputTo(storage_path('logs/schedule-events.log')); // Логирование
        
        // 2. Очистка старых токенов Sanctum (если используется)
        // Удаляет токены старше указанного времени (по умолчанию 24 часа)
        $schedule->command('sanctum:prune-expired --hours=24')
            ->daily()
            ->description('Очистка просроченных токенов аутентификации');
        
        // 3. Очистка устаревших кэшей (опционально)
        $schedule->command('cache:prune-stale-tags')
            ->hourly()
            ->description('Очистка устаревших тегов кэша');
        
        // ============== ЕЖЕЧАСНЫЕ ЗАДАЧИ ==============
        
        // 4. Резервное копирование базы данных (если настроено)
        // $schedule->command('backup:run --only-db')
        //     ->hourly()
        //     ->description('Резервное копирование базы данных');
        
        // ============== ЕЖЕМИНУТНЫЕ ЗАДАЧИ (для тестирования) ==============
        
        // В режиме разработки можно запускать чаще для тестирования
        if (app()->environment('local', 'staging')) {
            // Обновление статусов событий каждые 10 минут для тестирования
            $schedule->command('events:update-status')
                ->everyTenMinutes()
                ->description('Тестовое обновление статусов событий')
                ->appendOutputTo(storage_path('logs/schedule-test.log'));
                
            // Очистка кэша каждые 15 минут
            $schedule->command('cache:clear')
                ->everyFifteenMinutes()
                ->description('Тестовая очистка кэша');
        }
        
        // ============== ПРИМЕРЫ РАЗЛИЧНЫХ РАСПИСАНИЙ ==============
        
        /*
        // Каждую минуту
        $schedule->command('inspire')->everyMinute();
        
        // Каждые 5 минут
        $schedule->command('emails:send')->everyFiveMinutes();
        
        // Каждые 10 минут
        $schedule->command('notifications:send')->everyTenMinutes();
        
        // Каждые 15 минут
        $schedule->command('statistics:update')->everyFifteenMinutes();
        
        // Каждые 30 минут
        $schedule->command('reports:generate')->everyThirtyMinutes();
        
        // Ежечасно
        $schedule->command('backup:run')->hourly();
        
        // Ежечасно в 17 минут
        $schedule->command('backup:run')->hourlyAt(17);
        
        // Ежедневно
        $schedule->command('subscriptions:check')->daily();
        
        // Ежедневно в 14:00
        $schedule->command('reports:send')->dailyAt('14:00');
        
        // Ежедневно в 8:00 и 20:00
        $schedule->command('notifications:send')->twiceDaily(8, 20);
        
        // Еженедельно
        $schedule->command('analytics:generate')->weekly();
        
        // По воскресеньям в 23:00
        $schedule->command('cleanup:old-records')->sundays()->at('23:00');
        
        // Ежемесячно
        $schedule->command('billing:process')->monthly();
        
        // Ежеквартально
        $schedule->command('reports:quarterly')->quarterly();
        
        // По рабочим дням
        $schedule->command('workday:start')->weekdays();
        
        // По выходным
        $schedule->command('maintenance:run')->weekends();
        */
        
        // ============== ВЫПОЛНЕНИЕ СКРИПТОВ ==============
        
        // Выполнение произвольного кода PHP
        $schedule->call(function () {
            // Например, отправка ежедневного отчета
            \Log::info('Ежедневная проверка системы выполнена');
        })->dailyAt('03:00');
        
        // Выполнение системной команды
        // $schedule->exec('node /path/to/script.js')->daily();
        
        // ============== ОЧЕРЕДИ ==============
        
        // Если используете очереди Laravel
        $schedule->command('queue:work --stop-when-empty')
            ->everyMinute()
            ->withoutOverlapping()
            ->appendOutputTo(storage_path('logs/queue-worker.log'));
        
        // Очистка неудачных заданий
        $schedule->command('queue:flush')
            ->weekly()
            ->description('Очистка неудачных заданий очереди');
            
        // Повтор неудачных заданий
        $schedule->command('queue:retry all')
            ->hourly()
            ->description('Повтор неудачных заданий очереди');
        
        // ============== УВЕДОМЛЕНИЯ ==============
        
        // Отправка уведомлений о выполнении команд
        // (требует настройки уведомлений Laravel)
        // $schedule->command('events:update-status')
        //     ->dailyAt('00:01')
        //     ->thenPing('https://healthchecks.io/ping/your-check-id');
        
        // ============== ПРИМЕР ДЛЯ НАШЕГО ПРОЕКТА ==============
        
        // Запланированные задачи для хакатон-проекта:
        
        // 1. Обновление статусов событий
        $schedule->command('events:update-status')
            ->dailyAt('00:01')
            ->description('Обновление статусов событий');
            
        // 2. Очистка старых записей верификации email (старше 3 дней)
        $schedule->call(function () {
            \App\Models\EmailVerification::where('expires_at', '<', now()->subDays(3))->delete();
            \Log::info('Очищены старые записи верификации email');
        })->dailyAt('02:00');
        
        // 3. Очистка старых токенов сброса пароля (старше 1 дня)
        $schedule->call(function () {
            \Illuminate\Support\Facades\DB::table('password_resets')
                ->where('expires_at', '<', now()->subDay())
                ->delete();
            \Log::info('Очищены старые токены сброса пароля');
        })->dailyAt('02:30');
        
        // 4. Очистка временных кэшей регистрации (старше 1 дня)
        $schedule->call(function () {
            // Получаем все ключи кэша с префиксом registration_
            $keys = \Illuminate\Support\Facades\Cache::get('registration_*');
            foreach ($keys as $key) {
                \Illuminate\Support\Facades\Cache::forget($key);
            }
            \Log::info('Очищены временные кэши регистрации');
        })->dailyAt('03:00');
        
        // 5. Отправка напоминаний о событиях (за день до начала)
        $schedule->command('events:send-reminders')
            ->dailyAt('09:00')
            ->description('Отправка напоминаний о предстоящих событиях');
            
        // 6. Генерация статистики за предыдущий день
        $schedule->command('statistics:daily')
            ->dailyAt('23:30')
            ->description('Генерация ежедневной статистики');
    }

    /**
     * Регистрация команд для приложения.
     * Здесь можно зарегистрировать команды вручную.
     *
     * @return void
     */
    protected function commands()
    {
        // Автоматическая загрузка всех команд из папки Commands
        $this->load(__DIR__.'/Commands');

        // Ручная регистрация команд (если нужно)
        // require base_path('routes/console.php');
        
        // Альтернативно, можно регистрировать команды так:
        // \Artisan::command('inspire', function () {
        //     $this->comment(\Illuminate\Foundation\Inspiring::quote());
        // })->describe('Display an inspiring quote');
    }

    /**
     * Получение часового пояса, который должен использоваться
     * по умолчанию для запланированных событий.
     *
     * @return \DateTimeZone|string|null
     */
    protected function scheduleTimezone()
    {
        // Возвращаем часовой пояс для расписания
        // По умолчанию используется timezone из config/app.php
        return 'Europe/Moscow'; // или 'UTC', 'America/New_York' и т.д.
    }
}