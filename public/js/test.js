$(document).ready(function() {
  var $q = document.getElementById('quest');
  var $b = document.getElementById('btns');
  var $a = document.getElementById('answ');
  var $s = document.getElementById('subtitle');
  
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
    
    var sml = 12 / t[prop].v.split('@').length;
    t[prop].v.split('@').forEach(function(val, ind) {      
      var pb = document.createElement("BUTTON");
      var div = document.createElement('DIV');
      div.className = 'col-sm-' + sml
      pb.className = 'btn btn-success btn-sm mb-2';
      pb.setAttribute('type','button');
      pb.setAttribute('id', ind);
      pb.innerHTML = val;
      div.appendChild(pb);
      $b.appendChild(div);
    });
    
    $s.innerHTML = t[prop].s;
        
    var pa = document.createElement("P");
    pa.className = 'story_text';
    pa.innerHTML = t[prop].a;
    $a.appendChild(pa);
   
  }();
});


