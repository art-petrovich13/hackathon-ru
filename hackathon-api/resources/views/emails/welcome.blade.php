<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Добро пожаловать!</title>
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
        .features {
            margin: 20px 0;
        }
        .feature-item {
            background: white;
            padding: 15px;
            margin: 10px 0;
            border-left: 4px solid #4CAF50;
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
        .btn {
            display: inline-block;
            background: #4CAF50;
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
        <h1>Добро пожаловать!</h1>
        <p>Ваша регистрация успешно завершена</p>
    </div>
    
    <div class="content">
        <h2>Приветствуем, {{ $user->name }}!</h2>
        
        <p>Мы рады приветствовать вас на платформе <strong>Hackathon Events</strong> — вашем надежном партнере в организации и участии в хакатонах и IT-мероприятиях.</p>
        
        <div class="features">
            <h3>Что вы можете делать на платформе:</h3>
            
            <div class="feature-item">
                <strong>🎯 Участвовать в хакатонах</strong>
                <p>Находите интересные мероприятия и подавайте заявки на участие.</p>
            </div>
            
            <div class="feature-item">
                <strong>📅 Создавать события</strong>
                <p>Организуйте собственные хакатоны и приглашайте участников.</p>
            </div>
            
            <div class="feature-item">
                <strong>👥 Формировать команды</strong>
                <p>Находите единомышленников для совместного участия в проектах.</p>
            </div>
            
            <div class="feature-item">
                <strong>🏆 Получать награды</strong>
                <p>Участвуйте в конкурсах и выигрывайте ценные призы.</p>
            </div>
        </div>
        
        <p>Для начала работы перейдите в ваш личный кабинет и ознакомьтесь с доступными мероприятиями.</p>
        
        <p>Если у вас возникнут вопросы, наша служба поддержки всегда готова помочь.</p>
        
        <p>Желаем вам успехов и ярких побед!<br>
        С уважением,<br>
        Команда Hackathon Events</p>
    </div>
    
    <div class="footer">
        <p>© {{ date('Y') }} Hackathon Events. Все права защищены.</p>
        <p>Это письмо было отправлено автоматически. Пожалуйста, не отвечайте на него.</p>
    </div>
</body>
</html>