FROM mysql:8.0-bookworm

ENV MYSQL_ROOT_PASSWORD=mysql_password_root
ENV MYSQL_DATABASE=mysql_db
ENV MYSQL_USER=mysql_user
ENV MYSQL_PASSWORD=mysql_password

COPY scripts/* /docker-entrypoint-initdb.d/