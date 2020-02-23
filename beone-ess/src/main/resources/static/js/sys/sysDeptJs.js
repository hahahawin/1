/**
 * 倪杨
 * 2019-08-15
 * 部门管理js
 */

$(function () {
    var userList = {};
    var dept_id="";
    layui.use(['form','layer','tree','util','table'], function() {

        var form=layui.form,
            tree=layui.tree,
            util=layui.util,
            table=layui.table,
            layer=layui.layer;

        window.addTree=function(data,e){//data:数据，e:对象
            $("#deptUser").css("display","none");
            data=JSON.parse(data);//由于传参时将数据转为字符串传递，所以需要将数据转换为json格式
            $("#superDept").css("display","block");
            $("#operationPage").css("display","block");
            document.getElementById("form").reset();
            $("#hiddenId").val("");
            form.val('form', {
                "PID": data.dept_id,
                "PNAME": data.dept_name,
            });
        };

        window.updateTree=function(data,e){//data:数据，e:对象
            if (JSON.parse(data).children==undefined||JSON.parse(data).children==null||JSON.parse(data).children==""){
                $("#deptUser").css("display","inline-block");
            } else {
                $("#deptUser").css("display","none");
            }

            data=JSON.parse(data);//由于传参时将数据转为字符串传递，所以需要将数据转换为json格式
            document.getElementById("form").reset();
            $("#hiddenId").val(data.dept_id);
            $("#superDept").css("display","block");
            $("#operationPage").css("display","block");

            form.val('form', {
                "NAME": data.dept_name,
                "PNAME": data.pname,
                "PID": data.dept_pid,
                "ZZ": data.dept_zz,
                "FZR": data.dept_fzr,
            });
            dept_id=data.dept_id;
        };

        window.delTree=function(data,e){//data:数据，e:对象
            data=JSON.parse(data);//由于传参时将数据转为字符串传递，所以需要将数据转换为json格式
            layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                var json1 ={};
                jsonASD.code=deleteCode;
                json1.ASD=jsonASD;
                json1.tableName=tableName;
                var jsonDelete={};
                jsonDelete.ID=data.dept_id;
                json1.delete=jsonDelete;
                $.ajax({
                    type:"POST",
                    url:deleteUrl,
                    async:false,
                    dataType:"json", //服务器返回数据的类型
                    contentType: 'application/json',
                    data:JSON.stringify(json1),
                    success:function(reg){
                        if(reg.resultCode=="200"){
                            tree.reload('deptTree', {
                                data: getDept()
                            });
                            $("#operationPage").css("display","none");
                            layer.msg("操作成功！", {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }
                });
            });
        }

        //开启节点操作图标
        window.createDeptTree = tree.render({
            elem: '#deptTree'
            ,id:"deptTree"
            ,data: getDept()
            ,edit: ['add', 'update', 'del'] //操作节点的图标
        });

        //按钮事件
        util.event('lay-dept', {
            addFirst: function(){
                $("#deptUser").css("display","none");
                $("#superDept").css("display","none");
                $("#operationPage").css("display","block");
                document.getElementById("form").reset();
                $("#hiddenId").val("");
                $("input[name='PID']").val("-1");
            }
            ,reload: function(){
                tree.reload('deptTree', {
                    data: getDept()
                });
            }
        });

        // 获取部门的数据并树形结构返回
        function getDept(){
            userList = getUserList();
            $("#FZR").empty();
            $("#FZR").append("<option value=''>请选择负责人</option>");
            for(var j in userList){
                $("#FZR").append("<option value='"+j+"'>"+userList[j]+"</option>");
            }
            var a="";
            var json1 = {};
            json1.ASD=jsonASD;
            getAjax({url:loadDeptUrl,data:JSON.stringify(json1),callback:function (reg) {
                    a=reg.list;
                }
            });
            return a;
        };


        window.loadDeptUserForm =function () {
            selWUser();
            selYUser();
            layer.open({
                type: 1,
                area:['1000px','500px'],//定义宽和高
                title:'部门人员',//题目
                fixed: false, //不固定
                maxmin: false,
                content: $('#deptUserPage')
            });
        };



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
                delete jsonInsert.PNAME;
                json.insert=jsonInsert;
                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                delete jsonFild.PNAME;
                json.fild=jsonFild;
                url= updateUrl;
            }
            getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
                    if(reg.resultCode == '200'){
                        tree.reload('deptTree', {
                            data: getDept()
                        });
                        $("#operationPage").css("display","none");
                        layer.msg("操作成功！", {offset: '200px'});
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }
            });
            return false;
        });

        //头工具栏事件
        table.on('toolbar(table1)', function(obj){
            switch(obj.event){
                case 'del1':
                    delUser();
                    break;
                case 'reset1':
                    $("#name1").val('');
                    selYUser();
                    break;
                case 'chaxun1':
                    selYUser();
                    break;
            };
        });

        //头工具栏事件
        table.on('toolbar(table2)', function(obj){
            switch(obj.event){
                case 'add2':
                    addUser();
                    break;
                case 'reset2':
                    $("#name2").val('');
                    selWUser();
                    break;
                case 'chaxun2':
                    selWUser();
                    break;
            };
        });

    });

    function getUserList() {
        var userJson={};
        var json={};
        json.ASD=jsonASD;
        getAjax({url:getUserListInDeptUrl,data:JSON.stringify(json),callback:function (reg) {
            var list = reg.resultData;
                for (var i=0;i<list.length;i++){
                    userJson[list[i].id]=list[i].mc;
                }
            }
        });
        return userJson;
    }
    function selYUser(){
        // user1= $("#user_name1").val();
        var json={};
        json.org_id = belong_org_id;
        json.dept_id = dept_id;
        var tj = {};
        var user_name = $("#name1").val();
        if(user_name == null && user_name != ''){
            tj.user_name=user_name;
        }
        json.tj=tj;
        json.ASD = jsonASD;
        layui.table.render({
            elem: '#table1'
            ,id:'yTable'
            ,height: 450
            ,url: getInDeptUserUrl //数据接口getInDeptUserUrl
            ,contentType:'application/json'
            ,page: false //开启分页
            ,method:'post' //接口http请求类型，默认：get
            ,where:json //接口的其它参数
            ,toolbar :'#toolbar1'
            ,defaultToolbar:[]
            ,cols: [[ //表头
                {type:'checkbox'}
                ,{field: 'USER_NAME', title: '姓名', sort: false}
                ,{field: 'USER_ACCOUNT', title: '账号', sort: false}
            ]]
        });
        $("#name1").val(json.tj.USER_NAME);
    }

    function selWUser(){
        // user1= $("#user_name1").val();
        var json={};
        json.org_id = belong_org_id;
        json.dept_id = dept_id;
        var tj = {};
        var user_name = $("#name2").val();
        if(user_name != null && user_name != ''){
            tj.user_name=user_name;
        }
        json.tj=tj;
        json.ASD = jsonASD;
        layui.table.render({
            elem: '#table2'
            ,id:'wTable'
            ,height: 450
            ,url: getOutDeptUserUrl //数据接口getInDeptUserUrl
            ,contentType:'application/json'
            ,page: false //开启分页
            ,method:'post' //接口http请求类型，默认：get
            ,where:json //接口的其它参数
            ,toolbar :'#toolbar2'
            ,defaultToolbar:[]
            ,cols: [[ //表头
                {type:'checkbox'}
                ,{field: 'USER_NAME', title: '姓名', sort: false}
                ,{field: 'USER_ACCOUNT', title: '账号', sort: false}
            ]]
        });
        $("#name2").val(json.tj.USER_NAME);
    }



    function addUser(){
        var checkStatus = layui.table.checkStatus('wTable');
        var ids = [];
        $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
            ids.push(o.USER_ID);
        });
        if (ids.length < 1) {
            layer.msg('请选择用户！');
            return false;
        }
        ids = ids.join(",");
        var json = {};
        json.dept_id = dept_id;
        json.ids = ids;
        // jsonASD.code=roleUserCode;
        json.ASD=jsonASD;

        getAjax({url:addDetpUserUrl,data:JSON.stringify(json),callback:function (reg) {
                if(reg.resultCode=="200"){
                    // $("#name1").val('');
                    // $("#name2").val('');
                    selYUser();
                    selWUser();
                    layer.msg("操作成功！", {offset: '200px'});
                }else{
                    layer.msg(reg.resultMsg, {offset: '200px'});
                }
            }
        });
        return false;
    }

    function delUser(){
        var checkStatus = layui.table.checkStatus('yTable');
        var ids = [];
        $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
            ids.push(o.USER_ID);
        });
        if (ids.length < 1) {
            layer.msg('请选择用户！');
            return false;
        }
        ids = ids.join(",");
        var json = {};
        json.dept_id = dept_id;
        json.ids = ids;
        // jsonASD.code=roleUserCode;
        json.ASD=jsonASD;

        getAjax({url:delDetpUserUrl,data:JSON.stringify(json),callback:function (reg) {
                if(reg.resultCode=="200"){
                    // $("#name1").val('');
                    // $("#name2").val('');
                    selYUser();
                    selWUser();
                    layer.msg("操作成功！", {offset: '200px'});
                }else{
                    layer.msg(reg.resultMsg, {offset: '200px'});
                }
            }
        });
        return false;
    }

})
function deptUser(){
    loadDeptUserForm();
}

