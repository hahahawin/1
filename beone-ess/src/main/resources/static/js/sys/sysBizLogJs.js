/**
 * 倪杨
 * 2019-08-15
 * 系统日志js
 */

$(function () {

    layui.use(['table','form'], function() {

        var table=layui.table;
        var form=layui.form;

        var json ={};
        jsonASD.code=ptFindCode;
        json.ASD=jsonASD;
        json.org_id=belong_org_id;
        // json.fildName="ID,TYPE,CODE,CONT,ZT,EDIT_ID,EDIT_NAME,EDIT_TIME";
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
                $("#TYPE").html(getDataSelectHtml('LOG_TYPE','1',json.type,'请选择日志类型'));
                $("#ZT").html(getDataSelectHtml('LOG_ZT','1',json.zt,'请选择状态'));
                form.render();
            },
            where:json, //接口的其它参数
            // size:'sm', //整体表格尺寸，sm  lg
            cols: [[ //表头
                {field: 'TYPE',width:100, title: '日志类型',  sort: false, templet:function (obj) {
                        return getDataText("LOG_TYPE",obj.TYPE)
                    }}
                , {field: 'CONT', title: '日志内容',  sort: false}
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
                    delete json.type;
                    delete json.zt;
                    form.render('select');
                    //初始化table
                    creaBizLogTable();
                    break;
                case 'findBizLog':
                    if($("#TYPE").val()!=""){
                        json.type=$("#TYPE").val();
                    }else{
                        delete json.type;
                    }
                    if($("#ZT").val()!=""){
                        json.zt=$("#ZT").val();
                    }else{
                        delete json.zt;
                    }
                    table.init('bizLog', bizLogTable);
                    $("#TYPE").val(json.type);
                    $("#ZT").val(json.zt);
                    break;
            };
        });


        //初始化table
        creaBizLogTable();

    });

});
