package com.beoneess.reportForm.controller;

import com.beoneess.common.controller.CommonController;
import com.beoneess.reportForm.server.impl.LogServerImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 罗飞
 * 2019-10-31
 * 日志统计报表
 */
@Controller
@RequestMapping("/log")
public class logController {

    @Autowired
    private LogServerImpl logServer;

    //当天业务操作排名情况
    @RequestMapping("/findOneDayLogType")
    @ResponseBody
    public Map<String,Object> findOneDayLogType(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                List<Map<String, Object>> list =logServer.findOneDayLogType(map);
                resultMap.put("resultCode","200");
                resultMap.put("resultData",list);
            }else {
                resultMap.putAll(asd);
            }
        }catch (Exception e){
            resultMap.put("resultCode","500");
            resultMap.put("resultMsg",e.getMessage());
        }
        return resultMap;
    }


    //当天业务操作排名情况
    @RequestMapping("/findOneDayLogUser")
    @ResponseBody
    public Map<String,Object> findOneDayLogUser(@RequestBody Map<String,Object> map) throws Exception{
        HashMap<String, Object> resultMap = new HashMap<>();
        try {
            //基础数据验证
            Map<String, Object> asd = CommonController.ASD(map);
            if ("200".equals(asd.get("resultCode"))){
                List<Map<String, Object>> list =logServer.findOneDayLogUser(map);
                resultMap.put("resultCode","200");
                resultMap.put("resultData",list);
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
