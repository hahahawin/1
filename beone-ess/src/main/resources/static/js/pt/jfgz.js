
/**
 * 积分规则
 * @Author: 倪杨
 * @Date: 2019/11/12
 */

$(function () {
    layui.use(['table','form','laydate'], function() {
        var table=layui.table,
            laydate=layui.laydate,
            form=layui.form;

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        // json.fildName="ID,MC,XNS,JC,SFKY,DM,RXNL,EDIT_ID,EDIT_NAME,EDIT_TIME,ZT";

        var jsonWhere={};
        jsonWhere.CREA_ID=user_id;
        jsonWhere.BORG_ID=belong_org_id;
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;
        var jsonOther={};
        jsonOther.order={'SFBZ':'ASC'};
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
            cols: [[ //表头
                {field: 'MC', title: '规则名称',  sort: false}
                , {field: 'CODE', title: '规则编码',  sort: false}
                , {field: 'SFBZ', title: '状态',  sort: true,templet:function (obj) {
                        return getDataText('SFBZ',obj.SFBZ);
                    }}
                ,{field: 'JFGZFL', title: '积分规则类型',  sort: false,templet:function (obj) {
                        return getDataText('JFGZFL',obj.JFGZFL);
                    }}
                ,{field: 'FZFL', title: '分值类型',  sort: false,templet:function (obj) {
                        if (obj.FZFL == '1'){
                            return '固定值';
                        }else {
                            return '百分比';
                        }
                    }}
                ,{field: 'FZ', title: '分值',  sort: false}
                , {title:'操作',width:200 , templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        json2.TYQY = 'SFBZ';
                        var judge = {};
                        var pd = 'N';
                        if (obj.ZT == '1'){
                            pd = 'Y';
                        }
                        judge.PTGL_BZJF_JFGZ_EDIT = pd;
                        judge.PTGL_BZJF_JFGZ_DEL = pd;
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
                area:['80%','300px'],//定义宽和高
                offset: '60px',
                title:'积分规则',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','草稿','关闭'],
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
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    $("#formSubmit1").click();
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

        form.on('select(FZFL)', function(data) {
            var v = data.value;
            var html = '';
            if (v == '1'){
                html = '范围（1--999）';
            }else {
                html = '范围（1--100）';
            }
            $("#fzgz").html(html);
        });


            //头工具栏事件
        table.on('toolbar(conTable)', function(obj){
            switch(obj.event){
                case 'add':
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
            if(obj.event === 'PTGL_BZJF_JFGZ_DEL'){
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
            } else if(obj.event === 'PTGL_BZJF_JFGZ_EDIT'){
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                form.val('form', {
                    "MC":obj.data.MC,
                    "CODE":obj.data.CODE,
                    "JFGZFL":obj.data.JFGZFL,
                    "FZFL":obj.data.FZFL,
                    "FZ":obj.data.FZ,
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
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            var fzlx = data.field.FZFL;
            var fz = data.field.FZ;
            if (fzlx == 1 && fz>0 && fz <1000){

            }else if (fzlx == 2 && fz >0 && fz <101){

            } else {
                layer.msg("[规则分值]区间错误！", {offset: '200px'});
                return false;
            }
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.SFBZ='2';
                jsonInsert.ZT='2';
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.SFBZ = '2';
                jsonFild.ZT = '2';
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
            var fzlx = data.field.FZFL;
            var fz = data.field.FZ;
            if (fzlx == 1 && fz>0 && fz <1000){

            }else if (fzlx == 2 && fz >0 && fz <101){

            } else {
                layer.msg("[规则分值]区间错误！", {offset: '200px'});
                return false;
            }
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.SFBZ='1';
                jsonInsert.ZT='1';
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.SFBZ = '1';
                jsonFild.ZT = '1';
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
            code: function(value,item){//特殊字符
                if(!new RegExp("^[A-Za-z0-9_]+$").test(value)){
                    return '编码只能是字母数字下划线';
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
                if(!new RegExp("^[1-9]\\d*$").test(value)){
                    return "["+item.title+"] 必须是正整数";
                }
            }
        });

        creatTable();//表格初始化，一定放在初始化方法之后

    });
});
