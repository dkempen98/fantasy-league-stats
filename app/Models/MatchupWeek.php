<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MatchupWeek extends Model
{
    use HasFactory;

    public function matchup() : belongsTo
    {
        return $this->belongsTo(Matchup::class);
    }
}
