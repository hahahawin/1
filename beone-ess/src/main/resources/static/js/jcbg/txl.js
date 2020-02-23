/**
 * 倪杨
 * 2019-11-18
 * 通讯录
 */

$(function () {

    var fzxx_id="";
    layui.use(['form','layer','tree','util','table'], function() {

        var form=layui.form,
            tree=layui.tree,
            util=layui.util,
            table=layui.table,
            layer=layui.layer;

        window.updateTree=function(data,e){//data:数据，e:对象
            loadForm();
            data=JSON.parse(data);//由于传参时将数据转为字符串传递，所以需要将数据转换为json格式
            document.getElementById("form").reset();
            $("#hiddenId").val(data.fzxx_id);

            form.val('form', {
                "MC": data.fzxx_mc,
            });
            fzxx_id=data.fzxx_id;
        };

        window.delTree=function(data,e){//data:数据，e:对象
            data=JSON.parse(data);//由于传参时将数据转为字符串传递，所以需要将数据转换为json格式
            layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                var json1 ={};
                jsonASD.code=deleteCode;
                json1.ASD=jsonASD;
                json1.tableName=tableName;
                var jsonDelete={};
                jsonDelete.ID=data.fzxx_id;
                json1.delete=jsonDelete;
                getAjax({url:deleteUrl,data:JSON.stringify(json1),callback:function (reg) {
                        if(reg.resultCode=="200"){
                            tree.reload('deptTree', {
                                data: getDept(),
                                defaultStatus:true
                            });
                            layer.msg("操作成功！", {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }
                });
            });
        }

        var json ={};
        jsonASD.code=findCode;
        json.ASD=jsonASD;
        json.tableName=tableName1;
        // json.fildName="ID,XQH,XQMC,XQDZ,YZBM,FZR,LXDH,ZT,CREATOR_ID,ORG_ID";
        var jsonWhere={};
        jsonWhere.borg_id=belong_org_id;
        jsonWhere.crea_id=user_id;
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
                $("#XB").html(getDataSelectHtml('XB','1','','请选择性别'));
                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'XM', title: '姓名',  sort: false}
                , {field: 'XB', title: '性别',  sort: false,templet:function (obj) {
                        return getDataText("XB",obj.XB);
                    }}
                , {field: 'LXDH', title: '联系电话',  sort: false}
                , {title:'操作',width:200, templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        // json2.TYQY="ZT";
                        return getTableBarButton1(json2);
                    }}
            ]]
        };

        function getTableBarButton1(reg) {
            var obj = reg.rowData;
            var rowData=JSON.parse(obj);
            getRigth();

            var right = JxCore.dataRight[ThirdCode];
            console.info(right);
            var html='<div class="bar">';
            for (var i=0;i<right.length;i++){
                var sta=false;
                if( right[i].counts > 0){
                    if (right[i].right_code.endWith("_ADD")||right[i].right_code.endWith("_CX")||right[i].right_code.endWith("JCBG_RCBG_TXL_RYADD")){
                        continue;
                    }

                    html+='<a href="javascript:void(0)" title="'+right[i].right_name+'" lay-event="'+right[i].right_code +'"><img src="img/menu/menu4/blue/'+right[i].right_icon+'"></a>';
                }else{
                    if (right[i].right_code.endWith("_ADD")||right[i].right_code.endWith("_CX")||right[i].right_code.endWith("JCBG_RCBG_TXL_RYADD")){
                        continue;
                    }
                    html+='<a href="javascript:void(0)"  title="'+right[i].right_name+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].right_icon+'"></a>';
                }
            }
            html+='</div>';
            return html;
        }

        //表格初始化方法
        window.creatTable=function(){
            table.init('conTable', Table);
        };

        //打开添加修改页面
        window.loadForm1 =function () {
            document.getElementById("formTable").reset();
            $("#hiddenIdTable").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            status="";
            layer.open({
                type:1,//类型
                area:['500px','250px'],//定义宽和高
                title:'通讯录',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#operationPageTable'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    $("#formSubmit1").click();
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

        //头工具栏事件
        table.on('toolbar(conTable)', function(obj){
            switch(obj.event){
                case 'add':
                    loadForm1();
                    break;
                case 'reset':
                    $("#txl_xm").val("");
                    delete json.wherelike.xm;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#txl_xm").val()!=""){
                        json.wherelike.xm=$("#txl_xm").val();
                    }else{
                        delete json.wherelike.xm;
                    }
                    table.init('conTable', Table);
                    $("#txl_xm").val(json.wherelike.xm);
                    break;
                case 'reset1':
                    $("#name").val("");
                    delete deptjson.tj.user_name;
                    table.init('conTable', deptTable);
                    break;
                case 'findOnCondition1':
                    if($("#name").val()!=""){
                        deptjson.tj.user_name=$("#name").val();
                    }else{
                        delete deptjson.tj.user_name;
                    }
                    table.init('conTable', deptTable);
                    $("#name").val(deptjson.tj.user_name);
                    break;
            };
        });

        //行事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'JCBG_RCBG_TXL_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName1;
                    var jsonDelete={};
                    jsonDelete.ID=obj.data.ID;
                    json1.delete=jsonDelete;
                    getAjax({url:deleteUrl,data:JSON.stringify(json1),callback:function (reg) {
                            if(reg.resultCode=="200"){
                                layer.msg("操作成功！", {offset: '200px'});
                                obj.del();
                            }else{
                                layer.msg(reg.resultMsg, {offset: '200px'});
                            }
                        }});
                });
            } else if(obj.event === 'JCBG_RCBG_TXL_EDIT'){
                status="";
                loadForm1();
                $("#hiddenIdTable").val(obj.data.ID);
                form.val('form', {
                    "XM":obj.data.XM,
                    "XB":obj.data.XB,
                    "LXDH":obj.data.LXDH,
                })
            }
        });

        //开启节点操作图标
        window.createDeptTree = tree.render({
            elem: '#deptTree'
            ,id:"deptTree"
            ,data: getDept()
            ,edit: ['update', 'del'] //操作节点的图标
            ,click:function (obj) {
                var data = obj.data;
                if (data.level!=1){
                    if (data.type=="1"){  //个人分组
                        fzxx_id=obj.data.fzxx_id;
                        json.where.fz_id=obj.data.fzxx_id;
                        creatTable();
                    }else if (data.type=="2"){    //部门分组
                        fzxx_id=obj.data.dept_id;
                        deptjson.org_id = belong_org_id;
                        deptjson.dept_id = fzxx_id;
                        table.init('conTable', deptTable);
                    }
                }
            }
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

        });

        var deptjson={};
        var tj = {};
        // deptjson.tj.USER_NAME=$("#name1").val();
        deptjson.tj=tj;
        deptjson.ASD = jsonASD;
        var deptTable={
            defaultToolbar:[],
            toolbar:'#toolHeadDept',
            height: 'full-0',
            url: getInDeptUserUrl,
            method:'post', //接口http请求类型，默认：get
            contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
            page: true,
            enabledCurrCookie: true,
            limits:[10,20,30,40,50,60,70,80,90],
            limit:10,
            where:deptjson, //接口的其它参数
            cols: [[ //表头
                ,{field: 'USER_NAME', title: '姓名', sort: false}
                ,{field: 'USEREXT_LXDH', title: '联系电话', sort: false}
            ]]
        };

        //树形结构的弹窗
        window.loadForm =function () {
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            status="";
            layer.open({
                type:1,//类型
                area:['500px','200px'],//定义宽和高
                title:'分组管理',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#operationPage'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    $("#formSubmit").click();
                    if(status=="SUCCESS"){
                        tree.reload('deptTree', {
                            data: getDept(),
                            defaultStatus:true
                        });
                        layer.close(index);
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                },
                btn2:function (index,layero) {
                    layer.close(index);
                }
            });
        };

        //按钮事件
        util.event('lay-dept', {
            addFirst: function(){
                $("#hiddenId").val("");
                loadForm();
            }
            ,reload: function(){
                tree.reload('deptTree', {
                    data: getDept(),
                });
            }
        });

        // 获取部门的数据并树形结构返回
        function getDept(){
            var treeList="";
            var json1 = {};
            json1.ASD=jsonASD;
            getAjax({url:findTxlOnGrUrl,data:JSON.stringify(json1),callback:function (reg) {
                    treeList=reg.list;
                }
            });
            return treeList;
        };

        //树形系统参数 表单提交
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
                jsonInsert.LX='2';
                jsonInsert.SFNZ='1';
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

        form.on('submit(formSubmit1)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName1;
            var url="";
            if ($("#hiddenIdTable").val()==""||$("#hiddenIdTable").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.FZ_ID=fzxx_id;
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenIdTable").val();
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
    });
})

