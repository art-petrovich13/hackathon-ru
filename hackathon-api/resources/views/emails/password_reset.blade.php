<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Сброс пароля</title>
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
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
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
        .token-container {
            background: #fff;
            border: 2px dashed #ff6b6b;
            padding: 20px;
            margin: 30px 0;
            border-radius: 5px;
        }
        .token {
            font-family: monospace;
            font-size: 18px;
            font-weight: bold;
            color: #ff6b6b;
            word-break: break-all;
            padding: 10px;
            background: #fff5f5;
            border-radius: 3px;
            margin: 10px 0;
        }
        .btn {
            display: inline-block;
            background: #ff6b6b;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .steps {
            margin: 20px 0;
        }
        .step {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #ff6b6b;
            border-radius: 3px;
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
        <p>Запрос на сброс пароля</p>
    </div>
    
    <div class="content">
        @if($userName)
            <h2>Здравствуйте, {{ $userName }}!</h2>
        @else
            <h2>Здравствуйте!</h2>
        @endif
        
        <p>Мы получили запрос на сброс пароля для вашего аккаунта. Если это были не вы, пожалуйста, проигнорируйте это письмо.</p>
        
        <div class="warning">
            <strong>⚠️ Внимание!</strong>
            <p>Никогда не сообщайте этот код или токен третьим лицам. Наша служба поддержки никогда не попросит у вас эту информацию.</p>
        </div>
        
        <div class="steps">
            <h3>Для сброса пароля выполните следующие шаги:</h3>
            
            <div class="step">
                <strong>1. Используйте код ниже</strong>
                <p>Ваш токен для сброса пароля:</p>
                <div class="token">{{ $token }}</div>
            </div>
            
            <div class="step">
                <strong>2. Или перейдите по ссылке</strong>
                <p>Нажмите на кнопку ниже для автоматического сброса пароля:</p>
                <p>
                    <a href="{{ $resetUrl }}" class="btn">Сбросить пароль</a>
                </p>
            </div>
            
            <div class="step">
                <strong>3. Укажите новый пароль</strong>
                <p>После перехода по ссылке введите новый пароль в соответствующей форме.</p>
            </div>
        </div>
        
        <p><strong>Срок действия токена:</strong> {{ $expiresIn }} (до {{ $expiresAt->format('d.m.Y H:i') }})</p>
        
        <p>Если у вас возникли проблемы со сбросом пароля, свяжитесь с нашей службой поддержки.</p>
        
        <p>С наилучшими пожеланиями,<br>
        Команда Hackathon Events</p>
    </div>
    
    <div class="footer">
        <p>© {{ date('Y') }} Hackathon Events. Все права защищены.</p>
        <p>Это письмо было отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
    </div>
</body>
</html>