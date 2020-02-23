<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

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
        <script type="text/javascript" src="<%=basePath%>js/sys/sysRoleJs.js"></script>
        <style>
            /*.twoTitleDiv{height: 30px;line-height: 30px;padding-left: 10px;padding-right: 20px;}*/
            .twoTitleDiv{height: 40px;line-height: 40px;padding-left: 12px;padding-right: 20px;background-color: #FFFFFF;}
            .showClass{display: block!important;}
            .twoTitle:hover{cursor: pointer;}

            .oneMenu:hover{cursor: pointer;}

            .twoNrDiv{clear: both;display: none;}
            .twoNrDiv .nrLine{padding-top:5px;clear: both;min-height: 30px;line-height: 30px;border-top: 1px solid #E7EAED;}
            .fourCheck{margin-left: 10px;width:18px;height:18px;}

            .layui-form-checked[lay-skin=primary] i{background: none;color: #439CF4;border-color: #439cf4 !important;}
            .layui-form-checked, .layui-form-checked:hover{border-color:#439CF4}
            .layui-form-checked[lay-skin=primary2] i{}
            #authUserPage .layui-table-cell{height: 28px;}
        </style>
        <script>
            var jsonASD=getJsonASD();
            var tableName="ess13";
            var status="";

            var loadConfigUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertConfigUrl= getBeonePath("ESS")+"common/insert";
            var updateConfigUrl= getBeonePath("ESS")+"common/update";
            var deleteConfigUrl= getBeonePath("ESS")+"common/delete";
            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证
            var roleOneRightUrl = getBeonePath("ESS")+"sys/roleOneRight"; //角色授权一级菜单查询
            var role234RightUrl = getBeonePath('ESS')+'sys/role234Right';
            var roleGrantUrl = getBeonePath('ESS')+'sys/roleGrant';
            var roleUserUrl = getBeonePath('ESS')+'sys/roleUser';
            var addRoleUserUrl = getBeonePath('ESS')+'sys/addRoleUser';
            var delRoleUserUrl = getBeonePath('ESS')+'sys/delRoleUser';
            if(bslx == '1'){
                loadConfigUrl=getBeonePath("JXSC")+"common/findOnPage";
                insertConfigUrl= getBeonePath("JXSC")+"common/insert";
                updateConfigUrl= getBeonePath("JXSC")+"common/update";
                deleteConfigUrl= getBeonePath("JXSC")+"common/delete";
                uniqueUrl= getBeonePath("JXSC")+"common/unique"; //唯一性验证

                roleOneRightUrl = getBeonePath("JXSC")+"sys/roleOneRight"; //角色授权一级菜单查询
                role234RightUrl = getBeonePath('JXSC')+'sys/role234Right' ;
                roleGrantUrl = getBeonePath('JXSC')+'sys/roleGrant' ;
            }
            var ptFindCode="XTGL_XTQX_JSGL_CX"; //分页查询code
            var insertCode="XTGL_XTQX_JSGL_ADD"; //新增code
            var deleteCode="XTGL_XTQX_JSGL_DEL"; //删除code
            var updateCode="XTGL_XTQX_JSGL_EDIT"; //修改code
            var roleMenuCode="XTGL_XTQX_JSGL_CDSQ"; //菜单授权
            var roleUserCode="XTGL_XTQX_JSGL_YHSQ";//用户授权
            var tyqyCode = "XTGL_XTQX_JSGL_TYQY";//用户授权

            var rightMap = {}; //菜单授权初数据
            var AllRightMap = {}; //234级菜单临时权限数据
            var addArray = new Array() ; //添加权限数组
            var delArray = new Array() ; //删除权限数组
            var isAll = false ; //判断是否是全选
            var role_id = "";



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
                    <input id="role_name" type="text" placeholder="角色名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="role_code" type="text" placeholder="角色编号" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="role_zt" lay-verify="required">

                    </select>
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>

            {{#  if(hasRight("XTGL_XTQX_JSGL_ADD")){ }}
            <button class="layui-btn layui-btn-sm" lay-event="addConfig"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{#  } }}
        </div>
    </div>
</script>

<%--添加修改的table页面--%>
<div id="CONFIG" class="operationModle" style="display: none;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>角色名称</label>
            <div class="layui-input-block">
                <input type="text" NAME="NAME" title="角色名称" lay-verify="required|special|unique" maxlength="10" autocomplete="off" class="layui-input">
                <input type="hidden" id="ID">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>角色编号</label>
            <div class="layui-input-block">
                <input type="text" NAME="CODE" title="角色编号" lay-verify="required|special|unique" maxlength="10" autocomplete="off" class="layui-input">
            </div>
        </div>

        <button style="display: none;" id="addConfigSub" class="layui-btn" lay-submit lay-filter="addConfigSub">新增</button>
    </form>
</div>

<%--角色授权table页面--%>
<div id="authMenuPage" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:10px;">
        <form id="authMenuForm" class="layui-form" action="" lay-filter="authMenuForm">
            <div class="layui-row layui-col-space20" style="">
                <div class="layui-col-xs3" style="height: 100%;border-right: 1px solid #E7EAED;">
                    <div style="height: 30px;padding-left: 20px;padding-top: 10px;">
                        <%--<input type="checkbox" name="allcheck" id="allcheck"  lay-filter="allcheck" title="全部" lay-skin="primary" />--%>
                        <button class="layui-btn layui-btn-xs" lay-submit lay-filter="formSubmit" style="background-color: #3091F2">授权</button>
                    </div>
                    <div style="width: 100%;height: 1px;background-color: #E7EAED;"></div>
                    <div style="padding-left: 20px;margin-top: 20px;height: calc(100% - 80px);overflow-y:auto;" class="oneMenus">

                    </div>
                </div>
                <div class="layui-col-xs9" style="background: #fff;height: 100%;">
                    <div class="layui-col-md12" id="234Menus" style="height: calc(100% - 20px);overflow-y:auto; ">

                    </div>
                </div>
            </div>
        </form>
    </div>
</div>


<script type="text/html" id="toolbarUser1">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 440px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 120px;">
                    <input id="user_name1" type="text" placeholder="用户姓名" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxunUser1"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="resetUser1"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="delRoleUser"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;移除</a>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="toolbarUser2">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 440px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 120px;">
                    <input id="user_name2" type="text" placeholder="用户姓名" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxunUser2"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
                <button class="layui-btn layui-btn-sm layui-btn-normal" lay-event="resetUser2"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="addRoleUser"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</a>
            </div>
        </div>
    </div>
</script>
<%--角色授权用户table页面--%>
<div id="authUserPage" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:10px;">
        <form id="authUserForm" class="layui-form" action="" lay-filter="authMenuForm">
            <div class="layui-row layui-col-space20" style="">
                <div class="layui-col-xs6" style="height: 100%;padding: 5px;">
                    <table id="roleUserTable" lay-filter="roleUserTable"></table>
                </div>
                <div class="layui-col-xs6" style="height: 100%;padding: 5px;">
                    <table id="notRoleUserTable" lay-filter="notRoleUserTable"></table>
                </div>
            </div>
        </form>
    </div>
</div>

</body>


</html>