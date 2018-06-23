window.addEventListener("DOMContentLoaded",function(t){function e(t){var e=document.createElement("canvas")
e.width=t.width,e.height=t.height
var a=e.getContext("2d")
return a.drawImage(t,0,0),e.toDataURL("image/png")}var a=[],n=document.getElementById("story"),o=$("#pdf"),s=$("#edit"),i=$("#send"),r=$("#save"),d=$("#print"),l=$("#dload"),c=$("#story"),f=(function(){"undefined"!=typeof viewer&&viewer?a=JSON.parse(storyTxt):void 0!==sessionStorage.story&&(a=JSON.parse(sessionStorage.story))
for(var t=0;t<a.length;t++){var e=document.createElement("P")
e.className="story_text visible",e.appendChild(document.createTextNode(a[t])),n.appendChild(e)}}(),function(){$.post(savePath,{title:storyTitle,story_name:storyName,story:sessionStorage.story,hero:storyHero,_csrf:$("meta[name=csrf-token]").attr("content")},function(t){"OK"===t.status&&(sessionStorage.clear(),window.location.href=nextPath)})}),g=function(t){var n,o={},s=new Image
s.src=imgPath,a=JSON.parse(sessionStorage.story),o={pageSize:"A4",pageMargins:[40,60,40,60],background:{text:watermark,style:"back"},styles:{title:{fontSize:22,bold:!0,margin:[0,0,0,20]},para:{fontSize:15,alignment:"justify",margin:[0,0,0,20]},back:{fontSize:12,alignment:"right",margin:10,color:"#0074c1"},image:{alignment:"left",margin:[0,0,0,20]},author:{fontSize:16,color:"#0074c1",alignment:"left",margin:[0,0,0,20]}},content:[{text:sessionStorage.title.toUpperCase()||storyTitle,style:"title"},{text:author,style:"author"}]},s.onload=function(){n=e(s),o.content.push({image:n,width:250,style:"image"})
for(var i=0;i<a.length;i++)o.content.push({text:a[i],style:"para"})
switch(t.data.action){case"pdf":pdfMake.createPdf(o).open()
break
case"dload":pdfMake.createPdf(o).download(sessionStorage.title||storyTitle+".pdf")
break
case"print":pdfMake.createPdf(o).print()}}},m=function(){c.attr("contenteditable",!0).focus(),s.attr("disabled",!0).removeClass("btn-info").addClass("btn-default"),r.attr("disabled",!1).removeClass("btn-default").addClass("btn-info"),i.attr("disabled",!0),o.attr("disabled",!0),l.attr("disabled",!0),d.attr("disabled",!0)},p=function(){c.attr("contenteditable",!1),s.attr("disabled",!1).removeClass("btn-default").addClass("btn-info"),r.attr("disabled",!0).removeClass("btn-info").addClass("btn-default"),o.attr("disabled",!1),l.attr("disabled",!1),i.attr("disabled",!1),d.attr("disabled",!1)},u=function(){var t=[]
$("#story p").each(function(){t.push($(this).text())}),sessionStorage.story=JSON.stringify(t),p()}
o.on("click",{action:"pdf"},g),d.on("click",{action:"print"},g),l.on("click",{action:"dload"},g),s.on("click",m),r.on("click",u),i.on("click",f)},!1)
