<%@ page import="java.util.ResourceBundle" %><%--
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

    ResourceBundle resource = ResourceBundle.getBundle("application");
    String GGFileUploadSrc = resource.getString("filePath");
%>
<html>
    <head>
        <meta charset="UTF-8">
        <title>广告内容</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/pt/ptGgnrJs.js"></script>

        <script>

            var jsonASD=getJsonASD();
            var tableName="ess19";
            var GGFileUploadSrc='<%=GGFileUploadSrc%>';
            var status="";//添加修改是否成功的状态，默认是空

            var loadPtGgwUrl=getBeonePath("ESS")+"pt/findPtGgw";
            var delPtGgnrImgUrl=getBeonePath("ESS")+"pt/delPtGgnrImgByName";
            var delPtGgnrUrl=getBeonePath("ESS")+"pt/deleteGgnr";
            var loadUrl=getBeonePath("ESS")+"pt/selGgnrOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var filesUploadUrl= getBeonePath("ESS")+"pt/filesUpload";//多图片上传

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var ptFindCode="PTGL_XCGL_XCNR_CX"; //分页查询code
            var insertCode="PTGL_XCGL_XCNR_ADD"; //新增code
            var deleteCode="PTGL_XCGL_XCNR_DEL"; //删除code
            var updateCode="PTGL_XCGL_XCNR_EDIT"; //修改code
            var tyqyCode="PTGL_XCGL_XCNR_TYQY"; //停用启用code
        </script>
        <style>
            .layui-table img{max-height: 50px;}
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
                    <input id="ptGgnrName" type="text" placeholder="宣传名称" maxlength="20" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select class="layui-select" id="ptGgnrPid"></select>
                </div>
            </div>

        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("PTGL_XCGL_XCNR_ADD")){ }}
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
                    <label class="layui-form-label"><span class="requiredMark">*</span>宣传位名称</label>
                    <div class="layui-input-block">
                        <select id="PID" name="PID" lay-verify="required" lay-filter="PID" title="宣传位名称">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>内容名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="MC" lay-verify="required|unique" autocomplete="off" class="layui-input" maxlength="50" title="内容名称">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>开始时间</label>
                    <div class="layui-input-block">
                        <input type="text" id="BTIME" NAME="BTIME" lay-verify="required" autocomplete="off" class="layui-input" title="开始时间">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>结束时间</label>
                    <div class="layui-input-block">
                        <input type="text" id="ETIME" NAME="ETIME" lay-verify="required" autocomplete="off" class="layui-input" title="结束时间">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">图片资源</label>
                    <div class="layui-input-block">
                        <button type="button" class="layui-btn layui-btn-normal" id="testList">选择多文件</button>
                    </div>
                </div>
                <%--<div class="layui-col-md6">
                    <label class="layui-form-label">状态</label>
                    <div class="layui-input-block">
                        <input type="radio" name="ZT" lay-verify="required" checked value="1" title="停用">
                        <input type="radio" name="ZT" lay-verify="required" value="2" title="启用">
                    </div>
                </div>--%>
            </div>
        </div>
        <div id="fildUpload" >
            <div class="layui-upload" style="height: 200px;overflow-y: scroll">

                <div class="layui-upload-list">
                    <table class="layui-table" id="listA">
                        <thead>
                        <tr><th>文件名</th>
                            <th>大小</th>
                            <th>显示</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                        </thead>

                        <tbody id="demoList"></tbody>
                        <tfoot id="demoList1"></tfoot>
                    </table>
                </div>
                <%--<button type="button" class="layui-btn" id="testListAction">开始上传</button>--%>
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
    </form>
    <button style="display: none;" id="fileButton"></button>
</div>

<script>

</script>
</body>

<script>

</script>

</html>