$(function () {
    layui.use(['form','layer','tree','util','table'], function() {

        var form=layui.form,
            tree=layui.tree,
            util=layui.util,
            table=layui.table,
            layer=layui.layer;
        //头工具栏事件
        table.on('toolbar(sbmbTable)', function(obj){
            switch(obj.event){
                case 'reset':
                    $("#MC").val('');
                    $("#XLH").val('');
                    $("#LB").val('');
                    selSblist();
                    break;
                case 'findConfig':
                    var MC = $("#MC").val();
                    var XLH = $("#XLH").val();
                    var LB = $("#LB").val();
                    selSblist();
                    $("#MC").val(MC);
                    $("#XLH").val(XLH);
                    $("#LB").val(LB);
                    break;
            }
        });
        //头工具栏事件
        table.on('toolbar(sbmbTable2)', function(obj){
            switch(obj.event){
                case 'reset2':
                    $("#MC2").val('');
                    $("#XLH2").val('');
                    $("#LB2").val('');
                    selJblist();
                    break;
                case 'findConfig2':
                    var MC = $("#MC2").val();
                    var XLH = $("#XLH2").val();
                    var LB = $("#LB2").val();
                    selJblist();
                    $("#MC2").val(MC);
                    $("#XLH2").val(XLH);
                    $("#LB2").val(LB);
                    break;
            }
        });
        //分页实现方法
        window.getList = function(page,callback){
            // layui.layer.load();
            var params = {
                pageSize : '8',
                pageNo : page,
                ASD:jsonASD,
                yj_mc : $("#yj_mc").val(),
                yjlx_id:$("#yjlx_id").val(),
                only_bond:$("input[name='only_bond']:checked").val()
            };
            getAjax({url:yjListUrl,data:JSON.stringify(params),callback:function (reg) {
                    if (reg.resultCode=="200"){
                        if (reg.total == '0') {
                            $('#myyj_table').html("<div style='text-align:center'>暂无数据</div>");
                        } else {
                            d3url = reg.d3url;
                            var num = parseInt(reg.total / params.pageSize);
                            var pnum = reg.total % params.pageSize;
                            if (pnum != 0)
                                num += 1;
                            jsonRows = eval(reg.data);
                            onResize();
                            typeof callback === 'function' && callback({
                                totalPage: num
                            });
                        }
                    }else{
                        layui.layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }});

        }

        $('#pager').pageInit(getList); //设置分页

    });
});


//获取窗口大小*/
/*window.addEventListener( 'resize', onResize, false );*/
function onResize(){
    bodyWidth = document.body.scrollWidth ;
    json_table();
}

//拼装数据
function json_table(){
    var html = '' ;
    var size = 0;
    if (jsonRows != null && jsonRows != '') {
        size = jsonRows.length;
    }
    var bond_list;
    var ybdsb = '';
    for (var i = 0; i < size; i++) {
        var obj  = jsonRows[i] ;
        var icon_path = obj.fjtp;     //图片路径
        var mxfj = obj.fjdz;
        var filePathName = "" ;  //文件名称
        var fileName = obj.fjmc;
        var fileName2 = '';
        var yj_id = obj.yj_id;
        var sfbd = obj.sfbd;
        bond_list = obj.bond_list;
        ybdsb = '';
        if(bond_list != undefined && bond_list != 'undefined'){
            for(var m=0;m<bond_list.length;m++){
                ybdsb += bond_list[m].serial_num+',';
            }
        }
        console.log("bond_list:"+bond_list);
        if(bodyWidth<500) {
            if(i%1==0){
                if(i!=0)
                    html += '</div>' ;
                html += '<div class="row">' ;
            }
            html += '<div class="layui-col-md12">' ;
        }else if(bodyWidth<800) {
            if(i%2==0){
                if(i!=0)
                    html += '</div>' ;
                html += '<div class="row">' ;
            }
            html += '<div class="layui-col-md6">' ;
        }else if(bodyWidth<1100) {
            if(i%3==0){
                if(i!=0)
                    html += '</div>' ;
                html += '<div class="row">' ;
            }
            html += '<div class="layui-col-md4">' ;
        }else{

            if(i%4==0){
                if(i!=0)
                    html += '</div>' ;
                html += '<div class="row">' ;
            }
            html += '<div class="layui-col-md3">' ;
        }

        html += '<div title="预览" style="width:100% ;height: 250px ;line-height: 250px;background-color: #ECECEC;position:relative;text-align:center;margin-top: 20px;" onmouseover="to_over(\''+obj.yj_id+'\');" onmouseout="to_out(\''+obj.yj_id+'\');" onclick="modelShow(\''+mxfj+'\',\''+obj.yj_id+'\');">' +
            '<img style="max-height: 250px;position:absolute;top:50%;left:50%;transform: translate(-50%,-50%);" src="'+icon_path+'" class="img-responsive"/>' ;
        html += '</div>';
        if(getLength(fileName) > 15){
            fileName2 = cutstr(fileName, 15);
        }else{
            fileName2 = fileName;
        }
        html += '<div title="'+fileName+'" style="float:left;margin:20px 0px 15px 15px;font-size:16px;color: #333333;">'+fileName2+'</div>';
        html += '<div style="float:right;margin:25px 10px;font-size:10px;color: #888888">';
        html += '<a class="layui-btn layui-btn-radius layui-btn-normal layui-btn-xs"  href="javascript:void(0);" onclick="sbbdpage(\''+ yj_id+'\',\''+ ybdsb +'\');">&nbsp;绑定&nbsp;</a>';
        if(sfbd == '1'){
            html += '<a class="layui-btn layui-btn-radius layui-btn-danger layui-btn-xs" style="margin-left: 10px;" href="javascript:void(0);" onclick="jbpage(\''+ yj_id+'\');">&nbsp;解绑&nbsp;</a>';
        }else{
            html += '<a class="layui-btn layui-btn-radius layui-btn-danger layui-btn-xs" style="margin-left: 10px;" href="javascript:void(0);" onclick="jbpage(\''+ yj_id+'\');">&nbsp;解绑&nbsp;</a>';
        }

        html += '</div>';
        html += '</div>';
    }

    if(size>0){
        html += '</div>' ;
    }
    console.log(html);
    $('#myyj_table').html(html);
}

//获取字符串的长度
function getLength(str) {
    if(str == undefined){
        str = '';
    }
    //<summary>获得字符串实际长度，中文2，英文1</summary>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

//截取字符串长度
function cutstr(str, len) {
    // str=getPureTextOfHtml(str);
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
        return str;
    }
}

//鼠标移上去事件
function to_over(id) {
    $('#dele_div'+id).css('display','block');
    $('#buttom_div'+id).css('display','block');
}

//鼠标移开事件
function to_out(id) {
    $('#dele_div'+id).css('display','none');
    $('#buttom_div'+id).css('display','none');
}

// 预览元件，加载预览页面
function modelShow(mxfj,yj_id) {
    if (mxfj == null || mxfj == '') {
        layer.msg('元件附件不存在！');
    } else {
        var ylurl = d3url + "otheAPI/viewYJ";
        var array = new Array();
        array.push(mxfj)
        mxfj = encodeURI(encodeURI(JSON.stringify(array)));
        var params = {
            url:mxfj
        }
        layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            // top:-100,
            area:['800px','500px'],//定义宽和高
            // skin: 'layui-layer-nobg', //没有背景色
            shadeClose: true,
            content: $('#photoPage')
        });

        layui.layer.load();
        getAjax({url:ylurl,data:JSON.stringify(params),callback:function (reg) {
                layui.layer.closeAll('loading');
                if(reg.status == '200'){
                    var url = d3url+reg.data.viewurl;
                    var t=document.getElementById("Example2");
                    t.contentWindow.location.href = url;
                }else{
                    layer.msg(reg.resultMsg, {offset: '200px'});
                }
            }});
    }
}

//设备查询
var ybdsbs = '';
function sbbdpage(yj_id, ybdsb){
    c_yj_id = yj_id;
    ybdsbs = ybdsb;
    selSblist();
    layer.open({
        type:1,//类型
        area:['800px','500px'],//定义宽和高
        title:'原件绑定',//题目
        shadeClose:false,//点击遮罩层关闭
        btn: ['绑定','关闭'],
        content: $('#sbmbPage'),//打开的内容
        yes:function (index,layero) {
            var checkStatus = layui.table.checkStatus('user1');
            var devces = [];
            $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
                var pone = {};
                pone.yj_id = c_yj_id;
                pone.serial_num = o.MAC;
                pone.equip_name = o.MC;
                devces.push(pone);
            });
            if (devces.length < 1) {
                layer.msg('请选择要绑定是设备！');
                return false;
            }
            var params = {
                bond_list:devces,
                ASD:jsonASD
            }
            layui.layer.load();
            getAjax({url:sbBindUrl,data:JSON.stringify(params),callback:function (reg) {
                    layui.layer.closeAll('loading');
                    if(reg.resultCode == '200'){
                        layer.close(index);
                        $('#pager').pageInit(getList);
                        layer.msg("绑定成功！", {offset: '200px'});
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }});
        },
        btn2:function (index,layero) {
            layer.close(index);
        }
    });
}

function selSblist(){
    var json1 ={};
    json1.ASD=jsonASD;
    json1.ASD.code = ptFindCode;
    json1.tableName=tableName;
    json1.fildName="ID,XLH,MAC,MC,LB";
    var jsonWhere={};
    jsonWhere.BORG_ID=belong_org_id;
    json1.where=jsonWhere;
    var wherelike={};
    if($("#MC").val()!= ''){
        wherelike.MC=$("#MC").val();
    }
    if($("#XLH").val() != ''){
        wherelike.XLH=$("#XLH").val();
    }
    if($("#LB").val() != ''){
        wherelike.LB=$("#LB").val();
    }
    json1.wherelike=wherelike;
    layui.table.render({
        elem: '#sbmbTable'
        ,toolbar:'#toolbarConfig'
        ,id:'user1'
        ,height: 400
        ,url: sblistUrl //数据接口
        ,contentType:'application/json'
        ,page: false //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json1 //接口的其它参数
        ,defaultToolbar:[]
        ,done: function(res, page, count){
            if(ybdsbs != ''){
                var data = res.data;
                for(var i=0;i<data.length;i++){
                    // data[i]["LAY_CHECKED"]='true';
                    var index= res.data[i]['LAY_TABLE_INDEX'];
                    console.log(ybdsbs);
                    console.log(res.data[i].MAC);
                    console.log(ybdsbs.indexOf(res.data[i].MAC));
                    if (ybdsbs.indexOf(res.data[i].MAC) > -1){
                        $('tr[data-index=' + index + '] input[type="checkbox"]').prop('checked', true);
                        $('tr[data-index=' + index + '] input[type="checkbox"]').next().addClass('layui-form-checked');
                    }
                }
            }
        }
        ,cols: [[ //表头
            {type:'checkbox'}
            , {field: 'MC', title: '设备名称', sort: false}
            , {field: 'XLH', title: '设备序列号', sort: false}
            , {field: 'MAC', title: '设备MAC', sort: false}
            , {field: 'LB', title: '设备类别', sort: false}
        ]]
    });

}

//解绑界面
function jbpage(yj_id){
    c_yj_id = yj_id;
    selJblist();
    layer.open({
        type:1,//类型
        area:['800px','500px'],//定义宽和高
        title:'原件解绑',//题目
        shadeClose:false,//点击遮罩层关闭
        btn: ['解绑','关闭'],
        content: $('#sbmbPage2'),//打开的内容
        yes:function (index,layero) {
            var checkStatus = layui.table.checkStatus('user2');
            var devces = new Array();
            $(checkStatus.data).each(function (i, o) {//o即为表格中一行的数据
                devces.push(o.MAC);
            });
            if (devces.length < 1) {
                layer.msg('请选择要解绑是设备！');
                return false;
            }
            var params = {
                yj_id:c_yj_id,
                device_mac:devces.join(","),
                ASD:jsonASD
            }
            layui.layer.load();
            getAjax({url:unbondDevUrl,data:JSON.stringify(params),callback:function (reg) {
                    layui.layer.closeAll('loading');
                    if(reg.resultCode == '200'){
                        layer.close(index);
                        $('#pager').pageInit(getList);
                        layer.msg("解绑成功！", {offset: '200px'});
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                }});
        },
        btn2:function (index,layero) {
            layer.close(index);
        }
    });
}

function selJblist(){
    var json1 ={};
    json1.ASD=jsonASD;
    json1.tableName=tableName;
    json1.fildName="ID,XLH,MAC,MC,LB";
    json1.yj_id = c_yj_id;
    if($("#MC2").val()!= ''){
        json1.MC=$("#MC2").val();
    }
    if($("#XLH2").val() != ''){
        json1.XLH=$("#XLH2").val();
    }
    if($("#LB2").val() != ''){
        json1.LB=$("#LB2").val();
    }
    layui.table.render({
        elem: '#sbmbTable2'
        ,toolbar:'#toolbarConfig2'
        ,id:'user2'
        ,height: 400
        ,url: bondlistUrl //数据接口
        ,contentType:'application/json'
        ,page: false //开启分页
        ,method:'post' //接口http请求类型，默认：get
        ,where:json1 //接口的其它参数
        ,defaultToolbar:[]
        ,cols: [[ //表头
            {type:'checkbox'}
            , {field: 'MC', title: '设备名称', sort: false}
            , {field: 'XLH', title: '设备序列号', sort: false}
            , {field: 'MAC', title: '设备MAC', sort: false}
            , {field: 'LB', title: '设备类别', sort: false}
        ]]
    });
}

function selYjlx(){
    var params = {
        ASD:jsonASD
    }
    var index = layer.open({
        type:1,//类型
        area:['400px','400px'],//定义宽和高
        title:'原件类型',//题目
        shadeClose:false,//点击遮罩层关闭
        // btn: ['解绑','关闭'],
        content: $('#detailModal'),//打开的内容
    });

    getAjax({url:yjlxUrl,data:JSON.stringify(params),callback:function (reg) {
            layui.layer.closeAll('loading');
            if(reg.resultCode == '200'){
                var list = reg.data;

                layui.tree.render({
                    elem: '#treeview1'
                    ,id:"treeview1"
                    ,data: list
                    ,click: function(item){ //点击节点回调
                        console.log(item);
                        $("#yjlx_mc").val(item.data.title);
                        $("#yjlx_id").val(item.data.id);
                        layer.close(index);
                    }
                });
            }else{
                layer.msg(reg.resultMsg, {offset: '200px'});
            }
        }});

}