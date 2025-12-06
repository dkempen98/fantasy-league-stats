<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Player extends Model
{
    use HasFactory;

    public function position() : belongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function proTeam() : BelongsTo
    {
        return $this->belongsTo(ProTeam::class);
    }

    public function provider() : BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }
}
