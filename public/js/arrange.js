window.addEventListener("DOMContentLoaded", function(event) {
  var myStory = [];
  var notebook = document.getElementById('story');
  var $pdf = $('#pdf');
  var $edit = $('#edit');
  var $rec = $('#record');  
  const className = 'theory_item';
  const savePath = '/practice/story_builder/arrange';
  
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
          bold: true,
          margin: [0, 0, 0, 20]
        },
        para: {
          fontSize: 15,
          alignment: 'justify',
          margin: [0, 0, 0, 20],
        },
        back: {
          fontSize: 12,
          alignment: 'right',
          margin: 10,
          color: '#0074c1'
        },
        image: {
          alignment: 'left',
          margin: [0, 0, 0, 20]
        },
        loop: {
          fontSize: 16,
          color: '#0074c1',
          alignment: 'left',
          margin: [0, 0, 0, 20]
        }
      },
      content: [
        {text: sessionStorage.title, style: 'title'}
      ]
    };
    
    img.onload = function() {
      dataURL = getBase64Image(img);        
      doc.content.push({image: dataURL, style: 'image'});
      // TODO add explanation chapters
      for (let i = 0; i < myStory.length; i++) {
        doc.content.push({text: myStory[i], style: 'para'});
      };

//      pdfMake.createPdf(doc).download(sessionStorage.mr + '.pdf');
      pdfMake.createPdf(doc).open();
    };
  };
  
  var editStory = function() {
    $('#story').attr('contenteditable', true).focus();
    $edit.removeClass('enabled').addClass('disabled');
    $pdf.removeClass('enabled').addClass('disabled');
    // Текст зі "Зберегти" на "Готово!"
  }
  
  var saveStory = function() {
    if ($edit.is('.disabled')) {
      // collect to arr from theory_item class
      // remove contenteditable & enable print/editing
      
    } else {
      //post from sessionStorage.story
      // redirect to the my account page with message and passed level (monster marked) + new lessons list
    }
  }
  
  $pdf.on('click', makePdf);
  $edit.on('click', editStory);
  $rec.on('click', saveStory);
  
}, false);

