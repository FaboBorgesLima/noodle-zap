CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL UNIQUE,
  password CHAR(44) NOT NULL,
  token CHAR(44) NOT NULL UNIQUE,
  PRIMARY KEY(id)
) ENGINE = InnoDB;