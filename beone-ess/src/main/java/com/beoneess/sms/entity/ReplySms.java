package com.beoneess.sms.entity;

public class ReplySms {
	private String phone;// 手机号
	private String content;// 短信内容
	private String subcode;// 子号码
	private String delivertime;// 时间

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getSubcode() {
		return subcode;
	}

	public void setSubcode(String subcode) {
		this.subcode = subcode;
	}

	public String getDelivertime() {
		return delivertime;
	}

	public void setDelivertime(String delivertime) {
		this.delivertime = delivertime;
	}

}
