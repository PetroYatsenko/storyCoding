window.addEventListener("DOMContentLoaded",function(e){var t=0
const n="your_story",s="task_",o="story_item_"
var i=[],c=(function(){"undefined"==typeof Storage&&alert(wsAlert)}(),function(e){var t=(new DOMParser).parseFromString(e,"text/html")
return t.body.textContent||""}),a=function(){return t},r=function(){return steps[a()]},d=function(){t++},l=function(e,t){if(0!==e.length){var n=document.getElementById(t),s=Function("arrangeByClick",e)
n.onclick=function(){s(),this.onclick=null}}},m=function(){var e=o+a(),t=s+a()
i.push(c(document.getElementById(e).innerHTML)),i.push(c(document.getElementById(t).innerHTML)),i.push(c(document.getElementById(n).value))},u=function(){0===a()?sessionStorage.setItem("title",c(document.getElementById(n).value)):i.push(c(document.getElementById(n).value))},y=function(){sessionStorage.setItem("story",JSON.stringify(i)),sessionStorage.setItem("title",storyTitle)},g=function(){sessionStorage.setItem("story",JSON.stringify(i))},v=function(){document.getElementById(o+a()).classList.add("visible"),document.getElementById(nextButton).classList.remove("active")
var e=document.getElementById(nextButton)
e.onclick=function(){switch(storyType){case"practice":m()
break
case"diploma":u()}if(d(),a()<steps.length)f(),B(),E(),window.scrollTo(0,0)
else{switch(storyType){case"practice":y()
break
case"diploma":g()}window.location.replace(nextPath)}}},f=function(){var e=a()-1
document.getElementById(o+e).classList.remove("visible"),"lesson"!==storyType&&(document.getElementById(n).classList.remove("visible"),document.getElementById(n).value="",document.getElementById(n).placeholder="",document.getElementById(s+e).classList.remove("visible"))},I=function(e,t,n,s){for(var o in s)for(var i in s[o])switch(e){case"replace":n+='document.getElementById("'+o+'").'+i+'="'+s[o][i]+'";'
break
case"remove":n+='document.getElementById("'+o+'").classList.'+e+'("'+s[o][i]+'");'
break
case"add":n+='document.getElementById("'+o+'").classList.'+e+'("'+s[o][i]+'");'
break
case"toggle":"disabled"===s[o][i]?(n+='document.getElementById("'+o+'").classList.remove("active");',n+='document.getElementById("'+o+'").disabled = true;'):n+='document.getElementById("'+o+'").disabled = false;'}return n},B=function(){var e=r(),t=e.state
for(var s in t)if(t.hasOwnProperty(s)){var o=document.getElementById(s)
"disabled"===t[s]?o.disabled=!0:(o.disabled=!1,o.classList.add(t[s]))}"lesson"!==storyType&&(document.getElementById(n).placeholder=tips[a()])},E=function(){var e,t=r().actions
for(var n in t){e=""
for(var s in t[n])e=I(s,n,e,t[n][s])
l(e,n)}v()}
B(),E()},!1)
