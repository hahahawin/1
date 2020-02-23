<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
    <head>
        <meta charset="UTF-8">
        <title>房间管理</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/zcsb/zcsbFjxx.js"></script>
        <style>
            #sbBindPage .layui-table-cell{height: 28px;}
        </style>
        <script>
            var jsonASD = getJsonASD();
            var tableName="ess22";
            var tableName2 = "ess20";
            var tableName3 = "ess21";
            var status="";

            var loadConfigUrl=getBeonePath("BCCA")+"zcsb/findFjxxOnPage";
            var insertConfigUrl= getBeonePath("BCCA")+"common/insert";
            var updateConfigUrl= getBeonePath("BCCA")+"common/update";
            var deleteConfigUrl= getBeonePath("BCCA")+"common/delete";
            var uniqueUrl= getBeonePath("BCCA")+"zcsb/uniqueLcFjxx"; //唯一性验证
            var loadselectUrl = getBeonePath("BCCA")+"common/find"; //加载楼宇楼层信息下拉框
            var sbBindlistUrl= getBeonePath("BCCA")+"zcsb/selBindSblist";
            var sbNotBindlistUrl= getBeonePath("BCCA")+"zcsb/selNotBindSblist";
            var sbBindUrl = getBeonePath("BCCA")+"zcsb/sbBinding";
            var unBindUrl = getBeonePath("BCCA")+"zcsb/sbUnBind";

            var ptFindCode="1"; //分页查询code
            var insertCode="ZCSB_LYGL_FJXX_ADD"; //新增code
            var deleteCode="ZCSB_LYGL_FJXX_DEL"; //删除code
            var updateCode="ZCSB_LYGL_FJXX_EDIT"; //修改code
            var tyqyCode="ZCSB_LYGL_FJXX_TYQY"; //停用启用code
            var sbBindCode="ZCSB_LYGL_FJXX_SBBD"; //设备绑定
        </script>
    </head>
    
<body>
<%--table--%>
<table id="config" lay-filter="config"></table>


<%--table头部--%>
<script type="text/html" id="toolbarConfig">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="jzw_id" lay-verify="required" lay-filter="jzw_id"></select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="lc_id" lay-verify="required"></select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="mc" type="text" placeholder="房间名称" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{#  if(hasRight("ZCSB_LYGL_FJXX_ADD")){ }}
            <button class="layui-btn layui-btn-sm" lay-event="addConfig"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{#  } }}

        </div>
    </div>
</script>

<%--添加修改的table页面--%>
<div id="CONFIG" class="operationModle" style="display: none;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>楼宇名称</label>
            <div class="layui-input-block">
                <select id="jzw_id2" name="jzw_id" lay-verify="required" autocomplete="off" class="layui-input" lay-filter="jzw_id2"></select>
                <input type="hidden" id="id">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>楼层编号</label>
            <div class="layui-input-block">
                <select id="lc_id2" name="lc_id" lay-verify="required" autocomplete="off" class="layui-input"></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>房间编号</label>
            <div class="layui-input-block">
                <input type="text" NAME="bh" title="房间编号" lay-verify="required|codeNo" maxlength="10" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>房间名称</label>
            <div class="layui-input-block">
                <input type="text" NAME="mc" title="房间数" lay-verify="required|special|unique" maxlength="10" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">房间说明</label>
            <div class="layui-input-block">
                <input type="text" NAME="fjsm" title="房间说明" lay-verify="special" maxlength="50" autocomplete="off" class="layui-input">
            </div>
        </div>

        <button style="display: none;" id="addConfigSub" class="layui-btn" lay-submit lay-filter="addConfigSub">新增</button>
    </form>
</div>

<%--设备绑定table页面--%>
<div id="sbBindPage" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:5px;">
        <form id="authUserForm" class="layui-form" action="" lay-filter="authMenuForm">
            <div class="layui-row layui-col-space20" style="">
                <div class="layui-col-xs6" style="height: 100%;padding: 2px;">
                    <table id="sblistTable" lay-filter="sblistTable"></table>
                </div>
                <div class="layui-col-xs6" style="height: 100%;padding: 2px;">
                    <table id="notsblistTable" lay-filter="notsblistTable"></table>
                </div>
            </div>
        </form>
    </div>
</div>
<script type="text/html" id="toolbarUser1">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 500px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 110px;">
                    <input id="mac" type="text" placeholder="设备MAC" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 110px;">
                    <input id="sbmc" type="text" placeholder="设备名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxunsblist1"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="resetsblist1"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="removeSbxx"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;解绑</a>
            </div>
        </div>
    </div>
</script>
<script type="text/html" id="toolbarUser2">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 500px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 110px;">
                    <input id="mac2" type="text" placeholder="设备MAC" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 110px;">
                    <input id="sbmc2" type="text" placeholder="设备名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxunsblist2"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="resetsblist2"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="addSbxx"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;绑定</a>
            </div>
        </div>
    </div>
</script>

</body>

<script></script>

</html>