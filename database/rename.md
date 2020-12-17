```
CREATE DATABASE awesomebuilder;
USE awesomebuilder;
```
```
CREATE TABLE IF NOT EXISTS hostname (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now()
);
```