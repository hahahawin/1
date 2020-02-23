//图标选中
$(document).on('click', '.icon', function(){
    var list = document.getElementsByClassName("icon");
    for (var i=0; i<list.length;i++){
        list[i].style.background='#86d2ff';
        list[i].classList.remove("iconActive");
    }
    this.style.background='red';
    this.classList.add("iconActive");
});

$(function () {
    getBblx();
    qingkong();
    selMenu1();
    selMenu2();
    layui.use(['form','layer','tree','util','table'], function() {
        var form=layui.form,
            tree=layui.tree,
            util=layui.util,
            table=layui.table,
            layer=layui.layer;

        form.on('select(ssxm)', function(data){
            var value = data.value;
            xmid = value;
            if(value == null || value == ''){
                layer.msg("所属项目不能为空！", {offset: '200px'});
                return false;
            }
            loadFirst();
        });

        //新增
        form.on('submit(formSubmit)', function(data){
            var jsonInsert = data.field;  //通过name值获取数据
            rightVilidate(jsonInsert,'insert'); //添加修改验证提交
            return false ;
        });

        //修改
        form.on('submit(formUpdate)', function(data){
            var jsonInsert = data.field;  //通过name值获取数据
            rightVilidate(jsonInsert,'update'); //添加修改验证提交
            return false ;
        });

        //业务验证
        window.rightVilidate = function(jsonInsert,ytype){
            var IMG = jsonInsert.IMG;
            if(IMG == null || IMG == ''){
                layer.msg("菜单图标不能为空！", {offset: '200px'});
                return false;
            }
            // if (key1==3){
            //     var URL = jsonInsert.URL;
            //     if(URL == null || URL == ''){
            //         layer.msg("三级目录的访问地址不能为空！", {offset: '200px'});
            //         return false;
            //     }
            // }
            var url = "" ;
            var json ={};
            jsonInsert.SSXM = xmid;

            //唯一性判断
            var json1 = {};
            json1.ASD=jsonASD;
            if(ytype=='insert'){
                jsonASD.code = rightAddCode ;
                json.id = "ID";
                json.seqKZ="";//不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                json.insert=jsonInsert;
                url = commInsertUrl ; //添加
            }else if(ytype=='update'){
                jsonASD.code = rightEditCode ;
                json.fild=jsonInsert;
                json.where={'ID':jsonInsert.ID};
                url = commUpdateUrl ; //修改
                json1.id = jsonInsert.ID;
            }
            json1.ssxm = xmid;
            json1.pid = jsonInsert.PID;
            json1.mc = jsonInsert.MC;
            json1.code = jsonInsert.CODE;
            json1.sxh = jsonInsert.SXH;
            var flg = false;
            $.ajax({async:true});
            getAjax({url:uniqueUrl,data:JSON.stringify(json1),callback:function (reg) {
                if(reg.resultCode != '200'){
                    flg = true;
                    layer.msg(reg.resultMsg, {offset: '200px'});
                }
             }});
            if(flg){
                return false;
            }

            json.ASD=jsonASD;
            json.tableName = tableName2;
            $.ajax({
                type:"POST",
                url:url,
                async:false,
                dataType:"json", //服务器返回数据的类型
                contentType: 'application/json',
                data:JSON.stringify(json),
                success:function(data){
                    if(data.resultCode=="200"){
                        if (key1==1){
                            loadFirst(xmid);
                            $("#deptTree").html('');
                        }else if (key1==2){
                            //查询树形结构
                            tree.render({
                                elem: '#deptTree'
                                ,data: getDept()
                                ,edit: ['add', 'update', 'del'] //操作节点的图标
                            });
                        }
                        qingkong();
                        btnStyle(0);
                        layer.msg("操作成功", {offset: '200px'});
                    }else{
                        layer.msg(data.resultMsg, {offset: '200px'});
                    }
                }
            });

            return false;
        }

        //删除
        $(document).on('click','#formDel',function(){
            layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{btn: ['确定', '取消'],title:"提示"}, function(){
                var json ={};
                jsonASD.code= rightDelCode ;
                json.ASD=jsonASD;
                json.tableName= tableName2 ;
                json.delete = {'ID':$("input[name='ID']").val()} ;
                $.ajax({
                    type:"POST",
                    url:commDeleUrl,
                    async:false,
                    dataType:"json", //服务器返回数据的类型
                    contentType: 'application/json',
                    data:JSON.stringify(json),
                    success:function(data){
                        if(data.resultCode=="200"){
                            layer.msg("删除成功", {offset: '200px'});
                            if (key1==1){
                                loadFirst(xmid);
                                $("#secondCon")[0].innerHTML="";
                            }else if (key1==2){
                                //查询树形结构
                                tree.render({
                                    elem: '#deptTree'
                                    ,data: getDept()
                                    ,edit: ['add', 'update', 'del'] //操作节点的图标
                                });
                            }
                            qingkong();
                            btnStyle(0);
                            layer.close(index);
                        }else{
                            layer.msg(data.resultMsg, {offset: '200px'});
                        }
                    }
                });
            });
            return false;
        });

        window.addTree=function(data,e){//data:数据，e:对象
            qingkong();
            btnStyle(1);
            key1 = '2';
            data = JSON.parse(data);
            $("#PID").val(data.id);
            $("#FNAME").html(data.mc);
        };

        window.updateTree=function(data,e){//data:数据，e:对象
            qingkong();
            btnStyle(2);
            key1 = '2';
            data = JSON.parse(data);
            $("#FNAME").html(data.pname);
            layui.form.val('editForm', {
                "ID": data.id,
                "PID": data.pid2,
                "CODE": data.code,
                "MC": data.mc,
                "SXH": data.sxh,
                "URL": data.url,
                "IMG": data.img
            });
            $("#setIcon").attr('src',basePath+'img/menu/menu23/blue/'+data.img);
        };

        window.delTree=function(data,e){//data:数据，e:对象
            data=JSON.parse(data);//由于传参时将数据转为字符串传递，所以需要将数据转换为json格式
            layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                var json1 ={};
                jsonASD.code=rightDelCode;
                json1.ASD=jsonASD;
                json1.tableName=tableName2;
                var jsonDelete={};
                jsonDelete.ID=data.id;
                json1.delete=jsonDelete;
                $.ajax({
                    type:"POST",
                    url:commDeleUrl,
                    async:false,
                    dataType:"json", //服务器返回数据的类型
                    contentType: 'application/json',
                    data:JSON.stringify(json1),
                    success:function(reg){
                        if(reg.resultCode=="200"){
                            tree.render({
                                elem: '#deptTree'
                                ,data: getDept()
                                ,edit: ['add', 'update', 'del'] //操作节点的图标
                            });
                            qingkong();
                            btnStyle(0);
                            layer.msg("操作成功！", {offset: '200px'});
                        }else{
                            layer.msg(reg.resultMsg, {offset: '200px'});
                        }
                    }
                });
            });
        }

        //开启节点操作图标
        // window.createDeptTree = tree.render({
        //     elem: '#deptTree'
        //     // ,id:"deptTree"
        //     ,data: getDept()
        //     ,edit: ['add', 'update', 'del'] //操作节点的图标
        // });

        /*//按钮事件
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
        });*/

        // 获取部门的数据并树形结构返回
        function getDept(){
            var a="";
            var json1 = {};
            json1.ASD=jsonASD;
            json1.pid = FID;
            getAjax({url:loadZdycdUrl,data:JSON.stringify(json1),callback:function (reg) {
                    a=reg.list;
                }
            });
            return a;
        };

        //表单验证方法
        form.verify({
            special: function(value){//特殊字符
                if(value != null && value != ''){
                    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                        return '不能有特殊字符';
                    }
                }
            },
            CODE: function(value, item){
                var reg = /^\w+$/;
                if (!reg.test(value)) {
                    return "["+item.title+"] 必须是字母或数字或下划线组成";
                }
            }
        });

        //通过一级目录传入的参数，查询二级目录的内容
        window.loadSecond = function(para){
            key1 = 1;
            para = JSON.parse(JSON.stringify(para));
            FID = para.id;
            FNAME = para.mc;
            qingkong();
            assignment(para);  //赋值
            btnStyle(2);
            //查询树形结构
            tree.render({
                elem: '#deptTree'
                ,data: getDept()
                ,edit: ['add', 'update', 'del'] //操作节点的图标
            });
        }
    })
});

function loadFirst(value) {
    btnStyle(0);
    xmid = value;
    FID = '';
    FNAME = '';
    $("#deptTree").html('');
    if(value == null || value == ''){
        layer.msg("所属项目不能为空！", {offset: '200px'});
        return false;
    }
    var json1 ={};
    jsonASD.code= rightCxCode ;
    json1.ASD=jsonASD;
    json1.tableName= tableName2 ;
    var jsonwhere = {};
    jsonwhere.pid = "-1";
    jsonwhere.ssxm = xmid;
    json1.where = jsonwhere ;
    json1.other = {'order':{'SXH':'ASC'}} ;
    $.ajax({
        type:"POST",
        url:commFindUrl ,
        async:true,
        dataType:"json", //服务器返回数据的类型
        contentType: 'application/json',
        data:JSON.stringify(json1),
        success:function(reg){
            if(reg.resultCode == '200'){
                var data=reg.resultData;
                var html = '<div class="first directory" onclick="firstAdd()">';
                html += '<div><img src="'+basePath+'img/menu/more_icon_add.png" /><div class="title">添加</div></div>';
                html += '</div>';
                for (var i=0;i<data.length;i++){
                    var id=data[i].id;
                    var icon=data[i].img;
                    var title=data[i].mc;
                    var div="<div class=\"first directory\" onclick='loadSecond("+JSON.stringify(data[i])+");' ondblclick='delFirst("+id+")'>" +
                        "                        <div>" +
                        "                            <img src=\""+basePath+"img/menu/menu1/gray/"+icon+"\">" +
                        "                            <div>"+title+"</div>" +
                        "                        </div>" +
                        "                    </div>";
                    html+=div;
                }
                $("#firstCon")[0].innerHTML=html;
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
                $("#firstCon")[0].innerHTML='';
            }

        }
    });
}

//一级级目录的添加
function firstAdd() {
    key1 = 1;
    qingkong();
    $("#PID").val(-1);
    btnStyle(1);
}

//二级目录上的添加
function firstAdd2(){
    key1 = 2;
    qingkong();
    if(FID == null || FID == ''){
        layer.msg("上级菜单不能为空！", {offset: '200px'});
        return false;
    }
    $("#PID").val(FID);
    $("#FNAME").html(FNAME);
    btnStyle(1);
}

function getBblx(){
    var json1={};
    json1.ASD=jsonASD;
    json1.tableName = tableName;
    var jsonwhere = {};
    jsonwhere.ATT1 = '2';
    jsonwhere.FBZT = '2';
    json1.where = jsonwhere;
    var jsonOther = {};
    jsonOther.order = {"EDIT_TIME": "desc"};
    json1.other = jsonOther;
    getAjax({url:commFindUrl,data:JSON.stringify(json1),callback:function (reg) {
            var list = reg.resultData;
            $("#ssxm").empty();
            $("#ssxm").append("<option value=''>请选择所属项目</option>")
            for (var i=0;i<list.length;i++){
                $("#ssxm").append("<option value='"+list[i].id+"'>"+list[i].name+"("+list[i].ywmc+")"+"</option>");
            }
        }
    });
}

//清空
function qingkong(){
    document.getElementById("editForm").reset();
    $("#PID").val('');
    $("#ID").val('');
    $("#FNAME").html('');
    $("#IMG").val('');
    $("#setIcon").attr('src',basePath+'img/menu/menu1/blue/xtgl.png');
    btnStyle(0);
}

//隐藏显示操作图标
function btnStyle(type) {
    $("#formDel").css("display","none");//隐藏
    $("#formUpd").css("display","none");//隐藏
    $("#formSub").css("display","none");//隐藏
    $("#formRes").css("display","none");//隐藏
    if(type==1){//新增
        $("#formSub").css("display","inline");//新增
        $("#formRes").css("display","inline");//重置
    }else if(type==2){//修改
        $("#formDel").css("display","inline");//删除
        $("#formUpd").css("display","inline");//修改
    }else if(type==3){
        $("#formUpd").css("display","inline");//修改
    }
}

function choseIcon() {
    var iconid = '';
    // if(key1 == 1){
        iconid = 'icon';
    // }else{
    //     iconid = 'icon2';
    // }
    //取消选中状态
    var list = document.getElementsByClassName(iconid);
    for (var i=0; i<list.length;i++){
        list[i].style.background='#86d2ff';
        list[i].classList.remove("iconActive");
    }

    var layer = layui.layer,$=layui.$;
    layer.open({
        type:1,//类型
        area:['385px','300px'],//定义宽和高
        title:'图标',//题目
        shadeClose:false,//点击遮罩层关闭
        btn: ['确定','关闭'],
        content: $('#'+iconid),//打开的内容
        yes:function (index,layero) {
            var a = $(".iconActive").attr("iconName");
            if(a != undefined){
                $("input[name='IMG']").val(a);
                // if(key1 == 1){
                    $("#setIcon").attr('src',basePath+'img/menu/menu1/gray/'+a);
                // }else{
                //     $("#setIcon").attr('src',basePath+'img/menu/menu23/gray/'+a);
                // }
            }
            layer.close(index);
        },
        btn2:function (index,layero) {
            layer.close(index);
        }
    });
}

function selMenu1(){
    $.ajax({
        url: 'json/menu1.json',
        async: true,
        success: function (reg) {
            var data = reg.data;
            var divs = '';
            for(var i=0;i<data.length;i++){
                divs += '<div class="icon" iconName="'+data[i].name+'"><img style="width: 100%;height: 100%" src="'+basePath+'img/menu/menu1/blue/'+data[i].name+'"></div>';
            }
            $("#icon").html(divs);
        }
    });
}

function selMenu2(){
    $.ajax({
        url: 'json/menu2.json',
        async: true,
        success: function (reg) {
            var data = reg.data;
            var divs = '';
            for(var i=0;i<data.length;i++){
                divs += '<div class="icon" iconName="'+data[i].name+'"><img style="width: 100%;height: 100%" src="'+basePath+'img/menu/menu23/blue/'+data[i].name+'"></div>';
            }
            $("#icon2").html(divs);
        }
    });
}

//表单初始赋值
function assignment(para) {
    layui.form.val('editForm', {
        "ID": para.id,
        "PID": para.pid,
        "CODE": para.code,
        "MC": para.mc,
        "SXH": para.sxh,
        "URL": para.url,
        "IMG": para.img
    });

    if(key1 == 1){
        $("#setIcon").attr('src',basePath+'img/menu/menu1/blue/'+para.img);
    }else{
        $("#setIcon").attr('src',basePath+'img/menu/menu23/blue/'+para.img);
    }

}