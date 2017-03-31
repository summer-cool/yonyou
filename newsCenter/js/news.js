$(document).ready(function() {
    function setParentIframeHeight(id) { //设置iframe高度
        try {
            var parentIframe = parent.document.getElementById(id);
            if (window.attachEvent) {
                window.attachEvent("onload", function() {
                    parentIframe.height = document.documentElement.scrollHeight - 100;
                });
                return;
            } else {
                window.onload = function() {
                    parentIframe.height = document.body.scrollHeight - 100;
                };
                return;
            }
        } catch (e) {
            throw new Error('setParentIframeHeight Error');
        }
    };
    //获取当前用户url
    var Nurl = window.location.href;
    console.log(Nurl)
    //提取当前页面的code值
    String.prototype.getQuery = function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = this.substr(this.indexOf("\?") + 1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        }
        //ucode为获取的code值
    var ucode = Nurl.getQuery("code"),
        // 最新发文.最新通知.最新新闻.官网新闻.集团荣誉.董事长寄语(url)
        url = [
            "http://h.yonyou.com/InfoCenter/mobile/dispatch_list.html#dispatch_list_section?ucode=" + ucode + "",
            "http://h.yonyou.com/InfoCenter/mobile/news_list.html#news_list_section?type=1&ucode=" + ucode + "",
            "http://h.yonyou.com/InfoCenter/mobile/news_list.html#news_list_section?type=2&ucode=" + ucode + "",
            "http://h.yonyou.com/InfoCenter/mobile/news_list.html#news_list_section?type=5&ucode=" + ucode + "",
            "http://h.yonyou.com/InfoCenter/mobile/news_list.html#news_list_section?type=3&ucode=" + ucode + "",
            "http://h.yonyou.com/InfoCenter/mobile/news_list.html#news_list_section?type=4&ucode=" + ucode + ""
        ],
        //动态添加一次iframe
        newFrame = "<iframe   height='100%'  id='myiframe'  class='frameContent' src='' frameborder='0'></iframe>",
        iHeight, //第一个iframe高度
        first = 1, //执行一次判断参数
        //先加载第一个iframe
        firstIframe = "<iframe   height='100%'  id='myiframe' class='frameContent fIframe' src='http://h.yonyou.com/InfoCenter/mobile/dispatch_list.html#dispatch_list_section?ucode=" + url[0] + "' frameborder='0' '></iframe>";
    (function() { //自加载第一个
        $(".firtI").append(firstIframe);
        $(".firtI").find("iframe").onload = setParentIframeHeight("myiframe");
    })();
    $(".sliderUl li").click(function() {
        var index = $(this).index();
        $(".sliderUl li").removeClass("activeLi");
        $(this).addClass("activeLi");
        var slideWidth = $(".sliderUl").width() / 6;
        if (index > 2) { //导航位置变动
            $(".sliderUl").scrollLeft(slideWidth * index);
        } else if (index > 3 && index < 5) {
            $(".sliderUl").scrollLeft(slideWidth * index);
        } else {
            $(".sliderUl").scrollLeft(-slideWidth * index);
        };
        var exist = $(".newsDiv").eq(index).find("iframe").length;
        if (first == 1) { //以第一个初始化的iframe高度作为后面创建的iframe高度
            first = 0;
            iHeight = $(".fIframe").height();
        };
        if (exist == 0) { //判断这个div是否有iframe,没有则动态添加一次
            $(".newsDiv").height(iHeight); //高度都为第一个iframe的高度
            $(".newsDiv").eq(index).append(newFrame);
            $(".newsDiv").eq(index).find("iframe").attr("src", "" + url[index] + "");
        };
        $(".newsDiv").removeClass("newsShow"); //切换
        $(".newsDiv").eq(index).addClass("newsShow");
    });
});