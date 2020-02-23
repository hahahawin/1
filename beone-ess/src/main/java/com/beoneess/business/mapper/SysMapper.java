package com.beoneess.business.mapper;

import java.util.List;
import java.util.Map;

/**
 * 系统管理Mapper
 */
public interface SysMapper {

    /**
     * 根据特殊条件查询
     * @param map
     * @date 2019-08-07
     */
    List<Map<String, Object>> findDgRight(Map<String, Object> map)throws Exception;

    /**
     * 查询组织授权菜单
     * @param map
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> findOrgRight(Map<String, Object> map) throws Exception;

    /**
     * 角色授权组织菜单查询
     * lch
     * 2019-09-05
     * */
    List<Map<String, Object>> findDgOrgRight(Map<String, Object> map) throws Exception;

    /**
     * 角色授权用户列表查询
     * lch
     * 2019-09-06
     * */
    Integer selRoleUserCount(Map<String, Object> map)throws Exception;
    List<Map<String, Object>> selRoleUserOnPage(Map<String, Object> map)throws Exception;


    /**
     * 删除角色用户
     * lch
     * 2019-09-06
     * */
    void delRoleUser(Map<String, Object> map)throws Exception;

    /**
     * 查询拥有权限的菜单编码
     * lch
     * 2019-09-09
     * */
    List<Map<String, Object>> findRightCode(Map<String, Object> map)throws Exception;

    /**
     * 查询用户角色
     * lch
     * 2019-09-25
     * */
    List<Map<String, Object>> selUserRole(Map<String , Object> map)throws Exception;

    /**
     * 查询用户权限
     * lch
     * 2019-09-25
     * */
    List<Map<String, Object>> selUserRight(Map<String , Object> map)throws Exception;

    /**
     * 通过用户ID查询token
     * @param map
     * @throws Exception
     */
    String findUserToken(Map<String, Object> map) throws Exception;

    /**
     * 查询菜单按钮权限
     * lch
     * 2019-10-08
     * */
    List<Map<String, Object>> selRightButton(Map<String, Object> map)throws Exception;

    /**
     * 查询日志列表
     * lch
     * 2019-10-18
     * */
    Integer findBizLogOnPageCount(Map<String, Object> map)throws Exception;
    List<Map<String, Object>> findBizLogOnPage(Map<String, Object> map)throws Exception;


    Boolean delBbwhZzgx(Map<String, Object> map)throws Exception;

    /**
     * 通过账户查询用户信息
     * lch
     * 2019-11-30
     */
    List<Map<String, Object>> selUserByUserAccount(Map<String, Object> map)throws Exception;

    /**
     * 加载自定义菜单
     * lch
     * 2020-02-12
     */
    List<Map<String,Object>> loadZdycdTree(Map<String,Object> map)throws Exception;

    /**
     * 查询自定义菜单
     * lch
     * 2020-02-13
     * */
    List<Map<String, Object>> findZdycd(Map<String, Object> map)throws Exception;

    /**
     * 自定义快捷菜单列表 查询
     * lch
     * 2020-02-17
     * */
    Integer loadKjcdListCount(Map<String, Object> map)throws Exception;
    List<Map<String, Object>> loadKjcdList(Map<String, Object> map)throws Exception;

    /**
     * 快捷菜单 查询
     * lch
     * 2020-02-17
     * */
    List<Map<String, Object>> selKjcdAll(Map<String, Object> map)throws Exception;

    /**
     * 删除没有在组织授权中的快捷菜单
     * lch
     * 2020-02-18
     * */
    void delKjcdNotExistsorg(Map<String, Object> map)throws Exception;


}
