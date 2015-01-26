var app = window.app||{};
app.fn  = app.fn||{};

app.fn.video  = (function(){

    var getVideoCode = function(videoId){
        var codeArr = videoId.split("-"),
            htmlCode = '<span class="videoCloseButton">关闭</span>';
        if(codeArr[0] === 'youku'){
            htmlCode += '<iframe height=600 width="100%" src="http://player.youku.com/embed/'+ codeArr[1] +'" frameborder=0 allowfullscreen></iframe>';
        }
        return htmlCode;
    }

    var buildVideoPageFun = function(item,type){
        var effect  = item.effect?item.effect:'fade',
            pageHtml = '',
            pageBg   = item.background,
            styleStr = pageBg?'style="background-image:url(images/'+ pageBg +')"':'',
            videoCode = getVideoCode(item.videoUrl);

            //curShow  = '';
        pageHtml =  '<div effect="'+ effect +'" type="'+ type +'" ' + styleStr + ' class="page lowZindex disNone">';
        pageHtml += '<div class="markBox disNone" id="markBox"></div>';
        pageHtml += '<div class="likePageBox" style="background:url(images/'+ item.videoScreenshot +') no-repeat center center ; background-size:100% auto;"></div>';
        pageHtml += '<div class="videoBtnCover" style="bottom:'+ item.verticalPosition +'px;" > </div>';
        pageHtml += '<img class="videoBtn" style="bottom:'+ item.verticalPosition +'px;" src="images/'+ item.videoButton +'" />';
        pageHtml += '<div videoId="'+ item.videoUrl +'" class="videoBox disNone">'+ videoCode +'</div></div>';
        return pageHtml;
    }

    var registerEvtFun = function(videoPages){
        var videoOpenBtn  = videoPages.find('.videoBtnCover'),
            videoCloseBtn = videoPages.find('.videoCloseButton'),
            startAnimate  = app.instance.startAnimate,
            //musicBox      = $('#musicBox'),
            videoStopMusic = false,
            markBox       = videoPages.find('.markBox');
            //pageContent   = app.instance.pageContent;
        
        //打开
        videoOpenBtn.bind('touchend',function(){
            var curVideoBox = $(this).parent().find('.videoBox'),
                pageContent = app.instance.pageContent,
                musicBox = app.instance.startAnimate.musicBox;
            if(!curVideoBox.html()){
                curVideoBox.html(getVideoCode(curVideoBox.attr("videoId")));
            }
            curVideoBox.removeClass('disNone');
            markBox.removeClass('disNone');

            pageContent.pageIsMove = true;
            console.log('pageContent.pageIsMove=' + pageContent.pageIsMove);
            pageContent.upDownArrow.addClass('disNone');

            console.log('musicBox.length=' +musicBox.length+'------'+ musicBox.attr('musicIsPlay'));
            if(musicBox.length>0){
                if(musicBox.attr('musicIsPlay') === 'true'){
                    musicBox.trigger('touchstart');
                    videoStopMusic = true;
                }
            }
        });

        //videoCloseBtn.bind('touchend',function(){
        videoPages.on('touchend','.videoCloseButton',function(){
            var pageContent = app.instance.pageContent,
                musicBox = app.instance.startAnimate.musicBox;
            $(this).parent().addClass('disNone').html('');

            markBox.addClass('disNone');
            pageContent.pageIsMove = false;
            pageContent.upDownArrow.removeClass('disNone');
            if(videoStopMusic){
                musicBox.trigger('touchstart');
                videoStopMusic = false;
            }

        });
    }

    return {
        buildVideoPage:function(item,type){
            return buildVideoPageFun(item,type);
        },
        registerEvt:function(videoPages){
            registerEvtFun(videoPages);
        }
    }

})();