@echo off

docker rmi web1
docker load -i ./images/web1-image.tar.gz

docker rmi web2
docker load -i ./images/web2-image.tar.gz