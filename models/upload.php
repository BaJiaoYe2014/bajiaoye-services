<?php

function filesUpload($userId) {
    //文件存储路径
    $file_path="tmp/".$userId.'/';
    if(!file_exists($file_path)) {
        mkdir($file_path, 0777, true);
    }
    //664权限为文件属主和属组用户可读和写，其他用户只读。
    // if(is_dir($file_path)!=TRUE) mkdir($file_path,0664) ;
    //定义允许上传的文件扩展名
    $ext_arr = array("gif", "jpg", "jpeg", "png", "bmp", "txt", "zip", "rar", "mp3");
    // print_r($_FILES);
    if (empty($_FILES) === false) {
        //判断检查
        $photo_up_size = $_FILES["file"]["size"];
        if($photo_up_size > (10*1024*1024)){
            exit("对不起，您上传的照片超过了10M。");
        }
        if($_FILES["file"]["error"] > 0){
            exit("文件上传发生错误：".$_FILES["file"]["error"]);
        }

        //获得文件扩展名
        $displayName = $_FILES["file"]["name"];
        $doubleName = explode(";", $displayName);
        $temp_arr = explode(".", $doubleName[0]);
        $temp_arr1 = explode(".", $doubleName[0]);
        $temp_arr2 = explode(".", $doubleName[1]);
        $file_ext = array_pop($temp_arr);
        $file_ext = trim($file_ext);
        $file_ext = strtolower($file_ext);
        //检查扩展名
        if (in_array($file_ext, $ext_arr) === false) {
            exit("上传文件扩展名是不允许的扩展名。");
        }
        //以时间戳重命名文件
        // $new_name = $_FILES["file"]["name"];
        $new_name = $temp_arr2[0].'.'.$temp_arr1[1];
        //将文件移动到存储目录下
        move_uploaded_file($_FILES["file"]["tmp_name"],"$file_path" . $new_name);
        //向数据表写入文件存储信息以便管理
        //*********** 代码略 ***********//
        echo "文件上传成功！";
        exit;
    } else {
        echo "无正确的文件上传";
    }

}
?>