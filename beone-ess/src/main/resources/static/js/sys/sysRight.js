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

//图标选中
$(document).on('click', '.icon4', function(){
    var list = document.getElementsByClassName("icon4");
    for (var i=0; i<list.length;i++){
        list[i].style.background='#86d2ff';
        list[i].classList.remove("iconActive");
    }
    this.style.background='red';
    this.classList.add("iconActive");
});

//展示一级目录
function loadFirst() {
    btnStyle(1);
    $("#PID").val("-1");
    key1 = 1;
    $("#secondCon").html('');
    var json ={};
    jsonASD.code= rightCxCode ;
    json.ASD=jsonASD;
    json.tableName= tableName ;
    json.where = {'PID':'-1'} ;
    json.other = {'order':{'RORDER':'ASC'}} ;
    $.ajax({
        type:"POST",
        url:commFindUrl ,
        async:true,
        dataType:"json", //服务器返回数据的类型
        contentType: 'application/json',
        data:JSON.stringify(json),
        success:function(reg){
            if(reg.resultCode == '200'){
                var data=reg.resultData;
                data = upperListKey(data);
                var html = '<div class="first directory" onclick="firstAdd()">';
                html += '<div><img src="'+basePath+'img/menu/more_icon_add.png" /><div class="title">添加</div></div>';
                html += '</div>';
                for (var i=0;i<data.length;i++){
                    var id=data[i].ID;
                    var icon=data[i].ICON;
                    var title=data[i].NAME;

                    var div="<div class=\"first directory\" onclick='loadSecond("+JSON.stringify(data[i])+");choose1(this);' ondblclick='delFirst("+id+")'>" +
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

//通过一级目录传入的参数，查询二级目录的内容
function loadSecond(para) {
    key1 = 1;
    para = JSON.parse(JSON.stringify(para));
    para.FID = '-1' ;
    rightParam = para ;

    $("#zylx").hide();
    document.getElementById("editForm").reset();
    $(".third").css("display","none");//隐藏
    $("#qx_ywgz").css("display","none");//隐藏
    $("#editBox").attr("class","layui-col-xs9");//隐藏
    assignment(para);  //赋值
    $("#FNAME").html('');

    var json ={};
    jsonASD.code= rightCxCode ;
    json.ASD=jsonASD;
    json.tableName= tableName ;
    json.where = {'PID':para.ID} ;
    json.other = {'order':{'RORDER':'ASC'}} ;
    $.ajax({
        type:"POST",
        url:commFindUrl,
        async:true,
        dataType:"json", //服务器返回数据的类型
        contentType: 'application/json',
        data:JSON.stringify(json),
        success:function(reg){
            if(reg.resultCode == '200'){
                var data=reg.resultData;
                data = upperListKey(data);
                if(data != ''){
                    btnStyle(3);
                }else{
                    btnStyle(2);
                }
                var html=" <div class=\"second directory\" onclick='secondAdd("+JSON.stringify(para)+")'>" +
                    "                        <div>" +
                    "                            <img src=\""+basePath+"img/menu/more_icon_add.png\">" +
                    "                            <div>添加</div>" +
                    "                        </div>" +
                    "                    </div>";
                for (var i=0;i<data.length;i++){
                    var id=data[i].ID;
                    var icon=data[i].ICON;
                    var title=data[i].NAME;

                    var div="<div class=\"second directory\" onclick='loadThird("+JSON.stringify(data[i])+");choose2(this);' ondblclick=\"delSecond("+id+")\">" +
                        "                        <div>\n" +
                        "                            <img src=\""+basePath+"img/menu/menu23/gray/"+icon+"\">" +
                        "                            <div>"+title+"</div>" +
                        "                        </div>" +
                        "                    </div>";
                    html+=div;
                }
                $("#secondCon")[0].innerHTML=html;
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
                $("#secondCon")[0].innerHTML='';
            }
        }
    });
}

//通过二级目录传入的参数，查询三级以及四级目录的内容
function loadThird(parm) {
    key1=2;
    parm=JSON.parse(JSON.stringify(parm));
    parm.FID = rightParam.ID ;
    $("#zylx").hide();
    document.getElementById("editForm").reset();
    $(".third").css("display","block");
    $("#qx_ywgz").css("display","none");//隐藏
    $("#editBox").attr("class","layui-col-xs4");
    $("#thirdTitle").html(parm.NAME);
    $("#thirdTitleID").val(JSON.stringify(parm));
    $("#FNAME").html(rightParam.NAME);
    assignment(parm);
    rightParam2 = parm ; //赋值上级对象

    var json ={};
    jsonASD.code= rightCxCode ;
    json.ASD=jsonASD;
    json.tableName= tableName ;
    json.where=' RIGHT_PID = ' + parm.ID ;
    json.order= ' RIGHT_ORDER ASC ' ;

    $.ajax({
        type:"POST",
        url:findRightOtherUrl,
        async:true,
        dataType:"json", //服务器返回数据的类型
        contentType: 'application/json',
        data:JSON.stringify(json),
        success:function(reg){
            if(reg.resultCode == '200') {
                var data = reg.resultData;
                data = upperListKey(data);
                if (data != '') {
                    btnStyle(3);
                } else {
                    btnStyle(2);
                }
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    var id = data[i].ID;
                    var icon = data[i].ICON;
                    var title = data[i].NAME;
                    var div = "<div class=\"third-content-submenu\">" +
                        "                    <label onclick='thridUpd(" + JSON.stringify(data[i]) + ")'>" +
                        title +
                        "                    </label>" +
                        "                    <div class=\"third-content-submenu-con\">" +
                        "                        <div class=\"iconbox\">" +
                        "                            <img title='新增' src=\""+basePath+"img/menu/more_icon_add.png\" onclick='fourthAdd(" + JSON.stringify(data[i]) + ");'></div>";
                    var fourth = data[i].FOURTH;
                    if(fourth != null && fourth != '' && fourth != undefined){
                        fourth = upperListKey(fourth);
                        for (var j = 0; j < fourth.length; j++) {
                            var Fid = fourth[j].ID;
                            var Ficon = fourth[j].ICON;
                            var Ftitle = fourth[j].NAME;
                            div += "<div class=\"iconbox\"><img title='" + Ftitle + "' src=\""+basePath+"img/menu/menu4/gray/" + Ficon + "\" onclick='fourthUpd(" + JSON.stringify(fourth[j]) + "," + JSON.stringify(data[i]) + ")'></div>";
                        }
                    }
                    div += "                        </div>" +
                        "                    </div>" +
                        "                </div>";
                    html += div;
                }
                $("#thirdCon")[0].innerHTML = html;
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
                $("#thirdCon")[0].innerHTML='';
            }
        }
    });
}


//选择第一级目录
function choose1(obj){
    //取消原来选中的
    $("#firstCon").find(".cdactive").each(function(){
        var url = $(this).find("img").attr("src");
        url =  url.replace('blue','gray');
        $(this).find("img").attr("src", url);
        $(this).removeClass("cdactive");
    });
    //当前选中
    $(obj).addClass("cdactive");
    var url = $(obj).find("img").attr("src");
    url =  url.replace('gray','blue');
    $(obj).find("img").attr("src", url);
}

//选中二级目录
function choose2(obj){
    //取消原来选中的
    $("#secondCon").find(".cdactive").each(function(){
        var url = $(this).find("img").attr("src");
        url =  url.replace('blue','gray');
        $(this).find("img").attr("src", url);
        $(this).removeClass("cdactive");
    });
    //当前选中
    $(obj).addClass("cdactive");
    var url = $(obj).find("img").attr("src");
    url =  url.replace('gray','blue');
    $(obj).find("img").attr("src", url);
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

//一级级目录的添加
function firstAdd() {
    key1 = 1;
    parm1 = '';
    $("#zylx").hide();
    qingkong();
    $(".third").css("display","none");//隐藏
    $("#qx_ywgz").css("display","none");//隐藏
    $("#editBox").attr("class","layui-col-xs9");//隐藏
    $("input[name='PID']").val(-1);
    $("#setIcon").attr('src',basePath+'img/menu/menu1/blue/nav_icon_xtsz.png');
    btnStyle(1);
}
//二级目录的添加
function secondAdd(parm) {
    key1 = 2;
    parm1 = parm;
    parm = JSON.parse(JSON.stringify(parm));
    $("#zylx").hide();
    $(".third").css("display","none");
    $("#qx_ywgz").css("display","none");//隐藏
    $("#editBox").attr("class","layui-col-xs9");
    qingkong();
    $("input[name='PID']").val(parm.ID);
    $("input[name='CODE']").val(parm.CODE);
    $("#FNAME").html(parm.NAME);
    $("#setIcon").attr('src',basePath+'img/menu/menu1/blue/nav_icon_xtsz.png');
    btnStyle(1);
}
//三级目录的添加
function thridAdd() {
    key1=3;
    $("#zylx").hide();
    $(".third").css("display","block");
    $("#qx_ywgz").css("display","none");//隐藏
    $("#editBox").attr("class","layui-col-xs4");
    var parm = JSON.parse(JSON.stringify($("#thirdTitleID").val()));
    parm = JSON.parse(parm);
    qingkong();
    $("input[name='PID']").val(parm.ID);
    $("input[name='CODE']").val(parm.CODE);
    $("#FNAME").html(parm.NAME);
    $("#setIcon").attr('src',basePath+'img/menu/menu1/blue/nav_icon_xtsz.png');
    btnStyle(1);

}
//四级目录的添加
function fourthAdd(parm) {
    key1=4;
    parm=JSON.parse(JSON.stringify(parm));
    $(".third").css("display","block");
    $("#qx_ywgz").css("display","block");//显示
    $("#editBox").attr("class","layui-col-xs4");
    qingkong();
    $("input[name='PID']").val(parm.ID);
    $("input[name='CODE']").val(parm.CODE);
    $("#FNAME").html(parm.NAME);
    $("input[name=TYPE][value='2']").attr("checked", true);
    $("#setIcon").attr('src',basePath+'img/menu/menu1/blue/nav_icon_xtsz.png');
    layui.form.render();
    btnStyle(1);
}

//点击三级菜单修改
function thridUpd(para) {
    if(para.FOURTH.length > 0){
        btnStyle(3);
    }else{
        btnStyle(2);
    }
    key1=3;

    $("#zylx").hide();
    $("#qx_ywgz").css("display","none");//隐藏
    qingkong();
    para.FID = rightParam2.ID ;
    assignment(JSON.parse(JSON.stringify(para)));
    $("#FNAME").html(rightParam2.NAME);
}

//点击四级按钮修改
function fourthUpd(para,fpara) {
    $("#qx_ywgz").css("display","block");//显示
    btnStyle(2);
    key1=4;
    qingkong();
    para.FID = fpara.ID ;
    $("#FNAME").html(fpara.NAME);
    rightYwpt = fpara.YWPT ;
    assignment(JSON.parse(JSON.stringify(para)));
}

//表单初始赋值
function assignment(para) {
    layui.form.val('editForm', {
        "ID": para.ID,
        "PID": para.FID,
        "TYPE": para.TYPE,
        "CODE": para.CODE,
        "NAME": para.NAME,
        "RORDER": para.RORDER,
        "URL": para.URL,
        "GXNAME": para.GXNAME,
        "ICON": para.ICON,
        "ATT1": para.ATT1
    });
    var apv = para.YWPT.split(","); //将数据以，（逗号）分割形成数组（res.data.zxyj是从后台获取到的数据（形如：1，2，3））
    $("[name=YWPT]:checkbox").prop("checked", false);
    if(apv != "") {
        for(var i = 0; i < apv.length; i++) {
            $("[name=YWPT][value=" + apv[i] + "]").prop("checked", true);
        }
    }

    if(para.ATT1 != null){
        var att = para.ATT1.split(","); //将数据以，（逗号）分割形成数组（res.data.zxyj是从后台获取到的数据（形如：1，2，3））
        $("[name=ATT1]:checkbox").prop("checked", false);
        if(att != "") {
            for(var i = 0; i < att.length; i++) {
                $("[name=ATT1][value=" + att[i] + "]").prop("checked", true);
            }
        }
    }

    if(key1 == 1){
        $("#setIcon").attr('src',basePath+'img/menu/menu1/blue/'+para.ICON);
    }else if(key1 == 4){
        $("#setIcon").attr('src',basePath+'img/menu/menu4/gray/'+para.ICON);
    }else{
        $("#setIcon").attr('src',basePath+'img/menu/menu23/blue/'+para.ICON);
    }

}

function choseIcon() {
    var iconid = '';
    if(key1 == 1){
        iconid = 'icon';
    }else if(key1 == 4){
        iconid = 'icon4';
    }else{
        iconid = 'icon2';
    }
    // console.log(key1+'=='+iconid);
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
                $("input[name='ICON']").val(a);
                if(key1 == 1){
                    $("#setIcon").attr('src',basePath+'img/menu/menu1/gray/'+a);
                }else if(key1 == 4){
                    $("#setIcon").attr('src',basePath+'img/menu/menu4/gray/'+a);
                }else{
                    $("#setIcon").attr('src',basePath+'img/menu/menu23/gray/'+a);
                }
            }
            layer.close(index);
        },
        btn2:function (index,layero) {
            layer.close(index);
        }
    });
}

//清空
function qingkong(){
    document.getElementById("editForm").reset();
    $("#PID").val('');
    $("#ID").val('');
    $("#ICON3").val('');
    $("#FNAME").html('');
}

//权限操作验证
layui.use(['layer', 'form'], function(){
    var form = layui.form;
    var layer = layui.layer

    form.verify({
        CODE: function(value,item){ //value：表单的值、item：表单的DOM对象
            if(value == null || value == ''){
                return '权限编码不能为空！';
            }
            if(!new RegExp("^[A-Za-z0-9_]+$").test(value)){
                return '权限编码只能是字母数字下划线';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
                return '权限编码首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
                return '权限编码不能全为数字';
            }
            var checkResult="1";
            var param={
                tableName:tableName,
                key:item.name,
                value:value,
                id:$("#ID").val(),
            };
            $.ajax({
                url:uniqueUrl,
                type: "POST",
                dataType: "json",
                data: JSON.stringify(param),
                contentType : "application/json",
                async: false,
                success: function(reg) {
                    if(reg.status!="200"){
                        checkResult = "2";
                    }
                },
                error: function() {
                    console.info("fucking error");
                }
            });
            if (checkResult=="2"){
                return "["+item.title+"] 为 '"+value+"' 的已存在！";
            }
        },
        NAME: function (value) {
            if(value == null || value == ''){
                return '权限名称不能为空！';
            }
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
                return '权限名称不能有特殊字符';
            }
        },
        URL: function (value) {
            if(value != null && value != ''){
                if(!new RegExp("^[A-Za-z0-9_/]+$").test(value)){
                    return '访问地址由字母数字下划线斜杠组成';
                }
            }
        },
        RORDER:function (value,item) {
            var checkResult="1";
            var param={
                tableName:tableName,
                key:item.name,
                value:value,
                id:$("#ID").val(),
                pid:$("#PID").val(),
                ASD:getJsonASD()
            }
            $.ajax({
                url:uniquePIDUrl,
                type: "POST",
                dataType: "json",
                data: JSON.stringify(param),
                contentType : "application/json",
                async: false,
                success: function(reg) {
                    if(reg.status!="200"){
                        checkResult = "2";
                    }
                },
                error: function() {
                    console.info("fucking error");
                }
            });
            if (checkResult=="2"){
                return "["+item.title+"] 为 '"+value+"' 的已存在！";
            }
        }
    });

    form.on('checkbox(YWPT)', function(data){
        var check_val = [];
        var NAME = $("input[name='NAME']").val();
        var  check= document.getElementsByName("YWPT");
        for(var k in check){
            if(check[k].checked){
                check_val.push(NAME);
            }
        }
        $("input[name='GXNAME']").val(JSON.stringify(check_val));
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

    //删除
    $(document).on('click','#formDel',function(){
        layer.confirm('确定删除?',{btn: ['确定', '取消'],title:"提示"}, function(){
            var json ={};
            jsonASD.code= rightDelCode ;
            json.ASD=jsonASD;
            json.tableName= tableName ;
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
                        if (key1==1){
                            loadFirst();
                            $("#secondCon")[0].innerHTML="";
                        }else if (key1==2){
                            loadSecond(rightParam);
                        }else if (key1==3 || key1==4){
                            loadThird(rightParam2);
                        }
                        qingkong();
                        layer.msg("删除成功", {offset: '200px'});
                    }else{
                        layer.msg(data.resultMsg, {offset: '200px'});
                    }
                }
            });
        });
        return false;
    });

    // form.on('submit(formDelete)', function(data){
    //
    // });
});

//业务验证
function rightVilidate(jsonInsert,ytype){
    if(key1!=4){ //判断菜单按钮 1菜单 2按钮
        jsonInsert.TYPE = '1';
    }else{
        jsonInsert.TYPE = '2';
    }
    //由于layui中重新编写了复选框的代码。所以获取复选框选中值时不能通过input[name='']获取，必须重新编写获取方法，如下：
    var check_val = [];
    var  check= document.getElementsByName("YWPT");
    for(var k in check){
        if(check[k].checked){
            if(key1 == 2 && rightParam != '' && rightParam.YWPT.indexOf(check[k].value) == -1){
                layer.msg("权限类型【"+check[k].title+"】不在父类权限类型当中！", {offset: '200px'});
                return false;
            }else if(key1 == 3  && rightParam2 != '' && rightParam2.YWPT.indexOf(check[k].value) == -1){
                layer.msg("权限类型【"+check[k].title+"】不在父类权限类型当中！", {offset: '200px'});
                return false;
            }else if(key1 == 4  && rightYwpt != '' && rightYwpt.indexOf(check[k].value) == -1){
                layer.msg("权限类型【"+check[k].title+"】不在父类权限类型当中！", {offset: '200px'});
                return false;
            }else{
                check_val.push(check[k].value);
            }
        }
    }

    if(check_val == null || check_val == ''){
        layer.msg("权限类型不能为空！", {offset: '200px'});
        return false;
    }
    var GXNAME = jsonInsert.GXNAME;
    if(GXNAME == null || GXNAME == ''){
        layer.msg("资源别名不能为空！", {offset: '200px'});
        return false;
    }
    var ICON = jsonInsert.ICON;
    if(ICON == null || ICON == ''){
        layer.msg("菜单图标不能为空！", {offset: '200px'});
        return false;
        // jsonInsert.ICON="tool_icon_qxgl1.png";
    }
    //结束，check_val 为name="RIGHT_YWPT"复选框的值，为数组格式
    jsonInsert.YWPT=check_val.join(",");    //将得到的复选框结果生成以","隔开的字符串，并将该结果注入到结果（json）中。
    if(check_val.length != eval(jsonInsert.GXNAME).length){
        layer.msg("权限类型和资源别名数量不匹配！", {offset: '200px'});
        return false;
    }

    if (key1==3){
        var URL = jsonInsert.URL;
        if(URL == null || URL == ''){
            layer.msg("三级目录的访问地址不能为空！", {offset: '200px'});
            return false;
        }
    }

    var att_val = [] ;
    var  att= document.getElementsByName("ATT1");
    for(var k in att){
        if(att[k].checked){
            att_val.push(att[k].value);
        }
    }
    jsonInsert.ATT1=att_val.join(",");    //将得到的复选框结果生成以","隔开的字符串，并将该结果注入到结果（json）中。

    var url = "" ;
    var json ={};
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
    }
    json.ASD=jsonASD;
    json.tableName = tableName;
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
                    loadFirst();
                    $("#secondCon")[0].innerHTML="";
                }else if (key1==2){
                    loadSecond(rightParam);
                }else if (key1==3 || key1==4){
                    loadThird(rightParam2);
                }
                qingkong();
                layer.msg("操作成功", {offset: '200px'});
            }else{
                layer.msg(data.resultMsg, {offset: '200px'});
            }
        }
    });

    return false;
}