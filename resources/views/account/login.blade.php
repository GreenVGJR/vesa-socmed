<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link rel="stylesheet" href="{{ asset('asset_css/account.css') }}">
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Jua&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
   <link rel="prefetch">
   <title>Login</title>
</head>
<noscript>
   Please enable JavaScript in your browser for be able working as well.
</noscript>
<body>
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
   <section id="container"> 
      <video id="video-bg" autoplay muted loop>
         <source src="{{ asset('asset_media/bg.mp4') }}" type="video/mp4">
         Your browser does not support HTML5 video.
     </video>
      <div id="th-container">
      <div id="thf-container">
      <p id="webtitle">vesa</p>
      <p id="webdesc"></p>
   </div><br><br>
   <form action="./api/account" method="GET" id="sforms">
   <p>Email</p>
   <input type="text" style="display: none;" name="type" value="login">
   <input type="email" name="email" placeholder="name@domain" required>
   <p>Password</p>
   <input type="password" name="pass" required>
   <input type="submit" id="formsubmit" onclick="getFormData()">
   <p style="font-size: 0.8rem; font-weight: 400;">Don't have account? <a href="#register" style="outline: none; text-decoration: none; color: lightcoral;">Create one!</a></p>
   <a href="#forgotpass" style="font-family: 'Poppins'; font-size: 0.8rem; margin-top: -0.5rem; outline: none; text-decoration: none; color: rgb(128, 133, 240);">Forgot Password?</a>
   </form>
   </div>
   </section>
</body>
<script>console.log("Getting Package Load.");</script>
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script src="{{ asset('asset_script/login.js') }}"></script>
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
</html>