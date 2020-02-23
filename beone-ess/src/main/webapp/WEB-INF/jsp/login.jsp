<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
    <meta http-equiv="pragma" content="no-cache">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <title>APCOS智慧教育服务授权管理云平台</title>
    <link rel="shortcut icon" href="<%=basePath%>img/jx.png" />
    <link rel="stylesheet" href="<%=basePath%>css/login.css" type="text/css" media="screen" />
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <script src="<%=basePath%>layui/layui.js" charset="utf-8"></script>
    <script src="<%=basePath%>js/login.js" charset="utf-8"></script>

</head>
<style>
    a{
        color: #FFFFFF;
        text-decoration:none;
    }
</style>
<script>
    var loginUrl="<%=basePath%>login_in";    //登陆验证
    var jumpPageUrl="<%=basePath%>index";    //后台首页
    var orgRegistUrl = "<%=basePath%>orgRegister?opentype=1"; //组织组成页面
    $(window).keydown(function(event){
        if(event.keyCode == 13){
            event.returnValue=false;
            event.cancel = true;
            login();
        }
    });
    //弹出注册页面
    function openRegistPage(){
        layer.open({
            type: 2,
            area:['1000px','600px'],//定义宽和高
            fixed: false, //不固定
            maxmin: true,
            shadeClose: true,
            title:'授权申请',
            content: orgRegistUrl
        });
    }
    function OnInput (event) {
        $(".inputtext").css('background','#1B2A56');
        $(".inputtext").css('color','#FFFFFF');
    }
    // Internet Explorer
    function OnPropChanged (event) {
        if (event.propertyName.toLowerCase () == "value") {
            alert ("The new co2ntent: " + event.srcElement.value);
        }
    }
</script>

<body>
<div class="head_div">
    <div class="head_div_line">
        <div style="float: left;">
            <img src="<%=basePath%>img/login/logo.png" style="width: 110px;height: 33px;">&nbsp;&nbsp;|&nbsp;&nbsp;APCOS智慧教育服务授权管理云平台
        </div>
        <div style="float: right;font-size: 12px;">
            APP下载&nbsp;&nbsp;|&nbsp;&nbsp;<a href="javascript:void(0);" onclick="openRegistPage();">授权申请</a>
        </div>
    </div>
</div>
<div class="content">
    <div class="login_content">
        <div class="content_left"></div>
        <div class="content_right">
            <div class="content_right_title">用户登录</div>
            <div class="account">
                <div class="imgUser"></div>
                <input class="inputtext" type="text" name="user_account" id="user_account" placeholder="登录账号" maxlength="20" oninput="OnInput (event)" onpropertychange="OnPropChanged (event)" autocomplete="off" />
            </div>
            <div class="password">
                <div class="imgMm"></div>
                <input class="inputtext2" type="password" name="user_password" id="user_password" placeholder="密码" maxlength="20" />
            </div>
            <input type="hidden" name="user_type" id="user_type" value="5"/>
            <input type="hidden" name="bslx" id="bslx" value="0"/>
            <input type="hidden" name="log_type" id="log_type" value="web"/>
            <div class="login_button" onclick="login()">登录</div>
            <div class="wjmm" onclick="showWjmmDiv()">忘记密码？</div>
        </div>
    </div>
</div>

<div class="foot_div">
    重庆金鑫智慧科技有限公司 ©2019-111111111dddddd1111222111版权所有 BETA V3.3 TEL:400-000-3877
</div>
<script>
$(function () {
    var height = $(document.body).height();
    $(".login_content").css("margin-top", (height-800)/2);

    window.onresize = function(){
        height = $(document.body).height();
        $(".login_content").css("margin-top", (height-800)/2);

    }
    layui.use(['layer', 'form'], function(){
        window.showWjmmDiv = function(){
            // $("#loginDiv").hide();
            // $("#wjmmDiv").show();
            window.location.href = "<%=basePath%>loadJsp?page=forgetPass";
        }

        /*window.prev_step = function(){
            $("#wjmmDiv").hide();
            $("#loginDiv").show();

        }
        window.next_step = function(){
            $("#wjmmDiv").hide();
            $("#mmszDiv").show();
        }
        window.baocun = function(){

        }*/
    });
});
</script>
</body>
</html>
