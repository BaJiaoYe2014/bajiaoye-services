/*
每个app必须有的文件

index.html 静态模板页
app.css,js,images,三文件夹，
images,里arrow.png, hand.png, 图片是必备的;

动态文件
config.js,和对应的imgaes或音频文件, 图片、音频文件都放在images里

*/
var app = {
	/*
	app的整体配置，
	标题，页面描述，分享时的图片,背景音乐
	音乐图标位置 可选值 top-right,top-left,bottom-left,bottom-right
	*/        
    "global": {
        "music": {
        	"hasMusic":true,
            "hasIcon": true,
            "name": "wind.mp3",
            "iconPostion":"top-right"   
        },
        "pageTitle": "我是页面标题",
        "pageDescribe": "我是页面描述",
        "shareImage": "share_img.jpg"
    },
    /***
	开篇动画
	目前支持 "clickOpen","drawWords","wipeScreen",3种类型
	具体内容后续讨论
    ***/
    "startAnimate": {
        "type": "clickOpen",
        "clickImg": "click.jpg"
    },
    /***
    "startAnimate": {
        "hollowImg": "logo-space02.png",
        "textImg": "content-0.png",
        "coordinate": "[[340,240]]",   //,[390,284],[312,300],[238,278]
        "type": "drawWords",
        "solidImg": "logo-start02.jpg"
    },
    "startAnimate": {
        "type": "clickOpen",
        "clickImg": "click.jpg"
    }
    "startAnimate": {
        "type": "wipeScreen",
        "wipeImg": "wipe.jpg"
    }
    ***/
    /***
    页面内容
	以数组的顺序展示页面
    页面类型 "common","gallery","360","slide","album","video"

	1)common
	
	background,页面背景，可以为空
	effect页面切换效果，目前支持:"120%","fade",放大120% 或淡出淡入，默认不写 "fade"
    animateImgs,动画图片，不分先后，以固定的延时，显现在页面上
    每张动画图片，
        from,放置方向
        position,放置位置，允许的位置值，10%,20%,30%....100%
        delayTime 以页面出现为起点往后延时，单位毫秒，开始显示该图片动画
        src,图片文件，
        运动时间，100%为的1000ms,其他位置，根据百分比线性截取
    2)gallery
	    总体内容和common类型一样，多了右边滑动栏，
	    sideImg，右边可滑动出现一张示意图
	3)360
	  360°展示产品，提供8张图片即可
	4)slide
	  提供一系列图片，可左右滑动
	5)album
	  提供一系列图片，相册展示
	6)map
	  地图
	6)video
	  视频
    ***/
    "contentPageList": [
    	{
    		"type":"common",
    		"background":"bg_1.jpg",
    		"effect":"120%", 		
    		"animateImgs":[
   				{
    				"from":"left",
    				"position":"50%", //允许的位置值，10%,20%,30%....100%
    				"delayTime":1000,// 以页面出现为起点往后延时，单位毫秒，开始显示该图片
    				"src":"l_left.png"
    			},
    			{
    				"from":"top",
    				"position":"60%", 
    				"delayTime":1000,
    				"src":"l_top.png"
    			},
    			{
    				"from":"right",
    				"position":"70%", 
    				"delayTime":1000,
    				"src":"l_right.png"
    			}
    		]
    	},
    	{
    		"type":"gallery",
    		"background":"bg_2.jpg",
    		"tipImg":"side_1.jpg",
    		"animateImgs":[
    			{
    				"from":"left",
    				"position":"70%", //允许的位置值，10%,20%,30%....100%
    				"delayTime":1000,// 以页面出现为起点往后延时，单位毫秒，开始显示该图片
    				"src":"gallery/2_left.png"
    			},
    			{
    				"from":"top",
    				"position":"80%", 
    				"delayTime":1000,
    				"src":"gallery/2_top.png"
    			},
    			{
    				"from":"right",
    				"position":"90%", 
    				"delayTime":1000,
    				"src":"gallery/2_right.png"
    			}
    		]
    	},
    	{
    		"type":"360",
    		"animateImgs":[
                 {'src':"360/1_1.jpg"},
                 {'src':"360/1_2.jpg"},
                 {'src':"360/1_3.jpg"},

                 {'src':"360/1_4.jpg"},
                 {'src':"360/1_5.jpg"},
                 {'src':"360/1_6.jpg"},

                 {'src':"360/1_7.jpg"},
                 {'src':"360/1_8.jpg"}
             ]
    	},
    	{
    		"type":"slide",
    		"animateImgs":[
                 {'src':"slide/1_1.jpg"},
                 {'src':"slide/1_2.jpg"},
                 {'src':"slide/1_3.jpg"},

                 {'src':"slide/1_4.jpg"},
                 {'src':"slide/1_5.jpg"},
                 {'src':"slide/1_6.jpg"},

                 {'src':"slide/1_7.jpg"},
                 {'src':"slide/1_8.jpg"}
            ]
    	},
    	{
    		"type":"album",
            "animateImgs":[
                 {'src':"album/1_1.jpg"},
                 {'src':"album/1_2.jpg"},
                 {'src':"album/1_3.jpg"},

                 {'src':"album/1_4.jpg"},
                 {'src':"album/1_5.jpg"},
                 {'src':"album/1_6.jpg"},

                 {'src':"album/1_7.jpg"},
                 {'src':"album/1_8.jpg"}
            ]
    	},
        {
        	"type": "map",
            "button":"showMapbutton.png",
            "background": "mapBg.jpg",            
            "title": 'shanghaishi',
            "address":'上海市地处东经120度51分至122度12分',
            "longitude":'120.51',
            "latitude":'122.12'
        },
        {
        	"type": "video",
            "background": "video/videoBg.jpg",
            "videoScreenshot":"video/videoScreenshot.jpg",
            "videoButton":"video/videoBtn.png",
            "videoCode": '<iframe height=498 width=510 src="http://player.youku.com/embed/XNDk3MjMzMDY0" frameborder=0 allowfullscreen></iframe>'
        }
    ]
}


