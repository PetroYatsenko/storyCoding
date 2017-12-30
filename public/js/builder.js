window.addEventListener("DOMContentLoaded", function(event) {
  var $input = $('#your_story');
  var message = 'Малувато, подумай і додай іще.'; //TODO
  var min_length = 25;
  var go = document.getElementById(nextButton);
  
  function doneTyping() {    
    if ($input.val().length < min_length ) {
      go.disabled = true;
      go.classList.remove('active');
      alert(message);
    } else {
      go.disabled = false;
      go.classList.add('active');
    }    
  };
  
  $input.on('change', function() {   
    doneTyping();
  });
  
}, false);


