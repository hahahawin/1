<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
<head>
    <meta charset="UTF-8">
    <title>原件绑定</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8" />
    <jsp:include page="../introduce/table.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=basePath%>css/table.css">
    <script type="text/javascript" src="<%=basePath%>js/zcsb/yjbd.js"></script>
    <script type='text/javascript' src="<%=basePath%>js/page.js"></script>
    <style>
        #sbmbPage .layui-table-cell{height: 28px;}
        #sbmbPage2 .layui-table-cell{height: 28px;}
        #Example2 {
            width: 100%;
            height: 500px;
        }
    </style>
    <script>
        var jsonASD = getJsonASD();
        var tableName = "ess28"; //资产单品表
        // 元件列表路径
        var yjListUrl = getBeonePath("BCCA")+"sbInter/sbyjlist";
        //设备列表查询路径
        var sblistUrl = getBeonePath("BCCA")+"common/findOnPage";
        var sbBindUrl = getBeonePath("BCCA")+"sbInter/bindSbToYj";
        var bondlistUrl = getBeonePath("BCCA")+"sbInter/bondlist";
        var unbondDevUrl = getBeonePath("BCCA")+"sbInter/unbondDev";
        //获取原件类型路径
        var yjlxUrl = getBeonePath("BCCA")+"sbInter/sbyjlxTree";

        var ptFindCode="ZCSB_3DKSH_YJBD"; //分页查询code

        var jsonRows ; //json数据
        var d3url = "";
        var bodyWidth = 0 ; //窗口宽度大小
        var c_yj_id = "";

        function chaxun(){
            $('#pager').pageInit(getList); //设置分页
        }

        function chongzhi(){
            $("#yj_mc").val('');
            $("#yjlx_id").val('');
            $("#yjlx_mc").val('');
            $("[name='only_bond']:checkbox").prop("checked", false);
            layui.form.render();
            $('#pager').pageInit(getList); //设置分页
        }
    </script>
</head>

<body>
<div class="operationTableTool" style="margin:10px auto 0 20px;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm">
    <div class="layui-form-item">
        <div class="layui-inline">
            <div class="layui-input-inline" style="width: 150px;">
                <input name="yj_mc" id="yj_mc" type="text" placeholder="原件名称" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-inline">
            <div class="layui-input-inline" style="width: 150px;">
                <input name="yjlx_mc" id="yjlx_mc" type="text"  placeholder="原件类型" readonly="readonly" onclick="selYjlx();" style="width:150px;" class="layui-input" />
                <input type="hidden" name="yjlx_id" id="yjlx_id" />
            </div>
        </div>
        <div class="layui-inline">
            <div class="layui-input-inline" style="width: 150px;">
                <input type="checkbox" name="only_bond" id="only_bond" lay-skin="primary" value="1">已绑定
            </div>
        </div>
    </div>
    </form>
    <div class="layui-btn-container">
        <button class="layui-btn layui-btn-sm" onclick="chaxun();"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
        <button class="layui-btn layui-btn-sm" onclick="chongzhi();"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
    </div>

</div>
<!--内容部分-->
<div class="wrap1" style="overflow-y: auto;min-width: 1150px;">
    <!--图片部分-->
    <div class="layui-container" id="myyj_table" style="background:rgba(255,255,255,1);min-width: 1150px;margin: 0px auto 0px auto;">

    </div>
    <!--分页导航-->
    <div id="pager" style="height: 35px;margin-top: 15px; margin-bottom: 15px;margin-right: 25px;"></div>
</div>

<%--绑定设备table头部--%>
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
                    <input id="LB" type="text" placeholder="设备类别" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
        </div>
    </div>
</script>
<%--绑定设备table页面--%>
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

<%--解绑设备table头部--%>
<script type="text/html" id="toolbarConfig2">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="MC2" type="text" placeholder="设备名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="XLH2" type="text" placeholder="设备序号" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="LB2" type="text" placeholder="设备类别" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig2"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset2"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
        </div>
    </div>
</script>
<%--解绑设备table页面--%>
<div id="sbmbPage2" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:10px;">
        <form id="authUserForm2" class="layui-form" action="" lay-filter="authMenuForm2">
            <div class="layui-row layui-col-space20" style="">
                <div class="layui-col-xs12" style="height: 100%;padding: 5px;">
                    <table id="sbmbTable2" lay-filter="sbmbTable2"></table>
                </div>
            </div>
        </form>
    </div>
</div>

<div id="photoPage" style="display: none;">
    <iframe id="Example2" class="card" title="Example2" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" srcdoc=''></iframe>
</div>

<div id="detailModal" style="display: none;">
    <div class="layui-row" style="height: 100%;background-color: #EAE8E8;">
        <div id="treeview1" style="max-width: 400px; height: calc(100% - 10px); overflow: auto;background-color:white;border:1px solid #F7F7F7;"></div>
    </div>
</div>

</body>
<script>

</script>
</html>