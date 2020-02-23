package com.beoneess.business.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.beoneess.business.mapper.PtMapper;
import com.beoneess.business.service.PtService;
import com.beoneess.common.controller.CommonController;
import com.beoneess.common.controller.ContextHelper;
import com.beoneess.common.mapper.CommonMapper;
import com.beoneess.common.service.impl.CommonServiceImpl;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.*;

import static com.beoneess.common.controller.LoginController.inside_jxsc;

/**
 * 平台管理业务层实现
 */
@Service
public class PtServiceImpl implements PtService {

    @Autowired
    CommonMapper commonMapper;
    @Autowired
    private CommonServiceImpl commonService;
    @Autowired
    PtMapper ptMapper;

    /**
     * 插入组织机构
     * 倪杨
     * 2019-09-04
     * */
    @Transactional(rollbackFor = Exception.class)
    public boolean insertOrg(Map<String, Object> params)throws Exception {
        //获取判断表名是否合法
        String tableName = ContextHelper.tableMap.get(params.get("tableName").toString()).toString();
        if(tableName==null || tableName.equals("")){
            throw new RuntimeException("表名不合法，请检查！");
        }

        HashMap<String, Object> map1 = new HashMap<>();
        //判断添加参数是否合法
        if(params.containsKey("insert") && params.get("insert") != null){
            Map<String,Object> insert = (Map<String,Object>) params.get("insert");
            //存放公共参数值 CREATOR_ID CREATOR_NAME等
            if (params.get("ASD")!=null){
                map1.putAll(CommonController.getCreat((Map<String,Object>) params.get("ASD")));
            }

            //循环存放、验证添加参数
            for(String key:insert.keySet()){
                if (key.startsWith("date")){
                    String fKey = ContextHelper.getFild(tableName,key.substring(4)) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("添加参数不合法，请检查！");
                    }
                    map1.put(fKey,"to_date('"+insert.get(key)+"','yyyy-MM-dd')");
                }else {
                    String fKey = ContextHelper.getFild(tableName,key) ;
                    System.out.println(key+":"+fKey);
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("添加参数不合法，请检查！");
                    }
                    map1.put(fKey,"'"+insert.get(key)+"'");
                }
            }
            //判断是调公共序列还是组织序列  不传或传空为公共序列
            if (params.get("seqKZ")==null||params.get("seqKZ")==""){
                map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ("seq_0")+"'");
            }else{
                String seq="seq_"+((Map<String, Object>) params.get("ASD")).get("org_id").toString();
                map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ(seq)+"'");
            }
        }else{
            throw new RuntimeException("添加参数缺失，请检查！");
        }

        String orgSeq = map1.get(ContextHelper.getFild(tableName,params.get("id").toString())).toString();
        orgSeq=orgSeq.substring(1,orgSeq.length()-1);
        if (orgSeq.length()==0||orgSeq.length()>9){
            throw new RuntimeException("序列号长度异常，请检查!");
        }
        String orgSeq1=orgSeq+"1";
        String min = orgSeq1+String.format("%1$0"+(10-orgSeq1.length())+"d",0)+"000000000000000000";
        String max = orgSeq1+String.format("%1$0"+(10-orgSeq1.length())+"d",0)+"999999999999999999";

        map1.put("ORG_MIN","'"+min+"'");
        map1.put("ORG_MAX","'"+max+"'");
        map1.put("ORG_BJZT","'"+3+"'");
        map1.put("BELONG_ORG_ID","'"+orgSeq+"'");



        //数据封装
        String[] keys = new String[map1.size()];	//字段名
        Set<String> sset = map1.keySet();
        int i = 0;
        for(String os : sset){
            keys[i++] = os;
        }
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("params" , map1);
        if(commonMapper.insert(map)){
            HashMap<String, Object> map12 = new HashMap<>();
            map12.put("name","'SEQ_"+orgSeq+"'");
            map12.put("min","'"+min+"'");
            map12.put("max","'"+max+"'");

            System.out.println("插入序列："+ptMapper.insertSeq(map12));
            return true;
        }else{
            return false;
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean insertOrgKTJL(Map<String, Object> map1,String tableName)throws Exception {
        String[] keys = new String[map1.size()];	//字段名
        Set<String> sset = map1.keySet();
        int i = 0;
        for(String os : sset){
            keys[i++] = os;
        }
        HashMap<String, Object> map = new HashMap<>();
        map.put("tablename",tableName);
        map.put("keys" , keys);
        map.put("params" , map1);
        if(commonMapper.insert(map)){
            return true;
        }else {
            return false;
        }

    }

    /**
     * 查询广告位内容
     * lch
     * 2019-09-24
     * */
    public Map<String,Object> selGgnr(Map<String,Object> params)throws Exception{
        String xxwz = params.get("xxwz").toString();
        String code = params.get("code").toString();
        String xmlx = params.get("xmlx").toString();
        String path = params.get("path").toString();

        Map<String,Object> resultMap = new HashMap<>();
        String fildName = "*";
        String tableName = "PT_ORG";
        Map<String,Object> map1 = new HashMap<>();
        map1.put("ORG_DLWZ", "'"+xxwz+"'");
        String[] keys = ContextHelper.getKey(map1);
        //数据封装处理
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("fieldName",fildName);
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("params" , map1);
        List<Map<String, Object>> result = commonMapper.find(map);
        String org_id = "";
        String bslx = "";
        String org_zt = "";
        String org_type = "";
        String GGNR_FJ = "";
        String bspt = "";
        String org_name = "";

        if(result != null && result.size() > 0){
            org_id = result.get(0).get("ORG_ID").toString();
            bslx = result.get(0).get("ORG_BSLX").toString();
            org_zt = result.get(0).get("ORG_ZT").toString();
            org_type = result.get(0).get("ORG_TYPE").toString();
            org_name = result.get(0).get("ORG_NAME").toString();
            if(result.get(0).containsKey("ORG_BSPT") && result.get(0).get("ORG_BSPT") != null){
                bspt = result.get(0).get("ORG_BSPT").toString();
            }

            String tiaojian = "";
            if(!xmlx.equals("bcca")){
                tiaojian = "TAB.GGNR_BTIME <= SYSDATE AND SYSDATE < TAB.GGNR_ETIME + 1" +
                        " AND GGW.GGW_CODE = '"+ code +"' AND TAB.GGNR_ZT = '2' AND GGW.GGW_ZT = '2' AND TAB.BELONG_ORG_ID = 1";
                if(!"".equals(org_id)){
                    tiaojian = "TAB.GGNR_BTIME <= SYSDATE AND SYSDATE < TAB.GGNR_ETIME + 1" +
                            " AND GGW.GGW_CODE = '"+ code +"' AND TAB.GGNR_ZT = '2' AND GGW.GGW_ZT = '2' AND (TAB.BELONG_ORG_ID = 1 OR TAB.BELONG_ORG_ID = "+ org_id +")";
                }
                map = new HashMap<String, Object>();
                map.put("fieldName","TO_CHAR(TAB.GGNR_FJ) AS GGNR_FJ");
                map.put("tablename", "PT_GGNR TAB LEFT JOIN PT_GGW GGW ON GGW.GGW_ID = TAB.GGW_ID");
                map.put("tiaojian", tiaojian);
                map.put("orderName", "TO_NUMBER(TAB.BELONG_ORG_ID) DESC");
                List<Map<String, Object>> result2 = commonMapper.selectFieldsByOther(map);

                if(result2 != null && result2.size() > 0 && result2.get(0).get("GGNR_FJ")!=null && !result2.get(0).get("GGNR_FJ").equals("")){
                    GGNR_FJ = result2.get(0).get("GGNR_FJ").toString();
                }
            }

//            if("2".equals(bslx)){
//                //同步用户管理员

//                map = new HashMap<String, Object>();
//                String tablename = "SYS_USER TAB";
//                String fieldName = "TAB.USER_ID,TAB.USER_NAME,TAB.USER_ACCOUNT,TAB.USER_PASSWORD,TAB.USER_TYPE,TAB.USER_ZT,TAB.USER_ISADMIN,TAB.ATTR_1,TAB.ATTR_2,TAB.ATTR_3,TO_CHAR(TAB.ATTR_4) AS ATTR_4,TAB.CREATOR_ID,TAB.CREATOR_NAME,TAB.CREATED_TIME,TAB.EDITOR_ID,TAB.EDITOR_NAME,TAB.EDITED_TIME,TAB.BELONG_ORG_ID";
//                tiaojian = "TAB.USER_ISADMIN = 2 AND TAB.BELONG_ORG_ID = '"+ org_id +"'";
//                map.put("fieldName",fieldName);
//                map.put("tablename", tablename);
//                map.put("tiaojian", tiaojian);
//                List<Map<String, Object>> result3 = commonMapper.selectFieldsByOther(map);
//                String sjjsUrl = "sys/dataRecept";
//                JSONObject sjtbJson = new JSONObject();
//                sjtbJson.put("dataType", "SYS_USER");
//                sjtbJson.put("org_id", org_id);
//                sjtbJson.put("data", result3);
//                ContextHelper.client_bcca(path+sjjsUrl, sjtbJson, "");
               resultMap.put("bspt", bspt);
//            }
        }

        resultMap.put("ggnr_fj", GGNR_FJ);
        resultMap.put("org_id", org_id);
        resultMap.put("org_name", org_name);
        resultMap.put("org_zt", org_zt);
        resultMap.put("org_type", org_type);
        resultMap.put("bslx", bslx);
        return  resultMap;
    }

    /**
     * 组织注册审核
     * lch
     * 2019-10-18
     * */
    @Transactional(rollbackFor = Exception.class)
    public void auditOrg(Map<String,Object> params)throws Exception{
        Map<String, Object> asdMap = (Map<String, Object>) params.get("ASD");
        Map<String, Object> fildMap = (Map<String, Object>) params.get("fild");
        Map<String, Object> whereMap = (Map<String, Object>) params.get("where");
        String SBKT = fildMap.get("SBKT").toString();
        String BSLX = fildMap.get("BSLX").toString();
        String ID = whereMap.get("ID").toString();
        Map<String,Object> map1 = new HashMap<>();
        map1.put("ORG_SBKT", "'"+ SBKT +"'");
        if("4".equals(SBKT)){
            String BSPT = fildMap.get("BSPT").toString();
            map1.put("ORG_BSPT", "'"+ BSPT +"'");
            map1.put("ORG_ZT", "'"+ 2 +"'");
        }else{
            map1.put("ORG_ZT", "'"+ 1 +"'");
        }
        map1.put("EDITED_TIME", "sysdate");
        map1.put("EDITOR_ID", "'"+ asdMap.get("user_id")+"'");
        map1.put("EDITOR_NAME", "'"+ asdMap.get("user_name")+"'");
        String[] keys = ContextHelper.getKey(map1);
        Map<String,Object> map2 = new HashMap<String, Object>();
        map2.put("tablename" , "PT_ORG");
        map2.put("keys" , keys);
        map2.put("params" , map1);
        Map<String,Object> map3 = new HashMap<>();
        map3.put("ORG_ID", "'"+ ID +"'");
        String[] keys2 = ContextHelper.getKey(map3);	//条件字段名数组
        map2.put("keys2", keys2);	//条件字段名
        map2.put("params2", map3);		//条件字段
        commonMapper.update(map2);

        //写入 组织开通、停用历史表
        if("4".equals(SBKT)){
            map1 = new HashMap<>();
            String seq="seq_"+ asdMap.get("org_id");
            map1.put("KTJL_ID", "'"+ CommonController.getSEQ(seq) +"'");
            map1.put("ORG_ID", "'"+ ID +"'");
            map1.put("ORG_TYPE", "'"+ 4 +"'");
            map1.put("CREATED_TIME", "sysdate");
            map1.put("CREATOR_ID", "'"+ asdMap.get("user_id") +"'");
            map1.put("CREATOR_NAME", "'"+ asdMap.get("user_name") +"'");
            map1.put("EDITED_TIME", "sysdate");
            map1.put("EDITOR_ID", "'"+ asdMap.get("user_id") +"'");
            map1.put("EDITOR_NAME", "'"+ asdMap.get("user_name") +"'");
            map1.put("BELONG_ORG_ID", "'"+ asdMap.get("org_id") +"'");
            //数据封装
            keys = ContextHelper.getKey(map1);
            map2 = new HashMap<String, Object>();
            map2.put("tablename" , "PT_ORG_KTJL");
            map2.put("keys" , keys);
            map2.put("params" , map1);
            commonMapper.insert(map2);

//            String orgSeq1=ID+"1";
//            String min = orgSeq1+String.format("%1$0"+(10-orgSeq1.length())+"d",0)+"000000000000000000";
//            String max = orgSeq1+String.format("%1$0"+(10-orgSeq1.length())+"d",0)+"999999999999999999";
//            HashMap<String, Object> map12 = new HashMap<>();
//            map12.put("name","'SEQ_"+ID+"'");
//            map12.put("min","'"+min+"'");
//            map12.put("max","'"+max+"'");
//            ptMapper.insertSeq(map12);

//            if("1".equals(BSLX)){
                try{
                    List<Map<String, Object>> maps = commonService.selectFieldsByOther("PT_ORG", "*", "ORG_ID='"+ID+"'", null, null);
                    List<Map<String, Object>> maps1 = commonService.selectFieldsByOther("PT_ORG_INFO", "*", "ORG_ID='"+ID+"'", null, null);
                    String sjjsUrl = "sys/insertSchool";
                    JSONObject sjtbJson = new JSONObject();
                    sjtbJson.put("pt_org", maps);
                    sjtbJson.put("pt_org_info", maps1);
                    //往bcca控制平台创建序列
//                    String result = ContextHelper.client_bcca(BCCA+sjjsUrl, sjtbJson, "");
//                    if(result == null){
//                        throw new Exception("BCCA控制平台拒绝拒绝连接，审批失败！");
//                    }else{
//                        JSONObject jsonObject = JSONObject.parseObject(result);
//                        if(!"200".equals(jsonObject.get("resultCode"))){
//                            throw new Exception("BCCA控制平台序列失败！");
//                        }
//                    }
                    //往教师平台写数据
                    String result = ContextHelper.client_bcca(inside_jxsc+sjjsUrl, sjtbJson, "");
                    System.out.println(result);
                    if(result == null){
                        throw new Exception("教师平台连接失败，审批失败！");
                    }else{
                        JSONObject jsonObject = JSONObject.parseObject(result);
                        if(!"200".equals(jsonObject.get("resultCode"))){
                            throw new Exception(jsonObject.get("resultMsg")+"");
                        }else{
                            //写内置分组信息
                            String fieldName =  "*";
                            String tableName = "JCBG_FZXX TAB";
                            String tiaojian = "TAB.FZXX_SFNZ = '2' AND TAB.BELONG_ORG_ID = '1'";
                            map2 = new HashMap<String, Object>();
                            map2.put("fieldName",fieldName);
                            map2.put("tablename", tableName);
                            map2.put("tiaojian", tiaojian);
                            List<Map<String, Object>> fzlist = commonMapper.selectFieldsByOther(map2);
                            if(fzlist.size() > 0){
                                Map<String, Object> fzMap = null;
                                String seq2 ="seq_"+ ID;
                                for(int i=0;i<fzlist.size();i++){
                                    fzMap = new HashMap<>();
                                    fzMap.put("FZXX_ID", "'"+ CommonController.getSEQ(seq2) +"'");
                                    fzMap.put("FZXX_MC", "'"+ fzlist.get(i).get("FZXX_MC") +"'");
                                    fzMap.put("FZXX_ZT", "'"+ fzlist.get(i).get("FZXX_ZT") +"'");
                                    fzMap.put("FZXX_LX", "'"+ fzlist.get(i).get("FZXX_LX") +"'");
                                    fzMap.put("FZXX_SFNZ", "'"+ fzlist.get(i).get("FZXX_SFNZ") +"'");
                                    fzMap.putAll(CommonController.getCreat(asdMap));
                                    fzMap.put("BELONG_ORG_ID", "'"+ ID +"'");
                                    map2 = new HashMap<String, Object>();
                                    map2.put("tablename" , "JCBG_FZXX");
                                    map2.put("keys" , ContextHelper.getKey(fzMap));
                                    map2.put("params" , fzMap);
                                    commonMapper.insert(map2);
                                }
                            }
                        }
                    }
                }catch (Exception e){
                    throw new Exception(e.getMessage());
                }
//            }

        }

    }

    /**
     * 注册审批查询
     * lch
     * 2019-10-21
     * */
    public Map<String, Object> selOrgListByZcsp(Map<String , Object> map)throws Exception{
        Integer total = ptMapper.selOrgListByZcspCount(map);

        int pageNo = Integer.parseInt(map.get("page").toString());
        int pageSize = Integer.parseInt(map.get("limit").toString());
        map.put("pageNo", pageNo);
        map.put("pageSize", pageSize);
        List<Map<String, Object>> list = ptMapper.selOrgListByZcsp(map);

        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }

    /**
     * 员工信息添加
     *      1.PT_YGDA 插入员工数据
     *      2.SYS_USER 插入登陆信息数据
     *      3.SYS_USEREXT 插入用户拓展表的数据
     * 倪杨
     * 2019-10-21
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean insertYgxx(Map<String, Object> params)throws Exception {
        //获取判断表名是否合法
        String tableName = ContextHelper.tableMap.get(params.get("tableName").toString()).toString();
        if(tableName==null || tableName.equals("")){
            throw new RuntimeException("表名不合法，请检查！");
        }

        HashMap<String, Object> map1 = new HashMap<>();
        Map<String, Object> userParams=new HashMap<>();
        Map<String, Object> userExtParams=new HashMap<>();
        //判断添加参数是否合法
        if(params.containsKey("insert") && params.get("insert") != null){
            Map<String,Object> insert = (Map<String,Object>) params.get("insert");
            map1.putAll(CommonController.getCreat((Map<String,Object>) params.get("ASD")));

            //循环存放、验证添加参数
            for(String key:insert.keySet()){
                if (key.startsWith("date")){
                    String fKey = ContextHelper.getFild(tableName,key.substring(4)) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("添加参数不合法，请检查！");
                    }
                    Map<String, Object> dataStr = (Map<String, Object>) insert.get(key);
                    map1.put(fKey,"to_date('"+dataStr.get("key")+"','"+dataStr.get("value")+"')");
                }else {
                    String fKey = ContextHelper.getFild(tableName,key) ;
                    if(fKey==null || fKey.equals("")){
                        throw new RuntimeException("添加参数不合法，请检查！");
                    }
                    map1.put(fKey,"'"+insert.get(key)+"'");
                }
            }

            //判断是调公共序列还是组织序列  不传或传空为公共序列 以special打头择为SEQ_加special后的所有
            if (params.get("seqKZ")==null||params.get("seqKZ")==""){
                map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ("seq_0")+"'");
                userParams.put("USER_ID","'"+CommonController.getSEQ("seq_0")+"'");
                userExtParams.put("USEREXT_ID","'"+CommonController.getSEQ("seq_0")+"'");
            }else if (params.get("seqKZ").toString().startsWith("special")){
                String seq="seq_"+params.get("seqKZ").toString().substring(7);
                map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ(seq)+"'");
                userParams.put("USER_ID","'"+CommonController.getSEQ(seq)+"'");
                userExtParams.put("USEREXT_ID","'"+CommonController.getSEQ(seq)+"'");
            }else {
                String seq="seq_"+((Map<String, Object>) params.get("ASD")).get("org_id").toString();
                map1.put(ContextHelper.getFild(tableName,params.get("id").toString()),"'"+CommonController.getSEQ(seq)+"'");
                userParams.put("USER_ID","'"+CommonController.getSEQ(seq)+"'");
                userExtParams.put("USEREXT_ID","'"+CommonController.getSEQ(seq)+"'");
            }

        }else{
            throw new RuntimeException("添加参数缺失，请检查！");
        }

        //数据封装
        map1.putAll(CommonController.getCreat((Map<String, Object>) params.get("ASD")));
        String[] keys = ContextHelper.getKey(map1);
        Map<String, Object> map=new HashMap<String, Object>();
        map.put("tablename" , tableName);
        map.put("keys" , keys);
        map.put("params" , map1);

        userParams.put("USER_NAME",map1.get("YGDA_XM"));
        userParams.put("USER_ACCOUNT",map1.get("YGDA_SFZHM"));
        userParams.put("USER_PASSWORD","'"+params.get("passWord")+"'");
        userParams.put("USER_TYPE","'5'");
        userParams.put("USER_ZT","'2'");
        userParams.put("USER_ISADMIN","'1'");

        userParams.putAll(CommonController.getCreat((Map<String, Object>) params.get("ASD")));
        Map<String, Object> userMap=new HashMap<String, Object>();
        userMap.put("tablename","SYS_USER");
        userMap.put("keys",ContextHelper.getKey(userParams));
        userMap.put("params",userParams);


        userExtParams.put("USER_ID",userParams.get("USER_ID"));
        userExtParams.put("USEREXT_CODE",map1.get("YGDA_SFZHM"));
        userExtParams.put("USEREXT_XB",map1.get("YGDA_XB"));
        if (map1.get("YGDA_LXDH")!=null){
            userExtParams.put("USEREXT_LXDH",map1.get("YGDA_LXDH"));
        }
        if (map1.get("YGDA_ZP")!=null){
            userExtParams.put("USEREXT_FJSON",map1.get("YGDA_ZP"));
        }


        userExtParams.putAll(CommonController.getCreat((Map<String, Object>) params.get("ASD")));
        Map<String, Object> userExtMap=new HashMap<String, Object>();
        userExtMap.put("tablename","SYS_USEREXT");
        userExtMap.put("keys",ContextHelper.getKey(userExtParams));
        userExtMap.put("params",userExtParams);

        if(commonMapper.insert(map)&&commonMapper.insert(userMap)&&commonMapper.insert(userExtMap)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 删除员工档案
     * 倪杨
     * @date 2019-10-22
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteYgxx(Map<String, Object> params)throws Exception {

        Map<String,Object> map = (Map<String,Object>)params.get("delete");
        String ygID = map.get("id").toString();
        String sfzhm = map.get("sfz").toString();

        List<Map<String, Object>> sys_userext = commonService.selectFieldsByOther("SYS_USEREXT", "*", "USEREXT_CODE='" + sfzhm + "'", null, null);
        if (sys_userext.isEmpty()){
            return false;
        }

        HashMap<String, Object> ygdaMap = new HashMap<>();
        ygdaMap.put("YGDA_ID","'"+ygID+"'");
        HashMap<String, Object> userMap = new HashMap<>();
        userMap.put("USER_ID","'"+sys_userext.get(0).get("USER_ID")+"'");
        HashMap<String, Object> userExtMap = new HashMap<>();
        userExtMap.put("USEREXT_CODE","'"+sfzhm+"'");

        String[] arr1 = {"YGDA_ID"};
        Map<String, Object> mapYg=new HashMap<String, Object>();
        mapYg.put("tablename" , "PT_YGDA");
        mapYg.put("keys" , arr1);
        mapYg.put("params" , ygdaMap);

        String[] arr2 = {"USER_ID"};
        Map<String, Object> mapUser=new HashMap<String, Object>();
        mapUser.put("tablename" , "SYS_USER");
        mapUser.put("keys" , arr2);
        mapUser.put("params" , userMap);

        String[] arr3 = {"USEREXT_CODE"};
        Map<String, Object> mapUserExt=new HashMap<String, Object>();
        mapUserExt.put("tablename" , "SYS_USEREXT");
        mapUserExt.put("keys" , arr3);
        mapUserExt.put("params" , userExtMap);

        if(commonMapper.delete(mapUserExt)&&commonMapper.delete(mapYg)&&commonMapper.delete(mapUser)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 修改员工档案
     * 倪杨
     * @date 2019-10-22
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean updateYgxx(Map<String, Object> params)throws Exception {

        HashMap<String, Object> ygFild = new HashMap<>();
        HashMap<String, Object> userFild = new HashMap<>();
        HashMap<String, Object> userExtFild = new HashMap<>();

        HashMap<String, Object> ygWhere = new HashMap<>();
        HashMap<String, Object> userWhere = new HashMap<>();
        HashMap<String, Object> userExtWhere = new HashMap<>();

        Map<String, Object> fild = (Map<String,Object>)params.get("fild");
        Map<String, Object> where = (Map<String,Object>)params.get("where");

        for(String key:fild.keySet()){
            if (key.startsWith("date")){
                String fKey = ContextHelper.getFild("PT_YGDA",key.substring(4)) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("添加参数不合法，请检查！");
                }
                Map<String, Object> dataStr = (Map<String, Object>) fild.get(key);
                ygFild.put(fKey,"to_date('"+dataStr.get("key")+"','"+dataStr.get("value")+"')");
            }else {
                String fKey = ContextHelper.getFild("PT_YGDA",key) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("添加参数不合法，请检查！");
                }
                ygFild.put(fKey,"'"+fild.get(key)+"'");
            }
        }

        for(String key:where.keySet()){
            String fKey = ContextHelper.getFild("PT_YGDA",key) ;
            if(fKey==null || fKey.equals("")){
                throw new RuntimeException("修改条件参数不合法，请检查！");
            }
            ygWhere.put(fKey,"'"+where.get(key)+"'");
        }

//        List<Map<String, Object>> sys_user = commonService.selectFieldsByOther("SYS_USER", "*", "USER_ACCOUNT=" + ygWhere.get("YGDA_SFZHM") , null, null);
//        if (sys_user.isEmpty()){
//            return false;
//        }
//        userFild.put("USER_ACCOUNT",ygFild.get("YGDA_SFZHM"));
//        userWhere.put("USER_ACCOUNT",ygFild.get("YGDA_SFZHM"));

        userExtFild.put("USEREXT_CODE",ygFild.get("YGDA_SFZHM"));
        userExtFild.put("USEREXT_XB",ygFild.get("YGDA_XB"));
        if (ygFild.get("YGDA_LXDH")!=null){
            userExtFild.put("USEREXT_LXDH",ygFild.get("YGDA_LXDH"));
        }
        if (ygFild.get("YGDA_ZP")!=null){
            userExtFild.put("USEREXT_FJSON",ygFild.get("YGDA_ZP"));
        }
        userExtWhere.put("USEREXT_CODE",ygWhere.get("YGDA_SFZHM"));

        ygFild.putAll(CommonController.getUpdate((Map<String, Object>) params.get("ASD")));
        Map<String, Object> ygMap=new HashMap<String, Object>();
        ygMap.put("tablename", "PT_YGDA");	//表名
        ygMap.put("keys", ContextHelper.getKey(ygFild));				//修改字段名
        ygMap.put("params", ygFild);			//修改字段
        ygMap.put("keys2", ContextHelper.getKey(ygWhere));			//条件字段名
        ygMap.put("params2", ygWhere);		//条件字段

        userExtFild.putAll(CommonController.getUpdate((Map<String,Object>)params.get("ASD")));
        Map<String, Object> userExtMap=new HashMap<String, Object>();
        userExtMap.put("tablename", "SYS_USEREXT");	//表名
        userExtMap.put("keys", ContextHelper.getKey(userExtFild));				//修改字段名
        userExtMap.put("params", userExtFild);			//修改字段
        userExtMap.put("keys2", ContextHelper.getKey(userExtWhere));			//条件字段名
        userExtMap.put("params2", userExtWhere);		//条件字段

        if(commonMapper.update(ygMap)&&commonMapper.update(userExtMap)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 组织查询
     * lch
     * 2019-10-25
     * */
    public List<Map<String,Object>> selOrgList(Map<String,Object> map) throws Exception{
        return ptMapper.selOrgList(map);
    }

    /**
     * 组织修改审批查询
     * lch
     * 2019-10-25
     * */
    public Map<String, Object> orgEditList(Map<String , Object> params)throws Exception{
        int pageNo = Integer.parseInt(params.get("page").toString());
        int pageSize = Integer.parseInt(params.get("limit").toString());
        Integer total = ptMapper.orgEditListCount(params);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        List<Map<String, Object>> list = ptMapper.orgEditList(params);

        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }


    /**
     * 获取版本类型list
     * @Author: 倪杨
     * @Date: 2019/11/5
     */
    public List<Map<String, Object>> getBblx()throws Exception{
        return  ptMapper.getBblx();
    }

    /**
     * 发布年份查询
     * */
    public List<Map<String, Object>> getFbnf()throws Exception{
        return  ptMapper.getFbnf();
    }

    /**
     * 查询项目版本
     * */
    public List<Map<String, Object>> getXmBblist(Map<String,Object> map)throws Exception{
        map.put("fieldName","TAB.PTBBWH_NAME,TAB.PTBBWH_BBH,TAB.PTBBWH_CY,TO_CHAR(TAB.PTBBWH_FBNR) AS PTBBWH_FBNR,TO_CHAR(TAB.PTBBWH_FBSJ,'YYYY-MM-DD') AS PTBBWH_FBSJ");
        map.put("tablename" , "PT_PTBBWH TAB ");
        map.put("tiaojian", "TAB.ATTR_1 = '"+ map.get("xmid")+ "'AND TO_CHAR(TAB.PTBBWH_FBSJ, 'YYYY') = '"+ map.get("fbnf") +"' AND TAB.PTBBWH_FBZT = '2'");
        map.put("orderName", "TAB.PTBBWH_FBSJ DESC");
        map.put("groupName", "");
        List<Map<String, Object>> result = commonMapper.selectFieldsByOther(map);
        return  result;
    }

    public List<Map<String,Object>> selYBB(Map<String,Object> map) throws Exception {
        String tj = " 1=1 ";
        if (map.get("tj")!=null&&map.get("tj")!=""){
            Map<String, Object> yfbtj = (Map<String, Object>) map.get("tj");
            for (String key:yfbtj.keySet()){
                String t1 = "TAB."+key + " like '%"+yfbtj.get(key)+"%'";
                tj+=" and "+t1;
            }
        }
        String table="(select TAB.* from PT_ORG TAB WHERE EXISTS(SELECT 1 FROM PT_BBZZGX SR WHERE TAB.ORG_ID = SR.ORG_ID AND SR.PTBBWH_ID='"+map.get("bbid")+"') and "+tj+")";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, "*", null, null, null);
        return maps;
    }

    public List<Map<String,Object>> selWBB(Map<String,Object> map) throws Exception {
        String tj = " 1=1 ";
        if (map.get("tj")!=null&&map.get("tj")!=""){
            Map<String, Object> yfbtj = (Map<String, Object>) map.get("tj");
            for (String key:yfbtj.keySet()){
                String t1 = "TAB."+key + " like '%"+yfbtj.get(key)+"%'";
                tj+=" and "+t1;
            }
        }
        String table="(select TAB.* from PT_ORG TAB WHERE NOT EXISTS(SELECT 1 FROM PT_BBZZGX SR WHERE TAB.ORG_ID = SR.ORG_ID AND SR.PTBBWH_ID='"+map.get("bbid")+"') and "+tj+")";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, "*", null, null, null);
        return maps;
    }

    @Transactional(rollbackFor = Exception.class)
    public Boolean delBbwhZzgx(List<Map<String, Object>> paramsList)throws Exception{
        Boolean b=false;
        for(int i=0;i<paramsList.size();i++){
            b = ptMapper.delBbwhZzgx(paramsList.get(i));
        }
        return b;
    }

    /**
     * 组织用户 查询
     * lch
     * 2019-12-24
     * */
    public Map<String, Object> selOrgUserlist(Map<String , Object> map)throws Exception{
        Integer total = ptMapper.selOrgUserlistCount(map);
        int pageNo = Integer.parseInt(map.get("page").toString());
        int pageSize = Integer.parseInt(map.get("limit").toString());
        map.put("pageNo", pageNo);
        map.put("pageSize", pageSize);
        List<Map<String, Object>> list = ptMapper.selOrgUserlist(map);
        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }

    /**
     * 查询广告内容
     * lch
     * 2019-12-25
     * */
    public Map<String, Object> selGgnrOnPage(Map<String , Object> map)throws Exception{
        Integer total = ptMapper.selGgnrOnPageCount(map);
        int pageNo = Integer.parseInt(map.get("page").toString());
        int pageSize = Integer.parseInt(map.get("limit").toString());
        map.put("pageNo", pageNo);
        map.put("pageSize", pageSize);
        List<Map<String, Object>> list = ptMapper.selGgnrOnPage(map);
        Map<String, Object> resultmap = new HashMap<>();
        resultmap.put("total", total);
        resultmap.put("list", list);
        return  resultmap;
    }

    /**
     * 平台内置参数修复
     * lch
     * 2020-02-11
     * */
    @Transactional(rollbackFor = Exception.class)
    public void ptnzcsXf(Map<String, Object> params)throws Exception {
        Map<String,Object> asd = (Map<String,Object>) params.get("ASD");
        String org_id = params.get("org_id").toString();
        String types = params.get("types").toString();
        String[] lxs = types.split(",");
        String sjjsUrl = "/sys/dataRecept";
        String path = inside_jxsc;
        for(int x=0;x<lxs.length;x++){
            if(lxs[x].equals("1")){
                //写内置分组信息
                String fieldName =  "*";
                String tableName = "JCBG_FZXX TAB";
                String tiaojian = "TAB.FZXX_SFNZ = '2' AND TAB.BELONG_ORG_ID = '1' " +
                        "and not exists (select 1 from JCBG_FZXX tab2 where tab2.fzxx_mc = tab.fzxx_mc and tab2.fzxx_sfnz = '2' and tab2.belong_org_id = '"+ org_id +"')";
                Map<String, Object> map2 = new HashMap<String, Object>();
                map2.put("fieldName",fieldName);
                map2.put("tablename", tableName);
                map2.put("tiaojian", tiaojian);
                List<Map<String, Object>> fzlist = commonMapper.selectFieldsByOther(map2);
                if(fzlist.size() > 0){
                    Map<String, Object> fzMap = null;
                    String seq2 ="seq_"+ org_id;
                    for(int i=0;i<fzlist.size();i++){
                        fzMap = new HashMap<>();
                        fzMap.put("FZXX_ID", "'"+ CommonController.getSEQ(seq2) +"'");
                        fzMap.put("FZXX_MC", "'"+ fzlist.get(i).get("FZXX_MC") +"'");
                        fzMap.put("FZXX_ZT", "'"+ fzlist.get(i).get("FZXX_ZT") +"'");
                        fzMap.put("FZXX_LX", "'"+ fzlist.get(i).get("FZXX_LX") +"'");
                        fzMap.put("FZXX_SFNZ", "'"+ fzlist.get(i).get("FZXX_SFNZ") +"'");
                        fzMap.putAll(CommonController.getCreat(asd));
                        fzMap.put("BELONG_ORG_ID", "'"+ org_id +"'");
                        map2 = new HashMap<String, Object>();
                        map2.put("tablename" , "JCBG_FZXX");
                        map2.put("keys" , ContextHelper.getKey(fzMap));
                        map2.put("params" , fzMap);
                        commonMapper.insert(map2);
                    }
                }
            }else if(lxs[x].equals("2")){
                //写学校基本信息
                //查询组织扩展表
                Map<String, Object> map1 = new HashMap<String, Object>();
                String fieldName = "TAB.ORG_NAME,TAB.ORG_TYPE,TAB.ORG_XDDM,INFO.ATTR_2";
                String tableName = "PT_ORG TAB LEFT JOIN PT_ORG_INFO INFO ON INFO.ORG_ID = TAB.ORG_ID";
                String tiaojian = "TAB.ORG_ID = '"+ org_id +"'";
                String orderName = "";
                map1.put("fieldName",fieldName);
                map1.put("tablename", tableName);
                map1.put("tiaojian", tiaojian);
                List<Map<String, Object>> orgInfoResult = commonMapper.selectFieldsByOther(map1);
                String org_type = orgInfoResult.get(0).get("ORG_TYPE").toString();
                if("3".equals(org_type)){
                    String org_xddm = orgInfoResult.get(0).get("ORG_XDDM").toString();
                    //学段管理
                    map1 = new HashMap<String, Object>();
                    tableName = "SYS_XDGL T";
                    fieldName = "T.*";
                    tiaojian = "T.XDGL_SFKY = '2' AND T.XDGL_ZT = '2' AND T.XDGL_DM IN ("+ org_xddm +")";
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
                    tiaojian = "T.XNDGL_SFJS = '1' AND T.XNDGL_ZT = '2'";
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
                            throw new Exception("同步学年度表数据无返回！");
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
                    tiaojian = "T.XQGL_SFJS = '1' AND T.XQGL_ZT = '2'";
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
                            throw new Exception("同步学期表数据无返回！");
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
                    tiaojian = "T.JBGL_SFJS = '1' AND T.JBGL_ZT = '2' AND XD.XDGL_DM IN ("+ org_xddm +")";
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
        }


    }


}