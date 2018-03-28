$(document).ready(function() {
  var $q = document.getElementById('quest');
  var $b = document.getElementById('btns');
  var $a = document.getElementById('answ');
  var $s = document.getElementById('subtitle');
  var prop;
  
  var pickRandomProp = function(obj) {
    var result;
    var count = 0;
    for (let prop in obj)
      if (Math.random() < 1/++count && !t[prop].p)
        result = prop;
    return result;
  };
  
  var initTest = function() {
    prop = pickRandomProp(t);
    if (typeof prop === 'undefined') {
      alert('no tests more!');
    }
    console.log(typeof prop, t[prop])
    $s.innerHTML = t[prop].s;
    
    var pq = document.createElement("P");
    pq.className = 'story_text visible';
    pq.innerHTML = t[prop].q;
    $q.appendChild(pq);
    
    var sml = Math.round(12 / t[prop].v.split(splitter).length);
    t[prop].v.split(splitter).forEach(function(val, ind) {      
      var pb = document.createElement("BUTTON");
      var div = document.createElement('DIV');
      div.className = 'text-center col-sm-' + sml
      pb.className = 'btn btn-success btn-md bm-10';
      pb.setAttribute('type','button');
      pb.setAttribute('id', ind);
      pb.setAttribute('name', 'variant');
      pb.innerHTML = val;
      div.appendChild(pb);
      $b.appendChild(div);
    });
  };
  
  initTest();
  
  var showAnsw = function() {
    $(this).removeClass('btn-success').addClass('btn-basic');
    var pa = document.createElement("P");
    var nb = document.createElement('BUTTON');
    pa.className = 'story_text visible';
    pa.innerHTML = t[prop].a;    
    nb.className = 'btn btn-info btn-lg float-right';
    nb.setAttribute('type', 'button'); 
    nb.setAttribute('id', nextButton);
    nb.innerHTML = '>>>';
    $a.appendChild(pa);
    $a.appendChild(nb);
    $('#answ').slideDown('slow');
    $("[name='variant']").off('click');
  };
  
  var cleaner = function () {
    $q.innerHTML = '';
    $b.innerHTML = '';
    $a.innerHTML = '';
    $s.innerHTML = '';    
    t[prop].p = true;
    initTest();
    $("[name='variant']").on('click', showAnsw);
  };
  
  $("[name='variant']").on('click', showAnsw);
  $(document).on('click', '#next', cleaner);
  
});


