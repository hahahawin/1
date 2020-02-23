<%--
  倪杨
  2019-09-17
  组织用户初始化
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
        <title>组织管理员</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/xadmin.js"></script>
        <script type="text/javascript" src="<%=basePath%>js/pt/ptOrgInitAdminJs.js"></script>
        <script type="text/javascript" src="<%=basePath%>js/md5.js"></script>
        <style>
            .operationModle .layui-form-select dl{height: 150px;}
        </style>
        <script>
            var jsonASD=getJsonASD();
            var tableName="ess2";

            var status="";//添加修改是否成功的状态，默认是空

            var selOrgListUrl = getBeonePath('ESS')+'pt/selOrgList' ;
            var loadOrgUpdUrl=getBeonePath("ESS")+"pt/findInitAdminOrgUpd";
            var selOrgUserUrl = getBeonePath("ESS")+"pt/selOrgUserlist";
            // var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";
            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证
            var ptnzcsXfUrl = getBeonePath("ESS")+"pt/ptnzcsXf";

            var ptFindCode="PTGL_ZZGL_ZZCSHYH_CX"; //分页查询code
            var insertCode="PTGL_ZZGL_ZZCSHYH_ADD"; //新增code
            var updateCode="PTGL_ZZGL_ZZCSHYH_EDIT"; //修改code
            var tyqyCode="PTGL_ZZGL_ZZCSHYH_TYQY"; //停用启用code
            var ptcsCode="PTGL_ZZGL_ZZXX_TBXF";//组织参数修复
        </script>
    </head>
    
<body>
<%--table--%>
<table id="conTable" lay-filter="conTable"></table>

<%--table头部--%>
<script type="text/html" id="toolHead">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="orgName" type="text" placeholder="用户名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="orgAccess" type="text" placeholder="登陆账号" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="orgPid" type="text" placeholder="所属组织" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("PTGL_ZZGL_ZZXX_ADD")) {}}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{# }}}
        </div>
        <span class="requiredMark" style="width: 100px;">添加管理员后请去“菜单管理--菜单授权”进行授权</span>
    </div>
</script>

<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenId">
        <input type="hidden" id="hiddenUserType">
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>所属组织</label>
                    <div class="layui-input-block">
                        <select id="ORG_ID" NAME="ORG_ID" lay-filter="ORG_ID" lay-verify="required" title="所在组织" lay-search=""></select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>用户名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="NAME" lay-verify="required" maxlength="10" autocomplete="off" class="layui-input" title="用户名称">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>登陆账号</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="ACCOUNT" lay-verify="required|unique" maxlength="20" autocomplete="off" class="layui-input" title="登陆账号">
                    </div>
                </div>
            </div>
        </div>

        <%--<div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">用户类型</label>
                    <div class="layui-input-block">
                        <input type="radio" name="TYPE" lay-verify="required" checked value="1" title="学生">
                        <input type="radio" name="TYPE" lay-verify="required" value="2" title="家长">
                        <input type="radio" name="TYPE" lay-verify="required" value="3" title="教职工">
                        <input type="radio" name="TYPE" lay-verify="required" value="4" title="教委人员">
                        <input type="radio" name="TYPE" lay-verify="required" value="5" title="平台员工">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">用户状态</label>
                    <div class="layui-input-block">
                        <input type="radio" name="ZT" lay-verify="required" checked value="1" title="停用">
                        <input type="radio" name="ZT" lay-verify="required" value="2" title="启用">
                    </div>
                </div>
            </div>
        </div>--%>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
    </form>
</div>

<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage2" style="display: none;">
    <form id="form2" class="layui-form" action="" lay-filter="form2">
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>修复类型</label>
                    <div class="layui-input-block">
                        <input type="hidden" id="xf_org_id" />
                        <input type="checkbox" name="xf_type" value="1" title="内置分组" lay-skin="primary">
                        <input type="checkbox" name="xf_type" value="2" title="学校基本信息" lay-skin="primary">
                    </div>
                </div>
            </div>
        </div>
        <button style="display: none;" id="formSubmit2" class="layui-btn" lay-submit lay-filter="formSubmit2">新增</button>
    </form>
</div>


</body>

<script>

</script>

</html>