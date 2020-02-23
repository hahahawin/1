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
        <title>班级公告</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/jcbg/bqgl.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess47";

            var status="";//添加修改是否成功的状态，默认是空

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

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

<%--table头部--%>
<script type="text/html" id="toolHead">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="bqZt"></select>
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("JCBG_RCBG_BQGL_ADD")){}}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{# }}}
        </div>
    </div>
</script>


<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenId">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>便签标题</label>
            <div class="layui-input-block">
                <input type="text" NAME="BT" lay-verify="required|special|unique" maxlength="25" autocomplete="off" class="layui-input" title="便签标题">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>提醒方式</label>
            <div class="layui-input-block">
                <select name="TXFS" id="TXFS" title="提醒方式" disabled></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>提醒时间</label>
            <div class="layui-input-block">
                <input type="text" id="TXSJ" NAME="TXSJ" lay-verify="required" autocomplete="off" class="layui-input" title="提醒时间">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>便签内容</label>
            <div class="layui-input-block">
                <input type="text" NAME="NR" lay-verify="required" maxlength="200" autocomplete="off" class="layui-input" title="便签内容">
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
    </form>
</div>

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