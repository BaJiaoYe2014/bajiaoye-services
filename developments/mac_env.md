Mac OS X中配置Apache、PHP、MySQL

启动Apache
	Mac os 自带 Apache， 需要启动： sudo apachectl start

运行PHP
	在终端中运行“sudo vi /etc/apache2/httpd.conf”
	找到“#LoadModule php5_module libexec/apache2/libphp5.so”，把前面的#号去掉，保存（在命令行输入:w）并退出vi（在命令行输入:q）
	运行“sudo cp /etc/php.ini.default /etc/php.ini”，这样就可以通过php.ini来配置各种PHP功能了。
	运行“sudo apachectl restart”，重启Apache，这样PHP就可以用了。

安装MySQL
	参考：http://machiine.com/2013/how-to-setup-mysql-on-a-mac-with-osx-10-8-mamp-part-2/

配置Slim
	开启mod_rewrite功能：（“/index.php/foo” ==> “/foo” ）
		在终端中运行“sudo vi /etc/apache2/httpd.conf”
		在<Directory /var/www/>设置中，原定为AllowOverride None，意为不使用.htaccess文件，可修改为AllowOverride FileInfo，意为使用.htaccess中的相关设置。
		The .htaccess file in the directory structure which contains:

			RewriteEngine On
			RewriteCond %{REQUEST_FILENAME} !-f
			RewriteRule ^ index.php [QSA,L]



