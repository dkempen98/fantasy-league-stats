<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DraftPicks extends Model
{
    use HasFactory;

    public function player(): belongsTo
    {
        return $this->belongsTo(Player::class, 'id', 'player_id');
    }

    public function team(): belongsTo
    {
        return $this->belongsTo(Team::class, 'id', 'team_id');
    }
}
