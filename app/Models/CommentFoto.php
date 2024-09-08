<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentFoto extends Model
{
    protected $table = 'komentarfoto';

    protected $fillable = [
        'FotoID',
        'UserID',
        'IsiKomentar'
    ];

    protected $primaryKey = 'KomentarID';

    public $timestamps = false;
}
