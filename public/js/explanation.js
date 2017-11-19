window.addEventListener("DOMContentLoaded", function(event) {
  var nextButton = 'go';
  var go = document.getElementById(nextButton);
  
  go.onclick = function() {
    window.location.href(nextPath);
  } 
}, false);


