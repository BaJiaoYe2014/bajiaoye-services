app.instance.pageContent =  (new function(){
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
					  '<div class="leftArrow disNone" id="leftArrow"></div>';


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
		        htmlStr += build360OPage(item,type);
		        break;

		        case "slide":
		        htmlStr += buildSlidePage(item,type);
		        break;

		        case "album":
		        htmlStr += buildAlbumPage(item,type);
		        break;

		        case "map":
		        htmlStr += buildMapPage(item,type,i);
                break;

		        case "video":
		        htmlStr += app.fn.video.buildVideoPage(item,type);
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

    //slide 页面
    function buildSlidePage(item,type){
        var effect  = item.effect?item.effect:'fade',
            bigSizeStyle = effect==='120%'?'bigSize120':'',
            pageHtml = '',
            animateImgs  = item.animateImgs,
            pageBg   = item.background,
            styleStr = pageBg?'style="background-image:url(images/'+ pageBg +')"':'',
            zindex   = animateImgs.length;

        pageHtml = '<div effect="'+ effect +'" type="'+ type +'" ' + styleStr + ' class="page lowZindex '+ bigSizeStyle +'">';
        pageHtml += '<div class="swipe-wrap">'
        for(var i=0,len = animateImgs.length; i<len; i++){
            pageHtml += '<div style="background-image:url(images/'+ animateImgs[i]['src'] +');)"> </div>';
        }
        pageHtml += '</div></div>';
        return pageHtml;
    }

	//360页面
	function build360OPage(item,type){
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
		    buttonSrc = item.button,
            toTop = 0;
		htmlStr += '<div effect="fade" pageindex="'+i+'" class="page disNone"  type="'+ type +'" style="background-image:url(images/'+ pageBg +')"><img class="showMapbutton" src="images/'+ buttonSrc +'" /><div class="videoBtnCover boBtnCover"></div>  <span class="mapCloseButton disNone" id="mapCloseButton" style="top:'+ toTop+'px;"> 关闭 </span><div class="mapBox"><div class="mapContent" id="baidumapContent"></div></div> </div>';
		return htmlStr;
	}

	function setCssEvt($element,callback){
		if(!$element.attr('hasEvt')){
			$element.bind('webkitAnimationEnd',function(){

				callback($(this));
			});
			$element.attr('hasEvt',true);
		}
	}

	function pageBoxCssEvt(){
		var pageList  = that.pageList,
		    bigPages  = pageList.filter('div[effect="120%"]'),
		    fadePages = pageList.filter('div[effect="fade"]'),
            slidePages = pageList.filter('div[type="slide"]'),
		    innnerAnimateBox = pageList.find('div[animate="true"]'),
		    tipImgBoxs = pageList.find('div[tipImg="true"]'),
		    slideImgBoxs = pageList.find('div[slide="true"]'),
		    Img360Boxs = pageList.filter('[type="360"]'),
		    videoPages = pageList.filter('[type="video"]');

		app.fn.video.registerEvt(videoPages);

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
        /*
        console.log('slideImgBoxs=' + slideImgBoxs.length);
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
        */

		//百度map按钮
        var mapPage = that.pageList.filter('[type="map"]'),
            showMapButton = mapPage.find('.showMapbutton'),
            mapBox = $('#baidumapContent').parent(),
            closeBtn = $('#mapCloseButton'),
            mapIsShow = false,
            mapIndex = Number(showMapButton.parent().attr('pageindex'));

        var hideLeftRightArrow = function(){
            that.leftArrow.addClass('disNone');
            that.rightArrow.addClass('disNone');
        }

        //app.fn.baiduMapFun(app.contentPageList[mapIndex]);
        showMapButton.bind('touchend',function(e){
            mapBox.show().css({'top':'30%','visibility':'hidden'});
            app.fn.baiduMapFun(app.contentPageList[mapIndex]);

            mapBox.css({'top':'100%','visibility':'visible','display':'none'});
            mapIsShow = true;
            hideLeftRightArrow();
            that.upDownArrow.hide();
            that.pageIsMove = true;
            mapBox.show().animate({'top':'30%'},400);
            setTimeout(function(){
                closeBtn.css('opacity',1).removeClass('disNone');
            },400);
            

            e.stopPropagation();
            e.preventDefault();
            return false;
        });

        closeBtn.bind('touchend',function(e){
            mapBox.addClass('hideMapBox');
            $(this).animate({'opacity':0},500);
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

        slidePages.each(function(){
            var slidePage = $(this)[0];
            new Swipe(slidePage, {
                startSlide: 2,
                speed: 400,
                auto: false,
                continuous: true,
                disableScroll: false,
                stopPropagation: false,
                callback: function(index, elem) {},
                transitionEnd: function(index, elem) {}
            });
        });

	}

	function pageTouchEvt(){
		var pageList = that.pageList,
			touchHeight = that.pageSize.height/5,
			touchWidth  = that.pageSize.width/5,
		    startX,startY,diffX,diffY,endX,endY;

		that.pageIsMove = false;

		that.pageContent.bind('touchstart',function(e){
            if(that.pageIsMove) return;
			var touch = event.touches[0];
	        startX = touch.pageX;
	        startY = touch.pageY;
		    e.stopPropagation();
    		e.preventDefault();
    		return false;
		});

		that.pageContent.bind('touchmove',function(e){
            if(that.pageIsMove) return;
			var touch = event.touches[0];

	        endX = touch.pageX;
	        endY = touch.pageY;
		   	e.stopPropagation();
    		e.preventDefault();
    		return false;
		});

		that.pageContent.bind('touchend',function(e){
            if(that.pageIsMove) return;
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

            /*
			case 'slide':
			pageSlide(diffX);
			break;
            */

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
			curPage.addClass('disNone').hide();
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
			    delayTime    = Number(itemBox.attr('delayTime')),
                type = itemBox.attr('type');

			setTimeout(function(){
                //内页动画
                if(type==='fadeIn'){
                    //淡出动画
                    itemBox.removeClass('disNone').animate({'opacity':1},1000);
                }else{
                    itemBox.removeClass('disNone').addClass(animateClass);
                }

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







