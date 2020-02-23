$(function () {
    layui.use(['table','form','layer'], function() {

        var table=layui.table,
            form=layui.form,
            layer=layui.layer;

        var json ={};
        jsonASD.code=ptFindCode;
        json.ASD=jsonASD;
        json.tableName=tableName;
        json.fildName="ID,NAME,ACCOUNT,TYPE,ZT,ISADMIN";
        var jsonWhere={};
        jsonWhere.org_id=belong_org_id;
        jsonWhere.isadmin='1';
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;

        //打开添加修改页面
        window.loadConfigForm =function () {
            document.getElementById("configForm").reset();
            $("#ID").val("");
            status="";
            layer.open({
                type:1,//类型
                area:['400px','200px'],//定义宽和高
                title:'系统用户',//题目
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
                $("#user_zt").html(getDataSelectHtml('TYQY_ZT','1',json.where.ZT,'请选择用户状态'));
                form.render();
            },
            where:json, //接口的其它参数
            // size:'sm', //整体表格尺寸，sm  lg
            cols: [[ //表头
                {field: 'NAME', title: '用户姓名',  sort: false}
                , {field: 'ACCOUNT', title: '用户账户',  sort: false}
                , {field: 'ZT', title: '状态', width:100 , sort: false, templet:function (obj) {
                        return getDataText('TYQY_ZT',obj.ZT);
                    }
                }
                // , {field: 'ISADMIN', title: '是否管理员', width:100 ,  sort: false, templet:function (obj) {
                //         return getDataText('SFBZ',obj.ISADMIN);
                //     }}
                , {title:'操作',width:200 , templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);  //当前行数据
                        json2.TYQY="ZT";    //停用启用按钮 可为空

                        // var judge={};   //自定义限制
                        // var edit={"ZT":{"1":"N","2":"Y"},"ISADMIN":{"1":"Y","2":"N"}};
                        // judge.XTGL_XTQX_YHGL_EDIT=judgeButtonRightsSon(JSON.stringify(obj),edit,"or"); //and :&& , or:||
                        // judge.XTGL_XTQX_YHGL_CZMM="N";
                        // json2.judge=judge;

                        //屏蔽 该参数可为空 默认为['_CX','_ADD','_IN','_OUT']，如果有更多或其他则自定义
                        // json2.shield=['_CX','_ADD','_IN','_OUT'];

                        return judgeButtonRights(json2);

                        // return getTableBarButton(json2);
                    }}
            ]]
        };

        //表格初始化
        window.creaConfigTable=function(){
            // json.where.ZT='1';
            // json.wherelike.NAME="sys";
            table.init('config', configTable);
            // $("#user_name").val(json.wherelike.NAME);
        };

        //头工具栏事件
        table.on('toolbar(config)', function(obj){
            switch(obj.event){
                case 'addConfig':
                    loadConfigForm();
                    break;
                case 'reset':
                    if(json.where.zt != undefined){
                        delete json.where.zt;
                    }
                    if(json.wherelike.name != undefined){
                        delete json.wherelike.name;
                    }
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#user_name").val()!=""){
                        json.wherelike.name = $.trim($("#user_name").val());
                    }else{
                        delete json.wherelike.name;
                    }
                    if($("#user_zt").val()!=""){
                        json.where.zt=$("#user_zt").val();
                    }else{
                        delete json.where.zt;
                    }
                    table.init('config', configTable);
                    $("#user_name").val(json.wherelike.name);
                    $("#user_zt").val(json.where.zt);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'XTGL_XTQX_YHGL_DEL'){
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
            } else if(obj.event === 'XTGL_XTQX_YHGL_EDIT'){
                loadConfigForm();
                $("#ID").val(obj.data.ID);
                form.val('configForm', {
                    "NAME": obj.data.NAME,
                    "ACCOUNT": obj.data.ACCOUNT,
                })
            }else if(obj.event === 'stop'){
                layer.confirm('你确定要停用该用户吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
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
                layer.confirm('你确定要启用该用户吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
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
            }else if(obj.event === 'XTGL_XTQX_YHGL_CZMM'){
                layer.confirm('你确定要重置密码吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.PASSWORD  = hex_md5(getConfig("SYS_USER_DEFA_PASS").VALUE).toUpperCase();
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
                                creaConfigTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }else if(obj.event === 'XTGL_XTQX_YHGL_CKJS'){
                layer.open({
                    type: 1,
                    title:'用户角色',
                    area:['360px','300px'],//定义宽和高
                    shadeClose: true,//点击遮罩层关闭
                    content: $('#userRole_div')
                });

                var id = obj.data.ID;
                var json1 ={};
                json1.id = id;
                json1.ASD=jsonASD;
                getAjax({url:selUserRoleUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            var list = reg.data;
                            var roles = '';
                            if(list){
                                for(var i=0;i<list.length;i++){
                                    roles += '<span style="width: 80px;padding-left: 10px;">'+list[i].role_name+'</span>';
                                }
                            }
                            $("#roles").html(roles);
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }
                });

            }else if(obj.event === 'XTGL_XTQX_YHGL_JSQX'){
                layer.open({
                    type:1,//类型
                    area:['1000px','500px'],//定义宽和高
                    title:'用户权限',//题目
                    shadeClose:true,//点击遮罩层关闭
                    content: $('#userRight')
                });
                var id = obj.data.ID;
                var json1 ={};
                json1.id = id;
                json1.ASD=jsonASD;
                getAjax({url:selUserRoleUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            var list = reg.data;
                            var roles = '';
                            if(list){
                                for(var i=0;i<list.length;i++){
                                    var a = JSON.stringify(list[i]);
                                    roles += "<div class='roleButton' onclick='order11("+a+")'>"+list[i].role_name+"</div>";
                                }
                            }
                            $("#roles").html(roles);
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }
                });
                getAjax({url:selUserRightUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            var data = reg.data;
                            var divs = '';
                            yhqx = {};
                            for (var i=0;i<data.length;i++){
                                divs += '<div class="oneMenu" itemid="'+ data[i].id +'" style="height: 30px;padding-top:10px;">';
                                divs += '<a href="javascript:void(0);">'+data[i].name+'</a>';
                                divs += '</div>';
                                yhqx[data[i].id] = data[i].list2;
                            }
                            $(".oneMenus").html(divs);
                            layui.form.render(); //重新渲染
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }
                });
            }
        });

        window.order11=function (obj) {
            console.info(obj);
        }

        //系统参数 表单提交
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
                jsonInsert.PASSWORD = hex_md5("111111").toUpperCase();
                jsonInsert.ISADMIN = '1';
                jsonInsert.ZT = '2';
                jsonInsert.TYPE = '5';
                json.insert=jsonInsert;
                url= insertConfigUrl;
            }else{
                json.account=data.field.ACCOUNT;
                json.name=data.field.NAME;
                json.id=$("#ID").val();
                json.org_id=belong_org_id;
                json.ASD.code=updateCode;
                url= updateUserUrl;   //updateUserUrl
            }
            getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
                    if(reg.resultCode == '200'){
                        status="SUCCESS";
                        layer.msg("操作成功！", {offset: '200px'});
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
                    id:$("#ID").val()
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
            }
        });

        //初始化table
        creaConfigTable();

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

})

//通过一级菜单查询二、三、四级菜单
$(document).on('click', '.oneMenu', function(){
    load234Right($(this).attr("itemid"),'menu');
});

//加载234级菜单
function load234Right(id,type){
    $("#234Menus").html('');
    var right_id = id ;

    var data = yhqx[right_id];
    console.log(data);
    var html = '';
    for(var i=0;i<data.length;i++){
        html += '<div style="clear: both;">';
        html += '<div class="twoTitleDiv">';
        html += '<div style="float: left;" class="twoTitle" togger="'+ data[i].id +'"><i class="layui-icon layui-icon-down"></i> '+ data[i].name +'</div>';
        html += '</div>';
        html += '<div class="twoNrDiv showClass" id="twoNeir'+ data[i].id +'">';
        var threedata = data[i].list3;
        for (var j=0;j<threedata.length;j++){
            html += '<div class="nrLine">';
            html += '<div style="float: left;width: 150px;margin-left: 20px;">'+ threedata[j].name +'</div>';
            html += '<div style="float:left;margin-left:5px;width: 500px;" id="button'+ threedata[j].id +'">';
            var fourdata = threedata[j].list4;
            for(var m=0;m<fourdata.length;m++){
                html += '<div style="float:left;padding-left: 10px;line-height: 25px;">'+ fourdata[m].name + '</div>';
            }
            html += '</div>';
            html += '</div>';
        }
        html += '</div>';
        html += '</div>';
    }
    // alert(html);
    $("#234Menus").html(html);
    layui.form.render(); //重新渲染

}