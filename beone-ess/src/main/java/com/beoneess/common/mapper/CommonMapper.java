package com.beoneess.common.mapper;

import java.util.List;
import java.util.Map;

/**
 * 通用数据库操作代码
 */
public interface CommonMapper{

    /**
     * 列表查询
     * @param map
     * @date 2019-08-07
     */
    List<Map<String, Object>> find(Map<String, Object> map)throws Exception;

    /**
     * 数量查询
     * @param map
     * @date 2019-08-07
     * */
    Integer findOnPageCount(Map<String, Object> map)throws Exception;

    /**
     * 分页查询
     * @param map
     * @date 2019-08-07
     * */
    List<Map<String, Object>> findOnPage(Map<String, Object> map)throws Exception;

    /**
     * 添加
     * @param map
     * @date 2019-08-07
     */
    boolean insert(Map<String, Object> map)throws Exception;

    /**
     * 修改
     * @param map
     * @date 2019-08-07
     */
    boolean update(Map<String, Object> map)throws Exception;

    /**
     * 删除
     * @param map
     * @date 2019-08-07
     */
    boolean delete(Map<String, Object> map)throws Exception;

    /**
     * 获取序列
     * @date 2019-08-07
     */
    String getNextId(Map<String, Object> map)throws Exception;

    /**
     * 根据特殊条件查询
     * @param map
     * @date 2019-08-07
     */
    List<Map<String, Object>> selectFieldsByOther(Map<String, Object> map)throws Exception;

    /**
     * 通用查询单条数据操作
     * @param map
     * @return
     */
    Map<String, Object> getByKeys(Map<String, Object> map)throws Exception;

    /**
     * 通用添加多条数据
     * @param map
     * @return
     */
    public boolean addAll(Map<String, Object> map);

    /**
     * 调用函数获取内容
     * lch
     * 2019-09-09
     * */
    String selContent(Map<String, Object> map)throws Exception;

//    /**
//     * 根据查询插入新数据
//     * @param map
//     * @return
//     */
//    public boolean addandSelect(Map<String, Object> map);
//
//    /**
//     * 根据其他删除删除操作
//     * @param map
//     * @return
//     */
//    public boolean deletebyOther(Map<String, Object> map);
//
//    /**
//     * 根据其他条件修改
//     * @param map
//     * @return
//     */
//    public boolean updateOther(Map<String, Object> map);

//
//    /**
//     * 查询多条
//     * @param map
//     * @return
//     */
//    public List<Map<String, Object>> getAllByKeys(Map<String, Object> map);
//    /**
//     * 多表查询（条件为=）
//     * @param map
//     * @return
//     */
//    public List<Map<String, Object>> selectAllByKeys(Map<String, Object> map);
//    /**
//     * 分组查询（条件为=）
//     * @param map
//     * @return
//     */
//    public List<Map<String, Object>> selectFieldsByGroup(Map<String, Object> map);
//    /**
//     * 调用存储过程
//     * @param name	存储过程名称
//     * @param can	参数
//     * @return
//     */
//    public void cellProcedure(Map<String, Object> map);

}
