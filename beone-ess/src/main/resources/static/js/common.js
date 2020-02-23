
/**
 * 获取合法验证参数
 */
function getJsonASD(){
    var jsonASD = {};
    if(user_id==null || user_id=="" ||
        user_name==null || user_name=="" ||
        belong_org_id==null || belong_org_id=="" ||
        token_lx==null || token_lx=="" ||
        token==null || token==""){
        top.location = getBeonePath("ESS")+"login_out" ;
    }else{
        jsonASD.user_id = user_id ;
        jsonASD.user_name = user_name;
        jsonASD.org_id = belong_org_id;
        jsonASD.token_lx = token_lx;
        jsonASD.token = token;
        jsonASD.bslx = bslx;
        jsonASD.xmlx='ESS';
        return jsonASD ;
    }
}

/**
 * 获取路径
 * @param type:
 *              ESS  服务授权平台
 *              JXSC 教师平台
 *              BCCA 设备平台
 *              JW   教委平台
 *
 * @returns {string}
 */
function getBeonePath(type){
    if(type=='ESS'){
        return ESS;
    }else if(type=='JXSC'){
        return JXSC;
    }else if(type=='BCCA'){
        return BCCA;
    }else if(type=='JW'){
        return JW;
    }
}

/**
 * 时间格式化
 * @param fmt  "yyyy-mm-dd HH:MM:SS"
 * @param date  时间
 * @returns {*}
 */
function dateFormat(fmt,date) {
    if (date==""||date==null||date==undefined){
        return "";
    }
    date=new Date(date);
    var ret;
    var opt = {
        "y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (var k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

/**
 * 判断是否以某字符串结尾
 * @param endStr
 * @returns {boolean}
 */
String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d);
}
/**
 * 判断是否以某字符串开头
 * @param startStr
 * @returns {boolean}
 */
String.prototype.startWith=function (startStr) {
    var d=this.length;
    return (d>0&&this.substring(0,startStr.length)==startStr)
}


/**
 * 获取数据字典值
 * @param type
 *          1.全部
 *          2.可用
 *          3.不可用
 * @param name 数据字典类型值
 */
function getDataInfo(type,name,codeName) {
    if(JxCore.dataInfo[codeName] == null || JxCore.dataInfo[codeName] == undefined){
        var getDataInfoUrl= getBeonePath("ESS")+"common/getDataInfo";
        var result="";
        var json={
            "type":type,
            "name":name,
            'ASD':getJsonASD()
        };
        $.ajax({
            type: 'POST',
            url: getDataInfoUrl,
            dataType: "json",
            data: JSON.stringify(json),
            async:false,
            contentType : "application/json",
            success: function(reg) {
                JxCore.dataInfo[codeName] = reg.data ;
                parent.parent.p_dataInfo = JxCore.dataInfo ;
            },
            error: function() {
                console.log("fucking error")
            }
        });
    }
}

/**
 *
 * @param key
 * @returns {*}
 */
function getConfig(key) {
    var value;
    var url=getBeonePath("ESS")+"common/getConfig";
    var json={
        "key":key,
        'ASD':getJsonASD()
    };
    getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
            if(reg.resultCode == "200"){
                value = reg.data;
            }
        }
    });
    return value;
}

/**
 * 获取数据字典内容
 * @param data  数组
 * @param key   KEY值
 * @returns {string}  返回内容
 */
function getDataText(name,key){
    var codeName = name + '_ALL' ;
    getDataInfo('1',name,codeName);
    var text = '' ;
    for(var i=0;i<JxCore.dataInfo[codeName].length;i++){
        if(key == JxCore.dataInfo[codeName][i].key){
            text = JxCore.dataInfo[codeName][i].value  ;
            break ;
        }
    }
    return text ;
}

/**
 * 拼装下拉数据字典
 * @param data  数组
 * @param def   默认选中值
 * @param opsel 是否有请选择选项及选项说明
 * @returns {string}  返回字符串
 */
function getDataSelectHtml(name,type,def,opsel){
    var codeName = '' ;
    if(type==1)
        codeName = name + '_ALL' ;
    else if(type==2)
        codeName = name ;
    else
        codeName = name + '_NO' ;

    getDataInfo(type,name,codeName);
    var options = '' ;
    if(opsel!=null && opsel!=''){
        options = '<option value="">'+opsel+'</option>';
    }
    for(var i=0;i<JxCore.dataInfo[codeName].length;i++){
        if(def!=null && def!='' && def==JxCore.dataInfo[codeName][i].key)
            options += '<option value="'+ JxCore.dataInfo[codeName][i].key +'" selected>'+ JxCore.dataInfo[codeName][i].value +'</option>';
        else
            options += '<option value="'+ JxCore.dataInfo[codeName][i].key +'">'+ JxCore.dataInfo[codeName][i].value +'</option>';
    }
    return options ;
}

function getSelectHtmlByData(def,data,opsel) {
    var options = '';
    if(opsel!=null && opsel!=''){
        options = '<option value="">'+opsel+'</option>';
    }
    for(var i in data){
        if (def!=null && def!='' && i==def) {
            options +=  '<option value="'+ i +'" selected>'+ data[i] +'</option>';
        }else{
            options +=  '<option value="'+ i +'">'+ data[i] +'</option>';
        }
    }
    return options;
}

/**
 * 调用ajax方法
 * @param param
 */
function getAjax(param) {
    $.ajax({
        type : param.type || 'POST',
        url : param.url,
        contentType : 'application/json',
        async : param.async || false ,
        data : param.data,
        dataType : param.dataType || 'json' ,
        success : function(data) {
            if(data.resultCode === '999'){
                window.top.location.href = basePath+"login_out" ;
            }else{
                param.callback(data);
            }
        },
        error : function(data) {
            console.log("error = ",data);
            if(data.status == '200' && data.statusText == 'parsererror'){
                window.top.location.href = basePath+"login_out" ;
            }
        }
    })
}

/**
 * 获取权限
 * ThirdCode：当前三级菜单的code值
 */
function getRigth() {
    if (JxCore.dataRight[ThirdCode]==null||JxCore.dataRight[ThirdCode]==""||JxCore.dataRight[ThirdCode].length==0||JxCore.dataRight[ThirdCode]==undefined){
        var url= getBeonePath("ESS")+"sys/selRightButton";
        var json={
            "right_pid":ThirdId,
            "isadmin":isadmin,
            "org_id":belong_org_id,
            "user_id":user_id,
            'xmlx':xmlx,
            'tableName':'ess1',
            'ASD':getJsonASD()
        };
        getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
                reg=reg.resultMsg.data;
                JxCore.dataRight[ThirdCode]=reg;
                // parent.parent.p_rightInfo= JxCore.dataRight;
            }
        });
    }
}


/**
 * 菜单权限
 * @Author: 倪杨
 * @Date: 2019/12/2
 */
function judgeButtonRights(reg) {
    getRigth();

    var right = JxCore.dataRight[ThirdCode];//获取有权限的三级目录

    var html = '<div class="bar">';//返回值

    var obj = reg.rowData;
    var rowData = JSON.parse(obj);    //该条记录的数据

    var judge = {};  //自定义的判断条件
    if (reg.judge != null && reg.judge != "" && reg.judge != undefined) {
        judge = reg.judge;
    }

    var shield = ['_CX', '_ADD', '_IN', '_OUT']; //需要屏蔽的code
    if (reg.shield != null && reg.shield != "" && reg.shield != undefined) {
        shield = reg.shield;
    }

    for (var i = 0; i < right.length; i++) {
        var sta = false;
        if (right[i].counts > 0) {    //有权限
            if($.inArray(right[i].right_code, shield)>-1){
                continue;
            }
            var right_code = right[i].right_code.split("_");
            if (shield.indexOf("_"+right_code[right_code.length-1])!=-1) { //截取code值的最后一节，并判断是否在需要屏蔽的数组中
                continue;
            }
            //判断该按钮是否有其他限制
            //1.个人或管理员限制
            if (right[i].attr_1 == undefined || right[i].attr_1 == "" || right[i].attr_1 == null) {
                sta = true;
            } else {
                var attr1 = right[i].attr_1;
                if (attr1.indexOf("2") > -1 && isadmin == '2') {
                    sta = true;
                }
                if (rowData.CREA_ID!=null){
                    if (attr1.indexOf("1") > -1 && rowData.CREA_ID == user_id) {
                        sta = true;
                    }
                }
            }
            //2.自定义的判断条件
            if (sta){
                if (right[i].right_code in judge) {
                    if (judge[right[i].right_code] == 'Y') {
                        sta = true;
                    }else {
                        sta = false;
                    }
                }
            }
        }
        if (sta){
            if (reg.TYQY!=null&&right[i].right_code.endWith("_TYQY")){
                if (rowData[reg.TYQY]=='1'){
                    html+='<a href="javascript:void(0)" title="启用" lay-event="'+"enable" +'"><img src="img/menu/menu4/blue/nr_icon_start.png"></a>';
                }else{
                    html+='<a href="javascript:void(0)" title="停用" lay-event="'+"stop" +'"><img src="img/menu/menu4/blue/nr_icon_stop.png"></a>';
                }
            }else{
                html+='<a href="javascript:void(0)" title="'+right[i].right_name+'" lay-event="'+right[i].right_code +'"><img src="img/menu/menu4/blue/'+right[i].right_icon+'"></a>';
            }
        } else {
            if (reg.TYQY!=null&&right[i].right_code.endWith("_TYQY")){
                if (rowData[reg.TYQY]=='1'){
                    html+='<a href="javascript:void(0)" title="启用" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/nr_icon_start.png"></a>';
                }else{
                    html+='<a href="javascript:void(0)" title="停用" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/nr_icon_stop.png"></a>';
                }
            }else{
                html+='<a href="javascript:void(0)"  title="'+right[i].right_name+'" lay-event="'+"unavailable" +'"><img src="img/menu/menu4/paleblue/'+right[i].right_icon+'"></a>';
            }
        }
    }
    html+='</div>';
    return html;
}
/**
 *  rowdata:该行记录数据
 *  specualCondition：{"ZT":{"1":"N","2":"Y"},"ISADMIN":{"1":"Y","2":"N"}}; 可多个条件
 *  type: and :&& ,or:||
 * @Author: 倪杨
 * @Date: 2019/11/30
 */
function judgeButtonRightsSon(rowData,specualCondition,type) {
    if (type==null||type==""||type==undefined){
        type="and";
    }
    if (rowData==null||rowData==""||rowData==undefined){
        return "N";
    }
    rowData=JSON.parse(rowData);
    var sta=true;
    for (var key in specualCondition){
        if (type=="and"){
            sta=sta&&specualCondition[key][rowData[key]]=="Y";
        } 
        if (type=="or"){
            sta=sta||specualCondition[key][rowData[key]]=="Y";
        }
        
    }
    if (sta){
        return "Y";
    }
    return "N";
}

/**
 * 判断是否有权限
 * @param codeName 权限code值
 * @returns {boolean}
 */
function hasRight(codeName) {
    var sta=false;

     getRigth();

    var right = JxCore.dataRight[ThirdCode];

    for (var i=0;i<right.length;i++){
        if (right[i].right_code==codeName&&right[i].counts>0){
            if(right[i].attr_1==undefined||right[i].attr_1==""||right[i].attr_1==null){
                sta = true;
            }else {
                var attr1=right[i].attr_1;
                if (attr1.indexOf("2")>-1&&isadmin=='2'){
                    sta = true;
                }
            }

        }
    }
    return sta;
}

/**
 * 获取下拉框拼装
 * url  地址
 * tableName  表名
 * type  类型 1 停用  2 启用
 * def 默认值
 * opsel 选项提示
 * key 下拉键
 * value 下拉值
 * glid 关联查询ID
 * */
function getSelectHtml(url,tableName,type,def,opsel,key,value,where, glid){
    var options = '' ;
    var codeName = tableName+type+glid;
    $.ajaxSetup({async: false});
    getTableDataInfo(url, tableName, type, key,value, where, glid);
    if(opsel!=null && opsel!=''){
        options = '<option value="">'+opsel+'</option>';
    }
    var list = JxCore.dataInfo[codeName];
    for(var i=0;i<list.length;i++){
        if(def!=null && def!='' && def==list[i].ID)
            options += '<option value="'+ list[i][key] +'" selected>'+ list[i][value] +'</option>';
        else
            options += '<option value="'+ list[i][key] +'">'+ list[i][value] +'</option>';
    }
    return options ;
}
/**
 * 获取表数据
 * url  地址
 * tableName  表名
 * type  类型 1 停用  2 启用
 * where 参数
 * glid 关联查询ID
 * */
function getTableDataInfo(url, tableName,type,key,value, where, glid){
    var codeName = tableName+type+glid;
    var json={
        'fildName':key+','+value,
        'tableName':tableName,
        'where':where,
        'ASD':getJsonASD()
    };
    getAjax({url:url,data:JSON.stringify(json),callback:function (reg) {
            if (reg.resultCode=="200"){
                JxCore.dataInfo[codeName] = reg.resultData ;
                parent.parent.p_dataInfo = JxCore.dataInfo ;
            }
        }});
}
/**
 * 获取数据内容
 * @param url  地址
 * @param tableName  表名
 * param type  类型 1 停用  2 启用
 * @param def  默认值
 * @param key  键
 * @param value 值
 * @param where 参数
 * @param glid 关联ID
 * @returns {string}  返回内容
 */
function getTableDataText(url, tableName, type, def, key, value, where, glid){
    getTableDataInfo(url, tableName, '', key, value, where, glid)
    var text = '' ;
    var list = JxCore.dataInfo[tableName];
    for(var i=0;i<list.length;i++){
        if(def == list[i][key]){
            text = list[i][value] ;
            break ;
        }
    }
    return text ;
}


//获取字符串长度
function GetLength(str) {
    if(str == undefined){
        str = '';
    }
    //<summary>获得字符串实际长度，中文2，英文1</summary>
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

function cutstr(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
        a = str.charAt(i);
        str_length++;
        if (escape(a).length > 4) {
            //中文字符的长度经编码之后大于4
            str_length++;
        }
        str_cut = str_cut.concat(a);
        if (str_length >= len) {
            str_cut = str_cut.concat("...");
            return str_cut;
        }
    }
    //如果给定字符串小于指定长度，则返回源字符串；
    if (str_length < len) {
        return str;
    }
}


//-------------------------------------格式验证开始---------------------------------------------------
/**
 * 判断身份证是否合法
 */
function getSfzhIsTrue(value){
    if(value.length<15)  return '请输入有效身份证';
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var tip = "";
    var pass= true;
    if(!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(value)){
        tip = "身份证号格式错误";
        pass = false;
    }else if(!city[value.substr(0,2)]){
        tip = "身份证号地址编码错误";
        pass = false;
    }else{
        //18位身份证需要验证最后一位校验位
        if(value.length == 18){
            var value = value.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++){
                ai = value[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if(last != value[17]){
                tip = "身份证号校验位错误";
                pass =false;
            }
        }
    }
    if(pass){
        return '' ;
    }else{
        return tip ;
    }
}

//中文英文下划线
function getSpecial(value,item){
    var msg = '' ;
    if(value != null && value != ''){
        if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
            if(item!=null && item.title!=null && item.title != '' && item.title != undefined)
                msg = "["+item.title+"] 不能有特殊字符";
            else
                msg = "不能有特殊字符" ;
        }
    }
    return msg ;
}

//排除单双引号
function excludeSDQuotes(value,item){
    var msg = '' ;
    if(value != null && value != ''){
        var pattern = new RegExp("[\"\'’‘“”]");
        if(new RegExp(pattern).test(value)){
            if(item!=null && item.title!=null && item.title != '' && item.title != undefined)
                msg = "["+item.title+"] 不能有单双引号";
            else
                msg = "不能有单双引号" ;
        }
    }
    return msg ;
}

//邮政编码
function getZipcode(value,item){
    var msg = '' ;
    var reg = /^[1-9]\d{5}$/;
    if(!reg.test(value)){
        if(item!=null && item.title!=null && item.title != '' && item.title != undefined)
            msg = "["+item.title+"] 邮政编码格式错误";
        else
            msg = "邮政编码格式错误" ;
    }
    return msg ;
}

//正整数
function getPositiveInteger(value,item){
    var msg = '' ;
    if(!new RegExp("^[1-9]\\d*$").test(value)){
        if(item!=null && item.title!=null && item.title != '' && item.title != undefined)
            msg = "["+item.title+"] 必须是正整数";
        else
            msg = "必须是正整数" ;
    }
    return msg ;
}

//-------------------------------------格式验证结束---------------------------------------------------


function upperJSONKey(jsonObj){
    var jsons = {};
    for (var key in jsonObj){
        jsons[key.toUpperCase()] = jsonObj[key];
    }
    return jsons;
}

function upperListKey(list){
    var listArray = new Array();
    if(list.length > 0){
        var jsons = {};
        for(var i=0;i<list.length;i++){
            jsons = {};
            for (var key in list[i]){
                jsons[key.toUpperCase()] = list[i][key];
            }
            listArray.push(jsons);
        }
    }
    return listArray;
}

/**
* 通过id去帮助中心表（PT_BZZX）中查询
* @Author   :倪杨
* @time     :2020/2/13
**/
function getHelpNr(id) {
    var bzzx = '基础帮助中心';
    var json ={};
    json.ASD=getJsonASD();
    json.ASD.code="PTGL_BZJF_BZZX_CX";
    json.tableName="ess56";
    json.finxldName="NR";
    var jsonWhere = {};
    jsonWhere.CD = id;
    json.where = jsonWhere;
    getAjax({url:getBeonePath("ESS")+"common/find",data:JSON.stringify(json),callback:function (reg) {
            if (reg.resultCode=="200"){
                var list = reg.resultData;
                if (list.length>0){
                    bzzx = list[0].nr;
                }
            }
        }
    });
    return bzzx;
}