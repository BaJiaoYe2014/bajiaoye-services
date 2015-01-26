var app = window.app||{};
app.fn  = app.fn||{};

//click open
app.fn.invitation = function(that){
    var startHtml = '';
    var startBox = that.startBox;
    var btn = startBox.find('.invitatationBtn'),
        tip = startBox.find('.invitatationTip'),
        mainBox = startBox.find('#invitationMainBox'),
        upBox = startBox.find('.startItemBoxTop'),
        downBox = startBox.find('.startItemBoxDown');

    registerEvt();



    function registerEvt(){
        
        btn.bind('click',function(){

            tip.animate({'opacity':0},500,function(){
                $(this).remove();
            });
            
            mainBox.hide();
            $(this).hide();

            
            upBox.animate(
                {top:-1000},
                {
                easing: 'easeInOutCubic',
                duration: 1000,
                complete:function(){
                }
            });

            setTimeout(function(){
                downBox.animate(
                    {top:1000},
                    {
                    easing: 'easeInOutCubic',
                    duration: 1000,
                    complete:function(){
                        startBox.hide();
                        if(app.instance.pageContent.startPageOne){
                            app.instance.pageContent.startPageOne();
                        }
                    }
                });
            },500);

        })

    }
   
}

