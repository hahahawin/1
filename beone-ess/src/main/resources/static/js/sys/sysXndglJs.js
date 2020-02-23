/*
倪杨
2019-08-20
学年度管理js
*/

$(function () {

    layui.use(['table','form','laydate'], function() {
        var table=layui.table,
            laydate =layui.laydate,
            form=layui.form;

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        json.fildName="ID,DM,MC,KSSJ,JSSJ,SFDQXND,SFJS,EDIT_ID,EDIT_NAME,EDIT_TIME,ZT";

        var jsonWhere={};
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;
        var jsonOther = {};
        jsonOther.order = {"KSSJ": "desc"};
        json.other = jsonOther;
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
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'DM', title: '学年度代码',  sort: false}
                , {field: 'MC', title: '学年度名称',  sort: false,width:150}
                , {field: 'KSSJ', title: '开始时间',  sort: false,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.KSSJ);
                    }}
                , {field: 'JSSJ', title: '结束时间',  sort: false,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.JSSJ);
                    }}
                , {field: 'SFDQXND', title: '当前学年度',  sort: false,templet:function (obj) {
                        return getDataText("SFBZ",obj.SFDQXND);
                    }}
                , {field: 'SFJS', title: '是否结束',  sort: false,templet:function (obj) {
                        return getDataText("SFBZ",obj.SFJS);
                    }}
                , {field: 'EDIT_NAME', title: '操作人',  sort: false}
                , {field: 'EDIT_TIME', title: '操作时间',width:180,  sort: true,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd HH:MM:SS",obj.EDIT_TIME);
                    }}
                , {title:'操作',width:200 , templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        var pd="N";
                        if (obj.ZT=='1'){
                            pd="Y";
                        }
                        var judge={};
                        judge.XTGL_JYGL_XNDGL_EDIT=pd;
                        judge.XTGL_JYGL_XNDGL_DEL=pd;
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
                area:['800px','220px'],//定义宽和高
                title:'学年度管理<span style="color: red;margin-left: 10px;">(学年度代码的格式 如2019-2020)</span>',//题目
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

        $("#DM").on("input",function(e){
       // $("#DM").bind("input propertychange",function(event){
            $("#MC").val($("#DM").val()+"年度");

            $("#kssjInput").remove();
            $("#KS").html('<input type="text" NAME="KSSJ" id="kssjInput" lay-verify="required" autocomplete="off" class="layui-input" title="开始日期">');
            laydate.render({
                elem: '#kssjInput', //指定元素
                min:$("#DM").val().split("-")[0]+"-08-01",
                max:$("#DM").val().split("-")[0]+"-10-01",
            });
            $("#jssjInput").remove();
            $("#JS").html('<input type="text" NAME="JSSJ" id="jssjInput" lay-verify="required" autocomplete="off" class="layui-input" title="结束日期">');
            laydate.render({
                elem: '#jssjInput', //指定元素3
                min:$("#DM").val().split("-")[1]+"-06-01",
                max:$("#DM").val().split("-")[1]+"-07-31",
            });
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
                    break;
                case 'reset':
                    $("#xndglMC").val("");
                    delete json.wherelike.MC;
                    table.init('conTable', Table);
                    break;
                case 'findOnCondition':
                    if($("#xndglMC").val()!=""){
                        json.wherelike.MC=$.trim($("#xndglMC").val());
                    }else{
                        delete json.wherelike.MC;
                    }
                    table.init('conTable', Table);
                    $("#xndglMC").val(json.wherelike.MC);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'XTGL_JYGL_XNDGL_DEL'){
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
            } else if(obj.event === 'XTGL_JYGL_XNDGL_EDIT'){
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);

                form.val('form', {
                    "DM":obj.data.DM,
                    "MC":obj.data.MC,
                })

                $("#kssjInput").remove();
                $("#KS").html('<input type="text" NAME="KSSJ" id="kssjInput" lay-verify="required" autocomplete="off" class="layui-input" title="开始日期">');
                laydate.render({
                    elem: '#kssjInput', //指定元素
                    min:$("#DM").val().split("-")[0]+"-08-01",
                    max:$("#DM").val().split("-")[0]+"-10-01",
                });
                $("#jssjInput").remove();
                $("#JS").html('<input type="text" NAME="JSSJ" id="jssjInput" lay-verify="required" autocomplete="off" class="layui-input" title="结束日期">');
                laydate.render({
                    elem: '#jssjInput', //指定元素3
                    min:$("#DM").val().split("-")[1]+"-06-01",
                    max:$("#DM").val().split("-")[1]+"-07-31",
                });

                form.val('form', {
                    "KSSJ":dateFormat("yyyy-mm-dd",obj.data.KSSJ),
                    "JSSJ":dateFormat("yyyy-mm-dd",obj.data.JSSJ),
                })
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
                jsonInsert.ZT='2';
                jsonInsert.SFJS='1';
                jsonInsert.SFDQXND='1';
                jsonInsert.dateKSSJ=data.field.KSSJ;
                jsonInsert.dateJSSJ=data.field.JSSJ;

                delete jsonInsert.KSSJ;
                delete jsonInsert.JSSJ;
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.ZT='2';
                jsonFild.dateKSSJ=data.field.KSSJ;
                jsonFild.dateJSSJ=data.field.JSSJ;

                delete jsonFild.KSSJ;
                delete jsonFild.JSSJ;
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
                jsonInsert.ZT='1';
                jsonInsert.SFJS='1';
                jsonInsert.SFDQXND='1';
                jsonInsert.dateKSSJ=data.field.KSSJ;
                jsonInsert.dateJSSJ=data.field.JSSJ;

                delete jsonInsert.KSSJ;
                delete jsonInsert.JSSJ;
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.ZT='1';
                jsonFild.dateKSSJ=data.field.KSSJ;
                jsonFild.dateJSSJ=data.field.JSSJ;

                delete jsonFild.KSSJ;
                delete jsonFild.JSSJ;
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
                    return "["+item.title+"] 为 '"+value+"' 的已存在！";
                }
            },
            positiveInteger:function (value,item) {
                if(!new RegExp("^[1-9]\\d*$").test(value)){
                    return "["+item.title+"] 必须是正整数";
                }
            },
            DM:function (value,item) {
                if(!new RegExp("^([2-9])\\d{3}-([2-9])\\d{3}$").test(value)){
                    return "["+item.title+"] 的格式为“2019-2020”";
                }
                var a = value.split('-');
                if ((a[1]-a[0])!=1) {
                    return "["+item.title+"] 中【-】前后年份应只相差1年";
                }
            }
        });

        creatTable();//表格初始化，一定放在初始化方法之后

    });

});
