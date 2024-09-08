<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LikeFoto extends Model
{
    protected $table = 'likefoto';

    protected $fillable = [
        'FotoID',
        'UserID'
    ];

    protected $primaryKey = 'LikeID';

    public $timestamps = false;
}
