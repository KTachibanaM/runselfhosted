#!/bin/bash
# Script to configure a docker/docker-compose host for runselfhosted
set -e

# Update system
apt-get update -y
apt-get upgrade -y

###
# Docker-compose
###

# Clone the app
# TODO: replace git url
git clone https://github.com/DIYgod/RSSHub.git /root/app

# TODO: put docker compose into systemd
# TODO: docker compose path is configurable
# TODO: build image locally
# TODO: remove docker compose always restart
# docker-compose -f /root/app/docker-compose.yml up -d
# docker-compose -f /root/app/docker-compose.yml down

###
# Nginx
###

# Install Nginx
apt-get install -y nginx

# Start Nginx service and enable to start on boot
systemctl enable nginx
systemctl start nginx

# Create new 'vhost' directory for domain configuration
mkdir /etc/nginx/vhost.d

# Create a copy of original configuration files and import configuration
cp /etc/nginx/nginx.conf /etc/nginx/nginx.backup.conf
cat > /etc/nginx/nginx.conf <<- EOM
user www-data;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                      '\$status \$body_bytes_sent "\$http_referer" '
                      '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/vhost.d/*.conf;

    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  _;
        root         /usr/share/nginx/html;

        include /etc/nginx/default.d/*.conf;

        location / {
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

}
EOM

# Copy over the server block configuration
# TODO: replace server name
# TODO: replace port
cat > /etc/nginx/vhost.d/runselfhosted.conf <<- EOM
server {
        listen 80;
        listen [::]:80;

        server_name example.com;

        location / {
                proxy_pass http://localhost:1200;
                proxy_http_version 1.1;
                proxy_set_header Upgrade \$http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host \$host;
                proxy_cache_bypass \$http_upgrade;
        }
}
EOM

# Restart Nginx
systemctl restart nginx

# Unblock HTTP(s) on ufw
ufw allow 'Nginx Full'
