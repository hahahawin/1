$(function () {
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName;
    json.fildName="ID,JHID,MC,ACCOUNT,ZT,ATTR_1,EDITOR_ID,EDITOR_NAME,EDITED_TIME,CREA_ID,ORG_ID";
    json.ORG_ID=belong_org_id;
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
            {field: 'MC', title: '计划名称',  sort: false}
            ,{field : 'ACCOUNT',title : '所属账户',  sort: false}
            // , {field: 'ATTR_1', title: '计划说明',  sort: false, templet:function (obj) {
            //
            //     }
            // }
            , {field: 'EDITOR_NAME', title: '编辑人',  sort: false}
            , {field: 'EDITED_TIME', title: '编辑时间',  sort: false, templet:function (obj) {
                    return dateFormat("yyyy-mm-dd",obj.EDITED_TIME);
                }
            }
            , {title:'操作', width:150, templet:function (obj) {//toolbar:'#barConfig'
                    var json2={};
                    json2.rowData=JSON.stringify(obj);
                    json2.TYQY="MSGL_ZT";
                    var judge={};   //自定义限制
                    judge.ZCSB_ZKGL_ZXJH_EDIT='N';
                    judge.ZCSB_ZKGL_ZXJH_DEL='N';
                    json2.judge=judge;
                    return judgeButtonRights(json2);
                }}
        ]]
    };
    //打开添加修改页面
    window.loadConfigForm =function () {
        document.getElementById("configForm").reset();
        $("#id").val("");
        getAccount();
        status="";
        layer.open({
            type:1,//类型
            area:['500px','250px'],//定义宽和高
            title:'执行计划',//题目
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

    layui.use(['table','form','layer','laydate'], function() {

        var table = layui.table,
            form = layui.form,
            laydate = layui.laydate,
            layer = layui.layer

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
                    if(json.wherelike.MC != undefined){
                        delete json.wherelike.MC;
                    }
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#MC").val()!=""){
                        json.wherelike.MC=$.trim($("#MC").val());
                    }else{
                        delete json.wherelike.MC;
                    }
                    creaConfigTable();
                    $("#MC").val(json.wherelike.MC);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            // console.log(obj.data);
            if(obj.event === 'ZCSB_ZKGL_ZXJH_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    layer.load();
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.id=obj.data.ID;
                    json1.org_id=belong_org_id;
                    getAjax({url:deleteConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                            layer.closeAll('loading');
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                obj.del();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }});
                });
            } else if(obj.event === 'ZCSB_ZKGL_ZXJH_EDIT'){
                loadConfigForm();
                $("#id").val(obj.data.ID);
                $("#jhid").val(obj.data.JHID);
                $("#account").val(obj.data.ACCOUNT);
                form.val('configForm', {
                    "mc": obj.data.MC,
                    "attr_1": obj.data.ATTR_1
                })
            }  else if(obj.event === 'ZCSB_ZKGL_ZXJH_JCSZ'){
                //进程管理
                account = obj.data.ACCOUNT;
                $("#id").val(obj.data.ID);
                $("#jhid").val(obj.data.JHID);
                $("#account").val(obj.data.ACCOUNT);
                layer.open({
                    type: 1,
                    area:['1000px','500px'],//定义宽和高
                    title:'进程管理',//题目
                    fixed: false, //不固定
                    maxmin: false,
                    // shadeClose: true,
                    content: $('#jcglPage')
                });
                //查询进程列表
                selzxjhjclist();
            }
        });

        //系统参数 表单提交
        form.on('submit(addConfigSub)', function (data) {
            layer.load();
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#id").val()==""||$("#id").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.zt='2';
                json.insert=jsonInsert;
                url= insertConfigUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.id=$("#id").val();
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
                    id:$("#id").val(),
                    org_id:belong_org_id,
                    ASD:getJsonASD()
                }
                $.ajaxSetup({async: false});
                getAjax({url:uniqueUrl,data:JSON.stringify(param),callback:function (reg) {
                        if(reg.status!="200"){
                            checkResult = "2";
                        }
                    }});
                if (checkResult=="2"){
                    return "["+item.title+"] 为 '"+value+"' 的已存在！";
                }
            },
            positiveInteger:function (value,item) {
                if(value != ''){
                    var reg = /^\+?[1-9]\d*$/;
                    if (!reg.test(value)) {
                        return "["+item.title+"] 必须是正整数";
                    }
                }
            }
        });

        //初始化table
        creaConfigTable();

        //系统参数 表单提交
        form.on('submit(addJcTjSub)', function (data) {
            layer.load();
            var process_name = $("#process_name").val();
            var has_condition = $("#has_condition").val();
            var pre_trigger_time = $("#pre_trigger_time").val();
            var delay_trigger_time = $("#delay_trigger_time").val();
            var mode_ids = '';
            var mode_desc = '';
            $("input[name='sbmogl_ymsid']:checked").each(function(){
                mode_ids += $(this).val()+',';
                mode_desc += $(this).attr("title")+',';
            });
            if(mode_ids != ''){
                mode_ids = mode_ids.substring(0, mode_ids.length-1);
                mode_desc = mode_desc.substring(0, mode_desc.length-1);
            }else{
                layer.msg('模式不能为空', {offset: '200px'});
                layer.closeAll('loading');
                return false;
            }
            var tjms = '';
            var cftjdata = [];
            $("#tjtable tr").each(function(){
                var checked = "false"
                if($(this).find("input[name='yfggx']").prop("checked")){
                    checked = "true";
                }
                var product_code = $(this).find("input[name='product_code']").val();
                var product_text = $(this).find("input[name='product_text']").val();
                var serial_num = $(this).find("input[name='serial_num']").val();
                var property_id = $(this).find("input[name='property_id']").val();
                var property_name = $(this).find("input[name='property_name']").val();
                var bind_type = $(this).find("input[name='bind_type']").val();
                var cmd_id = $(this).find("input[name='cmd_id']").val();
                var cmd_name = $(this).find("input[name='cmd_name']").val();
                var param_value = $(this).find("input[name='param_value']").val();
                var pone = {};
                pone.checked = checked;
                pone.product_code = product_code;
                pone.product_text = product_text;
                pone.serial_num = serial_num;
                pone.property_id = property_id;
                pone.property_name = property_name;
                pone.bind_type = bind_type;
                pone.cmd_id = cmd_id;
                pone.cmd_name = cmd_name;
                pone.param_value = param_value;
                cftjdata.push(pone);
                tjms += property_name+',';
            });
            if(tjms != null && tjms != ''){
                tjms = tjms.substring(0, tjms.length-1);
            }else{
                layer.msg('触发条件不能为空', {offset: '200px'});
                layer.closeAll('loading');
                return false;
            }

            var sjtjdata = [];
            $("#sjdtable tr").each(function(){
                var sjdType = $(this).find("input[name='sjdType']").val();
                var start_time = $(this).find("input[name='start_time']").val();
                var end_time = $(this).find("input[name='end_time']").val();
                var one = {};
                one.time_type = sjdType;
                one.start_time = start_time;
                one.end_time = end_time;
                sjtjdata.push(one);
            });
            var params = {
                plan_id:$("#jhid").val(),
                account:$("#account").val(),
                process_name:process_name,
                ser_order:'1',
                pre_trigger_time:pre_trigger_time,
                delay_trigger_time:delay_trigger_time,
                trigger_conditon_desc:tjms,
                has_condition:has_condition,
                excutionConditionList:cftjdata,
                excutionTimeConditionList:sjtjdata,
                mode_ids:mode_ids,
                mode_desc:mode_desc,
                org_id:belong_org_id,
                ASD:jsonASD
            }
            getAjax({url:addJcUrl,data:JSON.stringify(params),callback:function (reg) {
                    layui.layer.closeAll('loading');
                    if(reg.resultCode == '200'){
                        status = 'jctjcg';
                        selzxjhjclist();
                        layer.msg("操作成功！");
                    }else{
                        layui.layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }});
            return false;
        });


        //执行计划进程头
        table.on('toolbar(jcgllistTable)', function(obj){
            switch(obj.event){
                case 'addjcbutton':
                    //添加进程
                    $("#process_name").val('');
                    $("#has_condition").val('');
                    $("#pre_trigger_time").val('');
                    $("#delay_trigger_time").val('');
                    $("#tjtable").html('');
                    $("#sjdtable").html('');
                    //查询模式
                    var json1 ={};
                    jsonASD.code=ptFindCode;
                    json1.ASD=jsonASD;
                    json1.org_id=belong_org_id;
                    json1.account = account;
                    getAjax({url:selAllMslistUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if (reg.resultCode=="200"){
                                var list = reg.data;
                                var html = '';
                                for(var i=0;i<list.length;i++){
                                    html += '<span style="margin-left: 10px;"><input type="checkbox" name="sbmogl_ymsid" lay-skin="primary" value="'+ list[i].yid+'" title="'+ list[i].name +'" ></span>';
                                }
                                $("#mslist").html(html);
                                form.render();
                            }
                        }});
                    status = '';
                    layer.open({
                        type: 1,
                        area:['900px','550px'],//定义宽和高
                        title:'添加/修改进程',//题目
                        fixed: false, //不固定
                        maxmin: false,
                        // shadeClose: true,
                        content: $('#addJcPage'),
                        btn: ['确定','关闭'],
                        yes:function (index,layero) {
                            $("#addJcTjSub").click();
                            if(status=="jctjcg"){
                                layer.close(index);
                            }
                        },
                        btn2:function (index,layero) {
                            layer.close(index);
                        }
                    });

                    break;
            };
        });

        //选择设备类型
        form.on('select(product_code)', function(data){
            if(data.value != ''){
                //通过类型查询设备
                var json1 = {};
                jsonASD.code=ptFindCode;
                json1.ASD=jsonASD;
                json1.tableName=tableName3;
                json1.fildName="ID,XLH,MAC,MC";
                var jsonWhere={};
                jsonWhere.ZT = '2';
                jsonWhere.LB = data.value;
                jsonWhere.ACCOUNT = account;
                jsonWhere.ORG_ID=belong_org_id;
                json1.where=jsonWhere;
                getAjax({url:findAll,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            var data = reg.resultData;
                            var options = '<option value="">-- 请选择 --</option>';
                            if(data){
                                for(var i=0;i<data.length;i++){
                                    options += '<option value="'+ data[i].mac+'">'+data[i].mac+'</option>';
                                }
                            }
                            $("#serial_num").html(options);
                            form.render();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});

                //查询条件类型
                var json2 = {};
                jsonASD.code=ptFindCode;
                json2.ASD=jsonASD;
                json2.productCode = data.value;
                json2.org_id=belong_org_id;
                getAjax({url:selTjlxUrl,data:JSON.stringify(json2),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            var list = eval(reg.list);
                            var options = '<option value="">-- 请选择 --</option>';
                            tjcfz = [];
                            for(var i=0;i<list.length;i++){
                                options += '<option value="'+ list[i].id+'" data-toggle="'+ list[i].property_model+'">'+list[i].property_name+'</option>';
                                if(list[i].property_model == '1'){
                                    var webPlanInfo = list[i].web_plan_info;
                                    // var paramVal = webPlanInfo[0].web_product_cmd_up_param.param_val;
                                    // tjcfz[list[i].id] = paramVal;

                                    var cmdId = webPlanInfo[0].web_product_cmd_up_param.cmd_id;
                                    var paramName = webPlanInfo[0].web_product_cmd_up_param.param_name;
                                    var paramVal = {"key":paramName,"value":cmdId};
                                    var paramVal2 = new Array();
                                    paramVal2.push(paramVal);
                                    tjcfz[list[i].id] = paramVal2;
                                }
                            }
                            $("#tiaoJianType").html(options);
                            form.render();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
            }else{
                $("#serial_num").empty();
                $("#tiaoJianType").empty();
                form.render();
            }
        });

        //选择条件类型
        form.on('select(tiaoJianType)', function(data){
            if(data.value != ''){
                var propertyModel = $("#tiaoJianType").find("option:selected").attr("data-toggle");
                if(propertyModel == '1'){
                    console.log(tjcfz[data.value]);
                    $("#tjcfzDiv").html('<select class="form-control" name="tiaoJianValue" id="tiaoJianValue"></select>');
                    var list = eval(tjcfz[data.value]);
                    var options = '<option value="">-- 请选择 --</option>';
                    for(var i=0;i<list.length;i++){
                        options += '<option value="'+ list[i].value+'">'+list[i].key+'</option>';
                    }
                    $("#tiaoJianValue").html(options);
                    form.render();
                }else{
                    $("#tjcfzDiv").html('<input class="form-control" type="text" name="tiaoJianValue" id="tiaoJianValue">');
                }
            }
        });

        //条件 表单提交
        form.on('submit(addTiaojianSub)', function (data) {
            var product_code = $("#product_code").val();
            if(product_code == ''){
                layer.msg("设备类型不能为空！", {offset: '200px'});
                return false;
            }
            var serial_num = $("#serial_num").val();
            if(serial_num == ''){
                layer.msg("设备序号不能为空！", {offset: '200px'});
                return false;
            }
            var product_text = $("#product_code option:checked").text();

            var property_id = $("#tiaoJianType").val();
            if(property_id == ''){
                layer.msg("条件类型不能为空！", {offset: '200px'});
                return false;
            }
            var property_name = $("#tiaoJianType option:checked").text();

            var cmd_id = $("#tiaoJianValue").val();
            if(cmd_id == ''){
                layer.msg("条件触发值不能为空！", {offset: '200px'});
                return false;
            }
            var bind_type = $("#tiaoJianType option:checked").attr("data-toggle");
            var cmd_name = '';
            var param_value = '';
            if(bind_type == '1'){
                cmd_name = $("#tiaoJianValue option:checked").text();
            }else{
                param_value = $("#tiaoJianValue").val();
            }

            var row = $('<tr></tr>');
            $('<td><input type="checkbox" name="yfggx" class="oneCheck" lay-skin="primary" ></td>').appendTo(row);
            $('<td>'+product_text+'</td>').appendTo(row);
            $('<td>'+serial_num+'</td>').appendTo(row);
            $('<td>'+property_name+'</td>').appendTo(row);
            if(bind_type == '1'){
                $('<td>'+cmd_name+'</td>').appendTo(row);
            }else{
                $('<td>'+param_value+'</td>').appendTo(row);
            }

            var cztd = $('<td align="center"></td>');
            $('<img src="img/menu/menu4/blue/nr_icon_del.png" title="点击删除此行">').click(function(){
                $(this).parent().parent().remove();
            }).appendTo(cztd);
            $('<input type="hidden" name="product_code" value="'+ product_code +'" />').appendTo(cztd);
            $('<input type="hidden" name="product_text" value="'+ product_text +'" />').appendTo(cztd);
            $('<input type="hidden" name="serial_num" value="'+ serial_num +'" />').appendTo(cztd);
            $('<input type="hidden" name="property_id" value="'+ property_id +'" />').appendTo(cztd);
            $('<input type="hidden" name="property_name" value="'+ property_name +'" />').appendTo(cztd);
            $('<input type="hidden" name="bind_type" value="'+ bind_type +'" />').appendTo(cztd);
            $('<input type="hidden" name="cmd_id" value="'+ cmd_id +'" />').appendTo(cztd);
            $('<input type="hidden" name="cmd_name" value="'+ cmd_name +'" />').appendTo(cztd);
            $('<input type="hidden" name="param_value" value="'+ param_value +'" />').appendTo(cztd);
            cztd.appendTo(row);
            row.appendTo($("#tjtable"));

            form.render();
            status="SUCCESS";
            return false;
        });

        laydate.render({
            elem: '#start_time'
            ,type: 'datetime'
            ,max:$("#end_time").val()
        });
        laydate.render({
            elem: '#end_time'
            ,type: 'datetime'
            ,min:$("#start_time").val()
        });

        laydate.render({
            elem: '#start_time2'
            ,type: 'time'
        });
        laydate.render({
            elem: '#end_time2'
            ,type: 'time'
        });

        //选择时间
        form.on('select(sjdType)', function(data){
            $("#start_time").val('');
            $("#end_time").val('');
            $("#start_time2").val('');
            $("#end_time2").val('');
            var value = data.value;
            if(value == 'time'){
                $("#datetime1").hide();
                $("#datetime2").show();
            }else{
                $("#datetime2").hide();
                $("#datetime1").show();
            }
        });

        //时间表单提交
        form.on('submit(addsjdSub)', function (data) {
            var sjdType = $("#sjdType").val();
            var sjdType_text = $("#sjdType option:checked").text();
            var start_time = '';
            var end_time = '';
            if(sjdType == 'datetime'){
                start_time = $("#start_time").val();
                end_time = $("#end_time").val();
            }else{
                start_time = $("#start_time2").val();
                end_time = $("#end_time2").val();
            }
            if(start_time == ''){
                layer.msg("开始时间不能为空！", {offset: '200px'});
                return false;
            }
            if(end_time == ''){
                layer.msg("结束时间不能为空！", {offset: '200px'});
                return false;
            }
            var row = $('<tr></tr>');
            $('<td>'+sjdType_text+'</td>').appendTo(row);
            $('<td>'+start_time+'</td>').appendTo(row);
            $('<td>'+end_time+'</td>').appendTo(row);
            var cztd = $('<td align="center"></td>');
            $('<img src="img/menu/menu4/blue/nr_icon_del.png" title="点击删除此行"></img>').click(function(){
                $(this).parent().parent().remove();
            }).appendTo(cztd);
            $('<input type="hidden" name="sjdType" value="'+ sjdType +'" />').appendTo(cztd);
            $('<input type="hidden" name="start_time" value="'+ start_time +'" />').appendTo(cztd);
            $('<input type="hidden" name="end_time" value="'+ end_time +'" />').appendTo(cztd);
            cztd.appendTo(row);
            row.appendTo($("#sjdtable"));

            status="SUCCESS";
            return false;
        });


        //监听行工具事件
        table.on('tool(jcgllistTable)', function(obj){
            if(obj.event === 'del'){
                layer.load();
                var json1 ={};
                jsonASD.code=zxjhjcCode;
                json1.ASD=jsonASD;
                json1.id=obj.data.id;
                json1.account=$("#account").val();
                json1.org_id=belong_org_id;
                getAjax({url:delJcUrl,data:JSON.stringify(json1),callback:function (reg) {
                        layer.closeAll('loading');
                        if(reg.resultCode == '200'){
                            layer.msg("删除成功！");
                            obj.del();
                        }else{
                            layui.layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
            }
        });



    });

})

//查询执行计划进程列表
function selzxjhjclist(){
    var jhid = $("#jhid").val();
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.jhid = jhid;
    json.account = account;
    json.org_id = belong_org_id;
    layui.table.render({
        elem: '#jcgllistTable'
        ,id:'mssblist'
        ,height: 400
        ,url: selZxjhJclistUrl //数据接口
        ,contentType:'application/json'
        ,page: false //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        // ,toolbar :'#toolbarUser1'
        ,defaultToolbar:[]
        ,done:function(res, curr, count){
            var datas = res.data;
            var jcqzdzOptions = '<option value="">-- 请选择 --</option>';
            for(var i=0;i<datas.length;i++){
                jcqzdzOptions += '<option value="'+ datas[i].ID +'">'+ datas[i].PROCESS_NAME +'</option>';
            }
            $("#has_condition").html(jcqzdzOptions);
        }
        ,cols: [[ //表头
            {field: 'PROCESS_NAME', title: '进程名称', sort: false}
            ,{field: 'TRIGGER_CONDITON_DESC', title: '触发条件', sort: false}
            ,{field: 'MODE_DESC', title: '触发事件', sort: false}
            ,{field: 'PRE_TRIGGER_TIME', title: '前置时间(秒)', sort: false}
            ,{field: 'DELAY_TRIGGER_TIME', title: '延迟时间(秒)', sort: false}
            // , {title:'操作', toolbar:'#JcConfig'}
        ]]
    });
}

//添加条件
function addTiaojian(){
    $("#product_code").val('');
    $("#serial_num").val('');
    $("#tiaoJianType").val('');
    $("#tiaoJianValue").val('');
    $("#tiaoJianValue2").val('');
    selsblx();
    status="";
    layer.open({
        type:1,//类型
        area:['500px','250px'],//定义宽和高
        title:'添加条件',//题目
        shadeClose:false,//点击遮罩层关闭
        btn: ['确定','关闭'],
        content: $('#tiaojianPage'),//打开的内容
        yes:function (index,layero) {
            $("#addTiaojianSub").click();
            if(status=="SUCCESS"){
                layer.close(index);
            }
        },
        btn2:function (index,layero) {
            layer.close(index);
        }
    });
}
function selsblx(){
    var json1 = {};
    jsonASD.code=ptFindCode;
    json1.ASD=jsonASD;
    json1.tableName=tableName2;
    json1.fildName="ID,MLDM,MLMC";
    var jsonWhere={};
    jsonWhere.sfty = '2';
    jsonWhere.account = account;
    json1.where=jsonWhere;
    getAjax({url:selSblxUrl,data:JSON.stringify(json1),callback:function (reg) {
            if(reg.resultCode=="200"){
                var data = reg.data;
                var options = '<option value="">-- 请选择 --</option>';
                if(data){
                    for(var i=0;i<data.length;i++){
                        options += '<option value="'+ data[i].mldm+'">'+data[i].mlmc+'</option>';
                    }
                }
                $("#product_code").html(options);
                layui.form.render();
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
            }
        }});
}

//添加时间段
function addsjd(){
    $("#start_time").val('');
    $("#end_time").val('');
    $("#sjdType").val('datetime');
    $("#datetime1").show();
    $("#datetime2").hide();

    status="";
    layer.open({
        type:1,//类型
        area:['500px','250px'],//定义宽和高
        title:'添加时间段',//题目
        shadeClose:false,//点击遮罩层关闭
        btn: ['确定','关闭'],
        content: $('#sjdPage'),//打开的内容
        yes:function (index,layero) {
            $("#addsjdSub").click();
            if(status=="SUCCESS"){
                layer.close(index);
            }
        },
        btn2:function (index,layero) {
            layer.close(index);
        }
    });
}

//查询设备账户
function getAccount() {
    var xndJson={};
    xndJson.ASD=getJsonASD();
    xndJson.ASD.code=ptFindCode;
    xndJson.tableName=tableName5;
    xndJson.fildName="ID,ACCOUNT";
    var whereJson = {};
    // whereJson.SFKT = '2';
    // whereJson.DYZT = '3';
    whereJson.BORG_ID = belong_org_id;
    xndJson.where = whereJson;
    var xndJsonOther={};
    xndJsonOther.order={"TIME":"asc"};
    xndJson.other=xndJsonOther;
    getAjax({url:loadCommonUrl,data:JSON.stringify(xndJson),callback:function (reg) {
            if (reg.resultCode=="200"){
                var list = reg.resultData;
                $("#account").empty();
                for (var i=0;i<list.length;i++){
                    $("#account").append("<option selected value='"+list[i].account+"'>"+list[i].account+"</option>");
                }
                layui.form.render();
            }
        }
    });
}