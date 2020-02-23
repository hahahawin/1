
/**
 * 新闻通知
 * @Author: 倪杨
 * @Date: 2019/11/12
 */
$(function () {

    var ue = UE.getEditor('NR',{autoHeightEnabled: false,maximumWords:100});//富文本编辑器

    //设置UE上传格式和路径
    UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
    UE.Editor.prototype.getActionUrl = function(action) {
        if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
            return basePath+'common/imgUpdate'; //在这里返回我们实际的上传图片地址
        } else {
            return this._bkGetActionUrl.call(this, action);
        }
    }

    layui.use(['table','form','laydate','upload'], function() {
        var table=layui.table,
            laydate=layui.laydate,
            upload = layui.upload,
            form=layui.form;

        var nowTime = new Date().getTime();
        laydate.render({
            elem: '#SXSJ', //指定元素
            type:"datetime",
            min:nowTime
        });

        var files=new Array();
        var imgSize=0;
        var BjOrXz="XZ";

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        json.fildName="ID,BT,NR1,LX,TXFS,YWLX,YWID,GBQT,JJCD,SXSJ,XXLY,FJXX1,ZT,CREA_ID";

        var jsonWhere={};
        jsonWhere.YWLX='1';
        jsonWhere.BORG_ID=belong_org_id;
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;
        var jsonOther={};
        jsonOther.order={'CREA_TIME':'DESC'};
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
                $("#LX").html(getDataSelectHtml('XWTZGG_LX','2','','请选择类型'));
                $("#ggLX").html(getDataSelectHtml('XWTZGG_LX','1',json.where.LX,'请选择类型'));
                $("#JJCD").html(getDataSelectHtml('JJCD','2','','请选择紧急程度'));
                $("#TXFS").html(getDataSelectHtml('TXFS','2','','请选择提醒方式'));
                // $("#GBQT").html(getDataSelectHtml('GBQT_JS','2','','请选择公布群体'));
                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'BT', title: '标题',  sort: false}
                , {field: 'LX', title: '类型',  sort: false,templet:function (obj) {
                        return getDataText('XWTZGG_LX',obj.LX);
                    }}
                , {field: 'ZT', title: '类型',  sort: false,templet:function (obj) {
                        if (obj.ZT=="1"){
                            return "草稿";
                        }else  if (obj.ZT=="2"){
                            return "保存";
                        } else  if (obj.ZT=="3"){
                            return "作废";
                        } else{
                            return "";
                        }
                    }}
                // , {field: 'GBQT', title: '公布群体',  false: true,templet:function (obj) {
                //                 //         return getDataText('GBQT_JS',obj.GBQT);
                //                 //     }}
                , {field: 'XXLY',width:180, title: '信息来源',  sort: false}
                , {title:'操作',width:200 , templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        var pd="N";
                        if (obj.ZT=='1'){
                            pd="Y";
                        }
                        var judge={};
                        judge.JCBG_TZGG_XWTZ_EDIT=pd;
                        judge.JCBG_TZGG_XWTZ_DEL=pd;
                        judge.JCBG_TZGG_XWTZ_ZF=pd;
                        json2.judge=judge;
                        return judgeButtonRights(json2);
                    }}
            ]]
        };

        //打开添加修改页面
        window.loadForm =function () {
            fjNum=0;
            files=new Array();
            $("#showFjxx").html("");
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            status="";
            layer.open({
                type:1,//类型
                area:['1000','500'],//定义宽和高
                // offset: '60px',
                title:'新闻公告',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','存为草稿','关闭'],
                content: $('#operationPage'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用

                    $("#formSubmit1").click();
                    if(status=="SUCCESS"){
                        creatTable();
                        layer.close(index);
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                },
                btn2:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用

                    $("#formSubmit").click();
                    if(status=="SUCCESS"){
                        creatTable();
                        layer.close(index);
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                    return false;
                },
                btn3:function (index,layero) {
                    layer.close(index);
                }
            });
        };

        //表格初始化方法
        window.creatTable=function(){
            table.init('conTable', Table);

        };
        //头工具栏事件
        table.on('toolbar(conTable)', function(obj){
            switch(obj.event){
                case 'add':
                    loadForm();
                    BjOrXz="XZ";
                    break;
                case 'reset':
                    $("#ggLX").val("");
                    $("#ggBt").val("");
                    layui.form.render('select');
                    delete json.where.LX;
                    delete json.wherelike.BT;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#ggLX").val()!=""){
                        json.where.LX=$("#ggLX").val();
                    }else{
                        delete json.where.LX;
                    }
                    if($("#ggBt").val()!=""){
                        json.wherelike.BT=$.trim($("#ggBt").val());
                    }else{
                        delete json.where.BT;
                    }
                    table.init('conTable', Table);
                    $("#ggBt").val(json.wherelike.BT);
                    form.render();
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'JCBG_TZGG_XWTZ_DEL'){
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
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            } else if(obj.event === 'JCBG_TZGG_XWTZ_EDIT'){
                BjOrXz="BJ";
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                var select = 'dd[lay-value=' + obj.data.LX + ']';
                $('#LX').siblings("div.layui-form-select").find('dl').find(select).click();
                form.val('form', {
                    "BT":obj.data.BT,
                    // "NR":obj.data.NR1,
                    // "GBQT":obj.data.GBQT,
                    "XXLY":obj.data.XXLY,
                    "JJCD":obj.data.JJCD,
                    "SXSJ":dateFormat("yyyy-mm-dd HH:MM:SS",obj.data.SXSJ),
                    "TXFS":obj.data.TXFS,
                });
                var fj=obj.data.FJXX1;
                if (fj !== null && fj !== undefined && fj !== '') {
                    fj = JSON.parse(fj);
                    files=fj;
                    for (var i=0;i<fj.length;i++){
                        var data = fj[i];
                        var tr="<tr>"
                            +"<td>"+'<a href="'+ dowloadFileUrl+"?filejson="+encodeURI(JSON.stringify(data))+'">'+data.oldName+'</a>'+"</td>"
                            +"<td><a style='cursor: pointer' onclick='delFile("+JSON.stringify(data)+",this)'>删除</a></td>"
                            +"</tr>";
                        fjxxShow.append(tr);
                    }
                }
                var ue = UE.getEditor('NR',{autoHeightEnabled: false,maximumWords:100});//富文本编辑器
                //必须设置定时 否则不会显示内容 后面找解决办法和原因
                setTimeout(function () {
                    ue.setContent(obj.data.NR1);
                },100);

                form.render();
            }else if(obj.event === 'JCBG_TZGG_XWTZ_ZF'){
                layer.confirm('你确定要作废该新闻通知吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=zfCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT  = "3";
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
            }
        });

        table.on('rowDouble(conTable)',function (obj) {
            $("#configForm div[name]").each(function(){
                $(this).html('');
            });
            layer.open({
                type:1,//类型
                area:['1000px','500px'],//定义宽和高
                title:'公告详情',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['关闭'],
                content: $('#CONFIGDETAIL'),//打开的内容
                btn1:function (index,layero) {
                    layer.close(index);
                }
            });
            var data = obj.data;
            $("#configForm div[name='LX']").html(getDataText("XWTZGG_LX",data.LX));
            $("#configForm div[name='BT']").html(data.BT);
            // $("#configForm div[name='GBQT']").html(getDataText("GBQT_JS",data.GBQT));
            if (data.LX=='2'){
                $("#TZHiddenPart").css("display","inline");
            } else{
                $("#TZHiddenPart").css("display","none");
            }
            $("#configForm div[name='XXLY']").html(data.XXLY);
            $("#configForm div[name='JJCD']").html(getDataText("JJCD",data.JJCD));
            $("#configForm div[name='SXSJ']").html(dateFormat("yyyy-mm-dd HH:MM:SS",data.SXSJ));
            $("#configForm div[name='TXFS']").html(getDataText("TXFS",data.TXFS));
            $("#configForm div[name='NR']").html(data.NR1);
            var fj=data.FJXX1;
            if (fj !== null && fj !== undefined && fj !== '') {
                fj = JSON.parse(fj);
                files=fj;
                for (var i=0;i<fj.length;i++){
                    var data = fj[i];
                    var tr="<tr>"
                        +"<td>"+'<a href="'+ dowloadFileUrl+"?filejson="+encodeURI(JSON.stringify(data))+'">'+data.oldName+'</a>'+"</td>"
                        +"</tr>";
                    $("#configForm div[name='showFj']").append(tr);
                }
            }

        });

        form.on('select(LX)', function(data){
            data=data.value;
            if (data!=2){
                $("#jjDiv").css("display","none");
                $("#JJCD").removeAttr("lay-verify");
                $("#SXSJ").removeAttr("lay-verify");
                $("#TXFS").removeAttr("lay-verify");
            }else {
                $("#jjDiv").css("display","inline");
                $("#JJCD").val("");
                $("#SXSJ").val("");
                $("#TXFS").val("");
                $("#JJCD").attr("lay-verify","required");
                $("#SXSJ").attr("lay-verify","required");
                $("#TXFS").attr("lay-verify","required");
                form.render();
            }
        });

        var fjNum=0;
        var fjxxShow=$("#showFjxx");
        var fjxx = upload.render({
            elem: '#chooseFJXX'
            ,url: uploadFileUrl
            ,auto: false
            ,bindAction: '#uploadXMZL'
            ,accept:'file'
            ,exts:'zip|doc|docx'
            ,before:function (obj) {
                layer.msg('loading...', {
                    icon: 16,
                    shade: 0.01,
                    time: 0
                });
                this.data={'ASD':JSON.stringify(jsonASD),'filePath':'xwtz'};
            }
            , choose:function (obj) {
                obj.preview(function(index, file, result){
                    var size = file.size;
                    if (size/1024/1024>50){
                        layer.msg("文件大小不能超过50MB！当前文件"+size/1024/1024+"MB", {offset: '200px'});
                        layer.close(layer.msg());
                        return false;
                    }
                    if (fjNum>4){
                        layer.msg("不能超过5个", {offset: '200px'});
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
                    files.push(data);
                    var tr="<tr>"
                        +"<td>"+'<a href="'+ dowloadFileUrl+"?filejson="+encodeURI(JSON.stringify(data))+'">'+data.oldName+'</a>'+"</td>"
                        +"<td><a style='cursor: pointer' onclick='delFile("+JSON.stringify(data)+",this)'>删除</a></td>"
                        +"</tr>";
                    fjxxShow.append(tr);
                    var json1 ={};
                    jsonASD.code=zfCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=$("#hiddenId").val();
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.FJXX  = files;
                    json1.fild=jsonFild;
                    getAjax({url:updateUrl,data:JSON.stringify(json1),callback:function (reg) {

                        }
                    });
                }
            }
        });

        window.delFile = function(filejson,obj) {
            var json1={};
            json1.ASD=jsonASD;
            // filejson = JSON.parse(filejson);
            json1.filejson = filejson;
            getAjax({url:delFileUrl,data:JSON.stringify(json1),callback:function (reg) {
                    if(reg.resultCode=="200" || reg.resultCode=="404"){
                        for (var i=0;i<files.length;i++){
                            if (JSON.stringify(files[i]) == JSON.stringify(filejson)) {
                                delete files[i];
                                var $trNode = $(obj).parent().parent();
                                $trNode.remove();
                            }
                        }
                        if (files==""||files==null||files==undefined){
                            files=[];
                        }
                        if (BjOrXz=="BJ") {
                            var json1 ={};
                            jsonASD.code=zfCode;
                            json1.ASD=jsonASD;
                            json1.tableName=tableName;

                            var jsonWhere={};//修改条件
                            jsonWhere.ID=$("#hiddenId").val();
                            json1.where=jsonWhere;
                            var jsonFild={};
                            jsonFild.FJXX  = files;
                            json1.fild=jsonFild;
                            getAjax({url:updateUrl,data:JSON.stringify(json1),callback:function (reg) {
                                    if(reg.resultCode=="200"){
                                        layer.msg("操作成功！", {offset: '200px'});
                                    }else{
                                        layer.msg(reg.resultMsg, {offset: '200px'});
                                    }
                                }
                            });
                        }else{
                            layer.msg("操作成功！", {offset: '200px'});
                        }
                        fjNum--;
                    }else {
                        layer.msg("删除失败！", {offset: '200px'});
                    }
                }
            });
        }

        //系统参数 表单提交
        form.on('submit(formSubmit)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.timeSXSJ=data.field.SXSJ;
                delete jsonInsert.SXSJ;
                delete jsonInsert.file;
                jsonInsert.ZT='1';
                jsonInsert.YWLX='1';
                jsonInsert.GBQT = '9';
                jsonInsert.FJXX=JSON.stringify(files);
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.timeSXSJ=data.field.SXSJ;
                delete jsonFild.SXSJ;
                delete jsonFild.file;
                jsonFild.FJXX=JSON.stringify(files);
                console.log(jsonFild.FJXX);
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

        form.on('submit(formSubmit1)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.timeSXSJ=data.field.SXSJ;
                delete jsonInsert.SXSJ;
                delete jsonInsert.file;
                jsonInsert.ZT='2';
                jsonInsert.YWLX='1';
                jsonInsert.FJXX=JSON.stringify(files);
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.timeSXSJ=data.field.SXSJ;
                delete jsonFild.SXSJ;
                delete jsonFild.file;
                jsonFild.FJXX=JSON.stringify(files);
                jsonFild.ZT='2';
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
                if(!new RegExp("^[1-9]\\d*$").test(value)){
                    return "["+item.title+"] 必须是正整数";
                }
            }
        });

        creatTable();//表格初始化，一定放在初始化方法之后

    });

    function getTableBarButton1(reg) {
        var obj = reg.rowData;
        var rowData=JSON.parse(obj);
        getRigth();

        var right = JxCore.dataRight[ThirdCode];
        var html='<div class="bar">';
        for (var i=0;i<right.length;i++){
            if( right[i].COUNTS > 0){
                if (right[i].RIGHT_CODE.endWith("_ADD")||right[i].RIGHT_CODE.endWith("_CX")){
                    continue;
                }
                if (rowData.ZT==1){
                    html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+right[i].RIGHT_CODE +'"><img src="img/menu/menu4/blue/'+right[i].RIGHT_ICON+'"></a>';
                }else {
                    html+='<a href="javascript:void(0)"  title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
                }
            }else{
                if (right[i].RIGHT_CODE.endWith("_ADD")||right[i].RIGHT_CODE.endWith("_CX")){
                    continue;
                }
                html+='<a href="javascript:void(0)"  title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
            }
        }
        html+='</div>';
        return html;
    }


});
