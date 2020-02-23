<%@ page import="java.util.Map" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    Map<String, String> usermap = (Map<String, String>) request.getSession().getAttribute("user");
    if(usermap == null){
        //response.sendRedirect("login_out");
    }
   /* ResultCode:返回码
    200成功 400请求无效 403禁止访问 404文件不存在 500失败 504请求超时
    401验证不通过、参数不合法
    ResultMsg:返回信息
    ResultData:返回数据对象

    先暂时这样 后面有遇到新的情况再补充*/
%>
<html>
<head>
    <%--注意：当用include 引入的jsp文件中，各个js方法名、变量名，css类名等不能重复 --%>
        <%--<base href=getBeonePath("ESS")>--%>
        <title>demo1.0</title>
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <jsp:include page="../introduce/common.jsp"></jsp:include>
<script>
    var findUrl=getBeonePath("ESS")+"common/findTest";//路径

</script>
</head>
<body>

<button onclick="test1()">查询</button>
<button onclick="test2()">新增</button>
<button onclick="test3()">删除</button>
<button onclick="test4()">修改</button>
<button onclick="test5()">分页查询</button>
<button onclick="test6()">aa</button>

</body>

<script>

    function test6() {
        $.ajax({
            type:"POST",
            url:getBeonePath("ESS")+"sys/getFistRight",
            async:false,
            dataType:"json", //服务器返回数据的类型
            contentType: 'application/json',
            success:function(reg){
                console.info(reg);
            }
        });
    }

    function test1() {

        var json ={};
        var jsonASD=getJsonASD();//获取合法验证
            jsonASD.code="XTGL_XTQX_YHGL";
        json.ASD=jsonASD;

        // var jsonOther={};
        //     jsonOther.group="";
        //     jsonOther.order="";
        // json.other=jsonOther;

        json.tableName="t1";
        json.fildName=['RIGHT_ID','RIGHT_NAME','RIGHT_TYPE'];

        var jsonWhere={};
            jsonWhere.RIGHT_NAME="插入测试name1";
        json.where=jsonWhere;
        $.ajax({
            type:"POST",
            url:findUrl,
            async:false,
            dataType:"json", //服务器返回数据的类型
            contentType: 'application/json',
            data:JSON.stringify(json),
            success:function(reg){
                if(reg.resultCode=="SUCCESS"){
                    console.log(reg.resultMsg);
                }else{
                    console.log(reg.resultCode+",原因："+reg.resultMsg);
                }
            }
        });
    }

    function test2() {
        var json ={};
        var jsonASD={};
        jsonASD.user_id="";
        jsonASD.user_name="";
        jsonASD.org_id="";
        jsonASD.token_lx="WEB";
        jsonASD.token="22222";
        jsonASD.code="XTGL_XTQX_YHGL";
        json.ASD=jsonASD;
        json.tableName="t1";
        json.id="RIGHT_ID";
        json.seqKZ="";//不存在或为空，表示seq_0, 存在并且不为空，表示 seq_+org_id
        var jsonInsert={};
        jsonInsert.RIGHT_NAME="插入测试name";
        jsonInsert.RIGHT_TYPE="type";
        jsonInsert.RIGHT_CODE="插入测试code";
        json.insert=jsonInsert;
        $.ajax({
            type:"POST",
            url:"common/insertTest",
            async:false,
            dataType:"json", //服务器返回数据的类型
            contentType: 'application/json',
            data:JSON.stringify(json),
            success:function(reg){
                if(reg.resultCode=="SUCCESS"){
                    console.log(reg.resultMsg);
                }else{
                    console.log(reg.resultCode+",原因："+reg.resultMsg);
                }
            }
        });
    }

    function test3() {
        var json ={};
        var jsonASD={};
        jsonASD.user_id="";
        jsonASD.user_name="";
        jsonASD.org_id="";
        jsonASD.token_lx="WEB";
        jsonASD.token="22222";
        jsonASD.code="XTGL_XTQX_YHGL";
        json.ASD=jsonASD;
        json.tableName="t1";
        var jsonDelete={};
        jsonDelete.RIGHT_NAME="插入测试name";
        jsonDelete.RIGHT_TYPE="type";
        jsonDelete.RIGHT_CODE="插入测试code";
        json.delete=jsonDelete;
        $.ajax({
            type:"POST",
            url:"common/deleteTest",
            async:false,
            dataType:"json", //服务器返回数据的类型
            contentType: 'application/json',
            data:JSON.stringify(json),
            success:function(reg){
                if(reg.resultCode=="SUCCESS"){
                    console.log(reg.resultMsg);
                }else{
                    console.log(reg.resultCode+",原因："+reg.resultMsg);
                }
            }
        });
    }

    function test4() {
        var json ={};
        var jsonASD={};
        jsonASD.user_id="";
        jsonASD.user_name="";
        jsonASD.org_id="";
        jsonASD.token_lx="WEB";
        jsonASD.token="22222";
        jsonASD.code="XTGL_XTQX_YHGL";
        json.ASD=jsonASD;
        json.tableName="t1";
        var jsonWhere={};//修改条件
        jsonWhere.RIGHT_NAME="插入测试name";
        jsonWhere.RIGHT_TYPE="type";
        jsonWhere.RIGHT_CODE="插入测试code";
        json.where=jsonWhere;
        var jsonFild={};//修改参数
        jsonFild.RIGHT_NAME="插入测试name1";
        jsonFild.RIGHT_TYPE="type1";
        jsonFild.RIGHT_CODE="插入测试code1";
        json.fild=jsonFild;
        $.ajax({
            type:"POST",
            url:"common/updateTest",
            async:false,
            dataType:"json", //服务器返回数据的类型
            contentType: 'application/json',
            data:JSON.stringify(json),
            success:function(reg){
                if(reg.resultCode=="SUCCESS"){
                    console.log(reg.resultMsg);
                }else{
                    console.log(reg.resultCode+",原因："+reg.resultMsg);
                }
            }
        });
    }

    function test5() {
        var json ={};
        var jsonASD={};
        jsonASD.user_id="";
        jsonASD.user_name="";
        jsonASD.org_id="";
        jsonASD.token_lx="WEB";
        jsonASD.token="22222";
        jsonASD.code="XTGL_XTQX_YHGL";
        json.ASD=jsonASD;

        var jsonOther={};
        jsonOther.group="";
        jsonOther.order="RIGHT_NAME";
        json.other=jsonOther;

        json.tableName="t1";
        json.fildName=['RIGHT_ID','RIGHT_NAME','RIGHT_TYPE'];

        var jsonWhere={};
        jsonWhere.RIGHT_NAME="插入测试name1";
        json.where=jsonWhere;
        $.ajax({
            type:"POST",
            url:"common/PtFind",
            async:false,
            dataType:"json", //服务器返回数据的类型
            contentType: 'application/json',
            data:JSON.stringify(json),
            success:function(reg){
                if(reg.resultCode=="SUCCESS"){
                    console.log(reg.resultMsg);
                }else{
                    console.log(reg.resultCode+",原因："+reg.resultMsg);
                }
            }
        });
    }
</script>

</html>
