# document-validator-back

## Docker compose
```docker-compose up```

## get database image
```docker pull luancaarvalho/my-mysql```

## docker run database
```docker run -it --rm --name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=mysqluser -e MYSQL_USER=mysqluser -e MYSQL_PASSWORD=mysql luancaarvalho/my-mysql```


## get backend image 
```docker pull luancaarvalho/document-validator```

## docker run backend
```docker run -p 8080:8080 --network host -e GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/document-validator-1e8cf051a5e8.json luancaarvalho/document-validator```

