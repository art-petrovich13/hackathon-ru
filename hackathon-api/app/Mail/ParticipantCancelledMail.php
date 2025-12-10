<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Event;
use App\Models\Participant;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ParticipantCancelledMail extends Mailable
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
        
        return $this->subject('Участник отменил участие в событии "' . $this->event->title . '"')
                    ->view('emails.participant_cancelled')
                    ->with([
                        'event' => $this->event,
                        'user' => $this->user,
                        'participant' => $this->participant,
                        'eventUrl' => $eventUrl,
                    ]);
    }
}