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
        background:url(<%=basePath%>img/error/error_img401.png) no-repeat center center;
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
        margin-top: 43px;
        font-size:36px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(68,68,68,1);
        line-height:36px;
        text-shadow:0px 7px 98px rgba(145,34,0,0.4);
    }
    .content3 {
        height:18px;
        font-size:18px;
        margin-top: 18px;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(153,153,153,1);
        text-shadow:0px 7px 98px rgba(145,34,0,0.4);
    }
    .content4 {
        width:451px;
        height:13px;
        margin-top: 20px;
        font-size:14px;
        font-family:Arial;
        font-weight:400;
        color:rgba(184,184,184,1);
        text-shadow:0px 7px 98px rgba(145,34,0,0.4);
    }
</style>
<script>

</script>

<body>
<div class="content">
    <div class="content_left">
        <div class="content1">401</div>
        <div class="content2">你未被授权，没有操作权限~</div>
        <div class="content3">可以先联系售后开通权限，联系方式如下：</div>
        <div class="content4">tel:400-000-3877 qq:2380108791 EMAII:2380108791@qq.com</div>
    </div>
    <div class="content_right"></div>
</div>
</body>
</html>
