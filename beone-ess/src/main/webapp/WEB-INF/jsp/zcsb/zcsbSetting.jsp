<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
    <head>
        <meta charset="UTF-8">
        <title>授权账户</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/zcsb/zcsbSetting.js"></script>

        <script>
            var jsonASD = getJsonASD();
            var tableName="ess24";
            var tableName2="ess26";
            var tableName3="ess27";
            var status="";

            var loadConfigUrl=getBeonePath("ESS")+"zcsb/selSmhlist";
            var insertConfigUrl= getBeonePath("ESS")+"zcsb/insertSetting";
            var updateConfigUrl= getBeonePath("ESS")+"common/update";
            var deleteConfigUrl= getBeonePath("ESS")+"common/delete";
            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证
            var loadselectUrl = getBeonePath("ESS")+"common/find";
            var loadAreaUrl = getBeonePath("ESS")+"zcsb/selAreaList";
            var dingyueUrl = getBeonePath("ESS")+"zcsb/dySetting";
            var syncSbxxUrl = getBeonePath("ESS")+"zcsb/syncSbxx";
            var sbbdUrl = getBeonePath("ESS")+"zcsb/sbbinding";
            var unbindUrl = getBeonePath("ESS")+"zcsb/unbind";
            var loadOrgUrl = getBeonePath("ESS")+"zcsb/selOrgNotInSetting";

            var ptFindCode="ZCSB_ZKGL_SQZH_CX"; //分页查询code
            var insertCode="ZCSB_ZKGL_SQZH_ADD"; //新增code
            var deleteCode="ZCSB_ZKGL_SQZH_DEL"; //新增code
            var dingyueCode = "ZCSB_ZKGL_SQZH_DY";//订阅
            var bingCode = "ZCSB_ZKGL_SQZH_BD";//绑定
            var syncCode = "ZCSB_ZKGL_SQZH_SYNC";//同步
            var tyqyCode = "ZCSB_ZKGL_SQZH_TYQY";//停用启用

        </script>
    </head>
    
<body>
<%--table--%>
<table id="config" lay-filter="config"></table>


<%--table头部--%>
<script type="text/html" id="toolbarConfig">
    <div class="operationTableTool">
        <div class="layui-form-item">
            <div class="layui-inline">
                <div class="layui-input-inline" style="width: 150px;">
                    <input id="account" type="text" placeholder="BCCA授权账号" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="findConfig"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
            {{#  if(hasRight("ZCSB_ZKGL_SQZH_ADD")){ }}
            <button class="layui-btn layui-btn-sm" lay-event="addConfig"><img src="<%=basePath%>img/icon/nr_icon_tj.png">&nbsp;&nbsp;添加</button>
            {{#  } }}
        </div>
    </div>
</script>

<%--添加修改的table页面--%>
<div id="CONFIG" class="operationModle" style="display: none;">
    <form id="configForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item" style="clear: both;margin-top: 10px;">
            <label class="layui-form-label"><span class="requiredMark">*</span>所属组织</label>
            <div class="layui-input-block">
                <select id="org_id" name="org_id" lay-verify="required" lay-filter="org_id">
                </select>
            </div>
        </div>
        <div class="layui-form-item">
            <input type="hidden" id="ID">
            <label class="layui-form-label"><span class="requiredMark">*</span>选择地区</label>
            <div class="layui-input-inline" style="width: 140px;">
                <select id="province10" name="province10" lay-verify="required" lay-filter="province10">
                    <option value="">请选择省</option>
                </select>
            </div>
            <div class="layui-input-inline" style="width: 140px;">
                <select id="city10" name="city10" lay-filter="city10">
                    <option value="">请选择市</option>
                </select>
            </div>
            <div class="layui-input-inline" style="width: 150px;">
                <select id="district10" name="district10" lay-filter="district10">
                    <option value="">请选择县/区</option>
                </select>
            </div>
        </div>
        <div class="layui-form-item" style="clear: both;margin-top: 10px;">
            <label class="layui-form-label"><span class="requiredMark">*</span>姓名</label>
            <div class="layui-input-block">
                <input type="text" NAME="name" id="name" title="建成年月" lay-verify="required|special" maxlength="10" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>性别</label>
            <div class="layui-input-block">
                <input type="radio" name="sex" value="1" title="男" checked>
                <input type="radio" name="sex" value="2" title="女">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>身份证号</label>
            <div class="layui-input-block">
                <input type="text" NAME="sfzh" title="身份证号" lay-verify="required|identity" maxlength="18" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>手机号码</label>
            <div class="layui-input-block">
                <input type="text" NAME="phone" title="手机号码" lay-verify="required|phone" maxlength="11" autocomplete="off" class="layui-input">
            </div>
        </div>
        <div class="layui-form-item">
            <label class="layui-form-label"><span class="requiredMark">*</span>注册邮箱</label>
            <div class="layui-input-block">
                <input type="text" NAME="email" title="注册邮箱" lay-verify="required|email" maxlength="20" autocomplete="off" class="layui-input">
            </div>
        </div>

        <button style="display: none;" id="addConfigSub" class="layui-btn" lay-submit lay-filter="addConfigSub">新增</button>
    </form>
</div>

<%--添加修改的table页面--%>
<div id="sbbding" class="operationModle" style="display: none;">
    <form id="sbbdForm" class="layui-form" action="" lay-filter="configForm">
        <div class="layui-form-item">
            <div class="layui-input-inline" style="width: 200px;margin-left: 20px;">
                <input type="text" id="sqm" name="sqm" class="layui-input" placeholder="请输入授权码">
            </div>
            <div class="layui-input-inline" style="width: 200px;">
                <input type="text" id="zpm" name="zpm" class="layui-input" placeholder="请输入正品号">
            </div>
            <div class="layui-input-inline" style="width: 100px;">
                <button type="button" class="layui-btn layui-btn-sm" style="height: 25px;line-height: 25px;" onclick="addSqxx();">添加</button>
            </div>
        </div>
        <div id="tjbdsblist">

        </div>
    </form>
</div>

</body>

<script>
    //添加行
    var line = 0;
    function addSqxx(){
        var str = '<div class="layui-form-item" style="margin-top: 5px;" id="line'+line+'">';
        str += '<div class="layui-input-inline" style="width: 200px;margin-left: 20px;"><input type="text" name="sqm" class="layui-input" placeholder="请输入授权码"></div>';
        str += '<div class="layui-input-inline" style="width: 200px;"><input type="text" name="zpm" class="layui-input" placeholder="请输入正品号"></div>';
        str += '<div class="layui-input-inline" style="width: 100px;"><button type="button" class="layui-btn layui-btn-sm layui-btn-danger" style="height: 25px;line-height: 25px;" onclick=delSqxx("line'+line+'")>删除</button></div>';
        str += '</div>';
        $("#tjbdsblist").append(str);
        $("#sbbding").scrollTop = $("#sbbding").scrollHeight;
        line = line + 1;
    }
    //删除行
    function delSqxx(id){
        $("#"+id).remove();
    }
</script>

</html>