<?php

namespace Database\Seeders;

use App\Models\User; 
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $adminExists = User::where('email', 'admin@example.com')->exists();
        
        if (!$adminExists) {
            User::create([
                'name' => 'Администратор',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'email_verified_at' => now(),
                'status' => 'active',
            ]);
            
            $this->command->info('Администратор успешно создан!');
            $this->command->info('Email: admin@example.com');
            $this->command->info('Пароль: password123');
        } else {
            $this->command->info('Администратор уже существует!');
        }
    }
}