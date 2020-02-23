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
        <title></title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/pt/ptOrgUsersJs.js"></script>
        <script type="text/javascript" src="<%=basePath%>js/md5.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess2";
            var status="";//添加修改是否成功的状态，默认是空
            var loadOrgAddUrl=getBeonePath("ESS")+"pt/findInitAdminOrgAdd";
            var loadOrgUpdUrl=getBeonePath("ESS")+"pt/findInitAdminOrgUpd";
            var selOrgUserUrl = getBeonePath("ESS")+"pt/selOrgUserlist";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var ptFindCode="PTGL_ZZGL_ZZYH_CX"; //分页查询code
            var czmmCode="PTGL_ZZGL_ZZYH_CZMM";
            var tyqyCode="PTGL_ZZGL_ZZYH_TYQY"; //修改code
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
        </div>
    </div>
</script>

<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenId">
        <input type="hidden" id="hiddenXNS">
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">所属组织</label>
                    <div class="layui-input-block">
                        <select id="ORG_ID" NAME="ORG_ID" lay-verify="required" title="所在组织" lay-search=""></select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">用户名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="NAME" lay-verify="required|unique" autocomplete="off" class="layui-input" title="用户名称">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label">登陆账号</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="ACCOUNT" lay-verify="required|unique" autocomplete="off" class="layui-input" title="登陆账号">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
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
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
    </form>
</div>


</body>

<script>

</script>

</html>