$(document).ready(function() {
  var getCurHero = function() {
    window.location.href = nextStep + '/' + this.id;
  }
    
  var addZooEvents = function() {
    var nums = document.getElementById("zoo");
    var listItem = nums.getElementsByClassName("w3-hover-opacity-off");    
    
    for (var i = 0; i < listItem.length; i++) {           
      listItem[i].onclick = getCurHero;
    }
  }();
});

