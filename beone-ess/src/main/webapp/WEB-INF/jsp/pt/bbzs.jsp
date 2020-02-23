<%--

--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";

%>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/common.jsp"></jsp:include>
        <script type="text/javascript" src="<%=basePath%>js/pt/bbzs.js"></script>

        <style>
            .layui-bg-blue{margin: 0}

            .first{}
            .second{width: 100%;height: calc(100% - 185px);overflow-x: auto}
            .third{width: 100%;height: 130px;overflow-x: auto;margin-top: 1%}

            .first-select{width: 100px}

            .second-top{width: 100%;height: 50%;margin-left: 100px;}
            .second-bottom{width: 100%;height: 49%}
            .bbBlock-top{border-left: 2px solid #C9E3FE;width: 300px;height: 90%;float: left;position: relative;top: 10%;color: #444444;font-size: 12px;line-height: 20px}
            .bbBlock-bottom{border-left: 2px solid #C9E3FE;width: 300px;height: 90%;float: left;position: relative;top: 5px;color: #444444;font-size: 12px;line-height: 20px}
            .bbBlock-title{width: 100%;height: 20px;position: relative;left: 20px;color: #4BA3FB;}
            .bbBlock-con{width: 80%;height: 80%;background: rgba(75, 163, 251, 0.05);border: 1px solid rgba(163, 197, 232, 0.5);position: relative;left: 20px;}
            .bbBlock-con-con{width: 90%;height: 90%;position: relative;left: 5%;top: 5%;overflow-x: auto}

            .lxCon{width: 108px;height: 100%;margin-right: 22px;float: left}
            .lxCon:hover{cursor:pointer;}
            .lxImg{width: 88px;height: 88px;margin: 0px auto}
            .lxImg-img{width: 100%;height: 100%}
            .lxTitle{line-height: 12px;color: #666666;font-size: 12px;margin: 5px auto}

            /* 设置滚动条的样式 */
            ::-webkit-scrollbar {width:3px;height:8px;background-color: #fff;}
            /* 滚动槽 */
            ::-webkit-scrollbar-track {border-radius:3px;}
            /* 滚动条滑块 */
            ::-webkit-scrollbar-thumb {border-radius:3px;background:#8796a5;}
        </style>
        <script>
            var jsonASD=getJsonASD();
            var XMID = '';
            var getBblxUrl= getBeonePath("ESS")+"pt/getXmbbxx";//获取版本类型
            var getBblxUrl2= getBeonePath("ESS")+"pt/getXmbbxx2";//获取版本类型
        </script>

    </head>
    
<body style="background: #FFFFFF">
<div style="height: 100%">
    <div class="layui-row first">
        <div class="first-select">
            <select id="chooseYear" style="margin-top: 10px;margin-left: 20px;" onchange="selBbxx();">
                <%--<option selected>2019</option>
                <option>2018</option>
                <option>2017</option>--%>
            </select>
        </div>
    </div>
    <div class="layui-row second">
        <div id="secondCon" class="secondCon">
            <div class="second-top" id="tops">
                <%--<div class="bbBlock-top">
                    <div class="bbBlock-title">
                        <span>2019-10-12(v1.8)</span>
                    </div>
                    <div class="bbBlock-con">
                        <div class="bbBlock-con-con">
                            非教室班牌appV1.8.4版本更新说明：<br>
                            1、新增天气预报的显示、图片根据不 同的天气进行切换；<br>
                            2、新增更多内容栏目；<br>
                            3、新增管理员详情和房间详情；<br>
                            4、新增校园风采；<br>
                            5、新增设备控制；<br>
                            5、新增设备控制；<br>
                            5、新增设备控制；<br>
                            5、新增设备控制；<br>
                        </div>
                    </div>
                </div>--%>
            </div>
            <hr class="layui-bg-blue">
            <div class="second-bottom" id="bottoms">
                <%--<div class="bbBlock-bottom">
                    <div class="bbBlock-title">
                        <span>2019-10-11(v1.8)</span>
                    </div>
                    <div class="bbBlock-con">
                        <div class="bbBlock-con-con">
                            非教室班牌appV1.8.4版本更新说明：<br>
                            1、新增天气预报的显示、图片根据不 同的天气进行切换；<br>
                            2、新增更多内容栏目；<br>
                            3、新增管理员详情和房间详情；<br>
                            4、新增校园风采；<br>
                            5、新增设备控制；<br>
                        </div>
                    </div>
                </div>--%>
            </div>
        </div>
    </div>
    <div class="layui-row third">
        <div id="lx">
            <%--<div class="lxCon">
                <div class="lxImg">
                    <img class="lxImg-img" src="<%=basePath%>img/bbgl/gray/icon_01.png">
                </div>
                <div class="lxTitle">
                    <span>功能教室班牌</span>
                </div>
            </div>--%>
        </div>
    </div>
</div>
</body>
<script>
    $(function () {
        $("#lx").css("width",$('.lxCon').length*110);
        $("#secondCon").css("width",$('.bbBlock-bottom').length*302);
    })
</script>
</html>