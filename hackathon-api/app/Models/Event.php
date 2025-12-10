<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'short_description',
        'image',
        'image_thumbnail',
        'start_date',
        'end_date',
        'location',
        'price',
        'max_participants',
        'status',
        'payment_type',
        'payment_details',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'price' => 'decimal:2',
        'payment_details' => 'array',
        'max_participants' => 'integer',
    ];

    /**
     * Организатор события
     */
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Участники события
     */
    public function participants(): HasMany
    {
        return $this->hasMany(Participant::class);
    }

    /**
     * Подтвержденные участники
     */
    public function confirmedParticipants(): HasMany
    {
        return $this->hasMany(Participant::class)->where('status', 'confirmed');
    }

    /**
     * Проверка, является ли событие активным
     */
    public function isActive(): bool
    {
        return $this->status === 'active' 
            && Carbon::now()->between($this->start_date, $this->end_date);
    }

    /**
     * Проверка, является ли событие прошедшим
     */
    public function isPast(): bool
    {
        return $this->status === 'past' || Carbon::now()->gt($this->end_date);
    }

    /**
     * Проверка, достигнут ли лимит участников
     */
    public function isFull(): bool
    {
        if (!$this->max_participants) {
            return false;
        }
        
        return $this->confirmedParticipants()->count() >= $this->max_participants;
    }

    /**
     * Получение количества свободных мест
     */
    public function availableSpots(): ?int
    {
        if (!$this->max_participants) {
            return null;
        }
        
        return max(0, $this->max_participants - $this->confirmedParticipants()->count());
    }

    /**
     * Проверка, участвует ли пользователь в событии
     */
    public function isUserParticipating(int $userId): bool
    {
        return $this->participants()
            ->where('user_id', $userId)
            ->where('status', 'confirmed')
            ->exists();
    }

    /**
     * Получение участия пользователя
     */
    public function getUserParticipation(int $userId): ?Participant
    {
        return $this->participants()
            ->where('user_id', $userId)
            ->first();
    }
}