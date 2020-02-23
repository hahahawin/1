package com.beoneess.business.service;

import java.util.List;
import java.util.Map;

/**
 * 系统管理业务层
 */
public interface SysService {

    /**
     * 组织菜单授权
     * lch
     * 2019-08-16
     * */
    void orgGrant(Map<String,Object> map) throws Exception;

    /**
     * 查询递归菜单
     * @param map
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> findDgRight(Map<String, Object> map) throws Exception;

    /**
     * 查询组织授权菜单
     * @param map
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> findOrgRight(Map<String, Object> map) throws Exception;

    /**
     * 角色授权用户列表查询
     * lch
     * 2019-09-06
     * */
    Map<String, Object> selRoleUser(Map<String , Object> params)throws Exception;

    /**
     * 删除角色用户
     * lch
     * 2019-09-16
     * */
    void delRoleUser(List<Map<String, Object>> paramsList)throws Exception;

    /**
     * 获取用户的token
     * @param user_id
     * @return
     * @throws Exception
     */
    String findUserToken(String user_id) throws Exception ;
}
