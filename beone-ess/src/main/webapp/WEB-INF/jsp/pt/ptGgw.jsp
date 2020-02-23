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
        <title>广告位</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/pt/ptGgwJs.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess18";

            var status="";//添加修改是否成功的状态，默认是空

            var loadOrgAddUrl=getBeonePath("ESS")+"pt/findInitAdminOrgAdd";
            var loadOrgUpdUrl=getBeonePath("ESS")+"pt/findInitAdminOrgUpd";
            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var xndFindCode="1"; //学年度下来列表框的查询 code
            var ptFindCode="PTGL_GGGL_GGW_CX"; //分页查询code
            var insertCode="PTGL_XCGL_XCW_ADD"; //新增code
            var deleteCode="PTGL_XCGL_XCW_DEL"; //删除code
            var updateCode="PTGL_XCGL_XCW_EDIT"; //修改code
            var tyqyCode="PTGL_XCGL_XCW_TYQY"; //修改code
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
                    <input id="ggw_mc" type="text" placeholder="名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="ggw_code" type="text" placeholder="代码" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(isadmin=='2'){ }}
            {{# if(hasRight("PTGL_XCGL_XCW_ADD")){ }}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{#  } }}
            {{#  } }}
        </div>
    </div>
</script>


<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenId">
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>宣传位名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="MC" lay-verify="required|unique" autocomplete="off" class="layui-input" maxlength="20" title="广告位名称">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>宣传位代码</label>
                    <div class="layui-input-block">
                        <select NAME="CODE" id="CODE" lay-verify="required|code|unique" title="宣传位代码"></select>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md5">
                    <label class="layui-form-label"><span class="requiredMark">*</span>最小宽度(px)</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="WT" lay-verify="required|positiveInteger" autocomplete="off" maxlength="4" class="layui-input" title="广告位宽度">
                    </div>
                </div>
                <div class="layui-col-md5">
                    <label class="layui-form-label"><span class="requiredMark">*</span>最小高度(px)</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="HT" lay-verify="required|positiveInteger" autocomplete="off" maxlength="4" class="layui-input" title="广告位高度">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md5">
                    <label class="layui-form-label"><span class="requiredMark">*</span>大小(KB)</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="ZP_SIZE" lay-verify="required|positiveInteger" maxlength="3" autocomplete="off" class="layui-input" title="图片大小">
                    </div>
                </div>
                <div class="layui-col-md5">
                    <label class="layui-form-label"><span class="requiredMark">*</span>图片张数</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="ZT_MNUM" lay-verify="required|positiveInteger" maxlength="1" autocomplete="off" class="layui-input" title="图片张数">
                    </div>
                </div>
                <%--<div class="layui-col-md5">
                    <label class="layui-form-label">状态</label>
                    <div class="layui-input-block">
                        <input type="radio" name="ZT" lay-verify="required" checked value="2" title="启用">
                        <input type="radio" name="ZT" lay-verify="required" value="1" title="停用">
                    </div>
                </div>--%>
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
    </form>
</div>


</body>

<script>

</script>

</html>