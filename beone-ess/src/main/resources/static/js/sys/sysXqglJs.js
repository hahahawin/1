/*
倪杨
2019-08-21
学期管理js
*/

$(function () {


    layui.use(['table','form','laydate'], function() {
        var table=layui.table,
            laydate = layui.laydate,
            form=layui.form;

        var xnd=getXnd();

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        json.fildName="ID,PID,MC,XQM,KSSJ,JSSJ,SFDQXQ,SFJS,EDIT_ID,EDIT_NAME,EDIT_TIME,ZT";

        var jsonWhere={};
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;
        var jsonOther={};
        jsonOther.order={"KSSJ":"desc"};
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
                $("#XQM").html(getDataSelectHtml('XQM','1','','请选择学期码'));
                $("#xqglXQM").html(getDataSelectHtml('XQM','1',json.where.XQM,'请选择学期码'));

                $("#xqglPID").empty();
                $("#XND").empty();
                $("#xqglPID").append("<option value=''>请选择学年度</option>");
                $("#XND").append("<option value=''>请选择学年度</option>");
                for(var i in xnd){
                    if (i==json.where.PID) {
                        $("#xqglPID").append("<option selected value='"+i+"'>"+xnd[i]+"</option>");
                    }else{
                        $("#xqglPID").append("<option value='"+i+"'>"+xnd[i]+"</option>");
                    }
                    $("#XND").append("<option value='"+i+"'>"+xnd[i]+"</option>");
                }

                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'MC', title: '学期名称',width:200,  fixed: 'left', sort: false}
                , {field: '', title: '学年度', width:150, fixed: 'left', sort: false,templet:function (obj) {
                        return xnd[obj.PID];
                    }}
                , {field: 'XQM', title: '学期码', width:100, sort: false,templet:function (obj) {
                        return getDataText("XQM",obj.XQM);
                    }}
                , {field: 'KSSJ', title: '开始时间',  sort: false,width:150,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.KSSJ);
                    }}
                , {field: 'JSSJ', title: '结束时间',  sort: false,width:150,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.JSSJ);
                    }}
                , {field: 'SFDQXQ', title: '当前学期',  sort: false,width:100,templet:function (obj) {
                        return getDataText('SFBZ',obj.SFDQXQ);
                    }}
                , {field: 'SFJS', title: '是否结束',  sort: false,width:100,templet:function (obj) {
                        return getDataText('SFBZ',obj.SFJS);
                    }}
                , {field: 'EDIT_NAME', title: '操作人',width:100,  sort: false}
                , {field: 'EDIT_TIME', title: '操作时间',width:180,  sort: false,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd HH:MM:SS",obj.EDIT_TIME);
                    }}
                , {title:'操作',width:200,fixed:'right',templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        var pd="N";
                        if (obj.ZT=='1'){
                            pd="Y";
                        }
                        var judge={};
                        judge.XTGL_JYGL_XQGL_EDIT=pd;
                        judge.XTGL_JYGL_XQGL_DEL=pd;
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
                area:['850px','250px'],//定义宽和高
                offset: '60px',
                title:'学期管理',//题目
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
                    $("#xqglPID").val("");
                    $("#xqglXQM").val("");
                    $("#xqglMC").val("");
                    form.render('select');
                    delete json.where.PID;
                    delete json.where.XQM;
                    delete json.wherelike.MC;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#xqglPID").val()!=""){
                        json.where.PID=$("#xqglPID").val();
                    }else{
                        delete json.where.PID;
                    }
                    if($("#xqglXQM").val()!=""){
                        json.where.XQM=$("#xqglXQM").val();
                    }else{
                        delete json.where.XQM;
                    }
                    if($("#xqglMC").val()!=""){
                        json.wherelike.MC=$.trim($("#xqglMC").val());
                    }else{
                        delete json.wherelike.MC;
                    }
                    table.init('conTable', Table);
                    $("#xqglPID").val(json.where.PID);
                    $("#xqglXQM").val(json.where.XQM);
                    $("#xqglMC").val(json.wherelike.MC);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'XTGL_JYGL_XQGL_DEL'){
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
            } else if(obj.event === 'XTGL_JYGL_XQGL_EDIT'){

                // document.getElementById("form").reset();
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);

                form.val('form', {
                    "PID":obj.data.PID,
                    "XQM":obj.data.XQM,
                    "MC":obj.data.MC,
                    "KSSJ":dateFormat("yyyy-mm-dd",obj.data.KSSJ),
                    "JSSJ":dateFormat("yyyy-mm-dd",obj.data.JSSJ),
                });
            }
        });

        var stime = laydate.render({
            elem: '#kssjInput', //指定元素
            type:'date'
        });

        var etime = laydate.render({
            elem: '#jssjInput', //指定元素
            type:'date'
        });

        form.on('select(XND)', function(data){
            $("#kssjInput").val('');
            $("#jssjInput").val('');
            var xnd = data.value;
            var xqm = $("#XQM").val();
            if(xnd != '' && xqm != ''){
                setDateRange();
            }
        });
        form.on('select(XQM)', function(data){
            $("#kssjInput").val('');
            $("#jssjInput").val('');
            var xqm = data.value;
            var xnd = $("#XND").val();
            if(xnd != '' && xqm != ''){
                setDateRange(xnd, xqm);
            }
        });
        window.setDateRange = function(){
            var xnd = $("#XND option:selected").text();//获取文本
            var xqm = $("#XQM option:selected").text();//获取文本
            var v = xnd+xqm;
            $("#MC").val(v);
            if(xqm=="秋季学期"){
                stime.config.min = {year:xnd.split("-")[0], month:7, date: 1};
                stime.config.max = {year:xnd.split("-")[0], month:8, date: 30};
                etime.config.min = {year:xnd.split("-")[1].split("年度")[0], month:0, date: 1};
                etime.config.max = {year:xnd.split("-")[1].split("年度")[0], month:1, date: 10};
            }else if(xqm=="春季学期"){
                stime.config.min = {year:xnd.split("-")[1].split("年度")[0], month:1, date: 11};
                stime.config.max = {year:xnd.split("-")[1].split("年度")[0], month:2, date: 31};
                etime.config.min = {year:xnd.split("-")[1].split("年度")[0], month:5, date: 1};
                etime.config.max = {year:xnd.split("-")[1].split("年度")[0], month:6, date: 31};
            }
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
                jsonInsert.SFDQXQ='1';
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
                jsonInsert.SFDQXQ='1';
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

    function getXnd() {
        var xnd={};
        var xndJson={};
        xndJson.ASD=getJsonASD();
        xndJson.ASD.code=xndFindCode;
        xndJson.tableName=tableName2;
        xndJson.fildName="ID,MC";
        var xndJsonOther={};
        xndJsonOther.order={"KSSJ":"desc"};
        xndJson.other=xndJsonOther;
        getAjax({url:loadXNDUrl,data:JSON.stringify(xndJson),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    for (var i=0;i<list.length;i++){
                        xnd[list[i].id]=list[i].mc;
                    }
                }
            }
        });
        return xnd;
    }
});
