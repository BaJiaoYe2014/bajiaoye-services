var app = window.app||{};
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

