$(function () {
    var json ={};
    jsonASD.code=ptFindCode;
    json.ASD=jsonASD;
    json.tableName=tableName;
    // json.fildName="ID,JZW_ID,BH,XH,SM,FJS,JZWMC,ZT,FJQZ";
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
        done:function(){
            var where = {borg_id:belong_org_id};
            $("#jzw_id").html(getSelectHtml2(commonFindUrl,tableName2,'',json.jzw_id,'请选择楼宇','id','jzwmc',where,''));
            var where = {zt:'2',borg_id:belong_org_id};
            $("#jzw_id2").html(getSelectHtml2(commonFindUrl,tableName2,'','','请选择楼宇','id','jzwmc',where,''));
            layui.form.render();
        },
        where:json, //接口的其它参数
        // size:'sm', //整体表格尺寸，sm  lg
        cols: [[ //表头
            {field: 'JZWMC', title: '楼宇名称',  sort: false}
            , {field: 'BH', title: '楼层编号',  sort: false}
            , {field: 'FJS', title: '房间数',  sort: false}
            , {field: 'ZT', title: '楼层状态',  sort: false, templet:function (obj) {
                    return getDataText('TYQY_ZT',obj.ZT);
                }}
            , {field: 'SM', title: '楼层说明',  sort: false}
            // , {field: 'JZWYT', title: '楼宇用途',  sort: false}
            , {title:'操作', width:150, templet:function (obj) {//toolbar:'#barConfig'
                    var json2={};
                    json2.rowData=JSON.stringify(obj);
                    json2.TYQY="ZT";
                    var judge={};
                    if(obj.ZT == '1'){
                        judge.ZCSB_LYGL_LCXX_EDIT='N';
                        judge.ZCSB_LYGL_LCXX_SBBD='N';
                    }else{
                        judge.ZCSB_LYGL_LCXX_DEL='N';
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
            title:'楼层管理',//题目
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

        //表格初始化
        window.creaConfigTable=function(){
            table.init('config', configTable);
        };

        //头工具栏事件
        table.on('toolbar(config)', function(obj){
            switch(obj.event){
                case 'addConfig':
                    loadConfigForm();
                    $("#jzw_id2").attr("disabled",false);
                    break;
                case 'reset':
                    if(json.jzw_id != undefined){
                        delete json.jzw_id;
                    }
                    if(json.bh != undefined){
                        delete json.bh;
                    }
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#jzw_id").val()!=""){
                        json.jzw_id=$("#jzw_id").val();
                    }else{
                        delete json.jzw_id;
                    }
                    if($("#bh").val()!=""){
                        json.bh=$.trim($("#bh").val());
                    }else{
                        delete json.bh;
                    }
                    creaConfigTable();
                    $("#jzw_id").val(json.jzw_id);
                    $("#bh").val(json.bh);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'ZCSB_LYGL_LCXX_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonDelete={};
                    jsonDelete.id=obj.data.ID;
                    json1.delete=jsonDelete;
                    getAjax({url:deleteConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            layer.msg("操作成功！", {offset: '200px'});
                            creaConfigTable();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            } else if(obj.event === 'ZCSB_LYGL_LCXX_EDIT'){
                loadConfigForm();
                $("#id").val(obj.data.ID);
                form.val('configForm', {
                    "jzw_id": obj.data.JZW_ID,
                    "bh": obj.data.BH,
                    "fjs": obj.data.FJS,
                    "sm": obj.data.SM,
                    "fjqz": obj.data.FJQZ
                });
                $("#jzw_id2").attr("disabled","disabled");
            } else if(obj.event === 'ZCSB_LYGL_LCXX_SBBD'){
                //设备绑定
                $("#id").val(obj.data.ID);
                loadSblistPage();
                selSbBindlist();
                selSbNotBindlist();
            }  else if(obj.event === 'stop' || obj.event === 'enable'){
                layer.confirm('你确定'+ (obj.data.ZT=='1'?'启用':'停用') +'该楼层吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonFild={};
                    jsonFild.ZT=obj.data.ZT=='1'?'2':'1';
                    json1.fild=jsonFild;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID
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
            if ($("#id").val()==""||$("#id").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.zt='2';
                json.insert=jsonInsert;
                url= insertConfigUrl;

                //判断楼层数量
                var json1 = {};
                json1.ASD=jsonASD;
                json1.tableName = tableName;
                json1.fildName="ID,JZW_ID";
                var jsonWhere={};//修改条件
                jsonWhere.jzw_id=$("#jzw_id2").val();
                json1.where=jsonWhere;
                var lccount = 0;
                $.ajax({async:true});
                getAjax({url:loadLyxxUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode == '200'){
                            lccount = reg.resultData.length;
                        }
                    }});
                var jzwcs = $("#jzw_id2").find("option:selected").attr("data-toggle");
                if(jzwcs <= lccount){
                    layer.msg("楼层数量已到楼宇限定的层数，不能再添加！", {offset: '200px'});
                    return false;
                }

            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.id=$("#id").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                json.fild=jsonFild;
                url= updateUrl;
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
                    $("#mc").val('');
                    selSbBindlist();
                    break;
                case 'chaxunsblist1':
                    var mac = $("#mac").val();
                    var mc = $("#mc").val();
                    selSbBindlist();
                    $("#mac").val(mac);
                    $("#mc").val(mc);
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
                    $("#mc2").val('');
                    selSbNotBindlist();
                    break;
                case 'chaxunsblist2':
                    var mac2 = $("#mac2").val();
                    var mc2 = $("#mc2").val();
                    selSbNotBindlist();
                    $("#mac2").val(mac2);
                    $("#mc2").val(mc2);
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
    json.mc = $("#mc").val();
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
    json.mc = $("#mc2").val();
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
    json.type = '2';
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
    json.type = '2';
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

/**
 * 获取下拉框拼装
 * url  地址
 * tableName  表名
 * type  类型 1 停用  2 启用
 * def 默认值
 * opsel 选项提示
 * key 下拉键
 * value 下拉值
 * glid 关联查询ID
 * */
function getSelectHtml2(url,tableName,type,def,opsel,key,value,where, glid){
    var options = '' ;
    var codeName = tableName+type+glid;
    $.ajaxSetup({async: false});
    getTableDataInfo2(url, tableName, type, key,value, where, glid);
    if(opsel!=null && opsel!=''){
        options = '<option value="">'+opsel+'</option>';
    }
    var list = JxCore.dataInfo[codeName];
    for(var i=0;i<list.length;i++){
        if(def!=null && def!='' && def==list[i].id)
            options += '<option value="'+ list[i][key] +'" data-toggle="'+ list[i].jzwcs+'" selected>'+ list[i][value] +'</option>';
        else
            options += '<option value="'+ list[i][key] +'" data-toggle="'+ list[i].jzwcs+'">'+ list[i][value] +'</option>';
    }
    return options ;
}

/**
 * 获取表数据
 * url  地址
 * tableName  表名
 * type  类型 1 停用  2 启用
 * where 参数
 * glid 关联查询ID
 * */
function getTableDataInfo2(url, tableName,type,key,value, where, glid){
    var codeName = tableName+type+glid;
    var json = {};
    json.fildName = key+','+value+',JZWCS';
    json.tableName = tableName;
    json.where = where;
    json.ASD = getJsonASD();
    json.ASD.code = ptFindCode;
    getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
            if (reg.resultCode=="200"){
                JxCore.dataInfo[codeName] = reg.resultData ;
                parent.parent.p_dataInfo = JxCore.dataInfo ;
            }
        }});
}