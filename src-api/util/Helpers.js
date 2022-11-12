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
		let strDate = `${date.getFullYear()}-${((date.getMonth()+1)+'').padStart(2, '0')}-${(date.getDate()+'').padStart(2, '0')}`;
	}

	static now(){
		return DateUtil.toString(new Date());
	}
}