# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

	# dependencies for spellchecker (APACHE)

	sudo apt-get install apache2

	sudo apt-get purge `dpkg -l | grep php| awk '{print $2}' |tr "\n" " "`
	sudo apt-get install software-properties-common
	sudo add-apt-repository ppa:ondrej/php
	sudo apt-get update
	sudo apt-get install php5.6

* Configuration

	rake spellchecker:install

	sudo ln -s webta/public/spellchecker /var/www/html
	sudo nano /etc/apache2/mods-enabled/dir.conf

	<IfModule mod_dir.c>
    	DirectoryIndex index.php index.html index.cgi index.pl index.xhtml index.htm
	</IfModule>

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
