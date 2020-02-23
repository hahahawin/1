<%--
  倪杨
  房间公告
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
        <title>房间公告</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/jcbg/fjgg.js"></script>
        <script type='text/javascript' src='<%=basePath %>js/ueditor1_4_3/ueditor.config.js'></script>
        <script type='text/javascript' src='<%=basePath %>js/ueditor1_4_3/ueditor.all.js'></script>
        <script>
            var jsonASD=getJsonASD();
            var tableName="ess48";

            var status="";//添加修改是否成功的状态，默认是空

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";
            // var xwtzUploadFileUrl= getBeonePath("ESS")+"jcbg/xwtzUploadFile";
            // var xwtzDelFileUrl= getBeonePath("ESS")+"jcbg/xwtzDelFile";
            var getFjListUrl= getBeonePath("BCCA")+"jcbg/getFjList";

            var dowloadFileUrl= getBeonePath("ESS")+"common/dowloadFile";
            var delFileUrl= getBeonePath("ESS")+"common/delFile";
            var uploadFileUrl= getBeonePath("ESS")+"common/uploadFile";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var ptFindCode="JCBG_TZGG_FJGG_CX"; //分页查询code
            var insertCode="JCBG_TZGG_FJGG_ADD"; //新增code
            var deleteCode="JCBG_TZGG_FJGG_DEL"; //删除code
            var updateCode="JCBG_TZGG_FJGG_EDIT"; //修改code
            var zfCode="JCBG_TZGG_FJGG_ZF"; //作废code
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
            <%--<div class="layui-inline">--%>
                <%--<div class="layui-input-inline" style="width: 150px;">--%>
                    <%--<select id="ggLX"></select>--%>
                <%--</div>--%>
            <%--</div>--%>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="ggBt" type="text" placeholder="标题" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("JCBG_TZGG_FJGG_ADD")){}}
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
                <%--<div class="layui-col-md6">--%>
                    <%--<label class="layui-form-label"><span class="requiredMark">*</span>类型</label>--%>
                    <%--<div class="layui-input-block">--%>
                        <%--<select name="LX" id="LX" title="类型" lay-filter="LX" lay-verify="required"></select>--%>
                    <%--</div>--%>
                <%--</div>--%>
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>标题</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="BT" maxlength="25" style="width: 800px;" lay-verify="required|special" autocomplete="off" class="layui-input" title="标题">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">信息来源</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="XXLY" maxlength="50" lay-verify="special" autocomplete="off" class="layui-input" title="信息来源">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md5">
                    <label class="layui-form-label"><span class="requiredMark">*</span>公布群体</label>
                    <div class="layui-input-block">
                        <select name="GBQT" id="GBQT" title="公布群体" lay-verify="required">
                            <option value="">请选择公布群体</option>
                            <option value="9">所有</option>
                        </select>
                    </div>
                </div>
                <div class="layui-col-md5">
                    <label class="layui-form-label"><span class="requiredMark">*</span>房间</label>
                    <div class="layui-input-block">
                        <select name="YWID" id="YWID" title="房间" lay-verify="required"></select>
                    </div>
                </div>
            </div>
        </div>

        <div id="jjDiv" style="display: none" class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md4">
                    <label class="layui-form-label"><span class="requiredMark">*</span>紧急程度</label>
                    <div class="layui-input-block">
                        <select name="JJCD" id="JJCD" title="紧急程度"></select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label"><span class="requiredMark">*</span>失效日期</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="SXSJ" id="SXSJ" autocomplete="off" class="layui-input" title="标题">
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label"><span class="requiredMark">*</span>提醒方式</label>
                    <div class="layui-input-block">
                        <select name="TXFS" id="TXFS" title="提醒方式"></select>
                    </div>
                </div>
            </div>
        </div>


        <div class="layui-form-item" style="height: 210px;">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>内容</label>
                    <div class="layui-input-block">
                        <textarea name="NR" id="NR" maxlength="100" title="内容" lay-verify="required" style="height:150px;width:99.5%"></textarea>
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
                        <span class="requiredMark" style="margin-left:10px;">格式：zip,doc,docx，单个大小限制50M。</span>
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
        <button style="display: none;" id="formSubmit1" class="layui-btn" lay-submit lay-filter="formSubmit1">新增</button>
        <a style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">存为草稿</a>
    </form>
</div>
<%--详情页面--%>
<div id="CONFIGDETAIL" class="detailForm" style="display: none;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm" style="">
        <div class="layui-form-item">
            <%--<div class="layui-col-md6">--%>
                <%--<label class="layui-form-label">类型</label>--%>
                <%--<div class="layui-input-block">--%>
                    <%--<div name="LX" style="margin-top: 3px;"></div>--%>
                <%--</div>--%>
            <%--</div>--%>
            <div class="layui-col-md10">
                <label class="layui-form-label">标题</label>
                <div class="layui-input-block">
                    <div name="BT" style="margin-top: 3px;"></div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md6">
                <label class="layui-form-label">公布群体</label>
                <div class="layui-input-block">
                    <div name="GBQT" style="margin-top: 3px;"></div>
                </div>
            </div>
            <div class="layui-col-md6">
                <label class="layui-form-label">房间</label>
                <div class="layui-input-block">
                    <div name="FJ" style="margin-top: 3px;"></div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md12">
                <label class="layui-form-label">信息来源</label>
                <div class="layui-input-block">
                    <div name="XXLY" style="margin-top: 3px;"></div>
                </div>
            </div>
        </div>
        <hiddenPart id="TZHiddenPart" style="display: none">
            <div class="layui-form-item">
                <div class="layui-col-md4">
                    <label class="layui-form-label">紧急程度</label>
                    <div class="layui-input-block">
                        <div name="JJCD" style="margin-top: 3px;"></div>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">失效日期</label>
                    <div class="layui-input-block">
                        <div name="SXSJ" style="margin-top: 3px;"></div>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label">提醒方式</label>
                    <div class="layui-input-block">
                        <div name="TXFS" style="margin-top: 3px;"></div>
                    </div>
                </div>
            </div>
        </hiddenPart>
        <div class="layui-form-item">
            <div class="layui-col-md12">
                <label class="layui-form-label">内容</label>
                <div class="layui-input-block">
                    <div name="NR" style="margin-top: 3px;"></div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-col-md12">
                <label class="layui-form-label">附件</label>
                <div class="layui-input-block">
                    <div name="showFj" style="margin-top: 3px;"></div>
                </div>
            </div>
        </div>
    </form>
</div>

</body>

<script></script>

</html>