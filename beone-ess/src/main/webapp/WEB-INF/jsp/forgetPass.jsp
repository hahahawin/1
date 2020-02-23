<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
    ResourceBundle resource = ResourceBundle.getBundle("application");
    String ESS = resource.getString("ESS");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Beone智慧校园BCCA智控平台</title>
    <meta name="Content-Type" content="text/html; charset=UTF-8"/>
    <meta name="renderer" content="webkit">
    <meta name="generator" content="Bigtree"/>
    <link rel="shortcut icon" href="<%=basePath%>img/jx.png" />
    <script src="<%=basePath%>js/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" media="screen" href="<%=basePath%>layui/css/layui.css"/>
    <script src="<%=basePath%>layui/layui.js" charset="utf-8"></script>
    <%--滑动验证--%>
    <link rel="stylesheet" type="text/css" media="screen" href="<%=basePath%>css/Sliding.css"/>
    <script type='text/javascript' src='<%=basePath %>js/Sliding.js'></script>
    <script type="text/javascript" src="<%=basePath%>js/md5.js"></script>

    <style type="text/css">
        .forget_content{
            width: 70%;
            margin: 0 auto;
        }
        .forget_title{
            width: 100%;
            height: 100px;
            border-bottom: 1px solid #575757;
            line-height: 100px;
            padding-left: 20px;
        }
        .boot_div{
            bottom:5px;
            position:absolute;
            text-align:center;
            width:70%;
        }
        .boot_text{
            font-size:12px;
            color: #000000;
            font-family:Microsoft YaHei
        }
        .boot_top{
            margin-top:10px;
        }
        tr{
            height: 60px;
        }
    </style>


</head>

<body style="background-color: #f1f2f7;">
<div class="forget_content">
    <div class="forget_title">
        <%--<img style="width: 50px;height: 50px;" src="<%=basePath%>img/login/logo.png"/>--%>
        <span style="font-size: 24px;">APCOS智慧教育服务授权管理云平台</span>
    </div>
    <div class="main" style="width: 500px;margin: 50px auto">
        <form id="configForm" class="layui-form" action="">
            <div class="layui-form-item" style="text-align: center;font-size: 20px;">
                个人验证
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">用户账户</label>
                <div class="layui-input-block">
                    <input type="text" class="layui-input" id="user_account"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">验证</label>
                <div class="layui-input-block">
                    <div id="slider">
                        <div id="slider_bg"></div>
                        <span id="label">>></span> <span id="labelTip">拖动滑块验证</span>
                    </div>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">验证码</label>
                <div class="layui-input-block">
                    <div class="layui-input-inline" style="width: 200px;">
                        <input type="text" class="layui-input" id="verificationCode"/>
                    </div>
                    <div class="layui-input-inline" style="width: 140px;">
                        <input id="sendVer" type="button" class="layui-btn layui-btn-sm" style="margin-left: 20px" value="发送验证码" onclick="sendSlider()"/>
                    </div>
                </div>
            </div>
            <div class="layui-form-item" style="text-align: center;font-size: 20px;">
                <div>设置新密码</div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">新密码</label>
                <div class="layui-input-block">
                    <input type="password" class="layui-input" id="pass"/>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">重复密码</label>
                <div class="layui-input-block">
                    <input type="password" class="layui-input" id="newPass"/>
                </div>
            </div>
            <input style="margin-left:110px;width: calc(100% - 110px);" type="button" class="layui-btn" id="submit" onclick="setUserPassword()" value="提交"/>
        </form>
        <div style="text-align: right;margin-top: 10px;">
            <a href="<%=basePath%>login">去登录</a>
        </div>
    </div>
    <div class="boot_div">
        <div class="boot_text">
            重庆金鑫智慧科技有限公司 ©2019-2020版权所有 BETA V3.3 TEL:400-000-3877
        </div>
        <div class="boot_text boot_top">

        </div>
    </div>

</div>

</body>
<script>
    var ESS='<%=ESS%>';
    var isSlider=false;
    var verificationCode="";
    var waitTime = 60;
    var user_id = "";

    $(function () {
        layui.use(['layer', 'form'], function(){
            var form = layui.form,
                layer = layui.layer;

            window.sendSlider = function() {
                var user_account=$("#user_account").val();
                if(user_account == null || user_account == ''){
                    layer.msg("用户账户不能为空！", {offset: '200px'});
                    return false;
                }
                if(isSlider){
                    var json1 = {};
                    json1.user_account=user_account;
                    $.ajax({
                        type:"POST",
                        url:ESS+'sys/forgetNameFindTel',
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(json){
                            if(json.resultCode=='200'){
                                user_id = json.user_id;
                                verificationCode=json.verificationCode;
                                time();
                            }else{
                                layer.msg(json.resultMsg, {offset: '200px'});
                            }
                        },
                        error:function () {
                            layer.msg("失败，请检查网络是否正常！", {offset: '200px'});
                        }
                    });
                }else {
                    layer.msg("请先通过滑动验证！", {offset: '200px'});
                }
            }

            window.setUserPassword = function() {
                var verHtml = $("#verificationCode").val();
                if (verHtml==null||verHtml==""){
                    layer.msg("请输入验证码！", {offset: '200px'});
                    return false;
                }
                //2.判断手机验证码是否输入正确
                if(verificationCode!=verHtml){
                    layer.msg("手机验证码匹配失败！", {offset: '200px'});
                    return false;
                }
                var pass = $("#pass").val();
                var newPass = $("#newPass").val();
                if (pass==null||pass==""||newPass==null||newPass==""){
                    layer.msg("请输入密码！", {offset: '200px'});
                    return false;
                }
                //1.两次输入的密码是否一致
                if(pass!=newPass){
                    layer.msg("两次输入的密码不一致！", {offset: '200px'});
                    return false;
                }

                //3.重置密码
                // var user_account = $("#user_account").val();
                var password = hex_md5(pass).toUpperCase()
                var parm = {};
                parm.user_id=user_id;
                parm.password=password;
                $.ajax({
                    type:"POST",
                    url:ESS+'sys/forgetUserTelMatch',
                    async:false,
                    dataType:"json", //服务器返回数据的类型
                    contentType: 'application/json',
                    data:JSON.stringify(parm),
                    success:function(json){
                        if(json.resultCode=='200'){
                            layer.msg('密码重置成功', {offset: '200px'});
                            setTimeout(function() {
                                window.location.href=ESS;
                            }, 1000);
                        }else{
                            layer.msg(json.resultMsg, {offset: '200px'});
                        }
                    },
                    error:function () {
                        layer.msg("失败，请检查网络是否正常！", {offset: '200px'});
                    }
                });
            }
        });

        var slider = new SliderUnlock("#slider",{
            successLabelTip : "验证成功"
        },function(){
            isSlider=true;
        });
        slider.init();
    })

    function time() {
        if (waitTime == 0) {
            $("#sendVer").attr("disabled",false);
            $("#sendVer").val("发送验证码") ;
            waitTime = 60;// 恢复计时
        } else {
            $("#sendVer").attr("disabled",true);
            $("#sendVer").val(waitTime + "秒后可以重新发送");
            waitTime--;
            setTimeout(function() {
                time()// 关键处-定时循环调用
            }, 1000)
        }
    }



</script>
</html>
