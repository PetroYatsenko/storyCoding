window.addEventListener("DOMContentLoaded",function(t){function e(t){var e=document.createElement("canvas")
e.width=t.width,e.height=t.height
var a=e.getContext("2d")
return a.drawImage(t,0,0),e.toDataURL("image/png")}var a=[],n=document.getElementById("story"),o=$("#pdf"),i=$("#edit"),s=$("#save"),r=$("#send"),d=$("#print"),l=$("#dload"),c=$("#story"),f=$("#story_title"),g=(function(){a=JSON.parse(sessionStorage.story)
for(var t=0;t<a.length;t++){var e=document.createElement("P")
e.className="story_text visible",e.appendChild(document.createTextNode(a[t])),n.appendChild(e)}f.text(sessionStorage.title.toUpperCase())}(),function(){$.post(savePath,{story:sessionStorage.story,title:sessionStorage.title,_csrf:$("meta[name=csrf-token]").attr("content")},function(t){"OK"===t.status&&(window.location.href=nextPath)})}),p=function(t){var n,o={},i=new Image
i.src=imgPath,a=JSON.parse(sessionStorage.story),o={pageSize:"A4",pageMargins:[40,60,40,60],background:{text:watermark,style:"back"},styles:{title:{fontSize:22,bold:!0,margin:[0,0,0,20]},para:{fontSize:15,alignment:"justify",margin:[0,0,0,20]},back:{fontSize:12,alignment:"right",margin:10,color:"#0074c1"},image:{alignment:"left",margin:[0,0,0,20]},author:{fontSize:16,color:"#0074c1",alignment:"left",margin:[0,0,0,20]}},content:[{text:sessionStorage.title.toUpperCase(),style:"title"},{text:author,style:"author"}]},i.onload=function(){n=e(i),o.content.push({image:n,width:250,style:"image"})
for(var s=0;s<a.length;s++)o.content.push({text:a[s],style:"para"})
switch(t.data.action){case"pdf":pdfMake.createPdf(o).open()
break
case"dload":pdfMake.createPdf(o).download(sessionStorage.title+".pdf")
break
case"print":pdfMake.createPdf(o).print()}}},m=function(){var t=[]
$("#story p").each(function(){t.push($(this).text())}),sessionStorage.story=JSON.stringify(t)},u=function(){c.attr("contenteditable",!0).focus(),i.attr("disabled",!0).removeClass("btn-info").addClass("btn-default"),s.attr("disabled",!1).removeClass("btn-default").addClass("btn-info"),r.attr("disabled",!0),o.attr("disabled",!0),l.attr("disabled",!0),d.attr("disabled",!0)},b=function(){c.attr("contenteditable",!1),i.attr("disabled",!1).removeClass("btn-default").addClass("btn-info"),s.attr("disabled",!0).removeClass("btn-info").addClass("btn-default"),o.attr("disabled",!1),l.attr("disabled",!1),r.attr("disabled",!1),d.attr("disabled",!1)}
o.on("click",{action:"pdf"},p),d.on("click",{action:"print"},p),l.on("click",{action:"dload"},p),i.on("click",u),s.on("click",m,b),r.on("click",g)},!1)
