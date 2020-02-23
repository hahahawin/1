<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";

%>
<html>
<head>
    <meta charset="UTF-8">
    <title>设备日志</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8" />
    <jsp:include page="../introduce/table.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=basePath%>css/table.css">
    <script type="text/javascript" src="<%=basePath%>js/sys/bccaBizLogJs.js"></script>

    <script>
        var jsonASD=getJsonASD();
        var tableName="ess29";
        var logTypes = {};
        var loadBizLogUrl=getBeonePath("ESS")+"common/findOnPage";
        var ptFindCode="1"; //分页查询code
    </script>

</head>

<body>
<%--table--%>
<table id="bizLog" lay-filter="bizLog"></table>

<%--table头部--%>
<script type="text/html" id="toolbarBizLog">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="TYPE" lay-verify="required">
                        <option value="">请选择日志类型</option>
                        <option value="1">添加</option>
                        <option value="2">编辑</option>
                        <option value="3">删除</option>
                        <option value="4">控制</option>
                        <option value="9">其他</option>
                    </select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="ZT" lay-verify="required">

                    </select>
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findBizLog"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
        </div>
    </div>
</script>

</body>

</html>