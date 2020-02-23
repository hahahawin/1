<%--
  倪杨
  积分规则
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
        <title>积分规则</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/pt/jfgz.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess58";

            var status="";//添加修改是否成功的状态，默认是空

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var ptFindCode="PTGL_BZJF_JFGZ_CX"; //分页查询code
            var insertCode="PTGL_BZJF_JFGZ_ADD"; //新增code
            var deleteCode="PTGL_BZJF_JFGZ_DEL"; //删除code
            var updateCode="PTGL_BZJF_JFGZ_EDIT"; //修改code
            var tyqyCode="PTGL_BZJF_JFGZ_TYQY"; //停用启用code
        </script>
        <style>
            .detailForm .layui-input-block{min-height: 26px;line-height: 26px;}
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
                    <input id="jfgzmc" type="text" placeholder="规则名称" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("PTGL_BZJF_JFGZ_CX")){}}
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
                    <label class="layui-form-label"><span class="requiredMark">*</span>规则名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="MC" maxlength="25" lay-verify="required|special" autocomplete="off" class="layui-input" title="规则名称">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>规则编码</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="CODE" maxlength="25" lay-verify="required|special|code|unique" autocomplete="off" class="layui-input" title="规则编码">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>规则分类</label>
                    <div class="layui-input-block">
                        <select name="JFGZFL" id="JFGZFL" title="规则分类" lay-verify="required" lay-filter="JFGZFL"></select>
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>规则分值类型</label>
                    <div class="layui-input-block">
                        <SELECT name="FZFL" title="规则分值类型" lay-verify="required" lay-filter="FZFL">
                            <option value="">请选择</option>
                            <option value="1">固定值</option>
                            <option value="2">百分比</option>
                        </SELECT>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>规则分值</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="FZ" maxlength="3" lay-verify="required|special|positiveInteger" autocomplete="off" class="layui-input" title="规则分值">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <span class="requiredMark" id="fzgz"></span>
                </div>
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">保存</button>
        <button style="display: none;" id="formSubmit1" class="layui-btn" lay-submit lay-filter="formSubmit1">草稿</button>

    </form>
</div>
</body>
</html>