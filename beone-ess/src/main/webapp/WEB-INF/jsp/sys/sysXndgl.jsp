<%--
  倪杨
  2019-08-20
 学年度管理html页面
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
        <script type="text/javascript" src="<%=basePath%>js/sys/sysXndglJs.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess10";

            var status="";//添加修改是否成功的状态，默认是空

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var ptFindCode="XTGL_JYGL_XNDGL_CX"; //分页查询code
            var insertCode="XTGL_JYGL_XNDGL_ADD"; //新增code
            var deleteCode="XTGL_JYGL_XNDGL_DEL"; //删除code
            var updateCode="XTGL_JYGL_XNDGL_EDIT"; //修改code

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
                    <input id="xndglMC" type="text" placeholder="学年度名称" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("XTGL_JYGL_XNDGL_ADD")) { }}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{# } }}
            <button class="layui-btn" style="color: red;background: #FFFFFF;border: none">* 学年度开始日期： 08-01~10-01 学年度结束日期：次年06-01~07-31</button>
        </div>
    </div>
</script>

<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenId">
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>学年度代码</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="DM" id="DM" title="学年度代码" maxlength="9" lay-verify="required|DM" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>学年度名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="MC" id="MC" readonly lay-verify="required|unique" autocomplete="off" class="layui-input" title="学年度名称">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>开始日期</label>
                    <div class="layui-input-block" id="KS">
                        <input type="text" NAME="KSSJ" id="kssjInput" lay-verify="required" readonly="readonly" autocomplete="off" class="layui-input" title="开始日期">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>结束日期</label>
                    <div class="layui-input-block" id="JS">
                        <input type="text" NAME="JSSJ" id="jssjInput" lay-verify="required" readonly="readonly" autocomplete="off" class="layui-input" title="结束日期">
                    </div>
                </div>
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
        <button style="display: none;" id="formSubmit1" class="layui-btn" lay-submit lay-filter="formSubmit1">存为草稿</button>
    </form>
</div>


</body>


</html>