package com.beoneess.business.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.beoneess.business.domain.SbzcLx;
import com.beoneess.business.mapper.ZcsbMapper;
import com.beoneess.common.controller.CommonController;
import com.beoneess.common.controller.ContextHelper;
import com.beoneess.common.mapper.CommonMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

import static com.beoneess.common.controller.LoginController.inside_bcca;

/**
 * @program: beone-jxsc
 * @description: 平台
 * @author: liu yan
 * @create: 2019-10-09 14:21
 */
@Service
public class ZcsbServiceImpl {

    @Autowired
    private ZcsbMapper zcsbMapper;
    @Autowired
    private CommonMapper commonMapper;
    @Value("${D3}")
    private String D3;
    @Value("${BCCA}")
    private String BCCA;

    /**
     * 设备授权账户申请区域查询  接口
     * lch
     * 2019-11-27
     * */
    public JSONArray selAreaList(Map<String , Object> map)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) map.get("ASD");
        String area_code = map.get("area_code").toString();
        JSONArray jsonArray = new JSONArray();
        Map<String, Object> map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SMH_DEVICE");
//        map2.put("tiaojian", "BELONG_ORG_ID = "+ asdMap.get("org_id"));
        List<Map<String, Object>> devicelist = commonMapper.selectFieldsByOther(map2);
        if(devicelist == null || devicelist.size() == 0){
            throw new Exception("请先添加第三方账户信息");
        }else{
            String appid = devicelist.get(0).get("DEVICE_DGJ_ID").toString();
            String appkey = devicelist.get(0).get("DEVICE_DGJ_KEY").toString();
            String dgj_url = devicelist.get(0).get("DEVICE_DGJ_URL").toString();

            String token = ContextHelper.getSessionStr(appid);
            if(token == null){
                token = getDgjToken(dgj_url, appid, appkey);
                ContextHelper.getRequest().setAttribute(appid, token);
            }
            String tokenUrl = "/thirdInterface/getAreas";
            JSONObject obj = new JSONObject();
            obj.put("service_id", appid);
            obj.put("token", token);
            if(!"0".equals(area_code)){
                obj.put("area_code", area_code);
            }
            String line = ContextHelper.client_bcca(dgj_url+tokenUrl, obj, "");
            System.out.println(line);
            if(line == null){
                throw new Exception("获取区域无返回");
            }
            JSONObject object3 = JSONObject.parseObject(line);
            if(object3.get("code").equals("400")){
                //token 过期
                token = getDgjToken(dgj_url, appid, appkey);
                ContextHelper.getRequest().setAttribute(appid, token);
                obj.put("token", token);
                line = ContextHelper.client_bcca(dgj_url+tokenUrl, obj, "");
                object3 = JSONObject.parseObject(line);
            }
            if(object3.get("code").equals("200")){
                jsonArray = JSONArray.parseArray(object3.get("data").toString());
            }else{
                throw new Exception(object3.get("msg")+"");
            }
        }
        return jsonArray;
    }

    /**
     * 房间列表 查询
     * lch
     * 2019-10-14
     * */
    public Map<String, Object> findFjxxOnPage(Map<String , Object> params)throws Exception{
        int pageNo = Integer.parseInt(params.get("page").toString());
        int pageSize = Integer.parseInt(params.get("limit").toString());
        Integer total = zcsbMapper.findFjxxOnPageCount(params);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        List<Map<String, Object>> list = zcsbMapper.findFjxxOnPage(params);

        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }

    /**
     * 设备账户分页查询
     * lch
     * 2019-10-24
     * */
    public Map<String, Object> selSmhlist(Map<String , Object> params)throws Exception{
        int pageNo = Integer.parseInt(params.get("page").toString());
        int pageSize = Integer.parseInt(params.get("limit").toString());
        Integer total = zcsbMapper.selSmhlistCount(params);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        List<Map<String, Object>> list = zcsbMapper.selSmhlist(params);

        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }

    /**
     * 设备账户申请
     * lch
     * 2019-10-14
     * */
    public void insertSetting(Map<String , Object> params)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) params.get("ASD");
        Map<String, Object> map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SMH_DEVICE");
        map2.put("tiaojian", "BELONG_ORG_ID = 1");
        List<Map<String, Object>> devicelist = commonMapper.selectFieldsByOther(map2);
        if(devicelist == null || devicelist.size() == 0){
            throw new Exception("请先添加第三方账户信息");
        }else{
            String ap_id = devicelist.get(0).get("DEVICE_DGJ_JRS").toString();
            ap_id = ap_id.substring(2);
            ap_id = ap_id.replaceAll("^(0+)", "");

            String appid = devicelist.get(0).get("DEVICE_DGJ_ID").toString();
            String appkey = devicelist.get(0).get("DEVICE_DGJ_KEY").toString();
            String dgj_url = devicelist.get(0).get("DEVICE_DGJ_URL").toString();
            String device_id = devicelist.get(0).get("DEVICE_ID").toString();
            String method = "/thirdInterface/addAccount";
            String token = ContextHelper.getSessionStr(appid);
            if(token == null || "".equals(token)){
                token = getDgjToken(dgj_url, appid, appkey);
                ContextHelper.getRequest().getSession().setAttribute(appid, token);
            }

            Map<String, Object> insertMap = (Map<String, Object>) params.get("insert");
            String province10 = insertMap.get("province10").toString();
            String city10 = insertMap.get("city10").toString();
            String district10 = insertMap.get("district10").toString();
            String NAME = insertMap.get("name").toString();
            String SEX = insertMap.get("sex").toString();
            String SFZH = insertMap.get("sfzh").toString();
            String PHONE = insertMap.get("phone").toString();
            String EMAIL = insertMap.get("email").toString();
            String org_id = insertMap.get("org_id").toString();

            JSONObject obj = new JSONObject();
            obj.put("service_id", appid);
            obj.put("token", token);
            obj.put("password", "111111");
            obj.put("id_no", SFZH);
            obj.put("name", NAME);
            obj.put("phone", PHONE);
            obj.put("gender", SEX);
            obj.put("email", EMAIL);
            obj.put("area_code1",province10);
            obj.put("area_code2",city10);
            obj.put("area_code3",district10);
            String line = ContextHelper.client_bcca(dgj_url+method, obj, "");
            System.out.println(line);
            if(line == null){
                throw new Exception("账户申请没有返回");
            }
            JSONObject object3 = JSONObject.parseObject(line);
            String account = null;
            if(object3.get("code").equals("400")){
                //token过期
                token = getDgjToken(dgj_url, appid, appkey);
                ContextHelper.getRequest().getSession().setAttribute(appid, token);
                obj.put("token", token);
                line = ContextHelper.client_bcca(dgj_url+method, obj, "");
                object3 = JSONObject.parseObject(line);
            }
            if(object3.get("code").equals("200")){
                account = object3.get("data").toString();

                String tableName = "SMH_SETTING";
                Map<String, Object> map1 = new HashMap<>();

                String seq="seq_"+org_id;
                map1.put("SETTING_ID", "'"+ CommonController.getSEQ(seq) +"'");
                map1.put("SETTING_ACCOUNT", "'"+ account +"'");
                map1.put("SETTING_PWD", "'"+ 111111 +"'");
                map1.put("SETTING_SFKT", "'"+ 2 +"'");
                map1.put("SETTING_ZZH", "'"+ 1 +"'");
                map1.put("SETTING_DYZT", "'"+ 1 +"'");
                map1.put("SETTING_NAME", "'"+ NAME +"'");
                map1.put("SETTING_SEX", "'"+ SEX +"'");
                map1.put("SETTING_ZJH", "'"+ SFZH +"'");
                map1.put("SETTING_PHONE", "'"+ PHONE +"'");
                map1.put("SETTING_EMAIL", "'"+ EMAIL +"'");
                map1.put("SETTING_CITY", "'"+ province10 +","+ city10 + ","+ district10 +"'");
                map1.put("CREATOR_ID", "'"+ asdMap.get("user_id") +"'");
                map1.put("CREATOR_NAME", "'"+ asdMap.get("user_name") +"'");
                map1.put("CREATED_TIME", "sysdate");
                map1.put("EDITOR_ID", "'"+ asdMap.get("user_id") +"'");
                map1.put("EDITOR_NAME", "'"+ asdMap.get("user_name") +"'");
                map1.put("EDITED_TIME", "sysdate");
                map1.put("BELONG_ORG_ID", "'"+ org_id +"'");
                map1.put("ATTR_1",  "'"+ device_id +"'");

                //数据封装
                String[] keys = ContextHelper.getKey(map1);
                map2 = new HashMap<String, Object>();
                map2.put("tablename" , tableName);
                map2.put("keys" , keys);
                map2.put("params" , map1);
                commonMapper.insert(map2);
            }else{
                throw new Exception(object3.get("msg")+"");
            }
        }

    }

    /**
     * 账户订阅
     * lch
     * 2019-10-14
     */
    public void dySetting(Map<String , Object> params)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) params.get("ASD");
        Map<String, Object> fildMap = (Map<String, Object>) params.get("fild");
        Map<String, Object> whereMap = (Map<String, Object>) params.get("where");
        String account = fildMap.get("account").toString();
        Map<String, Object> map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SMH_DEVICE");
        map2.put("tiaojian", "BELONG_ORG_ID = 1");
        List<Map<String, Object>> devicelist = commonMapper.selectFieldsByOther(map2);
        if(devicelist == null || devicelist.size() == 0){
            throw new Exception("请先添加第三方账户信息");
        }else{
            String apcos_url = devicelist.get(0).get("DEVICE_APCOS_URL").toString();
            String service_id = devicelist.get(0).get("DEVICE_APCOS_ID").toString();
            String service_key = devicelist.get(0).get("DEVICE_APCOS_KEY").toString();
            String apcos_call_back = devicelist.get(0).get("DEVICE_APCOS_CALL_BACK").toString();
            String dgj_url = devicelist.get(0).get("DEVICE_DGJ_URL").toString();
            //先重session中获取token
            String token = ContextHelper.getSessionStr(service_id);
            if(token == null || "".equals(token)){
                token = getApcosToken(dgj_url, service_id, service_key, apcos_call_back, "");
                ContextHelper.getRequest().getSession().setAttribute(service_id, token);
            }
            String result = getSbdy(apcos_url, service_id, token, account);
            if(result != null){
                if(result.trim().equals("account invalid")){
                    throw new Exception("账户错误，该账户下没有注册设备！");
                }
                JSONObject jsonObject= JSONObject.parseObject(result);
                if(jsonObject.get("resultCode").equals("0101")){
                    token = getApcosToken(dgj_url, service_id, service_key, apcos_call_back, "");

                    result = getSbdy(apcos_url, service_id, token, account);
                    jsonObject= JSONObject.parseObject(result);
                }
                if(!jsonObject.get("resultCode").equals("0000")){
                    throw new Exception(jsonObject.get("resultDesc")+"，"+jsonObject.get("resultContent"));
                }else{
                    registerCallBack(apcos_url,service_id,token,apcos_call_back);

                    Map<String, Object> map=new HashMap<String, Object>();
                    Map<String, Object> map1 = new HashMap<>();
                    map1.put("SETTING_DYZT", "'"+ 2 +"'");
                    String[] keys = ContextHelper.getKey(map1);
                    Map<String, Object> map3 = new HashMap<>();
                    map3.put("SETTING_ID", "'"+ whereMap.get("id") +"'");
                    String[] keys3 = ContextHelper.getKey(map3);
                    map.put("tablename", "SMH_SETTING");	//表名
                    map.put("keys", keys);				//修改字段名
                    map.put("params", map1);			//修改字段
                    map.put("keys2", keys3);			//条件字段名
                    map.put("params2", map3);		//条件字段
                    commonMapper.update(map);
                }
            }else{
                throw new Exception("订阅没有数据返回，订阅失败！");
            }
        }

    }

    /**
     * 解绑设备
     * lch
     * 2019-11-27
     * */
    @Transactional(rollbackFor = Exception.class)
    public void unbind(Map<String , Object> map)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) map.get("ASD");
        String account = map.get("account").toString();
        String mac = map.get("mac").toString();
        //删除设备信息表
        Map<String , Object> map1 = new HashMap<>();
        map1.put("SBXX_MAC", "'"+ mac +"'");
        Map<String , Object> map2 = new HashMap<>();
        map2.put("tablename", "SBZC_SBXX");
        map2.put("keys", ContextHelper.getKey(map1));
        map2.put("params", map1);
        commonMapper.delete(map2);

        String sjjsUrl = "/sys/dataRecept";
        JSONObject sjtbJson = new JSONObject();
        sjtbJson.put("dataType", "delZcdpxx");
        sjtbJson.put("org_id", asdMap.get("org_id"));
        sjtbJson.put("data", mac);
        String result = ContextHelper.client_bcca(inside_bcca+sjjsUrl, sjtbJson, "");
        if(result == null){
            throw new Exception("解绑时删除资产单品无返回");
        }else{
            JSONObject jsonObject = JSONObject.parseObject(result);
            if(!"200".equals(jsonObject.get("resultCode"))){
                throw new Exception(jsonObject.get("resultMsg")+"");
            }
        }

        String fieldName = "*";
        String tableName = "SMH_DEVICE";
        String tiaojian = "BELONG_ORG_ID = "+ asdMap.get("org_id");
        map1 = new HashMap<>();
        map1.put("fieldName", fieldName);
        map1.put("tablename", tableName);
        map1.put("tiaojian", tiaojian);
        List<Map<String, Object>> devicelist = commonMapper.selectFieldsByOther(map1);
        if(devicelist==null || devicelist.size() == 0){
            throw new Exception("请先添加第三方账户信息");
        }
        String DGJ_URL = devicelist.get(0).get("DEVICE_DGJ_URL").toString();
        String DGJ_ID = devicelist.get(0).get("DEVICE_DGJ_ID").toString();
        String DGJ_KEY = devicelist.get(0).get("DEVICE_DGJ_KEY").toString();
        String token = ContextHelper.getSessionStr(DGJ_ID);
        if(token == null || "".equals(token)){
            token = ZcsbServiceImpl.getDgjToken(DGJ_URL, DGJ_ID, DGJ_KEY);
            ContextHelper.getRequest().getSession().setAttribute(DGJ_ID, token);
        }
        String method = "/thirdInterface/unbind";
        JSONObject obj = new JSONObject();
        obj.put("service_id", DGJ_ID);
        obj.put("token", token);
        obj.put("account", account);
        obj.put("mac", mac);
        result = ContextHelper.client_bcca(DGJ_URL+method, obj, account);
        System.out.println(result);
        if(result == null){
            throw new Exception("设备解绑无返回，解绑失败");
        }
        JSONObject object = JSONObject.parseObject(result);
        if(object.get("code").equals("400")){
            token = ZcsbServiceImpl.getDgjToken(DGJ_URL, DGJ_ID, DGJ_KEY);
            ContextHelper.getRequest().getSession().setAttribute(DGJ_ID, token);
            obj.put("token", token);
            result = ContextHelper.client_bcca(DGJ_URL+method, obj, account);
            object = JSONObject.parseObject(result);
        }
        if(!object.get("code").equals("200")){
            throw new Exception(object.get("msg")+"");
        }

    }

    /**
     * 同步设备类型
     * lch
     * 2019-10-15
     * */
    @Transactional(rollbackFor = Exception.class)
    public String syncLx(Map<String , Object> params)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) params.get("ASD");
        String user_id = asdMap.get("user_id").toString();
        String user_name = asdMap.get("user_name").toString();
        String org_id = asdMap.get("org_id").toString();
        String msg = "";
        int addcount = 0; // 成功设备数
        int editcount = 0; // 修改设备数
        int snum = 0;//同步总数量
        Map<String, Object> map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SMH_DEVICE");
        map2.put("tiaojian", "BELONG_ORG_ID = "+ asdMap.get("org_id"));
        List<Map<String, Object>> devicelist = commonMapper.selectFieldsByOther(map2);
        if(devicelist==null || devicelist.size() == 0){
            throw new Exception("请先添加第三方账户信息");
        }
        String KFPT_URL = devicelist.get(0).get("DEVICE_KFPT_URL").toString();
        String KFPT_ID = devicelist.get(0).get("DEVICE_KFPT_ID").toString();
        String KFPT_KEY = devicelist.get(0).get("DEVICE_KFPT_KEY").toString();
        String dgj_url = devicelist.get(0).get("DEVICE_DGJ_URL").toString();

        String token = ContextHelper.getSessionStr(KFPT_ID);
        if(token == null || "".equals(token)){
            token = getKfzptToken(dgj_url, KFPT_ID, KFPT_KEY, "");
            ContextHelper.getRequest().getSession().setAttribute(KFPT_ID, token);
        }
        String result = getSblxList(KFPT_URL, KFPT_ID, token, "");
        System.out.println("result:"+result);
        if(result == null){
            throw new Exception("获取设备类型没有返回，同步失败!");
        }
        JSONObject jsonObject= JSONObject.parseObject(result);
        if(jsonObject.get("resultCode").equals("0000")){
            String resultContent = jsonObject.get("resultContent").toString();
            JSONArray jsonArray = JSONArray.parseArray(resultContent);
            String fieldName = "*";
            String tableName = "SBZC_LX";
            String tiaojian = "";
            List<Map<String, Object>> list = null;
            Map<String, Object> map1 = null;
            Map<String, Object> map3 = null;
            snum = jsonArray.size();
            for (Iterator iterator = jsonArray.iterator(); iterator.hasNext();) {
                JSONObject job = (JSONObject) iterator.next();
                System.out.println(job);

                tiaojian = "LX_MLDM = '"+ job.get("productCode") +"' AND LX_TYPE = '3' AND BELONG_ORG_ID = '"+ org_id +"'";
                map2 = new HashMap<String, Object>();
                map2.put("fieldName",fieldName);
                map2.put("tablename", tableName);
                map2.put("tiaojian", tiaojian);
                list = commonMapper.selectFieldsByOther(map2);
                if(list == null || list.size() == 0){
                    addcount = addcount + 1;
                    String seq="seq_"+asdMap.get("org_id").toString();
                    String LX_ID = CommonController.getSEQ(seq);
                    map1 = new HashMap<>();
                    map1.put("LX_ID", "'"+ LX_ID +"'");
                    map1.put("LX_TYPE", "'"+ 3 +"'");
                    map1.put("LX_MLDM", "'"+ job.get("productCode") +"'");
                    map1.put("LX_MLMC", "'"+ job.get("typeName") +"'");
                    map1.put("LX_SFTY", "'"+ 2 +"'");
                    map1.put("ATTR_1", "'"+ job.get("typeDescription") +"'");
                    map1.put("CREATOR_ID", "'"+ user_id +"'");
                    map1.put("CREATOR_NAME", "'"+ user_name +"'");
                    map1.put("CREATED_TIME", "SYSDATE");
                    map1.put("EDITOR_ID", "'"+ user_id +"'");
                    map1.put("EDITOR_NAME", "'"+ user_name +"'");
                    map1.put("EDITED_TIME", "SYSDATE");
                    map1.put("BELONG_ORG_ID", "'"+ org_id +"'");

                    String[] keys = ContextHelper.getKey(map1);
                    map2 = new HashMap<String, Object>();
                    map2.put("tablename" , tableName);
                    map2.put("keys" , keys);
                    map2.put("params" , map1);
                    commonMapper.insert(map2);
                    //插入设备模板
                    Map<String, String> mapx = new HashMap<>();
                    mapx.put("MOULD_ID", CommonController.getSEQ(seq));
                    mapx.put("LX_ID", LX_ID);
                    mapx.put("BELONG_ORG_ID", org_id);
                    if(job.containsKey("pcTemplate") && !"".equals(job.get("pcTemplate"))){
                        mapx.put("LX_WEB_MODEL", job.get("pcTemplate")+"");
                    }else{
                        mapx.put("LX_WEB_MODEL", "");
                    }
                    if(job.containsKey("mobileTemplate") && !"".equals(job.get("mobileTemplate"))){
                        mapx.put("LX_APP_MODEL", job.get("mobileTemplate")+"");
                    }else{
                        mapx.put("LX_APP_MODEL", "");
                    }
                    zcsbMapper.insertSblxMb(mapx);
                }else{
                    editcount = editcount + 1;
                    map1 = new HashMap<>();
                    map1.put("LX_MLDM", "'"+ job.get("productCode") +"'");
                    map1.put("LX_MLMC", "'"+ job.get("typeName") +"'");
                    map1.put("ATTR_1", "'"+ job.get("typeDescription") +"'");
                    map1.put("EDITOR_ID", "'"+ user_id +"'");
                    map1.put("EDITOR_NAME", "'"+ user_name +"'");
                    map1.put("EDITED_TIME", "SYSDATE");

                    String[] keys = ContextHelper.getKey(map1);
                    map2 = new HashMap<String, Object>();
                    map2.put("tablename" , tableName);
                    map2.put("keys" , keys);
                    map2.put("params" , map1);
                    map3 = new HashMap<>();
                    map3.put("LX_ID", "'"+ list.get(0).get("LX_ID") +"'");
                    String[] keys2 = ContextHelper.getKey(map3);	//条件字段名数组
                    map2.put("keys2", keys2);	//条件字段名
                    map2.put("params2", map3);		//条件字段
                    commonMapper.update(map2);

                    //修改设备模板
                    map1 = new HashMap<>();
                    if(job.containsKey("pcTemplate") && !"".equals(job.get("pcTemplate"))){
                        map1.put("LX_WEB_MODEL", "'"+ job.get("pcTemplate") +"'");

                        map3 = new HashMap<>();
                        map3.put("mb", job.get("pcTemplate"));
                        map3.put("id", list.get(0).get("LX_ID"));
                        map3.put("org_id", org_id);
                        zcsbMapper.setWebSbMb(map3);
                    }
                    if(job.containsKey("mobileTemplate") && !"".equals(job.get("mobileTemplate"))){
                        map1.put("LX_APP_MODEL", "'"+ job.get("mobileTemplate") +"'");
                        map3 = new HashMap<>();
                        map3.put("mb", job.get("mobileTemplate"));
                        map3.put("id", list.get(0).get("LX_ID"));
                        map3.put("org_id", org_id);
                        zcsbMapper.setWebSbMb(map3);
                    }

                }
            }
        }else{
            throw new Exception(jsonObject.get("resultDesc").toString());
        }
        msg = "同步设备类型数量:" + snum + "，成功添加：" + addcount + "， 修改："+ editcount;
        return msg;
    }

    /**
     * 同步设备
     * lch
     * 2019-10-15
     * */
    @Transactional(rollbackFor = Exception.class)
    public String syncSbxx(Map<String , Object> params)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) params.get("ASD");
        String user_id = asdMap.get("user_id").toString();
        String user_name = asdMap.get("user_name").toString();
        String org_id = params.get("org_id").toString();
        String account = params.get("account").toString();
        String msg = "";
        int addcount = 0; // 成功设备数
        int editcount = 0; // 修改设备数
        int snum = 0;//同步总数量
        Map<String, Object> map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SMH_DEVICE");
        map2.put("tiaojian", "BELONG_ORG_ID = "+ asdMap.get("org_id"));
        List<Map<String, Object>> devicelist = commonMapper.selectFieldsByOther(map2);
        if(devicelist==null || devicelist.size() == 0){
            throw new Exception("请先添加服务接入信息");
        }
        String apcos_url = devicelist.get(0).get("DEVICE_APCOS_URL").toString();
        String service_id = devicelist.get(0).get("DEVICE_APCOS_ID").toString();
        String service_key = devicelist.get(0).get("DEVICE_APCOS_KEY").toString();
        String apcos_call_back = devicelist.get(0).get("DEVICE_APCOS_CALL_BACK").toString();
        String dgj_url = devicelist.get(0).get("DEVICE_DGJ_URL").toString();

        String token = ContextHelper.getSessionStr(service_id);
        if(token == null || "".equals(token)){
            token = getApcosToken(dgj_url, service_id, service_key, apcos_call_back, "");
            ContextHelper.getRequest().getSession().setAttribute(service_id, token);
        }

        String result = getDeviceList(apcos_url, service_id, token, account);
        System.out.println("result:"+result);
        if(result == null){
            throw new Exception("获取设备信息无返回，同步失败！");
        }
        JSONObject jsonObject= JSONObject.parseObject(result);
        if(jsonObject.get("resultCode").equals("0101")){
            token = getApcosToken(apcos_url, service_id, service_key, apcos_call_back, account);
            result =  getDeviceList(apcos_url, service_id, token, account);
            jsonObject= JSONObject.parseObject(result);
        }
        if(!jsonObject.get("resultCode").equals("0000")){
            throw new Exception(jsonObject.get("resultDesc")+"");
        }
        JSONObject jsonObject2 = JSONObject.parseObject(jsonObject.get("resultContent").toString());
        String sblist = jsonObject2.get("deviceList").toString();
        JSONArray jsonArray = JSONArray.parseArray(sblist);
        String fieldName = "*";
        String tableName = "SBZC_SBXX";
        String tiaojian = "";
        List<Map<String, Object>> list = null;
        List<Map<String, Object>> list2 = null;
        Map<String, Object> map1 = null;
        Map<String, Object> map3 = null;
        Map<String, String> lxmap = new HashMap<>();

        String fieldName2 = "LX_ID";
        String tableName2 = "SBZC_LX";
        String tiaojian2 = "";
        String product_code = "";
        snum = jsonArray.size();

        List<Map<String, Object>> zcdplist = new ArrayList<>();
        for (Iterator iterator = jsonArray.iterator(); iterator.hasNext();) {
            JSONObject job = (JSONObject) iterator.next();
            product_code = job.get("product_code").toString();
            if (!lxmap.containsKey(product_code)) {
                // 判断设备类型在系统中是否存在
                tiaojian2 = "LX_MLDM = '"+ product_code +"'";
                map2 = new HashMap<String, Object>();
                map2.put("fieldName",fieldName2);
                map2.put("tablename", tableName2);
                map2.put("tiaojian", tiaojian2);
                list2 = commonMapper.selectFieldsByOther(map2);
                if (list2 == null || list2.size() == 0) {
                    throw new RuntimeException("类别编码[" + product_code + "]在系统中不存在，请先同步设备类型！");
                } else {
                    lxmap.put(product_code, list2.get(0).get("LX_ID").toString());
                }
            }

            tiaojian = "SBXX_MAC = '"+ job.get("device_mac") +"'";
            map2 = new HashMap<String, Object>();
            map2.put("fieldName",fieldName);
            map2.put("tablename", tableName);
            map2.put("tiaojian", tiaojian);
            list = commonMapper.selectFieldsByOther(map2);

            map1 = new HashMap<>();
            map1.put("SBXX_LB", "'"+ product_code +"'");
            map1.put("SBXX_MC", "'"+ job.get("device_name") +"'");
            map1.put("SBXX_XLH", "'"+ job.get("serial_num") +"'");
            map1.put("SBXX_MAC", "'"+ job.get("device_mac") +"'");
            map1.put("SBXX_ACCOUNT", "'"+ job.get("account") +"'");
            map1.put("EDITOR_ID", "'"+ user_id +"'");
            map1.put("EDITOR_NAME", "'"+ user_name +"'");
            map1.put("EDITED_TIME", "SYSDATE");
            map1.put("BELONG_ORG_ID", "'"+ org_id +"'");
            String seq="seq_"+ org_id;
            if(list == null || list.size() == 0){
                addcount = addcount + 1;
                //                map1.put("SBXX_ID", "'"+ CommonController.getSEQ(seq) +"'");
                map1.put("SBXX_ID", "'"+ job.get("id") +"'");
                map1.put("SBXX_ZT", "'"+ 2 +"'");
                map1.put("SBXX_SFSZ", "'"+ 2 +"'");
                map1.put("CREATOR_ID", "'"+ user_id +"'");
                map1.put("CREATOR_NAME", "'"+ user_name +"'");
                map1.put("CREATED_TIME", "SYSDATE");

                String[] keys = ContextHelper.getKey(map1);
                map2 = new HashMap<String, Object>();
                map2.put("tablename" , tableName);
                map2.put("keys" , keys);
                map2.put("params" , map1);
                commonMapper.insert(map2);

                //添加资产设备信息
                map1 = new HashMap<>();
                map1.put("ZCDPXX_ID", CommonController.getSEQ(seq));
                map1.put("ZCDPXX_XLH", job.get("serial_num"));
                map1.put("ZCDPXX_MAC", job.get("device_mac"));
                map1.put("ZCDPXX_MC", job.get("device_name"));
                map1.put("ZCDPXX_ACCOUNT", job.get("account"));
                map1.put("ZCDPXX_LX", product_code);
                map1.put("ZCDPXX_ZT", 2);
                map1.put("ZCDPXX_SFSZ", 2);
                map1.put("CREATOR_ID", user_id);
                map1.put("CREATOR_NAME", user_name);
                map1.put("CREATED_TIME", "SYSDATE");
                map1.put("EDITOR_ID", user_id);
                map1.put("EDITOR_NAME", user_name);
                map1.put("EDITED_TIME", "SYSDATE");
                map1.put("BELONG_ORG_ID", org_id);
                zcdplist.add(map1);
            }else{
                editcount = editcount + 1;
                String[] keys = ContextHelper.getKey(map1);
                map2 = new HashMap<String, Object>();
                map2.put("tablename" , tableName);
                map2.put("keys" , keys);
                map2.put("params" , map1);
                map3 = new HashMap<>();
                map3.put("SBXX_ID", "'"+ list.get(0).get("SBXX_ID") +"'");
                String[] keys2 = ContextHelper.getKey(map3);	//条件字段名数组
                map2.put("keys2", keys2);	//条件字段名
                map2.put("params2", map3);		//条件字段
                commonMapper.update(map2);

                //添加资产设备信息
                map1 = new HashMap<>();
                map1.put("ZCDPXX_XLH", job.get("serial_num"));
                map1.put("ZCDPXX_MAC", job.get("device_mac"));
                map1.put("ZCDPXX_MC", job.get("device_name"));
                map1.put("ZCDPXX_ACCOUNT", job.get("account"));
                map1.put("ZCDPXX_LX", product_code);
                map1.put("ZCDPXX_ZT", 2);
                map1.put("ZCDPXX_SFSZ", 2);
                map1.put("CREATOR_ID", user_id);
                map1.put("CREATOR_NAME", user_name);
                map1.put("CREATED_TIME", "SYSDATE");
                map1.put("EDITOR_ID", user_id);
                map1.put("EDITOR_NAME", user_name);
                map1.put("EDITED_TIME", "SYSDATE");
                map1.put("BELONG_ORG_ID", org_id);
                zcdplist.add(map1);
            }

        }
        if(zcdplist.size() > 0 && !"1".equals(org_id)){
            String sjjsUrl = "/sys/dataRecept";
            JSONObject sjtbJson = new JSONObject();
            sjtbJson.put("dataType", "SBZC_ZCDPXX");
            sjtbJson.put("data", zcdplist);
            sjtbJson.put("org_id", org_id);
            result = ContextHelper.client_bcca(inside_bcca+sjjsUrl, sjtbJson, "");
            if(result == null){
                throw new Exception("同步设备信息表数据出现异常！");
            }else{
                jsonObject = JSONObject.parseObject(result);
                if(!"200".equals(jsonObject.get("resultCode"))){
                    throw new Exception(jsonObject.get("resultMsg")+"");
                }
            }
        }
        msg = "同步设备数量:" + snum + " 成功：" + addcount + ",修改：" + editcount;
        return msg;
    }

    /**
     * 获取设备模板
     * lch
     * 2019-10-15
     * */
    public Map<String, Object> getMblist(Map<String , Object> params)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) params.get("ASD");
        Map<String, Object> map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SMH_DEVICE");
        List<Map<String, Object>> devicelist = commonMapper.selectFieldsByOther(map2);
        if(devicelist==null || devicelist.size() == 0){
            throw new Exception("请先添加第三方账户信息");
        }
        String KFPT_URL = devicelist.get(0).get("DEVICE_KFPT_URL").toString();
        String KFPT_ID = devicelist.get(0).get("DEVICE_KFPT_ID").toString();
        String KFPT_KEY = devicelist.get(0).get("DEVICE_KFPT_KEY").toString();
        String dgj_url = devicelist.get(0).get("DEVICE_DGJ_URL").toString();

        String mldm = params.get("mldm").toString();
        String search = null;
        String account = null;
        //先重session中获取token
        String token = ContextHelper.getSessionStr(KFPT_ID);
        if(token == null || "".equals(token)){
            token = getKfzptToken(dgj_url, KFPT_ID, KFPT_KEY, "");
            ContextHelper.getRequest().getSession().setAttribute(KFPT_ID, token);
        }
        String result = getTemplateList(KFPT_URL, KFPT_ID, token, account, mldm, search);
        if(result == null){
            throw new Exception("获取模板信息没有返回，查询失败!");
        }
        JSONObject jsonObject= JSONObject.parseObject(result);
        JSONArray jsonArray = null;
        if(jsonObject.get("resultCode").equals("0000")){
            String resultContent = jsonObject.get("resultContent").toString();
            jsonArray = JSONArray.parseArray(resultContent);
        }else if(jsonObject.get("resultCode").equals("0101")){
            token = getKfzptToken(dgj_url, KFPT_ID, KFPT_KEY, "");
            ContextHelper.getRequest().getSession().setAttribute(KFPT_ID, token);
            result = getTemplateList(KFPT_URL, KFPT_ID, token, account, mldm, search);
            jsonObject= JSONObject.parseObject(result);
            if(jsonObject.get("resultCode").equals("0000")){
                String resultContent = jsonObject.get("resultContent").toString();
                jsonArray = JSONArray.parseArray(resultContent);
            }else{
                throw new Exception(jsonObject.get("resultDesc").toString());
            }
        }else{
            throw new Exception(jsonObject.get("resultDesc").toString());
        }
        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", jsonArray.size());
        resultmap.put("list", jsonArray);
        return  resultmap;
    }

    /**
     * 设置默认模板
     * lch
     * 2019-10-15
     * */
    public void setMrmb(Map<String , Object> params)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) params.get("ASD");
        String id = params.get("id").toString();
        String org_id = asdMap.get("org_id").toString();
        String sbzc_lx_id = params.get("sbzc_lx_id").toString();
        String template_type = params.get("template_type").toString();

        Map<String, Object> map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SMH_DEVICE");
        List<Map<String, Object>> devicelist = commonMapper.selectFieldsByOther(map2);
        if(devicelist==null || devicelist.size() == 0){
            throw new Exception("请先添加第三方账户信息");
        }
        String KFPT_URL = devicelist.get(0).get("DEVICE_KFPT_URL").toString();
        String KFPT_ID = devicelist.get(0).get("DEVICE_KFPT_ID").toString();
        String KFPT_KEY = devicelist.get(0).get("DEVICE_KFPT_KEY").toString();
        String dgj_url = devicelist.get(0).get("DEVICE_DGJ_URL").toString();

        String account = null;
        //先重session中获取token
        String token = ContextHelper.getSessionStr(KFPT_ID);
        if(token == null || "".equals(token)){
            token = getKfzptToken(dgj_url, KFPT_ID, KFPT_KEY, "");
            ContextHelper.getRequest().getSession().setAttribute(KFPT_ID, token);
        }
        String result = getTempLate(KFPT_URL, KFPT_ID, token, account, id);
        JSONObject jsonObject2 = JSONObject.parseObject(result);
        String template_html = null;
        if(jsonObject2.get("resultCode").equals("0000")){
            jsonObject2 = JSONObject.parseObject(jsonObject2.get("resultContent").toString());
            template_html = jsonObject2.get("template_html").toString();
        }else if(jsonObject2.get("resultCode").equals("0101")){
            token = getKfzptToken(dgj_url, KFPT_ID, KFPT_KEY, "");
            ContextHelper.getRequest().getSession().setAttribute(KFPT_ID, token);
            result = getTempLate(KFPT_URL, KFPT_ID, token, account, id);
            jsonObject2 = JSONObject.parseObject(result);
            if(jsonObject2.get("resultCode").equals("0000")){
                jsonObject2 = JSONObject.parseObject(jsonObject2.get("resultContent").toString());
                template_html = jsonObject2.get("template_html").toString();
            }else{
                throw new Exception(jsonObject2.get("resultDesc").toString());
            }
        }else{
            throw new Exception(jsonObject2.get("resultDesc").toString());
        }
        if(template_html == null || "".equals(template_html)){
            throw new Exception("模板代码为空，默认模板设置失败！");
        }

        map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SBZC_LX_MOULD");
        map2.put("tiaojian", "LX_ID = '"+ sbzc_lx_id +"'AND BELONG_ORG_ID = '"+ org_id+"'");
        List<Map<String, Object>> mouldlist = commonMapper.selectFieldsByOther(map2);
        if(mouldlist==null || mouldlist.size() == 0){
            Map<String, Object> maps = new HashMap<>();
            maps.put("id", CommonController.getSEQ("seq_"+org_id));
            maps.put("lx_id", sbzc_lx_id);
            maps.put("org_id", org_id);
            maps.put("mb", template_html);
            //添加
            if("pc".equals(template_type)){
                zcsbMapper.insertWebSbMb(maps);
            }else{
                zcsbMapper.insertAppSbMb(maps);
            }
        }else{
            //编辑
            Map<String, Object> maps = new HashMap<>();
            maps.put("id", mouldlist.get(0).get("MOULD_ID"));
            maps.put("org_id", org_id);
            maps.put("mb", template_html);
            if("pc".equals(template_type)){
                zcsbMapper.setWebSbMb(maps);
            }else{
                zcsbMapper.setAppSbMb(maps);
            }
        }

    }


    //获取账户设备信息
    public static String getDeviceList(String url, String service_id, String token, String account) throws  Exception{
        String sbUrl = "/api/device/getDevice" ;
        Long ytdate = new Date().getTime();
        Long ytdate1 = getLdate(-1000000);

        JSONObject obj = new JSONObject();
        obj.put("service_id", service_id);
        obj.put("token", token);
        obj.put("account", account);
        obj.put("processTime", ytdate);
        obj.put("lastCreatTime", ytdate1);
        String result = ContextHelper.client_bcca(url+sbUrl, obj, account);
        return result;
    }

    //获取模板内容
    public static String getTempLate(String url, String service_id, String token, String account, String template_id)throws Exception{
        String sbkzUrl = "/api/template/getTemplate";
        JSONObject obj = new JSONObject();
        obj.put("token", token);
        obj.put("service_id", service_id);
        obj.put("template_id", template_id);
        String result = ContextHelper.client_bcca(url+sbkzUrl, obj, account);
        System.out.println("result:"+result);
        return  result;
    }

    //获取模板list
    public static String getTemplateList(String url, String service_id, String token, String account, String product_code, String search)throws Exception{
        String sbkzUrl = "/api/template/getTemplateList";
        JSONObject obj = new JSONObject();
        obj.put("token", token);
        obj.put("service_id", service_id);
        obj.put("processTime", new Date().getTime());
        obj.put("product_code", product_code);
        obj.put("search",search);
        String result = ContextHelper.client_bcca(url+sbkzUrl, obj, account);
        System.out.println("result:"+result);
        return  result;
    }

    //获取设备类型
    public static String getSblxList(String url, String service_id, String token, String account)throws Exception{
        String sbkzUrl = "/api/prodcut/getProdcutType";
        JSONObject obj = new JSONObject();
        obj.put("token", token);
        obj.put("service_id", service_id);
        obj.put("processTime", new Date().getTime());
        String result = ContextHelper.client_bcca(url+sbkzUrl, obj, account);
        System.out.println("result:"+result);
        return  result;
    }

    //订阅
    public static String getSbdy(String url, String service_id, String token, String account)throws Exception{
        String sbUrl = "/api/thirdSystemSubscription/accountSubscrip" ;
        JSONObject obj = new JSONObject();
        obj.put("service_id", service_id);
        obj.put("token", token);
        obj.put("account", account);
        obj.put("processTime", new Date().getTime());
        String result = ContextHelper.client_bcca(url+sbUrl, obj, account);
        System.out.println("result:"+result);
        return result;
    }

    //获取开发者平台token
    public static String getKfzptToken(String url, String service_id, String service_key, String account)throws Exception{
        String token = getDgjToken(url, service_id, service_key);
        return token;
    }

    //获取apcos token
    public static String getApcosToken(String url, String service_id, String service_key, String call_back, String account)throws Exception{
        String token = getDgjToken(url, service_id, service_key);
        return token;
    }

    //调用回调接口
    public static void registerCallBack(String url, String service_id, String token, String call_back)throws Exception{
        String function = "/thirdSystemSubscription/registerCallBackUrl";
        JSONObject obj = new JSONObject();
        obj.put("service_id", service_id);
        obj.put("token", token);
        obj.put("processTime", getDate(0));
        obj.put("call_back_url", call_back);
        ContextHelper.client_bcca(url+function, obj, "");
    }


    //获取大管家token
    public static String getDgjToken(String dgj_url, String appid, String appkey) throws Exception{
        String tokenUrl = "/butler/getAccessToken" ;
        JSONObject obj = new JSONObject();
        obj.put("service_id", appid);
        obj.put("service_key", appkey);
        String token = ContextHelper.client_bcca(dgj_url+tokenUrl, obj, "");
        if(token.trim().equals("account invalid")){
            throw new Exception("账户错误，该账户下没有注册设备！");
        }
        JSONObject jsonObject= JSONObject.parseObject(token);
        if(jsonObject.get("code").equals(200)){
            JSONObject jsonObject2 = JSONObject.parseObject(jsonObject.get("data").toString());
            token = jsonObject2.get("token").toString();
        }else{
            throw new Exception(jsonObject.get("msg").toString());
        }
        return token;
    }

    //获取系统时间
    public static String getDate(Integer num){
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
        Calendar c= Calendar.getInstance();
        c.add(Calendar.MINUTE, +num);//1分钟前
        String ytdate = dateFormat.format(c.getTime());
        return ytdate;
    }

    //获取系统时间（long类型）
    public static Long getLdate(Integer num) throws Exception{
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Calendar c = Calendar.getInstance();
        c.add(Calendar.MINUTE, +num);//1分钟前
        String ytdate = dateFormat.format(c.getTime());
        return dateFormat.parse(ytdate).getTime();
    }

    /**
     * 查询模板
     * */
    public String selSblxMb(Map<String , Object> map)throws Exception{
        String type = map.get("type").toString();
        if("web".equals(type)){
            return zcsbMapper.selSblxWebMb(map);
        }else{
            return zcsbMapper.selSblxAppMb(map);
        }
    }

    /**
     * 楼层唯一性验证
     * lch
     * 2019-10-25
     */
    public List<Map<String, Object>> uniqueLcFjxx(Map<String , Object> map)throws Exception{
        Map<String , Object> map2 = new HashMap<>();
        String fieldName = "count(1) C";
        String tableName=ContextHelper.tableMap.get(map.get("tableName")).toString();
        String where = ContextHelper.getFild(tableName,map.get("key").toString())+" = '" +map.get("value")+"'";
        where += " and JZWJBXX_ID = "+ map.get("jzw_id");
        if (map.get("id")!=null&&map.get("id")!=""){
            where += " and "+ContextHelper.getFild(tableName,"ID") +" != "+ map.get("id");
        }
        map2.put("fieldName",fieldName);
        map2.put("tablename" , tableName);
        map2.put("tiaojian", where);
        map2.put("orderName", null);
        map2.put("groupName", null);
        return  commonMapper.selectFieldsByOther(map2);
    }


    /**
     * 添加服务配置信息
     * lch
     * 2019-11-18
     * */
    @Transactional(rollbackFor = Exception.class)
    public void insertDevice(Map<String, Object> params)throws Exception {
        Map<String, Object> asd = (Map<String,Object>) params.get("ASD");
        Map<String, Object> insert = (Map<String,Object>) params.get("insert");
        //获取判断表名是否合法
        String tableName = "SMH_DEVICE";
        HashMap<String, Object> map1 = new HashMap<>();
        //存放公共参数值 CREATOR_ID CREATOR_NAME等
        map1.putAll(CommonController.getCreat(asd));

        //循环存放、验证添加参数
        for(String key:insert.keySet()){
            if (key.startsWith("date")){
                String fKey = ContextHelper.getFild(tableName,key.substring(4)) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("添加参数不合法，请检查！");
                }
                if (insert.get(key).equals("sysdate")){
                    map1.put(fKey,"sysdate");
                }else{
                    map1.put(fKey,"to_date('"+insert.get(key)+"','yyyy-MM-dd')");
                }
            }else {
                String fKey = ContextHelper.getFild(tableName,key) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("添加参数不合法，请检查！"+key);
                }
                map1.put(fKey,"'"+insert.get(key)+"'");
            }
        }

        //判断是调公共序列还是组织序列  不传或传空为公共序列
        if (params.get("seqKZ")==null||params.get("seqKZ")==""){
            map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ("seq_0")+"'");
        }else if (params.get("seqKZ").toString().startsWith("special")){
            String seq="seq_"+params.get("seqKZ").toString().substring(7);
            map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ(seq)+"'");
        }else {
            String seq="seq_"+asd.get("org_id").toString();
            map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ(seq)+"'");
        }

        //数据封装
        String[] keys = ContextHelper.getKey(map1);
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("params" , map1);
        commonMapper.insert(map);

        //3d注册
        String d3_org_id = registerOrg(BCCA, insert.get("apcos_url").toString(), insert.get("apcos_id").toString(), insert.get("apcos_key").toString(), insert.get("att2").toString());
        if(d3_org_id != null && !"".equals(d3_org_id)){
            Map<String, Object> mapu1 = new HashMap<String, Object>();
            mapu1.put("ATTR_1", "'"+ d3_org_id +"'");
            Map<String, Object> mapu2 = new HashMap<String, Object>();
            mapu2.put("DEVICE_ID", map1.get("DEVICE_ID"));
            Map<String, Object> mapu=new HashMap<String, Object>();
            mapu.put("tablename" , tableName);
            mapu.put("keys" , ContextHelper.getKey(mapu1));
            mapu.put("params" , mapu1);
            mapu.put("keys2" , ContextHelper.getKey(mapu2));
            mapu.put("params2" , mapu2);
            commonMapper.update(mapu);
        }
    }

    /**
     * 修改服务配置信息
     * lch
     * 2019-11-18
     * */
    @Transactional(rollbackFor = Exception.class)
    public void updateDevice(Map<String, Object> params)throws Exception {
        Map<String,Object> fild = (Map<String,Object>)params.get("fild");
        Map<String,Object> where = (Map<String,Object>)params.get("where");
        Map<String,Object> asd = (Map<String,Object>)params.get("ASD");
        //获取判断表名是否合法
        String tableName = "SMH_DEVICE";
        HashMap<String, Object> map1 = new HashMap<>();
        for(String key:where.keySet()){
            String fKey = ContextHelper.getFild(tableName,key) ;
            if(fKey==null || fKey.equals("")){
                throw new RuntimeException("修改条件参数不合法，请检查！");
            }
            map1.put(fKey,"'"+where.get(key)+"'");
        }

        HashMap<String, Object> map2 = new HashMap<>();
        for(String key:fild.keySet()){
            if (key.startsWith("date")){
                String fKey = ContextHelper.getFild(tableName,key.substring(4)) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("添加参数不合法，请检查！");
                }
                if (fild.get(key).equals("sysdate")){
                    map2.put(fKey,"sysdate");
                }else {
                    map2.put(fKey,"to_date('"+fild.get(key)+"','yyyy-MM-dd')");
                }

            }else {
                String fKey = ContextHelper.getFild(tableName,key) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("添加参数不合法，请检查！");
                }
                map2.put(fKey,"'"+fild.get(key)+"'");
            }
        }
        map2.putAll(CommonController.getUpdate(asd));

        //封装参数
        Map<String, Object> map=new HashMap<String, Object>();
        String[] keys = ContextHelper.getKey(map2);
        String[] keys2 = ContextHelper.getKey(map1);
        map.put("tablename", tableName);	//表名
        map.put("keys", keys);				//修改字段名
        map.put("params", map2);			//修改字段
        map.put("keys2", keys2);			//条件字段名
        map.put("params2", map1);		//条件字段
        commonMapper.update(map);

        //通过ID查询配置信息
        map=new HashMap<String, Object>();
        map.put("tablename", tableName);	//表名
        map.put("keys", keys2);			//条件字段名
        map.put("params", map1);		//条件字段
        map = commonMapper.getByKeys(map);
        if(map.containsKey("ATTR_1") && map.get("ATTR_1") != null){
            String d3_org_id = map.get("ATTR_1").toString();
            //3d注册修改
            update3DOrg(BCCA, fild.get("apcos_url").toString(), fild.get("apcos_id").toString(), fild.get("apcos_key").toString(), fild.get("att2").toString(),d3_org_id);
        }else{
            //3d注册
            String d3_org_id = registerOrg(BCCA, fild.get("apcos_url").toString(), fild.get("apcos_id").toString(),  fild.get("apcos_key").toString(), fild.get("att2").toString());
            if(d3_org_id != null && !"".equals(d3_org_id)){
                Map<String, Object> mapu1 = new HashMap<String, Object>();
                mapu1.put("ATTR_1", "'"+ d3_org_id +"'");
                Map<String, Object> mapu2 = new HashMap<String, Object>();
                mapu2.put("DEVICE_ID", map1.get("DEVICE_ID"));
                Map<String, Object> mapu=new HashMap<String, Object>();
                mapu.put("tablename" , tableName);
                mapu.put("keys" , ContextHelper.getKey(mapu1));
                mapu.put("params" , mapu1);
                mapu.put("keys2" , ContextHelper.getKey(mapu2));
                mapu.put("params2" , mapu2);
                commonMapper.update(mapu);
            }
        }

    }

    /**
     * 3D注册
     * lch
     * 2019-11-18
     */
    public String registerOrg(String project_url, String back_url, String service_id, String service_key, String org_name)throws Exception{
        String d3_org_id = "";
        //进行3d组织注册
        String function = "/otheAPI/registerOrg";
        JSONObject obj = new JSONObject();
        obj.put("call_project_url",project_url);
        obj.put("call_back_url",back_url);
        obj.put("service_id",service_id);
        obj.put("service_key",service_key);
        obj.put("org_name",org_name);
        String result = ContextHelper.client_bcca(D3+function, obj, "");
        System.out.println(result);
        if(result == null){
            throw new Exception("组织机构注册3D没有返回，注册失败");
        }else{
            JSONObject object = JSONObject.parseObject(result);
            if(object.get("status").equals(200)){
                String data = object.get("data").toString();
                JSONObject object2 = JSONObject.parseObject(data);
                d3_org_id = object2.get("org_id").toString();
            }else{
                throw new Exception(object.get("msg")+"");
            }
        }
        return  d3_org_id;
    }

    /**
     * 3D注册 修改
     * lch
     * 2019-11-18
     */
    public void update3DOrg(String project_url, String back_url, String service_id, String service_key, String org_name, String d3_org_id)throws Exception{
        //进行3d组织注册
        String function = "/otheAPI/updateOrg";
        JSONObject obj = new JSONObject();
        obj.put("call_project_url",project_url);
        obj.put("call_back_url",back_url);
        obj.put("service_id",service_id);
        obj.put("service_key",service_key);
        obj.put("org_name",org_name);
        obj.put("org_id",d3_org_id);
        String result = ContextHelper.client_bcca(D3+function, obj, "");
        System.out.println(result);
        if(result == null){
            throw new Exception("组织机构注册3D没有返回，注册失败");
        }else{
            JSONObject object = JSONObject.parseObject(result);
            if(!object.get("status").equals(200)){
                throw new Exception(object.get("msg")+"");
            }
        }
    }




    /**
     * 查询服务配置信息和授权账户
     * lch
     * 2019-11-04
     * */
    public Map<String, Object> getDeviceAndSetting(Map<String , Object> map)throws Exception{
        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> asdMap = (Map<String, Object>) map.get("ASD");
        //查询服务接入信息
        Map<String, Object> map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SMH_DEVICE");
        List<Map<String, Object>> devicelist = commonMapper.selectFieldsByOther(map2);
        if(devicelist.size() > 0){
            resultMap.put("smhDevice", devicelist.get(0));
        }
        //查询账户信息
        map2 = new HashMap<String, Object>();
        map2.put("fieldName","*");
        map2.put("tablename", "SMH_SETTING");
        map2.put("tiaojian", "BELONG_ORG_ID = "+ asdMap.get("org_id"));
        List<Map<String, Object>> smhlist = commonMapper.selectFieldsByOther(map2);
        if(smhlist.size() > 0){
            resultMap.put("smhSetting", smhlist.get(0));
        }
        return resultMap;
    }

    /**
     * 修改服务接入配置表信息
     * lch
     * 2019-11-14
     * */
    public void updateMsg(Map<String , Object> map)throws Exception{
        commonMapper.update(map);
    }

    /**
     * 通过账户取设备类型
     * lch
     * 2019-11-19
     * */
    public List<SbzcLx> selZcsbLxByAccount(Map<String , Object> map)throws Exception{
        return zcsbMapper.selZcsbLxByAccount(map);
    }

    /**
     * 查询有设备的设备类型
     * lch
     * 2019-12-03
     * */
    public List<Map<String , Object>> selSblxList(Map<String , Object> map)throws Exception{
        Map<String , Object> asd = (Map<String , Object>)map.get("ASD");
        Map<String , Object> where = (Map<String , Object>)map.get("where");
        String org_id = asd.get("org_id").toString();
        String account = where.get("account").toString();
        Map<String , Object> map1 = new HashMap<>();
        String fieldName = "TAB.LX_MLDM AS \"mldm\",TAB.LX_MLMC AS \"mlmc\"";
        String tablename = "SBZC_LX TAB";
        String tiaojian = "EXISTS (SELECT 1 FROM SBZC_SBXX SBXX WHERE SBXX.SBXX_LB = TAB.LX_MLDM AND SBXX.SBXX_ACCOUNT = '"+ account +"' AND SBXX.BELONG_ORG_ID = '"+ org_id +"')";
        String orderName = "TAB.LX_MLDM";
        map1.put("fieldName", fieldName);
        map1.put("tablename", tablename);
        map1.put("tiaojian", tiaojian);
        map1.put("orderName", orderName);
        return commonMapper.selectFieldsByOther(map1);
    }


}
