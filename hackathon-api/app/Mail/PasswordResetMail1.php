<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail1 extends Mailable
{
    use Queueable, SerializesModels;

    public $password;
    public $userName;

    public function __construct($password, $userName = null)
    {
        $this->password = $password;
        $this->userName = $userName;
    }

    public function build()
    {
        return $this->subject('Ваш новый пароль')
                    ->view('emails.password_reset')
                    ->with([
                        'password' => $this->password,
                        'userName' => $this->userName,
                    ]);
    }
}