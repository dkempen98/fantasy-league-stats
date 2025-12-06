<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provider extends Model
{
    use HasFactory;

    public function players() : HasMany
    {
        return $this->hasMany(Player::class);
    }

    public function leagues() : HasMany
    {
        return $this->hasMany(League::class);
    }
}
