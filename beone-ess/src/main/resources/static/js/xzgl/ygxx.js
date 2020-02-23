/*
倪杨
2019-08-19
学段管理js
*/

$(function () {

    var userLog = getUserBizLog();

    var status="";//添加修改是否成功的状态，默认是空
    layui.use(['table','form','laydate'], function() {
        var table=layui.table,
            laydate=layui.laydate,
            form=layui.form;

        var nowTime = new Date().getTime();
        laydate.render({
            elem: '#GZNY'
            ,type: 'month'
            ,format:'yyyyMM'
            ,max:nowTime
        });

        var json ={};
        jsonASD.code=ptFindCode;
        json.ASD=jsonASD;
        json.tableName=tableName;
        // json.fildName="";

        var jsonWhere={};
        json.where=jsonWhere;
        var wherelike = {};
        json.wherelike = wherelike;

        var jsonOther={};
        jsonOther.order = {"GH":"asc"};
        json.other = jsonOther;

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
                $("#GJDQ").html(getDataSelectHtml('GJ','1','','请选择国籍'));
                $("#ZZMM").html(getDataSelectHtml('ZZMM','1','','请选择政治面貌'));
                $("#XX").html(getDataSelectHtml('XX','1','','请选择血型'));
                $("#XL").html(getDataSelectHtml('XLDM','1','','请选择学历'));
                $("#MZ").html(getDataSelectHtml('MZ','1','','请选择民族'));
                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'GH',width:100, title: '员工工号',  sort: false,fixed: 'left'}
                , {field: 'XM',width:100, title: '姓名',  sort: false,fixed: 'left'}
                , {field: 'XB',width:100, title: '性别',  sort: false,fixed: 'left',templet:function (obj) {
                        return getDataText('XB',obj.XB);
                    }}
                , {field: 'SFZHM',width:200, title: '身份证号码',  sort: false}
                , {field: 'LXDH',width:100, title: '联系电话',  sort: false}
                , {field: 'ZT',width:100, title: '状态',  sort: false,templet:function (obj) {
                        return getDataText('TYQY_ZT',obj.ZT);
                    }}
                , {field: 'JG',width:100, title: '籍贯',  sort: false,templet:function (obj) {
                        // return getDataText('JG',obj.JG);
                        return obj.JG;
                    }}
                , {field: 'MZ',width:100, title: '民族',  sort: false,templet:function (obj) {
                        return getDataText('MZ',obj.MZ);
                        // return obj.MZ;
                    }}
                , {field: 'GJDQ',width:100, title: '国籍',  sort: false,templet:function (obj) {
                        return getDataText('GJ',obj.GJDQ);
                    }}
                , {field: 'ZZMM',width:100, title: '政治面貌',  sort: false,templet:function (obj) {
                        return getDataText("ZZMM",obj.ZZMM);
                    }}
                , {field: 'XX',width:100, title: '血型',  sort: false,templet:function (obj) {
                        return getDataText("XX",obj.XX);
                    }}
                , {field: 'XL',width:100, title: '学历',  sort: false,templet:function (obj) {
                        return getDataText("XLDM",obj.XL);
                    }}
                , {field: 'GZNY',width:120, title: '参加工作年月',  sort: false}
                , {title:'操作',width:200 ,fixed:'right', templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        json2.rowData=JSON.stringify(obj);
                        var pd="Y";
                        if (userLog[obj.SFZHM]!=undefined&&userLog[obj.SFZHM]>0){
                            pd="N";
                        }
                        var judge={};   //自定义限制
                        judge.PTGL_YGGL_YGXX_DEL=pd;
                        json2.judge=judge;
                        return judgeButtonRights(json2);
                    }}
            ]]
        };

        //打开添加修改页面
        window.loadForm =function () {
            document.getElementById("form").reset();
            $("#hiddenId").val("");// hiddenId 隐藏的主id，主要是form执行修改时保存的id值
            $("#hiddenIDCard").val("");
            status="";
            layer.open({
                type:1,//类型
                area:['90%','430px'],//定义宽和高
                title:'员工信息',//题目
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

        /**
         * 监听身份证号码input 实时生成出生年月
         */
        $("#SFZHM").on("input",function(e){
            var value = e.delegateTarget.value ;
            var pass = getSfzhIsTrue(value);
            if(pass==null || pass == ''){
                var date = value.substring(6,10) + '-' + value.substring(10,12) + '-' + value.substring(12,14) ;
                $("#CSRQ").val(dateFormat('yyyy-mm-dd',date));
            }else{
                $("#CSRQ").val('');
            }
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
                    $("#XM").removeAttr("readonly");
                    break;
                case 'reset':
                    $("#ygxxYggh").val("");
                    $("#ygxxXm").val("");
                    layui.form.render('select');
                    delete json.wherelike.GH;
                    delete json.wherelike.XM;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#ygxxYggh").val()!=""){
                        json.wherelike.GH=$.trim($("#ygxxYggh").val());
                    }else{
                        delete json.wherelike.GH;
                    }
                    if($("#ygxxXm").val()!=""){
                        json.wherelike.XM=$.trim($("#ygxxXm").val());
                    }else{
                        delete json.wherelike.XM;
                    }
                    table.init('conTable', Table);
                    $("#ygxxYggh").val(json.wherelike.GH);
                    $("#ygxxXm").val(json.wherelike.XM);
                    form.render();
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'PTGL_YGGL_YGXX_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.delete = {"id":obj.data.ID,"sfz":obj.data.SFZHM};
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
            } else if(obj.event === 'PTGL_YGGL_YGXX_EDIT'){
                status="";
                loadForm();
                $("#hiddenId").val(obj.data.ID);
                $("#hiddenIDCard").val(obj.data.SFZHM);
                $("#XM").attr('readonly','readonly');
                form.val('form', {
                    "GH":obj.data.GH,
                    "XM":obj.data.XM,
                    "XB":obj.data.XB,
                    "SFZHM":obj.data.SFZHM,
                    "CSRQ":dateFormat('yyyy-mm-dd',obj.data.CSRQ),
                    "GZNY":obj.data.GZNY,
                    "LXDH":obj.data.LXDH,
                    "JG":obj.data.JG,
                    "MZ":obj.data.MZ,
                    "GJDQ":obj.data.GJDQ,
                    "ZZMM":obj.data.ZZMM,
                    "XX":obj.data.XX,
                    "XL":obj.data.XL,
                })

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
                jsonInsert.ZT='2';
                jsonInsert.dateCSRQ={"key":data.field.CSRQ,"value":"YYYY-MM-dd"};
                delete jsonInsert.CSRQ;
                json.insert=jsonInsert;
                json.passWord=hex_md5(getConfig("SYS_USER_DEFA_PASS").VALUE).toUpperCase();
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                jsonWhere.SFZHM=$("#hiddenIDCard").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.dateCSRQ={"key":data.field.CSRQ,"value":"YYYY-MM-dd"};
                delete jsonFild.CSRQ;
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
            idCard: function(value){//身份证号码
                var pass = getSfzhIsTrue(value);
                if(pass!=null && pass != '' && pass != undefined){
                   return pass ;
                }
            },
            NY: function(value){//年月
                if(!new RegExp("^\\d{4}((0([1-9]))|(1(0|1|2)))$").test(value)){
                    return '请输入有效年月(如:201901)';
                }
            },
            phone: function(value){//联系电话
                var regexp= "^(((\\+\\d{2}-)?0\\d{2,3}-\\d{7,8})|((\\+\\d{2}-)?(\\d{2,3}-)?([1][3,4,5,7,8][0-9]\\d{8})))$";
                if(!new RegExp(regexp).test(value)){
                    return '请输入有效联系电话';
                }
            },
            GH: function(value){//工号
                var regexp= "^[a-zA-Z\\d]+$";
                if(!new RegExp(regexp).test(value)){
                    return '大小写字母加数字';
                }
            },
            birthday: function(value){//工号
                var csrq = $("input[name = 'CSRQ']").val();
                csrq=csrq.replace(/-/g,'');
                csrq=csrq.substring(2);
                var sfz = $("input[name = 'SFZHM']").val();
                sfz = sfz.substring(8,14);
                if (csrq != sfz){
                    return "出生日期与身份证号码不符合";
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
            uniqueUserExt: function (value,item) {//唯一性验证
                var url=uniqueUrl;
                var checkResult="1";
                var param={
                    tableName:tableName1,
                    key:'CODE',
                    value:value,
                    id:$("#hiddenId").val(),
                    ASD:jsonASD
                };
                getAjax({url:url,data:JSON.stringify(param),callback:function (reg) {
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

    function getUserBizLog() {
        var user={};
        var json={};
        json.ASD=jsonASD;
        json.org_id=belong_org_id;
        getAjax({url:getUserBizLogUrl,data:JSON.stringify(json),callback:function (reg) {
                var list = reg.resultData;
                for (var i=0;i<list.length;i++){
                    user[list[i].code]=list[i].count;
                }
            }});
        return user;
    }

    function getTableBarButton1(reg) {
        var obj = reg.rowData;
        var rowData=JSON.parse(obj);
        getRigth();


        var right = JxCore.dataRight[ThirdCode];

        var html='<div class="bar">';
        for (var i=0;i<right.length;i++){
            var sta=false;
            if( right[i].COUNTS > 0){
                if (right[i].RIGHT_CODE.endWith("_ADD")||right[i].RIGHT_CODE.endWith("_CX")){
                    continue;
                }

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
                if (right[i].RIGHT_CODE.endWith("PTGL_YGGL_YGXX_DEL")) {
                    if (sta){
                        if (userLog[rowData.ID]==undefined||userLog[rowData.ID]<=0){
                            html+='<a href="javascript:void(0)" title="'+right[i].RIGHT_NAME+'" lay-event="'+right[i].RIGHT_CODE +'"><img src="img/menu/menu4/blue/'+right[i].RIGHT_ICON+'"></a>';
                        } else {
                            html+='<a href="javascript:void(0)"  title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
                        }
                    }else {
                        html+='<a href="javascript:void(0)"  title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
                    }
                    continue;
                }



                if (sta==false){
                    html+='<a href="javascript:void(0)"  title="'+right[i].RIGHT_NAME+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].RIGHT_ICON+'"></a>';
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
                            html+='<a href="javascript:void(0)" title="启用" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/nr_icon_start.png"></a>';
                        }else{
                            html+='<a href="javascript:void(0)" title="停用" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/nr_icon_stop.png"></a>';
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
});
