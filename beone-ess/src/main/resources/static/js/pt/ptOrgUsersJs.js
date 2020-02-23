/*
  倪杨
  2019-09-17
  组织用户初始化
*/

$(function () {

    layui.use(['table','form','laydate'], function() {
        var table=layui.table,
            laydate = layui.laydate,
            form=layui.form;

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        json.fildName="ID,NAME,ACCOUNT,TYPE,ZT,ISADMIN,ORG_ID,ORG_NAME";
        json.isadmin='1';

        // Table:定义表格的基本数据
        var Table={
            defaultToolbar:[],
            toolbar:'#toolHead',
            height: 'full-0',
            url: selOrgUserUrl,
            method:'post', //接口http请求类型，默认：get
            contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
            page: true,
            enabledCurrCookie: true,
            limits:[10,20,30,40,50,60,70,80,90],
            limit:10,
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'NAME', title: '用户名称',   sort: false}
                , {field: 'ACCOUNT', title: '登陆账号',  sort: false}
                , {field: 'ORG_NAME', title: '所属组织', sort: false}
                , {field: 'TYPE',width:100, title: '用户类型',  sort: false,width:100,templet:function (obj) {
                        return getDataText("USER_TYPE",obj.TYPE);
                    }}
                , {field: 'ZT',width:100, title: '是否启用',  sort: false,width:100,templet:function (obj) {
                        return getDataText("TYQY_ZT",obj.ZT);
                    }}
                /*, {title:'操作', width:200,templet:function (obj) {
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        json2.TYQY="ZT";
                        return getTableBarButton(json2);
                    }}*/
            ]]
        };


        //表格初始化方法
        window.creatTable=function(){
            table.init('conTable', Table);
            // getOrgAdd();
        };
        //头工具栏事件
        table.on('toolbar(conTable)', function(obj){
            switch(obj.event){
                case 'reset':
                    $("#orgName").val("");
                    $("#orgAccess").val("");
                    $("#orgPid").val("");
                    delete json.name;
                    delete json.account;
                    delete json.org_name;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#orgName").val()!=""){
                        json.name=$.trim($("#orgName").val());
                    }else{
                        delete json.name;
                    }
                    if($("#orgAccess").val()!=""){
                        json.account=$.trim($("#orgAccess").val());
                    }else{
                        delete json.account;
                    }
                    if($("#orgPid").val()!=""){
                        json.org_name=$.trim($("#orgPid").val());
                    }else{
                        delete json.org_name;
                    }
                    table.init('conTable', Table);
                    $("#orgName").val(json.name);
                    $("#orgAccess").val(json.account);
                    $("#orgPid").val(json.org_name);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'stop'){
                layer.confirm('你确定要停用该用户吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT  = '1';
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
            } else if(obj.event === 'enable'){
                layer.confirm('你确定要启用该用户吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=tyqyCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;

                    var jsonWhere={};//修改条件
                    jsonWhere.ID=obj.data.ID;
                    json1.where=jsonWhere;
                    var jsonFild={};
                    jsonFild.ZT  = '2';
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
            } else if (obj.event === 'PTGL_ZZGL_ZZYH_CZMM'){
                layer.confirm('你确定重置该用户的密码吗？',{title:"温馨提示",icon:3}, function(index) {
                    var json = {};
                    json.ASD = jsonASD;
                    json.tableName = tableName;
                    json.ASD.code = czmmCode;
                    var jsonWhere = {};//修改条件
                    jsonWhere.ID = obj.data.ID;
                    json.where = jsonWhere;
                    var jsonFild = {};
                    jsonFild.PASSWORD =hex_md5("111111").toUpperCase();
                    json.fild = jsonFild;
                    var url = updateUrl;
                    $.ajax({
                        type: 'POST',
                        url: url,
                        dataType: "json",
                        data: JSON.stringify(json),
                        async: false,
                        contentType: "application/json",
                        success: function (reg) {
                            if (reg.resultCode == '200') {
                                status = "SUCCESS";
                                layer.msg("操作成功！", {offset: '200px'});
                            } else {
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        },
                        error: function () {
                            console.log("fucking error")
                        }
                    });
                }
            )}
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

        creatTable();//表格初始化，一定放在初始化方法之后

    });

    function getOrgAdd(){
        var json={};
        json.ASD=jsonASD;
        getAjax({url:loadOrgAddUrl,data:JSON.stringify(json),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    $("#ORG_ID").empty();
                    $("#ORG_ID").append("<option value=''>请选择所属组织</option>");
                    for (var i=0;i<list.length;i++){
                        $("#ORG_ID").append("<option value='"+list[i].ID+"'>"+list[i].MC+"</option>");
                    }
                }
            }
        });
    }
});

