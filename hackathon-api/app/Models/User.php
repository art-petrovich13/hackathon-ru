<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'email_verified_at',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function createdEvents()
    {
        return $this->hasMany(Event::class, 'created_by');
    }

    public function participants()
    {
        return $this->hasMany(Participant::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
    
    public function scopeDeleted($query)
    {
        return $query->where('status', 'deleted');
    }
    
    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function organizedEvents(): HasMany
    {
        return $this->hasMany(Event::class, 'created_by');
    }

    public function participations(): HasMany
    {
        return $this->hasMany(Participant::class);
    }

    public function participatingEvents()
    {
        return $this->belongsToMany(Event::class, 'participants')
            ->withPivot('status', 'registered_at')
            ->wherePivot('status', 'confirmed')
            ->withTimestamps();
    }
}
