<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Foto extends Model
{
    protected $table = 'foto';

    protected $fillable = [
        'JudulFoto',
        'DeskripsiFoto',
        'LokasiFile',
        'AlbumID',
        'UserID'
    ];

    protected $primaryKey = 'FotoID';

    public $timestamps = false;

    public function user()
    {
        // Assuming 'UserID' is the foreign key in the Foto table
        // and 'id' is the primary key in the Account table
        return $this->belongsTo(User::class, 'UserID', 'id');
    }
}
