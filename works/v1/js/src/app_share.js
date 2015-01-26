var app = window.app||{};
app.fn  = app.fn||{};

app.fn.share = function(){
   
    var pageUrl = location.href;
    var global = app.global;
    var reg = /^.*\?/i;
    var matchArr = pageUrl.match(reg);
    var preStr = '';
    if(matchArr){
        preStr = matchArr[0].replace('?','');
    }
    var shareImgUrl  = preStr + 'images/'+ global.shareImage;
    
    //var imgUrl = preStr + '/images/'+imgUrl;

    getSignDate(shareFun);

    function getSignDate(shareFun){
        $.ajax({
            type:'get',
            url:'http://bajiaoye.cn:8000/bjyservice/index.php/getSignature',
            data:{'url':encodeURIComponent(pageUrl)},
            success:function(data){
                if(typeof data === 'string'){
                    data = JSON.parse(data);
                    shareFun(data);
                }
            },
            error:function(error){
                console.log(error);
            }
        })
    }

    function shareFun(data){
        data.jsApiList = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo'];
        wx.config(data);
        
        //通过ready接口处理成功验证
        //alert('title=' + global.pageTitle + '---imgUrl:' + shareImgUrl);
        wx.ready(function() {
            //分享到朋友圈
            wx.onMenuShareTimeline({
                desc: global.pageDescribe,
                title: global.pageTitle,
                // 分享标题
                link: pageUrl,
                // 分享链接
                imgUrl: shareImgUrl,
                // 分享图标
                success: function() {
                   
                }
            });
            //分享给朋友
            wx.onMenuShareAppMessage({
                desc: global.pageDescribe,
                title: global.pageTitle,
                // 分享标题
                link: pageUrl,
                // 分享链接
                imgUrl: shareImgUrl,
                // 分享图标
                success: function() {
                   
                }
            });

        });

        wx.error(function(res) {
            for(var k in res){
                alert(k + '--' + res[k]);
            }
        });
       
    }
    
}
