$(document).ready(function() {
  var storyBuilderPath = '/practice/story_builder'; //TODO: grab from the database
  var nextButton = 'go';
          
  var showCurMonster = function() {
    var selected = document.getElementsByClassName('selected_monster');
    var opacity = document.getElementsByClassName('w3-opacity-off');
    
    if (selected.length > 0) {
      selected[0].classList.replace('selected_monster', 'invisible');
    }
    if (opacity.length > 0) {
      opacity[0].classList.replace('w3-opacity-off', 'w3-opacity');
    }
    
    document.getElementById(this.id + '_large').classList.replace('invisible', 'selected_monster');
    document.getElementById(this.id).classList.replace("w3-opacity", "w3-opacity-off");
    document.getElementById(nextButton).classList.replace('disabled', 'enabled');   
  }
  
  var saveHeroes = function(mr, callback) {    
    if (typeof(Storage) !== "undefined") {      
      sessionStorage.mr = mr;
      callback();
    } else {
       alert('Sorry. Your browser has no web-session support. Please, use a newest browser version.')
    }    
  }
  
  var sendHeroes = function(mr) {
    $.post('/practice/story_builder',
      {
        mr: mr,
        _csrf: $('meta[name=csrf-token]').attr("content")
      },
      function(data) {
         if (data.status === 'OK') {
           window.location.href = storyBuilderPath;
         }
      }            
    );
//    var xhttp = new XMLHttpRequest();
//    xhttp.onreadystatechange = function() {
//      if (this.readyState == 4 && this.status == 200) {
//        document.getElementById("demo").innerHTML = this.responseText;
//      }
//    };
//    xhttp.open("GET", '/practice/story_builder?fh=' + fh + '&sh=' + sh + '&mr=' + mr, true);
//    xhttp.send();
  };
  
  document.getElementById(nextButton).onclick = function() {    
    var mr = document.getElementsByClassName("w3-opacity-off")[0];
    mr = mr.id;
    
//    sendHeroes(mr);
    saveHeroes(mr, function() {      
      window.location.href = storyBuilderPath + '?mr=' + mr;
    });
  }    
    
  var addZooEvents = function() {
    var nums = document.getElementById("monsters_zoo");
    var listItem = nums.getElementsByTagName("li");    
    
    for (var i = 0; i < listItem.length; i++) {           
      listItem[i].onclick = showCurMonster;
      listItem[i].classList.add('w3-opacity', 'w3-hover-opacity-off');
    }
  }();  
  
});

