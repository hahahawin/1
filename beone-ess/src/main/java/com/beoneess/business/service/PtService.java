package com.beoneess.business.service;

import java.util.List;
import java.util.Map;

/**
 * 平台业务层
 */
public interface PtService {

    /**
     * 插入组织平台
     * @param params
     * @return
     * @throws Exception
     */
    public boolean insertOrg(Map<String, Object> params) throws Exception;

}
