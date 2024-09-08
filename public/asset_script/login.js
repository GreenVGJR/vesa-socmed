const form = document.getElementById('sforms');
const bgvideo = document.getElementById('video-bg');
        // Pause the video when the window loses focus
        window.addEventListener('blur', function() {
            bgvideo.pause();
        });

        // Play the video when the window regains focus
        window.addEventListener('focus', function() {
          if (bgvideo.readyState === 4) {
            bgvideo.play();
          } else {
            bgvideo.addEventListener('canplay', function() {
              bgvideo.play();
            });
          }
        });

        form.addEventListener('change', function() {
          const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="number"], select, textarea');
          let data = {};
          let allValid = true;
          for (let input of inputs) {
            // Store the result of reportValidity in the data object
            data[input.name] = input.reportValidity();
        
            // If the input is invalid, stop the loop
            if (!input.checkValidity()) {
              allValid = false;  // Mark the overall validity as false
              break;  // Stop further checks
          }
            // Perform the final check after the loop, considering all fields except 'type'
          if (allValid) {
            allValid = Object.keys(data)
                .filter(key => key !== 'type')  // Exclude 'type'
                .every(key => data[key] === true);  // Check if all remaining values are true
          }

        }
        console.log(data);
        if(allValid) {
          document.querySelector('input[id="formsubmit"]').style.backgroundColor = 'rgb(84, 143, 84)';
          document.querySelector('input[id="formsubmit"]').disabled = false;
        }
        else {
          document.querySelector('input[id="formsubmit"]').style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
          document.querySelector('input[id="formsubmit"]').disabled = true;
        }
        });

const texts = [
   "Your Stories for History.",
   "Your Stories for Future.",
   "Your Stories for Memories."
 ];
 
 const elem = document.getElementById("webdesc");
 
 let textIndex = 0;
 let charIndex = 0;
 let isDeleting = false;
 let isFirstWrite = true;
 
 function writeText() {
   const text = texts[textIndex];
   const timeout = isDeleting ? 50 : 50; // adjust the delay to your liking (in milliseconds)
   const waitTime = 2000; // wait for 2 seconds before writing the next text
 
   if (isDeleting) {
     elem.textContent = text.substring(0, charIndex);
     charIndex--;
   } else {
     elem.textContent = text.substring(0, charIndex + 1);
     charIndex++;
   }
 
   if (charIndex === text.length) {
     isDeleting = true;
     isFirstWrite = false; // set flag to false after first write
   } else if (charIndex === 0) {
     textIndex = (textIndex + 1) % texts.length; // cycle through the texts array
     charIndex = 0;
     isDeleting = false;
   }
 
   if (isFirstWrite) {
     setTimeout(writeText, timeout);
   } else if (charIndex === text.length) {
     setTimeout(writeText, waitTime); // add a delay before deleting the text
   } else if (charIndex === 0) {
     setTimeout(writeText, 0); // start writing the next text immediately
   } else {
     setTimeout(writeText, timeout);
   }
 }

document.addEventListener('DOMContentLoaded', function() {
   if(window.location.hash == '#login') {
      //Code Injection
      const code = "ICAgPHA+RW1haWw8L3A+DQogICA8aW5wdXQgdHlwZT0idGV4dCIgc3R5bGU9ImRpc3BsYXk6IG5vbmU7IiBuYW1lPSJ0eXBlIiB2YWx1ZT0ibG9naW4iPg0KICAgPGlucHV0IHR5cGU9ImVtYWlsIiBuYW1lPSJlbWFpbCIgcGxhY2Vob2xkZXI9Im5hbWVAZG9tYWluIiByZXF1aXJlZD4NCiAgIDxwPlBhc3N3b3JkPC9wPg0KICAgPGlucHV0IHR5cGU9InBhc3N3b3JkIiBuYW1lPSJwYXNzIiByZXF1aXJlZD4NCiAgIDxpbnB1dCB0eXBlPSJzdWJtaXQiIGlkPSJmb3Jtc3VibWl0IiBvbmNsaWNrPSJnZXRGb3JtRGF0YSgpIj4NCiAgIDxwIHN0eWxlPSJmb250LXNpemU6IDAuOHJlbTsgZm9udC13ZWlnaHQ6IDQwMDsiPkRvbid0IGhhdmUgYWNjb3VudD8gPGEgaHJlZj0iI3JlZ2lzdGVyIiBzdHlsZT0ib3V0bGluZTogbm9uZTsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBjb2xvcjogbGlnaHRjb3JhbDsiPkNyZWF0ZSBvbmUhPC9hPjwvcD4NCiAgIDxhIGhyZWY9IiNmb3Jnb3RwYXNzIiBzdHlsZT0iZm9udC1mYW1pbHk6ICdQb3BwaW5zJzsgZm9udC1zaXplOiAwLjhyZW07IG1hcmdpbi10b3A6IC0wLjVyZW07IG91dGxpbmU6IG5vbmU7IHRleHQtZGVjb3JhdGlvbjogbm9uZTsgY29sb3I6IHJnYigxMjgsIDEzMywgMjQwKTsiPkZvcmdvdCBQYXNzd29yZD88L2E+";
      form.innerHTML = atob(code); //Base64 to String
      document.title = 'Login';
      console.log("OK - Login");
   }
   else if(window.location.hash == '#register') {
      //Code Injection
      const code = "PGlucHV0IHR5cGU9InRleHQiIG5hbWU9InR5cGUiIHN0eWxlPSJkaXNwbGF5OiBub25lOyIgdmFsdWU9InJlZ2lzdGVyIj4NCiAgIDxwPlVzZXJuYW1lPC9wPg0KICAgPGlucHV0IHR5cGU9InRleHQiIG5hbWU9InVzZXJuYW1lIiByZXF1aXJlZD4NCiAgIDxwPkVtYWlsPC9wPg0KICAgPGlucHV0IHR5cGU9ImVtYWlsIiBuYW1lPSJlbWFpbCIgcGxhY2Vob2xkZXI9Im5hbWVAZG9tYWluIiByZXF1aXJlZD4NCiAgIDxwPlBhc3N3b3JkPC9wPg0KICAgPGlucHV0IHR5cGU9InBhc3N3b3JkIiBuYW1lPSJwYXNzIiByZXF1aXJlZD4NCiAgIDxwPllvdXIgTmFtZTwvcD4NCiAgIDxpbnB1dCB0eXBlPSJ0ZXh0IiBuYW1lPSJuYW1lIiByZXF1aXJlZD4NCiAgIDxpbnB1dCB0eXBlPSJzdWJtaXQiIGlkPSJmb3Jtc3VibWl0IiBvbmNsaWNrPSJnZXRGb3JtRGF0YSgpIj4NCiAgIDxwIHN0eWxlPSJmb250LXNpemU6IDAuOHJlbTsgZm9udC13ZWlnaHQ6IDQwMDsiPkFscmVhZHkgaGF2ZT8gPGEgaHJlZj0iI2xvZ2luIiBzdHlsZT0ib3V0bGluZTogbm9uZTsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBjb2xvcjogbGlnaHRjb3JhbDsiPkxvZ2luIGhlcmUhPC9hPjwvcD4=";
      form.innerHTML = atob(code); //Base64 to String
      document.title = 'Register';
      console.log("OK - Register");
   }
   else if(window.location.hash == '#forgotpass') {
    const code = "ICAgPHA+RW1haWw8L3A+DQogICA8aW5wdXQgdHlwZT0idGV4dCIgc3R5bGU9ImRpc3BsYXk6IG5vbmU7IiBuYW1lPSJ0eXBlIiB2YWx1ZT0iZm9yZ290cGFzcyI+DQogICA8aW5wdXQgdHlwZT0iZW1haWwiIG5hbWU9ImVtYWlsIiBwbGFjZWhvbGRlcj0ibmFtZUBkb21haW4iIHJlcXVpcmVkPg0KICAgPHA+WW91ciBOYW1lPC9wPg0KICAgPGlucHV0IHR5cGU9InRleHQiIG5hbWU9Im5hbWUiIHJlcXVpcmVkPg0KICAgPGlucHV0IHR5cGU9InN1Ym1pdCIgaWQ9ImZvcm1zdWJtaXQiIG9uY2xpY2s9ImdldEZvcm1EYXRhKCkiPg0KICAgPGEgaHJlZj0iI2xvZ2luIiBzdHlsZT0iZm9udC1mYW1pbHk6ICdQb3BwaW5zJzsgZm9udC1zaXplOiAwLjhyZW07IGZvbnQtd2VpZ2h0OiA2MDA7IG91dGxpbmU6IG5vbmU7IHRleHQtZGVjb3JhdGlvbjogbm9uZTsgY29sb3I6IHJnYigxMjgsIDEzMywgMjQwKTsiPkJhY2sgdG8gTG9naW48L2E+";
    form.innerHTML = atob(code);
    document.title = 'Forgot Password';
    console.log("OK - Forgot Pass");
   }
   document.querySelector('input[id="formsubmit"]').disabled = true;
});

window.addEventListener('load', function() {
  const container = document.getElementById('container');
  container.style.display = 'none';
  document.getElementById('preloader-fetch-text').textContent = 'Connection';
  axios.get('./api/check')
  .then(response => {
     console.log(response.status);
     container.style.display = 'flex';
     
   const pre = document.getElementById('preloader');
   const startLoading = document.getElementById('start-loading');

   if(!sessionStorage.getItem('username')) {
   bgvideo.style.opacity = 1;
   startLoading.style.animation = 'fading-out 500ms forwards';
   document.getElementById('preloader-fetch-text').textContent = 'Almost There.';
   pre.style.animation = 'fading-out 500ms ease-out';
   writeText(); // start the animation  
   setTimeout(function() {
      pre.style.display = 'none';
      startLoading.style.display = 'none';
   }, 500);
  }
  else {
    document.getElementById('preloader-fetch-text').textContent = 'Auto-Login';
    setTimeout(function() {
    window.location = './web';
    }, 250);
  }
  })
  .catch(error => {
     document.getElementById('sec-start-loading').innerHTML = null;
     document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
     const p1 = document.createElement('p');
     const p2 = document.createElement('p');
     p1.textContent = 'something just happened. check your browser console.';
     p2.textContent = 'Database Error: ' + (error.message.includes("status code 500") ? 'PHP Not Installed.' : (error.message.includes("Network Error") ? 'Program not compatible on Local. Run this in XAMPP / Live Server.' : error));
     p1.style.color = 'lightcoral';
     p2.style.color = 'gray';
     p2.style.fontFamily = 'Poppins';
     document.getElementById('sec-start-loading').appendChild(p1);
     document.getElementById('sec-start-loading').appendChild(p2);
  });
});

window.addEventListener('hashchange', function(event) {
   if(window.location.hash == '#login') {
      //Code Injection
      const code = "ICAgPHA+RW1haWw8L3A+DQogICA8aW5wdXQgdHlwZT0idGV4dCIgc3R5bGU9ImRpc3BsYXk6IG5vbmU7IiBuYW1lPSJ0eXBlIiB2YWx1ZT0ibG9naW4iPg0KICAgPGlucHV0IHR5cGU9ImVtYWlsIiBuYW1lPSJlbWFpbCIgcGxhY2Vob2xkZXI9Im5hbWVAZG9tYWluIiByZXF1aXJlZD4NCiAgIDxwPlBhc3N3b3JkPC9wPg0KICAgPGlucHV0IHR5cGU9InBhc3N3b3JkIiBuYW1lPSJwYXNzIiByZXF1aXJlZD4NCiAgIDxpbnB1dCB0eXBlPSJzdWJtaXQiIGlkPSJmb3Jtc3VibWl0IiBvbmNsaWNrPSJnZXRGb3JtRGF0YSgpIj4NCiAgIDxwIHN0eWxlPSJmb250LXNpemU6IDAuOHJlbTsgZm9udC13ZWlnaHQ6IDQwMDsiPkRvbid0IGhhdmUgYWNjb3VudD8gPGEgaHJlZj0iI3JlZ2lzdGVyIiBzdHlsZT0ib3V0bGluZTogbm9uZTsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBjb2xvcjogbGlnaHRjb3JhbDsiPkNyZWF0ZSBvbmUhPC9hPjwvcD4NCiAgIDxhIGhyZWY9IiNmb3Jnb3RwYXNzIiBzdHlsZT0iZm9udC1mYW1pbHk6ICdQb3BwaW5zJzsgZm9udC1zaXplOiAwLjhyZW07IG1hcmdpbi10b3A6IC0wLjVyZW07IG91dGxpbmU6IG5vbmU7IHRleHQtZGVjb3JhdGlvbjogbm9uZTsgY29sb3I6IHJnYigxMjgsIDEzMywgMjQwKTsiPkZvcmdvdCBQYXNzd29yZD88L2E+";
      form.innerHTML = atob(code); //Base64 to String
      document.title = 'Login';
      console.log("OK - Login");
   }
   else if(window.location.hash == '#register') {
      //Code Injection
      const code = "PGlucHV0IHR5cGU9InRleHQiIG5hbWU9InR5cGUiIHN0eWxlPSJkaXNwbGF5OiBub25lOyIgdmFsdWU9InJlZ2lzdGVyIj4NCiAgIDxwPlVzZXJuYW1lPC9wPg0KICAgPGlucHV0IHR5cGU9InRleHQiIG5hbWU9InVzZXJuYW1lIiByZXF1aXJlZD4NCiAgIDxwPkVtYWlsPC9wPg0KICAgPGlucHV0IHR5cGU9ImVtYWlsIiBuYW1lPSJlbWFpbCIgcGxhY2Vob2xkZXI9Im5hbWVAZG9tYWluIiByZXF1aXJlZD4NCiAgIDxwPlBhc3N3b3JkPC9wPg0KICAgPGlucHV0IHR5cGU9InBhc3N3b3JkIiBuYW1lPSJwYXNzIiByZXF1aXJlZD4NCiAgIDxwPllvdXIgTmFtZTwvcD4NCiAgIDxpbnB1dCB0eXBlPSJ0ZXh0IiBuYW1lPSJuYW1lIiByZXF1aXJlZD4NCiAgIDxpbnB1dCB0eXBlPSJzdWJtaXQiIGlkPSJmb3Jtc3VibWl0IiBvbmNsaWNrPSJnZXRGb3JtRGF0YSgpIj4NCiAgIDxwIHN0eWxlPSJmb250LXNpemU6IDAuOHJlbTsgZm9udC13ZWlnaHQ6IDQwMDsiPkFscmVhZHkgaGF2ZT8gPGEgaHJlZj0iI2xvZ2luIiBzdHlsZT0ib3V0bGluZTogbm9uZTsgdGV4dC1kZWNvcmF0aW9uOiBub25lOyBjb2xvcjogbGlnaHRjb3JhbDsiPkxvZ2luIGhlcmUhPC9hPjwvcD4=";
      form.innerHTML = atob(code); //Base64 to String
      document.title = 'Register';
      console.log("OK - Register");
   }
   else if(window.location.hash == '#forgotpass') {
      const code = "ICAgPHA+RW1haWw8L3A+DQogICA8aW5wdXQgdHlwZT0idGV4dCIgc3R5bGU9ImRpc3BsYXk6IG5vbmU7IiBuYW1lPSJ0eXBlIiB2YWx1ZT0iZm9yZ290cGFzcyI+DQogICA8aW5wdXQgdHlwZT0iZW1haWwiIG5hbWU9ImVtYWlsIiBwbGFjZWhvbGRlcj0ibmFtZUBkb21haW4iIHJlcXVpcmVkPg0KICAgPHA+WW91ciBOYW1lPC9wPg0KICAgPGlucHV0IHR5cGU9InRleHQiIG5hbWU9Im5hbWUiIHJlcXVpcmVkPg0KICAgPGlucHV0IHR5cGU9InN1Ym1pdCIgaWQ9ImZvcm1zdWJtaXQiIG9uY2xpY2s9ImdldEZvcm1EYXRhKCkiPg0KICAgPGEgaHJlZj0iI2xvZ2luIiBzdHlsZT0iZm9udC1mYW1pbHk6ICdQb3BwaW5zJzsgZm9udC1zaXplOiAwLjhyZW07IGZvbnQtd2VpZ2h0OiA2MDA7IG91dGxpbmU6IG5vbmU7IHRleHQtZGVjb3JhdGlvbjogbm9uZTsgY29sb3I6IHJnYigxMjgsIDEzMywgMjQwKTsiPkJhY2sgdG8gTG9naW48L2E+";
      form.innerHTML = atob(code);
      document.title = 'Forgot Password';
      console.log("OK - Forgot Pass");
   }
   document.querySelector('input[id="formsubmit"]').disabled = true;
 });


form.addEventListener('submit', (e) => {
  e.preventDefault();
});

function getFormData() {
   if(document.querySelector('input[id="formsubmit"]').disabled) return;
   const form = document.getElementById('sforms');
   let data;

   document.getElementById('preloader').style.animation = 'bigger-wigtext 250ms forwards';
   document.getElementById('preloader').style.display = 'flex';

   document.getElementById('preloader-fetch-text').textContent = 'Processing';
   
   //Login Page
   if(form.querySelector('input[value="login"]')) {
   data = [form.querySelector('input[value="login"]').value, form.querySelector('input[type="email"]').value, form.querySelector('input[type="password"]').value];
   const val = data.every(field => field.trim() !== ''); // Check that each field is not empty

   if(val) {
   axios.get('./api/account', {
    params: {
        data: data
      }
    })
    .then(response => {
        if(response.data.result) {
          document.getElementById('start-loading').style.display = 'flex';

          document.getElementById('start-loading').style.animation = 'bigger-wigtext 1ms forwards';
          document.getElementById('container').innerHTML = null;
          document.getElementById('start-loading').style.textAlign = 'center';

          const cusp = document.createElement('p');
          cusp.textContent = "Please Wait";
          cusp.style.color = 'gray';
          cusp.style.fontFamily = 'Poppins';
          cusp.style.marginTop = '-3vh';
          document.getElementById('sec-start-loading').appendChild(cusp);

          document.getElementById('preloader-fetch-text').textContent = 'Redirecting';
            window.addEventListener('focus', function() {
              window.location.reload();  
            });
              setTimeout(function() {
                window.location = './?success=true';
              }, 1000);
            }
        else if(response.data.result == false) {
          alert(response.data.error);
          document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
          setTimeout(function() {
            document.getElementById('preloader').style.display = 'none';
          }, 500);
        }
    })
    .catch(error => {
          document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
          setTimeout(function() {
            document.getElementById('preloader').style.display = 'none';
          }, 500);
        console.error('There was an error!', error);
      });
    }
   }
   //Register Page
   else if(form.querySelector('input[value="register"]')) {
   data = [form.querySelector('input[value="register"]').value, form.querySelector('input[name="username"]').value, form.querySelector('input[name="email"]').value, form.querySelector('input[type="password"]').value, form.querySelector('input[name="name"]').value];
   const val = data.every(field => field.trim() !== ''); // Check that each field is not empty
   if(!val) return;
   axios.get('./api/account', {
    params: {
        data: data
      }
    })
    .then(response => {
      if(response.data.result) {
      document.getElementById('preloader').style.display = 'flex';
      document.getElementById('start-loading').style.display = 'flex';
      
      document.getElementById('start-loading').style.animation = null;
      document.getElementById('preloader').style.animation = 'bigger-wigtext 1ms forwards';
      document.getElementById('start-loading').style.textAlign = 'center';

      const cusp = document.createElement('p');
      cusp.textContent = "Account Created";
      cusp.style.color = 'gray';
      cusp.style.fontFamily = 'Poppins';
      cusp.style.marginTop = '-3vh';
      document.getElementById('sec-start-loading').appendChild(cusp);

      document.getElementById('preloader-fetch-text').textContent = 'Switching Page';
      window.location.hash = '#login';

      console.log(response.data);
      setTimeout(function() {
        document.getElementById('start-loading').style.animation = 'fading-out 500ms forwards';
        document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
        setTimeout(function() {
          document.getElementById('start-loading').style.display = 'none';
          document.getElementById('preloader').style.display = 'none';
          document.getElementById('sec-start-loading').querySelectorAll('p')[1].remove();
        }, 500);
      }, 500);
      }
      else {
      alert(response.data.error);
      document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
        setTimeout(function() {
          document.getElementById('preloader').style.display = 'none';
      }, 500);
      }
    })
    .catch(error => {
        console.error('There was an error!', error);
        document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
        setTimeout(function() {
          document.getElementById('preloader').style.display = 'none';
        }, 500);
    });
  }
  else if(form.querySelector('input[value="forgotpass"]')) {
    data = [form.querySelector('input[value="forgotpass"]').value, form.querySelector('input[type="email"]').value, form.querySelector('input[name="name"]').value];
    const val = data.every(field => field.trim() !== ''); // Check that each field is not empty
    if(!val) return;
    axios.get('./api/account', {
      params: {
          data: data
        } 
      })
      .then(response => {
        if(response.data.result) {
          const cachepass = response.data.message;
          const cacheprompt = prompt('Input a New Password:');
          async function checkMd5() {
            try {
              const response = await axios.get('./api/ulitity/md5/?data=' + cacheprompt);
              const kadg = response.data.message;
              console.log(kadg);
              console.log(cachepass);
              if (cacheprompt != '' && kadg === cachepass) {
                alert('Password should not like old password.');
                document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
                setTimeout(function() {
                  document.getElementById('preloader').style.display = 'none';
                }, 500);        
              }
              else if(cacheprompt == '' || cacheprompt == null) {
                alert('No password were set.');
                document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
                setTimeout(function() {
                  document.getElementById('preloader').style.display = 'none';
                }, 500);        
              }
              else if(cacheprompt != '' && kadg !== cachepass) {
                document.getElementById('start-loading').style.display = 'flex';
                document.getElementById('start-loading').style.animation = null;
                document.getElementById('preloader').style.animation = 'bigger-wigtext 1ms forwards';
                document.getElementById('start-loading').style.textAlign = 'center';
          
                const cusp = document.createElement('p');
                cusp.textContent = "Changing Password";
                cusp.style.color = 'gray';
                cusp.style.fontFamily = 'Poppins';
                cusp.style.marginTop = '-3vh';
                document.getElementById('sec-start-loading').appendChild(cusp);    
                
                document.getElementById('preloader-fetch-text').textContent = 'Processing';

                const cachedatas = [form.querySelector('input[type="email"]').value, form.querySelector('input[name="name"]').value, cacheprompt];
                axios.get('./api/account/reset', {
                  params: {
                      data: cachedatas
                    } 
                  })
                  .then(response => {
                    window.location.hash = '#login';
                    document.getElementById('preloader-fetch-text').textContent = 'Switching Page';

                    setTimeout(function() {
                      document.getElementById('start-loading').style.animation = 'fading-out 500ms forwards';
                      document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
                      setTimeout(function() {
                        document.getElementById('start-loading').style.display = 'none';
                        document.getElementById('preloader').style.display = 'none';
                        document.getElementById('sec-start-loading').querySelectorAll('p')[1].remove();
                      }, 500);
                    }, 500);
                });
              }
            } catch (error) {
              window.location.reload();
              console.error(error);
            }
          }
          checkMd5();
          document.getElementById('preloader-fetch-text').textContent = 'Fetching';
        }
        else {
          alert(response.data.error);
          document.getElementById('preloader').style.animation = 'fading-out 500ms forwards';
          setTimeout(function() {
            document.getElementById('preloader').style.display = 'none';
          }, 500);  
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
}