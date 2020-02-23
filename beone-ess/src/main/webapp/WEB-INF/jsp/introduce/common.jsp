<%--
   倪杨
   2019-08-08
   此文件包含了一些基本的js，css文件的引用
                合法性验证的参数获取
--%>
<%@ page import="java.util.Map" %>
<%@ page import="javax.servlet.http.HttpServletResponse" %>

<%@ page language="java" import="java.util.*" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
    Map<String, Object> map2 = (Map<String, Object>) request.getSession().getAttribute("user");
//    Map<String, Object> rightMenu = (Map<String, Object>) request.getSession().getAttribute("rightMenu");
//    List<Map<String, Object>> allButtonlist = (List<Map<String, Object>>) request.getSession().getAttribute("allButtonlist");
//    System.out.println("allButtonlist:"+allButtonlist.toString());
    String user_id = "";
    String user_name = "";
    String belong_org_id = "";
    String token_lx = "web";
    String token = "1";
    String isadmin = "1";
    String bslx = "1";
    if(map2 != null){
        user_id = (String)map2.get("user_id");
        user_name = (String)map2.get("user_name");
        belong_org_id = (String)map2.get("belong_org_id");
        isadmin = (String)map2.get("user_isadmin");
        bslx = (String)map2.get("bslx");
        token = (String)map2.get("token");
    }

    /**
     * 获取配置文件的对应的值    application.properties
     */
    ResourceBundle resource = ResourceBundle.getBundle("application");
    String ESS = resource.getString("ESS");
    String BCCA = resource.getString("BCCA");
    String JXSC = resource.getString("JXSC");
    String JW = resource.getString("JW");
    String D3 = resource.getString("D3");
    String JXHD = resource.getString("JXHD");
%>


<script>

    <%--console.info("<%=map2%>");--%>
    var map2="<%=map2%>";
    var ESS='<%=ESS%>';
    var BCCA='<%=BCCA%>';
    var JXSC='<%=JXSC%>';
    var JW='<%=JW%>';
    var D3='<%=D3%>';
    var JXHD='<%=JXHD%>';

    var basePath =  '<%=basePath%>';
    var path = '<%=path%>' ;

    var user_id = '<%=user_id%>';
    var user_name = '<%=user_name%>' ;
    var belong_org_id = '<%=belong_org_id%>';
    var token_lx = '<%=token_lx%>';
    var token = '<%=token%>';
    var bslx = '<%=bslx%>';
    var isadmin = '<%=isadmin%>';
    var xmlx = '1'; //菜单应用平台 ess

    var ThirdId='<%=request.getAttribute("ID")%>';
    var ThirdCode='<%=request.getAttribute("CODE")%>';

    var JxCore = {} ;
    JxCore.dataInfo = parent.parent.p_dataInfo ;  //数据字典缓存
    JxCore.dataRight = parent.parent.p_rightInfo ; //权限缓存
    JxCore.helpInfo = parent.parent.p_helpInfo ; //帮助中心
</script>

<link rel="stylesheet" href="<%=basePath%>css/font.css">
<link rel="stylesheet" href="<%=basePath%>css/xadmin.css">
<script src="<%=basePath%>layui/layui.js" charset="utf-8"></script>

<script type="text/javascript" src="<%=basePath%>js/jquery.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/common.js"></script>

<!-- 让IE8/9支持媒体查询，从而兼容栅格 -->
<!--[if lt IE 9]>
<script src="https://cdn.staticfile.org/html5shiv/r29/html5.min.js"></script>
<script src="https://cdn.staticfile.org/respond.js/1.4.2/respond.min.js"></script>



<![endif]-->
