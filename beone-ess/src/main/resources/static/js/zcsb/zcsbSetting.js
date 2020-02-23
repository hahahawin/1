$(function () {
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName;
    json.fildName="ID,ACCOUNT,PWD,SFKT,DYZT,NAME,TIME,ORG_ID";
    var jsonWhere={};
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
        where:json, //接口的其它参数
        // size:'sm', //整体表格尺寸，sm  lg
        cols: [[ //表头
            {field: 'ACCOUNT', title: 'BCCA授权账号',  sort: false}
            , {field: 'ORG_NAME', title: '所属组织',  sort: false}
            , {field: 'SFKT', title: '状态',  sort: false,
                templet:function (obj) {
                    if(obj.SFKT == '1'){
                        return '停用';
                    }else{
                        return '启用';
                    }
                }
            }
            , {field: 'DYZT', title: '订阅结果',  sort: false,
                templet:function (obj) {
                    if(obj.DYZT == '1'){
                        return '未订阅';
                    }else{
                        return '已订阅';
                    }
                }
            }
            , {field: 'NAME', title: '添加人',  sort: false}
            , {field: 'TIME', title: '添加时间',  sort: false, templet:function (obj) {
                    return dateFormat("yyyy-mm-dd",obj.TIME);
                }
            }
            , {title:'操作', width:150, templet:function (obj) {//toolbar:'#barConfig'
                    var json2={};
                    json2.rowData=JSON.stringify(obj);
                    json2.TYQY="SFKT";
                    var judge={};   //自定义限制
                    if(obj.SFKT == '1'){
                        judge.ZCSB_ZKGL_SQZH_DY='N';
                        judge.ZCSB_ZKGL_SQZH_BD='N';
                        judge.ZCSB_ZKGL_SQZH_SYNC='N';
                    }else{
                        if(obj.DYZT == '2'){
                            judge.ZCSB_ZKGL_SQZH_DY='N';
                        }else{
                            judge.ZCSB_ZKGL_SQZH_SYNC='N';
                        }
                    }
                    json2.judge=judge;
                    return judgeButtonRights(json2);
                }}
        ]]
    };
    //打开添加修改页面
    window.loadConfigForm =function () {
        selArealist('province10','0');
        selOrglist();
        document.getElementById("configForm").reset();
        $("#id").val("");
        status="";
        layer.open({
            type:1,//类型
            area:['600px','370px'],//定义宽和高
            title:'账户申请',//题目
            shadeClose:false,//点击遮罩层关闭
            btn: ['确定','关闭'],
            content: $('#CONFIG'),//打开的内容
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

        var table = layui.table,
            form = layui.form,
            layer = layui.layer;

        form.on('select(province10)', function(data){
            var parent_id = data.value;
            selArealist('city10',parent_id);
        });

        form.on('select(city10)', function(data){
            var parent_id = data.value;
            selArealist('district10',parent_id);
        });


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
                    if(json.account != undefined){
                        delete json.account;
                    }
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#account").val()!=""){
                        json.account=$.trim($("#account").val());
                    }else{
                        delete json.account;
                    }
                    creaConfigTable();
                    $("#account").val(json.account);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'deleteCode'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonDelete={};
                    jsonDelete.ID=obj.data.ID;
                    json1.delete=jsonDelete;
                    getAjax({url:deleteConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            layer.msg("操作成功！", {offset: '200px'});
                            obj.del();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            }else if(obj.event === 'ZCSB_ZKGL_SQZH_DY'){
                layer.confirm('你确定订阅该账户信息吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    layer.load();
                    var json1 ={};
                    jsonASD.code=dingyueCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonWhere={};//修改条件
                    jsonWhere.id=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.dyzt = '2';
                    jsonFild.account = obj.data.ACCOUNT;
                    json1.fild=jsonFild;
                    getAjax({url:dingyueUrl,data:JSON.stringify(json1),callback:function (reg) {
                        layer.closeAll('loading');
                        if(reg.resultCode=="200"){
                            layer.msg("订阅成功！", {offset: '200px'});
                            creaConfigTable();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            } else if(obj.event === 'ZCSB_ZKGL_SQZH_SYNC'){
                layer.confirm('你确定同步设备信息数据吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    layer.load();
                    var json1 ={};
                    jsonASD.code=syncCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName3;
                    json1.account=obj.data.ACCOUNT;
                    json1.org_id=obj.data.ORG_ID;
                    getAjax({url:syncSbxxUrl,data:JSON.stringify(json1),callback:function (reg) {
                        layer.closeAll('loading');
                        if(reg.resultCode=="200"){
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            }else if(obj.event === 'ZCSB_ZKGL_SQZH_BD'){
                line = 0;
                $("#sqm").val('');
                $("#zpm").val('');
                $("#tjbdsblist").html('');
                layer.open({
                    type:1,//类型
                    area:['600px','370px'],//定义宽和高
                    title:'设备绑定',//题目
                    shadeClose:false,//点击遮罩层关闭
                    btn: ['确定','关闭'],
                    content: $('#sbbding'),//打开的内容
                    yes:function (index,layero) {
                        layer.load();
                        var pdatas = [];
                        var check = true;
                        $("#sbbdForm .layui-form-item").each(function(){
                            var tr = $(this);
                            var sqm = tr.find("input[name='sqm']").val();
                            var zpm = tr.find("input[name='zpm']").val();
                            if(sqm == ''){
                                layer.msg("授权码不能为空！", {offset: '200px'});
                                check = false;
                                return false;
                            }
                            if(zpm == ''){
                                layer.msg("正品码不能为空！", {offset: '200px'});
                                check = false;
                                return false;
                            }
                            var pone = {};
                            pone.sqm = sqm;
                            pone.zpm = zpm;
                            pdatas.push(pone);
                        });
                        if(!check){
                            layer.closeAll('loading');
                            return false;
                        }
                        var jsonASD = getJsonASD();
                        jsonASD.code=bingCode;
                        var json1={};
                        json1.ASD=jsonASD;
                        json1.account=obj.data.ACCOUNT;
                        json1.sbxx=pdatas;
                        getAjax({url:sbbdUrl,data:JSON.stringify(json1),callback:function (reg) {
                            layer.closeAll('loading');
                            if (reg.resultCode=="200"){
                                layer.close(index);
                                layer.msg("绑定成功！", {offset: '200px'});
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }});
                    },
                    btn2:function (index,layero) {
                        layer.close(index);
                    }
                });
            }else if(obj.event === 'stop' || obj.event === 'enable'){
                layer.confirm('你确定'+ (obj.data.SFKT=='1'?'启用':'停用')+'该账户信息吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.SFKT = obj.data.SFKT=='1'?'2':'1';
                    json1.fild=jsonFild;
                    json1.logType='bcca';
                    json1.busyType='1';
                    getAjax({url:updateConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if (reg.resultCode=="200"){
                            layer.msg("操作成功！", {offset: '200px'});
                            creaConfigTable();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            }
        });

        //系统参数 表单提交
        form.on('submit(addConfigSub)', function (data) {
            layer.load();
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#ID").val()==""||$("#ID").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                // var province10 = $("#province10").find("option:selected").attr("data-toggle");
                // var city10 = $("#city10").find("option:selected").attr("data-toggle");
                // var district10 = $("#district10").find("option:selected").attr("data-toggle");
                // jsonInsert.province10 = province10;
                // jsonInsert.city10 = city10;
                // jsonInsert.district10 = district10;
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

            getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
                layer.closeAll('loading');
                if(reg.resultCode == '200'){
                    status="SUCCESS";
                    layer.msg("操作成功！", {offset: '200px'});
                }else{
                    layer.msg(reg.resultMsg, {offset: '200px'});
                }
            }});
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
                    ASD:getJsonASD()
                }
                getAjax({url:uniqueUrl,data:JSON.stringify(param),callback:function (reg) {
                    layer.closeAll('loading');
                    if(reg.status!="200"){
                        checkResult = "2";
                    }
                }});
                if (checkResult=="2"){
                    return "["+item.title+"] 为 '"+value+"' 的已存在！";
                }
            },
            positiveInteger:function (value,item) {
                var reg = /^\+?[1-9]\d*$/;
                if (!reg.test(value)) {
                    return "["+item.title+"] 必须是正整数";
                }
                // if(!new RegExp("/^\+?[1-9]\d*$/").test(value)){
                //     return "["+item.title+"] 必须是正整数";
                // }
            }
        });

        //初始化table
        creaConfigTable();

    });

});

function selArealist(selectid, code){
    var areaJson={};
    areaJson.ASD=getJsonASD();
    areaJson.area_code=code;
    var options = '';
    if(selectid == 'province10'){
        options = '<option value="">-- 省 --</option>';
        $("#city10").html('<option value="">-- 市 --</option>');
        $("#district10").html('<option value="">-- 区 --</option>');
    }else if(selectid == 'city10'){
        options = '<option value="">-- 市 --</option>';
        $("#district10").html('<option value="">-- 区 --</option>');
    }else if(selectid == 'district10'){
        options = '<option value="">-- 区 --</option>';
    }
    getAjax({url:loadAreaUrl,data:JSON.stringify(areaJson),callback:function (reg) {
        if (reg.resultCode=="200"){
            var list = reg.data;
            for(var i=0;i<list.length;i++){
                options += '<option value="'+ list[i].area_code+'">'+ list[i].area_name+'</option>';
            }
            $("#"+selectid).html(options);
            layui.form.render();
        }
    }});
}

function selOrglist(){
    var json1 = {};
    json1.ASD = getJsonASD();
    getAjax({url:loadOrgUrl,data:JSON.stringify(json1),callback:function (reg) {
        if (reg.resultCode=="200"){
            var list = reg.resultData;
            $("#org_id").empty();
            $("#org_id").append("<option value=''>请选择组织</option>");
            for (var i=0;i<list.length;i++){
                $("#org_id").append("<option TYPE='"+list[i].type+"' value='"+list[i].id+"'>"+list[i].mc+"</option>");
            }
            layui.form.render();
        }
    }});
}