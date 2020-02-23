package com.beoneess.business.controller;

import com.beoneess.common.mapper.CommonMapper;
import com.beoneess.common.service.impl.CommonServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * 行政管理
 * 倪杨
 * 2019-10-23
 */
@Controller
@RequestMapping("/xzgl")
public class XzglController {

    @Autowired
    private CommonServiceImpl commonService;

    @Autowired
    CommonMapper commonMapper;

    @RequestMapping("/find")
    @ResponseBody
    public List<Map<String, Object>> find(@RequestBody Map<String,Object> map) throws Exception{
//        System.out.println("1."+map);


        Map<String, Object> data = (Map<String, Object>) map.get("data");
        if (data.get("groupName")==null){
            data.put("groupName",null);
        }
        if (data.get("orderName")==null){
            data.put("orderName",null);
        }
//        System.out.println("2."+data);
//        System.out.println("3."+commonMapper.find(data));
        return commonMapper.find(data);
    }

    @RequestMapping("/insert")
    @ResponseBody
    public Map<String, Object> insert(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            if (commonMapper.insert((Map<String,Object>)map.get("data"))){
                resultMap.put("resultCode","200");
            }else {
                resultMap.put("resultCode","500");
            }
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    @RequestMapping("/delete")
    @ResponseBody
    public Map<String, Object> delete(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            if (commonMapper.delete((Map<String,Object>)map.get("data"))){
                resultMap.put("resultCode","200");
            }else {
                resultMap.put("resultCode","500");
            }
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    @RequestMapping("/update")
    @ResponseBody
    public Map<String, Object> update(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            if (commonMapper.update((Map<String,Object>)map.get("data"))){
                resultMap.put("resultCode","200");
            }else {
                resultMap.put("resultCode","500");
            }
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }

    /**
     * @param map
     * @return
     * @throws Exception
     */
    @RequestMapping("/findUserExt")
    @ResponseBody
    public List<Map<String, Object>> findUserExt(@RequestBody Map<String,Object> map) throws Exception{

        List<Map<String, Object>> maps = commonService.selectFieldsByOther(map.get("table").toString(), map.get("fiel").toString(), map.get("param").toString(), null, null);
        return maps;
    }

    /**
     * 插入：SYS_USER，SYS_USEREXT
     * 教师系统平台部署时，
     * 在其本地保存教职工信息，
     * 同时在服务平台系统创建一个新用户（SYS_USER）以及在拓展部（SYS_USEREXT）创建其拓展信息
     * map：{ASD，data1：用户表信息，data2：拓展部信息}
     *
     * 倪杨
     * 2019-10-25
     */
    @RequestMapping("/insertZgxx")
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> insertZgxx(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> data1 = (Map<String, Object>) map.get("data1");
            Map<String, Object> data2 = (Map<String, Object>) map.get("data2");

            if (commonMapper.insert(data1)&&commonMapper.insert(data2)){
                resultMap.put("resultCode","200");
            }else {
                resultMap.put("resultCode","500");
            }
        }catch (Exception e){
            resultMap.put("resultCode","500");
        }

        return resultMap;
    }


    /**
     * 删除：SYS_USER，SYS_USEREXT
     * 教师系统平台部署时，
     * 首先删除服务平台系统在拓展部（SYS_USEREXT）信息
     * 然后删除服务平台系统用户（SYS_USER）
     * map：{ASD，data1：用户表信息，data2：拓展部信息}
     *
     * 倪杨
     * 2019-10-25
     */
    @RequestMapping("/deleteZgxx")
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> deleteZgxx(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> data1 = (Map<String, Object>) map.get("data1");
            Map<String, Object> data2 = (Map<String, Object>) map.get("data2");
            String sfzhm = map.get("sfzhm").toString();

            List<Map<String, Object>> sys_userext =commonService.selectFieldsByOther("SYS_USEREXT", "*", "USEREXT_CODE='" + sfzhm + "'", null, null);
            Map<String, Object> params = (Map<String, Object>) data1.get("params");
            params.put("USER_ID", "'" + sys_userext.get(0).get("USER_ID") + "'");
            data1.put("params",params);

            if (commonMapper.delete(data2)&&commonMapper.delete(data1)){
                resultMap.put("resultCode","200");
            }else {
                resultMap.put("resultCode","500");
            }
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }
/**
 * 
 */
    
    
    
    /**
     * 修改：SYS_USEREXT
     * 教师系统平台部署时，
     * 修改服务平台系统在拓展部（SYS_USEREXT）信息
     * map：{ASD，data：拓展部信息}
     *
     * @Author: 倪杨
     * @Date: 2019/10/25
     */
    @RequestMapping("/updateZgxx")
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> updateZgxx (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> data = (Map<String, Object>) map.get("data");
            if (commonMapper.update(data)){
                resultMap.put("resultCode","200");
            }else {
                resultMap.put("resultCode","500");
            }
        }catch (Exception e){
            resultMap.put("resultCode","500");
        }
        return resultMap;
    }


    /**
     * 接口：用于查询教职工导入所需的数据字典
     * @Author: 倪杨
     * @Date: 2019/11/6
     */
    @RequestMapping("/getJzgDataInfo")
    @ResponseBody
    public Map<String,Object> getJzgDataInfo(@RequestBody Map<String,Object> map) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        String table="(select * from SYS_DICT_TYPE a left join SYS_DICT_ITEM b on a.DT_ID =b.DT_ID)";
        String field="DI_ID ID,DI_KEY KEY,DI_VALUE VALUE,DI_ZT ZT";
        List<Map<String, Object>> mz = commonService.selectFieldsByOther(table, field, "DT_CODE='MZ'", null, null);
        List<Map<String, Object>> xb = commonService.selectFieldsByOther(table, field, "DT_CODE='XB'", null, null);
        List<Map<String, Object>> gj = commonService.selectFieldsByOther(table, field, "DT_CODE='GJ'", null, null);
        List<Map<String, Object>> jzgzzmm = commonService.selectFieldsByOther(table, field, "DT_CODE='JZGZZMM'", null, null);
        List<Map<String, Object>> zxszzmm = commonService.selectFieldsByOther(table, field, "DT_CODE='ZXSZZMM'", null, null);
        List<Map<String, Object>> xx = commonService.selectFieldsByOther(table, field, "DT_CODE='XX'", null, null);
        List<Map<String, Object>> xl = commonService.selectFieldsByOther(table, field, "DT_CODE='XLDM'", null, null);

        HashMap<Object, Object> mapKey = new HashMap<>();
        HashMap<Object, Object> mapValue = new HashMap<>();
        for (int i=0;i<mz.size();i++){
            mapKey.put(mz.get(i).get("KEY"),mz.get(i).get("VALUE"));
            mapValue.put(mz.get(i).get("VALUE"),mz.get(i).get("KEY"));
        }
        resultMap.put("mzKey",mapKey);
        resultMap.put("mzValue",mapValue);

        mapKey = new HashMap<>();
        mapValue = new HashMap<>();
        for (int i=0;i<xb.size();i++){
            mapKey.put(xb.get(i).get("KEY"),xb.get(i).get("VALUE"));
            mapValue.put(xb.get(i).get("VALUE"),xb.get(i).get("KEY"));
        }
        resultMap.put("xbKey",mapKey);
        resultMap.put("xbValue",mapValue);

        mapKey = new HashMap<>();
        mapValue = new HashMap<>();
        for (int i=0;i<gj.size();i++){
            mapKey.put(gj.get(i).get("KEY"),gj.get(i).get("VALUE"));
            mapValue.put(gj.get(i).get("VALUE"),gj.get(i).get("KEY"));
        }
        resultMap.put("gjKey",mapKey);
        resultMap.put("gjValue",mapValue);

        mapKey = new HashMap<>();
        mapValue = new HashMap<>();
        for (int i=0;i<jzgzzmm.size();i++){
            mapKey.put(jzgzzmm.get(i).get("KEY"),jzgzzmm.get(i).get("VALUE"));
            mapValue.put(jzgzzmm.get(i).get("VALUE"),jzgzzmm.get(i).get("KEY"));
        }
        resultMap.put("jzgzzmmKey",mapKey);
        resultMap.put("jzgzzmmValue",mapValue);

        mapKey = new HashMap<>();
        mapValue = new HashMap<>();
        for (int i=0;i<zxszzmm.size();i++){
            mapKey.put(zxszzmm.get(i).get("KEY"),zxszzmm.get(i).get("VALUE"));
            mapValue.put(zxszzmm.get(i).get("VALUE"),zxszzmm.get(i).get("KEY"));
        }
        resultMap.put("zxszzmmKey",mapKey);
        resultMap.put("zxszzmmValue",mapValue);

        mapKey = new HashMap<>();
        mapValue = new HashMap<>();
        for (int i=0;i<xx.size();i++){
            mapKey.put(xx.get(i).get("KEY"),xx.get(i).get("VALUE"));
            mapValue.put(xx.get(i).get("VALUE"),xx.get(i).get("KEY"));
        }
        resultMap.put("xxKey",mapKey);
        resultMap.put("xxValue",mapValue);

        mapKey = new HashMap<>();
        mapValue = new HashMap<>();
        for (int i=0;i<xl.size();i++){
            mapKey.put(xl.get(i).get("KEY"),xl.get(i).get("VALUE"));
            mapValue.put(xl.get(i).get("VALUE"),xl.get(i).get("KEY"));
        }
        resultMap.put("xlKey",mapKey);
        resultMap.put("xlValue",mapValue);

        return resultMap;
    }

    @RequestMapping("/getUserExtSfz")
    @ResponseBody
    public Map<String,Object> getUserExtSfz(@RequestBody Map<String,Object> map) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        String table="SYS_USEREXT";
        String field="USEREXT_CODE CODE";
        List<Map<String, Object>> sfz = commonService.selectFieldsByOther(table, field, "USEREXT_CODE is not null", null, null);
        LinkedList<String> list = new LinkedList<>();
        for (int i = 0;i<sfz.size();i++){
            list.add(sfz.get(i).get("CODE").toString());
        }
        resultMap.put("list",list);
        return resultMap;
    }

    @RequestMapping("/getJCDataInfo")
    @ResponseBody
    public Map<String,Object> getJCDataInfo(@RequestBody Map<String,Object> map) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        String table = "(select * from SYS_DICT_TYPE a left join SYS_DICT_ITEM b on a.DT_ID =b.DT_ID)";
        String field = "DI_ID ID,DI_KEY KEY,DI_VALUE VALUE,DI_ZT ZT";
        List<Map<String, Object>> kclx = commonService.selectFieldsByOther(table, field, "DT_CODE='KCLX'", null, null);
        List<Map<String, Object>> xqm = commonService.selectFieldsByOther(table, field, "DT_CODE='XQM'", null, null);
        List<Map<String, Object>> jclx = commonService.selectFieldsByOther(table, field, "DT_CODE='JCLX'", null, null);
        List<Map<String, Object>> kwzd = commonService.selectFieldsByOther(table, field, "DT_CODE='KWZD'", null, null);

        HashMap<Object, Object> mapKey = new HashMap<>();
        HashMap<Object, Object> mapValue = new HashMap<>();
        for (int i = 0; i < kclx.size(); i++) {
            mapKey.put(kclx.get(i).get("KEY"), kclx.get(i).get("VALUE"));
            mapValue.put(kclx.get(i).get("VALUE"), kclx.get(i).get("KEY"));
        }
        resultMap.put("kclxKey", mapKey);
        resultMap.put("kclxValue", mapValue);

        mapKey = new HashMap<>();
        mapValue = new HashMap<>();
        for (int i = 0; i < xqm.size(); i++) {
            mapKey.put(xqm.get(i).get("KEY"), xqm.get(i).get("VALUE"));
            mapValue.put(xqm.get(i).get("VALUE"), xqm.get(i).get("KEY"));
        }
        resultMap.put("xqmKey", mapKey);
        resultMap.put("xqmValue", mapValue);

        mapKey = new HashMap<>();
        mapValue = new HashMap<>();
        for (int i = 0; i < jclx.size(); i++) {
            mapKey.put(jclx.get(i).get("KEY"), jclx.get(i).get("VALUE"));
            mapValue.put(jclx.get(i).get("VALUE"), jclx.get(i).get("KEY"));
        }
        resultMap.put("jclxKey", mapKey);
        resultMap.put("jclxValue", mapValue);

        mapKey = new HashMap<>();
        mapValue = new HashMap<>();
        for (int i = 0; i < kwzd.size(); i++) {
            mapKey.put(kwzd.get(i).get("KEY"), kwzd.get(i).get("VALUE"));
            mapValue.put(kwzd.get(i).get("VALUE"), kwzd.get(i).get("KEY"));
        }
        resultMap.put("kwzdKey", mapKey);
        resultMap.put("kwzdValue", mapValue);
        return resultMap;
    }


    /**
     * 获取已经操作过数据库用户的身份证号码
     * @Author: 倪杨
     * @Date: 2019/12/2
     */
    @RequestMapping("/getCodeInSysBizLog")
    @ResponseBody
    public Map<String, Object> getCodeInSysBizLog(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        String table = "SYS_BIZ_LOG a ,(select c.USER_ID,c.BELONG_ORG_ID,d.USEREXT_CODE from SYS_USER c left join SYS_USEREXT d on c.USER_ID = d.USER_ID) b";
        String tj="a.CREATOR_ID = b.USER_ID and b.USEREXT_CODE is not null and b.BELONG_ORG_ID ='"+map.get("org_id")+"' group by b.USEREXT_CODE";
        List<Map<String, Object>> list = commonService.selectFieldsByOther(table, "USEREXT_CODE \"code\",count(1) \"count\"", tj, null, null);
        resultMap.put("resultCode","200");
        resultMap.put("resultData",list);
        return resultMap;
    }

    @RequestMapping("/updateUserZt")
    @ResponseBody
    public Map<String, Object> updateUserZt(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> maps = commonService.selectFieldsByOther("SYS_USEREXT", "*", "USEREXT_CODE = '" + map.get("sfzhm") + "'", null, null);
            if (maps.isEmpty()){
                throw new Exception("用户扩展表位查询到相应用户的信息");
            }

            Map<String, Object> userFild=new HashMap<String, Object>();
            userFild.put("USER_ZT" , "'"+map.get("upZt")+"'");

            Map<String, Object> userTj=new HashMap<String, Object>();
            userTj.put("USER_ID" , "'"+maps.get(0).get("USER_ID")+"'");

            Boolean b = commonService.updateRule("SYS_USER",userTj,userFild);
            if (b){
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
}
