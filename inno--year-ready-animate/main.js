$(function(){
var stopSignal=false;

var basePlace=$('.needPlace');
var allPlace=basePlace.length; //209

//获取随机数
function randomNum(min,max){
	return parseInt(Math.random() * (max-min+1)+min);
}
//弹出头像的基本代码
function newDialogPeople(_currentPeople) {
	var peopleHtml="<div class=\"animatePeople\" >"+
			"<div class=\"animatWrap\">"+
					"<img src='"+_currentPeople.imgUrl+"'>"+
					"<div class=\"sign-name\">"+_currentPeople.name+"</div>"+
			"</div>"+
		"</div>";
	$('body').append(peopleHtml);	
}


//图像消失
function outStart(_currentPeople,count1){
				var outpeoplePlace= $('#ready'+count1);
				var _targetTop=$(outpeoplePlace).offset().top;
				var _targetLeft=$(outpeoplePlace).offset().left;
				
				$('.animatePeople').css({
					"top":_targetTop+$(outpeoplePlace).height()/2,
					"left":_targetLeft+$(outpeoplePlace).width()/2,
					"transform":"translate(-50%,-50%) scale(0)",
					});
				//动画完事后,高亮当前用户。同时移除当前的用户html
				$('#ready'+count1).addClass("activePeople");
				$('#ready'+count1).find('img').attr('src',_currentPeople.imgUrl);
				setTimeout(function(){
					$('.animatePeople').remove();
					//所有完事之后，开始请求一个新的人
					ajaxData();
				 },2000);
			}

//图像出现	
function raiseStart(_currentPeople,count1){
				//新建一个新的头像
				newDialogPeople(_currentPeople);
				
				setTimeout(function(){
				 	$('.animatePeople').css({
					"top":"50%",
					"transform":"translate(-50%,-50%) scale(3)",
					});
				},1000);
				
					
				 setTimeout(function(){
				 	outStart(_currentPeople,count1);
				 },3000);
			}
	
//初始化当前people各参数
function getPosition(res1){
	var currentActive=$('.activePeople');
	var count1=$(currentActive).length+1;
	if(res1!=""){
		if(count1 <= allPlace){
			raiseStart(res1,count1);
		}else{
			//超过ready的人数209，随机取位置放
		 	var count2= randomNum(1,allPlace);
			raiseStart(res1,count2);
		}
		
	}else{
		setTimeout(function(){
			ajaxData();
		},1000);
	}
}	

function ajaxData() {
		// $.ajax({
        //         url: "/Backoffice/PraiseAndPlayCount",
        //         type: "post",
        //         contentType: "application/json",
        //         success: function(data) {
		// 				getPosition(data);
        //         }
        // });
		if(!stopSignal){
			var data=[{imgUrl:"images/images/a003.jpg",name:"了了"}];
			getPosition(data[0]);
		}
		
}	
//init 开始		
ajaxData();

//仅仅是暂停
$("#stop").click(function(){
	$(this).text()=="stop"?$(this).text("show"):$(this).text("stop")
	stopSignal==true?stopSignal=false:stopSignal=true;
	ajaxData();
})
//暂停并显示ready
$("#ready").click(function(){
	//stopSignal=true;
	var readyArr=["r","e","a","d","y"];
	readyArr.forEach(function(item){
		$('.ready'+item).addClass('activePeople');
	})
})

	
})//end main



//辅助function,没用
function getreadyIds(o1o) {
	var allids=[];
		$.each(basePlace,function(i){
			var r1=$(basePlace[i]).attr('data-'+o1o);
			if(typeof r1 != "undefined"){
				allids.push(r1);
			}
		})
		return allids;
}

function getreadyIdsa() {
	var allids=$('.needPlace');
		$.each($('.needPlace'),function(i){
			var r1=$(allids[i]).attr('data-readyr');
			if(typeof r1 != "undefined"){
				$(allids[i]).parent().addClass('readyr')
			}
		})
		return allids;
}
function test2() {
	var ss=$('.readyr');
	$.each(ss,function(i){
		var t=i+1;
		$(ss[i]).attr('id','ready'+t);
	})
	$('.readyr')
}






