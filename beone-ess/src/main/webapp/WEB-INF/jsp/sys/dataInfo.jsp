<%--
  倪杨
  2019-08-08
  数据字典html页面
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
    <%--注意：当用include 引入的jsp文件中，各个js方法名、变量名，css类名等不能重复 --%>
        <title>demo1.0</title>
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <jsp:include page="../introduce/common.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=basePath%>css/table.css">
    <link rel="stylesheet" href="<%=basePath%>css/sys/dataInfoCss.css">
    <script type="text/javascript" src="<%=basePath%>js/sys/dataInfoJs.js"></script>
    <script>
        var jsonASD=getJsonASD();
        var tableName1="ess3";
        var tableName2="ess5";

        var dataType;   //该变量用于切换数据字典值，保存的是数据字典类型
        var dataTypeAdd="";    //该变量用于保存添加“数据字典”的状态，将ajax返回的值保存到此变量
        var dataTypeValueAdd="";    //该变量用于保存添加“数据字典值”的状态，将ajax返回的值保存到此变量

        var loadDataTypeUrl=getBeonePath("ESS")+"common/findOnPage";
        var insertDataTypeUrl= getBeonePath("ESS")+"common/insert";
        var updateDataTypeUrl= getBeonePath("ESS")+"common/update";
        var deleteDataTypeUrl= getBeonePath("ESS")+"common/delete";

        var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证
        var uniquePIDUrl= getBeonePath("ESS")+"common/uniquePID"; //唯一性验证

        var ptFindCodeType="XTGL_JCSJ_SJZD_LBCX"; //分页查询code
        var insertCodeType="XTGL_JCSJ_SJZD_ADDLB"; //新增code
        var deleteCodeType="XTGL_JCSJ_SJZD_DELLB"; //删除code
        var updateCodeType="XTGL_JCSJ_SJZD_EDITLB"; //修改code
        var TYQYCodeType="XTGL_JCSJ_SJZD_LBTYQY"; //停用启用code


        var ptFindCodeValue="XTGL_JCSJ_SJZD_ZDXCX"; //分页查询code
        var insertCodeValue="XTGL_JCSJ_SJZD_ADDZDX"; //新增code
        var deleteCodeValue="XTGL_JCSJ_SJZD_DELZDX"; //删除code
        var updateCodeValue="XTGL_JCSJ_SJZD_EDITZDX"; //修改code
        var TYQYCodeValue="XTGL_JCSJ_SJZD_ZDXTYQY"; //停用启用code
    </script>

</head>
<body>

<div id="dataInfo" class="layui-row">
    <%--字典类别begin--%>
    <div id="dataInfoType" class="layui-col-xs6">
        <table id="dataType" lay-filter="dataType"></table>
    </div>

        <script type="text/html" id="toolbarDataType">
            <div class="operationTableTool1">
                <div class="layui-form-item">
                    <div class="layui-inline">
                        <div class="layui-input-inline" style="width: 150px;">
                            <input id="DataTypeCode" maxlength="20" type="text" placeholder="类型编码" autocomplete="off" class="layui-input">
                        </div>
                    </div>

                    <div class="layui-inline">
                        <div class="layui-input-inline" style="width: 150px;">
                            <input id="DataTypeName" maxlength="20" type="text" placeholder="类型名称" autocomplete="off" class="layui-input">
                        </div>
                    </div>

                    <div class="layui-inline">
                        <div class="layui-input-inline" style="width: 150px;">
                            <select id="DataTypeZT">
                                <option value="">请选择状态</option>
                                <option value="1">停用</option>
                                <option value="2">启用</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="layui-btn-container">
                    <button class="layui-btn layui-btn-sm" lay-event="findDataType"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
                    <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
                    {{#  if(isadmin == 2){ }}
                    <button class="layui-btn layui-btn-sm" lay-event="addDataType"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
                    {{#  } }}
                </div>
            </div>
        </script>

        <script type="text/html" id="barDataType">
            <div class="bar">
                <a  title="编辑" lay-event="edit"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_bj.png"></a>
                <a  title="删除" lay-event="del"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_del.png"></a>
                {{#  if(d.ZT=='1'){ }}
                <a title="启用" lay-event="enable"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_start.png"></a>
                {{#  } }}
                {{#  if(d.ZT=='2'){ }}
                <a title="停用" lay-event="stop"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_stop.png"></a>
                {{#  } }}
            </div>
            <%-- {{#  if(d.DT_ZT=='1'){ }}
            <a class="layui-btn layui-btn-xs" lay-event="check">审核</a>
            {{#  } }}--%>
        </script>


    <%--字典类别end--%>

    <%--字典值begin--%>
    <div id="dataInfoTypeValue" class="layui-col-xs6">
        <table id="dataTypeValue" lay-filter="dataTypeValue"></table>
    </div>
        <script type="text/html" id="toolbarDataTypeValue">
            <div class="operationTableTool">
                <div class="layui-btn-container">
                    {{#  if(isadmin == 2){ }}
                    <button class="layui-btn layui-btn-sm" lay-event="addDataTypeValue"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
                    {{#  } }}
                </div>
            </div>
        </script>

        <script type="text/html" id="barDataTypeValue">
            <div class="bar">
                <a  title="编辑" lay-event="edit"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_bj.png"></a>
                <a  title="删除" lay-event="del"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_del.png"></a>
                {{#  if(d.ZT=='1'){ }}
                <a title="启用" lay-event="enable"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_start.png"></a>
                {{#  } }}
                {{#  if(d.ZT=='2'){ }}
                <a title="停用" lay-event="stop"><img src="<%=basePath%>img/menu/menu4/blue/nr_icon_stop.png"></a>
                {{#  } }}
            </div>
            <%-- {{#  if(d.DT_ZT=='1'){ }}
             <a class="layui-btn layui-btn-xs" lay-event="check">审核</a>
             {{#  } }}--%>
        </script>
    <%--字典值end--%>

</div>

<%--添加数据字典begin--%>
<div class="operationModle" id="addDataType" style="display: none;">
    <form id="addDataTypeForm" class="layui-form" action="" lay-filter="addDataTypeForm">
        <div class="layui-form-item">
            <label class="layui-form-label">*类型编码</label>
            <div class="layui-input-block">
                <input type="text" NAME="CODE" maxlength="20" lay-verify="required|special|unique" autocomplete="off" class="layui-input" title="类别编码">
                <input type="hidden" id="id">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">*类型名称</label>
            <div class="layui-input-block">
                <input type="text" NAME="NAME" maxlength="20" lay-verify="required|special" autocomplete="off" class="layui-input" title="类别名称">
            </div>
        </div>
        <%--<div class="layui-form-item">
            <label class="layui-form-label">是否启用</label>
            <div class="layui-input-block">
                <input type="radio" name="ZT" lay-verify="required" checked value="2" title="启用">
                <input type="radio" name="ZT" lay-verify="required" value="1" title="停用">
            </div>
        </div>--%>
        <button style="display: none;" id="addDataTypeSub" class="layui-btn" lay-submit lay-filter="addDataTypeSubmit">新增</button>
    </form>
</div>
<%--添加数据字典end--%>

<%--添加数据字典值begin--%>
<div class="operationModle" id="addDataTypeValue" style="display: none;">
    <form id="addDataTypeValueForm" class="layui-form" action="" lay-filter="addDataTypeValueForm">
        <div class="layui-form-item">
            <label class="layui-form-label">*字典类型</label>
            <div class="layui-input-block">
                <input type="hidden" NAME="PID" autocomplete="off" class="layui-input">
                <input type="hidden" id="valueID">
                <input type="text" readonly="readonly" NAME="DI_DT_NAME" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">*字典键值</label>
            <div class="layui-input-block">
                <input type="text" NAME="KEY" maxlength="20" lay-verify="required|special|unique" autocomplete="off" class="layui-input" title="字典键值">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label">*字典项值</label>
            <div class="layui-input-block">
                <input type="text" NAME="VALUE" maxlength="20" lay-verify="required|special" autocomplete="off" class="layui-input" title="字典项值">
            </div>
        </div>
        <%--<div class="layui-form-item">
            <label class="layui-form-label">是否启用</label>
            <div class="layui-input-block">
                <input type="radio" name="ZT" lay-verify="required" checked value="2" title="启用">
                <input type="radio" name="ZT" lay-verify="required" value="1" title="停用">
            </div>
        </div>--%>
        <button style="display: none;" id="addDataTypeValueSub" class="layui-btn" lay-submit lay-filter="addDataTypeValueSubmit">新增</button>
    </form>
</div>
<%--添加数据字典值end--%>


</body>

</html>
