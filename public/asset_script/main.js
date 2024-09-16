window.addEventListener('focus', async function() {
   const req = await fetch('api/storage/galeri/');
   const res = await req.json();
   if(res.user === null) {
   popupalert('Getting you back..', 'green');
   window.location = './api/reset/session';
   }
});

document.addEventListener('keydown', (event) => {
   if (event.ctrlKey && event.key === 'r') {
     event.preventDefault();
     document.documentElement.innerHTML = null;
     window.location.reload();
   }
});

function whendouseractions(type, element) {
   let listenersAdded = false;

   if (type === 'image') {
      if (!document.fullscreenElement) {
         element.requestFullscreen ? element.requestFullscreen() : 
         element.webkitRequestFullscreen ? element.webkitRequestFullscreen() : 
         element.mozRequestFullScreen ? element.mozRequestFullScreen() : 
         element.msRequestFullscreen && element.msRequestFullscreen();
         element.style.borderRadius = 0;
         element.addEventListener('fullscreenchange', function removelkst() {
            if (!document.fullscreenElement) {
               element.removeEventListener('fullscreenchange', removelkst);
            }
         });
      } else {
         document.exitFullscreen ? document.exitFullscreen() : 
         document.webkitExitFullscreen ? document.webkitExitFullscreen() : 
         document.mozCancelFullScreen ? document.mozCancelFullScreen() : 
         document.msExitFullscreen && document.msExitFullscreen();
      }
   }
   else if (type === 'video') {
      if (!listenersAdded) {
         element.play();
         element.controls = false;
         console.log("test");

         element.addEventListener('mouseleave', function handleMouseLeave() {
            element.controls = true;

            element.removeEventListener('mouseleave', handleMouseLeave);
            element.removeEventListener('contextmenu', handleContextMenu);
            element.removeEventListener('click', handleClick);
            element.removeEventListener('fullscreenchange', handleFullscreenChange);
            
            listenersAdded = false;  // Reset the flag
         });

         function handleContextMenu(event) {
            event.preventDefault();
            return false;
         }

         function handleClick(event) {
            event.preventDefault();  // Prevent the default pause behavior
            if (element.muted) { 
               element.muted = false;
            }
            element.controls = true;    // Enable controls
            element.play();             // Ensure the video continues playing
         }

         function handleFullscreenChange() {
            element.style.borderRadius = 0;
            if (!document.fullscreenElement) {
               element.style.borderRadius = '1rem';
            }
         }

         function handleExitFullscreen() {
            document.exitFullscreen();
         }

         element.addEventListener('contextmenu', handleContextMenu);
         element.addEventListener('click', handleClick);

         listenersAdded = true;
      }
   }
}

function getCurrentDate() {
   const today = new Date();
   const year = today.getFullYear();
   const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
   const day = String(today.getDate()).padStart(2, '0');
   return `${year}-${month}-${day}`;
}

function clearcontentcont() {
   const putcontent = document.getElementById('list-content-user');
   putcontent.innerHTML = null;
}

function listactivity(source, thumbnail, text, userid) {
   let act = JSON.parse(localStorage.getItem('activity')) || [];
   const currentDate = getCurrentDate();

   const newact = {
      "source": source,
      "thumbnail": thumbnail,
      "text": text,
      "userid": userid,
      "date": currentDate
   };

   act.push(newact);

   localStorage.setItem('activity', JSON.stringify(act));
}

function uploadcontenthr(type, title, sourcefile, author, date, like, comment, idGallery, liking) {
const container = document.getElementById('list-content-user');

const userContent = document.createElement('div');
userContent.className = 'content-user';

const p1 = document.createElement('p');
p1.style.paddingBottom = '1vh';
p1.textContent = title;
userContent.appendChild(p1);

if(type === 'image') {
   const imageSlider = document.createElement('div');
   imageSlider.style.display = 'flex';
   imageSlider.style.alignItems = 'center';
   imageSlider.style.overflowX = 'auto'; // allow horizontal scrolling
   imageSlider.style.whiteSpace = 'nowrap'; // prevent images from wrapping to next line
   imageSlider.style.borderRadius = '1rem';
   imageSlider.setAttribute('identify', '#Posts/' + author + '/' + idGallery);
   
   // Add multiple images to the slider
   const images = sourcefile;
   images.forEach((source) => {
     const img = document.createElement('img');
     img.src = source.LokasiFile;
     img.setAttribute('onclick', `whendouseractions('image', this)`);
     img.style.display = 'inline-block'; // make images display inline
     img.style.width = '500px'; // Adjust the width to match your desired size
     img.style.maxHeight = '300px'; // Adjust the height to match your desired size
     img.loading = 'lazy';
     img.style.visibility = 'hidden'; // Set initial visibility to hidden
     img.addEventListener('load', () => {
     img.style.visibility = 'visible'; // Set visibility to visible when loaded
     }, { once: true });
     imageSlider.appendChild(img);
   });
   
   userContent.appendChild(imageSlider);
}
else if(type === 'video') {
   const video = document.createElement('video');
   const sourcing = document.createElement('source');
   sourcing.src = sourcefile;
   sourcing.type = 'video/mp4'; // specify the video type
   video.appendChild(sourcing);
   video.id = 'video-bg';
   video.setAttribute('identify', '#Posts/' + author + '/' + idGallery);
   video.setAttribute('onclick', "whendouseractions('video', this)");
   video.style.borderRadius = '1rem';
   userContent.appendChild(video);
}

const p2 = document.createElement('p');
p2.style.paddingBottom = '2vh';
p2.style.fontSize = '0.8rem';
const a = document.createElement('a');
a.href = '#';
a.setAttribute('onclick', `window.open('#Pages/Profile/${author}', '_blank')`);
a.style.textDecoration = 'none';
a.textContent = author;
p2.appendChild(a);
p2.appendChild(document.createTextNode(' | ' + date));
userContent.appendChild(p2);

const flexContainer = document.createElement('div');
flexContainer.style.display = 'flex';
flexContainer.style.gap = '3rem';

const likeContainer = document.createElement('div');
likeContainer.style.display = 'flex';
likeContainer.style.gap = '1rem';

const likeImg = document.createElement('img');
likeImg.src = !liking ? './asset_media/like_off.png' : './asset_media/like_on.png';
likeImg.style.filter = 'invert(100%)';
likeImg.style.margin = 'auto';
likeImg.style.width = '24px';
likeImg.style.minHeight = 'auto';
likeImg.setAttribute('onclick', `
   requestupdatedata('POST', './api/post/request/like', { 'id': '${idGallery}' });
   const likeCountElement = document.querySelector('#slft_like-${idGallery}');
   let currentLikeCount = parseInt(likeCountElement.textContent, 10);
   
   if (this.src.includes('off')) {
       this.src = './asset_media/like_on.png';
       likeCountElement.textContent = currentLikeCount + 1;
       popupalert('You Liked this Post.', 'green');
       listactivity('./#Posts/${author}/${idGallery}', '${sourcefile[0].LokasiFile}', 'You Liked this Post.', ${whatmyuserid});
   } else {
       this.src = './asset_media/like_off.png';
       likeCountElement.textContent = currentLikeCount - 1;
       popupalert('Removed Like from this Post.', 'green');
      listactivity('./#Posts/${author}/${idGallery}', '${sourcefile[0].LokasiFile}', 'You Remove Like this Post.', ${whatmyuserid});
   }
`);

likeContainer.appendChild(likeImg);

const likeP = document.createElement('p');
likeP.textContent = like;
likeP.id = 'slft_like-' + idGallery;
likeContainer.appendChild(likeP);

flexContainer.appendChild(likeContainer);

const commentContainer = document.createElement('div');
commentContainer.style.display = 'flex';
commentContainer.style.gap = '1rem';

const commentImg = document.createElement('img');
commentImg.src = './asset_media/comments.png';
commentImg.style.filter = 'invert(100%)';
commentImg.style.margin = 'auto';
commentImg.style.width = '24px';
commentImg.style.minHeight = 'auto';
commentImg.setAttribute('onclick', `popupcomment(${idGallery})`);
commentContainer.appendChild(commentImg);

const commentP = document.createElement('p');
commentP.textContent = comment;
commentContainer.appendChild(commentP);

flexContainer.appendChild(commentContainer);

const copyContainer = document.createElement('div');
copyContainer.style.display = 'flex';
copyContainer.style.gap = '0.5rem';

const copyImg = document.createElement('img');
copyImg.src = './asset_media/copy.png';
copyImg.style.filter = 'invert(100%)';
copyImg.style.margin = 'auto';
copyImg.style.width = '24px';
copyImg.style.minHeight = 'auto';
copyImg.setAttribute('onclick', `clipboard('${window.location.origin + window.location.pathname}#Posts/${author}/${idGallery}')`);
copyContainer.appendChild(copyImg);

const copyP = document.createElement('p');
copyP.textContent = 'Copy Link';
copyContainer.appendChild(copyP);

flexContainer.appendChild(copyContainer);

userContent.appendChild(flexContainer);

container.appendChild(userContent);
}

function clipboard(text) {
   // Create a temporary textarea element to hold the text
   const textarea = document.createElement('textarea');
   textarea.value = text;
   document.body.appendChild(textarea);
   
   // Select the text in the textarea
   textarea.select();
   textarea.setSelectionRange(0, textarea.value.length); // For mobile devices
   
   // Execute the copy command
   try {
       document.execCommand('copy');
       popupalert('Copied!', 'green');
   } catch (err) {
       popupalert('Failed to Copy.', 'red');
   }
   
   // Remove the temporary textarea element
   document.body.removeChild(textarea);
}

function allowavideo() {
}

function pushalert(whenselection) {
   
   const queryString = window.location.search;
   const urlParams = new URLSearchParams(queryString);
   const success = urlParams.get('success');
   
   if (success === 'true' || whenselection === true) {
      window.history.pushState(null, null, './');
      document.getElementById('animate-alert').style.display = 'block';
      document.getElementsByClassName('line-animate-alert')[0].style.backgroundColor = 'lime';
      document.getElementById('animate-alert').querySelector('p').textContent = success ? 'Successful Login.' : 'Successful Posts.';
      document.getElementsByClassName('line-animate-alert')[0].style.animation = 'line-collapse 3s forwards';
      setTimeout(function() {
         document.getElementById('animate-alert').style.animation = 'showalert 1s forwards ease-out';
         document.getElementById('animate-alert').querySelector('p').style.animation = 'collapse-text 1s forwards ease-out';
         setTimeout(function() {
            document.getElementById('animate-alert').style.display = 'none';
            document.getElementById('animate-alert').style.animation = null;
            document.getElementById('animate-alert').querySelector('p').style.animation = null;
            document.getElementsByClassName('line-animate-alert')[0].style.animation = null;
         }, 1000)
      }, 3000);
   }
}

function popupalert(stringtext, color) {
   const alertElement = document.getElementById('animate-alert');
   const lineElement = document.getElementsByClassName('line-animate-alert')[0];
   const alertTextElement = alertElement.querySelector('p');

   // Set initial styles and content
   alertElement.style.display = 'block';
   lineElement.style.backgroundColor = color;
   alertTextElement.textContent = stringtext;

   // Reset animations by setting animation to 'none' first
   alertElement.style.animation = 'none';
   lineElement.style.animation = 'none';

   // Force reflow to reset the animation
   void alertElement.offsetWidth; // Triggers reflow
   void lineElement.offsetWidth;  // Triggers reflow

   // Reapply animations with delay
   alertElement.style.animation = 'popup-alert 250ms forwards ease-out, fading-out 500ms 2s forwards ease-out';
   lineElement.style.animation = 'line-collapse 2s forwards';

   let boolcheck = false;
   // Event listener for alert animation end
   alertElement.addEventListener('animationend', function secendpopalert(event) {
       // Check if the 'fading-out' animation ended
       if (event.animationName === 'fading-out') {
           alertElement.style.display = 'none';
           // Clean up: remove event listeners to prevent memory leaks
           alertElement.removeEventListener('animationend', secendpopalert);
       }
       else {
         boolcheck = true;
       }
   }, { once: boolcheck }); // Ensures the listener is removed after being called
}

function showCustomAlert(text1, text2, eventHandler1, eventHandler2) {
   const alertContainer = document.getElementById('popup-alert');
   if (!alertContainer) {
     console.error("Element with id 'popup-alert' not found.");
     return;
   }
 
   const paragraphs = alertContainer.querySelectorAll('p');
   if (paragraphs.length < 2) {
     console.error("Not enough paragraph elements found.");
     return;
   }
 
   alertContainer.style.display = 'flex';
   alertContainer.style.animation = 'popup-alert 500ms forwards ease-out';
 
   paragraphs[0].textContent = text1;
   paragraphs[0].setAttribute('onclick', eventHandler1);
 
   paragraphs[1].textContent = text2;
   paragraphs[1].setAttribute('onclick', eventHandler2);

   let boolcheck = false;

   document.addEventListener('click', function doremoveactioncommect(event) {
      if (!alertContainer.contains(event.target)) {
         boolcheck = true;
         alertContainer.style.animation = 'closecomment 400ms forwards ease-out, fading-out 300ms forwards ease-out';
         setTimeout(function() {
         document.removeEventListener('click', doremoveactioncommect); 
         pushcontents();
         alertContainer.style.display = 'none';
            }, 400);         
      }
   }, { once: boolcheck })
 }

 function secondShowCustomAlert(text1, text2, eventHandler1, eventHandler2) {
   const alertContainer = document.getElementById('album-popup-alert');
   if (!alertContainer) {
     console.error("Element with id 'popup-alert' not found.");
     return;
   }
 
   const paragraphs = alertContainer.querySelectorAll('p');
   if (paragraphs.length < 2) {
     console.error("Not enough paragraph elements found.");
     return;
   }
 
   alertContainer.style.display = 'flex';
   alertContainer.style.animation = 'popup-alert 500ms forwards ease-out';
 
   paragraphs[0].textContent = text1;
   paragraphs[0].setAttribute('onclick', eventHandler1);
 
   paragraphs[1].textContent = text2;
   paragraphs[1].setAttribute('onclick', eventHandler2);

   let boolcheck = false;

   document.addEventListener('click', function doremoveactioncommect(event) {
      if (!alertContainer.contains(event.target)) {
         boolcheck = true;
         alertContainer.style.animation = 'fading-out 300ms forwards ease-out';
         setTimeout(function() {
         document.removeEventListener('click', doremoveactioncommect); 
         alertContainer.style.display = 'none';
            }, 300);         
      }
   }, { once: boolcheck })
 }

function identifyMediaType(fileUrl) {
   const fileExtension = fileUrl.split('.').pop().toLowerCase();
   const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'flv'];
   const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
 
   if (videoExtensions.includes(fileExtension)) {
     return 'video';
   } else if (imageExtensions.includes(fileExtension)) {
     return 'image';
   } else {
     return 'unknown';
   }
 }

 const cachecontcommentuser = document.getElementById('commentusercontainer').innerHTML;

 
 function findcommentarget(event) {
   const commentContainer = document.getElementById('commentusercontainer');
   const actionContainer = document.getElementById('popup-alert');
   const target = event.target;

   // Correct check for image src
   const commentImage = document.querySelector('img[src="./asset_media/comments.png"]');

   if(commentImage.contains(target)) {
      document.removeEventListener('click', findcommentarget);
   }
   
   // Check if the click was outside the comment container and not on the image or action container
   if (!commentContainer.contains(target) && !commentImage.contains(target) && !actionContainer.contains(target)) {
       // Play close animation and hide the container after animation
       commentContainer.style.animation = 'closecomment 400ms forwards ease-out';
       document.removeEventListener('click', findcommentarget);
       setTimeout(() => {
           commentContainer.style.display = 'none';
       }, 400); // Matches the animation duration
   }
}

 async function actioncommentarget(event) {

 }

 async function popupcomment(idgallery) {
   document.getElementById('commentusercontainer').style.display = 'flex';
   document.getElementById('commentusercontainer').style.animation = 'showcomment 500ms forwards ease-out';
   document.getElementById('commentusercontainer').innerHTML = cachecontcommentuser;
   let storefotoid;
   let storealbumid;

   document.getElementById('custom-alert').style.display = 'block';
   document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';

   try {
       const response = await fetch('./api/storage/galeri/public');
       const gallery = await response.json();
       const pushcontent = gallery.gallery;

       // Find the first item that matches the condition
       const matchingContent = pushcontent.find(triggercontent => triggercontent.album.data.AlbumID === parseInt(idgallery));

       if (matchingContent) {
           document.getElementsByClassName('commentuser-image')[0].innerHTML = null;
           if(identifyMediaType(matchingContent.fotos[0].LokasiFile) === 'image') {
           const image = document.createElement('img');
           image.src = matchingContent.fotos[0].LokasiFile;
           image.alt = matchingContent.fotos[0].JudulFoto;
           storefotoid = matchingContent.fotos[0].FotoID;
           storealbumid = matchingContent.album.data.AlbumID;
           document.getElementsByClassName('commentuser-image')[0].appendChild(image);
           }
           else if(identifyMediaType(matchingContent.fotos[0].LokasiFile) === 'video') {
            const video = document.createElement('video');
            const sourcing = document.createElement('source');
            sourcing.src = matchingContent.fotos[0].LokasiFile;
            sourcing.type = 'video/mp4'; // specify the video type
            video.appendChild(sourcing);
            video.controls = true;
            storefotoid = matchingContent.fotos[0].FotoID;
            storealbumid = matchingContent.album.data.AlbumID;
            document.getElementsByClassName('commentuser-image')[0].appendChild(video);         
           } 

           
           document.getElementById('commentusercontainer').querySelector('img[alt="Send"]').setAttribute('fotoid', `${storefotoid}`);
           document.getElementById('commentusercontainer').querySelector('img[alt="Send"]').setAttribute('albumid', `${storealbumid}`);
           const response2 = await fetch('./api/get/request/comment?id=' + idgallery);
           document.querySelector(".listcommentuser").innerHTML = null;
           const comment = await response2.json();
           const listcomment = comment.message;
           if(listcomment == '') {
               document.addEventListener('click', findcommentarget);
               document.querySelector(".listcommentuser").innerHTML = `<p style="font-size: 0.8rem; padding: 10px; color: white;">be the first comment!</p>`;
           }
           else {
           document.addEventListener('click', findcommentarget);
           listcomment.forEach((putc) => {
            createComment(putc.user.Username, putc.comment.IsiKomentar, putc.comment.TanggalKomentar, ".listcommentuser");
            });
         }
       }
       else {
         popupalert(`No such gallery(${idgallery}) found.`, 'red');
       }
   } catch (error) {
       console.error(error);
   }
   document.getElementById('custom-alert').style.animation = 'fading-out 500ms forwards';
   setTimeout(function() {
      document.getElementById('custom-alert').style.display = 'none';
   }, 500);
}

async function pushcomments(fotoid, albumid) {
   
   if(!fotoid.getAttribute('fotoid') === null || !fotoid.getAttribute('albumid') === null) {
      popupalert('Fetching.', 'red');
      return;
   }
   
   if(document.querySelector('input[name="commentinguser"]').value === '' || document.querySelector('input[name="commentinguser"]').value === null) {
      popupalert('You didnt Commenting.', 'red');
      return;
   }
   document.getElementById('custom-alert').style.display = 'block';
   document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';
   const cacheonclick = fotoid.getAttribute('onclick');
   const cachealbumid = fotoid.getAttribute('albumid');

     const data = JSON.stringify({
      text: document.querySelector('input[name="commentinguser"]').value,
      id: fotoid.getAttribute('fotoid')
     });
  
     document.getElementById('commentusercontainer').querySelector('img[alt="Send"]').setAttribute('onclick', null);
     const request = await fetch('./api/post/request/comment', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: data
      });
     const responseData = await request.json();
     if(responseData.result) {
      popupalert('Comment Posted.', 'green');
      listactivity(`./#Posts/@/${fotoid.getAttribute('albumid')}`, './asset_media/imagenotfound.png', 'You Comment this Post.', whatmyuserid);
      popupcomment(cachealbumid);
   }
   else {
      popupalert(responseData.message, 'red');
      showCustomAlert('Edit Comment', 'Delete Comment', `doactioncomment(${responseData.child}, 'edit', ${fotoid.getAttribute('albumid')}, this)`, `doactioncomment(${responseData.child}, 'delete', ${fotoid.getAttribute('albumid')}, this)`);
   }
   document.getElementById('custom-alert').style.animation = 'fading-out 500ms forwards';
   setTimeout(function() {
      document.getElementById('custom-alert').style.display = 'none';
   }, 500);
   document.getElementById('commentusercontainer').querySelector('img[alt="Send"]').setAttribute('onclick', cacheonclick);
 }

async function doactioncomment(komentarid, type, galleryid, element) {
   try {
   if(type == 'edit') {
      const isConfirmed = confirm('Your last typing will be edited.');
      const cacheonclick = element.getAttribute('onclick');
      element.setAttribute('onclick', null);
      if (!isConfirmed) {
      element.setAttribute('onclick', cacheonclick);
      return;
      }
      document.getElementById('custom-alert').style.display = 'block';
      document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';
      const data = JSON.stringify({
         text: document.querySelector('input[name="commentinguser"]').value,
         child: komentarid
        });
      const request = await fetch('./api/post/request/comment', {
         method: 'PATCH',
         headers: {
             'Content-Type': 'application/json',
             'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
         },
         body: data
         });
      const res = await request.json();
      if(res.result) {
         const alertContainer = document.getElementById('popup-alert');
         popupalert('Comment Edited.', 'green');
         listactivity(`./#Posts/@/${galleryid}`, './asset_media/imagenotfound.png', 'You Edit Comment this Post.', whatmyuserid);
         popupcomment(galleryid);
         if(alertContainer.style.display == 'none') return;
         alertContainer.style.animation = 'closecomment 400ms forwards ease-out, fading-out 300ms forwards ease-out';
         setTimeout(() => {
             alertContainer.style.display = 'none';
         }, 400);  
      }
   }
   else if(type == 'delete') {
      const isConfirmed = confirm('Your last typing will be deleted.');
      const cacheonclick = element.getAttribute('onclick');
      element.setAttribute('onclick', null);
      if (!isConfirmed) {
      element.setAttribute('onclick', cacheonclick);
      return;
      }
      document.getElementById('custom-alert').style.display = 'block';
      document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';
      const data = JSON.stringify({
         child: komentarid
        });
      const request = await fetch('./api/post/request/comment', {
         method: 'DELETE',
         headers: {
             'Content-Type': 'application/json',
             'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
         },
         body: data
         });
      const res = await request.json();
      if(res.result) {
         const alertContainer = document.getElementById('popup-alert');
         popupalert('Comment Deleted.', 'green');
         listactivity(`./#Posts/@/${galleryid}`, './asset_media/imagenotfound.png', 'You Delete Comment this Post.', whatmyuserid);
         popupcomment(galleryid);
         if(alertContainer.style.display == 'none') return;
         alertContainer.style.animation = 'closecomment 400ms forwards ease-out, fading-out 300ms forwards ease-out';
         setTimeout(() => {
             alertContainer.style.display = 'none';
         }, 400);  
         }
      }
   }
   catch (error) {
      popupalert(error, 'red');
   }
}

function createComment(username, comment, date, whatelement) {
   // Create the div element with the class "perusercomment"
   const commentDiv = document.createElement("div");
   commentDiv.className = "perusercomment";
 
   // Create the p elements for the username, comment, and date
   const usernameP = document.createElement("p");
   usernameP.textContent = `@${username}`;
 
   const commentP = document.createElement("p");
   commentP.textContent = comment;
 
   const dateP = document.createElement("p");
   dateP.textContent = date;
 
   // Append the p elements to the div element
   commentDiv.appendChild(usernameP);
   commentDiv.appendChild(commentP);
   commentDiv.appendChild(dateP);
 
   // Get the element with the class "listcommentuser"
   const listCommentUser = document.querySelector(whatelement);
 
   // Append the comment div to the listCommentUser element
   listCommentUser.appendChild(commentDiv);
 }

let timeoutId = null;

document.addEventListener('DOMContentLoaded', function() {
   if (sessionStorage.getItem('username') !== null && sessionStorage.getItem('username') !== '') {
      document.title = 'Downloading..';
      document.getElementById('accountname').innerHTML = 'Welcome back,<br>' + sessionStorage.getItem('username') + '.';
   }

   if(window.location.hash === '#Pages/FYP') {
      const cont = document.getElementsByClassName('action-content-container')[0].querySelectorAll('p');
      cont[0].setAttribute('id', 'currentselectionaction');
      cont[1].setAttribute('id', 'exceptselectionaction');
      cont[2].setAttribute('id', 'exceptselectionaction');

      outboundchildprocess(0, cont[0]);
   }
   else if(window.location.hash === '#Pages/Activity') {
      const cont = document.getElementsByClassName('action-content-container')[0].querySelectorAll('p');
      cont[0].setAttribute('id', 'exceptselectionaction');
      cont[1].setAttribute('id', 'currentselectionaction');
      cont[2].setAttribute('id', 'exceptselectionaction');

      outboundchildprocess(1, cont[1]);
   }
   else if(window.location.hash.includes('#Pages/Profile')) {
      const cont = document.getElementsByClassName('action-content-container')[0].querySelectorAll('p');
      cont[0].setAttribute('id', 'exceptselectionaction');
      cont[1].setAttribute('id', 'exceptselectionaction');
      cont[2].setAttribute('id', 'currentselectionaction');

      outboundchildprocess(2, cont[2]);
   }
   else if(window.location.hash.includes('#Posts')) {
      document.getElementById('whatiscontentview').style.display = 'flex';
      filterposthis(window.location.hash.split('/')[2]);
   }
   else if(window.location.hash === '') {
      document.getElementById('custom-alert').style.display = 'block';
      document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';
   }
   syncrecentpost();
});
    

function shuffleArray(array) {
   for (let i = array.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [array[i], array[j]] = [array[j], array[i]]; // Swap elements
   }
   return array;
 }
 
 async function pushcontents() {
   try {
     const response = await fetch('./api/storage/galeri/public');
     const gallery = await response.json();
     clearcontentcont();
     
     const pushcontent = gallery.gallery;
     const shuffledContent = shuffleArray(pushcontent); // Shuffle the array
     
     await Promise.all(shuffledContent.map((triggercontent) => {
       if (triggercontent.fotos.length !== 0 && identifyMediaType(triggercontent.fotos[0].LokasiFile) === 'image') {
         uploadcontenthr('image',
           triggercontent.album.data.NamaAlbum,
           triggercontent.fotos,
           triggercontent.album.stats.username,
           triggercontent.album.data.TanggalDibuat,
           triggercontent.album.stats.like,
           triggercontent.album.stats.comment,
           triggercontent.album.data.AlbumID,
           triggercontent.album.current_session_itsLike
         );
       } else if (triggercontent.fotos.length !== 0 && identifyMediaType(triggercontent.fotos[0].LokasiFile) === 'video') {
         uploadcontenthr('video',
           triggercontent.album.data.NamaAlbum,
           triggercontent.fotos[0].LokasiFile,
           triggercontent.album.stats.username,
           triggercontent.album.data.TanggalDibuat,
           triggercontent.album.stats.like,
           triggercontent.album.stats.comment,
           triggercontent.album.data.AlbumID,
           triggercontent.album.current_session_itsLike
         );
       }
     }));
     
     document.getElementById('custom-alert').style.animation = 'fading-out 500ms forwards';
     setTimeout(function() {
       document.getElementById('custom-alert').style.display = 'none';
     }, 500);
   } catch (error) {
     console.error(error);
   }
 } 

 async function syncusers() {
   try {
      document.getElementById('custom-alert').style.display = 'block';
      document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';

      const urlParts = window.location.hash.split('/');
      const idFromUrl = urlParts[urlParts.length - 1]; // get the last part of the URL hash
      const checkmyuserid = idFromUrl !== '' && (/^\d+$/.test(idFromUrl) || idFromUrl.startsWith('@')) ? idFromUrl : whatmyuserid;

      const controller = new AbortController();
      const signal = controller.signal;
 
      const response = await fetch('./api/storage/galeri/?id=' + checkmyuserid, { signal });
      const res = await response.json();

      if(res.user === null) {
         popupalert('No account exist.', 'red');
         setTimeout(function() {
            popupalert('Getting you back..', 'green');
            window.location.hash = '#Pages/Profile';
            syncusers();
         }, 2500); //2.5s
         document.getElementById('custom-alert').style.animation = 'fading-out 500ms forwards';
         setTimeout(function() {
            document.getElementById('custom-alert').style.display = 'none';
         }, 500);
         return;
      }

      window.location.hash = '#Pages/Profile/' + res.user.userid;
      document.title = 'Profile - ' + res.user.username;

      if(whatmyuserid === res.user.userid) {
      const elements = [
         {
           text: 'Tambah Post',
           id: 'whileselectionaction'
         },
         {
           text: 'Edit Profile',
           id: 'whileselectionaction'
         }
       ];
       
       const container = document.getElementById('preferselectionaction');
       
       elements.forEach((element) => {
         const div = document.createElement('div');
         div.style.display = 'flex';
         div.style.justifyContent = 'center';
         div.style.color = 'black';
         div.style.width = '50%';
         div.style.padding = '1rem';
         div.style.paddingTop = '0.5rem';
         div.style.paddingBottom = '0.5rem';
         div.style.fontWeight = 'bold';
         div.style.fontStyle = 'italic';
         div.style.borderRadius = '0.8rem';
         div.id = element.id;
       
         const p = document.createElement('p');
         p.textContent = element.text;
       
         div.appendChild(p);
         container.appendChild(div);
         });
      }

      const outerContainer = document.querySelectorAll('div[style*="justify-content: space-between;"]')[1];

      // Select the second <p> element inside the first container
      const innerContainer = outerContainer.querySelector('div[style*="flex-direction: column;"]');
      const paragraphs = innerContainer.querySelectorAll('p');
      const firstParagraph = paragraphs[0]; // select the first <p> element
      const secondParagraph = paragraphs[1]; // select the second <p> element
      firstParagraph.textContent = res.user.name; // update its text content
      secondParagraph.textContent = res.user.username; // update its text content
      
      // Select the "T. Likes" and "T. Comments" elements
      const likesContainer = outerContainer.children[1];
      const commentsContainer = outerContainer.children[2];
      
      const likesParagraph = likesContainer.querySelector('p:nth-child(2)');
      likesParagraph.textContent = res.user.data.total_like;
      
      const commentsParagraph = commentsContainer.querySelector('p:nth-child(2)');
      commentsParagraph.textContent = res.user.data.total_comment;

      if(whatmyuserid === res.user.userid) {
      const tambahpost = document.querySelectorAll('#whileselectionaction');
      tambahpost[0].setAttribute('onclick', 'showcontainermediauser()');
      tambahpost[1].setAttribute('onclick', 'showprofileuser()');
      }

      document.getElementById('sothisisloadingvesatoputimagesforreal').remove();
      try {
      res.gallery.reverse().forEach((whenres) => {
         const img = document.createElement('img');
         img.src = identifyMediaType(whenres.fotos[0].LokasiFile) === 'image' ? whenres.fotos[0].LokasiFile : './asset_media/imagenotfound.png';
         img.style.width = '100px';
         img.style.height = '100px';
         img.style.objectFit = 'cover';
         img.style.borderRadius = '0.5rem';
         img.loading = 'lazy';
         img.setAttribute('onclick', `window.open('#Posts/${whenres.album.stats.username}/${whenres.album.data.AlbumID}', '_blank')`);
         img.style.visibility = 'hidden'; // Set initial visibility to hidden
         img.addEventListener('load', () => {
         img.style.visibility = 'visible'; // Set visibility to visible when loaded
         }, { once: true });
         img.addEventListener('contextmenu', function(event) {
         event.preventDefault();
         secondShowCustomAlert('Edit Album', 'Delete ALbum', `showcrudalbum(${whenres.album.data.AlbumID})`, `deletecrudalbum(${whenres.album.data.AlbumID})`);
         });

         document.getElementById('whatlistmediauser').appendChild(img);
      });
      }
      catch { }
   }
   catch (error) {
      popupalert(error, 'red');
      console.error(error);
   } 
   document.getElementById('custom-alert').style.animation = 'fading-out 500ms forwards';
   setTimeout(function() {
      document.getElementById('custom-alert').style.display = 'none';
   }, 500);
 }

 async function syncrecentpost() {
   document.querySelectorAll('.action-content-container')[2].innerHTML = `<p style="font-weight: bold; font-size: 1rem;">Recent Posts</p>`;

   const controller = new AbortController();
   const signal = controller.signal;

   const response = await fetch('./api/storage/galeri/', { signal });
   const res = await response.json();
   const pushcontent = res.gallery;
   if(pushcontent != '') {
   await Promise.all(pushcontent.reverse().slice(0, 5).map((triggercontent) => { //Limit 5 Terakhir Post

   const recentPost = document.createElement('div');
   recentPost.className = 'your-recentpost';

   const thumbnail = document.createElement('div');
   thumbnail.className = 'ig-thumbnail';

   const img = document.createElement('img');
   try {
   img.src = identifyMediaType(triggercontent.fotos[0].LokasiFile) === 'image' ? triggercontent.fotos[0].LokasiFile : './asset_media/imagenotfound.png';
   img.alt = triggercontent.fotos[0].JudulFoto;
   }
   catch {
   img.src = './asset_media/imagenotfound.png';
   img.alt = null;
   }
   img.loading = 'lazy';
   img.setAttribute('onclick', `window.open('#Posts/${triggercontent.album.stats.username}/${triggercontent.album.data.AlbumID}', '_blank')`);
   img.style.visibility = 'hidden'; // Set initial visibility to hidden
   img.addEventListener('load', () => {
   img.style.visibility = 'visible'; // Set visibility to visible when loaded
   }, { once: true });

   const textDiv = document.createElement('div');
   textDiv.className = 'ig-text';

   const paragraph = document.createElement('p');
   paragraph.textContent = triggercontent.album.data.NamaAlbum;

   thumbnail.appendChild(img);
   textDiv.appendChild(paragraph);
   recentPost.appendChild(thumbnail);
   recentPost.appendChild(textDiv);

   const container = document.querySelectorAll('.action-content-container');
   container[2].appendChild(recentPost);
   }));
   }
   else {
      document.querySelectorAll('.action-content-container')[2].innerHTML = `<p style="font-weight: bold; font-size: 1rem;">Recent Posts</p><p style="font-size: 0.8rem;">No Recent Posts.</p>`;
   }
 }

 function syncactivity() {
// Get the activities from localStorage
const activities = JSON.parse(localStorage.getItem('activity')) || [];

// Container where the activity items will be added
const container = document.getElementsByClassName('action-content-container')[1];

// Clear existing content in the container
container.innerHTML = `<div class="warn-content">
      <p>Any Activity only be stored on Local.</p>
      </div>
      <br>
      `;

   const storelement = document.createElement('div');
   storelement.style.overflowY = 'auto';
   storelement.style.height = '85vh';
   storelement.style.width = '100%';
// Loop through each activity item and create the HTML structure
activities.forEach(activity => {
    // Create the main container div
    if (activity.userid === whatmyuserid) {
    const mainDiv = document.createElement('div');
    mainDiv.style.display = 'flex';
    mainDiv.style.width = '100%';
    mainDiv.style.gap = '10px';
    mainDiv.style.justifyContent = 'start';
    mainDiv.style.alignItems = 'center';

    // Create the image container div
    const imageDiv = document.createElement('div');
    imageDiv.style.margin = '0';

    // Create the image element
    const img = document.createElement('img');
    img.src = identifyMediaType(activity.thumbnail) === 'image' ? activity.thumbnail : './asset_media/imagenotfound.png';
    img.alt = 'image';
    img.loading = 'lazy';
    img.style.visibility = 'hidden'; // Set initial visibility to hidden
    img.addEventListener('load', () => {
    img.style.visibility = 'visible'; // Set visibility to visible when loaded
    }, { once: true });
    img.style.objectFit = 'cover';
    img.style.maxHeight = '50px';
    img.style.borderRadius = '0.5rem';
    img.setAttribute('onclick', `window.open('${activity.source}', '_blank')`);

    // Append the image to the image container
    imageDiv.appendChild(img);

    // Create the text container div
    const textDiv = document.createElement('div');
    textDiv.style.display = 'flex';
    textDiv.style.flexDirection = 'column';

    // Create the action text paragraph
    const actionText = document.createElement('p');
    actionText.textContent = activity.text;

    // Create the date paragraph
    const dateText = document.createElement('p');
    dateText.textContent = activity.date;
    dateText.style.fontSize = '0.8rem';
    dateText.style.color = 'gray';

    // Append the text elements to the text container
    textDiv.appendChild(actionText);
    textDiv.appendChild(dateText);

    // Append the image and text containers to the main container
    mainDiv.appendChild(imageDiv);
    mainDiv.appendChild(textDiv);

    // Append the main container to the DOM
    storelement.appendChild(mainDiv);
      }
   });
   container.appendChild(storelement);
 }

window.addEventListener('load', function() {
   document.title = 'For Your Page';
   const startLoading = document.getElementById('start-loading');
   const pre = document.getElementById('preloader');
   document.getElementById('preloader-fetch-text').textContent = 'Almost There.';
   allowavideo();
   setTimeout(function() {
   startLoading.style.animation = 'fading-out 1s forwards';
   pushalert();
   fetchstore();
   
   // Corrected the event listener removal process
   startLoading.addEventListener('animationend', function handleAnimationEnd() {
      document.getElementById('start-loading').style.display = 'none';
      pre.style.animation = 'fading-out 1s forwards';

      if(window.location.hash === '') {
         document.getElementById('custom-alert').style.display = 'block';
         document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';
      pushcontents();
      }

      pre.addEventListener('animationend', function secondHandleAnimationEnd() {
         pre.style.display = 'none';
         pre.removeEventListener('animationend', secondHandleAnimationEnd);
         startLoading.removeEventListener('animationend', handleAnimationEnd);
         });
      });
   }, 1000);
});


function logout() {
   document.getElementById('preloader').style.display = 'flex';
   document.getElementById('start-loading').style.display = 'flex';
   document.getElementById('start-loading').style.animation = null;
   document.getElementById('preloader').style.animation = 'bigger-wigtext 500ms forwards';
   document.getElementById('contents').innerHTML = null;
   document.getElementById('start-loading').style.textAlign = 'center';

   const cusp = document.createElement('p');
   cusp.textContent = "Please Wait";
   cusp.style.color = 'gray';
   cusp.style.fontFamily = 'Poppins';
   cusp.style.marginTop = '-3vh';
   document.getElementById('sec-start-loading').appendChild(cusp);

   document.getElementById('preloader-fetch-text').textContent = 'Log Out';

   setTimeout(function() {
      window.addEventListener('focus', function() {
      window.location.reload();
      });
      window.location = './api/reset/session';
   }, 1000);
}

function listenersearch() {
document.querySelector('[name="typesearch"]').addEventListener('click', function iansog() {
   const listSearchContainer = document.getElementById('list-search-container');
   const restorehtml = listSearchContainer.innerHTML;
   
   listSearchContainer.style.display = 'block';
   listSearchContainer.style.animation = 'trs-search 500ms forwards';

   // Click listener to detect clicks outside the list-search-container
   document.addEventListener('click', function ansgi(event) {
       if (!listSearchContainer.contains(event.target) &&
           event.target !== document.querySelector('[name="typesearch"]')) {
           
           listSearchContainer.style.animation = 'trs-search-out 500ms forwards';
           document.querySelector('[name="typesearch"]').value = '';

           listSearchContainer.addEventListener('animationend', function ioasign() {
               listSearchContainer.style.display = 'none';
               document.removeEventListener('click', ansgi);
               listSearchContainer.removeEventListener('animationend', ioasign);
               listSearchContainer.innerHTML = restorehtml;            
           });
      }
   });
});

   // Keydown listener for input field
   document.querySelector('[name="typesearch"]').addEventListener('keydown', function oinasgjd() {
      document.querySelector('[name="typesearch"]').addEventListener('keyup', function oinasgdd() {
         const searchValue = this.value.trim();
         const replaceValue = searchValue.replace(/[^a-zA-Z0-9\s]/g, ''); 
         
         // Get the parsed cache data
         const cacheData = JSON.parse(cachefetchstoremediasearch);
         
         // Use .filter() to find all matching results in output_gallery and output_users
         const foundPosts = cacheData.output_gallery.filter(result => result.Data.NamaAlbum.includes(replaceValue));
         const foundUsers = cacheData.output_users.filter(result => result.Username.includes(replaceValue));
         
         // Get the user and post search containers
         const usersSearchContainer = document.querySelector('.users-search-cont');
         const postsSearchContainer = document.querySelector('.posts-search-cont');
         
         // Ensure the containers are found before trying to modify them
         if (!usersSearchContainer || !postsSearchContainer) {
             console.error("Search containers not found in the DOM.");
             return;
         }
         
         // Clear previous results
         usersSearchContainer.innerHTML = '';
         postsSearchContainer.innerHTML = '';
         
         // Handle the case where the input value is empty
         if (searchValue === '') {
             usersSearchContainer.textContent = 'No results found.';
             postsSearchContainer.textContent = 'No results found.';
             return;
         }
         
         // Display a "Finding..." message while searching
         usersSearchContainer.textContent = 'Finding...';
         postsSearchContainer.textContent = 'Finding...';
         
         // Display posts if found
         if (foundPosts.length > 0) {
             postsSearchContainer.innerHTML = ''; // Clear the "Finding..." message
             foundPosts.forEach(res => {
                 res.Metadata.forEach(meta => {
                     createPostElement(meta.Gambar, meta.Nama, res.Data.NamaAlbum, meta.Uploader + ' | ' + meta.Tanggal, meta.Uploader, res.Data.AlbumID);
                 });
             });
         } else {
             postsSearchContainer.textContent = 'No results found.';
         }
         
         // Display users if found
         if (foundUsers.length > 0) {
             usersSearchContainer.innerHTML = ''; // Clear the "Finding..." message
             foundUsers.forEach(res => {
                 createUserElement('@' + res.Username, res.namaLengkap);
             });
         } else {
             usersSearchContainer.textContent = 'No results found.';
         }
         
         console.log("Search completed.");         
         this.value = replaceValue;
      }, { once: true });
   });
}

listenersearch();

function outboundchildprocess(type, element) {
   const listact = document.getElementsByClassName('action-content-container')[0];
   const cont = document.getElementsByClassName('action-content-container')[1];

   if(type == 0) {
      cont.innerHTML = `
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
            </div>`;
      listact.querySelector('#currentselectionaction').setAttribute('id', 'exceptselectionaction');
      element.setAttribute('id', 'currentselectionaction');
      window.location.hash = '#Pages/FYP';
      document.title = 'For Your Page';
      listenersearch();
      
      document.getElementById('custom-alert').style.display = 'block';
      document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';

      setTimeout(function() {
      pushcontents();
      }, 250);
   }
   else if(type == 1) {
      cont.innerHTML = `
      <div class="warn-content">
      <p>Any Activity only be stored on Local.</p>
      </div>
      <div style="display: flex; align-items: center; justify-content: center; height: 80%; flex-direction: column; font-family: 'Jua'; font-size: 3rem; animation: loop-fade 2s infinite linear;">
      <p>vesa</p>
      <p style="font-family: 'Poppins'; font-size: 1rem; font-weight: 400; color: gray; margin-top: -1vh;">loading</p>
      </div>
      `;
      listact.querySelector('#currentselectionaction').setAttribute('id', 'exceptselectionaction');
      element.setAttribute('id', 'currentselectionaction');
      window.location.hash = '#Pages/Activity';
      document.title = 'Activity';
      setTimeout(function() {
         syncactivity();
      }, 250);
   }
   else if(type == 2) {
      cont.innerHTML = `
         <div style="display: flex; width: 100%; justify-content: space-between; gap: 0; padding-top: 1vh;">
      <div style="display: flex; flex-direction: column;">
         <p style="font-weight: bold; font-size: 1.5rem;">undefined</p>
         <p>@null</p>
      </div>
      <div style="display: flex; flex-direction: column;">
         <p>T. Likes</p>
         <p>Loading</p>   
      </div>
      <div style="display: flex; flex-direction: column;">
         <p>T. Comments</p>
         <p>Loading</p>   
      </div>
   </div>
   <div style="display: flex; width: 100%; justify-content: space-around; padding-top: 4vh; gap: 1rem;" id="preferselectionaction">
   </div>
   <div style="width: 8rem; height: 2px; background-color: white; border-radius: 100; margin-top: 4vh;"></div>
   <div style="display: flex; align-items: center; justify-content: center; height: 80%; flex-direction: column; font-family: 'Jua'; font-size: 3rem; animation: loop-fade 2s infinite linear;" id="sothisisloadingvesatoputimagesforreal">
   <p>vesa</p>
   <p style="font-family: 'Poppins'; font-size: 1rem; font-weight: 400; color: gray; margin-top: -1vh;">loading</p>
   </div>
   <div id="whatlistmediauser">
   </div>
   `;
   listact.querySelector('#currentselectionaction').setAttribute('id', 'exceptselectionaction');
   element.setAttribute('id', 'currentselectionaction');
   const urlParts = window.location.hash.split('/');
   const idFromUrl = urlParts[urlParts.length - 1]; // get the last part of the URL hash
   const checkmyuserid = idFromUrl !== '' && (/^\d+$/.test(idFromUrl) || idFromUrl.startsWith('@')) ? idFromUrl : whatmyuserid;
   
   window.location.hash = `#Pages/Profile/${checkmyuserid}`;

   document.title = 'Your Profile';
   syncusers();   
   }
}

let cachestoreuploadmediauser;

function triggerFileUpload() {
   // Trigger a click on the hidden file input element
   document.getElementById('mediaInput').click();

   document.getElementById('mediaInput').addEventListener('change', function(event) {
   const files = event.target.files; // Get all selected files
   cachestoreuploadmediauser = files;

   const html = document.getElementsByClassName('slider-media-uploadmediauser')[0];
   html.innerHTML = '';
   const img = document.createElement('img');
   img.src = URL.createObjectURL(files[0]);
   img.alt = 'Preview';
   html.appendChild(img);
   }, { once: true });
}

async function createalbum() {
   const title = document.getElementById('album-uploadmediauser').querySelector('input[name="mediauser-title"]').value;
   const desc = document.getElementById('album-uploadmediauser').querySelector('input[name="mediauser-desc"]').value;

   const pic_title = document.querySelector('input[name="whentypinguploadmediauser-name"]').value;
   const pic_desc = document.querySelector('input[name="whentypinguploadmediauser-desc"]').value;

   if(title == '' || desc == '') {
      popupalert(title == '' ? "Title's Field was empty." : "Desc's Field was empty.", 'red');
      return;
   }

   if(cachestoreuploadmediauser == null || cachestoreuploadmediauser == '') {
      popupalert("You don't upload any images.", 'red');
      return;
   }

   if(pic_title == '' || pic_desc == '') {
      popupalert(pic_title == '' ? "Pictures Title was empty." : "Pictures Desc was empty.", 'red');
      return;
   }

   document.getElementById('formstore-mediauser').submit();
}

function showcontainermediauser() {
   const html = document.getElementById('uploadmediauser');
   const targeting = document.getElementById('container-uploadmediauser');
   const secondtargeting = document.getElementById('preview-uploadmediauser');
   html.style.display = 'flex';
   html.style.animation = 'bigger-wigtext 500ms forwards ease-out';

   // Delay the event listener to prevent immediate hiding
   setTimeout(() => {
      document.addEventListener('click', function showlookcontaineruser(event) {
         if (!targeting.contains(event.target) && targeting.style.display !== 'none') {
            html.style.display = 'none';
            cachestoreuploadmediauser = null;
            document.getElementsByClassName('slider-media-uploadmediauser')[0].innerHTML = '';
            document.removeEventListener('click', showlookcontaineruser);
         }
      });
   }, 0);

   const doimage = document.getElementsByClassName('slider-media-uploadmediauser')[0];
   doimage.setAttribute('onclick', 'editcontainermediauser(this)');
}

function editcontainermediauser(element) {
   if (!cachestoreuploadmediauser || cachestoreuploadmediauser.length === 0) {
      popupalert("You don't upload any images.", 'red');
      return;
   }

   document.getElementById('preview-uploadmediauser').style.display = 'block';
   document.getElementById('container-uploadmediauser').style.display = 'none';

   // Use setTimeout to ensure the event listener is added after the current click finishes
   setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
      displayImagesFromCache();
   }, 0);

   function handleClickOutside(event) {
      const cont = document.getElementById('preview-uploadmediauser');
      if (!cont.contains(event.target)) {
         // Hide the preview container and show the upload container
         document.getElementById('preview-uploadmediauser').style.display = 'none';
         document.getElementById('container-uploadmediauser').style.display = 'flex';
         
         // Remove the event listener after it's triggered once
         document.removeEventListener('click', handleClickOutside);
      }
   }
}

function displayImagesFromCache() {
   const previewContainer = document.getElementById('image-preview-uploadmediauser');
   
   // Clear previous images
   previewContainer.innerHTML = '';

   // Loop through the cached files and display each image
   Array.from(cachestoreuploadmediauser).forEach(file => {
      if (file.type.startsWith('image/')) {
         const img = document.createElement('img'); // Create img element
         img.src = URL.createObjectURL(file); // Set image source
         img.alt = file.name; // Optional: Set alt attribute with file name

         // Append image to the preview container
         previewContainer.appendChild(img);
      }
   });
}

function createPostElement(imageSrc, altText, title, metadata, author, idGallery) {
   // Create the main div container
   const postDiv = document.createElement('div');
   
   // Create the img element
   const img = document.createElement('img');
   img.src = identifyMediaType(imageSrc) === 'image' ? imageSrc : './asset_media/imagenotfound.png';
   img.alt = altText;
   img.loading = 'lazy';
   img.style.visibility = 'hidden'; // Set initial visibility to hidden
   img.addEventListener('load', () => {
   img.style.visibility = 'visible'; // Set visibility to visible when loaded
   }, { once: true });
   img.setAttribute('onclick', `window.open('#Posts/${author}/${idGallery}', '_blank')`);
   
   // Create the inner div container
   const textDiv = document.createElement('div');
   
   // Create the title paragraph
   const titleParagraph = document.createElement('p');
   titleParagraph.textContent = title;
   
   // Create the metadata paragraph
   const metadataParagraph = document.createElement('p');
   metadataParagraph.textContent = metadata;
   metadataParagraph.style.fontSize = '0.6rem';
   metadataParagraph.style.color = 'rgb(176, 176, 176)';
   
   // Append the paragraphs to the text div
   textDiv.appendChild(titleParagraph);
   textDiv.appendChild(metadataParagraph);
   
   // Append the img and text div to the main post div
   postDiv.appendChild(img);
   postDiv.appendChild(textDiv);
   
   // Append the post div to the container with the class .posts-search-cont
   const postsContainer = document.querySelector('.posts-search-cont');
   postsContainer.appendChild(postDiv);
}

function createUserElement(username, caption) {
   // Create the main container div
   const userDiv = document.createElement('div');

   // Create the username paragraph
   const usernameParagraph = document.createElement('p');
   usernameParagraph.textContent = username;

   // Create the caption paragraph
   const captionParagraph = document.createElement('p');
   captionParagraph.textContent = caption;
   captionParagraph.style.fontSize = '0.7rem';
   captionParagraph.style.color = 'gray';

   // Append both paragraphs to the main div
   userDiv.appendChild(usernameParagraph);
   userDiv.appendChild(captionParagraph);

   // Append the user div to the container with the class .users-search-cont
   const usersContainer = document.querySelector('.users-search-cont');
   usersContainer.appendChild(userDiv);
}

let cachefetchstoremediasearch;

async function fetchstore() {
   const response = await fetch('./api/get/request/search');
   const res = await response.json();
   cachefetchstoremediasearch = JSON.stringify(res);
}

async function showprofileuser() {
   const el = document.getElementById('uploadprofileuser');
   const pre = document.getElementById('preview-uploadprofileuser');
   const retrieve_input = document.getElementById('preview-uploadprofileuser').querySelectorAll('input');
   const retrieve_button = document.getElementById('preview-uploadprofileuser').querySelectorAll('button');
   el.style.display = 'flex';
   el.style.animation = 'bigger-wigtext 500ms forwards ease-out';

   document.getElementById('custom-alert').style.display = 'block';
   document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';

   retrieve_input.forEach(element => {
      element.value = '';
   });
   retrieve_button.forEach(element => {
      element.setAttribute('onclick', null);
   });

   try {
   const req = await fetch('./api/storage/galeri/');
   const res = await req.json();
   if(res.user !== null || res.gallery !== null) {
         retrieve_input[0].value = res.user.username.replace(/[^a-zA-Z0-9\s]/g, ''); //Username
         retrieve_input[3].value = res.user.name; //Your Name
         retrieve_button[0].setAttribute('onclick', 'doprocessupdateacc()');
         retrieve_button[1].setAttribute('onclick', 'doprocessdeleteacc()');
      }
      else {
      popupalert('Something just happened.', 'red');
      }
      // Adding Event Listener to trigger if its outside of container
      setTimeout(() => {
         document.addEventListener('click', function showlookcontaineruser(event) {
            if (!pre.contains(event.target) && pre.style.display !== 'none') {
               el.style.display = 'none';
               document.removeEventListener('click', showlookcontaineruser);
            }
         });
      }, 0);
   }
   catch (error) {
      popupalert(error, 'red');
      console.error(error);
   }
   document.getElementById('custom-alert').style.animation = 'fading-out 500ms forwards';
   setTimeout(function() {
      document.getElementById('custom-alert').style.display = 'none';
   }, 500);
}

async function doprocessupdateacc() {
   const retrieve_input = document.getElementById('preview-uploadprofileuser').querySelectorAll('input');
   for(let result of retrieve_input) {
      if(result.value == '') {
         popupalert(result.name.replace('input', '') + ' was empty.', 'red');
         return;
      }
      if(!result.checkValidity()) {
         popupalert(result.name.replace('input', '') + " doesn't meet requirement.", 'red');
         return;
      }
   }
   const query = {
      'username': retrieve_input[0].value,
      'email': retrieve_input[1].value,
      'password': retrieve_input[2].value,
      'name': retrieve_input[3].value,
      'address': retrieve_input[4].value
   };
   try {
   const req = await requestupdatedata('POST', './api/post/request/account', JSON.stringify(query));
   if(req.result) {
      popupalert('Account Updated Successfully.', 'green');
      }
   else {
      popupalert(req.error, 'red');
      }
      showprofileuser();
   }
   catch (error) {
      popupalert(error, 'red');
      console.error(error);
   }
}

async function doprocessdeleteacc() {
   let firstalert = confirm('Are you sure you want to delete your account?');
   if(firstalert) {
      let secondalert = confirm('-- LAST WARNING --\n\nThink twice before step final action.\nALL YOUR DATA WILL BE GONE PERMANENTLY.');
      if(secondalert) {
         let writecheck = prompt('Type your username (without @) for confirmation:');
         if(writecheck == whatmyusername) {
         document.getElementById('custom-alert').style.display = 'block';
         document.getElementById('custom-alert').style.animation = 'trs-search 500ms forwards';

         const req = await fetch('./api/post/request/account', {
            method: 'DELETE',
            headers: {
               'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
         });
         const res = await req.json();
         if(res.result) {
            logout();
            }
         }
         else {
            alert('Invalid username.');
         }
      }
   }
}

async function filterposthis(idGallery) {
   try {
     const req = await fetch('./api/get/request/comment?id=' + idGallery);
     const res = await req.json();
 
     const req2 = await fetch('./api/storage/galeri/public');
     const res2 = await req2.json();
     const filres = res2.gallery.filter(eq => eq.album.data.AlbumID == idGallery);
 
     const element = document.getElementsByClassName('slider-media-uploadmediauser')[1];
     const secelement = document.getElementById('post-whatiscontentview');
     secelement.querySelectorAll('p')[0].textContent = filres[0].album.data.NamaAlbum;
     secelement.querySelectorAll('p')[1].textContent = filres[0].album.stats.username;
     secelement.querySelectorAll('p')[2].textContent = filres[0].album.data.TanggalDibuat;
     
     // Ensure filres is not empty and contains fotos
     if (filres.length > 0 && filres[0].fotos) {
      filres[0].fotos.forEach(fil => {
        const mediaType = identifyMediaType(fil.LokasiFile); // Check the media type
        let mediaElement;
    
        if (mediaType === 'image') {
          mediaElement = document.createElement('img');
          mediaElement.src = fil.LokasiFile;
          mediaElement.alt = fil.JudulFoto;
          mediaElement.loading = 'lazy';
        } else if (mediaType === 'video') {
          mediaElement = document.createElement('video');
          mediaElement.style.width = '100%';
          mediaElement.src = fil.LokasiFile;
          mediaElement.controls = true; // Add controls for video playback
          mediaElement.preload = 'metadata'; // Load metadata only
          mediaElement.alt = fil.JudulFoto;
        }
    
        if (mediaElement) {
          element.appendChild(mediaElement);
        }
      });
    }    
 
     // Handle comments
     if (res.message) {
       res.message.forEach(result => {
         createComment(result.user.Username, result.comment.IsiKomentar, result.comment.TanggalKomentar, ".listcomment");
       });
     }
   } catch (error) {
     console.error('Error:', error);
   }

   document.addEventListener('click', function niwgeionwdb(event) {
      const main = document.getElementById('whatiscontentview');
      const ele = document.getElementById('post-whatiscontentview');
      if(!ele.contains(event.target) && main.style.display !== 'none') {
         window.location.hash = '#Pages/FYP';
         main.style.display = 'none';
         document.removeEventListener('click', niwgeionwdb);
         pushcontents();
      }
   });
}

async function showcrudalbum(idGallery) {
   document.getElementById('uploadmediauser').style.display = 'flex';
   const getinfo = await fetch('./api/storage/galeri/public');
   const info = await getinfo.json();
   const filterinfo = info.gallery.filter(res => res.album.data.AlbumID === idGallery);

   const title = document.getElementById('album-uploadmediauser').querySelector('input[name="mediauser-title"]').value;
   const desc = document.getElementById('album-uploadmediauser').querySelector('input[name="mediauser-desc"]').value;

   const pic_title = document.querySelector('input[name="whentypinguploadmediauser-name"]').value;
   const pic_desc = document.querySelector('input[name="whentypinguploadmediauser-desc"]').value;

   const html = document.getElementsByClassName('slider-media-uploadmediauser')[0];
   html.innerHTML = '';
   const img = document.createElement('img');
   img.loading = 'lazy';
   img.src = filterinfo.fotos[0].LokasiFile;
   img.alt = 'Preview';
   html.appendChild(img);

   title = filterinfo.album.data.NamaAlbum;
   desc = filterinfo.album.data.Deskripsi;
   pic_title = filterinfo.fotos[0].JudulFoto;
   pic_desc = filterinfo.fotos[0].DeskripsiFoto;

   if(title == '' || desc == '') {
      popupalert(title == '' ? "Title's Field was empty." : "Desc's Field was empty.", 'red');
      return;
   }

   if(pic_title == '' || pic_desc == '') {
      popupalert(pic_title == '' ? "Pictures Title was empty." : "Pictures Desc was empty.", 'red');
      return;
   }

   const params = {
      'mediauser-title': title,
      'mediauser-desc': desc,
      'whentypinguploadmediauser-name': pic_title,
      'whentypinguploadmediauser-desc': pic_desc
   };
   const req = await fetch('./api/post/request/album', {
      body: JSON.stringify(params),
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
         },
   });
   const res = await req.json();
   if(res.result) {

   }
}

async function deletecrudalbum(idGallery) {
}