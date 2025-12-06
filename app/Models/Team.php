<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Team extends Model
{
    use HasFactory;

    public function players() : HasManyThrough
    {
        return $this->hasManyThrough(Player::class, PlayerTeamWeek::class);
    }

    public function seasons() : HasManyThrough
    {
        return $this->HasManyThrough(Season::class, TeamSeason::class);
    }

    public function name() : HasOne
    {
        return $this->hasOne(TeamName::class);
    }

    public function managers() : HasMany
    {
        return $this->hasMany(TeamManager::class);
    }

}

