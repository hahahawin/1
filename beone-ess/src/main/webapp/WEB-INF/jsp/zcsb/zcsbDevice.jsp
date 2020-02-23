<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

%>
<html>
    <head>
        <meta charset="UTF-8">
        <title>服务接入</title>
        <meta name="renderer" content="webkit">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <meta name="viewport" content="width=device-width,user-scalable=yes, minimum-scale=0.4, initial-scale=0.8,target-densitydpi=low-dpi" />
        <jsp:include page="../introduce/table.jsp"></jsp:include>
        <script type="text/javascript" src="<%=basePath%>js/zcsb/zcsbDevice.js"></script>
        <script>
            var jsonASD = getJsonASD();
            var tableName="ess23";
            var status="";
            var loadConfigUrl = getBeonePath("ESS")+"common/find";
            var insertConfigUrl= getBeonePath("ESS")+"zcsb/insertDevice";
            var updateConfigUrl= getBeonePath("ESS")+"zcsb/updateDevice";

            var ptFindCode="ZCSB_ZKGL_FWJR_CX"; //分页查询code
            var updateCode="ZCSB_ZKGL_FWJR_EDIT"; //修改code

            function selDevice(){
                var deviceJson={};
                deviceJson.ASD=getJsonASD();
                deviceJson.tableName=tableName;
                deviceJson.fildName="ID,APCOS_URL,APCOS_ID,APCOS_KEY,CALL_BACK,DGJ_JRS,DGJ_URL,DGJ_ID,DGJ_KEY,KFPT_URL,KFPT_ID,KFPT_KEY,ATT2";
                var jsonWhere={};
                if(bslx == '1'){
                    jsonWhere.ORG_ID='1';
                }else{
                    jsonWhere.ORG_ID=belong_org_id;
                }
                deviceJson.where=jsonWhere;
                getAjax({url:loadConfigUrl,data:JSON.stringify(deviceJson),callback:function (reg) {
                    if (reg.resultCode=="200"){
                        var list = reg.resultData;
                        if(list != ''){
                            var data = list[0];
                            if(isadmin == '2'){
                                $("#id").val(data.id);
                                $("#apcos_url").val(data.apcos_url);
                                $("#apcos_id").val(data.apcos_id);
                                $("#apcos_key").val(data.apcos_key);
                                $("#call_back").val(data.call_back);
                                $("#dgj_jrs").val(data.dgj_jrs);
                                $("#dgj_url").val(data.dgj_url);
                                $("#kfpt_url").val(data.kfpt_url);
                                $("#att2").val(data.att2);
                            }else{
                                $("#apcos_url2").html(data.apcos_url);
                                $("#apcos_id2").html(data.apcos_id);
                                $("#apcos_key2").html(data.apcos_key);
                                $("#call_back2").html(data.call_back);
                                $("#dgj_jrs2").html(data.dgj_jrs);
                                $("#dgj_url2").html(data.dgj_url);
                                $("#kfpt_url2").html(data.kfpt_url);
                                $("#att22").html(data.att2);
                            }
                        }

                    }
                }});
            }
        </script>
        <style>
            .layui-form-label{
                width: 120px;
            }
            .layui-input-block{
                margin-left: 150px;
            }
            #configTxt .layui-input-block{
                padding-top: 9px;
            }
        </style>
    </head>
    
<body>
<div class="layui-container" style="width: 100%;padding: 0px;">
    <div class="layui-row" style="height:100%;background-color: #FFFFFF;">
        <div class="layui-col-md7" style="padding-top: 10px;padding-left: 20px;">
            <form id="configForm" class="layui-form" action="" lay-filter="configForm">
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>服务授权URL</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="apcos_url" id="apcos_url" title="服务授权URL" lay-verify="required" maxlength="100" autocomplete="off" class="layui-input">
                        <input type="hidden" id="id">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>服务授权ID</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="apcos_id" id="apcos_id" title="服务授权ID" lay-verify="required|code" maxlength="64" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>服务授权KEY</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="apcos_key" id="apcos_key" title="服务授权KEY" lay-verify="required|code" maxlength="64" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>回调URL</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="call_back" id="call_back" title="回调URL" lay-verify="required" maxlength="100" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>接入商授权账户</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="dgj_jrs" id="dgj_jrs" title="接入商授权账户" lay-verify="required|code" maxlength="64" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>大管家URL</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="dgj_url" id="dgj_url" title="大管家URL" lay-verify="required" maxlength="100" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>开发者平台URL</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="kfpt_url" id="kfpt_url" title="开发者平台URL" lay-verify="required" maxlength="100" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label"><span class="requiredMark">*</span>组织名称</label>
                    <div class="layui-input-block">
                        <input type="text" NAME="att2" id="att2" title="组织名称" lay-verify="required|special" maxlength="20" autocomplete="off" class="layui-input">
                    </div>
                </div>
                <button id="addConfigSub" class="layui-btn" style="margin-top: 20px;margin-left: 130px;" lay-submit lay-filter="addConfigSub">提交</button>
            </form>
            <form class="layui-form" style="display: none" id="configTxt">
                <div class="layui-form-item">
                    <label class="layui-form-label">服务授权URL</label>
                    <div class="layui-input-block">
                        <div id="apcos_url2"></div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">服务授权ID</label>
                    <div class="layui-input-block">
                        <div id="apcos_id2"></div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">服务授权KEY</label>
                    <div class="layui-input-block">
                        <div id="apcos_key2"></div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">回调URL</label>
                    <div class="layui-input-block">
                        <div id="call_back2"></div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">接入商授权账户</label>
                    <div class="layui-input-block">
                        <div id="dgj_jrs2"></div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">大管家URL</label>
                    <div class="layui-input-block">
                        <div id="dgj_url2"></div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">开发者平台URL</label>
                    <div class="layui-input-block">
                        <div id="kfpt_url2"></div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <label class="layui-form-label">组织名称</label>
                    <div class="layui-input-block">
                        <div id="att22"></div>
                    </div>
                </div>
            </form>
        </div>
    </div>

</div>

</body>


</html>