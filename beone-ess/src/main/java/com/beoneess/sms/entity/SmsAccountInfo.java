package com.beoneess.sms.entity;

public class SmsAccountInfo {
	/**
	 * DxxtYhdxpe
	 */
	private String yhdxpe_id;//用户短信配额id
	private Integer yhpe_dxts;//短信条数：默认0条
	private String yhpe_sfkt;//是否开通：SFBZ
	
	/**
	 * DxxtDwdxzh
	 */
	private String dwdxzh_id;//单位短信账户id
	private String dwpe_attr_1;//短信发送单位标识：如“【金鑫智慧】”
	private Integer dwpe_dqdxed;//当前短信额度(条)：默认0条，指单位账户当前剩余条数，不可欠费，批量发的话，要求批量条数小于剩余量
	
	/**
	 * DxxtDxjkzh
	 */
	private String dxjkzh_id;//短信接口账户id
	private Integer jkzh_yyyets;//应有余额条数：自行扣减记录的值
	private String jkzh_zhzt;//账户状态：平台级数据字典dxjkzhzt，1正常，2不正常（密码错误，被封，余额不足等），3停用（废弃）
	private String jkzh_attr_2;//短信显示号码：用该短信接口账户给用户发送短信，显示在用户那边的发件号码
	private String jkzh_ac;//登录账户
	private String jkzh_pwd;//登录密码
	private String jkzh_csid;
	
	public String getYhpe_sfkt() {
		return yhpe_sfkt;
	}
	public void setYhpe_sfkt(String yhpe_sfkt) {
		this.yhpe_sfkt = yhpe_sfkt;
	}
	public String getJkzh_ac() {
		return jkzh_ac;
	}
	public void setJkzh_ac(String jkzh_ac) {
		this.jkzh_ac = jkzh_ac;
	}
	public String getJkzh_pwd() {
		return jkzh_pwd;
	}
	public void setJkzh_pwd(String jkzh_pwd) {
		this.jkzh_pwd = jkzh_pwd;
	}
	public String getJkzh_csid() {
		return jkzh_csid;
	}
	public void setJkzh_csid(String jkzh_csid) {
		this.jkzh_csid = jkzh_csid;
	}
	public String getDxjkzh_id() {
		return dxjkzh_id;
	}
	public void setDxjkzh_id(String dxjkzh_id) {
		this.dxjkzh_id = dxjkzh_id;
	}
	public Integer getJkzh_yyyets() {
		return jkzh_yyyets;
	}
	public void setJkzh_yyyets(Integer jkzh_yyyets) {
		this.jkzh_yyyets = jkzh_yyyets;
	}
	public String getJkzh_zhzt() {
		return jkzh_zhzt;
	}
	public void setJkzh_zhzt(String jkzh_zhzt) {
		this.jkzh_zhzt = jkzh_zhzt;
	}
	public String getJkzh_attr_2() {
		return jkzh_attr_2;
	}
	public void setJkzh_attr_2(String jkzh_attr_2) {
		this.jkzh_attr_2 = jkzh_attr_2;
	}
	public String getYhdxpe_id() {
		return yhdxpe_id;
	}
	public void setYhdxpe_id(String yhdxpe_id) {
		this.yhdxpe_id = yhdxpe_id;
	}
	public Integer getYhpe_dxts() {
		return yhpe_dxts;
	}
	public void setYhpe_dxts(Integer yhpe_dxts) {
		this.yhpe_dxts = yhpe_dxts;
	}
	public String getDwdxzh_id() {
		return dwdxzh_id;
	}
	public void setDwdxzh_id(String dwdxzh_id) {
		this.dwdxzh_id = dwdxzh_id;
	}
	public String getDwpe_attr_1() {
		return dwpe_attr_1;
	}
	public void setDwpe_attr_1(String dwpe_attr_1) {
		this.dwpe_attr_1 = dwpe_attr_1;
	}
	public Integer getDwpe_dqdxed() {
		return dwpe_dqdxed;
	}
	public void setDwpe_dqdxed(Integer dwpe_dqdxed) {
		this.dwpe_dqdxed = dwpe_dqdxed;
	}

	
}
