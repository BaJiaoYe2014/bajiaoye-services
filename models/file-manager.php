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
		//delete_directory($tmpPath); // make sure pure images, remove unused images
		//mkdir($tmpPath, 0777, true);
	}
	$result = travelWorksImages($works);
	// print_r($result);
	foreach ($result as $item) {
		$arr = explode('/', $item);
		$last = count($arr)-1;
		$fileName = $arr[$last];
		if(strrpos($item, "styles/")===false) {
			copy($item, $tmpPath.$fileName);
		}else{
			$tmpArr = explode('_', $item);
			$l = count($tmpArr)-1;
			$name = $tmpArr[$l];
			$fromPath = '';
			for($i=0; $i<count($arr)-1; $i++) {
				$fromPath .= $arr[$i] . '/';
			}
			// echo $fromPath.$name.'to:'.$tmpPath.'/'.$fileName.'<br/>';
			if(file_exists($fromPath.$name)) {
				copy($fromPath.$name, $tmpPath.$fileName);
			}
		}
		
	}
}

// from tmp to works dir.
function completeCopyWorks($worksId, $userId, $obj, $url) {
	$from = 'tmp/'.$userId;
	$dest = 'works/'.$worksId.'/images';
	$destJs = 'works/'.$worksId.'/js';
	$destCss = 'works/'.$worksId.'/css';
	$cssPath = 'works/v1/css';
	$jsPath = 'works/v1/js';
	$imgPath = 'works/v1/images/icon';
	if(!file_exists($dest)) {
		mkdir($dest, 0777, true);
		mkdir($dest.'/icon', 0777, true);
	}
	if(file_exists($from)) {
		copyDirFiles($from, $dest);
		copyDirFiles($imgPath, $dest.'/icon');
		delete_directory($from);
	}
	// js dir
	if(!file_exists($destJs)) {
		mkdir($destJs, 0777, true);
	}
	if(file_exists($jsPath)) {
		copyDirFiles($jsPath, $destJs);
	}
	//css dir
	if(!file_exists($destCss)) {
		mkdir($destCss, 0777, true);
	}
	if(file_exists($cssPath)) {
		copyDirFiles($cssPath, $destCss);
	}
	// change index name to random name
	copy('works/v1/index.html', 'works/'.$worksId.'/'.$url.'.html');
	// update config.js
	updateConfigJs($obj, $worksId);

}

function updateConfigJs($obj, $worksId) {
	$jsonStr = json_encode($obj);
	$str = "var app=".$jsonStr;
	$fileName = 'works/'.$worksId.'/js/config.js';
	if(!file_exists($fileName)) {
		mkdir($fileName, 0777, true);
	}
	$fh = fopen($fileName, "w");
	fwrite($fh, $str);
	fclose($fh);
}

function travelWorksImages($works) {
	//travel all works, get every image, video except works directory
	$ret = array();
	// print_r($works);

	// $works = (object) $works;
	$worksId = $works->id;
	foreach ($works as $key => $value) {
		if(getValidValues($key, $value)){//value is valid
			if(strrpos($value, "tmp/") === false  && strrpos($value, "works/".$worksId) === false){
				$ret[] = $value;
			}
		}
	}
	// print_r($works);
	if(!empty($works->music)) {
		// print_r($works);
		foreach ($works->music as $key => $value) {
			if(getValidValues($key, $value)){//value is valid
				if(strrpos($value, "tmp/") === false  && strrpos($value, "works/".$worksId) === false){
					$ret[] = $value;
				}
			}
		}
	}
	foreach ($works->pages as $j=>$item) {
		foreach ($item as $k => $v) {
			if(getValidValues($k, $v)){//value is valid
				if(strrpos($v, "tmp/") === false  && strrpos($v, "works/".$worksId) === false && strrpos($v, "styles/") === false){
					$ret[] = $v;
				}
				if(strrpos($v, "styles/")>0) {
					$tmpArr = explode('/', $v);
					$l = count($tmpArr)-1;
					$name = $tmpArr[$l];
					$fromPath = '';
					for($i=0; $i<count($tmpArr)-1; $i++) {
						$fromPath .= $tmpArr[$i] . '/';
					}
					$ret[] = $fromPath.$item->type.'_'.$j.'_'.$name;
				}
			}
			if($k == 'animateImgs') {
				foreach ($v as $a) {
					foreach ($a as $key => $value) {
						if(getValidValues($key, $value)){//value is valid
							if(strrpos($value, "tmp/") === false  && strrpos($value, "works/".$worksId) === false && strrpos($value, "styles/") === false){
								$ret[] = $value;
							}
							if(strrpos($value, "styles/")>0) {
								$tmpArr = explode('/', $value);
								$l = count($tmpArr)-1;
								$name = $tmpArr[$l];
								$fromPath = '';
								for($i=0; $i<count($tmpArr)-1; $i++) {
									$fromPath .= $tmpArr[$i] . '/';
								}
								$ret[] = $fromPath.$item->type.'_'.$j.'_'.$name;
							}
						}
					}
				}
			}
			if($k == 'imgList') {
				foreach ($v as $key => $value) {
					if(getValidValues($key+1, $value)){//value is valid
						if(strrpos($value, "tmp/") === false  && strrpos($value, "works/".$worksId) === false){
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
			$exts = array('jpg','png','mp3','gif', 'js', 'css');
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

function removeDeletedImages($imgsArr) {
	foreach($imgsArr as $item) {
		if(file_exists($item)) {
			unlink($item);
		}
	}
}

?>