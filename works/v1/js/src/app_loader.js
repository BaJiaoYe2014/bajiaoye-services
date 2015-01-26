var app = window.app||{};
app.fn  = app.fn||{};

app.fn.loader =function(){
    var that = this,
        imgList = [],
        loadImgNum = 0;
    //that = $.extend(that,app.instance.common);

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
        forObject(app.global);
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
        var htmlStr = '<div id="appLoadImgbox">';
        for(var i=0,len=imgList.length; i<len; i++){
            htmlStr += '<img onload="window.appLoader()" src="images/' + imgList[i] + '"/>';
        }
        htmlStr += '</html>';
        $(htmlStr).appendTo($(document.body));
    }

    window.musicIsLoad = function(){
        //alert('music is load ~~');
    }

    window.appLoader = function(){
        loadImgNum ++;
        if(loadImgNum === imgList.length){
           
            $('#pageContent .page').each(function(i){
                if(i>0){
                    $(this).addClass('disNone');
                }
            });
            $('#loaderBox').animate({'opacity':0},1000,function(){
                $(this).remove();
                $('#appLoadImgbox').remove();
            })
            
        }
    }
};

app.fn.loader();