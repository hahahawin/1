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
        <title></title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/pt/bblx.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess42";

            var status="";//添加修改是否成功的状态，默认是空

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"common/insert";
            var updateUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";

            var BBuploadFileUrl= getBeonePath("ESS")+"pt/BBuploadFile";
            var bbDelFileUrl= getBeonePath("ESS")+"pt/bbDelFile";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var cxCode="PTGL_BBGL_LXGL_CX"; //分页查询code
            var addCode="PTGL_BBGL_LXGL_ADD";   //添加code
            var editCode="PTGL_BBGL_LXGL_EDIT"; //修改code
            var delCode="PTGL_BBGL_LXGL_DEL"; //删除code
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
                    <input id="lxName" type="text" placeholder="项目名称" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <select id="lxZT" lay-search=""></select>
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("PTGL_BBGL_LXGL_ADD")) {}}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{# }}}
        </div>
        <div style="float: right;font-size: 10px;color: red;line-height: 14px;">
            * 附件资料:只可上传zip/rar/apk/ipa 格式，大小不能超过200M
            <br>
            * 项目图片/logo:只可上传jpg/png 格式，大小不能超过100K
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
                    <label class="layui-form-label"><span class="requiredMark">*</span>项目名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="NAME" lay-verify="required|unique" maxlength="50" autocomplete="off" class="layui-input" title="项目名称">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>英文名称</label>
                    <div class="layui-input-block">
                        <select id="YWMC" NAME="YWMC" lay-verify="required" title="英文名称" lay-search=""></select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>立项时间</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="LXSJ" ID="LXSJ" lay-verify="required" autocomplete="off" class="layui-input" title="立项时间">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>项目类型</label>
                    <div class="layui-input-block">
                        <select id="LX" NAME="LX" lay-verify="required" title="项目类型" lay-search=""></select>
                    </div>
                </div>
            </div>
        </div>


        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>菜单表</label>
                    <div class="layui-input-block">
                        <select name="ATT1" lay-verify="required" >
                            <option>请选择</option>
                            <option value="1">平台</option>
                            <option value="2">自定义</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>发布参与人</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="FBCYR" lay-verify="required" maxlength="100" autocomplete="off" class="layui-input" title="发布参与人">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label"><span class="requiredMark">*</span>项目参与人</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="XMCYR" lay-verify="required" maxlength="100" autocomplete="off" class="layui-input" title="项目参与人">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">附件资料</label>
                    <div class="layui-input-block">
                        <button type="button" style="float: left;" class="layui-btn layui-btn-normal layui-btn-sm" id="chooseXMZL">选择文件</button>
                        <a style="float: left;" id="XMZL" href=""></a>
                        <button style="float: left;display: none" type="button" class="layui-btn" id="uploadXMZL">开始上传</button>
                        <button style="float: left;" type="button" class="layui-btn  layui-btn-sm" onclick="delFj()">删除</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md12">
                    <label class="layui-form-label">项目图片/logo</label>
                    <div class="layui-input-block">
                        <button type="button" style="float: left;" class="layui-btn layui-btn-normal layui-btn-sm" id="chooseLOGO">选择文件</button>
                        <a style="float: left;" id="LOGO" href=""></a>
                        <button style="float: left;display: none" type="button" class="layui-btn" id="uploadLOGO">开始上传</button>
                        <button style="float: left;" type="button" class="layui-btn  layui-btn-sm" onclick="delLOGO()">删除</button>
                    </div>
                </div>
            </div>
        </div>

        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
        <button style="display: none;" id="formSubmit1" class="layui-btn" lay-submit lay-filter="formSubmit1">发布</button>
    </form>
</div>


</body>

<script>

</script>

</html>