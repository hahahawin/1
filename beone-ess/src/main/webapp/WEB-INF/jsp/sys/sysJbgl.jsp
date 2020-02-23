<%--
  倪杨
  2019-08-21
  学期管理html页面
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
        <title>届别管理</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/sys/sysJbglJs.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess12"; //届别
            var tableName2="ess9"; //学段
            var tableName3="ess11"; //学期

            var status="";//添加修改是否成功的状态，默认是空

            var loadXNDUrl=getBeonePath("ESS")+"common/find"; //加载学年度下拉框
            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var xndFindCode="1"; //学年度下来列表框的查询 code
            var ptFindCode="XTGL_JYGL_JBGL_CX"; //分页查询code
            var insertCode="XTGL_JYGL_JBGL_ADD"; //新增code
            var deleteCode="XTGL_JYGL_JBGL_DEL"; //删除code
            var updateCode="XTGL_JYGL_JBGL_EDIT"; //修改code
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
                    <select id="jbglXdid"></select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="jbglXqid"></select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="jbglMC" type="text" placeholder="届别名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="jbglBynf" type="text" placeholder="毕业年份" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("XTGL_JYGL_JBGL_ADD")) { }}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{# } }}
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
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>学段</label>
                    <div class="layui-input-block">
                        <select id="XDID" NAME="XDID" lay-verify="required" title="学段" lay-filter="XDID"></select>
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>入学学期</label>
                    <div class="layui-input-block">
                        <select id="XQID" NAME="XQID" lay-verify="required" title="入学学期" lay-filter="XQID"></select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>届别名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="MC" lay-verify="required|unique" readonly autocomplete="off" class="layui-input" title="届别名称">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>毕业年份</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="BYNF" lay-verify="required" readonly autocomplete="off" class="layui-input" title="毕业年份">
                    </div>
                </div>
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
        <button style="display: none;" id="formSubmit1" class="layui-btn" lay-submit lay-filter="formSubmit1">存为草稿</button>
    </form>
</div>


</body>

<script>

</script>

</html>