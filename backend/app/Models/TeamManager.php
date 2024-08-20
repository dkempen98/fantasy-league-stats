<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TeamManager extends Model
{
    use HasFactory;

    public function team() : BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function mangerSeasons() : HasMany
    {
        return $this->hasMany(TeamManagerSeason::class);
    }
}
