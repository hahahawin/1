package com.beoneess.common.service;

import java.util.List;
import java.util.Map;

/**
 * 通用业务层
 */
public interface CommonService {

    /**
     * 列表查询
     * @param params 参数
     * @date 2019-08-07
     * */
    List<Map<String, Object>> find(Map<String , Object>params)throws Exception;

    /**
     * 分页查询
     * @param params 参数
     * @date 2019-08-07
     * */
    Map<String, Object> findOnPage(Map<String , Object> params)throws Exception;

    /**
     * 添加数据
     * @param params	参数列表
     * @return			true：添加成功 false: 添加失败
     * @date 2019-08-07
     */
    boolean insert(Map<String , Object> params)throws Exception;

    /**
     * 修改数据
     * @param params	修改参数map（key:字段名  value:数据值）
     * @return			true：修改成功 false: 修改失败
     * @date 2019-08-07
     */
    boolean update(Map<String , Object> params)throws Exception;

    /**
     * 删除数据
     * @param params	参数列表
     * @return			true: 删除成功 false: 删除失败
     * @date 2019-08-07
     */
    boolean delete(Map<String, Object> params)throws Exception;

    /**
     * 获取序列
     * @date 2019-08-07
     */
    String getNextId(Map<String, Object> map)throws Exception;

    /**
     * 特殊查询条件
     * @param tableName	表名
     * @param fieldName	所需查询的字段名
     * @param tiaojian	条件
     * @return
     */
    List<Map<String, Object>> selectFieldsByOther(String tableName,String fieldName,String tiaojian,String orderName,String groupName)throws Exception;

    /**
     * 查询单条数据
     * @param tableName	表名
     * @param params	查询条件 map（key:字段名  value:数据值）
     * @return
     */
    Map<String, Object> getDataByKeys(String tableName, Map<String , Object>params)throws Exception;

    /**
     * 添加多条数据
     * @param tableName	表名
     * @param params	参数列表
     * @return			true：修改成功 false: 修改失败
     */
    boolean addAllData(String tableName,List<Map<String, Object>> paramsList);





//    /**
//     * 根据子查询添加数据
//     * @param tableName	表名
//     * @param params	子查询字段
//     * @return			true：修改成功 false: 修改失败
//     */
//    public boolean addDataSelect(String tableName,String keys,String params);
//
//    /**
//     * 根据其他条件删除数据
//     * @param tableName	表名
//     * @param params	参数列表
//     * @return			true: 删除成功 false: 删除失败
//     */
//    public boolean deleteDatabyOther(String tableName,String tiaojian);
//
//    /**
//     * 根据其他条件修改数据
//     * @param tableName	表名
//     * @return			true: 修改成功 false: 修改失败
//     */
//    public boolean UpdateOther(String tableName);

//    /**
//     * 查询多条数据
//     * @param tableName	表名
//     * @param params	查询条件 map（key:字段名  value:数据值）
//     * @param orderName	排序条件（所需排序的字段名）
//     * @return
//     */
//    public List<Map<String, Object>> getAllDataByKeys(String tableName,Map<String , Object>params,String orderName);
//    /**
//     * 多表查询数据（条件为=）
//     * @param tableName	表名
//     * @param params	查询条件 map（key:字段名  value:数据值）
//     * @param orderName	排序条件（所需排序的字段名）
//     * @return
//     */
//    public List<Map<String, Object>> selectAllDataByKeys(String tableName,Map<String , Object>params,String orderName);
//
//    /**
//     * 调用存储过程
//     * @param name		存储过程名
//     * @param params	参数（多个参数，隔开）
//     */
//    public void cellProcedure(String name,String params);


}

