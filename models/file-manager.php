<?php
// create directory and copy image to specified place

// 
function createWorksImages($works, $worksId) {
	// echo dirname(__file__);
	$works = (object) $works;
	// print_r($works);
	$destDir = 'works/'. $worksId.'/';
	if(!file_exists($destDir)) {
		mkdir($destDir);
	}
	if(strpos($works->thumb,'template') !== 0) {
		$arr = explode("/", $works->thumb);
		$len = count($arr)-1;
		copy($works->thumb, $destDir.$arr[$len]);
	}
	foreach($works->pages as $item) {
		if($item["animateImgs"]) {
			foreach($item["animateImgs"] as $ele) {
				if($ele["src"] && strpos($ele["src"],'template') !== 0) {
					$arr = explode("/", $ele["src"]);
					$len = count($arr)-1;
					$from = $ele["src"];
					$dest = $destDir.$arr[$len];
					copy($from, $dest);
				}
			}// foreach
		}
		// print_r($item);
	}// foreach
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