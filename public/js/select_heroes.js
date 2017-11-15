$(document).ready(function() {
  var storyBuilderPath = '/practice/story_builder'; //TODO: grab from the database
  
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
    document.getElementById('go_ahead').classList.replace('disabled', 'enabled');   
  }
  
  var saveHeroes = function(fh, sh, mr, callback) {    
    if (typeof(Storage) !== "undefined") {
      sessionStorage.fh = fh;
      sessionStorage.sh = sh;
      sessionStorage.mr = mr;
      callback();
    } else {
       alert('Sorry. Your browser has no web-session support. Please, use a newest browser version.')
    }    
  }
  
  var sendHeroes = function(fh, sh, mr) {
    $.post('/practice/story_builder',
      {
        fh: fh,
        sh: sh,
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
  }
  
  document.getElementById("go_ahead").onclick = function() {
    var fh = document.getElementById("first_hero");
    var sh = document.getElementById("second_hero");
    var mr = document.getElementsByClassName("w3-opacity-off")[0];

    fh = fh.options[fh.selectedIndex].value;
    sh = sh.options[sh.selectedIndex].value;
    mr = mr.id;
    
//    sendHeroes(fh, sh, mr);
    saveHeroes(fh, sh, mr, function() {      
      window.location.href = storyBuilderPath + '?fh=' + fh + '&sh=' + sh + '&mr=' + mr;
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

