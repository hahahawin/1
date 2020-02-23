<%--
    倪杨
    2019-08-08
    首页。include顶部菜单（nav-top.jsp）
            同时添加了一个iframe，主要用于分别桌面页面和操作页面，默认登陆成功是桌面页面
--%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

    Integer bqDq = (Integer)request.getSession().getAttribute("bqDq");
    Map<String, String> usermap = (Map<String, String>) request.getSession().getAttribute("user");
    String user_id = null;
    String user_name = null;
    String belong_org_id = null;

    if(usermap == null){
        System.out.println("basePath=="+basePath);
        response.sendRedirect(basePath);
        return;
    }else{
        user_id = usermap.get("user_id");
        user_name = usermap.get("user_name");
        belong_org_id = usermap.get("belong_org_id");
    }
%>
<html>
<script>
    var p_dataInfo = {} ;  //数据字典缓存
    var p_rightInfo = {} ; //权限缓存
    var p_helpInfo = {} ; //帮助中心
</script>
<head>
    <%--注意：当用include 引入的jsp文件中，各个js方法名、变量名，css类名等不能重复 --%>
    <title>APCOS智慧教育服务授权管理云平台</title>
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <link rel="icon" href="<%=basePath%>img/jx.png" type="image/x-icon"/>
    <jsp:include page="introduce/common.jsp"></jsp:include>
    <script type="text/javascript" src="<%=basePath%>js/xadmin.js"></script>
    <script type="text/javascript" src="<%=basePath%>js/lottie.min.js"></script>
        <script type="text/javascript" src="<%=basePath%>js/md5.js"></script>

    <%--<script type="text/javascript" src="<%=basePath%>img/icon/icon_xx.json"></script>--%>
    <style>
        .layui-carousel>[carousel-item]>*{
            background:#4BA3FB;
        }
        .nav-top{width: 90px;height: 65px;float: left;text-align: center;padding-top: 15px;}
        .nav-top:hover{background: #3F97EE;cursor: pointer;}
        .nav-top img{width: 24px;height: 24px;margin-bottom: 8px;}
        .nav-top label{width: 50px;height: 11px;font-size: 12px;color: #FFFFFF;font-family: MicrosoftYaHei;font-weight: 400}
        .layui-carousel-ind{top: -15px;}
        .container .layui-nav-item{line-height: 40px;}
        #help i:hover{cursor: pointer;background: #AED0EA;border-radius: 50%}
    </style>
    <script>
        var uploadFileUrl= getBeonePath("ESS")+"common/uploadFile";
        var getUserAvatarUrl=getBeonePath("ESS")+"sys/getUserAvatar";
        var updateUserAvatarUrl=getBeonePath("ESS")+"sys/updateUserAvatar";
        var getUserNoteUrl=getBeonePath("ESS")+"jcbg/getUserNote";
    </script>

</head>

<body class="index">
<!-- 顶部开始 -->
<div class="container">
    <div style="width: 100%;height: 40px;line-height: 40px;">
        <div  class="logo">
            <a style="" href="javascript:void(0)">
                <img style="width: 56px;height: 17px;line-height: 17px;" src="img/logo@2x.png">
            </a>
            <a style="width: 182px;height: 14px;font-size: 14px">APCOS智慧教育服务授权管理云平台</a>
        </div>

        <ul class="layui-nav right" lay-filter="">
            <li class="layui-nav-item" style="margin-left: 10px;">
                <span id="prompt" style="position: absolute;top: -20px;right: -10px;display: none"></span>
                <img id="noteId" style="position: relative;cursor: pointer" onclick="openContentPage('便签查看','jcbg/bqgl_dh&ID=367&CODE=JCBG_RCBG_BQGL','363');" src="<%=basePath%>img/icon/header_icon_note.png">
            </li>
            <li class="layui-nav-item" style="margin-left: 10px;">
                <img style="width: 26px;height: 26px;border-radius: 50%; border: 2px solid rgba(255,255,255,0.5)" id="avatar" src="">
            </li>
            <li class="layui-nav-item">
                <a href="javascript:;"><%=user_name%></a>
                <dl class="layui-nav-child" style="z-index: 999999">
                    <!-- 二级菜单 -->
                    <dd>
                        <a onclick="openUpass();">修改密码</a></dd>
                        <a onclick="openUname();">账号修改</a></dd>
                    <%--<dd>--%>
                        <%--<a onclick="xadmin.open('切换帐号','http://www.baidu.com')">切换帐号</a></dd>--%>
                    <dd>
                        <a href="<%=basePath%>login_out">退出</a>
                    </dd>
                </dl>
            </li>
            <li class="layui-nav-item to-index">
                <%--<a href="javascript:void(0)" onclick="switchNav('desktop')">前台首页</a>--%>
            </li>
        </ul>
    </div>
    <div carousel-item="" style="width: 100%;height: 75px;position: absolute;left: 0;">
        <jsp:include page="nav-top.jsp"></jsp:include>
    </div>

</div>
<!-- 顶部结束 -->
<iframe id="conIframe" src='<%=basePath%>loadJsp?page=desktop' frameborder="0" scrolling="yes" style="width: calc(100% - 26px);height:calc(100vh - 130px);margin: 0;padding: 0;float: left"></iframe>

<%--帮助模块--%>
<div id="help" style="float: right;width: 26px;height:calc(100vh - 130px);">
    <i id="help1" class="layui-icon layui-icon-left" style="width: 16px;height:16px;position: relative;top: 10px;left: 5px;" onclick="helpWindow('show')"></i>
    <div id="help2" style="width: 200px;background: #fff;height: 100%;display: none">
        <div style="width: 100%;height: 36px;background-color:#EEF7FF ">
            <span style="float: left;padding-left: 10px;position: relative;top: 10px;font-size: 14px;">帮助文档</span>
            <i style="width: 16px;height:16px;float: right;position: relative;top: 10px;right: 5px;" class="layui-icon layui-icon-right" onclick="helpWindow('hide')"></i>
        </div>
        <div style="width: 100%" id="helpConten"></div>
    </div>
</div>
<%--添加修改的table页面--%>
<div class="operationModle" id="uPass"  style="display: none;">
    <form id="uPassForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>原密码</label>
            <div class="layui-input-block">
                <input type="password" NAME="old_pass" title="原密码" maxlength="20" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>新密码</label>
            <div class="layui-input-block">
                <input type="password" NAME="new_pass" title="新密码" maxlength="20" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>确认密码</label>
            <div class="layui-input-block">
                <input type="password" NAME="copy_pass" title="确认密码" maxlength="20" autocomplete="off" class="layui-input">
            </div>
        </div>
        <button style="display: none;" id="uPassSub" class="layui-btn" lay-submit lay-filter="uPassSub">新增</button>
    </form>
</div>

<%--账号修改--%>
<div class="operationModle" id="uName"  style="display: none;">
    <form id="uNameForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>用户账号</label>
            <div class="layui-input-block">
                <input type="text" NAME="username" title="用户账号" maxlength="20" lay-verify="required|special|unique" autocomplete="off" class="layui-input">
            </div>
        </div>
        <button style="display: none;" id="uNameSub" class="layui-btn" lay-submit lay-filter="uNameSub">修改用户</button>
    </form>
</div>
</body>
<script>
    function helpWindow(type) {
        if (type == 'show'){
            $("#conIframe").css("width","calc(100% - 210px)");
            $("#help").css("width","200px");
            $("#help1").css("display","none");
            $("#help2").css("display","block");
        }else{
            $("#conIframe").css("width","calc(100% - 26px)");
            $("#help").css("width","26px");
            $("#help1").css("display","block");
            $("#help2").css("display","none");
        }
    }
</script>
<script>
    var firstRight="";
    var getFirstUrl=getBeonePath("ESS")+"sys/getFirstRight";
    var jsonASD=getJsonASD();
    var tableName = "ess2" ; //表名
    var status = "" ; //状态
    var updateCode = "XTGL_XTQX_YHGL_EDIT" ; //用户修改
    var updateUrl = getBeonePath("ESS")+"common/update";
    var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

    $(function () {//初始化
        load(); //加载以及目录
        loadAvatar();   //加载头像
        loadNote();     //加载便签

        var animData1 = {
            container:document.getElementById('prompt'),
            renderer: 'svg', // 设置渲染器(svg/canvas/html)
            loop: true, // 是否循环播放
            autoplay: true, // 是否自动播放
            path: '<%=basePath%>img/icon/icon_xx.json'//动画json文件路径
        }
        //便签提示闪烁样式
        lottie.loadAnimation(animData1);

        $(document).on('click', '.nav-top', function(){
            var list = document.getElementsByClassName("nav-top");
            for (var i=0; i<list.length;i++){
                list[i].style.background='#4BA3FB';
            }
            if(this.className.search("mainPage")!=-1){
                var list1 = document.getElementsByClassName("mainPage");
                for (var j=0; j<list1.length;j++){
                    list1[j].style.background='#3F97EE';
                }
            }else{
                this.style.background='#3F97EE';
            }
        });
    })

    window.onresize = function(){//当浏览器放大或缩小时执行
        load();
    }

    function load() {
        if (firstRight==null||firstRight==""||firstRight==undefined){
            var json={};
            json.belong_org_id=belong_org_id;
            json.isadmin = isadmin;
            json.user_id = user_id;
            json.tableName = 'ess1';
            json.ASD = jsonASD;
            json.xmlx = '1';
            getAjax({url:getFirstUrl,data:JSON.stringify(json),callback:function (reg) {
                    if (reg.resultCode=="200"){
                        firstRight = reg.resultMsg;
                    }
                }
            });
        }
        var reg=firstRight;
        var clientWidth = document.body.clientWidth-90; //页面宽度
        var w=90;   //一个选项的宽度
        var sum=reg.count;   //一共多少个选项
        var data = reg.data;

        var number = parseInt(clientWidth/w);   //一个选项卡能放多少个
        var page=parseInt(sum/number);  //总共需要多少个选项卡
        var number1 = sum-number*page;  //最后一页的个数

        var html="";
        var c=0;
        for ( var i=0;i<page;i++){
            html+=return1(c,number,data);
            c=c+1;
        }
        if (number1!=0){
            html+=return1(c,number,data);
        }
        if(sum == 0 && isadmin == '2'){
            var h1="<div>";
            h1+="<div class='nav-top mainPage' onclick='switchNav(\""+"desktop"+"\")'>" +
                "                <div>" +
                "                    <img src=\'"+"img/menu/nav_icon_home.png"+"\'><br>" +
                "                    <label>"+"我的桌面"+"</label>" +
                "                </div>" +
                "            </div>";

            var img="img/menu/menu1/top/nav_icon_xtsz.png";
            var title='平台管理';
            var url='2';
            h1+= returnDiv(url,img,title);

            h1+="</div>";
            html = h1;
        }

        $('#load')[0].innerHTML=html;

        layui.use(['carousel', 'form','layer'], function(){
            var carousel = layui.carousel,
                form=layui.form,
                layer=layui.layer;
            //图片轮播
            carousel.render({
                elem: '#nav-top',
                width: '100%',
                height: '75px',
                autoplay:false,//是否轮播 true，false
                // interval:5000,// 切换轮播间隔时间（毫秒）
                arrow: 'none'    //显示箭头，可选always 一直在,hover 悬浮在,none 不在
            });

            window.openUpass =function () {
                document.getElementById("uPassForm").reset();
                status="";
                layer.open({
                    type:1,//类型
                    area:['400px','220px'],//定义宽和高
                    title:'修改密码',//题目
                    shadeClose:false,//点击遮罩层关闭
                    btn: ['确定','关闭'],
                    content: $('#uPass'),//打开的内容
                    yes:function (index,layero) {
                        $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                        $("#uPassSub").click();
                        if(status=="SUCCESS"){
                            layer.close(index);
                            window.location.href = ESS;
                        }
                        $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                    },
                    btn2:function (index,layero) {
                        layer.close(index);
                    }
                });
            };

            //系统参数 表单提交
            form.on('submit(uPassSub)', function (data) {
                var jsonUpdate = data.field;  //通过name值获取数据
                if(jsonUpdate.old_pass == null || jsonUpdate.old_pass == '' || jsonUpdate.old_pass == undefined ){
                    layer.msg("请输入原密码！", {offset: '200px'});
                    return false ;
                }
                if(jsonUpdate.new_pass == null || jsonUpdate.new_pass == '' || jsonUpdate.new_pass == undefined ){
                    layer.msg("请输入新密码！", {offset: '200px'});
                    return false ;
                }
                if(jsonUpdate.new_pass == jsonUpdate.old_pass ){
                    layer.msg("新密码不能与旧密码一致！", {offset: '200px'});
                    return false ;
                }
                if(jsonUpdate.new_pass != jsonUpdate.copy_pass ){
                    layer.msg("新密码和确认密码不一致！", {offset: '200px'});
                    return false ;
                }

                var json ={};
                json.ASD=jsonASD;
                json.tableName=tableName;
                var url= updateUrl;
                json.ASD.code=updateCode;

                var jsonWhere={};//修改条件
                jsonWhere.ID=jsonASD.user_id;
                jsonWhere.PASSWORD=hex_md5(jsonUpdate.old_pass).toUpperCase();
                json.where=jsonWhere;
                var jsonFild={};
                jsonFild.PASSWORD  = hex_md5(jsonUpdate.new_pass).toUpperCase();
                json.fild=jsonFild;

                getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
                        if(reg.resultCode == '200'){
                            status="SUCCESS";
                            // layer.msg("修改成功,请退出重登！", {offset: '200px'});
                        }else{
                            layer.msg("修改失败,请检查原密码是否正确！", {offset: '200px'});
                        }
                    }
                });

                return false;
            });

            window.openUname =function () {
                document.getElementById("uNameForm").reset();
                status="";
                // $("input[name='username']").val(user_name);
                layer.open({
                    type:1,//类型
                    area:['400px','220px'],//定义宽和高
                    title:'修改账号',//题目
                    shadeClose:false,//点击遮罩层关闭
                    btn: ['确定','关闭'],
                    content: $('#uName'),//打开的内容
                    yes:function (index,layero) {
                        layer.msg('loading...', {icon: 16, shade: 0.01, time: 0});
                        $("#uNameSub").click();
                        if(status=="SUCCESS"){
                            layer.close(index);
                        }
                    },
                    btn2:function (index,layero) {
                        layer.close(index);
                    }
                });
            };

            form.on('submit(uNameSub)', function (data) {

                var json ={};
                json.ASD=jsonASD;
                json.tableName=tableName;
                var url= updateUrl;
                json.ASD.code=updateCode;

                var jsonWhere={};//修改条件
                jsonWhere.ID=jsonASD.user_id;
                json.where=jsonWhere;
                var jsonFild={};
                jsonFild.account  = data.field.username;
                json.fild=jsonFild;

                getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
                        layer.close(layer.msg());
                        if(reg.resultCode == '200'){
                            status="SUCCESS";
                            layer.msg("修改成功！", {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }
                });

                return false;
            });

            form.verify({
                special: function(value,item){//特殊字符
                    var msg = excludeSDQuotes(value,item);
                    if(msg!=''){
                        return msg;
                    }
                },
                unique: function (value,item) {//唯一性验证
                    var checkResult="1";
                    var param={
                        tableName:tableName,
                        key:"ACCOUNT",
                        value:value,
                        id:user_id
                    }
                    getAjax({url:uniqueUrl,data:JSON.stringify(param),callback:function (reg) {
                            if(reg.status!="200"){
                                checkResult = "2";
                            }
                        }
                    });
                    if (checkResult=="2"){
                        return "["+item.title+"] 为 '"+value+"' 的已存在！";
                    }
                }
            });
        });


    }

    function return1(c,number,data) {
        var bmxb = 0; //别名下标
        var h1="<div>";
        h1+="<div class='nav-top mainPage' onclick='switchNav(\""+"desktop"+"\")'>" +
            "                <div>" +
            "                    <img src=\'img/menu/nav_icon_home.png\'><br>" +
            "                    <label>"+"我的桌面"+"</label>" +
            "                </div>" +
            "            </div>";
        var xtgl = false;
        for (var j=0;j<number;j++){
            var n=Number(c*number)+Number(j);
            if (n>=data.length){
                break;
            }
            var img="img/menu/menu1/top/"+data[n].right_icon;
            var title=data[n].right_name;
            var url=data[n].right_id;
            var gxname = data[n].right_gxname;
            var gxnames = eval("("+ gxname +")");
            var ywpt = data[n].right_ywpt;
            var ywpts = ywpt.split(",");
            bmxb = ywpts.indexOf("4");
            if(bmxb > -1){
                title = gxnames[bmxb];
            }
            h1+= returnDiv(url,img,title);
            if(data[n].right_code == 'XTGL'){
                xtgl = true;
            }
        }
        h1+="</div>";
        return h1;
    }

    function returnDiv(url,img,title) {
        var div="<div class='nav-top' onclick='switchNav(\""+url+"\")'>" +
            "                <div>" +
            "                    <img src=\'"+img+"\'><br>" +
            "                    <label>"+title+"</label>" +
            "                </div>" +
            "            </div>";
        return div;
    }

    function switchNav(url) {

        if(url=="desktop"){
            document.getElementById("conIframe").src=""+basePath+"loadJsp?page=desktop";
            var iframe = document.getElementById("conIframe");

            if (iframe.attachEvent){
                iframe.attachEvent("onload", function(){ // IE

                });
            } else {
                iframe.onload = function(){ // 非IE

                };
            }
        }else{
            if($('#conIframe').attr('src')=="<%=basePath%>loadJsp?page=content"){
                var childWindow = $("#conIframe")[0].contentWindow;
                childWindow.load1(url);
            }else {
                $('#conIframe').attr('src', '<%=basePath%>loadJsp?page=content');
                var iframe = document.getElementById("conIframe");

                if (iframe.attachEvent){
                    iframe.attachEvent("onload", function(){ // IE
                        //调用子页面的方法.
                        var childWindow = $("#conIframe")[0].contentWindow;
                        childWindow.load1(url);
                    });
                } else {
                    iframe.onload = function(){ // 非IE
                        //调用子页面的方法.
                        var childWindow = $("#conIframe")[0].contentWindow;
                        childWindow.load1(url);
                    };
                }
                document.body.appendChild(iframe);
            }
        }
    }

    function loadAvatar() {
        var json={};
        json.ASD=jsonASD;
        json.tableName="ess16";
        json.user_id=user_id;
        getAjax({
            url: getUserAvatarUrl, data: JSON.stringify(json), callback: function (reg) {
                var avatar="img/icon/home_nav_header_default26.png";
                if (reg.resultCode=='200'){
                    var list=reg.resultData;
                    if (list.length!=0&&list[0].avatar!=undefined&&list[0].avatar!=""&&list[0].avatar!=null){
                        avatar=JSON.parse(list[0].avatar).folder+"/"+JSON.parse(list[0].avatar).newName;
                    }
                }
                $("#avatar").attr("src",avatar);
            }
        });
    }

    layui.use(['upload'], function() {
        var upload=layui.upload;
        upload.render({
            elem: '#avatar'
            ,url: uploadFileUrl
            ,auto: false
            ,accept:'imgs'
            ,exts:'jpg|png'
            ,before:function (obj) {
                layer.msg('loading...', {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                });
                this.data={'ASD':JSON.stringify(jsonASD),'filePath':'avatar'};
            }
            , choose:function (obj) {
                obj.preview(function(index, file, result){
                    var size = file.size;
                    if (size/1024>70){
                        layer.close(layer.msg());
                        layer.msg("文件大小不能超过70kb！当前文件"+size/1024+"kb", {offset: '200px'});
                        return false;
                    }else {
                        obj.upload(index, file);
                    }
                });
            }
            ,done: function(res){
                layer.close(layer.msg());
                if(res.resultCode=="200"){
                    var json={};
                    json.ASD=jsonASD;
                    json.tableName="ess16";
                    json.user_id=user_id;
                    // json.avatar="avatar/"+res.fileName;
                    json.avatar=JSON.stringify(res.filejson);
                    getAjax({
                        url: updateUserAvatarUrl, data: JSON.stringify(json), callback: function (reg) {

                        }
                    });
                }
                loadAvatar();
            }
        });
    });

    //打开addtab标签
    function openContentPage(title,page,url) {
        if($('#conIframe').attr('src')=="<%=basePath%>loadJsp?page=content"){
            var childWindow = $("#conIframe")[0].contentWindow;
            childWindow.load1(url);
            childWindow.openTitlePage(title,page);
        }else {
            $('#conIframe').attr('src', '<%=basePath%>loadJsp?page=content');
            var iframe = document.getElementById("conIframe");

            if (iframe.attachEvent){
                iframe.attachEvent("onload", function(){ // IE
                    //调用子页面的方法.
                    var childWindow = $("#conIframe")[0].contentWindow;
                    childWindow.load1(url);
                    childWindow.openTitlePage(title,page);
                });
            } else {
                iframe.onload = function(){ // 非IE
                    //调用子页面的方法.
                    var childWindow = $("#conIframe")[0].contentWindow;
                    childWindow.load1(url);
                    childWindow.openTitlePage(title,page);
                };
            }
            document.body.appendChild(iframe);
        }
    }

    function loadNote() {
        var json={};
        json.ASD=jsonASD;
        json.tableName="ess47";
        json.user_id=user_id;
        getAjax({
            url: getUserNoteUrl, data: JSON.stringify(json), callback: function (reg) {
                if (reg.resultCode=='200'&&reg.resultData.length>0){
                    $("#prompt").css("display","block");
                }else {
                    $("#prompt").css("display","none");
                }
            }
        });
        //每5分钟刷新一次
        setTimeout("loadNote()",1000*60*5);
    }
</script>
</html>
