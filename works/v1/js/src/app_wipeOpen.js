var app = window.app||{};
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

