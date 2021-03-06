# document-validator-back

## get bd image
docker pull luancaarvalho/my-mysql

## docker run bd
docker run -it --rm --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mysqluser -e MYSQL_USER=mysqluser -e MYSQL_PASSWORD=mysql luancaarvalho/my-mysql
