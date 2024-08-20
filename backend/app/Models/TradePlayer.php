<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TradePlayer extends Model
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

    public function player() : BelongsTo
    {
        return $this->belongsTo(Player::class);
    }

    public function trade() : BelongsTo
    {
        return $this->belongsTo(Trade::class);
    }
}
