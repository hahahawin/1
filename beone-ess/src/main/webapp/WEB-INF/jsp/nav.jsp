<%--
    倪杨
    2019-08-08
    首页左侧菜单栏页面，主要是通过顶部的菜单栏做相应的添加搜索得到具体的菜单，并嵌入。
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
    <title>Title</title>

    <style>
       ::-webkit-scrollbar{
            display:none;
        }
    </style>
    <style>
        #navButton{
            display: block;
            /*background: rgba(75,163,251,0.2);*/
            width: 35px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            margin-top: 10px;
            cursor: pointer;
            margin-right: 15px;
        }
        #navButton:hover{
            /*background: rgba(75,163,251,0.4);*/
        }
        .left-nav{
            padding-top: 0;
            background: #fff;
        }
    </style>

    <script>
        //打开标签
        function openTitlePage(title,url){
            xadmin.add_tab(title,basePath+'loadJsp?page='+url);
        }

        var pid="";
        var getSecondUrl=getBeonePath("ESS")+"sys/getSecondRight";

        function closeNav(){
            if($('.left-nav').css('width')=='220px'){
                $("#searchInput").css('display','none');
                $('.left-nav .open').click();
                $('.left-nav i').css('font-size','18px');
                $('.left-nav').animate({width: '60px'}, 100);
                $('.left-nav cite,.left-nav .nav_right').hide();
                $('.page-content').animate({left: '60px'}, 100);
                $('#navTitle')[0].innerHTML="<span onclick=\"closeNav()\" class=\"iconfont\"><i id=\"navButton\" class=\"iconfont\" style=\"padding: 7px 7px 8px 8px\"><img style=\"padding-top: 10px\" src=\""+basePath+"img/icon/sidebar_icon_shrink2.png\"></i></span>";
                $('.page-content-bg').hide();
            }else{
                $("#searchInput").css('display','block');
                $('.left-nav').animate({width: '220px'}, 100);
                $('.page-content').animate({left: '220px'}, 100);
                $('.left-nav i').css('font-size','14px');
                $('.left-nav cite,.left-nav .nav_right').show();
                $('#navTitle')[0].innerHTML="<span style=\"color: #485a6a\">- 菜单导航栏 -</span>\n" +
                    "                <span onclick=\"closeNav()\" class=\"iconfont\"><i id=\"navButton\" class=\"iconfont\" style=\"float: right\"><img style=\"padding-top: 10px\" src=\""+basePath+"img/icon/sidebar_icon_shrink2.png\"></i></span>";
                if($(window).width()<768){
                    $('.page-content-bg').show();
                }
            }
        }

        $(window).keydown(function(event){
            if(event.keyCode == 13){
                load1(pid);
                if ($("#sInput").val()==null||$("#sInput").val()==""||$("#sInput").val()==undefined){
                    return false;
                }
                $('#nav li:first-child').attr("class","open");
                $('#nav').find('li').each(function(){
                    $(this).attr("class","open");
                    // $(this).find("a").attr("class","active");
                    $(this).find("ul").css("display","block");
                    $(this).find("a").find('.nav_right').html('&#xe6a6;');
                });
            }
        });
        function findNav() {
            load1(pid);
            if ($("#sInput").val()==null||$("#sInput").val()==""||$("#sInput").val()==undefined){
                return false;
            }
            $('#nav li:first-child').attr("class","open");
            $('#nav').find('li').each(function(){
                $(this).attr("class","open");
                // $(this).find("a").attr("class","active");
                $(this).find("ul").css("display","block");
                $(this).find("a").find('.nav_right').html('&#xe6a6;');
            });
        }
        function load1(id) {
            pid=id;
            if($('.left-nav').css('width')!='220px'){
                closeNav();
            }
            var json={};
            json.belong_org_id=belong_org_id;
            json.user_id=user_id;
            json.isadmin=isadmin;
            json.pid=id;
            json.tableName = 'ess1';
            json.ASD = getJsonASD();
            json.xmlx = '1';
            json.Rname = $("#sInput").val();
            getAjax({url:getSecondUrl,data:JSON.stringify(json),callback:function (reg) {
                    if (reg.resultCode=="200"){
                        var data=reg.resultMsg.data;
                        var html="";
                        var hscdgl = true;
                        var bmxb = 0; //别名下标
                        for (var i=0;i<data.length;i++){
                            if(data[i].right_code == 'PTGL_CDGL'){
                                hscdgl = false;
                            }
                            var title = data[i].right_name;
                            var gxname = data[i].right_gxname;
                            var gxnames = eval("("+ gxname +")");
                            var ywpt = data[i].right_ywpt;
                            var ywpts = ywpt.split(",");
                            bmxb = ywpts.indexOf("4");
                            if(bmxb > -1){
                                title = gxnames[bmxb];
                            }
                            var li="<li>" +
                                "            <a href=\"javascript:;\">" +
                                "               <i class=\"iconfont left-nav-li\" lay-tips="+title+"><img style='width:16px;height: 16px;color:#485A6A' src=\'"+basePath+"img/menu/menu23/gray/"+data[i].right_icon+"\'></i>" +
                                "               <cite style=''>"+title+"</cite>" +
                                "               <i class=\"iconfont nav_right\">&#xe697;</i></a>";
                            var ul="<ul class=\"sub-menu\">";
                            for (var j=0;j<data[i].second.length;j++){
                                title = data[i].second[j].right_name;
                                gxname = data[i].second[j].right_gxname;
                                gxnames = eval("("+ gxname +")");
                                ywpt = data[i].second[j].right_ywpt;
                                ywpts = ywpt.split(",");
                                bmxb = ywpts.indexOf("4");
                                if(bmxb > -1){
                                    title = gxnames[bmxb];
                                }
                                var ulli="<li>" +
                                    "                    <a onclick=\"xadmin.add_tab('"+title+"',basePath+'loadJsp?page="+data[i].second[j].right_url+"&ID="+data[i].second[j].right_id+"&CODE="+data[i].second[j].right_code+"')\">" +
                                    "                        <i class=\"iconfont\"><img style='width:16px;height: 16px;color:#485A6A' src=\'"+basePath+"img/menu/menu23/gray/"+data[i].second[j].right_icon+"\'></i>" +
                                    "                        <cite style=''>"+title+"</cite></a>" +
                                    "                </li>";
                                ul+=ulli;
                            }
                            ul+="</ul>";
                            li+=ul;
                            li+= "</li>";
                            html+=li;
                        }
                        if(hscdgl && isadmin == '2' && id == '2'){
                            var li="<li>" +
                                "            <a href=\"javascript:;\">" +
                                "               <i class=\"iconfont left-nav-li\" lay-tips=\"菜单管理\"><img style='width:16px;height: 16px;color:#485A6A' src=\'"+basePath+"img/menu/menu23/gray/tool_icon_bbgl2.png\'></i>" +
                                "               <cite style=''>菜单管理</cite>" +
                                "               <i class=\"iconfont nav_right\">&#xe697;</i></a>";
                            var ul="<ul class=\"sub-menu\">";
                            var ulli="<li>" +
                                "                    <a onclick=\"xadmin.add_tab('菜单授权',basePath+'loadJsp?page=sys/sysOrgMenu')\">" +
                                "                        <i class=\"iconfont\"><img style='width:16px;height: 16px;color:#485A6A' src=\'"+basePath+"img/menu/menu23/gray/tool_icon_qxgl2.png\'></i>" +
                                "                        <cite style=''>菜单授权</cite></a>" +
                                "                </li>";
                            ul+=ulli;
                            ul+="</ul>";
                            li+=ul;
                            li+= "</li>";
                            html = li + html;
                        }
                        $("#nav")[0].innerHTML=html;

                        getLeftOnClick(); //绑定左侧事件
                    }
                }
            });
        }
    </script>

</head>
<body >

<div id="side-nav" style="background: #FFFFFF;margin-left: 10px;overflow-y: hidden;">
    <li id="navTitle" style="height: 50px;line-height: 50px;font-size: 12px;text-align: center;">
        <span style="color: #485a6a">- 菜单导航栏 -</span><%--&#xe699;--%>
        <span onclick="closeNav()" class="iconfont"><i id="navButton" class="iconfont" style="float: right"><img style="padding-top: 10px" src=""+basePath+"img/icon/sidebar_icon_shrink2.png"></i></span>
    </li>
    <li id="searchInput" style="width:196px;height:32px;border:1px solid #eef0f2;background: #F8F9FB;">
        <input id="sInput"  autocomplete="off" style="width: 80%;height:100%;background: none;border: none; color: #BFBFBF;font-size: 12px;text-align: center" placeholder="请输入菜单名称，模糊查询">
        <img onclick="findNav()" style="margin-left: 5px;cursor: pointer;" src="<%=basePath%>img/icon/sidebar_icon_search2.png">
    </li>
    <ul id="nav" style="margin-top: 10px;"></ul>
</div>

</body>
</html>
