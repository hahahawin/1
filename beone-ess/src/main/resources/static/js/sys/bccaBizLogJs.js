$(function () {

    layui.use(['table','form'], function() {

        var table=layui.table;
        var form=layui.form;

        var json ={};
        jsonASD.code=ptFindCode;
        json.ASD=jsonASD;
        json.tableName=tableName;
        json.org_id=belong_org_id;
        json.fildName="ID,TYPE,CODE,KZLX,CONT2,ZT,EDIT_ID,EDIT_NAME,EDIT_TIME";
        var jsonWhere={};
        jsonWhere.borg_id = belong_org_id;
        json.where=jsonWhere;
        var wherelike={};
        json.wherelike=wherelike;
        var jsonOther={};
        jsonOther.order = {"crea_time":"DESC"};
        json.other = jsonOther;
        var bizLogTable={
            defaultToolbar:[],
            toolbar:'#toolbarBizLog',
            height: 'full-0',
            url: loadBizLogUrl,
            method:'post', //接口http请求类型，默认：get
            contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
            page: true,
            enabledCurrCookie: true,
            limits:[10,20,30,40,50,60,70,80,90],
            limit:10,
            done:function(){
                $("#ZT").html(getDataSelectHtml('LOG_ZT','1',json.where.zt,'请选择状态'));
                $("#TYPE").html(json.where.type);
                form.render();
            },
            where:json, //接口的其它参数
            // size:'sm', //整体表格尺寸，sm  lg
            cols: [[ //表头
                {field: 'TYPE',width:100, title: '日志类型',  sort: false, templet:function (obj) {
                        if(obj.TYPE == '1'){
                            return '添加';
                        }else if(obj.TYPE == '2'){
                            return '编辑';
                        }else if(obj.TYPE == '3'){
                            return '删除';
                        }else if(obj.TYPE == '4'){
                            return '控制';
                        }else{
                            return '其他';
                        }
                    }}
                , {field: 'KZLX',width:100, title: '控制类型',  sort: false, templet:function (obj) {
                        if(obj.KZLX == '1'){
                            return '设备';
                        }else if(obj.KZLX == '2'){
                            return '模式';
                        }else if(obj.KZLX == '3'){
                            return '执行计划';
                        }else{
                            return '其他';
                        }
                    }}
                , {field: 'CONT2', title: '日志内容',  sort: false}
                , {field: 'ZT',width:100, title: '日志状态',  sort: false,templet:function (obj) {
                        return getDataText("LOG_ZT",obj.ZT)
                    }}
                // , {field: 'CODE', title: '日志代码',  sort: false}
                , {field: 'EDIT_NAME',width:150, title: '操作人',  sort: false}
                , {field: 'EDIT_TIME',width:200, title: '操作时间',  sort: false,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd HH:MM:SS",obj.EDIT_TIME)
                    }}
            ]]
        };

        //表格初始化
        window.creaBizLogTable=function(){
            table.init('bizLog', bizLogTable);
        };

        //头工具栏事件
        table.on('toolbar(bizLog)', function(obj){
            switch(obj.event){
                case 'reset':
                    $("#TYPE").val("");
                    $("#ZT").val("");
                    delete json.where.type;
                    delete json.where.zt;
                    form.render('select');
                    table.init('bizLog', bizLogTable);
                    break;
                case 'findBizLog':
                    if($("#TYPE").val()!=""){
                        json.where.type=$("#TYPE").val();
                    }else{
                        delete json.where.type;
                    }
                    if($("#ZT").val()!=""){
                        json.where.zt=$("#ZT").val();
                    }else{
                        delete json.where.zt;
                    }
                    table.init('bizLog', bizLogTable);
                    $("#TYPE").val(json.where.type);
                    $("#ZT").val(json.where.zt);
                    break;
            };
        });


        //初始化table
        creaBizLogTable();

    });

});
