FROM mongo:7.0.9-jammy

ENV MONGO_INITDB_ROOT_USERNAME=mongo_root 
ENV MONGO_INITDB_ROOT_PASSWORD=mongo_root_password 
ENV MONGO_INITDB_DATABASE=mongo_db
ENV MONGO_INITDB_USERNAME=mongo_user
ENV MONGO_INITDB_PASSWORD=mongo_password

COPY scripts/* /docker-entrypoint-initdb.d/

