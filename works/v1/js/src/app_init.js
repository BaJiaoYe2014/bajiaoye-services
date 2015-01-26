var app = window.app||{};
app.fn  = app.fn||{};
app.instance  = app.instance||{};

//生成位置css
app.fn.getCss = function(){
    var num = 10,
        val = 10,
        styleStr = '',
        dirArr = ['left','top','right','bottom'];

    var oneDirection = function(numVal){
        var dirStr = '',
            sign   = 1;
        for(var j=0,len=dirArr.length; j<len; j++){
            //每个位置值的样式
            dirStr += '.'+ dirArr[j] + numVal + '{'+ dirArr[j] +':' + (-1)*numVal + '%;} ';
            //每个位置值，到达目标动画样式
            //.toTop0_fromTop10{
            //-webkit-animation: toTop0_ani .6s ease-out;
            var animateClassName = 'to' + dirArr[j] + '0_from' + dirArr[j] + numVal,
                animateName = animateClassName + '_ani',
                animateTime = numVal *0.01;

            dirStr +=  '.'+animateClassName+'{-webkit-animation: '+ animateName +' '+animateTime+'s ease-out;} ';
            dirStr += '@-webkit-keyframes  '+ animateName +'{';
            dirStr += '100%{ '+ dirArr[j] +':0; } } ';
        }
        return dirStr;
    }
    for(var i=0; i<num; i++){
        numVal = (10+i*10);
        //位置值
        styleStr += oneDirection(numVal);
    }
    for(var k=0,kLen=dirArr.length; k<kLen; k++){
        styleStr += '.' + dirArr[k] + '0{'+ dirArr[k]+':0;} ';
    }
    return styleStr;
}

//公用的属性，继承过来
app.instance.common = (new function(){
	var that = this,
		pageWidth  = $(window).width(),
		pageHeight = $(window).height();

	that.pageSize       = {'width':pageWidth,'height':pageHeight};
	that.musicIcon      = $('#musicIcon');
	that.startBox       = $('#startBox');
	that.pageContent    = $('#pageContent');
	that.loadBox        = $('#loadBox');
	that.loadPage       = $('#loadPage');

	that.checkKey = function(keyArr,obj){
		for(var i=0,len=keyArr.length; i<len; i++){
			if(!obj[keyArr[i]]){
				console.log("key=" + keyArr[i] + ", 没有值请检查，配置文件.");
			}
		}
	}

	that.addCss = function(cssStr){
		try {
		    var style = document.createStyleSheet();
		    style.cssText = cssStr;
		 }catch (e) {
		    var style = document.createElement("style");
		    style.type = "text/css";
		    style.textContent = cssStr;
		    document.getElementsByTagName("HEAD").item(0).appendChild(style);
		}
	}

	var cssStr = app.fn.getCss(),
        bgColorStr = app.global.backgroundColor? 'body,#loaderBox{background:' + app.global.backgroundColor + '}\n':'';
	cssStr += '.page{width:'+pageWidth+'px; height:'+pageHeight+'px;} \n '+bgColorStr;
    $('title').text(app.global.pageTitle);
	that.addCss(cssStr);
	app.fn.share();
});



