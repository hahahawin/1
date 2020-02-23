var user1="";
var user2="";
$(function () {
    layui.use(['table','form','layer'], function() {

        var table=layui.table,
            form=layui.form,
            layer=layui.layer;



        var json ={};
        jsonASD.code=ptFindCode;
        json.ASD=jsonASD;
        json.tableName=tableName;
        json.fildName="ID,NAME,CODE,ZT,TYPE,MEMO";
        var jsonWhere={};
        jsonWhere.ORG_ID=belong_org_id;
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;
        var configTable={
            defaultToolbar:[],
            toolbar:'#toolbarConfig',
            height: 'full-5',
            url: loadConfigUrl,
            method:'post', //接口http请求类型，默认：get
            contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
            page: true,
            enabledCurrCookie: true,
            limits:[10,20,30,40,50,60,70,80,90],
            limit:10,
            done:function(){
                $("#role_zt").html(getDataSelectHtml('TYQY_ZT','1',json.where.ZT,'请选择角色状态'));
                form.render();
            },
            where:json, //接口的其它参数
            // size:'sm', //整体表格尺寸，sm  lg
            cols: [[ //表头
                {field: 'NAME', title: '角色名称',  sort: false}
                , {field: 'CODE', title: '角色编号',  sort: false}
                , {field: 'ZT', width:100, title: '状态',  sort: false, templet:function (obj) {
                        return getDataText("TYQY_ZT",obj.ZT);
                    }}
                , {title:'操作',width:200, templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        // json._TYQY={"ZT":{"1":"Y","2":"N"}};
                        json2.rowData=JSON.stringify(obj);
                        json2.TYQY="ZT";
                        return judgeButtonRights(json2);
                    }}
            ]]
        };
        //打开添加修改页面
        window.loadConfigForm =function () {
            document.getElementById("configForm").reset();
            $("#ID").val("");
            status="";
            layer.open({
                type:1,//类型
                area:['400px','200px'],//定义宽和高
                title:'系统角色',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#CONFIG'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    $("#addConfigSub").click();
                    if(status=="SUCCESS"){
                        creaConfigTable();
                        layer.close(index);
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                },
                btn2:function (index,layero) {
                    layer.close(index);
                }
            });
        };


        //打开角色授权页面
        var index = '';
        window.loadAuthMenuForm =function () {
            //清空数据
            rightMap = {};
            AllRightMap = {} ;
            addArray = new Array();
            delArray = new Array();
            roleOneRight();
            status = "";
            index = layer.open({
                type: 1,
                area:['1000px','500px'],//定义宽和高
                title:'角色授权',//题目
                fixed: false, //不固定
                maxmin: false,
                content: $('#authMenuPage')
            });
        };

        //打开授权用户界面
        window.loadAuthUserForm = function(){
            layer.open({
                type: 1,
                area:['1000px','500px'],//定义宽和高
                title:'授权用户',//题目
                fixed: false, //不固定
                maxmin: false,
                content: $('#authUserPage')
            });
        };

        //表格初始化
        window.creaConfigTable=function(){
            table.init('config', configTable);
        };

        //头工具栏事件
        table.on('toolbar(config)', function(obj){
            switch(obj.event){
                case 'addConfig':
                    loadConfigForm();
                    break;
                case 'reset':
                    if(json.wherelike.NAME != undefined){
                        delete json.wherelike.NAME;
                    }
                    if(json.wherelike.CODE != undefined){
                        delete json.wherelike.CODE;
                    }
                    if(json.where.ZT != undefined){
                        delete json.where.ZT;
                    }
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#role_name").val()!=""){
                        json.wherelike.NAME=$.trim($("#role_name").val());
                    }else{
                        delete json.wherelike.NAME;
                    }
                    if($("#role_code").val()!=""){
                        json.wherelike.CODE=$.trim($("#role_code").val());
                    }else{
                        delete json.wherelike.CODE;
                    }
                    if($("#role_zt").val()!=""){
                        json.where.ZT=$("#role_zt").val();
                    }else{
                        delete json.where.ZT;
                    }
                    table.init('config', configTable);
                    $("#role_name").val(json.wherelike.NAME);
                    $("#role_code").val(json.wherelike.CODE);
                    $("#role_zt").val(json.where.ZT);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'XTGL_XTQX_JSGL_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonDelete={};
                    jsonDelete.ID=obj.data.ID;
                    json1.delete=jsonDelete;
                    $.ajax({
                        type:"POST",
                        url:deleteConfigUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                obj.del();
                                layer.close(index);
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            } else if(obj.event === 'XTGL_XTQX_JSGL_EDIT'){
                loadConfigForm();
                $("#ID").val(obj.data.ID);
                form.val('configForm', {
                    "NAME": obj.data.NAME,
                    "CODE": obj.data.CODE,
                    "ZT": obj.data.ZT
                })
            }else if(obj.event === 'XTGL_XTQX_JSGL_CDSQ'){
                role_id = obj.data.ID;
                loadAuthMenuForm();
            }else if(obj.event === 'XTGL_XTQX_JSGL_YHSQ'){
                role_id = obj.data.ID;

                selRoleUser();
                selNotRoleUser();
                loadAuthUserForm();
            }else if(obj.event === 'stop'){
                layer.confirm('你确定要停用该角色吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT  = '1';
                    json1.fild=jsonFild;

                    $.ajax({
                        type:"POST",
                        url:updateConfigUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creaConfigTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }else if(obj.event === 'enable'){
                layer.confirm('你确定要启用该角色吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT  = '2';
                    json1.fild=jsonFild;

                    $.ajax({
                        type:"POST",
                        url:updateConfigUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creaConfigTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }
        });

        table.on('toolbar(roleUserTable)', function(obj){
            switch(obj.event){
                case 'delRoleUser':
                    delRoleUserTj();
                    break;
                case 'resetUser1':
                    $("#user_name1").val('');
                    selRoleUser();
                    break;
                case 'chaxunUser1':
                    selRoleUser();
                    $("#user_name1").val(user1);

                    break;
            };
        });

        //头工具栏事件
        table.on('toolbar(notRoleUserTable)', function(obj){
            switch(obj.event){
                case 'addRoleUser':
                    addRoleUserTj();
                    break;
                case 'resetUser2':
                    $("#user_name2").val('');
                    selNotRoleUser();
                    break;
                case 'chaxunUser2':
                    selNotRoleUser();
                    $("#user_name2").val(user2);
                    break;
            };
        });

        //角色 表单提交
        form.on('submit(addConfigSub)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#ID").val()==""||$("#ID").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.ZT = '2';
                json.insert=jsonInsert;
                url= insertConfigUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#ID").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                json.fild=jsonFild;
                url= updateConfigUrl;
            }
            $.ajax({
                type: 'POST',
                url: url,
                dataType: "json",
                data: JSON.stringify(json),
                async:false,
                contentType : "application/json",
                success: function(reg) {
                    if(reg.resultCode == '200'){
                        status="SUCCESS";
                        layer.msg("操作成功！", {offset: '200px'});
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
                if(value != null && value != ''){
                    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                        return '不能有特殊字符';
                    }
                }
            },
            unique: function (value,item) {//唯一性验证
                var checkResult="1";
                var param={
                    tableName:tableName,
                    key:item.name,
                    value:value,
                    id:$("#ID").val(),
                    org_id:belong_org_id
                }
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

        //初始化table
        creaConfigTable();

        //一级菜单选中 取消
        form.on('checkbox(oneCheck)', function(){
            //改变一级菜单勾选样式
            $(this).attr('lay-skin','primary') ;
            //重置234级菜单及判断是否勾选
            var oneValue = $(this).val();
            load234Right(oneValue,'check'); //布局 如是勾选则进行数据及勾选操作

            //如果是未勾选 处理数据
            if($(this).prop("checked") == false){
                // reAddRight(oneValue);
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

                    //四级菜单数据
                    var fourdata = threedata[j].four;
                    for (var k = 0; k < fourdata.length; k++) {
                        addRight(fourdata[k].id);
                    }
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

                    //四级菜单数据
                    var fourdata = threedata[j].four;
                    for (var k = 0; k < fourdata.length; k++) {
                        delRight(fourdata[k].id);
                    }
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

                //四级菜单数据
                var fourdata = AllRightMap[ptnum].three[tnum].four;
                for (var k = 0; k < fourdata.length; k++) {
                    addRight(fourdata[k].id);
                }

            }else{
                //选择下级
                $("#button"+threeValue).find(".fourCheck").prop("checked", false);

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

                //四级菜单数据
                var fourdata = AllRightMap[ptnum].three[tnum].four;
                for (var k = 0; k < fourdata.length; k++) {
                    delRight(fourdata[k].id);
                }
            }
            layui.form.render(); //重新渲染
        });

        //选择四级checkbox
        form.on('checkbox(fourCheck)', function(){
            var fourValue = $(this).val();
            var threeValue = $(this).attr("parent_id");
            var twoValue = $("input[name='threeCheck'][value='"+threeValue+"']").attr("parent_id");
            var oneValue = $("input[name='twoCheck'][value='"+twoValue+"']").attr("parent_id");
            var tnum = $(this).attr("tnum");
            var ptnum = $(this).attr("ptnum");
            if($(this).prop("checked") == true){
                //选择、判断三级样式
                getCheckCss('fourCheck','threeCheck',threeValue,threeValue);
                //选择、判断二级样式
                getCheckCss('threeCheck','twoCheck',twoValue,'');
                //选择、判断一级样式
                getCheckCss('twoCheck','oneCheck',oneValue,'');

                //------------------------------------------数据存放
                //一级菜单数据
                addRight(oneValue);
                //二级菜单数据
                addRight(twoValue);
                //三级菜单数据
                addRight(threeValue);
                //四级菜单数据
                addRight(fourValue);
            }else {
                //选择、判断三级样式
                getUnCheckCss('fourCheck','threeCheck',threeValue,threeValue);
                //选择、判断二级样式
                getUnCheckCss('threeCheck','twoCheck',twoValue,'');
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
                if($("input[name='threeCheck'][value='"+threeValue+"']").prop("checked") == false){
                    //三级菜单删除
                    delRight(threeValue);
                }
                //四级菜单数据
                delRight(fourValue);
            }
            layui.form.render(); //重新渲染
        });


        //提交菜单授权
        form.on('submit(formSubmit)', function(data){
            var org_id = belong_org_id;
            if(role_id == null || role_id == ''){
                layer.msg("角色不能为空！", {offset: '200px'});
                return false;
            }
            if(addArray.length==0 && delArray.length==0){
                layer.msg("未有改变菜单授权，不用提交！", {offset: '200px'});
                return false;
            }
            //数据封装
            var json = {};
            json.borg_id = org_id ;
            json.role_id = role_id;
            json.addArray = addArray.join(',');
            json.delArray = delArray.join(",");
            jsonASD.code=roleMenuCode;
            json.ASD=jsonASD;
            $.ajax({
                type:"POST",
                url:roleGrantUrl,
                async:false,
                dataType:"json", //服务器返回数据的类型
                contentType: 'application/json',
                data:JSON.stringify(json),
                success:function(data){
                    if(data.resultCode=="200"){
                        layer.msg("授权成功！", {offset: '200px'});
                        layer.close(index);
                    }else{
                        layer.msg(data.resultMsg, {offset: '200px'});
                    }
                }
            });
            return false ;
        });

    });

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

function roleOneRight(){
    $("#234Menus").html(''); //清空234级菜单页面
    //判断组织ID是否为空
    if(role_id == null || role_id == '' || role_id==undefined){
        $(".oneMenus").html('');
        layer.msg("角色ID不能为空", {offset: '200px'});
        return false;
    }
    //json封装请求
    var json ={};
    json.borg_id = belong_org_id ;
    json.id = -1 ;
    json.role_id = role_id;
    json.xmlx = xmlx;
    json.ASD = jsonASD;
    $.ajax({
        type:"POST",
        url:roleOneRightUrl,
        async:false,
        dataType:"json", //服务器返回数据的类型
        contentType: 'application/json',
        data:JSON.stringify(json),
        success:function(reg){
            if(reg.resultCode=="200"){
                var data = reg.resultData ;
                rightMap = reg.menuList ;

                var checkStr = '' ;
                var lfter = '' ;
                var divs = '';
                for (var i=0;i<data.length;i++){
                    divs += '<div class="oneMenu" itemid="'+ data[i].id +'" style="height: 30px;padding-top:10px;">';
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
                    divs += '<input type="checkbox" name="oneCheck" class="oneCheck" lay-filter="oneCheck" value="'+data[i].id+'" lay-skin="'+ lfter +'" '+checkStr+'> '+ data[i].name;
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

//通过一级菜单查询二、三、四级菜单
$(document).on('click', '.oneMenu', function(){
    load234Right($(this).attr("itemid"),'menu');
});

//加载234级菜单
function load234Right(id,type){
    $("#234Menus").html('');
    var right_id = id ;
    var borg_id = belong_org_id;

    //验证一级菜单ID是否为空
    if(id==null || id=='' || id==undefined){
        layer.msg('未获取到一级菜单信息', {offset: '200px'});
        return false ;
    }

    //验证组织ID是否为空
    if(borg_id==null || borg_id=='' || borg_id==undefined){
        layer.msg('未获取到组织信息', {offset: '200px'});
        return false
    }

    //json封装请求
    var json ={};
    json.borg_id = borg_id ;
    json.id = right_id ;
    json.role_id = role_id;
    json.xmlx = xmlx;
    json.ASD = jsonASD;
    $.ajax({
        type:"POST",
        url:role234RightUrl,
        async:false,
        dataType:"json", //服务器返回数据的类型
        contentType: 'application/json',
        data:JSON.stringify(json),
        success:function(reg){
            if(reg.resultCode=="200"){
                var data = reg.resultData ;
                AllRightMap = data ;
                var html = '';
                for(var i=0;i<data.length;i++){
                    html += '<div style="clear: both;">';
                    html += '<div class="twoTitleDiv">';
                    html += '<div style="float: left;" class="twoTitle" togger="'+ data[i].id +'"><i class="layui-icon layui-icon-down"></i><span style="margin-left: 5px;">'+ data[i].name +'</span></div>';
                    html += '<div style="float: right;" ><input type="checkbox" name="twoCheck" class="twoCheck" value="'+ data[i].id +'" parent_id="'+ data[i].pid +'" tnum="'+i+'" lay-filter="twoCheck" lay-skin="primary" style="margin-top:5px;" /> 全选</div>';
                    html += '</div>';
                    html += '<div class="twoNrDiv showClass" id="twoNeir'+ data[i].id +'">';
                    var threedata = data[i].three;
                    for (var j=0;j<threedata.length;j++){
                        html += '<div class="nrLine">';
                        html += '<div style="float: left;width: 150px;margin-left: 35px;"><input type="checkbox" name="threeCheck" class="threeCheck" ptnum="'+i+'" tnum="'+j+'" lay-filter="threeCheck" lay-skin="primary" value="'+ threedata[j].id +'" parent_id="'+ threedata[j].pid +'"> '+ threedata[j].name +'</div>';
                        html += '<div style="float:left;margin-left:5px;width: calc(100% - 190px)" id="button'+ threedata[j].id +'">';
                        var fourdata = threedata[j].four;
                        for(var m=0;m<fourdata.length;m++){
                            html += '<div style="float:left;padding-left: 5px;min-width: 100px;padding-bottom: 5px;"><input type="checkbox" name="fourCheck" class="fourCheck" lay-filter="fourCheck" lay-skin="primary" value="'+ fourdata[m].id +'" parent_id="'+ fourdata[m].pid +'"> '+ fourdata[m].name+'</div>';
                        }
                        html += '</div>';
                        html += '</div>';
                    }
                    html += '</div>';
                    html += '</div>';
                    html += '<div style="clear: both; width: 100%;height: 1px;background-color: #E7EAED;"></div>';
                }
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

                //四级菜单数据
                var fourdata = threedata[j].four;
                for (var k = 0; k < fourdata.length; k++) {
                    addRight(fourdata[k].id);
                }
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
                    var fourdata = threedata[j].four;
                    if(fourdata.length==0){ //四级菜单为空
                        var pid = $.inArray(threedata[j].id,addArray) ;
                        if(pid!=-1 || threedata[j].chk*1>0){
                            //三级菜单设置为选中
                            $("input[name='threeCheck'][value='"+threedata[j].id+"']").prop("checked", true);
                            //选择、判断二级样式
                            getCheckCss('threeCheck','twoCheck',AllRightMap[i].id,AllRightMap[i].id);
                            //选择、判断一级样式
                            getCheckCss('twoCheck','oneCheck',AllRightMap[i].pid,'');
                        }
                    }else{//四级菜单不为空
                        for (var k=0;k<fourdata.length;k++){
                            var pid = $.inArray(fourdata[k].id,addArray) ;
                            if(pid!=-1 || fourdata[k].chk*1>0){
                                //四级菜单设置为选中
                                $("input[name='fourCheck'][value='"+fourdata[k].id+"']").prop("checked", true);
                                //选择、判断三级样式
                                getCheckCss('fourCheck','threeCheck',threedata[j].id,threedata[j].id);
                                //选择、判断二级样式
                                getCheckCss('threeCheck','twoCheck',AllRightMap[i].id,AllRightMap[i].id);
                                //选择、判断一级样式
                                getCheckCss('twoCheck','oneCheck',AllRightMap[i].pid,'');
                            }
                        }
                    }
                }
            }
        }
    }

    layui.form.render(); //重新渲染
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

//判断当前选中是否存在
function getRightMap(id){
    var right_id = "" ;
    for(var i=0 ; i<rightMap.length;i++){
        if(rightMap[i].right_id == id){
            right_id = id ;
            break ;
        }
    }
    return right_id ;
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

            //四级菜单数据删除
            var fourdata = threedata[j].four;
            for (var k = 0; k < fourdata.length; k++) {
                delRight(fourdata[k].id)
            }
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

//显示权限菜单
function showRight(id){
    $("#twoNeir"+id).addClass("showClass");
    $(this).find(".layui-icon").removeClass("layui-icon-right");
    $(this).find(".layui-icon").addClass("layui-icon-down");
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

//查询已授角色用户
function selRoleUser(){
    user1= $("#user_name1").val();
    var json={};
    json.belong_org_id=belong_org_id;
    json.role_id = role_id;
    json.user_type = '5';
    json.user_name = $("#user_name1").val();
    json.tiaojian = 'EXISTS';
    json.ASD = jsonASD;
    layui.table.render({
        elem: '#roleUserTable'
        ,id:'user1'
        ,height: 450
        ,url: roleUserUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        ,toolbar :'#toolbarUser1'
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {type:'checkbox'}
            ,{field: 'USER_NAME', title: '用户姓名', sort: false}
            ,{field: 'USER_ACCOUNT', title: '用户账户', sort: false}
            // ,{field: 'USER_TYPE', title: '用户类型', width:80, templet:function (obj) {
            //         if (obj.USER_TYPE=='1'){
            //             return "学生";
            //         }else if (obj.USER_TYPE=='3'){
            //             return "教职工";
            //         }else if (obj.USER_TYPE=='5'){
            //             return "平台员工";
            //         }
            //     }}
        ]]
    });

}

//查询未授角色用户
function selNotRoleUser(){
    user1= $("#user_name2").val();
    var json={};
    json.belong_org_id = belong_org_id;
    json.role_id = role_id;
    json.user_type = '5';
    json.user_name = $("#user_name2").val();
    json.tiaojian = 'NOT EXISTS';
    json.ASD = jsonASD;
    layui.table.render({
        elem: '#notRoleUserTable'
        ,id:'user2'
        ,height: 450
        ,url: roleUserUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        ,toolbar :'#toolbarUser2'
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {type:'checkbox'}
            ,{field: 'USER_NAME', title: '用户姓名', sort: false}
            ,{field: 'USER_ACCOUNT', title: '用户账户', sort: false}
            // ,{field: 'USER_TYPE', title: '用户类型', width:80, templet:function (obj) {
            //         if (obj.USER_TYPE=='1'){
            //             return "学生";
            //         }else if (obj.USER_TYPE=='3'){
            //             return "教职工";
            //         }else if (obj.USER_TYPE=='5'){
            //             return "平台员工";
            //         }
            //     }}
        ]]
    });
    return false;
}

//授权用户提交
function addRoleUserTj(){
    var checkStatus = layui.table.checkStatus('user2');
    var ids = [];
    $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
        ids.push(o.USER_ID);
    });
    if (ids.length < 1) {
        layer.msg('请选择要添加的用户！');
        return false;
    }
    ids = ids.join(",");
    var json = {};
    json.role_id = role_id;
    json.ids = ids;
    jsonASD.code=roleUserCode;
    json.ASD=jsonASD;
    $.ajax({
        type:"POST",
        url:addRoleUserUrl,
        async:false,
        dataType:"json", //服务器返回数据的类型
        contentType: 'application/json',
        data:JSON.stringify(json),
        success:function(reg){
            if(reg.resultCode=="200"){
                $("#user_name1").val('');
                $("#user_name2").val('');
                selRoleUser();
                selNotRoleUser();
                layer.msg("操作成功！", {offset: '200px'});
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
            }
        }
    });
    return false;
}

//移除用户提交
function delRoleUserTj(){
    var checkStatus = layui.table.checkStatus('user1');
    var ids = [];
    $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
        ids.push(o.USER_ID);
    });
    // console.log(ids);
    if (ids.length < 1) {
        layer.msg('请选择要移除的用户！');
        return false;
    }
    ids = ids.join(",");
    var json = {};
    json.role_id = role_id;
    json.ids = ids;
    jsonASD.code=roleUserCode;
    json.ASD=jsonASD;
    $.ajax({
        type:"POST",
        url:delRoleUserUrl,
        async:false,
        dataType:"json", //服务器返回数据的类型
        contentType: 'application/json',
        data:JSON.stringify(json),
        success:function(reg){
            if(reg.resultCode=="200"){
                $("#user_name1").val('');
                $("#user_name2").val('');
                selRoleUser();
                selNotRoleUser();
                layer.msg("操作成功！", {offset: '200px'});
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
            }
        }
    });
    return false;
}
