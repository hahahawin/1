/*
  倪杨
  2019-09-17
  组织用户初始化
*/

var fjChoose=false;
var ewmChoose=false;
$(function () {

    layui.use(['table','form','laydate','upload'], function() {
        var table=layui.table,
            laydate = layui.laydate,
            upload = layui.upload,
            form=layui.form;

        laydate.render({
            elem: '#LXSJ', //指定元素
        });

        var json ={};
        jsonASD.code=cxCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        // json.fildName="ID,NAME,ACCOUNT,TYPE,ZT,ISADMIN,ORG_ID,ORG_NAME";

        var jsonWhere={};
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;

        // Table:定义表格的基本数据
        var Table={
            defaultToolbar:[],
            toolbar:'#toolHead',
            height: 'full-0',
            url: loadUrl,
            method:'post', //接口http请求类型，默认：get
            contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
            page: true,
            enabledCurrCookie: true,
            limits:[10,20,30,40,50,60,70,80,90],
            limit:10,
            done:function(){
                $("#YWMC").html(getDataSelectHtml('BBLXDM','1','','请选择英文名称'));
                $("#LX").html(getDataSelectHtml('CZXTLX','1','','请选择项目类型'));
                $("#lxZT").html(getDataSelectHtml('FBZT','1',json.where.FBZT,'请选择发布状态'));
                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'NAME', title: '项目名称',   sort: false}
                , {field: 'YWMC', title: '英文名称',  sort: false,templet:function (obj) {
                        return getDataText("BBLXDM",obj.YWMC);
                    }}
                , {field: 'LX', title: '项目类型', sort: false,templet:function (obj) {
                        return getDataText("CZXTLX",obj.LX);
                    }}
                , {field: 'LXSJ',width:100, title: '立项时间',  sort: false,width:100,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.LXSJ);
                    }}
                , {field: 'FBZT',width:100, title: '软件状态',  sort: false,width:100,templet:function (obj) {
                        return getDataText("FBZT",obj.FBZT);
                    }}
                , {field: 'FBSJ', title: '发布时间', sort: false,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.FBSJ);
                    }}
                , {field: 'XMCYR', title: '项目参与人', sort: false}
                , {field: 'FBCYR', title: '发布参与人', sort: false}
                , {field: 'XMZL', title: '附件资料', sort: false,templet:function (obj) {
                        return JSON.parse(obj.XMZL).fileName;
                    }}
                , {field: 'LOGO', title: '项目图片/logo', sort: false,templet:function (obj) {
                        return JSON.parse(obj.LOGO).fileName;
                    }}
                , {title:'操作', width:200,templet:function (obj) {
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        var pd = "N";
                        if (obj.FBZT=="1"){
                            pd="Y";
                        }
                        var judge={};
                        judge.PTGL_BBGL_LXGL_EDIT=pd;
                        judge.PTGL_BBGL_LXGL_DEL=pd;
                        json2.judge = judge;
                        return judgeButtonRights(json2);
                    }}
            ]]
        };

        //打开添加修改页面
        window.loadForm =function () {
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            status="";
            layer.open({
                type:1,//类型
                area:['800px','400px'],//定义宽和高
                title:'类型管理',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['保存','发布','关闭'],
                content: $('#operationPage'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    if (fjChoose){
                        $("#uploadXMZL").click();
                    }
                    if (ewmChoose){
                        $("#uploadLOGO").click();
                    }
                    $("#formSubmit1").click();
                    if(status=="SUCCESS"){
                        creatTable();
                        layer.close(index);
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                },
                btn2:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn1").attr("class","layui-layer-btn1 layui-btn-disabled");//确定按钮禁用
                    if (fjChoose){
                        $("#uploadXMZL").click();
                    }
                    if (ewmChoose){
                        $("#uploadLOGO").click();
                    }
                    $("#formSubmit").click();
                    if(status=="SUCCESS"){
                        creatTable();
                        layer.close(index);
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn1");//取消确定按钮的禁用
                    return false;
                },
                btn3:function (index,layero) {
                    layer.close(index);
                }
            });
        };

        var xmzl = upload.render({
            elem: '#chooseXMZL'
            ,url: BBuploadFileUrl  //exportCheckUrl  importUrl
            ,auto: false
            ,accept: 'file'
            ,exts: 'zip|rar|apk|ipa'
            ,bindAction: '#uploadXMZL'
            ,before:function (obj) {
                // var newName="file_"+$("#NAME ").find("option:selected").text()+"_"+$("#BBH").val();
                var newName="file_"+$("#YWMC").val();
                this.data={'ASD':JSON.stringify(jsonASD),'fileName':newName,'filePath':'bblx'};
            }
            , choose:function (obj) {
                obj.preview(function(index, file, result){
                    var size = file.size;
                    if (size/1024/1024>200){
                        layer.msg("文件大小不能超过200M！当前文件"+size/1024/1024+"M", {offset: '200px'});
                        return false;
                    }
                    $("#XMZL").text(file.name);//显示文件名
                    fjChoose=true;
                });
            }
            ,done: function(res){
                if (res.resultCode=='200'){
                    var fileName = res.fileName;
                    var filePath = res.filePath;
                    $("#XMZL").attr("href",filePath);
                    $("#XMZL").text(fileName);
                }

            }
        });



        var logo = upload.render({
            elem: '#chooseLOGO'
            ,url: BBuploadFileUrl  //exportCheckUrl  importUrl
            ,auto: false
            ,accept: 'file'
            ,exts: 'jpg|png'
            ,bindAction: '#uploadLOGO'
            ,before:function (obj) {
                // var newName="img_"+$("#NAME ").find("option:selected").text()+"_"+$("#BBH").val();
                var newName="img_"+$("#YWMC").val();
                this.data={'ASD':JSON.stringify(jsonASD),'fileName':newName,'filePath':'bblx'};
            }
            , choose:function (obj) {
                obj.preview(function(index, file, result){
                    var size = file.size;
                    if (size/1024>100){
                        layer.msg("文件大小不能超过100k！当前文件"+size/1024+"K", {offset: '200px'});
                        return false;
                    }
                    $("#LOGO").text(file.name);//显示文件名
                    ewmChoose=true;
                });
            }
            ,done: function(res){
                if (res.resultCode=='200'){
                    var fileName = res.fileName;
                    var filePath = res.filePath;
                    $("#LOGO").attr("href",filePath);
                    $("#LOGO").text(fileName);
                }
            }
        });

        //表格初始化方法
        window.creatTable=function(){
            table.init('conTable', Table);
        };
        //头工具栏事件
        table.on('toolbar(conTable)', function(obj){
            switch(obj.event){
                case 'add':
                    loadForm();
                    fjChoose=false;
                    ewmChoose=false;
                    $("#XMZL").attr("href","");
                    $("#XMZL").text("");
                    $("#LOGO").attr("href","");
                    $("#LOGO").text("");
                    xmzl.reload();
                    logo.reload();
                    break;
                case 'reset':
                    $("#lxName").val('');
                    $("#lxZT").val('');
                    delete json.wherelike.NAME;
                    delete json.where.FBZT;
                    creatTable();
                    form.render();
                    break;
                case 'findOnCondition':
                    if($("#lxName").val()!=""){
                        json.wherelike.NAME=$.trim($("#lxName").val());
                    }else{
                        delete json.wherelike.NAME;
                    }
                    if($("#lxZT").val()!=""){
                        json.where.FBZT=$("#lxZT").val();
                    }else{
                        delete json.where.FBZT;
                    }
                    table.init('conTable', Table);
                    $("#lxName").val(json.wherelike.NAME);
                    $("#lxZT").val(json.where.FBZT);
                    form.render();
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'PTGL_BBGL_LXGL_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=delCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonDelete={};
                    jsonDelete.ID=obj.data.ID;
                    json1.delete=jsonDelete;
                    getAjax({url:deleteUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                obj.del();
                                layer.close(index);
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }});
                });
            }else if (obj.event === 'PTGL_BBGL_LXGL_EDIT') {
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                fjChoose=false;
                ewmChoose=false;
                xmzl.reload();
                logo.reload();
                $("#XMZL").attr("href",JSON.parse(obj.data.XMZL).filePath);
                $("#XMZL").text(JSON.parse(obj.data.XMZL).fileName);
                $("#LOGO").attr("href",JSON.parse(obj.data.LOGO).filePath);
                $("#LOGO").text(JSON.parse(obj.data.LOGO).fileName);
                form.render();
                form.val('form', {
                    "NAME":obj.data.NAME,
                    "YWMC":obj.data.YWMC,
                    "LXSJ":dateFormat("yyyy-mm-dd",obj.data.LXSJ),
                    "LX":obj.data.LX,
                    "FBCYR":obj.data.FBCYR,
                    "XMCYR":obj.data.XMCYR,
                    "ATT1":obj.data.ATT1,
                    // "XMZL":obj.data.XMZL,
                    // "LOGO":obj.data.LOGO,
                })
            }
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
                    id:$("#hiddenId").val(),
                    ASD:jsonASD,
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
            },
            positiveInteger:function (value,item) {
                if(!new RegExp("^[1-9]\d*$").test(value)){
                    return "["+item.title+"] 必须是正整数";
                }
            }
        });

        //系统参数 表单提交
        form.on('submit(formSubmit)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            var fjJson={};
            fjJson.filePath=$("#XMZL").attr("href");
            fjJson.fileName=$("#XMZL").text();
            var ewmJson={};
            ewmJson.filePath=$("#LOGO").attr("href");
            ewmJson.fileName=$("#LOGO").text();
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=addCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id,special+序列名字
                var jsonInsert = data.field;  //通过name值获取数据
                delete jsonInsert.file;
                jsonInsert.XMZL=JSON.stringify(fjJson);
                jsonInsert.LOGO=JSON.stringify(ewmJson);
                jsonInsert.dateLXSJ=data.field.LXSJ;
                jsonInsert.dateFBSJ='sysdate';
                delete jsonInsert.LXSJ;
                jsonInsert.FBZT='2';
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=editCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                delete jsonFild.file;
                jsonFild.XMZL=JSON.stringify(fjJson);
                jsonFild.LOGO=JSON.stringify(ewmJson);
                jsonFild.dateLXSJ=data.field.LXSJ;
                jsonFild.dateFBSJ='sysdate';
                delete jsonFild.LXSJ;
                jsonFild.FBZT='2';
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
                }
            });
            return false;
        });


        form.on('submit(formSubmit1)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            var fjJson={};
            fjJson.filePath=$("#XMZL").attr("href");
            fjJson.fileName=$("#XMZL").text();
            var ewmJson={};
            ewmJson.filePath=$("#LOGO").attr("href");
            ewmJson.fileName=$("#LOGO").text();
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=addCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id,special+序列名字
                var jsonInsert = data.field;  //通过name值获取数据
                delete jsonInsert.file;
                jsonInsert.XMZL=JSON.stringify(fjJson);
                jsonInsert.LOGO=JSON.stringify(ewmJson);
                jsonInsert.dateLXSJ=data.field.LXSJ;
                delete jsonInsert.LXSJ;
                jsonInsert.FBZT='1';
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=editCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                delete jsonFild.file;
                jsonFild.XMZL=JSON.stringify(fjJson);
                jsonFild.LOGO=JSON.stringify(ewmJson);
                jsonFild.dateLXSJ=data.field.LXSJ;
                delete jsonFild.LXSJ;
                jsonFild.FBZT='1';
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
                }
            });
            return false;
        });
        creatTable();//表格初始化，一定放在初始化方法之后

    });

});

function delFj() {
    var delFjJson={};
    delFjJson.ASD=jsonASD;
    delFjJson.filePath = $("#XMZL").attr("href");
    getAjax({url:bbDelFileUrl,data:JSON.stringify(delFjJson),callback:function (reg) {
            if(reg.resultCode=="200"){
                layer.msg("删除成功！", {offset: '200px'});
            }else if (reg.resultCode=="404") {
                //layer.msg(reg.resultMsg, {offset: '200px'});
            }else {
                layer.msg("删除失败！", {offset: '200px'});
            }
            $("#XMZL").attr("href","");
            $("#XMZL").text("");
            fjChoose=false;
        }
    });
};
function delLOGO() {
    var delEwmJson={};
    delEwmJson.ASD=jsonASD;
    delEwmJson.filePath = $("#LOGO").attr("href");
    getAjax({url:bbDelFileUrl,data:JSON.stringify(delEwmJson),callback:function (reg) {
            if(reg.resultCode=="200"){
                layer.msg("删除成功！", {offset: '200px'});
            }else if (reg.resultCode=="404") {
                //layer.msg(reg.resultMsg, {offset: '200px'});
            }else {
                layer.msg("删除失败！", {offset: '200px'});
            }
            $("#LOGO").attr("href","");
            $("#LOGO").text("");
            ewmChoose=false;
        }
    });
}