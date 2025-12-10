<!DOCTYPE html>
<html>
<head>
    <title>Сброс пароля</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 5px; }
        .password-box { 
            background-color: #e0f2fe; 
            padding: 15px; 
            border-radius: 5px; 
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
            border: 2px dashed #38bdf8;
        }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Сброс пароля</h1>
        </div>
        
        <div class="content">
            @if($userName)
                <p>Здравствуйте, {{ $userName }}!</p>
            @else
                <p>Здравствуйте!</p>
            @endif
            
            <p>Администратор сбросил ваш пароль для доступа к системе.</p>
            
            <p>Ваш новый пароль:</p>
            
            <div class="password-box">
                {{ $password }}
            </div>
            
            <p><strong>Важно:</strong> После входа в систему рекомендуется сменить пароль в настройках профиля.</p>
            
            <p>Если вы не запрашивали сброс пароля, пожалуйста, свяжитесь с администратором.</p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} Ваше приложение. Все права защищены.</p>
        </div>
    </div>
</body>
</html>