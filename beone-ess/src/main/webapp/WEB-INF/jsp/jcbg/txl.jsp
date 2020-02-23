<%--
  倪杨
  2019-11-18
  通讯录
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
        <script type="text/javascript" src="<%=basePath%>js/jcbg/txl.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess49";
            var tableName1="ess50";

            var status="";

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var findUrl=getBeonePath("ESS")+"common/find";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var getInDeptUserUrl= getBeonePath("ESS")+"jcbg/getInDeptUser";//获取在该部门的user

            var findTxlOnGrUrl= getBeonePath("ESS")+"jcbg/findTxlOnGr";//加载个人通讯录


            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var findCode="JCBG_RCBG_TXL_CX"; //分页查询code
            var insertCode="JCBG_RCBG_TXL_ADD"; //新增code
            var deleteCode="JCBG_RCBG_TXL_DEL"; //删除code
            var updateCode="JCBG_RCBG_TXL_EDIT"; //修改code
        </script>
    </head>
    
<body style="">

<script type="text/html" id="toolHead">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="txl_xm" type="text" placeholder="姓名" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{#  if(hasRight("JCBG_RCBG_TXL_ADD")){ }}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{#  } }}
        </div>
    </div>
</script>

<script type="text/html" id="toolHeadDept">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="name" type="text" placeholder="姓名" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition1"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset1"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
        </div>
    </div>
</script>

<div class="operationModle" id="operationPageTable" style="display: none;">
    <form class="layui-form" id="formTable" action="" lay-filter="form">
        <input type="hidden" id="hiddenIdTable">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>姓名</label>
            <div class="layui-input-block">
                <input type="text" NAME="XM" title="姓名" lay-verify="required|special" maxlength="20" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>性别</label>
            <div class="layui-input-block">
                <select id="XB" name="XB" title="性别" lay-verify="required"></select>
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>联系电话</label>
            <div class="layui-input-block">
                <input type="text" NAME="LXDH" title="联系电话" lay-verify="required|phone" maxlength="11" autocomplete="off" class="layui-input">
            </div>
        </div>
        <button style="display: none;" id="formSubmit1" class="layui-btn" lay-submit lay-filter="formSubmit1">新增</button>
    </form>
</div>

<div class="layui-row">
    <div class="layui-col-md3" style="background: #fff;height: calc(100vh - 10px);width: 300px;margin-top: 10px;">
        <div class="layui-btn-container" style="padding: 10px 0px 0px 10px;">
            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-dept="addFirst"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加个人分组</button>
            <button type="button" class="layui-btn layui-btn-normal layui-btn-sm" lay-dept="reload"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;刷新</button>
        </div>
        <div id="deptTree" style="max-width: 280px; height: calc(100% - 60px); overflow: auto;"></div>
    </div>
    <div class="layui-col-md9" style="background: #fff;width: calc(100% - 310px);margin-left: 10px;height: calc(100vh - 10px);margin-top: 10px;">
        <table id="conTable" lay-filter="conTable"></table>
    </div>
</div>

<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenId">
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>分组名称</label>
            <div class="layui-input-block">
                <input type="text" NAME="MC" title="分组名称" lay-verify="required|special|unique" maxlength="20" autocomplete="off" class="layui-input">
            </div>
        </div>
        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
    </form>
</div>

</body>

</html>