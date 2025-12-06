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
        Schema::table('trade_players', function (Blueprint $table) {
            $table->foreignId('team_from_id')->after('player_id')->constrained('teams');
            $table->foreignId('team_to_id')->after('team_from_id')->constrained('teams');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trade_players', function (Blueprint $table) {
            $table->dropForeign(['team_from_id']);
            $table->dropColumn('team_from_id');
            $table->dropForeign(['team_to_id']);
            $table->dropColumn('team_to_id');
        });
    }
};
