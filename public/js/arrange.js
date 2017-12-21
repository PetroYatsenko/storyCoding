window.addEventListener("DOMContentLoaded", function(event) {
  var myStory = [];
  var notebook = document.getElementById('story');
  var $pdf = $('#pdf');
  var $edit = $('#edit');
  var $rec = $('#record');
  var $print = $('#print');
  var $dload = $('#dload');
  var $story = $('#story');
  
  var arrangeStory = function() {
    $('#monster_img').attr('src', '/images/monsters_large/' + sessionStorage.mr + '_large.png')
    myStory = JSON.parse(sessionStorage.story);
    
    for (let i = 0; i < myStory.length; i++) {
      var p = document.createElement("P");
      p.appendChild(document.createTextNode(myStory[i]));
      notebook.appendChild(p);
    }
  }();
  
  var saveRedirect = function() {       
    $.post(savePath,
      {
        story: sessionStorage.story,
        mr: sessionStorage.mr,
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
  
  var processStory = function(e) {    
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
      
      switch(e.data.action) {
        case 'pdf':
          pdfMake.createPdf(doc).open();
          break;  
        case 'dload':
          pdfMake.createPdf(doc).download(sessionStorage.mr + '.pdf');
          break;
        case 'print':
          pdfMake.createPdf(doc).print();
          break;
      }
    };
  };
  
  var startStoryEdit = function() {
    $story.attr('contenteditable', true).focus();
    $edit.attr('disabled', true);
    $pdf.attr('disabled', true);
    $dload.attr('disabled', true);
    $print.attr('disabled', true);
  }
  
  var endStoryEdit = function() {
    $story.attr('contenteditable', false);
    $edit.attr('disabled', false);
    $pdf.attr('disabled', false);
    $dload.attr('disabled', false);
    $print.attr('disabled', false);
  }
  
  var recEditedStory = function() {
    var newStory = [];
    
    $('#story p').each(function() {
      newStory.push($(this).text());
    });
    
    sessionStorage.story = JSON.stringify(newStory);
  }
  
  var saveStory = function() {
    if ($edit.attr('disabled')) {
      // Save to the sessionStorage
      endStoryEdit();
      recEditedStory();
    } else {
      // Redirect to the dashboard page with message
      saveRedirect();
    }
  }
  
  $pdf.on('click', {action:'pdf'}, processStory);
  $print.on('click', {action: 'print'}, processStory);
  $dload.on('click', {action: 'dload'}, processStory);
  $edit.on('click', startStoryEdit);
  $rec.on('click', saveStory);
  
}, false);

