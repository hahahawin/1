<%@ page import="java.util.Map" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
%>
<html>
<head>
    <%--注意：当用include 引入的jsp文件中，各个js方法名、变量名，css类名等不能重复 --%>
        <base href="<%=basePath%>">
        <title>自定义菜单</title>
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <jsp:include page="../introduce/common.jsp"></jsp:include>
        <script src="<%=basePath%>js/sys/zdycd.js"></script>
        <%--<link rel="stylesheet" href="<%=basePath%>css/sys/sysRightCss.css">--%>
    <style>
        .icon{background: #F8F9FB;width: 28px;height: 28px;float: left;margin:2px 2px 2px 2px;}
        .icon:hover{cursor: pointer;background-color: red}

        .icon4{background: #F8F9FB;width: 16px;height: 16px;float: left;margin:2px 2px 2px 2px;}

        .directory{width: 78px;height: 58px;padding-top:10px;float: left;text-align: center;}
        .directory div{margin-top: 5px;}
        .directory img{width: 18px;height: 18px;}
        .directory label{font-size: 12px;margin-top:10px;font-weight: 400;}
        .directory:hover{cursor:pointer;color:#92c5f9;}
        .cdactive{color:#92C5F9;}


        .editTitle{width: 100%;height: 50px;line-height: 50px;border-bottom: 1px #E7EAED solid;padding: 0 10px 0 10px;font-weight: bold}


        /* 设置滚动条的样式 */
        ::-webkit-scrollbar {width:5px;background-color: #fff;}
        /* 滚动槽 */
        ::-webkit-scrollbar-track {border-radius:10px;}
        /* 滚动条滑块 */
        ::-webkit-scrollbar-thumb {border-radius:10px;background:#8796a5;}
    </style>
    <script>

        var xmid = ''; //项目ID
        var key1 = "";  //图标路径标识
        var FID = "" ; //上级ID
        var FNAME = "" ; //上级名称
        var rightParam ; //一级权限对象
        var rightParam2 ; //二级权限对象
        var rightYwpt = '' ; //用于存放三级菜单的平台权限类型
        var tableName = 'ess42' ; //项目类型
        var tableName2 = 'ess53'; //自定义菜单
        var rightCxCode = "PTGL_CDGL_ZDYCD_CX" ; //查询code
        var rightAddCode = "PTGL_CDGL_ZDYCD_ADD" ; //添加code
        var rightDelCode = "PTGL_CDGL_ZDYCD_DEL" ; //删除code
        var rightEditCode = "PTGL_CDGL_ZDYCD_EDIT" ; //修改code

        var jsonASD = getJsonASD(); //权限验证
        var commFindUrl = getBeonePath('ESS')+'common/find' ;
        var commInsertUrl = getBeonePath('ESS')+'common/insert' ;
        var commUpdateUrl = getBeonePath('ESS')+'common/update' ;
        var commDeleUrl = getBeonePath('ESS')+'common/delete' ;
        var uniqueUrl= getBeonePath("ESS")+"sys/uniqueZdycd"; //唯一性验证
        var loadZdycdUrl= getBeonePath("ESS")+"sys/loadZdycdTree";//特殊加载，涉及到上级部门PID
    </script>
</head>
<body>
    <div class="layui-container" style="height: 100%;width: 100%;padding:10px 0px 0px 0px;">
        <div class="layui-row">
            <div class="layui-col-xs3" style="width: 250px;height: 100%;padding-right: 10px;">
                <div class="layui-row grid-demo">
                    <div class="layui-col-md12" style="width: 100%;height: 39%;background: #fff;font-size: 12px;color: #333">
                        <div class="layui-form-item" style="height: 50px;border-bottom: 1px solid #EEF5F9;margin-bottom: 0px;">
                            <label class="" style="width: 50px;font-size: 12px;color: #455A64;float: left;margin-top: 15px;margin-left: 5px;">所属项目</label>
                            <div  class="" style="width: 170px;margin-top: 13px;float: right;">
                                <select id="ssxm"  lay-verify="" lay-search  lay-filter="ssxm" onchange="loadFirst(this.value);" style="font-size: 12px;border-color: #CED4DA;color: #666666;height: 24px;line-height: 24px;">
                                    <option>请选择所属项目</option>
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item" id="firstCon" style="width: 100%;height: calc(100% - 50px);overflow:auto;"></div>
                    </div>

                    <div class="layui-col-md12" style="width: 100%;height: 2%;"></div>

                    <div class="layui-col-md12" style="width: 100%;height: 59%;background: #fff;overflow:auto;font-size: 12px;color: #333">
                        <div onclick="firstAdd2();" style="width: 218px;height: 26px;background: #D3E8FF;border: 1px solid #87C3FF;margin: 5px 10px; text-align: center;line-height: 26px;cursor: pointer">
                            <img src="img/icon/add_icon.png"/>
                            <span style="font-size: 12px;color: #4BA3FB">添加</span>
                        </div>
                        <div id="deptTree"></div>
                    </div>
                </div>
            </div>
            <div class="layui-col-xs4 third" style="width: calc(100% - 260px);background: #fff;height: 100%;margin-right: 10px;">
                <div class="layui-col-md12 editTitle" >
                    <label>
                        操作模式
                    </label>
                </div>
                <div class="layui-col-md12 editContent operationModle" style="overflow:auto;">
                    <form id="editForm" class="layui-form" action="" lay-filter="editForm">
                        <div class="layui-form-item">
                            <div class="layui-col-md6">
                                <label class="layui-form-label">父节点</label>
                                <div class="layui-input-block">
                                    <input type="hidden" name="ID" id="ID" autocomplete="off" class="layui-input" readonly>
                                    <input type="hidden" name="PID" id="PID" autocomplete="off" class="layui-input" readonly>
                                    <label class="layui-form-label" style="font-weight:bold;width: 150px;text-align: left;" id="FNAME"></label>
                                </div>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="requiredMark">*</span>菜单编码</label>
                            <div class="layui-input-block">
                                <input type="text" name="CODE" id="CODE" autocomplete="off" lay-verify="required|CODE|unique" maxlength="50" style="width:80%;" class="layui-input" title="权限编码">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="requiredMark">*</span>菜单名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="MC" autocomplete="off" lay-verify="required|special|MC" maxlength="10" style="width:80%;" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="requiredMark">*</span>顺序号</label>
                            <div class="layui-input-block">
                                <input type="text" name="SXH" autocomplete="off" lay-verify="required|number|RORDER" maxlength="2" style="width:80%;" class="layui-input" title="顺序号">
                            </div>
                        </div>
                        <%--<div class="layui-form-item" id="qx_ywgz" style="display: none;">--%>
                            <%--<label class="layui-form-label">业务规则</label>--%>
                            <%--<div class="layui-input-block">--%>
                                <%--<input type="checkbox" name="ATT1" lay-filter="ATT1" value="1" title="本人" lay-skin="primary">--%>
                                <%--<input type="checkbox" name="ATT1" lay-filter="ATT1" value="2" title="管理员" lay-skin="primary">--%>
                                <%--<input type="checkbox" name="ATT1" lay-filter="ATT1" value="3" title="班主任" lay-skin="primary">--%>
                            <%--</div>--%>
                            <%--<div class="layui-input-block">--%>
                                <%--<input type="checkbox" name="ATT1" lay-filter="ATT1" value="4" title="档案专员" lay-skin="primary">--%>
                            <%--</div>--%>
                        <%--</div>--%>
                        <div class="layui-form-item">
                            <label class="layui-form-label">访问地址</label>
                            <div class="layui-input-block">
                                <input type="text" name="URL" autocomplete="off" maxlength="100" lay-verify="special" style="width:80%;" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label"><span class="requiredMark">*</span>菜单图标</label>
                            <div class="layui-input-block">
                                <img id="setIcon" style="width: 18px;height: 18px;margin-top:3px;" onclick="choseIcon()" src="<%=basePath%>img/menu/menu1/blue/xtgl.png">
                                <input type="hidden" name="IMG" id="IMG" autocomplete="off" class="layui-input" readonly>
                            </div>
                        </div>
                        <div class="layui-form-item buttonGroup" id="rightButtondiv">
                            <div class="layui-in">
                                <button id="formDel" class="layui-btn">删除</button>
                                <button id="formUpd" class="layui-btn layui-btn-normal" lay-submit lay-filter="formUpdate">修改</button>
                                <button id="formSub" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
                                <button id="formRes" type="reset" class="layui-btn layui-btn-primary">重置</button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    </div>
    <%--一级菜单--%>
    <div id="icon" style="display: none;background:#F8F9FB;"></div>
    <%--二三级菜单--%>
    <div id="icon2" style="display: none;background:#F8F9FB;"></div>
</body>


<script>

</script>

</html>
