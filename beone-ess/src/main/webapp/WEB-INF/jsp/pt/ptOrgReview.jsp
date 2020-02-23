<%--
  倪杨
  2019-09-06
  组织申请审核界面
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
        <title>注册审批</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <link rel="stylesheet" href="<%=basePath%>css/table.css">
        <script type="text/javascript" src="<%=basePath%>js/pt/ptOrgJs.js"></script>

        <script>
            var jsonASD=getJsonASD();
            var tableName="ess6";
            var tableName2="ess15";
            var c_bslx = '';
            var status="";

            var findUrl=getBeonePath("ESS")+"common/find";
            // var loadConfigUrl=getBeonePath("ESS")+"common/findOnPage";
            var loadConfigUrl=getBeonePath("ESS")+"pt/selOrgListByZcsp";
            var insertConfigUrl= getBeonePath("ESS")+"common/insert";
            var updateConfigUrl= getBeonePath("ESS")+"common/update";
            var deleteUrl= getBeonePath("ESS")+"common/delete";
            var loadPidUrl= getBeonePath("ESS")+"pt/orgRegisterLoadPid";
            var loadCheckOrgInfoUrl= getBeonePath("ESS")+"pt/loadCheckOrgInfo";
            var auditOrgUrl= getBeonePath("ESS")+"pt/auditOrg";
            var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

            var ptFindCode="1"; //分页查询code
            var insertCode="2"; //新增code
            var deleteCode="PTGL_ZZGL_ZCSP_DEL"; //删除code
            var updateCode="PTGL_ZZGL_ZCSP_EDIT"; //修改code
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
                    <input id="orgName" type="text" placeholder="组织名称" autocomplete="off" class="layui-input">
                </div>
            </div>
        </div>
        <div class="layui-btn-container">
            <button class="layui-btn layui-btn-sm" lay-event="find"><img src="<%=basePath%>img/icon/nr_icon_search.png">&nbsp;&nbsp;查询</button>
            <button class="layui-btn layui-btn-sm" lay-event="reset"><img src="<%=basePath%>img/icon/nr_icon_cz.png">&nbsp;&nbsp;重置</button>
        </div>
    </div>
</script>

<%--&lt;%&ndash;table记录操作按钮&ndash;%&gt;--%>
<%--<script type="text/html" id="barConfig">--%>
    <%--<div class="bar">--%>
        <%--{{#  if(d.SBKT!='4'){ }}--%>
        <%--<a  title="审核" lay-event="check"><img src="../img/icon/nr_icon_bj.png"></a>--%>
        <%--{{#  } }}--%>

        <%--{{#  if(d.ZT=='2'){ }}--%>
            <%--<a  title="停用" lay-event="close"><img src="../img/icon/cz_icon_stop.png"></a>--%>
        <%--{{#  } }}--%>

        <%--{{#  if(d.ZT=='1'){ }}--%>
            <%--<a  title="启用" lay-event="open"><img src="../img/icon/cz_icon_zjsq.png"></a>--%>
        <%--<a  title="删除" lay-event="del"><img src="../img/icon/cz_icon_del.png"></a>--%>
        <%--{{#  } }}--%>
    <%--</div>--%>
<%--</script>--%>

<%--添加修改的table页面--%>
<div class="operationModle" id="operationPage" style="display: none;">
    <form id="form" class="layui-form" action="" lay-filter="form">
        <input type="hidden" id="ConfigHiddenId">
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">上级组织</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="PNAME" title="上级组织" readonly autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label">组织名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="NAME" title="组织名称" readonly autocomplete="off" class="layui-input">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">组织编码</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="CODE" autocomplete="off" readonly class="layui-input" title="组织编码">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label">部署类型</label>
                    <div class="layui-input-block">
                        <input type="radio" disabled="disabled" name="BSLX" lay-verify="required" checked value="1" title="平台">
                        <input type="radio" disabled="disabled" name="BSLX" lay-verify="required" value="2" title="独立">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">负责人姓名</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="FZR"  autocomplete="off" readonly class="layui-input" title="组织编码">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label">联系电话</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="LXDH"  autocomplete="off" readonly class="layui-input" title="组织编码">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">电子邮箱</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="DZYX"  autocomplete="off" readonly class="layui-input" title="组织编码">
                    </div>
                </div>
                <div class="layui-col-md6">
                    <label class="layui-form-label">学段</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="XDDM"  autocomplete="off" readonly class="layui-input" title="学段">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-md6">
                    <label class="layui-form-label">登录网址</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="DLWZ"  autocomplete="off" readonly class="layui-input" title="登录网址">
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item">
            <div class="layui-row">
                <div class="layui-col-6">
                    <label class="layui-form-label" style="color: red">审核结果</label>
                    <div class="layui-input-block">
                        <input type="radio" name="SBKT" value="3" title="拒绝" lay-filter='sfkt' checked>
                        <input type="radio" name="SBKT" value="4" title="通过" lay-filter='sfkt'>
                    </div>
                </div>
            </div>
        </div>
        <div class="layui-form-item" id="bspts" style="display: none;">
            <div class="layui-row">
                <div class="layui-col-6">
                    <label class="layui-form-label" style="color: red">部署项目</label>
                    <div class="layui-input-block">
                        <input type="radio" name="BSPT" value="1" lay-filter='BSPT' title="BCCA" checked>
                        <input type="radio" name="BSPT" value="2" lay-filter='BSPT' title="教师">
                    </div>
                </div>
            </div>
        </div>

        <button style="display: none;" id="addConfigSub" class="layui-btn" lay-submit lay-filter="addConfigSub">新增</button>
    </form>
</div>


</body>

<script></script>

</html>