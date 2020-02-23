<%--
    倪杨
    2019-08-08
    桌面页面，也就是顶部菜单栏中“我的桌面”所对应的页面，
                计划是放一些常用的操作菜单或模块
--%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";

    Map<String, String> usermap = (Map<String, String>) request.getSession().getAttribute("user");
    String user_id = null;
    String user_name = null;
    String belong_org_id = null;
    if(usermap == null){
        System.out.println("basePath=="+basePath);
        response.sendRedirect(basePath);
        return;
    }else{
        user_id = usermap.get("USER_ID");
        user_name = usermap.get("USER_NAME");
        belong_org_id = usermap.get("BELONG_ORG_ID");
    }
%>
<html>
<head>
    <%--注意：当用include 引入的jsp文件中，各个js方法名、变量名，css类名等不能重复 --%>
    <title>demo1.0</title>
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta http-equiv="Cache-Control" content="no-siteapp"/>
    <jsp:include page="introduce/common.jsp"></jsp:include>
        <script src="<%=basePath%>js/echarts.min.js"></script>
</head>
<script>

    var jsonASD=getJsonASD();
    var tableName="ess4";
    var findOneDayLogTypeUrl = getBeonePath("ESS")+"log/findOneDayLogType";
    var findOneDayLogUserUrl = getBeonePath("ESS")+"log/findOneDayLogUser" ;

    $(document).ready(function(){
        findOneDayLogType();
        findOneDayLogUser();
        findOneDaySbxx();
        findXxFb();
    });

</script>
<body  style="background-color:#f2f7f8">
    <div style="width:100%;">
        <div style="float:left;width:50%;margin-top: 25px;margin-left:2%;background-color: #ffffff;">
            <div id="OneDayLogType" style="height: 250px;"></div>
        </div>
        <div style="float: left;margin-left: 2%;margin-right:2%;width: 44%;margin-top: 25px;background-color: #ffffff;">
            <div id="OneDayLogUser" style="height: 250px;"></div>
        </div>
    </div>
    <div style="width:100%;">
        <div style="float:left;width:50%;margin-top: 25px;margin-left:2%;background-color: #ffffff;">
            <div id="OneDaySbxx" style="height: 250px;"></div>
        </div>
        <div style="float: left;margin-left: 2%;margin-right:2%;width: 44%;margin-top: 25px;background-color: #ffffff;">
            <div id="xxFb" style="height: 250px;"></div>
        </div>
    </div>
</body>


<script>

    //每日操作类型访问情况
    function findOneDayLogType() {

        var json1 ={};
        json1.ASD=jsonASD;
        json1.tableName=tableName;
        <%--json1.where={'belong_org_id':<%=belong_org_id%>};--%>

        getAjax({url:findOneDayLogTypeUrl,data:JSON.stringify(json1),callback:function (reg) {
                if(reg.resultCode=="200"){
                    var obj = reg.resultData ;
                    var xdata = new Array();
                    var seriesdata = new Array();
                    for(var i=0;i<obj.length;i++){
                        xdata.push(obj[i].di_value);
                        seriesdata.push(obj[i].scn);
                    }

                    var myChart = echarts.init(document.getElementById('OneDayLogType'));
                    var option = {
                        color: ['#3398DB'],
                        title : {
                            text: '今日业务操作情况(次)',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '10%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                data : xdata,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'操作次数',
                                type:'bar',
                                barWidth: '40%',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'inside'
                                    }
                                },
                                data:seriesdata
                            }
                        ]
                    };

                    myChart.setOption(option);
                }else{
                    layer.msg(reg.resultMsg, {offset: '200px'});
                }
            }
        });
    }

    //每日用户操作情况
    function findOneDayLogUser(){

        var json1 ={};
        json1.ASD=jsonASD;
        json1.tableName=tableName;

        getAjax({url:findOneDayLogUserUrl,data:JSON.stringify(json1),callback:function (reg) {
                if(reg.resultCode=="200"){
                    var obj = reg.resultData ;
                    var legendData = new Array();
                    var seriesdata = new Array();
                    for(var i=0;i<obj.length;i++){
                        legendData.push(obj[i].creator_name);
                        var sdata = {value:obj[i].scn,name:obj[i].creator_name} ;
                        seriesdata.push(sdata);
                    }

                    var myChart = echarts.init(document.getElementById('OneDayLogUser'));
                    var option = {
                        title : {
                            text: '今日用户业务操作情况(次)',
                            x:'center'
                        },
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c}"
                        },
                        legend: {
                            type: 'scroll',
                            orient: 'vertical',
                            x:'left',
                            data: legendData
                        },
                        series : [
                            {
                                name: '姓名',
                                type: 'pie',
                                radius : '60%',
                                center: ['55%', '65%'],
                                label: {
                                    normal: {
                                        formatter: '{b}:{c}'
                                    }
                                },
                                data: seriesdata,
                                itemStyle: {
                                    emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                    }
                                }
                            }
                        ]
                    };
                    myChart.setOption(option);

                }else{
                    layer.msg(reg.resultMsg, {offset: '200px'});
                }
            }
        });
    }

    //每日设备操作情况（次）
    function findOneDaySbxx(){
        var myChart = echarts.init(document.getElementById('OneDaySbxx'));
        var option = {
            title: {
                text: '昨日设备/模式控制情况（次）'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['成功','失败']
            },
            grid: {
                left: '10%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['08:00','10:00','12:00','14:00','16:00','18:00','20:00']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:'成功',
                    type:'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data:[120, 132, 86, 134, 90, 230, 210]
                },
                {
                    name:'失败',
                    type:'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data:[23, 82, 41, 34, 22, 35, 17]
                }
            ]
        };
        myChart.setOption(option);
    }

    //学校使用分布图
    function findXxFb(){
        var myChart = echarts.init(document.getElementById('xxFb'));
        var option = {
            title: {
                text: '学校布署情况（所）'
            },
            radar: [
                {
                    center: ['15%', '20%'],
                    radius: 80,
                    startAngle: 90,
                    splitNumber: 4,
                    shape: 'circle',
                    name: {
                        formatter:'【{value}】',
                        textStyle: {
                            color:'#72ACD1'
                        }
                    }
                },
                {
                    indicator: [
                        { text: '重庆', max: 150 },
                        { text: '四川', max: 150 },
                        { text: '北京', max: 150 },
                        { text: '上海', max: 120 },
                        { text: '山东', max: 108 },
                        { text: '云南', max: 128 },
                        { text: '大连', max: 72 }
                    ],
                    center: ['55%', '60%'],
                    radius: 80
                }
            ],
            series: [

                {
                    type: 'radar',
                    radarIndex: 1,
                    data: [
                        {
                            value: [120, 118, 130, 100, 99,84, 70],
                            label: {
                                normal: {
                                    show: true,
                                    formatter:function(params) {
                                        return params.value;
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        };
        myChart.setOption(option);
    }
</script>

</html>
