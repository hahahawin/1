<%--
  倪杨
  2019-08-11
  学段管理html页面
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
        <title>员工信息</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/xzgl/ygxx.js"></script>
        <script type="text/javascript" src="<%=basePath%>js/md5.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess30";
            var tableName1="ess16";

            var loadUrl=getBeonePath("ESS")+"common/findOnPage";
            var insertUrl= getBeonePath("ESS")+"pt/insertYgxx";
            var updateUrl= getBeonePath("ESS")+"pt/updateYgxx";
            var deleteUrl= getBeonePath("ESS")+"pt/deleteYgxx";
            // var getUserBizLogUrl= getBeonePath("ESS")+"pt/getUserBizLog";
            var getUserBizLogUrl= getBeonePath("ESS")+"xzgl/getCodeInSysBizLog";

            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var ptFindCode="PTGL_YGGL_YGXX_CX"; //分页查询code
            var insertCode="PTGL_YGGL_YGXX_ADD"; //新增code
            var deleteCode="PTGL_YGGL_YGXX_DELE"; //删除code
            var updateCode="PTGL_YGGL_YGXX_EDIT"; //修改code
        </script>
        <style>
            .layui-table-view .layui-table td{height: 38px;}
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
                    <input id="ygxxYggh" type="text" placeholder="员工工号" autocomplete="off" class="layui-input">
                </div>
            </div>
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="ygxxXm" type="text" placeholder="姓名" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findOnCondition"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{# if(hasRight("PTGL_YGGL_YGXX_ADD")){}}
            <button class="layui-btn layui-btn-sm" lay-event="add"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{# }}}
        </div>
    </div>
</script>


<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="hiddenId">
        <input type="hidden" id="hiddenIDCard">
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>员工工号</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="GH" title="员工工号" lay-verify="required|unique|GH" maxlength="20" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>姓名</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="XM" id="XM" lay-verify="required|special" autocomplete="off" maxlength="10" class="layui-input" title="姓名">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>性别</label>
                    <div class="layui-input-block">
                        <select id="XB" NAME="XB" lay-verify="required" title="性别"></select>
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>身份证号码</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="SFZHM" id="SFZHM" lay-verify="required|idCard|uniqueUserExt" maxlength="18" autocomplete="off" class="layui-input" title="身份证号码">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>出生日期</label>
                    <div class="layui-input-block">
                        <input id="CSRQ" type="text" readonly NAME="CSRQ" title="出生日期" lay-verify="required" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>参加工作年月</label>
                    <div class="layui-input-block">
                        <input id="GZNY" type="text" NAME="GZNY" lay-verify="required|NY" maxlength="6" autocomplete="off" class="layui-input" title="参加工作年月">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>联系电话</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="LXDH" title="联系电话" lay-verify="required|phone" maxlength="12" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>籍贯</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="JG" lay-verify="required|special" autocomplete="off" maxlength="4" class="layui-input" title="籍贯">
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>民族</label>
                    <div class="layui-input-block">
                        <select id="MZ" NAME="MZ" lay-verify="required" title="民族"></select>
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>国籍</label>
                    <div class="layui-input-block">
                        <select id="GJDQ" NAME="GJDQ" lay-verify="required" title="国籍"></select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>政治面貌</label>
                    <div class="layui-input-block">
                        <select id="ZZMM" NAME="ZZMM" lay-verify="required" title="政治面貌"></select>
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>血型</label>
                    <div class="layui-input-block">
                        <select id="XX" NAME="XX" lay-verify="required" title="血型"></select>
                    </div>
                </div>
            </div>
        </div>

        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label"><span class="requiredMark">*</span>学历</label>
                    <div class="layui-input-block">
                        <select id="XL" NAME="XL" lay-verify="required" title="学历"></select>
                    </div>
                </div>
            </div>
        </div>
        <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
    </form>
</div>


</body>

<script></script>

</html>