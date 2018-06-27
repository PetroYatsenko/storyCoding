$(document).ready(function(){var e,n=document.getElementById("quest"),r=document.getElementById("btns"),a=document.getElementById("answ"),o=document.getElementById("subtitle")
sessionStorage.score="none"
var c=function(t){var e=Object.keys(t)
return e[e.length*Math.random()<<0]},i=function(){if(e=c(t),void 0===e)return void m()
o.innerHTML=t[e].s
var a=document.createElement("P")
a.className="story_text visible",a.innerHTML=t[e].q,n.appendChild(a),t[e].v.split(splitter).forEach(function(t,e){var n=document.createElement("BUTTON"),a=document.createElement("DIV")
a.className="text-center col-sm-6",n.className="btn btn-success btn-md bm-10",n.setAttribute("type","button"),n.setAttribute("id",e),n.setAttribute("name","variant"),n.innerHTML=t,a.appendChild(n),r.appendChild(a)})}
i()
var d=function(){$(this).removeClass("btn-success").addClass("btn-default")
var n=document.createElement("P"),r=document.createElement("BUTTON")
n.className="story_text visible",n.innerHTML=l.decode(t[e].a),r.className="btn btn-info btn-lg float-right",r.setAttribute("type","button"),r.setAttribute("id",nextButton),r.innerHTML=">>>",a.appendChild(n),a.appendChild(r),$("#answ").slideDown("slow"),$("[name='variant']").off("click")},s=function(){n.innerHTML="",r.innerHTML="",a.innerHTML="",o.innerHTML="",$("#answ").css("display","none"),delete t[e],window.scrollTo(0,0)},h=function(){s(),i(),$("[name='variant']").on("click",d)}
$("[name='variant']").on("click",d),$(document).on("click","#next",h)
var m=function(){$.post(savePath,{test_name:testName,score:sessionStorage.score,_csrf:$("meta[name=csrf-token]").attr("content")},function(t){"OK"===t.status&&(window.location.href=nextPath)})},l={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(t){var e,n,r,a,o,c,i,d="",s=0
for(t=l._utf8_encode(t);s<t.length;)e=t.charCodeAt(s++),n=t.charCodeAt(s++),r=t.charCodeAt(s++),a=e>>2,o=(3&e)<<4|n>>4,c=(15&n)<<2|r>>6,i=63&r,isNaN(n)?c=i=64:isNaN(r)&&(i=64),d=d+this._keyStr.charAt(a)+this._keyStr.charAt(o)+this._keyStr.charAt(c)+this._keyStr.charAt(i)
return d},decode:function(t){var e,n,r,a,o,c,i,d="",s=0
for(t=t.replace(/[^A-Za-z0-9\+\/\=]/g,"");s<t.length;)a=this._keyStr.indexOf(t.charAt(s++)),o=this._keyStr.indexOf(t.charAt(s++)),c=this._keyStr.indexOf(t.charAt(s++)),i=this._keyStr.indexOf(t.charAt(s++)),e=a<<2|o>>4,n=(15&o)<<4|c>>2,r=(3&c)<<6|i,d+=String.fromCharCode(e),64!=c&&(d+=String.fromCharCode(n)),64!=i&&(d+=String.fromCharCode(r))
return d=l._utf8_decode(d)},_utf8_encode:function(t){t=t.replace(/\r\n/g,"\n")
for(var e="",n=0;n<t.length;n++){var r=t.charCodeAt(n)
128>r?e+=String.fromCharCode(r):r>127&&2048>r?(e+=String.fromCharCode(r>>6|192),e+=String.fromCharCode(63&r|128)):(e+=String.fromCharCode(r>>12|224),e+=String.fromCharCode(r>>6&63|128),e+=String.fromCharCode(63&r|128))}return e},_utf8_decode:function(t){for(var e="",n=0,r=c1=c2=0;n<t.length;)r=t.charCodeAt(n),128>r?(e+=String.fromCharCode(r),n++):r>191&&224>r?(c2=t.charCodeAt(n+1),e+=String.fromCharCode((31&r)<<6|63&c2),n+=2):(c2=t.charCodeAt(n+1),c3=t.charCodeAt(n+2),e+=String.fromCharCode((15&r)<<12|(63&c2)<<6|63&c3),n+=3)
return e}}})