CREATE ROLE postgres WITH LOGIN PASSWORD '123456';
ALTER ROLE postgres SUPERUSER;
CREATE DATABASE wechat OWNER postgres;