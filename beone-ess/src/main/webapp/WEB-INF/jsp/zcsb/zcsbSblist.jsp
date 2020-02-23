<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
    <head>
        <meta charset="UTF-8">
        <title>设备管理</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/zcsb/zcsbSblist.js"></script>

        <script>
            var jsonASD = getJsonASD();
            var tableName="ess27";
            var tableName2="ess25";
            var tableName3="ess27";
            var status="";

            var loadConfigUrl=getBeonePath("ESS")+"common/findOnPage";
            // var insertConfigUrl= getBeonePath("ESS")+"zcsb/insertSetting";
            var updateConfigUrl= getBeonePath("ESS")+"common/update";
            var deleteConfigUrl= getBeonePath("ESS")+"common/delete";
            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证
            var loadselectUrl = getBeonePath("ESS")+"common/find";
            var dingyueUrl = getBeonePath("ESS")+"zcsb/dySetting";
            var syncSbxxUrl = getBeonePath("ESS")+"zcsb/syncSbxx";
            var loadWebMbUrl = getBeonePath("ESS")+"zcsb/selSblxMb";
            var controlUrl = getBeonePath("ESS")+"zcsb/sbControl";
            var unbindUrl = getBeonePath("ESS")+"zcsb/unbind";

            var ptFindCode="ZCSB_ZKGL_SBGL_CX"; //分页查询code
            var tyqyCode="ZCSB_ZKGL_SBGL_TYQY"; //停用启用
            var controlCode = "ZCSB_ZKGL_SBGL_KZ";//控制
            var sbjbCode = "ZCSB_ZKGL_SBGL_SBJB";//解绑

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
                    <input id="MC" type="text" placeholder="设备名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="XLH" type="text" placeholder="设备序号" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="MAC" type="text" placeholder="设备MAC" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
        </div>
    </div>
</script>

<%--&lt;%&ndash;table记录操作按钮&ndash;%&gt;--%>
<%--<script type="text/html" id="barConfig">--%>
    <%--<div class="bar">--%>
        <%--<a  title="控制" lay-event="control"><img src="../img/icon/cz_icon_del.png"></a>--%>
    <%--</div>--%>
<%--</script>--%>

<%--添加修改的table页面--%>
<div id="sblxMbWin" style="display: none;">
    <iframe id="Example2" style="width: 100%;height: 100%;" class="card" title="Example2" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" srcdoc=''></iframe>
</div>

</body>

<script></script>

</html>