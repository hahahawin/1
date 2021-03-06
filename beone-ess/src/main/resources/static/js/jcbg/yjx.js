
/**
 * 新闻通知
 * @Author: 倪杨
 * @Date: 2019/11/12
 */
$(function () {

    //富文本内容
    //autoHeightEnabled 设置为false不会超出设置宽度
    //maximumWords最大字数限制 注：这个不包含html元素
    var ue = UE.getEditor('NR',{autoHeightEnabled: false,maximumWords:100});//富文本编辑器
    // ue.ready(function() {
    //     ue.setHeight(100);
    //     //设置编辑器的内容
    //     // ue.setContent('hello');
    //     // //获取html内容，返回: <p>hello</p>
    //     // var html = ue.getContent();
    //     // //获取纯文本内容，返回: hello
    //     // var txt = ue.getContentTxt();
    // });
    //设置UE上传格式和路径
    UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
    UE.Editor.prototype.getActionUrl = function(action) {
        if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
            return basePath+'common/imgUpdate'; //在这里返回我们实际的上传图片地址
        } else {
            return this._bkGetActionUrl.call(this, action);
        }
    }

    layui.use(['table','form','laydate','upload','rate'], function() {
        var table=layui.table,
            laydate=layui.laydate,
            upload = layui.upload,
            rate = layui.rate,
            form=layui.form;

        var pf = rate.render({
            elem: '#test1'
            ,length: 10
            // ,theme:"	#FFB800"
            // ,value: 8 //初始值
        });

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        json.fildName="ID,YJLX,BT,NR1,ZT,CLR,UTYPE,CLFS,CLSJ,MYD,DLPF,DLPY,CREA_ID,CREA_NAME,CREA_TIME";

        var jsonWhere={};
        jsonWhere.CREA_ID=user_id;
        jsonWhere.BORG_ID=belong_org_id;
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;
        var jsonOther={};
        jsonOther.order={'ZT':'ASC','CLSJ':'ASC'};
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
                $("#YJLX").html(getDataSelectHtml('YJLX','2','','请选择意见类型'));
                $("#ggLX").html(getDataSelectHtml('YJLX','1',json.where.YJLX,'请选择意见类型'));
                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'BT', title: '标题',  sort: false}
                , {field: 'YJLX', title: '类型',  sort: false,templet:function (obj) {
                        return getDataText('YJLX',obj.YJLX);
                    }}
                // ,{field: 'NR1', title: '内容',  sort: false}
                ,{field: 'ZT', title: '状态',  sort: false,templet:function (obj) {
                        if (obj.ZT=='1'){
                            return "待处理";
                        } else if (obj.ZT=='2'){
                            return "已处理";
                        } else if (obj.ZT == '3') {
                            return "已反馈";
                        }else if (obj.ZT == '4'){
                            return "已结束";
                        }else{
                            return "";
                        }
                    }}
                , {field: 'CLR', title: '处理人',  false: true}
                , {field: 'CLSJ',width:180, title: '处理时间',  sort: false,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd HH:MM:SS",obj.CLSJ)
                    }}
                ,{field: 'DLPY', title: '领导评语',  sort: false}
                , {title:'操作',width:200 , templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        var pd="N";
                        if (obj.CREA_ID==user_id&&obj.ZT!="3"&&obj.ZT!="4") {
                            pd="Y";
                        }
                        var judge = {};
                        judge.JCBG_RCBG_YJX_EDIT = pd;
                        judge.JCBG_RCBG_YJX_DEL = pd;
                        var fkpd="N";
                        if (obj.CREA_ID==user_id&&obj.ZT=="2") {
                            fkpd="Y";
                        }
                        judge.JCBG_RCBG_YJX_FK = fkpd;
                        json2.judge=judge;
                        return judgeButtonRights(json2);
                    }}
            ]]
        };

        window.loadPf=function(){
            layer.open({
                type:1,//类型
                area:['400px','150px'],//定义宽和高
                offset: '60px',
                title:'评分',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#operationPagePf'),//打开的内容
                yes:function (index,layero) {
                    var pfValue=pf.config.value;
                    var id = $("#hiddenIdFk").val();
                    var json1 ={};
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    json1.ASD.code=updateCode;
                    var jsonWhere={};//修改条件
                    jsonWhere.ID=id;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT='3';
                    jsonFild.MYD=pfValue;
                    json1.fild=jsonFild;
                    getAjax({url:updateUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creatTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                },
                btn2:function (index,layero) {
                    layer.close(index);
                }
            });
        }

        //打开添加修改页面
        window.loadForm =function () {
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            status="";
            layer.open({
                type:1,//类型
                area:['800px','400px'],//定义宽和高
                offset: '60px',
                title:'意见箱',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
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
                    layer.close(index);
                }
            });
        };

        window.loadFkForm =function () {
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            status="";
            layer.open({
                type:1,//类型
                area:['800px','500px'],//定义宽和高
                title:'意见反馈',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['反馈','解决','关闭'],
                content: $('#operationPageFk'),//打开的内容
                yes:function (index,layero) {
                    if ($("#fkNr").val()==null||$("#fkNr").val()==""||$("#fkNr").val()==undefined){
                        layer.msg("发送内容不能为空", {offset: '200px'});
                        return false;
                    }
                    var json={};
                    json.ASD=jsonASD;
                    json.yjx_clfs=$("#fkNr").val();
                    json.yjx_clr=user_name;
                    json.yjx_id=$("#hiddenIdFk").val();
                    json.type="yh";
                    getAjax({url:insertYjjlUrl,data:JSON.stringify(json),callback:function (reg) {
                            if(reg.resultCode == '200'){
                                loadFkCon($("#hiddenIdFk").val());
                                $("#fkNr").val("");
                                document.getElementById('fkCon').scrollTop = document.getElementById('fkCon').scrollHeight;
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }});
                },
                btn2:function (index,layero) {
                    loadPf();
                    layer.close(index);
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
                    $("#ggLX").val("");
                    $("#ggBt").val("");
                    layui.form.render('select');
                    delete json.where.YJLX;
                    delete json.wherelike.BT;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#ggLX").val()!=""){
                        json.where.YJLX=$("#ggLX").val();
                    }else{
                        delete json.where.YJLX;
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
        var yjHtml = "";
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'JCBG_RCBG_YJX_DEL'){
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
            } else if(obj.event === 'JCBG_RCBG_YJX_EDIT'){
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                form.val('form', {
                    "BT":obj.data.BT,
                    "NR":obj.data.NR1,
                    "YJLX":obj.data.YJLX,
                });
                form.render();
                var ue = UE.getEditor('NR',{autoHeightEnabled: false,maximumWords:100});//富文本编辑器
                //必须设置定时 否则不会显示内容 后面找解决办法和原因
                setTimeout(function () {
                    ue.setContent(obj.data.NR1);
                },100);

            }else if(obj.event === 'JCBG_RCBG_YJX_FK'){
                $("#hiddenIdFk").val(obj.data.ID);
                $("#operationPageFk input[name='LX']").val(getDataText("YJLX",obj.data.YJLX));
                $("#operationPageFk input[name='BT']").val(obj.data.BT);
                var data = obj.data;
                yjHtml="<div style=\"padding-left: 10px;padding-bottom: 10px;padding-top: 10px;border-bottom: 1px solid #E7E7E7\">" +
                    "                        <span style='font-size: 14px;color: #929292;'>"+data.CREA_NAME+"</span>" +
                    "                        <span style='font-size: 10px;float: right;padding-right: 10px;color: #929292'>"+dateFormat('yyyy-mm-dd HH:MM:SS',data.CREA_TIME)+"</span>" +
                    "                        <div style='font-size: 16px;padding-top: 5px;'>"+data.NR1+"</div>" +
                    "                    </div>";
                loadFkCon(obj.data.ID);
                loadFkForm();
                document.getElementById('fkCon').scrollTop = document.getElementById('fkCon').scrollHeight;
            }
        });

        window.loadFkCon=function(id){
            var json = {};
            json.ASD=jsonASD;
            json.yjx_id=id;
            getAjax({url:getYjxByIdUrl,data:JSON.stringify(json),callback:function (reg) {
                console.info(reg);
                    if(reg.resultCode == '200'){
                        var html=yjHtml;
                        var list = reg.resultData;
                        list = upperListKey(list);
                        for (var i=0;i<list.length;i++){
                            var div="<div style=\"padding-left: 10px;padding-bottom: 10px;padding-top: 10px;border-bottom: 1px solid #E7E7E7\">" +
                                "                        <span style='font-size: 14px;color: #929292;'>"+list[i].YJX_CLR+"</span>" +
                                "                        <span style='font-size: 10px;float: right;padding-right: 10px;color: #929292'>"+dateFormat('yyyy-mm-dd HH:MM:SS',list[i].YJX_CLSJ)+"</span>" +
                                "                        <div style='font-size: 16px;padding-top: 5px;'>"+list[i].YJX_CLFS+"</div>" +
                                "                    </div>";
                            html+=div;
                        }
                        $("#fkCon")[0].innerHTML=html;
                        $("#fkCon")[0].scrollTop=$("#fkCon")[0].scrollHeight;
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
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
                delete jsonInsert.file;
                jsonInsert.ZT='1';
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                delete jsonFild.file;
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
                if (rowData.CREA_ID==user_id&&rowData.ZT!="3"&&rowData.ZT!="4") {
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
