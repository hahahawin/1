<%--
  倪杨
  菜单引导
  2020/2/11
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
        <title>帮助中心</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/pt/cdyd.js"></script>

        <script type='text/javascript' src='<%=basePath %>js/ueditor1_4_3/ueditor.config.js'></script>
        <script type='text/javascript' src='<%=basePath %>js/ueditor1_4_3/ueditor.all.js'></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess57";
            var tableName2="ess1";
            var tableName3="ess42";
            var tableName4="ess53"; //自定义菜单

            var status="";//添加修改是否成功的状态，默认是空

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var findUrl=getBeonePath("ESS")+"common/find";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";
            // var xwtzUploadFileUrl= getBeonePath("ESS")+"jcbg/xwtzUploadFile";
            // var xwtzDelFileUrl= getBeonePath("ESS")+"jcbg/xwtzDelFile";

            var dowloadFileUrl= getBeonePath("ESS")+"common/dowloadFile";
            var delFileUrl= getBeonePath("ESS")+"common/delFile";
            var uploadFileUrl= getBeonePath("ESS")+"common/uploadFile";

            var loadRightTreeUrl= getBeonePath("ESS")+"sys/loadRightTree";//加载right表生成树
            var loadZdycdTreeUrl= getBeonePath("ESS")+"sys/loadSysZdycdTree";//加载zdycd表生成树


            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var ptFindCode="PTGL_BZJF_CDYD_CX"; //分页查询code
            var insertCode="PTGL_BZJF_CDYD_ADD"; //新增code
            var deleteCode="PTGL_BZJF_CDYD_DEL"; //删除code
            var updateCode="PTGL_BZJF_CDYD_EDIT"; //修改code
        </script>
        <style>
            .layui-table td, .layui-table th {
                padding: 1px 15px;
            }
            .layui-layer-page .layui-layer-content{overflow-y: auto !important}
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
                    <select id="ssxm"></select>
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("PTGL_BZJF_CDYD_ADD")){}}
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
                <div class="layui-col-md4">
                    <label class="layui-form-label"><span class="requiredMark">*</span>所属项目</label>
                    <div class="layui-input-block">
                        <select name="XM" id="XM" title="所属项目" lay-verify="required">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label"><span class="requiredMark">*</span>提醒次数</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="CS" maxlength="5" lay-verify="required|special|positiveInteger" autocomplete="off" class="layui-input" title="提醒次数">
                        </select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label"><span class="requiredMark">*</span>提醒天数</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="DS" maxlength="5" lay-verify="required|special|positiveInteger" autocomplete="off" class="layui-input" title="提醒天数">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>所属菜单</label>
                    <div class="layui-input-block">
                        <input type="text" maxlength="25" readonly lay-verify="required|special" id="SSCD" autocomplete="off" class="layui-input" title="所属菜单">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">附件</label>
                    <div class="layui-input-block">
                        <button type="button" style="float: left;" class="layui-btn layui-btn-normal layui-btn-sm" id="chooseFJXX">选择文件</button>
                        <span class="requiredMark" style="margin-left:10px;">最多上传3个图片，每个附件大小限制为：2MB。</span>
                        <button style="float: left;display: none;" type="button" class="layui-btn" id="uploadXMZL">开始上传</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item" style="min-height: 70px;overflow-y: auto">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"></label>
                    <div class="layui-input-block">
                        <table id="showFjxx" class="layui-table table-cell"></table>
                    </div>
                </div>
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
    </form>
</div>


<div id="CdChoosePage" style="display: none">
    <div id="tree" style="width: 400px; height: 350px; overflow: auto;"></div>
    <div style="width: 400px;height: 50px;">
        <div class="layui-col-md12">
            <label class="layui-form-label">选中菜单</label>
            <div class="layui-input-block">
                <input type="text" id="XZCD" readonly class="layui-input" hiddenCdId="" style="width: 90%">
            </div>
        </div>
    </div>
</div>
</body>

</html>