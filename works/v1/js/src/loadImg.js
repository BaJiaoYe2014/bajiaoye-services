app.instance.loader = (new function(){
	var	that   = this, 
		loadedNum = 0;

	that = $.extend(that,app.instance.common);
	this.loadImgList = [];
	this.startLoad();

	//对外方法
	function startLoad(){ 
		app.fn.share();
		loadPageImgs();
		setPageMessage();
	}



	function setPageMessage(){
		var title    = $('#pageTitle'),
			global   = app.global,
			describe = global.pageDescribe;
		//that.checkKey(["title","describe"],global);

		title.text(global.title);
		
	}

	function loadOneImage(url,callback){
		var img = new Image(); 
	    if(img.complete) { 
	        callback.call(img);
	        return; 
	    }
	    img.onload = function () { 
	        callback.call(img);
	    };
	    img.src = url;
	}

	function loadPageImgs(){
		var imgList = getLoadImgs();

		for(var j=0,len=imgList.length; j<len; j++){
			imgUrl = "images/" +  imgList[j];
			loadOneImage(imgUrl,function(){
				loadedNum ++;
				if(loadedNum === imgList.length){
					that.startPage();
				}
			});
		}
	}

	function getLoadImgs(){
		var obj  = app.pageParam
		eachObj(obj);
		return that.loadImgList;
	}

	function eachObj(obj){
		var loadImgList = that.loadImgList,
			imgReg      = /.jpg|.png|.gif|.jpeg$/;

		for(var k in obj){
			var value = obj[k];
			if(typeof value === "object"){
				eachObj(value);
			}else{
				if(imgReg.test(value)){
					loadImgList.push(value);
				}
			}
		}
	}

	

	function loadOneImage(url,callback){
		var img = new Image(); 
	    if(img.complete) { 
	        callback.call(img);
	        return; 
	    }
	    img.onload = function () { 
	        callback.call(img);
	    };
	    img.src = url;
	}

	function loadPageImgs(){
		var imgList = getLoadImgs();

		for(var j=0,len=imgList.length; j<len; j++){
			imgUrl = "images/" +  imgList[j];
			loadOneImage(imgUrl,function(){
				loadedNum ++;
				console.log(imgUrl + "load Over~~");
				if(loadedNum === imgList.length){
					//先注释
					//that.startPage();
				}
			});
		}
	}

	function getLoadImgs(){
		var obj  = app.pageParam
		eachObj(obj);
		return that.loadImgList;
	}

	function eachObj(obj){
		var loadImgList = that.loadImgList,
			imgReg      = /.jpg|.png|.gif|.jpeg$/;

		for(var k in obj){
			var value = obj[k];
			if(typeof value === "object"){
				eachObj(value);
			}else{
				if(imgReg.test(value)){
					loadImgList.push(value);
				}
			}
		}
	}
});