import DB from '#model/DB.js'
import { round } from '#util/Helpers.js'


export default class Entry{
  static get({uid, startDate, endDate}, callback){
    let params = [uid, startDate, endDate]
    return DB.pool.query('SELECT date, time, bp_systolic, bp_diastolic, glucose, pulse, weight, if_hrs, comments \
        FROM Entry WHERE uid=? AND date BETWEEN ? AND ? ORDER BY date, time;',
        params, (err, res, fields) => {
          if(res && !err){
            res = res.map((e,i)=>{
              e = JSON.parse(JSON.stringify(e));
              for(let k of Object.keys(e)){
                if(!e[k]) { e[k] = ''; }
              }
              e.date = (e.date?.length >= 10) ? e.date.substring(0,10) : '';
              e.time = (e.time?.length >= 5) ? e.time.substring(0,5) : '';
              return e;
            })
          }
          callback(err, res, fields);
        });
  }
  

  static insert({uid, date, time, bp_systolic, bp_diastolic, glucose, pulse, weight, if_hrs, comments}, callback){
    weight = (weight) ? round(weight) : null;
    let params = [uid, date, time, bp_systolic || null, bp_diastolic || null, glucose || null, pulse || null, weight || null, if_hrs || null, comments];
    return DB.pool.query('INSERT INTO Entry (uid, date, time, bp_systolic, bp_diastolic, glucose, pulse, weight, if_hrs, comments) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        params, callback);
  }
  
  
  static update({uid, date, time, bp_systolic, bp_diastolic, glucose, pulse, weight, if_hrs, comments, orig_date, orig_time}, callback){
    weight = (weight) ? round(weight) : null;
    let params = [date, time, bp_systolic || null, bp_diastolic || null, glucose || null, pulse || null, weight || null, if_hrs || null, comments, uid, orig_date, orig_time];
    return DB.pool.query('UPDATE Entry SET date=?, time=?, bp_systolic=?, bp_diastolic=?, glucose=?, pulse=?, weight=?, if_hrs=?, comments=? \
      WHERE uid=? AND date=? AND time=?;',
        params, callback);
  }
  
  
  static delete({uid, date, time}, callback){
    return DB.pool.query('DELETE FROM Entry WHERE uid=? AND date=? AND time=?;',
        [uid, date, time], callback);
  }
}