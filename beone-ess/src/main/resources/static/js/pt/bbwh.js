/*
  倪杨
  2019-09-17
  组织用户初始化
*/

var BBID="";
var fjChoose=false;
var ewmChoose=false;
$(function () {
    var bblx=getBblx();
    var userInfo=getUserInfo();

    var ue = UE.getEditor('FBNR',{autoHeightEnabled: false,maximumWords:1000});//富文本编辑器

    //设置UE上传格式和路径
    UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
    UE.Editor.prototype.getActionUrl = function(action) {
        if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
            return basePath+'common/imgUpdate'; //在这里返回我们实际的上传图片地址
        } else {
            return this._bkGetActionUrl.call(this, action);
        }
    }

    var status="";//添加修改是否成功的状态，默认是空
    layui.use(['table','form','laydate','upload'], function() {
        var table=layui.table,
            laydate = layui.laydate,
            upload = layui.upload,
            form=layui.form;

        var json ={};
        jsonASD.code=cxCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        json.fildName="ID,NAME,BBH,CY,FBNR1,RBR,FBSJ,FBZT,SHR,SHSJ,SHZT,FJ,EWM,CREA_ID,ATT1,ATT4";

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
                $("#ATT1").empty();
                $("#bbName").empty();
                $("#ATT1").append("<option value=''>请选择项目名称</option>");
                $("#bbName").append("<option value=''>请选择项目名称</option>");
                for(var i in bblx){
                    if (i==json.where.NAME) {
                        $("#bbName").append("<option selected value='"+i+"'>"+bblx[i]+"</option>");
                    }else{
                        $("#bbName").append("<option value='"+i+"'>"+bblx[i]+"</option>");
                    }
                    $("#ATT1").append("<option value='"+i+"'>"+bblx[i]+"</option>");
                }

                $("#SHR").empty();
                $("#SHR").append("<option value=''>请选择审核人</option>");
                for(var j in userInfo){
                    $("#SHR").append("<option value='"+j+"'>"+userInfo[j]+"</option>");
                }

                $("#bbFbzt").html(getDataSelectHtml('FBZT','1',json.where.FBZT,'请选择发布状态'));
                $("#bbShzt").html(getDataSelectHtml('SHZT','1',json.where.SHZT,'请选择审核状态'));
                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'ATT1',width:150, title: '项目名称',sort: false,templet:function (obj) {
                        return bblx[obj.ATT1];
                    }}
                , {field: 'NAME', title: '版本名称',  sort: false}
                , {field: 'BBH', title: '版本号',  sort: false}
                , {field: 'RBR', title: '发布人', sort: false,templet:function (obj) {
                        return userInfo[obj.RBR];
                    }}
                , {field: 'FBSJ',width:100, title: '发布时间',  sort: false,width:100,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.FBSJ);
                    }}
                , {field: 'FBZT', title: '发布状态', sort: false,templet:function (obj) {
                        return getDataText("FBZT",obj.FBZT);
                    }}
                , {field: 'SHR',width:100, title: '审核人',  sort: false,width:100,templet:function (obj) {
                        return userInfo[obj.SHR];
                    }}
                , {field: 'SHSJ', title: '审核时间', sort: false,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.SHSJ);
                    }}
                , {field: 'SHZT', title: '审核状态', sort: false,templet:function (obj) {
                        return getDataText("SHZT",obj.SHZT);
                    }}
                // , {field: 'FBNR1', title: '项目内容', sort: false}
                , {field: 'FJ', title: '附件资料', sort: false,templet:function (obj) {
                        if (obj.FJ != null && obj.FJ != '' && obj.FJ!=undefined){
                            return JSON.parse(obj.FJ).oldName;
                        }else{
                            return '';
                        }
                    }}
                , {field: 'EWM', title: '二维码', sort: false,templet:function (obj) {
                        if (obj.EWM != null && obj.EWM != '' && obj.EWM!=undefined){
                            return JSON.parse(obj.EWM).oldName;
                        }else{
                            return '';
                        }
                    }}
                , {title:'操作', width:200,templet:function (obj) {
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        var shpd="N";
                        if (obj.SHZT=='1'){
                            shpd="Y";
                        }
                        var fbpd="N";
                        if (obj.FBZT=='1'&&obj.SHZT=='2'&&obj.RBR==user_id){
                            fbpd="Y";
                        }
                        var zzszpd="N";
                        if (obj.FBZT=='2'){
                            zzszpd="Y";
                        }
                        var judge={};
                        judge.PTGL_BBGL_BBWH_EDIT=shpd;
                        judge.PTGL_BBGL_BBWH_DEL=shpd;
                        judge.PTGL_BBGL_BBWH_SH=shpd;
                        judge.PTGL_BBGL_BBWH_FB=fbpd;
                        judge.PTGL_BBGL_BBWH_ZZSZ=zzszpd;
                        json2.judge=judge;
                        return judgeButtonRights(json2);
                    }}
            ]]
        };

        //打开添加修改页面
        window.loadForm =function () {
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            $("#showFjxx").html("");
            ydtpFile=new Array();
            status="";
            layer.open({
                type:1,//类型
                area:['1000px','500px'],//定义宽和高
                title:'平台版本维护',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#operationPage'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    if (fjChoose){
                        $("#uploadFj").click();
                    }
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

        window.loadDetailForm =function () {
            document.getElementById("form").reset();
            $("#detailHiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            layer.open({
                type:1,//类型
                area:['1000px','500px'],//定义宽和高
                title:'平台版本维护审核',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['通过','拒绝','关闭'],
                content: $('#detailPage'),//打开的内容
                yes:function (index,layero) {
                    var json1 ={};
                    jsonASD.code=shCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=$("#detailHiddenId").val();
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.SHR=user_id;
                    jsonFild.dateSHSJ='sysdate';
                    jsonFild.SHZT='2';
                    json1.fild=jsonFild;
                    getAjax({url:updateUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                creatTable();
                                layer.close(index);
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                },
                btn2:function (index,layero) {
                    var json1 ={};
                    jsonASD.code=shCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=$("#detailHiddenId").val();
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.SHR=user_id;
                    jsonFild.dateSHSJ='sysdate';
                    jsonFild.SHZT='3';
                    json1.fild=jsonFild;
                    getAjax({url:updateUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                creatTable();
                                layer.close(index);
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                },
                btn3:function (index,layero) {
                    layer.close(index);
                }
            });
        };

        //打开组织关系fjxxShow
        window.loadZzszForm =function () {
            layer.open({
                type:1,//类型
                area:['1000px','500px'],//定义宽和高
                title:'组织关系',//题目
                shadeClose:false,//点击遮罩层关闭
                content: $('#zzszPage'),//打开的内容
            });
        };

        //附件
        var fj = upload.render({
            elem: '#chooseFj'
            ,url: uploadFileUrl
            ,auto: false
            ,accept: 'file'
            ,exts: 'zip|rar|apk|ipa'
            ,bindAction: '#uploadFj'
            ,before:function (obj) {
                layer.msg('loading...', {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                });
                var newName="file_"+$("#BBH").val();
                this.data={'ASD':JSON.stringify(jsonASD),'fileName':newName,'filePath':'bbwh'};
            }
            , choose:function (obj) {
                obj.preview(function(index, file, result){
                    var size = file.size;
                    if (size/1024/1024>200){
                        layer.msg("文件大小不能超过200M！当前文件"+size/1024/1024+"M", {offset: '200px'});
                        layer.close(layer.msg());
                        return false;
                    }
                    $("#FJ").text(file.name);//显示文件名
                    fjChoose=true;
                });
            }
            ,done: function(res){
                layer.close(layer.msg());
                if (res.resultCode=='200'){
                    var data = res.filejson;
                    $("#FJ").attr("href",dowloadFileUrl+"?filejson="+encodeURI(JSON.stringify(data)));
                    var oldName = data.oldName;
                    $("#FJ").text(oldName);
                    $("#FJ").attr("data-toggle", JSON.stringify(data));
                    $("#fjDel").attr("data-toggle", JSON.stringify(data));

                    // var fileName = res.fileName;
                    // var filePath = res.filePath;
                    // $("#FJ").attr("href",filePath);
                    // $("#FJ").text(fileName);
                }

            }
        });
        //二维码图片
        var ewm = upload.render({
            elem: '#chooseEWM'
            ,url: uploadFileUrl
            ,auto: false
            ,accept: 'file'
            ,exts: 'jpg|png'
            ,bindAction: '#uploadEWM'
            ,before:function (obj) {
                // var newName="img_"+$("#NAME ").find("option:selected").text()+"_"+$("#BBH").val();
                layer.msg('loading...', {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                });
                var newName="img_"+$("#BBH").val();
                this.data={'ASD':JSON.stringify(jsonASD),'fileName':newName,'filePath':'bbwh'};
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
                    // var fileName = res.fileName;
                    // var filePath = res.filePath;
                    // $("#EWM").attr("href",filePath);
                    // $("#EWM").text(fileName);
                }
            }
        });
        //引导图片
        var fjxxShow=$("#showFjxx");
        var ydtp = upload.render({
            elem: '#chooseFJXX'
            ,url: uploadFileUrl
            ,auto: false
            ,bindAction: '#uploadXMZL'
            ,accept:'images'
            ,exts:'jpg|png|gif|bmp|jpeg'
            ,before:function (obj) {
                layer.msg('loading...', {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                });
                this.data={'ASD':JSON.stringify(jsonASD),'filePath':'bbwh'};
            }
            , choose:function (obj) {
                obj.preview(function(index, file, result){
                    var size = file.size;
                    if (size/1024>100){
                        layer.msg("图片大小不能超过100KB！当前文件"+size/1024+"KB", {offset: '200px'});
                        layer.close(layer.msg());
                        return false;
                    }
                    if (fjNum>2){
                        layer.msg("图片不能超过3张", {offset: '200px'});
                        layer.close(layer.msg());
                        return false;
                    }
                    fjNum+=1;
                    obj.upload(index, file);
                });
            }
            ,done: function(res){
                layer.close(layer.msg());
                if (res.resultCode=='200'){
                    var data = res.filejson;
                    ydtpFile.push(data);
                    var tr="<tr>"
                        +"<td>"+'<a href="'+ dowloadFileUrl+"?filejson="+encodeURI(JSON.stringify(data))+'">'+data.oldName+'</a>'+"</td>"
                        +"<td><a style='cursor: pointer' onclick='delYdtpFile("+JSON.stringify(data)+",this)'>删除</a></td>"
                        +"</tr>";
                    fjxxShow.append(tr);
                }
            }
        });

        window.delYdtpFile = function(filejson,obj) {
            var json1={};
            json1.ASD=jsonASD;
            json1.filejson = filejson;
            getAjax({url:delFileUrl,data:JSON.stringify(json1),callback:function (reg) {
                    if(reg.resultCode=="200" || reg.resultCode=="404"){
                        for (var i=0;i<ydtpFile.length;i++){
                            if (JSON.stringify(ydtpFile[i]) == JSON.stringify(filejson)) {
                                delete ydtpFile[i];
                                var $trNode = $(obj).parent().parent();
                                $trNode.remove();
                            }
                        }
                        if (ydtpFile==""||ydtpFile==null||ydtpFile==undefined){
                            ydtpFile=[];
                        }
                        var bbwhid = $("#hiddenId").val();
                        if(bbwhid != ''){
                            var json1 ={};
                            jsonASD.code=editCode;
                            json1.ASD=jsonASD;
                            json1.tableName=tableName;

                            var jsonWhere={};//修改条件
                            jsonWhere.ID=bbwhid;
                            json1.where=jsonWhere;
                            var jsonFild={};
                            jsonFild.ATT4  = ydtpFile;
                            json1.fild=jsonFild;
                            getAjax({url:updateUrl,data:JSON.stringify(json1),callback:function (reg) {
                                    if(reg.resultCode=="200"){
                                        layer.msg("删除成功！", {offset: '200px'});
                                    }else{
                                        layer.msg(reg.resultMsg, {offset: '200px'});
                                    }
                                }
                            });
                        }else{
                            layer.msg("删除成功！", {offset: '200px'});
                        }
                        fjNum--;
                    }else {
                        layer.msg("删除失败！", {offset: '200px'});
                    }
                }
            });
        }

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
                    $("#FJ").attr("href","");
                    $("#FJ").text("");
                    $("#EWM").attr("href","");
                    $("#EWM").text("");
                    fj.reload();
                    ewm.reload();
                    break;
                case 'reset':
                    $("#bbName").val("");
                    $("#bbFbzt").val("");
                    $("#bbShzt").val("");
                    delete json.where.ATT1;
                    delete json.where.FBZT;
                    delete json.where.SHZT;
                    creatTable();
                    form.render();
                    break;
                case 'findOnCondition':
                    if($("#bbName").val()!=""){
                        json.where.ATT1=$("#bbName").val();
                    }else{
                        delete json.where.ATT1;
                    }
                    if($("#bbFbzt").val()!=""){
                        json.where.FBZT=$("#bbFbzt").val();
                    }else{
                        delete json.where.FBZT;
                    }
                    if($("#bbShzt").val()!=""){
                        json.where.SHZT=$("#bbShzt").val();
                    }else{
                        delete json.where.SHZT;
                    }
                    table.init('conTable', Table);
                    $("#bbName").val("");
                    $("#bbFbzt").val("");
                    $("#bbShzt").val("");
                    form.render();
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'PTGL_BBGL_BBWH_DEL'){
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
            }else if (obj.event === 'PTGL_BBGL_BBWH_EDIT') {
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                fjChoose=false;
                ewmChoose=false;
                fj.reload();
                ewm.reload();
                ydtp.reload();

                var data = obj.data.FJ;
                if (data!=null&&data!=""&&data!=undefined){
                    $("#FJ").attr("href",dowloadFileUrl+"?filejson="+encodeURI(data));
                    var oldName = JSON.parse(data).oldName;
                    $("#FJ").text(oldName);
                    $("#FJ").attr("data-toggle", data);
                    $("#fjDel").attr("data-toggle", data);
                }
                data = obj.data.EWM;
                if (data!=null&&data!=""&&data!=undefined) {
                    $("#EWM").attr("href", dowloadFileUrl + "?filejson=" + encodeURI(data));
                    var oldName = JSON.parse(data).oldName;
                    $("#EWM").text(oldName);
                    $("#EWM").attr("data-toggle", data);
                    $("#ewmDel").attr("data-toggle", data);
                }
                data=obj.data.ATT4;
                if (data !== null && data !== undefined && data !== '') {
                    data = JSON.parse(data);
                    ydtpFile = data;
                    for (var i=0;i<data.length;i++){
                        var data2 = data[i];
                        var tr="<tr>"
                            +"<td>"+'<a href="'+ dowloadFileUrl+"?filejson="+encodeURI(JSON.stringify(data2))+'">'+data2.oldName+'</a>'+"</td>"
                            +"<td><a style='cursor: pointer' onclick='delYdtpFile("+JSON.stringify(data2)+",this)'>删除</a></td>"
                            +"</tr>";
                        fjxxShow.append(tr);
                    }
                }
                form.render();
                form.val('form', {
                    "ATT1":obj.data.ATT1,
                    "NAME":obj.data.NAME,
                    "SHR":obj.data.SHR,
                    "CY":obj.data.CY
                    // "FJ":obj.data.FJ,
                    // "EWM":obj.data.EWM,
                    // "FBNR":obj.data.FBNR1,
                });
                setTimeout(function () {
                    ue.setContent(obj.data.FBNR1);
                },500);
            } else if (obj.event === 'PTGL_BBGL_BBWH_SH') {
                loadDetailForm();
                $("#detailHiddenId").val(obj.data.ID);
                var data = obj.data.FJ;
                if (data!=null&&data!=""&&data!=undefined){
                    $("#shFj").attr("href",dowloadFileUrl+"?filejson="+encodeURI(data));
                    var oldName = JSON.parse(data).oldName;
                    $("#shFj").text(oldName);
                }
                var ewm2 = obj.data.EWM;
                if (ewm2!=null && ewm2!="" && ewm2!=undefined){
                    $("#shEwm").attr("href",dowloadFileUrl+"?filejson="+encodeURI(ewm2));
                    var oldName = JSON.parse(ewm2).oldName;
                    $("#shEwm").text(oldName);
                    $("#ewmTp").attr("src","bbwh/"+JSON.parse(obj.data.EWM).newName);
                }
                // $("#shFj").attr("filePath",JSON.parse(obj.data.FJ).filePath);
                // $("#shFj").attr("href",bbwhFjDowloadFileUrl+"?bbid="+obj.data.ID+"&org_id="+belong_org_id);
                // $("#shFj").text(JSON.parse(obj.data.FJ).fileName);
                // $("#shEwm").attr("filePath",JSON.parse(obj.data.EWM).filePath);
                // $("#shEwm").text(JSON.parse(obj.data.EWM).newName);
                //
                // $("#shEwm").attr("href",bbwhEwmDowloadFileUrl+"?bbid="+obj.data.ID+"&org_id="+belong_org_id);

                form.val('form', {
                    "ATT1":bblx[obj.data.ATT1],
                    "NAME":obj.data.NAME,
                    "SHR":userInfo[obj.data.SHR],
                    "CY":obj.data.CY
                    // "FJ":obj.data.FJ,
                    // "EWM":obj.data.EWM,
                    // "FBNR":obj.data.FBNR1,
                });
                $("#FBNR2").html(obj.data.FBNR1);
            } else if (obj.event === 'PTGL_BBGL_BBWH_FB'){
                layer.confirm('你确定发布该数据吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index) {
                    var json1 ={};
                    jsonASD.code=fbCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.RBR=user_id;
                    jsonFild.dateFBSJ='sysdate';
                    jsonFild.FBZT='2';
                    json1.fild=jsonFild;
                    getAjax({url:updateUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                creatTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            } else if (obj.event === 'PTGL_BBGL_BBWH_ZZSZ') {
                loadZzszForm();
                BBID=obj.data.ID;
                selY();
                selW();
            }
        });

        //查询已分
        var Yjson={};
        var ytj={};
        Yjson.tj=ytj;
        Yjson.ASD = jsonASD;
        function selY(){
            Yjson.bbid=BBID;
            layui.table.render({
                elem: '#yTable'
                ,id:'IDY'
                ,height: 450
                ,url: selYUrl //数据接口
                ,contentType:'application/json'
                ,page: false //开启分页
                ,method:'post' //接口http请求类型，默认：get
                ,where:Yjson //接口的其它参数
                ,toolbar :'#toolbar1'
                ,defaultToolbar:[]
                ,cols: [[ //表头
                    {type:'checkbox'}
                    ,{field: 'ORG_NAME', title: '组织名称', sort: false}
                ]]
            });
        }

        table.on('toolbar(yTable)', function(obj){
            switch(obj.event){
                case 'chaxun1':
                    if($("#zzmc1").val()!=""){
                        ytj.ORG_NAME=$("#zzmc1").val();
                    }else{
                        delete ytj.ORG_NAME;
                    }
                    selY();
                    $("#zzmc1").val(ytj.ORG_NAME);
                    break;
                case 'reset1':
                    delete ytj.ORG_NAME;
                    selY();
                    $("#zzmc1").val()
                    break;
                case 'del':
                    delForY();
                    break;
            };
        });

        function delForY(){
            var checkStatus = layui.table.checkStatus('IDY');
            var ids = [];
            $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
                ids.push(o.ORG_ID);
            });
            if (ids.length < 1) {
                layer.msg('请选择！');
                return false;
            }else{
                ids = ids.join(",");
                var json = {};
                json.bbid = BBID;
                json.ids = ids;
                json.ASD=jsonASD;
                getAjax({url:delBbwhZzgxUrl,data:JSON.stringify(json),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            selY();
                            selW();
                            layer.msg("操作成功！", {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                return false;
            }
        }

        //查询未分
        var Wjson={};
        var wtj={};
        Wjson.tj=wtj;
        Wjson.ASD = jsonASD;
        function selW(){
            Wjson.bbid=BBID;
            layui.table.render({
                elem: '#wTable'
                ,id:'IDW'
                ,height: 450
                ,url: selWUrl //数据接口
                ,contentType:'application/json'
                ,page: false //开启分页
                ,method:'post' //接口http请求类型，默认：get
                ,where:Wjson //接口的其它参数
                ,toolbar :'#toolbar2'
                ,defaultToolbar:[]
                ,cols: [[ //表头
                    {type:'checkbox'}
                    ,{field: 'ORG_NAME', title: '组织名称', sort: false}
                ]]
            });
        }

        table.on('toolbar(wTable)', function(obj){
            switch(obj.event){
                case 'chaxun2':
                    if($("#zzmc2").val()!=""){
                        wtj.ORG_NAME=$("#zzmc2").val();
                    }else{
                        delete wtj.ORG_NAME;
                    }
                    selW();
                    $("#zzmc2").val(wtj.ORG_NAME);
                    break;
                case 'reset2':
                    delete wtj.ORG_NAME;
                    selW();
                    $("#zzmc2").val()
                    break;
                case 'add':
                    addToY();
                    break;
            };
        });

        function addToY(){
            var checkStatus = layui.table.checkStatus('IDW');
            var ids = [];
            $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
                ids.push(o.ORG_ID);
            });
            if (ids.length < 1) {
                layer.msg('请选择！');
                return false;
            }else{
                ids = ids.join(",");
                var json = {};
                json.bbid = BBID;
                json.ids = ids;
                json.ASD=jsonASD;
                getAjax({url:addBbwhZzgxUrl,data:JSON.stringify(json),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            selY();
                            selW();
                            layer.msg("操作成功！", {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                return false;
            }
        }

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
            var txt = ue.getContentTxt();
            if(txt.length > 1000){
                layer.msg('发布内容字数过多，超过最大限制！', {offset: '200px'});
                return false;
            }
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=addCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id,special+序列名字
                var jsonInsert = data.field;  //通过name值获取数据
                delete jsonInsert.file;
                jsonInsert.RBR=user_id;
                jsonInsert.FBZT='1';
                jsonInsert.SHZT='1';
                jsonInsert.FJ=$("#FJ").attr("data-toggle");
                jsonInsert.EWM=$("#EWM").attr("data-toggle");
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=editCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                delete jsonFild.file;
                jsonFild.FJ=$("#FJ").attr("data-toggle");
                jsonFild.EWM=$("#EWM").attr("data-toggle");
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



    function getBblx(){
        var bblxJson={};
        var json={};
        json.ASD=jsonASD;
        getAjax({url:getBblxUrl,data:JSON.stringify(json),callback:function (reg) {
            var list = reg.resultData;
                for (var i=0;i<list.length;i++){
                    bblxJson[list[i].id]=list[i].name+"("+list[i].ywmc+")";
                }
            }
        });
        return bblxJson;
    }


    function getUserInfo() {
        var userInfo={};
        var json={};
        json.ASD=jsonASD;
        json.org_id = belong_org_id;
        getAjax({url:bbGetUserInfoUrl,data:JSON.stringify(json),callback:function (reg) {
            var list = reg.resultData;
                for (var i=0;i<list.length;i++){
                    userInfo[list[i].id]=list[i].name;
                }
            }
        });
        return userInfo;
    }
});

function delFile(obj) {
    var filejson = $(obj).attr("data-toggle");
    // filejson = JSON.parse(filejson);
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
