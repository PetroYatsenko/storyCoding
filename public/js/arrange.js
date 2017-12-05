window.addEventListener("DOMContentLoaded", function(event) {
  var myStory = [];
  var notebook = document.getElementById('story');
  const className = 'theory_item';
  const savePath = '/practice/story_builder/arrange';
  var $pdf = $('#pdf');
  
  var arrangeStory = function() {    
    myStory = JSON.parse(sessionStorage.story);
    
    for (let i = 0; i < myStory.length; i++) {
      var p = document.createElement("P");
      p.className = className;    
      p.appendChild(document.createTextNode(myStory[i]));
      notebook.appendChild(p);
    }
  }();
  
  var saveUserStory = function() {
    var items = [];
    
    for (let i = 0; i < getStep(); i++) {
      items.push(sessionStorage[storyId + i]);
    }
        
    $.post(savePath,
      {
        story: JSON.stringify(items),
        _csrf: $('meta[name=csrf-token]').attr("content")
      },
      function(data) {
        if (data.status === 'OK') {
           window.location.href = nextPath;
        }
      }            
    );
  }
  
  function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    
    return canvas.toDataURL("image/png");
  }
  
  var makePdf = function() {
    var doc = {};    
    var dataURL;
    var img = new Image();    
    img.src = '/images/monsters_small/' + sessionStorage.mr + '_medium.png';
//    img.src = '/images/monster_king.png';
    myStory = JSON.parse(sessionStorage.story);
    
    doc = {
      pageSize: 'A4',
      pageMargins: [ 40, 60, 40, 60 ], // left, top, right, bottom
      background: {
        text: 'Кодити з історіями.\n Вивчаємо цикли.', //TODO
        style: 'back'
      },
      styles: {
        title: {
          fontSize: 22,
          bold: true
        },
        para: {
          fontSize: 15,
          alignment: 'left'
        },
        back: {
          fontSize: 12,
          alignment: 'right',
          margin: 10,
          color: '#0074c1'
        },
        image: {
          alignment: 'left'
        }
      },
      content: [{
        text: sessionStorage.title + '\n\n', 
        style: 'title'
      }]
    };
    
    img.onload = function() {
      dataURL = getBase64Image(img);        
      doc.content.push({image: dataURL, style: 'image'});
      doc.content.push('\n\n');

      for (let i = 0; i < myStory.length; i++) {
        doc.content.push({text: myStory[i] + '\n\n', style: 'para'});
      };

//      pdfMake.createPdf(doc).download(sessionStorage.mr + '.pdf');
      pdfMake.createPdf(doc).open();
    };
  };
  
   $pdf.on('click', makePdf);
  
}, false);

