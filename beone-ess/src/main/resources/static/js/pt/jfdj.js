
/**
 * 积分等级
 * @Author: 倪杨
 * @Date: 2019/11/12
 */
var ewmChoose=false;
var tableRowCount=0;    //table的总数
var tableData={};   //级别与分值的对象集合
$(function () {


    layui.use(['table','form','laydate','upload'], function() {
        var table=layui.table,
            laydate=layui.laydate,
            upload=layui.upload,
            form=layui.form;

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        // json.fildName="ID,MC,XNS,JC,SFKY,DM,RXNL,EDIT_ID,EDIT_NAME,EDIT_TIME,ZT";

        var jsonWhere={};
        // jsonWhere.CREA_ID=user_id;
        // jsonWhere.BORG_ID=belong_org_id;
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;
        var jsonOther={};
        jsonOther.order={'JB':'ASC'};
        json.other=jsonOther;

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
                $("#JFGZFL").html(getDataSelectHtml('JFGZFL','2','2','请选择规则分类'));
                form.render();
            },
            where:json, //接口的其它参数
            parseData:function(reg){
                tableData = {};
                tableRowCount = reg.count;
                var data = reg.data;
                for (var i = 0;i<data.length;i++){
                    tableData[data[i].JB] = data[i].FZ;
                }
            },
            cols: [[ //表头
                {field: 'MC', title: '等级名称',  sort: false}
                , {field: 'FZ', title: '等级分值',  sort: false}
                , {field: 'JB', title: '等级级别',  sort: true}
                ,{field: 'IMG', title: '等级图标',  sort: false,templet:function (obj) {
                        if(obj.IMG!=null && obj.IMG!="" && obj.IMG !=undefined){
                            var img = JSON.parse(obj.IMG);
                            return '<img src="'+img.folder +'/'+ img.newName +'"class="layui-upload-img">';
                        }else {
                            return "";
                        }
                    }}
                , {title:'操作',width:200 , templet:function (obj) {
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        json2.TYQY = 'SFBZ';
                        var judge = {};
                        var pd = 'N';
                        if (obj.JB == tableRowCount){
                            pd = 'Y';
                        }
                        judge.PTGL_BZJF_JFDJ_DEL = pd;
                        json2.judge = judge;
                        return judgeButtonRights(json2);
                    }}
            ]]
        };

        //打开添加修改页面
        window.loadForm =function () {
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            $("input[name='JB']").val(tableRowCount + 1);
            status="";
            layer.open({
                type:1,//类型
                area:['80%','300px'],//定义宽和高
                offset: '60px',
                title:'积分规则',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#operationPage'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    if (ewmChoose){
                        $("#uploadEWM").click();
                    }
                    $("#formSubmit").click();
                    if(status=="SUCCESS"){
                        creatTable();
                        layer.close(index);
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                },
                btn2:function (index,layero) {
                    layer.close(index);
                }
            });
        };

        var ewm = upload.render({
            elem: '#chooseEWM'
            ,url: uploadFileUrl
            ,auto: false
            ,accept: 'file'
            ,exts: 'jpg|png'
            ,bindAction: '#uploadEWM'
            ,before:function (obj) {
                layer.msg('loading...', {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                });
                var newName="";
                this.data={'ASD':JSON.stringify(jsonASD),'filePath':'jfdj'};
            }
            , choose:function (obj) {
                obj.preview(function(index, file, result){
                    var size = file.size;
                    if (size/1024>100){
                        layer.msg("文件大小不能超过100k！当前文件"+size/1024+"K", {offset: '200px'});
                        layer.close(layer.msg());
                        return false;
                    }
                    $("#EWM").text(file.name);//显示文件名
                    ewmChoose=true;
                });
            }
            ,done: function(res){
                layer.close(layer.msg());
                if (res.resultCode=='200'){
                    var data = res.filejson;
                    $("#EWM").attr("href",dowloadFileUrl+"?filejson="+encodeURI(JSON.stringify(data)));
                    var oldName = data.oldName;
                    $("#EWM").text(oldName);
                    $("#EWM").attr("data-toggle", JSON.stringify(data));
                    $("#ewmDel").attr("data-toggle", JSON.stringify(data));
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
                    ewmChoose=false;
                    loadForm();
                    break;
                case 'reset':
                    $("#jfgzmc").val();
                    delete json.wherelike.MC;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#jfgzmc").val()!=""){
                        json.wherelike.MC=$("#jfgzmc").val();
                    }else{
                        delete json.wherelike.MC;
                    }
                    table.init('conTable', Table);
                    $("#jfgzmc").val(json.wherelike.MC);
                    form.render();
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'PTGL_BZJF_JFDJ_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
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
                            creatTable();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            } else if(obj.event === 'PTGL_BZJF_JFDJ_EDIT'){
                status="";
                ewmChoose=false;
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                var data = obj.data.IMG;
                if (data!=null&&data!=""&&data!=undefined) {
                    $("#EWM").attr("href", dowloadFileUrl + "?filejson=" + encodeURI(data));
                    var oldName = JSON.parse(data).oldName;
                    $("#EWM").text(oldName);
                    $("#EWM").attr("data-toggle", data);
                    $("#ewmDel").attr("data-toggle", data);
                }
                form.render();
                form.val('form', {
                    "MC":obj.data.MC,
                    "FZ":obj.data.FZ,
                    "JB":obj.data.JB,
                })
            }else if(obj.event === 'stop'){
                layer.confirm('你确定要停用吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.SFBZ  = '1';
                    json1.fild=jsonFild;

                    $.ajax({
                        type:"POST",
                        url:updateUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creatTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }else if(obj.event === 'enable'){
                layer.confirm('你确定要启用吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.SFBZ  = '2';
                    json1.fild=jsonFild;

                    $.ajax({
                        type:"POST",
                        url:updateUrl,
                        async:false,
                        dataType:"json", //服务器返回数据的类型
                        contentType: 'application/json',
                        data:JSON.stringify(json1),
                        success:function(reg){
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creatTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }
        });

        //系统参数 表单提交
        form.on('submit(formSubmit)', function (data) {
            var fz =  Number(data.field.FZ);
            var jb =  Number(data.field.JB);
            if (tableData[jb-1]!=null && tableData[jb-1]!="" && tableData[jb-1]!=undefined){
                if (fz<=Number(tableData[jb-1])){
                    layer.msg("当前分值不能小于等于第"+(jb-1)+"级别"+tableData[jb-1]+"分值！", {offset: '200px'});
                    return false;
                }
            }
            if (tableData[jb+1]!=null && tableData[jb+1]!="" && tableData[jb+1]!=undefined){
                console.info(tableData[jb+1]);
                if(fz>=Number(tableData[jb+1])){
                    layer.msg("当前分值不能大于等于第"+(jb+1)+"级别"+tableData[jb+1]+"分值！", {offset: '200px'});
                    return false;
                }
            }

            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                delete jsonInsert.file;
                jsonInsert.IMG=$("#EWM").attr("data-toggle");
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                delete jsonFild.file;
                jsonFild.IMG=$("#EWM").attr("data-toggle");
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
            special: function(value,item){//特殊字符
                var msg = excludeSDQuotes(value,item);
                if(msg!=''){
                    return msg;
                }
            },
            unique: function (value,item) {//唯一性验证
                var checkResult="1";
                var param={
                    tableName:tableName,
                    key:item.name,
                    value:value,
                    id:$("#hiddenId").val(),
                    org_id:belong_org_id,
                    creat_id:user_id,
                    ASD:jsonASD
                }
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
                if(!new RegExp("^[0-9]\\d*$").test(value)){
                    return "["+item.title+"] 必须是正整数";
                }
            }
        });

        creatTable();//表格初始化，一定放在初始化方法之后

    });
});
function delFile(obj) {
    var filejson = $(obj).attr("data-toggle");
    var json1={};
    json1.ASD=jsonASD;
    json1.filejson = filejson;
    getAjax({url:delFileUrl,data:JSON.stringify(json1),callback:function (reg) {
            if(reg.resultCode=="200"){
                layer.msg("删除成功！", {offset: '200px'});
            }else if (reg.resultCode=="404") {
                layer.msg(reg.resultMsg, {offset: '200px'});
            }else {
                layer.msg("删除失败！", {offset: '200px'});
            }
            $(obj).parent().find('a').attr("href","");
            $(obj).parent().find('a').attr("data-toggle","");
            $(obj).parent().find('a').text("");
        }
    });
}
