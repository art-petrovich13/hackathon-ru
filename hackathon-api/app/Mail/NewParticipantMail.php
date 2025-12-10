<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewParticipantMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $event;
    public $participant;

    public function __construct(User $user, Event $event, Participant $participant)
    {
        $this->user = $user;
        $this->event = $event;
        $this->participant = $participant;
    }

    public function build()
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        $eventUrl = $frontendUrl . '/events/' . $this->event->id;
        
        return $this->subject('Новый участник в событии "' . $this->event->title . '"')
                    ->view('emails.new_participant')
                    ->with([
                        'event' => $this->event,
                        'user' => $this->user,
                        'participant' => $this->participant,
                        'eventUrl' => $eventUrl,
                    ]);
    }
}