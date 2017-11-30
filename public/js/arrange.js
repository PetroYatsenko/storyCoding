window.addEventListener("DOMContentLoaded", function(event) {
  var arrangeStory = function() {
    var items = [];
    var item = 'us_item_';
    var $story = $('#story');
    
    for (let i = 0; i < sessionStorage.length; i++) {
      $story.append('<p class="theory_item" >' + sessionStorage[item + i] +'</p>');
//      items.push(sessionStorage[item + i]);
    }
//    console.log(items);
  }();
}, false);

