/*
倪杨
2019-08-19
学段管理js
*/

$(function () {


    layui.use(['table','form'], function() {
        var table=layui.table,
            form=layui.form;

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        json.fildName="ID,MC,XNS,JC,SFKY,DM,RXNL,EDIT_ID,EDIT_NAME,EDIT_TIME,ZT";

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
                $("#XDDM").html(getDataSelectHtml('XDDM','1','','请选择学段代码'));
                $("#xdglDM").html(getDataSelectHtml('XDDM','2',json.where.DM,'请选择学段代码'));

                $("#xdglSFKY").html(getDataSelectHtml('SFBZ','1',json.where.SFKY,'请选择是否可用'));
                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'MC', title: '学段名称',  sort: false}
                , {field: 'DM', title: '代码',  sort: false,templet:function (obj) {
                        return getDataText('XDDM',obj.DM);
                    }}
                , {field: 'XNS',width:100, title: '学制',  sort: false}
                , {field: 'RXNL',width:100, title: '入学年龄',  sort: false}
                , {field: 'JC', title: '学段简称',  sort: false}
                , {field: 'SFKY',width:100, title: '是否可用',  sort: false,templet:function (obj) {
                        return getDataText('SFBZ',obj.SFKY);
                    }}
                , {field: 'EDIT_NAME',width:100, title: '操作人',  sort: false}
                , {field: 'EDIT_TIME',width:180, title: '操作时间',  sort: true,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd HH:MM:SS",obj.EDIT_TIME);
                    }}
                , {title:'操作',width:200 , templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        json2.TYQY="SFKY";
                        var pd="N";
                        if (obj.ZT=='1'){
                            pd="Y";
                        }
                        var judge={};
                        judge.XTGL_JYGL_XDGL_EDIT=pd;
                        judge.XTGL_JYGL_XDGL_DEL=pd;
                        json2.judge=judge;
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
                area:['500px','300px'],//定义宽和高
                title:'学段管理',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','存为草稿','关闭'],
                content: $('#operationPage'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    $("#formSubmit").click();
                    if(status=="SUCCESS"){
                        creatTable();
                        layer.close(index);
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                },
                btn2:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn1").attr("class","layui-layer-btn1 layui-btn-disabled");//确定按钮禁用
                    $("#formSubmit1").click();
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

        //表格初始化方法
        window.creatTable=function(){
            table.init('conTable', Table);

        };
        //头工具栏事件
        table.on('toolbar(conTable)', function(obj){
            switch(obj.event){
                case 'add':
                    loadForm();
                    break;
                case 'reset':
                    $("#xdglMC").val("");
                    $("#xdglXNS").val("");
                    $("#xdglDM").val("");
                    $("#xdglSFKY").val("");
                    layui.form.render('select');
                    delete json.wherelike.MC;
                    delete json.wherelike.XNS;
                    delete json.where.DM;
                    delete json.where.SFKY;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#xdglMC").val()!=""){
                        json.wherelike.MC=$.trim($("#xdglMC").val());
                    }else{
                        delete json.wherelike.MC;
                    }
                    if($("#xdglXNS").val()!=""){
                        json.wherelike.XNS=$.trim($("#xdglXNS").val());
                    }else{
                        delete json.wherelike.XNS;
                    }
                    if($("#xdglDM").val()!=""){
                        json.where.DM=$("#xdglDM").val();
                    }else{
                        delete json.where.DM;
                    }
                    if($("#xdglSFKY").val()!=""){
                        json.where.SFKY=$("#xdglSFKY").val();
                    }else{
                        delete json.where.SFKY;
                    }
                    table.init('conTable', Table);
                    $("#xdglMC").val(json.wherelike.MC);
                    $("#xdglXNS").val(json.wherelike.XNS);
                    $("#xdglDM").val(json.where.DM);
                    $("#xdglSFKY").val(json.where.SFKY);
                    form.render();
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'XTGL_JYGL_XDGL_DEL'){
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
            } else if(obj.event === 'XTGL_JYGL_XDGL_EDIT'){
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                form.val('form', {
                    "DM":obj.data.DM,
                    "MC":obj.data.MC,
                    "SFKY":obj.data.SFKY,
                    "JC":obj.data.JC,
                    "RXNL":obj.data.RXNL,
                    "XNS":obj.data.XNS,
                })
            }else if(obj.event === 'stop'){
                layer.confirm('你确定要停用该记录吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.SFKY  = '1';
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
            }else if(obj.event === 'enable'){
                layer.confirm('你确定要启用该记录吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.SFKY  = '2';
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
                jsonInsert.SFKY='2';
                jsonInsert.ZT='2';
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
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

        //系统参数 表单提交
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
                jsonInsert.SFKY='2';
                jsonInsert.ZT='1';
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.ZT='1';
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
                    if ($('#'+item.id).is('select')) {
                        value=$('#'+item.id).find("option:selected").text();
                    }
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
                var sta = false;
                if(right[i].ATTR_1==undefined||right[i].ATTR_1==""||right[i].ATTR_1==null){
                    sta=true;
                }else {
                    var attr1=right[i].ATTR_1;
                    if (attr1.indexOf("2")>-1&&isadmin=='2'){
                        sta=true;
                    }
                    if (attr1.indexOf("1")>-1&&rowData.CREA_ID==user_id){
                        sta=true;
                    }
                }
                if (reg.TYQY!=null&&reg.TYQY!=""&&reg.TYQY!=undefined) {
                    var a = reg.TYQY;
                    if (right[i].RIGHT_CODE.endWith("_TYQY")){
                        if (sta){
                            if (rowData[a]=='1'){
                                html+='<a href="javascript:void(0)" title="启用" lay-event="'+"enable" +'"><img src="img/icon/cz_icon_start.png"></a>';
                            }else{
                                html+='<a href="javascript:void(0)" title="停用" lay-event="'+"stop" +'"><img src="img/icon/cz_icon_stop.png"></a>';
                            }
                        } else{
                            if (rowData[a]=='1'){
                                html+='<a href="javascript:void(0)" title="启用" lay-event="'+"unavailable" +'"><img src="img/icon/cz_icon_start.png"></a>';
                            }else{
                                html+='<a href="javascript:void(0)" title="停用" lay-event="'+"unavailable" +'"><img src="img/icon/cz_icon_stop.png"></a>';
                            }
                        }

                        continue;
                    }
                }

                if (right[i].RIGHT_CODE.endWith("_EDIT")){
                    if (sta){
                        if (rowData.ZT=='1'){
                            html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+right[i].RIGHT_CODE +'"><img src="img/menu/menu4/blue/'+right[i].RIGHT_ICON+'"></a>';
                        }else {
                            html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
                        }
                    }else {
                        html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
                    }
                    continue;
                }

                if (right[i].RIGHT_CODE.endWith("_DEL")){
                    if (sta){
                        if (rowData.ZT=='1'){
                            html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+right[i].RIGHT_CODE +'"><img src="img/menu/menu4/blue/'+right[i].RIGHT_ICON+'"></a>';
                        }else {
                            html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
                        }
                    }else {
                        html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
                    }
                    continue;
                }

                html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+right[i].RIGHT_CODE +'"><img src="img/menu/menu4/blue/'+right[i].RIGHT_ICON+'"></a>';
            }else{
                if (right[i].RIGHT_CODE.endWith("_ADD")||right[i].RIGHT_CODE.endWith("_CX")){
                    continue;
                }
                if (reg.TYQY!=null&&reg.TYQY!=""&&reg.TYQY!=undefined) {
                    var a = reg.TYQY;
                    if (right[i].RIGHT_CODE.endWith("_TYQY")){
                        if (rowData[a]=='1'){
                            html+='<a href="javascript:void(0)" title="启用" lay-event="'+"unavailable" +'"><img src="img/icon/cz_icon_start.png"></a>';
                        }else{
                            html+='<a href="javascript:void(0)" title="停用" lay-event="'+"unavailable" +'"><img src="img/icon/cz_icon_stop.png"></a>';
                        }
                        continue;
                    }
                }

                html+='<a href="javascript:void(0)"  title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
            }
        }
        html+='</div>';
        return html;
    }


});
