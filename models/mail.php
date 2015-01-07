<?php
function postmail_jiucool_com($to,$subject = "",$body = ""){
    //Author:Jiucool WebSite: http://www.jiucool.com 
    //$to 表示收件人地址 $subject 表示邮件标题 $body表示邮件正文
    //error_reporting(E_ALL);
    error_reporting(E_STRICT);
    date_default_timezone_set("Asia/Shanghai");//设定时区东八区
    require_once('mail/class.phpmailer.php');
    include("mail/class.smtp.php"); 
    $mail             = new PHPMailer(); //new一个PHPMailer对象出来
    $body             = eregi_replace("[\]",'',$body); //对邮件内容进行必要的过滤
    $mail->CharSet ="UTF-8";//设定邮件编码，默认ISO-8859-1，如果发中文此项必须设置，否则乱码
    $mail->IsSMTP(); // 设定使用SMTP服务
    $mail->SMTPDebug  = 1;                     // 启用SMTP调试功能
                                           // 1 = errors and messages
                                           // 2 = messages only
    $mail->SMTPAuth   = true;                  // 启用 SMTP 验证功能
    $mail->SMTPSecure = "ssl";                 // 安全协议
    $mail->Host       = "smtp.exmail.qq.com";      // SMTP 服务器
    $mail->Port       = 465;                   // SMTP服务器的端口号
    $mail->Username   = "info@bajiaoye.cn";  // SMTP服务器用户名
    $mail->Password   = "bajiaoye2015";            // SMTP服务器密码
    $mail->SetFrom('info@bajiaoye.cn', 'bajiaoye');
    $mail->AddReplyTo('info@bajiaoye.cn', 'bajiaoye');
    // $mail->Host       = "smtp.gmail.com";      // SMTP 服务器
    // $mail->Port       = 465;                   // SMTP服务器的端口号
    // $mail->Username   = "gaoruiai521@gmail.com";  // SMTP服务器用户名
    // $mail->Password   = "zhengyu19851012";            // SMTP服务器密码
    // $mail->SetFrom('gaoruiai521@gmail.com', 'bajiaoye');
    // $mail->AddReplyTo('gaoruiai521@gmail.com', 'bajiaoye');

    $mail->Subject    = $subject;
    $mail->AltBody    = "To view the message, please use an HTML compatible email viewer! - From www.jiucool.com"; // optional, comment out and test
    $mail->MsgHTML($body);
    $address = $to;
	
	$arr = explode("@", $to);
	$mail->AddAddress($to, $arr[0]);
    //$mail->AddAttachment("images/phpmailer.gif");      // attachment 
    if(!$mail->Send()) {
        // echo "Mailer Error: " . $mail->ErrorInfo;
		return false;
    } else {
        // echo "Message sent!恭喜，邮件发送成功！";
		return true;
        }
    }
/**
 *
 */
function getBody($newPass) {
    $body = "你的新密码是：".$newPass.", 请尽快修改后，并妥善保存！";
    return $body;
}

function sendEmail($to, $newPass) {
    $body = getBody($newPass);
    $ret = postmail_jiucool_com($to,"找回密码－芭蕉叶",$body);
    // $ret = postmail_jiucool_com($to,"xxx","qqq");
    return $ret;
}

?>