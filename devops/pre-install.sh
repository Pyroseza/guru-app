#!/usr/bin/env bash

APP_USER=gluu

# Install docker
apt update -y
apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
apt update -y
apt install -y docker-ce

curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

chmod +x /usr/local/bin/docker-compose

adduser --disabled-password --gecos "" $APP_USER
usermod -aG sudo $APP_USER
usermod -aG docker $APP_USER
