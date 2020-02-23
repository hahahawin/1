package com.beoneess.reportForm.mapper;

import java.util.List;
import java.util.Map;

public interface LogMapper {

    /**
     * 查询当天业务操作情况
     * @param map
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> findOneDayLogType(Map<String, Object> map) throws Exception ;

    /**
     * 查询当天业务操作人员情况
     * @param map
     * @return
     * @throws Exception
     */
    List<Map<String, Object>> findOneDayLogUser(Map<String, Object> map) throws Exception ;

}
