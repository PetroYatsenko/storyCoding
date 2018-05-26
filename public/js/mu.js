$(document).ready(function(){$(".navbar a, footer a[href='#myPage']").on("click",function(o){if(""!==this.hash){o.preventDefault()
var n=this.hash
$("html, body").animate({scrollTop:$(n).offset().top},900,function(){window.location.hash=n})}}),$(window).scroll(function(){$(".slideanim").each(function(){var o=$(this).offset().top,n=$(window).scrollTop()
n+600>o&&$(this).addClass("slide")})})})
