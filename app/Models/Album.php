<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Album extends Model
{
    protected $table = 'album';

    protected $fillable = [
        'NamaAlbum',
        'Deskripsi',
        'UserID'
    ];

    protected $primaryKey = 'AlbumID';

    public $timestamps = false;
}
