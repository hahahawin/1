<%--
  倪杨
  便签管理
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
        <script type="text/javascript" src="<%=basePath%>js/jcbg/bqgl_dh.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess47";

            var status="";//添加修改是否成功的状态，默认是空

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";
            var findNoteUrl= getBeonePath("ESS")+"jcbg/findNowDateNote";

            var ptFindCode="JCBG_RCBG_BQGL_CX"; //分页查询code
            var insertCode="JCBG_RCBG_BQGL_ADD"; //新增code
            var deleteCode="JCBG_RCBG_BQGL_DEL"; //删除code
            var updateCode="JCBG_RCBG_BQGL_EDIT"; //修改code
            var zfCode="JCBG_RCBG_BQGL_ZF"; //作废code
        </script>
        <style>
            .detailForm .layui-input-block{min-height: 26px;line-height: 26px;}
        </style>
    </head>
    
<body>
<%--table--%>
<table id="conTable" lay-filter="conTable"></table>

<%--详情页面--%>
<div id="CONFIGDETAIL" class="detailForm" style="display: none;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm" style="">
        <div class="layui-form-item">
            <div class="layui-col-md12">
                <label class="layui-form-label">标题</label>
                <div class="layui-input-block">
                    <div name="BT" style="margin-top: 3px;"></div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md12">
                <label class="layui-form-label">提醒时间</label>
                <div class="layui-input-block">
                    <div name="TXSJ" style="margin-top: 3px;"></div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md12">
                <label class="layui-form-label">状态</label>
                <div class="layui-input-block">
                    <div name="ZT" style="margin-top: 3px;"></div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md12">
                <label class="layui-form-label">便签内容</label>
                <div class="layui-input-block">
                    <div name="BQNR" style="margin-top: 3px;"></div>
                </div>
            </div>
        </div>
    </form>
</div>

</body>

<script></script>

</html>