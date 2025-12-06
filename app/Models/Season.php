<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Season extends Model
{
    use HasFactory;

    public function playerSeasons() : HasMany
    {
        return $this->hasMany(PlayerSeason::class);
    }

    public function teamSeasons() : HasMany
    {
        return $this->hasMany(TeamSeason::class);
    }
}
