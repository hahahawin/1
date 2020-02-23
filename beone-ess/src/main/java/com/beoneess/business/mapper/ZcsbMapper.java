package com.beoneess.business.mapper;

import com.beoneess.business.domain.SbzcLx;

import java.util.List;
import java.util.Map;

/**
 * 系统管理Mapper
 */
public interface ZcsbMapper {

    /**
     * 房间列表 查询
     * lch
     * 2019-10-14
     * */
    Integer findFjxxOnPageCount(Map<String, Object> map)throws Exception;
    List<Map<String, Object>> findFjxxOnPage(Map<String, Object> map)throws Exception;

    /**
     * 设备账户分页查询
     * lch
     * 2019-10-24
     * */
    Integer selSmhlistCount(Map<String, Object> map)throws Exception;
    List<Map<String, Object>> selSmhlist(Map<String, Object> map)throws Exception;

    /**
     * 添加设备类型模板
     * */
    void insertSblxMb(Map<String, String> map)throws Exception;

    /**
     * 设置设备web端模板
     * lch
     * 2019-10-15
     * */
    void insertWebSbMb(Map<String, Object> map)throws Exception;

    /**
     * 设置设备app端模板
     * lch
     * 2019-10-15
     * */
    void insertAppSbMb(Map<String, Object> map)throws Exception;

    /**
     * 设置设备web端模板
     * lch
     * 2019-10-15
     * */
    void setWebSbMb(Map<String, Object> map)throws Exception;

    /**
     * 设置设备app端模板
     * lch
     * 2019-10-15
     * */
    void setAppSbMb(Map<String, Object> map)throws Exception;

    /**
     * 查询web端模板代码
     * lch
     * 2019-10-16
     */
    String selSblxWebMb(Map<String, Object> map)throws Exception;

    /**
     * 查询app端模板代码
     * lch
     * 2019-10-16
     */
    String selSblxAppMb(Map<String, Object> map)throws Exception;

    /**
     * 通过账户取设备类型
     * lch
     * 2019-11-19
     * */
    List<SbzcLx> selZcsbLxByAccount(Map<String , Object> map)throws Exception;


}
