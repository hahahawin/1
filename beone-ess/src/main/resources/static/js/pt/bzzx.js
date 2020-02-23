
/**
 * 帮助中心
 * @Author: 倪杨
 * @Date: 2019/2/11
 */
$(function () {

    var ue = UE.getEditor('NR',{autoHeightEnabled: false,maximumWords:100});//富文本编辑器

    //设置UE上传格式和路径
    UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
    UE.Editor.prototype.getActionUrl = function(action) {
        if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage') {
            return basePath+'common/imgUpdate'; //在这里返回我们实际的上传图片地址
        } else {
            return this._bkGetActionUrl.call(this, action);
        }
    }

    var bblxList = getBblxList().nameList;
    var bblxAttrList = getBblxList().attrList;
    var yfbBblxList = getBblxList().yfbBblxList;
    var rightMenuList = getRightMenu();
    var zdycdMenuList = getZdycdMenu();
    var table = '';
    var xmId = '';

    layui.use(['table','form','laydate','tree'], function() {
        var table=layui.table,
            laydate=layui.laydate,
            tree=layui.tree,
            form=layui.form;

        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;
        // json.fildName="ID,BT,NR1,LX,TXFS,YWLX,YWID,GBQT,JJCD,SXSJ,XXLY,FJXX1,ZT,CREA_ID";

        var jsonWhere={};
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;
        var jsonOther={};
        jsonOther.order={'CREA_TIME':'DESC'};
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
                $("#XM").html(getSelectHtmlByData('',yfbBblxList,'请选择项目'));
                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'BT', title: '标题',  sort: false}
                , {field: 'XM', title: '所属项目',  sort: false,templet:function (obj) {
                        return bblxList[obj.XM];
                    }}
                , {field: 'CD', title: '所属菜单',  sort: false,templet:function (obj) {
                        if (bblxAttrList[obj.XM]=='2') {
                            return zdycdMenuList[obj.CD];
                        }else{
                            return rightMenuList[obj.CD];
                        }
                    }}
                , {title:'操作',width:200 , templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        /*var pd="N";
                        if (obj.ZT=='1'){
                            pd="Y";
                        }
                        var judge={};
                        judge.JCBG_TZGG_XWTZ_EDIT=pd;
                        judge.JCBG_TZGG_XWTZ_DEL=pd;
                        judge.JCBG_TZGG_XWTZ_ZF=pd;
                        json2.judge=judge;*/
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
                area:['1000','500'],//定义宽和高
                // offset: '60px',
                title:'帮助中心',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#operationPage'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用

                    $("#formSubmit").click();
                    if(status=="SUCCESS"){
                        layer.close(index);
                        creatTable();
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                    return false;
                },
                btn2:function (index,layero) {
                    layer.close(index);
                }
            });
        };

        //表格初始化方法
        window.creatTable=function(){
            table = layui.table;
            table.init('conTable', Table);

        };
        //头工具栏事件
        table.on('toolbar(conTable)', function(obj){
            switch(obj.event){
                case 'add':
                    loadForm();
                    break;
                case 'reset':
                    $("#bzzxBt").val("");
                    delete json.wherelike.BT;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#bzzxBt").val()!=""){
                        json.wherelike.BT=$.trim($("#bzzxBt").val());
                    }else{
                        delete json.wherelike.BT;
                    }
                    table.init('conTable', Table);
                    $("#bzzxBt").val(json.wherelike.BT);
                    form.render();
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'PTGL_BZJF_BZZX_DEL'){
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
            } else if(obj.event === 'PTGL_BZJF_BZZX_EDIT'){
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);

                form.val('form', {
                    "BT":obj.data.BT,
                    "XM":obj.data.XM,
                });
                if (bblxAttrList[obj.data.XM]=='2') {
                    $("#SSCD").val(zdycdMenuList[obj.data.CD]);
                }else{
                    $("#SSCD").val(rightMenuList[obj.data.CD]);
                }
                $("#SSCD").attr("hiddenCdId",obj.data.CD);

                var ue = UE.getEditor('NR',{autoHeightEnabled: false,maximumWords:100});//富文本编辑器
                //必须设置定时 否则不会显示内容 后面找解决办法和原因
                /*ue.addListener("ready", function () {
                    // editor准备好之后才可以使用
                    ue.setContent(text);
                });*/
                setTimeout(function () {
                    ue.setContent(obj.data.NR);
                },1000);

                form.render();
            }
        });


        //系统参数 表单提交
        form.on('submit(formSubmit)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var cdId = $("#SSCD").attr("hiddenCdId");
            var url="";
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.CD = cdId;
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.CD = cdId;
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

        function getRightTreeData(){
            var a="";
            var json1 = {};
            json1.ASD=jsonASD;
            getAjax({url:loadRightTreeUrl,data:JSON.stringify(json1),callback:function (reg) {
                    a=reg.list;
                }
            });
            return a;
        };
        function getZdycdTreeData(ssxmId){
            var a="";
            var json1 = {};
            json1.ASD=jsonASD;
            json1.zdycdId = ssxmId;
            getAjax({url:loadZdycdTreeUrl,data:JSON.stringify(json1),callback:function (reg) {
                    a=reg.list;
                }
            });
            return a;
        };
        //开启节点操作图标
        window.createDeptTree = tree.render({
            elem: '#tree'
            ,id:"tree"
            // ,data: getRightTreeData()
            // ,edit: ['add', 'update', 'del'] //操作节点的图标
            ,click:function (obj) {
                if (obj.data.children==""||obj.data.children==null||obj.data.children==undefined){
                    var id = obj.data.id;
                    var title = obj.data.title;
                    $("#XZCD").attr("value",title);
                    $("#XZCD").attr("hiddenCdId",id);
                }
            }
        });
        $(".layui-tree li a").click(function() {
            $(".layui-tree li a").removeClass("current");
            $(this).addClass("current");
        });
        $("#SSCD").click(function () {
            var xm = $("#XM").val();
            var table = bblxAttrList[xm];
            loadCdChooseForm();
            if (table == '2'){
                tree.reload('tree', {
                    data: getZdycdTreeData(xm)
                });
            }else if (table == '1'){
                tree.reload('tree', {
                    data: getRightTreeData()
                });
            }

        });
    });

    function getRightMenu() {
        var menu = {};
        var json = {};
        json.ASD = getJsonASD();
        json.ASD.code = ptFindCode;
        json.fildName="ID,NAME";
        json.tableName = tableName2;
        getAjax({url:findUrl,data:JSON.stringify(json),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    for (var i=0;i<list.length;i++){
                        menu[list[i].id]=list[i].name;
                    }
                }
            }
        });
        return menu;
    }

    function getZdycdMenu() {
        var menu = {};
        var json = {};
        json.ASD = getJsonASD();
        json.ASD.code = ptFindCode;
        json.fildName="ID,MC";
        json.tableName = tableName4;
        getAjax({url:findUrl,data:JSON.stringify(json),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    for (var i=0;i<list.length;i++){
                        menu[list[i].id]=list[i].mc;
                    }
                }
            }
        });
        return menu;
    }
    function getBblxList() {
        var bblxList={};
        var json1 = {};
        var json2 = {};
        var json3 = {};
        var json={};
        json.ASD=getJsonASD();
        json.ASD.code=ptFindCode;
        json.tableName=tableName3;
        json.fildName="ID,NAME,ATT1,FBZT";
        // var whereJson = {};
        // whereJson.FBZT = '2';
        // json.where = whereJson;
        getAjax({url:findUrl,data:JSON.stringify(json),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    for (var i=0;i<list.length;i++){
                        json1[list[i].id]=list[i].name;
                        json2[list[i].id]=list[i].att1;
                        if (list[i].fbzt == '2'){
                            json3[list[i].id]=list[i].name;
                        }
                    }
                }
            }
        });

        bblxList.nameList = json1;
        bblxList.attrList = json2;
        bblxList.yfbBblxList = json3;
        return bblxList;
    }

    //打开添加修改页面
    window.loadCdChooseForm =function () {
        $("#tree").html("");
        $("#XZCD").attr("value","");
        $("#XZCD").attr("hiddenCdId","");
        layer.open({
            type:1,//类型
            area:['400','500'],//定义宽和高
            // offset: '60px',
            title:'所属菜单',//题目
            shadeClose:false,//点击遮罩层关闭
            btn: ['确定','关闭'],
            content: $('#CdChoosePage'),//打开的内容
            yes:function (index,layero) {
                var title = $("#XZCD").val();
                var id = $("#XZCD").attr("hiddenCdId");
                $("#SSCD").val(title);
                $("#SSCD").attr("hiddenCdId",id);
                layer.close(index);
            },
            btn2:function (index,layero) {
                layer.close(index);
            }
        });
    };


});
