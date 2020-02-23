$(function () {
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName;
    // json.fildName="ID,YID,NAME,ZT,LX,LXID,ML,ATTR_1,EDITOR_ID,EDITOR_NAME,EDITED_TIME,ORG_ID";
    json.org_id=belong_org_id;
    var configTable={
        defaultToolbar:[],
        toolbar:'#toolbarConfig',
        height: 'full-5',
        url: selMslistUrl,
        method:'post', //接口http请求类型，默认：get
        contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
        page: true,
        enabledCurrCookie: true,
        limits:[10,20,30,40,50,60,70,80,90],
        limit:10,
        where:json, //接口的其它参数
        // size:'sm', //整体表格尺寸，sm  lg
        cols: [[ //表头
            {field: 'MSGL_NAME', title: '模式名称',  sort: false}
            , {field: 'MSGL_ZT', title: '模式状态',  sort: false, templet:function (obj) {
                    if(obj.MSGL_ZT == '2'){
                        return '启用';
                    }else{
                        return '停用';
                    }
                }
            }
            , {field: 'MSGL_LX', title: '模式类型',  sort: false, templet:function (obj) {
                    if(obj.MSGL_LX == '1'){
                        return '楼宇模式';
                    }else if(obj.MSGL_LX == '2'){
                        return '楼层模式';
                    }else if(obj.MSGL_LX == '3'){
                        return '房间模式';
                    }else if(obj.MSGL_LX == '9'){
                        return '账户模式';
                    }else{
                        return '其他模式';
                    }
                }
            }
            , {field: 'EDITOR_NAME', title: '编辑人',  sort: false}
            , {field: 'EDITED_TIME', title: '编辑时间',  sort: false, templet:function (obj) {
                    return dateFormat("yyyy-mm-dd",obj.EDITED_TIME);
                }
            }
            // , {title:'操作', width:150, templet:function (obj) {//toolbar:'#barConfig'
            //         var json2={};
            //         json2.rowData=JSON.stringify(obj);
            //         var judge = {};
            //         if(obj.MSGL_ZT == '1'){
            //             judge.ZCSB_ZKGL_MSGL_KZ = 'N';
            //         }
            //         json2.judge = judge;
            //         json2.TYQY="MSGL_ZT";
            //         return judgeButtonRights(json2);
            //     }}
        ]]

    };
    //打开添加修改页面
    window.loadConfigForm =function () {
        document.getElementById("configForm").reset();
        $("#ID").val("");
        getAccount();
        status="";
        layer.open({
            type:1,//类型
            area:['500px','370px'],//定义宽和高
            title:'模式管理',//题目
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
                    if(json.name != undefined){
                        delete json.name;
                    }
                    if(json.lx != undefined){
                        delete json.lx;
                    }
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#NAME2").val()!=""){
                        json.name=$.trim($("#NAME2").val());
                    }else{
                        delete json.name;
                    }
                    if($("#LX2").val()!=""){
                        json.lx=$("#LX2").val();
                    }else{
                        delete json.lx;
                    }
                    creaConfigTable();
                    $("#NAME2").val(json.name);
                    $("#LX2").val(json.lx);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'ZCSB_ZKGL_MSGL_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.id=obj.data.MSGL_ID;
                    getAjax({url:deleteConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            layer.msg("操作成功！", {offset: '200px'});
                            obj.del();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            } else if(obj.event === 'ZCSB_ZKGL_MSGL_EDIT'){
                loadConfigForm();
                $("#ID").val(obj.data.MSGL_ID);
                $("#LXID").val(obj.data.MSGL_LXID);
                $("#YID").val(obj.data.MSGL_YMSID);
                form.val('configForm', {
                    "NAME": obj.data.MSGL_NAME,
                    "LX": obj.data.MSGL_LX,
                    "ACCOUNT":obj.data.ACCOUNT,
                    "LXNAME": obj.data.LXNAME,
                    "ATTR_1": obj.data.ATTR_1
                })
            }  else if(obj.event === 'ZCSB_ZKGL_MSGL_SZML'){
                //命令设置
                $("#ID").val(obj.data.MSGL_ID);
                $("#LX").val(obj.data.MSGL_LX);
                $("#LXID").val(obj.data.MSGL_LXID);
                account = obj.data.ACCOUNT;
                pdatas = [];
                setMsmlPage();
                //设置已有模式命令
                var msml = obj.data.MSGL_ML;
                $(".device_control").html('');
                if(msml != undefined){
                    var msmls = eval(msml);
                    for(var i in msmls){
                        // console.log(msmls[i].code+'=='+msmls[i].params+'=='+msmls[i].memo+'=='+msmls[i].account+'=='+msmls[i].whid+'=='+msmls[i].product_code+'=='+msmls[i].memo1);
                        var pone = {};
                        pone.code = msmls[i].code;
                        pone.params = msmls[i].params;
                        pone.memo = msmls[i].memo;
                        pone.account = msmls[i].account;
                        pone.whid = msmls[i].whid;
                        pone.product_code = msmls[i].product_code;
                        pone.memo1 = msmls[i].memo1;
                        pdatas.push(pone);

                        var row = $('<div class="layui-col-xs12 device_row" style="height:25px;" serialNum="' + pone.whid + '" cmdKey="' + pone.code + '"  id="' + pone.whid + '_' + pone.code.replace(/\s*/g, "") + '"> </div>');
                        $('<div class="layui-col-xs5"><label>设备信息：</label>' + pone.memo1+'('+pone.whid+')</div>').appendTo(row);
                        $('<div class="layui-col-xs3"><label>设备操作：</label>' + pone.memo + '</div>').appendTo(row);
                        $('<div class="layui-col-xs1 device_remove"><img src="'+ basePath +'img/menu/menu4/blue/nr_icon_del.png" title="点击删除此行"></img></div>').click(function() {
                            var serialNum = $(this).parent().attr("serialNum");
                            var cmdKey = $(this).parent().attr("cmdKey");
                            $(this).parent().remove();
                            var chageCur = -1;
                            for(var i = 0; i < pdatas.length; i++) {
                                if(pdatas[i].code == cmdKey && pdatas[i].whid == serialNum) {
                                    chageCur = i;
                                    break;
                                }
                            }
                            if(chageCur >= 0) {
                                pdatas.splice(chageCur, 1);
                            }
                        }).appendTo(row);
                        row.appendTo($(".device_control"));
                    }
                }
                //查询设备信息
                selMssbxxlist();
            }else if(obj.event === 'ZCSB_ZKGL_MSGL_KZ'){
                //模式控制
                layer.load();
                var yid = obj.data.MSGL_YMSID;
                if(yid == null || yid == '' || yid == undefined || yid == 'undefined'){
                    layer.msg("没有模式命令，不能控制！", {offset: '200px'});
                    layer.closeAll('loading');
                    return false;
                }
                var json1 = {};
                jsonASD.code=msControlCode;
                json1.ASD=jsonASD;
                json1.yid = yid;
                json1.msid = obj.data.MSGL_ID;
                json1.account = obj.data.ACCOUNT;
                getAjax({url:msControlUrl,data:JSON.stringify(json1),callback:function (reg) {
                    layer.closeAll('loading');
                    if(reg.resultCode=="200"){
                        layer.msg("控制成功！", {offset: '200px'});
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }});
            } else if(obj.event === 'stop' || obj.event === 'enable'){
                layer.confirm('你确定'+ (obj.data.MSGL_ZT=='1'?'启用':'停用') +'该模式吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonFild={};
                    jsonFild.ZT=obj.data.MSGL_ZT=='1'?'2':'1';
                    json1.fild=jsonFild;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.MSGL_ID;
                    json1.where=jsonWhere;
                    getAjax({url:updateConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
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
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#ID").val()==""||$("#ID").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.ZT='2';
                delete jsonInsert.LXNAME;
                json.insert=jsonInsert;
                url= insertConfigUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#ID").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                delete jsonFild.LXNAME;
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
            unique: function (value,item) {//唯一性验证
                var checkResult="1";
                var param={
                    tableName:tableName,
                    key:item.name,
                    value:value,
                    id:$("#ID").val(),
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
                var reg = /^\+?[1-9]\d*$/;
                if (!reg.test(value)) {
                    return "["+item.title+"] 必须是正整数";
                }
            }
        });

        //初始化table
        creaConfigTable();

        //命令设置页面
        window.setMsmlPage = function(){
            layer.open({
                type: 1,
                area:['1000px','500px'],//定义宽和高
                title:'模式命令设置',//题目
                fixed: false, //不固定
                maxmin: false,
                shadeClose: true,
                content: $('#msmlsetPage')
            });
        };

        //头工具栏事件
        table.on('toolbar(sblistTable)', function(obj){
            switch(obj.event){
                case 'chooseSbxx':
                    chooseSbxxTj();
                    break;
                case 'resetsblist1':
                    if(lx == '1'){
                        $("#JZWMC").val('');
                        selLylist();
                    }else if(lx == '2'){
                        $("#BH").val('');
                        selLclist();
                    }else if(lx == '3'){
                        $("#FJXX_MC").val('');
                        selFjlist();
                    }else if(lx == '9'){
                        $("#ACCOUNT").val('');
                        selAccoutlist();
                    }
                    break;
                case 'chaxunsblist1':
                    if(lx == '1'){
                        var JZWMC = $("#JZWMC").val();
                        selSbBindlist();
                        $("#JZWMC").val(JZWMC);
                    }else if(lx == '2'){
                        var BH = $("#BH").val();
                        selLclist();
                        $("#BH").val(BH);
                    }else if(lx == '3'){
                        var FJXX_MC = $("#FJXX_MC").val();
                        selFjlist();
                        $("#FJXX_MC").val(FJXX_MC);
                    }else if(lx == '9'){
                        var ACCOUNT = $("#ACCOUNT").val();
                        selAccoutlist();
                        $("#ACCOUNT").val(ACCOUNT);
                    }


                    break;
            };
        });

        //头工具栏事件
        table.on('toolbar(mssblistTable)', function(obj){
            switch(obj.event){
                case 'resetsblist2':
                    $("#MAC2").val('');
                    $("#MC2").val('');
                    selMssbxxlist();
                    break;
                case 'chaxunsblist2':
                    var MAC2 = $("#MAC2").val();
                    var MC2 = $("#MC2").val();
                    selMssbxxlist();
                    $("#MAC2").val(MAC2);
                    $("#MC2").val(MC2);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(mssblistTable)', function(obj){
            if(obj.event === 'add'){
                //添加命令
                addsb(obj.data);
            }
        });

        form.on('select(LX)', function(data){
            if(data.value != ''){
                lx = data.value;
            }
            $("#LXID").val('');
            $("#LXNAME").val('');
        });

        form.on('select(ACCOUNT)',function(data){
            $("#LXID").val('');
            $("#LXNAME").val('');
        });

    });

})


//选择模式类型ID
function chooseSbxxTj(){
    var lx = $("#LX").val();
    var checkStatus = layui.table.checkStatus('sblist1');
    var id = '';
    var name = '';
    $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
        if(lx == '1'){
            id = o.ID;
            name = o.JZWMC;
        }else if(lx == '2'){
            id = o.ID;
            name = o.BH;
        }else if(lx == '3'){
            id = o.FJXX_ID;
            name = o.FJXX_MC;
        }else if(lx == '9'){
            id = o.ID;
            name = o.ACCOUNT;
        }

    });
    if (id == '' || id == null) {
        layer.msg('请选择要添加的数据！');
        return false;
    }
    $("#LXID").val(id);
    $("#LXNAME").val(name);
    layer.close(indexx);
}

//查询模式设备
function selMssbxxlist(){
    var lx = $("#LX").val();
    var lxid = $("#LXID").val();
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.lx = lx;
    json.lxid = lxid;
    json.mac = $("#MAC2").val();
    json.mc = $("#MC2").val();
    json.account = account;
    json.org_id = belong_org_id;
    layui.table.render({
        elem: '#mssblistTable'
        ,id:'mssblist'
        ,height: 300
        ,url: selMsSblistUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        ,toolbar :'#sbToolbar'
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {field: 'ZCDPXX_MC', title: '设备名称', sort: false}
            ,{field: 'ZCDPXX_MAC', title: '设备MAC', sort: false}
            ,{field: 'ZCDPXX_XLH', title: '设备序号', sort: false}
            ,{field: 'ZCDPXX_LX', title: '类别编号', sort: false}
            , {title:'操作', toolbar:'#barConfig'}
        ]]
    });
}

function selMslxId(){
    var LX = $("#LX").val();
    if(LX == null || LX == ''){
        layui.layer.msg("请先选择模式类型！", {offset: '200px'});
        return false;
    }
    var account= $("#ACCOUNT2").val();
    if(account == null || account == ''){
        layui.layer.msg("请先选择所属账户！", {offset: '200px'});
        return false;
    }
    selLylistPage(LX);
    if(LX == '1'){
        selLylist();
    }else if(LX == '2'){
        selLclist();
    }else if(LX == '3'){
        selFjlist();
    }else if(LX == '9'){
        selAccoutlist();
    }

}

//打开授权用户界面
var indexx = '';
window.selLylistPage = function(lx){
    var name = '';
    if(lx == '1'){
        name = '楼宇信息';
    }else if(lx == '2'){
        name = '楼层信息';
    }else if(lx == '3'){
        name = '房间信息';
    }else if(lx == '9'){
        name = '账户信息';
    }

    indexx = layer.open({
        type: 1,
        area:['800px','500px'],//定义宽和高
        title:name,//题目
        fixed: false, //不固定
        maxmin: false,
        content: $('#sbBindPage')
    });
};

function selLylist(){
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName2;
    json.fildName="ID,JZWMC,JZWH";
    var jsonWhere={};
    jsonWhere.ORG_ID=belong_org_id;
    json.where=jsonWhere;
    var wherelike = {};
    wherelike.JZWMC = $("#JZWMC").val();
    json.wherelike = wherelike;
    layui.table.render({
        elem: '#sblistTable'
        ,id:'sblist1'
        ,height: 440
        ,url: loadConfigUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        ,toolbar :'#toolbarUser1'
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {type:'radio'}
            ,{field: 'JZWMC', title: '楼宇名称', sort: false}
            ,{field: 'JZWH', title: '楼宇编号', sort: false}
        ]]
    });
}

function selLclist(){
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName3;
    json.fildName="ID,BH,JZWMC";
    var jsonWhere={};
    jsonWhere.ORG_ID=belong_org_id;
    json.where=jsonWhere;
    var wherelike = {};
    wherelike.BH = $("#BH").val();
    json.wherelike = wherelike;
    layui.table.render({
        elem: '#sblistTable'
        ,id:'sblist1'
        ,height: 440
        ,url: loadConfigUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        ,toolbar :'#toolbarUser2'
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {type:'radio'}
            ,{field: 'BH', title: '楼层编号/名称', sort: false}
            ,{field: 'JZWMC', title: '楼宇名称', sort: false}
        ]]
    });
}

function selFjlist(){
    var json ={};
    json.ASD=jsonASD;
    json.org_id=belong_org_id;
    json.mc = $("#FJXX_MC").val();
    layui.table.render({
        elem: '#sblistTable'
        ,id:'sblist1'
        ,height: 440
        ,url: selFjxxUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        ,toolbar :'#toolbarUser3'
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {type:'radio'}
            ,{field: 'FJXX_MC', title: '房间名称', sort: false}
            ,{field: 'LCXX_BH', title: '楼层编号/名称', sort: false}
            ,{field: 'JZWJBXX_JZWMC', title: '楼宇名称', sort: false}
        ]]
    });
}

function selAccoutlist(){
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName4;
    json.fildName="ID,ACCOUNT";
    var jsonWhere={};
    jsonWhere.ORG_ID=belong_org_id;
    json.where=jsonWhere;
    var wherelike = {};
    wherelike.ACCOUNT = $("#ACCOUNT2").val();
    json.wherelike = wherelike;
    layui.table.render({
        elem: '#sblistTable'
        ,id:'sblist1'
        ,height: 440
        ,url: loadAccountUrl //数据接口
        ,contentType:'application/json'
        ,page: true //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json //接口的其它参数
        ,toolbar :'#toolbarUser4'
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {type:'radio'}
            ,{field: 'ACCOUNT', title: '账户', sort: false}
        ]]
    });
}

//添加模式设备命令
function addsb(one){
    var serial_num = one.ZCDPXX_MAC;
    var product_code = one.ZCDPXX_LX;
    account = one.ZCDPXX_ACCOUNT;
    var device_name = one.ZCDPXX_MC;

    //通过设备类型查询模板
    var lxJson={};
    lxJson.ASD=getJsonASD();
    lxJson.mldm=product_code;
    lxJson.org_id=belong_org_id;
    lxJson.type='web';
    getAjax({url:loadWebMbUrl,data:JSON.stringify(lxJson),callback:function (reg) {
            if(reg.resultCode=="200"){
                var htmlModle = reg.htmlModle;
                if(htmlModle == null || htmlModle == '' || htmlModle == 'null'){
                    layui.layer.msg("无控制模板，此功能暂无法开放！！", {offset: '200px'});
                    return false;
                }

                layer.load();
                layer.open({
                    type:1,//类型
                    area:['900px','500px'],//定义宽和高
                    title:'模式命令设置',//题目
                    shadeClose:false,//点击遮罩层关闭
                    fixed: false, //不固定
                    btn: false,
                    maxmin: true,
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
                            layer.closeAll('loading');
                            return false;
                        }
                        if(datas.controlParams) {
                            datas.controlParams = JSON.stringify(datas.controlParams);
                        }
                        if(!datas.operation) {
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
                        if(datas.title == undefined){
                            datas.title = '无';
                        }
                        // console.log(datas);
                        if($("#" + serial_num + '_' + datas.operation.replace(/\s*/g, ""))[0]) {
                            $("#" + serial_num + '_' + datas.operation.replace(/\s*/g, ""))[0].remove();
                        }
                        var pone = {};
                        pone.code = datas.operation;
                        pone.params = datas.controlParams;
                        pone.memo = datas.title;
                        pone.account = account;
                        pone.whid = serial_num;
                        pone.product_code = product_code;
                        pone.memo1 = device_name;
                        // pone.msid = "";
                        // pone.ymsid = "";

                        var chageCur = -1;
                        for(var i = 0;i<pdatas.length;i++){
                            if(pdatas[i].code==pone.code&&pone.whid==pdatas[i].whid){
                                chageCur=i;
                                break;
                            }
                        }
                        if(chageCur>=0){
                            pdatas.splice(chageCur,1,pone);
                        }else{
                            pdatas.push(pone);
                        }

                        var row = $('<div class="layui-col-xs12 device_row" style="height:25px;" serialNum="' + serial_num + '" cmdKey="' + datas.operation + '"  id="' + serial_num + '_' + datas.operation.replace(/\s*/g, "") + '"> </div>');
                        $('<div class="layui-col-xs5"><label>设备信息：</label>' + device_name+'('+serial_num+')</div>').appendTo(row);
                        // $('<div class="layui-col-xs3"><label>所属订阅：</label>' + one.account + '</div>').appendTo(row);
                        $('<div class="layui-col-xs3"><label>设备操作：</label>' + datas.title + '</div>').appendTo(row);
                        $('<div class="layui-col-xs1 device_remove"><img src="'+basePath+'img/menu/menu4/blue/nr_icon_del.png" title="点击删除此行"></div>').click(function() {
                            var serialNum = $(this).parent().attr("serialNum");
                            var cmdKey = $(this).parent().attr("cmdKey");
                            $(this).parent().remove();
                            var chageCur = -1;
                            for(var i = 0; i < pdatas.length; i++) {
                                if(pdatas[i].code == cmdKey && pdatas[i].whid == serialNum) {
                                    chageCur = i;
                                    break;
                                }
                            }
                            if(chageCur >= 0) {
                                pdatas.splice(chageCur, 1);
                            }
                        }).appendTo(row);
                        row.appendTo($(".device_control"));
                        layer.closeAll('loading');
                        // $("#mldiv")[0].scrollTop = $("#mldiv")[0].scrollHeight;
                    })
                });
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
            }
        }});

}

//模式命令提交
function msmltj(){
    layui.layer.load();
    if(pdatas == null || pdatas == ''){
        layui.layer.closeAll('loading');
        layui.layer.msg("模式命令不能为空", {offset: '200px'});
        return false;
    }
    var json1 = {};
    json1.ASD=jsonASD;
    json1.ASD.code=setmlCode;
    json1.msid=$("#ID").val();
    json1.account=account;
    json1.msmls = JSON.stringify(pdatas);
    getAjax({url:setMsmlUrl,data:JSON.stringify(json1),callback:function (reg) {
            layui.layer.closeAll('loading');
            if(reg.resultCode == '200'){
                creaConfigTable();
                layer.closeAll();
                layui.layer.msg("命令设置成功！");
            }else{
                layui.layer.msg(reg.resultMsg, {offset: '200px'});
            }
        }});
}

//查询设备账户
function getAccount() {
    var xndJson={};
    xndJson.ASD=getJsonASD();
    xndJson.ASD.code=ptFindCode;
    xndJson.tableName=tableName4;
    xndJson.fildName="ID,ACCOUNT";
    var whereJson = {};
    whereJson.SFKT = '2';
    whereJson.DYZT = '3';
    whereJson.BORG_ID = belong_org_id;
    xndJson.where = whereJson;
    var xndJsonOther={};
    xndJsonOther.order={"TIME":"asc"};
    xndJson.other=xndJsonOther;
    getAjax({url:loadCommonUrl,data:JSON.stringify(xndJson),callback:function (reg) {
            if (reg.resultCode=="200"){
                var list = reg.resultData;
                $("#ACCOUNT2").empty();
                for (var i=0;i<list.length;i++){
                    $("#ACCOUNT2").append("<option selected value='"+list[i].account+"'>"+list[i].account+"</option>");
                }
                layui.form.render();
            }
        }
    });
}