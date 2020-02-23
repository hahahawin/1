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
        json.fildName="ID,CODE,MC,HT,WT,BL,ZT,ZP_SIZE,ZT_MNUM";

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
            where:json, //接口的其它参数
            done:function(){
                $("#CODE").html(getDataSelectHtml('XCDM','1',json.where.CODE,'请选择宣传代码'));
                form.render();
            },
            cols: [[ //表头
                {field: 'MC', title: '名称',   sort: false}
                , {field: 'CODE', title: '代码',  sort: false}
                , {field: 'WT',width:100, title: '宽度(px)',  sort: false}
                , {field: 'HT',width:100, title: '高度(px)', sort: false}
                , {field: 'BL',width:100, title: '宽高比例', sort: false}
                , {field: 'ZT',width:100, title: '是否启用',  sort: false,width:100,templet:function (obj) {
                        return getDataText("TYQY_ZT",obj.ZT);
                    }}
                , {field: 'ZP_SIZE',width:100, title: '单张大小(kb)', sort: false}
                , {field: 'ZT_MNUM',width:100, title: '图片张数', sort: false}
                , {title:'操作',width:200,hide : (isadmin == 1), templet:function (obj) {//toolbar:'#barConfig'
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
            $("#hiddenXNS").val("");
            status="";
            layer.open({
                type:1,//类型
                area:['700px','270'],//定义宽和高
                title:'宣传位管理',//题目
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
            // getOrgAdd();
        };
        //头工具栏事件
        table.on('toolbar(conTable)', function(obj){
            switch(obj.event){
                case 'add':
                    loadForm();
                    // getOrgAdd();
                    // $("#ORG_ID").removeAttr("disabled");
                    break;
                case 'reset':
                    $("#ggw_code").val("");
                    $("#ggw_mc").val("");
                    delete json.wherelike.MC;
                    delete json.wherelike.CODE;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#ggw_mc").val()!=""){
                        json.wherelike.MC=$.trim($("#ggw_mc").val());
                    }else{
                        delete json.wherelike.MC;
                    }
                    if($("#ggw_code").val()!=""){
                        json.wherelike.CODE=$.trim($("#ggw_code").val());
                    }else{
                        delete json.wherelike.CODE;
                    }
                    table.init('conTable', Table);
                    $("#ggw_mc").val(json.wherelike.MC);
                    $("#ggw_code").val(json.wherelike.CODE);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'PTGL_XCGL_XCW_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonDelete={};
                    jsonDelete.ID=obj.data.ID;
                    json1.delete=jsonDelete;
                    getAjax({url:deleteUrl,data:JSON.stringify(json1),callback:function (reg) {
                        layer.closeAll('loading');
                        if(reg.resultCode=="200"){
                            layer.msg("操作成功！", {offset: '200px'});
                            obj.del();
                            layer.close(index);
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            } else if(obj.event === 'PTGL_XCGL_XCW_EDIT'){
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                form.val('form', {
                    "MC":obj.data.MC,
                    "CODE":obj.data.CODE,
                    "WT":obj.data.WT,
                    "HT":obj.data.HT,
                    "ZP_SIZE":obj.data.ZP_SIZE,
                    // "ZT":obj.data.ZT,
                    "ZT_MNUM":obj.data.ZT_MNUM
                })
                form.render();
            } else if(obj.event === 'stop'){
                layer.confirm('你确定要停用该宣传位吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
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
                        layer.closeAll('loading');
                        if(reg.resultCode=="200"){
                            layer.msg("操作成功！", {offset: '200px'});
                            creatTable();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            } else if(obj.event === 'enable'){
                layer.confirm('你确定要启用该宣传位吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
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
                        layer.closeAll('loading');
                        if(reg.resultCode=="200"){
                            layer.msg("操作成功！", {offset: '200px'});
                            creatTable();
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }});
                });
            }
        });

        //系统参数 表单提交
        form.on('submit(formSubmit)', function (data) {
            layer.load();
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            var field = data.field;  //通过name值获取数据
            var bl = (field.WT/field.HT).toFixed(2);
            field.BL = Math.round(bl*100);
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id,special+序列名字
                field.ZT='2';
                json.insert=field;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                json.fild=field;
                url= updateUrl;
            }
            getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
                layer.closeAll('loading');
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
            code: function(value,item){
                if(!new RegExp("^[A-Za-z0-9_]+$").test(value)){
                    return '宣传位代码只能是字母数字下划线';
                }
                if(/(^\_)|(\__)|(\_+$)/.test(value)){
                    return '宣传位代码首尾不能出现下划线\'_\'';
                }
                if(/^\d+\d+\d$/.test(value)){
                    return '宣传位代码不能全为数字';
                }
            },
            unique: function (value,item) {//唯一性验证
                layer.load();
                var checkResult="1";
                var param={
                    tableName:tableName,
                    key:item.name,
                    value:value,
                    id:$("#hiddenId").val(),
                    ASD:jsonASD
                }
                getAjax({url:uniqueUrl,data:JSON.stringify(param),callback:function (reg) {
                        layer.closeAll('loading');
                        if(reg.status!="200"){
                            checkResult = "2";
                        }
                    }});
                if (checkResult=="2"){
                    return "["+item.title+"] 为 '"+value+"' 的已存在！";
                }
            },
            positiveInteger:function (value,item) {
                var msg = '' ;
                if(!new RegExp("^[1-9]\\d*$").test(value)){
                    if(item!=null && item.title!=null && item.title != '' && item.title != undefined)
                        msg = "["+item.title+"] 必须是正整数";
                    else
                        msg = "必须是正整数" ;
                }
                return msg ;
            }
        });

        creatTable();//表格初始化，一定放在初始化方法之后

    });

    // function getOrgAdd(){
    //     $.ajax({
    //         type:"POST",
    //         url:loadOrgAddUrl,
    //         async:false,
    //         dataType:"json", //服务器返回数据的类型
    //         contentType: 'application/json',
    //         success:function(reg){
    //             if (reg.resultCode=="200"){
    //                 var list = reg.resultData;
    //                 $("#ORG_ID").empty();
    //                 $("#ORG_ID").append("<option value=''>请选择所属组织</option>");
    //                 for (var i=0;i<list.length;i++){
    //                     $("#ORG_ID").append("<option value='"+list[i].ID+"'>"+list[i].MC+"</option>");
    //                 }
    //             }
    //         }
    //     });
    // }

    // function getOrgUpd(){
    //     $.ajax({
    //         type:"POST",
    //         url:loadOrgUpdUrl,
    //         async:false,
    //         dataType:"json", //服务器返回数据的类型
    //         contentType: 'application/json',
    //         success:function(reg){
    //             if (reg.resultCode=="200"){
    //                 var list = reg.resultData;
    //                 $("#ORG_ID").empty();
    //                 $("#ORG_ID").append("<option value=''>请选择所属组织</option>");
    //                 for (var i=0;i<list.length;i++){
    //                     $("#ORG_ID").append("<option value='"+list[i].ID+"'>"+list[i].MC+"</option>");
    //                 }
    //             }
    //         }
    //     });
    // }
});

