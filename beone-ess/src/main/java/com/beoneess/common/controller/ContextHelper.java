package com.beoneess.common.controller;

import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.InetAddress;
import java.net.URL;
import java.net.UnknownHostException;
import java.util.*;

/**
 * 公告方法
 * */
public class ContextHelper {

    /**
     * 获取对象工厂
     * @param tClass
     * @return
     */
    public static Object getBean(String tClass) {
        ServletContext sc = getRequest().getSession().getServletContext();
        ApplicationContext ctx = WebApplicationContextUtils.getWebApplicationContext(sc);
        return  ctx.getBean(tClass);
    }

    /**
     * 获取requestAttributes
     * @return
     */
    public static ServletRequestAttributes getRequestAttributes() {
        return (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
    }

    /**
     * 获取request
     * @return
     */
    public static HttpServletRequest getRequest() {
        return getRequestAttributes().getRequest();
    }

    /**
     * 获取IP地址
     * @return
     */
    public static String getIP(){
        String IpAddress = null;
        try {
            IpAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
        return IpAddress;
    }

    /**
     * 获取转换后的字段
     */
    public static String getFild(String tableName,String fild){
        HashMap<String, Object> fileMap = (HashMap<String, Object>) tableFileMap.get(tableName);
        if(fileMap==null)
            return null ;
        fild = fild.toUpperCase();
        if(fileMap.get(fild)==null || fileMap.get(fild).equals("")){
            return null ;
        }else{
            return fileMap.get(fild).toString() ;
        }
    }

    /**
     * 字段转换方法
     */
    public static String getChangeFild(String tableName,String filds){
        String fildStr = "";
        HashMap<String, Object> fileMap = (HashMap<String, Object>) tableFileMap.get(tableName);
        if(fileMap==null||fileMap.size()==0)
            return null ;
        filds = filds.toUpperCase();
        String fileds[] = filds.split(",");
        String filed = "";
        if( fileds.length <= 0 ){
            fildStr = null ;
        }else{
            for(int i=0;i<fileds.length;i++){
                if(fileMap.get(fileds[i])==null || fileMap.get(fileds[i]).equals("")){
                    fildStr = null ;
                    break;
                }else {
                    //s.toUpperCase()   字母小写转大写
                    //s.toLowerCase()   字母大写转小写
                    filed = fileds[i].toLowerCase();
                    fildStr += fileMap.get(fileds[i]).toString() + " AS \""+filed+"\"," ;
                }
            }
        }
        if(fildStr.length()>0)
            fildStr = fildStr.substring(0,fildStr.length()-1) ;
        return fildStr;
    }

    /**
     * 字段转换方法2,当前台未传入fileName 或 传入的是空值时，返回参照表中所有的字段
     */
    public static String getTableAllFild(String tableName){
        String fildStr = "";
        String filed = "";
        HashMap<String, Object> fileMap = (HashMap<String, Object>) tableFileMap.get(tableName);
        if(fileMap==null||fileMap.size()==0)
            return null ;
        for(String key:fileMap.keySet()){
            filed = key.toLowerCase();
            fildStr += fileMap.get(key) + " AS \""+filed+"\"," ;
        }
        if(fildStr.length()>0)
            fildStr = fildStr.substring(0,fildStr.length()-1) ;
        return fildStr;
    }


    /**
     * 静态公共字段
     */
    public final static HashMap<String, Object> fildMap = new HashMap();
    static {
        fildMap.put("ATT1","ATTR_1");
        fildMap.put("ATT2","ATTR_2");
        fildMap.put("ATT3","ATTR_3");
        fildMap.put("ATT4","ATTR_4");
        fildMap.put("CREA_ID","CREATOR_ID");
        fildMap.put("CREA_NAME","CREATOR_NAME");
        fildMap.put("CREA_TIME","CREATED_TIME");
        fildMap.put("EDIT_ID","EDITOR_ID");
        fildMap.put("EDIT_NAME","EDITOR_NAME");
        fildMap.put("EDIT_TIME","EDITED_TIME");
        fildMap.put("BORG_ID","BELONG_ORG_ID");
    }


    /**
     * CLOB大字段静态资源
     */
    public final static HashMap<String, Object> clobMap = new HashMap();
    static {
        //基础办公
        clobMap.put("JCBG_XWTZ","XWTZ_NR,XWTZ_FJXX");
        clobMap.put("JCBG_YJX","YJX_NR");
        //平台业务
        clobMap.put("PT_GGNR","GGNR_FJ,");
        clobMap.put("PT_YGDA","YGDA_ZP");
        clobMap.put("PT_CDYD","CDYD_TBXX");
        //版本管理
        clobMap.put("PT_PTBBWH","PTBBWH_FBNR");
        //组织管理
        clobMap.put("PT_ORG_INFO","INFO_GDBJFW");
        //日志中心
        clobMap.put("SYS_BIZ_LOG","LOG_CONT");
        clobMap.put("SYS_BCCA_LOG","LOG_CONT");
        clobMap.put("SYS_APP_LOG","LOG_CONT");
        clobMap.put("SYS_APP_BLOG","LOG_CONT");
        //系统权限
        clobMap.put("SYS_USEREXT","USEREXT_FJSON,USEREXT_FACE,USEREXT_TOKEN,USEREXT_DLSJ,USEREXT_PTCS,USEREXT_QDCS");
    }


    /**
     * 静态资源表
     */
    public final static HashMap<String, Object> tableMap = new HashMap();
    static {
        //系统参数
        tableMap.put("ess3","SYS_DICT_TYPE");//字典类型
        tableMap.put("ess5","SYS_DICT_ITEM");//字典参数
        tableMap.put("ess7","SYS_CONFIG");//系统参数
        //日志中心
        tableMap.put("ess4","SYS_BIZ_LOG");//系统日志
        tableMap.put("ess29", "SYS_BCCA_LOG");//BCCA操作日志
        //系统权限
        tableMap.put("ess1","SYS_RIGHT");//权限
        tableMap.put("ess2","SYS_USER");//用户
        tableMap.put("ess16","SYS_USEREXT");//用户扩展
        tableMap.put("ess13","SYS_ROLE");//角色
        tableMap.put("ess8","SYS_DEPT");//部门
        tableMap.put("ess53","SYS_ZDYCD");//自定义菜单
        tableMap.put("ess54","SYS_ZDYCD_ORG");//自定义菜单组织关联表
        tableMap.put("ess55","SYS_ZDYCD_KJCD");//自定义菜单快捷菜单
        //教育管理
        tableMap.put("ess9","SYS_XDGL");//学段管理
        tableMap.put("ess10","SYS_XNDGL");//学年度管理
        tableMap.put("ess11","SYS_XQGL");//学期管理
        tableMap.put("ess12","SYS_JBGL");//届别管理
        //平台业务
        tableMap.put("ess6","PT_ORG");//组织
        tableMap.put("ess15","PT_ORG_KTJL");//组织开通、停用历史表
        tableMap.put("ess17","PT_ORG_INFO");//组织扩展表
        tableMap.put("ess18","PT_GGW");//广告位
        tableMap.put("ess19","PT_GGNR");//广告内容
        tableMap.put("ess30", "PT_YGDA");//员工档案
        tableMap.put("ess42", "PT_XTRJLX");//系统软件类型
        tableMap.put("ess43", "PT_PTBBWH");//平台版本维护
        tableMap.put("ess56", "PT_BZZX");//帮助中心c
        tableMap.put("ess57", "PT_CDYD");//菜单引导
        tableMap.put("ess58", "PT_JFGZ");//积分规则
        tableMap.put("ess59", "PT_JFDJSZ");//积分等级设置
        //基础办公
        tableMap.put("ess47", "JCBG_BQGL");//便签管理
        tableMap.put("ess48", "JCBG_XWTZ");//新闻通知
        tableMap.put("ess49", "JCBG_FZXX");//分组信息
        tableMap.put("ess50", "JCBG_FZRY");//分组人员
        tableMap.put("ess51", "JCBG_YJX");//意见箱
        tableMap.put("ess52", "JCBG_YJJL");//处理结果记录表
        //资产设备
        tableMap.put("ess23", "SMH_DEVICE");//设备参数配置
        tableMap.put("ess24", "SMH_SETTING");//设备账户
        tableMap.put("ess25", "SBZC_LX");//设备资产类型
        tableMap.put("ess27", "SBZC_SBXX");//平台设备

    }


    /**
     * 静态表字段
     */
    public final static HashMap<String, Object> tableFileMap = new HashMap();
    static {

        //权限类型表SYS_RIGHT  ess1
        HashMap<String, Object> rightMap = new HashMap() ;
        rightMap.put("ID","RIGHT_ID");
        rightMap.put("NAME","RIGHT_NAME");
        rightMap.put("TYPE","RIGHT_TYPE");
        rightMap.put("CODE","RIGHT_CODE");
        rightMap.put("URL","RIGHT_URL");
        rightMap.put("PID","RIGHT_PID");
        rightMap.put("RORDER","RIGHT_ORDER");
        rightMap.put("YWPT","RIGHT_YWPT");
        rightMap.put("GXNAME","RIGHT_GXNAME");
        rightMap.put("ICON","RIGHT_ICON");
        rightMap.putAll(fildMap);
        tableFileMap.put("SYS_RIGHT",rightMap);

        //用户表SYS_USER   ess2
        HashMap<String, Object> userMap = new HashMap() ;
        userMap.put("ID","USER_ID");
        userMap.put("ACCOUNT","USER_ACCOUNT");
        userMap.put("PASSWORD","USER_PASSWORD");
        userMap.put("NAME","USER_NAME");
        userMap.put("TYPE","USER_TYPE");
        userMap.put("ZT","USER_ZT");
        userMap.put("ISADMIN","USER_ISADMIN");
        userMap.put("ORG_ID","BELONG_ORG_ID");
        userMap.putAll(fildMap);
        tableFileMap.put("SYS_USER",userMap);

        //字典类型表SYS_DICT_TYPE  ess3
        HashMap<String, Object> dictTypeMap = new HashMap() ;
        dictTypeMap.put("ID","DT_ID");
        dictTypeMap.put("NAME","DT_NAME");
        dictTypeMap.put("CODE","DT_CODE");
        dictTypeMap.put("ZT","DT_ZT");
        dictTypeMap.putAll(fildMap);
        tableFileMap.put("SYS_DICT_TYPE",dictTypeMap);

        //系统日志SYS_BIZ_LOG  ess4
        HashMap<String, Object> bizLogMap = new HashMap() ;
        bizLogMap.put("ID","LOG_ID");
        bizLogMap.put("TYPE","LOG_TYPE");
        bizLogMap.put("CODE","LOG_CODE");
        bizLogMap.put("CONT","LOG_CONT");
        bizLogMap.put("ZT","LOG_ZT");
        bizLogMap.put("EDITID","EDITOR_ID");
        bizLogMap.putAll(fildMap);
        tableFileMap.put("SYS_BIZ_LOG",bizLogMap);

        //字典类型表SYS_DICT_ITEM  ess5
        HashMap<String, Object> dictItemMap = new HashMap() ;
        dictItemMap.put("ID","DI_ID");
        dictItemMap.put("PID","DT_ID");
        dictItemMap.put("KEY","DI_KEY");
        dictItemMap.put("VALUE","DI_VALUE");
        dictItemMap.put("ZT","DI_ZT");
        dictItemMap.putAll(fildMap);
        tableFileMap.put("SYS_DICT_ITEM",dictItemMap);

        //组织PT_ORG   ess6
        HashMap<String, Object> orgMap = new HashMap() ;
        orgMap.put("ID","ORG_ID");
        orgMap.put("CODE","ORG_CODE");
        orgMap.put("NAME","ORG_NAME");
        orgMap.put("PID","ORG_PID");
        orgMap.put("TYPE","ORG_TYPE");
        orgMap.put("SBKT","ORG_SBKT");
        orgMap.put("BSLX","ORG_BSLX");
        orgMap.put("DLWZ","ORG_DLWZ");
        orgMap.put("ZT","ORG_ZT");
        orgMap.put("XDDM","ORG_XDDM");
        orgMap.put("BJZT","ORG_BJZT");
        orgMap.put("JWTYPE","ORG_JWTYPE");
        tableFileMap.put("PT_ORG",orgMap);

        //系统参数SYS_CONFIG   ess7
        HashMap<String, Object> configMap = new HashMap() ;
        configMap.put("ID","CONFIG_ID");
        configMap.put("NAME","CONFIG_NAME");
        configMap.put("TYPE","CONFIG_TYPE");
        configMap.put("KEY","CONFIG_KEY");
        configMap.put("VALUE","CONFIG_VALUE");
        configMap.put("ORG_ID","BELONG_ORG_ID");
        configMap.put("ZT","CONFIG_ZT");
        configMap.putAll(fildMap);
        tableFileMap.put("SYS_CONFIG",configMap);

        //部门表SYS_DEPT   ess8
        HashMap<String, Object> deptMap = new HashMap() ;
        deptMap.put("ID","DEPT_ID");
        deptMap.put("NAME","DEPT_NAME");
        deptMap.put("PID","DEPT_PID");
        deptMap.put("ZT","DEPT_ZT");
        deptMap.put("ZZ","DEPT_ZZ");
        deptMap.put("FZR","DEPT_FZR");
        deptMap.putAll(fildMap);
        tableFileMap.put("SYS_DEPT",deptMap);

        //学段管理SYS_XDGL   ess9
        HashMap<String, Object> xdglMap = new HashMap() ;
        xdglMap.put("ID","XDGL_ID");
        xdglMap.put("MC","XDGL_MC");
        xdglMap.put("XNS","XDGL_XNS");
        xdglMap.put("JC","XDGL_JC");
        xdglMap.put("SFKY","XDGL_SFKY");
        xdglMap.put("DM","XDGL_DM");
        xdglMap.put("RXNL","XDGL_RXNL");
        xdglMap.put("ZT","XDGL_ZT");
        xdglMap.putAll(fildMap);
        tableFileMap.put("SYS_XDGL",xdglMap);

        //学年度管理SYS_XNDGL   ess10
        HashMap<String, Object> xndglMap = new HashMap() ;
        xndglMap.put("ID","XNDGL_ID");
        xndglMap.put("DM","XNDGL_DM");
        xndglMap.put("MC","XNDGL_MC");
        xndglMap.put("KSSJ","XNDGL_KSSJ");
        xndglMap.put("JSSJ","XNDGL_JSSJ");
        xndglMap.put("SFDQXND","XNDGL_SFDQXND");
        xndglMap.put("SFJS","XNDGL_SFJS");
        xndglMap.put("ZT","XNDGL_ZT");
        xndglMap.putAll(fildMap);
        tableFileMap.put("SYS_XNDGL",xndglMap);

        //学期管理SYS_XQGL   ess11
        HashMap<String, Object> xqglMap = new HashMap() ;
        xqglMap.put("ID","XQGL_ID");
        xqglMap.put("PID","XNDGL_ID");
        xqglMap.put("MC","XQGL_MC");
        xqglMap.put("XQM","XQGL_XQM");
        xqglMap.put("KSSJ","XQGL_KSSJ");
        xqglMap.put("JSSJ","XQGL_JSSJ");
        xqglMap.put("SFDQXQ","XQGL_SFDQXQ");
        xqglMap.put("SFJS","XQGL_SFJS");
        xqglMap.put("ZT","XQGL_ZT");
        xqglMap.putAll(fildMap);
        tableFileMap.put("SYS_XQGL",xqglMap);

        //届别管理SYS_JBGL   ess12
        HashMap<String, Object> jbglMap = new HashMap() ;
        jbglMap.put("ID","JBGL_ID");
        jbglMap.put("XDID","XDGL_ID");
        jbglMap.put("XQID","XQGL_ID");
        jbglMap.put("MC","JBGL_MC");
        jbglMap.put("BYNF","JBGL_BYNF");
        jbglMap.put("SFJS","JBGL_SFJS");
        jbglMap.put("ZT","JBGL_ZT");
        jbglMap.putAll(fildMap);
        tableFileMap.put("SYS_JBGL",jbglMap);

        //角色管理SYS_ROLE   ess13
        HashMap<String, Object> jsglMap = new HashMap() ;
        jsglMap.put("ID","ROLE_ID");
        jsglMap.put("NAME","ROLE_NAME");
        jsglMap.put("CODE","ROLE_CODE");
        jsglMap.put("ZT","ROLE_ZT");
        jsglMap.put("TYPE","ROLE_TYPE");
        jsglMap.put("MEMO","ROLE_MEMO");
        jsglMap.put("ORG_ID","BELONG_ORG_ID");
        jsglMap.putAll(fildMap);
        tableFileMap.put("SYS_ROLE",jsglMap);

        //平台开通记录表PT_ORG_KTJL   ess15
        HashMap<String, Object> orgKtjlMap = new HashMap() ;
        orgKtjlMap.put("ID","KTJL_ID");
        orgKtjlMap.put("PID","ORG_ID");
        orgKtjlMap.put("TYPE","ORG_TYPE");
        orgKtjlMap.putAll(fildMap);
        tableFileMap.put("PT_ORG_KTJL",orgKtjlMap);

        //用户扩展表SYS_USEREXT    ess16
        HashMap<String, Object> userExtMap = new HashMap() ;
        userExtMap.put("ID","USEREXT_ID");
        userExtMap.put("USER_ID","USER_ID");
        userExtMap.put("CODE","USEREXT_CODE");
        userExtMap.put("SESSION","USEREXT_SESSION");
        userExtMap.put("TOKEN","USEREXT_TOKEN");
        userExtMap.put("DLSJ","USEREXT_DLSJ");
        userExtMap.putAll(fildMap);
        tableFileMap.put("SYS_USEREXT",userExtMap);

        //组织扩展表PT_ORG_INFO   ess17
        HashMap<String, Object> orgExtMap = new HashMap() ;
        orgExtMap.put("ID","INFO_ID");
        orgExtMap.put("ORG_ID","ORG_ID");
        orgExtMap.put("DLSJ","ATTR_2");
        orgExtMap.putAll(fildMap);
        tableFileMap.put("PT_ORG_INFO",orgExtMap);

        //广告位PT_GGW   ess18
        HashMap<String, Object> ptGgwMap = new HashMap() ;
        ptGgwMap.put("ID","GGW_ID");
        ptGgwMap.put("CODE","GGW_CODE");
        ptGgwMap.put("MC","GGW_MC");
        ptGgwMap.put("HT","GGW_HT");
        ptGgwMap.put("WT","GGW_WT");
        ptGgwMap.put("BL","GGW_BL");
        ptGgwMap.put("ZT","GGW_ZT");
        ptGgwMap.put("ZP_SIZE","GGW_ZP_SIZE");
        ptGgwMap.put("ZT_MNUM","GGW_ZT_MNUM");
        ptGgwMap.putAll(fildMap);
        tableFileMap.put("PT_GGW",ptGgwMap);

        //广告内容PT_GGNR   ess19
        HashMap<String, Object> ptGgnrMap = new HashMap() ;
        ptGgnrMap.put("ID","GGNR_ID");
        ptGgnrMap.put("PID","GGW_ID");
        ptGgnrMap.put("MC","GGNR_MC");
        ptGgnrMap.put("BTIME","GGNR_BTIME");
        ptGgnrMap.put("ETIME","GGNR_ETIME");
        ptGgnrMap.put("FJ","GGNR_FJ");
        ptGgnrMap.put("ZT","GGNR_ZT");
        ptGgnrMap.putAll(fildMap);
        tableFileMap.put("PT_GGNR",ptGgnrMap);

        //智能设备参数配置表SMH_DEVICE   ess23
        HashMap<String, Object> zcsbDeviceMap = new HashMap() ;
        zcsbDeviceMap.put("ID","DEVICE_ID");
        zcsbDeviceMap.put("APCOS_URL","DEVICE_APCOS_URL");
        zcsbDeviceMap.put("APCOS_ID","DEVICE_APCOS_ID");
        zcsbDeviceMap.put("APCOS_KEY","DEVICE_APCOS_KEY");
        zcsbDeviceMap.put("CALL_BACK","DEVICE_APCOS_CALL_BACK");
        zcsbDeviceMap.put("APCOS_TOKEN","DEVICE_APCOS_TOKEN");
        zcsbDeviceMap.put("DGJ_JRS","DEVICE_DGJ_JRS");
        zcsbDeviceMap.put("DGJ_URL","DEVICE_DGJ_URL");
        zcsbDeviceMap.put("DGJ_ID","DEVICE_DGJ_ID");
        zcsbDeviceMap.put("DGJ_KEY","DEVICE_DGJ_KEY");
        zcsbDeviceMap.put("KFPT_URL","DEVICE_KFPT_URL");
        zcsbDeviceMap.put("KFPT_ID","DEVICE_KFPT_ID");
        zcsbDeviceMap.put("KFPT_KEY","DEVICE_KFPT_KEY");
        zcsbDeviceMap.put("ORG_ID","BELONG_ORG_ID");
        zcsbDeviceMap.putAll(fildMap);
        tableFileMap.put("SMH_DEVICE",zcsbDeviceMap);

        //设备账户表SMH_SETTING   ess24
        HashMap<String, Object> zcsbSettingMap = new HashMap() ;
        zcsbSettingMap.put("ID","SETTING_ID");
        zcsbSettingMap.put("ACCOUNT","SETTING_ACCOUNT");
        zcsbSettingMap.put("PWD","SETTING_PWD");
        zcsbSettingMap.put("SFKT","SETTING_SFKT");
        zcsbSettingMap.put("DYZT","SETTING_DYZT");
        zcsbSettingMap.put("NAME","CREATOR_NAME");
        zcsbSettingMap.put("TIME","CREATED_TIME");
        zcsbSettingMap.put("ORG_ID","BELONG_ORG_ID");
        zcsbSettingMap.putAll(fildMap);
        tableFileMap.put("SMH_SETTING",zcsbSettingMap);

        //设备类型SBZC_LX   ess25
        HashMap<String, Object> zcsbLxMap = new HashMap() ;
        zcsbLxMap.put("ID","LX_ID");
        zcsbLxMap.put("TYPE","LX_TYPE");
        zcsbLxMap.put("MLDM","LX_MLDM");
        zcsbLxMap.put("MLMC","LX_MLMC");
        zcsbLxMap.put("SFTY","LX_SFTY");
        zcsbLxMap.put("ORG_ID","BELONG_ORG_ID");
        zcsbLxMap.put("WEB_MODEL","TO_CHAR(LX_WEB_MODEL)");
        zcsbLxMap.put("APP_MODEL","TO_CHAR(LX_APP_MODEL)");
        zcsbLxMap.putAll(fildMap);
        tableFileMap.put("SBZC_LX",zcsbLxMap);

        //设备信息 ess27
        HashMap<String, Object> sbxxMap = new HashMap() ;
        sbxxMap.put("ID","SBXX_ID");
        sbxxMap.put("MC","SBXX_MC");
        sbxxMap.put("LB","SBXX_LB");
        sbxxMap.put("XLH","SBXX_XLH");
        sbxxMap.put("MAC","SBXX_MAC");
        sbxxMap.put("ZT","SBXX_ZT");
        sbxxMap.put("ACCOUNT","SBXX_ACCOUNT");
        sbxxMap.put("NAME","CREATOR_NAME");
        sbxxMap.put("TIME","CREATED_TIME");
        sbxxMap.put("ORG_ID","BELONG_ORG_ID");
        sbxxMap.putAll(fildMap);
        tableFileMap.put("SBZC_SBXX",sbxxMap);

        //设备日志SYS_BCCA_LOG   ess29
        HashMap<String, Object> bccaLogMap = new HashMap() ;
        bccaLogMap.put("ID","LOG_ID");
        bccaLogMap.put("TYPE","LOG_TYPE");
        bccaLogMap.put("CODE","LOG_CODE");
        bccaLogMap.put("ZT","LOG_ZT");
        bccaLogMap.put("KZLX","LOG_KZLX");
        bccaLogMap.put("CONT","LOG_CONT");
        bccaLogMap.put("CONT2","TO_CHAR(LOG_CONT)");
        bccaLogMap.putAll(fildMap);
        tableFileMap.put("SYS_BCCA_LOG",bccaLogMap);


        //员工档案PT_YGDA   ess30
        HashMap<String, Object> ygdaMap = new HashMap() ;
        ygdaMap.put("ID","YGDA_ID");
        ygdaMap.put("XM","YGDA_XM");
        ygdaMap.put("XB","YGDA_XB");
        ygdaMap.put("CSRQ","YGDA_CSRQ");
        ygdaMap.put("JG","YGDA_JG");
        ygdaMap.put("MZ","YGDA_MZ");
        ygdaMap.put("GJDQ","YGDA_GJDQ");
        ygdaMap.put("SFZHM","YGDA_SFZHM");
        ygdaMap.put("ZZMM","YGDA_ZZMM");
        ygdaMap.put("XX","YGDA_XX");
        ygdaMap.put("ZP","YGDA_ZP");
        ygdaMap.put("GH","YGDA_GH");
        ygdaMap.put("LXDH","YGDA_LXDH");
        ygdaMap.put("XL","YGDA_XL");
        ygdaMap.put("ZT","YGDA_ZT");
        ygdaMap.put("GZNY","YGDA_GZNY");
        ygdaMap.putAll(fildMap);
        tableFileMap.put("PT_YGDA",ygdaMap);

        //系统软件类型PT_XTRJLX   ess42
        HashMap<String, Object> xtrjlxMap = new HashMap() ;
        xtrjlxMap.put("ID","XTRJLX_ID");
        xtrjlxMap.put("NAME","XTRJLX_NAME");
        xtrjlxMap.put("YWMC","XTRJLX_YWMC");
        xtrjlxMap.put("LX","XTRJLX_LX");
        xtrjlxMap.put("FBZT","XTRJLX_FBZT");
        xtrjlxMap.put("FBSJ","XTRJLX_FBSJ");
        xtrjlxMap.put("LXSJ","XTRJLX_LXSJ");
        xtrjlxMap.put("XMCYR","XTRJLX_XMCYR");
        xtrjlxMap.put("FBCYR","XTRJLX_FBCYR");
        xtrjlxMap.put("XMZL","XTRJLX_XMZL");
        xtrjlxMap.put("LOGO","XTRJLX_LOGO");
        xtrjlxMap.putAll(fildMap);
        tableFileMap.put("PT_XTRJLX",xtrjlxMap);

        //平台版本维护PT_PTBBWH   ess43
        HashMap<String, Object> ptbbwhMap = new HashMap() ;
        ptbbwhMap.put("ID","PTBBWH_ID");
        ptbbwhMap.put("NAME","PTBBWH_NAME");
        ptbbwhMap.put("BBH","PTBBWH_BBH");
        ptbbwhMap.put("CY","PTBBWH_CY");
        ptbbwhMap.put("FBNR","PTBBWH_FBNR");
        ptbbwhMap.put("FBNR1","PTBBWH_FBNR");
        ptbbwhMap.put("RBR","PTBBWH_RBR");
        ptbbwhMap.put("FBSJ","PTBBWH_FBSJ");
        ptbbwhMap.put("FBZT","PTBBWH_FBZT");
        ptbbwhMap.put("SHR","PTBBWH_SHR");
        ptbbwhMap.put("SHSJ","PTBBWH_SHSJ");
        ptbbwhMap.put("SHZT","PTBBWH_SHZT");
        ptbbwhMap.put("FJ","PTBBWH_FJ");
        ptbbwhMap.put("EWM","PTBBWH_EWM");
        ptbbwhMap.putAll(fildMap);
        tableFileMap.put("PT_PTBBWH",ptbbwhMap);

        //便签管理JCBG_BQGL   ess47
        HashMap<String, Object> bqglMap = new HashMap() ;
        bqglMap.put("ID","BQGL_ID");
        bqglMap.put("BT","BQGL_BT");
        bqglMap.put("NR","BQGL_NR");
        bqglMap.put("TXFS","BQGL_TXFS");
        bqglMap.put("TXSJ","BQGL_TXSJ");
        bqglMap.put("ZT","BQGL_ZT");
        bqglMap.put("JG","BQGL_JG");
        bqglMap.putAll(fildMap);
        tableFileMap.put("JCBG_BQGL",bqglMap);

        //新闻通知JCBG_XWTZ   ess48
        HashMap<String, Object> xwtzMap = new HashMap() ;
        xwtzMap.put("ID","XWTZ_ID");
        xwtzMap.put("BT","XWTZ_BT");
        xwtzMap.put("NR","XWTZ_NR");
        xwtzMap.put("NR1","XWTZ_NR");
        xwtzMap.put("LX","XWTZ_LX");
        xwtzMap.put("TXFS","XWTZ_TXFS");
        xwtzMap.put("YWLX","XWTZ_YWLX");
        xwtzMap.put("YWID","XWTZ_YWID");
        xwtzMap.put("GBQT","XWTZ_GBQT");
        xwtzMap.put("JJCD","XWTZ_JJCD");
        xwtzMap.put("SXSJ","XWTZ_SXSJ");
        xwtzMap.put("XXLY","XWTZ_XXLY");
        xwtzMap.put("FJXX","XWTZ_FJXX");
        xwtzMap.put("FJXX1","XWTZ_FJXX");
        xwtzMap.put("ZT","XWTZ_ZT");
        xwtzMap.putAll(fildMap);
        tableFileMap.put("JCBG_XWTZ",xwtzMap);

        //分组信息JCBG_FZXX   ess49
        HashMap<String, Object> fzxxMap = new HashMap() ;
        fzxxMap.put("ID","FZXX_ID");
        fzxxMap.put("MC","FZXX_MC");
        fzxxMap.put("ZT","FZXX_ZT");
        fzxxMap.put("LX","FZXX_LX");
        fzxxMap.put("SFNZ","FZXX_SFNZ");
        fzxxMap.putAll(fildMap);
        tableFileMap.put("JCBG_FZXX",fzxxMap);

        //分组人员JCBG_FZRY   ess50
        HashMap<String, Object> fzryMap = new HashMap() ;
        fzryMap.put("ID","FZRY_ID");
        fzryMap.put("FZ_ID","FZXX_ID");
        fzryMap.put("USER_ID","USER_ID");
        fzryMap.put("XM","FZRY_XM");
        fzryMap.put("XB","FZRY_XB");
        fzryMap.put("LXDH","FZRY_LXDH");
        fzryMap.putAll(fildMap);
        tableFileMap.put("JCBG_FZRY",fzryMap);

        //意见箱JCBG_YJX   ess51
        HashMap<String, Object> yjxMap = new HashMap() ;
        yjxMap.put("ID","YJX_ID");
        yjxMap.put("YJLX","YJX_YJLX");
        yjxMap.put("BT","YJX_BT");
        yjxMap.put("NR","YJX_NR");
        yjxMap.put("NR1","YJX_NR");
        yjxMap.put("ZT","YJX_ZT");
        yjxMap.put("CLR","YJX_CLR");
        yjxMap.put("UTYPE","YJX_UTYPE");
        yjxMap.put("CLFS","YJX_CLFS");
        yjxMap.put("CLSJ","YJX_CLSJ");
        yjxMap.put("MYD","YJX_MYD");
        yjxMap.put("DLPF","YJX_DLPF");
        yjxMap.put("DLPY","YJX_DLPY");
        yjxMap.putAll(fildMap);
        tableFileMap.put("JCBG_YJX",yjxMap);

        //意见记录JCBG_YJJL   ess52
        HashMap<String, Object> yjjlMap = new HashMap() ;
        yjjlMap.put("YJX_ID","YJX_ID");
        yjjlMap.put("CLR","YJX_CLR");
        yjjlMap.put("CLFS","YJX_CLFS");
        yjjlMap.put("CLSJ","YJX_CLSJ");
        yjjlMap.putAll(fildMap);
        tableFileMap.put("JCBG_YJJL",yjjlMap);

        //自定义菜单 SYS_ZDYCD   ess53
        HashMap<String, Object> zdycdMap = new HashMap() ;
        zdycdMap.put("ID","ZDYCD_ID");
        zdycdMap.put("PID","ZDYCD_PID");
        zdycdMap.put("SSXM","ZDYCD_XM");
        zdycdMap.put("MC","ZDYCD_MC");
        zdycdMap.put("CODE","ZDYCD_CODE");
        zdycdMap.put("SXH","ZDYCD_SXH");
        zdycdMap.put("URL","ZDYCD_URL");
        zdycdMap.put("IMG","ZDYCD_IMG");
        zdycdMap.putAll(fildMap);
        tableFileMap.put("SYS_ZDYCD",zdycdMap);

        //自定义菜单组织关联表 SYS_ZDYCD_ORG   ess54
        HashMap<String, Object> zdycdglbMap = new HashMap() ;
        zdycdglbMap.put("ID","ZDYCD_ID");
        zdycdglbMap.put("ORG_ID","ORG_ID");
        zdycdglbMap.put("BBWH_ID","PTBBWH_ID");
        tableFileMap.put("SYS_ZDYCD_ORG",zdycdglbMap);

        //自定义菜单快捷菜单 SYS_ZDYCD_ORG   ess55
        HashMap<String, Object> zdykjcdMap = new HashMap() ;
        zdykjcdMap.put("ID","KJCD_ID");
        zdykjcdMap.put("ZDYCD_ID","ZDYCD_ID");
        zdykjcdMap.put("ZDYCD_XM","ZDYCD_XM");
        zdykjcdMap.put("USER_ID","USER_ID");
        zdykjcdMap.put("KJCD_TYPE","KJCD_TYPE");
        zdykjcdMap.putAll(fildMap);
        tableFileMap.put("SYS_ZDYCD_KJCD",zdykjcdMap);

        //帮助中心PT_BZZX   ess56
        HashMap<String, Object> bzzxMap = new HashMap() ;
        bzzxMap.put("ID","BZZX_ID");
        bzzxMap.put("BT","BZZX_BT");
        bzzxMap.put("XM","BZZX_XM");
        bzzxMap.put("CD","BZZX_CD");
        bzzxMap.put("NR","BZZX_NR");
        bzzxMap.putAll(fildMap);
        tableFileMap.put("PT_BZZX",bzzxMap);

        //菜单引导 PT_CDYD   ess57
        HashMap<String, Object> cdydMap = new HashMap() ;
        cdydMap.put("ID","CDYD_ID");
        cdydMap.put("XM","CDYD_XM");
        cdydMap.put("CD","CDYD_CD");
        cdydMap.put("CS","CDYD_CS");
        cdydMap.put("DS","CDYD_DS");
        cdydMap.put("TBXX","CDYD_TBXX");
        cdydMap.putAll(fildMap);
        tableFileMap.put("PT_CDYD",cdydMap);

        //积分规则 PT_JFGZ   ess58
        HashMap<String, Object> jfgzMap = new HashMap() ;
        jfgzMap.put("ID","JFGZ_ID");
        jfgzMap.put("MC","JFGZ_MC");
        jfgzMap.put("CODE","JFGZ_CODE");
        jfgzMap.put("JFGZFL","JFGZ_JFGZFL");
        jfgzMap.put("FZFL","JFGZ_FZFL");
        jfgzMap.put("FZ","JFGZ_FZ");
        jfgzMap.put("SFBZ","JFGZ_SFBZ");
        jfgzMap.put("ZT","JFGZ_ZT");
        jfgzMap.putAll(fildMap);
        tableFileMap.put("PT_JFGZ",jfgzMap);

        //积分等级设置 PT_JFDJSZ   ess59
        HashMap<String, Object> jfdjszMap = new HashMap() ;
        jfdjszMap.put("ID","JFDJSZ_ID");
        jfdjszMap.put("MC","JFDJSZ_MC");
        jfdjszMap.put("IMG","JFDJSZ_IMG");
        jfdjszMap.put("FZ","JFDJSZ_FZ");
        jfdjszMap.put("JB","JSDJSZ_JB");
        jfdjszMap.putAll(fildMap);
        tableFileMap.put("PT_JFDJSZ",jfdjszMap);
    }

    /**
     * http请求
     * */
    public static String client_bcca(String url, JSONObject obj, String account) throws Exception{
        System.out.println("url:"+url);
        System.out.println("account:"+account);
        System.out.println("obj:"+obj.toString());
        CloseableHttpClient client = HttpClients.createDefault();
        HttpPost post = new HttpPost(url);
        String respContent = null;
        StringEntity entity = new StringEntity(obj.toString(),"utf-8");//解决中文乱码问题
        entity.setContentEncoding("UTF-8");
        entity.setContentType("application/json");
        post.setEntity(entity);
        post.addHeader("owner",account);

        HttpResponse resp = client.execute(post);
        if(resp.getStatusLine().getStatusCode() == 200) {
            HttpEntity he = resp.getEntity();
            respContent = EntityUtils.toString(he,"UTF-8");
        }
        return respContent ;
    }

    //获取连接数据  大管家
    public static String httpRequestPostMethod(StringBuilder sb, String path, String params) {
        HttpURLConnection connection = null;
        BufferedReader br = null;
        try {
            URL url = new URL(path); // 把字符串转换为URL请求地址
            connection = (HttpURLConnection) url.openConnection();// 打开连接
            connection.setDoOutput(true);// 使用 URL 连接进行输出
            connection.setDoInput(true);// 使用 URL 连接进行输入
            connection.setUseCaches(false);// 忽略缓存
            connection.setRequestMethod("POST");// 设置URL请求方法
            connection.setInstanceFollowRedirects(true);
            connection.setRequestProperty("Content-Type",
                    "application/x-www-form-urlencoded");
            connection.connect();// 连接会话
            DataOutputStream out = new DataOutputStream(
                    connection.getOutputStream());
            String content = "$reqdata=" + params;
            System.out.println("content:"+content);
            out.write(content.getBytes("UTF-8"));
            out.flush();
            out.close();

            // 获取输入流
            br = new BufferedReader(new InputStreamReader(
                    connection.getInputStream(),"UTF-8"));
            out.flush();
            out.close();
            String line = null;

            while ((line = br.readLine()) != null) {// 循环读取流
                sb.append(line);
            }

            br.close();// 关闭流
            connection.disconnect();// 断开连接
            return sb.toString();
        } catch (Exception e) {
            if (br != null) {
                try {
                    br.close();
                } catch (IOException e1) {
                    e1.printStackTrace();
                }
            }
            if (connection != null) {
                connection.disconnect();
            }
            return null;
        }
    }

    /**
     * 获取key
     * */
    public static String[] getKey(Map<String,Object> map)throws Exception{
        String[] keys = null;
        if(map != null){
            keys = new String[map.size()];		//查询字段名数组
            Set<String> sset = map.keySet();	//获取字段名
            int i = 0;
            for (String os : sset) {
                keys[i++] = os;
            }
        }
        return keys;
    }

    /**
     * 获取session对象字符串
     * @param str
     * @return
     */
    public static String getSessionStr(String str){
        Object object = getRequest().getSession().getAttribute(str);
        String strs = null;
        if(object != null){
            strs = object.toString();
        }
        return strs;
    }

    //大写转小写  map
    public static Map<String, Object> transformUpperCase(Map<String, Object> map) {
        Map<String, Object> resultMap = new HashMap<>();
        if (map == null || map.isEmpty()) {
            return resultMap;
        }
        Set<String> keySet = map.keySet();
        for (String key : keySet) {
            String newKey = key.toLowerCase();
            resultMap.put(newKey, map.get(key));
        }
        return resultMap;
    }
    //大写转小写 listMap
    public static List<Map<String, Object>> transformListUpperCase(List<Map<String, Object>> listMap) {
        List<Map<String, Object>> listmap2 = new ArrayList<>();
        Map<String, Object> resultMap = null;
        if (listMap.size() > 0) {
            for(int i=0;i<listMap.size();i++){
                Set<String> keySet = listMap.get(i).keySet();
                resultMap = new HashMap<>();
                for (String key : keySet) {
                    String newKey = key.toLowerCase();
                    resultMap.put(newKey, listMap.get(i).get(key));
                }
                listmap2.add(resultMap);
            }
        }
        return listmap2;
    }



}
