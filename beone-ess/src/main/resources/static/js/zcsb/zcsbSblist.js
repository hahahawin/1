$(function () {
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName;
    json.fildName="ID,MC,LB,XLH,MAC,ZT,ACCOUNT,ORG_ID,NAME,TIME";
    var jsonWhere={};
    // jsonWhere.ORG_ID=belong_org_id;
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
            {field: 'MC', title: '设备名称',  sort: false}
            , {field: 'XLH', title: '设备序号',  sort: false}
            , {field: 'MAC', title: '设备MAC',  sort: false}
            , {field: 'LB', title: '类型代码',  sort: false}
            , {field: 'ACCOUNT', title: '设备账户',  sort: false}
            , {field: 'ZT', title: '状态',  sort: false,
                templet:function (obj) {
                    if(obj.ZT == '1'){
                        return '初始';
                    }else if(obj.ZT == '2'){
                        return '可分配';
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
                    loadConfigForm();
                    break;
                case 'reset':
                    if(json.wherelike.MC != undefined){
                        delete json.wherelike.MC;
                    }
                    if(json.wherelike.XLH != undefined){
                        delete json.wherelike.XLH;
                    }
                    if(json.wherelike.MAC != undefined){
                        delete json.wherelike.MAC;
                    }
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#MC").val()!=""){
                        json.wherelike.MC=$.trim($("#MC").val());
                    }else{
                        delete json.wherelike.MC;
                    }
                    if($("#XLH").val()!=""){
                        json.wherelike.XLH=$.trim($("#XLH").val());
                    }else{
                        delete json.wherelike.XLH;
                    }
                    if($("#MAC").val()!=""){
                        json.wherelike.MAC=$.trim($("#MAC").val());
                    }else{
                        delete json.wherelike.MAC;
                    }
                    creaConfigTable();
                    $("#MC").val(json.wherelike.MC);
                    $("#XLH").val(json.wherelike.XLH);
                    $("#MAC").val(json.wherelike.MAC);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'del'){
                // layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                //     var json1 ={};
                //     jsonASD.code=deleteCode;
                //     json1.ASD=jsonASD;
                //     json1.tableName=tableName;
                //     var jsonDelete={};
                //     jsonDelete.ID=obj.data.ID;
                //     json1.delete=jsonDelete;
                //     $.ajax({
                //         type:"POST",
                //         url:deleteConfigUrl,
                //         async:false,
                //         dataType:"json", //服务器返回数据的类型
                //         contentType: 'application/json',
                //         data:JSON.stringify(json1),
                //         success:function(reg){
                //             if(reg.resultCode=="200"){
                //                 layer.msg("操作成功！", {offset: '200px'});
                //                 obj.del();
                //                 layer.close(index);
                //             }else{
                //                 layer.msg(reg.resultMsg, {offset: '200px'});
                //             }
                //         }
                //     });
                // });
            } else if(obj.event === 'edit'){
                // loadConfigForm();
                // $("#ID").val(obj.data.ID);
                // form.val('configForm', {
                //     "JZWMC": obj.data.JZWMC,
                //     "JZWH": obj.data.JZWH,
                //     "JCNY": obj.data.JCNY,
                //     "ZJZMJ": obj.data.ZJZMJ,
                //     "JZWCS": obj.data.JZWCS
                // })
            } else if(obj.event === 'ZCSB_ZKGL_SBGL_KZ'){
                openControlWin(obj.data);
                return false;
            }else if(obj.event === 'ZCSB_ZKGL_SBGL_SBJB'){
                //解绑
                layer.confirm('你确定要解绑账户设备信息吗？解绑后将删除设备信息，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    layer.load();
                    var json1 ={};
                    jsonASD.code=sbjbCode;
                    json1.ASD=jsonASD;
                    json1.account=obj.data.ACCOUNT;
                    json1.mac=obj.data.MAC;
                    getAjax({url:unbindUrl,data:JSON.stringify(json1),callback:function (reg) {
                        layer.closeAll('loading');
                        if(reg.resultCode=="200"){
                            creaConfigTable();
                            layer.msg("解绑成功！", {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
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


function openControlWin(data){
    var serial_num = data.XLH;
    var device_mac = data.MAC;
    var account = data.ACCOUNT;
    var product_code = data.LB;
    if(serial_num != device_mac){
        serial_num = device_mac;
    }

    //查询模板
    var lxJson={};
    lxJson.ASD=getJsonASD();
    lxJson.mldm=product_code;
    lxJson.org_id=belong_org_id;
    lxJson.type='web';
    getAjax({url:loadWebMbUrl,data:JSON.stringify(lxJson),callback:function (reg) {
        if (reg.resultCode=="200"){
            var htmlModle = reg.htmlModle;
            if(htmlModle == null || htmlModle == '' || htmlModle == 'null'){
                layui.layer.msg("无控制模板，此功能暂无法开放！！", {offset: '200px'});
                return false;
            }
            layer.load();
            layer.open({
                type:1,//类型
                area:['900px','600px'],//定义宽和高
                title:'设备控制',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: false,
                content: $('#sblxMbWin'),//打开的内容
            });
            document.getElementById("Example2").srcdoc = htmlModle;

            layer.closeAll('loading');
            $("#Example2").on('load',function(){
                $("#Example2").contents().find(".sendControlBtn").unbind();
                $("#Example2").contents().find(".sendControlBtn").on("click", function(e) {
                    layer.load();
                    var datas = $("#Example2")[0].contentWindow.getCmdParams($(this));
                    if(datas == undefined){
                        // $("body").mLoading("hide");//显示loading组件
                        layer.closeAll('loading');
                        return false;
                    }
                    if(datas.controlParams) {
                        datas.controlParams = JSON.stringify(datas.controlParams);
                    }
                    if(!datas.operation) {
                        // $("body").mLoading("hide");//显示loading组件
                        layer.closeAll('loading');
                        return false;
                    }
                    $.extend(datas, {
                        account: account,
                        serial_num: serial_num,
                        productId: product_code
                    });
                    if(datas.controlParams == undefined){
                        datas.controlParams = "";
                    }
                    var json1 = {};
                    var jsonASD=getJsonASD();
                    jsonASD.code=controlCode;
                    json1.ASD=getJsonASD();
                    json1.data=datas;
                    getAjax({url:controlUrl,data:JSON.stringify(json1),callback:function (reg2) {
                        layer.closeAll('loading');
                        if (reg2.resultCode=="200"){
                            layui.layer.msg("操作成功！！", {offset: '200px'});
                        }else{
                            layui.layer.msg("操作失败，" + reg2.resultDesc, {offset: '200px'});
                        }
                    }});
                })
            });
        }
    }});
}