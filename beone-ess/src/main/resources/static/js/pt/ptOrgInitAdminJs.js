/*
  倪杨
  2019-09-17
  组织用户初始化
*/

$(function () {
    var org=getOrgUpd();
    layui.use(['table','form','laydate'], function() {
        var table=layui.table,
            laydate = layui.laydate,
            form=layui.form;

        var json ={};
        jsonASD.code=ptFindCode;
        json.ASD=jsonASD;
        json.tableName=tableName;
        json.fildName="ID,NAME,ACCOUNT,TYPE,ZT,ISADMIN,ORG_ID,DLWZ,BSLX,BSPT,ORG_TYPE";
        json.isadmin='2';
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
                , {field: 'ACCOUNT', title: '登陆账号', width:150,  sort: false}
                , {field: 'ORG_NAME', title: '所属组织', sort: false,templet:function (obj) {
                        return org[obj.ORG_ID];
                    }}
                , {field: 'DLWZ', title: '平台地址',width:300,  sort: false,templet:function (obj) {
                        if (obj.BSLX=='1') {
                            if (obj.BSPT=='2'){
                                return JXSC+obj.DLWZ+"Login<br />"+JXHD+obj.DLWZ+"Login";
                            }else if (obj.BSPT=='1'){
                                return BCCA+obj.DLWZ+"Login"
                            }else if (obj.BSPT=='3'){
                                return JW+obj.DLWZ+"Login"
                            }else {
                                if(obj.DLWZ != undefined){
                                    return JXSC+obj.DLWZ+"Login<br />"+JXHD+obj.DLWZ+"Login";
                                }else{
                                    return '';
                                }
                            }
                        }else {
                            return obj.DLWZ+"Login";
                        }
                    }}
                , {field: 'BSLX',width:100, title: '部署类型',  sort: false,templet:function (obj) {
                        return getDataText("BSLX",obj.BSLX);
                    }}
                , {field: 'ZT',width:100, title: '是否启用',  sort: false,width:100,templet:function (obj) {
                        return getDataText("TYQY_ZT",obj.ZT);
                    }}
                , {title:'操作',templet:function (obj) {
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        json2.TYQY="ZT";
                        return judgeButtonRights(json2);
                    }}
            ]]
        };

        //打开添加修改页面
        window.loadForm =function () {
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            $("#hiddenUserType").val("");
            status="";
            layer.open({
                type:1,//类型
                area:['450px','300px'],//定义宽和高
                title:'组织管理员',//题目
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

        //表格初始化方法
        window.creatTable=function(){
            table.init('conTable', Table);
            getOrgAdd();
        };
        //头工具栏事件
        table.on('toolbar(conTable)', function(obj){
            switch(obj.event){
                case 'add':
                    loadForm();
                    getOrgAdd();
                    $("#ORG_ID").removeAttr("disabled");
                    break;
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
                    $("#orgName").val(json.wherelike.name);
                    $("#orgAccess").val(json.wherelike.account);
                    $("#orgPid").val(json.wherelike.org_name);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'PTGL_ZZGL_ZZXX_EDIT'){
                status="";
                loadForm();
                getOrgUpd();
                $("#ORG_ID").attr("disabled","disabled");
                $("#hiddenId").val(obj.data.ID);
                form.val('form', {
                    "ORG_ID":obj.data.ORG_ID,
                    "NAME":obj.data.NAME,
                    "ACCOUNT":obj.data.ACCOUNT,
                    "TYPE":obj.data.TYPE,
                    "ZT":obj.data.ZT,
                })
                form.render();
            } else if(obj.event === 'stop'){
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
                });
            } else if(obj.event === 'PTGL_ZZGL_ZZXX_CDSQ'){
                window.parent.openTitlePage('菜单授权','sys/sysOrgMenu&ID=103&CODE=XTGL_CDGL_CDSQ');
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
                });
            }else if(obj.event === 'PTGL_ZZGL_ZZXX_TBXF'){
                status="";
                $("#xf_org_id").val(obj.data.ORG_ID);
                layer.open({
                    type:1,//类型
                    area:['350px','200px'],//定义宽和高
                    title:'组织数据修复',//题目
                    shadeClose:false,//点击遮罩层关闭
                    btn: ['确定','关闭'],
                    content: $('#operationPage2'),//打开的内容
                    yes:function (index,layero) {
                        $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                        $("#formSubmit2").click();
                        if(status=="SUCCESS"){
                            layer.close(index);
                        }
                        $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                    },
                    btn2:function (index,layero) {
                        layer.close(index);
                    }
                });
                // layer.confirm('你确定要修复该组织的内置参数？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                //     var json1 ={};
                //     jsonASD.code=ptcsCode;
                //     json1.ASD=jsonASD;
                //     json1.tableName=tableName;
                //     var jsonWhere={};//修改条件
                //     jsonWhere.org_id=obj.data.ORG_ID;
                //     json1.where=jsonWhere;
                //     getAjax({url:ptnzcsXfUrl,data:JSON.stringify(json1),callback:function (reg) {
                //             if(reg.resultCode=="200"){
                //                 layer.msg("修复成功！", {offset: '200px'});
                //                 // creatTable();
                //             }else{
                //                 layer.msg(reg.resultMsg, {offset: '200px'});
                //             }
                //         }
                //     });
                // });
            }
        });

        //系统参数 表单提交
        form.on('submit(formSubmit2)', function (data) {
            var  check= document.getElementsByName("xf_type");
            var check_val = [];
            for(var k in check){
                if(check[k].checked){
                    check_val.push(check[k].value);
                }
            }
            if(check_val == null || check_val == ''){
                layer.msg("修复类型不能为空！", {offset: '200px'});
                return false;
            }
            var json1 ={};
            jsonASD.code=ptcsCode;
            json1.ASD=jsonASD;
            json1.tableName=tableName;
            json1.org_id=$("#xf_org_id").val();
            json1.types=check_val.join(",");
            layer.load();
            getAjax({url:ptnzcsXfUrl,data:JSON.stringify(json1),callback:function (reg) {
                    layer.closeAll('loading');
                    if(reg.resultCode=="200"){
                        layer.msg("修复成功！", {offset: '200px'});
                        status = 'SUCCESS';
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }
            });
            return false;
        });

        form.on('select(ORG_ID)', function (data) {
            var a="";
            var TYPE = $(data.elem).find("option:selected").attr("TYPE");
            if (TYPE==1) {a=5;}
            else if (TYPE==2) {a=4;}
            else if (TYPE==3) {a=3;}
            $("#hiddenUserType").val(a);
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
                json.seqKZ="special"+data.field.ORG_ID;     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id,special+序列名字
                var jsonInsert = data.field;  //通过name值获取数据

                jsonInsert.ISADMIN='2';
                jsonInsert.ZT='2';
                jsonInsert.TYPE=$("#hiddenUserType").val();
                jsonInsert.PASSWORD=hex_md5(getConfig("SYS_USER_DEFA_PASS").VALUE).toUpperCase();
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;

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
        var json = {};
        json.ASD = getJsonASD();
        json.org_zt='2';
        json.org_type='3';
        json.org_sbkt='4';
        json.noAdmin='2';
        getAjax({url:selOrgListUrl,data:JSON.stringify(json),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    $("#ORG_ID").empty();
                    $("#ORG_ID").append("<option value=''>请选择所属组织</option>");
                    for (var i=0;i<list.length;i++){
                        $("#ORG_ID").append("<option TYPE='"+list[i].type+"' value='"+list[i].id+"'>"+list[i].name+"</option>");
                    }
                }
            }
        });
    }

    function getOrgUpd(){
        var org1={};
        var json = {};
        json.ASD = getJsonASD();
        getAjax({url:loadOrgUpdUrl,data:JSON.stringify(json),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    $("#ORG_ID").empty();
                    $("#ORG_ID").append("<option value=''>请选择所属组织</option>");
                    for (var i=0;i<list.length;i++){
                        org1[list[i].id]=list[i].mc;
                        $("#ORG_ID").append("<option value='"+list[i].id+"'>"+list[i].mc+"</option>");
                    }
                }
            }
        });
        return org1;
    }
});

