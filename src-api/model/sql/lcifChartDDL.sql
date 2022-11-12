CREATE TABLE IF NOT EXISTS User (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(256) NOT NULL,
  password VARCHAR(256) NOT NULL,
  fname VARCHAR(256),
  lname VARCHAR(256),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id) 
);

DROP TABLE IF EXISTS Entry;
CREATE TABLE IF NOT EXISTS Entry (
  uid INT NOT NULL REFERENCES User (id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  bp_systolic INT,
  bp_diastolic INT,
  pulse INT,
  glucose INT,
  if_hrs INT,
  comments VARCHAR (8192),

  PRIMARY KEY (uid, date, time)
)