<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

use GuzzleHttp\Client;

class LoginAccount extends Controller
{
    public function login(Request $request) {
        $data = $request->query('data');

        if(!$data) {
            return response('', 404);
        }

        $type = $data[0];

        if($type == "login") {

        $email = $data[1];
        $password = $data[2];
        
        if(!$email || !$password) {
            return response('', 500);
        }
    
        $user = Account::where('Email', $email)->where('Password', $password)->first();

        if ($user) {
            Session::regenerate();
            Session::put('username', $user->Username);
            Session::put('key', md5($user->Email));
            Session::put('userid', $user->UserID);
            return response()->json(['result' => true, 'message' => $user->Username, 'key' => md5($user->Email)], 200);
        } else {
            return response()->json(['result' => false, 'error' => 'Email or Password were invalid.'], 200);
            }
        }

        else if($type == "register") {
        $nama = $data[1];   
        $email = $data[2];
        $pass = $data[3];
        $your_name = $data[4];
        
        $existingAccount = Account::where('Email', $email)->orWhere('Username', $nama)->first();

        if($existingAccount) {
            return response()->json(['result' => false, 'error' => 'Email or Username already have.'], 200);
        }

        $user = Account::insert([
        'Username' => $nama,
        'Email' => $email,
        'Password' => $pass,
        'NamaLengkap' => $your_name,
        'Alamat' => null,
        'Kunci' => md5($email)
        ]);

        if($user) {
            return response()->json(['result' => true], 200);
            }
        }
        else if($type == "forgotpass") {
        $email = $data[1];
        $your_name = $data[2];

        $acc = Account::where('Email', $email)
        ->whereRaw('LOWER(NamaLengkap) = LOWER(?)', [$your_name])
        ->first();

        if($acc) {
            return response()->json(['result' => true, 'message' => md5($acc->Password)], 200);
            }
            else {
            return response()->json(['result' => false, 'error' => 'No such Account found.'], 200);    
            }
        }
    }

    public function changePassAcc(Request $request) {
        $data = $request->query('data');
    
        $email = $data[0];
        $name = $data[1];
        $input = $data[2];
    
        $acc = Account::where('Email', $email)
        ->whereRaw('LOWER(NamaLengkap) = LOWER(?)', [$name])
        ->first();
    
        if (!$acc) {
            return response()->json(['result' => false, 'error' => 'No such Account found.'], 200);
        }
        else if($acc->Password == $input) {
            return response()->json(['result' => false, 'error' => 'Password should not like old passsword.'], 200);
        }
    
        $acc->Password = $input;
        $acc->save();
    
        return response()->json(['result' => true], 200);
    }

    public function flushSession() {
    Session::flush();
    return redirect()->route('main');
    }

    public function refMd5(Request $request) {
        $data = $request->input('data');
        return response()->json(['result' => true, 'message' => md5($data)]);
    }
}
