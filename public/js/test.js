$(document).ready(function() {
  var $q = document.getElementById('quest');
  var $b = document.getElementById('btns');
  var $a = document.getElementById('answ');
  
  var pickRandomProp = function(obj) {
    var result;
    var count = 0;
    for (let prop in obj)
      if (Math.random() < 1/++count)
        result = prop;
    return result;
  };
  
  var initTest = function() {
    var prop = pickRandomProp(t);
    var pq = document.createElement("P");
    pq.className = 'story_text visible';
    pq.innerHTML = t[prop].q;
    $q.appendChild(pq);
    
    t[prop].v.split('@').forEach(function(val, ind) {      
      var pb = document.createElement("BUTTON");
      pb.className = 'btn btn-success btn-sm';
      pb.setAttribute('type','button');
      pb.setAttribute('id', ind);
      pb.innerHTML = val;      
      $b.appendChild(pb);
    });
        
    var pa = document.createElement("P");
    pa.className = 'story_text';
    pa.innerHTML = t[prop].a;
    $a.appendChild(pa);
   
  }();
});


