<%--
  倪杨
  2019-08-15
  部门管理html页面
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
        <script type="text/javascript" src="<%=basePath%>js/sys/sysDeptJs.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess8";   //增删改
            var tableName1="ess8001";   //分页查询时，因为涉及到上级部门名称

            var status="";

            var findUrl=getBeonePath("ESS")+"common/find";
            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"sys/deleteDept";//特殊删除，涉及到上级部门PID
            var loadDeptUrl= getBeonePath("ESS")+"sys/loadDept";//特殊加载，涉及到上级部门PID
            var getUserListInDeptUrl= getBeonePath("ESS")+"sys/getUserListInDept";//特殊加载，获取管理员列表
            var getInDeptUserUrl= getBeonePath("ESS")+"sys/getInDeptUser";//获取在该部门的user
            var getOutDeptUserUrl= getBeonePath("ESS")+"sys/getOutDeptUser";//获取未加入任何部门的user
            var addDetpUserUrl= getBeonePath("ESS")+"sys/addDetpUser";//将用户添加到部门
            var delDetpUserUrl= getBeonePath("ESS")+"sys/delDetpUser";//将用户从部门移除

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var findCode="XTGL_XTQX_BMGL_CX"; //分页查询code
            var ptFindCode="XTGL_XTQX_BMGL_CX"; //分页查询code
            var insertCode="XTGL_XTQX_BMGL_ADD"; //新增code
            var deleteCode="XTGL_XTQX_BMGL_DEL"; //删除code
            var updateCode="XTGL_XTQX_BMGL_EDIT"; //修改code
        </script>
        <style>
            .layui-table-cell{height: 28px;}
        </style>
    </head>
    
<body style="">
<div class="layui-row">
    <div class="layui-col-md3" style="background: #fff;height: calc(100vh - 10px);width: 300px;margin-top: 10px;">
        <div class="layui-btn-container" style="padding: 10px 0px 0px 10px;">
            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-dept="addFirst"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-dept="reload"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;刷新</button>
        </div>
        <div id="deptTree" style="max-width: 280px; height: calc(100% - 60px); overflow: auto;"></div>
    </div>
    <div class="layui-col-md9" style="background: #fff;width: calc(100% - 310px);margin-left: 10px;height: calc(100vh - 10px);margin-top: 10px;">
        <%--添加修改的table页面--%>
        <div id="operationPage" style="display: none;margin-top: 10px;">
            <form id="form" class="layui-form" action="" lay-filter="form">
                <input type="hidden" id="hiddenId">
                <div id="superDept" class="layui-form-item">
                    <label class="layui-form-label">上级部门</label>
                    <div class="layui-input-block">
                        <input type="hidden" NAME="PID" readonly autocomplete="off" class="layui-input">
                        <input type="text" NAME="PNAME" readonly autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>部门名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="NAME" maxlength="20" lay-verify="required|special|unique" autocomplete="off" class="layui-input" title="部门名称">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>负责人</label>
                    <div class="layui-input-block">
                        <select name="FZR" id="FZR" title="负责人" lay-verify="required" lay-search></select>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>部门职责</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="ZZ" maxlength="50" lay-verify="required|special" autocomplete="off" class="layui-input" title="部门职责">
                    </div>
                </div>
                <div class="layui-form-item">

                </div>
                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button id="formSubmit" class="layui-btn layui-btn-normal" lay-submit lay-filter="formSubmit">提交</button>
                        <a class="layui-btn layui-btn-normal" style="display: none;" id="deptUser" onclick="deptUser()">部门成员</a>
                    </div>
                </div>

            </form>
        </div>
    </div>
</div>

<script type="text/html" id="toolbar1">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 440px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 120px;">
                    <input id="name1" type="text" placeholder="用户姓名" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxun1"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</a>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="reset1"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</a>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="del1"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;移除</a>
            </div>
        </div>
    </div>
</script>

<script type="text/html" id="toolbar2">
    <div class="operationTableTool">
        <div class="layui-form-item" style="width: 440px;">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 120px;">
                    <input id="name2" type="text" placeholder="用户姓名" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="chaxun2"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</a>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="reset2"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</a>
                <a class="layui-btn layui-btn-sm layui-btn-normal" lay-event="add2"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</a>
            </div>
        </div>
    </div>
</script>

<div id="deptUserPage" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:10px;">
        <form id="" class="layui-form" action="" lay-filter="">
            <div class="layui-row layui-col-space20" style="">
                <div class="layui-col-xs6" style="height: 100%;padding: 5px;">
                    <table id="table1" lay-filter="table1"></table>
                </div>
                <div class="layui-col-xs6" style="height: 100%;padding: 5px;">
                    <table id="table2" lay-filter="table2"></table>
                </div>
            </div>
        </form>
    </div>
</div>
</body>

</html>