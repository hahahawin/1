<%@ page import="com.beoneess.common.controller.ContextHelper" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
    String user_token_3d = ContextHelper.getSessionStr("user_token_3d");
%>
<html>
<head>
    <meta charset="UTF-8">
    <title>原件绑定</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8" />
    <jsp:include page="../introduce/table.jsp"></jsp:include>
    <link rel="stylesheet" href="<%=basePath%>css/table.css">

    <style>
        .sjjm{
            width: 100%;
            height: 100%;
        }
    </style>
    <script>
        var jsonASD = getJsonASD();
        var getUser3DTokenUrl = getBeonePath("BCCA")+"sbInter/getUser3DToken";
        var user_token_3d = '<%=user_token_3d%>';
        $(function () {
            layui.use(['table','form','layer'], function() {
                var table = layui.table,
                    form = layui.form,
                    layer = layui.layer;

                if(user_token_3d == null || user_token_3d == '' || user_token_3d == 'null'){
                    user_token_3d = getUserToken3d();
                }
                if(user_token_3d != '' && user_token_3d != null && user_token_3d != 'null'){
                    var t=document.getElementById("sjjm");
                    var url = D3+"/otheAPI/openWorkstation?user_id="+user_id+"&user_token="+user_token_3d;
                    t.contentWindow.location.href = url;
                }

                function getUserToken3d(){
                    var params = {
                        ASD:jsonASD
                    };
                    getAjax({url:getUser3DTokenUrl,data:JSON.stringify(params),callback:function (reg) {
                            if (reg.resultCode=="200"){
                                user_token_3d = reg.user_token_3d;
                            }else{
                                layui.layer.msg(reg.resultMsg);
                            }
                        }});
                    return user_token_3d;
                }
            });

        });


    </script>
</head>

<body>
<iframe id="sjjm" class="sjjm" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" srcdoc=''></iframe>
</body>
<script>

</script>
</html>