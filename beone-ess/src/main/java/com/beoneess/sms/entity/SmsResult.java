package com.beoneess.sms.entity;

import java.util.List;


public class SmsResult {
	private Integer resultCode;//操作结果  
	private String  resultMsg;//结果说明
	private String  msgid;//短信发送后返回的唯一编码
	private String balance;//账户余额
	private Integer status;//短信状态； 0——成功， 1——失败 2——不确定 针对查询短信状态
    private String wgcode;//网关返回原始值
	private String time;//状态接收时间
	private String phones;//接收号码
	
	private String amount;//短信剩余金额
	private String number;//短信剩余数量
	private String freeze;//短信冻结金额，保留3位小数，单位元
	
	private String caiAmount;//彩信剩余金额
	private String caiNumber;//彩信剩余数量
	private String caiFreeze;//彩信冻结金额，保留3位小数，单位元
	
	private List<String> blacklist;//黑名单号码
	private List<ReplySms> replySmss;//收到的回复的短信
	
	private String desc;//状态结果说明
	private Integer bus_id;//业务id
	
	public List<ReplySms> getReplySmss() {
		return replySmss;
	}
	public void setReplySmss(List<ReplySms> replySmss) {
		this.replySmss = replySmss;
	}
	public Integer getBus_id() {
		return bus_id;
	}
	public void setBus_id(Integer bus_id) {
		this.bus_id = bus_id;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getPhones() {
		return phones;
	}
	public void setPhones(String phones) {
		this.phones = phones;
	}
	public List<String> getBlacklist() {
		return blacklist;
	}
	public void setBlacklist(List<String> blacklist) {
		this.blacklist = blacklist;
	}
	public Integer getResultCode() {
		return resultCode;
	}
	public void setResultCode(Integer resultCode) {
		this.resultCode = resultCode;
	}
	public String getResultMsg() {
		return resultMsg;
	}
	public void setResultMsg(String resultMsg) {
		this.resultMsg = resultMsg;
	}
	public String getMsgid() {
		return msgid;
	}
	public void setMsgid(String msgid) {
		this.msgid = msgid;
	}
	public String getBalance() {
		return balance;
	}
	public void setBalance(String balance) {
		this.balance = balance;
	}
	public Integer getStatus() {
		return status;
	}
	public void setStatus(Integer status) {
		this.status = status;
	}
	public String getWgcode() {
		return wgcode;
	}
	public void setWgcode(String wgcode) {
		this.wgcode = wgcode;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getAmount() {
		return amount;
	}
	public void setAmount(String amount) {
		this.amount = amount;
	}
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getFreeze() {
		return freeze;
	}
	public void setFreeze(String freeze) {
		this.freeze = freeze;
	}
	public String getCaiAmount() {
		return caiAmount;
	}
	public void setCaiAmount(String caiAmount) {
		this.caiAmount = caiAmount;
	}
	public String getCaiNumber() {
		return caiNumber;
	}
	public void setCaiNumber(String caiNumber) {
		this.caiNumber = caiNumber;
	}
	public String getCaiFreeze() {
		return caiFreeze;
	}
	public void setCaiFreeze(String caiFreeze) {
		this.caiFreeze = caiFreeze;
	}
	
	
	
	
	
	
	
	
	
}
