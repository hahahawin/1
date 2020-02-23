
/**
 * 便签管理
 * @Author: 倪杨
 * @Date: 2019/11/12
 */
$(function () {
    layui.use(['table','form','laydate'], function() {
        var table=layui.table,
            form=layui.form;
        var json ={};
        jsonASD.code=ptFindCode;

        json.ASD=jsonASD;

        json.tableName=tableName;

        json.user_id=user_id;

        // Table:定义表格的基本数据
        var Table={
            defaultToolbar:[],
            height: 'full-0',
            url: findNoteUrl,
            method:'post', //接口http请求类型，默认：get
            contentType:'application/json', //发送到服务端的内容编码类型。如果你要发送 json 内容，可以设置：contentType: 'application/json'
            page: true,
            enabledCurrCookie: true,
            limits:[10,20,30,40,50,60,70,80,90],
            limit:10,
            where:json, //接口的其它参数
            cols: [[ //表头
                {field: 'BQGL_BT', title: '标题',  sort: false}
                , {field: 'BQGL_TXFS',width:180, title: '提醒时间',  sort: true,templet:function (obj) {
                        return dateFormat("yyyy-mm-dd HH:MM:SS",obj.BQGL_TXFS);
                    }}
                , {field: 'BQGL_ZT',width:180, title: '状态',  sort: true,templet:function (obj) {
                        return getDataText('BQZT',obj.BQGL_ZT);
                    }}
                ,{field: 'BQGL_NR', title: '内容',  sort: false}
            ]]
        };

        //表格初始化方法
        window.creatTable=function(){
            table.init('conTable', Table);

        };

        table.on('rowDouble(conTable)',function (obj) {
            $("#configForm div[name]").each(function(){
                $(this).html('');
            });
            layer.open({
                type:1,//类型
                area:['500px','300px'],//定义宽和高
                title:'便签详情',//题目
                shadeClose:false,//点击遮罩层关闭
                btn: ['关闭'],
                content: $('#CONFIGDETAIL'),//打开的内容
                btn1:function (index,layero) {
                    layer.close(index);
                }
            });
            var data = obj.data;
            $("#configForm div[name='BT']").html(data.BQGL_BT);
            $("#configForm div[name='TXSJ']").html(dateFormat("yyyy-mm-dd HH:MM:SS",data.BQGL_TXSJ));
            $("#configForm div[name='ZT']").html(data.BQGL_ZT);
            $("#configForm div[name='BQNR']").html(data.BQGL_NR);

            var json={};
            json.ASD = jsonASD;
            json.tableName = tableName;
            json.where = {"ID":data.BQGL_ID};
            json.fild = {"ZT":"2"};
            getAjax({url:updateUrl,data:JSON.stringify(json),callback:function (reg) {

                }
            });
        });

        creatTable();//表格初始化，一定放在初始化方法之后

    });
});
