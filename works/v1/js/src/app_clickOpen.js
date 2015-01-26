var app = window.app||{};
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




