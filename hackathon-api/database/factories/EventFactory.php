<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    protected $model = Event::class;

    public function definition()
    {
        $startDate = $this->faker->dateTimeBetween('now', '+30 days');
        $endDate = $this->faker->dateTimeBetween($startDate, '+30 days');
        
        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraphs(3, true),
            'short_description' => $this->faker->sentence(10),
            'image' => $this->faker->imageUrl(800, 600, 'events'),
            'image_thumbnail' => $this->faker->imageUrl(400, 300, 'events'),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'location' => $this->faker->address(),
            'price' => $this->faker->randomElement([0, 100, 500, 1000, 2500]),
            'max_participants' => $this->faker->randomElement([null, 10, 20, 50, 100]),
            'status' => $this->faker->randomElement(['draft', 'pending', 'active', 'past']),
            'payment_type' => $this->faker->randomElement(['free', 'paid', 'donation']),
            'payment_details' => $this->faker->randomElement([
                null,
                ['bank_card' => true],
                ['cash' => true],
                ['bank_transfer' => true],
            ]),
            'created_by' => User::factory(),
        ];
    }
}