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
    <link rel="stylesheet" href="<%=basePath%>css/sys/sysOrgMenuCss.css">
    <style>
        .titleDis{width: 100%;text-align: center;color: #485A6A;font-size: 12px;padding-top: 10px;}
        .oneMenus{font-size: 12px;height: calc(100% - 160px);margin: 10px;overflow-y:auto;}
        .oneMenus img{width: 24px;height: 24px;}

        .oneMenu{float:left;margin-top:5px;width: 90px;height: 80px;text-align: center;}
        .oneCheck{width: 100%;height:18px;text-align: right;}
        .oneMenu:hover{cursor: pointer;color: #1E9FFF;}
        .oneMenuTitle{margin-top: 5px;}

        .twoTitleDiv{height: 40px;line-height: 40px;padding-left: 12px;padding-right: 20px;background-color: #FFFFFF;border-top: 1px solid #DEE2E6}
        .showClass{display: block!important;}
        .twoTitle{color: #455A64;font-size: 14px;}
        .twoTitle:hover{cursor: pointer;}

        .twoNrDiv{clear: both;display: none;}
        .twoNrDiv .nrLine{height: 30px;line-height:27px;font-size: 12px;clear: both;}

        .fourCheck{margin-left: 10px;}
        .layui-form-checked[lay-skin=primary] i{background: none;color: #439CF4;border-color: #439cf4 !important;width: 14px;height: 14px;line-height: 14px;}
        .layui-form-checked, .layui-form-checked:hover{border-color:#439CF4}
        .layui-form-checked[lay-skin=primary2] i{width: 14px;height: 14px;line-height: 14px;}

        .nrLine .layui-form-checkbox[lay-skin=primary]{padding-left: 22px;}

        .layui-col-xs8{width: calc(100% - 320px)}

        .orgIdSelect .layui-form-select .layui-input{height: 24px;font-size: 12px;}
        .orgIdSelect .layui-form-select dl dd, .layui-form-select dl dt{height: 24px;font-size: 12px;line-height: 24px;}
        .orgIdSelect .layui-form-select dl{top:32px;}
        .orgIdSelect .layui-form-select{padding-top: 8px;}
        .orgIdSelect .layui-form-select .layui-edge{top: calc(50% + 5px);}

        /* 设置滚动条的样式 */
        ::-webkit-scrollbar {width:5px;height:10px;background-color: #fff;}
        /* 滚动槽 */
        ::-webkit-scrollbar-track {border-radius:5px;}
        /* 滚动条滑块 */
        ::-webkit-scrollbar-thumb {border-radius:5px;background:#8796a5;}
    </style>
    <script>
        var form,layer,element;
        var rightMap = {}; //菜单授权初数据
        var AllRightMap = {}; //234级菜单临时权限数据
        var addArray = new Array() ; //添加权限数组
        var delArray = new Array() ; //删除权限数组
        var isAll = false ; //判断是否是全选
        var allArray = new Array() ; //全选数组
        var org_type = '';

        var tableName = 'ess42' ; //项目类型
        var tableName3 = 'ess43';//版本维护
        var tableName4 = 'ess53';//自定义菜单
        var tableName5 = 'ess54';//已授权菜单

        var orgselCode = "PTGL_CDGL_ZDYSQ_CX" ; //查询code
        var orgMenuCode = "PTGL_CDGL_ZDYSQ_SQ" ; //修改code

        var jsonASD = getJsonASD(); //权限验证
        var selOrgListUrl = getBeonePath('ESS')+'pt/selOrgList' ;
        var commFindUrl = getBeonePath('ESS')+'common/find' ;
        var findOneZdycdUrl = getBeonePath('ESS')+'sys/findOneZdycd' ;
        var findZdycd234Url = getBeonePath('ESS')+'sys/findZdycd234' ;
        var zdycdGrantUrl = getBeonePath('ESS')+'sys/zdycdGrant' ;//查询已授权菜单

        $(function () {
            selOrglist();
            getBblx();

            //展示隐藏
            $(document.body).on("click",".twoTitle", function(){
                var id = $(this).attr("togger");

                if($("#twoNeir"+id).hasClass('showClass')){
                    $("#twoNeir"+id).removeClass("showClass");
                    $(this).find(".layui-icon").removeClass("layui-icon-down");
                    $(this).find(".layui-icon").addClass("layui-icon-right");
                }else{
                    $("#twoNeir"+id).addClass("showClass");
                    console.log($("#twoNeir"+id).find(".layui-icon"));
                    $(this).find(".layui-icon").removeClass("layui-icon-right");
                    $(this).find(".layui-icon").addClass("layui-icon-down");
                }
            });
        });

        //显示权限菜单
        function showRight(id){
            $("#twoNeir"+id).addClass("showClass");
            $(this).find(".layui-icon").removeClass("layui-icon-right");
            $(this).find(".layui-icon").addClass("layui-icon-down");
        }

        //组织结构
        function selOrglist(){
            var json ={};
            jsonASD.code= orgselCode ;
            json.ASD = jsonASD;
            json.org_zt='2';
            json.org_type='1,3';
            json.org_sbkt='4';
            json.hasAdmin='2';
            getAjax({url:selOrgListUrl,data:JSON.stringify(json),callback:function (reg) {
                    if(reg.resultCode == '200'){
                        $('#org_id').empty();
                        var data = reg.resultData;
                        var options = '<option value="">请选择组织</option>';
                        for (var i=0;i<data.length;i++){
                            options += '<option value="'+ data[i].id +'" org_type="'+ data[i].type+'">'+ data[i].name +'</option>';
                        }
                        $('#org_id').append(options);

                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }});
        }

        //查询项目
        function getBblx(){
            var json1={};
            json1.ASD=jsonASD;
            json1.tableName = tableName;
            var jsonwhere = {};
            jsonwhere.ATT1 = '2';
            jsonwhere.FBZT = '2';
            json1.where = jsonwhere;
            var jsonOther = {};
            jsonOther.order = {"EDIT_TIME": "desc"};
            json1.other = jsonOther;
            getAjax({url:commFindUrl,data:JSON.stringify(json1),callback:function (reg) {
                    var list = reg.resultData;
                    $("#ssxm").empty();
                    $("#ssxm").append("<option value=''>请选择所属项目</option>")
                    for (var i=0;i<list.length;i++){
                        $("#ssxm").append("<option value='"+list[i].id+"'>"+list[i].name+"("+list[i].ywmc+")"+"</option>");
                    }
                }
            });
        }

        //通过项目查询版本
        function getBbwh(value) {
            qikong();
            if(value != null && value != ''){
                var json1 = {};
                json1.ASD = getJsonASD();
                json1.ASD.code = orgselCode;
                json1.tableName = tableName3;
                json1.fildName = "ID,NAME,BBH";
                var jsonWhere = {};
                jsonWhere.FBZT = '2';
                jsonWhere.SHZT = '2';
                jsonWhere.ATT1 = value;
                json1.where = jsonWhere;
                var lcxxJsonOther = {};
                lcxxJsonOther.order = {"EDIT_TIME": "desc"};
                json1.other = lcxxJsonOther;
                getAjax({
                    url: commFindUrl, data: JSON.stringify(json1), callback: function (reg) {
                        if (reg.resultCode == "200") {
                            var list = reg.resultData;
                            var options = "<option value=''>请选择版本信息</option>";
                            for (var i = 0; i < list.length; i++) {
                                options += "<option value='" + list[i].id + "'>" + list[i].name + "</option>";
                            }
                            $("#bbwh_id").html(options);
                        }
                    }
                });
            }else{
                $("#bbwh_id").empty();
            }
        }

        //选择版本
        function changebbwh(value){
            qikong();
            var org_id = $("#org_id").val();
            if(value != null && value != '' && org_id != null && org_id != ''){
                selZdycdxx();
            }
        }

        //选择组织
        function changeOrg(value){
            qikong();
            var ssxm = $("#ssxm").val();
            var bbwh_id = $("#bbwh_id").val();
            if(value != null && value != '' && ssxm != null && ssxm != '' && bbwh_id != null && bbwh_id != ''){
                selZdycdxx();
            }
        }

        function qikong(){
            rightMap = {}; //已授权的菜单
            addArray = new Array() ; //添加权限数组
            delArray = new Array() ; //删除权限数组
            $(".oneMenus").html('');
            $("#234Menus").html('');

        }

        //通过一级菜单查询二、三、四级菜单
        $(document).on('click', '.oneMenu', function(){
            load234Right($(this).attr("itemid"),'menu');
        });

        //加载一级菜单
        function selZdycdxx(){
            var org_id = $("#org_id").val();
            var bbwh_id = $("#bbwh_id").val();
            var ssxm_id = $("#ssxm").val();
            var json1 = {};
            json1.ASD = getJsonASD();
            json1.org_id = org_id;
            json1.ssmx = ssxm_id;
            json1.bbwh_id = bbwh_id;
            json1.pid = '-1';
            getAjax({url: findOneZdycdUrl, data: JSON.stringify(json1), callback: function (reg) {
                    if(reg.resultCode=="200"){
                        var data = reg.resultData ;
                        rightMap = reg.menuList ;
                        var checkStr = '' ;
                        var lfter = '' ;
                        var divs = '';
                        for (var i=0;i<data.length;i++){
                            divs +='<div class="oneMenu" itemid="'+ data[i].id +'">';
                            if(data[i].chk*1 == data[i].scn*1){
                                lfter = "primary" ;
                            }else{
                                lfter = "primary2" ;
                            }
                            if(data[i].chk*1 > 0 ){
                                checkStr = "checked=\"checked\"" ;
                            }else{
                                checkStr = "" ;
                            }
                            divs += '<div class="oneCheck"><input type="checkbox" name="oneCheck" class="oneCheck" value="'+data[i].id+'" lay-filter="oneCheck" lay-skin="'+lfter+'" '+checkStr+'></div>';
                            divs += '<img src="'+basePath+'img/menu/menu1/blue/'+data[i].img+'" />';
                            divs += '<div class="oneMenuTitle">'+ data[i].mc +'</div>';
                            divs += '</div>';
                        }
                        $(".oneMenus").html(divs);
                        layui.form.render(); //重新渲染
                    }else{
                        layer.msg("菜单查询失败", {offset: '200px'});
                    }
                }
            });
        }

        //加载234级菜单
        function load234Right(id,type){
            $("#234Menus").html('');

            var org_id = $("#org_id").val();
            var bbwh_id = $("#bbwh_id").val();
            var ssxm_id = $("#ssxm").val();
            var json1 = {};
            json1.ASD = getJsonASD();
            json1.org_id = org_id;
            json1.ssmx = ssxm_id;
            json1.bbwh_id = bbwh_id;
            json1.pid = id;
            getAjax({url: findZdycd234Url, data: JSON.stringify(json1), callback: function (reg) {
                    if(reg.resultCode=="200"){
                        var data = reg.list ;
                        AllRightMap = data ;
                        var html = '';
                        for(var i=0;i<data.length;i++){
                            html += '<div style="margin-bottom: 15px;">';
                                html += '<div class="twoTitleDiv">';
                                    html += '<div style="float: left;" class="twoTitle" togger="'+ data[i].id +'"><i class="layui-icon layui-icon-down"></i><span style="margin-left: 5px;">'+ data[i].mc +'</span></div>';
                                    html += '<div style="float: right;" ><input type="checkbox" name="twoCheck" class="twoCheck" value="'+ data[i].id +'" parent_id="'+ data[i].pid +'" tnum="'+i+'" lay-filter="twoCheck" lay-skin="primary" style="margin-top:5px;" /> 全选</div>';
                                html += '</div>';
                                var threedata = data[i].three;
                                html += '<div class="twoNrDiv showClass" id="twoNeir'+ data[i].id +'">';
                                for (var j=0;j<threedata.length;j++){
                                    html += '<div style="float: left;width: 100px;margin-left: 20px;height: 25px;"><input type="checkbox" name="threeCheck" class="threeCheck" ptnum="'+i+'" tnum="'+j+'" lay-filter="threeCheck" lay-skin="primary" value="'+ threedata[j].id +'" parent_id="'+ threedata[j].pid +'"> '+ threedata[j].mc +'</div>';
                                }
                                html += '</div>';

                            html += '</div>';
                            html += '<div style="clear: both;"></div>';
                        }
                        html += '<div style="clear: both;"><div class="twoTitleDiv"></div></div>';
                        $("#234Menus").html(html);
                        layui.form.render(); //重新渲染

                        //判断一级菜单是否选中
                        if($("input[name='oneCheck'][value='"+id+"']").prop("checked") == true){
                            //调用一级菜单选中处理
                            oneChecked(id,type);
                        }
                    }else{
                        layer.msg("菜单查询失败", {offset: '200px'});
                    }
                }
            });
        }

        //判断当前选中是否存在
        function getRightMap(id){
            var zdycd_id = "" ;
            for(var i=0 ; i<rightMap.length;i++){
                if(rightMap[i].id == id){
                    zdycd_id = id ;
                    break ;
                }
            }
            return zdycd_id ;
        }

        //判断、存入选中ID是否存在添加序列中
        function addRight(id){
            var rid = getRightMap(id); //判断原菜单是否存在该权限
            if(rid==null || rid=='' || rid==undefined){ //原授权无此菜单 进行添加
                var pid = $.inArray(id,addArray) ; //判断是否存在己添加菜单
                if(pid==-1){ //添加
                    addArray.push(id);
                }
            }else{//存在　判断删除数组中是否有此菜单　有则进行删除
                var pid = $.inArray(id,delArray) ; //判断是否存在己添加菜单
                if(pid!=-1){ //删除
                    delArray.splice(pid,1);
                }
            }
        }

        //判断、存入选中ID是否存在添加序列中
        function delRight(id){
            var pid = $.inArray(id,addArray) ; //判断是否存在己添加菜单
            if(pid!=-1){ //删除
                addArray.splice(pid,1);
            }
            var rid = getRightMap(id); //判断原菜单是否存在该权限
            if(rid!=null && rid!='' && rid!=undefined) { //原授权无此菜单 进行添加
                pid = $.inArray(id,delArray) ; //判断是否存在己添加菜单
                if(pid==-1){ //删除
                    delArray.push(id);
                }
            }

        }

        //一级菜单选中处理
        function oneChecked(id,type){
            if(type=='check'){
                //一级菜单数据
                addRight(id);
                //二级菜单选中
                $('#234Menus').find("input[name=twoCheck]").prop("checked", true);
                for(var i=0;i<AllRightMap.length;i++) {
                    //三级菜单选中
                    $("#twoNeir" + AllRightMap[i].id).find(".threeCheck").prop("checked", true);
                    //四级菜单选中
                    $("#twoNeir" + AllRightMap[i].id).find(".fourCheck").prop("checked", true);
                    //二级菜单数据
                    addRight(AllRightMap[i].id);
                    //三级菜单数据
                    var threedata = AllRightMap[i].three;
                    for (var j = 0; j < threedata.length; j++) {
                        addRight(threedata[j].id);
                    }
                }
            }else if(type=='menu'){
                for(var i=0;i<AllRightMap.length;i++) {
                    var threedata = AllRightMap[i].three;
                    if(threedata.length==0){ //三级菜单为空
                        var pid = $.inArray(AllRightMap[i].id,addArray) ;
                        if(pid!=-1 || AllRightMap[i].chk*1>0){
                            //二级菜单设置为选中
                            $("input[name='twoCheck'][value='"+AllRightMap[i].id+"']").prop("checked", true);
                            //选择、判断一级样式
                            getCheckCss('twoCheck','oneCheck',AllRightMap[i].pid,'');
                        }
                    }else{ //三级菜单不为空
                        for (var j=0;j<threedata.length;j++){
                            // var fourdata = threedata[j].four;
                            // if(fourdata.length==0){ //四级菜单为空
                                var pid = $.inArray(threedata[j].id,addArray) ;
                                if(pid!=-1 || threedata[j].chk*1>0){
                                    //三级菜单设置为选中
                                    $("input[name='threeCheck'][value='"+threedata[j].id+"']").prop("checked", true);
                                    //选择、判断二级样式
                                    getCheckCss('threeCheck','twoCheck',AllRightMap[i].id,AllRightMap[i].id);
                                    //选择、判断一级样式
                                    getCheckCss('twoCheck','oneCheck',AllRightMap[i].pid,'');
                                }
                            // }
                        }
                    }
                }
            }

            layui.form.render(); //重新渲染
        }

        //一级菜单取消处理
        function oneUnChecked(id){
            //一级菜单删除
            delRight(id);
            for(var i=0;i<AllRightMap.length;i++) {
                //二级菜单数据删除
                delRight(AllRightMap[i].id);
                //三级菜单数据删除
                var threedata = AllRightMap[i].three;
                for (var j = 0; j < threedata.length; j++) {
                    delRight(threedata[j].id)
                }
            }
        }

        //上级选中样式
        function getCheckCss(checkName,pCheckName,id,pid){
            var isOneCheck = true ;
            if(pid!=null && pid!='' && pid!=undefined){
                $("input[name='"+checkName+"']").each(function(){
                    if($(this).prop("checked") != true && $(this).attr("parent_id")==pid){ //未勾选
                        isOneCheck = false ;
                        return false ;
                    }else if($(this).attr('lay-skin') == 'primary2' && $(this).attr("parent_id")==pid){ //半角勾选
                        isOneCheck = false ;
                        return false ;
                    }
                });
            }else{
                $("input[name='"+checkName+"']").each(function(){
                    if($(this).prop("checked") != true){ //未勾选
                        isOneCheck = false ;
                        return false ;
                    }else if($(this).attr('lay-skin') == 'primary2'){ //半角勾选
                        isOneCheck = false ;
                        return false ;
                    }
                });
            }
            if(isOneCheck){//全选
                $("input[name='"+pCheckName+"'][value='"+id+"']").attr('lay-skin','primary') ;
            }else{//有二级未全勾选
                $("input[name='"+pCheckName+"'][value='"+id+"']").attr('lay-skin','primary2') ;
            }
            $("input[name='"+pCheckName+"'][value='"+id+"']").prop("checked", true);
        }

        //上级取消样式
        function getUnCheckCss(checkName,pCheckName,id,pid){
            var isOneCheck = true ;
            if(pid!=null && pid!='' && pid!=undefined){
                $("input[name='"+checkName+"']").each(function(){
                    if($(this).prop("checked") == true && $(this).attr("parent_id")==pid){ //勾选
                        isOneCheck = false ;
                        return false ;
                    }
                });
            }else{
                $("input[name='"+checkName+"']").each(function(){
                    if($(this).prop("checked") == true){ //勾选
                        isOneCheck = false ;
                        return false ;
                    }
                });
            }

            if(isOneCheck){//全未选
                $("input[name='"+pCheckName+"'][value='"+id+"']").prop("checked", false);
            }else{//有二级未全勾选
                $("input[name='"+pCheckName+"'][value='"+id+"']").attr('lay-skin','primary2') ;
                $("input[name='"+pCheckName+"'][value='"+id+"']").prop("checked", true);

            }
        }

    </script>
</head>
<body>

<div class="layui-container" style="height: 100%;width: 100%;padding:10px 0px 0px 0px;">
    <div class="layui-row">
        <div style="height: 40px;line-height:40px;width: 100%;background: #fff;margin-bottom: 10px;">
            <span style="width: 126px;height: 11px;font-size: 12px;color: #455A64;padding-left: 14px;float: left">组织单位功能分配管理</span>
            <div style="float: right">
                <label style="font-size: 12px;color: #455A64;padding-right: 5px;">版本号</label>
                <div class="" style="width: 170px;margin-top: 8px;float: right;">
                    <select id="bbwh_id"  lay-verify="" lay-search onchange="changebbwh(this.value);"  lay-filter="bbwh_id" style="font-size: 12px;border-color: #CED4DA;color: #666666;height: 24px;line-height: 24px;display: block">
                        <option>请选择版本号</option>
                    </select>
                </div>
            </div>
            <div style="float: right">
                <label style="font-size: 12px;color: #455A64;padding-right: 5px;">所属项目</label>
                <div class="" style="width: 170px;margin-top: 8px;float: right;">
                    <select id="ssxm" onchange="getBbwh(this.value);" style="font-size: 12px;border-color: #CED4DA;color: #666666;height: 24px;line-height: 24px;display: block">
                        <option>请选择项目</option>
                    </select>
                </div>
            </div>
            <div style="float: right">
                <label style="font-size: 12px;color: #455A64;padding-right: 5px;">所属组织</label>
                <div class="" style="width: 170px;margin-top: 8px;float: right;">
                    <select name="org_id" id="org_id" onchange="changeOrg(this.value);" style="font-size: 12px;border-color: #CED4DA;color: #666666;height: 24px;line-height: 24px;display: block">
                        <option>请选择组织</option>
                    </select>
                </div>
            </div>

        </div>

        <form class="layui-form" lay-filter="form1">
            <div class="layui-col-xs4" style="width: 300px;height: calc(100% - 50px);margin-right: 10px;" style="border:1px solid red;">
                <div class="layui-row grid-demo">
                    <div class="layui-col-md12" style="width: 100%;height: 100%;background: #fff;">
                        <div style="width: 100%;height: 1px;background-color: #E7EAED;"></div>
                        <div style="margin: 10px;height: 20px;" id="sqdiv">
                            <button class="layui-btn layui-btn-xs" style="float: right;background-color: #00C59C" lay-submit lay-filter="formSubmit">授权</button>
                        </div>
                        <div style="width: 100%;height: 1px;background-color: #E7EAED;" id="sqline"></div>
                        <div class="oneMenus"></div>
                    </div>
                </div>
            </div>

            <div class="layui-col-xs8" style="background: #fff;height: calc(100% - 50px);width: calc(100% - 310px)">
                <div class="layui-col-md12" id="234Menus" style="height: 100%;overflow:auto;"></div>
            </div>
        </form>

    </div>

</div>

<script>
    //权限操作验证
    layui.use(['layer', 'form','element'], function() {
        form = layui.form;
        layer = layui.layer
        element = layui.element;

        //一级菜单选中 取消
        form.on('checkbox(oneCheck)', function(){
            //改变一级菜单勾选样式
            $(this).attr('lay-skin','primary') ;
            //重置234级菜单及判断是否勾选
            var oneValue = $(this).val();
            load234Right(oneValue,'check'); //布局 如是勾选则进行数据及勾选操作

            //如果是未勾选 处理数据
            if($(this).prop("checked") == false){
                oneUnChecked(oneValue);
            }
        });

        //选择二级checkbox
        form.on('checkbox(twoCheck)', function(){
            //获取一二级的ID值
            var twoValue = $(this).val();
            var oneValue = $(this).attr("parent_id");
            var tnum = $(this).attr("tnum");
            showRight(twoValue);//显示下级菜单
            if($(this).prop("checked") == true){
                //选择下级
                $("#twoNeir"+twoValue).find(".threeCheck").prop("checked", true);
                $("#twoNeir"+twoValue).find(".fourCheck").prop("checked", true);
                //选择、判断一级样式
                getCheckCss('twoCheck','oneCheck',oneValue,'');

                //------------------------------------------数据存放
                //一级菜单数据
                addRight(oneValue);
                //二级菜单数据
                addRight(twoValue);

                //三级菜单数据
                var threedata = AllRightMap[tnum].three;
                for (var j = 0; j < threedata.length; j++) {
                    addRight(threedata[j].id);
                }
            }else{
                //选择下级
                $("#twoNeir"+twoValue).find(".threeCheck").prop("checked", false);
                $("#twoNeir"+twoValue).find(".fourCheck").prop("checked", false);

                //选择、判断一级样式
                getUnCheckCss('twoCheck','oneCheck',oneValue,'');

                //------------------------------------------数据存放
                if($("input[name='oneCheck'][value='"+oneValue+"']").prop("checked") == false){
                    //一级菜单删除
                    delRight(oneValue);
                }
                //二级菜单删除
                delRight(twoValue);

                //三级菜单数据
                var threedata = AllRightMap[tnum].three;
                for (var j = 0; j < threedata.length; j++) {
                    delRight(threedata[j].id);
                }
            }
            layui.form.render(); //重新渲染
        });

        //选择三级checkbox
        form.on('checkbox(threeCheck)', function(){
            var threeValue = $(this).val();
            var twoValue = $(this).attr("parent_id");
            var oneValue = $("input[name='twoCheck'][value='"+twoValue+"']").attr("parent_id");
            var tnum = $(this).attr("tnum");
            var ptnum = $(this).attr("ptnum");

            if($(this).prop("checked") == true){
                //选择下级
                $("#button"+threeValue).find(".fourCheck").prop("checked", true);
                //选择、判断二级样式
                getCheckCss('threeCheck','twoCheck',twoValue,twoValue);

                //选择、判断一级样式
                getCheckCss('twoCheck','oneCheck',oneValue,'');

                //------------------------------------------数据存放
                //一级菜单数据
                addRight(oneValue);
                //二级菜单数据
                addRight(twoValue);
                //三级菜单数据
                addRight(threeValue);

            }else{
                //选择、判断二级样式
                getUnCheckCss('threeCheck','twoCheck',twoValue,twoValue);

                //选择、判断一级样式
                getUnCheckCss('twoCheck','oneCheck',oneValue,'');

                //------------------------------------------数据删除
                if($("input[name='oneCheck'][value='"+oneValue+"']").prop("checked") == false){
                    //一级菜单删除
                    delRight(oneValue);
                }
                if($("input[name='twoCheck'][value='"+twoValue+"']").prop("checked") == false){
                    //二级菜单删除
                    delRight(twoValue);
                }
                //三级菜单数据
                delRight(threeValue);
            }
            layui.form.render(); //重新渲染
        });

        //提交菜单授权
        form.on('submit(formSubmit)', function(data){
            var org_id = $("#org_id").val();
            if(org_id == null || org_id == ''){
                layer.msg("所属组织不能为空！", {offset: '200px'});
                return false;
            }
            var bbwh_id = $("#bbwh_id").val();
            if(bbwh_id == null || bbwh_id == ''){
                layer.msg("所属版本不能为空！", {offset: '200px'});
                return false;
            }

            if(addArray.length == 0 && delArray.length == 0){
                layer.msg("没有要添加或删除的菜单！", {offset: '200px'});
                return false;
            }

            //数据封装
            var json = {};
            jsonASD.code= orgMenuCode ;
            json.ASD = jsonASD;
            json.org_id = org_id ;
            json.addArray = addArray.join(',');
            json.delArray = delArray.join(",");
            json.bbwh_id = bbwh_id;

            $.ajax({
                type:"POST",
                url:zdycdGrantUrl,
                async:false,
                dataType:"json", //服务器返回数据的类型
                contentType: 'application/json',
                data:JSON.stringify(json),
                success:function(data){
                    if(data.resultCode=="200"){
                        layer.msg("授权成功！", {offset: '200px'});
                        qikong();
                        selZdycdxx();
                    }else{
                        layer.msg(data.resultMsg, {offset: '200px'});
                    }
                }
            });
            return false ;
        });

    });


</script>
</body>
</html>
