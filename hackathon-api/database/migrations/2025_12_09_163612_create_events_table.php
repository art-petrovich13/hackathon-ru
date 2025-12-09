<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('short_description');
            $table->text('full_description');
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->string('image_path')->nullable();
            $table->text('payment_info')->nullable();
            $table->integer('max_participants')->nullable();
            $table->enum('status', ['active', 'past', 'rejected'])->default('active');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('events');
    }
};