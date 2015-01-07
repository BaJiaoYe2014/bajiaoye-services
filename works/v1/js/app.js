var app = window.app||{};
app.fn  = app.fn||{};

app.fn.loader =function(){
    var that = this,
        imgList = [],
        loadImgNum = 0;
   // that = $.extend(that,app.instance.common);

    start();
    
    function start (){
        var loaderImg = $('#loaderImg'),
            imgSrc = app.global.shareImage;
        loaderImg.css({'background-image':'url(images/'+ imgSrc+')'});
        getAppImgList();
    }

    //startAnimate
    //contentPageList
    function getAppImgList(){
        forObject(app.startAnimate);
        forObject(app.contentPageList);
        loadImg();
    }

    function forObject(obj){
        for(var k in obj){
            if(typeof obj[k] === 'object'){
                forObject(obj[k]);
            }else{
                var value = obj[k];
                var reg = /\.(?:jpe?g|gif|png|bmp)$/i;
                if(reg.test(value)){
                    imgList.push(value);
                }
            }
        }
    }

    function loadImg(){
        var htmlStr = '<div id="appLoadImgbox" style="">';
        for(var i=0,len=imgList.length; i<len; i++){
            htmlStr += '<img onload="window.appLoader()" src="images/' + imgList[i] + '"/>';
        }
        htmlStr += '</html>';
        $(htmlStr).appendTo($(document.body));
    }

    window.appLoader = function(){
        loadImgNum ++;
        if(loadImgNum === imgList.length){
            $('#loaderBox').animate({'opacity':0},1000,function(){
                $(this).remove();
                $('#appLoadImgbox').remove();
            })
        }
    }
};

app.fn.loader();;var app = window.app||{};
app.fn  = app.fn||{};

app.fn.share = function(){
    share();
    //读取配置参数
    function share(){
        var global = app.global;
        var shareTitle = global.pageTitle;
        var imgUrl = global.shareImg;
        var descContent = global.pageDescribe;
        wx_share_out(shareTitle,imgUrl,descContent);
    }

    function wx_share_out(shareTitle,imgUrl,descContent) {
        var appid = '';
        var lineLink = window.location.href;
        var preStr   = 'http://'+window.location.host;
        if(imgUrl=='' || imgUrl=='0' || imgUrl=='null'||!imgUrl) {
            var imgs = document.getElementsByTagName("img");
            if(imgs.length>0) {
                var urlm = /http:\/\//i;
                imgUrl = imgs[0].src;
                if(!urlm.test(imgUrl)) {
                    imgUrl = preStr + imgUrl;
                } 
            }
        }else{
            imgUrl = preStr + '/images/'+imgUrl;
        }
        
        function shareFriend() {
            WeixinJSBridge.invoke('sendAppMessage',{
                "appid": appid,
                "img_url": imgUrl,
                "img_width": "200",
                "img_height": "200",
                "link": lineLink,
                "desc": descContent,
                "title": shareTitle
            }, function(res) {
                //_report('send_msg', res.err_msg);
            })  
        }
        function shareTimeline() {
            WeixinJSBridge.invoke('shareTimeline',{
                "img_url": imgUrl,
                "img_width": "200",
                "img_height": "200",
                "link": lineLink,
                "desc": descContent,
                "title": shareTitle
            }, function(res) {
                   //_report('timeline', res.err_msg);
            });
        }
        function shareWeibo() {
            WeixinJSBridge.invoke('shareWeibo',{
                "content": descContent,
                "url": lineLink,
            }, function(res) {
                //_report('weibo', res.err_msg);
            });
        }
        // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            // 发送给好友
                WeixinJSBridge.on('menu:share:appmessage', function(argv){
                    shareFriend();
                });
                // 分享到朋友圈
                WeixinJSBridge.on('menu:share:timeline', function(argv){
                    shareTimeline();
                });
                // 分享到微博
                WeixinJSBridge.on('menu:share:weibo', function(argv){
                    shareWeibo();
                });
        }, false);
    } 
}
;var app = window.app||{};
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

	var cssStr = app.fn.getCss();
	cssStr += '.page{width:'+pageWidth+'px; height:'+pageHeight+'px;}';
	that.addCss(cssStr);
	app.fn.share();
});



;var app = window.app||{};
app.fn  = app.fn||{};

app.fn.clickOpenUpdown = function(that){
    app.fn.clickOpen(that,"upDown");
}
app.fn.clickOpenLeftRight = function(that){
    app.fn.clickOpen(that,"leftRight");
}

//click open
app.fn.clickOpen = function(that,type){
    var canvas = $('<canvas width="'+that.pageSize.width+'" height="'+that.pageSize.height+'"></canvas>');
    var ctx = canvas[0].getContext('2d');
    var myImage = new Image();
    var animateConfig = app.startAnimate;

    canvas.appendTo(that.startBox);

    myImage.onload = function() {
        var img = $(myImage).appendTo($(document.body)).css({'visibility':'hidden'});
        var  imgWidth  = img.width(),
             imgHeight = img.height(),
             imgRate   = imgWidth/imgHeight,
             pageRate  = that.pageSize.width/that.pageSize.height,
             startLeft = 0,
             startTop = 0;

        if(imgRate>=pageRate){
            startTop  = 0;
            startLeft = (imgRate*that.pageSize.height - imgWidth)/2;
        }else{
            startLeft = 0;
            startTop  = (that.pageSize.width/imgRate - imgHeight)/2;
        }

        ctx.drawImage(myImage, 0, 0,imgWidth,imgHeight,0,0,that.pageSize.width,that.pageSize.height);
        $(myImage).remove();
        if(type === "upDown"){
            app.fn.upDownEvt(that,ctx);
        }else if(type === 'leftRight'){
            app.fn.leftRightEvt(that,ctx);
        }
    }
    myImage.src = 'images/' + animateConfig.imgSrc;
}

app.fn.upDownEvt = function(that,ctx){
    var isAniate = false;
    that.startBox.bind('touchend',function(e){
        if(isAniate) return;
        isAniate = true;
        var clipHeight = that.pageSize.height/8,
            startTop   = (that.pageSize.height - clipHeight)/2,
            startLeft  = 0,
            clipWidth  = that.pageSize.width;

        ctx.clearRect(0,startTop,that.pageSize.width,clipHeight);

        var clipNext = function(){
            setTimeout(function(){
                var stepH = (that.pageSize.height-clipHeight)/8;
                if(stepH<=4){
                    stepH = 4;
                }
                clipHeight += stepH;
                startTop = (that.pageSize.height - clipHeight)/2;

                if(startTop<=0){
                    isAniate = false;
                    that.startBox.hide();
                    if(app.instance.pageContent.startPageOne){
                        app.instance.pageContent.startPageOne();
                    }
                }else{
                    clipNext();
                }
                ctx.clearRect(0,startTop,that.pageSize.width,clipHeight);
            },30);
        }
        clipNext();

        e.stopPropagation();
        e.preventDefault(); 
        return false;
    });
}

app.fn.leftRightEvt = function(that,ctx){
    var isAniate = false;
    that.startBox.bind('touchend',function(e){
        if(isAniate) return;
        isAniate = true;
        var clipWidth = that.pageSize.width/8,
            startTop   = 0,
            startLeft  = (that.pageSize.width - clipWidth)/2,
            clipHeight  = that.pageSize.height;

        ctx.clearRect(startLeft,startTop,clipWidth,clipHeight);

        var clipNext = function(){
            setTimeout(function(){
                var stepW = (that.pageSize.width-clipWidth)/8;
                if(stepW<=4){
                    stepW = 4;
                }
                clipWidth += stepW;
                startLeft = (that.pageSize.width - clipWidth)/2;

                if(startLeft<=0){
                    isAniate = false;
                    that.startBox.hide();
                    if(app.instance.pageContent.startPageOne){
                        app.instance.pageContent.startPageOne();
                    }
                }else{
                    clipNext();
                }
                ctx.clearRect(startLeft,startTop,clipWidth,clipHeight);
            },30);
        }
        clipNext();

        e.stopPropagation();
        e.preventDefault(); 
        return false;
    });
}




;var app = window.app||{};
app.fn  = app.fn||{};


app.fn.wipeScreen = function(that){
    wipeScreen();
    
    function wipeScreen(){
        var animateConfig = app.startAnimate,
            startBoxHtml = '<img src ="images/icon/hand.png" id="startHand"  class="startHand"/>'
                         + '<img onload="window.wipeImgload(this)" src="images/' + animateConfig.imgSrc + '" id="wipeImg"  class="wipeImg"/>';
        
        that.startBox.html(startBoxHtml);
        that.wipeImg = $('#wipeImg');
    }

    function wipeOver(){
        that.stopHand = true;
        that.wipeImg.eraser('clear');
        that.startHand.animate({'opacity':0},500);
        that.startBox.animate({'opacity':0},1000,function(){
            that.startBox.hide();
            //alert(app.instance.pageContent.startPageOne);
            if(app.instance.pageContent.startPageOne){
                app.instance.pageContent.startPageOne();
            }
        });
    }

    function setHandAnimate(){
        var handObj    = that.startHand,
            toRightFun = null,
            toLeftFun  = null;

        toRightFun = function(){
            handObj.animate({"left":'80%',"bottom":450},1000,function(){
                if(!that.stopHand){
                    toLeftFun();
                }
            });
        }

        toLeftFun = function(){
            handObj.animate({"left":'20%',"bottom":350},1000,function(){
                if(!that.stopHand){
                    toRightFun();
                }
            });
        }

        toRightFun();
    }

    window.wipeImgload = function(img){
        var width = $(img).width(),
            height= $(img).height();

        that.wipeImg.eraser({
            size:75,
            completeRatio: .2,
            completeFunction: wipeOver});
        that.startHand  = that.startBox.find('#startHand');
        setHandAnimate();
    }
}

;var app = window.app||{};
app.fn  = app.fn||{};


app.fn.drawWords = function(that){

    drawWords();

    //描字动画
    function drawWords(){

        var animateConfig = app.startAnimate,
            startBoxHtml = '<img src ="images/icon/hand.png" id="startHand"  class="startHand"/>'
                            + (animateConfig.textImg? '<img src="images/'+ animateConfig.textImg +'"  id="startTxt" class="disNone"/>':'')
                            + '<img class="hollowImg" onLoad="window.hollowImgLoad(this);" id="startTopImg" src="images/'+ animateConfig.hollowImg +'" />'
                            + '<div id="startCanvasOut"><canvas width="100%" height="600" id="startCanvas"></canvas></div>'
                            + '<img src="images/'+ animateConfig.solidImg +'" class="solidImg"  id="startBottomImg"/>';
       
        that.startBox.html(startBoxHtml);
        //如果有背景，设置背景
        that.startBox.css({"height":that.pageSize.height,"width":that.pageSize.width,"background":"url(images/"+ animateConfig.background + ")"});


        that.startTopImg    = that.startBox.find('#startTopImg');
        that.startCanvas    = that.startBox.find('#startCanvas');
        that.startBottomImg = that.startBox.find('#startBottomImg');
        that.startHand      = that.startBox.find('#startHand');
        that.startTxt       = that.startBox.find('#startTxt');


        if(app.startAnimate.coordinate){
            that.targetDotList  = app.startAnimate.coordinate;
        }else{
            console.log("缺少app.startAnimate.coordinate的值,请查看");
        }       
    }

    window.hollowImgLoad = function(img){
         var width = $(img).width(),
             height= $(img).height();
        
        that.rateY = that.pageSize.height/height;
        that.rateX = that.rateY;

        //设置图片 div、canvas 等大小
        setBoxSize();
        setHandAnimate();
        drawWordsEvt();
    }

    function setBoxSize(){
        var markWidth  = that.startTopImg.width(),
            markHeight = that.startBottomImg.height();
        that.startTopImg.css({"z-index":10});
        that.startBottomImg.css({"z-index":1});
        that.startCanvas.attr({'width':markWidth,'height':markHeight});
        that.startBox.css({"height":that.pageSize.height,"overflow":"hidden"});
    }

    function setHandAnimate(){
        var handObj    = that.startHand,
            toRightFun = null,
            toLeftFun  = null;

        toRightFun = function(){
            handObj.animate({"left":410,"top":250},1000,function(){
                if(!that.stopHand){
                    toLeftFun();
                }
            });
        }

        toLeftFun = function(){
            handObj.animate({"left":160,"top":350},1000,function(){
                if(!that.stopHand){
                    toRightFun();
                }
            });
        }

        toRightFun();
    }

    //初测事件
    function drawWordsEvt(){
        var startTopImgDom = that.startTopImg.get(0);
        console.log(startTopImgDom);
        startTopImgDom.addEventListener('touchstart', topStartEvt, false);
        startTopImgDom.addEventListener('touchmove', topMoveEvt, false);
        startTopImgDom.addEventListener('touchend', topEndEvt, false);
        that.startCtx = that.startCanvas.get(0).getContext('2d');        
    }

    // touch事件
    function topStartEvt(e){
        e.preventDefault();
    }

    
    function getOneDotColor(x,y){
        var context  = that.startCtx;
        // 获取该点像素的数据
        var imageData = context.getImageData(x*that.rateX, y*that.rateY, 1, 1);
        // 获取该点像素数据
        console.log(x*that.rateX+'---'+ y*that.rateY);
        var pixel = imageData.data; 
        return  pixel[0] + "_" + pixel[1] + "_" + pixel[2] + "_" + pixel[3];
    }

    function topMoveEvt(e){
        var x = e.touches[0].pageX,
            y = e.touches[0].pageY,
            context = that.startCtx,
            drawArr = [],
            offset  = that.startCanvas.offset(),
            hasLeft = offset.left,
            hasTop  = offset.top;

        x = x - hasLeft;
        y = y - hasTop;

        context.beginPath();
        context.arc(x,y-2,that.drawSize+Math.random()*2,0,2*Math.PI,true);  
        context.fill();
        drawArr.push({x:x,y:y});
        if(drawArr.length>2){
            var lastObj = drawArr[drawArr.length-2];
            context.lineWidth = that.drawSize - 2;
            context.moveTo(lastObj.x, lastObj.y-2);
            context.lineTo(x, y-2);
            context.fill();
            context.stroke();
            context.closePath();
        }          
    }

    function topEndEvt(e){
        var x,y,color,
            flag=false,
            targetDotList = that.targetDotList,
            len = targetDotList.length,
            targetDots = 0;

        console.log(JSON.stringify(targetDotList));
        for(var i=0; i<len; i++){
            x = targetDotList[i][0];
            y = targetDotList[i][1];
            color = getOneDotColor(x,y); 
            if(color ==="0_0_0_255"){
                targetDots +=1 ;
            }
        }
        console.log('targetDots=' + targetDots);

        if(targetDots>=len*0.5){
            flag = true;
        }

        if(!that.stopHand){
            that.stopHand = true;
            that.startHand.animate({"opacity":0},500);
        }

        //临水测试，写true,注意擦去
        //flag = true;
        if(flag){
            drawAllColor();
        }
    }

    function drawAllColor(){
        var context = that.startCtx;
        context.fillStyle="#000000";  //填充的颜色
        context.fillRect(5,5,that.startCanvas.width()-15,that.startCanvas.height()-15);  //填充颜色 x y坐标 宽 高
        overAnimate(); 
    }

    function overAnimate(){
        that.startBox.animate({"opacity":0},1000,function(){
            $(this).hide();
            if(app.instance.pageContent.startPageOne){
                app.instance.pageContent.startPageOne();
            }
        });
    }

}

;app.instance.startAnimate = (new function(){
	var that = this;
	that = $.extend(that,app.instance.common);
	that.type           = '';
	
	that.startHand      = null;
	that.startCtx       = null; //canvas context
	that.stopHand       = false;
	that.drawSize       = 13;

	that.start = function(){
		var type = app.startAnimate.type;
		hideLoader();
		musicIcon();
		that.type = type;

		switch(type){
			case "clickOpenUpdown":
			app.fn.clickOpenUpdown(that);
			break;

			case "clickOpenLeftRight":
			app.fn.clickOpenLeftRight(that);
			break;

			case "wipeScreen":  // 擦拭屏幕开场
			app.fn.wipeScreen(that);
			break;

			case "drawWords":  // 描字
			app.fn.drawWords(that);
			break;
		}
	}

	//临时执行,注意删除
	that.start();

	function musicIcon(){
		var musicNode = app.global.music;
		if(musicNode && musicNode.name){
			var musicObj = $('<audio id="myaudio" src="images/'+ musicNode.name +'" autoplay loop="true" hidden="true"  />');
			musicObj.appendTo($(document.body));
			that.myaudio = $('#myaudio');
			if(musicNode.hasSwitch){
				var domAudio = that.myaudio[0];
				domAudio.addEventListener('canplaythrough', function(e){
		            //callback(true);
		            var iconStr =  '<div class="icon-music" id="musicBox">' + 
							       '<img id="icon-music-img" src="images/icon/icon_music.png" style="transform: rotate(0deg); " />'+
							       '</div>';
					$(iconStr).appendTo($(document.body));
					var musicBox    = $('#musicBox'),
					    musicImg    = musicBox.find('#icon-music-img'),
					    musicIsPlay = true;

					function goMusiceImg(){
						that.musicTimer = setInterval(function(){
							var str = musicImg.attr('style'),
								reg = /\d+/g,
								angle = parseInt(str.match(reg)[0]),
								newAngle = angle + 10;

							if(newAngle>360){
								newAngle = newAngle-360;
							}
							musicImg.css("transform","rotate("+ newAngle +"deg)");
						},30);
					}

					goMusiceImg();

					musicBox.bind(that.click,function(e){
						if(musicIsPlay){
							clearInterval(that.musicTimer);
							domAudio.pause();
							musicIsPlay = false;
							musicImg.css("transform","rotate(0deg)");
						}else{
							goMusiceImg();
							domAudio.play();
							musicIsPlay = true;
						}

						e.stopPropagation();
						e.preventDefault(); 
						return false;
					})

		        }, false);
			}
		}
	}

	

	function getcontentFirstImg (argument) {
		var item    = app.contentPageList[0],
		    imgStr  = '',
		    type = item.type;

		if(type === "OneImg"){
			imgStr = item.imageName;
		}else if(type === "TwoImg"){
			imgStr = item.bgImgName;
		}
		return imgStr;
	}



	//隐藏loader.........
	function hideLoader(){
		that.startBox.removeClass('disNone');
		that.loadPage.animate({"opacity":0},500,function(){
			$(this).hide();
		})
	}





	

	
});


;app.instance.pageContent =  (new function(){
	var that = this;
	that = $.extend(that,app.instance.common);
	that.pageList     = app.contentPageList;
	that.pageNum   = that.pageList.length;
	that.curPageIndex = 0; //页面索引统一，从0开始
	that.curPageType  = app.contentPageList[0].type;
	that.pageIsMove   = false;
	init();

	function init(){
		initHtml();
	}
	
	function initHtml(){
		var htmlStr = '<div class="upDownArrow disNone" id="upDownArrow"></div>'+
                      '<div class="rightArrow disNone" id="rightArrow"></div>' + 
					  '<div class="leftArrow disNone" id="leftArrow"></div>',

			pageNum = that.pageNum,
			type  = '',
			item  = null,
			txtStyleStr = '',
			hasBaiduMap = false,
			baiduConfig = null;

		for(var i=0; i<pageNum; i++){
			item = that.pageList[i];
			type = item.type;
			//txtStyleStr = '';
			switch(type){
				case "common":
				htmlStr += buildCommonOrGalleryPage(item,type);
				break;

				case "gallery":
				htmlStr += buildCommonOrGalleryPage(item,type);
				break;

		        case "360":
		        htmlStr += build360OrSlidePage(item,type);
		        break;

		        case "slide":
		        htmlStr += build360OrSlidePage(item,type);
		        break;

		        case "album":
		        htmlStr += buildAlbumPage(item,type);
		        break;

		        case "map":
		        htmlStr += buildMapPage(item,type,i);
                break;
               
		        case "video":
		        htmlStr += buildVideoPage(item,type);
				break;
			}
		}

		//console.log('htmlStr=' + htmlStr);
		that.pageContent.html(htmlStr);
		that.pageList = that.pageContent.find('.page');
		that.rightTipBtn = $('#rightArrow');
		that.rightArrow  = that.rightTipBtn;
		that.leftArrow   = $('#leftArrow');
		that.upDownArrow = $('#upDownArrow');
        that.pageList.eq(0).removeClass('disNone').find('div').removeClass('disNone');

		//arrowEvt();
		pageBoxCssEvt();
		pageTouchEvt();
	}

	//视频页面
	function buildVideoPage(item,type){
		var effect  = item.effect?item.effect:'fade',
			bigSizeStyle = effect==='120%'?'bigSize120':'',
            pageHtml = '',
            pageBg   = item.background,
            styleStr = pageBg?'style="background-image:url(images/'+ pageBg +')"':'';

            //curShow  = '';
        pageHtml =  '<div effect="'+ effect +'" type="'+ type +'" ' + styleStr + ' class="page lowZindex '+ bigSizeStyle +' disNone">';
        pageHtml += '<div class="likePageBox" style="background:url(images/'+ item.videoScreenshot +') no-repeat center center ; background-size:100% auto;"></div>';
        pageHtml += '<img class="videoBtn" src="images/'+ item.videoButton +'" />';
        pageHtml += '<div class="videoBox disNone">'+ item.videoCode +'</div></div>';

        return pageHtml;    
	}

	function buildAlbumPage(item,type){
		var effect  = item.effect?item.effect:'fade',
			bigSizeStyle = effect==='120%'?'bigSize120':'',
            pageHtml = '',
            animateImgs  = item.animateImgs,
            pageBg   = item.background,
            styleStr = pageBg?'style="background-image:url(images/'+ pageBg +')"':'',
            curShow  = '';

        pageHtml = '<div effect="'+ effect +'" type="'+ type +'" ' + styleStr + ' class="page albumPage lowZindex '+ bigSizeStyle +' disNone">';
        
        for(var i=0,len = animateImgs.length; i<len; i++){
        	curShow = i===0? 'true':'';
        	var showIndex = i;
        	if(i>2){
        		showIndex = 2;
        	}
        	//var classIndex
        	//pageHtml += '<div type="' + type + '" class="likePageBox" ' + curShow + ' index="'+ i +'" style="background-image:url(images/'+ animateImgs[i]['src'] +')"> </div>';
        	pageHtml += '<img targetClass="albumImgShow'+ showIndex +'" class="albumImg" src= "images/'+ animateImgs[i]['src'] + '" />';
        }


        pageHtml += '</div>';
        return pageHtml;
	}

	//360页面
	function build360OrSlidePage(item,type){
		var effect  = item.effect?item.effect:'fade',
			bigSizeStyle = effect==='120%'?'bigSize120':'',
            pageHtml = '',
            animateImgs  = item.animateImgs,
            pageBg   = item.background,
            styleStr = pageBg?'style="background-image:url(images/'+ pageBg +')"':'',
            curShow  = '',
            zindex   = animateImgs.length;

        pageHtml = '<div effect="'+ effect +'" type="'+ type +'" ' + styleStr + ' class="page lowZindex '+ bigSizeStyle +' disNone">';
        
        for(var i=0,len = animateImgs.length; i<len; i++){
        	curShow = i===0? 'true':'';
        	pageHtml += '<div slideImg="true" class="likePageBox" ' + curShow + ' index="'+ i +'" style="background-image:url(images/'+ animateImgs[i]['src'] +');)"> </div>';
        }
        pageHtml += '</div>';
        return pageHtml;
	}

	//构建摆标准页面
	function buildCommonOrGalleryPage(item,type){
        var effect  = item.effect?item.effect:'fade',
            bigSizeStyle = effect==='120%'?'bigSize120':'';
            pageHtml = '',
            animateImgs = item.animateImgs,
            pageBg  = item.background,
            styleStr = pageBg?'style="background-image:url(images/'+ pageBg +');"':'';

        var getMoveHtml = function(animateImg,type){
        	var positionClass = animateImg.from + animateImg.position.replace('%','');
        	var animateClass    = 'to' + animateImg.from + '0_from'+ positionClass;
        	var animateBg   = 'style="background-image:url(images/'+ animateImg.src +');"';
        	var animateHtml = '<div type="'+ type +'" '+ animateBg +' delayTime="'+ animateImg.delayTime +'" animate="true" class="likePageBox '+ positionClass +' disNone" animateClass="'+ animateClass +'" fromClass="'+ positionClass +'" targetClass="'+ animateImg.from +'0">  </div>';
        	return animateHtml
        }

        var getFateInHtml = function(animateImg,type){
        	var animateClass = "animateToShow";
        	var animateBg   = 'style="background-image:url(images/'+ animateImg.src +');"';
        	var animateHtml = '<div type="'+ type +'" '+ animateBg +' delayTime="'+ animateImg.delayTime +'" animate="true" class="likePageBox opacity0 disNone" animateClass="'+ animateClass +'" >  </div>';
        	return animateHtml
        }

        pageHtml = '<div effect="'+ effect +'" type="'+ type+'" ' + styleStr + '  class="page lowZindex '+ bigSizeStyle +' disNone">';
        for(var i=0,len=animateImgs.length; i<len; i++){

        	var animateImg = animateImgs[i];
        	var aniType = animateImg.type;
        	var animateHtml = '';
        	if(aniType === 'move'){
        		animateHtml = getMoveHtml(animateImg,aniType);
        	}else if(aniType === "fadeIn"){
        		animateHtml = getFateInHtml(animateImg,aniType);
        		console.log(animateHtml);
        	}
        	
        	pageHtml += animateHtml;
        }
        if(type === 'gallery'){
        	pageHtml += '<div style="background-image:url(images/'+ item.tipImg +');" state="hidden" tipImg="true" showClass="right0" hideClass="right100"  class="likePageBox right100" > </div>'
        }
        pageHtml += '</div>';
        return pageHtml;
	}

	function buildMapPage(item,type,i){
		var htmlStr = '',
		    pageBg    = item.background,
		    buttonSrc = item.button;
		htmlStr += '<div effect="fade" pageindex="'+i+'" class="page disNone"  type="'+ type +'" style="background-image:url(images/'+ pageBg +')"><img class="showMapbutton" src="images/'+ buttonSrc +'" />  <div class="mapBox"><div class="mapContent" id="baidumapContent"></div><span class="mapCloseButton"> 关闭 </span></div> </div>';
		return htmlStr;
	}

	function baiduMapFun(obj){
		var title = obj.title,
			address   = obj.address,
		    longitude = obj.longitude,
		    latitude  = obj.latitude,
		    id        = 'baidumapContent';
		//创建和初始化地图函数：
	    function initMap(){
	        createMap();//创建地图
	        setMapEvent();//设置地图事件
	        addMapControl();//向地图添加控件
	        addMarker();//向地图中添加marker
	    }

	    //创建地图函数：
	    function createMap(){
	        var map = new BMap.Map(id);//在百度地图容器中创建一个地图
	        var point = new BMap.Point(longitude,latitude);//定义一个中心点坐标
	        map.centerAndZoom(point,17);//设定地图的中心点和坐标并将地图显示在地图容器中
	        window.map = map;//将map变量存储在全局
	    }
	    
	    //地图事件设置函数：
	    function setMapEvent(){
	        map.enableDragging();//启用地图拖拽事件，默认启用(可不写)
	        map.disableScrollWheelZoom();//禁用地图滚轮放大缩小，默认禁用(可不写)
	        map.disableDoubleClickZoom();//禁用鼠标双击放大
	        map.disableKeyboard();//禁用键盘上下左右键移动地图，默认禁用(可不写)
	    }
	    
	    //地图控件添加函数：
	    function addMapControl(){
	        //向地图中添加缩放控件
		    var ctrl_nav = new BMap.NavigationControl({anchor:BMAP_ANCHOR_TOP_LEFT,type:BMAP_NAVIGATION_CONTROL_LARGE});
		    map.addControl(ctrl_nav);
	    }
	    
	    //标注点数组
	    var markerArr = [{title:title,content:address,point:(longitude+"|"+latitude),isOpen:0,icon:{w:23,h:25,l:46,t:21,x:9,lb:12}}];
	    //创建marker
	    function addMarker(){
	        for(var i=0;i<markerArr.length;i++){
	            var json = markerArr[i];
	            var p0 = json.point.split("|")[0];
	            var p1 = json.point.split("|")[1];
	            var point = new BMap.Point(p0,p1);
	            var iconImg = createIcon(json.icon);
	            var marker = new BMap.Marker(point,{icon:iconImg});
	            var iw = createInfoWindow(i);
	            var label = new BMap.Label(json.title,{"offset":new BMap.Size(json.icon.lb-json.icon.x+10,-20)});
	            marker.setLabel(label);
	            map.addOverlay(marker);
	            label.setStyle({
	                        borderColor:"#808080",
	                        color:"#333",
	                        cursor:"pointer"
	            });
	            
	            (function(){
	                var index = i;
	                var _iw = createInfoWindow(i);
	                var _marker = marker;
	                _marker.addEventListener("click",function(){
	                    this.openInfoWindow(_iw);
	                });
	                _iw.addEventListener("open",function(){
	                    _marker.getLabel().hide();
	                })
	                _iw.addEventListener("close",function(){
	                    _marker.getLabel().show();
	                })
	                label.addEventListener("click",function(){
	                    _marker.openInfoWindow(_iw);
	                })
	                if(!!json.isOpen){
	                    label.hide();
	                    _marker.openInfoWindow(_iw);
	                }
	            })()
	        }
	    }
	    //创建InfoWindow
	    function createInfoWindow(i){
	        var json = markerArr[i];
	        var iw = new BMap.InfoWindow("<b class='iw_poi_title' title='" + json.title + "'>" + json.title + "</b><div class='iw_poi_content'>"+json.content+"</div>");
	        return iw;
	    }
	    //创建一个Icon
	    function createIcon(json){
	        var icon = new BMap.Icon("http://app.baidu.com/map/images/us_mk_icon.png", new BMap.Size(json.w,json.h),{imageOffset: new BMap.Size(-json.l,-json.t),infoWindowOffset:new BMap.Size(json.lb+5,1),offset:new BMap.Size(json.x,json.h)})
	        return icon;
	    }
	    
	    initMap();//创建和初始化地图
	}

	function setCssEvt($element,callback){
		if(!$element.attr('hasEvt')){
			$element.bind('webkitAnimationEnd',function(){
				callback($(this));



			});
			$element.attr('hasEvt',true);
		}
	}

	function goScale($element,myVal){

		
	}

	function pageBoxCssEvt(){
		var pageList  = that.pageList,
		    bigPages  = pageList.filter('div[effect="120%"]'),
		    fadePages = pageList.filter('div[effect="fade"]'),
		    innnerAnimateBox = that.pageList.find('div[animate="true"]'),
		    tipImgBoxs = that.pageList.find('div[tipImg="true"]'),
		    slideImgBoxs = that.pageList.find('div[slide="true"]'),
		    Img360Boxs = that.pageList.filter('[type="360"]');

		setCssEvt(fadePages,function($element){
			if($element.hasClass('toOpacity100')){
				$element.removeClass('toOpacity100 opacity0');
			}
		});

		setCssEvt(bigPages,function($element){
			if($element.hasClass('toOpacity100fast')){
				$element.removeClass('toOpacity100fast opacity0').addClass('toSize100');
			}else if($element.hasClass('toSize100')){
				$element.removeClass('bigSize120 toSize100');
			}
		});

		//动画内页图层注册事件
		setCssEvt(innnerAnimateBox,function($element){
			var animateClass = $element.attr('animateClass'),
				fromClass    = $element.attr('fromClass'),
				targetClass  = $element.attr('targetClass'),
				type = $element.attr('type');

			if(type === 'move'){
				if($element.hasClass(animateClass)){
					$element.addClass(targetClass).removeClass(animateClass + ' ' + fromClass);
				}
			}else if(type === 'fadeIn'){
				console.log($element.attr('class'));
				if($element.hasClass(animateClass)){
					$element.removeClass(animateClass + ' opacity0');
				}
			}
		});

		//tipImg结束后事件
		setCssEvt(tipImgBoxs,function($element){
			//toright100_hide
			var hideClass = $element.attr('hideClass'),
				showClass = $element.attr('showClass');

			//toright100_hide  toright0_show
			if($element.hasClass('toright_hide')){

				$element.removeClass('toright_hide right0').addClass(hideClass).attr('state','hidden');
				that.rightTipBtn.css('background-image','url(images/icon/arrow_right_1.png)');
				that.pageIsMove = false;

			}else if($element.hasClass('toright_show')){
				$element.removeClass('toright_show right100').addClass(showClass).attr('state','show');
				that.rightTipBtn.css('background-image','url(images/icon/arrow_right_2.png)');
				that.pageIsMove = false;			
			}

		})

		//slideToShow_toright
		setCssEvt(slideImgBoxs,function($element){
			//toright100_hide
			var hideClass = $element.attr('hideClass'),
				showClass = $element.attr('showClass');
			//toright100_hide  toright0_show
			if($element.hasClass('toright_hide')){
				$element.removeClass('toright_hide').addClass(hideClass).attr('state','hidden');
				that.rightTipBtn.css('background-image','url(images/icon/arrow_right_1.png)');
				that.pageIsMove = false;
			}else if($element.hasClass('toright_show')){
				$element.removeClass('toright_show').addClass(showClass).attr('state','show');
				that.rightTipBtn.css('background-image','url(images/icon/arrow_right_2.png)');
				that.pageIsMove = false;
			}

		})

		//百度map按钮
		var mapPage = that.pageList.filter('[type="map"]'),
		    showMapButton = mapPage.find('.showMapbutton'),
		    mapBox = $('#baidumapContent').parent(),
		    closeBtn = mapBox.find('.mapCloseButton'),
		    mapIsShow = false,
		    mapIndex = Number(showMapButton.parent().attr('pageindex'));
		
		showMapButton.bind('touchend',function(e){
			baiduMapFun(app.contentPageList[mapIndex]);
			mapIsShow = true;
			hideLeftRightArrow();
			that.upDownArrow.hide();
			that.pageIsMove = true;
			mapBox.show().animate({'top':'30%'},400);

			e.stopPropagation();
    		e.preventDefault(); 
    		return false;
    		
		});

		closeBtn.bind('touchend',function(e){
			mapBox.addClass('hideMapBox');
			that.upDownArrow.show();
			that.pageIsMove = false;

			e.stopPropagation();
    		e.preventDefault(); 
    		return false;
		});

		setCssEvt(mapBox,function($element){
			if($element.hasClass('showMapBox')){
				$element.removeClass('showMapBox').css({'top':'30%'});
			}else if($element.hasClass('hideMapBox')){
				$element.removeClass('hideMapBox').hide().css({'top':'110%'});
			}
		});
	}

	function pageTouchEvt(){
		var pageList = that.pageList,
			touchHeight = that.pageSize.height/5,
			touchWidth  = that.pageSize.width/5,
		    startX,startY,diffX,diffY,endX,endY;

		that.pageIsMove = false;

		that.pageContent.bind('touchstart',function(e){
			var touch = event.touches[0];
	        startX = touch.pageX;
	        startY = touch.pageY;
		    e.stopPropagation();
    		e.preventDefault(); 
    		return false;
		});

		that.pageContent.bind('touchmove',function(e){
			var touch = event.touches[0];

	        endX = touch.pageX;
	        endY = touch.pageY;
		   	e.stopPropagation();
    		e.preventDefault(); 
    		return false;
		});

		that.pageContent.bind('touchend',function(e){
			if(!endX){
				endX = startX;
			}
			if(!endY){
				endY = startY;
			}

	        diffX = endX - startX;
	        diffY = endY - startY;
		    startAnimate(diffX,diffY);

		    clearXY();

		    e.stopPropagation();
    		e.preventDefault(); 
    		return false
		});

		function clearXY(){
			startX = 0;
			startY = 0;
			endX = 0;
			endY = 0;
		}

		function startAnimate(diffX,diffY){
			if(that.pageIsMove) return;
			var nextIndex = 0;

			//左右滑动
			if( Math.abs(diffX) > that.pageSize.width/5 && Math.abs(diffX) > Math.abs(diffY)){   // shuiping slide
				leftRightSlide(diffX);
			}else if( Math.abs(diffY) > that.pageSize.height/5){
				console.log('diffY=' + diffY);
				if(diffY>0){
					//上一张
					nextIndex = that.curPageIndex-1;
					nextIndex = nextIndex === -1? that.pageNum-1:nextIndex;
				}else{
					//下一张
					nextIndex = that.curPageIndex+1;
					nextIndex = nextIndex === that.pageNum? 0:nextIndex;
				}
				showNextPage(nextIndex);
			}else{
				that.pageIsMove = false;
			} 
		}
	}

	function leftRightSlide(diffX){
		//gallery   360    slide   album
		that.curPageType  = that.pageList.eq(that.curPageIndex).attr('type');
		switch(that.curPageType){
			case 'gallery':
			pageGallerySlide(diffX);
			break;

			case '360':
			page360Slide(diffX);
			break;

			case 'slide':
			pageSlide(diffX);
			break;

			case 'album':
			pageAlbum(diffX);
			break;

			default:
			that.pageIsMove = false;
			break;
		}
	}

	function pageAlbum(diffX){
		if(that.pageIsMove){
			return;
		}
		var curPage = that.pageList.eq(that.curPageIndex),
			imgList = curPage.find('.albumImg'),
			imgLength  = imgList.length,
			targetImg  = imgList.filter(':last');
			
		if(diffX>0){
			targetImg.addClass('albumImgToRight');
		}else{
			targetImg.addClass('albumImgToLeft');
		}
	}

	function pageSlide(diffX){
		if(that.pageIsMove){
			return;
		}
		var curPage = that.pageList.eq(that.curPageIndex),
			slideImgList = curPage.find('div[slideImg="true"]'),
			slideLength  = slideImgList.length,
		    curShowIndex = Number(curPage.attr('curShowIndex')),
		    targetIndex  = 0,
		    targetDiv = null;

		//page360IsPlay
		if(diffX>0){
			targetIndex = curShowIndex - 1;
			if(targetIndex === -1){
				targetIndex = slideLength-1;
			}
		}else{   // to left,show next image
			targetIndex = curShowIndex + 1;
			if(targetIndex === slideLength){
				targetIndex = 0;
			}
		}
		that.pageIsMove = true;
		targetDiv = slideImgList.eq(targetIndex);
		targetDiv.addClass('zIndex100 opacity0 toShow');
	}

	function page360Slide(diffX){
		if(that.pageIsMove||that.page360IsPlay){
			return;
		}
		var curPage = that.pageList.eq(that.curPageIndex),
			slideImgList = curPage.find('div[slideImg="true"]'),
			slideLength  = slideImgList.length,
		    curShowIndex = Number(curPage.attr('curShowIndex')),
		    targetIndex  = 0,
		    targetDiv = null;

		//page360IsPlay
		if(diffX>0){
			targetIndex = curShowIndex - 1;
			if(targetIndex === -1){
				targetIndex = slideLength-1;
			}
		}else{   // to left,show next image
			targetIndex = curShowIndex + 1;
			if(targetIndex === slideLength){
				targetIndex = 0;
			}
		}
		that.pageIsMove = true;
		targetDiv = slideImgList.eq(targetIndex);
		targetDiv.addClass('zIndex100 opacity0 toShow');
	}

	function pageGallerySlide(diffX){
		var tipImg = that.pageList.eq(that.curPageIndex).find('div[tipImg="true"]'),
		    tipImgState = tipImg.attr('state');
		//往右,收缩侧栏
		if(diffX>0){
			if(tipImgState === "show"){
				tipImg.addClass('toright_hide');
			}else{
				that.pageIsMove = false;
			}
		//往左
		}else{
			if(tipImgState === "hidden"){
				tipImg.addClass('toright_show');
			}else{
				that.pageIsMove = false;
			}
		}
	}

	//show page one
	that.startPageOne = function(){
		that.curPageIndex = that.pageNum-1;
		showNextPage(0,true);
	}

	function initNextPage(nextIndex,curPage,nextPage,pageType,isFirst){
		var effect = nextPage.attr('effect');
		that.curPageIndex = nextIndex;
		that.curPageType  = pageType;

        if(!isFirst){
    		if(/120%/.test(effect)){
    			nextPage.addClass('bigSize120 opacity0').show().addClass('toOpacity100fast');
    		}else if(/fade/.test(effect)){
    			nextPage.addClass('opacity0').show().addClass('toOpacity100');
    		}
        }else{
            if(/120%/.test(effect)){
                nextPage.addClass('toSize100');
            }
            that.upDownArrow.removeClass('disNone');
        }

		curPage.removeClass('lowZindex highZindex').addClass('centerZindex');
		setTimeout(function(){
			curPage.addClass('disNone');
		},700);

		nextPage.removeClass('disNone lowZindex centerZindex').addClass('highZindex');

		if(/common|gallery/.test(pageType)){
			var innerAnimateBoxs = nextPage.find('div[animate="true"]');
			innerAnimateBoxs.each(function(){
				var animateBoxItem = $(this),
				    fromClass   = animateBoxItem.attr('fromClass'),
				    targetClass = animateBoxItem.attr('targetClass'),
				    type = animateBoxItem.attr('type');
				if(type === 'move'){
					animateBoxItem.removeClass(targetClass).addClass(fromClass);
				}else if(type === 'fadeIn'){
					animateBoxItem.removeClass(targetClass +' disNone').addClass('opacity0');
  				}
  			});
  			innerAnimateBoxs.hide();
		}

		//显示箭头
		if(pageType === 'gallery'){
			that.rightTipBtn.show();
		}else{
			that.rightTipBtn.hide();
		}
	}

	//show new page
	function showNextPage(nextIndex,isFirst){
		var nextPage  = that.pageList.eq(nextIndex),
		    innerBoxs = nextPage.find('div'),
		    curPage   = that.pageList.eq(that.curPageIndex),
		    effect    = nextPage.attr('effect'),
		    pageType  = nextPage.attr('type'),
		    showPageDelayTime = 800;
		that.curPageType = pageType;
        initNextPage(nextIndex,curPage,nextPage,pageType,isFirst);

		//"common","gallery","360","slide","album","video","map"
		clearCurPage(curPage,curPage.attr('type'));

		//内页动画
		if( (pageType === 'common' || pageType === 'gallery') && innerBoxs.length>0 ) {
			var innerDelayTime = 0;
			if(effect==='120%'){
				innerDelayTime = 1800;
                if(isFirst){
                    innerDelayTime -= 300;
                }
			}

			setTimeout(function(){
				innerBoxsAnimate(innerBoxs,nextPage,pageType);
			},innerDelayTime);
		}else{
			if(pageType==='album'){
				showPageDelayTime = 0;
			}

			//callback, 页面切换后的callback
			setTimeout(function(){
				that.pageIsMove = false;
				
				//"360","slide","album","video","map"
				switch(pageType){
					case '360':
					show360ImgAnimate(nextPage);
					break;

					case 'slide':
					showLeftRightArrow();
					initSlidePage(nextPage);
					break;

					case 'album':
					hideLeftRightArrow();
					initAlbumPage(nextPage);
					break;
				}	

			},showPageDelayTime);
		}
	}

	function initAlbumImgs(imgBox){
		var imgList = imgBox.find('img'),
			len  = imgList.length;
		imgList.each(function(i){
			var img = $(this);
			img.removeClass('albumImgShow0 albumImgShow1 albumImgShow2 disNone');
			if(i<len-2){
				img.addClass('albumImgShow0');
			}else if(i ===  len-2){
				img.addClass('albumImgShow1');
			}else{
				img.addClass('albumImgShow2');
			}
			if(i<len-3){
				img.addClass('disNone');
			}
		});
	}

	function initAlbumPage(nextPage){
		var imgList = nextPage.find('img');
		var removeClassStr = 'albumImgShow0 albumImgShow1 albumImgShow2';
		that.pageIsMove = true;
		imgList.removeClass(removeClassStr);

		//相册初始动画
		imgList.each(function(i){
			var img = $(this);
			(function(i,img){
				var index = i;
				if(i+1>2){
					index = 2;
				}
				setTimeout(function(){
					img.addClass('albumImgAnimate'+index).attr('init','true').css('z-index',i+1);
				},i*350);
			})(i,img);
		});

		var initImgCallback = function(elem){
			var imgIndex = elem.index(),
			    imgList = elem.parent().find('img'),
			    imgLen  = imgList.length,
			    showIndex = '';
			showIndex = imgIndex;   
			if(imgIndex+1>2){
				showIndex = 2;
			}

			elem.addClass('albumImgShow' + showIndex).removeAttr('init').removeClass(removeClassStr);
			if(elem.prev() && elem.prev().hasClass('albumImgShow' + showIndex)){
				elem.prev().addClass('disNone');
			}

			if(elem.next().length===0){
				that.pageIsMove = false;
				showLeftRightArrow();
				elem.parent().find('img').removeAttr('style');
				initAlbumImgs(elem.parent());
			}
		}

		setCssEvt(imgList,function(elem){
			var targetClass = elem.attr('targetClass'),
			    removeClassStr = 'albumImgAnimate0 albumImgAnimate1 albumImgAnimate2';
			if(elem.attr('init') === 'true'){
				
				var imgIndex = elem.index(),
				    imgList = elem.parent().find('img'),
				    imgLen  = imgList.length,
				    showIndex = '';
				showIndex = imgIndex;   
				if(imgIndex+1>2){
					showIndex = 2;
				}

				elem.addClass('albumImgShow' + showIndex).removeAttr('init').removeClass(removeClassStr);
				if(elem.prev() && elem.prev().hasClass('albumImgShow' + showIndex)){
					elem.prev().addClass('disNone');
				}

				if(elem.next().length===0){
					that.pageIsMove = false;
					showLeftRightArrow();
					elem.parent().find('img').removeAttr('style');
					initAlbumImgs(elem.parent());
				}
				

			}else if(elem.hasClass('albumImgToRight') || elem.hasClass('albumImgToLeft')){
				var imgBox = elem.parent(),
				    imgList = imgBox.find('img');
				if(imgList.length>=3){
					elem.insertBefore(imgList.eq(0)).addClass('albumImgShow0').removeClass(removeClassStr + ' albumImgToRight albumImgToLeft');
					initAlbumImgs(imgBox);
				}
			}
		});
	}

	function clearCommon(curPage){
		setTimeout(function(){

		},1000);
	}

	function clearCurPage(curPage,pageType){
		switch(pageType){
			case 'common':
			clearCommon(curPage);
			break;

			case 'gallery':
			clearCommon(curPage);
			break;

			case '360':
			clear360Page(curPage);
			break;

			case 'slide':
			clearSlidePage(curPage);
			break;

			case 'album':
			clearAlbumPage(curPage);
			break;
		}
		//通用的，reset
		hideLeftRightArrow();
	}

	//清除 album 样式
	function clearAlbumPage(curPage){
		setTimeout(function(){
			var imgList = curPage.find('img');
			imgList.removeAttr('style class').addClass('albumImg');
		},900);
	}



	//第一次初始化,slide图片的css事件
	function initSlidePage(nextPage){
		if(that.slidePageInit){
			return;
		}
		var divList = nextPage.find('.likePageBox');
		nextPage.attr('curShowIndex','0');
		setCssEvt(divList,function($element){
			if($element.hasClass('toShow')){
				$element.parent().find('.zIndex11').removeClass('zIndex11').end().attr('curShowIndex',$element.attr('index'));
				$element.removeClass('opacity0 toShow zIndex100').addClass('zIndex11');
				that.pageIsMove = false;
			}
		});
		that.slidePageInit = true;
	}

	//显示左右箭头
	function showLeftRightArrow(){
		that.leftArrow.removeClass('disNone');
		that.rightArrow.removeClass('disNone').removeAttr('style');
	}

	function hideLeftRightArrow(){
		that.leftArrow.addClass('disNone');
		that.rightArrow.addClass('disNone');
	}

	//显示360°图片
	function show360ImgAnimate(nextPage){
		var imgList  = nextPage.find('div[slideImg="true"]'),
			curShowIndex = 0,
			indexTimes = 0;
		nextPage.attr('curShowIndex',0);
		that.page360IsPlay = true;

		curShowImg = imgList.eq(curShowIndex);
		setCssEvt(imgList,function($element){
			if($element.hasClass('toShow')){
				$element.parent().find('.zIndex11').removeClass('zIndex11').end().attr('curShowIndex',$element.attr('index'));
				$element.removeClass('opacity0 toShow zIndex100').addClass('zIndex11');
				that.pageIsMove = false;
			}
		});

		var playImg = function(imgTimeDelay){
			var playImgDelay  = imgTimeDelay?imgTimeDelay:2000;
			that.page360Timer = setTimeout(function(){
				if(curShowIndex === 0){
					indexTimes++;
				}
				curShowIndex++;
				if(curShowIndex === imgList.length){
					curShowIndex = 0;
				}
				curShowImg = imgList.eq(curShowIndex);
				curShowImg.addClass('zIndex100 opacity0 toShow');
				if(indexTimes<2){
					playImg(2900);
				}else{
					showLeftRightArrow();
					that.page360IsPlay = false;
				}
			},1500);
		}
		playImg();
	}

	function clear360Page(curPage){
		clearTimeout(that.page360Timer);
		setTimeout(function(){
			curPage.attr('curShowIndex','0').addClass('disNone').find('.zIndex11').removeClass('zIndex11');
		},1000);
	}

	function clearSlidePage(curPage){
		setTimeout(function(){
			curPage.attr('curShowIndex','0').addClass('disNone').find('.zIndex11').removeClass('zIndex11');
		},1000);
	}

	function innerBoxsAnimate(innerBoxs,nextPage,pageType){
		that.pageIsMove = true;
		if(pageType === 'gallery'){
			var tipImg  = nextPage.find('div[tipImg="true"]');
			tipImg.removeClass('right0').addClass('right100');
			that.rightTipBtn.css('background-image','url(images/icon/arrow_right_1.png)');
		}

		innerBoxs.show().each(function(){
			var itemBox = $(this),
			    fromClass = itemBox.attr('fromClass'),
			    targetClass  = itemBox.attr('targetClass'),
			    animateClass = itemBox.attr('animateclass'),
			    delayTime    = Number(itemBox.attr('delayTime'));

			setTimeout(function(){
				itemBox.removeClass('disNone').addClass(animateClass);
			},delayTime);
		});

		setTimeout(function(){
			that.pageIsMove = false;
		},1000);
	}

	function arrowEvt(){
		that.arrow = that.pageContent.find('#arrow');
		var goUp = function(){
			that.arrow.animate({'bottom':'6%','opacity':0},1500,function(){
				$(this).css({'bottom':'2%','opacity':1});
				goUp();
			});
		}
		goUp();
	}
});







