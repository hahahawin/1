package com.beoneess.business.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.beoneess.business.domain.SbzcLx;
import com.beoneess.business.service.impl.ZcsbServiceImpl;
import com.beoneess.common.controller.CommonController;
import com.beoneess.common.controller.ContextHelper;
import com.beoneess.common.service.impl.CommonServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @program: bcca
 * @description: 资产设备
 * @author: liu yan
 * @create: 2019-10-14 09:10
 */
@Controller
@RequestMapping("/zcsb")
public class ZcsbController {

    @Autowired
    private ZcsbServiceImpl zcsbService;
    @Autowired
    private CommonServiceImpl commonService;

    /**
     * 设备授权账户申请区域查询  接口
     * lch
     * 2019-11-27
     * */
    @RequestMapping("/selAreaList")
    @ResponseBody
    public Map<String,Object> selAreaList(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            JSONArray list = zcsbService.selAreaList(map);
            resultMap.put("resultCode","200");
            resultMap.put("data",list);
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 房间列表 查询
     * lch
     * 2019-10-14
     * */
    @RequestMapping("/findFjxxOnPage")
    @ResponseBody
    public Map<String,Object> findFjxxOnPage(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
            try {
                Map<String, Object> pages = zcsbService.findFjxxOnPage(map);
                resultMap.put("resultCode","200");
                resultMap.put("count",pages.get("total"));
                resultMap.put("data",pages.get("list"));
                resultMap.put("code",0);
                resultMap.put("msg","");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
    //        System.out.println(resultMap);
            return resultMap;
    }

    /**
     * 楼层房间唯一性验证
     * */
    @RequestMapping("/uniqueLcFjxx")
    @ResponseBody
    public Map<String,Object> uniqueLcFjxx(@RequestBody Map<String,Object> map){
        Map<String,Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> maps = zcsbService.uniqueLcFjxx(map);

            if (Integer.valueOf(maps.get(0).get("C").toString())>0){
                resultMap.put("status","500");
            }else {
                resultMap.put("status","200");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return resultMap;
    }

    /**
     * 查询所有未拥有设备账户的组织
     * lch
     * 2019-10-21
     */
    @RequestMapping("/selOrgNotInSetting")
    @ResponseBody
    public Map<String,Object> selOrgNotInSetting() throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String fieldName = "TAB.ORG_ID AS \"id\", TAB.ORG_NAME AS \"mc\", TAB.ORG_TYPE AS \"type\"";
        String tableName="PT_ORG TAB";
        String tiaojian = "EXISTS (SELECT 1 FROM SYS_USER SU WHERE SU.BELONG_ORG_ID = TAB.ORG_ID AND SU.USER_ZT = '2' AND SU.USER_ISADMIN = '2') AND TAB.ORG_ZT = '2'";
        String orderName = "TAB.ORG_NAME ASC";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(tableName, fieldName, tiaojian, orderName, null);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",maps);
        return resultMap;
    }

    /**
     * 设备账户申请
     * lch
     * 2019-10-14
     * */
    @RequestMapping("/insertSetting")
    @ResponseBody
    public Map<String,Object> insertSetting(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            zcsbService.insertSetting(map);
            resultMap.put("resultCode","200");
            resultMap.put("msg","账户申请成功");
            CommonController.addBccaLog("1", 1, "1", (Map<String, Object>) map.get("ASD"));
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
            CommonController.addBccaLog("1", 2, "1", (Map<String, Object>) map.get("ASD"));
        }
        return resultMap;
    }

    /**
     * 订阅账户
     * lch
     * 2019-10-14
     * */
    @RequestMapping("/dySetting")
    @ResponseBody
    public Map<String,Object> dySetting(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            zcsbService.dySetting(map);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","账户订阅成功");
            CommonController.addBccaLog("2", 1, "1", (Map<String, Object>) map.get("ASD"));
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
            CommonController.addBccaLog("2", 2, "1", (Map<String, Object>) map.get("ASD"));
        }
        return resultMap;
    }

    /**
     * 设备类型同步
     * lch
     * 2019-10-15
     * */
    @RequestMapping("/syncLx")
    @ResponseBody
    public Map<String,Object> syncLx(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String msg = zcsbService.syncLx(map);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg", msg);
            CommonController.addBccaLog("2", 1, "1", (Map<String, Object>) map.get("ASD"));
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
            CommonController.addBccaLog("2", 2, "1", (Map<String, Object>) map.get("ASD"));
        }
        return resultMap;
    }

    /**
     * 通过设备类型获取模板列表
     * */
    @RequestMapping("getMblist")
    @ResponseBody
    public Map<String, Object> getMblist(@RequestBody Map<String,Object> map){
        Map<String, Object> resultMap = new HashMap<>();
        try {
            Map<String,Object> pages = zcsbService.getMblist(map);
            resultMap.put("resultCode","200");
            resultMap.put("count",pages.get("total"));
            resultMap.put("data",pages.get("list"));
            resultMap.put("code",0);
            resultMap.put("msg","");
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("resultCode", "error");
            resultMap.put("resultMsg", e.getMessage());
        }
        return resultMap ;
    }

    /**
     * 设置默认模板
     * */
    @RequestMapping("setMrmb")
    @ResponseBody
    public Map<String, Object> setMrmb(@RequestBody Map<String,Object> map){
        Map<String, Object> resultMap = new HashMap<>();
        try {
            zcsbService.setMrmb(map);
            CommonController.addBccaLog("2", 1, "1", (Map<String, Object>) map.get("ASD"));
            resultMap.put("resultCode","200");
        } catch (Exception e) {
            CommonController.addBccaLog("2", 2, "1", (Map<String, Object>) map.get("ASD"));
            resultMap.put("resultCode", "error");
            resultMap.put("resultMsg", e.getMessage());
        }
        return resultMap ;
    }

    /**
     * 同步设备信息
     * lch
     * 2019-10-15
     * */
    @RequestMapping("/syncSbxx")
    @ResponseBody
    public Map<String,Object> syncSbxx(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String msg = zcsbService.syncSbxx(map);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg", msg);
            CommonController.addBccaLog("2", 1, "1", (Map<String, Object>) map.get("ASD"));
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
            CommonController.addBccaLog("2", 2, "1", (Map<String, Object>) map.get("ASD"));
        }
        return resultMap;
    }

    /**
     * 通过设备类型查询设备控制模板
     * */
    @PostMapping("selSblxMb")
    @ResponseBody
    public Map<String, Object> selSblxMb(@RequestBody Map<String,Object> map){
        Map<String, Object> resultMap = new HashMap<>();
        try {
            String htmlModle = zcsbService.selSblxMb(map);
            resultMap.put("htmlModle",htmlModle);
            resultMap.put("resultCode","200");
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("resultCode", "error");
            resultMap.put("resultMsg", e.getMessage());
        }
        return resultMap ;
    }

    /**
     * 设备绑定
     * lch
     * 2019-10-16
     * */
    @PostMapping("sbbinding")
    @ResponseBody
    public Map<String, Object> sbbinding(@RequestBody Map<String,Object> map){
        Map<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asdMap = (Map<String, Object>) map.get("ASD");
            String account = map.get("account").toString();
            JSONObject objMap = new JSONObject(map);
            List<Map<String, Object>> list = (List<Map<String, Object>>) objMap.get("sbxx");

            String fieldName = "*";
            String tableName = "SMH_DEVICE";
            String tiaojian = "BELONG_ORG_ID = 1";
            List<Map<String, Object>> devicelist = commonService.selectFieldsByOther(tableName, fieldName, tiaojian, null, null);
            if(devicelist==null || devicelist.size() == 0){
                throw new Exception("请先添加第三方账户信息");
            }
            String DGJ_URL = devicelist.get(0).get("DEVICE_DGJ_URL").toString();
            String DGJ_ID = devicelist.get(0).get("DEVICE_DGJ_ID").toString();String token = ContextHelper.getSessionStr(DGJ_ID);
            String DGJ_KEY = devicelist.get(0).get("DEVICE_DGJ_KEY").toString();


            if(token == null || "".equals(token)){
                token = ZcsbServiceImpl.getDgjToken(DGJ_URL, DGJ_ID, DGJ_KEY);
                ContextHelper.getRequest().getSession().setAttribute(DGJ_ID, token);
            }

            JSONObject obj = new JSONObject();
            obj.put("service_id", DGJ_ID);
            obj.put("token", token);
            obj.put("account", account);

            String serial_num = null;
            String genuine_code = null;
            String allnum = "";
            String result = null;
            JSONObject object = null;
            String method = "/thirdInterface/bind";
            for(int i=0;i<list.size();i++){
                serial_num = list.get(i).get("sqm").toString();
                genuine_code = list.get(i).get("zpm").toString();
                obj.put("serial_num", serial_num);
                obj.put("genuine_code", genuine_code);
                result = ContextHelper.client_bcca(DGJ_URL+method, obj, account);
//                System.out.println("result:"+result);
                object = JSONObject.parseObject(result);
                if(object.get("code").equals("200")){

                }else if(object.get("code").equals("400")){
                    //token 过期
                    token = ZcsbServiceImpl.getDgjToken(DGJ_URL, DGJ_ID, DGJ_KEY);
                    ContextHelper.getRequest().getSession().setAttribute(DGJ_ID, token);
                    obj.put("token", token);
                    result = ContextHelper.client_bcca(DGJ_URL+method, obj, account);
                    object = JSONObject.parseObject(result);
                    if(!object.get("code").equals("200")){
                        allnum += serial_num+"绑定失败，"+object.get("msg")+",";
                    }
                }else{
                    allnum += serial_num+"绑定失败，"+object.get("msg")+",";
                }
            }
            if(allnum == null || "".equals(allnum)){
                CommonController.addBccaLog("2", 1, "1", asdMap);
                resultMap.put("resultCode","200");
            }else{
                allnum = allnum.substring(0, allnum.length()-1);
                CommonController.addBccaLog("2", 2, "1", asdMap);
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg",allnum);
            }
        } catch (Exception e) {
            e.printStackTrace();
            resultMap.put("resultCode", "error");
            resultMap.put("resultMsg", e.getMessage());
        }
        return resultMap ;
    }

    /**
     * 设备解绑
     * lch
     * 2019-11-27
     * */
    @PostMapping("unbind")
    @ResponseBody
    public Map<String, Object> unbind(@RequestBody Map<String,Object> map){
        Map<String, Object> asdMap = (Map<String, Object>) map.get("ASD");
        Map<String, Object> resultMap = new HashMap<>();
        try {
            zcsbService.unbind(map);
            CommonController.addBccaLog("2", 1, "1", asdMap);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","解绑成功");
        } catch (Exception e) {
            resultMap.put("resultCode", "error");
            resultMap.put("resultMsg", e.getMessage());
            CommonController.addBccaLog("2", 2, "1", asdMap);
        }
        return resultMap ;
    }

    /**
     * 设备控制
     * lch
     * 2019-10-16
     * */
    @PostMapping("sbControl")
    @ResponseBody
    public Map<String, Object> sbControl(@RequestBody Map<String,Object> map){
        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> asdMap = (Map<String, Object>) map.get("ASD");
        Map<String, Object> dataMap = (Map<String, Object>) map.get("data");
        try {
            String account = dataMap.get("account").toString();
            String serial_num = dataMap.get("serial_num").toString();
            String productId = dataMap.get("productId").toString();
            String operation = dataMap.get("operation").toString();
            String controlParams = dataMap.get("controlParams")+"";
            String fieldName = "*";
            String tableName = "SMH_DEVICE";
            String tiaojian = null;
            List<Map<String, Object>> devicelist = commonService.selectFieldsByOther(tableName, fieldName, tiaojian, null, null);
            if(devicelist==null || devicelist.size() == 0){
                throw new Exception("请先添加第三方账户信息");
            }
            String APCOS_URL = devicelist.get(0).get("DEVICE_APCOS_URL").toString();
            String APCOS_ID = devicelist.get(0).get("DEVICE_APCOS_ID").toString();
            String APCOS_KEY = devicelist.get(0).get("DEVICE_APCOS_KEY").toString();
            String APCOS_CALL_BACK = devicelist.get(0).get("DEVICE_APCOS_CALL_BACK").toString();
            String token = ContextHelper.getSessionStr(APCOS_ID);
            String dgj_url = devicelist.get(0).get("DEVICE_DGJ_URL").toString();
            if(token == null || "".equals(token)){
                token = ZcsbServiceImpl.getApcosToken(dgj_url, APCOS_ID, APCOS_KEY, APCOS_CALL_BACK, account);
                ContextHelper.getRequest().getSession().setAttribute(APCOS_ID, token);
            }
            JSONObject obj = new JSONObject();
            obj.put("service_id", APCOS_ID);
            obj.put("token", token);
            obj.put("processTime",new Date().getTime());
            obj.put("serial_num", serial_num);
            obj.put("operation", operation);
            obj.put("controlParams", controlParams);
            obj.put("productId", productId);
//            System.out.println(obj);
            String sbkzUrl = "/api/device/sendDeviceCmd" ;
            String result = ContextHelper.client_bcca(APCOS_URL+sbkzUrl, obj, account);
            JSONObject object = JSONObject.parseObject(result);
            if(object.get("resultCode").equals("0101")){
                token = ZcsbServiceImpl.getApcosToken(dgj_url, APCOS_ID, APCOS_KEY, APCOS_CALL_BACK, account);
                ContextHelper.getRequest().getSession().setAttribute(APCOS_ID, token);
                obj.put("token", token);
                result = ContextHelper.client_bcca(APCOS_URL+sbkzUrl, obj, account);
                object = JSONObject.parseObject(result);
            }
            System.out.println("result:"+result);
            if(object.get("resultCode").equals("0000")){
                JSONObject object2 = JSONObject.parseObject(object.get("resultContent").toString());
                if(object2.containsKey("code")){
                    if(object2.get("code").equals("0")){
                        resultMap.put("resultCode", "200");
                        CommonController.addBccaLog("4", 1, "1", asdMap);
                    }else{
                        resultMap.put("resultCode", "error");
                        resultMap.put("resultDesc", object2.get("message"));
                        CommonController.addBccaLog("4", 2, "1", asdMap);
                    }
                }else{
                    CommonController.addBccaLog("4", 2, "1", asdMap);
                    resultMap.put("resultCode", "error");
                    resultMap.put("resultDesc", "返回信息格式错误，请联系管理员！");
                }
            }else{
                CommonController.addBccaLog("4", 2, "1", asdMap);
                resultMap.put("resultCode", "error");
                resultMap.put("resultDesc", object.get("resultDesc"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            CommonController.addBccaLog("4", 2, "1", asdMap);
            resultMap.put("resultCode", "error");
            resultMap.put("resultMsg", e.getMessage());
        }
        return resultMap ;
    }

    /**
     * 设备账户分页查询
     * lch
     * 2019-10-24
     * */
    @PostMapping("/selSmhlist")
    @ResponseBody
    public Map<String,Object> selSmhlist(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> pages = zcsbService.selSmhlist(map);
            resultMap.put("resultCode","200");
            resultMap.put("count",pages.get("total"));
            resultMap.put("data",pages.get("list"));
            resultMap.put("code",0);
            resultMap.put("msg","");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 添加服务配置信息
     * lch
     * 2019-11-18
     * */
    @PostMapping("/insertDevice")
    @ResponseBody
    public Map<String,Object> insertDevice(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            zcsbService.insertDevice(map);
            CommonController.addBccaLog("1", 1, "1", (Map<String,Object>)map.get("ASD"));
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","添加成功");
        }catch (Exception e){
            e.printStackTrace();
            CommonController.addBccaLog("1", 2, "1", (Map<String,Object>)map.get("ASD"));
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询服务配置信息和授权账户
     * lch
     * 2019-11-04
     * */
    @PostMapping("/getDeviceAndSetting")
    @ResponseBody
    public Map<String,Object> getDeviceAndSetting(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> result = zcsbService.getDeviceAndSetting(map);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","");
            resultMap.putAll(result);
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 修改服务接入配置表信息
     * lch
     * 2019-11-14
     * */
    @PostMapping("/updateDevice")
    @ResponseBody
    public Map<String,Object> updateDevice(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        Map<String,Object> asdMap = (Map<String,Object>)map.get("ASD");
        try {
            zcsbService.updateDevice(map);
            CommonController.addBccaLog("2", 1, "1", asdMap);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","修改成功");
        }catch (Exception e){
            e.printStackTrace();
            CommonController.addBccaLog("2", 2, "1", asdMap);
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 修改3d 组织注册返回ID
     * lch
     * 2019-11-14
     * */
    @PostMapping("/update3DorgId")
    @ResponseBody
    public Map<String,Object> update3DorgId(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            zcsbService.updateMsg(map);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","修改成功");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询有设备的设备类型
     * lch
     * 2019-12-03
     * */
    @PostMapping("/selSblxList")
    @ResponseBody
    public Map<String,Object> selSblxList(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                List<Map<String, Object>> list = zcsbService.selSblxList(map);
                resultMap.put("data", list);
                resultMap.put("resultCode","200");
            }else {
                resultMap.putAll(asd);
            }

        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    /**
     * 通过账户取设备类型
     * lch
     * 2019-11-19
     * */
    @PostMapping("/selZcsbLxByAccount")
    @ResponseBody
    public Map<String,Object> selZcsbLxByAccount(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<SbzcLx> list = zcsbService.selZcsbLxByAccount(map);
            resultMap.put("data", list);
            resultMap.put("resultCode","200");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

}
