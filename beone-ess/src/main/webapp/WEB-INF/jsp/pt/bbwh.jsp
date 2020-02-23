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
        <title>版本管理</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/pt/bbwh.js"></script>
        <script type='text/javascript' src='<%=basePath %>js/ueditor1_4_3/ueditor.config.js'></script>
        <script type='text/javascript' src='<%=basePath %>js/ueditor1_4_3/ueditor.all.js'></script>

        <script>
            var bash='<%=basePath%>';
            var jsonASD=getJsonASD();
            var tableName="ess43";
            var ydtpFile=new Array();

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";
            var getBblxUrl= getBeonePath("ESS")+"pt/getBblx";//获取版本类型
            var selYUrl= getBeonePath("ESS")+"pt/selYBB";
            var selWUrl= getBeonePath("ESS")+"pt/selWBB";
            var addBbwhZzgxUrl= getBeonePath("ESS")+"pt/addBbwhZzgx";
            var delBbwhZzgxUrl= getBeonePath("ESS")+"pt/delBbwhZzgx";
            // var BBuploadFileUrl= getBeonePath("ESS")+"pt/BBuploadFile";
            // var bbDelFileUrl= getBeonePath("ESS")+"pt/bbDelFile";
            var bbGetUserInfoUrl= getBeonePath("ESS")+"pt/bbGetUserInfo";

            // var bbwhFjDowloadFileUrl= getBeonePath("ESS")+"pt/bbwhFjDowloadFile";
            // var bbwhEwmDowloadFileUrl= getBeonePath("ESS")+"pt/bbwhEwmDowloadFile";

            var dowloadFileUrl= getBeonePath("ESS")+"common/dowloadFile";
            var delFileUrl= getBeonePath("ESS")+"common/delFile";
            var uploadFileUrl= getBeonePath("ESS")+"common/uploadFile";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var cxCode="PTGL_BBGL_LXGL_CX"; //分页查询code
            var addCode="PTGL_BBGL_LXGL_ADD";   //添加code
            var editCode="PTGL_BBGL_LXGL_EDIT"; //修改code
            var delCode="PTGL_BBGL_LXGL_DEL"; //删除code
            var shCode="PTGL_BBGL_BBWH_SH"; //删除code
            var fbCode="PTGL_BBGL_BBWH_FB"; //删除code
        </script>
        <style>
            #zzszPage .layui-table-cell{height: 28px;}
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
                    <select id="bbName" lay-search=""></select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="bbFbzt" lay-search=""></select>
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="bbShzt" lay-search=""></select>
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("PTGL_BBGL_BBWH_ADD")) {}}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{# }}}
        </div>
        <div style="float: left;font-size: 10px;color: red;line-height: 14px;">
            * 附件资料:只可上传zip/rar/apk/ipa 格式，大小不能超过200M
            <br>
            * 二维码图片:只可上传jpg/png 格式，大小不能超过100K
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
                    <label class="layui-form-label"><span class="requiredMark">*</span>项目名称</label>
                    <div class="layui-input-block">
                        <select id="ATT1" NAME="ATT1" lay-verify="required" title="项目名称" lay-search=""></select>
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label"><span class="requiredMark">*</span>版本号名称</label>
                    <div class="layui-input-block">
                        <input type="text" id="NAME" NAME="NAME" lay-verify="required" maxlength="10" autocomplete="off" class="layui-input" title="版本号名称">
                    </div>
                </div>
                <div class="layui-col-md4">
                    <label class="layui-form-label"><span class="requiredMark">*</span>审核人</label>
                    <div class="layui-input-block">
                        <select id="SHR" NAME="SHR" lay-verify="required" title="审核人" lay-search=""></select>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>项目成员</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="CY" lay-verify="required" autocomplete="off" maxlength="100" style="width: 865px;" class="layui-input" title="发布参与人">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">附件资料</label>
                    <div class="layui-input-block">
                        <button type="button" style="float: left;" class="layui-btn layui-btn-normal layui-btn-sm" id="chooseFj">选择文件</button>
                        <a style="float: left;" id="FJ" href=""></a>
                        <button style="float: left;display: none" type="button" class="layui-btn" id="uploadFj">开始上传</button>
                        <button style="float: left;" type="button" class="layui-btn  layui-btn-sm" id="fjDel" onclick="delFile(this)">删除</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">二维码图片</label>
                    <div class="layui-input-block">
                        <button type="button" style="float: left;" class="layui-btn layui-btn-normal layui-btn-sm" id="chooseEWM">选择文件</button>
                        <a style="float: left;" id="EWM" href=""></a>
                        <button style="float: left;display: none" type="button" class="layui-btn" id="uploadEWM">开始上传</button>
                        <button style="float: left;" type="button" class="layui-btn  layui-btn-sm" id="ewmDel" onclick="delFile(this)">删除</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">引导图片</label>
                    <div class="layui-input-block">
                        <button type="button" style="float: left;" class="layui-btn layui-btn-normal layui-btn-sm" id="chooseFJXX">选择文件</button>
                        <span class="requiredMark" style="margin-left:10px;">格式：png，单个大小限制100K。</span>
                        <button style="float: left;display: none;" type="button" class="layui-btn" id="uploadXMZL">开始上传</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item" style="min-height: 60px;overflow-y: auto">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"></label>
                    <div class="layui-input-block">
                        <table id="showFjxx" class="layui-table table-cell"></table>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item" style="height: 155px;">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>发布内容</label>
                    <div class="layui-input-block">
                        <textarea name="FBNR" id="FBNR" maxlength="1000" title="内容" lay-verify="required" style="height:100px;width:99.5%"></textarea>
                    </div>
                </div>
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">确定</button>
    </form>
</div>

<div class="operationModle" id="detailPage" style="display: none;">
    <form id="form1" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="detailHiddenId">
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">项目名称</label>
                    <div class="layui-input-block">
                        <input name="ATT1" class="layui-input boderNone">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label">版本号名称</label>
                    <div class="layui-input-block">
                        <input name="NAME" class="layui-input boderNone">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">审核人</label>
                    <div class="layui-input-block">
                        <input name="SHR" class="layui-input boderNone">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">项目成员</label>
                    <div class="layui-input-block">
                        <input name="CY" class="layui-input boderNone">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">附件资料</label>
                    <div class="layui-input-block">
                        <a id="shFj" href="javascript:void(0)" filePath=""></a>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">二维码图片</label>
                    <div class="layui-input-block">
                        <a href="" id="shEwm" filePath=""></a>
                        <%--<img style="width: 50px;height: 50px;" id="ewmTp" src="" alt="">--%>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item" style="height: 100px;overflow-y:auto;">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">发布内容</label>
                    <div class="layui-input-block" id="FBNR2">
                    </div>
                </div>
            </div>
        </div>

    </form>
</div>

<script type="text/html" id="toolbar1">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 100px;">
                    <input id="zzmc1" type="text" placeholder="组织名称" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <a class="layui-btn layui-btn-sm" lay-event="chaxun1"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</a>
            <a class="layui-btn layui-btn-sm" lay-event="reset1"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</a>
            <a class="layui-btn layui-btn-sm" lay-event="del"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;移除</a>
        </div>
    </div>
</script>

<script type="text/html" id="toolbar2">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 100px;">
                    <input id="zzmc2" type="text" placeholder="组织名称" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <a class="layui-btn layui-btn-sm" lay-event="chaxun2"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</a>
            <a class="layui-btn layui-btn-sm" lay-event="reset2"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</a>
            <a class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</a>
        </div>
    </div>
</script>
<div class="" id="zzszPage" style="display: none;">
    <div class="layui-container" style="height: 100%;width: 100%;padding-top:10px;">
        <form id="authForm" class="layui-form" action="" lay-filter="">
            <div class="layui-row layui-col-space20" style="">
                <div class="layui-col-xs6" style="height: 100%;padding: 5px;">
                    <table id="yTable" lay-filter="yTable"></table>
                </div>
                <div class="layui-col-xs6" style="height: 100%;padding: 5px;">
                    <table id="wTable" lay-filter="wTable"></table>
                </div>
            </div>
        </form>
    </div>
</div>
</body>

<script>


</script>

</html>