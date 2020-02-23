/**
 * 倪杨
 * 2019-08-14
 * 系统参数js
 */

$(function () {



    layui.use(['table','form','layer'], function() {

        var table=layui.table,
            form=layui.form,
            layer=layui.layer;

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;
        json.tableName=tableName;
        json.fildName="ID,NAME,TYPE,KEY,VALUE,ZT";
// json.fildName=['CONFIG_ID','CONFIG_NAME','CONFIG_KEY','CONFIG_VALUE','CONFIG_TYPE'];

        var jsonWhere={};
        json.where=jsonWhere;
        var wherelike={};
        json.wherelike=wherelike;
        var configTable={
            defaultToolbar:[],
            toolbar:'#toolbarConfig',
            height: 'full-5',
            url: loadConfigUrl,
            method:'post', //接口http请求类型，默认：get
            contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
            page: true,
            enabledCurrCookie: true,
            limits:[10,20,30,40,50,60,70,80,90],
            limit:10,
            done:function(){
                $("#configType").html(getDataSelectHtml('CONG_LX','1',json.where.TYPE,'请选择参数类型'));
                form.render();
            },
            where:json, //接口的其它参数
            // size:'sm', //整体表格尺寸，sm  lg
            cols: [[ //表头
                {field: 'NAME', title: '参数名称',  sort: false}
                , {field: 'TYPE', title: '参数类型',  sort: false,templet:function (obj) {
                        return getDataText("CONG_LX",obj.TYPE);
                    }}
                , {field: 'KEY', title: '参数代码',  sort: false}
                , {field: 'VALUE', title: '参数内容',  sort: false}
                ,{title:'操作',width:200 , templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        // json._TYQY={"ZT":{"1":"Y","2":"N"}};
                        json2.rowData=JSON.stringify(obj);
                        json2.TYQY="ZT";
                        return judgeButtonRights(json2);
                    }}
            ]]
        };
        //打开添加修改页面
        window.loadConfigForm =function () {
            document.getElementById("configForm").reset();
            $("#ConfigHiddenId").val("");
            status="";
            layer.open({
                type:1,//类型
                area:['400px','300px'],//定义宽和高
                title:'系统参数',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#CONFIG'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    $("#addConfigSub").click();
                    if(status=="SUCCESS"){
                        layer.close(index);
                        creaConfigTable();
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                },
                btn2:function (index,layero) {
                    layer.close(index);
                }
            });
        };

        //表格初始化
        window.creaConfigTable=function(){
            table.init('config', configTable);
        };

        //头工具栏事件
        table.on('toolbar(config)', function(obj){
            switch(obj.event){
                case 'addConfig':
                    loadConfigForm();
                    break;
                case 'reset':

                    $("#configName").val("");
                    $("#configType").val("");
                    $("#configKey").val("");
                    $("#configValue").val("");
                    form.render('select');
                    delete json.wherelike.NAME;
                    delete json.wherelike.KEY;
                    delete json.wherelike.VALUE;
                    delete json.where.TYPE;
                    creaConfigTable();
                    break;
                case 'findConfig':
                    if($("#configName").val()!=""){
                        json.wherelike.NAME=$.trim($("#configName").val());
                    }else{
                        delete json.wherelike.NAME;
                    }
                    if($("#configKey").val()!=""){
                        json.wherelike.KEY=$.trim($("#configKey").val());
                    }else{
                        delete json.wherelike.KEY;
                    }
                    if($("#configValue").val()!=""){
                        json.wherelike.VALUE=$.trim($("#configValue").val());
                    }else{
                        delete json.wherelike.VALUE;
                    }
                    if($("#configType").val()!=""){
                        json.where.TYPE=$("#configType").val();
                    }else{
                        delete json.where.TYPE;
                    }
                    table.init('config', configTable);
                    $("#configName").val(json.wherelike.NAME);
                    $("#configKey").val(json.wherelike.KEY);
                    $("#configValue").val(json.wherelike.VALUE);
                    $("#configType").val(json.where.TYPE);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(config)', function(obj){
            if(obj.event === 'XTGL_JCSJ_XTCS_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonDelete={};
                    jsonDelete.ID=obj.data.ID;
                    json1.delete=jsonDelete;
                    getAjax({url:deleteConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                obj.del();
                                layer.close(index);
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            } else if(obj.event === 'XTGL_JCSJ_XTCS_EDIT'){
                loadConfigForm();
                $("#ConfigHiddenId").val(obj.data.ID);
                form.val('configForm', {
                    "NAME": obj.data.NAME,
                    "KEY": obj.data.KEY,
                    "VALUE": obj.data.VALUE,
                })
            }else if(obj.event === 'stop'){
                layer.confirm('你确定要停用该参数吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
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
                    getAjax({url:updateConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creaConfigTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }else if(obj.event === 'enable'){
                layer.confirm('你确定要启用该参数吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
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
                    getAjax({url:updateConfigUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                layer.close(index);
                                creaConfigTable();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }
                    });
                });
            }
        });

        //系统参数 表单提交
        form.on('submit(addConfigSub)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#ConfigHiddenId").val()==""||$("#ConfigHiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                if (isadmin=='2'){
                    jsonInsert.TYPE="1";
                }else {
                    jsonInsert.TYPE="2";
                }

                json.insert=jsonInsert;
                url= insertConfigUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#ConfigHiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                json.fild=jsonFild;
                url= updateConfigUrl;
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
                    id:$("#ConfigHiddenId").val(),
                    ASD:jsonASD
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
            }
        });

        //初始化table
        creaConfigTable();

    });

})