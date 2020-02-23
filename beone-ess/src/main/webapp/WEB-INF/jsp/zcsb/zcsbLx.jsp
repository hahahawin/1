<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
    <head>
        <meta charset="UTF-8">
        <title>设备类型</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/zcsb/zcsbLx.js"></script>

        <script>
            var jsonASD = getJsonASD();
            var tableName="ess25";
            var status="";
            var c_mldm = '';
            var sbzc_lx_id = '';

            var loadConfigUrl=getBeonePath("ESS")+"common/findOnPage";
            var syncConfigUrl= getBeonePath("ESS")+"zcsb/syncLx";
            var updateConfigUrl= getBeonePath("ESS")+"common/update";
            var deleteConfigUrl= getBeonePath("ESS")+"common/delete";
            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证
            var mblistUrl = getBeonePath("ESS")+"zcsb/getMblist";
            var setMrmbUrl = getBeonePath("ESS")+"zcsb/setMrmb";

            var ptFindCode="ZCSB_ZKGL_LXGL_CX"; //分页查询code
            var syncCode="ZCSB_ZKGL_LXGL_SYNC"; //同步code
            var setMdCode="ZCSB_ZKGL_LXGL_MBSZ"; //模板设置
            var tyqyCode="ZCSB_ZKGL_LXGL_TYQY"; //停用启用

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
                    <input id="MLMC" type="text" placeholder="类型名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="MLDM" type="text" placeholder="类型代码" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{#  if(hasRight("ZCSB_ZKGL_LXGL_ADD")){ }}
            <button class="layui-btn layui-btn-sm" lay-event="addConfig"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;同步</button>
            {{#  } }}
        </div>
    </div>
</script>

<%--&lt;%&ndash;table记录操作按钮&ndash;%&gt;--%>
<%--<script type="text/html" id="barConfig">--%>
    <%--<div class="bar">--%>
        <%--<a  title="模板设置" lay-event="selMb"><img src="../img/icon/cz_icon_del.png"></a>--%>
        <%--<a  title="停用启用" lay-event="tyqy"><img src="../img/icon/cz_icon_del.png"></a>--%>
    <%--</div>--%>
<%--</script>--%>

<%--添加修改的table页面--%>
<div id="sbmbPage" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:10px;">
        <form id="authUserForm" class="layui-form" action="" lay-filter="authMenuForm">
            <div class="layui-row layui-col-space20" style="">
                <div class="layui-col-xs12" style="height: 100%;padding: 5px;">
                    <table id="sbmbTable" lay-filter="sbmbTable"></table>
                </div>
            </div>
        </form>
    </div>
</div>

<%--模板操作--%>
<script type="text/html" id="barMbConfig">
    <div class="bar">
        <a  title="查看" lay-event="detail"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_ck.png"></a>
        <a  title="模板设置" lay-event="setMb"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_sb.png"></a>
    </div>
</script>

<div id="photoPage" style="display: none;">
    <img src="" id="mbsrc" style="width:100%;" />
</div>

</body>

<script></script>

</html>