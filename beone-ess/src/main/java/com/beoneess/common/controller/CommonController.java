package com.beoneess.common.controller;

import com.beoneess.business.service.impl.SysServiceImpl;
import com.beoneess.common.service.impl.CommonServiceImpl;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.beoneess.common.controller.ContextHelper.getRequest;
/**
 * 倪杨
 * 2019-07-26
 * 公共方法
 */
@Controller
@RequestMapping("/common")
public class CommonController {

    @Autowired
    private CommonServiceImpl commonService;

    // 配置文件中配置
    @Value("${filePath}")
    public String file_Path ;

    /**
     * 公用查询方法 不分页 单表
     * 2019-08-07
     * */
    @RequestMapping("/find")
    @ResponseBody
    public Map<String,Object> find(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                List<Map<String, Object>> list =commonService.find(map);

                resultMap.put("resultCode","200");
                resultMap.put("resultData",list);
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 分页查询 单表
     * 2019-08-07
     * */
    @RequestMapping("/findOnPage")
    @ResponseBody
    public Map<String,Object> findOnPage(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                if(!map.containsKey("page") || map.get("page") == null){
                    map.put("page",1);
                }
                if(!map.containsKey("limit") || map.get("limit") == null){
                    map.put("limit",10);
                }
                Map<String, Object> pages = commonService.findOnPage(map);

                /**
                 * 分页特殊写法 必须这样写
                 * code:请求状态码，0代表请求成功
                 * msg:请求出错时后端返回的反馈信息
                 * data:数据内容[{"id":"1","name":"zhangshan"},{"id":"2","name":"lisi"}]
                 * count:数据的长度
                 */
                resultMap.put("resultCode","200");
                resultMap.put("count",pages.get("total"));
                resultMap.put("data",pages.get("list"));
                resultMap.put("code",0);
                resultMap.put("msg","");
            }else {
                resultMap.putAll(asd);
            }

        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }


    /**
     * 单条查询
     * 2019-11-14
     * */
    @RequestMapping("/getDataByKeys")
    @ResponseBody
    public Map<String,Object> getDataByKeys(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        String tableName = map.get("tableName").toString();
        Map<String, Object> params = (Map<String, Object>)map.get("params");
        try {
            Map<String, Object> data = commonService.getDataByKeys(tableName, params);
            resultMap.put("data", data);
            resultMap.put("resultCode","200");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    /**
     * 特殊查询
     * lch
     * 2019-11-15
     * */
    @PostMapping("/selectFieldsByOther")
    @ResponseBody
    public Map<String,Object> selectFieldsByOther(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        String fieldName = map.get("fieldName").toString();
        String tableName = map.get("tableName").toString();
        String tiaojian = map.get("tiaojian").toString();
        String orderName = "";
        if(map.containsKey("orderName") && map.get("orderName") != null){
            orderName = map.get("orderName").toString();
        }
        String groupName = "";
        if(map.containsKey("groupName") && map.get("groupName") != null){
            groupName = map.get("groupName").toString();
        }
        try {
            List<Map<String, Object>> list = commonService.selectFieldsByOther(tableName, fieldName, tiaojian, orderName, groupName);
            resultMap.put("data", list);
            resultMap.put("resultCode","200");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    /**
     * 添加
     * 2019-08-07
     * */
    @RequestMapping("/insert")
    @ResponseBody
    public Map<String,Object> insert(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                if(!map.containsKey("insert") || map.get("insert") == null){
                    resultMap.put("resultCode","401");
                    resultMap.put("resultMsg","插入的值为空！");
                    return resultMap;
                }

                if(commonService.insert(map)){
                    addLog("3", 1, (Map<String,Object>)map.get("ASD"));
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","添加成功");
                }else {
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","添加失败");
                }
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
//            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
//        System.out.println(resultMap);
        return resultMap;
    }

    /**
     * 修改
     * 2019-08-07
     * */
    @RequestMapping("/update")
    @ResponseBody
    public Map<String,Object> update(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                if(!map.containsKey("fild") || map.get("fild") == null){
                    resultMap.put("resultCode","401");
                    resultMap.put("resultMsg","修改参数为空！");
                    return resultMap;
                }
                if(!map.containsKey("where") || map.get("where") == null){
                    resultMap.put("resultCode","401");
                    resultMap.put("resultMsg","修改条件为空！");
                    return resultMap;
                }

                if(commonService.update(map)){
                    addLog("4", 1, (Map<String,Object>)map.get("ASD"));
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","修改成功");
                }else {
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","修改失败");
                }
            }else {
                resultMap.putAll(asd);
            }

        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 修改 接口
     * 2019-08-07
     * */
    @PostMapping("/updateRule")
    @ResponseBody
    public Map<String,Object> updateRule(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String tableName = map.get("tableName").toString();
            Map<String, Object> map1 = (Map<String, Object>) map.get("map1");
            Map<String, Object> map2 = (Map<String, Object>) map.get("map2");
            commonService.updateRule(tableName, map1, map2);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","操作成功！");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 删除
     * 2019-08-07
     * */
    @RequestMapping("/delete")
    @ResponseBody
    public Map<String,Object> delete(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                if(!map.containsKey("delete") || map.get("delete") == null){
                    resultMap.put("resultCode","401");
                    resultMap.put("resultMsg","删除条件为空！");
                    return resultMap;
                }

                if(commonService.delete(map)){
                    addLog("5", 1, (Map<String,Object>)map.get("ASD"));
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","删除成功");
                }else {
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","删除失败");
                }
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            String msg = e.getMessage();
            if(msg!=null && msg.indexOf("ORA-02292:")>-1){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","该记录正在使用，不可删除！");
            }else{
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg",e.getMessage());
            }
        }
        return resultMap;
    }

    /**
     * 合法验证
     * @param parMap
     * @return
     */
    public static Map<String,Object> ASD(Map<String,Object> parMap) throws Exception {
        HashMap<String, Object> map = new HashMap<>();

        System.out.println(parMap);

        if(!parMap.containsKey("tableName") || parMap.get("tableName") == null){
            map.put("resultCode","401");
            map.put("resultMsg","表名为空！");
            return map;
        }else if(ContextHelper.tableMap.get(parMap.get("tableName").toString())==null){
            map.put("resultCode","401");
            map.put("resultMsg","系统中不存在此表，请检查！");
            return map;
        }else{
            String tableName = ContextHelper.tableMap.get(parMap.get("tableName").toString()).toString();
            if(tableName == null || "".equals(tableName)){
                map.put("resultCode","404");
                map.put("resultMsg","表名错误！");
                return map;
            }
        }

        if(!parMap.containsKey("ASD") || parMap.get("ASD") == null){
            map.put("resultCode","401");
            map.put("resultMsg","用户参数为空！");
            return map;
        }

        Map<String,Object> asdMap = (Map<String,Object>)parMap.get("ASD");
        if(!asdMap.containsKey("user_id") || asdMap.get("user_id") == null){
            map.put("resultCode","401");
            map.put("resultMsg","用户ID为空！");
            return map;
        }
        if(!asdMap.containsKey("user_name") || asdMap.get("user_name") == null){
            map.put("resultCode","401");
            map.put("resultMsg","用户姓名为空！");
            return map;
        }
        if(!asdMap.containsKey("org_id") || asdMap.get("org_id") == null){
            map.put("resultCode","401");
            map.put("resultMsg","组织ID为空！");
            return map;
        }
        if(!asdMap.containsKey("token") || asdMap.get("token") == null){
            map.put("resultCode","999");
            map.put("resultMsg","用户token为空！");
            return map;
        }
        if(!asdMap.containsKey("token_lx") || asdMap.get("token_lx") == null){
            map.put("resultCode","999");
            map.put("resultMsg","用户token类型为空！");
            return map;
        }

        SysServiceImpl sysService = (SysServiceImpl) ContextHelper.getBean("sysServiceImpl");
        String token = sysService.findUserToken(asdMap.get("user_id").toString());
        //对token进行判断验证
        if(token!=null && !token.equals("") && !token.equals("null")) {
            JSONObject tokenObj = JSONObject.fromObject(token);
            //获取用户TOKEN类型并进行判断
            String lxtoken = tokenObj.get(asdMap.get("token_lx")).toString();
            if (!lxtoken.equals(asdMap.get("token").toString())) {
                map.put("resultCode", "999");
                map.put("resultMsg", "账户己在其他地方登录，请退出重登！");
                return map;
            }
        }else{
            map.put("resultCode", "999");
            map.put("resultMsg", "账户己超时，请退出重登！");
            return map;
        }

        map.put("resultCode","200");
        map.put("resultMsg","验证通过！");
        return map;
    }


    /**
     * 通过传入的序列名称查询next值
     * @param seq
     * @return
     */
    public static String getSEQ(String seq)throws Exception{
        CommonServiceImpl ff = (CommonServiceImpl)ContextHelper.getBean("commonServiceImpl");
        HashMap<String, Object> map = new HashMap<>();
        if(seq.length() == 5){
            map.put("seqName",seq+".nextval");
        }else{
            map.put("seqName",seq+".nextval@DBLINK_JXSC");
        }
        return ff.getNextId(map);
    }

    /**
     * 通过传入的序列名称查询next值  接口
     */
    @PostMapping("/getSEQ2")
    @ResponseBody
    public String getSEQ2(@RequestBody Map<String,Object> maps){
        try {
            String seq = maps.get("seq").toString();
            HashMap<String, Object> map = new HashMap<>();
            map.put("seqName",seq+".nextval");
            return commonService.getNextId(map);
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 插入数据时返回以下数据
     * @return
     */
    public static Map<String,Object> getCreat(Map<String,Object> asdMap){
        HashMap<String, Object> map = new HashMap<>();
        map.put("CREATOR_ID","'"+asdMap.get("user_id")+"'");
        map.put("CREATOR_NAME","'"+asdMap.get("user_name")+"'");
        map.put("CREATED_TIME","sysdate");
        map.put("EDITOR_ID","'"+asdMap.get("user_id")+"'");
        map.put("EDITOR_NAME","'"+asdMap.get("user_name")+"'");
        map.put("EDITED_TIME","sysdate");
        map.put("BELONG_ORG_ID","'"+asdMap.get("org_id")+"'");
        return map;
    }

    /**
     * 修改数据时返回以下数据
     * @return
     */
    public static Map<String,Object> getUpdate(Map<String,Object> asdMap){
        HashMap<String, Object> map = new HashMap<>();
        map.put("EDITOR_ID","'"+asdMap.get("user_id")+"'");
        map.put("EDITOR_NAME","'"+asdMap.get("user_name")+"'");
        map.put("EDITED_TIME","sysdate");
        return map;
    }

    /**
     * 权限验证
     * @param map
     * @return
     */
    @RequestMapping("/checkCodeOrName")
    @ResponseBody
    public HashMap<String, Object> checkCodeOrName(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                String tableName = ContextHelper.tableMap.get(map.get("tableName").toString()).toString();
                String fildName = "1";

                String orderName = "";
                String groupName = "" ;
                String flag = "true";
                Map<String,Object> asdMap = (Map<String,Object>)map.get("checkArray");

                for (String key : asdMap.keySet()) {
                    String where = "";
                    int wnumber = 0 ;
                    System.out.println("key= "+ key + " and value= " + asdMap.get(key));
                    Map<String,Object> keyMap = (Map<String,Object>)asdMap.get(key);
                    for(String key1 : keyMap.keySet()){
                        System.out.println("key1= "+ key1 + " and value1= " + keyMap.get(key1));
                        if(wnumber == 0 ){
                            if(map.get("updateID").equals(key1))
                                where += key1 + " != '" + keyMap.get(key1) + "'" ;
                            else
                                where += key1 + " = '" + keyMap.get(key1) + "'" ;
                        }else{
                            if(map.get("updateID").equals(key1))
                                where += " AND " + key1 + " != '" + keyMap.get(key1) + "'" ;
                            else
                                where += " AND " + key1 + " = '" + keyMap.get(key1) + "'" ;
                        }

                        wnumber ++ ;
                    }
                    List<Map<String, Object>> list = commonService.selectFieldsByOther(tableName, fildName, where, orderName,groupName);
                    if(list.size() > 0){
                        flag = "flase" ;
                        resultMap.put("flag",flag);
                        resultMap.put("resultCode","401");
                        resultMap.put("resultMsg",key+"验证失败");
                        break ;
                    }
                }

                if(flag.equals("true")){
                    resultMap.put("flag",flag);
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","验证成功");
                }
                return resultMap;

            }else{
                resultMap.putAll(asd);
            }
        }catch (Exception e){
//            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 系统日志添加
     * @param LOG_TYPE
     * @param LOG_ZT
     * @param map1
     * @return
     */
    public static boolean addLog(String LOG_TYPE, int LOG_ZT,Map<String,Object> map1){
        try {
            CommonServiceImpl ff = (CommonServiceImpl)ContextHelper.getBean("commonServiceImpl");
            String content = "无";
            if(map1.containsKey("code") && map1.get("code") != null){
                if(map1.get("code").equals("LOGIN")){
                    content = "登录";
                }else if(map1.get("code").equals("LOGOUT")){
                    content = "退出";
                }else{
                    Map<String,Object> rzmap = new HashMap<>();
                    rzmap.put("code", "'"+map1.get("code")+"'");
                    rzmap.put("method", "GET_LOGCONTENT");
                    content = ff.selContent(rzmap);
                }
            }


            HashMap<String, Object> map = new HashMap<>();
//            map.put("LOG_ID","'"+ CommonController.getSEQ("SEQ_"+map1.get("org_id"))+"'");
            map.put("TYPE",LOG_TYPE);
            map.put("ZT", LOG_ZT);
            map.put("CODE",map1.get("code"));
            map.put("CONT", content);
//        map.put("EXT2","'"+CommonController.getIP()+"'");//获取IP地址
//            map.putAll(CommonController.getCreat(map1));

            HashMap<String, Object> map2 = new HashMap<>();
            map2.put("tableName","ess4");
            map2.put("insert",map);
            map2.put("seqKZ", "1");
            map2.put("ASD", map1);
            map2.put("id", "ID");
            return ff.insert(map2);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 系统日志添加 接口
     * @return
     */
    @PostMapping("/addLog2")
    @ResponseBody
    public boolean addLog2(@RequestBody Map<String,Object> maps){
        try {
            String LOG_TYPE = maps.get("LOG_TYPE").toString();
            String LOG_ZT = maps.get("LOG_ZT").toString();
            Map<String,Object> map1 = (Map<String, Object>) maps.get("asdMap");

            String content = "无";
            if(map1.containsKey("code") && map1.get("code") != null){
                if(map1.get("code").equals("LOGIN")){
                    content = "登录";
                }else if(map1.get("code").equals("LOGOUT")){
                    content = "退出";
                }else{
                    Map<String,Object> rzmap = new HashMap<>();
                    rzmap.put("code", "'"+map1.get("code")+"'");
                    rzmap.put("method", "GET_LOGCONTENT");
                    content = commonService.selContent(rzmap);
                }
            }

            HashMap<String, Object> map = new HashMap<>();
            map.put("TYPE",LOG_TYPE);
            map.put("ZT", LOG_ZT);
            map.put("CODE",map1.get("code"));
            map.put("CONT", content);
//            map.put("LOG_ID","'"+ CommonController.getSEQ("SEQ_"+map1.get("org_id"))+"'");
//            map.put("EXT2","'"+CommonController.getIP()+"'");//获取IP地址
//            map.putAll(CommonController.getCreat(map1));
            HashMap<String, Object> map2 = new HashMap<>();
            map2.put("tableName","ess4");
            map2.put("insert",map);
            map2.put("seqKZ", "1");
            map2.put("ASD", map1);
            map2.put("id", "ID");
            return commonService.insert(map2);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 设备日志添加
     * @param LOG_TYPE  日志类型 1insert 2update 3delete 4control 9other
     * @param LOG_ZT 日志状态 1成功 2失败
     * @param KZLX 控制类型 1设备 2模式 3执行计划 4定时
     * @param map1
     * @return
     */
    public static boolean addBccaLog(String LOG_TYPE, int LOG_ZT, String KZLX, Map<String,Object> map1){
        try {
            CommonServiceImpl ff = (CommonServiceImpl)ContextHelper.getBean("commonServiceImpl");
            String content = "无";
            if(map1.containsKey("code") && map1.get("code") != null){
                Map<String,Object> rzmap = new HashMap<>();
                rzmap.put("code", "'"+map1.get("code")+"'");
                rzmap.put("method", "GET_LOGCONTENT");
                content = ff.selContent(rzmap);
            }

            HashMap<String, Object> map = new HashMap<>();
//            map.put("LOG_ID","'"+ CommonController.getSEQ("SEQ_"+map1.get("org_id"))+"'");
            map.put("TYPE",LOG_TYPE);
            map.put("ZT", LOG_ZT);
            map.put("KZLX", KZLX);
            map.put("CODE",map1.get("code"));
            map.put("CONT", content);
//        map.put("EXT2","'"+CommonController.getIP()+"'");//获取IP地址
//            map.putAll(CommonController.getCreat(map1));

            HashMap<String, Object> map2 = new HashMap<>();
            map2.put("tableName","ess29");
            map2.put("insert",map);
            map2.put("seqKZ", "1");
            map2.put("ASD", map1);
            map2.put("id", "ID");
            return ff.insert(map2);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 设备日志添加  接口
     */
    @PostMapping("/addBccaLog2")
    @ResponseBody
    public boolean addBccaLog2(@RequestBody Map<String,Object> maps){
        try {
            String LOG_TYPE = maps.get("LOG_TYPE").toString();
            String LOG_ZT = maps.get("LOG_ZT").toString();
            String KZLX = maps.get("KZLX").toString();
            Map<String,Object> map1 = (Map<String, Object>) maps.get("asdMap");

            String content = "无";
            if(map1.containsKey("code") && map1.get("code") != null){
                Map<String,Object> rzmap = new HashMap<>();
                rzmap.put("code", "'"+map1.get("code")+"'");
                rzmap.put("method", "GET_LOGCONTENT");
                content = commonService.selContent(rzmap);
            }

            HashMap<String, Object> map = new HashMap<>();
            map.put("TYPE",LOG_TYPE);
            map.put("ZT", LOG_ZT);
            map.put("KZLX", KZLX);
            map.put("CODE",map1.get("code"));
            map.put("CONT", content);
//              map.put("LOG_ID","'"+ CommonController.getSEQ("SEQ_"+map1.get("org_id"))+"'");
//              map.put("EXT2","'"+CommonController.getIP()+"'");//获取IP地址
//              map.putAll(CommonController.getCreat(map1));
            HashMap<String, Object> map2 = new HashMap<>();
            map2.put("tableName","ess29");
            map2.put("insert",map);
            map2.put("seqKZ", "1");
            map2.put("ASD", map1);
            map2.put("id", "ID");
            return commonService.insert(map2);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }


    /**
     * 唯一性验证
     * @param map
     * @return
     */
    @RequestMapping("/unique")
    @ResponseBody
    public Map<String,Object> unique(@RequestBody Map<String,Object> map){
        Map<String,Object> resultMap = new HashMap<>();
        try {
            String tableName=ContextHelper.tableMap.get(map.get("tableName")).toString();
            String where = ContextHelper.getFild(tableName,map.get("key").toString())+" = '" +map.get("value")+"'";

            if(map.containsKey("org_id") && map.get("org_id") != null){
                where += " and "+ContextHelper.getFild(tableName,"BORG_ID") +" = "+ map.get("org_id");
            }
            if(map.containsKey("creat_id") && map.get("creat_id") != null){
                where += " and "+ContextHelper.getFild(tableName,"CREA_ID") +" = "+ map.get("creat_id");
            }

            if (map.get("id")!=null&&map.get("id")!=""){
                where += " and "+ContextHelper.getFild(tableName,"ID") +" != "+ map.get("id");
            }
            List<Map<String, Object>> maps = commonService.selectFieldsByOther(tableName,
                    "count(1) C",
                    where, null, null);

            if (Integer.valueOf(maps.get(0).get("C").toString())>0){
                resultMap.put("resultCode","200");
                resultMap.put("status","500");
            }else {
                resultMap.put("resultCode","200");
                resultMap.put("status","200");
            }
        } catch (Exception e) {
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 唯一性验证 有父级元素时
     * @param map
     * @return
     */
    @RequestMapping("/uniquePID")
    @ResponseBody
    public Map<String,Object> uniquePID(@RequestBody Map<String,Object> map){
        Map<String,Object> resultMap = new HashMap<>();
        try {
            String tableName=ContextHelper.tableMap.get(map.get("tableName")).toString();
            String where = ContextHelper.getFild(tableName,map.get("key").toString())+" = '" +map.get("value")+"' and "+
                    ContextHelper.getFild(tableName,"PID")+" = '" +map.get("pid")+"' ";

            if (map.get("id")!=null&&map.get("id")!=""){
                where += " and "+ContextHelper.getFild(tableName,"ID") +" != "+ map.get("id");
            }
            List<Map<String, Object>> maps = commonService.selectFieldsByOther(tableName,
                    "count(1) C",
                    where, null, null);

            if (Integer.valueOf(maps.get(0).get("C").toString())>0){
                resultMap.put("resultCode","200");
                resultMap.put("status","500");
            }else {
                resultMap.put("resultCode","200");
                resultMap.put("status","200");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return resultMap;
    }

    /**
     *  获取数据字典值
     * @param map
     * @return
     */
    @RequestMapping("/getDataInfo")
    @ResponseBody
    public Map<String,Object> getDataInfo(@RequestBody Map<String,Object> map) {
        Map<String, Object> resultMap = new HashMap<>();
        try {
            String tableName="(select * from SYS_DICT_TYPE a left join SYS_DICT_ITEM b on a.DT_ID =b.DT_ID where a.DT_CODE='"+map.get("name")+"')";
            String where="";
            if ("1".equals(map.get("type"))){
                where=null;
            }else if ("2".equals(map.get("type"))){
                where=" DI_ZT='2'";
            }else if ("3".equals(map.get("type"))){
                where=" DI_ZT='1'";
            }
            String orderName = "\"key\"";
            List<Map<String, Object>> maps = commonService.selectFieldsByOther(tableName,
                    "DI_ID AS \"id\",DI_KEY \"key\",DI_VALUE \"value\",DI_ZT \"zt\"",
                    where, orderName, null);
            resultMap.put("data",maps);
            resultMap.put("resultCode","200");
        } catch (Exception e) {
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     *  获取系统参数
     *  倪杨
     *  2019-10-21
     * @param map
     * @return
     */
    @RequestMapping("/getConfig")
    @ResponseBody
    public Map<String,Object> getConfig(@RequestBody Map<String,Object> map) {
        Map<String, Object> resultMap = new HashMap<>();
        try {
            String tableName="SYS_CONFIG";
            String where="";
            if(map.get("key")!="" && map.get("key")!=null){
                where = "CONFIG_KEY='"+map.get("key")+"'";
            }else {
                throw new RuntimeException("参数缺失，请检查！");
            }

            List<Map<String, Object>> maps = commonService.selectFieldsByOther(tableName,
                    "CONFIG_ID ID,CONFIG_NAME NAME,CONFIG_KEY KEY,CONFIG_VALUE VALUE,CONFIG_TYPE TYPE,CONFIG_ZT ZT",
                    where, null, null);
            resultMap.put("data",maps.get(0));
            resultMap.put("resultCode","200");
        } catch (Exception e) {
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 附件上传
     * */
    @PostMapping("/uploadFile")
    @ResponseBody
    public Map<String,Object> uploadFile(@RequestParam("file") MultipartFile file, String ASD, String filePath){
        HashMap<String, Object> resultMap = new HashMap<>();
        String oldName=file.getOriginalFilename();
        String dirPath = file_Path + filePath;
        String pathString="";
        File dir = new File(dirPath);
        String newName = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date())+"_"+oldName;
        if (!dir.isDirectory()){
            dir.mkdirs();
        }
        if(file!=null) {
            pathString =dirPath+File.separator+newName;
        }
        try {
            File files=new File(pathString);
            if(!files.exists()){
                files.createNewFile();
            }
            file.transferTo(files);

            HashMap<String, Object> filejson = new HashMap<>();
            filejson.put("newName", newName);
            filejson.put("oldName",oldName);
            filejson.put("folder",filePath);
            filejson.put("filePath",pathString);

            resultMap.put("filejson", filejson);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","操作成功");
        } catch (Exception e) {
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 附件删除
     * */
    @PostMapping("/delFile")
    @ResponseBody
    public Map<String,Object> delFile(@RequestBody Map<String,Object> map) {
        HashMap<String, Object> resultMap = new HashMap<>();
        System.out.println(map.get("filejson"));
        JSONObject filejson = JSONObject.fromObject(map.get("filejson"));
        String filepath = file_Path+filejson.get("folder")+File.separator+filejson.get("newName");
        File file = new File(filepath);
        if(file.exists()){
            boolean b = CommonController.delFile(file);
            if (b){
                resultMap.put("resultCode","200");
                resultMap.put("resultMsg","删除成功");
            }else {
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","删除失败");
            }
        }else{
            resultMap.put("resultCode","404");
            resultMap.put("resultMsg","文件不存在");
        }
        return resultMap;
    }

    /**
     * 删除文件
     * @param file
     * @return
     */
    public static boolean delFile(File file) {
        if (!file.exists()) {
            return false;
        }

        if (file.isDirectory()) {
            File[] files = file.listFiles();
            for (File f : files) {
                delFile(f);
            }
        }
        return file.delete();
    }

    /**
     * 附件下载
     * */
    @RequestMapping("/dowloadFile")
    public String dowloadFile(String filejson, HttpServletResponse response){
        try {
            String name = URLDecoder.decode(filejson,"UTF-8").toString();
            JSONObject json1 = JSONObject.fromObject(name);
            String filepath = file_Path+json1.get("folder")+File.separator+json1.get("newName");
            dowloadFile(filepath,json1.get("oldName").toString(),response);

            return null;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            if(e.getMessage().equals("404")){
                return "error404";
            }
        }
        return null;
    }

    public static void dowloadFile(String filePath,String fileName,HttpServletResponse response)throws Exception{
        File file = new File(filePath);
        if (file.exists()){
            FileInputStream in = null;
            ServletOutputStream out =null;
            try {
                in = new FileInputStream(filePath);
                out = response.getOutputStream();
                response.setContentType("application/force-download");// 设置强制下载不打开
                response.setHeader("Content-Disposition", "attachment;fileName=" + new String( fileName.getBytes("gb2312"), "ISO8859-1" ));// 设置文件名
                byte[] b = new byte[1024];
                int len=0;
                while ((len=in.read(b))!=-1){
                    out.write(b,0,len);
                }

            }catch (Exception e){
                e.printStackTrace();
            }finally {
                try {
                    in.close();
                    out.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }else{
            throw new Exception("404");
        }
    }


    /**
     * ueditor 后台调用
     */
    @GetMapping("/ueditor")
    @ResponseBody
    public String ueditor() {

        String s = "{\n"+
                "            \"imageActionName\": \"uploadimage\",\n" +
                "                \"imageFieldName\": \"file\", \n" +
                "                \"imageMaxSize\": 2048000, \n" +
                "                \"imageAllowFiles\": [\".png\", \".jpg\", \".jpeg\", \".gif\", \".bmp\"], \n" +
                "                \"imageCompressEnable\": true, \n" +
                "                \"imageCompressBorder\": 1600, \n" +
                "                \"imageInsertAlign\": \"none\", \n" +
                "                \"imageUrlPrefix\": \"\",\n" +
                "                \"imagePathFormat\": \"/ueditor/jsp/upload/image/{yyyy}{mm}{dd}/{time}{rand:6}\" }";
        return s;

    }

    /**
     * ueditor 图片上传及返回
     */
    @PostMapping(value = "/imgUpdate")
    @ResponseBody
    public String imgUpdate(MultipartFile file) {
        if (file.isEmpty()) {
            return "error";
        }
        // 获取文件名
        String fileName = file.getOriginalFilename();
        // 获取文件的后缀名
        String suffixName = fileName.substring(fileName.lastIndexOf("."));
        // 这里我使用随机字符串来重新命名图片
        System.out.println("old_fileName:"+fileName);
        fileName = Calendar.getInstance().getTimeInMillis() + suffixName ;
        System.out.println("new_fileName:"+fileName) ;
        System.out.println("file_Path:"+file_Path);
        // 这里的路径为Nginx的代理路径，这里是/data/images/xxx.png
        File dest = new File(file_Path + "ueditor/temporary/" + getPath() + fileName);
        System.out.println("dest.getParentFile():"+dest.getParentFile());
        // 检测是否存在目录
        if (!dest.getParentFile().exists()) {
            dest.getParentFile().mkdirs();
        }
        try {
            file.transferTo(dest);
            //url的值为图片的实际访问地址 这里我用了Nginx代理，访问的路径是http://localhost/xxx.png
            HttpServletRequest req = getRequest();
            String path = req.getContextPath(); //项目名称
            String requestURI = req.getScheme()+"://"+req.getServerName()+":"+req.getServerPort()+path+"/";

            String config = "{\"state\": \"SUCCESS\"," +
                    "\"url\": \"" + requestURI + "ueditor/temporary/" + getPath() + fileName + "\"," +
                    "\"title\": \"" + fileName + "\"," +
                    "\"original\": \"" + fileName + "\"}";
            return config;
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "error";
    }

    /**
     * 获取年月日的路径格式
     * @return
     */
    public static String getPath(){
        Calendar cal = Calendar.getInstance();
        int year = cal.get(Calendar.YEAR);
        int month = cal.get(Calendar.MONTH ) + 1;//获取到0-11，与我们正常的月份差1
        int day = cal.get(Calendar.DAY_OF_MONTH);
        return year+"/"+month+"/"+day+"/" ;
    }
}
