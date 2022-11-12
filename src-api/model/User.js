import DB from '#model/DB.js'

const PASSWORD_CLAUSE = "CONCAT('*', UPPER(SHA1(UNHEX(SHA1(?)))))";

export default class User{
  static checkPassword({username, password}, callback){
    return DB.pool.query(`SELECT id, username, CASE WHEN password = ${PASSWORD_CLAUSE} THEN 1 ELSE 0 END AS res FROM User WHERE username=?`,
        [password, username], callback);
  }

  
  static insert({username, password, fname, lname}, callback){
    let params = [username, password, fname, lname, username];
    return DB.pool.query(`INSERT INTO User (username, password, fname, lname) \
      SELECT ? AS username, ${PASSWORD_CLAUSE} AS password, ? AS fname, ? AS lname \
      WHERE NOT EXISTS (SELECT * FROM User WHERE username = ?);`,
        params, callback);
  }
  
  // TODO
  static update({uid, username, password, fname, lname}, callback){
    let params = [username, password, fname, lname, uid, username];
    return DB.pool.query(`UPDATE USER SET username=?, password=${PASSWORD_CLAUSE}, fname=?, lname=? \
      WHERE uid=? AND NOT EXISTS (SELECT * FROM User WHERE username = ?);`,
        params, callback);
  }
  
  
  static delete(uid, callback){
    return DB.pool.query('DELETE FROM User WHERE uid=?;', [uid], callback);
  }
}