<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeagueStatScoring extends Model
{
    use HasFactory;

    public function league() : belongsTo
    {
        return $this->belongsTo(League::class, 'id', 'league_id');
    }

    public function statType() : belongsTo
    {
        return $this->belongsTo(StatType::class);
    }

    public function season() : BelongsTo
    {
        return $this->belongsTo(Season::class);
    }
}
