<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stat_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('player_stats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained();
            $table->foreignId('stat_type_id')->constrained();
            $table->integer('count');
            $table->foreignId('season_id')->constrained();
            $table->integer('week');
            $table->timestamps();
        });

        Schema::create('league_stat_scoring', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_id')->constrained();
            $table->foreignId('stat_type_id')->constrained();
            $table->integer('point_value');
            $table->boolean('uses_benchmark')->default(false);
            $table->boolean('benchmark_increments')->nullable();
            $table->integer('benchmark_amount')->nullable();
            $table->foreignId('season_id')->constrained();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('player_stats');
    }
};
