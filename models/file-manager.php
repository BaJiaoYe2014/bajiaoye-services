<?php
// create directory and copy image to specified place
// createWorksImages('001','62', '1');
// require 'test.php';
// $a = json_decode($test);
// copyWorksImagesToTmp($a);
// completeCopyWorks('67', '1');

function copyWorksImagesToTmp($works) {
	// then copy them to /tmp/userId/ to use
	$userId = $works->userId;
	$tmpPath = 'tmp/'.$userId.'/';
	if(!file_exists($tmpPath)) {
		mkdir($tmpPath, 0777, true);
	}else{
		delete_directory($tmpPath); // make sure pure images, remove unused images
		mkdir($tmpPath, 0777, true);
	}
	$result = travelWorksImages($works);
	// print_r($result);
	foreach ($result as $item) {
		$arr = explode('/', $item);
		$last = count($arr)-1;
		$fileName = $arr[$last];
		copy($item, $tmpPath.'/'.$fileName);
	}
}

// from tmp to works dir.
function completeCopyWorks($worksId, $userId) {
	$from = 'tmp/'.$userId.'/';
	$dest = 'works/'.$worksId.'/images/';
	if(!file_exists($dest)) {
		mkdir($dest, 0777, true);
	}
	if(file_exists($from)) {
		copyDirFiles($from, $dest);
		delete_directory($from);
	}
}

function travelWorksImages($works) {
	//travel all works, get every image, video except works directory
	$ret = array();
	// print_r($works);

	// $works = (object) $works;
	foreach ($works as $key => $value) {
		if(getValidValues($key, $value)){//value is valid
			if(strrpos($value, "tmp/") === false  && strrpos($value, "works/") === false){
				$ret[] = $value;
			}
		}
	}
	// print_r($works);
	if($works->music) {
		foreach ($works->music as $key => $value) {
			if(getValidValues($key, $value)){//value is valid
				if(strrpos($value, "tmp/") === false  && strrpos($value, "works/") === false){
					$ret[] = $value;
				}
			}
		}
	}
	foreach ($works->pages as $item) {
		foreach ($item as $k => $v) {
			if(getValidValues($k, $v)){//value is valid
				if(strrpos($v, "tmp/") === false  && strrpos($v, "works/") === false){
					$ret[] = $v;
				}
			}
			if($k == 'animateImgs') {
				foreach ($v as $a) {
					foreach ($a as $key => $value) {
						if(getValidValues($key, $value)){//value is valid
							if(strrpos($value, "tmp/") === false  && strrpos($value, "works/") === false){
								$ret[] = $value;
							}
						}
					}
				}
			}
			if($k == 'imgList') {
				foreach ($v as $key => $value) {
					if(getValidValues($key+1, $value)){//value is valid
						if(strrpos($value, "tmp/") === false  && strrpos($value, "works/") === false){
							$ret[] = $value;
						}
					}
				}
			}
		}// for
	}
	return $ret;
}

function getValidValues($key, $value) {
	$ret = false;
	$exts = array('jpg','png','mp3','gif');
	if($key != 'imgName' && $key != 'imgTipName' && !is_array($value) && !is_object($value)) {
		$arr = explode('.', $value);
		if(count($arr) > 0) {
			$last = count($arr) - 1;
			if(in_array($arr[$last], $exts)) {
				$ret = true;
			}
		}// if
	}
	return $ret;
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