package com.beoneess.business.mapper;

import java.util.List;
import java.util.Map;

public interface JcbgMapper {
    List<Map<String,Object>> findBqDq(Map<String, Object> map)throws Exception;
    Boolean updateBqDq(Map<String, Object> map)throws Exception;

    Boolean delFzxx(Map<String, Object> map)throws Exception;
}
