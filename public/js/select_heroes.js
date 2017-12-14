$(document).ready(function() {
  var storyBuilderPath = '/practice/story_builder'; //TODO: grab from the database
          
  var getCurMonster = function() {    
    var mr = this.id;

    saveHeroes(mr, function() {      
      window.location.href = storyBuilderPath + '?mr=' + mr;
    });
  }
  
  var saveHeroes = function(mr, callback) {    
    if (typeof(Storage) !== "undefined") {      
      sessionStorage.mr = mr;
      callback();
    } else {
       // TODO: translation
       alert('Sorry. Your browser has no web-session support. Please, use a newest browser version.')
    }    
  }  
    
  var addZooEvents = function() {
    var nums = document.getElementById("zoo");
    var listItem = nums.getElementsByTagName("img");    
    
    for (var i = 0; i < listItem.length; i++) {           
      listItem[i].onclick = getCurMonster;
    }
  }();  
  
});

