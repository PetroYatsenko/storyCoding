$(document).ready(function() {
  var $q = document.getElementById('quest');
  var $b = document.getElementById('btns');
  var $a = document.getElementById('answ');
  var $s = document.getElementById('subtitle');
  var prop;
  sessionStorage.score = 'none';
  
  var pickRandomProp = function(obj) {
    var keys = Object.keys(obj);
    return keys[keys.length * Math.random() << 0];
  };
  
  var initTest = function() {
    prop = pickRandomProp(t);
    if (typeof prop === 'undefined') {
      saveRedirect();
      return;
    }
    $s.innerHTML = t[prop].s;    
    var pq = document.createElement("P");
    pq.className = 'story_text visible';
    pq.innerHTML = t[prop].q;
    $q.appendChild(pq);
    
    t[prop].v.split(splitter).forEach(function(val, ind) {      
      var pb = document.createElement("BUTTON");
      var div = document.createElement('DIV');
      div.className = 'text-center col-sm-6';
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
    $(this).removeClass('btn-success').addClass('btn-default');
    var pa = document.createElement("P");
    var nb = document.createElement('BUTTON');
    pa.className = 'story_text visible';
    pa.innerHTML = Base64.decode(t[prop].a);    
    nb.className = 'btn btn-info btn-lg float-right';
    nb.setAttribute('type', 'button'); 
    nb.setAttribute('id', nextButton);
    nb.innerHTML = '>>>';
    $a.appendChild(pa);
    $a.appendChild(nb);
    $('#answ').slideDown('slow');
    $("[name='variant']").off('click');
  };
  
    var cleaner = function() {
    $q.innerHTML = '';
    $b.innerHTML = '';
    $a.innerHTML = '';
    $s.innerHTML = '';
    $('#answ').css('display','none');
    delete t[prop];
    window.scrollTo(0, 0);
  };
  
  var getStep = function() {
    cleaner();    
    initTest();
    $("[name='variant']").on('click', showAnsw);
  };
  
  $("[name='variant']").on('click', showAnsw);
  $(document).on('click', '#next', getStep);
  
  var saveRedirect = function() {       
    $.post(savePath,
      { 
        test_name: testName, 
        score: sessionStorage.score,
        _csrf: $('meta[name=csrf-token]').attr("content")
      },
      function(data) {
        if (data.status === 'OK') {
           window.location.href = nextPath;
        }
      }            
    );
  }
  
  var Base64 = {
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    
    encode : function (input) {
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = Base64._utf8_encode(input);

      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        };

        output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + 
          this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
      }

      return output;
    },

    decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      
      while (i < input.length) {
        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output = output + String.fromCharCode(chr1);
        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }
      };
      
      output = Base64._utf8_decode(output);
      
      return output;
    },
   
    _utf8_encode : function (string) {
      string = string.replace(/\r\n/g,"\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    },

    _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = c1 = c2 = 0;

      while ( i < utftext.length ) {
        c = utftext.charCodeAt(i);
        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        }
        else if((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i+1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        }
        else {
          c2 = utftext.charCodeAt(i+1);
          c3 = utftext.charCodeAt(i+2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }
      };
      
      return string;
    }
  };
  
});


