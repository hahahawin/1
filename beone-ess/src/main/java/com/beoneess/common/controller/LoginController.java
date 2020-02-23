package com.beoneess.common.controller;

import com.alibaba.fastjson.JSONObject;
import com.beoneess.business.mapper.JcbgMapper;
import com.beoneess.business.service.impl.JcbgServiceImpl;
import com.beoneess.business.service.impl.SysServiceImpl;
import com.beoneess.common.service.impl.CommonServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.*;
import java.text.SimpleDateFormat;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Controller
public class LoginController {

    @Autowired
    private CommonServiceImpl commonService;
    @Autowired
    private SysServiceImpl sysService;

    @Autowired
    JcbgServiceImpl jcbgService;

    //配置内部访问授权平台的地址
    public static String inside_jxsc;
    @Value("${inside_jxsc}")
    public void setInside_jxsc(String inside_jxsc) {
        this.inside_jxsc = inside_jxsc;
    }
    public static String inside_bcca;
    @Value("${inside_bcca}")
    public void setInside_bcca(String inside_bcca) {
        this.inside_bcca = inside_bcca;
    }

    /**
     * 跳转页面
     * @param page
     * @return
     */
    @GetMapping("/loadJsp")
    public String loadJsp(String page,String ID,String CODE,HttpServletRequest request){
        request.setAttribute("ID",ID);
        request.setAttribute("CODE",CODE);
        return page ;
    }

    /**
     * 登录页面
     * @return
     */
    @GetMapping(value = { "/", "login" })
    public String login(){
        return "login";
    }

    /**
     * 后台首页
     * @return
     */
    @GetMapping("/index")
    public String index(){
        return "index" ;
    }

    /**
     * 平台注册
     * @return
     */
    @GetMapping("/orgRegister")
    public String orgRegister(){
        return "pt/ptOrgRegister";
    }

    /**
     * 判断是否登录成功
     */
    @PostMapping("login_in")
    @ResponseBody
    public Map<String, Object> login_in(@RequestBody Map<String,Object> map){
        Map<String, Object> jsonObject = new HashMap<>();
        try{
            String user_account = map.get("user_account").toString();
            String user_password = map.get("user_password").toString();
            String log_type = map.get("log_type").toString();
            String user_type = "";
            if(map.containsKey("user_type")){
                user_type = map.get("user_type").toString();
            }
            String bslx = "0";
            if(map.containsKey("bslx") && map.get("bslx") != null){
                bslx = map.get("bslx").toString();
            }

            String org_id = "";
            if(map.containsKey("org_id")){
                org_id = map.get("org_id").toString();
            }
            if(user_account == null || "".equals(user_account)){
                jsonObject.put("resultCode","401");
                jsonObject.put("resultMsg", "登录账户不能为空！");
                return jsonObject ;
            }
            if(user_password == null || "".equals(user_password)){
                jsonObject.put("resultCode","401");
                jsonObject.put("resultMsg", "登录密码不能为空！");
                return jsonObject ;
            }
//            String tableName = "SYS_USER";
//            Map<String, Object> params = new HashMap<>();
//            params.put("user_account", "'"+user_account+"'");
//            params.put("user_password", "'"+ DigestUtils.md5DigestAsHex(user_password.getBytes()).toUpperCase()+"'");

            String fieldName = "TAB.*,UE.USEREXT_XB,UE.USEREXT_LXDH,TO_CHAR(UE.USEREXT_FJSON) AS USEREXT_FJSON,UE.USEREXT_CODE";
            String tableName2 = "SYS_USER TAB LEFT JOIN SYS_USEREXT UE ON UE.USER_ID = TAB.USER_ID";
            String tiaojian = "";
            if(map.containsKey("isMs") && map.get("isMs") != null){
                tiaojian = "TAB.USER_ACCOUNT = '"+ user_account +"' AND TAB.USER_PASSWORD = '"+ user_password.toUpperCase() +"'";
            }else{
                tiaojian = "TAB.USER_ACCOUNT = '"+ user_account +"' AND TAB.USER_PASSWORD = '"+ DigestUtils.md5DigestAsHex(user_password.getBytes()).toUpperCase() +"'";
            }
            if(!"".equals(org_id)){
                tiaojian += " AND TAB.BELONG_ORG_ID = '"+ org_id +"'";
            }
            List<Map<String,Object>> list = commonService.selectFieldsByOther(tableName2, fieldName, tiaojian, null,null);
            if(list.size() == 0){
                jsonObject.put("resultCode","401");
                jsonObject.put("resultMsg", "登录失败，请检查账户密码是否正确！");
                return jsonObject ;
            }else{
                Map<String, Object> map2 = list.get(0);
                String USER_TYPE = map2.get("USER_TYPE").toString();
                String USER_ZT = map2.get("USER_ZT").toString();
                org_id = map2.get("BELONG_ORG_ID").toString();
                if(!"".equals(user_type) && !user_type.equals(USER_TYPE)){
                    jsonObject.put("resultCode","401");
                    jsonObject.put("resultMsg", "用户类型不对，不能登录改系统平台！");
                    return jsonObject ;
                }
                if(!"2".equals(USER_ZT)){
                    jsonObject.put("resultCode","401");
                    jsonObject.put("resultMsg", "用户已停用，不能登录系统平台！");
                    return jsonObject ;
                }

                //查询组织
                Map<String,Object> orgMap = new HashMap<>();
                orgMap.put("org_id", org_id);
                String tableName = "PT_ORG";
                orgMap = commonService.getDataByKeys(tableName, orgMap);
                if(orgMap != null){
                    map2.put("ORG_NAME", orgMap.get("ORG_NAME"));
                }

                Map<String,Object> map3 = new HashMap<>();
                map3.put("user_id", map2.get("USER_ID"));
                map3.put("user_name", map2.get("USER_NAME"));
                map3.put("org_id", map2.get("BELONG_ORG_ID"));
                map3.put("token_lx", log_type);
                map3.put("code", "LOGIN");
                String xx = user_account + user_password + new Date().getTime();
                String token = DigestUtils.md5DigestAsHex(xx.getBytes()).toUpperCase();
                String sesson_id = ContextHelper.getRequest().getSession().getId();
                //回写扩展表信息
                map2.put("token", token);
                map2.put("sesson_id", sesson_id);
                map2.put("token_lx", log_type);
                map2.put("bslx", bslx);
                map2.put("xmlx", map.get("xmlx"));
                if("web".equals(log_type)){
                    //查询用户是否有菜单权限
                    List<Map<String, Object>> rightlist = selUserRight(map2);
                    if(!map2.get("USER_ID").equals("3") && rightlist.size() == 0 && !USER_TYPE.equals("2") && !USER_TYPE.equals("1")){
                        jsonObject.put("resultCode","500");
                        jsonObject.put("resultMsg", "登录失败，没有菜单权限，请联系管理员！");
                        return jsonObject ;
                    }
                }else{
                    //app 端判断版本信息
                    String project_name = map.get("project_name").toString();
                    String version_number = map.get("version_number").toString();
                    fieldName = "*";
                    tableName2 = "(\n" +
                            "SELECT TAB.* FROM PT_PTBBWH TAB\n" +
                            "LEFT JOIN PT_XTRJLX LX ON LX.XTRJLX_ID = TAB.ATTR_1\n" +
                            "LEFT JOIN PT_BBZZGX GX ON GX.PTBBWH_ID = TAB.PTBBWH_ID\n" +
                            "WHERE LX.XTRJLX_YWMC = '"+project_name+"'\n" +
                            "AND GX.ORG_ID = '"+map2.get("BELONG_ORG_ID")+"'\n" +
                            "ORDER BY TAB.PTBBWH_FBSJ DESC\n" +
                            ")";
                    tiaojian = "ROWNUM = 1";
                    List<Map<String,Object>> bblist = commonService.selectFieldsByOther(tableName2, fieldName, tiaojian, null,null);
                    if(bblist.size() == 0 || Integer.parseInt(bblist.get(0).get("PTBBWH_BBH").toString()) < Integer.parseInt(version_number)){
                        jsonObject.put("resultCode","500");
                        jsonObject.put("resultMsg", "登录失败，版本信息错误，请联系管理员！");
                        return jsonObject ;
                    }

                }
                map2 = transformUpperCase(map2);
                if("app".equals(log_type) || bslx.equals("1") || bslx.equals("2")){
                    map2.put("sesson_id", map.get("sesson_id").toString());
                    //接口调用
                    jsonObject.put("user", map2);
                    //学校信息推送
                    sysService.login_sjtb2(map2);
                }else{
                    map2.remove("userext_fjson");//不删除页面会转换错误
                    ContextHelper.getRequest().getSession().setAttribute("user",map2);
                }
                setUserExt(map2);

                CommonController.addLog("1", 1, map3);
                jsonObject.put("resultCode","200");
                jsonObject.put("resultMsg", "登录成功！");
            }
        }catch (Exception e){
            e.printStackTrace();
            jsonObject.put("resultCode","500");
            jsonObject.put("resultMsg",e.getMessage());
        }
        return jsonObject ;
    }

    public List<Map<String, Object>> selUserRight(Map<String, Object> map)throws Exception{
        String xmlx = "1";
        if(map.containsKey("xmlx") && map.get("xmlx") != null){
            xmlx = map.get("xmlx").toString();
        }
        String isadmin = map.get("USER_ISADMIN").toString();
        String belong_org_id = map.get("BELONG_ORG_ID").toString();
        String user_id = map.get("USER_ID").toString();
        String fieldName = "TAB.RIGHT_ID,TAB.RIGHT_NAME,TAB.RIGHT_TYPE,TAB.RIGHT_CODE,TAB.RIGHT_URL,TAB.RIGHT_YWPT,TAB.RIGHT_GXNAME,TAB.RIGHT_ICON";
        String tiaojian = "";
        if(xmlx.equals("4")){
            //bcca 不做组织权限控制
            tiaojian = "INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 AND RIGHT_PID='-1'";
        }else{
            tiaojian = "EXISTS (SELECT 1 FROM SYS_ORG_MENU M WHERE M.RIGHT_ID = TAB.RIGHT_ID AND M.ORG_ID = '"+belong_org_id+"') AND INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 AND RIGHT_PID='-1'";
            if(isadmin.equals("1")){
                tiaojian = "EXISTS (SELECT 1 FROM SYS_ROLE_RIGHT SRR " +
                        "LEFT JOIN SYS_ROLE SR ON SR.ROLE_ID = SRR.ROLE_ID " +
                        "LEFT JOIN SYS_ROLE_USER RU ON RU.ROLE_ID = SR.ROLE_ID " +
                        "WHERE SRR.RIGHT_ID = TAB.RIGHT_ID AND SR.ROLE_ZT = '2' AND RU.USER_ID = '"+ user_id +"') AND INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 and RIGHT_PID = '-1'";
            }
        }
        if("2".equals(isadmin) && !"1".equals(belong_org_id)){
            //组织管理员只查询有管理员权限的菜单
            tiaojian += "AND EXISTS (SELECT 1 FROM SYS_RIGHT A WHERE INSTR(A.ATTR_1,'2') > 0 AND INSTR(A.RIGHT_YWPT, '"+ xmlx +"') > 0 START WITH RIGHT_ID = TAB.RIGHT_ID CONNECT BY NOCYCLE PRIOR A.RIGHT_ID = A.RIGHT_PID)";
        }
        List<Map<String, Object>> data = commonService.selectFieldsByOther("SYS_RIGHT TAB", fieldName, tiaojian, "to_number(RIGHT_ORDER)", null);
        return  data;
    }

    //退出清空session
    @RequestMapping("login_out")
    public String login_out(HttpServletRequest request) {
        try {
            Map<String, Object> map2 = (Map<String, Object>) request.getSession().getAttribute("user");
            if(map2 != null){
                Map<String,Object> map3 = new HashMap<>();
                map3.put("user_id", map2.get("user_id"));
                map3.put("user_name", map2.get("user_name"));
                map3.put("org_id", map2.get("belong_org_id"));
                map3.put("token_lx", "WEB");
                map3.put("code", "LOGOUT");

                String tableName = "SYS_USEREXT";
                Map<String,Object> filedmap = new HashMap<>();
                filedmap.put("USEREXT_SESSION", "''");
                Map<String,Object> wheremap = new HashMap<>();
                wheremap.put("USER_ID", "'"+ map2.get("user_id") +"'");
                commonService.updateRule(tableName, wheremap, filedmap);

                CommonController.addLog("2", 1, map3);
                ContextHelper.getRequest().getSession().invalidate();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "login";
    }

    /**
     * 登录 数据同步
     * lch
     * 2019-09-29
     * */
    @PostMapping("login_sjtb")
    @ResponseBody
    public Map<String, Object> login_sjtb(@RequestBody Map<String,Object> map){
        Map<String, Object> jsonObject = new HashMap<>();
        try{
            sysService.login_sjtb(map);
            jsonObject.put("resultCode","200");
            jsonObject.put("resultMsg", "登录数据同步成功！");
        }catch (Exception e){
            e.printStackTrace();
            jsonObject.put("resultCode","200");
            jsonObject.put("resultMsg",e.getMessage());
        }
        return jsonObject ;
    }

    /**
     * 按钮权限查询
     * lch
     * 2019-09-10
     * */
    public Map<String, Object> selUserRight(String org_id, String type, String is_admin, String user_id)throws Exception{
        Map<String, Object> anmap = new HashMap<>();
        anmap.put("org_id", org_id);
        anmap.put("type", type);
        if(is_admin.equals("1")){
            anmap.put("user_id", user_id);
        }
        List<Map<String, Object>> rightlist = sysService.findRightCode(anmap);
        Map<String, Object> rightMenu = new HashMap<>();
        for(int i=0;i<rightlist.size();i++){
            rightMenu.put(rightlist.get(i).get("RIGHT_CODE").toString(),"1");
        }
        return rightMenu;
    }

    /**
     * 回写用户、组织扩展包信息
     * lch
     * 2019-09-10
     * */
    public void setUserExt(Map<String, Object> map)throws Exception{
        SimpleDateFormat format =new SimpleDateFormat("yyyyMMddHHmmss");
        String sesson_id = map.get("sesson_id").toString();
        String user_id = map.get("user_id").toString();
        String user_name = map.get("user_name").toString();
        String belong_org_id = map.get("belong_org_id").toString();
        String token_lx = map.get("token_lx").toString();
        HashMap<String, Object> map1 = new HashMap<>();
        String tableName = "SYS_USEREXT TAB";
        String fieldName = "TAB.USEREXT_ID,TO_CHAR(TAB.USEREXT_TOKEN) AS USEREXT_TOKEN,TO_CHAR(TAB.USEREXT_DLSJ) AS USEREXT_DLSJ";
        if("web".equals(token_lx)){
            String tiaojian = "TAB.USEREXT_SESSION = '"+ sesson_id +"'";
            List<Map<String, Object>> list = commonService.selectFieldsByOther(tableName, fieldName, tiaojian, null, null);
//            if(list.size() > 0){
////                throw new Exception("请退出已登录用户(或关闭浏览)再登录！");
////            }
        }

        HashMap<String, Object> ASD = new HashMap<>();
        ASD.put("user_id", user_id);
        ASD.put("user_name", user_name);
        ASD.put("org_id", belong_org_id);
        String tiaojian = "USER_ID = '"+ user_id +"'";
        List<Map<String, Object>> list = commonService.selectFieldsByOther(tableName, fieldName, tiaojian, null, null);
        if(list == null || list.size() == 0){
            Map<String, Object> params = new HashMap<>();
            params.put("USER_ID",user_id);
            params.put("SESSION", sesson_id);
            JSONObject tokenjson = new JSONObject();
            tokenjson.put(token_lx, map.get("token"));
            params.put("TOKEN", tokenjson);
            JSONObject timejson = new JSONObject();
            timejson.put(token_lx,format.format(new Date()));
            params.put("DLSJ", timejson);

            Map<String, Object> map2 = new HashMap<>();
            map2.put("tableName","ess16");
            map2.put("insert",params);
            map2.put("seqKZ", belong_org_id);
            map2.put("ASD", ASD);
            map2.put("id", "ID");
            commonService.insert(map2);
        }else{
            Map<String, Object> fild = new HashMap<>();
            fild.put("SESSION", sesson_id);
            if(list.get(0).containsKey("USEREXT_TOKEN") && list.get(0).get("USEREXT_TOKEN") != null){
                JSONObject tokenjson = JSONObject.parseObject(list.get(0).get("USEREXT_TOKEN").toString());
                tokenjson.put(token_lx, map.get("token"));
                fild.put("TOKEN", tokenjson);
            }else{
                JSONObject tokenjson = new JSONObject();
                tokenjson.put(token_lx, map.get("token"));
                fild.put("TOKEN", tokenjson);
            }
            if(list.get(0).containsKey("USEREXT_DLSJ") && list.get(0).get("USEREXT_DLSJ") != null){
                JSONObject timejson = JSONObject.parseObject(list.get(0).get("USEREXT_DLSJ").toString());
                timejson.put(token_lx, format.format(new Date()));
                fild.put("DLSJ", timejson);
            }
            Map<String, Object> where = new HashMap<>();
            where.put("ID", list.get(0).get("USEREXT_ID"));

            map1 = new HashMap<>();
            map1.put("ASD", ASD);
            map1.put("tableName", "ess16");
            map1.put("fild", fild);
            map1.put("where", where);
            commonService.update(map1);
        }

        //编辑组织扩展表
        tableName = "PT_ORG_INFO TAB";
        fieldName = "TAB.INFO_ID,TAB.ATTR_2";
        tiaojian = "ORG_ID = '"+ belong_org_id+"'";
        List<Map<String, Object>> list2 = commonService.selectFieldsByOther(tableName, fieldName, tiaojian, null, null);
        if(list2 == null || list2.size() == 0){
            Map<String, Object> params = new HashMap<>();
            params.put("ORG_ID", belong_org_id);
            params.put("DLSJ", format.format(new Date()));

            Map<String, Object> map2 = new HashMap<>();
            map2.put("tableName","ess17");
            map2.put("insert",params);
            map2.put("seqKZ", belong_org_id);
            map2.put("ASD", ASD);
            map2.put("id", "ID");
            commonService.insert(map2);
        }else{
            Map<String, Object> fild = new HashMap<>();
            fild.put("DLSJ", format.format(new Date()));
            Map<String, Object> where = new HashMap<>();
            where.put("ID", list2.get(0).get("INFO_ID"));

            map1 = new HashMap<>();
            map1.put("ASD", ASD);
            map1.put("tableName", "ess17");
            map1.put("fild", fild);
            map1.put("where", where);
            commonService.update(map1);
        }

    }

    //大写转小写  map
    public static Map<String, Object> transformUpperCase(Map<String, Object> map) {
        Map<String, Object> resultMap = new HashMap<>();
        if (map == null || map.isEmpty()) {
            return resultMap;
        }
        Set<String> keySet = map.keySet();
        for (String key : keySet) {
            String newKey = key.toLowerCase();
            resultMap.put(newKey, map.get(key));
        }
        return resultMap;
    }

}
