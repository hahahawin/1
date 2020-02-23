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
        <title>demo1.0</title>
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <jsp:include page="../introduce/common.jsp"></jsp:include>
        <script src="<%=basePath%>js/sys/sysRight.js"></script>
        <link rel="stylesheet" href="<%=basePath%>css/sys/sysRightCss.css">
    <style>
        .icon4{background: #F8F9FB;width: 16px;height: 16px;float: left;margin:2px 2px 2px 2px;}
    </style>
    <script>

        var key1 = "";  //图标路径标识
        var FID = "" ; //上级ID
        var FNAME = "" ; //上级名称
        var rightParam ; //一级权限对象
        var rightParam2 ; //二级权限对象
        var rightYwpt = '' ; //用于存放三级菜单的平台权限类型
        var tableName = 'ess1' ; //表名参数
        var rightCxCode = "XTGL_XTQX_CDWF_CX" ; //查询code
        var rightAddCode = "XTGL_XTQX_CDWF_ADD" ; //添加code
        var rightDelCode = "XTGL_XTQX_CDWF_DEL" ; //删除code
        var rightEditCode = "XTGL_XTQX_CDWF_EDIT" ; //修改code


        var jsonASD = getJsonASD(); //权限验证
        var checkCodeOrNameUrl = getBeonePath('ESS')+'common/checkCodeOrName' ;
        var commFindUrl = getBeonePath('ESS')+'common/find' ;
        var commInsertUrl = getBeonePath('ESS')+'common/insert' ;
        var commUpdateUrl = getBeonePath('ESS')+'common/update' ;
        var commDeleUrl = getBeonePath('ESS')+'common/delete' ;

        var findRightUrl = getBeonePath('ESS')+'sys/findRight' ;
        var findRightOtherUrl = getBeonePath('ESS')+'sys/findRightOther' ;
        var uniquePIDUrl = getBeonePath('ESS')+'common/uniquePID' ;
        var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证
        $(function () {
            qingkong();
            $(".third").css("display","none");//隐藏
            $("#editBox").attr("class","layui-col-xs9");//隐藏
            $("#zylx").hide();
            loadFirst();
            if(isadmin == '1'){
                $("#rightButtondiv").hide();
            }

            selMenu1();
            selMenu2();
            selMenu4();
        });

        function selMenu1(){
            $.ajax({
                url: 'json/menu1.json',
                async: true,
                success: function (reg) {
                    var data = reg.data;
                    var divs = '';
                    for(var i=0;i<data.length;i++){
                        divs += '<div class="icon" iconName="'+data[i].name+'"><img style="width: 100%;height: 100%" src="'+basePath+'img/menu/menu1/blue/'+data[i].name+'"></div>';
                    }
                    $("#icon").html(divs);
                }
            });
        }
        function selMenu2(){
            $.ajax({
                url: 'json/menu2.json',
                async: true,
                success: function (reg) {
                    var data = reg.data;
                    var divs = '';
                    for(var i=0;i<data.length;i++){
                        divs += '<div class="icon" iconName="'+data[i].name+'"><img style="width: 100%;height: 100%" src="'+basePath+'img/menu/menu23/blue/'+data[i].name+'"></div>';
                    }
                    $("#icon2").html(divs);
                }
            });
        }
        function selMenu4(){
            $.ajax({
                url: 'json/menu4.json',
                async: true,
                success: function (reg) {
                    var data = reg.data;
                    var divs = '';
                    for(var i=0;i<data.length;i++){
                        divs += '<div class="icon4" iconName="'+data[i].name+'"><img style="width: 100%;height: 100%" src="'+basePath+'img/menu/menu4/gray/'+data[i].name+'"></div>';
                    }
                    $("#icon4").html(divs);
                }
            });
        }
    </script>
    <style>
        .img18{
            width: 18px;
            height: 18px;
        }
    </style>
</head>
<body>
<div class="layui-container" style="height: 100%;width: 100%;padding:10px 0px 0px 0px;">
    <div class="layui-row">
        <div class="layui-col-xs3" style="width: 240px;height: 100%;margin-right: 10px;">
            <div class="layui-row grid-demo">
                <div class="layui-col-md12" id="firstCon" style="width: 100%;height: 49%;background: #fff;overflow:auto;font-size: 12px;color: #333">
                </div>

                <div class="layui-col-md12" style="width: 100%;height: 2%;"></div>

                <div class="layui-col-md12" id="secondCon" style="width: 100%;height: 49%;background: #fff;overflow:auto;font-size: 12px;color: #333">
                </div>
            </div>
        </div>

        <div class="layui-col-xs4 third" style="width: 400px;background: #fff;height: 100%;margin-right: 10px;">
            <div class="layui-col-md12 third-title">
                <label id="thirdTitle"></label>
                <input type="hidden" id="thirdTitleID" value="">
                <img src="<%=basePath%>img/menu/more_icon_add.png" onclick="thridAdd()">
            </div>
            <div class="layui-col-md12 third-content" id="thirdCon">
            </div>
        </div>

        <div class="layui-col-xs4" id="editBox" style="width: calc(100% - 660px);background: #fff;height: 100%;">
            <div class="layui-col-md12 editTitle">
                <label>
                    操作模式
                </label>
            </div>
            <div class="layui-col-md12 editContent operationModle" style="overflow:auto;">
                <form id="editForm" class="layui-form" action="" lay-filter="editForm">
                    <div class="layui-form-item">
                        <label class="layui-form-label">父节点</label>
                        <div class="layui-input-block">
                            <input type="hidden" name="PID" id="PID" autocomplete="off" class="layui-input" readonly>
                            <input type="hidden" name="ID" id="ID" autocomplete="off" class="layui-input" readonly>
                            <label class="layui-form-label" style="font-weight:bold;width: 150px;text-align: left;" id="FNAME"></label>
                        </div>
                    </div>
                    <div class="layui-form-item" id="zylx" style="display: none;">
                        <label class="layui-form-label">资源类型</label>
                        <div class="layui-input-inline">
                            <input type="radio" name="TYPE" value="1" title="菜单">
                            <input type="radio" name="TYPE" value="2" title="按钮">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">权限编码</label>
                        <div class="layui-input-block">
                            <input type="text" name="CODE" id="CODE" autocomplete="off" lay-verify="CODE" maxlength="50" style="width:80%;" class="layui-input" title="权限编码">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">权限名称</label>
                        <div class="layui-input-block">
                            <input type="text" name="NAME" autocomplete="off" lay-verify="NAME" maxlength="10" style="width:80%;" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">顺序号</label>
                        <div class="layui-input-block">
                            <input type="text" name="RORDER" autocomplete="off" lay-verify="number|RORDER" maxlength="2" style="width:80%;" class="layui-input" title="顺序号">
                        </div>
                    </div>
                    <div class="layui-form-item" id="qx_ywgz" style="display: none;">
                        <label class="layui-form-label">业务规则</label>
                        <div class="layui-input-block">
                            <input type="checkbox" name="ATT1" lay-filter="ATT1" value="1" title="本人" lay-skin="primary">
                            <input type="checkbox" name="ATT1" lay-filter="ATT1" value="2" title="管理员" lay-skin="primary">
                            <input type="checkbox" name="ATT1" lay-filter="ATT1" value="3" title="班主任" lay-skin="primary">
                        </div>
                        <div class="layui-input-block">
                            <input type="checkbox" name="ATT1" lay-filter="ATT1" value="4" title="档案专员" lay-skin="primary">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">权限类型</label>
                        <div class="layui-input-block">
                            <input type="checkbox" name="YWPT" lay-filter="YWPT" value="1" title="平台" lay-skin="primary">
                            <input type="checkbox" name="YWPT" lay-filter="YWPT" value="2" title="教委" lay-skin="primary">
                            <input type="checkbox" name="YWPT" lay-filter="YWPT" value="3" title="学校" lay-skin="primary">
                        </div>
                        <div class="layui-input-block">
                            <input type="checkbox" name="YWPT" lay-filter="YWPT" value="4" title="BCCA" lay-skin="primary">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">访问地址</label>
                        <div class="layui-input-block">
                            <input type="text" name="URL" autocomplete="off" maxlength="100" lay-verify="URL" style="width:80%;" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">资源别名</label>
                        <div class="layui-input-block">
                            <input type="text" name="GXNAME" autocomplete="off" style="width:80%;" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">菜单图标</label>
                        <div class="layui-input-block">
                            <img id="setIcon" style="width: 18px;height: 18px;margin-top:10px;" onclick="choseIcon()" src="<%=basePath%>img/menu/menu1/blue/nav_icon_xtsz.png">
                            <input type="hidden" name="ICON" id="ICON3" autocomplete="off" class="layui-input" readonly>
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
<%--四级菜单--%>
<div id="icon4" style="display: none;background:#F8F9FB;"></div>
</body>
</html>
