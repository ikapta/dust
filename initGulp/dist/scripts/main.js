;(function($){
    $.JSEN= {
        IsPhone: function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                        "SymbianOS", "Windows Phone",
                        "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    /* phone */
                    flag = true;
                    break;
                } else {
                    /* PC */
                    flag = false;
                }
            }
            return flag;
        },
        searchFormEvent:function(){
            var $formObj=$('#jsn_search_form');
            var $formValue=$('#jsn_search_text');
            var clientWidth=$(window).width();
            $('.jsn-widget .search').on('click',function(){
                if(clientWidth>=600){
                     $formObj.css({'right':'0'});
                }
                else{
                   $formObj.css({'right':'0'});
                }
               
            })
            $('#jsn_search_form .close').on('click',function(){
                if(clientWidth>=600){
                   $formObj.css({'right':'-600px'});

                }
                else{
                    $formObj.css({'width':'0','right':'-600px',});
                }
                
               $formValue.val('');
            })
        }, 
        

    };
   function pageChange(){
   		$(".listPagger .pagination li").on('click',function(){
   			$(".listPagger .pagination li").removeClass("active");
   			$(this).addClass("active");
   		});
   }
    $(function () {
        $.JSEN.searchFormEvent();
		pageChange();
    });
})(jQuery);
console.log(1);