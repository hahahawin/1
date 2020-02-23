<%--
  倪杨
  新闻通知
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
    <script type="text/javascript" src="<%=basePath%>js/jcbg/yjx.js"></script>
    <script type='text/javascript' src='<%=basePath %>js/ueditor1_4_3/ueditor.config.js'></script>
    <script type='text/javascript' src='<%=basePath %>js/ueditor1_4_3/ueditor.all.js'></script>

    <script>
        var jsonASD=getJsonASD();
        var tableName="ess51";

        var status="";//添加修改是否成功的状态，默认是空

        var loadUrl=getBeonePath("ESS")+"common/findOnPage";
        var insertUrl= getBeonePath("ESS")+"common/insert";
        var updateUrl= getBeonePath("ESS")+"common/update";
        var deleteUrl= getBeonePath("ESS")+"common/delete";

        var getYjxByIdUrl= getBeonePath("ESS")+"jcbg/getYjxById";
        var insertYjjlUrl= getBeonePath("ESS")+"jcbg/insertYjjl";

        var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

        var ptFindCode="JCBG_RCBG_YJX_CX"; //分页查询code
        var insertCode="JCBG_RCBG_YJX_ADD"; //新增code
        var deleteCode="JCBG_RCBG_YJX_DEL"; //删除code
        var updateCode="JCBG_RCBG_YJX_EDIT"; //修改code
        var fkCode="JCBG_RCBG_YJX_FK"; //反馈code
    </script>
    <style>
        .layui-table td, .layui-table th {
            padding: 1px 15px;
        }
    </style>
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
                    <select id="ggLX"></select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="ggBt" type="text" placeholder="标题" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("JCBG_RCBG_YJX_ADD")){}}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{# }}}
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
                    <label class="layui-form-label"><span class="requiredMark">*</span>意见类型</label>
                    <div class="layui-input-block">
                        <select name="YJLX" id="YJLX" title="意见类型" lay-filter="YJLX" lay-verify="required"></select>
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>标题</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="BT" maxlength="25" lay-verify="required" autocomplete="off" class="layui-input" title="标题">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>内容</label>
                    <div class="layui-input-block">
                        <textarea name="NR" id="NR" maxlength="100" title="内容" lay-verify="required" style="height:150px;width:99.5%"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
    </form>
</div>

<div class="operationModle" id="operationPageFk" style="display: none;">
    <form class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenIdFk">
        <div class="layui-form-item" style="height: 50px;border-bottom: 1px solid #E7E7E7;">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">意见类型</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="LX" class="layui-input" readonly>
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label">标题</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="BT"class="layui-input" readonly>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item" id="fkConT" style="padding-left: 10px;padding-right: 10px;">
            <div class="layui-row">
                <div class="layui-col-md12" id="fkCon" style="height: 230px;overflow-y: auto;background: #F9F9F9;">

                </div>
            </div>
        </div>
        <div class="layui-form-item" style="height: 100px;">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <textarea id="fkNr" title="内容" maxlength="100" lay-verify="required" class="layui-textarea"></textarea>
                </div>
            </div>
        </div>

        <button style="display: none;" id="formSubmit1" class="layui-btn" lay-submit lay-filter="formSubmit1">反馈</button>
    </form>
</div>

<div class="operationModle" id="operationPagePf" style="display: none;">
    <div id="test1"></div>
</div>


</body>

<script></script>

</html>