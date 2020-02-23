<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<html>
<head>
    <title>APCOS智慧教育服务授权管理平台</title>
    <link rel="shortcut icon" href="<%=basePath%>img/jx.png" />
    <script src="<%=basePath%>js/jquery.min.js"></script>

</head>
<style>
    .content {
        width: 1300px;
        height: 683px;
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        margin: auto;
    }
    .content_left {
        float: left;
        width: 560px;
        height: 683px;
    }
    .content_right {
        float: right;
        width: 734px;
        height: 683px;
        background:url(<%=basePath%>img/error/error_img404.png) no-repeat center center;
        background-size: 100% 100%;
    }
    .content1 {
        width:151px;
        height:67px;
        font-size:100px;
        font-family:Myriad Pro;
        font-weight:400;
        color:rgba(214,224,246,1);
        line-height:80px;
        margin-top: 235px;
    }
    .content2 {
        height:36px;
        margin-top: 40px;
        font-size:36px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(68,68,68,1);
        line-height:36px;
        text-shadow:0px 7px 98px rgba(145,34,0,0.4);
    }
    .content3 {
        width:425px;
        height:18px;
        margin-top: 18px;
        font-size:18px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(153,153,153,1);
        text-shadow:0px 7px 98px rgba(145,34,0,0.4);
    }
    .content4 {
        width:140px;
        height:36px;
        margin-top: 50px;
        background:rgba(135,183,251,1);
        border-radius:18px;
        text-align: center;
        line-height: 36px;
        color:rgba(255,254,254,1);
    }
</style>
<script>

</script>

<body>
<div class="content">
    <div class="content_left">
        <div class="content1">404</div>
        <div class="content2">地址输入错误，请重新输入地址~</div>
        <div class="content3">您可以先检查网址，然后重新输入或给我们反馈问题。</div>
        <div class="content4">反馈问题</div>
    </div>
    <div class="content_right"></div>
</div>
</body>
</html>
