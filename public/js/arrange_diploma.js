window.addEventListener("DOMContentLoaded", function(event) {
  var myStory = [];
  var notebook = document.getElementById('story');
  var $pdf = $('#pdf');
  var $edit = $('#edit');
  var $rec = $('#save');
  var $send = $('#send');
  var $print = $('#print');
  var $dload = $('#dload');
  var $story = $('#story');
  var $title = $('#story_title');
  
  var arrangeStory = function() {    
    myStory = JSON.parse(sessionStorage.story);
    for (var i = 0; i < myStory.length; i++) {
      var p = document.createElement("P");
      p.className = 'story_text visible';
      p.appendChild(document.createTextNode(myStory[i]));
      notebook.appendChild(p);
    };
    $title.text(sessionStorage.title.toUpperCase());
  }();
  
  var saveRedirect = function() {       
    $.post(savePath,
      {
        story: sessionStorage.story,
        title: sessionStorage.title,
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
    img.src = imgPath;
    myStory = JSON.parse(sessionStorage.story);
    
    doc = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60], // left, top, right, bottom
      background: {
        text: watermark,
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
          margin: [0, 0, 0, 20],
        },
        author: {
          fontSize: 16,
          color: '#0074c1',
          alignment: 'left',          
          margin: [0, 0, 0, 20]
        }
      },
      content: [
        {text: sessionStorage.title.toUpperCase(), style: 'title'},
        {text: author, style: 'author'}
      ]
    };
    
    img.onload = function() {
      dataURL = getBase64Image(img);
      doc.content.push({image: dataURL, width: 250, style: 'image'});
      // TODO add explanation chapters
      for (var i = 0; i < myStory.length; i++) {
        doc.content.push({text: myStory[i], style: 'para'});
      };
      switch(e.data.action) {
        case 'pdf':
          pdfMake.createPdf(doc).open();
          break;  
        case 'dload':
          pdfMake.createPdf(doc).download(sessionStorage.title + '.pdf');
          break;
        case 'print':
          pdfMake.createPdf(doc).print();
          break;
      }
    };
  };
  
  var recEditedStory = function() {
    var newStory = [];    
    $('#story p').each(function() {
      newStory.push($(this).text());
    });   
    sessionStorage.story = JSON.stringify(newStory);
  };
  
  var startStoryEdit = function() {
    $story.attr('contenteditable', true).focus();
    $edit.attr('disabled', true).removeClass('btn-info').addClass('btn-default');
    $rec.attr('disabled', false).removeClass('btn-default').addClass('btn-info');
    $send.attr('disabled', true);
    $pdf.attr('disabled', true);
    $dload.attr('disabled', true);
    $print.attr('disabled', true);
  };
  
  var endStoryEdit = function() {
    $story.attr('contenteditable', false);
    $edit.attr('disabled', false).removeClass('btn-default').addClass('btn-info');
    $rec.attr('disabled', true).removeClass('btn-info').addClass('btn-default');
    $pdf.attr('disabled', false);
    $dload.attr('disabled', false);
    $send.attr('disabled', false);
    $print.attr('disabled', false);
  };
    
  $pdf.on('click', {action:'pdf'}, processStory);
  $print.on('click', {action: 'print'}, processStory);
  $dload.on('click', {action: 'dload'}, processStory);
  $edit.on('click', startStoryEdit);
  $rec.on('click', recEditedStory, endStoryEdit);
  $send.on('click', saveRedirect);
  
}, false);

