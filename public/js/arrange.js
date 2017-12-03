window.addEventListener("DOMContentLoaded", function(event) {
  var myStory = [];
  var notebook = document.getElementById('story');
  const className = 'theory_item';
  
  var arrangeStory = function() {    
    myStory = JSON.parse(sessionStorage.story);
    
    for (let i = 0; i < myStory.length; i++) {
      var p = document.createElement("P");
      p.className = className;    
      p.appendChild(document.createTextNode(myStory[i]));
      notebook.appendChild(p);
    }
  }();
  
  var saveUserStory = function() {
    var items = [];
    
    for (let i = 0; i < getStep(); i++) {
      items.push(sessionStorage[storyId + i]);
    }
        
    $.post('/practice/story_builder/arrange',
      {
        story: JSON.stringify(items),
        _csrf: $('meta[name=csrf-token]').attr("content")
      },
      function(data) {
        if (data.status === 'OK') {
           window.location.href = nextPath;
        }
      }            
    );
  }
}, false);

