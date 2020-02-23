/**
 * 倪杨
 * 2019-09-06
 * 组织机构js
 */

$(function () {
    loadPid();
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.type = 3;
    // json.tableName=tableName;
    // json.fildName="ID,PID,PNAME,NAME,CODE,SBKT,TYPE,ZT,BSLX,BSPT";
    // var jsonWhere={};
    // jsonWhere.TYPE=3;
    // json.where=jsonWhere;
    var configTable={
        defaultToolbar:[],
        toolbar:'#toolbarConfig',
        height: 'full-0',
        url: loadConfigUrl,
        method:'post', //接口http请求类型，默认：get
        contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
        page: true,
        enabledCurrCookie: true,
        limits:[10,20,30,40,50,60,70,80,90],
        limit:10,
        where:json, //接口的其它参数
        // size:'sm', //整体表格尺寸，sm  lg
        cols: [[ //表头
            {field: 'NAME', title: '组织名称',  sort: true}
            , {field: 'CODE', title: '组织机构代码',  sort: true}
            , {field: 'PNAME', title: '上级组织',  sort: true}
            , {field: 'BSLX', title: '部署类型',  sort: true,templet:function (obj) {
                    if (obj.BSLX == "1"){return '平台部署';}else{
                        return '独立部署';
                    }
                }}
            , {field: 'BSPT', title: '部署平台',  sort: true,templet:function (obj) {
                    if (obj.BSPT == "1"){
                        return 'BCCA';
                    }else if(obj.BSPT == '2'){
                        return '教师';
                    }else if(obj.BSPT == '3'){
                        return '教委';
                    } else {
                        return "";
                    }
                }}
            , {field: 'SBKT', title: '流程状态',  sort: true,templet:function (obj) {
                    if (obj.SBKT == "1"){return '<span class="x-red">注册申请</span>'}
                    else if (obj.SBKT == "2") {return '申请审批'}
                    else if (obj.SBKT == "3") {return '未开通'}
                    else if (obj.SBKT == "4") {return '<span class="x-green">己开通</span>'}
                }}
            , {title:'操作', width:150,  templet:function (obj) {//toolbar:'#barConfig'
                var json2={};
                json2.rowData=JSON.stringify(obj);
                var pd="Y";
                if (obj.SBKT=='4'){
                    pd="N";
                }
                var judge={};
                judge.PTGL_ZZGL_ZCSP_APPR=pd;
                judge.PTGL_ZZGL_ZCSP_DEL=pd;
                json2.judge=judge;
                return judgeButtonRights(json2);
            }}
        ]]
    };
//打开添加修改页面
    window.loadConfigForm =function () {
        document.getElementById("form").reset();
        $("#ConfigHiddenId").val("");
        status="";
        layer.open({
            type:1,//类型
            area:['700px','370px'],//定义宽和高
            title:'审核',//题目
            shadeClose:false,//点击遮罩层关闭
            btn: ['确定','关闭'],
            content: $('#operationPage'),//打开的内容
            yes:function (index,layero) {
                $("#addConfigSub").click();
                if(status=="SUCCESS"){
                    creaConfigTable();
                    layer.close(index);
                }
            },
            btn2:function (index,layero) {
                layer.close(index);
            }
        });
    };

    layui.use(['table','form','layer'], function() {

        var table=layui.table,
            form=layui.form,
            layer=layui.layer;

        //表格初始化
        window.creaConfigTable=function(){
            table.init('config', configTable);
        };

        //头工具栏事件
        table.on('toolbar(config)', function(obj){
            switch(obj.event){
                case 'add':
                    loadConfigForm();
                    break;
                case 'reset':
                    $("#orgName").val("");
                    delete json.orgName;
                    creaConfigTable();
                    break;
                case 'find':
                    if($("#orgName").val()!=""){
                        json.orgName=$.trim($("#orgName").val());
                    }else{
                        delete json.orgName;
                    }
                    creaConfigTable();
                    $("#orgName").val(json.orgName);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'PTGL_ZZGL_ZCSP_APPR'){
                loadConfigForm();
                $("#bspts").hide();
                $("#ConfigHiddenId").val(obj.data.ID);
                var json1={
                    id:obj.data.ID,
                    ASD:jsonASD
                };
                getAjax({url:loadCheckOrgInfoUrl,data:JSON.stringify(json1),callback:function (reg) {
                    if(reg.resultCode=="200"){
                        var list1=reg.list1;
                        var list2=reg.list2;
                        c_bslx = list1.ORG_BSLX;
                        form.val('form', {
                            "PNAME": obj.data.PNAME,
                            "NAME": list1.ORG_NAME,
                            "CODE": list1.ORG_CODE,
                            "BSLX": list1.ORG_BSLX,
                            "SBKT": list1.ORG_SBKT,
                            "XDDM": getDataText('XDDM',list1.ORG_XDDM),
                            "DLWZ": list1.ORG_DLWZ
                        });
                        if (list2!=undefined){
                            form.val('form',{
                                "FZR": list2.INFO_FZR,
                                "LXDH": list2.INFO_LXDH,
                                "CZDH": list2.INFO_CZDH,
                                "DZYX": list2.INFO_DZYX,
                            })
                        }
                        if(c_bslx == '2'){
                            $("[name='BSPT'][value='1']").prop("checked", "checked");
                            $("#bspts").find("input[name='BSPT']").attr('disabled',"disabled");
                        }else{
                            $("[name='BSPT'][value='2']").prop("checked", "checked");
                            $("#bspts").find("input[name='BSPT']").removeAttr('disabled');
                        }
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }});
                form.render();

            }else if (obj.event === 'open'){
                layer.confirm('你确定开通该组织吗？',{title:"温馨提示",icon:4}, function(index){
                    var json ={};
                    json.ASD=jsonASD;
                    json.tableName=tableName;
                    json.ASD.code=updateCode;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT='2';
                    json.fild=jsonFild;
                    $.ajax({
                        type:"POST",
                        url:updateConfigUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                var reg1 = insertK('4',obj.data.ID);
                                if(reg1.resultCode=="200"){
                                    creaConfigTable();
                                    layer.msg("操作成功！", {offset: '200px'});
                                }else{
                                    layer.msg(reg.resultMsg, {offset: '200px'});
                                }
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });

                });
            }else if (obj.event === 'close'){
                layer.confirm('你确定停用该组织吗？',{title:"温馨提示",icon:4}, function(index){
                    var json ={};
                    json.ASD=jsonASD;
                    json.tableName=tableName;
                    json.ASD.code=updateCode;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT='1';
                    json.fild=jsonFild;
                    $.ajax({
                        type:"POST",
                        url:updateConfigUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                var reg1 = insertK('3',obj.data.ID);
                                if(reg1.resultCode=="200"){
                                    creaConfigTable();
                                    layer.msg("操作成功！", {offset: '200px'});
                                }else{
                                    layer.msg(reg.resultMsg, {offset: '200px'});
                                }
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }else if(obj.event === 'PTGL_ZZGL_ZCSP_DEL'){
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
                        url:deleteUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                obj.del();
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

        form.on('radio(sfkt)', function(data){
            if(data.value=='4'){
                $("#bspts").show();
            }else{
                $("#bspts").hide();
            }
        });

        //系统参数 表单提交
        form.on('submit(addConfigSub)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            json.ASD.code=updateCode;
            var jsonWhere={};//修改条件
            jsonWhere.ID=$("#ConfigHiddenId").val();
            json.where=jsonWhere;
            var jsonFild={};
            jsonFild.BSLX=c_bslx;
            jsonFild.SBKT=data.field.SBKT;
            if(jsonFild.SBKT == '4'){
                if(c_bslx == '2'){
                    jsonFild.BSPT='1';
                }else{
                    jsonFild.BSPT=data.field.BSPT;
                }
            }
            json.fild=jsonFild;
            getAjax({url:auditOrgUrl,data:JSON.stringify(json),callback:function (reg) {
                if(reg.resultCode=="200"){
                    status="SUCCESS";
                    layer.msg("操作成功！", {offset: '200px'});
                }else{
                    layer.msg(reg.resultMsg, {offset: '200px'});
                }
            }});

            // var json1={};
            // json1.ASD=jsonASD;
            // json1.tableName=tableName2;
            // json1.id="ID";
            // json1.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
            // var jsonInsert = {};
            // jsonInsert.PID=$("#ConfigHiddenId").val();
            // jsonInsert.TYPE=data.field.SBKT;
            // json1.insert=jsonInsert;
            // $.ajax({
            //     type:'post',
            //     url:insertConfigUrl,
            //     data: JSON.stringify(json1),
            //     async:false,
            //     contentType : "application/json",
            //     success: function(reg) {
            //         if(reg.resultCode == '200'){
            //             status="SUCCESS";
            //             layer.msg("操作成功！", {offset: '200px'});
            //         }else {
            //             layer.msg(reg.resultMsg, {offset: '200px'});
            //         }
            //     }
            // })

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

        function insertK(type,id){
            var r="";
            var json1={};
            json1.ASD=jsonASD;
            json1.tableName=tableName2;
            json1.id="ID";
            json1.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
            var jsonInsert = {};
            jsonInsert.PID=id;
            jsonInsert.TYPE=type;
            json1.insert=jsonInsert;
            $.ajax({
                type:'post',
                url:insertConfigUrl,
                data: JSON.stringify(json1),
                async:false,
                contentType : "application/json",
                success: function(reg) {
                    r=reg;
                }
            })
            return r;
        }

        //初始化table
        creaConfigTable();

    });
    function loadPid() {
        $.ajax({
            type: 'POST',
            url: loadPidUrl,
            async:false,
            contentType : "application/json",
            success: function(reg) {
                var list = reg.resultData;
                // console.info(list);
                $("#PID").empty();
                $("#PID").append("<option value=''>请选择</option>");
                for (var i=0;i<list.length;i++){
                    $("#PID").append("<option value='"+list[i].org_id+"'>"+list[i].org_name+"</option>");
                }
            },
            error: function() {
                console.log("fucking error")
            }
        });
    }

    function getTableBarButton1(reg) {
        var obj = reg.rowData;
        var rowData=JSON.parse(obj);
        getRigth();


        var right = JxCore.dataRight[ThirdCode];

        var html='<div class="bar">';
        for (var i=0;i<right.length;i++){
            var sta=false;
            if( right[i].COUNTS > 0){
                if (right[i].RIGHT_CODE.endWith("_ADD")||right[i].RIGHT_CODE.endWith("_CX")){
                    continue;
                }

                if(right[i].ATTR_1==undefined||right[i].ATTR_1==""||right[i].ATTR_1==null){
                    sta=true;
                }else {
                    var attr1=right[i].ATTR_1;
                    if (attr1.indexOf("2")>-1&&isadmin=='2'){
                        sta=true;
                    }
                    if (attr1.indexOf("1")>-1&&rowData.CREA_ID==user_id){
                        sta=true;
                    }
                }

                if(sta){
                    if (rowData.SBKT=='4'){
                        html+='<a href="javascript:void(0)"  title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
                        continue;
                    }
                }

                if (reg.TYQY!=null&&reg.TYQY!=""&&reg.TYQY!=undefined) {
                    var a = reg.TYQY;
                    if (right[i].RIGHT_CODE.endWith("_TYQY")){
                        if (sta){
                            if (rowData[a]=='1'){
                                html+='<a href="javascript:void(0)" title="启用" lay-event="'+"enable" +'"><img src="img/menu/menu4/blue/nr_icon_start.png"></a>';
                            }else{
                                html+='<a href="javascript:void(0)" title="停用" lay-event="'+"stop" +'"><img src="img/menu/menu4/blue/nr_icon_stop.png"></a>';
                            }
                        } else{
                            if (rowData[a]=='1'){
                                html+='<a href="javascript:void(0)" title="启用" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/nr_icon_start.png"></a>';
                            }else{
                                html+='<a href="javascript:void(0)" title="停用" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/nr_icon_stop.png"></a>';
                            }
                        }
                        continue;
                    }
                }



                if (sta==false){
                    html+='<a href="javascript:void(0)"  title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
                    continue;
                }

                html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+right[i].RIGHT_CODE +'"><img src="img/menu/menu4/blue/'+right[i].RIGHT_ICON+'"></a>';
            }else{
                if (right[i].RIGHT_CODE.endWith("_ADD")||right[i].RIGHT_CODE.endWith("_CX")){
                    continue;
                }
                if (reg.TYQY!=null&&reg.TYQY!=""&&reg.TYQY!=undefined) {
                    var a = reg.TYQY;
                    if (right[i].RIGHT_CODE.endWith("_TYQY")){
                        if (rowData[a]=='1'){
                            html+='<a href="javascript:void(0)" title="启用" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/nr_icon_start.png"></a>';
                        }else{
                            html+='<a href="javascript:void(0)" title="停用" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/nr_icon_stop.png"></a>';
                        }
                        continue;

                    }
                }
                html+='<a href="javascript:void(0)"  title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
            }
        }
        html+='</div>';
        return html;
    }
})