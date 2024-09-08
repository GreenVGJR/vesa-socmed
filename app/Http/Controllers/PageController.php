<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class PageController extends Controller
{
    public function login(Request $request) {
        if (Session::has('username')) {
        return view('web.main');
        }
        else {
        return view('account.login');
        }
    }
}
