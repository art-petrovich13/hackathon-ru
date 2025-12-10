<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public $token;
    public $email;
    public $userName;
    public $expiresAt;
    public $resetUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($token, $email, $userName = null)
    {
        $this->token = $token;
        $this->email = $email;
        $this->userName = $userName;
        $this->expiresAt = now()->addHours(1);
        
        // Генерируем URL для сброса пароля (если фронтенд известен)
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        $this->resetUrl = $frontendUrl . '/reset-password?token=' . $token . '&email=' . urlencode($email);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Сброс пароля на Hackathon Events',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.password_reset',
            with: [
                'token' => $this->token,
                'email' => $this->email,
                'userName' => $this->userName,
                'expiresAt' => $this->expiresAt,
                'resetUrl' => $this->resetUrl,
                'expiresIn' => '1 час',
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}