<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class League extends Model
{
    use HasFactory;

    public function teams() : hasMany
    {
        return $this->hasMany(Team::class);
    }

    public function scoring() : hasMany
    {
        return $this->hasMany(LeagueStatScoring::class);
    }

    public function matchups() : hasMany
    {
        return $this->hasMany(Matchup::class);
    }

    public function seasons() : hasMany
    {
        return $this->hasMany(Season::class);
    }

    public function provider() : BelongsTo
    {
        return $this->belongsTo(Provider::class);
    }
}
