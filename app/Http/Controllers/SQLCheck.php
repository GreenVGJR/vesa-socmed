<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SQLCheck extends Controller
{
    public function check() {
    try {
        DB::connection()->getPdo();
        return response()->json(['status' => true], 200);
    } catch (\Exception $e) {
        return response()->json(['status' => false], 401);
        }
    }
}
