<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Пароль успешно изменен</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
        }
        .success-box {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
            text-align: center;
        }
        .security-tips {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            color: #1565c0;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .info-box {
            background: white;
            border: 1px solid #e0e0e0;
            padding: 15px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Hackathon Events</h1>
        <p>Пароль успешно изменен</p>
    </div>
    
    <div class="content">
        <h2>Здравствуйте, {{ $user->name }}!</h2>
        
        <div class="success-box">
            <h3>✅ Пароль успешно изменен!</h3>
            <p>Ваш пароль был успешно обновлен в {{ $changedAt->format('H:i') }} {{ $changedAt->format('d.m.Y') }}</p>
        </div>
        
        <p>Если это изменение выполнили вы, то можете спокойно продолжать пользоваться нашим сервисом.</p>
        
        <div class="security-tips">
            <h3>🔒 Советы по безопасности:</h3>
            <ul>
                <li>Никогда не сообщайте свой пароль другим лицам</li>
                <li>Используйте уникальные пароли для разных сервисов</li>
                <li>Регулярно обновляйте пароли</li>
                <li>Включайте двухфакторную аутентификацию, если она доступна</li>
            </ul>
        </div>
        
        <div class="info-box">
            <p><strong>Дата изменения:</strong> {{ $changedAt->format('d.m.Y H:i') }}</p>
            <p><strong>Email аккаунта:</strong> {{ $user->email }}</p>
            <p><strong>IP адрес:</strong> {{ request()->ip() ?? 'Неизвестно' }}</p>
        </div>
        
        <p><strong>Важно:</strong> Если вы не изменяли пароль, немедленно свяжитесь с нашей службой поддержки и смените пароль еще раз.</p>
        
        <p>Для входа в систему используйте ваш email и новый пароль.</p>
        
        <p>С наилучшими пожеланиями,<br>
        Команда Hackathon Events</p>
    </div>
    
    <div class="footer">
        <p>© {{ date('Y') }} Hackathon Events. Все права защищены.</p>
        <p>Это письмо было отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
    </div>
</body>
</html>