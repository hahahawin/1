<%@ page import="java.util.Map" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
    String opentype = request.getParameter("opentype");
    if(opentype == null){
        opentype = "";
    }
%>
<html>
<head>
    <%--注意：当用include 引入的jsp文件中，各个js方法名、变量名，css类名等不能重复 --%>
    <base href="<%=basePath%>">
    <title>APCOS智慧教育服务授权管理平台</title>
    <link rel="icon" href="<%=basePath%>img/favicon.ico" type="image/x-icon"/>
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <jsp:include page="../introduce/common.jsp"></jsp:include>

    <script>
        var tableName="ess6";
        var opentype = '<%=opentype %>';

        var insertUrl= getBeonePath("ESS")+"pt/orgRegisterInsert";
        var loadPidUrl= getBeonePath("ESS")+"pt/orgRegisterLoadPid";
        var findOrgByCodeUrl= getBeonePath("ESS")+"pt/findOrgByCode";
        var selDictUrl = getBeonePath("ESS")+"common/getDataInfo";

        var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

        var insertCode="2"; //新增code
    </script>
    <style>
        .head_div{
            width:100%;
            background:rgba(255,255,255,1);
        }
        .head_con{
            width:980px;
            height:63px;
            margin: 0px auto;
        }
        .head_con img{
            margin-top: 20px;
            float: left;
        }
        .shcx{
            width:120px;
            height:12px;
            font-size:14px;
            font-family:Microsoft YaHei;
            font-weight:400;
            color:rgba(201,201,201,1);
            line-height:14px;
            margin: 25px auto;
        }
        .layui-form-danger:focus{
            border-color: #FF5722 !important;
        }
    </style>
</head>
<body style="background:rgba(245,245,245,1);">
<div class="head_div" id="head_div">
    <div class="head_con">
        <img src="<%=basePath%>img/logo_beone.png">
        <span style="float:left;margin-left:10px;margin-top:25px;width:1px;height: 12px;color: #F4F4F4;">|</span>
        <span style="float:left;margin-left: 10px;margin-top:25px;color:rgba(51,51,51,1);">注册申请</span>
    </div>
</div>
<div class="layui-container" style="background:rgba(255,255,255,1);width: 1000px;height:550px; margin: 40px auto 0px auto;">
    <div class="layui-row" style="width: 800px;margin: 0px auto;">
        <div class="layui-col-md12">
            <div class="shcx">- 审核进度查询 -</div>
        </div>
        <div class="layui-col-md12">
            <div class="layui-form-item">
                <label class="layui-form-label" style="width:120px;">组织机构代码</label>
                <div class="layui-input-block">
                    <input type="text" id="zzbm" autocomplete="off" class="layui-input" style="width: 500px;float: left">
                    <button style="float: left;margin-left: 20px" class="layui-btn  layui-btn-normal" onclick="findOrg()">查询</button>
                </div>
            </div>
            <form class="layui-form">
                <div class="shcx">- 组织信息 -</div>
                <div class="layui-form-item" ID="SHJG" style="display: none;">
                    <label class="layui-form-label">审核结果</label>
                    <div class="layui-input-block">
                        <input type="text" style="color: red"  readonly class="layui-input" id="ORG_SBKT">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-row">
                        <div class="layui-col-md6">
                            <label class="layui-form-label"><span class="requiredMark">*</span>上级教委</label>
                            <div class="layui-input-block">
                                <select id="ORG_PID" name="PID"  lay-verify="required" lay-search="">

                                </select>
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <label class="layui-form-label"><span class="requiredMark">*</span>部署类型</label>
                            <div class="layui-input-block">
                                <input type="radio" name="BSLX" lay-verify="required" checked value="1" title="平台">
                                <input type="radio" name="BSLX" lay-verify="required" value="2" title="独立">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-row">
                        <div class="layui-col-md6">
                            <label class="layui-form-label"><span class="requiredMark">*</span>组织名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="NAME"  lay-verify="required|special|unique" title="组织名称" maxlength="20" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <label class="layui-form-label"><span class="requiredMark">*</span>组织编码</label>
                            <div class="layui-input-block">
                                <input type="text" name="CODE"  lay-verify="required|code|unique" title="组织编码" maxlength="20" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-row">
                        <div class="layui-col-md6">
                            <label class="layui-form-label"><span class="requiredMark">*</span>访问关键字</label>
                            <div class="layui-input-block">
                                <input type="text" name="DLWZ"  lay-verify="required|code|unique" title="登录网址" maxlength="10" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <label class="layui-form-label"><span class="requiredMark">*</span>学段代码</label>
                            <div class="layui-input-block">
                                <select name="XDDM" id="ORG_XDDM" lay-verify="required" multiple="multiple"></select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="shcx">- 拓展信息 -</div>
                <div class="layui-form-item">
                    <div class="layui-row">
                        <div class="layui-col-md6">
                            <label class="layui-form-label"><span class="requiredMark">*</span>负责人姓名</label>
                            <div class="layui-input-block">
                                <input type="text" id="INFO_FZR" lay-verify="required|special" autocomplete="off" maxlength="10" class="layui-input expand">
                            </div>
                        </div>
                        <div class="layui-col-md6">
                            <label class="layui-form-label"><span class="requiredMark">*</span>联系电话</label>
                            <div class="layui-input-block">
                                <input type="text" id="INFO_LXDH" lay-verify="required|phone" autocomplete="off" maxlength="12" class="layui-input expand">
                            </div>
                        </div>
                    </div>

                </div>
                <div class="layui-form-item">
                    <div class="layui-row">
                        <div class="layui-col-md6">
                            <label class="layui-form-label"><span class="requiredMark">*</span>电子邮箱</label>
                            <div class="layui-input-block">
                                <input type="text" id="INFO_DZYX" lay-verify="required|email" autocomplete="off" maxlength="20" class="layui-input expand">
                            </div>
                        </div>
                    </div>

                </div>

                <div class="layui-form-item" id="btnGroup">
                    <div class="layui-input-block">
                        <button class="layui-btn  layui-btn-normal" lay-submit lay-filter="formSubmit">立即提交</button>
                        <button type="reset" class="layui-btn layui-btn-primary">重置</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

</body>

<script>
    $(function () {
        if(opentype != '' && opentype != null){
            $(".head_div").css("display","none");
            $(".layui-container").css("margin-top","0px");
        }
        loadPid();
        selXddm();

    })
    layui.use('form', function(){
        var form = layui.form;
        //监听提交
        form.on('submit(formSubmit)', function(data){
            var json ={};
            var reg={};
            $(".expand").each(function(){
                reg[$(this).attr("id")]=$(this).val();
            });
            json.zc=data.field;
            json.tz=reg;
            json.tableName = tableName;
            var url=insertUrl;

            $.ajax({
                type: 'POST',
                url: url,
                dataType: "json",
                data: JSON.stringify(json),
                async:false,
                contentType : "application/json",
                success: function(reg) {
                    if(reg.resultCode == '200'){
                        if(opentype != '' && opentype != null){
                            var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
                            parent.layer.msg("申请提交成功！", {offset: '200px'});
                            parent.layer.close(index);
                        }else{
                            layer.msg("申请提交成功！", {offset: '200px'});
                        }
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                },
                error: function() {
                    console.log("fucking error")
                }
            });
            return false;
        });

        //表单验证方法
        form.verify({
            special: function(value){//特殊字符
                if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                    return '不能有特殊字符';
                }
            },
            code: function(value,item){
                if(!new RegExp("^[a-zA-Z0-9_]+$").test(value)){
                    return '只能是字母或者数字或者字母数字组合';
                }
            },
            phone: function(value,item){
                var pattern = /(^(\+86)?[0-9]{3}\-[0-9]{8}$)|(^(\+86)?[0-9]{4}\-[0-9]{7}$)|(^(\+86)?(1[3-9][0-9]{9}|1[7-9][0-9]{9})$)/;
                if(!pattern.test(value)){
                    return '联系电话格式错误';
                }
            },
            unique: function (value,item) {//唯一性验证
                var checkResult="1";
                var param={
                    tableName:tableName,
                    key:item.name,
                    value:value,
                    id:$("#ConfigHiddenId").val()
                };
                $.ajax({
                    url:uniqueUrl,
                    type: "POST",
                    dataType: "json",
                    data: JSON.stringify(param),
                    contentType : "application/json",
                    async: false,
                    success: function(reg) {
                        if(reg.status!="200"){
                            checkResult = "2";
                        }
                    },
                    error: function() {
                        console.info("fucking error");
                    }
                });
                if (checkResult=="2"){
                    return "["+item.title+"] 为 '"+value+"' 的已存在！";
                }
            }
        });

        window.findOrg=function(){
            var zzbm = $("#zzbm").val();
            var json={"zzbm":zzbm};
            $.ajax({
                type: 'POST',
                url: findOrgByCodeUrl,
                async:false,
                dataType: "json",
                data: JSON.stringify(json),
                contentType : "application/json",
                success: function(reg) {
                    var list1=reg.list1;
                    var list2=reg.list2;
                    if(list1 != '' && list1 != null){
                        $("select[name='PID']").val(list1[0].org_pid);
                        $("input[name='NAME']").val(list1[0].org_name);
                        $("input[name='CODE']").val(list1[0].org_code);
                        $("input[name='DLWZ']").val(list1[0].org_dlwz);
                        $("select[name='XDDM']").val(list1[0].org_xddm);
                        $("input[name='BSLX'][value='1']").attr("checked", list1[0].org_bslx == '1' ? true : false);
                        $("input[name='BSLX'][value='2']").attr("checked", list1[0].org_bslx == '2' ? true : false);
                        var sbkt="";
                        if (list1[0].org_sfkt=="1"){sbkt="注册申请";}
                        else if (list1[0].org_sfkt=="2"){sbkt="申请审批";}
                        else if (list1[0].org_sfkt=="3"){sbkt="未开通";}
                        else if (list1[0].org_sfkt=="4"){sbkt="己开通";}
                        $("#ORG_SBKT").val(sbkt);
                    }
                    if(list2 != '' && list2 != null){
                        $("#INFO_FZR").val(list2[0].info_fzr);
                        $("#INFO_LXDH").val(list2[0].info_lxdh);
                        $("#INFO_CZDH").val(list2[0].info_czdh);
                        $("#INFO_DZYX").val(list2[0].info_dzyx);
                    }

                    $("#SHJG").css("display","block");
                    $("#btnGroup").css("display","none");

                    form.render();
                },
                error: function() {
                    console.log("fucking error")
                }
            });
        }
    });

    function loadPid() {
        $.ajax({
            type: 'POST',
            url: loadPidUrl,
            async:false,
            contentType : "application/json",
            success: function(reg) {
                var list = reg.resultData;
                $("#ORG_PID").empty();
                $("#ORG_PID").append("<option value=''>请选择</option>");
                for (var i=0;i<list.length;i++){
                    $("#ORG_PID").append("<option value='"+list[i].org_id+"'>"+list[i].org_name+"</option>");
                }
            },
            error: function() {
                console.log("fucking error")
            }
        });
    }

    //获取学段信息
    function selXddm(){
        var json = {};
        json.name = 'XDDM';
        json.type = '2';
        $.ajax({
            type: 'POST',
            url: selDictUrl,
            async:false,
            data: JSON.stringify(json),
            contentType : "application/json",
            success: function(reg) {
                var list = reg.data;
                $("#ORG_XDDM").empty();
                $("#ORG_XDDM").append("<option value=''>请选择</option>");
                for (var i=0;i<list.length;i++){
                    $("#ORG_XDDM").append("<option value='"+list[i].key+"'>"+list[i].value+"</option>");
                }
            },
            error: function() {
                console.log("fucking error")
            }
        });
    }
</script>

</html>
