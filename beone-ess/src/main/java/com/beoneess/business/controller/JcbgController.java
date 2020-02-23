package com.beoneess.business.controller;

import com.alibaba.fastjson.JSONObject;
import com.beoneess.business.service.impl.JcbgServiceImpl;
import com.beoneess.common.controller.CommonController;
import com.beoneess.common.controller.ContextHelper;
import com.beoneess.common.service.impl.CommonServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;

import static com.beoneess.common.controller.LoginController.inside_bcca;
import static com.beoneess.common.controller.LoginController.inside_jxsc;

/**
 * @program: beone-jxsc
 * @description: 基础办公
 * @author: 倪杨
 * @create: 2019-11-11
 */
@Controller
@RequestMapping("/jcbg")
public class JcbgController {
    @Value("${filePath}")
    private String GfilePath;

    @Autowired
    JcbgServiceImpl jcbgService;

    @Autowired
    CommonServiceImpl commonService;

    @RequestMapping("/xwtzUploadFile")
    @ResponseBody
    public Map<String,Object> xwtzUploadFile(@RequestParam("file") MultipartFile file, String ASD, String filePath){
        HashMap<String, Object> resultMap = new HashMap<>();
        String oldfileName=file.getOriginalFilename();
        String dirPath = GfilePath + filePath;
        String pathString="";
        File dir = new File(dirPath);
        String fileName = new SimpleDateFormat("yyyyMMddHHmmssSSS").format(new Date())+"_"+oldfileName;
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

    @RequestMapping("/xwtzDelFile")
    @ResponseBody
    public Map<String,Object> xwtzDelFile(@RequestBody Map<String,Object> map) {
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

    @RequestMapping("/getFjList")
    @ResponseBody
    public  List<Map<String, Object>> getFjList (@RequestBody Map<String,Object> map) throws Exception{
        String s1 = ContextHelper.client_bcca(inside_bcca + "jcbg/getFjList", new JSONObject(map), "");
        List<Map<String, Object>> zcsb_fjxx = (List<Map<String, Object>>) JSONObject.parseObject(s1).get("resultData");
        return zcsb_fjxx;
    }

    @RequestMapping("/getBjList")
    @ResponseBody
    public  List<Map<String, Object>> getBjList (@RequestBody Map<String,Object> map) throws Exception{
        String s1 = ContextHelper.client_bcca(inside_jxsc + "jcbg/getBjList", new JSONObject(map), "");
        List<Map<String, Object>> zcsb_fjxx = (List<Map<String, Object>>) JSONObject.parseObject(s1).get("resultData");
        return zcsb_fjxx;
    }

    @RequestMapping("/getInFzxx")
    @ResponseBody
    public Map<String, Object> getInFzxx (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> maps = jcbgService.getInFzxx(map);

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


    @RequestMapping("/getOutFzxx")
    @ResponseBody
    public Map<String, Object> getOutFzxx (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> maps = jcbgService.getOutFzxx(map);

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

    @RequestMapping("/addFzxx")
    @ResponseBody
    public Map<String, Object> addFzxx (@RequestBody Map<String,Object> map){
        System.out.println(map);
        HashMap<String, Object> resultMap = new HashMap<>();
        String seq="seq_"+((Map<String, Object>) map.get("ASD")).get("org_id").toString();
        try {
            String fzxx_id = map.get("fzxx_id").toString();
            String xs_ids = map.get("ids").toString();
            if(xs_ids != null && !"".equals(xs_ids)){
                String[] ids = xs_ids.split(",");
                List<Map<String, Object>> paramsList = new ArrayList<>();
                Map<String, Object> map1 = null;
                for(int i=0;i<ids.length;i++){
                    map1 = new HashMap<>();
                    map1.put("FZRY_ID", CommonController.getSEQ(seq));
                    map1.put("FZXX_ID", fzxx_id);
                    map1.put("USER_ID", ids[i]);
                    map1.putAll(CommonController.getCreat((Map<String, Object>)map.get("ASD")));
                    paramsList.add(map1);
                }
                boolean flg = commonService.addAllData("JCBG_FZRY", paramsList);
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

    @RequestMapping("/delFzxx")
    @ResponseBody
    public Map<String, Object> delFzxx (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String fzxx_id = map.get("fzxx_id").toString();
            String xs_ids = map.get("ids").toString();
            if(xs_ids != null && !"".equals(xs_ids)){
                String[] ids = xs_ids.split(",");
                List<Map<String, Object>> paramsList = new ArrayList<>();
                Map<String, Object> map1 = null;
                for(int i=0;i<ids.length;i++){
                    map1 = new HashMap<>();
                    map1.put("FZXX_ID", fzxx_id);
                    map1.put("USER_ID", ids[i]);
                    paramsList.add(map1);
                }
                boolean flg = jcbgService.delFzxx(paramsList);
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

    /**
     * 加载通讯录list
     * @return
     */
    @RequestMapping("/findTxlOnGr")
    @ResponseBody
    public Map<String,Object> findTxlOnGr(@RequestBody Map<String,Object> map){
        map=(Map<String, Object>)map.get("ASD");
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<HashMap<Object, Object>> treeList = new ArrayList<>();//大树

            //个人分组总数据
            List<Map<String, Object>> grTxlList = commonService.selectFieldsByOther("JCBG_FZXX", "*", "BELONG_ORG_ID = '"+map.get("org_id")+"' and CREATOR_ID='"+map.get("user_id")+"' and FZXX_LX='2' ", null, null);
            grTxlList = ContextHelper.transformListUpperCase(grTxlList);
            HashMap<Object, Object> treeMap = new HashMap<>();
            List<Map<String,Object>> grTreeList = new ArrayList<>();
            Map<String,Object> tree = new HashMap<>();
            for (int i=0;i<grTxlList.size();i++){
                tree = new HashMap<>();
                tree.putAll(grTxlList.get(i));
                tree.put("title",grTxlList.get(i).get("fzxx_mc"));
                tree.put("id",grTxlList.get(i).get("fzxx_id"));
                tree.put("type","1");
                grTreeList.add(tree);
            }
            treeMap.put("title","个人分组");
            treeMap.put("id","1");
            treeMap.put("level","1");
            treeMap.put("notOperating","T");//不要操作按钮
            treeMap.put("children",grTreeList);
            treeList.add(treeMap);

            //部门数据
            String fieldName = "DEPT_ID as \"dept_id\",DEPT_NAME as \"dept_name\",DEPT_PID as \"dept_pid\",DEPT_ZT as \"dept_zt\",DEPT_ZZ as \"dept_zz\",DEPT_FZR as \"dept_fzr\",PNAME as \"pname\"";
            List<Map<String, Object>> sys_dept = commonService.selectFieldsByOther("(select a.*,b.DEPT_NAME PNAME from SYS_DEPT a left join SYS_DEPT b on a.DEPT_PID = b.DEPT_ID)", fieldName, "BELONG_ORG_ID = '"+map.get("org_id")+"'", null, null);
            treeMap = new HashMap<>();
            treeMap.put("title","部门分组");
            treeMap.put("id","2");
            treeMap.put("level","1");
            treeMap.put("notOperating","T");//不要操作按钮
            treeMap.put("children",listToTree(sys_dept));
            treeList.add(treeMap);

            resultMap.put("resultCode","200");
            resultMap.put("list",treeList);
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    //将list集合转成树形结构的list集合
    public static List<Map<String,Object>> listToTree(List<Map<String,Object>> list) {
        //用递归找子节点
        List<Map<String,Object>> treeList = new ArrayList<>();
        for (Map<String,Object> tree : list) {
            if (tree.get("dept_pid").equals("-1")) {
                treeList.add(findChildren(tree, list));
            }
        }
        return treeList;
    }

    //寻找子节点
    private static Map<String,Object> findChildren(Map<String,Object> tree, List<Map<String,Object>> list) {
        for (Map<String,Object> node : list) {
            if (node.get("dept_pid").equals(tree.get("dept_id"))) {
                if (tree.get("children") == null) {
                    tree.put("children",new ArrayList<Map<String,Object>>());
                }
                ((List)tree.get("children")).add(findChildren(node, list));
            }
        }
        tree.put("title",tree.get("dept_name"));
        tree.put("id",tree.get("dept_id"));
        tree.put("notOperating","T");
        tree.put("type","2");
        return tree;
    }

    @RequestMapping("/getInDeptUser")
    @ResponseBody
    public Map<String, Object> getInDeptUser (@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> maps = jcbgService.getInDeptUser(map);

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

    @RequestMapping("/getYjxById")
    @ResponseBody
    public Map<String, Object> getYjxById(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            String id = map.get("yjx_id").toString();
            List<Map<String, Object>> jcbg_yjjl = commonService.selectFieldsByOther("JCBG_YJJL", "*", "YJX_ID ='" + id + "'", "YJX_CLSJ", null);
            jcbg_yjjl = ContextHelper.transformListUpperCase(jcbg_yjjl);
            resultMap.put("resultCode","200");
            resultMap.put("resultData",jcbg_yjjl);
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    @RequestMapping("/insertYjjl")
    @ResponseBody
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> insertYjjl(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            List<Map<String, Object>> paramsList = new ArrayList<>();
            Map<String, Object> map1 =  new HashMap<>();
            map1.put("YJX_ID","'"+map.get("yjx_id")+"'");
            map1.put("YJX_CLR", "'"+map.get("yjx_clr")+"'");
            map1.put("YJX_CLFS", "'"+map.get("yjx_clfs")+"'");
            map1.put("YJX_CLSJ", "sysdate");
            paramsList.add(map1);
            if (commonService.addAllData("JCBG_YJJL", paramsList)){
                HashMap<String, Object> fild = new HashMap<>();
                fild.put("YJX_ZT","1");
                System.out.println("a1."+map.get("type"));
                System.out.println("a2."+map.get("type").equals("gly"));
                System.out.println("a3."+map.get("type").toString().equals("gly"));
                if (map.get("type").toString().equals("gly")){
                    fild.put("YJX_ZT","2");
                    fild.put("YJX_UTYPE", "'"+map.get("user_type")+"'");
                    fild.put("YJX_CLR", "'"+map.get("YJX_CLR")+"'");
                    fild.put("YJX_CLFS", "'"+map.get("YJX_CLFS")+"'");
                    fild.put("YJX_CLSJ", "sysdate");
                }
                HashMap<String, Object> where = new HashMap<>();
                where.put("YJX_ID","'"+map.get("YJX_ID")+"'");
                commonService.updateRule("JCBG_YJX",where,fild);
                resultMap.put("resultCode","200");
                resultMap.put("resultMsg","操作成功");
            }else{
                resultMap.put("resultCode","500");
                resultMap.put("resultMsg","操作失败");
            }
        }catch (Exception e){
            e.printStackTrace();
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询是否是班主任
     * */
    @RequestMapping("/getBzrObj")
    @ResponseBody
    public Map<String, Object> getBzrObj(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String,Object> asd = (Map<String,Object>)map.get("ASD");
            String tableName = "JCBG_FZRY TAB LEFT JOIN JCBG_FZXX SR ON SR.FZXX_ID = TAB.FZXX_ID";
            String tiaojian = " TAB.USER_ID = '"+ asd.get("user_id") +"' AND SR.FZXX_SFNZ = '2' and SR.FZXX_MC = '班主任' and SR.BELONG_ORG_ID = '"+ asd.get("org_id") +"'";
            List<Map<String, Object>> bzrList = commonService.selectFieldsByOther(tableName, "TAB.USER_ID", tiaojian, null, null);
            String flag = "false";
            if(bzrList.size()>0){
                flag = "true";
            }
            resultMap.put("resultCode","200");
            resultMap.put("data",flag);
            String s1 = ContextHelper.client_bcca(inside_jxsc + "jcbg/getXqZgBjList", new JSONObject(map), "");
            if (JSONObject.parseObject(s1).get("resultCode").equals("200")) {
                resultMap.put("bjList",JSONObject.parseObject(s1).get("resultData"));
            } else {
                throw new RuntimeException(JSONObject.parseObject(s1).get("resultMsg").toString());
            }

        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询是否档案专员
     * */
    @RequestMapping("/getDazyObj")
    @ResponseBody
    public Map<String, Object> getDazyObj(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String,Object> asd = (Map<String,Object>)map.get("ASD");
            String tableName = "JCBG_FZRY TAB LEFT JOIN JCBG_FZXX SR ON SR.FZXX_ID = TAB.FZXX_ID";
            String tiaojian = " TAB.USER_ID = '"+ asd.get("user_id") +"' AND SR.FZXX_SFNZ = '2' and SR.FZXX_MC = '档案专员' and SR.BELONG_ORG_ID = '"+ asd.get("org_id") +"'";
            List<Map<String, Object>> bzrList = commonService.selectFieldsByOther(tableName, "TAB.USER_ID", tiaojian, null, null);
            String flag = "false";
            if(bzrList.size()>0){
                flag = "true";
            }
            resultMap.put("resultCode","200");
            resultMap.put("data",flag);
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    /**
     * 查询当前时间到之后5分钟之内的便签list并将以前的数据加载为已过期状态
     * @Author: 倪杨
     * @Date: 2019/12/27
     */
    @RequestMapping("/getUserNote")
    @ResponseBody
    public Map<String, Object> getUserNote(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                HashMap<String, Object> map1 = new HashMap<>();
                map1.put("user_id",map.get("user_id"));
                //查询当前时间到之后5分钟之内的便签list
                List<Map<String, Object>> bqDq = jcbgService.findBqDq(map1);
                bqDq = ContextHelper.transformListUpperCase(bqDq);
                //将为打开的确认的便签改为已过期（4）
                map1.put("ZT","'4'");
                Boolean dq = jcbgService.updateBqDq(map1);
                resultMap.put("resultCode","200");
                resultMap.put("resultData",bqDq);
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }

    @RequestMapping("/findNowDateNote")
    @ResponseBody
    public Map<String, Object> findNowDateNote(@RequestBody Map<String,Object> map){
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                HashMap<String, Object> map1 = new HashMap<>();
                map1.put("user_id",map.get("user_id"));
                //查询当前时间到之后5分钟之内的便签list
                List<Map<String, Object>> bqDq = jcbgService.findBqDq(map1);
                resultMap.put("resultCode","200");
                resultMap.put("count",bqDq.size());
                resultMap.put("data",bqDq);
                resultMap.put("code",0);
                resultMap.put("msg","");
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
