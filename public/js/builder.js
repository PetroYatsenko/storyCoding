window.addEventListener("DOMContentLoaded", function(event) {
  var typingTimer; 
  var $input = $('#your_story');
  var message = 'Малувато, подумай і додай іще.'; //TODO
  var min_length = 25;
  var doneTypeInterval = 1000;
  var go = document.getElementById('go');
  
  $input.on('keyup', function() {   
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypeInterval);
  });
 
  $input.on('keydown', function() {
    clearTimeout(typingTimer);
  });
  
  function doneTyping() {    
    if ($input.val().length < min_length ) {
      go.classList.replace('enabled', 'disabled');
      alert(message);
    } else {
      go.classList.replace('disabled', 'enabled');
    }    
  };
  
}, false);


