package com.beoneess.business.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.beoneess.sms.entity.SmsAccountInfo;
import com.beoneess.sms.entity.SmsResult;
import com.beoneess.business.service.impl.SysServiceImpl;
import com.beoneess.common.controller.CommonController;
import com.beoneess.common.controller.ContextHelper;
import com.beoneess.common.mapper.CommonMapper;
import com.beoneess.common.service.impl.CommonServiceImpl;
import com.beoneess.sms.sendUtil.HttpXmlUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

/**
 * 系统管理特殊方法实现
 * 2019-8-8
 * 罗飞   罗超豪
 */

@Controller
@RequestMapping("/sys")
public class SysController {

    @Autowired
    private CommonServiceImpl commonService;
    @Autowired
    private SysServiceImpl sysService;
    @Autowired
    CommonMapper commonMapper;

    @Value("${messageZh}")
    private String messageZh;
    @Value("${messagepass}")
    private String messagepass;

    /**
     * 查询本级及下级菜单按钮
     * @param map
     * @return
     */
    @PostMapping("/findRightOther")
    @ResponseBody
    public HashMap<String, Object> findRightOther(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                //获取查询相关参数信息
                String tableName = ContextHelper.tableMap.get(map.get("tableName").toString()).toString();
                if(tableName==null || tableName.equals("")){
                    throw new RuntimeException("表名不合法，请检查！");
                }

                //获取判断表字段是否合法
                String fildName = "";
                if (!map.containsKey("fildName") || map.get("fildName") == null){
                    fildName = ContextHelper.getTableAllFild(tableName);
                }else {
                    fildName = ContextHelper.getChangeFild(tableName, map.get("fildName").toString());
                }
                if(fildName==null || fildName.equals("")){
                    throw new RuntimeException("表字段不合法，请检查！");
                }

                String where = map.get("where").toString() == null ? "" : map.get("where").toString() ;
                String orderName = map.get("order") == null ? "" : map.get("order").toString() ;
                String groupName = map.get("group") == null ? "" : map.get("group").toString() ;
                List<Map<String, Object>> list = commonService.selectFieldsByOther(tableName, fildName, where, orderName,groupName);
                for (int i = 0; i < list.size(); i++) {
                    where = " RIGHT_PID = " + list.get(i).get("id") ;
                    list.get(i).put("fourth",commonService.selectFieldsByOther(tableName, fildName, where, orderName,groupName));
                }
                resultMap.put("resultCode","200");
                resultMap.put("resultData",list);
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
     * 查询递归菜单  一级及授权数据 组织授权
     */
    @PostMapping("/findOneRight")
    @ResponseBody
    public HashMap<String, Object> findOneRight(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            List<Map<String, Object>> list = sysService.findDgRight(map);
            List<Map<String, Object>> menuList = sysService.findOrgRight(map);
//            list = ContextHelper.transformListUpperCase(list);
//            menuList = ContextHelper.transformListUpperCase(menuList);
            resultMap.put("resultCode","200");
            resultMap.put("resultData",list);
            resultMap.put("menuList",menuList);
        }catch (Exception e){
//            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 角色授权一级菜单查询
     * lch
     * 2019-09-05
     * */
    @PostMapping("/roleOneRight")
    @ResponseBody
    public HashMap<String, Object> roleOneRight(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            List<Map<String, Object>> list = sysService.findDgOrgRight(map);
            List<Map<String, Object>> menuList = sysService.findOrgRight(map);
            resultMap.put("resultCode","200");
            resultMap.put("resultData",list);
            resultMap.put("menuList",menuList);
        }catch (Exception e){
//            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询二三四级菜单按钮  组织授权
     * @param map
     * @return
     * */
    @PostMapping("/find234Right")
    @ResponseBody
    public HashMap<String, Object> find234Right(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            List<Map<String, Object>> two = sysService.findDgRight(map);
            for(int j=0;j<two.size();j++){
                map.put("id",two.get(j).get("id"));
                List<Map<String, Object>> three = sysService.findDgRight(map);
                for(int k=0;k<three.size();k++){
                    map.put("id",three.get(k).get("id"));
                    List<Map<String, Object>> four = sysService.findDgRight(map);
                    three.get(k).put("four", four);
                }
                two.get(j).put("three", three);
            }
            resultMap.put("resultCode","200");
            resultMap.put("resultData",two);

        }catch (Exception e){
//            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询二三四级菜单按钮  角色授权
     * @param map
     * @return
     * */
    @PostMapping("/role234Right")
    @ResponseBody
    public HashMap<String, Object> role234Right(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            List<Map<String, Object>> two = sysService.findDgOrgRight(map);
            for(int j=0;j<two.size();j++){
                map.put("id",two.get(j).get("id"));
                List<Map<String, Object>> three = sysService.findDgOrgRight(map);
                for(int k=0;k<three.size();k++){
                    map.put("id",three.get(k).get("id"));
                    List<Map<String, Object>> four = sysService.findDgOrgRight(map);
                    three.get(k).put("four", four);
                }
                two.get(j).put("three", three);
            }
            resultMap.put("resultCode","200");
            resultMap.put("resultData",two);

        }catch (Exception e){
//            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 加载SYS_RIGHT，生成tree
     * @return
     */
    @RequestMapping("/loadRightTree")
    @ResponseBody
    public Map<String,Object> loadRightTree(@RequestBody Map<String,Object> map){
        map=(Map<String, Object>)map.get("ASD");
        HashMap<String, Object> resultMap = new HashMap<>();

        try {
            String fieldName = "RIGHT_ID as \"right_id\", RIGHT_NAME as \"right_name\", RIGHT_PID as \"right_pid\", PNAME as \"pname\"";
            List<Map<String, Object>> sys_dept = commonService.selectFieldsByOther("(select a.*,b.RIGHT_NAME PNAME from SYS_RIGHT a left join SYS_RIGHT b on a.RIGHT_PID = b.RIGHT_ID)", fieldName, "BELONG_ORG_ID = '"+map.get("org_id")+"' and RIGHT_TYPE = '1'", null, null);
            resultMap.put("resultCode","200");
            resultMap.put("list",listToTree(sys_dept, "right_id", "right_pid", "right_name"));
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 加载 SYS_ZDYCD，生成tree
     * @return
     */
    @RequestMapping("/loadSysZdycdTree")
    @ResponseBody
    public Map<String,Object> loadSysZdycdTree(@RequestBody Map<String,Object> map){
        String xmid = map.get("zdycdId").toString();
        map=(Map<String, Object>)map.get("ASD");
        HashMap<String, Object> resultMap = new HashMap<>();

        try {
            String fieldName = "ZDYCD_ID as \"zdtcd_id\", ZDYCD_MC as \"zdycd_mc\", ZDYCD_PID as \"zdycd_pid\", PNAME as \"pname\"";
            List<Map<String, Object>> sys_dept = commonService.selectFieldsByOther("(select a.*,b.ZDYCD_MC PNAME from SYS_ZDYCD a left join SYS_ZDYCD b on a.ZDYCD_PID = b.ZDYCD_ID)", fieldName, "BELONG_ORG_ID = '"+map.get("org_id")+"' and ZDYCD_XM='"+xmid+"'", null, null);
            resultMap.put("resultCode","200");
            resultMap.put("list",listToTree(sys_dept, "zdtcd_id", "zdycd_pid", "zdycd_mc"));
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 加载部门list
     * @return
     */
    @RequestMapping("/loadDept")
    @ResponseBody
    public Map<String,Object> loadDept(@RequestBody Map<String,Object> map){
        map=(Map<String, Object>)map.get("ASD");
        HashMap<String, Object> resultMap = new HashMap<>();

        try {
            String fieldName = "DEPT_ID as \"dept_id\", DEPT_NAME as \"dept_name\", DEPT_PID as \"dept_pid\", DEPT_ZT as \"dept_zt\", DEPT_ZZ as \"dept_zz\", DEPT_FZR as \"dept_fzr\", PNAME as \"pname\"";
            List<Map<String, Object>> sys_dept = commonService.selectFieldsByOther("(select a.*,b.DEPT_NAME PNAME from SYS_DEPT a left join SYS_DEPT b on a.DEPT_PID = b.DEPT_ID)", fieldName, "BELONG_ORG_ID = '"+map.get("org_id")+"'", null, null);
            resultMap.put("resultCode","200");
            resultMap.put("list",listToTree(sys_dept, "dept_id", "dept_pid", "dept_name"));
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    //将list集合转成树形结构的list集合
    public static List<Map<String,Object>> listToTree(List<Map<String,Object>> list, String id, String pid, String name) {
        //用递归找子节点
        List<Map<String,Object>> treeList = new ArrayList<>();
        for (Map<String,Object> tree : list) {
            if (tree.get(pid).equals("-1")) {
                treeList.add(findChildren(tree, list, id, pid, name));
            }
        }
        return treeList;
    }

    //寻找子节点
    private static Map<String,Object> findChildren(Map<String,Object> tree, List<Map<String,Object>> list, String id, String pid, String name) {
        for (Map<String,Object> node : list) {
            if (node.get(pid).equals(tree.get(id))) {
                if (tree.get("children") == null) {
                    tree.put("children",new ArrayList<Map<String,Object>>());
                }
                ((List)tree.get("children")).add(findChildren(node, list, id, pid, name));
            }
        }
        tree.put("title",tree.get(name));
        tree.put("id",tree.get(id));
        return tree;
    }


    /**
     * 加载自定义菜单
     * lch
     * 2020-02-12
     */
    @RequestMapping("/loadZdycdTree")
    @ResponseBody
    public Map<String,Object> loadZdycdTree(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> list = sysService.loadZdycdTree(map);
            resultMap.put("resultCode","200");
            resultMap.put("list",listToTree(list, "id", "pid", "mc"));
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 自定义菜单唯一性判断
     * lch
     * 2020-02-13
     */
    @RequestMapping("/uniqueZdycd")
    @ResponseBody
    public Map<String,Object> uniqueZdycd(@RequestBody Map<String,Object> map){
        Map<String,Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> map1 = sysService.uniqueZdycd(map);
            resultMap.putAll(map1);
        } catch (Exception e) {
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 递归查询自定义菜单  一级及授权数据 组织授权
     */
    @PostMapping("/findOneZdycd")
    @ResponseBody
    public HashMap<String, Object> findOneZdycd(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            List<Map<String, Object>> list = sysService.findZdycd(map);
            List<Map<String, Object>> menuList = sysService.findYsqzdycd(map);
            resultMap.put("resultCode","200");
            resultMap.put("resultData",list);
            resultMap.put("menuList",menuList);
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询二三自定义菜单
     * @param map
     * @return
     * */
    @PostMapping("/findZdycd234")
    @ResponseBody
    public HashMap<String, Object> findZdycd234(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            List<Map<String, Object>> two = sysService.findZdycd(map);
            for(int j=0;j<two.size();j++){
                map.put("pid",two.get(j).get("id"));
                List<Map<String, Object>> three = sysService.findZdycd(map);
                two.get(j).put("three", three);
            }
            resultMap.put("resultCode","200");
            resultMap.put("list",two);
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 自定义菜单授权
     * 2019-08-16
     * */
    @RequestMapping("/zdycdGrant")
    @ResponseBody
    public Map<String,Object> zdycdGrant(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            sysService.zdycdGrant(map);
            CommonController.addLog("4", 1, (Map<String,Object>)map.get("ASD"));
            resultMap.put("resultCode","200");
        }catch (Exception e){
            e.printStackTrace();
            CommonController.addLog("4", 2, (Map<String,Object>)map.get("ASD"));
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 自定义快捷菜单列表 查询
     * lch
     * 2020-02-17
     * */
    @PostMapping("/loadKjcdList")
    @ResponseBody
    public Map<String,Object> loadKjcdList(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> pages = sysService.loadKjcdList(map);
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
     * 自定义快捷菜单 设置
     * lch
     * 2020-02-17
     * */
    @PostMapping("/setZdykjcd")
    @ResponseBody
    public Map<String,Object> setZdykjcd(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            sysService.setZdykjcd(map);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","添加成功");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询组织菜单
     * lch
     * 2020-02-17
     * */
    @PostMapping("/selOrgCdList")
    @ResponseBody
    public Map<String,Object> selOrgCdList(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> pages = sysService.selOrgCdList(map);
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
     * 快捷菜单 查询
     * lch
     * 2020-02-17
     * */
    @PostMapping("/selKjcdAll")
    @ResponseBody
    public Map<String,Object> selKjcdAll(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> list = sysService.selKjcdAll(map);
            String zdycd_ids = "";
            String zdycd_mcs = "";
            for(int i=0;i<list.size();i++){
                if(i < list.size() -1){
                    zdycd_ids += list.get(i).get("ZDYCD_ID").toString()+",";
                    zdycd_mcs += list.get(i).get("ZDYCD_MC").toString()+",";
                }else{
                    zdycd_ids += list.get(i).get("ZDYCD_ID").toString();
                    zdycd_mcs += list.get(i).get("ZDYCD_MC").toString();
                }
            }
            resultMap.put("zdycd_ids",zdycd_ids);
            resultMap.put("zdycd_mcs",zdycd_mcs);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 删除部门
     * 由于涉及上级部门PID，属于特殊删除
     * 2019-08-15
     * */
    @RequestMapping("/deleteDept")
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

                List<Map<String, Object>> maps = commonService.selectFieldsByOther("SYS_DEPT", "count(1) C", "DEPT_PID='" + ((Map<String, Object>) map.get("delete")).get("ID").toString()+"'", null, null);
                if (Integer.valueOf(maps.get(0).get("C").toString())>0){
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","该记录正在使用，不可删除！");
                }else{
                    if(commonService.delete(map)){
                        CommonController.addLog("5", 1, (Map<String,Object>)map.get("ASD"));
                        resultMap.put("resultCode","200");
                        resultMap.put("resultMsg","删除成功");
                    }else {
                        resultMap.put("resultCode","500");
                        resultMap.put("resultMsg","删除失败");
                    }
                }
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            e.printStackTrace();
            String msg = e.getMessage();
            if(msg!=null && msg.indexOf("ORA-02292:")>-1){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","请先移除部门人员后再删除！");
            }else{
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg",e.getMessage());
            }
        }
        return resultMap;
    }

    /**
     * 角色授权
     * lch
     * 2019-09-05
     * */
    @RequestMapping("/roleGrant")
    @ResponseBody
    public Map<String,Object> roleGrant(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            sysService.roleGrant(map);
            CommonController.addLog("5", 1, (Map<String,Object>)map.get("ASD"));
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","操作成功");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }


    /**
     * 组织菜单授权
     * 2019-08-16
     * */
    @RequestMapping("/orgGrant")
    @ResponseBody
    public Map<String,Object> orgGrant(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            sysService.orgGrant(map);
            CommonController.addLog("4", 1, (Map<String,Object>)map.get("ASD"));
            resultMap.put("resultCode","200");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 获取一级菜单数据
     * @return
     */
    @RequestMapping("/getFirstRight")
    @ResponseBody
    public Map<String,Object> getFirstRight(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                if (map.get("belong_org_id")==null){
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","未登录");
                }else {
                    String xmlx = map.get("xmlx").toString();
                    String isadmin = map.get("isadmin").toString();
                    String belong_org_id = map.get("belong_org_id").toString();
                    String fieldName = "TAB.RIGHT_ID,TAB.RIGHT_NAME,TAB.RIGHT_TYPE,TAB.RIGHT_CODE,TAB.RIGHT_URL,TAB.RIGHT_YWPT,TAB.RIGHT_GXNAME,TAB.RIGHT_ICON";
                    String tiaojian = "";
                    if(xmlx.equals("4")){
                        //bcca 不做组织权限控制
                        tiaojian = "INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 AND RIGHT_PID='-1'";
                    }else{
                        tiaojian = "EXISTS (SELECT 1 FROM SYS_ORG_MENU M WHERE M.RIGHT_ID = TAB.RIGHT_ID AND M.ORG_ID = '"+belong_org_id+"') AND INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 AND RIGHT_PID='-1'";
                        if(isadmin.equals("1")){
                            String user_id = map.get("user_id").toString();
                            tiaojian = "EXISTS (SELECT 1 FROM SYS_ROLE_RIGHT SRR " +
                                    "LEFT JOIN SYS_ROLE SR ON SR.ROLE_ID = SRR.ROLE_ID " +
                                    "LEFT JOIN SYS_ROLE_USER RU ON RU.ROLE_ID = SR.ROLE_ID " +
                                    "WHERE SRR.RIGHT_ID = TAB.RIGHT_ID AND RU.USER_ID = '"+ user_id +"') AND INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 and RIGHT_PID = '-1'";
                        }
                    }
                    if("2".equals(isadmin) && !"1".equals(belong_org_id)){
                        //组织管理员只查询有管理员权限的菜单
                        tiaojian += "AND EXISTS (SELECT 1 FROM SYS_RIGHT A WHERE INSTR(A.ATTR_1,'2') > 0 AND INSTR(A.RIGHT_YWPT, '"+ xmlx +"') > 0 START WITH RIGHT_ID = TAB.RIGHT_ID CONNECT BY NOCYCLE PRIOR A.RIGHT_ID = A.RIGHT_PID)";
                    }

                    List<Map<String, Object>> data = commonService.selectFieldsByOther("SYS_RIGHT TAB", fieldName, tiaojian, "to_number(RIGHT_ORDER)", null);
                    data = ContextHelper.transformListUpperCase(data);
                    resultMap.put("resultCode","200");
                    HashMap<String, Object> map1 = new HashMap<>();
                    map1.put("count",data.size());
                    map1.put("data",data);
                    resultMap.put("resultMsg",map1);
                }
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 停用启用用户
     *
     * */
    @PostMapping("/tyqyUser")
    @ResponseBody
    public Map<String,Object> tyqyUser(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                sysService.tyqyUser(map);
                resultMap.put("resultCode","200");
                resultMap.put("resultMsg","操作成功");
            }else {
                resultMap.putAll(asd);
            }
        } catch (Exception e) {
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询菜单按钮权限
     * lch
     * 2019-10-08
     * */
    @RequestMapping("/selRightButton")
    @ResponseBody
    public Map<String,Object> selRightButton(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                //查询首页菜单按钮权限
                List<Map<String, Object>> buttonlist = sysService.selRightButton(map);
                resultMap.put("resultCode","200");
                HashMap<String, Object> map1 = new HashMap<>();
                map1.put("data",buttonlist);
                resultMap.put("resultMsg",map1);
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 获取二级菜单数据
     * @return
     */
    @RequestMapping("/getSecondRight")
    @ResponseBody
    public Map<String,Object> getSecondRight(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                if (map.get("belong_org_id")==null||map.get("pid")==null){
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","参数不全");
                }else {
                    String xmlx = map.get("xmlx").toString();
                    String isadmin = map.get("isadmin").toString();
                    String belong_org_id = map.get("belong_org_id").toString();
                    String pid = map.get("pid").toString();
                    String fieldName = "TAB.RIGHT_ID,TAB.RIGHT_NAME,TAB.RIGHT_TYPE,TAB.RIGHT_CODE,TAB.RIGHT_URL,TAB.RIGHT_YWPT,TAB.RIGHT_GXNAME,TAB.RIGHT_ICON";
                    String tiaojian = "";
                    if(xmlx.equals("4")){
                        tiaojian = "INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 and RIGHT_PID='"+ pid +"'";
                    }else{
                        tiaojian = "EXISTS (SELECT 1 FROM SYS_ORG_MENU M WHERE M.RIGHT_ID = TAB.RIGHT_ID AND M.ORG_ID = '"+belong_org_id+"') AND INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 and RIGHT_PID='"+ pid +"'";
                        if(isadmin.equals("1")){
                            String user_id = map.get("user_id").toString();
                            tiaojian = "EXISTS (SELECT 1 FROM SYS_ROLE_RIGHT SRR " +
                                    "LEFT JOIN SYS_ROLE SR ON SR.ROLE_ID = SRR.ROLE_ID " +
                                    "LEFT JOIN SYS_ROLE_USER RU ON RU.ROLE_ID = SR.ROLE_ID " +
                                    "WHERE SRR.RIGHT_ID = TAB.RIGHT_ID AND RU.USER_ID = '"+ user_id +"') AND INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 and RIGHT_PID = '"+ pid +"'";
                        }
                    }
                    if("2".equals(isadmin) && !"1".equals(belong_org_id)){
                        //组织管理员只查询有管理员权限的菜单
                        tiaojian += "AND EXISTS (SELECT 1 FROM SYS_RIGHT A WHERE INSTR(A.ATTR_1,'2') > 0 AND INSTR(A.RIGHT_YWPT, '"+ xmlx +"') > 0 START WITH RIGHT_ID = TAB.RIGHT_ID CONNECT BY NOCYCLE PRIOR A.RIGHT_ID = A.RIGHT_PID)";
                    }
                    List<Map<String, Object>> data = commonService.selectFieldsByOther("SYS_RIGHT TAB", fieldName, tiaojian, "to_number(RIGHT_ORDER)", null);
                    for (int i=0;i<data.size();i++){
                        pid = data.get(i).get("RIGHT_ID").toString();
                        if(xmlx.equals("4")){
                            String name=" 1=1 ";
                            if (map.get("Rname")!=null&&map.get("Rname")!=""){
                                name="RIGHT_NAME like'%"+map.get("Rname")+"%'";
                            }
                            tiaojian = "INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 and RIGHT_PID='"+ pid +"' and "+name;
                        }else{
                            String name=" 1=1 ";
                            if (map.get("Rname")!=null&&map.get("Rname")!=""){
                                name="RIGHT_NAME like'%"+map.get("Rname")+"%'";
                            }
                            tiaojian = "EXISTS (SELECT 1 FROM SYS_ORG_MENU M WHERE M.RIGHT_ID = TAB.RIGHT_ID AND M.ORG_ID = '"+belong_org_id+"') AND INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 and RIGHT_PID='"+ pid +"' and "+name;
                            if(map.containsKey("isadmin") && map.get("isadmin").equals("1")){
                                String user_id = map.get("user_id").toString();
                                tiaojian = "EXISTS (SELECT 1 FROM SYS_ROLE_RIGHT SRR " +
                                        "LEFT JOIN SYS_ROLE SR ON SR.ROLE_ID = SRR.ROLE_ID " +
                                        "LEFT JOIN SYS_ROLE_USER RU ON RU.ROLE_ID = SR.ROLE_ID " +
                                        "WHERE SRR.RIGHT_ID = TAB.RIGHT_ID AND RU.USER_ID = '"+ user_id +"') AND INSTR(TAB.RIGHT_YWPT,'"+ xmlx +"') > 0 and RIGHT_PID = '"+ pid +"' and "+name;
                            }
                        }
                        if("2".equals(isadmin) && !"1".equals(belong_org_id)){
                            //组织管理员只查询有管理员权限的菜单
                            tiaojian += "AND EXISTS (SELECT 1 FROM SYS_RIGHT A WHERE INSTR(A.ATTR_1,'2') > 0 AND INSTR(A.RIGHT_YWPT, '"+ xmlx +"') > 0 START WITH RIGHT_ID = TAB.RIGHT_ID CONNECT BY NOCYCLE PRIOR A.RIGHT_ID = A.RIGHT_PID)";
                        }
                        List<Map<String, Object>> list = commonService.selectFieldsByOther("SYS_RIGHT TAB", fieldName, tiaojian, "to_number(RIGHT_ORDER)", null);
                        list = ContextHelper.transformListUpperCase(list);
                        data.get(i).put("second",list);
                    }
                    HashMap<String, Object> map1 = new HashMap<>();
                    data = ContextHelper.transformListUpperCase(data);
                    map1.put("data",data);
                    resultMap.put("resultMsg",map1);
                    resultMap.put("resultCode","200");
                }
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 通过组织ID查询组织信息
     * lch
     * 2019-09-03
     * */
    @PostMapping("/selOrgByID")
    @ResponseBody
    public Map<String,Object> selOrgByID(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String org_id = map.get("org_id").toString();
            if(org_id == null || "".equals(org_id)){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","参数不全");
            }else{
                String tableName = "PT_ORG";
                Map<String, Object> data = commonService.getDataByKeys(tableName, map);
                resultMap.put("data",data);
                resultMap.put("resultCode","200");
                resultMap.put("resultMsg","组织查询成功");
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 查询已授角色用户
     * lch
     * 2019-09-06
     */
    @PostMapping("/roleUser")
    @ResponseBody
    public Map<String,Object> roleUser(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> pages = sysService.selRoleUser(map);
            resultMap.put("resultCode","200");
            resultMap.put("count",pages.get("total"));
            resultMap.put("data",pages.get("list"));
            resultMap.put("code",0);
            resultMap.put("msg","");
        }catch (Exception e){
            e.printStackTrace();
        }
        return resultMap;
    }

    /**
     * 角色授权用户
     * lch
     * 2019-09-06
     * */
    @RequestMapping("/addRoleUser")
    @ResponseBody
    public Map<String,Object> addRoleUser(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String role_id = map.get("role_id").toString();
            String user_ids = map.get("ids").toString();
            if(user_ids != null && !"".equals(user_ids)){
                String[] ids = user_ids.split(",");
                List<Map<String, Object>> paramsList = new ArrayList<>();
                Map<String, Object> map1 = null;
                for(int i=0;i<ids.length;i++){
                    map1 = new HashMap<>();
                    map1.put("ROLE_ID", role_id);
                    map1.put("USER_ID", ids[i]);
                    map1.put("CREATED_TIME", "sysdate");
                    paramsList.add(map1);
                }
                boolean flg = commonService.addAllData("SYS_ROLE_USER", paramsList);
                if(flg){
                    CommonController.addLog("4", 1, (Map<String,Object>)map.get("ASD"));
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","添加成功");
                }else {
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","添加失败");
                }
            }
            resultMap.put("resultCode","200");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 角色移除用户
     * lch
     * 2019-09-06
     */
    @RequestMapping("/delRoleUser")
    @ResponseBody
    public Map<String,Object> delRoleUser(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String role_id = map.get("role_id").toString();
            String user_ids = map.get("ids").toString();
            if(user_ids != null && !"".equals(user_ids)){
                String[] ids = user_ids.split(",");
                List<Map<String, Object>> paramsList = new ArrayList<>();
                Map<String, Object> map1 = null;
                for(int i=0;i<ids.length;i++){
                    map1 = new HashMap<>();
                    map1.put("role_id", role_id);
                    map1.put("user_id", ids[i]);
                    paramsList.add(map1);
                }
                sysService.delRoleUser(paramsList);
                CommonController.addLog("4", 1, (Map<String,Object>)map.get("ASD"));
                resultMap.put("resultCode","200");
                resultMap.put("resultMsg","添加成功");
            }
            resultMap.put("resultCode","200");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询用户角色
     * lch
     * 2019-09-25
     * */
    @RequestMapping("/selUserRole")
    @ResponseBody
    public Map<String,Object> selUserRole(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String,Object>> rolelist = sysService.selUserRole(map);
            resultMap.put("data", rolelist);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","查询成功");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询用户权限
     * lch
     * 2019-09-25
     * */
    @RequestMapping("/selUserRight")
    @ResponseBody
    public Map<String,Object> selUserRight(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String,Object>> rightlist = sysService.selUserRight(map);
            resultMap.put("data", rightlist);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","查询成功");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询日志列表
     * lch
     * 2019-10-18
     * */
    @RequestMapping("/findBizLogOnPage")
    @ResponseBody
    public Map<String,Object> findBizLogOnPage(@RequestBody Map<String,Object> map){
        System.out.println(map);
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            if(!map.containsKey("page") || map.get("page") == null){
                map.put("page",1);
            }
            if(!map.containsKey("limit") || map.get("limit") == null){
                map.put("limit",10);
            }
            Map<String, Object> pages = sysService.findBizLogOnPage(map);

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
            resultMap.put("resultMsg","");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }


    /**
     * 返回用户token
     * @param
     * @return
     */
    @PostMapping("/findUserToken")
    @ResponseBody
    public String findUserToken(@RequestBody Map<String,Object> map) {
        try{
            String user_id = map.get("user_id").toString();
            String token  = sysService.findUserToken(user_id);
            return token ;
        }catch (Exception e){
            return "" ;
        }
    }


    @RequestMapping("/updateUser")
    @ResponseBody
    public Map<String,Object> updateUser(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            if(sysService.updateUser(map)){
                CommonController.addLog("4", 1, (Map<String,Object>)map.get("ASD"));
                resultMap.put("resultCode","200");
                resultMap.put("resultMsg","修改成功");
            }else {
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","修改失败");
            }
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }


    /**
     * 获取用户列表，用于部门管理的管理员展示
     * @Author: 倪杨
     * @Date: 2019/11/14
     */
    @RequestMapping("/getUserListInDept")
    @ResponseBody
    public Map<String, Object> getUserListInDept (@RequestBody Map<String,Object> map){
        map=(Map<String, Object>)map.get("ASD");
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String fieldName = "USER_ID \"id\",USER_NAME \"mc\"";
            List<Map<String, Object>> maps = commonService.selectFieldsByOther("SYS_USER", fieldName, "BELONG_ORG_ID = '" + map.get("org_id") + "' and USER_ISADMIN = '1'", null, null);
            resultMap.put("resultCode","200");
            resultMap.put("resultData",maps);
        }catch (Exception e){
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    @RequestMapping("/getInDeptUser")
    @ResponseBody
    public Map<String, Object> getInDeptUser (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> maps = sysService.getInDeptUser(map);

            resultMap.put("resultCode","200");
            resultMap.put("count",maps.size());
            resultMap.put("data",maps);
            resultMap.put("code",0);
            resultMap.put("msg","");
        }catch (Exception e){
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    @RequestMapping("/getOutDeptUser")
    @ResponseBody
    public Map<String, Object> getOutDeptUser (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> maps = sysService.getOutDeptUser(map);

            resultMap.put("resultCode","200");
            resultMap.put("count",maps.size());
            resultMap.put("data",maps);
            resultMap.put("code",0);
            resultMap.put("msg","");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }


    @RequestMapping("/addDetpUser")
    @ResponseBody
    public Map<String, Object> addDetpUser (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String dept_id = map.get("dept_id").toString();
            String xs_ids = map.get("ids").toString();
            if(xs_ids != null && !"".equals(xs_ids)){
                String[] ids = xs_ids.split(",");
                List<Map<String, Object>> paramsList = new ArrayList<>();
                Map<String, Object> map1 = null;
                for(int i=0;i<ids.length;i++){
                    map1 = new HashMap<>();
                    map1.put("DEPT_ID", dept_id);
                    map1.put("USER_ID", ids[i]);
                    map1.put("CREATED_TIME", "sysdate");
                    paramsList.add(map1);
                }
                boolean flg = commonService.addAllData("SYS_DUSER", paramsList);
                if(flg){
//                    CommonController.addLog("3", 1, (Map<String,Object>)map.get("ASD"));
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","添加成功");
                }else {
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","添加失败");
                }
            }
            resultMap.put("resultCode","200");
        }catch (Exception e){
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    @RequestMapping("/delDetpUser")
    @ResponseBody
    public Map<String, Object> delDetpUser (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String dept_id = map.get("dept_id").toString();
            String xs_ids = map.get("ids").toString();
            if(xs_ids != null && !"".equals(xs_ids)){
                String[] ids = xs_ids.split(",");
                List<Map<String, Object>> paramsList = new ArrayList<>();
                Map<String, Object> map1 = null;
                for(int i=0;i<ids.length;i++){
                    map1 = new HashMap<>();
                    map1.put("DEPT_ID", dept_id);
                    map1.put("USER_ID", ids[i]);
                    paramsList.add(map1);
                }
                boolean flg = sysService.delDetpUser(paramsList);
                if(flg){
//                    CommonController.addLog("3", 1, (Map<String,Object>)map.get("ASD"));
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","添加成功");
                }else {
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","添加失败");
                }
            }
            resultMap.put("resultCode","200");
        }catch (Exception e){
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    @RequestMapping("/updateUserInterface")
    @ResponseBody
    public Map<String, Object> updateUserInterface (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String account = map.get("account").toString();
            String name = map.get("name").toString();
            String id = map.get("id").toString();
            //账户唯一性验证
            String fieldName = "*";
            String tablename = "SYS_USER";
            String tiaojian = "USER_ACCOUNT = '"+ account +"' AND USER_ID != '"+ id +"'";
            List<Map<String,Object>> list = commonService.selectFieldsByOther(tablename, fieldName, tiaojian, null, null);
            if(list.size() > 0){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","账户已存在！");
            }else{
                HashMap<String, Object> map1 = new HashMap<>();
                map1.put("USER_ACCOUNT","'"+account+"'");
                map1.put("USER_NAME","'"+name+"'");
                HashMap<String, Object> userMap = new HashMap<>();
                userMap.put("tablename","SYS_USER");
                userMap.put("keys",ContextHelper.getKey(map1));
                userMap.put("params",map1);
                map1 = new HashMap<>();
                map1.put("USER_ID","'"+id+"'");
                userMap.put("keys2",ContextHelper.getKey(map1));
                userMap.put("params2",map1);
                boolean b = commonMapper.update(userMap);
                if (b){
                    fieldName = "tab.userext_code,su.user_type";
                    tablename = "sys_userext tab left join sys_user su on su.user_id = tab.user_id";
                    tiaojian = "su.user_id = '"+ id +"'";
                    Map<String, Object> map2 = commonService.selectFieldsByOther(tablename, fieldName, tiaojian, null, null).get(0);
                    if (!map2.isEmpty()){
                        resultMap.put("resultCode","200");
                        resultMap.put("userExtCode",map2.get("USEREXT_CODE"));
                        resultMap.put("user_type", map2.get("USER_TYPE"));
                    }else {
                        resultMap.put("resultCode","500");
                        resultMap.put("userExtCode","");
                    }
                }
            }
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 发送短信验证
     * @param
     * @return
     */
    @PostMapping("/forgetNameFindTel")
    @ResponseBody
    public Map<String,Object> forgetNameFindTel(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> list = sysService.selUserByUserAccount(map);
            if(list.size()==0){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","该账户不存在，请查验后再试！");
            }else{
                String USER_ID = list.get(0).get("USER_ID").toString();
                String USEREXT_LXDH = "";
                if(list.get(0).get("USEREXT_LXDH") != null){
                    USEREXT_LXDH = list.get(0).get("USEREXT_LXDH").toString();
                }
                if(USEREXT_LXDH == null || "".equals(USEREXT_LXDH)){
                    map.put("resultCode","500");
                    map.put("resultMsg","该账户未添加电话号码！");
                }else{
                    Integer verificationCode =(int)((Math.random()*9+1)*100000);
                    System.out.println("手机验证码："+verificationCode);
                    SmsAccountInfo smsAccountInfo = new SmsAccountInfo();
                    smsAccountInfo.setJkzh_ac(messageZh);
                    smsAccountInfo.setJkzh_pwd(messagepass);

                    SmsResult result = HttpXmlUtil.send(smsAccountInfo, USEREXT_LXDH, verificationCode + "");
                    if(result != null && result.getResultCode().equals(0)){
                        //把验证码放入用户参数信息
                        String ATTR_1 = "";
                        if(list.get(0).containsKey("ATTR_1") && list.get(0).get("ATTR_1") != null){
                            ATTR_1 = list.get(0).get("ATTR_1").toString();
                        }
                        String tableName = "SYS_USER";
                        Map<String, Object> map1 = new HashMap<>();
                        if(ATTR_1 != null && !"".equals(ATTR_1)){
                            JSONObject jsonObject = JSONObject.parseObject(ATTR_1);
                            jsonObject.put("YZM", verificationCode+","+new Date().getTime());
                            map1.put("ATTR_1", "'"+ JSON.toJSON(jsonObject).toString() +"'");
                        }else{
                            Map<String, Object> param = new HashMap<String, Object>();
                            param.put("YZM", verificationCode+","+new Date().getTime());
                            map1.put("ATTR_1", "'"+ JSON.toJSON(param).toString() +"'");
                        }
                        Map<String, Object> map2 = new HashMap<>();
                        map2.put("USER_ID", "'"+ USER_ID +"'");
                        commonService.updateRule(tableName, map2, map1);
                        resultMap.put("user_id",USER_ID);
                        resultMap.put("verificationCode",verificationCode);
                        resultMap.put("resultCode","200");
                        resultMap.put("resultMsg","验证码获取成功");
                    }else{
                        resultMap.put("resultCode","500");
                        resultMap.put("resultMsg","短信发送失败！");
                    }
                }
            }
        } catch (Exception e) {
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 校验验证码
     * @param
     * @return
     */
    @PostMapping("/verifyMessage")
    @ResponseBody
    public Map<String,Object> verifyMessage(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> list = sysService.selUserByUserAccount(map);
            if(list.size()==0){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","该账户不存在，请查验后再试！");
            }else{
                String ATTR_1 = "";
                String yzm = "";
                if(list.get(0).containsKey("ATTR_1") && list.get(0).get("ATTR_1") != null){
                    ATTR_1 = list.get(0).get("ATTR_1").toString();
                    JSONObject jsonObject = JSONObject.parseObject(ATTR_1);
                    if(jsonObject.containsKey("YZM") && jsonObject.get("YZM") != null){
                        String yzmt = jsonObject.get("YZM").toString();
                        String time = yzmt.split(",")[1];
                        long lt = new Long(time);
                        Date date = new Date(lt);
                        Calendar cal = Calendar.getInstance();
                        cal.setTime(date);
                        cal.add(Calendar.MINUTE, 2);//
                        if(new Date().before(cal.getTime())){
                            yzm = yzmt.split(",")[0];
                        }
                    }
                }
                if(yzm == null || "".equals(yzm)){
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","验证码失效！");
                }
                String yzm2 = map.get("yzm").toString();
                if(!yzm.equals(yzm2)){
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","验证码错误！");
                }else{
                    resultMap.put("user_id", list.get(0).get("USER_ID"));
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","验证码校验成功！");
                }
            }
        } catch (Exception e) {
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }


    /**
     * 忘记密码--》 修改密码
     * @return
     */
    @PostMapping("/forgetUserTelMatch")
    @ResponseBody
    public Map<String, Object> forgetUserTelMatch(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            sysService.updatePassword(map);
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","密码设置成功！");
        }catch (Exception e){
            resultMap.put("resultCode","200");
            resultMap.put("resultMsg","密码设置失败！");
        }
        return resultMap;
    }

    /**
     * 获取头像
     * @Author: 倪杨
     * @Date: 2019/12/5
     */
    @RequestMapping("/getUserAvatar")
    @ResponseBody
    public Map<String, Object> getUserAvatar(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                List<Map<String, Object>> userAvatar = sysService.getUserAvatar(map);
                userAvatar = ContextHelper.transformListUpperCase(userAvatar);
                resultMap.put("resultCode","200");
                resultMap.put("resultData",userAvatar);
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }


    /**
     * 修改用户头像
     * @Author: 倪杨
     * @Date: 2019/12/27
     */
    @RequestMapping("/updateUserAvatar")
    @ResponseBody
    public Map<String, Object> updateUserAvatar(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                sysService.updateUserAvatar(map);
                resultMap.put("resultCode","200");
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }
}
