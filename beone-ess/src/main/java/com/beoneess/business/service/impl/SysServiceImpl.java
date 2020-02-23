package com.beoneess.business.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.beoneess.business.mapper.SysMapper;
import com.beoneess.business.service.SysService;
import com.beoneess.common.controller.CommonController;
import com.beoneess.common.controller.ContextHelper;
import com.beoneess.common.mapper.CommonMapper;
import com.beoneess.common.service.impl.CommonServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;


import static com.beoneess.common.controller.LoginController.inside_jxsc;

/**
 * 系统管理业务层实现
 */
@Service
public class SysServiceImpl implements SysService {

    @Autowired
    CommonServiceImpl commonService;
    @Autowired
    private SysMapper sysMapper;
    @Autowired
    CommonMapper commonMapper;

    /**
     * 组织菜单授权
     * lch
     * 2019-08-16
     * */
    @Transactional(rollbackFor = Exception.class)
    public void orgGrant(Map<String,Object> map)throws Exception{
//        System.out.println(map);
//        System.out.println("addArray:"+map.get("addArray"));
//        System.out.println("delArray:"+map.get("delArray"));
        String param = map.get("delArray").toString() ;
        String borg_id = map.get("borg_id").toString() ;
        String[] params = map.get("addArray").toString().split(",");
        String[] keys = new String[]{"RIGHT_ID","ORG_ID"} ;

        //删除
        if(param!=null && !param.equals("")){
            Map<String, Object> delmap=new HashMap<String, Object>();
            HashMap<String, Object> paramsMap = new HashMap<>();
            paramsMap.put("RIGHT_ID",param);
            paramsMap.put("ORG_ID",borg_id);

            delmap.put("tablename" , "SYS_ORG_MENU");
            delmap.put("keys" , keys);
            delmap.put("params" , paramsMap);
            commonMapper.delete(delmap) ;
        }

        //添加
        keys = new String[]{"RIGHT_ID","ORG_ID"} ;
        for(int i=0;i<params.length;i++){
            if(params[i]==null || params[i].equals(""))
                continue;
            else{
                HashMap<String, Object> paramsMap = new HashMap<>();
                paramsMap.put("RIGHT_ID","'"+params[i]+"'");
                paramsMap.put("ORG_ID","'"+borg_id+"'");
                paramsMap.put("CREATED_TIME", "sysdate");
                map.put("fieldName","1");
                map.put("tablename" , "SYS_ORG_MENU");
                map.put("keys" , keys);
                map.put("params" , paramsMap);
                List<Map<String, Object>> result = commonMapper.find(map);
                if(result.size()==0){
                    Map<String, Object> addmap=new HashMap<String, Object>();
                    addmap.put("tablename" , "SYS_ORG_MENU");
                    addmap.put("keys" , keys);
                    addmap.put("params" , paramsMap);
                    commonMapper.insert(addmap) ;
                }else if(result.size()>1){
                    throw new RuntimeException("查询数据不合法!") ;
                }
            }
        }
    }

    /**
     * 角色菜单授权
     * lch
     * 2019-09-05
     * */
    @Transactional(rollbackFor = Exception.class)
    public void roleGrant(Map<String,Object> map)throws Exception{
//        System.out.println("addArray:"+map.get("addArray"));
//        System.out.println("delArray:"+map.get("delArray"));

        String role_id  =map.get("role_id").toString();
        String param = map.get("delArray").toString() ;
        String[] params = map.get("addArray").toString().split(",");
        String[] keys = new String[]{"RIGHT_ID","ROLE_ID"} ;

        //删除
        if(param!=null && !param.equals("")){
            Map<String, Object> delmap = new HashMap<String, Object>();
            HashMap<String, Object> paramsMap = new HashMap<>();
            paramsMap.put("RIGHT_ID",param);
            paramsMap.put("ROLE_ID",role_id);

            delmap.put("tablename" , "SYS_ROLE_RIGHT");
            delmap.put("keys" , keys);
            delmap.put("params" , paramsMap);
            commonMapper.delete(delmap) ;
        }

        //添加
        keys = new String[]{"RIGHT_ID","ROLE_ID","CREATED_TIME"};
        for(int i=0;i<params.length;i++){
            if(params[i]==null || params[i].equals(""))
                continue;
            else{
                HashMap<String, Object> paramsMap = new HashMap<>();
                paramsMap.put("RIGHT_ID","'"+params[i]+"'");
                paramsMap.put("ROLE_ID","'"+role_id+"'");
                paramsMap.put("CREATED_TIME", "sysdate");
                map.put("fieldName","1");
                map.put("tablename" , "SYS_ROLE_RIGHT");
                map.put("keys" , keys);
                map.put("params" , paramsMap);
                List<Map<String, Object>> result = commonMapper.find(map);
                if(result.size()==0){
                    Map<String, Object> addmap=new HashMap<String, Object>();
                    addmap.put("tablename" , "SYS_ROLE_RIGHT");
                    addmap.put("keys" , keys);
                    addmap.put("params" , paramsMap);
                    commonMapper.insert(addmap) ;
                }else if(result.size()>1){
                    throw new RuntimeException("查询数据不合法!") ;
                }
            }
        }
    }

    /**
     * 查询递归菜单
     * @param map
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> findDgRight(Map<String, Object> map) throws Exception {
        return sysMapper.findDgRight(map);
    }

    /**
     * 查询组织授权菜单
     * @param map
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> findOrgRight(Map<String, Object> map) throws Exception {
        return sysMapper.findOrgRight(map);
    }

    /**
     * 角色授权组织菜单查询
     * lch
     * 2019-09-05
     * */
    public List<Map<String, Object>> findDgOrgRight(Map<String, Object> map) throws Exception {
        return sysMapper.findDgOrgRight(map);
    }

    /**
     * 查询拥有权限的菜单编码
     * lch
     * 2019-09-09
     * */
    public List<Map<String, Object>> findRightCode(Map<String, Object> map)throws Exception{
        return sysMapper.findRightCode(map);
    }

    /**
     * 角色授权用户列表查询
     * lch
     * 2019-09-06
     * */
    public Map<String, Object> selRoleUser(Map<String , Object> params)throws Exception{
        Integer total = sysMapper.selRoleUserCount(params);
        int pageNo = Integer.parseInt(params.get("page").toString());
        int pageSize = Integer.parseInt(params.get("limit").toString());
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        List<Map<String, Object>> list = sysMapper.selRoleUserOnPage(params);
        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }

    /**
     * 删除角色用户
     * lch
     * 2019-09-16
     * */
    @Transactional(rollbackFor = Exception.class)
    public void delRoleUser(List<Map<String, Object>> paramsList)throws Exception{
        for(int i=0;i<paramsList.size();i++){
            sysMapper.delRoleUser(paramsList.get(i));
        }
    }

    /**
     * 查询用户角色
     * lch
     * 2019-09-25
     * */
    public List<Map<String, Object>> selUserRole(Map<String , Object> map)throws Exception{
        return  sysMapper.selUserRole(map);
    }

    /**
     * 查询用户权限
     * lch
     * 2019-09-25
     * */
    public List<Map<String, Object>> selUserRight(Map<String , Object> map)throws Exception{
        map.put("pid", "-1");
        List<Map<String, Object>> list1 = sysMapper.selUserRight(map);
        List<Map<String, Object>> list2 = null;
        List<Map<String, Object>> list3 = null;
        List<Map<String, Object>> list4 = null;
        for(int i=0;i<list1.size();i++){
            map.put("pid", list1.get(i).get("id"));
            list2 = sysMapper.selUserRight(map);
            for(int j=0;j<list2.size();j++){
                map.put("pid", list2.get(j).get("id"));
                list3 = sysMapper.selUserRight(map);
                for(int m=0;m<list3.size();m++){
                    map.put("pid", list3.get(m).get("id"));
                    list4 = sysMapper.selUserRight(map);
                    list3.get(m).put("list4", list4);
                }
                list2.get(j).put("list3", list3);
            }
            list1.get(i).put("list2", list2);
        }

        return  list1;
    }

    /**
     * 查询菜单按钮权限
     * lch
     * 2019-10-08
     * */
    public List<Map<String, Object>> selRightButton(Map<String, Object> map)throws Exception{
        return  sysMapper.selRightButton(map);
    }

    /**
     * 通过用户ID查询token字符串
     * @param user_id
     * @return
     * @throws Exception
     */
    public String findUserToken(String user_id) throws Exception {
        Map<String, Object> map = new HashMap<>();
        map.put("user_id",user_id);
        return sysMapper.findUserToken(map);
    }

    /**
     * 独立部署登录 数据同步
     * lch
     * 2019-09-29
     * */
    @Transactional(rollbackFor = Exception.class)
    public void login_sjtb(Map<String,Object> map) throws Exception {
        SimpleDateFormat format =new SimpleDateFormat("yyyyMMddHHmmss");
        String sjjsUrl = "/sys/dataRecept";
        String org_id = map.get("org_id").toString();
        String bslx = map.get("bslx").toString();
        String path = map.get("path").toString();
        String xmlx = map.get("xmlx").toString();
        String isadmin = "";
        if(map.containsKey("isadmin")){
            isadmin = map.get("isadmin").toString();
        }
        String time = null;
        System.out.println(org_id+"=="+bslx+"=="+path+"=="+xmlx);
        //查询组织
        Map<String,Object> map1 = new HashMap<String, Object>();
        String tableName = "PT_ORG";
        String fieldName = "*";
        String tiaojian = "ORG_ID = '"+ org_id +"'";
        String orderName = "";
        map1.put("fieldName",fieldName);
        map1.put("tablename", tableName);
        map1.put("tiaojian", tiaojian);
        List<Map<String, Object>> orgResult = commonMapper.selectFieldsByOther(map1);
        String org_xddm = "";
        String org_type = orgResult.get(0).get("ORG_TYPE").toString();
        if(orgResult.get(0).get("ORG_XDDM") != null){
            org_xddm = orgResult.get(0).get("ORG_XDDM").toString();
        }

        //查询组织扩展表
        map1 = new HashMap<String, Object>();
        tableName = "PT_ORG_INFO";
        fieldName = "*";
        tiaojian = "ORG_ID = '"+ org_id +"'";
        map1.put("fieldName",fieldName);
        map1.put("tablename", tableName);
        map1.put("tiaojian", tiaojian);
        List<Map<String, Object>> orgInfoResult = commonMapper.selectFieldsByOther(map1);
        if(orgInfoResult == null || orgInfoResult.size() == 0){
            map1 = new HashMap<>();
            map1.put("INFO_ID", "'"+ CommonController.getSEQ("seq_0")+"'");
            map1.put("ORG_ID", "'"+ org_id +"'");
            map1.put("CREATOR_ID", "'3'");
            map1.put("CREATOR_NAME", "'sys'");
            map1.put("CREATED_TIME",  "sysdate");
            map1.put("EDITOR_ID", "'3'");
            map1.put("EDITOR_NAME", "'sys'");
            map1.put("EDITED_TIME", "sysdate");
            map1.put("BELONG_ORG_ID", "'"+ org_id +"'");
            map1.put("ATTR_2", "'"+ format.format(new Date()) +"'");
            //数据封装
            String[] keys = ContextHelper.getKey(map1);
            Map<String,Object> map2 = new HashMap<String, Object>();
            map2.put("tablename" , tableName);
            map2.put("keys" , keys);
            map2.put("params" , map1);
            commonMapper.insert(map2);
        }else{
            if(orgInfoResult.get(0).containsKey("ATTR_2") && orgInfoResult.get(0).get("ATTR_2") != null){
                time = orgInfoResult.get(0).get("ATTR_2")+"";
            }
            map1 = new HashMap<>();
            map1.put("ATTR_2", "'"+ format.format(new Date()) +"'");
            //数据封装
            String[] keys = ContextHelper.getKey(map1);
            Map<String,Object> map2 = new HashMap<String, Object>();
            map2.put("tablename" , tableName);
            map2.put("keys" , keys);
            map2.put("params" , map1);

            Map<String,Object> map3 = new HashMap<>();
            map3.put("INFO_ID", "'"+ orgInfoResult.get(0).get("INFO_ID")+"'");
            String[] keys2 = ContextHelper.getKey(map3);	//条件字段名数组
            map2.put("keys2", keys2);	//条件字段名
            map2.put("params2", map3);		//条件字段
            commonMapper.update(map2);
        }

        //同步组织
        JSONObject sjtbJson = new JSONObject();
        sjtbJson.put("dataType", "PT_ORG");
        sjtbJson.put("org_id", org_id);
        sjtbJson.put("data", orgResult);
        String result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
        if(result == null){
            throw new Exception("同步组织数据错误！");
        }else{
            JSONObject jsonObject = JSONObject.parseObject(result);
            if(!"200".equals(jsonObject.get("resultCode"))){
                throw new Exception("同步组织数据错误！");
            }
        }
        //同步组织扩展表
        map1 = new HashMap<String, Object>();
        tableName = "PT_ORG_INFO";
        fieldName = "*";
        tiaojian = "ORG_ID = '"+ org_id +"'";
        map1.put("fieldName",fieldName);
        map1.put("tablename", tableName);
        map1.put("tiaojian", tiaojian);
        List<Map<String, Object>> orginfoResult = commonMapper.selectFieldsByOther(map1);
        sjtbJson = new JSONObject();
        sjtbJson.put("dataType", "PT_ORG_INFO");
        sjtbJson.put("org_id", org_id);
        sjtbJson.put("data", orginfoResult);
        result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
        if(result == null){
            throw new Exception("同步组织扩展表数据错误！");
        }else{
            JSONObject jsonObject = JSONObject.parseObject(result);
            if(!"200".equals(jsonObject.get("resultCode"))){
                throw new Exception("同步组织扩展表数据错误！");
            }
        }
        if("2".equals(bslx)){
            //独立部署
            //同步学校信息
            sjtbJson.put("dataType", "XZGL_XXGL");
            sjtbJson.put("org_id", org_id);
            sjtbJson.put("data", orgResult);
            sjtbJson.put("pt_org_info", orginfoResult);
            result = ContextHelper.client_bcca(inside_jxsc+sjjsUrl, sjtbJson, "");
            if(result == null){
                throw new Exception("同步组织学校数据错误！");
            }else{
                JSONObject jsonObject = JSONObject.parseObject(result);
                if(!"200".equals(jsonObject.get("resultCode"))){
                    throw new Exception("同步组织学校数据错误！");
                }
            }
//            //同步系统权限菜单
//            map1 = new HashMap<String, Object>();
//            tableName = "SYS_RIGHT T";
//            fieldName = "T.*";
//            if(time == null || "".equals(time)){
//                tiaojian = null;
//            }else{
//               tiaojian = "T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
//            }
//            orderName = "to_number(t.right_id)";
//            map1.put("fieldName",fieldName);
//            map1.put("tablename", tableName);
//            map1.put("tiaojian", tiaojian);
//            map1.put("orderName", orderName);
//            List<Map<String, Object>> rightResult = commonMapper.selectFieldsByOther(map1);
//            if(rightResult.size() > 0){
//                sjtbJson = new JSONObject();
//                sjtbJson.put("dataType", "SYS_RIGHT");
//                sjtbJson.put("org_id", org_id);
//                sjtbJson.put("data", rightResult);
//                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
//                if(result == null){
//                    throw new Exception("同步组织权限表数据错误！");
//                }else{
//                    JSONObject jsonObject = JSONObject.parseObject(result);
//                    if(!"200".equals(jsonObject.get("resultCode"))){
//                        throw new Exception("同步组织权限表数据错误！");
//                    }
//                }
//            }

            //查询修改的参数表信息
            map1 = new HashMap<String, Object>();
            tableName = "SYS_CONFIG T";
            fieldName = "T.*";
            if(time == null || "".equals(time)){
                tiaojian = null;
            }else{
                tiaojian = "T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> configResult = commonMapper.selectFieldsByOther(map1);
            if(configResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_CONFIG");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", configResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步系统参数表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步系统参数表数据错误！");
                    }
                }
            }
//            if("2".equals(isadmin)){
//                //查询组织权限表,每次同步数据太慢，添加了管理员限制，只能管理员同步
//                map1 = new HashMap<String, Object>();
//                tableName = "SYS_ORG_MENU T";
//                fieldName = "T.*";
//                tiaojian = "T.ORG_ID = '"+ org_id +"'";
//                orderName = "to_number(T.RIGHT_ID)";
//                map1.put("fieldName",fieldName);
//                map1.put("tablename", tableName);
//                map1.put("tiaojian", tiaojian);
//                map1.put("orderName", orderName);
//                List<Map<String, Object>> orgMenuResult = commonMapper.selectFieldsByOther(map1);
//                if(orgMenuResult.size() > 0){
//                    sjtbJson = new JSONObject();
//                    sjtbJson.put("dataType", "SYS_ORG_MENU");
//                    sjtbJson.put("org_id", org_id);
//                    sjtbJson.put("data", orgMenuResult);
//                    result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
//                    if(result == null){
//                        throw new Exception("同步组织授权表数据错误！");
//                    }else{
//                        JSONObject jsonObject = JSONObject.parseObject(result);
//                        if(!"200".equals(jsonObject.get("resultCode"))){
//                            throw new Exception("同步组织授权表数据错误！");
//                        }
//                    }
//                }
//            }

            if(!xmlx.equals("bcca")){
                //广告位信息
                map1 = new HashMap<String, Object>();
                tableName = "PT_GGW T";
                fieldName = "T.*";
                if(time == null || "".equals(time)){
                    tiaojian = null;
                }else{
                    tiaojian = "T.GGW_ZT = '2' AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
                }
                orderName = "";
                map1.put("fieldName",fieldName);
                map1.put("tablename", tableName);
                map1.put("tiaojian", tiaojian);
                map1.put("orderName", orderName);
                List<Map<String, Object>> ggwResult = commonMapper.selectFieldsByOther(map1);
                if(ggwResult.size() > 0){
                    sjtbJson = new JSONObject();
                    sjtbJson.put("dataType", "PT_GGW");
                    sjtbJson.put("org_id", org_id);
                    sjtbJson.put("data", ggwResult);
                    result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                    if(result == null){
                        throw new Exception("同步广告数据错误！");
                    }else{
                        JSONObject jsonObject = JSONObject.parseObject(result);
                        if(!"200".equals(jsonObject.get("resultCode"))){
                            throw new Exception("同步广告数据错误！");
                        }
                    }
                }
            }

            //数据字典类别
            map1 = new HashMap<String, Object>();
            tableName = "SYS_DICT_TYPE T";
            fieldName = "T.*";
            if(time == null || "".equals(time)){
                tiaojian = null;
            }else{
                tiaojian = "T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> dictTypeResult = commonMapper.selectFieldsByOther(map1);
            if(dictTypeResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_DICT_TYPE");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", dictTypeResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步数据字典类别表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步数据字典类别表数据错误！");
                    }
                }
            }

            //数据字典
            map1 = new HashMap<String, Object>();
            tableName = "SYS_DICT_ITEM T";
            fieldName = "T.*";
            if(time == null || "".equals(time)){
                tiaojian = null;
            }else{
                tiaojian = "T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> dictResult = commonMapper.selectFieldsByOther(map1);
            if(dictResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_DICT_ITEM");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", dictResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步数据字典表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步数据字典表数据错误！");
                    }
                }
            }
            //学段管理
            map1 = new HashMap<String, Object>();
            tableName = "SYS_XDGL T";
            fieldName = "T.*";
            if("3".equals(org_type)){
                if(time == null || "".equals(time)){
                    tiaojian = "T.XDGL_SFKY = '2' AND T.XDGL_DM IN ("+ org_xddm +")";
                }else{
                    tiaojian = "T.XDGL_SFKY = '2' AND T.XDGL_DM IN ("+ org_xddm +") AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
                }
            }else{
                if(time == null || "".equals(time)){
                    tiaojian = "T.XDGL_SFKY = '2'";
                }else{
                    tiaojian = "T.XDGL_SFKY = '2' AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
                }
            }

            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> xdglResult = commonMapper.selectFieldsByOther(map1);
            if(xdglResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_XDGL");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", xdglResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步学段表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步学段表数据错误！");
                    }
                }
            }

            //学年度管理
            map1 = new HashMap<String, Object>();
            tableName = "SYS_XNDGL T";
            fieldName = "T.XNDGL_ID,T.XNDGL_DM,T.XNDGL_MC,TO_CHAR(T.XNDGL_KSSJ,'YYYY-MM-DD') AS XNDGL_KSSJ,TO_CHAR(T.XNDGL_JSSJ,'YYYY-MM-DD') AS XNDGL_JSSJ,T.XNDGL_SFDQXND,T.XNDGL_SFJS,T.CREATOR_ID,T.CREATOR_NAME,T.EDITOR_ID,T.EDITOR_NAME,T.BELONG_ORG_ID";
            if(time == null || "".equals(time)){
                tiaojian = "T.XNDGL_SFJS = '1'";
            }else{
                tiaojian = "T.XNDGL_SFJS = '1' AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> xndResult = commonMapper.selectFieldsByOther(map1);
            if(xndResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_XNDGL");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", xndResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步学年度表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步学年度表数据错误！");
                    }
                }
            }

            //学期管理
            map1 = new HashMap<String, Object>();
            tableName = "SYS_XQGL T LEFT JOIN SYS_XNDGL XND ON XND.XNDGL_ID = T.XNDGL_ID";
            fieldName = "T.XQGL_ID,T.XNDGL_ID,T.XQGL_MC,T.XQGL_XQM,TO_CHAR(T.XQGL_KSSJ,'YYYY-MM-DD') AS XQGL_KSSJ,TO_CHAR(T.XQGL_JSSJ,'YYYY-MM-DD') AS XQGL_JSSJ,T.XQGL_SFDQXQ,T.XQGL_SFJS,T.CREATOR_ID,T.CREATOR_NAME,T.EDITOR_ID,T.EDITOR_NAME,T.BELONG_ORG_ID,XND.XNDGL_DM";
            if(time == null || "".equals(time)){
                tiaojian = "T.XQGL_SFJS = '1'";
            }else{
                tiaojian = "T.XQGL_SFJS = '1' AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> xqglResult = commonMapper.selectFieldsByOther(map1);
            if(xqglResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_XQGL");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", xqglResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步学期表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步学期表数据错误！");
                    }
                }
            }

            //届别管理
            map1 = new HashMap<String, Object>();
            tableName = "SYS_JBGL T LEFT JOIN SYS_XDGL XD ON XD.XDGL_ID = T.XDGL_ID LEFT JOIN SYS_XQGL XQ ON XQ.XQGL_ID = T.XQGL_ID";
            fieldName = "T.*,XD.XDGL_DM,XQ.XQGL_MC";
            if(time == null || "".equals(time)){
                tiaojian = "T.JBGL_SFJS = '1' AND XD.XDGL_DM IN ("+ org_xddm +")";
            }else{
                tiaojian = "T.JBGL_SFJS = '1' AND XD.XDGL_DM IN ("+ org_xddm +") AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> jbglResult = commonMapper.selectFieldsByOther(map1);
            if(jbglResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_JBGL");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", jbglResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步届别表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步届别表数据错误！");
                    }
                }
            }
        }
    }

    /**
     * 平台部署  同步数据
     * lch
     * 2019-10-18
     * */
    @Transactional(rollbackFor = Exception.class)
    public void login_sjtb2(Map<String,Object> map) throws Exception {
        String org_id = map.get("belong_org_id").toString();
        String bslx = map.get("bslx").toString();
        String sjjsUrl = "/sys/dataRecept";
        String path = inside_jxsc;
//        if(bslx.equals("2")){
//            path = BCCA;
//        }
        //查询组织扩展表
        Map<String, Object> map1 = new HashMap<String, Object>();
        String fieldName = "TAB.ORG_NAME,TAB.ORG_TYPE,TAB.ORG_XDDM,INFO.ATTR_2";
        String tableName = "PT_ORG TAB LEFT JOIN PT_ORG_INFO INFO ON INFO.ORG_ID = TAB.ORG_ID";
        String tiaojian = "TAB.ORG_ID = '"+ org_id +"'";
        String orderName = "";
        map1.put("fieldName",fieldName);
        map1.put("tablename", tableName);
        map1.put("tiaojian", tiaojian);
        String time = null;
        List<Map<String, Object>> orgInfoResult = commonMapper.selectFieldsByOther(map1);
        if(orgInfoResult.get(0).containsKey("ATTR_2") && orgInfoResult.get(0).get("ATTR_2") != null){
            time = orgInfoResult.get(0).get("ATTR_2").toString();
        }
        String org_type = orgInfoResult.get(0).get("ORG_TYPE").toString();
        if("3".equals(org_type)){
            String org_xddm = orgInfoResult.get(0).get("ORG_XDDM").toString();
            //学校数据同步
            //学段管理
            map1 = new HashMap<String, Object>();
            tableName = "SYS_XDGL T";
            fieldName = "T.*";
            if(time == null || "".equals(time)){
                tiaojian = "T.XDGL_SFKY = '2' AND T.XDGL_ZT = '2' AND T.XDGL_DM IN ("+ org_xddm +")";
            }else{
                tiaojian = "T.XDGL_SFKY = '2' AND T.XDGL_ZT = '2' AND T.XDGL_DM IN ("+ org_xddm +") AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> xdglResult = commonMapper.selectFieldsByOther(map1);
            JSONObject sjtbJson = null;
            String result = null;
            if(xdglResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_XDGL");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", xdglResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步学段表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception(jsonObject.get("resultMsg")+"");
                    }
                }
            }

            //学年度管理
            map1 = new HashMap<String, Object>();
            tableName = "SYS_XNDGL T";
            fieldName = "T.XNDGL_ID,T.XNDGL_DM,T.XNDGL_MC,TO_CHAR(T.XNDGL_KSSJ,'YYYY-MM-DD') AS XNDGL_KSSJ,TO_CHAR(T.XNDGL_JSSJ,'YYYY-MM-DD') AS XNDGL_JSSJ,T.XNDGL_SFDQXND,T.XNDGL_SFJS,T.CREATOR_ID,T.CREATOR_NAME,T.EDITOR_ID,T.EDITOR_NAME,T.BELONG_ORG_ID";
            if(time == null || "".equals(time)){
                tiaojian = "T.XNDGL_SFJS = '1' AND T.XNDGL_ZT = '2'";
            }else{
                tiaojian = "T.XNDGL_SFJS = '1' AND T.XNDGL_ZT = '2' AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> xndResult = commonMapper.selectFieldsByOther(map1);
            if(xndResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_XNDGL");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", xndResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步学年度表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步学年度表数据错误！");
                    }
                }
            }

            //学期管理
            map1 = new HashMap<String, Object>();
            tableName = "SYS_XQGL T LEFT JOIN SYS_XNDGL XND ON XND.XNDGL_ID = T.XNDGL_ID";
            fieldName = "T.XQGL_ID,T.XNDGL_ID,T.XQGL_MC,T.XQGL_XQM,TO_CHAR(T.XQGL_KSSJ,'YYYY-MM-DD') AS XQGL_KSSJ,TO_CHAR(T.XQGL_JSSJ,'YYYY-MM-DD') AS XQGL_JSSJ,T.XQGL_SFDQXQ,T.XQGL_SFJS,T.CREATOR_ID,T.CREATOR_NAME,T.EDITOR_ID,T.EDITOR_NAME,T.BELONG_ORG_ID,XND.XNDGL_DM";
            if(time == null || "".equals(time)){
                tiaojian = "T.XQGL_SFJS = '1' AND T.XQGL_ZT = '2'";
            }else{
                tiaojian = "T.XQGL_SFJS = '1' AND T.XQGL_ZT = '2' AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> xqglResult = commonMapper.selectFieldsByOther(map1);
            if(xqglResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_XQGL");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", xqglResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步学期表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步学期表数据错误！");
                    }
                }
            }

            //届别管理
            map1 = new HashMap<String, Object>();
            tableName = "SYS_JBGL T LEFT JOIN SYS_XDGL XD ON XD.XDGL_ID = T.XDGL_ID LEFT JOIN SYS_XQGL XQ ON XQ.XQGL_ID = T.XQGL_ID";
            fieldName = "T.*,XD.XDGL_DM,XQ.XQGL_MC";
            if(time == null || "".equals(time)){
                tiaojian = "T.JBGL_SFJS = '1' AND T.JBGL_ZT = '2' AND XD.XDGL_DM IN ("+ org_xddm +")";
            }else{
                tiaojian = "T.JBGL_SFJS = '1' AND T.JBGL_ZT = '2' AND XD.XDGL_DM IN ("+ org_xddm +") AND T.EDITED_TIME > TO_DATE('"+ time +"','yyyymmddhh24miss')";
            }
            orderName = "";
            map1.put("fieldName",fieldName);
            map1.put("tablename", tableName);
            map1.put("tiaojian", tiaojian);
            map1.put("orderName", orderName);
            List<Map<String, Object>> jbglResult = commonMapper.selectFieldsByOther(map1);
            if(jbglResult.size() > 0){
                sjtbJson = new JSONObject();
                sjtbJson.put("dataType", "SYS_JBGL");
                sjtbJson.put("org_id", org_id);
                sjtbJson.put("data", jbglResult);
                result = ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
                if(result == null){
                    throw new Exception("同步届别表数据错误！");
                }else{
                    JSONObject jsonObject = JSONObject.parseObject(result);
                    if(!"200".equals(jsonObject.get("resultCode"))){
                        throw new Exception("同步届别表数据错误！");
                    }
                }
            }

            //设置当前学期周次
            sjtbJson = new JSONObject();
            sjtbJson.put("dataType", "XZGL_XQZC");
            sjtbJson.put("org_id", org_id);
            sjtbJson.put("data", null);
            ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");

        }

    }


    /**
     * 查询日志列表
     * lch
     * 2019-10-18
     * */
    public Map<String, Object> findBizLogOnPage(Map<String , Object> params)throws Exception{
        Integer total = sysMapper.findBizLogOnPageCount(params);
        int pageNo = Integer.parseInt(params.get("page").toString());
        int pageSize = Integer.parseInt(params.get("limit").toString());
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        List<Map<String, Object>> list = sysMapper.findBizLogOnPage(params);
        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }

    @Transactional(rollbackFor = Exception.class)
    public void tyqyUser(Map<String,Object> map)throws Exception{
        Map<String,Object> where = (Map<String, Object>) map.get("where");
        Map<String,Object> fild = (Map<String, Object>) map.get("fild");
        String id = where.get("id").toString();
        commonService.update(map);
        String type = fild.get("type").toString();
        String zt = fild.get("zt").toString();
        Map<String, Object> map2 = commonService.selectFieldsByOther("SYS_USEREXT", "*", "USER_ID='" + id + "'", null, null).get(0);
        String userext_code = map2.get("USEREXT_CODE").toString();
        String belong_org_id = map2.get("BELONG_ORG_ID").toString();
        if("3".equals(type)){
            //修改教职工
            String tablename = "XZGL_ZGXX@DBLINK_JXSC";
            Map<String,Object> map1 = new HashMap<>();
            map1.put("ZGXX_SFZHM", "'"+ userext_code +"'");
            map1.put("BELONG_ORG_ID", "'"+ belong_org_id +"'");
            Map<String,Object> map3 = new HashMap<>();
            map3.put("ZGXX_ZT", "'"+ zt +"'");
            Map<String,Object> map4 = new HashMap<>();
            map4.put("tablename", tablename);
            map4.put("keys", ContextHelper.getKey(map3));
            map4.put("params", map3);
            map4.put("keys2", ContextHelper.getKey(map1));
            map4.put("params2", map1);
            map4.put("tablename", tablename);
            commonMapper.update(map4);
        }else{
            //修改学生
            String tablename = "XZGL_XSXX@DBLINK_JXSC";
            Map<String,Object> map1 = new HashMap<>();
            map1.put("XSXX_XJH", "'"+ userext_code +"'");
            map1.put("BELONG_ORG_ID", "'"+ belong_org_id +"'");
            Map<String,Object> map3 = new HashMap<>();
            map3.put("XSXX_ZT", "'"+ zt +"'");
            Map<String,Object> map4 = new HashMap<>();
            map4.put("tablename", tablename);
            map4.put("keys", ContextHelper.getKey(map3));
            map4.put("params", map3);
            map4.put("keys2", ContextHelper.getKey(map1));
            map4.put("params2", map1);
            map4.put("tablename", tablename);
            commonMapper.update(map4);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public Boolean updateUser (Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String account = map.get("account").toString();
        String name = map.get("name").toString();
        String id = map.get("id").toString();
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
            Map<String, Object> map2 = commonService.selectFieldsByOther("SYS_USEREXT", "*", "USER_ID='" + id + "'", null, null).get(0);
            map1 = new HashMap<>();
            map1.put("YGDA_XM","'"+name+"'");
            userMap = new HashMap<>();
            userMap.put("tablename","PT_YGDA");
            userMap.put("keys",ContextHelper.getKey(map1));
            userMap.put("params",map1);
            map1 = new HashMap<>();
            map1.put("YGDA_SFZHM","'"+map2.get("USEREXT_CODE")+"'");
            userMap.put("keys2",ContextHelper.getKey(map1));
            userMap.put("params2",map1);
            if (commonMapper.update(userMap)){
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    }

    public List<Map<String,Object>> getInDeptUser(Map<String,Object> map) throws Exception {
        String tj = "and tab.BELONG_ORG_ID = '"+map.get("org_id")+"' AND tab.USER_ISADMIN = '1'";
        if (map.get("tj")!=null&&map.get("tj")!=""){
            Map<String, Object> yfbtj = (Map<String, Object>) map.get("tj");
            for (String key:yfbtj.keySet()){
                String t1 = "TAB."+key + " like '%"+yfbtj.get(key)+"%'";
                tj+=" and "+t1;
            }
        }
        String fieldName = "tab.user_id as \"user_id\", tab.user_name as \"user_name\", tab.user_account as \"user_account\"";
        String table="SYS_USER tab";
        String tianjiao = "EXISTS (select 1 from SYS_DUSER sr where tab.USER_ID = sr.USER_ID and sr.DEPT_ID = '"+ map.get("dept_id")+"')" + tj;
        String orderName = "tab.user_name asc";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, fieldName, tianjiao, orderName, null);
        return maps;
    }

    @Transactional(rollbackFor = Exception.class)
    public List<Map<String,Object>> getOutDeptUser(Map<String,Object> map) throws Exception {
        String tj = "and tab.BELONG_ORG_ID = '"+map.get("org_id")+"' AND tab.USER_ISADMIN = '1'";
        if (map.get("tj")!=null&&map.get("tj")!=""){
            Map<String, Object> yfbtj = (Map<String, Object>) map.get("tj");
            for (String key:yfbtj.keySet()){
                String t1 = "TAB."+key + " like '%"+yfbtj.get(key)+"%'";
                tj+=" and "+t1;
            }
        }
        String fieldName = "tab.user_id as \"user_id\", tab.user_name as \"user_name\", tab.user_account as \"user_account\"";
        String table="SYS_USER tab";
        String tianjiao = "not EXISTS (select 1 from SYS_DUSER sr where tab.USER_ID = sr.USER_ID and sr.DEPT_ID = '"+ map.get("dept_id")+"')" + tj;
        String orderName = "tab.user_name asc";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, fieldName, tianjiao, orderName, null);
        return maps;
    }

    @Transactional(rollbackFor = Exception.class)
    public Boolean delDetpUser(List<Map<String, Object>> paramsList)throws Exception{
        Boolean b=false;
        for(int i=0;i<paramsList.size();i++){
            b = sysMapper.delBbwhZzgx(paramsList.get(i));
        }
        return b;
    }

    /**
     * 通过账户查询用户信息
     * lch
     * 2019-11-30
     */
    public List<Map<String, Object>> selUserByUserAccount(Map<String, Object> map)throws Exception{
        return sysMapper.selUserByUserAccount(map);
    }

    /**
     * 修改用户密码
     * lch
     * 2019-11-30
     * */
    public void updatePassword(Map<String, Object> map)throws Exception{
        String tablename = "SYS_USER";
        Map<String, Object> map1 = new HashMap<>();
        map1.put("USER_PASSWORD", "'"+ map.get("password")+"'");
        Map<String, Object> map3 = new HashMap<>();
        map3.put("USER_ID", "'"+ map.get("user_id")+"'");
        Map<String, Object> map2 = new HashMap<>();
        map2.put("tablename", tablename);
        map2.put("keys", ContextHelper.getKey(map1));
        map2.put("params", map1);
        map2.put("keys2", ContextHelper.getKey(map3));
        map2.put("params2", map3);
        commonMapper.update(map2);
    }


    /**
     * 获取头像
     * @Author: 倪杨
     * @Date: 2019/12/5
     */
    public List<Map<String, Object>> getUserAvatar(Map<String,Object> map) throws Exception{

        List<Map<String, Object>> avatar = commonService.selectFieldsByOther("SYS_USEREXT", "USER_ID,USEREXT_CODE,TO_CHAR(USEREXT_FJSON) AVATAR", "USER_ID='" + map.get("user_id") + "'", null, null);
        System.out.println("impl:"+avatar);
        return avatar;
    }

    public Boolean updateUserAvatar(Map<String,Object> map) throws Exception{

        String tablename = "SYS_USEREXT";
        Map<String, Object> map1 = new HashMap<>();
        map1.put("USEREXT_FJSON", "'"+ map.get("avatar")+"'");
        Map<String, Object> map3 = new HashMap<>();
        map3.put("USER_ID", "'"+ map.get("user_id")+"'");
        Map<String, Object> map2 = new HashMap<>();
        map2.put("tablename", tablename);
        map2.put("keys", ContextHelper.getKey(map1));
        map2.put("params", map1);
        map2.put("keys2", ContextHelper.getKey(map3));
        map2.put("params2", map3);
        return commonMapper.update(map2);
    }

    /**
     * 加载自定义菜单
     * lch
     * 2020-02-12
     */
    public List<Map<String,Object>> loadZdycdTree(Map<String,Object> map)throws Exception{
        return sysMapper.loadZdycdTree(map);
    }

    /**
     * 自定义菜单唯一性查询判断
     * lch
     * 2020-02-12
     */
    public Map<String,Object> uniqueZdycd(Map<String,Object> map)throws Exception{
        Map<String,Object> resultMap = new HashMap<>();
        resultMap.put("resultCode","200");
        resultMap.put("resultMsg","");
        String id = "";
        if(map.containsKey("id")){
            id = "and ZDYCD_ID != '"+ map.get("id").toString() +"'";
        }
        String ssxm = map.get("ssxm").toString();
        String pid = map.get("pid").toString();
        String mc = map.get("mc").toString();
        String code = map.get("code").toString();
        String sxh = map.get("sxh").toString();

        String fieldName = "1";
        String tablename = "SYS_ZDYCD";
        //判断编码的唯一性
        String tiaojian = "ZDYCD_XM = '"+ ssxm +"' and ZDYCD_CODE = '"+code+"'";
        tiaojian += id;
        Map<String,Object> map2 = new HashMap<>();
        map2.put("fieldName", fieldName);
        map2.put("tablename", tablename);
        map2.put("tiaojian", tiaojian);
        List<Map<String, Object>> list = commonMapper.selectFieldsByOther(map2);
        if(list.size() > 0){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg","菜单编码已存在！");
        }else{
            //判断菜单名称的唯一性
            tiaojian = "ZDYCD_XM = '"+ ssxm +"' and ZDYCD_MC = '"+mc+"'";
            tiaojian += id;
            map2.put("tiaojian", tiaojian);
            list = commonMapper.selectFieldsByOther(map2);
            if(list.size() > 0){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","菜单名称已存在！");
            }else{
                //判断顺序号是否重复
                tiaojian = "ZDYCD_XM = '"+ ssxm +"' and ZDYCD_PID = '"+ pid +"' and ZDYCD_SXH = '"+sxh+"'";
                tiaojian += id;
                map2.put("tiaojian", tiaojian);
                list = commonMapper.selectFieldsByOther(map2);
                if(list.size() > 0){
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","顺序号已存在！");
                }
            }
        }
        return resultMap;
    }

    /**
     * 查询自定义菜单
     * lch
     * 2020-02-13
     * */
    public List<Map<String, Object>> findZdycd(Map<String, Object> map)throws Exception{
        return sysMapper.findZdycd(map);
    }

    /**
     * 查询已授权自定义菜单
     * @param map
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> findYsqzdycd(Map<String, Object> map) throws Exception {
        Map<String, Object> map2 = new HashMap<>();
        String fieldName = "ZDYCD_ID as \"id\"";
        String tablename = "SYS_ZDYCD_ORG";
        String tiaojian = "ORG_ID = '"+ map.get("org_id") +"' and PTBBWH_ID = '"+ map.get("bbwh_id") +"'";
        map2.put("fieldName", fieldName);
        map2.put("tablename", tablename);
        map2.put("tiaojian", tiaojian);
        List<Map<String, Object>> list = commonMapper.selectFieldsByOther(map2);
        return list;
    }

    /**
     * 自定义菜单授权
     * lch
     * 2019-08-16
     * */
    @Transactional(rollbackFor = Exception.class)
    public void zdycdGrant(Map<String,Object> map)throws Exception{
        System.out.println("addArray:"+map.get("addArray"));
        System.out.println("delArray:"+map.get("delArray"));

        String param = map.get("delArray").toString() ;
        String borg_id = map.get("org_id").toString() ;
        String bbwh_id = map.get("bbwh_id").toString() ;
        String[] params = map.get("addArray").toString().split(",");
        String[] keys = new String[]{"ZDYCD_ID","ORG_ID","PTBBWH_ID"} ;

        //删除
        if(param!=null && !param.equals("")){
            Map<String, Object> delmap=new HashMap<String, Object>();
            HashMap<String, Object> paramsMap = new HashMap<>();
            paramsMap.put("ZDYCD_ID",param);
            paramsMap.put("ORG_ID",borg_id);
            paramsMap.put("PTBBWH_ID",bbwh_id);

            delmap.put("tablename" , "SYS_ZDYCD_ORG");
            delmap.put("keys" , keys);
            delmap.put("params" , paramsMap);
            commonMapper.delete(delmap) ;

            //判断删除的菜单是否还在改组织授权当中,如果没有，删除该组织的自定义菜单
            String[] delIds = param.split(",");
            Map<String,Object> map2 = null;
            for(int i=0;i<delIds.length;i++){
                map2 = new HashMap<>();
                map2.put("org_id", borg_id);
                map2.put("zdycd_id", delIds[i]);
                sysMapper.delKjcdNotExistsorg(map2);
            }
        }

        //添加
        keys = new String[]{"ZDYCD_ID","ORG_ID","PTBBWH_ID"} ;
        map = new HashMap<>();
        for(int i=0;i<params.length;i++){
            if(params[i]==null || params[i].equals(""))
                continue;
            else{
                HashMap<String, Object> paramsMap = new HashMap<>();
                paramsMap.put("ZDYCD_ID","'"+params[i]+"'");
                paramsMap.put("ORG_ID","'"+borg_id+"'");
                paramsMap.put("PTBBWH_ID","'"+bbwh_id+"'");
                map.put("fieldName","1");
                map.put("tablename" , "SYS_ZDYCD_ORG");
                map.put("keys" , keys);
                map.put("params" , paramsMap);
                List<Map<String, Object>> result = commonMapper.find(map);
                if(result.size()==0){
                    Map<String, Object> addmap=new HashMap<String, Object>();
                    addmap.put("tablename" , "SYS_ZDYCD_ORG");
                    addmap.put("keys" , keys);
                    addmap.put("params" , paramsMap);
                    commonMapper.insert(addmap) ;
                }else if(result.size()>1){
                    throw new RuntimeException("查询数据不合法!") ;
                }
            }
        }
    }

    /**
     * 自定义快捷菜单列表 查询
     * lch
     * 2020-02-17
     * */
    public Map<String, Object> loadKjcdList(Map<String , Object> params)throws Exception{
        int pageNo = Integer.parseInt(params.get("page").toString());
        int pageSize = Integer.parseInt(params.get("limit").toString());
        Integer total = sysMapper.loadKjcdListCount(params);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        List<Map<String, Object>> list = sysMapper.loadKjcdList(params);
        Map<String , Object> map = null;
        List<Map<String, Object>> list2 = null;
        String ZDYCD_ID = "";
        String ZDYCD_MC = "";
        for(int i=0;i<list.size();i++){
            //通过组织和菜单类型查询菜单
            map = new HashMap<>();
            map.put("org_id", list.get(0).get("org_id"));
            map.put("ssxm", list.get(0).get("ssxm"));
            map.put("kjcd_type", list.get(0).get("kjcd_type"));
            list2 = sysMapper.selKjcdAll(map);
            ZDYCD_ID = "";
            ZDYCD_MC = "";
            for(int j=0;j<list2.size();j++){
                if(j < list2.size() - 1){
                    ZDYCD_ID += list2.get(j).get("ZDYCD_ID").toString()+",";
                    ZDYCD_MC += list2.get(j).get("ZDYCD_MC").toString()+",";
                }else{
                    ZDYCD_ID += list2.get(j).get("ZDYCD_ID").toString();
                    ZDYCD_MC += list2.get(j).get("ZDYCD_MC").toString();
                }
            }
            list.get(i).put("zdycd_id", ZDYCD_ID);
            list.get(i).put("zdycd_mc", ZDYCD_MC);
        }

        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }

    /**
     * 自定义快捷菜单 设置
     * lch
     * 2020-02-17
     * */
    @Transactional(rollbackFor = Exception.class)
    public void setZdykjcd(Map<String , Object> params)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) params.get("ASD");
        Map<String, Object> insert = (Map<String, Object>) params.get("insert");
        String org_id = asdMap.get("org_id").toString();
        String zdycd_ids = insert.get("zdycd_id").toString();
        String ssxm = insert.get("ssxm").toString();
        String type = insert.get("type").toString();
        String[] arr = zdycd_ids.split(",");

        //查询已有的菜单
        String fieldName = "KJCD_ID,ZDYCD_ID,ZDYCD_XM,KJCD_TYPE";
        String tablename = "SYS_ZDYCD_KJCD";
        String tiaojian = "ZDYCD_XM = '"+ ssxm +"' AND KJCD_TYPE = '"+ type +"' AND BELONG_ORG_ID = '"+ org_id +"'";
        Map<String , Object> map = new HashMap<>();
        map.put("fieldName", fieldName);
        map.put("tablename", tablename);
        map.put("tiaojian", tiaojian);
        List<Map<String, Object>> list = commonMapper.selectFieldsByOther(map);
        Map<String, String> map2 = new HashMap<String, String>();
        //删除不存在数组中的菜单
        Map<String , Object> mapd = null;
        Map<String , Object> mapd2 = null;
        for(int j=0;j<list.size();j++){
            if((","+zdycd_ids+",").indexOf((","+list.get(j).get("ZDYCD_ID")+",")) == -1){
                mapd = new HashMap<>();
                mapd2 = new HashMap<>();
                mapd2.put("KJCD_ID", "'"+ list.get(j).get("KJCD_ID") +"'");
                mapd.put("tablename", tablename);
                mapd.put("keys", ContextHelper.getKey(mapd2));
                mapd.put("params", mapd2);
                commonMapper.delete(mapd);
            }else{
                map.put(list.get(j).get("ZDYCD_ID").toString(), "1");
            }
        }
        String seq="seq_"+org_id;
        //添加不在集合中的菜单
        for (int i = 0; i < arr.length; i++) {
            if(map.get(arr[i]) == null){
                mapd = new HashMap<>();
                mapd2 = new HashMap<>();
                mapd2.put("KJCD_ID", "'"+ CommonController.getSEQ(seq) +"'");
                mapd2.put("ZDYCD_ID", "'"+ arr[i] +"'");
                mapd2.put("ZDYCD_XM", "'"+ ssxm +"'");
                mapd2.put("KJCD_TYPE", "'"+ type +"'");
                mapd2.putAll(CommonController.getCreat(asdMap));
                mapd.put("tablename", tablename);
                mapd.put("keys", ContextHelper.getKey(mapd2));
                mapd.put("params", mapd2);
                commonMapper.insert(mapd);
            }
        }

    }

    /**
     * 查询组织菜单
     * lch
     * 2020-02-17
     * */
    public Map<String, Object> selOrgCdList(Map<String , Object> params)throws Exception{
        String fieldName = "TAB.ZDYCD_ID,TAB.ORG_ID,TAB.PTBBWH_ID,SC.ZDYCD_MC";
        String tablename = "SYS_ZDYCD_ORG TAB LEFT JOIN SYS_ZDYCD SC ON SC.ZDYCD_ID = TAB.ZDYCD_ID";
        String tiaojian = "NOT EXISTS (SELECT 1 FROM SYS_ZDYCD CD WHERE CD.ZDYCD_PID = TAB.ZDYCD_ID) AND TAB.ORG_ID = '"+ params.get("org_id")+"'";
        Map<String , Object> map = new HashMap<>();
        map.put("fieldName", fieldName);
        map.put("tablename", tablename);
        map.put("tiaojian", tiaojian);
        List<Map<String, Object>> list = commonMapper.selectFieldsByOther(map);

        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", list.size());
        resultmap.put("list", list);
        return  resultmap;
    }

    /**
     * 快捷菜单 查询
     * lch
     * 2020-02-17
     * */
    public List<Map<String, Object>> selKjcdAll(Map<String, Object> map)throws Exception{
        return sysMapper.selKjcdAll(map);
    }

}
