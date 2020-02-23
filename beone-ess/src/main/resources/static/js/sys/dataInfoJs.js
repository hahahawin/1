/**
 * 倪杨
 * 2019-08-08
 * 数据字典js方法
 */
$(function () {
    /*$("#dataInfoType").attr("class","layui-col-xs12");
    $("#dataInfoTypeValue").attr("class","layui-col-xs0");*/



    var json ={};
    jsonASD.code=ptFindCodeType;

    json.ASD=jsonASD;

    json.tableName=tableName1;
    json.fildName="ID,CODE,NAME,ZT";
    // json.fildName=['DT_ID','DT_CODE','DT_NAME','DT_ZT','EDITOR_NAME','EDITED_TIME'];

    var jsonWhere={};
    json.where=jsonWhere;
    var wherelike={};
    json.wherelike=wherelike;

    var DataTypeTable={
        defaultToolbar:[],
        toolbar:'#toolbarDataType',
        height: 'full-0',
        url: loadDataTypeUrl,
        method:'post', //接口http请求类型，默认：get
        contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
        page: true,
        limits:[10,20,30,40,50,60,70,80,90],
        limit:10,
        where:json, //接口的其它参数
        // size:'sm', //整体表格尺寸，sm  lg
        cols: [[ //表头
            {field: 'CODE', title: '类型编码',  sort: true}
            , {field: 'NAME', title: '类型名称',  sort: true}
            , {field: 'ZT', title: '类型状态',  sort: true,templet:function (obj) {
                    if (obj.ZT == "1"){return '停用'}else{return '启用'}
                }}
            , {title:'操作', toolbar:'#barDataType', width:150, hide : (isadmin == 1)}
        ]]
    };

    var json2={};
    jsonASD.code=ptFindCodeValue;
    json2.ASD=jsonASD;

    json2.tableName=tableName2;
    json2.fildName="ID,KEY,VALUE,ZT,PID";
    // json2.fildName=['DI_ID','DI_KEY','DI_VALUE','DI_ZT','EDITOR_NAME','EDITED_TIME','DT_ID'];

    var jsonWhere={};
    json2.where=jsonWhere;

    var DataTypeValueTable={
        defaultToolbar:[],
        toolbar:'#toolbarDataTypeValue',
        height: 'full-0',
        url: loadDataTypeUrl,
        method:'post', //接口http请求类型，默认：get
        contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
        page: true,
        limits:[10,20,30,40,50,60,70,80,90],
        limit:10,
        where:json2, //接口的其它参数
        // size:'sm', //整体表格尺寸，sm  lg
        cols: [[ //表头
            {field: 'KEY', title: '字典键值',  sort: true}
            , {field: 'VALUE', title: '字典项值',  sort: true}
            , {field: 'ZT', title: '状态',  sort: true,templet:function (obj) {
                    if (obj.ZT == "1"){return '停用'}else{return '启用'}
                }}
            , {title:'操作', toolbar:'#barDataTypeValue', width:150, hide : (isadmin == 1)}
        ]]
    };



    layui.use(['table','form'], function() {
        var table=layui.table;
        var form=layui.form;

        /**-------------------------表格方法begin------------------------------------**/

        //表格初始化
        window.creaDataTypeTable=function(){
            table.init('dataType', DataTypeTable);
        };

        //表格初始化
        window.creaDataTypeVarlueTable=function(){
           /* $("#dataInfoType").attr("class","layui-col-xs6");
            $("#dataInfoTypeValue").attr("class","layui-col-xs6");*/
            table.init('dataTypeValue', DataTypeValueTable);
        };

        creaDataTypeTable();


        //查询方法
        var reloadDataTypeTable=function(){

        };


        //头工具栏事件，包括新建和查询按钮
        table.on('toolbar(dataType)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'addDataType':
                    document.getElementById("addDataTypeForm").reset();
                    $("#id").val("");
                    addDataTypeForm();
                    break;
                case 'reset':
                    delete json.wherelike.CODE;
                    delete json.wherelike.NAME;
                    $("#DataTypeZT").val("");
                    form.render('select');
                    creaDataTypeTable();
                    break;
                case 'findDataType':
                    if($("#DataTypeCode").val()!=""){
                        json.wherelike.CODE=$.trim($("#DataTypeCode").val());
                    }else{
                        delete json.wherelike.CODE;
                    }
                    if($("#DataTypeName").val()!=""){
                        json.wherelike.NAME=$.trim($("#DataTypeName").val());
                    }else{
                        delete json.wherelike.NAME;
                    }
                    if($("#DataTypeZT").val()!=""){
                        json.where.ZT=$("#DataTypeZT").val();
                    }else{
                        delete json.where.ZT;
                    }
                    creaDataTypeTable();
                    $("#DataTypeCode").val(json.wherelike.CODE);
                    $("#DataTypeName").val(json.wherelike.NAME);
                    $("#DataTypeZT").val(json.where.ZT);
                    break;
            };
        });

        //监听行工具事件，即行内的修改，删除方法
        table.on('tool(dataType)', function(obj){
            var data = obj.data;
            if(obj.event === 'del'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCodeType;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName1;
                    var jsonDelete={};
                    jsonDelete.ID=data.ID;
                    json1.delete=jsonDelete;
                    $.ajax({
                        type:"POST",
                        url:deleteDataTypeUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                // console.log(reg.resultMsg);
                                layer.msg("操作成功！", {offset: '200px'});
                                obj.del();
                                layer.close(index);
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });

                });
            } else if(obj.event === 'edit'){
                addDataTypeForm();
                $("#id").val(obj.data.ID);
                form.val('addDataTypeForm', {
                    "CODE": obj.data.CODE,
                    "NAME": obj.data.NAME,
                    "ZT": obj.data.ZT,
                })
            } else if(obj.event === 'stop'){
                layer.confirm('你确定要停用该数据吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=TYQYCodeType;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName1;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT  = '1';
                    json1.fild=jsonFild;

                    $.ajax({
                        type:"POST",
                        url:updateDataTypeUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creaDataTypeTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            } else if(obj.event === 'enable'){
                layer.confirm('你确定要启用该数据吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=TYQYCodeType;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName1;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT  = '2';
                    json1.fild=jsonFild;

                    $.ajax({
                        type:"POST",
                        url:updateDataTypeUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creaDataTypeTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }
        });

        //单击数据字典类型table行，加载对应的value值
        table.on('row(dataType)', function (obj) {
            var checkStatus = table.checkStatus('dataType');
            // var data = checkStatus.data;
            // console.info(checkStatus);

            obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');

            dataType=obj.data;
            // var ID = obj.data.ID;
            json2.where.PID=obj.data.ID;
            //表格初始化
            creaDataTypeVarlueTable();
        });

        //头工具栏事件，包括新建
        table.on('toolbar(dataTypeValue)', function(obj){
            switch(obj.event){
                case 'addDataTypeValue':
                    document.getElementById("addDataTypeValueForm").reset();
                    $("#valueID").val("");
                    form.val('addDataTypeValueForm', {
                        "PID": dataType.ID,
                        "DI_DT_NAME": dataType.NAME,
                    });
                    addDataTypeValueForm();
                    break;
            };
        });

        //监听行工具事件，即行内的修改，删除方法
        table.on('tool(dataTypeValue)', function(obj){
            var data = obj.data;
            if(obj.event === 'del'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCodeValue;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName2;
                    var jsonDelete={};
                    jsonDelete.ID=data.ID;
                    json1.delete=jsonDelete;
                    $.ajax({
                        type:"POST",
                        url:deleteDataTypeUrl,
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
            } else if(obj.event === 'edit'){
                addDataTypeValueForm();
                var data=obj.data;
                $("#valueID").val(data.ID);
                form.val('addDataTypeValueForm', {
                    "PID": data.PID,
                    "DI_DT_NAME": dataType.NAME,
                    "KEY": data.KEY,
                    "VALUE": data.VALUE,
                    "ZT": data.ZT
                })
            } else if(obj.event === 'stop'){
                layer.confirm('你确定要停用该数据吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=TYQYCodeValue;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName2;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT  = '1';
                    json1.fild=jsonFild;

                    $.ajax({
                        type:"POST",
                        url:updateDataTypeUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creaDataTypeVarlueTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            } else if(obj.event === 'enable'){
                layer.confirm('你确定要启用该数据吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=TYQYCodeValue;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName2;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT  = '2';
                    json1.fild=jsonFild;

                    $.ajax({
                        type:"POST",
                        url:updateDataTypeUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creaDataTypeVarlueTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }
        });

        /**-------------------------表格方法end------------------------------------**/


        /**-------------------------表单方法begin------------------------------------**/

        //表单验证方法
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
                    tableName:tableName1,
                    key:item.name,
                    value:value,
                    id:$("#id").val()
                };
                var url=uniqueUrl;
                if (item.name=="KEY"){
                    param.tableName=tableName2;
                    param.id=$("#valueID").val();
                    param.pid=dataType.ID;
                    url=uniquePIDUrl;
                }
                $.ajax({
                    url:url,
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
        /**-------------------------表单方法end------------------------------------**/

        //数据字典表单提交
        form.on('submit(addDataTypeSubmit)', function (data) {

            var json ={};
            jsonASD.code=insertCodeType;
            json.ASD=jsonASD;
            json.tableName=tableName1;
            json.id="ID";
            json.seqKZ="";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
            var jsonInsert = data.field;  //通过name值获取数据
            jsonInsert.ZT='2';
            json.insert=jsonInsert;

            var url= insertDataTypeUrl;
            if ($("#id").val()!=""&&$("#id").val()!=null) {
                delete json.id;
                delete json.seqKZ;
                delete json.insert;
                jsonASD.code=updateCodeType;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#id").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                json.fild=jsonFild;
                url= updateDataTypeUrl;
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
                        dataTypeAdd="SUCCESS";
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

        //数据字典值 表单提交
        form.on('submit(addDataTypeValueSubmit)', function (data) {
            var json ={};
            jsonASD.code=insertCodeValue;
            json.ASD=jsonASD;
            json.tableName=tableName2;
            json.id="ID";
            json.seqKZ="";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
            var jsonInsert = data.field;  //通过name值获取数据
            delete jsonInsert.DI_DT_NAME;
            jsonInsert.ZT='2';
            json.insert=jsonInsert;
            var url= insertDataTypeUrl;
            if ($("#valueID").val()!=""&&$("#valueID").val()!=null) {
                delete json.id;
                delete json.seqKZ;
                delete json.insert;
                jsonASD.code=updateCodeValue;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#valueID").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                delete jsonFild.DI_DT_NAME;
                json.fild=jsonFild;
                url= updateDataTypeUrl;
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
                        dataTypeValueAdd="SUCCESS";
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

        /**-------------------------表单方法end------------------------------------**/
    });


    //数据字典 打开添加页面
    function addDataTypeForm() {
        dataTypeAdd=""; //清空添加是否成功的状态
        var layer = layui.layer,$=layui.$;
        layer.open({
            type:1,//类型
            area:['500px','300px'],//定义宽和高
            title:'字典类型',//题目
            shadeClose:false,//点击遮罩层关闭
            btn: ['确定','关闭'],
            content: $('#addDataType'),//打开的内容
            yes:function (index,layero) {
                $("#addDataTypeSub").click();
                if(dataTypeAdd == 'SUCCESS'){
                    creaDataTypeTable();
                    layer.close(index);
                }
            },
            btn2:function (index,layero) {
                layer.close(index);
            }
        });
    }


    //数据字典值 打开添加页面
    function addDataTypeValueForm() {
        dataTypeValueAdd=""; //清空添加是否成功的状态
        var layer = layui.layer,$=layui.$;
        layer.open({
            type:1,//类型
            area:['500px','350px'],//定义宽和高
            title:'字典项',//题目
            shadeClose:false,//点击遮罩层关闭
            btn: ['确定','关闭'],
            content: $('#addDataTypeValue'),//打开的内容
            yes:function (index,layero) {
                $("#addDataTypeValueSub").click();
                if(dataTypeValueAdd == 'SUCCESS'){
                    json2.where.DT_ID=dataType.DT_ID;
                    creaDataTypeVarlueTable();
                    layer.close(index);
                }
            },
            btn2:function (index,layero) {
                layer.close(index);
            }
        });
    }

})