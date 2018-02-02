$(document).ready(function() {
  var getCurMonster = function() {    
    var mr = this.id;
    saveHero(mr, function() {      
      window.location.href = nextStep + '?mr=' + mr;
    });
  }
  
  var saveHero = function(mr, callback) {    
    if (typeof(Storage) !== "undefined") {      
      sessionStorage.mr = mr;
      callback();
    } else {
       alert(webStorageAlert)
    }    
  }  
    
  var addZooEvents = function() {
    var nums = document.getElementById("zoo");
    var listItem = nums.getElementsByClassName("w3-hover-opacity-off");    
    
    for (var i = 0; i < listItem.length; i++) {           
      listItem[i].onclick = getCurMonster;
    }
  }();
});

