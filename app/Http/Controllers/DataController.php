<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Foto;
use App\Models\LikeFoto;
use App\Models\CommentFoto;
use App\Models\Album;

use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\File;

class DataController extends Controller
{
    public function listFoto(Request $request)
    {
        $key = Session::get('key');
        $whatuserid = $request->input('id');
        
        if (preg_match('/^\d+$/', $whatuserid)) {
            $column = 'UserID';
        } elseif (strpos($whatuserid, '@') === 0) {
            $column = 'Username';
            $whatuserid = substr($whatuserid, 1); // Remove the '@' symbol
        } else {
            // Handle the case where the input is neither a number nor starts with '@'
            // You can either throw an error or set a default value for $column
            $column = 'Username';
        }

        if($whatuserid <= 0 && $whatuserid) {
            return response('', 500);
        }
        
        $acc = !$whatuserid ? Account::where('Kunci', $key)->first() : Account::where($column, $whatuserid)->first();
    
        if (!$acc) {
            // Handle the case where the account is not found
            return response()->json([
                'user' => null,
                'gallery' => null
            ]);
        }
    
        $data = [];
    
        $albums = Album::where('UserID', $acc->UserID)->get();
    
        $totallikeCount = LikeFoto::where('UserID', $acc->UserID)->count();
        $totalcommentCount = CommentFoto::where('UserID', $acc->UserID)->count();
    
        foreach ($albums as $album) {
            $likeCount = 0;
            $commentCount = 0;
    
            $fotos = Foto::where('AlbumID', $album->AlbumID)->where('UserID', $acc->UserID)->get();
            $whotheaccount = Account::where('UserID', $album->UserID)->first();
            foreach($fotos as $foto) {
                $likeCount += LikeFoto::where('FotoID', $foto->FotoID)->count();
                $commentCount += CommentFoto::where('FotoID', $foto->FotoID)->count();
            }
            $data[] = [
                'album' => [
                    'data' => $album,
                    'stats' => [
                        'like' => $likeCount,
                        'comment' => $commentCount,
                        'username' => '@' . $whotheaccount->Username
                    ]
                ],
                'fotos' => $fotos,
            ];
        }
        return response()->json([
            'user' => [
                'username' => '@' . $acc->Username,
                'name' => $acc->NamaLengkap,
                'userid' => $acc->UserID,
                'session' => session()->getId(),
                'key' => $acc->Kunci,
                'data' => [
                    'total_like' => $totallikeCount,
                    'total_comment' => $totalcommentCount
                ]
            ],
            'gallery' => Album::where('UserID', $acc->UserID)->get()->isEmpty() ? [] : $data
        ]);
    }

    public function listFotoPublic()
    {
        $albums = Album::get();
        $data = [];
    
        foreach ($albums as $album) {
            $likeCount = 0;
            $commentCount = 0;

            $fotos = Foto::where('AlbumID', $album->AlbumID)->get();
            $whotheaccount = Account::where('UserID', $album->UserID)->first();
            foreach($fotos as $foto) {
            $likeCount += LikeFoto::where('FotoID', $foto->FotoID)->count() > 0 ? LikeFoto::where('FotoID', $foto->FotoID)->count() : 0;
            $commentCount += CommentFoto::where('FotoID', $foto->FotoID)->count() > 0 ? CommentFoto::where('FotoID', $foto->FotoID)->count() : 0;

            $itsLike = null;
            $tempLike = null;

            if (Session::has('key')) {
                $userID = Account::where('Kunci', Session::get('key'))->first()->UserID;
                foreach ($fotos as $findlikefoto) {
                    $itsLike = LikeFoto::where('FotoID', $findlikefoto->FotoID)
                                ->where('UserID', $userID)
                                ->exists();
                
                    if ($itsLike) {
                        break; // Exit the loop if a like is found
                        }
                    }                
                }            
            }
            $data[] = [
                'album' => [
                    'data' => $album,
                    'stats' => [
                        'like' => $likeCount,
                        'comment' => $commentCount,
                        'username' => '@' . $whotheaccount->Username
                    ],
                    'current_session_itsLike' => $itsLike !== null ? $itsLike : null
                ],
                'fotos' => $fotos,
            ];
        }
        return response()->json([
            'gallery' => $data
        ]);
    }

    public function likeFoto(Request $request) {
        if (!session()->has('key')) {
            return response('', 403);
        }

        if ($request->isMethod('POST')) {
            $albumid = $request->input('id');
        
            $user = Account::where('Kunci', Session::get('key'))->first();
            if (!$user) {
                return response('', 403);
            }
        
            $foto = Foto::where('AlbumID', $albumid)->first();
            if (!$foto) {
                return response('', 404);
            }
        
            $likeFoto = LikeFoto::where('FotoID', $foto->FotoID)
            ->where('UserID', $user->UserID)
            ->first();
        
        if ($likeFoto) {
            // User has already liked this foto, delete the like
            try {
                $likeFoto->delete();
                return response()->json(['result' => true, 'message' => 'Like removed'], 200);
            } catch (\Exception $e) {
                return response()->json(['result' => false, 'error' => $e->getMessage()], 200);
            }
        } else {
            // User hasn't liked this foto, create a new like
            $likeFoto = new LikeFoto();
            $likeFoto->FotoID = $foto->FotoID;
            $likeFoto->UserID = $user->UserID;
        
            try {
                $likeFoto->save();
                return response()->json(['result' => true, 'message' => 'Like added'], 200);
            } catch (\Exception $e) {
                return response()->json(['result' => false, 'error' => $e->getMessage()], 200);
                }
            }
        }
    }

    public function getDataComment(Request $request) {
        if (!session()->has('key')) {
            return response('', 403);
        }

        if(!$request->input('id')) {
            return response('', 404);
        }

        if ($request->isMethod('GET')) {
            $albumid = $request->input('id');

            // Retrieve the first photo associated with the given album ID
            $fotos = Foto::where('AlbumID', $albumid)->first();
            
            if ($fotos) {
                // If a photo is found, return its ID
                $comments = CommentFoto::where('FotoID', $fotos->FotoID)->get();
                $listcomment = [];
                foreach($comments as $comment) {
                    $users = Account::where('UserID', $comment->UserID)->select('Username', 'NamaLengkap')->first();
                    $listcomment[] = [
                        'user' => $users,
                        'comment' => $comment
                    ];
                }
                return response()->json([
                    'result' => true,
                    'message' => $listcomment
                ], 200);
            } else {
                // If no photo is found, return a result indicating failure
                return response()->json(['result' => false], 200);
            }
        }
    }

    public function dataComment(Request $request) {
        if (!session()->has('key')) {
            return response('', 403);
        }

        if ($request->isMethod('POST')) {
        $text = $request->input('text');
        $userid = Session::get('userid');
        $fotoid = $request->input('id');

        if(!$text || !$fotoid) {
            return response('', 404);
        }
        
        $com = CommentFoto::where('UserID', $userid)->where('FotoID', $fotoid)->first();
        
        if($com) {
            return response()->json(['result' => false, 'message' => 'You have already commented', 'child' => $com->KomentarID]);
        }

        $comment = CommentFoto::insert([
            'FotoID' => $fotoid,
            'UserID' => $userid,
            'IsiKomentar' => $text
        ]);

        if($comment) {
            return response()->json(['result' => true]);
        }
    }
    else if ($request->isMethod('PATCH')) {
        $text = $request->input('text');
        $userid = Session::get('userid');
        $kid = $request->input('child');
    
        $com = CommentFoto::where('KomentarID', $kid)->where('UserID', $userid)->first();
    
        if ($com) {
            $com->IsiKomentar = $text;
            $com->save();

            return response()->json([
                'result' => true
            ]);
        } else {
            // Handle the case where the comment is not found
        }
    }
    else if ($request->isMethod('DELETE')) {
        $userid = Session::get('userid');
        $kid = $request->input('child');

        $com = CommentFoto::where('KomentarID', $kid)->where('UserID', $userid);

        if($com) {
        $com->delete();

        return response()->json([
            'result' => true
                ]);
            }
        }
    }

    public function dataAlbum(Request $request) {
        if (!session()->has('key')) {
            return response('', 403);
        }

        $title = $request->input('title');
        $desc = $request->input('desc');

        if(!$title || !$desc) {
            return response('', 404);
        }

        $album = Album::insert([
            'NamaAlbum' => $title,
            'Deskripsi' => $desc,
            'UserID' => Session::get('userid')
        ]);

        if($album) {
            return response()->json([
                'result' => true
            ]);    
        }
    }

    public function uploadMedia(Request $request) {
        // Check if session key exists
        if (!session()->has('key')) {
            return response('', 403);
        }
        
        // Get the uploaded file(s)
        $mediaFiles = $request->file('mediaInput');
    
        // Insert the album into the database
        $createalb = Album::create([
            'NamaAlbum' => $request->input('mediauser-title'),
            'Deskripsi' => $request->input('mediauser-desc'),
            'UserID' => session()->get('userid')
        ]);
    
        // Check if album creation was successful
        if ($createalb) {
            // Loop through each uploaded file
            foreach ($mediaFiles as $files) {
                // Get the MIME type of the uploaded file
                $mimeType = $files->getMimeType();
    
                // Determine whether it's an image or video and set destination
                if (strstr($mimeType, "image/")) {
                    $destinationPath = 'uploads/images'; // Folder for images
                } elseif (strstr($mimeType, "video/")) {
                    $destinationPath = 'uploads/videos'; // Folder for videos
                } else {
                    return response()->json([
                        'result' => false,
                        'error' => 'Unsupported File format.'
                    ]);
                }
    
                // Build the file path for storing in the 'cdn' folder
                $fileName = time() . '_' . $files->getClientOriginalName();
                $fileStorePath = './cdn/' . session()->get('key') . '/' . $createalb->AlbumID . '/' . $fileName;
    
                // Insert file information into the Foto table
                Foto::create([
                    'JudulFoto' => $request->input('whentypinguploadmediauser-name'),
                    'DeskripsiFoto' => $request->input('whentypinguploadmediauser-desc'),
                    'LokasiFile' => $fileStorePath,
                    'AlbumID' => $createalb->AlbumID,
                    'UserID' => session()->get('userid')
                ]);
    
                // Move the file to the public 'cdn' directory
                $files->move(public_path('cdn/' . session()->get('key') . '/' . $createalb->AlbumID), $fileName);
            }
    
            // Return success response
            return redirect()->back()->with('showalert', 'Successfull Posts.');
        }
    
        // Return error if album creation fails
        return redirect()->back()->with('showalert', 'Failed to Create Album.');
    }    

    public function findSearching(Request $request) {
        if (!session()->has('key')) {
            return response('', 403);
        }

        $listalbum = [];
    
        $albums = Album::get(); // Fetch all albums
        foreach ($albums as $album) {
            $photos = Foto::where('AlbumID', $album->AlbumID)->get(); // Fetch all photos in the album
    
            $listfoto = []; // Reset the photo list for each album
            if ($photos->isNotEmpty()) { // Check if there are any photos
                foreach ($photos as $photo) {
                    $listfoto[] = [
                        'Nama' => $photo->JudulFoto,
                        'Tanggal' => $photo->TanggalUnggah,
                        'Gambar' => $photo->LokasiFile,
                        'Uploader' => '@' . Account::where('UserID', $photo->UserID)->first()->Username
                    ];
                    break; //Cuma munculin sekali (biar apa? biarin.)
                }
            }
    
            $listalbum[] = [
                'Data' => $album,
                'Metadata' => $listfoto
            ];
        }
    
        return response()->json([
            'result' => true,
            'output_gallery' => $listalbum,
            'output_users' => Account::select('Username', 'NamaLengkap', 'UserID')->get()
        ]);
    }    

    public function requestActionAccount(Request $request) {
        if (!session()->has('key')) {
            return response('', 403);
        }
        
        if ($request->isMethod('POST')) {
        $data = $request->json()->all();
        $usn = $data['username'];
        $email = $data['email'];
        $pass = $data['password'];
        $name = $data['name'];
        $address = $data['address'];

        if(!$usn || !$email || !$pass || !$name || !$address) {
            return response('', 404);
        }

        $acc = Account::where('UserID', Session::get('userid'))->first();
        if(!$acc) {
            return response()->json([
                'result' => false,
                'error' => 'Account not found. Try log in back.'
            ]);
        }
        $acc->Username = $usn;
        $acc->Email = $email;
        $acc->Password = $pass;
        $acc->NamaLengkap = $name;
        $acc->Alamat = $address;
        $acc->Kunci = md5($email);
        $acc->save();

        Session::put('key', md5($email));

        return response()->json([
            'result' => true
        ]);
    }
        else if($request->isMethod('DELETE')) {
            $acc = Account::where('UserID', Session::get('userid'))->first();
            if(!$acc) {
                return response()->json([
                    'result' => false,
                    'error' => 'Account not found. Try log in back.'
                ]);
            }

            $acc->delete();

            $folderPath = public_path('cdn/' . Session::get('key'));
            if (File::exists($folderPath)) {
            File::deleteDirectory($folderPath);
            }

            return response()->json([
                'result' => true
            ]);
        }
    }

    public function requestActionAlbum(Request $request) {
        if($request->isMethod('POST')) {
        }
        else if($request->isMethod('DELETE')) {

        }
    }
}