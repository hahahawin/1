package com.beoneess.business.domain;

import org.springframework.stereotype.Component;

/**
 * @program: beone-ess
 * @description: 设备类型
 * @author: lch
 * @create: 2019-11-19 09:37
 */
@Component
public class SbzcLx {

    private String mldm;
    private String mlmc;
    private String htmlmodle;

    public String getMldm() {
        return mldm;
    }

    public void setMldm(String mldm) {
        this.mldm = mldm;
    }

    public String getMlmc() {
        return mlmc;
    }

    public void setMlmc(String mlmc) {
        this.mlmc = mlmc;
    }

    public String getHtmlmodle() {
        return htmlmodle;
    }

    public void setHtmlmodle(String htmlmodle) {
        this.htmlmodle = htmlmodle;
    }
}
