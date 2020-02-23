function login(){
    var user_account = $("#user_account").val();
    var user_password = $("#user_password").val();
    if(user_account == null || user_account == ''){
        layui.layer.msg('登录账号不能为空', {offset: '200px'});
        return false;
    }
    if(user_password == null || user_password == ''){
        layui.layer.msg('登录密码不能为空', {offset: '200px'});
        return false;
    }
    var json = {};
    json.user_account = user_account;
    json.user_password = user_password;
    json.user_type = $("#user_type").val();
    json.log_type = $("#log_type").val();
    json.bslx = '0';
    json.xmlx = '1';
    $.ajax({
        type: 'POST',
        url: loginUrl,
        dataType: "json",
        data: JSON.stringify(json),
        contentType : "application/json",
        success: function(data) {
            if(data.resultCode == '200'){
                window.location.href=jumpPageUrl ;
            }else{
                layui.layer.msg(data.resultMsg, {offset: '200px'});
            }
        },
        error: function() {
            console.log("fucking error")
        }
    });

}
