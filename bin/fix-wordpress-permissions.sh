#!/bin/bash

DIR=$1

chmod 755 $DIR;
find $DIR -type d -exec chmod 755 {} \;
find $DIR -type f -exec chmod 644 {} \;
chmod 600 $DIR/wp-config.php;
chown -R www-data:www-data $DIR;

echo "Wordpress permissions set for $DIR.";
