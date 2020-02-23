<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
    <head>
        <meta charset="UTF-8">
        <title>用户管理</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/sys/sysUserJs.js"></script>
        <script type="text/javascript" src="<%=basePath%>js/md5.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess2";
            var status="";
            var yhqx = {};
            var userTypes = {};
            var userZts = {};
            var loadConfigUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertConfigUrl= getBeonePath("ESS")+"common/insert";
            var updateConfigUrl= getBeonePath("ESS")+"common/update";
            var updateUserUrl= getBeonePath("ESS")+"sys/updateUser";

            var deleteConfigUrl= getBeonePath("ESS")+"common/delete";
            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证
            var selUserRoleUrl = getBeonePath("ESS")+"sys/selUserRole";
            var selUserRightUrl = getBeonePath("ESS")+"sys/selUserRight";
            var ptFindCode="XTGL_XTQX_YHGL_CX"; //分页查询code
            var insertCode="XTGL_XTQX_YHGL_ADD"; //新增code
            var deleteCode="XTGL_XTQX_YHGL_DEL"; //删除code
            var updateCode="XTGL_XTQX_YHGL_EDIT"; //修改code
            var tyqyCode="XTGL_XTQX_YHGL_TYQY"; //停用启用code

        </script>
        <style>
            .twoTitleDiv{height: 30px;line-height: 30px;padding-left: 10px;padding-right: 20px;}
            .showClass{display: block!important;}
            .twoTitle:hover{cursor: pointer;}

            .twoNrDiv{clear: both;display: none;}
            .twoNrDiv .nrLine{padding-top:10px;height: 30px;border-top: 1px solid #E7EAED;}
            .fourCheck{margin-left: 10px;width:18px;height:18px;}

            .roleButton{min-width: 50px;padding-left: 10px;float: left;cursor: pointer}
            .roleButton:hover{border-bottom: 2px solid #439CF4;color: #439CF4}
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
                    <input id="user_name" type="text" placeholder="用户姓名" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="user_zt"></select>
                </div>
            </div>
        </div>

        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>

            {{#  if(hasRight("XTGL_XTQX_YHGL_ADD")){ }}
            <button id="addbutton" class="layui-btn layui-btn-sm" lay-event="addConfig"><img src="<%=basePath%>img/icon/nr_icon_tj.png" style="margin-top:-5px;">&nbsp;&nbsp;添加</button>
            {{#  } }}
        </div>
    </div>

</script>



<%--添加修改的table页面--%>
<div class="operationModle" id="CONFIG"  style="display: none;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>用户账户</label>
            <div class="layui-input-block">
                <input type="text" NAME="ACCOUNT" title="用户账户" maxlength="20" lay-verify="required|special|unique" autocomplete="off" class="layui-input">
                <input type="hidden" id="ID">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>用户姓名</label>
            <div class="layui-input-block">
                <input type="text" NAME="NAME" title="用户账户" maxlength="10" lay-verify="required|special" autocomplete="off" class="layui-input">
            </div>
        </div>

        <button style="display: none;" id="addConfigSub" class="layui-btn" lay-submit lay-filter="addConfigSub">新增</button>
    </form>
</div>

<%--用户角色--%>
<div id="userRole_div" style="display: none;padding-top: 10px;">
    <div id="roles111"></div>
</div>
<%--用户权限 #F8F9FB--%>
<div id="userRight" style="display: none;background: #F8F9FB">
    <div id="roles" style="width: 100%;height: 40px;line-height:40px;background: #fff"></div>
    <div class="layui-container" style="height:calc(100% - 42px);width: 100%;padding-top:20px;">
        <form id="authMenuForm" class="layui-form" action="" lay-filter="authMenuForm">
            <div class="layui-row layui-col-space20" style="">
                <div class="layui-col-xs3" style="height: 100%;border-right: 10px solid #F8F9FB;background: #fff;">
                    <div style="" class="oneMenus">

                    </div>
                </div>
                <div class="layui-col-xs9" style="height: 100%;background: #fff">
                    <div class="layui-col-md12" style="height: calc(100% - 20px);overflow-y:auto; " id="234Menus">

                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
</body>

<script></script>

</html>