<%--
  倪杨
  2019-08-11
  系统参数html页面
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
        <script type="text/javascript" src="<%=basePath%>js/sys/sysConfigJs.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess7";

            var status="";

            var loadConfigUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertConfigUrl= getBeonePath("ESS")+"common/insert";
            var updateConfigUrl= getBeonePath("ESS")+"common/update";
            var deleteConfigUrl= getBeonePath("ESS")+"common/delete";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var ptFindCode="XTGL_JCSJ_XTCS_CX"; //分页查询code
            var insertCode="XTGL_JCSJ_XTCS_ADD"; //新增code
            var updateCode="XTGL_JCSJ_XTCS_EDIT"; //修改code
            var deleteCode="XTGL_JCSJ_XTCS_DEL"; //删除code
            var tyqyCode="XTGL_JCSJ_XTCS_TYQY"; //删除code

        </script>
        <style>
            #config .layui-input-block input, select{
                width: 90%;
            }
        </style>
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
                    <input id="configName" type="text" placeholder="参数名称"  autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="configType" lay-verify="required">
                    </select>
                </div>
            </div>

            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="configKey" type="text" placeholder="参数代码" autocomplete="off" class="layui-input">
                </div>
            </div>

            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="configValue" type="text" placeholder="参数内容" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>

            {{#  if(hasRight("XTGL_JCSJ_XTCS_ADD")){ }}
            <button class="layui-btn layui-btn-sm" lay-event="addConfig" id="addbutton"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{#  } }}
        </div>
    </div>
</script>

<%--添加修改的table页面--%>
<div class="operationModle" id="CONFIG" style="display: none;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>参数名称</label>
            <div class="layui-input-block">
                <input type="text" NAME="NAME" title="参数名称" maxlength="20" lay-verify="required|special|unique" autocomplete="off" class="layui-input">
                <input type="hidden" id="ConfigHiddenId">
            </div>
        </div>
        <%--<div class="layui-form-item">
            <label class="layui-form-label">参数类型</label>
            <div class="layui-input-block">
                &lt;%&ndash;<input type="text" NAME="TYPE" lay-verify="required" autocomplete="off" class="layui-input">&ndash;%&gt;
                    <select name="TYPE" lay-verify="required" title="参数类型">
                        <option value=""></option>
                        <option value="1" selected>平台级参数</option>
                        <option value="2">单位组织级</option>
                        <option value="3">单位组织级模板</option>
                    </select>
            </div>
        </div>--%>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>参数代码</label>
            <div class="layui-input-block">
                <input type="text" NAME="KEY" lay-verify="required|special" maxlength="20" autocomplete="off" class="layui-input" title="参数代码">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>参数内容</label>
            <div class="layui-input-block">
                <input type="text" NAME="VALUE" lay-verify="required|special" maxlength="20" autocomplete="off" class="layui-input" title="参数内容">
            </div>
        </div>
        <button style="display: none;" id="addConfigSub" class="layui-btn" lay-submit lay-filter="addConfigSub">新增</button>
    </form>
</div>


</body>

<script></script>

</html>