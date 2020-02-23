/*
倪杨
2019-08-21
学期管理js
*/

$(function () {

    var xd={};//全部学段
    var xq={};//全部学期
    var upXq={};//秋季学期

    getXq();
    getXd();
    getUpdXq();

    layui.use(['table','form','laydate'], function() {
        var table=layui.table,
            laydate = layui.laydate,
            form=layui.form;


        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        json.fildName="ID,XDID,XQID,MC,BYNF,SFJS,EDIT_ID,EDIT_NAME,EDIT_TIME,ZT";

        var jsonWhere={};
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;
        var jsonOther={};
        jsonOther.order={"BYNF":"desc"};
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

                $("#jbglXdid").empty();
                $("#XDID").empty();
                $("#jbglXqid").empty();
                $("#XQID").empty();

                $("#jbglXdid").append("<option value=''>请选择学段</option>");
                $("#XDID").append("<option value=''>请选择学段</option>");
                $("#jbglXqid").append("<option  value=''>请选择学期</option>");
                $("#XQID").append("<option value=''>请选择学期</option>");

                for(var i in xd){
                    if (i==json.where.XDID) {
                        $("#jbglXdid").append("<option selected value='"+i+"'>"+JSON.parse(xd[i]).mc+"</option>");
                    }else{
                        $("#jbglXdid").append("<option value='"+i+"'>"+JSON.parse(xd[i]).mc+"</option>");
                    }

                    if (JSON.parse(xd[i]).sfky=='2'){
                        $("#XDID").append("<option XNS='"+JSON.parse(xd[i]).xns+"' value='"+i+"'>"+JSON.parse(xd[i]).mc+"</option>");
                    }
                }
                for(var i in xq){
                    if (i == json.where.XQID) {
                        $("#jbglXqid").append("<option selected value='"+i+"'>"+xq[i]+"</option>");
                    }else{
                        $("#jbglXqid").append("<option value='"+i+"'>"+xq[i]+"</option>");
                    }
                }

                for(var i in upXq){
                    $("#XQID").append("<option value='"+i+"'>"+upXq[i]+"</option>");
                }

                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'MC', title: '届别名称',   sort: false}
                , {field: 'XDID', title: '学段',  sort: false,templet:function (obj) {
                        return JSON.parse(xd[obj.XDID]).mc;
                    }}
                , {field: 'XQID', title: '入学学期', sort: false,templet:function (obj) {
                        return xq[obj.XQID];
                    }}
                , {field: 'BYNF',width:100, title: '毕业年份',  sort: false,width:100}
                , {field: 'SFJS',width:100, title: '是否结束',  sort: false,width:100,templet:function (obj) {
                        return getDataText("SFBZ",obj.SFJS);
                    }}
                , {field: 'EDIT_NAME', title: '操作人',width:100,  sort: false}
                , {field: 'EDIT_TIME', title: '操作时间',width:180,  sort: false,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd HH:MM:SS",obj.EDIT_TIME);
                    }}
                , {title:'操作',width:200,templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        var pd="N";
                        if (obj.ZT=='1'){
                            pd="Y";
                        }
                        var judge={};
                        judge.XTGL_JYGL_JBGL_EDIT=pd;
                        judge.XTGL_JYGL_JBGL_DEL=pd;
                        json2.judge=judge;
                        return judgeButtonRights(json2);
                    }}
            ]]
        };

        //打开添加修改页面
        window.loadForm =function () {
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            $("#hiddenXNS").val("");
            status="";
            layer.open({
                type:1,//类型
                area:['850px','210px'],//定义宽和高
                title:'届别管理',//题目
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


        laydate.render({
            elem: '#kssjInput', //指定元素
        });
        laydate.render({
            elem: '#jssjInput' //指定元素
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
                    $("#jbglXdid").val("");
                    $("#jbglXqid").val("");
                    $("#jbglMC").val("");
                    $("#jbglBynf").val("");
                    form.render('select');
                    delete json.where.XDID;
                    delete json.where.XQID;
                    delete json.wherelike.MC;
                    delete json.wherelike.BYNF;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#jbglXdid").val()!=""){
                        json.where.XDID=$("#jbglXdid").val();
                    }else{
                        delete json.where.XDID;
                    }
                    if($("#jbglXqid").val()!=""){
                        json.where.XQID=$("#jbglXqid").val();
                    }else{
                        delete json.where.XQID;
                    }
                    if($("#jbglMC").val()!=""){
                        json.wherelike.MC=$.trim($("#jbglMC").val());
                    }else{
                        delete json.wherelike.MC;
                    }
                    if($("#jbglBynf").val()!=""){
                        json.wherelike.BYNF=$.trim($("#jbglBynf").val());
                    }else{
                        delete json.wherelike.BYNF;
                    }
                    table.init('conTable', Table);
                    $("#jbglXdid").val(json.where.XDID);
                    $("#jbglXqid").val(json.where.XQID);
                    $("#jbglMC").val(json.wherelike.MC);
                    $("#jbglBynf").val(json.wherelike.BYNF);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'XTGL_JYGL_JBGL_DEL'){
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
            } else if(obj.event === 'XTGL_JYGL_JBGL_EDIT'){

                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                $("#hiddenXNS").val(obj.data.XNS);
                form.val('form', {
                    "XDID":obj.data.XDID,
                    "XQID":obj.data.XQID,
                    "MC":obj.data.MC,
                    "BYNF":obj.data.BYNF,
                    "SFJS":obj.data.SFJS,
                })

            }
        });

        form.on('select(XDID)', function(data){

            var XNS = $(data.elem).find("option:selected").attr("XNS");
            if (data.value!=""){
                $("#hiddenXNS").val(XNS);
            }

            if ($("#XQID").val()==undefined||$("#XQID").val()==""||$("#XQID").val()==null
                ||$("#XDID").val()==""||$("#XDID").val()==undefined||$("#XDID").val()==null){
                $("input[name='MC']").val("");
                $("input[name='BYNF']").val("");
                return false;
            }


            var xqmc = $("#XQID option:selected").text();//获取文本

            if (xqmc!="请选择"){
                var a=xqmc.split("-");
                var xdmc = $("#XDID option:selected").text();//获取文本
                if (xdmc!="请选择"){
                    var num=Number(a[0])+Number($("#hiddenXNS").val());
                    $("input[name='MC']").val(xdmc+num+"届");
                    $("input[name='BYNF']").val(num);
                }else{
                    $("input[name='MC']").val("");
                    $("input[name='BYNF']").val("");
                }
            }else{
                $("input[name='MC']").val("");
                $("input[name='BYNF']").val("");
            }

        });
        form.on('select(XQID)', function(data){

            if ($("#XQID").val()==undefined||$("#XQID").val()==""||$("#XQID").val()==null
                ||$("#XDID").val()==""||$("#XDID").val()==undefined||$("#XDID").val()==null){
                $("input[name='MC']").val("");
                $("input[name='BYNF']").val("");
                return false;
            }
            var xqmc = $("#XQID option:selected").text();//获取文本

            if (xqmc!="请选择"){
                var a=xqmc.split("-");
                var xdmc = $("#XDID option:selected").text();//获取文本
                if (xdmc!="请选择"){
                    var num=Number(a[0])+Number($("#hiddenXNS").val());
                    $("input[name='MC']").val(xdmc+num+"届");
                    $("input[name='BYNF']").val(num);
                }else{
                    $("input[name='MC']").val("");
                    $("input[name='BYNF']").val("");
                }
            }else{
                $("input[name='MC']").val("");
                $("input[name='BYNF']").val("");
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
                jsonInsert.SFJS='1';
                jsonInsert.ZT='2';
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
                jsonInsert.SFJS='1';
                jsonInsert.ZT='1';
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
                if(!new RegExp("^[1-9]\d*$").test(value)){
                    return "["+item.title+"] 必须是正整数";
                }
            }
        });

        creatTable();//表格初始化，一定放在初始化方法之后

    });

    function getXd(){
        xd={};
        var xndJson={};
        xndJson.ASD=getJsonASD();
        xndJson.ASD.code=xndFindCode;
        xndJson.tableName=tableName2;
        xndJson.fildName="ID,MC,XNS,SFKY";
        var xndJsonOther={};
        xndJsonOther.order={"EDIT_TIME":"desc"};
        xndJson.other=xndJsonOther;
        getAjax({url:loadXNDUrl,data:JSON.stringify(xndJson),callback:function (reg) {
            if (reg.resultCode=="200"){
                var list = reg.resultData;
                for (var i=0;i<list.length;i++){
                    xd[list[i].id]=JSON.stringify(list[i]);
                }
            }
        }});
    }
    function getXq(){
        xq={};
        var xndJson={};
        xndJson.ASD=getJsonASD();
        xndJson.ASD.code=xndFindCode;
        xndJson.tableName=tableName3;
        xndJson.fildName="ID,MC";
        var xndJsonOther={};
        xndJsonOther.order={"EDIT_TIME":"desc"};
        xndJson.other=xndJsonOther;
        getAjax({url:loadXNDUrl,data:JSON.stringify(xndJson),callback:function (reg) {
            if (reg.resultCode=="200"){
                var list = reg.resultData;
                for (var i=0;i<list.length;i++){
                    xq[list[i].id]=list[i].mc;
                }
            }
        }});
    }
    function getUpdXq(){
        upXq={};
        var xndJson={};
        xndJson.ASD=getJsonASD();
        xndJson.ASD.code=xndFindCode;
        xndJson.tableName=tableName3;
        xndJson.fildName="ID,MC";
        var xndJsonWhere={};
        xndJsonWhere.XQM = '1';
        xndJson.where=xndJsonWhere;
        var xndJsonOther={};
        xndJsonOther.order={"EDIT_TIME":"desc"};
        xndJson.other=xndJsonOther;
        getAjax({url:loadXNDUrl,data:JSON.stringify(xndJson),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    for (var i=0;i<list.length;i++){
                        upXq[list[i].id]=list[i].mc;
                    }
                }
            }});
    }
});

