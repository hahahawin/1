<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
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
    /*.zhfsDiv{
        width: 100%;
        margin-top: 15px;
    }
    .zhfsDiv select{
        width:340px;
        height:44px;
        font-size:12px;
        color:#68727A;
        padding-left: 8px;
        border-radius:4px;
        border:1px solid rgba(202,202,202,1);
    }
    option{
        padding-top:20px;
        padding-bottom:20px;
    }
    .yzmDiv{
        width: 100%;
        margin-top: 15px;
    }
    .yzmDiv .yzm{
        width:230px;
        height:44px;
        font-size:12px;
        color:#68727A;
        padding-left: 8px;
        border-radius:4px;
        border:1px solid rgba(202,202,202,1);
    }
    .yzmDiv .yzmbutton{
        height:40px;
        border:0px;
        margin-left: 20px;
        border-radius:4px;
        background:rgba(75,162,249,1);
        color: #FFFFFF;
        font-size: 14px;
    }
    .sxbDiv{
        margin-top: 15px;
        padding-left: 80px;
        padding-right: 80px;
    }
    .sxbDiv .button{
        height:40px;
        border:0px;
        border-radius:4px;
        background:rgba(75,162,249,1);
        color: #FFFFFF;
        padding-left: 10px;
        padding-right: 10px;
        font-size: 14px;
    }*/
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
<div class="login_content">
    <div class="login_title"></div>
    <div class="login_con" id="loginDiv">
        <div class="dlzh">账号登录</div>
        <div><input class="account" type="text" name="user_account" id="user_account" lay-verify="user_account" placeholder="登录账号" /></div>
        <div><input class="password" type="password" name="user_password" id="user_password" lay-verify="user_password" placeholder="密码" /></div>
        <div class="wjmmline">
            <span style="width:55px;margin-left: 270px;cursor:pointer;" onclick="showWjmmDiv()">忘记密码</span>
        </div>
        <input type="hidden" name="user_type" id="user_type" value="5"/>
        <input type="hidden" name="bslx" id="bslx" value="0"/>
        <input type="hidden" name="log_type" id="log_type" value="web"/>
        <button class="loginButton" onclick="login()">登录</button>
    </div>
    <%--<div class="login_con" id="wjmmDiv" style="display: none;">
        <div class="dlzh">忘记密码</div>
        <div><input class="account" type="text" name="user_account" id="user_account2" placeholder="请输入账号" /></div>
        <div class="zhfsDiv">
            <select name="city">
                <option value=""> 请选择找回方式</option>
                <option value="1"> 手机短信</option>
            </select>
        </div>
        <div class="yzmDiv">
            <input class="yzm" type="text" name="user_account" placeholder="请输入验证码" />
            <input class="yzmbutton" type="button" value="获取验证码">
        </div>
        <div class="sxbDiv">
            <input class="button" style="float: left;" type="button" onclick="prev_step();" value="上一步">
            <input class="button" style="float: right" type="button" onclick="next_step();" value="下一步">
        </div>
    </div>
    <div class="login_con" id="mmszDiv" style="display: none;">
        <div class="dlzh">设置密码</div>
        <div><input class="password" type="password" name="user_password" placeholder="请输入密码" /></div>
        <div><input class="password" type="password" name="user_password" placeholder="请再次输入密码" /></div>
        <button class="loginButton" onclick="baocun()">保存</button>
    </div>--%>
</div>
<div class="foot_div">
    重庆金鑫智慧科技有限公司 ©2019-2020版权所有 BETA V3.3 TEL:400-000-3877
</div>
<script>
$(function () {
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
