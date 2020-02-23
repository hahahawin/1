package com.beoneess.business.controller;

import com.alibaba.fastjson.JSONObject;
import com.beoneess.business.mapper.PtMapper;
import com.beoneess.business.service.impl.PtServiceImpl;
import com.beoneess.common.controller.CommonController;
import com.beoneess.common.controller.ContextHelper;
import com.beoneess.common.service.impl.CommonServiceImpl;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 平台特殊方法实现
 * 2019-09-03
 * 倪杨
 */

@Controller
@RequestMapping("/pt")
public class PtController {

    @Autowired
    private CommonServiceImpl commonService;

    @Autowired
    private PtServiceImpl ptService;

    @Autowired
    PtMapper ptMapper;

    @Value("${filePath}")
    private String GfilePath;

    /**
     * 添加
     * 2019-08-07
     * */
    @PostMapping("/insertOrg")
    @ResponseBody
    public Map<String,Object> insertOrg(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                if(!map.containsKey("insert") || map.get("insert") == null){
                    resultMap.put("resultCode","401");
                    resultMap.put("resultMsg","插入的值为空！");
                    return resultMap;
                }
                if(ptService.insertOrg(map)){
                    CommonController.addLog("3", 1, (Map<String,Object>)map.get("ASD"));
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
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
//        System.out.println(resultMap);
        return resultMap;
    }

    @RequestMapping("/findAllOrg")
    @ResponseBody
    public Map<String,Object> findAllOrg(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String table="PT_ORG";
        String filed="ORG_ID AS \"id\",ORG_NAME as \"mc\"";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, filed, null, null, null);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",maps);
        return resultMap;
    }

    @RequestMapping("/orgFind")
    @ResponseBody
    public Map<String,Object> orgFind(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String table="PT_ORG TAB";
        String filed="TAB.ORG_ID ID,TAB.ORG_PID PID,TAB.ORG_NAME NAME,TAB.ORG_CODE CODE,TAB.ORG_TYPE TYPE,TAB.ORG_JWTYPE JWTYPE,TAB.ORG_SBKT SBKT,TAB.ORG_BSLX BSLX,TAB.ORG_ZT ZT,TAB.ORG_MIN MIN,TAB.ORG_MAX MAX,TAB.ORG_ZJM ZJM,TAB.ORG_DLWZ DLWZ,TAB.ORG_XDDM XDDM,TAB.ORG_BJZT BJZT,(SELECT COUNT(1) FROM PT_ORG SR WHERE SR.ORG_PID=TAB.ORG_ID ) AS SCN,(SELECT COUNT(1) FROM PT_ORG SR WHERE SR.ORG_TYPE ='3' and SR.ORG_PID = TAB.ORG_ID) AS XXSL";
        String where = "TAB.ORG_PID = '"+map.get("pid")+"'";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, filed, where, null, null);
        maps = ContextHelper.transformListUpperCase(maps);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",maps);
        return resultMap;
    }

    /**
     * 添加
     * 2019-08-07
     * */
    @RequestMapping("/orgRegisterInsert")
    @ResponseBody
    public Map<String,Object> orgRegisterInsert(@RequestBody Map<String,Object> getMap){
        HashMap<String, Object> resultMap = new HashMap<>();
        HashMap<String, Object> map1 = new HashMap<>();
        HashMap<String, Object> map21 = new HashMap<>();
        try {
            HashMap<String, Object> map=(HashMap<String, Object>)getMap.get("zc");
            HashMap<String, Object> map22=(HashMap<String, Object>)getMap.get("tz");
            String tableName = ContextHelper.tableMap.get(getMap.get("tableName").toString()).toString();
            if(tableName==null || tableName.equals("")){
                throw new RuntimeException("表名不合法，请检查！");
            }

            for (String key:map.keySet()){
                String fKey = ContextHelper.getFild(tableName,key) ;
                if(fKey==null || fKey.equals("")){
                    throw new RuntimeException("添加参数不合法，请检查！");
                }
                map1.put(fKey,"'"+map.get(key)+"'");
            }
            for (String key:map22.keySet()){
                map21.put(key,"'"+map22.get(key)+"'");
            }

            String orgSeq=CommonController.getSEQ("seq_0");
            map1.put("ORG_ID","'"+orgSeq+"'");
            map1.put("ORG_BJZT","'3'");
            map1.put("ORG_SBKT","'1'");
            map1.put("ORG_TYPE","'3'");
            map1.put("ORG_ZT","'1'");
            map1.put("CREATED_TIME","sysdate");
            map1.put("EDITED_TIME","sysdate");
            map1.put("BELONG_ORG_ID","'"+orgSeq+"'");

            String orgSeq1=orgSeq+"1";
            String min = orgSeq1+String.format("%1$0"+(10-orgSeq1.length())+"d",0)+"000000000000000000";
            String max = orgSeq1+String.format("%1$0"+(10-orgSeq1.length())+"d",0)+"999999999999999999";
            map1.put("ORG_MIN","'"+min+"'");
            map1.put("ORG_MAX","'"+max+"'");

            map21.put("INFO_ID","'"+CommonController.getSEQ("seq_1")+"'");
            map21.put("ORG_ID",map1.get("ORG_ID"));
            map21.put("BELONG_ORG_ID",map1.get("ORG_ID"));

            if(ptService.insertOrgKTJL(map1,"PT_ORG")){

                HashMap<String, Object> map2 = new HashMap<>();
                map2.put("KTJL_ID","'"+CommonController.getSEQ("seq_1")+"'");
                map2.put("ORG_ID",map1.get("ORG_ID"));
                map2.put("ORG_TYPE","'1'");
                map2.put("BELONG_ORG_ID",map1.get("ORG_ID"));
                boolean pt_org_ktjl = ptService.insertOrgKTJL(map2, "PT_ORG_KTJL");
                if (pt_org_ktjl){
                    HashMap<String, Object> map12 = new HashMap<>();
                    map12.put("name","'SEQ_"+orgSeq+"'");
                    map12.put("min","'"+min+"'");
                    map12.put("max","'"+max+"'");
                    ptService.insertOrgKTJL(map21,"PT_ORG_INFO");
//                    System.out.println("插入序列："+ptMapper.insertSeq(map12));
                }

                resultMap.put("resultCode","200");
                resultMap.put("resultMsg","添加成功");
            }else {
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","添加失败");
            }


        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }


    /**
     * 申请组织时的上级组织
     * @return
     * @throws Exception
     */
    @RequestMapping("/orgRegisterLoadPid")
    @ResponseBody
    public Map<String,Object> orgRegisterLoadPid() throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String fieldName = "TAB.ORG_ID as \"org_id\",TAB.ORG_NAME as \"org_name\"";
        String tiaojian = "TAB.ORG_PID != '-1' and TAB.ORG_TYPE = '2' and TAB.ORG_ZT = '2' and NOT EXISTS (SELECT 1 FROM PT_ORG T WHERE T.ORG_PID = TAB.ORG_ID AND T.ORG_TYPE = '2')";
        String table="PT_ORG TAB";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, fieldName, tiaojian, null, null);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",maps);
        return resultMap;
    }

    /**
     * 组织查询
     * lch
     * param org_zt 状态
     * param org_type 组织类型
     * param org_sbkt 开通状态
     * param hasAdmin 包含管理员
     * param noAdmin 不包含管理员
     * param org_id  不包含管理员时去除自己
     * 2019-10-25
     * */
    @RequestMapping("/selOrgList")
    @ResponseBody
    public Map<String,Object> selOrgList(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        List<Map<String, Object>> maps = ptService.selOrgList(map);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",maps);
        return resultMap;
    }

    /**
     * 回显申请信息
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping("/findOrgByCode")
    @ResponseBody
    public Map<String,Object> findOrgByCode(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String zzbm = map.get("zzbm").toString();

        List<Map<String, Object>> maps = commonService.selectFieldsByOther("PT_ORG", "*", "ORG_CODE='"+zzbm+"'", null, null);
        List<Map<String, Object>> maps1 = null;
        if(maps.size() > 0){
            maps = ContextHelper.transformListUpperCase(maps);
            maps1 = commonService.selectFieldsByOther("PT_ORG_INFO", "*", "ORG_ID='"+maps.get(0).get("org_id").toString()+"'", null, null);
            maps1 = ContextHelper.transformListUpperCase(maps1);
        }
        resultMap.put("resultCode","200");
        resultMap.put("list1",maps);
        resultMap.put("list2",maps1);
        return resultMap;
    }

    /**
     * 注册审批类别查询
     * lch
     * 2019-10-21
     * */
    @RequestMapping("/selOrgListByZcsp")
    @ResponseBody
    public Map<String,Object> selOrgListByZcsp(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            if(!map.containsKey("page") || map.get("page") == null){
                map.put("page",1);
            }
            if(!map.containsKey("limit") || map.get("limit") == null){
                map.put("limit",10);
            }
            Map<String, Object> pages = ptService.selOrgListByZcsp(map);
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
     * 组织注册审核
     * lch
     * 2019-10-18
     * */
    @RequestMapping("/auditOrg")
    @ResponseBody
    public Map<String,Object> auditOrg(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            ptService.auditOrg(map);
            resultMap.put("resultCode","200");
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    @RequestMapping("/loadCheckOrgInfo")
    @ResponseBody
    public Map<String,Object> loadCheckOrgInfo(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String id = map.get("id").toString();

        List<Map<String, Object>> maps = commonService.selectFieldsByOther("PT_ORG", "*", "ORG_ID='"+id+"'", null, null);
        List<Map<String, Object>> maps1 = commonService.selectFieldsByOther("PT_ORG_INFO", "*", "ORG_ID='"+id+"'", null, null);
        resultMap.put("resultCode","200");
        if (!maps.isEmpty()){
            resultMap.put("list1",maps.get(0));
        }
        if (!maps1.isEmpty()){
            resultMap.put("list2",maps1.get(0));
        }

        return resultMap;
    }

    /**
     * 查询所有未拥有管理员的组织
     * @return
     * @throws Exception
     */
    @RequestMapping("/findInitAdminOrgAdd")
    @ResponseBody
    public Map<String,Object> findInitAdminOrgAdd() throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String table="(select ORG_ID ID,ORG_NAME MC,ORG_TYPE TYPE from PT_ORG where ORG_ID not in (select BELONG_ORG_ID from SYS_USER where USER_ISADMIN='2'))";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, "*", null, null, null);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",maps);
        return resultMap;
    }


    /**
     * 查询所有的组织
     * @return
     * @throws Exception
     */
    @RequestMapping("/findInitAdminOrgUpd")
    @ResponseBody
    public Map<String,Object> findInitAdminOrgUpd() throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String table="(select ORG_ID as \"id\",ORG_NAME as \"mc\" from PT_ORG)";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, "*", null, null, null);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",maps);
        return resultMap;
    }


    /**
     * 查询所有状态为可用的广告位
     * @return
     * @throws Exception
     */
    @RequestMapping("/findPtGgw")
    @ResponseBody
    public Map<String,Object> findPtGgw() throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String table="(select GGW_ID \"id\",GGW_MC \"mc\",GGW_HT \"ht\",GGW_WT \"wt\",GGW_ZP_SIZE \"zp_size\",GGW_ZT_MNUM \"zt_mnum\",GGW_BL \"bl\" from PT_GGW WHERE GGW_ZT='2')";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, "*", null, null, null);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",maps);
        return resultMap;
    }

    /**
     * 广告内容上传时的图片上传
     * @param file
     * @param request
     * @param src
     * @return
     * @throws Exception
     */
    @RequestMapping("/filesUpload")
    @ResponseBody
    public String  filesUpload(@RequestParam("file") MultipartFile file , HttpServletRequest request,String src) throws Exception{
        System.out.println("1."+file.getOriginalFilename());
        String pathString = null;
        if(file!=null) {
//            pathString = src + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + "_" +file.getOriginalFilename();
            pathString = src  +file.getOriginalFilename();
        }
        try {
            File files=new File(pathString);
            //打印查看上传路径
            System.out.println("pathString:"+pathString);
            if(!files.getParentFile().exists()){
                files.getParentFile().mkdirs();
            }
            file.transferTo(files);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return "{\"code\":0,\"msg\":\""+pathString+"\"}";
    }


    /**
     * 删除广告内容中的图片文件
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping("/delPtGgnrImgByName")
    @ResponseBody
    public Map<String,Object> delPtGgnrImgByName(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();

        List<Map<String, Object>> maps = commonService.selectFieldsByOther("PT_GGNR", "to_char(GGNR_FJ) GGNR_FJ", "GGNR_ID='" + map.get("ID") + "'", null, null);
        if (!maps.isEmpty()){
            Map<String, Object> map1 = maps.get(0);
            String ggnr_fj = map1.get("GGNR_FJ").toString();

            JSONArray jsonArray = new JSONArray(ggnr_fj);
            for(int i=0;i<jsonArray.length();i++){
                String fileNewName = jsonArray.getJSONObject(i).get("fileNewName").toString();
                if (map.get("NAME").equals(fileNewName)){
                    ResourceBundle resource = ResourceBundle.getBundle("application");
                    String GGFileUploadSrc = resource.getString("filePath");
                    File file = new File(GGFileUploadSrc + fileNewName);

                    if(file.exists()){
                        CommonController.delFile(file);
                    }
                    jsonArray.remove(i);
                    HashMap<String, Object> map2 = new HashMap<>();
                    map2.put("GGNR_ID","'"+map.get("ID")+"'");
                    HashMap<String, Object> map3 = new HashMap<>();
                    map3.put("GGNR_FJ","'"+jsonArray.toString()+"'");
                    boolean b = commonService.updateRule("PT_GGNR", map2, map3);
                    if (b){
                        resultMap.put("resultCode","200");
                        resultMap.put("resultMsg","删除成功");
//                        System.out.println("jsonArray."+jsonArray.toString());
                        resultMap.put("resultData",jsonArray.toString());
                    }else{
                        resultMap.put("resultCode","400");
                        resultMap.put("resultMsg","删除失败");
                    }
                }else{
                    resultMap.put("resultCode","400");
                    resultMap.put("resultMsg","删除失败");
                }
            }
        }

        return resultMap;
    }

    @RequestMapping("/bbDelFile")
    @ResponseBody
    public Map<String,Object> bbDelFile(@RequestBody Map<String,Object> map) {
        HashMap<String, Object> resultMap = new HashMap<>();
        File file = new File(map.get("filePath").toString());
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

    @RequestMapping("/deleteGgnr")
    @ResponseBody
    public Map<String,Object> deleteGgnr(@RequestBody Map<String,Object> map){
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
                    CommonController.addLog("5", 1, (Map<String,Object>)map.get("ASD"));

                    String fj = map.get("FJ").toString();
                    JSONArray array = new JSONArray(fj);
                    for(int i=0;i<array.length();i++){
                        String fileNewName = array.getJSONObject(i).get("fileNewName").toString();
                        ResourceBundle resource = ResourceBundle.getBundle("application");
                        String GGFileUploadSrc = resource.getString("filePath");
                        File file = new File(GGFileUploadSrc + fileNewName);

                        if(file.exists()){
                            CommonController.delFile(file);
                        }
                    }

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
     * 查询广告
     * lch
     * 2019-09-20
     * */
    @PostMapping("/selGgnr")
    @ResponseBody
    public Map<String,Object> selGgnr(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            Map<String, Object> maps = ptService.selGgnr(map);
            String ggnr_fj = maps.get("ggnr_fj").toString();
            String org_id = maps.get("org_id").toString();
            String org_name = maps.get("org_name").toString();
            String bslx = maps.get("bslx").toString();
            String org_zt = maps.get("org_zt").toString();
            String org_type = maps.get("org_type").toString();
            String bspt = "";
            if(maps.containsKey("bspt")){
                bspt = maps.get("bspt").toString();
            }
            resultMap.put("ggnr_fj", ggnr_fj);
            resultMap.put("org_id", org_id);
            resultMap.put("org_name", org_name);
            resultMap.put("org_zt", org_zt);
            resultMap.put("org_type", org_type);
            resultMap.put("bslx", bslx);
            resultMap.put("bspt", bspt);
            resultMap.put("resultCode", 200);
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * app 闪屏查询
     * lch
     * 2020-01-14
     * */
    @PostMapping("/splashScreen")
    @ResponseBody
    public Map<String,Object> splashScreen(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            String ggwbm = "";
            if(map.containsKey("ggwbm") && map.get("ggwbm") != null){
                ggwbm = map.get("ggwbm").toString();
            }
            //查询广告位
            String tableName = "PT_GGW";
            Map<String,Object> ggwmap = new HashMap<>();
            ggwmap.put("GGW_CODE", "'"+ ggwbm +"'");
            ggwmap.put("GGW_ZT", "'"+ 2 +"'");
            ggwmap = commonService.getDataByKeys(tableName, ggwmap);
            if(ggwmap == null){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg", "没有有效的广告位信！");
                return resultMap ;
            }
            String ggw_id = ggwmap.get("GGW_ID").toString();
            //查询广告内容
            String fieldName = "TO_CHAR(TAB.GGNR_FJ) AS GGNR_FJ";
            tableName = "PT_GGNR TAB";
            String tiaojian = "TAB.GGNR_BTIME <= SYSDATE AND SYSDATE < TAB.GGNR_ETIME + 1" +
                    "AND TAB.GGW_ID = '"+ ggw_id +"' AND TAB.GGNR_ZT = '"+ 2 +"'";
            String orderName = "TO_NUMBER(TAB.BELONG_ORG_ID) ASC";
            List<Map<String, Object>> result2 = commonService.selectFieldsByOther(tableName, fieldName, tiaojian, orderName,null);
            String GGNR_FJ = "";
            if(result2 != null && result2.size() > 0){
                GGNR_FJ = result2.get(0).get("GGNR_FJ").toString();
                if(GGNR_FJ != null && !"".equals(GGNR_FJ) && !"[]".equals(GGNR_FJ)){
                    net.sf.json.JSONArray arr = net.sf.json.JSONArray.fromObject(GGNR_FJ);
                    Map<String, Object> fjmap = (Map<String, Object>) arr.get(0);
//                    GGNR_FJ = fjmap.get("folder")+"/"+fjmap.get("newName");
                    GGNR_FJ = fjmap.get("fileNewName").toString();
                }
            }
            resultMap.put("new_names", GGNR_FJ);
            resultMap.put("resultCode", "200");
            resultMap.put("resultMsg", "查询成功");
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * app 装机引导查询
     * lch
     * 2020-02-18
     * */
    @PostMapping("/loaderGuide")
    @ResponseBody
    public Map<String,Object> loaderGuide(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try{
            String project_name = "";
            if(!map.containsKey("project_name") || map.get("project_name") == null){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg", "项目名称不能为空！");
                return resultMap ;
            }else{
                project_name =  map.get("project_name").toString();
            }
            String version_number = "";
            if(!map.containsKey("version_number") || map.get("version_number") == null){
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg", "版本号不能为空！");
                return resultMap ;
            }else{
                version_number =  map.get("version_number").toString();
            }
            String fieldName = "tab.PTBBWH_NAME as \"ptbbwh_name\",to_char(tab.attr_4) as \"attr_4\"";
            String tableName = "pt_ptbbwh tab left join pt_xtrjlx lx on lx.xtrjlx_id = tab.attr_1";
            String tiaojian = "tab.ptbbwh_bbh = '"+ version_number +"' and lx.xtrjlx_ywmc = '"+ project_name +"'";
            List<Map<String, Object>> result2 = commonService.selectFieldsByOther(tableName, fieldName, tiaojian, null,null);
            String attr_4 = "";
            String path = "";
            if(result2 != null && result2.size() > 0 && result2.get(0).containsKey("attr_4") &&  result2.get(0).get("attr_4") != null){
                attr_4 = result2.get(0).get("attr_4").toString();
                if(attr_4 != null && !"".equals(attr_4) && !"[]".equals(attr_4)){
                    net.sf.json.JSONArray arr = net.sf.json.JSONArray.fromObject(attr_4);
                    Map<String, Object> fjmap = null;
                    for(int i=0;i<arr.size();i++){
                        fjmap = (Map<String, Object>) arr.get(0);
                        path += fjmap.get("folder")+"/"+fjmap.get("newName")+",";
                    }
                    path = path.substring(0, path.length() -1);
                }
            }
            resultMap.put("path", path);
            resultMap.put("resultCode", "200");
            resultMap.put("resultMsg", "查询成功");
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 插入员工档案
     *  1.PT_YGDA 插入员工数据
     *  2.SYS_USER 插入登陆信息数据
     *  3.SYS_USEREXT 插入用户拓展表的数据
     *  倪杨
     * 2019-10-21
     * */
    @RequestMapping("/insertYgxx")
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

                if(ptService.insertYgxx(map)){
                    CommonController.addLog("3", 1, (Map<String,Object>)map.get("ASD"));
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
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 删除员工档案
     * 倪杨
     *  1.删除PT_YGDA
     *  2.删除SYS_USEREXT
     *  3.删除SYS_USER
     * 2019-10-22
     * */
    @RequestMapping("/deleteYgxx")
    @ResponseBody
    public Map<String,Object> deleteYgxx(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            if(!map.containsKey("delete") || map.get("delete") == null){
                resultMap.put("resultCode","401");
                resultMap.put("resultMsg","删除条件为空！");
                return resultMap;
            }

            if(ptService.deleteYgxx(map)){
                CommonController.addLog("5", 1, (Map<String,Object>)map.get("ASD"));
                resultMap.put("resultCode","200");
                resultMap.put("resultMsg","删除成功");
            }else {
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","删除失败");
            }
        }catch (Exception e){
            e.printStackTrace();
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
     * 修改员工档案
     * 2019-10-22
     * */
    @RequestMapping("/updateYgxx")
    @ResponseBody
    public Map<String,Object> updateYgxx(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
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

            if(ptService.updateYgxx(map)){
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
     * 判断用户是否操作过系统，即查看日志表中是否存在该用户的数据
     * @return
     * @throws Exception
     */
    @RequestMapping("/getUserBizLog")
    @ResponseBody
    public Map<String,Object> getUserBizLog() throws  Exception{
        HashMap<String, Object> map = new HashMap<>();
        String table = "(select c.YGDA_ID ID,count(1) COUNT from (select a.*,b.USER_ID from PT_YGDA a left join SYS_USEREXT b on a.YGDA_SFZHM = b.USEREXT_CODE) c , SYS_BIZ_LOG d WHERE c.USER_ID = d.CREATOR_ID group by YGDA_ID)";
        List<Map<String, Object>> list = commonService.selectFieldsByOther(table, "ID,COUNT", null, null, null);
        String table1 = "(select a.YGDA_ID ID,COUNT(1) COUNT from PT_YGDA a left join SYS_ROLE_USER b on a.YGDA_ID = b.USER_ID group by a.YGDA_ID)";
        List<Map<String, Object>> list1 = commonService.selectFieldsByOther(table1, "ID,COUNT", null, null, null);

        map.put("list",list);
        map.put("list1",list1);
        return map;
    }

    /**
     * 组织修改审批查询
     * lch
     * 2019-10-25
     * */
    @RequestMapping("/orgEditList")
    @ResponseBody
    public Map<String,Object> orgEditList(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> pages = ptService.orgEditList(map);
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
     * 获取版本类型list
     * @Author: 倪杨
     * @Date: 2019/11/5
     */
    @RequestMapping("/getBblx")
    @ResponseBody
    public Map<String,Object> getBblx(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("resultCode","200");
        resultMap.put("resultData",ptService.getBblx());
        return resultMap;
    }

    /**
     * 查询项目版本信息
     * lch
     * 2020-01-04
     * */
    @PostMapping("/getXmbbxx")
    @ResponseBody
    public Map<String,Object> getXmbbxx(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        //查询已发布的项目
        List<Map<String, Object>> list = ptService.getBblx();
        //查询发布时间
        List<Map<String, Object>> list2 = ptService.getFbnf();
        //查询项目版本信息
        List<Map<String, Object>> list3 = null;
        if(list.size()> 0 && list2.size() > 0){
            Map<String,Object> map2 = new HashMap<>();
            map2.put("xmid", list.get(0).get("id"));
            map2.put("fbnf", list2.get(0).get("fbnf"));
            list3 = ptService.getXmBblist(map2);
            list3 = ContextHelper.transformListUpperCase(list3);
        }

        resultMap.put("resultCode","200");
        resultMap.put("data",list);
        resultMap.put("data2",list2);
        resultMap.put("data3",list3);
        return resultMap;
    }

    /**
     * 查询项目版本信息
     * lch
     * 2020-01-04
     * */
    @PostMapping("/getXmbbxx2")
    @ResponseBody
    public Map<String,Object> getXmbbxx2(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        //查询项目版本信息
        List<Map<String, Object>> list3 = ptService.getXmBblist(map);
        list3 = ContextHelper.transformListUpperCase(list3);
        resultMap.put("resultCode","200");
        resultMap.put("data3",list3);
        return resultMap;
    }

    @RequestMapping("/bbGetUserInfo")
    @ResponseBody
    public Map<String,Object> bbGetUserInfo(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        List<Map<String, Object>> list = commonService.selectFieldsByOther("SYS_USER", "USER_ID \"id\",USER_NAME \"name\"", "BELONG_ORG_ID='" + map.get("org_id") + "'", null, null);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",list);
        return resultMap;
    }


    @RequestMapping("/selYBB")
    @ResponseBody
    public Map<String, Object> selYBB (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> maps = ptService.selYBB(map);

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

    @RequestMapping("/selWBB")
    @ResponseBody
    public Map<String, Object> selWBB (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> maps = ptService.selWBB(map);

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

    @RequestMapping("/addBbwhZzgx")
    @ResponseBody
    public Map<String, Object> addBbwhZzgx (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String bbid = map.get("bbid").toString();
            String xs_ids = map.get("ids").toString();
            if(xs_ids != null && !"".equals(xs_ids)){
                String[] ids = xs_ids.split(",");
                List<Map<String, Object>> paramsList = new ArrayList<>();
                Map<String, Object> map1 = null;
                for(int i=0;i<ids.length;i++){
                    map1 = new HashMap<>();
                    map1.put("PTBBWH_ID", bbid);
                    map1.put("ORG_ID", ids[i]);
                    paramsList.add(map1);
                }
                boolean flg = commonService.addAllData("PT_BBZZGX", paramsList);
                if(flg){
                    CommonController.addLog("3", 1, (Map<String,Object>)map.get("ASD"));
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","添加成功");
                }else {
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","添加失败");
                }
            }
            resultMap.put("resultCode","200");
        }catch (Exception e){
//            e.printStackTrace();
            resultMap.put("resultCode","500");
        }
//        System.out.println("map:"+resultMap);
        return resultMap;
    }

    @RequestMapping("/delBbwhZzgx")
    @ResponseBody
    public Map<String,Object> delBbwhZzgx(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String bbid = map.get("bbid").toString();
            String user_ids = map.get("ids").toString();
            if(user_ids != null && !"".equals(user_ids)){
                String[] ids = user_ids.split(",");
                List<Map<String, Object>> paramsList = new ArrayList<>();
                Map<String, Object> map1 = null;
                for(int i=0;i<ids.length;i++){
                    map1 = new HashMap<>();
                    map1.put("PTBBWH_ID", bbid);
                    map1.put("ORG_ID", ids[i]);
                    paramsList.add(map1);
                }
                Boolean b = ptService.delBbwhZzgx(paramsList);
                if (b){
                    CommonController.addLog("3", 1, (Map<String,Object>)map.get("ASD"));
                    resultMap.put("resultCode","200");
                    resultMap.put("resultMsg","操作成功");
                }else {
                    resultMap.put("resultCode","500");
                    resultMap.put("resultMsg","操作失败");
                }

            }
        }catch (Exception e){
//            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }


    @RequestMapping("/BBuploadFile")
    @ResponseBody
    public Map<String,Object>  BBuploadFile(@RequestParam("file") MultipartFile file,String ASD,String fileName,String filePath){
        HashMap<String, Object> resultMap = new HashMap<>();
        String oldfileName=file.getOriginalFilename();
        String s = oldfileName.substring(oldfileName.lastIndexOf("."),oldfileName.length());
//        System.out.println("S:"+s);
        String dirPath = GfilePath + filePath;
        String pathString="";
        File dir = new File(dirPath);
        fileName = fileName+"_"+ new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date())+s;
        if (!dir.isDirectory()){
            dir.mkdirs();
        }

        if(file!=null) {
            pathString =dirPath+File.separator+fileName;
        }
        try {
            File files=new File(pathString);
            if(!files.exists()){
                files.createNewFile();
            }
            file.transferTo(files);
            resultMap.put("resultCode","200");
            resultMap.put("fileName",fileName);
            resultMap.put("filePath",pathString);
            resultMap.put("resultMsg","操作成功");

        } catch (Exception e) {
//            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        System.out.println(resultMap);
        return resultMap;
    }

    /**
     * 组织用户 查询
     * lch
     * 2019-12-24
     * */
    @PostMapping("/selOrgUserlist")
    @ResponseBody
    public Map<String,Object> selOrgUserlist(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> pages = ptService.selOrgUserlist(map);
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
     * 查询广告内容
     * lch
     * 2019-12-25
     * */
    @PostMapping("/selGgnrOnPage")
    @ResponseBody
    public Map<String,Object> selGgnrOnPage(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> pages = ptService.selGgnrOnPage(map);
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
     * 平台内置参数修复
     * lch
     * 2020-02-11
     * */
    @PostMapping("/ptnzcsXf")
    @ResponseBody
    public Map<String,Object> ptnzcsXf(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                ptService.ptnzcsXf(map);
                CommonController.addLog("4", 1, (Map<String,Object>)map.get("ASD"));
                resultMap.put("resultCode","200");
                resultMap.put("resultMsg","修复成功");
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            CommonController.addLog("4", 2, (Map<String,Object>)map.get("ASD"));
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

}
