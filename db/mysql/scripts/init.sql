CREATE TABLE IF NOT EXISTS user (
  user_id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_name VARCHAR(255) NOT NULL,
  user_password CHAR(64) NOT NULL,
  token CHAR(64) NOT NULL,
  PRIMARY KEY(user_id)
);