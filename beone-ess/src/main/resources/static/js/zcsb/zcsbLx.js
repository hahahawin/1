$(function () {
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName;
    json.fildName="ID,TYPE,MLDM,MLMC,SFTY,ORG_ID";
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
        where:json, //接口的其它参数
        // size:'sm', //整体表格尺寸，sm  lg
        cols: [[ //表头
            {field: 'MLMC', title: '类型名称',  sort: false}
            , {field: 'MLDM', title: '类型代码',  sort: false}
            , {field: 'SFTY', title: '类型状态',  sort: false, templet:function (obj) {
                    return getDataText('TYQY_ZT',obj.SFTY);
                }}
            , {field: 'TYPE', title: '用途类型',  sort: false,
                templet:function (obj) {
                    if(obj.TYPE == '1'){
                        return '易耗品目录';
                    }else if(obj.TYPE == '2'){
                        return '资产目录';
                    }else if(obj.TYPE == '3'){
                        return '智能设备';
                    }
                }
            }
            // , {field: 'NAME', title: '添加人',  sort: false}
            // , {field: 'TIME', title: '添加时间',  sort: false, templet:function (obj) {
            //         return dateFormat("yyyy-mm-dd",obj.TIME);
            //     }
            // }
            , {title:'操作', width:150, templet:function (obj) {//toolbar:'#barConfig'
                    var json2={};
                    json2.rowData=JSON.stringify(obj);
                    json2.TYQY="SFTY";
                    return judgeButtonRights(json2);
                }}
        ]]
    };
    //打开添加修改页面
    window.loadConfigForm =function () {
        selArealist('province10','0');
        document.getElementById("configForm").reset();
        $("#ID").val("");
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

    //打开授权用户界面
    window.loadsbmbForm = function(){
        layer.open({
            type: 1,
            area:['1000px','500px'],//定义宽和高
            title:'模板查询',//题目
            fixed: false, //不固定
            maxmin: false,
            content: $('#sbmbPage')
        });
    };

    layui.use(['table','form','layer'], function() {

        var table = layui.table,
            form = layui.form,
            layer = layui.layer;

        //表格初始化
        window.creaConfigTable=function(){
            table.init('config', configTable);
        };

        //头工具栏事件
        table.on('toolbar(config)', function(obj){
            switch(obj.event){
                case 'addConfig':
                    // layer.load();
                    layer.msg('请稍后...', {icon: 16, shade: 0.01, time: 0});
                    var json1 ={};
                    jsonASD.code=syncCode;
                    json1.ASD=jsonASD;
                    getAjax({url:syncConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                        // layer.closeAll('loading');
                            layer.close(layer.msg());
                        if (reg.resultCode=="200"){
                            layer.msg(reg.resultMsg, {offset: '200px'});
                            creaConfigTable();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                    break;
                case 'reset':
                    if(json.wherelike.MLMC != undefined){
                        delete json.wherelike.MLMC;
                    }
                    if(json.wherelike.MLDM != undefined){
                        delete json.wherelike.MLDM;
                    }
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#MLMC").val()!=""){
                        json.wherelike.MLMC=$.trim($("#MLMC").val());
                    }else{
                        delete json.wherelike.MLMC;
                    }
                    if($("#MLDM").val()!=""){
                        json.wherelike.MLDM=$.trim($("#MLDM").val());
                    }else{
                        delete json.wherelike.MLDM;
                    }
                    creaConfigTable();
                    $("#MLMC").val(json.wherelike.MLMC);
                    $("#MLDM").val(json.wherelike.MLDM);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'del'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonDelete={};
                    jsonDelete.ID=obj.data.ID;
                    json1.delete=jsonDelete;
                    getAjax({url:deleteConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if (reg.resultCode=="200"){
                            layer.msg("操作成功！", {offset: '200px'});
                            obj.del();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            } else if(obj.event === 'ZCSB_ZKGL_LXGL_MBSZ'){
                c_mldm = obj.data.MLDM;
                sbzc_lx_id = obj.data.ID;
                loadsbmbForm();
                selMblist();
                return false;
            } else if(obj.event === 'stop' || obj.event === 'enable'){
                layer.confirm('你确定'+ (obj.data.SFTY=='2'?'停用':'启用')+'该设备类型吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.SFTY = obj.data.SFTY=='1'?'2':'1';
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

        table.on('tool(sbmbTable)',function(obj){
            if(obj.event === 'detail'){
                var template_thumbnail = obj.data.TEMPLATE_THUMBNAIL;
                $("#mbsrc").attr("src", template_thumbnail);
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    top:-100,
                    area: '516px',
                    skin: 'layui-layer-nobg', //没有背景色
                    shadeClose: true,
                    content: $('#photoPage')
                });
                return false;
            } else if(obj.event === 'setMb'){
                var json1 ={};
                jsonASD.code=setMdCode;
                json1.ASD=jsonASD;
                json1.id = obj.data.ID;
                json1.sbzc_lx_id = sbzc_lx_id;
                json1.template_type = obj.data.TEMPLATE_TYPE;
                getAjax({url:setMrmbUrl,data:JSON.stringify(json1),callback:function (reg) {
                    if (reg.resultCode=="200"){
                        layer.msg("设置成功！", {offset: '200px'});
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }});
            }
        });

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
                var province10 = $("#province10").find("option:selected").attr("data-toggle");
                var city10 = $("#city10").find("option:selected").attr("data-toggle");
                var district10 = $("#district10").find("option:selected").attr("data-toggle");
                jsonInsert.province10 = province10;
                jsonInsert.city10 = city10;
                jsonInsert.district10 = district10;
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
                    ASD:getJsonASD()
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

function selMblist(){
    var json1={};
    json1.belong_org_id=belong_org_id;
    json1.mldm = c_mldm;
    json1.ASD = jsonASD;
    layui.table.render({
        elem: '#sbmbTable'
        ,id:'user1'
        ,height: 400
        ,url: mblistUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json1 //接口的其它参数
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {field: 'TEMPLATE_NAME', title: '类型名称', sort: false}
            ,{field: 'PRODUCT_CODE', title: '类型代码', sort: false}
            ,{field: 'TEMPLATE_TYPE', title: '模板类型', sort: false}
            ,{field: 'TEMPLATE_PRICE', title: '价格', sort: false}
            ,{field: 'STATUS', title: '是否购买', sort: false,
                templet:function (obj) {
                    if(obj.STATUS == '1'){
                        return '已购买';
                    }else{
                        return '未购买';
                    }
                }
            }
            ,{field: 'IS_DEFAULT', title: '是否默认模板', sort: false,
                templet:function (obj) {
                    if(obj.IS_DEFAULT == '2'){
                        return '是';
                    }else{
                        return '否';
                    }
                }
            }
            ,{field: 'TEMPLATE_AUTHOR', title: '添加人', sort: false}
            , {title:'操作', toolbar:'#barMbConfig', width:150}
        ]]
    });
}