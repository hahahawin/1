package com.beoneess.reportForm.server.impl;

import com.beoneess.reportForm.mapper.LogMapper;
import com.beoneess.reportForm.server.LogServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class LogServerImpl implements LogServer {

    @Autowired
    LogMapper logMapper;

    /**
     * 查询当天业务操作情况
     * @param map
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> findOneDayLogType(Map<String, Object> map) throws Exception {
        return logMapper.findOneDayLogType(map);
    }

    /**
     * 查询当天业务操作人员情况
     * @param map
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> findOneDayLogUser(Map<String, Object> map) throws Exception {
        return logMapper.findOneDayLogUser(map);
    }

}
