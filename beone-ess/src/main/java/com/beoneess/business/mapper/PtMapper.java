package com.beoneess.business.mapper;

import java.util.List;
import java.util.Map;

/**
 * 系统管理Mapper
 */
public interface PtMapper {

    /**
     * 插入序列
     * @param map
     * @date 2019-08-07
     */
    Boolean insertSeq(Map<String, Object> map)throws Exception;

    /**
     * 组织注册审批查询
     * lch
     * 2019-10-21
     * */
    Integer selOrgListByZcspCount(Map<String, Object> map)throws Exception;
    List<Map<String, Object>> selOrgListByZcsp(Map<String, Object> map)throws Exception;

    /**
     * 组织查询
     * lch
     * 2019-10-25
     * */
    List<Map<String,Object>> selOrgList(Map<String,Object> map) throws Exception;

    /**
     * 组织修改审批查询
     * lch
     * 2019-10-25
     * */
    Integer orgEditListCount(Map<String, Object> map)throws Exception;
    List<Map<String, Object>> orgEditList(Map<String, Object> map)throws Exception;


    /**
     *  获取版本类型的list
     * @Author: 倪杨
     * @Date: 2019/11/5
     */
    List<Map<String,Object>> getBblx() throws Exception;

    /**
     * 发布年份查询
     * */
    List<Map<String,Object>> getFbnf() throws Exception;

    /**
     * 删除版本与组织的关系
     * @Author: 倪杨
     * @Date: 2019/11/6
     */
    Boolean delBbwhZzgx(Map<String, Object> map)throws Exception;

    /**
     * 组织用户 查询
     * lch
     * 2019-12-24
     * */
    Integer selOrgUserlistCount(Map<String, Object> map)throws Exception;
    List<Map<String, Object>> selOrgUserlist(Map<String, Object> map)throws Exception;

    /**
     * 查询广告内容
     * lch
     * 2019-12-25
     * */
    Integer selGgnrOnPageCount(Map<String, Object> map)throws Exception;
    List<Map<String, Object>> selGgnrOnPage(Map<String, Object> map)throws Exception;

}
