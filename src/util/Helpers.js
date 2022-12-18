/**
 * Project: ibad.one
 * Author: Josh Ibad
 *
 * Copyright © 2022 Josh Ibad, creator of ibad.one. All Rights Reserved.
 * 
 * Filename: /util/Helpers.js
 * Description: Miscellaneous helper functions available project wide
 */

export function isStr(obj) {
	return (typeof obj === 'string' || obj instanceof String);
}


export class DateUtil {
	static toString(date){
		date = new Date(date);
		let strDate = `${date.getUTCFullYear()}-${((date.getUTCMonth()+1)+'').padStart(2, '0')}-${(date.getUTCDate()+'').padStart(2, '0')}`;
		return strDate;
	}


	static now(){ return DateUtil.toString(new Date()); }


	static nowTime(){
		let now = new Date();
		return `${(now.getUTCHours()+'').padStart(2, '0')}:${(now.getUTCMinutes()+'').padStart(2, '0')}`
	}


	static addDate(interval, number, date, asString=true){
		if(isStr(date)){date = new Date(date);}
		switch(interval.toUpperCase()){
			default: {
				date = new Date(date.getTime() + number*24*60*60*1000);
				break;
			}
			case 'M': {
				let months = (date.getUTCFullYear()-1)*12 + date.getUTCMonth() + number;
				date.setUTCFullYear(months / 12, months % 12);
			}
			case 'Y': {
				date.setUTCFullYear(date.getUTCFullYear() + number);
			}
		}
		return (asString) ? DateUtil.toString(date) : date;
	}


	static startOfMonth(date, asString=true){
		if(isStr(date)){date = new Date(date);}
		date.setUTCDate(1);
		return (asString) ? DateUtil.toString(date) : date;
	}


	static endOfMonth(date, asString=true){
		if(isStr(date)){date = new Date(date);}
		date = DateUtil.addDate('M', 1, date, false);
		date.setUTCDate(0);
		return (asString) ? DateUtil.toString(date) : date;
	}
}