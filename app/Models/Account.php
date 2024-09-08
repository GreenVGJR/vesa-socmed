<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $table = 'user';

    protected $primaryKey = 'UserID';

    protected $fillable = [
        'UserID',
        'Username',
        'Password',
        'Email',
        'NamaLengkap',
        'Alamat',
        'Kunci'
    ];

    public $timestamps = false;
}