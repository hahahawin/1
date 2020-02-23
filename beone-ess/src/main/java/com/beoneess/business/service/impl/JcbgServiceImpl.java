package com.beoneess.business.service.impl;

import com.beoneess.business.mapper.JcbgMapper;
import com.beoneess.common.controller.ContextHelper;
import com.beoneess.common.service.impl.CommonServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 平台管理业务层实现
 */
@Service
public class JcbgServiceImpl {

    @Autowired
    JcbgMapper jcbgMapper;

    @Autowired
    CommonServiceImpl commonService;

    public List<Map<String, Object>> findBqDq(Map map) throws Exception{
        List<Map<String, Object>> bqDq = jcbgMapper.findBqDq(map);
        return  bqDq;
    }

    public Boolean updateBqDq(Map map) throws Exception{
        Boolean bqDq = jcbgMapper.updateBqDq(map);
        return  bqDq;
    }

    public List<Map<String,Object>> getInFzxx(Map<String,Object> map) throws Exception {
        String tj = " tab.BELONG_ORG_ID = '"+map.get("org_id")+"' and tab.USER_TYPE = '3'";
        if (map.get("tj")!=null&&map.get("tj")!=""){
            Map<String, Object> yfbtj = (Map<String, Object>) map.get("tj");
            for (String key:yfbtj.keySet()){
                String t1 = "TAB."+key + " like '%"+yfbtj.get(key)+"%'";
                tj+=" and "+t1;
            }
        }
        String table="(select * from (select a.USER_ID,a.USER_NAME,a.USER_TYPE,a.BELONG_ORG_ID,b.USEREXT_XB,b.USEREXT_LXDH from SYS_USER a left join SYS_USEREXT b on a.USER_ID = b.USER_ID and a.USER_TYPE = '3') TAB WHERE EXISTS(SELECT 1 FROM JCBG_FZRY SR WHERE SR.USER_ID = TAB.USER_ID and sr.FZXX_ID='"+map.get("fzxx_id")+"') and "+tj+")";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, "*", null, null, null);
        maps = ContextHelper.transformListUpperCase(maps);
        return maps;
    }

    @Transactional(rollbackFor = Exception.class)
    public List<Map<String,Object>> getOutFzxx(Map<String,Object> map) throws Exception {
        String tj = " tab.BELONG_ORG_ID = '"+map.get("org_id")+"' and tab.USER_TYPE = '3'";
        if (map.get("tj")!=null&&map.get("tj")!=""){
            Map<String, Object> yfbtj = (Map<String, Object>) map.get("tj");
            for (String key:yfbtj.keySet()){
                String t1 = "TAB."+key + " like '%"+yfbtj.get(key)+"%'";
                tj+=" and "+t1;
            }
        }
        String table="(select * from (select a.USER_ID,a.USER_NAME,a.USER_TYPE,a.BELONG_ORG_ID,b.USEREXT_XB,b.USEREXT_LXDH from SYS_USER a left join SYS_USEREXT b on a.USER_ID = b.USER_ID and a.USER_TYPE = '3' and a.USER_ISADMIN !='2') TAB WHERE not EXISTS(SELECT 1 FROM JCBG_FZRY SR WHERE SR.USER_ID = TAB.USER_ID and sr.FZXX_ID='"+map.get("fzxx_id")+"') and "+tj+")";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, "*", null, null, null);
        maps = ContextHelper.transformListUpperCase(maps);
        return maps;
    }

    @Transactional(rollbackFor = Exception.class)
    public Boolean delFzxx(List<Map<String, Object>> paramsList)throws Exception{
        Boolean b=false;
        for(int i=0;i<paramsList.size();i++){
            b = jcbgMapper.delFzxx(paramsList.get(i));
        }
        return b;
    }

    public List<Map<String,Object>> getInDeptUser(Map<String,Object> map) throws Exception {
        String tj = " tab.BELONG_ORG_ID = '"+map.get("org_id")+"' ";
        if (map.get("tj")!=null&&map.get("tj")!=""){
            Map<String, Object> yfbtj = (Map<String, Object>) map.get("tj");
            for (String key:yfbtj.keySet()){
                String t1 = "TAB."+key + " like '%"+yfbtj.get(key)+"%'";
                tj+=" and "+t1;
            }
        }
        String table="(select * from (select a.*,b.USEREXT_LXDH from SYS_USER a left join SYS_USEREXT b on a.USER_ID = b.USER_ID) tab where EXISTS(select 1 from SYS_DUSER sr where tab.USER_ID = sr.USER_ID and sr.DEPT_ID in(select o.DEPT_ID from SYS_DEPT o start with DEPT_ID = '"+map.get("dept_id")+"' connect by prior o.DEPT_ID = o.DEPT_PID)) and "+tj+")";
        List<Map<String, Object>> maps = commonService.selectFieldsByOther(table, "*", null, null, null);
        return maps;
    }


}