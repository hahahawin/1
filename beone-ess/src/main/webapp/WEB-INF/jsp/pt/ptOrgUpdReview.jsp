<%--
    倪杨
    2019-10-18
    修改审批页面
--%>
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
    <title></title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
    <jsp:include page="../introduce/table.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=basePath%>css/table.css">
    <script type="text/javascript" src="<%=basePath%>js/pt/ptOrgUpdReview.js"></script>

    <script>
        var jsonASD=getJsonASD();
        var tableName="ess6";

        var status="";//添加修改是否成功的状态，默认是空

        var loadUrl=getBeonePath("ESS")+"pt/orgEditList";
        var insertUrl= getBeonePath("ESS")+"common/insert";
        var updateUrl= getBeonePath("ESS")+"common/update";
        var deleteUrl= getBeonePath("ESS")+"common/delete";

        var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

        var ptFindCode="XTGL_JYGL_XDGL_CX"; //分页查询code
        var insertCode="XTGL_JYGL_XDGL_ADD"; //新增code
        var deleteCode="XTGL_JYGL_XDGL_DEL"; //删除code
        var updateCode="XTGL_JYGL_XDGL_EDIT"; //修改code

    </script>
</head>

<body>
<%--table--%>
<table id="conTable" lay-filter="conTable"></table>

<%--table头部--%>
<script type="text/html" id="toolHead">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="org_name" type="text" placeholder="组织名称" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
        </div>
    </div>
</script>


<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenId">
        <div class="layui-form-item">
            <label class="layui-form-label">学段代码</label>
            <div class="layui-input-block">
                <%--<input type="hidden" title="学段代码" lay-verify="required|special" autocomplete="off" class="layui-input">--%>
                <select id="XDDM" NAME="DM" lay-verify="required|unique" title="学段代码">

                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">学段名称</label>
            <div class="layui-input-block">
                <input type="text" NAME="MC" lay-verify="required|special|unique" autocomplete="off" class="layui-input" title="学段名称">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">学段简称</label>
            <div class="layui-input-block">
                <input type="text" NAME="JC" lay-verify="required|special|unique" autocomplete="off" class="layui-input" title="学段名称">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">入学年龄</label>
            <div class="layui-input-block">
                <input type="text" NAME="RXNL" lay-verify="required|special|positiveInteger" autocomplete="off" class="layui-input" title="入学年龄">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">学制(年)</label>
            <div class="layui-input-block">
                <input type="text" NAME="XNS" lay-verify="required|special|positiveInteger" autocomplete="off" class="layui-input" title="学制">
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
        <button style="display: none;" id="formSubmit1" class="layui-btn" lay-submit lay-filter="formSubmit1">存为草稿</button>
    </form>
</div>


</body>

<script></script>

</html>