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
    <style>
        .titleOrg{height: 40px;line-height: 40px;color: #485A6A;text-align: center;font-size: 12px;}
        .conOrg{padding: 0 5px 0 5px}
        .conOrg .conOrgBlock{float: left;width: 76px;height: 60px;text-align: center;display: block}
        .conOrg .conOrgBlock:hover{color: #439CF4;cursor: pointer}
        .conOrg .conOrgBlock .conOrgBlockOpt{margin-top: 3px; margin-bottom: 3px; display: none;}
        .conOrg .conOrgBlock .conOrgBlockOpt img{width: 14px;height: 14px;}
        .conOrg .conOrgBlock .conOrgBlockImg{width: 14px;height: 12px;margin-top: 3px; margin-bottom: 3px;}
        .conOrg .conOrgBlock .conOrgBlockImg img{width: 100%;height: 100%;}
        .conOrg .conOrgBlock .conOrgBlockTitle{font-size: 12px;height: 11px;}
        .org{overflow: auto}
        .orgXq{border: none;color: #666666;font-size: 12px;float: right;background: none;line-height: 32px;cursor: pointer;}
        .orgXq:hover{font-size: 16px}
        .layui-colla-title{font-size: 12px;height: 32px;line-height: 32px;background-color: #fff;border-bottom: 1px solid #DEE2E6}
        .layui-colla-item img{width: 14px;height: 14px;}
        .layui-colla-content{padding: 0 0 10px 15px;border: none;}
        .layui-colla-item{border: none}
        .layui-collapse{border: none}
        .xxButton{background: #FFFFFF;border: 1px solid #E5E5E5;min-width: 70px;height: 24px;color: #455A64;font-size: 12px;cursor: pointer}
        .xxButton:hover{background: #DBEBFB;border:1px solid #4BA3FB;color: #4BA3FB}
    </style>
    <script>
        var jsonASD=getJsonASD();
        var tableName="ess6";

        var status="";//添加修改是否成功的状态，默认是空
        var finlData="";

        var loadFirstUrl=getBeonePath("ESS")+"pt/orgFind";
        var loadSecondUrl=getBeonePath("ESS")+"pt/orgFind";
        var insertUrl= getBeonePath("ESS")+"pt/insertOrg";
        var updateUrl= getBeonePath("ESS")+"common/update";
        var deleteUrl= getBeonePath("ESS")+"common/delete";

        var getAllOrgUrl= getBeonePath("ESS")+"pt/findAllOrg";

        var uniqueUrl= getBeonePath("ESS")+"common/unique"; //唯一性验证

        var findCode="PTGL_ZZGL_ZZJG_CX"; //分页查询code
        var insertCode="PTGL_ZZGL_ZZJG_ADD"; //新增code
        var updateCode="PTGL_ZZGL_ZZJG_EDIT"; //修改code
        var deleteCode="PTGL_ZZGL_ZZJG_DEL"; //删除code
    </script>
</head>
<body>

<div class="layui-container" style="height: 100%;width: 100%;padding:10px 0px 0px 0px;">
    <div class="layui-row">
        <%--letf--%>
        <div class="layui-col-md4" style="width: 240px;height: 100%;margin-right: 10px;background: #fff;float: left">
            <div class="layui-col-md12" style="height: 43px;line-height:43px;text-align: center;border-bottom: 1px solid #ECF3F8;">
               <div style="color: #485A6A;font-size: 12px">- 中央教育局 - &nbsp;&nbsp;<img onclick="addFilst()" style="width: 14px;height: 14px;cursor: pointer;" src="img/menu/more_icon_add.png"/></div>
            </div>
            <div id="org" class="layui-col-md12">

            </div>
        </div>

        <%--right--%>
        <div class="layui-col-md8" style="width:calc(100% - 250px);height: 100%;background: #fff;float: left">
            <div class="layui-col-md12">
                <div  id="secondOrgBlock" class="layui-collapse" lay-filter="orgCon" lay-accordion>

                </div>
            </div>
        </div>
    </div>

    <%--添加修改的table页面--%>
    <div class="operationModle" id="operationPage" style="display: none;">
        <form id="form" class="layui-form" action="" lay-filter="form">
            <input type="hidden" id="hiddenId">
            <div class="layui-form-item">
                <div class="layui-row">
                    <div class="layui-col-md12">
                        <label class="layui-form-label">上级组织</label>
                        <div class="layui-input-block">
                            <input NAME="PID" TYPE="hidden"  VALUE="-1" >
                            <input NAME="PNAME"  readonly class="layui-input" title="上级组织" style="border: none;background: #f0f0f0">
                        </div>
                    </div>
                </div>
            </div>

            <div class="layui-form-item">
                <div class="layui-row">
                    <div class="layui-col-md6">
                        <label class="layui-form-label"><span class="requiredMark">*</span>组织名称</label>
                        <div class="layui-input-block">
                            <input NAME="NAME" lay-verify="required|unique" maxlength="10" title="组织名称" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-col-md6">
                        <label class="layui-form-label"><span class="requiredMark">*</span>组织机构代码</label>
                        <div class="layui-input-block">
                            <input NAME="CODE" lay-verify="required|unique|code" maxlength="10" title="组织机构代码" autocomplete="off" class="layui-input">
                        </div>
                    </div>
                </div>
            </div>

            <div class="layui-form-item" id="jwlx">
                <div class="layui-row">
                    <div class="layui-col-md6">
                        <label class="layui-form-label"><span class="requiredMark">*</span>教委类型</label>
                        <div class="layui-input-block">
                            <select id="jwtype" NAME="JWTYPE" lay-verify="required" title="教委类型"></select>
                        </div>
                    </div>
                    <%--<div class="layui-col-md6">
                        <label class="layui-form-label">部署类型</label>
                        <div class="layui-input-block">
                            <input type="radio" name="BSLX" lay-verify="required" checked value="1" title="平台">
                            <input type="radio" name="BSLX" lay-verify="required" value="2" title="独立">
                        </div>
                    </div>--%>
                </div>
            </div>
            <%--<div class="layui-form-item">
                <div class="layui-row">
                    <div class="layui-col-md6">
                        <label class="layui-form-label">组织状态</label>
                        <div class="layui-input-block">
                            <input type="radio" name="ZT" lay-verify="required" checked value="1" title="停用">
                            <input type="radio" name="ZT" lay-verify="required" value="2" title="启用">
                        </div>
                    </div>
                    <div class="layui-col-md6">

                    </div>
                </div>
            </div>--%>

            <button style="display: none;" id="formSubmit" class="layui-btn" lay-submit lay-filter="formSubmit">新增</button>
        </form>
    </div>
</div>
</body>

<script>

    var allOrg={};

    $(function () {
        loadOrg();
        allOrg = getAllOrg();
    })

    function getAllOrg() {
        var org = {};
        org[-1]="中央教育局";
        var json = {};
        json.ASD=jsonASD;
        getAjax({url:getAllOrgUrl,data:JSON.stringify(json),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    for (var i=0;i<list.length;i++){
                        org[list[i].id]=list[i].mc;
                    }
                }
            }
        });
        return org;
    }

    // 一级教委的滑动样式 seover seout
    function seover(obj) {
        $(obj).find(".conOrgBlockOpt").css("display","block");
        $(obj).find(".conOrgBlockImg").attr("src","img/icon/tool_icon_wjj_after.png");
    };
    function seout(obj) {
        $(obj).find(".conOrgBlockOpt").css("display","none");
        $(obj).find(".conOrgBlockImg").attr("src","img/icon/tool_icon_wjj_no.png");
    };

    // 加载一级组织
    function loadOrg(){
        var json ={};
        json.pid="-1";
        json.ASD=jsonASD;
        getAjax({url:loadFirstUrl,data:JSON.stringify(json),callback:function (reg) {
            if (reg.resultCode=="200"){
                var list = reg.resultData;
                var html="";
                var html1="";
                var html2="";
                var html3="";

                for (var i=0;i<list.length;i++){
                    if (list[i].jwtype=="1"){
                        html1+=conOrgBlock(list[i]);
                    }
                    if (list[i].jwtype=="2"){
                        html2+=conOrgBlock(list[i]);
                    }
                    if (list[i].jwtype=="3"){
                        html3+=conOrgBlock(list[i]);
                    }
                }
                if(html1.length>0){
                    html+="<div class='org'><div class=\"titleOrg\">- 直辖市教委 -</div>\n" +
                        "<div  class=\"conOrg\">\n" +html1+
                        "</div></div>";
                }
                if (html2.length>0){
                    html+="<div class='org'><div class=\"titleOrg\">- 省/市教委 -</div>\n" +
                        "<div  class=\"conOrg\">\n" +html2+
                        "</div></div>";
                }
                if (html3.length>0){
                    html+="<div class='org'><div class=\"titleOrg\">- 区县教委 -</div>\n" +
                       "<div  class=\"conOrg\">\n" +html3+
                       "</div></div>";
                }


                $("#org")[0].innerHTML=html;
            }
        }});
    }

    //一级块
    function conOrgBlock(data){
        data = JSON.stringify(data);
        var block="<div class='conOrgBlock'onclick='loadSecond("+data+")' onmouseover='seover(this)' onmouseout='seout(this)'>\n" +
            "                        <div class='conOrgBlockOpt'>\n" ;
        if (JSON.parse(data).xxsl=='0'){
            block+="                            <img onclick='add("+data+")'  src=\"img/icon/nr_icon_add.png\"/>\n" ;
        }


            block+="                            <img onclick='update("+data+")'  src=\"img/icon/nr_icon_bj.png\"/>\n" ;



        if (JSON.parse(data).scn==0){
            block+="                            <img onclick='del("+data+")'  src=\"img/icon/cz_icon_del.png\"/>\n" ;
        }
            block+="                        </div>\n" +
            "                        <img class=\"conOrgBlockImg\" src=\"img/icon/tool_icon_wjj_no.png\"/>\n" +
            "                        <div class=\"conOrgBlockTitle\">"+JSON.parse(data).name+"</div>\n" +
            "                    </div>";

        return block;
    }

    layui.use(['form','element','layer'], function() {

        var form = layui.form;
        var element = layui.element;
        var layer = layui.layer;

        //监听折叠
        element.on('collapse(orgCon)', function(data){
            //layer.msg('展开状态：'+ data.show);
        });
        window.loadSecond = function (data){
            finlData=data;
            var json ={};
            json.pid=data.id;
            json.ASD=jsonASD;
            getAjax({url:loadSecondUrl,data:JSON.stringify(json),callback:function (reg) {
                    if (reg.resultCode=="200"){
                        var list = reg.resultData;
                        var html="";
                        for (var i=0;i<list.length;i++){
                            html+=orgSecondBlock(list[i]);
                        }
                        $("#secondOrgBlock")[0].innerHTML=html;
                        element.render('collapse', 'orgCon');
                    }
                }
            });
        };

        function orgSecondBlock(data){
            data=JSON.stringify(data);
            var html="<div class=\"layui-colla-item\">\n" +
                "                        <h2 onclick='loadNext("+data+",this)' class=\"layui-colla-title\">\n" +
                "                            <span style=\"float: left;margin-right: 10px;\">"+JSON.parse(data).name+"</span>\n" +
                "                            <div style=\"float: left;\">\n" ;
            if (JSON.parse(data).xxsl=='0'){
                html+="                               <img onclick='add("+data+")'  src=\"img/icon/nr_icon_add.png\"/>\n" ;
            }
                html+="                               <img onclick='update("+data+")'  src=\"img/icon/nr_icon_bj.png\"/>\n" ;

            if (JSON.parse(data).scn==0){
                html+="                               <img onclick='del("+data+")'  src=\"img/icon/cz_icon_del.png\"/>\n" ;
            }

                html+="                            </div>\n" +
                "<button class='orgXq'>详情</button>"+
                "                        </h2>\n" +
                "                        <div class=\"layui-colla-content\">\n" +
                "\n" +
                "                        </div>\n" +
                "                    </div>";
            return html;
        };

        window.loadNext = function (data,obj){
            var json ={};
            json.pid=data.id;
            json.ASD=jsonASD;
            getAjax({url:loadSecondUrl,data:JSON.stringify(json),callback:function (reg) {
                    if (reg.resultCode=="200"){
                        var html="";
                        if (data.xxsl==0){
                            var list = reg.resultData;
                            html="<div  class='layui-collapse' lay-filter='orgCon"+data.id+"' lay-accordion>";
                            for (var i=0;i<list.length;i++){
                                html+=orgSecondBlock(list[i]);
                            }
                            if (list.length==0){
                                html+="该教委下暂无组织！";
                            }
                            html+="</div>";
                        } else{
                            var list = reg.resultData;
                            html+="<div style='padding-top: 5px;'>"
                            for (var i=0;i<list.length;i++){
                                html+="<button class='xxButton' onclick='xxxxClick("+JSON.stringify(data)+")'>"+list[i].name+"</button>&nbsp;";
                            }
                            html+="</div>";
                        }

                        $(obj).parent().find(".layui-colla-content")[0].innerHTML=html;
                        element.render('collapse', 'orgCon'+data.id);
                    }
                }
            });
        };

        window.xxxxClick=function(data){
            console.info(data);
        }

        window.add=function(data){
            $("#jwtype").html(getDataSelectHtml('JWLX','1','','请选择教委类型'));
            $("#jwlx").css("display","none");
            form.render();
            loadForm();
            document.getElementById("form").reset();
            layui.form.val('form', {
                "PID": data.id,
                "PNAME": data.name,
                "JWTYPE": 3,
            });
        };

        window.update=function(data){
            if (data.pid == '-1'){
                $("#jwtype").html(getDataSelectHtml('SJJWLX','1',data.jwtype,'请选择教委类型'));
                $("#jwlx").css("display","inline");
            }else {
                $("#jwtype").html(getDataSelectHtml('JWLX','1',data.jwtype,'请选择教委类型'));
                $("#jwlx").css("display","none");
            }
            form.render();
            loadForm();
            $("#hiddenId").val(data.id);
            layui.form.val('form', {
                "PID": data.pid,
                "PNAME": allOrg[data.pid],
                "CODE": data.code,
                "NAME": data.name,
                "JWTYPE": data.jwtype,
                // "BSLX": data.bslx,
                // "ZT": data.zt,
            });
        };

        window.del=function(data){
            layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                var json1 ={};
                jsonASD.code=deleteCode;
                json1.ASD=jsonASD;
                json1.tableName=tableName;
                var jsonDelete={};
                jsonDelete.ID=data.ID;
                json1.delete=jsonDelete;
                getAjax({url:deleteUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            layer.msg("操作成功！", {offset: '200px'});
                            loadOrg();
                            loadSecond(finlData);
                            layer.close(index);
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }
                });
            });
        };

        window.addFilst = function () {
            $("#jwtype").html(getDataSelectHtml('SJJWLX','1','','请选择教委类型'));
            $("#jwlx").css("display","inline");
            form.render();
            loadForm();
        }

        //打开添加修改页面
        window.loadForm =function () {
            status="";
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            layer.open({
                type:1,//类型
                area:['850px','200px'],//定义宽和高
                title:'组织机构',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#operationPage'),//打开的内容
                yes:function (index,layero) {
                    $("#formSubmit").click();
                    if (status=="SUCCESS"){
                        loadOrg();
                        loadSecond(finlData);
                        layer.msg("操作成功！", {offset: '200px'});
                        layer.close(index);
                    }

                },
                btn2:function (index,layero) {
                    layer.close(index);
                }
            });

            layui.form.val('form', {
                "PID": "-1",
                "PNAME": "中央教育局 ",
            });
        };

        //系统参数 表单提交
        form.on('submit(formSubmit)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                delete jsonInsert.PNAME;
                jsonInsert.TYPE="2";
                jsonInsert.SBKT="4";
                jsonInsert.BSLX="1";
                jsonInsert.ZT="2";
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                delete jsonFild.PNAME;
                json.fild=jsonFild;
                url= updateUrl;
            }
            getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
                    if(reg.resultCode == '200'){
                        status="SUCCESS";
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
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
            code:function(value){
                if(!new RegExp("^[A-Za-z0-9_]+$").test(value)){
                    return '权限编码只能是字母数字下划线';
                }
            },
            unique: function (value,item) {//唯一性验证
                var checkResult="1";
                var param={
                    tableName:tableName,
                    key:item.name,
                    value:value,
                    id:$("#hiddenId").val(),
                    ASD:jsonASD,
                }
                getAjax({url:uniqueUrl,data:JSON.stringify(param),callback:function (reg) {
                        if(reg.status!="200"){
                            checkResult = "2";
                        }
                    }
                });
                if (checkResult=="2"){
                    return "["+item.title+"] 为 '"+value+"' 的已存在！";
                }
            },
            positiveInteger:function (value,item) {
                if(!new RegExp("^[1-9]\d*$").test(value)){
                    return "["+item.title+"] 必须是正整数";
                }
            }
        });
    });



</script>

</html>
