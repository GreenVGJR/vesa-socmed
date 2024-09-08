<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <meta name="csrf-token" content="{{ csrf_token() }}">
   <link href="https://fonts.googleapis.com/css2?family=Jua&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
   <link rel="stylesheet" href="{{ asset('asset_css/main.css') }}">
   <link rel="prefetch">
   <title>Vesa</title>
</head>
<body>
   <!-- Pop-Up Comments -->
   <div id="commentusercontainer">
      <div style="width: 100%; height: 30vh; overflow: hidden;">
      <div class="commentuser-image"></div>
      <div style="display: flex; align-items: center; justify-content: center; height: 80%; flex-direction: column; font-family: 'Jua'; font-size: 3rem; animation: loop-fade 2s infinite linear;">
         <p style="color: white;">vesa</p>
         <p style="font-family: 'Poppins'; font-size: 1rem; font-weight: 400; color: gray; margin-top: -1vh;">loading</p>
         </div>
      </div>
      <div class="listcommentuser">
      </div>
      <div id="listcommentar">
      <input type="text" name="commentinguser" placeholder="Comment Here..">
      <img src="./asset_media/send.png" alt="Send" onclick="pushcomments(this)"/>
      </div>
   </div>
   <!-- Action Alerts -->
   <div id="animate-alert">
      <p>Content</p>
      <div class="line-animate-alert"></div>
   </div>
   <!-- Pop-Up Alerts -->
   <div id="popup-alert">
      <p>Edit Comment</p>
      <div id="line-popup-alert"></div>
      <p>Delete Comment</p>
   </div>
   <div id="custom-alert">
   <p>Fetching..</p>
   </div>
   <!-- Create Posts -->
   <form action="{{ route('uploadmedia') }}" method="POST" enctype="multipart/form-data" id="formstore-mediauser">
   @csrf
   <div id="uploadmediauser">
      <div id="container-uploadmediauser">
         <div>
         <div id="media-uploadmediauser" onclick="editcontainermediauser(this)">
         <div class="slider-media-uploadmediauser"></div>
         <p>Click to Edit Image</p>
         </div>
         <button type="button" onclick="triggerFileUpload()" class="uploadmedia">Upload Media</button>
         <input type="file" name="mediaInput[]" id="mediaInput" accept="image/*,video/*" multiple style="display: none;" />         
         <button type="button" onclick="document.getElementsByClassName('slider-media-uploadmediauser')[0].innerHTML = null; cachestoreuploadmediauser = null; document.getElementById('mediaInput').value = '';" class="deletemedia">Delete Media</button>
         </div>
      <div id="album-uploadmediauser">
         <p>Title</p>
         <input type="text" name="mediauser-title" required>
         <p>Description</p>
         <input type="text" name="mediauser-desc" required>
         <button type="button" onclick="createalbum()">Submit</button>
         </div>
      </div>
   <div id="preview-uploadmediauser">
      <div id="image-preview-uploadmediauser">
      </div>
      <br>
      <p>Nama</p>
      <input type="text" name="whentypinguploadmediauser-name">
      <p>Description</p>
      <input type="text" name="whentypinguploadmediauser-desc">
      </div>      
   </div>
   </form>
   <!-- Edit Accounts -->
   <div id="uploadprofileuser">
      <div id="preview-uploadprofileuser">
      <p>Username</p>
      <input type="text" name="inputusername" required>
      <p>Email</p>
      <input type="email" name="inputemail" placeholder="Fill in here.." required>
      <p>Password</p>
      <input type="password" name="inputpass" placeholder="Fill in here.." required>
      <p>Your Name</p>
      <input type="text" name="inputname" required>
      <p>Address</p>
      <input type="text" name="inputaddress" placeholder="Fill in here.." required>
      <button type="button" style="background-color: lightgreen;">Submit</button><br><br>
      <button type="button" style="background-color: rgb(250, 135, 135);">Delete Account</button>
      </div>
   </div>
   <div id="whatiscontentview">
      <div id="post-whatiscontentview">
         <p>text</p>
         <div class="slider-media-uploadmediauser" style="width: 100%; border-radius: 0.5rem;">
         </div>
         <div style="display: flex; justify-content: space-between; width: 100%; font-size: 0.8rem;">
         <p>@</p>
         <p>1970-01-01</p>
         </div>
         <br>
         <div class="listcomment">
         
         </div>
      </div>
   </div>
   <!-- Loading Screen -->
   <div id="start-loading">
      <div id="sec-start-loading">
         <p id="webtitle">vesa</p>
      </div>
   </div>
   <div id="preloader">
   <div id="preloader-fetch">
   <img src="{{ asset('asset_media/1490.png') }}" loading="eager"/>
   <p id="preloader-fetch-text">Loading</p>
   </div>
   </div>
   <!-- Main Element Contents -->
   <div id="contents">
      <div id="navbar">
         <p id="webtitlefornav">vesa</p>
      </div>
      <!-- Actions -->
      <div id="content-container">
         <div class="action-content-container">
         <p id="currentselectionaction" onclick="outboundchildprocess(0, this)">FYP</p>
         <p id="exceptselectionaction" onclick="outboundchildprocess(1, this)">History</p>
         <p id="exceptselectionaction" onclick="outboundchildprocess(2, this)">Your Profile</p>
         <p id="accountname">Welcome back,<br>(name).</p>
         <p style="color:rgb(61, 43, 179); font-weight: bold; font-size: 0.8rem;" class="whenhovering" onclick="logout();">Log Out</p>
         <p style="font-size: 0.7rem; bottom: 7%; position: absolute;">Created by,<br><a href="https://github.com/GreenVGJR/" style="color: lime;">GreenVGJR</a> :3</p>
         </div>
      <!-- Contents -->
         <div class="action-content-container">
            <div id="list-search-container">
               <p>Users</p>
               <div class="users-search-cont">
                  <p>No results found.</p>
               </div>
               <p>Posts</p>
               <div class="posts-search-cont">
                  <p>No results found.</p>
               </div>
            </div>
            <div class="search-content">
               <input type="text" name="typesearch" placeholder="Search..">
            </div>
            <br>
            <div id="list-content-user">
               <div style="display: flex; align-items: center; justify-content: center; height: 80%; flex-direction: column; font-family: 'Jua'; font-size: 3rem; animation: loop-fade 2s infinite linear;">
               <p>vesa</p>
               <p style="font-family: 'Poppins'; font-size: 1rem; font-weight: 400; color: gray; margin-top: -1vh;">loading</p>
               </div>
            </div>
         </div>
      <!-- Recent Your Posts -->
         <div class="action-content-container">
            <p style="font-weight: bold; font-size: 1rem;">Recent Posts</p>
            <p style="font-size: 0.8rem;">Loading</p>
         </div>
      </div>
   </div>
   <!-- Footer -->
   <footer style="color: gray; text-align: center;font-size: 0.7rem; margin-top: 1rem;">
      <p>Vesa. Connect to people's for History.</p>
   </footer>
   <!-- End Elements Contains -->
</body>
<script>console.log("Getting Package Load.");</script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
   function triggerpoperror(error) {
      document.getElementById('sec-start-loading').innerHTML = null;
      document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
      const p1 = document.createElement('p');
      const p2 = document.createElement('p');
      p1.textContent = 'something just happened. check your browser console.';
      p2.textContent = 'Content Error: ' + error;
      p1.style.color = 'lightcoral';
      p2.style.color = 'gray';
      p2.style.fontFamily = 'Poppins';
      document.getElementById('sec-start-loading').appendChild(p1);
      document.getElementById('sec-start-loading').appendChild(p2);
   }
   
   try {
     if (axios && axios.defaults) {
       console.log('Axios loaded.');
     } else {
      console.log('Failed to load Axios.');
      triggerpoperror('Network Issue.');
     }
   } catch (error) {
      triggerpoperror(error);
     console.error("Error: " + error);
   }
   </script>
@if(!Session::has('username'))
<script>
window.location = '{{ route('flush-session') }}';
</script>
@else
<script>
document.getElementById('accountname').innerHTML = 'Welcome back,<br>{{ Session::get('username') }}';

const whatmyuserid = {{ Session::get('userid') }};
const whatmyusername = "{{ Session::get('username') }}";

function requestupdatedata(type, url, data) {
  if (type.toLowerCase() === 'post') {
    return axios.post(url, data).then(response => response.data).catch(error => error.error);
  } else {
    return axios[type](url).then(response => response.data).catch(error => error.error);
  }
}
</script>
<script src="{{ asset('asset_script/main.js') }}"></script>
@endif
@if(session('showalert'))
<script>
pushalert(true);
</script>
@endif
</html>