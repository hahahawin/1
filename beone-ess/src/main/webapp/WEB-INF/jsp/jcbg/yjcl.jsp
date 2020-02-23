<%@ page import="java.util.Map" %><%--
  倪杨
  新闻通知
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
    Map<String, String> usermap = (Map<String, String>) request.getSession().getAttribute("user");
    String user_type="";
    if (!usermap.isEmpty()){
        user_type=usermap.get("USER_TYPE");
    }else {
        user_type="0";
    }

%>
<html>
<head>
    <meta charset="UTF-8">
    <title>意见处理</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
    <jsp:include page="../introduce/table.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=basePath%>css/table.css">
    <script type="text/javascript" src="<%=basePath%>js/jcbg/yjcl.js"></script>

    <script>
        var user_type = '<%=user_type%>';
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

        var ptFindCode="JCBG_RCBG_YJCL_CX"; //分页查询code
        var clCode="JCBG_RCBG_YJCL_CL"; //处理code
        var dlyjCode="JCBG_RCBG_YJCL_ZJPF"; //领导意见code
    </script>
    <style>
        .layui-table td, .layui-table th {
            padding: 1px 15px;
        }
        .layui-rate{
            padding: 0px 5px 10px 0;
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
        </div>
    </div>
</script>

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
                <div class="layui-col-md12" id="fkCon" style="height: 230px;overflow-y: auto">

                </div>
            </div>
        </div>
        <div class="layui-form-item" style="height: 100px;">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <textarea id="fkNr" title="内容" lay-verify="required" class="layui-textarea"></textarea>
                </div>
            </div>
        </div>

        <button style="display: none;" id="formSubmit1" class="layui-btn" lay-submit lay-filter="formSubmit1">反馈</button>
    </form>
</div>

<div class="operationModle" id="operationPagePf" style="display: none;">
    <input type="hidden" id="hiddenIdPy">
    <div class="layui-form-item">
        <div class="layui-row">
            <div class="layui-col-md12">
                <label class="layui-form-label">评分</label>
                <div class="layui-input-block">
                    <div id="test1" style="margin-left: 20px;"></div>
                </div>
            </div>
        </div>
    </div>
    <div class="layui-form-item">
        <div class="layui-row">
            <div class="layui-col-md12">
                <label class="layui-form-label">评语</label>
                <div class="layui-input-block">
                    <textarea style="width: 90%;margin: 0 auto" maxlength="100" id="PY" title="评语" class="layui-textarea"></textarea>
                </div>
            </div>
        </div>
    </div>
</div>


</body>

</html>