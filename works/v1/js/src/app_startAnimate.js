app.instance.startAnimate = (new function(){
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

			case  "invitation": //邀请函
			app.fn.invitation(that);
			break;
		}
	}

	//临时执行,注意删除
	that.start();

	function musicIcon(){
		var musicNode = app.global.music;
		if(musicNode && musicNode.name){
			if(musicNode.hasMusic){
				var audioStr = '<audio id="myaudio" src="images/'+ musicNode.name +'"  loop="true" hidden="true"  />';
            	$(audioStr).appendTo($(document.body));
            	that.myaudio = $('#myaudio');

            	var domAudio = that.myaudio[0];

				domAudio.addEventListener('canplaythrough', function(e){
		            //callback(true);
		            var iconStr =  '<div class="icon-music" id="musicBox">' +
							       '<img id="icon-music-img" src="images/icon/icon_music.png" style="transform: rotate(0deg); " />'+
							       '</div>';
					$(iconStr).appendTo($(document.body));
					var musicBox    = $('#musicBox'),
					    musicImg    = musicBox.find('#icon-music-img'),
					    musicIsPlay = false;
					that.musicBox = musicBox;
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

					musicBox.bind("touchstart",function(e){
						if(musicIsPlay){
							clearInterval(that.musicTimer);
							domAudio.pause();
							musicIsPlay = false;
							musicImg.css("transform","rotate(0deg)");
							$(this).attr('musicIsPlay','false');
						}else{
							goMusiceImg();
							domAudio.play();
							musicIsPlay = true;
							$(this).attr('musicIsPlay','true');
						}

						e.stopPropagation();
						e.preventDefault();
						return false;
					});

					//开始音乐
					musicBox.trigger('touchstart');

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


