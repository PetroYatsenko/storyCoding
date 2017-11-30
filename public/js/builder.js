window.addEventListener("DOMContentLoaded", function(event) {
  var $input = $('#your_story');
  var message = 'Малувато, подумай і додай іще.'; //TODO
  var min_length = 25;
  var go = document.getElementById('go');
  
  function doneTyping() {    
    if ($input.val().length < min_length ) {
      go.classList.replace('enabled', 'disabled');
      alert(message);
    } else {
      go.classList.replace('disabled', 'enabled');
    }    
  };
  
  $input.on('mouseout', function() {   
    doneTyping();
  });
  
}, false);


