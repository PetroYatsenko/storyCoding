window.addEventListener("DOMContentLoaded", function(event) {
  var $input = $('#your_story');
  var go = document.getElementById(nextButton);
  
  function doneTyping() {    
    if ($input.val().length < minLength ) {
      go.disabled = true;
      go.classList.remove('active');
    } else {
      go.disabled = false;
      go.classList.add('active');
    }    
  };
  
  $input.on('keyup', function() {   
    doneTyping();
  });
  
}, false);


