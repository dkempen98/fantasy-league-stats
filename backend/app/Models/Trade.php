<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trade extends Model
{
    use HasFactory;

    public function teamFrom() : BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_from_id');
    }

    public function teamTo() : BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_to_id');
    }

    public function playersFrom() : HasMany
    {
        return $this->hasMany(TradePlayer::class, 'original_team_id', 'team_from_id');
    }

    public function playersTo() : HasMany
    {
        return $this->hasMany(TradePlayer::class, 'original_team_id', 'team_from_id');
    }
}
