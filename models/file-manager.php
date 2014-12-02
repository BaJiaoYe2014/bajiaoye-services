<?php
// create directory and copy image to specified place
// createWorksImages('001','62', '1');
// 
function createWorksImages($tplId, $worksId, $userId) {
	// echo dirname(__file__);
	$destDir = 'works/'. $worksId.'/images/';
	if(!file_exists($destDir)) {
		mkdir($destDir, 0777, true);
	}
	$from = 'templates/tpls/'.$tplId.'/';
	copyDirFiles($from, $destDir);
	//
	$tmpPath = 'tmp/'.$userId.'/';
	if(file_exists($tmpPath)) {
		copyDirFiles($tmpPath, $destDir);
		delete_directory($tmpPath);
	}
}

function copyDirFiles($from, $dest) {
	if(is_dir($from) and is_readable($from)) {
		$handle = opendir($from);
		while(false !== ($fileName = readdir($handle))) {
			$fullName = $from.'/'.$fileName;
			if(!is_file($fullName)) continue;
			$exts = array('jpg','png','mp3','gif');
			$info = pathinfo($fullName);
			if(in_array($info['extension'], $exts)) {
				copy($fullName, $dest.'/'.$fileName);
			}
		}
		closedir($handle);
	}
}

function deleteUserWorksFiles($worksId) {
	$ret = false;
	$destDir = 'works/'. $worksId;
	$ret = delete_directory($destDir);
	return $ret;
}

function delete_directory($dirname) {
     if (is_dir($dirname))
       $dir_handle = opendir($dirname);
	 if (!$dir_handle)
	      return false;
	 while($file = readdir($dir_handle)) {
       if ($file != "." && $file != "..") {
            if (!is_dir($dirname."/".$file))
                 unlink($dirname."/".$file);
            else
                 delete_directory($dirname.'/'.$file);
       }
	 }
	 closedir($dir_handle);
	 rmdir($dirname);
	 return true;
}

?>