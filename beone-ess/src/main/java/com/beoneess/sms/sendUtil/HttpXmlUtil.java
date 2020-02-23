package com.beoneess.sms.sendUtil;

import com.beoneess.sms.entity.SmsAccountInfo;
import com.beoneess.sms.entity.SmsResult;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;


/**
 * XML短信接口
 * @author Administrator
 * @date 2014-1-22
 */
public class HttpXmlUtil extends Basic{

	public static void main(String[] args) throws Exception{
		SmsAccountInfo zh = new SmsAccountInfo();
		zh.setJkzh_ac("dh20890");
		zh.setJkzh_pwd("jinxinol123!dx");
		SmsResult result =  send(zh, "18203096915","8975");
		if(result != null && result.getResultCode().equals(0)){
			System.out.println("1111111111");
		}else{
			System.out.println("222222222");
		}
	}

	/**
	 * 发送短信方法使用document 对象方法封装XML字符串
	 * @param zh
	 * @param phone 接收号码
	 * @param content 接收内容
	 * @return smsresult
	 */
	public static SmsResult send(SmsAccountInfo zh,String phone,String content)throws Exception {
		String posturl = url+"/http/sms/Submit";
		Map<String, String> params = new LinkedHashMap<String, String>();
		HttpXmlUtil docXml = new HttpXmlUtil();
		String userName = zh.getJkzh_ac();
		String pwdEncode = MD5Encode(zh.getJkzh_pwd());
		String sign = StringUtils.trimToEmpty(zh.getJkzh_csid());
		System.out.println(zh.getJkzh_csid());
		System.out.println(sign);
		String msgid = "";	//自定义msgid
		/**
		 * 子号码：String，可以为空。
		 * 例如：如果平台号码为“10650300”，子号码为“22”，则短信将以“1065030022”号码下发给手机用户(注：此功能需要通道支持)
		 */
		String subcode = "";
		String message = null;
//		message = "<?xml version='1.0' encoding='UTF-8'?><message>"
//			+ "<account>" + userName + "</account>" + "<password>"
//			+ pwdEncode + "</password>"
//			+ "<msgid></msgid><phones>" + phone + "</phones><content>"
//			+ content + "</content>"
//			+ "<sign>"+ sign +"</sign><subcode></subcode><sendtime></sendtime></message>";
		message = docXml.DocXml(userName, pwdEncode, msgid, phone,content, sign, subcode, sendtime);
		params.put("message", message);
		String resp = doPost(posturl, params);
		System.out.println("发送报告===" + resp);

		SmsResult smsresult = ParserXmlUtil.parserSendXml(resp);
		return smsresult;
	}

//	/**
//	 * 查询短信状态报告(接收人是否真正接收到短信)
//	 * @param zh
//	 * @param msgid 短信编号(发送短信的时候返回，唯一的)
//	 * @param phone 接收号码
//	 * @return smsresult
//	 */
//	@SuppressWarnings("unused")
//	public static SmsResult getReport(DxxtDxjkzh zh,String msgid,String phone)throws Exception {
//		String posturl = url+"/http/sms/Report";
//		String userName = zh.getAc();
//		String pwdEncode = MD5Encode(zh.getPwd());
//		String sign = StringUtils.trimToEmpty(zh.getCsid());
//		Map<String, String> params = new LinkedHashMap<String, String>();
//		String message = "<?xml version='1.0' encoding='UTF-8'?><message>"
//				+ "<account>" + userName + "</account>" + "<password>"
//				+ pwdEncode + "</password>"
//				+ "<msgid>"+msgid+"</msgid><phone>"+phone+"</phone></message>";
//		params.put("message", message);
//		String resp = doPost(posturl, params);
//		System.out.println("状态报告========="+resp);
//		SmsResult smsresult = ParserXmlUtil.parserReportXml(resp);
//		return smsresult;
//	}
//
//	/**
//	 * 查询账户余额和短信剩余条数
//	 * @param zh
//	 * @return smsresult
//	 */
//	@SuppressWarnings("unused")
//	public static SmsResult getBalance(SmsAccountInfo zh)throws Exception{
//		String posturl = url+"/http/sms/Balance";
//		Map<String, String> params = new LinkedHashMap<String, String>();
//		String userName = zh.getJkzh_ac();
//		String pwdEncode = MD5Encode(zh.getJkzh_pwd());
//		String message = "<?xml version='1.0' encoding='UTF-8'?><message><account>"
//				+ userName
//				+ "</account>"
//				+ "<password>"
//				+ pwdEncode
//				+ "</password></message>";
//		params.put("message", message);
//		String resp = doPost(posturl, params);
//		System.out.println("余额报告========"+resp);
//		SmsResult smsresult = ParserXmlUtil.parserBalanceXml(resp);
//		return smsresult;
//	}
//
//	/**
//	 * 获取上行短信。每次调用间隔需大于30秒
//	 * @param zh
//	 * @return smsresult
//	 */
//	@SuppressWarnings("unused")
//	public static SmsResult getReplySmss(SmsAccountInfo zh)throws Exception{
//		String posturl = url+"/http/sms/Deliver";
//		Map<String, String> params = new LinkedHashMap<String, String>();
//		String userName = zh.getJkzh_ac();
//		String pwdEncode = MD5Encode(zh.getJkzh_pwd());
//		String message = "<?xml version='1.0' encoding='UTF-8'?><message><account>"
//			+ userName
//			+ "</account>"
//			+ "<password>"
//			+ pwdEncode
//			+ "</password></message>";
//		params.put("message", message);
//		String resp = doPost(posturl, params);
//		System.out.println("短信回复报告========"+resp);
//		SmsResult smsresult = ParserXmlUtil.parserReplySmsXml(resp);
//		return smsresult;
//	}
//
	/**
	 * 执行一个HTTP POST请求，返回请求响应的HTML
	 *
	 * @param url
	 *            请求的URL地址
	 * @param params
	 *            请求的查询参数,可以为null
	 * @return 返回请求响应的HTML
	 */
	private static String doPost(String url, Map<String, String> params) {
		String response = null;
		HttpClient client = new HttpClient();
		PostMethod postMethod = new PostMethod(url);
		postMethod.getParams().setParameter(
				HttpMethodParams.HTTP_CONTENT_CHARSET, "utf-8");

		// 设置Post数据
		if (!params.isEmpty()) {
			int i = 0;
			NameValuePair[] data = new NameValuePair[params.size()];
			for (Entry<String, String> entry : params.entrySet()) {
				data[i] = new NameValuePair(entry.getKey(), entry.getValue());
				i++;
			}

			postMethod.setRequestBody(data);

		}
		try {
			client.executeMethod(postMethod);
			if (postMethod.getStatusCode() == HttpStatus.SC_OK) {
				response = postMethod.getResponseBodyAsString();
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			postMethod.releaseConnection();
		}
		return response;
	}
	/**
	 * 使用document 对象封装XML
	 * @param userName
	 * @param pwd
	 * @param
	 * @param phone
	 * @param contents
	 * @param sign
	 * @param subcode
	 * @param sendtime
	 * @return
	 */
	public  String DocXml(String userName,String pwd,String msgid,String  phone,String contents,String sign,String  subcode,String sendtime) {
		Document doc = DocumentHelper.createDocument();
		doc.setXMLEncoding("UTF-8");
		Element message = doc.addElement("message");
		Element account = message.addElement("account");
		account.setText(userName);
		Element password = message.addElement("password");
		password.setText(pwd);
		Element msgid1 = message.addElement("msgid");
		msgid1.setText(msgid);
		Element phones = message.addElement("phones");
		phones.setText(phone);
		Element content = message.addElement("content");
		content.setText(contents);
		Element sign1 = message.addElement("sign");
		sign1.setText(StringUtils.trimToEmpty(sign));
		Element subcode1 = message.addElement("subcode");
		subcode1.setText(subcode);
		Element sendtime1 = message.addElement("sendtime");
		sendtime1.setText(sendtime);
		return message.asXML();
		//System.out.println(message.asXML());

	}

	// MD5加密函数
	public static String MD5Encode(String sourceString) {
		String resultString = null;
		try {
			resultString = new String(sourceString);
			MessageDigest md = MessageDigest.getInstance("MD5");
			resultString = byte2hexString(md.digest(resultString.getBytes()));
		} catch (Exception ex) {
		}
		return resultString;
	}

	public static final String byte2hexString(byte[] bytes) {
		StringBuffer bf = new StringBuffer(bytes.length * 2);
		for (int i = 0; i < bytes.length; i++) {
			if ((bytes[i] & 0xff) < 0x10) {
				bf.append("0");
			}
			bf.append(Long.toString(bytes[i] & 0xff, 16));
		}
		return bf.toString();
	}




























}
