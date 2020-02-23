$(function () {
    if(isadmin == '2'){
        // $("#addConfigSub").css("display", "block");
        $("#configTxt").hide();
        $("#configForm").show();
    }else{
        $("#configForm").hide();
        $("#configTxt").show();
    }

    layui.use(['form','layer'], function() {

        var form = layui.form,
            layer = layui.layer;

        //系统参数 表单提交
        form.on('submit(addConfigSub)', function (data) {
            var json ={};
            json.ASD=jsonASD;
            json.tableName=tableName;
            var url="";
            if ($("#id").val()==""||$("#id").val()==null) {
                json.ASD.code=updateCode;
                json.id="ID";
                json.seqKZ="1";     //不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
                var jsonInsert = data.field;  //通过name值获取数据
                jsonInsert.dgj_id = jsonInsert.apcos_id;
                jsonInsert.dgj_key = jsonInsert.apcos_key;
                jsonInsert.kfpt_id = jsonInsert.apcos_id;
                jsonInsert.kfpt_key = jsonInsert.apcos_key;
                json.insert=jsonInsert;
                url= insertConfigUrl;
            }else{
                json.ASD.code=updateCode;
                var jsonWhere={};//修改条件
                jsonWhere.ID=$("#id").val();
                json.where=jsonWhere;
                var jsonFild=data.field;
                jsonFild.dgj_id = jsonFild.apcos_id;
                jsonFild.dgj_key = jsonFild.apcos_key;
                jsonFild.kfpt_id = jsonFild.apcos_id;
                jsonFild.kfpt_key = jsonFild.apcos_key;
                json.fild=jsonFild;
                url= updateConfigUrl;
            }
            $.ajax({
                type: 'POST',
                url: url,
                dataType: "json",
                data: JSON.stringify(json),
                async:false,
                contentType : "application/json",
                success: function(reg) {
                    if(reg.resultCode == '200'){
                        status="SUCCESS";
                        layer.msg("操作成功！", {offset: '200px'});
                    }else{
                        layer.msg(reg.resultMsg, {offset: '200px'});
                    }
                },
                error: function() {
                    console.log("fucking error")
                }
            });

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
            code: function(value){
                var reg = /^[A-Za-z\d]+$/;
                if (!reg.test(value)) {
                    return "["+item.title+"] 只能填写大小字母和数字组合";
                }
            }
        });

        //初始化table
        selDevice();

    });

});
