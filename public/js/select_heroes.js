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
 
  document.getElementById(nextButton).onclick = function() {    
    var mr = document.getElementsByClassName("w3-opacity-off")[0];
    mr = mr.id;
    
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

