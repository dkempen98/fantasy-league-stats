<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeamManagerSeason extends Model
{
    use HasFactory;

    public function teams() : BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function manager() : BelongsTo
    {
        return $this->belongsTo(TeamManager::class);
    }

    public function season() : BelongsTo
    {
        return $this->belongsTo(Season::class);
    }
}
