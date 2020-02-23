package com.beoneess.common.service.impl;

import java.util.*;

import com.beoneess.common.controller.CommonController;
import com.beoneess.common.controller.ContextHelper;
import com.beoneess.common.mapper.CommonMapper;
import com.beoneess.common.service.CommonService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 通用业务实现类
 * 罗飞   罗超豪     倪杨
 */
@Service
public class CommonServiceImpl implements CommonService {
    @Autowired
    CommonMapper commonMapper;

    /**
     * 列表查询
     * @param params 参数
     * @date 2019-08-07
     * */
    public List<Map<String, Object>> find(Map<String , Object> params)throws Exception{

        //获取判断表名是否合法
        String tableName = ContextHelper.tableMap.get(params.get("tableName").toString()).toString();
        if(tableName==null || tableName.equals("")){
            throw new RuntimeException("表名不合法，请检查！");
        }

        //获取判断表字段是否合法
        String fildName = "";
        if (!params.containsKey("fildName") || params.get("fildName") == null){
            fildName = ContextHelper.getTableAllFild(tableName);
        }else {
            fildName = ContextHelper.getChangeFild(tableName, params.get("fildName").toString());
        }
        if(fildName==null || fildName.equals("")){
            throw new RuntimeException("表字段不合法，请检查！");
        }

        //获取判断条件字段是否合法
        HashMap<String, Object> map1 = new HashMap<>();
        if(params.containsKey("where") && params.get("where") != null){

            Map<String,Object> where = (Map<String,Object>) params.get("where");
            for(String key:where.keySet()){
                String fKey = ContextHelper.getFild(tableName,key) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("条件参数不合法，请检查！");
                }
                map1.put(fKey,"'"+where.get(key)+"'");
            }
        }

        //获取判断分组、排序是否合法
        String groupName ="";
        String orderName ="";
        if(params.containsKey("other") && params.get("other") != null){
            Map<String,Object> other = (Map<String,Object>)params.get("other");

            //分组检查判断
            if(other.containsKey("group") && other.get("group") != null && !other.get("group").equals("")){
                //分组参数格式是个字符串 如："ID,PID,CODE" ;
                String groups[] = other.get("group").toString().split(",");
                for (int i=0;i<groups.length;i++){
                    groupName+= (ContextHelper.getFild(tableName,groups[i])+",");
                }
                if(groupName==null || groupName.equals("")){
                    throw new RuntimeException("获取分组参数不合法，请检查！");
                }
                groupName =groupName.substring(0,groupName.length()-1);
            }

            //排序检查判断
            if(other.containsKey("order") && other.get("order") != null){
                //排序参数是个json 如 {'ID':'ASC','PID':'DESC'}
                Map<String,Object> orders = (Map<String, Object>) other.get("order");
                for(String key:orders.keySet()){
                    String fKey = ContextHelper.getFild(tableName,key) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("排序参数不合法，请检查！");
                    }
                    if(orders.get(key)==null || orders.get(key).equals("") || (!orders.get(key).equals("ASC")
                            && !orders.get(key).equals("DESC") && !orders.get(key).equals("asc") && !orders.get(key).equals("desc")) ){
                        throw new RuntimeException("排序参数不合法，请检查！");
                    }
                    orderName+= fKey + " " + orders.get(key) + "," ;
                }

                if(orderName==null || orderName.equals(""))
                    throw new RuntimeException("排序参数不合法，请检查！");
                orderName =orderName.substring(0,orderName.length()-1);
            }
        }

        //数据封装处理
        Map<String, Object> map = new HashMap<String, Object>();
        String[] keys = null;
        if(map1 != null){
            keys = new String[map1.size()];		//查询字段名数组
            Set<String> sset = map1.keySet();	//获取字段名
            int i = 0;
            for (String os : sset) {
                keys[i++] = os;
            }
        }
        map.put("fieldName",fildName);
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("params" , map1);
        map.put("groupName", groupName);
        map.put("orderName", orderName);

        List<Map<String, Object>> result = commonMapper.find(map);
        return result;
    }

    /**
     * 分页查询
     * @param params 参数
     * @date 2019-08-07
     * */
    public Map<String, Object> findOnPage(Map<String , Object> params)throws Exception{

        //获取判断表名是否合法
        String tableName = ContextHelper.tableMap.get(params.get("tableName").toString()).toString();
        if(tableName==null || tableName.equals("")){
            throw new RuntimeException("表名不合法，请检查！");
        }

        //获取判断表字段是否合法
        String fildName = "";
        if (!params.containsKey("fildName") || params.get("fildName") == null){
            fildName = ContextHelper.getTableAllFild(tableName);
        }else {
            fildName = ContextHelper.getChangeFild(tableName, params.get("fildName").toString());
        }
        if(fildName==null || fildName.equals("")){
            throw new RuntimeException("表字段不合法，请检查！");
        }

        //获取判断条件字段是否合法
        HashMap<String, Object> map1 = new HashMap<>();
        if(params.containsKey("where") && params.get("where") != null){

            Map<String,Object> where = (Map<String,Object>) params.get("where");
            for(String key:where.keySet()){
                String fKey = ContextHelper.getFild(tableName,key) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("条件参数不合法，请检查！:"+key);
                }
                map1.put(fKey,"'"+where.get(key)+"'");
            }
        }
        HashMap<String, Object> map2 = new HashMap<>();
        if(params.containsKey("wherelike") && params.get("wherelike") != null){
            Map<String,Object> wherelike = (Map<String,Object>) params.get("wherelike");
            for(String key:wherelike.keySet()){
                String fKey = ContextHelper.getFild(tableName,key) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("条件参数不合法，请检查！");
                }
                map2.put(fKey,"'"+wherelike.get(key)+"'");
            }
        }

        //获取判断分组、排序是否合法
        String groupName ="";
        String orderName ="";
        if(params.containsKey("other") && params.get("other") != null){
            Map<String,Object> other = (Map<String,Object>)params.get("other");

            //分组检查判断
            if(other.containsKey("group") && other.get("group") != null){
                //分组参数格式是个字符串 如："ID,PID,CODE" ;
                String groups[] = other.get("group").toString().split(",");
                for (int i=0;i<groups.length;i++){
                    groupName+= (ContextHelper.getFild(tableName,groups[i])+",");
                }
                if(groupName==null || groupName.equals("")){
                    throw new RuntimeException("获取分组参数不合法，请检查！");
                }
                groupName =groupName.substring(0,groupName.length()-1);
            }

            //排序检查判断
            if(other.containsKey("order") && other.get("order") != null){
                //排序参数是个json 如 {'ID':'ASC','PID':'DESC'}
                Map<String,Object> orders = (Map<String, Object>) other.get("order");
                for(String key:orders.keySet()){
                    String fKey = ContextHelper.getFild(tableName,key) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("排序参数不合法，请检查！");
                    }
                    if(orders.get(key)==null || orders.get(key).equals("") || (!orders.get(key).equals("ASC")
                            && !orders.get(key).equals("DESC") && !orders.get(key).equals("asc") && !orders.get(key).equals("desc")) ){
                        throw new RuntimeException("排序参数不合法，请检查！");
                    }
                    orderName+= fKey + " " + orders.get(key) + "," ;
                }

                if(orderName==null || orderName.equals(""))
                    throw new RuntimeException("排序参数不合法，请检查！");
                orderName =orderName.substring(0,orderName.length()-1);
            }
        }

        //封装数据
        Map<String, Object> map = new HashMap<String, Object>();
        String[] keys = ContextHelper.getKey(map1);
        String[] keys2 = ContextHelper.getKey(map2);
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("params" , map1);
        map.put("keys2" , keys2);
        map.put("params2" , map2);

        Integer total = commonMapper.findOnPageCount(map);

        int pageNo = Integer.parseInt(params.get("page").toString());
        int pageSize = Integer.parseInt(params.get("limit").toString());

        map.put("fieldName",fildName);
        map.put("pageNo", pageNo);
        map.put("pageSize", pageSize);
        map.put("groupName", groupName);
        map.put("orderName", orderName);
        List<Map<String, Object>> list = commonMapper.findOnPage(map);

        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }

    /**
     * 添加
     * @param params 参数
     * @date 2019-08-07
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean insert(Map<String, Object> params)throws Exception {
        //获取判断表名是否合法
        String tableName = ContextHelper.tableMap.get(params.get("tableName").toString()).toString();
        if(tableName==null || tableName.equals("")){
            throw new RuntimeException("表名不合法，请检查！");
        }
        String clobStr = null ;
        if (ContextHelper.clobMap.get(tableName)!=null){
            clobStr = ContextHelper.clobMap.get(tableName).toString();
        }
        HashMap<String, Object> map1 = new HashMap<>();
        //判断添加参数是否合法
        if(params.containsKey("insert") && params.get("insert") != null){
            Map<String,Object> insert = (Map<String,Object>) params.get("insert");
            //存放公共参数值 CREATOR_ID CREATOR_NAME等
            map1.putAll(CommonController.getCreat((Map<String,Object>) params.get("ASD")));

            //循环存放、验证添加参数
            for(String key:insert.keySet()){
                if (key.startsWith("date")){
                    String fKey = ContextHelper.getFild(tableName,key.substring(4)) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("添加参数不合法，请检查！"+fKey);
                    }
                    if (insert.get(key).equals("sysdate")){
                        map1.put(fKey,"sysdate");
                    }else{
                        map1.put(fKey,"to_date('"+insert.get(key)+"','yyyy-MM-dd')");
                    }
                }else if (key.startsWith("time")){
                    String fKey = ContextHelper.getFild(tableName,key.substring(4)) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("添加参数不合法，请检查！"+fKey);
                    }
                    if (insert.get(key).equals("sysdate")){
                        map1.put(fKey,"sysdate");
                    }else{
                        map1.put(fKey,"to_date('"+insert.get(key)+"','yyyy-mm-dd hh24:mi:ss')");
                    }
                }else {
                    String fKey = ContextHelper.getFild(tableName,key) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("添加参数不合法，请检查！"+key);
                    }
                    if (clobStr!=null && fKey.indexOf(clobStr)>-1){
                        map1.put(fKey,insert.get(key));
                    }else{
                        map1.put(fKey,"'"+insert.get(key)+"'");
                    }
                }
            }

            //判断是调公共序列还是组织序列  不传或传空为公共序列
            if (params.get("seqKZ")==null||params.get("seqKZ")==""){
                map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ("seq_0")+"'");
            }else if (params.get("seqKZ").toString().startsWith("special")){
                String seq="seq_"+params.get("seqKZ").toString().substring(7);
                map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ(seq)+"'");
            }else {
                String seq="seq_"+((Map<String, Object>) params.get("ASD")).get("org_id").toString();
                map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ(seq)+"'");
            }
        }else{
            throw new RuntimeException("添加参数缺失，请检查！");
        }

        //数据封装
        String[] keys = ContextHelper.getKey(map1);
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("clobArr",clobStr);
        map.put("params" , map1);
        if(commonMapper.insert(map)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 修改
     * @param params 参数
     * @date 2019-08-07
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean update(Map<String, Object> params)throws Exception {
        //获取判断表名是否合法
        String tableName = ContextHelper.tableMap.get(params.get("tableName").toString()).toString();
        if(tableName==null || tableName.equals("")){
            throw new RuntimeException("表名不合法，请检查！");
        }
        String clobStr = null;
        if (ContextHelper.clobMap.get(tableName)!=null){
            clobStr = ContextHelper.clobMap.get(tableName).toString();
        }

        HashMap<String, Object> map1 = new HashMap<>();
        //判断修改条件是否合法
        if(params.containsKey("where") && params.get("where") != null){
            Map<String,Object> where = (Map<String,Object>)params.get("where");
            for(String key:where.keySet()){
                String fKey = ContextHelper.getFild(tableName,key) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("修改条件参数不合法，请检查！");
                }
                map1.put(fKey,"'"+where.get(key)+"'");
            }
        }else{
            //注意必须要带修改条件 避免全表修改 确实不需要的可以写成 1=1 之类
            throw new RuntimeException("修改条件缺失，请检查！");
        }


        HashMap<String, Object> map2 = new HashMap<>();
        //判断修改条件是否合法
        if(params.containsKey("fild") && params.get("fild") != null){
            Map<String,Object> fild = (Map<String,Object>)params.get("fild");
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
                }else if (key.startsWith("time")){
                    String fKey = ContextHelper.getFild(tableName,key.substring(4)) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("添加参数不合法，请检查！");
                    }
                    if (fild.get(key).equals("sysdate")){
                        map2.put(fKey,"sysdate");
                    }else {
                        map2.put(fKey,"to_date('"+fild.get(key)+"','yyyy-mm-dd hh24:mi:ss')");
                    }
                }else {
                    String fKey = ContextHelper.getFild(tableName,key) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("添加参数不合法，请检查！");
                    }
                    if (clobStr!=null && fKey.indexOf(clobStr)>-1){
                        map2.put(fKey,fild.get(key));
                    }else{
                        map2.put(fKey,"'"+fild.get(key)+"'");
                    }
                }
            }
            map2.putAll(CommonController.getUpdate((Map<String,Object>) params.get("ASD")));
        }else{
            throw new RuntimeException("修改参数缺失，请检查！");
        }


        //封装参数
        Map<String, Object> map=new HashMap<String, Object>();
        String[] keys = ContextHelper.getKey(map2);
        String[] keys2 = ContextHelper.getKey(map1);
        map.put("tablename", tableName);	//表名
        map.put("keys", keys);				//修改字段名
        map.put("params", map2);			//修改字段

        map.put("keys2", keys2);			//条件字段名
        map.put("params2", map1);		//条件字段

        map.put("clobArr",clobStr);
        if(commonMapper.update(map)){
            return true;
        }else{
            return false;
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean updateRule(String tableName,Map<String, Object> map1,Map<String, Object> map2)throws Exception {
        //封装参数
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("tablename", tableName);	//表名
        map.put("keys", ContextHelper.getKey(map2));				//修改字段名
        map.put("params", map2);			//修改字段
        map.put("keys2", ContextHelper.getKey(map1));			//条件字段名
        map.put("params2", map1);		//条件字段
        if(commonMapper.update(map)){
            return true;
        }else{
            return false;
        }

    }

    /**
     * 删除
     * @param params 参数
     * @date 2019-08-07
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean delete(Map<String, Object> params)throws Exception {
        String tableName = ContextHelper.tableMap.get(params.get("tableName").toString()).toString();

        HashMap<String, Object> map1 = new HashMap<>();
        Map<String,Object> delete = (Map<String,Object>)params.get("delete");
        for(String key:delete.keySet()){
            map1.put(ContextHelper.getFild(tableName,key),"'"+delete.get(key)+"'");
        }

        String[] keys = ContextHelper.getKey(map1);
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("params" , map1);

        if(commonMapper.delete(map)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 获取序列
     * @date 2019-08-07
     */
    public String getNextId(Map<String, Object> map)throws Exception{
        return commonMapper.getNextId(map);
    }

    /**
     * 特殊查询
     */
    @Override
    public List<Map<String, Object>> selectFieldsByOther(String tableName, String fieldName, String tiaojian, String orderName,String groupName)throws Exception {
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("fieldName",fieldName);
        map.put("tablename" , tableName);
        map.put("tiaojian", tiaojian);
        map.put("orderName", orderName);
        map.put("groupName", groupName);
        List<Map<String, Object>> result = null;
        result = commonMapper.selectFieldsByOther(map);
        return result;
    }

    /**
     * 通用查找单条数据
     */
    @Override
    public Map<String, Object> getDataByKeys(String tableName, Map<String, Object> params) throws Exception{
        String[] keys = new String[params.size()];		//修改字段名数组
        Set<String> sset = params.keySet();				//获取字段名
        int i = 0;
        for (String os : sset) {
            keys[i++] = os;
        }
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("params" , params);

        Map<String, Object> result = null;
        result = commonMapper.getByKeys(map);
        return result;
    }

    /**
     * 添加多条数据
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean addAllData(String tableName, List<Map<String, Object>> paramsList) {
        String[] keys = new String[paramsList.get(0).size()];	//字段名
        Set<String> sset = paramsList.get(0).keySet();
        int i = 0;
        for(String os : sset){
            keys[i++] = os;
        }
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("paramsList" , paramsList);
        if(commonMapper.addAll(map)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 调用函数获取内容
     * lch
     * 2019-09-09
     * */
    public String selContent(Map<String, Object> map)throws Exception{
        return  commonMapper.selContent(map);
    }



//    /**
//     * 通用查询多条数据
//     */
//    @Override
//    public List<Map<String, Object>> getAllDataByKeys(String tableName,
//                                                      Map<String, Object> params,String orderName) {
//        Map<String, Object> map=new HashMap<String, Object>();
//        String[] keys = null;
//        if(params!=null){
//            keys = new String[params.size()];		//查询字段名数组
//            Set<String> sset = params.keySet();				//获取字段名
//            int i = 0;
//            for (String os : sset) {
//                keys[i++] = os;
//            }
//        }
//        map.put("tablename" , tableName);
//        map.put("keys" , keys);
//        map.put("params" , params);
//        map.put("orderName", orderName);
//
//        List<Map<String, Object>> result = null;
//        result = commonMapper.getAllByKeys(map);
//        return result;
//    }
//
//    /**
//     * 多表查询
//     */
//    @Override
//    public List<Map<String, Object>> selectAllDataByKeys(String tableName,
//                                                         Map<String, Object> params, String orderName) {
//        Map<String, Object> map=new HashMap<String, Object>();
//        String[] keys = null;
//        if(params!=null){
//            keys = new String[params.size()];		//查询字段名数组
//            Set<String> sset = params.keySet();				//获取字段名
//            int i = 0;
//            for (String os : sset) {
//                keys[i++] = os;
//            }
//        }
//        map.put("tablename" , tableName);
//        map.put("keys" , keys);
//        map.put("params" , params);
//        map.put("orderName", orderName);
//
//        List<Map<String, Object>> result = null;
//        result = commonMapper.selectAllByKeys(map);
//        return result;
//    }
//
//    /**
//     * 调用存储过程
//     */
//    @Override
//    public void cellProcedure(String name, String params) {
//        Map<String, Object> map=new HashMap<String, Object>();
//
//        map.put("Name",name);
//        map.put("Params" , params);
//        commonMapper.cellProcedure(map);
//    }

//    @Override
//    public boolean addDataSelect(String tableName,String keys, String params) {
//
//        Map<String, Object> map=new HashMap<String, Object>();
//        map.put("tablename" , tableName);
//        map.put("keys" , keys);
//        map.put("params" , params);
//        if(commonMapper.addandSelect(map)){
//            return true;
//        }else{
//            return false;
//        }
//    }
//    @Override
//    public boolean deleteDatabyOther(String tableName, String tiaojian) {
//        Map<String, Object> map=new HashMap<String, Object>();
//        map.put("tablename" , tableName);
//        map.put("tiaojian", tiaojian);
//        if(commonMapper.deletebyOther(map)){
//            return true;
//        }else{
//            return false;
//        }
//    }
//
//    public boolean  UpdateOther(String tableName) {
//        Map<String, Object> map=new HashMap<String, Object>();
//        map.put("tablename" , tableName);
//        if(commonMapper.updateOther(map)){
//            return true;
//        }else{
//            return false;
//        }
//    }
}

