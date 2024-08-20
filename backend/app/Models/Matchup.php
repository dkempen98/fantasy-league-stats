<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Matchup extends Model
{
    use HasFactory;

    public function homeTeam() : BelongsTo
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    public function awayTeam() : BelongsTo
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    public function season() : BelongsTo
    {
        return $this->belongsTo(Season::class);
    }
}
