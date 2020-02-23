/*
  倪杨
  2019-09-19
  宣传内容
*/

$(function () {


    var i=0;
    var imgSize=0;
    var w=0;
    var h=0;
    var bl=0;
    var num=0;

    layui.use(['table','form','upload','laydate','layer','util'], function() {
        var table=layui.table,
            upload = layui.upload,
            laydate = layui.laydate,
            layer = layui.layer,
            util = layui.util,
            form=layui.form;
        var fileJson=[];//上传图片的基本信息
        var fileJson1=[];//上传图片的基本信息
        var files=new Array();

        var status="";
        var json ={};
        jsonASD.code=ptFindCode;
        json.ASD=jsonASD;
        json.tableName=tableName;
        // json.fildName="ID,PID,MC,BTIME,ETIME,ZT,PNAME,FJ";
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
                getPtGgw();
                form.render();
            },
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'MC', title: '宣传名称',   sort: true}
                , {field: 'PNAME', title: '宣传位',  sort: true}
                , {field: 'BTIME',width:150, title: '开始时间', sort: true,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.BTIME);
                    }}
                , {field: 'ETIME',width:150, title: '结束时间', sort: true,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd",obj.ETIME);
                    }}
                , {field: 'ZT',width:100, title: '是否启用',  sort: true,width:100,templet:function (obj) {
                        return getDataText("TYQY_ZT",obj.ZT);
                    }}
                ,  {title:'操作',width:200, templet:function (obj) {//toolbar:'#barConfig'
                        var json2={};
                        // json._TYQY={"ZT":{"1":"Y","2":"N"}};
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
            status="";
            layer.open({
                type:1,//类型
                area:['750px','450px'],//定义宽和高
                title:'广告内容',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['确定','关闭'],
                content: $('#operationPage'),//打开的内容
                yes:function (index,layero) {
                    $("#layui-layer"+index+" .layui-layer-btn0").attr("class","layui-layer-btn0 layui-btn-disabled");//确定按钮禁用
                    $("#formSubmit").click();
                    if(status=="SUCCESS"){
                        creatTable();
                        layer.close(index);
                        $("#fileButton").click();
                    }
                    $("#layui-layer"+index+" .layui-btn-disabled").attr("class","layui-layer-btn0");//取消确定按钮的禁用
                },
                btn2:function (index,layero) {
                    creatTable();
                    layer.close(index);
                }
            });
        };

     /*   laydate.render({
            elem: '#BTIME', //指定元素
        });
        laydate.render({
            elem: '#ETIME', //指定元素
        });
*/
        var max = null;
        var start = laydate.render({
            elem: '#BTIME',
            btns: ['clear', 'confirm'],
            done: function(value, date){
                endMax = end.config.max;
                end.config.min = date;
                end.config.min.month = date.month -1;
            }
        });
        var end = laydate.render({
            elem: '#ETIME',
            done: function (value, date) {
                if ($.trim(value) == '') {
                    var curDate = new Date();
                    date = {'date': curDate.getDate(), 'month': curDate.getMonth() + 1, 'year': curDate.getFullYear()};
                }
                start.config.max = date;
                start.config.max.month = date.month - 1;
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
                    $("#demoList").empty();
                    $("#demoList1").empty();
                    files=[];
                    break;
                case 'reset':
                    $("#ptGgnrName").val("");
                    $("#ptGgnrPid").val("");
                    form.render();
                    delete json.mc;
                    delete json.pid;
                    creatTable();
                    break;
                case 'findOnCondition':
                    if($("#ptGgnrName").val()!=""){
                        json.mc=$.trim($("#ptGgnrName").val());
                    }else{
                        delete json.mc;
                    }
                    if($("#ptGgnrPid").val()!=""){
                        json.pid=$("#ptGgnrPid").val();
                    }else{
                        delete json.pid;
                    }
                    table.init('conTable', Table);
                    $("#ptGgnrName").val(json.mc);
                    $("#ptGgnrPid").val(json.pid);
                    break;
            };
        });

        //监听行工具事件
        table.on('tool(conTable)', function(obj){
            if(obj.event === 'PTGL_XCGL_XCNR_DEL'){
                layer.confirm('你确定删除数据吗？删除后将无法恢复，请谨慎～',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                    var json1 ={};
                    jsonASD.code=deleteCode;
                    json1.ASD=jsonASD;
                    json1.tableName=tableName;
                    var jsonDelete={};
                    jsonDelete.ID=obj.data.ID;
                    json1.delete=jsonDelete;
                    json1.FJ=obj.data.FJ;

                    getAjax({url:delPtGgnrUrl,data:JSON.stringify(json1),callback:function (reg) {
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
            } else if(obj.event === 'PTGL_XCGL_XCNR_EDIT'){
                fileJson=[];
                fileJson1=[];
                status="";
                loadForm();
                $("#demoList").empty();
                $("#demoList1").empty();
                files=new Array();
                $("#hiddenId").val(obj.data.ID);
                form.val('form', {
                    "PID":obj.data.PID,
                    "MC":obj.data.MC,
                    "BTIME":dateFormat("yyyy-mm-dd",obj.data.BTIME),
                    "ETIME":dateFormat("yyyy-mm-dd",obj.data.ETIME),
                    "ZT":obj.data.ZT,
                    "FJ":obj.data.FJ,
                })
                var select = 'dd[lay-value=' + obj.data.PID + ']';
                $('#PID').siblings("div.layui-form-select").find('dl').find(select).click();

                fileJson1=obj.data.FJ;

                var fj=obj.data.FJ;
                if (fj !== null && fj !== undefined && fj !== '') {
                    fj = JSON.parse(fj);
                    for (var i=0;i<fj.length;i++){
                        var tr = $(['<tr id="upload-'+ i +'">'
                            ,'<td>'+ fj[i].fileNewName +'</td>'
                            ,'<td>'+ fj[i].fileSize +'</td>'
                            ,'<td>'+ '<img src="'+ fj[i].fileNewName +'"class="layui-upload-img">' +'</td>'
                            ,'<td>上传成功</td>'
                            ,'<td>'
                            ,'<span class="layui-btn layui-btn-xs layui-btn-danger" onclick="deleteFile(\''+fj[i].fileNewName+'\',this)">删除</span>'
                            ,'</td>'
                            ,'</tr>'].join(''));
                        $('#demoList1').append(tr);
                    }
                }
                form.render();
            } else if(obj.event === 'stop'){
                layer.confirm('你确定要停用该宣传吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
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
            } else if(obj.event === 'enable'){
                layer.confirm('你确定要启用该宣传吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
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
            }
        });

        window.deleteFile=function(NAME,_this){
            layer.confirm('你确定删除图片吗？',{title:"温馨提示",icon:7,maxWidth:400}, function(index){
                var json1 ={};
                json1.ASD=jsonASD;
                json1.ID=$("#hiddenId").val();
                json1.NAME=NAME;

                getAjax({url:delPtGgnrImgUrl,data:JSON.stringify(json1),callback:function (reg) {
                        layer.msg("操作成功！", {offset: '200px'});
                        var $trNode = $(_this).parent().parent();
                        $trNode.remove();
                        if (reg.resultData!=[]){
                            fileJson1=reg.resultData;
                            console.info("fileJson1:"+JSON.stringify(fileJson1));
                        }
                    }
                });

            });
        }

        //系统参数 表单提交
        form.on('submit(formSubmit)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#hiddenId").val()==""||$("#hiddenId").val()==null) {
                json.ASD.code=insertCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id,special+序列名字
                var jsonInsert = data.field;  //通过name值获取数据
                if (fileJson==""||fileJson==null||fileJson==[]||fileJson==undefined){
                    layer.msg("图片资源不能为空！", {offset: '200px'});
                    return false;
                }
                jsonInsert.FJ=fileJson;
                jsonInsert.ZT='2';
                json.insert=jsonInsert;
                jsonInsert.dateBTIME=data.field.BTIME;
                jsonInsert.dateETIME=data.field.ETIME;

                delete jsonInsert.BTIME;
                delete jsonInsert.ETIME;
                delete jsonInsert.file;

                url= insertUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#hiddenId").val();
                json.where=jsonWhere;
                var jsonFild=data.field;

                if (fileJson1 != null && fileJson1 != undefined && fileJson1 != '') {
                    fileJson1 = JSON.parse(fileJson1);
                    for (var i=0;i<fileJson1.length;i++){
                        fileJson.push(JSON.stringify(fileJson1[i]));
                    }
                }

                if (fileJson==""||fileJson==null||fileJson==[]||fileJson==undefined){
                    layer.msg("图片资源不能为空！", {offset: '200px'});
                    return false;
                }
                jsonFild.FJ=JSON.parse(JSON.stringify(fileJson));
                jsonFild.dateBTIME=data.field.BTIME;
                jsonFild.dateETIME=data.field.ETIME;

                delete jsonFild.BTIME;
                delete jsonFild.ETIME;
                delete jsonFild.file;

                json.fild=jsonFild;
                url= updateUrl;
            }

            getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
                    if(reg.resultCode == '200'){
                        status="SUCCESS";
                        layer.msg("操作成功！", {offset: '200px'});
                        // creatTable();
                        // layer.closeAll('page');
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }
            });
            return false;
        });


        form.on('select(PID)', function(data){
            var a = $(data.elem).find("option:selected").attr("GGW");
            a=JSON.parse(a);
            i=0;
            imgSize=0;
            w=a.wt;
            h=a.ht;
            bl=a.bl;
            num=a.zt_mnum;
            //多文件列表示例
            uploadListIns.reload({
                size:a.zp_size
            });
        });

        var demoListView = $('#demoList')
            ,uploadListIns = upload.render({
            elem: '#testList'
            ,url: filesUploadUrl
            ,accept: 'images'
            ,exts: 'jpg|png|gif|bmp|jpeg'
            ,multiple: true
            ,auto: false
            ,size:100
            ,bindAction: '#fileButton'
            ,before:function (obj) {
                var j={};
                j.src=GGFileUploadSrc;
                j.ASD=jsonASD;
                // this.data={"src":GGFileUploadSrc,"ASD":JSON.stringify(jsonASD)};
                this.data=j;
                // layer.msg('图片上传中...', {
                //     icon: 16,
                //     shade: 0.01,
                //     time: 0
                // })
            }
            ,choose: function(obj){
                files = obj.pushFile(); //将每次选择的文件追加到文件队列
                //读取本地文件
                obj.preview(function(index, file, result){
                    files[index]=file;
                    var img = new Image();
                    img.src = result;
                    img.onload = function () { //初始化夹在完成后获取上传图片宽高，判断限制上传图片的大小。
                        if (img.width < w || img.height < h){
                            layer.msg("您上传的图片必须宽大于"+w+"高大于"+h, {offset: '200px'});
                        }else if ((img.width/img.height).toFixed(2)*100>=(bl+bl*0.1)||(img.width/img.height).toFixed(2)*100<=(bl-bl*0.1)){
                            layer.msg("您上传的图片宽高比例为"+bl+"%,浮动在10%", {offset: '200px'});
                        } else if (imgSize>=num){
                            layer.msg("您最多能上传"+num+"张图片！", {offset: '200px'});
                        } else{
                            var s={};
                            s.fileOldName=file.name;
                            var newName=new Date().getTime()+"_"+file.name;
                            obj.resetFile(index,file,newName);
                            s.fileNewName=newName;
                            s.fileSize=(file.size/1024).toFixed(1)+"kb";
                            s.fileSrc=GGFileUploadSrc+newName;
                            s.fileType=newName.split(",")[1];
                            s.fileWidth=img.width;
                            s.fileHeight=img.height;
                            fileJson.push(JSON.stringify(s));
                            i=i+1;
                            var tr = $(['<tr id="upload-'+ index +'">'
                                ,'<td>'+ file.name +'</td>'
                                ,'<td>'+ (file.size/1024).toFixed(1) +'kb</td>'
                                ,'<td>'+'<img src="'+result+'">'+'</td>'
                                ,'<td>等待上传</td>'
                                ,'<td>'
                                ,'<button class="layui-btn layui-btn-xs demo-reload layui-hide">重传</button>'
                                ,'<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">删除</button>'
                                ,'</td>'
                                ,'</tr>'].join(''));

                            //单个重传
                            tr.find('.demo-reload').on('click', function(){
                                obj.upload(index, file);
                            });

                            //删除
                            tr.find('.demo-delete').on('click', function(){
                                var name = files[index].name;
                                for (var i = 0;i<fileJson.length;i++){
                                    if (JSON.parse(fileJson[i]).fileNewName==name){
                                        fileJson.splice(i,1);
                                    }
                                }
                                delete files[index]; //删除对应的文件
                                tr.remove();
                                uploadListIns.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
                            });
                            demoListView.append(tr);
                            imgSize+=1;
                        }
                    };
                });
            }
            ,done: function(res, index, upload){
                if(res.code == 0){ //上传成功
                    layer.close(layer.msg());
                    // $("#formSubmit").click();
                    var tr = demoListView.find('tr#upload-'+ index)
                        ,tds = tr.children();
                    tds.eq(3).html('<span style="color: #5FB878;">上传成功</span>');
                    tds.eq(4).html(''); //清空操作
                    return delete files[index]; //删除文件队列已经上传成功的文件
                }
                this.error(index, upload);
            }
            ,error: function(index, upload){
                var tr = demoListView.find('tr#upload-'+ index)
                    ,tds = tr.children();
                tds.eq(3).html('<span style="color: #FF5722;">上传失败</span>');
                tds.eq(4).find('.demo-reload').removeClass('layui-hide'); //显示重传
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
                    id:$("#hiddenId").val()
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
                if(!new RegExp("^[1-9]\\d*$").test(value)){
                    return "["+item.title+"] 必须是正整数";
                }
            }
        });

        creatTable();//表格初始化，一定放在初始化方法之后

    });

    function getPtGgw(){
        var json={};
        json.ASD=jsonASD;
        getAjax({url:loadPtGgwUrl,data:JSON.stringify(json),callback:function (reg) {
                if (reg.resultCode=="200"){
                    var list = reg.resultData;
                    $("#PID").empty();
                    $("#PID").append("<option value=''>请选择宣传位</option>");
                    for (var i=0;i<list.length;i++){
                        $("#PID").append("<option value='"+list[i].id+"' GGW='"+JSON.stringify(list[i])+"'>"+list[i].mc+"</option>");
                    }
                    $("#ptGgnrPid").empty();
                    $("#ptGgnrPid").append("<option value=''>请选择宣传位</option>");
                    for (var i=0;i<list.length;i++){
                        $("#ptGgnrPid").append("<option value='"+list[i].id+"' GGW='"+JSON.stringify(list[i])+"'>"+list[i].mc+"</option>");
                    }
                }
            }
        });
    }
    
});

