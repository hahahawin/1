<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
    <head>
        <meta charset="UTF-8">
        <title>模式管理</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/zcsb/msgl.js"></script>
        <style>
            .layui-form-checked[lay-skin=primary] i{background: none;color: #439CF4;border-color: #439cf4 !important;}
            .layui-form-checked, .layui-form-checked:hover{border-color:#439CF4}
            .layui-form-checked[lay-skin=primary2] i{}
            #sbBindPage .layui-table-cell{height: 28px;}
            #sbBindPage .layui-table-view .layui-form-radio{
                line-height: 28px;
            }
        </style>
        <script>
            var jsonASD = getJsonASD();
            var tableName="ess40";
            var tableName2="ess20";
            var tableName3 = "ess211";
            var tableName4 = "ess24";
            var lx = '';
            var status="";
            var pdatas = [];
            var account = '';
            var loadConfigUrl=getBeonePath("BCCA")+"common/findOnPage";
            var selMslistUrl=getBeonePath("BCCA")+"zcsb/selMslistOnPage";
            var insertConfigUrl= getBeonePath("BCCA")+"common/insert";
            var updateConfigUrl= getBeonePath("BCCA")+"common/update";
            var deleteConfigUrl= getBeonePath("BCCA")+"zcsb/deleteMsxx";
            var uniqueUrl= getBeonePath("BCCA")+"common/unique"; //唯一性验证
            var selMsSblistUrl = getBeonePath("BCCA")+"zcsb/selMsSblistOnPage";
            var setMsmlUrl = getBeonePath("BCCA")+"zcsb/setMsml";
            var selFjxxUrl=getBeonePath("BCCA")+"zcsb/findFjxxOnPage";
            var msControlUrl=getBeonePath("BCCA")+"zcsb/msControl";
            var loadAccountUrl = getBeonePath("ESS")+"common/findOnPage";
            var loadCommonUrl = getBeonePath("ESS")+"common/find";
            var loadWebMbUrl = getBeonePath("ESS")+"zcsb/selSblxMb";

            var ptFindCode="ZCSB_ZKGL_MSGL_CX"; //分页查询code
            var insertCode="ZCSB_ZKGL_MSGL_ADD"; //新增code
            var deleteCode="ZCSB_ZKGL_MSGL_DEL"; //删除code
            var updateCode="ZCSB_ZKGL_MSGL_EDIT"; //修改code
            var setmlCode="ZCSB_ZKGL_MSGL_SZML"; //命令设置
            var msControlCode="ZCSB_ZKGL_MSGL_TYQY"; //控制
            var tyqyCode="ZCSB_ZKGL_MSGL_TYQY"; //停用启用code

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
                    <input name="NAME" id="NAME2" type="text" placeholder="模式名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select NAME="LX" id="LX2" title="模式类型" lay-verify="required" autocomplete="off" class="layui-input">
                        <option value="">-- 请选择模式类型 --</option>
                        <option value="1">楼宇模式</option>
                        <option value="2">楼层模式</option>
                        <option value="3">房间模式</option>
                        <option value="9">账户模式</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{#  if(hasRight("ZCSB_ZKGL_MSGL_ADD")){ }}
            <%--<button class="layui-btn layui-btn-sm" lay-event="addConfig"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>--%>
            {{#  } }}

        </div>
    </div>
</script>

<%--添加修改的table页面--%>
<div id="CONFIG" class="operationModle" style="display: none;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>模式名称</label>
            <div class="layui-input-block">
                <input type="text" NAME="NAME" title="模式名称" lay-verify="required|special|unique" autocomplete="off" maxlength="10" class="layui-input">
                <input type="hidden" id="ID">
                <input type="hidden" id="YID">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>模式类型</label>
            <div class="layui-input-block">
                <select NAME="LX" id="LX" title="模式类型" lay-verify="required" autocomplete="off" lay-filter="LX" class="layui-input">
                    <option value="">-- 请选择 --</option>
                    <option value="1">楼宇模式</option>
                    <option value="2">楼层模式</option>
                    <option value="3">房间模式</option>
                    <option value="9">账户模式</option>
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>所属账户</label>
            <div class="layui-input-block">
                <select NAME="ACCOUNT" id="ACCOUNT2" title="所属账户" lay-verify="required" autocomplete="off" lay-filter="ACCOUNT" class="layui-input">
                    <option value="">-- 请选择 --</option>
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>类型选择</label>
            <div class="layui-input-block">
                <input type="hidden" NAME="LXID" ID="LXID">
                <input type="text" NAME="LXNAME" ID="LXNAME" title="类型选择" lay-verify="required" autocomplete="off" readonly="readonly" onclick="selMslxId();" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">模式说明</label>
            <div class="layui-input-block">
                <input type="text" NAME="ATTR_1" title="模式说明" lay-verify="special" autocomplete="off" maxlength="30" class="layui-input">
            </div>
        </div>

        <button style="display: none;" id="addConfigSub" class="layui-btn" lay-submit lay-filter="addConfigSub">新增</button>
    </form>
</div>
<%--模式类型选择table页面--%>
<div id="sbBindPage" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:5px;">
        <form id="authUserForm" class="layui-form" action="" lay-filter="authMenuForm">
            <div class="layui-row layui-col-space20" style="">
                <div class="layui-col-xs12" style="height: 100%;">
                    <table id="sblistTable" lay-filter="sblistTable"></table>
                </div>
            </div>
        </form>
    </div>
</div>

<script type="text/html" id="toolbarUser1">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 500px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 120px;">
                    <input id="JZWMC" type="text" placeholder="楼宇名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxunsblist1"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="resetsblist1"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chooseSbxx"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;选择</a>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="toolbarUser2">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 500px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 120px;">
                    <input id="BH" type="text" placeholder="楼层编号/名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxunsblist1"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="resetsblist1"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chooseSbxx"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;选择</a>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="toolbarUser3">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 500px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 120px;">
                    <input id="FJXX_MC" type="text" placeholder="房间名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxunsblist1"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="resetsblist1"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chooseSbxx"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;选择</a>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="toolbarUser4">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 500px;">
            <%--<div class="layui-inline">--%>
                <%--<div class="layui-input-inline" style="width: 120px;">--%>
                    <%--<input id="ACCOUNT" type="text" placeholder="账户信息" autocomplete="off" class="layui-input">--%>
                <%--</div>--%>
            <%--</div>--%>
            <%--<div class="layui-inline">--%>
                <%--<button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxunsblist1"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>--%>
                <%--<button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="resetsblist1"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>--%>
            <%--</div>--%>
            <div class="layui-inline">
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chooseSbxx"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;选择</a>
            </div>
        </div>
    </div>
</script>

<%--模式命令设置弹窗--%>
<div id="msmlsetPage" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:5px;">
        <form id="msmlSetForm" class="layui-form" action="" lay-filter="authMenuForm">
            <div class="layui-row" style="height: 140px;">
                <div class="container-fluid device_control">

                </div>
                <div class="container-fluid" style="text-align: right;">
                    <a id="formSub" class="layui-btn layui-btn-xs" style="background-color: #1E9FFF;" onclick="msmltj();">保存</a>
                </div>
            </div>
            <div class="layui-row layui-col-space20" style="margin-top: 1px;">
                <div class="layui-col-xs12" style="height: 100%;padding: 2px;">
                    <table id="mssblistTable" lay-filter="mssblistTable"></table>
                </div>
            </div>
        </form>
    </div>
</div>

<%--模式设备列表表头--%>
<script type="text/html" id="sbToolbar">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 500px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 120px;">
                    <input id="MAC2" type="text" placeholder="设备MAC" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 120px;">
                    <input id="MC2" type="text" placeholder="设备名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxunsblist2"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="resetsblist2"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="barConfig">
    <div class="bar">
        <a  title="添加命令" lay-event="add"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_sb.png"></a>
    </div>
</script>

<%--模板页面弹窗--%>
<div id="sblxMbWin" style="display: none;">
    <iframe id="Example2" style="width: 100%;height: 100%;" class="card" title="Example2" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" srcdoc=''></iframe>
</div>
</body>

<script>



</script>

</html>