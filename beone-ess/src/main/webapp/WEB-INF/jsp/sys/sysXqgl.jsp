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
        <title>学期管理</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/sys/sysXqglJs.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess11";
            var tableName2="ess10";
            var status="";//添加修改是否成功的状态，默认是空
            var loadXNDUrl=getBeonePath("ESS")+"common/find"; //加载学年度下拉框
            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var xndFindCode="1"; //学年度下来列表框的查询 code
            var ptFindCode="XTGL_JYGL_XQGL_CX"; //分页查询code
            var insertCode="XTGL_JYGL_XQGL_ADD"; //新增code
            var deleteCode="XTGL_JYGL_XQGL_DEL"; //删除code
            var updateCode="XTGL_JYGL_XQGL_EDIT"; //修改code


        </script>
        <style>
            .layui-table-view .layui-table td{height: 38px;}
        </style>
    </head>
    
<body>
<%--table--%>
<table id="conTable" lay-filter="conTable"></table>

<%--table头部--%>
<script type="text/html" id="toolHead">
    <div class="operationTableTool" style="float: left">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="xqglPID">

                    </select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="xqglXQM">

                    </select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="xqglMC" type="text" placeholder="学期名称" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("XTGL_JYGL_XQGL_ADD")) { }}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{# } }}
        </div>
    </div>
    <div style="float: left;font-size: 10px;color: red;line-height: 14px;">
        * 秋季学期：08-01~09-30 -- 次年 01-01~02-10
        <br>
        * 春季学期：次年02-11~03-31 -- 次年06-01~07-31
    </div>
</script>


<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenId">

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>学年度</label>
                    <div class="layui-input-block">
                        <select id="XND" NAME="PID" lay-verify="required" title="学年度" lay-filter="XND">

                        </select>
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>学期码</label>
                    <div class="layui-input-block">
                        <select id="XQM" name="XQM" lay-verify="required" lay-filter="XQM">
                            <option value="">请选择</option>
                            <option value="1">秋季学期</option>
                            <option value="2">春季学期</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>学期名称</label>
                    <div class="layui-input-block">
                        <input type="text" id="MC" NAME="MC" lay-verify="required|unique" readonly autocomplete="off" class="layui-input" title="学期名称">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>开始日期</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="KSSJ" id="kssjInput" lay-verify="required" readonly="readonly" autocomplete="off" class="layui-input" title="开始日期">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>结束日期</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="JSSJ" id="jssjInput" lay-verify="required" readonly="readonly" autocomplete="off" class="layui-input" title="开始日期">
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