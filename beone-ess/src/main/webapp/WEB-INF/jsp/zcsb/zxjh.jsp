<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
    <head>
        <meta charset="UTF-8">
        <title>执行计划</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/zcsb/zxjh.js"></script>
        <style>
            .oneCheck{width: 100%;height:18px;text-align: right;}
            .layui-form-checked[lay-skin=primary] i{background: none;color: #439CF4;border-color: #439cf4 !important;}
            .layui-form-checked, .layui-form-checked:hover{border-color:#439CF4}
            .layui-form-checked[lay-skin=primary2] i{}

            .layui-form-checkbox span{height: 25px;}
        </style>
        <script>
            var jsonASD = getJsonASD();
            var tableName="ess41";
            var tableName2="ess25";
            var tableName3="ess28";
            var tableName4="ess40"; //模式
            var tableName5 = "ess24";//设备账户
            var lx = '';
            var status="";
            var pdatas = [];
            var account = '';
            var tjcfz = {};
            var loadCommonUrl = getBeonePath("ESS")+"common/find";
            var loadConfigUrl=getBeonePath("BCCA")+"common/findOnPage";
            var insertConfigUrl= getBeonePath("BCCA")+"zcsb/insertZxjh";
            var updateConfigUrl= getBeonePath("BCCA")+"zcsb/updateZxjh";
            var deleteConfigUrl= getBeonePath("BCCA")+"zcsb/delZxjh";
            var uniqueUrl= getBeonePath("BCCA")+"common/unique"; //唯一性验证
            var selZxjhJclistUrl= getBeonePath("BCCA")+"zcsb/selZxjhJc"; //唯一性验证
            var findAll= getBeonePath("BCCA")+"common/find";
            var selAllMslistUrl= getBeonePath("BCCA")+"zcsb/selAllMslist"; //查询所有模式
            var selTjlxUrl= getBeonePath("BCCA")+"zcsb/selTjlx"; //查询条件类型
            var addJcUrl = getBeonePath("BCCA")+"zcsb/addZxjhJc"; //添加进程
            var editJcUrl = getBeonePath("BCCA")+"zcsb/updateZxjhJc"; //修改进程
            var delJcUrl = getBeonePath("BCCA")+"zcsb/delZxjhJc"; //删除进程
            var selSblxUrl = getBeonePath("ESS")+"zcsb/selSblxList"; //查询设备类型
            var ptFindCode="ZCSB_ZKGL_ZXJH_CX"; //分页查询code
            var insertCode="ZCSB_ZKGL_ZXJH_ADD"; //新增code
            var deleteCode="ZCSB_ZKGL_ZXJH_DEL"; //删除code
            var updateCode="ZCSB_ZKGL_ZXJH_EDIT"; //修改code
            var zxjhjcCode="ZCSB_ZKGL_ZXJH_JCSZ"; //进程设置

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
                    <input name="MC" id="MC" type="text" placeholder="计划名称" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{#  if(hasRight("ZCSB_ZKGL_ZXJH_ADD")){ }}
            <%--<button class="layui-btn layui-btn-sm" lay-event="addConfig"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>--%>
            {{#  } }}

        </div>
    </div>
</script>

<%--添加修改的table页面--%>
<div id="CONFIG" class="operationModle" style="display: none;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>计划名称</label>
            <div class="layui-input-block">
                <input type="text" NAME="mc" title="计划名称" lay-verify="required|special|unique" autocomplete="off" maxlength="10" class="layui-input">
                <input type="hidden" id="id">
                <input type="hidden" NAME="jhid" id="jhid">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>所属账户</label>
            <div class="layui-input-block">
                <select NAME="account" id="account" title="所属账户" lay-verify="required" autocomplete="off" lay-filter="ACCOUNT" class="layui-input">
                    <option value="">-- 请选择 --</option>
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">备注说明</label>
            <div class="layui-input-block">
                <input type="text" NAME="attr_1" title="备注说明" lay-verify="special" autocomplete="off" maxlength="30" class="layui-input">
            </div>
        </div>
        <button style="display: none;" id="addConfigSub" class="layui-btn" lay-submit lay-filter="addConfigSub">新增</button>
    </form>
</div>

<%--进程管理弹窗--%>
<div id="jcglPage" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:5px;">
        <form id="jcglForm" class="layui-form" action="" lay-filter="authMenuForm">
            <div class="layui-row layui-col-space20" style="margin-top: 1px;">
                <div class="layui-col-xs12" style="height: 100%;padding: 2px;">
                    <table id="jcgllistTable" lay-filter="jcgllistTable"></table>
                </div>
            </div>
        </form>
    </div>
</div>
<script type="text/html" id="toolbarUser1">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 500px;">
            <div class="layui-inline">
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="addjcbutton"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加进程</a>
            </div>
        </div>
    </div>
</script>

<%--添加进程弹窗--%>
<div id="addJcPage" class="operationModle" style="display: none;">
    <form id="addJcForm" class="layui-form" lay-filter="addJcForm">
        <div class="layui-form-item">
            <div class="layui-col-md6">
                <label class="layui-form-label"><span class="requiredMark">*</span>进程名称</label>
                <div class="layui-input-block">
                    <input name="process_name" id="process_name" lay-verify="required|special" maxlength="20" class="layui-input" />
                </div>
            </div>
            <div class="layui-col-md6">
                <label class="layui-form-label">前置动作</label>
                <div class="layui-input-block">
                    <select class="form-control" name="has_condition" id="has_condition"></select>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md6">
                <label class="layui-form-label">前置时间(秒)</label>
                <div class="layui-input-block">
                    <input name="pre_trigger_time" id="pre_trigger_time" lay-verify="positiveInteger" maxlength="10" class="layui-input" />
                </div>
            </div>
            <div class="layui-col-md6">
                <label class="layui-form-label">延迟时间(秒)</label>
                <div class="layui-input-block">
                    <input name="delay_trigger_time" id="delay_trigger_time" lay-verify="positiveInteger" maxlength="10" class="layui-input" />
                </div>
            </div>
        </div>
        <a class="layui-btn layui-btn-xs" style="background-color: #1E9FFF;margin-left: 10px;margin-bottom: 5px;" onclick="addTiaojian();">添加条件</a>
        <table cellspacing="0" cellpadding="0" border="0" class="layui-table">
            <thead><tr>
                <th class=""><div class="layui-table-cell"><span>是非</span></div></th>
                <th class=""><div class="layui-table-cell"><span>设备类型</span></div></th>
                <th class=""><div class="layui-table-cell"><span>序列号</span></div></th>
                <th class=""><div class="layui-table-cell"><span>触发条件</span></div></th>
                <th class=""><div class="layui-table-cell"><span>触发值</span></div></th>
                <th class="layui-table-col-special"><div class="layui-table-cell"><span>操作</span></div></th>
            </tr></thead>
            <tbody id="tjtable"></tbody>
        </table>
        <a class="layui-btn layui-btn-xs" style="background-color: #1E9FFF;margin: 5px auto 5px 10px;" onclick="addsjd();">添加时间段</a>
        <table cellspacing="0" cellpadding="0" border="0" class="layui-table">
            <thead><tr>
                <th class=""><div class="layui-table-cell"><span>类型</span></div></th>
                <th class=""><div class="layui-table-cell"><span>开始时间</span></div></th>
                <th class=""><div class="layui-table-cell"><span>结束时间</span></div></th>
                <th class="layui-table-col-special"><div class="layui-table-cell"><span>操作</span></div></th>
            </tr></thead>
            <tbody id="sjdtable"></tbody>
        </table>
        <a class="layui-btn layui-btn-xs" style="background-color: #1E9FFF;margin: 5px auto 5px 10px;">绑定模式</a>
        <div id="mslist" style="margin-top: 10px;"></div>

        <button style="display: none;" id="addJcTjSub" class="layui-btn" lay-submit lay-filter="addJcTjSub">保存</button>
    </form>
</div>


<%--条件页面--%>
<div id="tiaojianPage" class="operationModle" style="display: none;">
    <form id="tiaojianForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>设备类型</label>
            <div class="layui-input-block">
                <select name="product_code" id="product_code" lay-verify="required" lay-filter="product_code"></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>设备序号</label>
            <div class="layui-input-block">
                <select class="form-control" name="serial_num" id="serial_num" lay-verify="required"></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>条件类型</label>
            <div class="layui-input-block">
                <select class="form-control" name="tiaoJianType" id="tiaoJianType" lay-verify="required" lay-filter="tiaoJianType"></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>条件触发值</label>
            <div class="layui-input-block" id="tjcfzDiv">
                <select class="form-control" name="tiaoJianValue" id="tiaoJianValue"></select>
            </div>
        </div>
        <button style="display: none;" id="addTiaojianSub" class="layui-btn" lay-submit lay-filter="addTiaojianSub">新增</button>
    </form>
</div>

<%--时间段页面--%>
<div id="sjdPage" class="operationModle" style="display: none;">
    <form id="sjdForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>时间段</label>
            <div class="layui-input-block">
                <select name="sjdType" id="sjdType" lay-verify="required" lay-filter="sjdType">
                    <option value="datetime">日期</option>
                    <option value="time">时间</option>
                </select>
            </div>
        </div>
        <div id="datetime1">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="requiredMark">*</span>开始时间</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="start_time" id="start_time" readonly="readonly" />
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="requiredMark">*</span>结束时间</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="end_time" id="end_time" readonly="readonly" />
                </div>
            </div>
        </div>
        <div id="datetime2" style="display: none;">
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="requiredMark">*</span>开始时间</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="start_time" id="start_time2" readonly="readonly" />
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label"><span class="requiredMark">*</span>结束时间</label>
                <div class="layui-input-block">
                    <input class="layui-input" name="end_time" id="end_time2" readonly="readonly" />
                </div>
            </div>
        </div>

        <button style="display: none;" id="addsjdSub" class="layui-btn" lay-submit lay-filter="addsjdSub">新增</button>
    </form>
</div>

<%--删除进程--%>
<script type="text/html" id="JcConfig">
    <div class="bar">
        <a title="删除" lay-event="del"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_del.png"></a>
    </div>
</script>

</body>

<script>

</script>

</html>