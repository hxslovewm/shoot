 //JavaScript Document
  
//游戏结束输入手机号	
$(function(){
	var w1=document.documentElement.clientWidth;
	var h1=document.documentElement.clientHeight;
	var img_h=1040*(w1/640);
	document.getElementById("bg_tjxx").style.top= img_h*0.0+ 'px'; 
	document.getElementById("bg_tjxx").style.marginLeft= w1*0+ 'px';
	
	document.getElementById("score").style.top= img_h*0.244+ 'px';
	
	document.getElementById("phone").style.top= img_h*0.414+ 'px';
	document.getElementById("phone").style.height= img_h*0.04+ 'px';
	
	document.getElementById("phone_tip").style.top= img_h*0.457+ 'px';
	
	document.getElementById("btn_qd").style.top= img_h*0.665+ 'px';
	
});

//$(function(){
//	$('#btn_share2').click(function(){
//		$('.share_popup').css('display','block');
//	});
//	$('.share_popup').click(function(){
//		$(this).css('display','none');
//	});
//});
//

//排行榜	
$(function(){
	var w1=document.documentElement.clientWidth;
	var h1=document.documentElement.clientHeight;
	var img_h=1040*(w1/640);
	document.getElementById("list").style.top= img_h*0.144+ 'px';
	document.getElementById("list").style.height= img_h*0.44+ 'px';
	
	document.getElementById("list2").style.top= img_h*0.664+ 'px';
		
	document.getElementById("btn_return").style.top= img_h*0.873+ 'px';
});



