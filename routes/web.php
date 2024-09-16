<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginAccount;
use App\Http\Controllers\PageController;
use App\Http\Controllers\DataController;
use App\Http\Controllers\SQLCheck;

//API
Route::get('/api/account', [LoginAccount::class, "login"])->name('inputacc'); //Login
Route::get('/api/account/reset', [LoginAccount::class, "changePassAcc"])->name('changepassacc'); //Forgot Password
Route::get('/api/check', [SQLCheck::class, "check"])->name('checksql'); //Check SQL
Route::get('/api/reset/session', [LoginAccount::class, "flushSession"])->name('flush-session'); //Logout

Route::get('/api/ulitity/md5', [LoginAccount::class, "refMd5"])->name('refMd5'); //Convert String to Crypto Hash

Route::get('/api/storage/galeri', [DataController::class, "listFoto"])->name('listfoto'); //Current Login
Route::get('/api/storage/galeri/public', [DataController::class, "listFotoPublic"])->name('listfotopublic'); //Public, for FYP.

Route::post('/api/post/request/like', [DataController::class, "likeFoto"])->name('doLikeFoto'); //Liking Foto's someone
Route::get('/api/get/request/comment', [DataController::class, "getDataComment"])->name('getDataComment'); //Get current list Comments
Route::post('/api/post/request/comment', [DataController::class, "dataComment"])->name('doDataComment'); //Create Comment
Route::patch('/api/post/request/comment', [DataController::class, "dataComment"])->name('editComment'); //Edit Comment
Route::delete('/api/post/request/comment', [DataController::class, "dataComment"])->name('deleteComment'); //Delete Comment

Route::get('/api/post/request/album', [DataController::class, "dataAlbum"])->name('dataAlbum'); //Create Album
Route::post('api/post/upload-media', [DataController::class, 'uploadMedia'])->name('uploadmedia'); //Upload Media to Album

Route::get('/api/get/request/search', [DataController::class, "findSearching"])->name('findSearching'); //Search Users / Posts

Route::post('/api/post/request/account', [DataController::class, "requestActionAccount"])->name('requestActionAccount'); //Update Account
Route::delete('/api/post/request/account', [DataController::class, "requestActionAccount"])->name('deleteActionAccount'); //Delete Account

Route::post('/api/post/request/album', [DataController::class, "requestActionAlbum"])->name('requestActionAlbum'); //Edit Album
Route::delete('/api/post/request/album', [DataController::class, "requestActionAlbum"])->name('deleteActionAlbum'); //Delete Album

/*
TYPE METHOD

GET      :: Retrieve Data.
POST     :: Create's / Update's Data. (depends condition)
PATCH    :: Update's Data. (alternative)
DELETE   :: Delete's Data.

*/

//Website
Route::get('/', [PageController::class, "login"])->name('main');
/*
- Login Page
- Register Page
- Forgot Password's Page
- Main -> [FYP, History, Your Profile]
*/