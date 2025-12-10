<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Новый участник</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; 
                 text-decoration: none; border-radius: 4px; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .info-box { background-color: #e8f5e8; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Новый участник</h1>
        </div>
        
        <div class="content">
            <h2>Здравствуйте!</h2>
            <p>В вашем событии <strong>"{{ $event->title }}"</strong> появился новый участник.</p>
            
            <div class="info-box">
                <h3>Информация об участнике:</h3>
                <p><strong>Имя:</strong> {{ $user->name }}</p>
                <p><strong>Email:</strong> {{ $user->email }}</p>
                <p><strong>Дата регистрации:</strong> {{ $participant->registered_at->format('d.m.Y H:i') }}</p>
            </div>
            
            <div class="info-box">
                <h3>Информация о событии:</h3>
                <p><strong>Название:</strong> {{ $event->title }}</p>
                <p><strong>Дата начала:</strong> {{ $event->start_date->format('d.m.Y H:i') }}</p>
                <p><strong>Дата окончания:</strong> {{ $event->end_date->format('d.m.Y H:i') }}</p>
                <p><strong>Место проведения:</strong> {{ $event->location ?? 'Не указано' }}</p>
                <p><strong>Текущее количество участников:</strong> {{ $event->confirmedParticipants()->count() }}</p>
                @if($event->max_participants)
                <p><strong>Максимальное количество участников:</strong> {{ $event->max_participants }}</p>
                @endif
            </div>
            
            <p style="text-align: center;">
                <a href="{{ $eventUrl }}" class="button">Перейти к событию</a>
            </p>
            
            <p>С уважением,<br>Команда {{ config('app.name') }}</p>
        </div>
        
        <div class="footer">
            <p>Это письмо было отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. Все права защищены.</p>
        </div>
    </div>
</body>
</html>