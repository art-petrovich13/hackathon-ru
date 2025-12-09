<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение email</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        .code {
            background: #fff;
            border: 2px dashed #667eea;
            padding: 20px;
            text-align: center;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 10px;
            margin: 30px 0;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 12px;
        }
        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Hackathon Events</h1>
        <p>Подтверждение email адреса</p>
    </div>
    
    <div class="content">
        @if($userName)
            <h2>Здравствуйте, {{ $userName }}!</h2>
        @else
            <h2>Здравствуйте!</h2>
        @endif
        
        <p>Благодарим вас за регистрацию на платформе Hackathon Events. Для завершения регистрации необходимо подтвердить ваш email адрес.</p>
        
        <p>Используйте следующий код подтверждения:</p>
        
        <div class="code">{{ $code }}</div>
        
        <p>Код действителен в течение <strong>24 часов</strong>.</p>
        
        <p>Если вы не регистрировались на нашей платформе, просто проигнорируйте это письмо.</p>
        
        <p>С наилучшими пожеланиями,<br>
        Команда Hackathon Events</p>
    </div>
    
    <div class="footer">
        <p>© {{ date('Y') }} Hackathon Events. Все права защищены.</p>
        <p>Это письмо было отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
    </div>
</body>
</html>