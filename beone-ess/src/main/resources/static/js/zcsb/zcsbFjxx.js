$(function () {
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName;
    json.org_id=belong_org_id;
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
            {field: 'FJXX_MC', title: '房间名称',  sort: false}
            , {field: 'FJXX_BH', title: '房间编号',  sort: false}
            , {field: 'JZWJBXX_JZWMC', title: '楼宇名称',  sort: false}
            , {field: 'LCXX_BH', title: '楼层编号',  sort: false}
            , {field: 'FJXX_ZT', title: '房间状态',  sort: false, templet:function (obj) {
                    return getDataText('TYQY_ZT',obj.FJXX_ZT);
                }}
            , {field: 'FJXX_FJSM', title: '房间说明',  sort: false}
            // , {field: 'JZWYT', title: '楼宇用途',  sort: false}
            // , {title:'操作', toolbar:'#barConfig', width:150}
            , {title:'操作', templet:function (obj) {//toolbar:'#barConfig'
                    var json2={};
                    json2.rowData=JSON.stringify(obj);
                    json2.TYQY="FJXX_ZT";
                    var judge={};
                    if(obj.FJXX_ZT == '1'){
                        judge.ZCSB_LYGL_FJXX_EDIT='N';
                        judge.ZCSB_LYGL_FJXX_SBBD='N';
                    }else{
                        judge.ZCSB_LYGL_FJXX_DEL='N';
                    }
                    json2.judge=judge;
                    return judgeButtonRights(json2);
                }}
        ]]
    };
    //打开添加修改页面
    window.loadConfigForm =function () {
        document.getElementById("configForm").reset();
        $("#id").val("");
        status="";
        layer.open({
            type:1,//类型
            area:['500px','370px'],//定义宽和高
            title:'房间管理',//题目
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
            layer = layui.layer,
            laydate = layui.laydate;

        //查询楼宇信息
        var lyxxJson={};
        lyxxJson.ASD=getJsonASD();
        lyxxJson.ASD.code=ptFindCode;
        lyxxJson.tableName=tableName2;
        lyxxJson.fildName="ID,JZWMC,ZT";
        var jsonWhere={};
        // jsonWhere.ZT = '2';
        jsonWhere.ORG_ID=belong_org_id;
        lyxxJson.where=jsonWhere;
        var lyxxJsonOther={};
        lyxxJsonOther.order={"EDIT_TIME":"desc"};
        lyxxJson.other=lyxxJsonOther;
        var lyxxoptions = '';
        var lyxxoptions2 = '';
        getAjax({url:loadselectUrl,data:JSON.stringify(lyxxJson),callback:function (reg) {
            if (reg.resultCode=="200"){
                var list = reg.resultData;
                lyxxoptions = "<option value=''>请选择楼宇信息</option>";
                lyxxoptions2 = "<option value=''>请选择楼宇信息</option>";
                for (var i=0;i<list.length;i++){
                    lyxxoptions += "<option value='"+list[i].id+"'>"+list[i].jzwmc+"</option>";
                    if(list[i].zt == '2'){
                        lyxxoptions2 += "<option value='"+list[i].id+"'>"+list[i].jzwmc+"</option>";
                    }
                }
                $("#jzw_id2").empty();
                $("#jzw_id2").html(lyxxoptions2);
            }
        }});
        //查询楼层信息
        var lcxxJson={};
        lcxxJson.ASD=getJsonASD();
        lcxxJson.ASD.code=ptFindCode;
        lcxxJson.tableName=tableName3;
        lcxxJson.fildName="ID,BH,FJS,ZT";
        var jsonWhere={};
        // jsonWhere.ZT = '2';
        jsonWhere.ORG_ID=belong_org_id;
        lcxxJson.where=jsonWhere;
        var lcxxJsonOther={};
        lcxxJsonOther.order={"EDIT_TIME":"desc"};
        lcxxJson.other=lcxxJsonOther;
        var lcxxoptions = '';
        var lcxxoptions2 = '';
        getAjax({url:loadselectUrl,data:JSON.stringify(lcxxJson),callback:function (reg) {
            if (reg.resultCode=="200"){
                var list = reg.resultData;
                lcxxoptions = "<option value=''>请选择楼层信息</option>";
                lcxxoptions2 = "<option value=''>请选择楼层信息</option>";
                for (var i=0;i<list.length;i++){
                    lcxxoptions += "<option value='"+list[i].id+"' data-toggle='"+ list[i].fjs+"'>"+list[i].bh+"</option>";
                    if(list[i].zt == '2'){
                        lcxxoptions2 += "<option value='"+list[i].id+"' data-toggle='"+ list[i].fjs+"'>"+list[i].bh+"</option>";
                    }
                }
                $("#lc_id2").empty();
                $("#lc_id2").html(lcxxoptions2);
            }
        }});

        form.on('select(jzw_id)', function(data){
            if(data.value != ''){
                var lcxxJson={};
                lcxxJson.ASD=getJsonASD();
                lcxxJson.ASD.code=ptFindCode;
                lcxxJson.tableName=tableName3;
                lcxxJson.fildName="ID,BH,FJS";
                var jsonWhere={};
                jsonWhere.ORG_ID=belong_org_id;
                jsonWhere.JZW_ID=data.value;
                lcxxJson.where=jsonWhere;
                var lcxxJsonOther={};
                lcxxJsonOther.order={"EDIT_TIME":"desc"};
                lcxxJson.other=lcxxJsonOther;
                getAjax({url:loadselectUrl,data:JSON.stringify(lcxxJson),callback:function (reg) {
                        if (reg.resultCode=="200"){
                            var list = reg.resultData;
                            var lcxxoptions = "<option value=''>请选择楼层信息</option>";
                            for (var i=0;i<list.length;i++){
                                lcxxoptions += "<option value='"+list[i].id+"' data-toggle='"+ list[i].fjs+"'>"+list[i].bh+"</option>";
                            }
                            $("#lc_id").empty();
                            $("#lc_id").html(lcxxoptions);
                            form.render();
                        }
                    }});
            }else{
                $("#lc_id").empty();
                form.render();
            }
        });

        form.on('select(jzw_id2)', function(data){
            if(data.value != ''){
                selLcxxByLyId(data.value);
            }else{
                $("#lc_id2").empty();
                form.render();
            }
        });

        //表格初始化
        window.creaConfigTable=function(){
            table.init('config', configTable);
            $("#jzw_id").empty();
            $("#jzw_id").html(lyxxoptions);

            $("#lc_id").empty();
            $("#lc_id").html(lcxxoptions);
        };

        //头工具栏事件
        table.on('toolbar(config)', function(obj){
            switch(obj.event){
                case 'addConfig':
                    loadConfigForm();
                    $("#jzw_id2").attr("disabled",false);
                    $("#lc_id2").attr("disabled",false);
                    break;
                case 'reset':
                    if(json.jzw_id != undefined){
                        delete json.jzw_id;
                    }
                    if(json.lc_id != undefined){
                        delete json.lc_id;
                    }
                    if(json.mc != undefined){
                        delete json.mc;
                    }
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#jzw_id").val()!=""){
                        json.jzw_id=$("#jzw_id").val();
                    }else{
                        delete json.jzw_id;
                    }
                    if($("#lc_id").val()!=""){
                        json.lc_id=$("#lc_id").val();
                    }else{
                        delete json.lc_id;
                    }
                    if($("#mc").val()!=""){
                        json.mc=$.trim($("#mc").val());
                    }else{
                        delete json.mc;
                    }
                    creaConfigTable();
                    $("#jzw_id").val(json.jzw_id);
                    $("#lc_id").val(json.lc_id);
                    $("#mc").val(json.mc);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'ZCSB_LYGL_FJXX_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonDelete={};
                    jsonDelete.ID=obj.data.FJXX_ID;
                    json1.delete=jsonDelete;
                    getAjax({url:deleteConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            creaConfigTable();
                            layer.msg("操作成功！", {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            } else if(obj.event === 'ZCSB_LYGL_FJXX_EDIT'){
                loadConfigForm();
                selLcxxByLyId(obj.data.JZWJBXX_ID);
                $("#id").val(obj.data.FJXX_ID);
                form.val('configForm', {
                    "jzw_id": obj.data.JZWJBXX_ID,
                    "lc_id": obj.data.LCXX_ID,
                    "bh": obj.data.FJXX_BH,
                    "mc": obj.data.FJXX_MC,
                    "fjsm": obj.data.FJXX_FJSM
                });
                $("#jzw_id2").attr("disabled","disabled");
                $("#lc_id2").attr("disabled","disabled");
            }  else if(obj.event === 'ZCSB_LYGL_FJXX_SBBD'){
                //设备绑定
                $("#id").val(obj.data.FJXX_ID);
                loadSblistPage();
                selSbBindlist();
                selSbNotBindlist();
            } else if(obj.event === 'stop' || obj.event === 'enable'){
                layer.confirm('你确定'+ (obj.data.FJXX_ZT=='1'?'启用':'停用')+'该房间信息吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonFild={};
                    jsonFild.ZT=obj.data.FJXX_ZT=='1'?'2':'1';
                    json1.fild=jsonFild;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.FJXX_ID
                    json1.where=jsonWhere;
                    getAjax({url:updateConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if (reg.resultCode=="200"){
                            creaConfigTable();
                            layer.msg("操作成功！", {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
                return false;
            }
        });

        //系统参数 表单提交
        form.on('submit(addConfigSub)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#id").val()==""||$("#id").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.ZT = '2';
                json.insert=jsonInsert;
                url= insertConfigUrl;

                //判断房间数量
                var json1 = {};
                json1.ASD=jsonASD;
                json1.tableName = tableName;
                json1.fildName="ID,JZW_ID,LC_ID";
                var jsonWhere={};//修改条件
                jsonWhere.LC_ID=$("#lc_id2").val();
                json1.where=jsonWhere;
                var fjcount = 0;
                $.ajax({async:true});
                getAjax({url:loadselectUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode == '200'){
                            fjcount = reg.resultData.length;
                        }
                    }});
                var fjs = $("#lc_id2").find("option:selected").attr("data-toggle");
                // console.log(fjs+'=='+fjcount);
                if(fjs == undefined || fjs == 'undefined'){
                    layer.msg("请先修改楼层房间数！", {offset: '200px'});
                    return false;
                }
                if(fjs == undefined || fjs == 'undefined' ||fjs <= fjcount){
                    layer.msg("房间数量已到楼层限定的房间数，不能再添加！", {offset: '200px'});
                    return false;
                }

            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#id").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                json.fild=jsonFild;
                url= updateConfigUrl;
            }
            getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
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
            codeNo: function(value, item){
                var reg = /^\w+$/;
                if (!reg.test(value)) {
                    return "["+item.title+"] 必须是字母或数字或下划线组成";
                }
            },
            unique: function (value,item) {//唯一性验证
                var checkResult="1";
                var param={
                    tableName:tableName,
                    key:item.name,
                    value:value,
                    id:$("#id").val(),
                    jzw_id:$("#jzw_id2").val(),
                    lcxx_id:$("#lc_id2").val(),
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
                var reg = /^\+?[1-9]\d*$/;
                if (!reg.test(value)) {
                    return "["+item.title+"] 必须是正整数";
                }
            }
        });

        //初始化table
        creaConfigTable();

        //打开授权用户界面
        window.loadSblistPage = function(){
            layer.open({
                type: 1,
                area:['1000px','500px'],//定义宽和高
                title:'设备绑定',//题目
                fixed: false, //不固定
                maxmin: false,
                content: $('#sbBindPage')
            });
        };

        //头工具栏事件
        table.on('toolbar(sblistTable)', function(obj){
            switch(obj.event){
                case 'removeSbxx':
                    removesbxxTj();
                    break;
                case 'resetsblist1':
                    $("#mac").val('');
                    $("#sbmc").val('');
                    selSbBindlist();
                    break;
                case 'chaxunsblist1':
                    var mac = $("#mac").val();
                    var sbmc = $("#sbmc").val();
                    selSbBindlist();
                    $("#mac").val(mac);
                    $("#sbmc").val(sbmc);
                    break;
            };
        });

        //头工具栏事件
        table.on('toolbar(notsblistTable)', function(obj){
            switch(obj.event){
                case 'addSbxx':
                    addsbxxTj();
                    break;
                case 'resetsblist2':
                    $("#mac2").val('');
                    $("#sbmc2").val('');
                    selSbNotBindlist();
                    break;
                case 'chaxunsblist2':
                    var mac2 = $("#mac2").val();
                    var sbmc2 = $("#sbmc2").val();
                    selSbNotBindlist();
                    $("#mac2").val(mac2);
                    $("#sbmc2").val(sbmc2);
                    break;
            };
        });

    });

})

//查询已绑定是设备
function selSbBindlist(){
    var json={};
    json.org_id=belong_org_id;
    json.zcsb_id = $("#id").val();
    json.mac = $("#mac").val();
    json.mc = $("#sbmc").val();
    json.ASD = jsonASD;
    layui.table.render({
        elem: '#sblistTable'
        ,id:'sblist1'
        ,height: 440
        ,url: sbBindlistUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        ,toolbar :'#toolbarUser1'
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {type:'checkbox'}
            ,{field: 'ZCDPXX_MAC', title: '设备序号', sort: false}
            ,{field: 'ZCDPXX_MC', title: '设备名称', sort: false}
            // ,{field: 'ZCDPXX_ACCOUNT',width:150, title: '设备账户', sort: false}
            ,{field: 'ZCDPXX_LX', title: '类别代码', sort: false}
        ]]
    });
}
//查询未绑定是设备
function selSbNotBindlist(){
    var json={};
    json.org_id = belong_org_id;
    json.mac = $("#mac2").val();
    json.mc = $("#sbmc2").val();
    json.ASD = jsonASD;
    layui.table.render({
        elem: '#notsblistTable'
        ,id:'sblist2'
        ,height: 440
        ,url: sbNotBindlistUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        ,toolbar :'#toolbarUser2'
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {type:'checkbox'}
            ,{field: 'ZCDPXX_MAC', title: '设备序号', sort: false}
            ,{field: 'ZCDPXX_MC', title: '设备名称', sort: false}
            // ,{field: 'ZCDPXX_ACCOUNT',width:150, title: '设备账户', sort: false}
            ,{field: 'ZCDPXX_LX', title: '类别代码', sort: false}
        ]]
    });
}

//设备绑定提交
function addsbxxTj(){
    var checkStatus = layui.table.checkStatus('sblist2');
    var ids = [];
    $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
        ids.push(o.ZCDPXX_ID);
    });
    if (ids.length < 1) {
        layer.msg('请选择要添加的设备！');
        return false;
    }
    ids = ids.join(",");
    var json = {};
    json.zcsb_id = $("#id").val();
    json.type = '3';
    json.ids = ids;
    jsonASD.code=sbBindCode;
    json.ASD=jsonASD;
    getAjax({url:sbBindUrl,data:JSON.stringify(json),callback:function (reg) {
            if(reg.resultCode=="200"){
                selSbBindlist();
                selSbNotBindlist();
                layer.msg("操作成功！", {offset: '200px'});
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
            }
        }});
    return false;
}

//解绑
function removesbxxTj(){
    var checkStatus = layui.table.checkStatus('sblist1');
    var ids = [];
    $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
        ids.push(o.ZCDPXX_ID);
    });
    if (ids.length < 1) {
        layer.msg('请选择要解绑的设备！');
        return false;
    }
    ids = ids.join(",");
    var json = {};
    json.zcsb_id = $("#id").val();
    json.type = '3';
    json.ids = ids;
    jsonASD.code=sbBindCode;
    json.ASD=jsonASD;
    getAjax({url:unBindUrl,data:JSON.stringify(json),callback:function (reg) {
            if(reg.resultCode=="200"){
                selSbBindlist();
                selSbNotBindlist();
                layer.msg("操作成功！", {offset: '200px'});
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
            }
        }});
    return false;
}

//通过楼宇ID查询楼层
function selLcxxByLyId(value){
    var lcxxJson={};
    lcxxJson.ASD=getJsonASD();
    lcxxJson.ASD.code=ptFindCode;
    lcxxJson.tableName=tableName3;
    lcxxJson.fildName="ID,BH,FJS,ZT";
    var jsonWhere={};
    jsonWhere.ORG_ID=belong_org_id;
    jsonWhere.JZW_ID=value;
    jsonWhere.ZT='2';
    lcxxJson.where=jsonWhere;
    var lcxxJsonOther={};
    lcxxJsonOther.order={"EDIT_TIME":"desc"};
    lcxxJson.other=lcxxJsonOther;
    getAjax({url:loadselectUrl,data:JSON.stringify(lcxxJson),callback:function (reg) {
            if (reg.resultCode=="200"){
                var list = reg.resultData;
                var lcxxoptions = "<option value=''>请选择楼层信息</option>";
                for (var i=0;i<list.length;i++){
                    lcxxoptions += "<option value='"+list[i].id+"' data-toggle='"+ list[i].fjs+"'>"+list[i].bh+"</option>";
                }
                $("#lc_id2").empty();
                $("#lc_id2").html(lcxxoptions);
                layui.form.render();
            }
        }});
}