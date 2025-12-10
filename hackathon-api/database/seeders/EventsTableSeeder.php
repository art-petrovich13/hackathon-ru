<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Participant;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventsTableSeeder extends Seeder
{
    public function run()
    {
        // Создаем тестовых пользователей
        $organizer = User::factory()->create([
            'name' => 'Тестовый Организатор',
            'email' => 'art.petrovich13@gmail.com',
        ]);
        
        $participant = User::factory()->create([
            'name' => 'Тестовый Участник',
            'email' => 'artembeslostij@gmail.com',
        ]);
        
        // Создаем события разных типов
        
        // Активное событие
        $activeEvent = Event::factory()->create([
            'title' => 'Активное мероприятие по программированию',
            'status' => 'active',
            'created_by' => $organizer->id,
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(2),
            'max_participants' => 10,
            'price' => 0,
        ]);
        
        // Прошедшее событие
        $pastEvent = Event::factory()->create([
            'title' => 'Прошедшая конференция по веб-разработке',
            'status' => 'past',
            'created_by' => $organizer->id,
            'start_date' => now()->subDays(10),
            'end_date' => now()->subDays(9),
            'max_participants' => 50,
            'price' => 1500,
        ]);
        
        // Событие с лимитом участников
        $limitedEvent = Event::factory()->create([
            'title' => 'Мастер-класс по Laravel с ограниченным количеством мест',
            'status' => 'active',
            'created_by' => $organizer->id,
            'start_date' => now()->addDays(3),
            'end_date' => now()->addDays(3)->addHours(3),
            'max_participants' => 5,
            'price' => 2000,
        ]);
        
        // Бесплатное событие
        $freeEvent = Event::factory()->create([
            'title' => 'Бесплатный воркшоп по React',
            'status' => 'active',
            'created_by' => $organizer->id,
            'start_date' => now()->addDays(5),
            'end_date' => now()->addDays(5)->addHours(4),
            'max_participants' => null, // Без ограничений
            'price' => 0,
        ]);
        
        // Добавляем участников
        Participant::create([
            'user_id' => $participant->id,
            'event_id' => $activeEvent->id,
            'status' => 'confirmed',
        ]);
        
        Participant::create([
            'user_id' => $participant->id,
            'event_id' => $pastEvent->id,
            'status' => 'confirmed',
        ]);
        
        // Создаем несколько случайных событий
        Event::factory(20)->create();
        
        $this->command->info('Тестовые данные для событий созданы успешно!');
        $this->command->info('Организатор: ' . $organizer->email);
        $this->command->info('Участник: ' . $participant->email);
        $this->command->info('Пароль для всех пользователей: password');
    }
}