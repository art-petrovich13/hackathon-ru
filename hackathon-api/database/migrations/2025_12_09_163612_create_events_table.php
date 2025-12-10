<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->string('image')->nullable();
            $table->string('image_thumbnail')->nullable();
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('location')->nullable();
            $table->decimal('price', 10, 2)->nullable()->default(0);
            $table->integer('max_participants')->nullable();
            $table->enum('status', ['draft', 'pending', 'active', 'past', 'rejected'])->default('draft');
            $table->enum('payment_type', ['free', 'paid', 'donation'])->default('free');
            $table->json('payment_details')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};